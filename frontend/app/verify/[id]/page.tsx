'use client'

import { useParams } from 'next/navigation'
import { Shield, CheckCircle2, AlertCircle, Clock, ExternalLink, Copy, Share2, Award, Building2, User, FileText, Globe, Box, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { formatDate, formatAddress } from '@/lib/utils'

// Mock verification data
const MOCK_CREDENTIAL = {
  id: 'cred-001',
  title: 'Full Stack Developer Certificate',
  type: 'certificate',
  status: 'valid',
  issuerName: 'Tech Academy',
  issuerAddress: '0x1234567890123456789012345678901234567890',
  holderName: 'Alice Johnson',
  holderAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
  issuedAt: 1714041600000,
  credentialHash: '0xabcd1234efgh5678ijkl9012mnop3456qrst7890uvwx1234yzab5678cdef9012',
  transactionHash: '0x9876543210abcdef9876543210abcdef9876543210abcdef9876543210abcdef',
  blockNumber: '1,420,690',
  skills: ['React', 'Node.js', 'PostgreSQL', 'Solidity', 'Tailwind CSS'],
  description: 'Successfully completed the 6-month intensive Full Stack Web Development program, demonstrating proficiency in modern frontend frameworks, backend architecture, and decentralized applications.',
}

export default function VerifyPage() {
  const { id } = useParams()
  const [isVerifying, setIsVerifying] = useState(true)

  useEffect(() => {
    // Simulate verification process
    const timer = setTimeout(() => setIsVerifying(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-emerald-500/30">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-emerald-500/5 blur-[100px] rounded-full animate-pulse-slow" />
        <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-sky-500/5 blur-[100px] rounded-full animate-pulse-slow" />
      </div>

      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/40 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-all">
            <Shield className="w-5 h-5 text-emerald-400" />
            <span className="font-bold tracking-tight text-white/90">Skill Passport <span className="text-[10px] font-bold text-slate-500 ml-1">VERIFICATION</span></span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm font-bold text-slate-500 hover:text-white transition-colors">Documentation</Link>
            <div className="h-4 w-[1px] bg-white/10" />
            <Share2 className="w-4 h-4 text-slate-500 cursor-pointer hover:text-white transition-colors" />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 pt-32 pb-24 max-w-4xl relative z-10">
        {isVerifying ? (
          <div className="flex flex-col items-center justify-center py-40 space-y-8">
            <div className="relative">
              <div className="w-24 h-24 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
              <Shield className="w-10 h-10 text-emerald-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">Verifying Authenticity</h2>
              <p className="text-slate-500">Checking cryptographic signatures on Ritual Testnet...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Status Hero */}
            <div className="glass-card overflow-hidden border-emerald-500/20 bg-emerald-500/[0.02]">
              <div className="p-8 md:p-12 text-center relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500/0 via-emerald-500 to-emerald-500/0" />
                <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(16,185,129,0.1)]">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                </div>
                <h1 className="text-4xl font-black mb-3 tracking-tighter">VERIFIED AUTHENTIC</h1>
                <p className="text-slate-400 text-sm font-medium uppercase tracking-[0.2em]">Credential status is active and valid</p>
                <div className="mt-8 flex flex-wrap justify-center gap-4">
                  <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-bold text-emerald-400 flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    Last Checked: Just now
                  </span>
                  <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold text-slate-400 flex items-center gap-2">
                    <Globe className="w-3 h-3" />
                    Network: Ritual Testnet
                  </span>
                </div>
              </div>
            </div>

            {/* Credential Content */}
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-8">
                <div className="glass-card p-8 border-white/5">
                  <div className="flex items-start justify-between mb-10">
                    <div className="space-y-1">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 mb-2">Subject Title</div>
                      <h2 className="text-3xl font-bold tracking-tight">{MOCK_CREDENTIAL.title}</h2>
                    </div>
                    <Award className="w-10 h-10 text-slate-700" />
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3 flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5" />
                        Professional Description
                      </h3>
                      <p className="text-slate-300 leading-relaxed text-sm">
                        {MOCK_CREDENTIAL.description}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3 flex items-center gap-2">
                        <Box className="w-3.5 h-3.5" />
                        Verified Skills & Competencies
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {MOCK_CREDENTIAL.skills.map(skill => (
                          <span key={skill} className="px-3 py-1 bg-white/5 border border-white/5 rounded-lg text-xs font-medium text-slate-300">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="glass-card p-8 border-white/5">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-6">Cryptographic Evidence</h3>
                  <div className="space-y-6">
                    <EvidenceRow label="Credential Hash" value={MOCK_CREDENTIAL.credentialHash} />
                    <EvidenceRow label="Transaction Hash" value={MOCK_CREDENTIAL.transactionHash} />
                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2">Block Number</div>
                        <div className="font-mono text-xs text-slate-400">{MOCK_CREDENTIAL.blockNumber}</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2">Timestamp</div>
                        <div className="font-mono text-xs text-slate-400">{formatDate(MOCK_CREDENTIAL.issuedAt)}</div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 pt-8 border-t border-white/5">
                    <button className="w-full secondary-button !text-xs !bg-white/5 group">
                      View on Ritual Explorer
                      <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Sidebar Info */}
              <div className="space-y-6">
                <InfoBox 
                  icon={<Building2 className="w-5 h-5 text-emerald-400" />}
                  label="Issuing Institution"
                  name={MOCK_CREDENTIAL.issuerName}
                  address={MOCK_CREDENTIAL.issuerAddress}
                  verified={true}
                />
                <InfoBox 
                  icon={<User className="w-5 h-5 text-sky-400" />}
                  label="Credential Holder"
                  name={MOCK_CREDENTIAL.holderName}
                  address={MOCK_CREDENTIAL.holderAddress}
                />
                
                <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-sky-500/10 border border-emerald-500/20">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2">Verification Notice</h4>
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    This credential has been cryptographically signed by the issuer and anchored to the blockchain. Any tampering with the data would result in a verification failure.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-12">
              <Link href="/" className="text-sm font-bold text-slate-600 hover:text-white transition-colors flex items-center gap-2">
                Report an issue with this verification
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

function EvidenceRow({ label, value }: { label: string, value: string }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{label}</span>
        <button className="text-slate-600 hover:text-white transition-colors">
          <Copy className="w-3 h-3" />
        </button>
      </div>
      <div className="p-3 bg-black/40 rounded-xl border border-white/5 font-mono text-[10px] text-slate-400 break-all leading-relaxed">
        {value}
      </div>
    </div>
  )
}

function InfoBox({ icon, label, name, address, verified }: { icon: React.ReactNode, label: string, name: string, address: string, verified?: boolean }) {
  return (
    <div className="glass-card p-6 border-white/5">
      <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-4">{label}</div>
      <div className="flex items-center gap-4 mb-4">
        <div className="p-2.5 bg-white/5 rounded-xl border border-white/5">
          {icon}
        </div>
        <div>
          <div className="font-bold flex items-center gap-2">
            {name}
            {verified && <CheckCircle2 className="w-3 h-3 text-emerald-500" />}
          </div>
          <div className="text-[10px] text-slate-500 font-medium">Verified Identity</div>
        </div>
      </div>
      <div className="pt-4 border-t border-white/5">
        <div className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mb-1">Wallet Address</div>
        <div className="font-mono text-[10px] text-slate-500">{formatAddress(address)}</div>
      </div>
    </div>
  )
}
