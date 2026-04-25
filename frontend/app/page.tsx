'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import Link from 'next/link'
import { Shield, ArrowRight, Check } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-gray-800/50 bg-black/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 h-16 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Shield className="w-5 h-5" />
            <span className="font-medium">Skill Passport</span>
          </Link>
          <ConnectButton />
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 tracking-tight">
            Verifiable<br/>Credentials
          </h1>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Professional credentials on blockchain. Tamper-proof, portable, instantly verifiable.
          </p>
          <div className="flex gap-4 justify-center">
            <Link 
              href="/issuer"
              className="px-8 py-3 bg-white text-black font-medium rounded-full hover:bg-gray-200 transition-colors inline-flex items-center gap-2"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              href="/holder"
              className="px-8 py-3 border border-gray-700 font-medium rounded-full hover:border-gray-500 transition-colors"
            >
              View Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6 border-t border-gray-800">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center mb-4">
                <Check className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold">Issue</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Create verifiable credentials for students, employees, or members.
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center mb-4">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold">Hold</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Own your professional records. Share verification links on demand.
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center mb-4">
                <Check className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold">Verify</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Instant cryptographic proof. No emails, no manual checks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Blockchain - Compact */}
      <section className="py-20 px-6 border-t border-gray-800">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold mb-12 text-center">Why Blockchain</h2>
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
            <div className="flex gap-4">
              <div className="w-1 h-1 rounded-full bg-white mt-2 flex-shrink-0" />
              <div>
                <div className="font-medium mb-1">Tamper-proof</div>
                <div className="text-sm text-gray-400">Immutable credential hashes</div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="w-1 h-1 rounded-full bg-white mt-2 flex-shrink-0" />
              <div>
                <div className="font-medium mb-1">Cryptographic proof</div>
                <div className="text-sm text-gray-400">Verifiable issuer signatures</div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="w-1 h-1 rounded-full bg-white mt-2 flex-shrink-0" />
              <div>
                <div className="font-medium mb-1">Instant revocation</div>
                <div className="text-sm text-gray-400">Real-time status updates</div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="w-1 h-1 rounded-full bg-white mt-2 flex-shrink-0" />
              <div>
                <div className="font-medium mb-1">Portable identity</div>
                <div className="text-sm text-gray-400">Not locked to any platform</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 px-6 mt-20">
        <div className="container mx-auto flex justify-between items-center text-sm text-gray-500">
          <div>Skill Passport · Ritual Testnet</div>
          <div className="flex gap-6">
            <Link href="/issuer" className="hover:text-gray-300 transition-colors">Issuer</Link>
            <Link href="/holder" className="hover:text-gray-300 transition-colors">Holder</Link>
            <a href="https://github.com" className="hover:text-gray-300 transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
