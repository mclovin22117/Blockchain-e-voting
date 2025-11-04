# IPFS Setup for Production Voting System

## Overview
This voting system uses **IPFS (InterPlanetary File System)** to store encrypted vote data permanently and verifiably. For real-world use, we use **Pinata** - a production IPFS pinning service that ensures your data stays available forever.

## Why IPFS?
- ✅ **Permanent Storage**: Votes can't be deleted or modified
- ✅ **Decentralized**: No single point of failure
- ✅ **Verifiable**: Each vote gets a unique Content ID (CID)
- ✅ **Transparent**: Anyone can verify votes using the CID
- ✅ **Tamper-Proof**: Content addressing ensures data integrity

## Current Status

### ⚠️ Development Mode (Fallback)
Without Pinata keys, the system uses **fake CIDs** for development. This is NOT suitable for real users because:
- ❌ Votes aren't actually stored anywhere
- ❌ CIDs can't be verified on IPFS
- ❌ No permanent record exists

### ✅ Production Mode (Pinata)
With Pinata keys configured, votes are:
- ✅ Permanently stored on IPFS network
- ✅ Accessible via public IPFS gateways
- ✅ Verifiable by anyone with the CID
- ✅ Backed up across multiple nodes

---

## Setup Instructions for Real Users

### Step 1: Create Pinata Account (FREE)

1. Go to **https://pinata.cloud**
2. Sign up for a free account
3. Free tier includes:
   - 1 GB storage
   - Unlimited downloads
   - Perfect for testing and small elections

### Step 2: Generate API Keys

1. Log in to Pinata
2. Navigate to **API Keys** page: https://app.pinata.cloud/developers/api-keys
3. Click **"New Key"**
4. Configure permissions:
   - ✅ Enable `pinFileToIPFS` (required for uploads)
   - ✅ Enable `pinList` (optional - for listing your files)
   - ⚠️ Leave admin permissions disabled (security best practice)
5. Give it a name like `"Voting System Backend"`
6. Click **"Create Key"**
7. **IMPORTANT**: Copy both values immediately (they're only shown once):
   - `API Key`
   - `API Secret`

### Step 3: Configure Your Backend

1. Open `/home/babayaga/Documents/voting/backend/.env`
2. Add your Pinata credentials:
   ```env
   PINATA_API_KEY=your_api_key_here
   PINATA_SECRET=your_api_secret_here
   ```
3. Save the file

### Step 4: Restart Backend

```bash
cd /home/babayaga/Documents/voting/backend
npm start
```

You should see:
```
📌 Uploading to Pinata (production IPFS)...
✓ Pinata upload successful: QmXxx...
```

### Step 5: Verify It's Working

1. Cast a vote in the frontend
2. Check the vote receipt - you'll see a real IPFS CID
3. Verify your vote on IPFS:
   - Open: `https://gateway.pinata.cloud/ipfs/YOUR_CID`
   - Or: `https://ipfs.io/ipfs/YOUR_CID`
   - You should see the encrypted vote data

---

## How It Works

### Vote Storage Flow

```
1. User casts vote in frontend
   ↓
2. Frontend encrypts vote data
   ↓
3. Backend uploads to Pinata
   ↓
4. Pinata stores on IPFS network
   ↓
5. Returns Content ID (CID)
   ↓
6. CID stored on blockchain
   ↓
7. User gets receipt with CID
```

### Vote Verification Flow

```
1. User has vote receipt with CID
   ↓
2. Open IPFS gateway: ipfs.io/ipfs/{CID}
   ↓
3. See encrypted vote data
   ↓
4. Compare hash with blockchain
   ↓
5. Confirm vote integrity
```

---

## Three Storage Layers (Current Architecture)

### Layer 1: Blockchain (Smart Contract)
- **What**: Vote hashes, voter registration, candidate IDs
- **Where**: Ethereum blockchain (Ganache → Sepolia → Mainnet)
- **Purpose**: Immutable record, prevent double-voting
- **Access**: Public, via Web3.js

### Layer 2: IPFS (Pinata)
- **What**: Encrypted full vote data (JSON)
- **Where**: IPFS network, pinned by Pinata
- **Purpose**: Permanent storage, verifiable content
- **Access**: Public via CID on any IPFS gateway

### Layer 3: Browser localStorage
- **What**: UI state, last vote display
- **Where**: User's browser
- **Purpose**: Fast display, offline access
- **Access**: Local only, not permanent

---

## Testing the System

### Development Testing (No Pinata)
```bash
# System will use fake CIDs
# Good for: UI testing, smart contract testing
# Bad for: Real vote verification
```

### Staging Testing (With Pinata)
```bash
# Add Pinata keys to .env
# System uses real IPFS storage
# Good for: Full end-to-end testing
# Ready for: Real users
```

### Production Testing
```bash
# Use production Pinata account
# Monitor uploads in Pinata dashboard
# Verify CIDs on public gateways
# Check storage usage
```

---

## Cost Considerations

### Free Tier (Pinata)
- **Storage**: 1 GB
- **Bandwidth**: Unlimited
- **Files**: Unlimited
- **Perfect for**: Small to medium elections
- **Example**: 1 GB = ~200,000 votes (5 KB each)

### Paid Tiers (If Needed)
- **Picnic** ($20/month): 100 GB storage
- **Sailing** ($200/month): 1 TB storage
- **Custom**: For large-scale elections

### Cost per Vote
- Average vote data: ~5 KB (encrypted JSON)
- Free tier: 200,000+ votes FREE
- Paid tier: $0.0001 per vote (negligible)

---

## Security Best Practices

### ✅ DO:
- Keep API keys in `.env` file (never commit to git)
- Use different keys for development/production
- Enable only required permissions on API keys
- Monitor Pinata dashboard for unusual activity
- Rotate API keys periodically (every 6 months)
- Test with small data first

### ❌ DON'T:
- Share API keys publicly or in code
- Give admin permissions to API keys
- Upload unencrypted sensitive data
- Forget to restrict CORS on backend
- Ignore Pinata usage alerts

---

## Troubleshooting

### "Using fake CID - NOT suitable for production!"
**Cause**: Pinata keys not configured  
**Solution**: Add `PINATA_API_KEY` and `PINATA_SECRET` to `.env`

### "Pinata error: 401 Unauthorized"
**Cause**: Invalid API keys  
**Solution**: Regenerate keys in Pinata dashboard

### "Pinata error: 429 Too Many Requests"
**Cause**: Rate limit exceeded (free tier: 180 requests/min)  
**Solution**: Upgrade plan or implement request batching

### CID not accessible on ipfs.io gateway
**Cause**: Pinata needs time to propagate (usually <1 minute)  
**Solution**: Wait 30 seconds, try again, or use `gateway.pinata.cloud`

### Storage limit reached
**Cause**: Free tier 1 GB limit exceeded  
**Solution**: Upgrade plan or delete old pins

---

## Monitoring

### Pinata Dashboard
- **URL**: https://app.pinata.cloud
- **View**: All pinned files
- **Check**: Storage usage
- **Monitor**: API usage statistics

### Backend Logs
```bash
# Watch for IPFS uploads
cd /home/babayaga/Documents/voting/backend
npm start

# Look for:
📌 Uploading to Pinata (production IPFS)...
✓ Pinata upload successful: QmXxx...
```

### Vote Verification
```bash
# Verify any vote by CID
curl https://gateway.pinata.cloud/ipfs/QmYourCidHere
```

---

## Migration Path

### Current (Development)
- Local Ganache blockchain
- Fake IPFS CIDs
- Good for: Testing, development

### Next (Staging)
- Sepolia testnet blockchain
- **Real Pinata IPFS** ← **ADD THIS NOW**
- Good for: Final testing with real data

### Final (Production)
- Ethereum mainnet or L2
- Production Pinata account
- Good for: Real elections

---

## Alternative IPFS Services

If Pinata doesn't meet your needs:

### Web3.Storage
- **Free**: 1 TB storage
- **API**: Similar to Pinata
- **Pros**: More generous free tier
- **Cons**: Newer service, less mature

### Infura IPFS
- **Free**: 5 GB storage
- **API**: REST API
- **Pros**: Same company as Infura RPC
- **Cons**: More expensive scaling

### Self-Hosted IPFS Node
- **Free**: Unlimited (your hardware)
- **Setup**: `ipfs daemon` locally
- **Pros**: Full control, no costs
- **Cons**: Requires maintenance, uptime management

---

## Next Steps

1. ✅ **IMMEDIATE**: Sign up for Pinata and add API keys
2. ✅ **TODAY**: Test vote upload and verification
3. ✅ **THIS WEEK**: Deploy to Sepolia testnet with Pinata
4. ⏳ **BEFORE LAUNCH**: Monitor storage usage, test backup procedures
5. ⏳ **PRODUCTION**: Use dedicated Pinata account with monitoring

---

## Questions?

- **Pinata Docs**: https://docs.pinata.cloud
- **IPFS Docs**: https://docs.ipfs.tech
- **This Project**: Check `DEVELOPMENT_WORKFLOW.md` for daily workflow

**Remember**: Without real IPFS storage, your votes aren't truly verifiable or permanent. Set up Pinata before allowing real users to vote!
