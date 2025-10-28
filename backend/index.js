const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const ipfsClient = require('./ipfs');

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

app.listen(3001, () => {
  console.log('Backend listening on http://localhost:3001');
});
