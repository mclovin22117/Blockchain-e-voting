const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const Joi = require('joi');
require('dotenv').config();

const ipfsClient = require('./ipfs');
const fs = require('fs');
const path = require('path');

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration - supports multiple origins
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL
].filter(Boolean); // Remove undefined values

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(bodyParser.json({ limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// in-memory candidates (would be stored on IPFS in production)
let candidates = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' }
];

// in-memory voter map: address -> { cid, data }
const voters = {};
// simple OTP store for demo
const pendingOtps = new Map(); // key: vid or mobile, value: { otp, ts }

app.get('/candidates', (req, res) => {
  res.json(candidates);
});

// Store encrypted voter data to IPFS and return CID
app.post('/ipfs/upload', async (req, res) => {
  try {
    const data = req.body;
    if (!data || typeof data !== 'object') {
      return res.status(400).json({ error: 'Invalid data format' });
    }

    // Add metadata for better tracking
    const voteData = {
      ...data,
      timestamp: Date.now(),
      version: '1.0'
    };

    console.log('📝 Uploading vote to IPFS:', {
      candidateId: voteData.candidateId,
      timestamp: new Date(voteData.timestamp).toISOString()
    });

    const cid = await ipfsClient.add(JSON.stringify(voteData));
    
    console.log('✅ Vote stored on IPFS:', cid);
    res.json({ hash: cid });
  } catch (err) {
    console.error('❌ IPFS upload error:', err);
    res.status(500).json({ 
      error: 'IPFS upload failed',
      message: err.message 
    });
  }
});

// Expose contract ABI + address to frontend
app.get('/contract', (req, res) => {
  try {
    const artifactPath = path.resolve(__dirname, '..', 'build', 'contracts', 'Election.json');
    if (!fs.existsSync(artifactPath)) {
      return res.status(404).json({ error: 'contract artifact not found. Did you run truffle migrate?' });
    }
    const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
    const networks = artifact.networks || {};
    const keys = Object.keys(networks);
    if (!keys.length) return res.status(404).json({ error: 'no deployed address found in artifact' });
    // Choose the numerically highest network id (latest migration)
    const sorted = keys.map(k => ({ k, n: Number(k) || 0 })).sort((a, b) => a.n - b.n);
    const chosen = sorted[sorted.length - 1].k;
  const address = networks[chosen].address;
  const networkId = chosen;
    const allNetworkIds = keys;
    const addressesByNetwork = keys.reduce((acc, k) => { acc[k] = networks[k].address; return acc }, {});
    res.json({ address, abi: artifact.abi, networkId, allNetworkIds, addressesByNetwork });
  } catch (err) {
    console.error('contract endpoint error', err);
    res.status(500).json({ error: 'contract info error' });
  }
});

// Debug endpoint: show chosen and available network IDs without large ABI
app.get('/contract_debug', (req, res) => {
  try {
    const artifactPath = path.resolve(__dirname, '..', 'build', 'contracts', 'Election.json');
    if (!fs.existsSync(artifactPath)) {
      return res.status(404).json({ error: 'artifact not found' });
    }
    const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
    const networks = artifact.networks || {};
    const keys = Object.keys(networks);
    if (!keys.length) return res.status(404).json({ error: 'no networks' });
    const sorted = keys.map(k => ({ k, n: Number(k) || 0 })).sort((a, b) => a.n - b.n);
    const chosen = sorted[sorted.length - 1].k;
    res.json({ chosen, keys, address: networks[chosen].address });
  } catch (err) {
    res.status(500).json({ error: 'debug error', detail: String(err) });
  }
});

// Input validation schemas
const registerSchema = Joi.object({
  address: Joi.string().pattern(/^0x[a-fA-F0-9]{40}$/).required(),
  name: Joi.string().max(100).optional(),
  meta: Joi.object().optional()
});

// register a voter: stores the voter metadata on IPFS and keeps a mapping in-memory
app.post('/register', async (req, res) => {
  try {
    // Validate input
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { address, name, meta } = value;

    const payload = { address, name: name || null, meta: meta || null, ts: Date.now() };
    console.log('register payload:', payload);
    const cid = await ipfsClient.add(JSON.stringify(payload));
    console.log('ipfs cid:', cid);

    voters[address.toLowerCase()] = { cid, data: payload };
    res.json({ address, cid });
  } catch (err) {
    console.error('[ERROR] Register:', err.message);
    res.status(500).json({ error: 'register error' });
  }
});

app.get('/voter/:address', async (req, res) => {
  const addr = req.params.address.toLowerCase();
  const v = voters[addr];
  if (!v) return res.status(404).json({ error: 'not found' });
  res.json({ address: addr, cid: v.cid, data: v.data });
});

// --- Minimal OTP endpoints for demo completeness ---
app.post('/register/initOtp', async (req, res) => {
  try {
    const { name, mobile, vid } = req.body || {};
    // demo: always set 123456; in production generate random and send SMS
    const otp = '123456';
    const key = (vid || mobile || '').toString();
    if (!key) return res.status(400).json({ error: 'vid or mobile required' });
    pendingOtps.set(key, { otp, ts: Date.now(), name: name || null, mobile: mobile || null, vid: vid || null });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'initOtp failed' });
  }
});

app.post('/register/verifyOtp', async (req, res) => {
  try {
    const { vid, otp } = req.body || {};
    const rec = pendingOtps.get((vid || '').toString());
    if (!rec) return res.status(400).json({ error: 'otp session not found' });
    if (otp !== '123456') return res.status(400).json({ error: 'invalid otp' });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'verifyOtp failed' });
  }
});

app.post('/register/linkWallet', async (req, res) => {
  try {
    const { vid, address } = req.body || {};
    if (!address) return res.status(400).json({ error: 'address required' });
    const addr = address.toLowerCase();
    const rec = pendingOtps.get((vid || '').toString());
    const payload = { address: addr, vid: vid || null, name: rec?.name || null, mobile: rec?.mobile || null, ts: Date.now() };
    const cid = await ipfsClient.add(JSON.stringify(payload));
    voters[addr] = { cid, data: payload };
    res.json({ address: addr, cid });
  } catch (e) {
    console.error('linkWallet error', e);
    res.status(500).json({ error: 'linkWallet error' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✓ Backend listening on http://localhost:${PORT}`);
  console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
});
