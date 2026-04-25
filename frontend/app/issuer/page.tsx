'use client'

import { useState } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/lib/contract'
import { generateCredentialHash, CREDENTIAL_TYPE_OPTIONS } from '@/lib/utils'
import type { CredentialFormData } from '@/lib/types'
import Link from 'next/link'
import { Shield, ArrowLeft, Check } from 'lucide-react'

export default function IssuerPage() {
  const { address, isConnected } = useAccount()
  const [issuerName, setIssuerName] = useState('')
  const [isRegistered, setIsRegistered] = useState(false)
  
  const [formData, setFormData] = useState<CredentialFormData>({
    id: `cred-${crypto.randomUUID()}`,
    title: '',
    type: 'certificate',
    holderAddress: '',
    issuerName: '',
    issuedAt: Date.now(),
    expiresAt: 0,
    skills: [],
    evidenceUrl: ''
  })

  const { data: hash, writeContract, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  const handleRegisterIssuer = () => {
    if (!issuerName.trim()) return
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'registerIssuer',
      args: [issuerName]
    })
  }

  const handleIssueCredential = () => {
    const credHash = generateCredentialHash(formData)
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'issueCredential',
      args: [formData.id, credHash, formData.holderAddress as `0x${string}`, BigInt(formData.expiresAt || 0)]
    })
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="text-center space-y-6">
          <Shield className="w-12 h-12 mx-auto opacity-50" />
          <div>
            <h1 className="text-2xl font-bold mb-2">Connect Wallet</h1>
            <p className="text-gray-400 mb-6">Connect your wallet to issue credentials</p>
            <ConnectButton />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-gray-800">
        <div className="container mx-auto px-6 h-16 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <ConnectButton />
        </div>
      </header>

      <div className="container mx-auto px-6 py-12 max-w-2xl">
        {!isRegistered ? (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Register as Issuer</h1>
              <p className="text-gray-400">Register your organization to issue credentials</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2 text-gray-400">Organization Name</label>
                <input
                  type="text"
                  value={issuerName}
                  onChange={(e) => setIssuerName(e.target.value)}
                  placeholder="e.g., MIT, Google, Coursera"
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:border-gray-700"
                />
              </div>

              <button
                onClick={handleRegisterIssuer}
                disabled={isPending || !issuerName.trim()}
                className="w-full px-6 py-3 bg-white text-black font-medium rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isPending ? 'Registering...' : 'Register'}
              </button>

              {isSuccess && (
                <div className="p-4 bg-gray-900 border border-gray-800 rounded-lg flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-sm">Registered successfully</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Issue Credential</h1>
              <p className="text-gray-400">Create a new verifiable credential</p>
            </div>

            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2 text-gray-400">Credential ID</label>
                  <input
                    type="text"
                    value={formData.id}
                    disabled
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2 text-gray-400">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:border-gray-700"
                  >
                    {CREDENTIAL_TYPE_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm mb-2 text-gray-400">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Bachelor of Computer Science"
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:border-gray-700"
                />
              </div>

              <div>
                <label className="block text-sm mb-2 text-gray-400">Holder Address</label>
                <input
                  type="text"
                  value={formData.holderAddress}
                  onChange={(e) => setFormData({ ...formData, holderAddress: e.target.value })}
                  placeholder="0x..."
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:border-gray-700 font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-sm mb-2 text-gray-400">Skills (comma-separated)</label>
                <input
                  type="text"
                  value={formData.skills.join(', ')}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                  placeholder="e.g., JavaScript, React, Node.js"
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:border-gray-700"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2 text-gray-400">Expiry Date (optional)</label>
                  <input
                    type="date"
                    onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value ? new Date(e.target.value).getTime() : 0 })}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:border-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2 text-gray-400">Evidence URL (optional)</label>
                  <input
                    type="url"
                    value={formData.evidenceUrl}
                    onChange={(e) => setFormData({ ...formData, evidenceUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:border-gray-700"
                  />
                </div>
              </div>

              <button
                onClick={handleIssueCredential}
                disabled={isPending || !formData.title || !formData.holderAddress}
                className="w-full px-6 py-3 bg-white text-black font-medium rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isPending ? 'Issuing...' : isConfirming ? 'Confirming...' : 'Issue Credential'}
              </button>

              {isSuccess && (
                <div className="p-4 bg-gray-900 border border-gray-800 rounded-lg flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <div className="flex-1">
                    <div className="text-sm font-medium mb-1">Credential issued successfully</div>
                    <div className="text-xs text-gray-400 font-mono">{hash}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
