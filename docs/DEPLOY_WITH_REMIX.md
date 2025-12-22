# Quick Deploy with Remix IDE

Since we're having compatibility issues with Truffle/Hardhat on Node.js v24, let's use Remix IDE for deployment.

## Steps:

### 1. Open Remix IDE
Go to https://remix.ethereum.org/

### 2. Upload Contract
- In the File Explorer, create a new file: `Election.sol`
- Copy the contents of `/home/babayaga/Documents/voting/contracts/Election.sol` into it

### 3. Compile Contract
- Click on "Solidity Compiler" tab (left sidebar)
- Select compiler version: `0.8.19`
- Click "Compile Election.sol"

### 4. Deploy to Sepolia
- Click on "Deploy & Run Transactions" tab
- Environment: Select "Injected Provider - MetaMask"
- MetaMask will pop up - make sure you're on Sepolia network
- Confirm your account has 0.05 ETH
- Click "Deploy"
- Confirm transaction in MetaMask

### 5. Copy Contract Address
- After deployment, expand the deployed contract in Remix
- Copy the contract address (starts with 0x...)

### 6. Update Environment Files

#### Frontend (.env):
```bash
VITE_BACKEND_URL=http://localhost:3001
VITE_RPC_URL=https://sepolia.infura.io/v3/3146a08c44cb488fb662f70e5b4a7a7a
VITE_CONTRACT_ADDRESS=<YOUR_CONTRACT_ADDRESS>
VITE_CHAIN_ID=11155111
```

#### Backend (.env):
```bash
PINATA_JWT=<your_pinata_jwt>
CONTRACT_ADDRESS=<YOUR_CONTRACT_ADDRESS>
FRONTEND_URL=http://localhost:5173
```

### 7. Get Contract ABI
- In Remix, go to "Solidity Compiler" tab
- Click "Compilation Details" button
- Scroll down to "ABI" section
- Copy the ABI JSON
- Save it to `/home/babayaga/Documents/voting/Election.abi.json`

This is the fastest way to deploy without Node.js compatibility issues!
