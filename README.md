# Blockchain-based E-Voting Prototype (limited users)

This repository is a scaffold for a small-scale blockchain-based e-voting prototype inspired by Estonia and blockchain pilots. It includes a Truffle/Smart Contract project, an Express backend, a minimal React frontend, and a ZoKrates placeholder for zk-SNARK work.

Quick structure
- `contracts/` - Solidity smart contract `Election.sol`
- `migrations/` - Truffle migrations
- `test/` - Truffle tests (Mocha)
- `backend/` - Express server to serve candidates and IPFS-stub
- `frontend/` - Vite + React minimal UI
- `zoKrates/` - placeholder and notes for zk-SNARKs

Getting started (local prototype)

Prerequisites
- Node.js (16+), npm
- Truffle
- Ganache (or Ganache CLI) running on `127.0.0.1:7545`
- **IMPORTANT**: Pinata account for production IPFS storage (see `IPFS_SETUP.md`)
- (Optional) Local IPFS daemon on `127.0.0.1:5001` for development testing

Install dependencies

```bash
cd /home/babayaga/Documents/voting
npm install
cd backend && npm install
cd ../frontend && npm install
```

Run Ganache (desktop or CLI)

Deploy contracts

```bash
# in root
npx truffle migrate --reset --network development
```

Run backend and frontend

```bash
# backend
cd backend && npm start

# frontend
cd frontend && npm start
```

Run tests (Truffle)

```bash
npx truffle test
```

Notes & next steps
- The `Election.sol` contract supports owner-created voters and candidates, vote casting, and revoting (previous vote is invalidated). For a stronger privacy model you may move candidate choice off-chain (store encrypted vote on IPFS and only the hash on-chain) and integrate a ZK verification step.
- The backend includes an IPFS helper that falls back to a fake CID when a local IPFS node isn't available.
- MetaMask (browser extension)

If you plan to demo the prototype using real browser wallets (recommended), install MetaMask in your browser. Here are quick steps:

1. Install MetaMask

	- Visit the official site: https://metamask.io/download/ and follow the installation instructions for your browser (Chrome, Firefox, Edge, or Brave).
	- Or open the Chrome Web Store entry: https://chrome.google.com/webstore/detail/metamask

2. Create/import a wallet (for testing)

	- Create a new wallet or click Import Wallet and paste one of the Ganache private keys (shown when you start Ganache) to import a funded account for testing.

3. Add the local Ganache network to MetaMask

	- Open MetaMask > Settings > Networks > Add network
	- RPC URL: http://127.0.0.1:7545
	- Chain ID: 1337
	- Currency: ETH

4. Verify and use

	- Ensure the imported account is selected in MetaMask and has ETH (Ganache gives test ETH by default).
	- Open the frontend (http://localhost:5173) and use Connect to link MetaMask and sign transactions.

If you can't install MetaMask on the presentation machine, the UI includes a manual address field for testing, but for production and an authentic demo MetaMask (or WalletConnect) is recommended.
- Frontend is a minimal starting UI demonstrating MetaMask connect and fetching candidates from backend; it does not yet perform blockchain transactions.

Research alignment
- Uses Ganache (Ethereum) for a local private chain, Solidity for contracts, React + Web3 for frontend, IPFS for off-chain storage, and a ZoKrates placeholder for zk-SNARKs.

## 🔐 Production Setup

### IPFS Storage (REQUIRED for Real Users)
This system stores encrypted votes on IPFS for permanent, verifiable storage. For real-world use:

1. **Read the setup guide**: `IPFS_SETUP.md`
2. **Sign up for Pinata**: https://pinata.cloud (FREE tier: 1GB)
3. **Get API keys**: https://app.pinata.cloud/developers/api-keys
4. **Configure backend**: Add keys to `backend/.env`
5. **Restart backend**: Votes will now be stored permanently on IPFS

**⚠️ Without Pinata**: System uses fake CIDs - NOT suitable for real users!

### Development Workflow
For daily development with persistent blockchain data:
- **Read**: `DEVELOPMENT_WORKFLOW.md` - Explains how to use the persistent Ganache database
- **Key point**: Don't use `--reset` flag after initial setup
- **Database**: `./ganache_db/` contains all blockchain data

### Security Features
- ✅ OpenZeppelin contracts (Pausable, ReentrancyGuard)
- ✅ Voting periods with emergency pause
- ✅ Rate limiting (100 req/15min per IP)
- ✅ Input validation (Joi schemas)
- ✅ Helmet.js security headers
- ✅ CORS whitelist
- ✅ Address validation (prevent addresses as candidate names)

### Next Steps for Production
1. ✅ Set up Pinata (IPFS storage)
2. ⏳ Deploy to Sepolia testnet
3. ⏳ Configure environment variables
4. ⏳ Add monitoring (Winston + Sentry)
5. ⏳ Write comprehensive tests
6. ⏳ Deploy to mainnet

See production checklist in conversation history.
