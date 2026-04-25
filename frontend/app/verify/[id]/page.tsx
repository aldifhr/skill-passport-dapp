'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { formatAddress, formatDate, CREDENTIAL_TYPE_LABELS } from '@/lib/utils'
import Link from 'next/link'
import { Shield, Check, X, Clock, ArrowLeft, ExternalLink } from 'lucide-react'

export default function VerifyPage() {
  const params = useParams()
  const credentialId = params?.id as string
  const [credentialData, setCredentialData] = useState<any>(null)

  useEffect(() => {
    if (credentialId) {
      const demoCredentials: Record<string, any> = {
        'cred-demo-1': {
          id: 'cred-demo-1',
          title: 'Bachelor of Computer Science',
          type: 'degree',
          description: 'Four-year undergraduate degree program in Computer Science with focus on algorithms, software engineering, and machine learning.',
          issuerAddress: '0x1234567890123456789012345678901234567890',
          issuerName: 'MIT University',
          issuerVerified: true,
          holderAddress: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
          skills: ['Algorithms', 'Data Structures', 'Software Engineering', 'Machine Learning', 'Python', 'Java'],
          issuedAt: Math.floor(Date.now() / 1000) - 86400 * 365,
          expiresAt: 0,
          status: 'valid',
          hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
          verificationCount: 47,
          evidenceLink: 'https://mit.edu/verify/john-doe-cs-2023'
        },
        'cred-demo-2': {
          id: 'cred-demo-2',
          title: 'Smart Contract Security Audit',
          type: 'certificate',
          description: 'Comprehensive training in smart contract security auditing, covering common vulnerabilities and best practices.',
          issuerAddress: '0x2345678901234567890123456789012345678901',
          issuerName: 'CertiK',
          issuerVerified: true,
          holderAddress: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
          skills: ['Solidity', 'Security Auditing', 'Smart Contracts', 'Blockchain'],
          issuedAt: Math.floor(Date.now() / 1000) - 86400 * 180,
          expiresAt: Math.floor(Date.now() / 1000) + 86400 * 185,
          status: 'valid',
          hash: '0xdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abc',
          verificationCount: 23,
          evidenceLink: 'https://certik.com/certificates/sc-audit-2024'
        },
        'cred-demo-3': {
          id: 'cred-demo-3',
          title: 'Full Stack Developer Bootcamp',
          type: 'training',
          description: '12-week intensive bootcamp covering full-stack web development.',
          issuerAddress: '0x3456789012345678901234567890123456789012',
          issuerName: 'Le Wagon',
          issuerVerified: true,
          holderAddress: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
          skills: ['React', 'Node.js', 'PostgreSQL', 'JavaScript'],
          issuedAt: Math.floor(Date.now() / 1000) - 86400 * 90,
          expiresAt: 0,
          status: 'valid',
          hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
          verificationCount: 12
        },
        'cred-demo-4': {
          id: 'cred-demo-4',
          title: 'Community Moderator',
          type: 'membership',
          description: 'Active community moderator for Ethereum Foundation Discord.',
          issuerAddress: '0x4567890123456789012345678901234567890123',
          issuerName: 'Ethereum Foundation',
          issuerVerified: true,
          holderAddress: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
          skills: ['Community Management', 'Discord', 'Governance'],
          issuedAt: Math.floor(Date.now() / 1000) - 86400 * 200,
          expiresAt: Math.floor(Date.now() / 1000) - 86400 * 10,
          status: 'expired',
          hash: '0x567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234',
          verificationCount: 8
        },
        'cred-demo-5': {
          id: 'cred-demo-5',
          title: 'Bug Bounty Achievement',
          type: 'assessment',
          description: 'Successfully identified critical vulnerability in DeFi protocol.',
          issuerAddress: '0x5678901234567890123456789012345678901234',
          issuerName: 'Immunefi',
          issuerVerified: true,
          holderAddress: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
          skills: ['Security Research', 'Penetration Testing', 'Bug Hunting'],
          issuedAt: Math.floor(Date.now() / 1000) - 86400 * 60,
          expiresAt: 0,
          status: 'valid',
          hash: '0x9abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456789',
          verificationCount: 31,
          evidenceLink: 'https://immunefi.com/bounty/report-12345'
        }
      }

      setCredentialData(demoCredentials[credentialId] || null)
    }
  }, [credentialId])

  if (!credentialId) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <X className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <h1 className="text-2xl font-semibold mb-4">No credential ID</h1>
          <p className="text-gray-400 text-sm">Provide a credential ID to verify</p>
        </div>
      </div>
    )
  }

  if (!credentialData) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <X className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <h1 className="text-2xl font-semibold mb-4">Credential not found</h1>
          <p className="text-gray-400 text-sm mb-6">
            ID <code className="px-2 py-1 bg-gray-900 rounded text-xs">{credentialId}</code> does not exist
          </p>
          <Link href="/" className="px-6 py-3 bg-white text-black font-medium rounded hover:bg-gray-200 transition inline-block">
            Go Home
          </Link>
        </div>
      </div>
    )
  }

  const isValid = credentialData.status === 'valid'
  const isExpired = credentialData.status === 'expired'
  const isRevoked = credentialData.status === 'revoked'

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-gray-400 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6" />
              <span className="font-semibold">Verification</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12 max-w-3xl">
        {/* Status */}
        <div className={`p-6 rounded mb-8 border ${
          isValid ? 'bg-gray-900 border-white' :
          isExpired ? 'bg-gray-900 border-gray-600' :
          'bg-gray-900 border-gray-800'
        }`}>
          <div className="flex items-center gap-4">
            {isValid && <Check className="w-10 h-10" />}
            {isExpired && <Clock className="w-10 h-10 text-gray-500" />}
            {isRevoked && <X className="w-10 h-10 text-gray-500" />}
            <div>
              <h2 className="text-2xl font-semibold mb-1">
                {isValid && 'Valid'}
                {isExpired && 'Expired'}
                {isRevoked && 'Revoked'}
              </h2>
              <p className="text-sm text-gray-400">
                {isValid && 'This credential is authentic and verified'}
                {isExpired && 'This credential has expired'}
                {isRevoked && 'This credential has been revoked'}
              </p>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div>
            <h3 className="text-2xl font-semibold mb-6">{credentialData.title}</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="text-xs text-gray-500 mb-1">Type</div>
              <div className="text-sm">{CREDENTIAL_TYPE_LABELS[credentialData.type]}</div>
            </div>

            <div>
              <div className="text-xs text-gray-500 mb-1">Credential ID</div>
              <div className="text-xs font-mono bg-gray-900 p-2 rounded break-all">{credentialData.id}</div>
            </div>

            <div>
              <div className="text-xs text-gray-500 mb-1">Issuer</div>
              <div className="text-sm font-medium flex items-center gap-2">
                {credentialData.issuerName}
                {credentialData.issuerVerified && <Check className="w-3 h-3" />}
              </div>
              <div className="text-xs text-gray-600">{formatAddress(credentialData.issuerAddress)}</div>
            </div>

            <div>
              <div className="text-xs text-gray-500 mb-1">Holder</div>
              <div className="text-xs text-gray-600">{formatAddress(credentialData.holderAddress)}</div>
            </div>

            <div>
              <div className="text-xs text-gray-500 mb-1">Issued</div>
              <div className="text-sm">{formatDate(credentialData.issuedAt)}</div>
            </div>

            {credentialData.expiresAt > 0 && (
              <div>
                <div className="text-xs text-gray-500 mb-1">Expires</div>
                <div className="text-sm">{formatDate(credentialData.expiresAt)}</div>
              </div>
            )}

            <div>
              <div className="text-xs text-gray-500 mb-1">Verifications</div>
              <div className="text-sm">{credentialData.verificationCount} times</div>
            </div>

            <div>
              <div className="text-xs text-gray-500 mb-1">Hash</div>
              <div className="text-xs font-mono bg-gray-900 p-2 rounded break-all">{credentialData.hash}</div>
            </div>
          </div>

          {credentialData.description && (
            <div className="pt-6 border-t border-gray-800">
              <div className="text-xs text-gray-500 mb-2">Description</div>
              <p className="text-sm text-gray-300">{credentialData.description}</p>
            </div>
          )}

          <div className="pt-6 border-t border-gray-800">
            <div className="text-xs text-gray-500 mb-3">Skills</div>
            <div className="flex flex-wrap gap-2">
              {credentialData.skills.map((skill: string) => (
                <span key={skill} className="px-3 py-1 bg-gray-900 text-sm rounded">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {credentialData.evidenceLink && (
            <div className="pt-6 border-t border-gray-800">
              <div className="text-xs text-gray-500 mb-2">Evidence</div>
              <a
                href={credentialData.evidenceLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm hover:text-gray-300 flex items-center gap-2"
              >
                View evidence <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-800">
            <div className="text-xs text-gray-500 mb-3">Blockchain verification</div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>Exists on Ritual blockchain</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>Issuer signature verified</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>Hash matches on-chain record</span>
              </div>
              <div className="flex items-center gap-2">
                {isRevoked ? <X className="w-4 h-4 text-gray-500" /> : <Check className="w-4 h-4" />}
                <span>{isRevoked ? 'Revoked' : 'Not revoked'}</span>
              </div>
              <div className="flex items-center gap-2">
                {isExpired ? <Clock className="w-4 h-4 text-gray-500" /> : <Check className="w-4 h-4" />}
                <span>{isExpired ? 'Expired' : 'Current'}</span>
              </div>
            </div>

            <div className="mt-4">
              <a
                href={`https://explorer.ritualfoundation.org/tx/${credentialData.hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm hover:text-gray-300 flex items-center gap-2"
              >
                View on explorer <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
