import { http, createConfig } from 'wagmi'
import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { sepolia } from 'wagmi/chains'
import type { Chain } from 'viem'

export const ritualTestnet = {
  id: 1979,
  name: 'Ritual Testnet',
  nativeCurrency: {
    name: 'RITUAL',
    symbol: 'RITUAL',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.ritualfoundation.org'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Ritual Explorer',
      url: 'https://explorer.ritualfoundation.org',
    },
  },
  testnet: true,
} as const satisfies Chain

export const config = getDefaultConfig({
  appName: 'Universal Skill Passport',
  projectId: 'c3f8e5d2a1b4c6e7f8a9b0c1d2e3f4a5',
  chains: [sepolia, ritualTestnet],
  transports: {
    [sepolia.id]: http(),
    [ritualTestnet.id]: http(),
  },
  ssr: true,
})
