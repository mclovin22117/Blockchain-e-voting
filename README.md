# Blockchain-based E-Voting System

A production-ready, secure blockchain-based e-voting system deployed on Ethereum Sepolia testnet. Features include admin-controlled elections, voter registration, encrypted vote storage on IPFS, and MetaMask integration.

## 🌐 Live Demo

- **Frontend**: https://voting-frontend-x6so.onrender.com/
- **Backend API**: https://blockchain-e-voting.onrender.com
- **Smart Contract**: `0xD08Bbdcb80496e4d53a0Ae769b535306Bb513716` (Sepolia)
- **Network**: Ethereum Sepolia Testnet

## 🏗️ Architecture

- `contracts/` - Solidity smart contract `Election.sol`
- `backend/` - Express.js API server with IPFS integration (Pinata)
- `frontend/` - React + Vite UI with MetaMask wallet connection
- `migrations/` - Contract deployment scripts
- `build/` - Compiled contract artifacts and ABIs

## ✨ Features

- 🔐 **Secure Voting**: Votes stored encrypted on IPFS, hash on blockchain
- 👤 **Admin Controls**: Add candidates, register voters, set voting periods
- 🔒 **One Vote Per Person**: Smart contract enforces single vote per address
- 📊 **Transparent Results**: Real-time vote tallying on blockchain
- 🌐 **MetaMask Integration**: Web3 wallet authentication
- ⏰ **Timed Elections**: Set start/end times for voting periods
- 🛡️ **Emergency Pause**: Admin can pause contract in emergencies

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 18+
- Ganache (for local blockchain)
- MetaMask browser extension
- Pinata account (for IPFS storage)

### Installation

```bash
# Clone repository
git clone https://github.com/reetik-rana/Blockchain-e-voting.git
cd Blockchain-e-voting

# Install dependencies
npm install
cd backend && npm install
cd ../frontend && npm install
cd ..

# Start Ganache on http://127.0.0.1:7545
./start-ganache.sh

# Deploy contract locally
npx truffle migrate --reset --network development

# Configure environment variables
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
# Edit .env files with your Pinata API key and local settings

# Run backend
cd backend && npm start

# Run frontend (in another terminal)
cd frontend && npm start
```

Visit `http://localhost:5173` and connect MetaMask (Ganache network).

## 🔧 Configuration

### MetaMask Setup (Local)
1. Install MetaMask: https://metamask.io/download/
2. Add Ganache network:
   - RPC URL: `http://127.0.0.1:7545`
   - Chain ID: `1337`
   - Currency: `ETH`
3. Import Ganache account using private key

### MetaMask Setup (Production - Sepolia)
1. Switch MetaMask to **Sepolia Test Network**
2. Get test ETH from faucet: https://cloud.google.com/application/web3/faucet/ethereum/sepolia
3. Visit https://voting-frontend-x6so.onrender.com/

### IPFS Storage (Pinata)
1. Sign up at https://pinata.cloud (FREE: 1GB storage)
2. Create API key: https://app.pinata.cloud/developers/api-keys
3. Add to `backend/.env`:
   ```
   PINATA_JWT=your_jwt_token_here
   ```

## 📦 Deployment

### Smart Contract (Remix IDE)
1. Open https://remix.ethereum.org/
2. Upload `contracts/Election.sol`
3. Compile with Solidity 0.8.20+
4. Deploy to Sepolia using MetaMask
5. Copy contract address and ABI

### Backend (Render)
1. Create account at https://render.com
2. New Web Service → Connect GitHub
3. Root Directory: `backend`
4. Build: `npm install --legacy-peer-deps`
5. Start: `node index.js`
6. Environment variables: `PINATA_JWT`, `CONTRACT_ADDRESS`, `FRONTEND_URL`

### Frontend (Render Static Site)
1. New Static Site → Connect GitHub  
2. Root Directory: `frontend`
3. Build: `npm install --legacy-peer-deps && npm run build`
4. Publish: `dist`
5. Environment: `VITE_CONTRACT_ADDRESS`, `VITE_BACKEND_URL`, `VITE_RPC_URL`, `VITE_CHAIN_ID`

## 🎯 Usage

### Admin (Contract Owner)
1. Connect wallet that deployed contract
2. Add candidates
3. Register voter addresses
4. Set voting period (start/end timestamps)
5. Monitor results in real-time

### Voters
1. Get registered by admin
2. Connect MetaMask wallet
3. Login to vote
4. Select candidate
5. Confirm transaction
6. View receipt with IPFS hash

## 📚 Documentation

- `DEPLOYMENT_GUIDE.md` - Complete deployment walkthrough
- `QUICK_START.md` - Fast setup reference
- `IPFS_SETUP.md` - IPFS/Pinata configuration
- `DEVELOPMENT_WORKFLOW.md` - Local development guide
- `DEPLOY_WITH_REMIX.md` - Remix IDE deployment guide

## 🛡️ Security Features

- ✅ OpenZeppelin contracts (Pausable, ReentrancyGuard)
- ✅ Voting periods with emergency pause
- ✅ Rate limiting (100 req/15min per IP)
- ✅ Input validation (Joi schemas)
- ✅ Helmet.js security headers
- ✅ CORS whitelist
- ✅ Address validation (prevent addresses as candidate names)
- ✅ One vote per address enforced on-chain

## 🔍 Contract Details

- **Network**: Ethereum Sepolia Testnet
- **Compiler**: Solidity ^0.8.20
- **Address**: `0xD08Bbdcb80496e4d53a0Ae769b535306Bb513716`
- **Verify**: https://sepolia.etherscan.io/address/0xD08Bbdcb80496e4d53a0Ae769b535306Bb513716

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

This project is for educational and research purposes.

## 🙏 Acknowledgments

- OpenZeppelin for secure smart contract libraries
- Pinata for IPFS storage infrastructure
- Render for hosting services
- MetaMask for Web3 wallet integration

---

**⚠️ Note**: This is deployed on Sepolia testnet. For production mainnet deployment, conduct thorough security audits and testing.

