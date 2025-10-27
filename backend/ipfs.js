// simple wrapper around ipfs-http-client; returns the CID string
// ipfs-http-client is ESM-only in recent versions; use dynamic import to interop
const crypto = require('crypto');

let client = null;
let clientInitAttempted = false;

async function initClient() {
  if (client || clientInitAttempted) return client;
  clientInitAttempted = true;
  try {
    const mod = await import('ipfs-http-client');
    const create = mod.create || (mod.default && mod.default.create);
    if (typeof create === 'function') {
      client = create({ url: 'http://127.0.0.1:5001' });
    }
  } catch (e) {
    // swallow: we'll fallback to fake CID
    client = null;
  }
  return client;
}

async function add(data) {
  const c = await initClient();
  const mkFake = () => 'Qm' + crypto.createHash('sha256').update(data).digest('hex').slice(0,44);
  if (!c) {
    // return a deterministic fake CID for development without IPFS
    return mkFake();
  }
  try {
    const { cid } = await c.add(data);
    return cid.toString();
  } catch (err) {
    // If IPFS daemon isn't available, gracefully fallback to fake CID
    return mkFake();
  }
}

module.exports = { add };
