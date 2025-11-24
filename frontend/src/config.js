// Frontend configuration - reads from environment variables
// Vite exposes env vars prefixed with VITE_

export const config = {
  // Backend API URL
  backendUrl: import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001',
  
  // Blockchain RPC URL
  rpcUrl: import.meta.env.VITE_RPC_URL || 'http://127.0.0.1:7545',
  
  // Contract Address (will be set after deployment)
  contractAddress: import.meta.env.VITE_CONTRACT_ADDRESS || null,
  
  // Network Configuration
  chainId: import.meta.env.VITE_CHAIN_ID || '1337',
  chainName: import.meta.env.VITE_CHAIN_NAME || 'Ganache Local',
  
  // Helper to check if we're in production
  isProduction: import.meta.env.PROD || false,
  
  // Helper to check if we're in development
  isDevelopment: import.meta.env.DEV || true
}

export default config
