'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import Link from 'next/link'
import { Shield, ArrowRight, Check, Award, Globe, Lock, Zap } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-sky-500/30">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-sky-500/10 blur-[120px] rounded-full animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full animate-pulse-slow" />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/40 backdrop-blur-md">
        <div className="container mx-auto px-6 h-20 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-all group">
            <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-sky-500/20 group-hover:scale-110 transition-transform">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
              Skill Passport
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-white/60">
              <Link href="/issuer" className="hover:text-white transition-colors">Issuers</Link>
              <Link href="/holder" className="hover:text-white transition-colors">Holders</Link>
              <Link href="/verify" className="hover:text-white transition-colors">Verify</Link>
            </nav>
            <div className="h-6 w-[1px] bg-white/10 hidden md:block" />
            <ConnectButton />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-44 pb-32 px-6">
        <div className="container mx-auto max-w-5xl text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sky-400 text-xs font-semibold uppercase tracking-widest mb-8 animate-float">
            <Zap className="w-3 h-3" />
            Verified on Ritual Testnet
          </div>
          <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-[0.9]">
            YOUR PROFESSIONAL <br />
            <span className="gradient-text">LEGACY ON-CHAIN</span>
          </h1>
          <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            The world's first decentralized credential infrastructure. <br className="hidden md:block" />
            Tamper-proof certificates, portable identity, instant global verification.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/issuer"
              className="primary-button text-lg px-10 py-4 w-full sm:w-auto"
            >
              Start Issuing
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/holder"
              className="secondary-button text-lg px-10 py-4 w-full sm:w-auto"
            >
              View My Passport
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 px-6 relative">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-4">Built for Trust</h2>
            <p className="text-slate-400">Revolutionizing how professional achievements are managed.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Award className="w-8 h-8 text-sky-400" />}
              title="Immutable Issuance"
              description="University and employers anchor credentials directly to your wallet with cryptographic signatures."
            />
            <FeatureCard 
              icon={<Globe className="w-8 h-8 text-purple-400" />}
              title="Global Portability"
              description="Carry your achievements anywhere. Your data is not locked in any proprietary platform."
            />
            <FeatureCard 
              icon={<Lock className="w-8 h-8 text-emerald-400" />}
              title="Privacy First"
              description="Sensitive data stays off-chain. Only hashes are stored for verification, giving you full control."
            />
          </div>
        </div>
      </section>

      {/* Stats / Proof */}
      <section className="py-20 px-6 border-y border-white/5 bg-white/[0.02]">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            <StatItem value="100%" label="Tamper Proof" />
            <StatItem value="0s" label="Verification Time" />
            <StatItem value="∞" label="Lifespan" />
            <StatItem value="Ritual" label="Network" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-white/5 relative overflow-hidden">
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="space-y-4 text-center md:text-left">
              <Link href="/" className="flex items-center gap-3 justify-center md:justify-start">
                <Shield className="w-6 h-6 text-sky-500" />
                <span className="text-lg font-bold">Skill Passport</span>
              </Link>
              <p className="text-sm text-slate-500 max-w-xs">
                Empowering the future of professional identity with blockchain technology.
              </p>
            </div>
            <div className="flex gap-12">
              <FooterColumn title="Platform" links={['Issuers', 'Holders', 'Verify']} />
              <FooterColumn title="Resources" links={['Docs', 'Privacy', 'Security']} />
              <FooterColumn title="Social" links={['X', 'GitHub', 'Discord']} />
            </div>
          </div>
          <div className="mt-20 pt-8 border-t border-white/5 text-center text-xs text-slate-600">
            © 2026 Skill Passport. Built on Ritual Testnet.
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="glass-card p-8 hover:bg-white/[0.05] transition-all group border-white/5">
      <div className="mb-6 p-4 rounded-2xl bg-white/5 w-fit group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
    </div>
  )
}

function StatItem({ value, label }: { value: string, label: string }) {
  return (
    <div>
      <div className="text-4xl font-black gradient-text mb-1">{value}</div>
      <div className="text-xs uppercase tracking-widest text-slate-500 font-bold">{label}</div>
    </div>
  )
}

function FooterColumn({ title, links }: { title: string, links: string[] }) {
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-bold text-white uppercase tracking-wider">{title}</h4>
      <ul className="space-y-2">
        {links.map(link => (
          <li key={link}>
            <a href="#" className="text-sm text-slate-500 hover:text-sky-400 transition-colors">{link}</a>
          </li>
        ))}
      </ul>
    </div>
  )
}
