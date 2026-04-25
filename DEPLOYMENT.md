# Deployment Guide

## Prerequisites

1. **Get Testnet ETH:**
   - Sepolia: https://sepoliafaucet.com/
   - Ritual: https://faucet.ritualfoundation.org/

2. **Get API Keys:**
   - Alchemy (for Sepolia RPC): https://www.alchemy.com/
   - Etherscan (for verification): https://etherscan.io/apis

## Setup

1. **Copy environment template:**
   ```bash
   cp .env.example .env
   ```

2. **Fill in your credentials in `.env`:**
   ```
   PRIVATE_KEY=0x... (your wallet private key)
   SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY
   ETHERSCAN_API_KEY=YOUR_KEY
   ```

   ⚠️ **NEVER commit `.env` file to git!**

## Deploy

### Deploy to Sepolia
```bash
./deploy-sepolia.sh
```

### Deploy to Ritual Testnet
```bash
./deploy-ritual.sh
```

## After Deployment

1. Copy the deployed contract address from terminal output
2. Update `NEXT_PUBLIC_CONTRACT_ADDRESS` in `.env`
3. Update `frontend/.env.local`:
   ```bash
   echo "NEXT_PUBLIC_CONTRACT_ADDRESS=0x..." > frontend/.env.local
   ```
4. Restart frontend dev server

## Verify Contract (Sepolia only)

Contract will be auto-verified during deployment if `ETHERSCAN_API_KEY` is set.

Manual verification:
```bash
cd contracts
forge verify-contract \
  --chain-id 11155111 \
  --compiler-version v0.8.20 \
  YOUR_CONTRACT_ADDRESS \
  src/UniversalSkillPassport.sol:UniversalSkillPassport \
  --etherscan-api-key $ETHERSCAN_API_KEY
```

## Security Notes

- ✅ `.env` is in `.gitignore`
- ✅ Never share your private key
- ✅ Use separate wallet for testnet
- ✅ Keep production keys in secure vault
