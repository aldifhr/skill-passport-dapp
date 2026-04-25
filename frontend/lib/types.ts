export type CredentialType =
  | 'degree'
  | 'certificate'
  | 'license'
  | 'training'
  | 'internship'
  | 'employment'
  | 'project'
  | 'volunteer'
  | 'membership'
  | 'micro-credential'
  | 'assessment'

export type CredentialStatus = 'valid' | 'expired' | 'revoked'

export type UserRole = 'issuer' | 'holder' | 'verifier'

export interface Credential {
  id: string
  title: string
  type: CredentialType
  description?: string
  issuerAddress: string
  issuerName: string
  holderAddress: string
  holderName?: string
  skills: string[]
  issuedAt: number
  expiresAt?: number
  revokedAt?: number
  status: CredentialStatus
  hash: string
  evidenceLink?: string
  verificationCount: number
}

export interface IssuerInfo {
  address: string
  name: string
  registered: boolean
  verified: boolean
  registeredAt: number
  totalIssued: number
  totalRevoked: number
}

export interface CredentialFormData {
  id: string
  title: string
  type: CredentialType
  description: string
  holderAddress: string
  holderName: string
  skills: string[]
  issuedAt: Date
  expiresAt?: Date
  evidenceLink?: string
}
