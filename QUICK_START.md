# Quick Start: Deploy Your Voting App 🚀

## ⚡ 30-Minute Deployment

### Step 1: Deploy Smart Contract (10 mins)
```bash
# Get testnet ETH from: https://sepoliafaucet.com/
# Get Infura key from: https://infura.io/

# Add to root .env:
MNEMONIC="your metamask seed phrase"
SEPOLIA_RPC_URL="https://sepolia.infura.io/v3/YOUR_KEY"

# Deploy
npm install @truffle/hdwallet-provider
truffle migrate --network sepolia

# Save contract address!
```

### Step 2: Deploy Backend (10 mins)
```bash
# Push to GitHub
git push origin deployment-prep

# Go to: https://render.com/
# New Web Service → Connect GitHub
# Root: backend
# Add environment variables:
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://your-frontend.vercel.app
PINATA_API_KEY=your_jwt
CONTRACT_ADDRESS=0xYourSepoliaContract

# Deploy → Copy backend URL
```

### Step 3: Deploy Frontend (10 mins)
```bash
# Go to: https://vercel.com/
# Import GitHub repo
# Root: frontend
# Add environment variables:
VITE_BACKEND_URL=https://your-backend.onrender.com
VITE_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
VITE_CONTRACT_ADDRESS=0xYourSepoliaContract
VITE_CHAIN_ID=11155111
VITE_CHAIN_NAME=Sepolia Testnet

# Deploy → Copy frontend URL
```

### Step 4: Update Backend CORS
```bash
# In Render dashboard:
# Update FRONTEND_URL to your Vercel URL
# Redeploy
```

## ✅ Done! Share with Students

**Your App:** `https://your-app.vercel.app`

**Student Setup (5 mins):**
1. Install MetaMask
2. Switch to Sepolia network
3. Get testnet ETH: https://sepoliafaucet.com/
4. Send address to you for registration
5. Vote!

---

## 📋 Environment Variables Cheat Sheet

### Frontend (.env)
```bash
VITE_BACKEND_URL=https://your-backend.onrender.com
VITE_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
VITE_CONTRACT_ADDRESS=0xYourSepoliaContract
VITE_CHAIN_ID=11155111
VITE_CHAIN_NAME=Sepolia Testnet
```

### Backend (.env)
```bash
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://your-app.vercel.app
PINATA_API_KEY=your_pinata_jwt
CONTRACT_ADDRESS=0xYourSepoliaContract
```

### Root (.env) - For contract deployment
```bash
MNEMONIC="your metamask twelve word phrase"
SEPOLIA_RPC_URL="https://sepolia.infura.io/v3/YOUR_KEY"
```

---

## 🔗 Free Account Links

- **Testnet ETH:** https://sepoliafaucet.com/
- **Infura RPC:** https://infura.io/
- **Backend Host:** https://render.com/
- **Frontend Host:** https://vercel.com/
- **IPFS:** https://pinata.cloud/ (already set up)
- **Blockchain Explorer:** https://sepolia.etherscan.io/

---

## 🛠️ Troubleshooting Quick Fixes

**Backend not accessible:**
```bash
# Visit: https://your-backend.onrender.com/candidates
# Should return JSON
```

**Frontend won't load:**
- Check Vercel deployment logs
- Verify all VITE_ env vars are set
- Check browser console (F12)

**MetaMask errors:**
- Switch to Sepolia network
- Get testnet ETH from faucet
- Make sure address is registered

**Vote fails:**
- Check you're registered (admin must register your address)
- Check voting period is active
- Verify you have testnet ETH

---

## 📞 Need Help?

See **DEPLOYMENT_GUIDE.md** for detailed instructions and troubleshooting.

---

## 🎯 Before Election Day Checklist

- [ ] Contract deployed to Sepolia
- [ ] Backend live and accessible
- [ ] Frontend live and loading
- [ ] Test vote successful
- [ ] All students have MetaMask
- [ ] All students have testnet ETH
- [ ] All students registered
- [ ] Voting period scheduled
- [ ] Candidates added
- [ ] Instructions shared

**You're ready!** 🎉
