# Development Workflow Guide

## 🚀 Quick Start (First Time Setup)

```bash
# 1. Start Ganache (persistent blockchain)
./start-ganache.sh

# 2. Deploy contracts
npx truffle migrate --network development

# 3. Start backend (in new terminal)
cd backend && node index.js

# 4. Start frontend (in new terminal)
cd frontend && npm start

# 5. Open http://localhost:5173
# 6. Connect MetaMask with Account 1 (admin)
# 7. Register voters and add candidates
```

## 🔄 Daily Development (After First Setup)

**The blockchain state is PERSISTENT!** You don't need to redeploy or re-register.

```bash
# Just start the services:
./start-ganache.sh      # Terminal 1
node backend/index.js    # Terminal 2
cd frontend && npm start # Terminal 3

# Your registrations and candidates are still there! ✓
```

## 🗑️ When to Delete Database & Start Fresh

Only delete `ganache_db/` when:
- Smart contract code changed
- You want to test from scratch
- Database is corrupted

```bash
# Stop Ganache (Ctrl+C)
rm -rf ganache_db/
./start-ganache.sh
npx truffle migrate --reset --network development
```

## 📝 Important Notes

### ❌ **DON'T DO THIS** (common mistake):
```bash
# This deletes all your voter registrations!
npx truffle migrate --reset
```

### ✅ **DO THIS** (correct):
```bash
# Just restart Ganache if it crashed
./start-ganache.sh

# Frontend/backend can restart anytime without losing data
```

## 🔧 Troubleshooting

### "Voter not registered after restart"
- **Cause**: You ran `truffle migrate --reset` which deployed a new contract
- **Fix**: Don't use `--reset` flag during normal development

### "Contract address changed"
- **Cause**: Database was deleted or contracts redeployed
- **Fix**: Re-register voters on the new contract

### "MetaMask transaction fails"
- **Cause**: Circuit breaker from too many errors
- **Fix**: MetaMask → Settings → Advanced → Clear activity tab data

## 📊 Current Setup

- **Ganache Database**: `./ganache_db/` (DO NOT DELETE during dev)
- **Chain ID**: 1337 (fixed)
- **Network ID**: 1337 (fixed)
- **Admin Account**: Account 0 (first account shown in Ganache output)
- **Voter Accounts**: Accounts 1-9 (use any for testing voters)

## 🎯 Best Practices

1. **Leave Ganache running** - Don't stop it unless necessary
2. **Don't use --reset** - Only for fresh starts
3. **Check database exists** - `ls ganache_db/` should show files
4. **One-time registration** - Register voters once, they persist
5. **Backend/Frontend** - Can restart these anytime, data is on blockchain
