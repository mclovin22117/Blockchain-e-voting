const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const ipfsClient = require('./ipfs');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// in-memory candidates (would be stored on IPFS in production)
let candidates = [
  { id: 1, name: 'BJP' },
  { id: 2, name: 'Congress' }
];

// in-memory voter map: address -> { cid, data }
const voters = {};
// simple OTP store for demo
const pendingOtps = new Map(); // key: vid or mobile, value: { otp, ts }

app.get('/candidates', (req, res) => {
  res.json(candidates);
});

// stub: store encrypted voter data to IPFS and return hash
app.post('/ipfs/upload', async (req, res) => {
  try {
    const data = req.body;
    const hash = await ipfsClient.add(JSON.stringify(data));
    res.json({ hash });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'ipfs error' });
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

// register a voter: stores the voter metadata on IPFS and keeps a mapping in-memory
app.post('/register', async (req, res) => {
  try {
    const { address, name, meta } = req.body;
    if (!address) return res.status(400).json({ error: 'address required' });

  const payload = { address, name: name || null, meta: meta || null, ts: Date.now() };
  console.log('register payload:', payload);
  const cid = await ipfsClient.add(JSON.stringify(payload));
  console.log('ipfs cid:', cid);

  voters[address.toLowerCase()] = { cid, data: payload };
  res.json({ address, cid });
  } catch (err) {
    console.error(err);
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

app.listen(3001, () => {
  console.log('Backend listening on http://localhost:3001');
});
