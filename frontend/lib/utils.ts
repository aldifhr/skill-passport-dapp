import { keccak256, encodePacked } from 'viem'
import type { Credential, CredentialFormData, CredentialStatus } from './types'

/**
 * Generate credential hash from form data
 * This hash will be stored on-chain for verification
 */
export function generateCredentialHash(data: CredentialFormData): `0x${string}` {
  const packed = encodePacked(
    ['string', 'string', 'string', 'string', 'string', 'uint256'],
    [
      data.id,
      data.title,
      data.type,
      data.description,
      data.skills.join(','),
      BigInt(Math.floor(data.issuedAt.getTime() / 1000))
    ]
  )
  return keccak256(packed)
}

/**
 * Determine credential status based on on-chain data
 */
export function getCredentialStatus(
  revoked: boolean,
  expiresAt: number
): CredentialStatus {
  if (revoked) return 'revoked'
  if (expiresAt > 0 && expiresAt < Date.now() / 1000) return 'expired'
  return 'valid'
}

/**
 * Format address for display
 */
export function formatAddress(address: string): string {
  if (!address) return ''
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

/**
 * Format date for display (handles both seconds and milliseconds)
 */
export function formatDate(timestamp: number): string {
  if (!timestamp) return 'N/A'
  // If timestamp is in seconds (e.g. 1714041600), convert to ms
  const ms = timestamp < 10000000000 ? timestamp * 1000 : timestamp
  return new Date(ms).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

/**
 * Generate UUID for credential ID
 */
export function generateUUID(): string {
  return 'cred-' + crypto.randomUUID()
}

/**
 * Get verification URL for credential
 */
export function getVerificationUrl(credentialId: string): string {
  if (typeof window === 'undefined') return ''
  return `${window.location.origin}/verify/${credentialId}`
}

/** Alias for compatibility */
export const getVerificationURL = getVerificationUrl

/**
 * Credential type labels
 */
export const CREDENTIAL_TYPE_LABELS: Record<string, string> = {
  degree: 'Academic Degree',
  certificate: 'Certificate',
  license: 'Professional License',
  training: 'Training Completion',
  internship: 'Internship',
  employment: 'Employment Verification',
  project: 'Project Completion',
  volunteer: 'Volunteer Work',
  membership: 'Membership',
  'micro-credential': 'Micro-Credential',
  assessment: 'Assessment Badge'
}

/**
 * Credential type options for select dropdown
 */
export const CREDENTIAL_TYPE_OPTIONS = [
  { value: 'degree', label: 'Academic Degree' },
  { value: 'certificate', label: 'Certificate' },
  { value: 'license', label: 'Professional License' },
  { value: 'training', label: 'Training Completion' },
  { value: 'internship', label: 'Internship' },
  { value: 'employment', label: 'Employment Verification' },
  { value: 'project', label: 'Project Completion' },
  { value: 'volunteer', label: 'Volunteer Work' },
  { value: 'membership', label: 'Membership' },
  { value: 'micro-credential', label: 'Micro-Credential' },
  { value: 'assessment', label: 'Assessment Badge' }
]

/**
 * Common skill tags for autocomplete
 */
export const COMMON_SKILLS = [
  'JavaScript',
  'TypeScript',
  'React',
  'Next.js',
  'Node.js',
  'Python',
  'Solidity',
  'Smart Contracts',
  'Web3',
  'Blockchain',
  'DeFi',
  'NFT',
  'API Development',
  'Database Design',
  'DevOps',
  'CI/CD',
  'Docker',
  'Kubernetes',
  'AWS',
  'Azure',
  'GCP',
  'Machine Learning',
  'AI',
  'Data Science',
  'UI/UX Design',
  'Figma',
  'Project Management',
  'Agile',
  'Scrum',
  'Technical Writing',
  'Community Management',
  'Security Auditing',
  'Penetration Testing',
]
