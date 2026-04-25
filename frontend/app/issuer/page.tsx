'use client'

import { useState } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import { Shield, Plus, Award, Users, CheckCircle, AlertCircle, ArrowRight, Save, Trash2, Send, History, BarChart3 } from 'lucide-react'
import Link from 'next/link'

export default function IssuerPage() {
  const { isConnected } = useAccount()
  const [activeTab, setActiveTab] = useState<'issue' | 'history' | 'analytics'>('issue')

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center px-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="text-center space-y-8 relative z-10 max-w-md">
          <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center mx-auto animate-float shadow-2xl shadow-purple-500/20">
            <Plus className="w-10 h-10 text-purple-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-3 tracking-tight">Issuer Authorization</h1>
            <p className="text-slate-400 mb-8 leading-relaxed">Connect your institutional wallet to issue and manage verifiable credentials for your organization.</p>
            <div className="flex justify-center">
              <ConnectButton />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-purple-500/30">
      <header className="border-b border-white/5 bg-black/40 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-all">
            <Shield className="w-5 h-5 text-purple-400" />
            <span className="font-bold tracking-tight">Skill Passport <span className="text-[10px] bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full ml-2 uppercase">Issuer</span></span>
          </Link>
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
              <button onClick={() => setActiveTab('issue')} className={activeTab === 'issue' ? 'text-white' : 'hover:text-white transition-colors'}>Issue</button>
              <button onClick={() => setActiveTab('history')} className={activeTab === 'history' ? 'text-white' : 'hover:text-white transition-colors'}>History</button>
              <button onClick={() => setActiveTab('analytics')} className={activeTab === 'analytics' ? 'text-white' : 'hover:text-white transition-colors'}>Analytics</button>
            </nav>
            <div className="h-6 w-[1px] bg-white/10 hidden md:block" />
            <ConnectButton />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 max-w-6xl">
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <QuickStat icon={<Award className="w-6 h-6" />} label="Total Issued" value="1,284" color="text-sky-400" />
          <QuickStat icon={<Users className="w-6 h-6" />} label="Active Holders" value="942" color="text-purple-400" />
          <QuickStat icon={<BarChart3 className="w-6 h-6" />} label="Verification Rate" value="94.2%" color="text-emerald-400" />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form Area */}
          <div className="lg:col-span-2 space-y-8">
            <div className="glass-card p-8 border-white/5">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-purple-500/10 rounded-2xl border border-purple-500/20">
                  <Send className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">Issue New Credential</h2>
                  <p className="text-sm text-slate-500">The data will be hashed and anchored to the blockchain.</p>
                </div>
              </div>

              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <FormGroup label="Holder Wallet Address" placeholder="0x..." />
                  <FormGroup label="Holder Full Name" placeholder="Alice Johnson" />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Credential Title</label>
                    <input type="text" placeholder="e.g. Senior Software Engineer" className="form-input" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Credential Type</label>
                    <select className="form-input appearance-none">
                      <option>Certificate</option>
                      <option>Degree</option>
                      <option>License</option>
                      <option>Award</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Skill Tags (Separated by comma)</label>
                  <input type="text" placeholder="React, Solidity, Team Lead..." className="form-input" />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Additional Evidence Link (Optional)</label>
                  <input type="url" placeholder="https://..." className="form-input" />
                </div>

                <div className="pt-6 border-t border-white/5 flex gap-4">
                  <button type="button" className="secondary-button flex-1">
                    <Save className="w-4 h-4" />
                    Save Draft
                  </button>
                  <button type="submit" className="primary-button !bg-purple-600 hover:!bg-purple-500 flex-1 !shadow-purple-500/20">
                    <Award className="w-4 h-4" />
                    Issue Credential
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-6">
            <div className="glass-card p-6 border-white/5">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <History className="w-5 h-5 text-slate-400" />
                Recent History
              </h3>
              <div className="space-y-4">
                <HistoryItem name="Alice J." title="Senior Developer" time="2m ago" status="success" />
                <HistoryItem name="Bob S." title="Project Manager" time="1h ago" status="success" />
                <HistoryItem name="Charlie M." title="UI Designer" time="5h ago" status="pending" />
                <HistoryItem name="Dana K." title="Data Analyst" time="Yesterday" status="success" />
              </div>
              <button className="w-full mt-6 text-sm font-bold text-purple-400 hover:text-purple-300 transition-colors flex items-center justify-center gap-2">
                View All Activity
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="glass-card p-6 border-purple-500/20 bg-purple-500/[0.03]">
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-purple-400" />
                Revocation Portal
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">
                Need to invalidate a credential? Use the revocation portal to mark a record as revoked on-chain.
              </p>
              <button className="w-full py-3 bg-white/5 hover:bg-rose-500/10 border border-white/10 hover:border-rose-500/20 rounded-xl text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-rose-400 transition-all">
                Access Portal
              </button>
            </div>
          </div>
        </div>
      </main>

      <style jsx global>{`
        .form-input {
          width: 100%;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 12px 16px;
          font-size: 0.875rem;
          color: white;
          transition: all 0.2s;
        }
        .form-input:focus {
          outline: none;
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(139, 92, 246, 0.5);
          box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.1);
        }
      `}</style>
    </div>
  )
}

function FormGroup({ label, placeholder }: { label: string, placeholder: string }) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold uppercase tracking-widest text-slate-500">{label}</label>
      <input type="text" placeholder={placeholder} className="form-input" />
    </div>
  )
}

function QuickStat({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: string, color: string }) {
  return (
    <div className="glass-card p-6 border-white/5 flex items-center gap-6">
      <div className={`p-4 bg-white/5 rounded-2xl border border-white/5 ${color}`}>
        {icon}
      </div>
      <div>
        <div className="text-2xl font-black tracking-tight">{value}</div>
        <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{label}</div>
      </div>
    </div>
  )
}

function HistoryItem({ name, title, time, status }: { name: string, title: string, time: string, status: 'success' | 'pending' | 'failed' }) {
  return (
    <div className="flex items-center justify-between group">
      <div className="flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full ${status === 'success' ? 'bg-emerald-500' : status === 'pending' ? 'bg-amber-500' : 'bg-rose-500'}`} />
        <div>
          <div className="text-sm font-bold group-hover:text-purple-400 transition-colors">{name}</div>
          <div className="text-[10px] text-slate-500 uppercase tracking-widest">{title}</div>
        </div>
      </div>
      <div className="text-[10px] text-slate-600 font-bold">{time}</div>
    </div>
  )
}
