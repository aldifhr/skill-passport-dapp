'use client'

import { useState } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import { formatAddress, formatDate, getVerificationUrl, CREDENTIAL_TYPE_LABELS } from '@/lib/utils'
import type { Credential } from '@/lib/types'
import Link from 'next/link'
import { Shield, Copy, ExternalLink, Check } from 'lucide-react'

// Demo data
const DEMO_CREDENTIALS: Credential[] = [
  {
    id: 'cred-001',
    title: 'Full Stack Developer Certificate',
    type: 'certificate',
    holderAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    issuerAddress: '0x1234567890123456789012345678901234567890',
    issuerName: 'Tech Academy',
    credentialHash: '0xabcd...',
    issuedAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
    expiresAt: 0,
    status: 'valid',
    skills: ['React', 'Node.js', 'PostgreSQL'],
    verificationCount: 12
  },
  {
    id: 'cred-002',
    title: 'Bachelor of Computer Science',
    type: 'degree',
    holderAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    issuerAddress: '0x2345678901234567890123456789012345678901',
    issuerName: 'MIT',
    credentialHash: '0xdef0...',
    issuedAt: Date.now() - 365 * 24 * 60 * 60 * 1000,
    expiresAt: 0,
    status: 'valid',
    skills: ['Algorithms', 'Data Structures', 'Machine Learning'],
    verificationCount: 45
  },
  {
    id: 'cred-003',
    title: 'AWS Solutions Architect',
    type: 'license',
    holderAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    issuerAddress: '0x3456789012345678901234567890123456789012',
    issuerName: 'Amazon Web Services',
    credentialHash: '0x1234...',
    issuedAt: Date.now() - 180 * 24 * 60 * 60 * 1000,
    expiresAt: Date.now() + 185 * 24 * 60 * 60 * 1000,
    status: 'valid',
    skills: ['AWS', 'Cloud Architecture', 'DevOps'],
    verificationCount: 28
  }
]

export default function HolderPage() {
  const { address, isConnected } = useAccount()
  const [credentials] = useState<Credential[]>(DEMO_CREDENTIALS)
  const [filter, setFilter] = useState<'all' | 'valid' | 'expired' | 'revoked'>('all')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const filteredCredentials = credentials.filter(c => 
    filter === 'all' || c.status === filter
  )

  const stats = {
    total: credentials.length,
    valid: credentials.filter(c => c.status === 'valid').length,
    expired: credentials.filter(c => c.status === 'expired').length,
    revoked: credentials.filter(c => c.status === 'revoked').length,
    skills: [...new Set(credentials.flatMap(c => c.skills))].length
  }

  const copyVerificationLink = (id: string) => {
    navigator.clipboard.writeText(getVerificationUrl(id))
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="text-center space-y-6">
          <Shield className="w-12 h-12 mx-auto opacity-50" />
          <div>
            <h1 className="text-2xl font-bold mb-2">Connect Wallet</h1>
            <p className="text-gray-400 mb-6">Connect your wallet to view your credentials</p>
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
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Shield className="w-5 h-5" />
            <span className="font-medium">Skill Passport</span>
          </Link>
          <ConnectButton />
        </div>
      </header>

      <div className="container mx-auto px-6 py-12 max-w-5xl">
        {/* Stats */}
        <div className="grid grid-cols-5 gap-4 mb-8">
          <div className="p-4 bg-gray-900 rounded-lg">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-xs text-gray-400">Total</div>
          </div>
          <div className="p-4 bg-gray-900 rounded-lg">
            <div className="text-2xl font-bold text-green-500">{stats.valid}</div>
            <div className="text-xs text-gray-400">Valid</div>
          </div>
          <div className="p-4 bg-gray-900 rounded-lg">
            <div className="text-2xl font-bold text-yellow-500">{stats.expired}</div>
            <div className="text-xs text-gray-400">Expired</div>
          </div>
          <div className="p-4 bg-gray-900 rounded-lg">
            <div className="text-2xl font-bold text-red-500">{stats.revoked}</div>
            <div className="text-xs text-gray-400">Revoked</div>
          </div>
          <div className="p-4 bg-gray-900 rounded-lg">
            <div className="text-2xl font-bold">{stats.skills}</div>
            <div className="text-xs text-gray-400">Skills</div>
          </div>
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-6">
          {(['all', 'valid', 'expired', 'revoked'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === f 
                  ? 'bg-white text-black' 
                  : 'bg-gray-900 text-gray-400 hover:text-white'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Credentials */}
        <div className="space-y-4">
          {filteredCredentials.map(cred => (
            <div key={cred.id} className="p-6 bg-gray-900 border border-gray-800 rounded-lg hover:border-gray-700 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{cred.title}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      cred.status === 'valid' ? 'bg-green-500/10 text-green-500' :
                      cred.status === 'expired' ? 'bg-yellow-500/10 text-yellow-500' :
                      'bg-red-500/10 text-red-500'
                    }`}>
                      {cred.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-400 space-y-1">
                    <div>{CREDENTIAL_TYPE_LABELS[cred.type]} · {cred.issuerName}</div>
                    <div>Issued {formatDate(cred.issuedAt)}</div>
                  </div>
                </div>
                <div className="text-right text-sm text-gray-400">
                  <div>{cred.verificationCount} verifications</div>
                </div>
              </div>

              {cred.skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {cred.skills.map(skill => (
                    <span key={skill} className="px-2 py-1 bg-gray-800 rounded text-xs">
                      {skill}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => copyVerificationLink(cred.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded text-sm transition-colors"
                >
                  {copiedId === cred.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copiedId === cred.id ? 'Copied' : 'Copy Link'}
                </button>
                <Link
                  href={`/verify/${cred.id}`}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded text-sm transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filteredCredentials.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No credentials found</p>
          </div>
        )}
      </div>
    </div>
  )
}
