import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Explicitly expose env variables to avoid issues
    'import.meta.env.VITE_BACKEND_URL': JSON.stringify(process.env.VITE_BACKEND_URL),
    'import.meta.env.VITE_RPC_URL': JSON.stringify(process.env.VITE_RPC_URL),
    'import.meta.env.VITE_CONTRACT_ADDRESS': JSON.stringify(process.env.VITE_CONTRACT_ADDRESS),
    'import.meta.env.VITE_CHAIN_ID': JSON.stringify(process.env.VITE_CHAIN_ID),
    'import.meta.env.VITE_CHAIN_NAME': JSON.stringify(process.env.VITE_CHAIN_NAME),
  }
})
