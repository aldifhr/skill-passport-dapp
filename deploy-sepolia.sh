#!/bin/bash

# Load environment variables
source .env

# Check if private key is set
if [ "$PRIVATE_KEY" = "your_private_key_here" ]; then
    echo "❌ Error: Please set PRIVATE_KEY in .env file"
    exit 1
fi

# Deploy to Sepolia
echo "🚀 Deploying to Sepolia..."
cd contracts
forge script script/Deploy.s.sol:DeployScript \
    --rpc-url $SEPOLIA_RPC_URL \
    --private-key $PRIVATE_KEY \
    --broadcast \
    --verify \
    --etherscan-api-key $ETHERSCAN_API_KEY \
    -vvvv

echo "✅ Deployment complete!"
echo "📝 Update NEXT_PUBLIC_CONTRACT_ADDRESS in .env with the deployed address"
