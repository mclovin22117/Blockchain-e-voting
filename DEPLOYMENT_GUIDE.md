# Deployment Guide - Blockchain E-Voting

This guide will help you deploy the voting application so your entire classroom (or organization) can participate in elections.

## 📋 Deployment Overview

Your application has **three components** that need to be deployed:

1. **Smart Contract** → Sepolia Testnet (free blockchain)
2. **Backend API** → Render/Railway (free hosting)
3. **Frontend Website** → Vercel/Netlify (free hosting)

---

## 🚀 Quick Start: Deploy in 30 Minutes

### Prerequisites

- [ ] GitHub account (for code hosting)
- [ ] MetaMask wallet installed
- [ ] Pinata account (already configured)
- [ ] Vercel/Netlify account (free)
- [ ] Render/Railway account (free)

---

## Step 1: Deploy Smart Contract to Sepolia Testnet

### 1.1 Get Sepolia Testnet ETH (Free)

You need testnet ETH to deploy the contract:

1. Visit any Sepolia faucet:
   - https://sepoliafaucet.com/
   - https://www.infura.io/faucet/sepolia
   - https://faucets.chain.link/sepolia

2. Enter your MetaMask address
3. Wait for testnet ETH (usually 0.5 ETH in 1-2 minutes)

### 1.2 Get Infura/Alchemy RPC Endpoint

**Option A: Infura (Recommended)**
1. Go to https://infura.io/
2. Sign up (free)
3. Create new project
4. Copy your Sepolia endpoint:
   ```
   https://sepolia.infura.io/v3/YOUR_PROJECT_ID
   ```

**Option B: Alchemy**
1. Go to https://www.alchemy.com/
2. Sign up (free)
3. Create app → Select Sepolia
4. Copy HTTP endpoint

### 1.3 Configure Truffle for Sepolia

Create/update `truffle-config.js`:

```javascript
const HDWalletProvider = require('@truffle/hdwallet-provider');
require('dotenv').config();

module.exports = {
  networks: {
    // ... existing ganache config ...
    
    sepolia: {
      provider: () => new HDWalletProvider(
        process.env.MNEMONIC, // Your MetaMask seed phrase
        process.env.SEPOLIA_RPC_URL // Infura/Alchemy endpoint
      ),
      network_id: 11155111,
      gas: 4000000,
      gasPrice: 10000000000, // 10 gwei
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    }
  },
  compilers: {
    solc: {
      version: "0.8.19",
      settings: {
        optimizer: { enabled: true, runs: 200 }
      }
    }
  }
};
```

### 1.4 Install Required Packages

```bash
npm install --save-dev @truffle/hdwallet-provider
```

### 1.5 Create Root .env File

```bash
# In project root
MNEMONIC="your twelve word seed phrase from metamask"
SEPOLIA_RPC_URL="https://sepolia.infura.io/v3/YOUR_PROJECT_ID"
```

⚠️ **NEVER commit your MNEMONIC to GitHub!** (Already in .gitignore)

### 1.6 Deploy to Sepolia

```bash
truffle migrate --network sepolia
```

**Save the contract address!** You'll see output like:
```
Election: 0x1234567890abcdef...
```

---

## Step 2: Deploy Backend API

### Option A: Deploy to Render (Recommended)

1. **Push Code to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin deployment-prep
   ```

2. **Create Render Account**
   - Go to https://render.com/
   - Sign up with GitHub

3. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select `Blockchain-e-voting` repo
   - Branch: `deployment-prep`

4. **Configure Service**
   ```
   Name: voting-backend
   Region: Choose closest to you
   Branch: deployment-prep
   Root Directory: backend
   Runtime: Node
   Build Command: npm install
   Start Command: node index.js
   ```

5. **Add Environment Variables**
   Click "Environment" tab and add:
   ```
   PORT=3001
   NODE_ENV=production
   FRONTEND_URL=https://your-frontend-url.vercel.app
   PINATA_API_KEY=your_pinata_jwt_token
   CONTRACT_ADDRESS=0xYourSepoliaContractAddress
   ```

6. **Deploy**
   - Click "Create Web Service"
   - Wait 2-3 minutes for deployment
   - Copy your backend URL: `https://voting-backend-xyz.onrender.com`

### Option B: Deploy to Railway

1. Go to https://railway.app/
2. Sign in with GitHub
3. "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Add environment variables (same as above)
6. Deploy!

---

## Step 3: Deploy Frontend

### Option A: Deploy to Vercel (Fastest)

1. **Install Vercel CLI** (optional, or use web interface)
   ```bash
   npm install -g vercel
   ```

2. **Create frontend/.env**
   ```bash
   cd frontend
   cp .env.example .env
   ```

   Edit `.env`:
   ```
   VITE_BACKEND_URL=https://voting-backend-xyz.onrender.com
   VITE_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
   VITE_CONTRACT_ADDRESS=0xYourSepoliaContractAddress
   VITE_CHAIN_ID=11155111
   VITE_CHAIN_NAME=Sepolia Testnet
   ```

3. **Deploy via CLI**
   ```bash
   cd frontend
   vercel
   ```

   Or **Deploy via Web**:
   - Go to https://vercel.com/
   - "Add New" → "Project"
   - Import your GitHub repo
   - Root Directory: `frontend`
   - Framework Preset: Vite
   - Add environment variables from `.env`
   - Deploy!

4. **Copy Your Frontend URL**
   ```
   https://your-voting-app.vercel.app
   ```

5. **Update Backend Environment Variable**
   - Go back to Render dashboard
   - Update `FRONTEND_URL` with your Vercel URL
   - Redeploy backend

### Option B: Deploy to Netlify

1. Go to https://netlify.com/
2. "Add new site" → "Import from Git"
3. Select your repository
4. Build settings:
   ```
   Base directory: frontend
   Build command: npm run build
   Publish directory: frontend/dist
   ```
5. Add environment variables
6. Deploy!

---

## Step 4: Test Your Deployment

### 4.1 Admin Setup

1. Visit your frontend URL
2. Connect MetaMask (make sure you're on Sepolia network)
3. Your deployer address is automatically the admin
4. Add candidates
5. Set voting period

### 4.2 Student Setup

**Send this to your students:**

---

## 🎓 Student Instructions: How to Vote

### What You Need:
1. MetaMask browser extension
2. Sepolia testnet ETH (free)
3. Your wallet address

### Setup Steps:

1. **Install MetaMask**
   - Go to https://metamask.io/
   - Install browser extension
   - Create a wallet (save your seed phrase!)
   - Copy your address (starts with 0x...)

2. **Switch to Sepolia Network**
   - Open MetaMask
   - Click network dropdown → "Show test networks"
   - Select "Sepolia test network"

3. **Get Free Testnet ETH**
   - Visit https://sepoliafaucet.com/
   - Paste your address
   - Get 0.5 ETH (fake money, free!)

4. **Send Your Address to Admin**
   - Copy your MetaMask address
   - Send to teacher/admin
   - Wait for registration confirmation

5. **Vote!**
   - Visit: `https://your-voting-app.vercel.app`
   - Click "Connect MetaMask"
   - Approve connection
   - Vote for your candidate
   - Download your receipt!

---

## 🔧 Troubleshooting

### Frontend Can't Connect to Backend

**Symptom:** "Failed to fetch candidates" error

**Fix:**
1. Check backend is running: Visit `https://your-backend-url.com/candidates`
2. Verify CORS: Make sure backend `FRONTEND_URL` matches your frontend URL
3. Check browser console for errors

### MetaMask Shows Wrong Network

**Fix:**
1. Open MetaMask
2. Click network dropdown
3. Select "Sepolia test network"
4. If not showing, enable "Show test networks" in Settings

### Transaction Failing

**Symptoms:** "Insufficient funds" or "Gas estimation failed"

**Fixes:**
1. Make sure you have Sepolia ETH (get from faucet)
2. Make sure you're registered (admin must register your address)
3. Check voting period is active
4. Try increasing gas limit

### Contract Not Loading

**Fix:**
1. Verify `VITE_CONTRACT_ADDRESS` in frontend env vars
2. Check contract deployed successfully on Sepolia
3. View on Etherscan: `https://sepolia.etherscan.io/address/YOUR_CONTRACT_ADDRESS`

---

## 📊 Monitoring Your Deployment

### Check Backend Health

Visit: `https://your-backend-url.com/candidates`

Should return JSON list of candidates.

### Check Frontend Build

Visit: `https://your-frontend-url.com`

Should load the voting interface.

### Verify Contract on Etherscan

1. Go to https://sepolia.etherscan.io/
2. Search for your contract address
3. See all transactions and votes!

---

## 🎯 Quick Checklist

Before Election Day:

- [ ] Contract deployed to Sepolia
- [ ] Backend deployed and accessible
- [ ] Frontend deployed and loading
- [ ] CORS configured correctly
- [ ] All environment variables set
- [ ] Admin can add candidates
- [ ] Admin can set voting period
- [ ] Test vote works from different account
- [ ] IPFS receipts generating
- [ ] Students have MetaMask installed
- [ ] Students have Sepolia ETH
- [ ] All student addresses registered
- [ ] Voting period scheduled

---

## 💰 Cost Breakdown

Everything is **FREE**!

- ✅ Sepolia testnet: Free
- ✅ Testnet ETH: Free (from faucets)
- ✅ Infura/Alchemy: Free tier (100k requests/day)
- ✅ Render: Free tier
- ✅ Vercel: Free tier (hobby plan)
- ✅ Pinata: Free tier (1GB storage)
- ✅ GitHub: Free for public repos

**For production/mainnet:**
- Mainnet deployment: ~$50-200 (one-time gas fee)
- Mainnet votes: ~$5-20 per vote (gas fees)

---

## 🔐 Security Checklist

- [ ] `.env` files in `.gitignore`
- [ ] Never committed MNEMONIC or private keys
- [ ] `pinata_secrets.txt` in `.gitignore`
- [ ] Backend rate limiting enabled (100 req/15min)
- [ ] CORS only allows your frontend
- [ ] Contract pausable by admin (emergency stop)
- [ ] Owner cannot vote (prevents bias)

---

## 📞 Support

**Common Issues:**
- Check browser console (F12) for errors
- Check Render logs for backend errors
- Check Vercel deployment logs

**Verify Deployment:**
- Backend: `curl https://your-backend.com/candidates`
- Frontend: Open in browser and check console
- Contract: View on Sepolia Etherscan

---

## 🎉 You're Ready!

Your blockchain voting system is now deployed and accessible to unlimited users!

Students can vote from:
- Their phones (with MetaMask mobile)
- School computers
- Home
- Anywhere with internet!

**Share your frontend URL with the class and start voting!** 🗳️

---

## Next Steps

1. **Test everything** with 2-3 students first
2. **Schedule the voting period** for election day
3. **Share instructions** with all students
4. **Monitor** votes in real-time
5. **View results** after voting ends

Good luck with your election! 🚀
