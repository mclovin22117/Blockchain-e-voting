// Production IPFS using Pinata pinning service
// Provides reliable, permanent storage for vote data
const crypto = require('crypto');
const https = require('https');

// For production: use Pinata (https://pinata.cloud)
// For development: fallback to local IPFS or fake CIDs
const PINATA_JWT = process.env.PINATA_API_KEY;
const PINATA_API_KEY = process.env.PINATA_API_KEY_LEGACY; // For legacy API
const PINATA_SECRET_KEY = process.env.PINATA_SECRET_KEY_LEGACY; // For legacy API
const USE_PINATA = PINATA_JWT && PINATA_JWT.length > 20;

let localClient = null;
let clientInitAttempted = false;

// Initialize local IPFS client (for development)
async function initLocalClient() {
  if (localClient || clientInitAttempted) return localClient;
  clientInitAttempted = true;
  try {
    const mod = await import('ipfs-http-client');
    const create = mod.create || (mod.default && mod.default.create);
    if (typeof create === 'function') {
      localClient = create({ url: 'http://127.0.0.1:5001' });
    }
  } catch (e) {
    localClient = null;
  }
  return localClient;
}

// Upload to Pinata (production IPFS pinning service)
// Uses Pinata's LEGACY API (pinJSONToIPFS) which is more compatible
async function uploadToPinata(data) {
  return new Promise((resolve, reject) => {
    const jsonData = JSON.stringify({
      pinataContent: JSON.parse(data),
      pinataMetadata: {
        name: `vote-${Date.now()}.json`
      },
      pinataOptions: {
        cidVersion: 0
      }
    });

    // Try legacy API key/secret authentication if available
    const headers = {
      'Content-Type': 'application/json'
    };

    if (PINATA_API_KEY && PINATA_SECRET_KEY) {
      // Use old-style API key + secret
      console.log('Using legacy API key/secret authentication');
      headers['pinata_api_key'] = PINATA_API_KEY;
      headers['pinata_secret_api_key'] = PINATA_SECRET_KEY;
    } else {
      // Use JWT Bearer token
      console.log('Using JWT Bearer token authentication');
      headers['Authorization'] = `Bearer ${PINATA_JWT}`;
    }

    const options = {
      hostname: 'api.pinata.cloud',
      path: '/pinning/pinJSONToIPFS',
      method: 'POST',
      headers: headers
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => { responseData += chunk; });
      res.on('end', () => {
        console.log(`Pinata response status: ${res.statusCode}`);
        if (res.statusCode === 200) {
          try {
            const json = JSON.parse(responseData);
            console.log('Pinata response:', JSON.stringify(json, null, 2));
            resolve(json.IpfsHash);
          } catch (e) {
            reject(new Error(`Invalid Pinata response: ${responseData}`));
          }
        } else {
          reject(new Error(`Pinata error: ${res.statusCode} ${responseData}`));
        }
      });
    });

    req.on('error', (err) => {
      console.error('Pinata request error:', err);
      reject(err);
    });
    req.write(jsonData);
    req.end();
  });
}

// Main add function - tries production first, then fallbacks
async function add(data) {
  // 1. Try Pinata (production IPFS pinning service)
  if (USE_PINATA) {
    try {
      console.log('📌 Uploading to Pinata (production IPFS)...');
      const cid = await uploadToPinata(data);
      console.log('✓ Pinata upload successful:', cid);
      return cid;
    } catch (err) {
      console.error('❌ Pinata upload failed:', err.message);
      // Continue to fallback options
    }
  }

  // 2. Try local IPFS daemon (development)
  const client = await initLocalClient();
  if (client) {
    try {
      console.log('📦 Uploading to local IPFS daemon...');
      const { cid } = await client.add(data);
      console.log('✓ Local IPFS upload successful:', cid.toString());
      return cid.toString();
    } catch (err) {
      console.error('❌ Local IPFS failed:', err.message);
      // Continue to fake CID fallback
    }
  }

  // 3. Fallback: deterministic fake CID (development only - NOT for production!)
  console.warn('⚠️  Using fake CID - NOT suitable for production!');
  return 'Qm' + crypto.createHash('sha256').update(data).digest('hex').slice(0, 44);
}

// Retrieve from IPFS (for vote verification)
async function get(cid) {
  // Try Pinata gateway
  if (USE_PINATA) {
    try {
      const url = `https://gateway.pinata.cloud/ipfs/${cid}`;
      const response = await fetch(url);
      if (response.ok) {
        return await response.text();
      }
    } catch (err) {
      console.error('Pinata gateway error:', err.message);
    }
  }

  // Try local IPFS
  const client = await initLocalClient();
  if (client) {
    try {
      const chunks = [];
      for await (const chunk of client.cat(cid)) {
        chunks.push(chunk);
      }
      return Buffer.concat(chunks).toString('utf8');
    } catch (err) {
      console.error('Local IPFS cat error:', err.message);
    }
  }

  throw new Error('Unable to retrieve from IPFS');
}

module.exports = { add, get };
