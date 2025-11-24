import "@nomicfoundation/hardhat-toolbox";
import dotenv from 'dotenv';
dotenv.config();

/** @type import('hardhat/config').HardhatUserConfig */
export default {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL,
      accounts: {
        mnemonic: process.env.MNEMONIC
      },
      chainId: 11155111,
      timeout: 120000
    }
  },
  paths: {
    sources: "./contracts",
    artifacts: "./build"
  }
};
