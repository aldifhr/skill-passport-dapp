import contractABI from './contract-abi.json'

// Contract will be deployed later
export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}` || '0x0000000000000000000000000000000000000000'

export const CONTRACT_ABI = contractABI

export { contractABI }
