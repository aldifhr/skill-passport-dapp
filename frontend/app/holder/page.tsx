'use client'

import { useState } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import { formatAddress, formatDate, getVerificationUrl, CREDENTIAL_TYPE_LABELS } from '@/lib/utils'
import type { Credential } from '@/lib/types'
import Link from 'next/link'
import { Shield, Copy, ExternalLink, Check, Filter, Search, Award, Calendar, MoreVertical, LayoutGrid, List } from 'lucide-react'

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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const filteredCredentials = credentials.filter(c => 
    filter === 'all' || c.status === filter
  )

  const stats = {
    total: credentials.length,
    valid: credentials.filter(c => c.status === 'valid').length,
    skills: [...new Set(credentials.flatMap(c => c.skills))].length,
    verifications: credentials.reduce((acc, c) => acc + c.verificationCount, 0)
  }

  const copyVerificationLink = (id: string) => {
    navigator.clipboard.writeText(getVerificationUrl(id))
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center px-6 overflow-hidden relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="text-center space-y-8 relative z-10 max-w-md">
          <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center mx-auto animate-float">
            <Shield className="w-10 h-10 text-sky-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-3 tracking-tight">Connect Your Passport</h1>
            <p className="text-slate-400 mb-8 leading-relaxed">Please connect your Web3 wallet to access and manage your verified professional credentials.</p>
            <div className="flex justify-center">
              <ConnectButton />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-sky-500/30">
      <header className="border-b border-white/5 bg-black/40 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-all">
            <Shield className="w-5 h-5 text-sky-400" />
            <span className="font-bold tracking-tight">Skill Passport</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="hidden sm:block h-8 w-[1px] bg-white/10 mx-2" />
            <ConnectButton />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 max-w-7xl">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
          <div>
            <h1 className="text-4xl font-bold mb-2 tracking-tight">Credential Dashboard</h1>
            <p className="text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Connected as {formatAddress(address || '')}
            </p>
          </div>
          <button className="primary-button">
            <ExternalLink className="w-4 h-4" />
            Public Profile
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <StatCard label="Total Credentials" value={stats.total} icon={<Award className="w-5 h-5 text-sky-400" />} />
          <StatCard label="Verified Skills" value={stats.skills} icon={<Check className="w-5 h-5 text-emerald-400" />} />
          <StatCard label="Total Verifications" value={stats.verifications} icon={<Search className="w-5 h-5 text-purple-400" />} />
          <StatCard label="Account Status" value="Active" icon={<Shield className="w-5 h-5 text-blue-400" />} />
        </div>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div className="flex gap-2 p-1 bg-white/5 border border-white/5 rounded-xl">
            {(['all', 'valid', 'expired', 'revoked'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                  filter === f 
                    ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20' 
                    : 'text-slate-500 hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search credentials..." 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all"
              />
            </div>
            <div className="flex p-1 bg-white/5 border border-white/5 rounded-xl">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-slate-500'}`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-slate-500'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Credentials Grid/List */}
        <div className={viewMode === 'grid' ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
          {filteredCredentials.map(cred => (
            <CredentialCard 
              key={cred.id} 
              cred={cred} 
              viewMode={viewMode}
              copiedId={copiedId}
              onCopy={copyVerificationLink}
            />
          ))}
        </div>

        {filteredCredentials.length === 0 && (
          <div className="text-center py-20 bg-white/[0.02] border border-dashed border-white/10 rounded-3xl">
            <Shield className="w-16 h-16 mx-auto mb-6 text-slate-700" />
            <h3 className="text-xl font-bold mb-2">No Credentials Found</h3>
            <p className="text-slate-500">Try changing your filters or connect with an issuer.</p>
          </div>
        )}
      </main>
    </div>
  )
}

function StatCard({ label, value, icon }: { label: string, value: string | number, icon: React.ReactNode }) {
  return (
    <div className="glass-card p-6 border-white/5">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-white/5 rounded-lg border border-white/5">
          {icon}
        </div>
        <MoreVertical className="w-4 h-4 text-slate-600" />
      </div>
      <div className="text-2xl font-bold mb-1 tracking-tight">{value}</div>
      <div className="text-xs font-bold uppercase tracking-widest text-slate-500">{label}</div>
    </div>
  )
}

function CredentialCard({ 
  cred, 
  viewMode, 
  copiedId, 
  onCopy 
}: { 
  cred: Credential, 
  viewMode: 'grid' | 'list',
  copiedId: string | null,
  onCopy: (id: string) => void
}) {
  const isGrid = viewMode === 'grid'
  
  return (
    <div className={`glass-card group hover:bg-white/[0.05] transition-all border-white/5 ${isGrid ? 'p-6 flex flex-col' : 'p-4 flex items-center justify-between'}`}>
      <div className={isGrid ? "mb-6" : "flex items-center gap-6"}>
        <div className={`flex items-center justify-between ${isGrid ? 'mb-4' : ''}`}>
          <div className="flex items-center gap-3">
            <div className={`p-3 bg-white/5 rounded-xl border border-white/5 group-hover:scale-110 transition-transform ${isGrid ? '' : 'w-12 h-12 flex items-center justify-center'}`}>
              <Award className="w-6 h-6 text-sky-400" />
            </div>
            {!isGrid && (
              <div>
                <h3 className="font-bold text-lg">{cred.title}</h3>
                <p className="text-xs text-slate-500">{cred.issuerName} · {CREDENTIAL_TYPE_LABELS[cred.type]}</p>
              </div>
            )}
          </div>
          {isGrid && (
            <span className={`badge ${
              cred.status === 'valid' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
              cred.status === 'expired' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
              'bg-rose-500/10 text-rose-400 border border-rose-500/20'
            }`}>
              {cred.status}
            </span>
          )}
        </div>
        
        {isGrid && (
          <div className="space-y-1">
            <h3 className="font-bold text-xl leading-tight group-hover:text-sky-400 transition-colors">{cred.title}</h3>
            <p className="text-sm text-slate-400 font-medium">{cred.issuerName} · {CREDENTIAL_TYPE_LABELS[cred.type]}</p>
          </div>
        )}
      </div>

      <div className={isGrid ? "flex-1 space-y-6" : "flex items-center gap-12"}>
        {isGrid && (
          <div className="flex flex-wrap gap-2">
            {cred.skills.map(skill => (
              <span key={skill} className="px-2 py-1 bg-white/5 rounded-md text-[10px] font-bold uppercase tracking-wider text-slate-300 border border-white/5">
                {skill}
              </span>
            ))}
          </div>
        )}

        <div className={`flex items-center gap-6 ${isGrid ? 'pt-6 border-t border-white/5' : ''}`}>
          <div className="flex items-center gap-2 text-slate-500">
            <Calendar className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-widest">{formatDate(cred.issuedAt)}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-500">
            <Search className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-widest">{cred.verificationCount} Check{cred.verificationCount !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>

      <div className={`flex gap-3 ${isGrid ? 'mt-6' : 'ml-6'}`}>
        <button
          onClick={() => onCopy(cred.id)}
          className="flex-1 secondary-button !py-2 !text-xs"
        >
          {copiedId === cred.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {copiedId === cred.id ? 'Copied' : 'Share'}
        </button>
        <Link
          href={`/verify/${cred.id}`}
          className="flex-1 primary-button !py-2 !text-xs"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          View
        </Link>
      </div>
    </div>
  )
}
