# Skill Passport DApp - Product Concept

## Core Value Proposition
**Verifiable, portable, tamper-evident skill credentials on blockchain**

Replace fragile PDFs and screenshots with cryptographically verifiable skill proofs that issuers can issue, holders can own, and verifiers can trust instantly.

---

## Why Blockchain?

### Problems Solved
1. **Credential Fraud** - Fake certificates, edited PDFs, photoshopped badges
2. **Fragmented Proof** - Skills scattered across platforms, emails, screenshots
3. **Slow Verification** - Manual checks, phone calls, waiting days for confirmation
4. **No Revocation** - Can't revoke fake or outdated credentials
5. **Trust Gap** - No way to verify issuer authenticity

### Blockchain Value (NOT a normal web app)
- **Issuer Identity Anchoring** - Wallet = cryptographic issuer identity
- **Proof of Issuance** - Immutable timestamp + issuer signature
- **Credential Hash** - Tamper detection via on-chain hash
- **Revocation Status** - Real-time revocation check
- **Verification Integrity** - Anyone can verify without asking issuer

**Privacy-First**: Only hashes, IDs, and metadata on-chain. Full data off-chain.

---

## 3-Party Model

### 1. Issuer
**Who**: Bootcamp, employer, mentor, community admin, certification body

**Actions**:
- Connect wallet (issuer identity)
- Create skill credential
- Issue to holder's wallet
- Revoke if needed (fraud, expiry, policy change)

**Example**: QA bootcamp issues "Manual Testing Certificate" to graduate

---

### 2. Holder
**Who**: Learner, job seeker, freelancer, professional

**Actions**:
- View Skill Passport dashboard
- See all received credentials
- Generate verification link/QR
- Share with recruiters
- Check credential status

**Example**: Graduate shares passport link with recruiter

---

### 3. Verifier
**Who**: Recruiter, HR, client, community reviewer, hiring manager

**Actions**:
- Open verification page (no login needed)
- Check credential validity
- See issuer, date, skill details
- Verify hash match
- Check revocation status

**Example**: Recruiter verifies candidate's QA certificate in 10 seconds

---

## Information Architecture

```
/
├── Landing Page
│   ├── Hero: "Verifiable Skill Credentials on Blockchain"
│   ├── Why Blockchain section
│   ├── 3-party model explainer
│   ├── Demo credentials showcase
│   └── CTA: Connect Wallet
│
├── /issuer
│   ├── Dashboard
│   │   ���── Issued credentials list
│   │   ├── Issue new credential button
│   │   └── Stats: total issued, active, revoked
│   ├── /issue
│   │   └── Issue Credential Form
│   └── /manage
│       └── Revoke credential action
│
├── /passport/:walletAddress
│   ├── Holder Dashboard
│   │   ├── Credential cards grid
│   │   ├── Filter by category
│   │   ├── AI Skills Summary panel
│   │   └── Share verification link
│   └── /credential/:id
│       └── Credential Detail Modal
│
├── /verify/:credentialId
│   ├── Verification Page
│   │   ├── Status badge (Valid/Revoked/Invalid)
│   │   ├── Issuer info
│   │   ├── Holder info
│   │   ├── Skill details
│   │   ├── Issue date / expiry
│   │   ├── Hash verification
│   │   └── Evidence link
│   └── QR code view
│
└── /demo
    └── Pre-loaded demo scenario with sample credentials
```

---

## Smart Contract Scope

### Contract: `SkillPassportRegistry.sol`

**Purpose**: Minimal on-chain registry for credential trust layer

**Storage** (on-chain):
```solidity
struct Credential {
    bytes32 credentialHash;      // keccak256(credential data)
    address issuer;              // issuer wallet
    address holder;              // holder wallet
    uint256 issuedAt;           // timestamp
    uint256 expiresAt;          // 0 = no expiry
    bool revoked;               // revocation flag
    string credentialId;        // unique ID (IPFS CID or UUID)
}

mapping(string => Credential) public credentials;
mapping(address => string[]) public holderCredentials;
mapping(address => string[]) public issuerCredentials;
```

**Functions**:
- `issueCredential(credentialId, hash, holder, expiresAt)` - Issuer only
- `revokeCredential(credentialId)` - Issuer only
- `verifyCredential(credentialId)` - Public view
- `getHolderCredentials(holder)` - Public view
- `getIssuerCredentials(issuer)` - Public view

**Events**:
- `CredentialIssued(credentialId, issuer, holder, hash)`
- `CredentialRevoked(credentialId, issuer)`

**Off-chain** (app state / IPFS / mock storage):
- Holder name
- Skill category
- Skill name
- Score/level
- Issuer name
- Evidence link
- Description
- Metadata

---

## Data Schema

### Credential Object (off-chain)
```typescript
interface SkillCredential {
  // On-chain anchored
  credentialId: string          // UUID or IPFS CID
  credentialHash: string        // keccak256 hash
  issuer: string                // wallet address
  holder: string                // wallet address
  issuedAt: number              // timestamp
  expiresAt: number             // timestamp or 0
  revoked: boolean
  
  // Off-chain data
  holderName: string
  issuerName: string
  skillCategory: string         // "QA Testing", "Development", "Design"
  skillName: string             // "Manual Testing", "API Testing"
  level: string                 // "Beginner", "Intermediate", "Advanced"
  score?: number                // 0-100
  description: string
  evidenceLink?: string         // GitHub, portfolio, project link
  metadata?: Record<string, any>
}
```

### Skill Categories (demo)
- QA Testing
- Development
- Design
- Community Management
- Bug Bounty
- Internship
- Mentorship

---

## UI Screens List

### 1. Landing Page
- Hero section
- "Why Blockchain?" explainer
- 3-party model diagram
- Demo credentials carousel
- Connect Wallet CTA

### 2. Issuer Dashboard
- Issued credentials table
- Stats cards
- "Issue New Credential" button
- Search/filter

### 3. Issue Credential Form
- Recipient wallet input
- Holder name
- Skill category dropdown
- Skill name
- Level/score
- Issue date (auto)
- Expiry date (optional)
- Evidence link
- Description
- Submit button

### 4. Holder Passport
- Credential cards grid
- Filter by category
- AI Skills Summary panel
- Share link generator
- Empty state for new holders

### 5. Credential Detail Modal
- Full credential info
- Verification status
- Issuer details
- Evidence link
- Share/verify button

### 6. Verification Page
- Large status badge (Valid/Revoked/Invalid)
- Credential details
- Issuer info
- Hash verification result
- Issue/expiry dates
- QR code
- "Verified on Ritual Testnet" badge

### 7. Demo Page
- Pre-loaded scenario
- Sample credentials
- Role switcher (Issuer/Holder/Verifier)
- Guided walkthrough

---

## MVP Build Plan

### Phase 1: Smart Contract (Day 1)
- [ ] Write `SkillPassportRegistry.sol`
- [ ] Add issuer-only modifiers
- [ ] Implement credential hash storage
- [ ] Add revocation logic
- [ ] Write deployment script
- [ ] Deploy to Ritual testnet
- [ ] Verify contract

### Phase 2: Frontend Foundation (Day 1-2)
- [ ] Next.js + TypeScript setup
- [ ] Wagmi + RainbowKit integration
- [ ] Ritual testnet config
- [ ] Contract ABI integration
- [ ] Wallet connection
- [ ] Role detection (issuer/holder/verifier)

### Phase 3: Issuer Flow (Day 2)
- [ ] Issuer dashboard UI
- [ ] Issue credential form
- [ ] Generate credential hash
- [ ] Call `issueCredential` contract function
- [ ] Store off-chain data (mock/localStorage)
- [ ] Success confirmation
- [ ] Issued credentials list

### Phase 4: Holder Flow (Day 2-3)
- [ ] Passport dashboard UI
- [ ] Fetch holder credentials from contract
- [ ] Credential cards display
- [ ] Filter by category
- [ ] Credential detail modal
- [ ] Share link generator
- [ ] Empty state

### Phase 5: Verifier Flow (Day 3)
- [ ] Verification page UI
- [ ] Fetch credential by ID
- [ ] Verify hash match
- [ ] Check revocation status
- [ ] Display issuer/holder info
- [ ] QR code generation
- [ ] Public access (no wallet needed)

### Phase 6: AI Layer (Day 3)
- [ ] AI Skills Summary component
- [ ] Summarize holder's verified credentials
- [ ] Job-role fit suggestions
- [ ] Skill insights panel
- [ ] Use Ritual AI precompile (optional)

### Phase 7: Demo & Polish (Day 4)
- [ ] Create demo credentials
- [ ] Demo scenario page
- [ ] Landing page content
- [ ] Light/dark mode
- [ ] Responsive design
- [ ] Empty states
- [ ] Loading states
- [ ] Error handling
- [ ] Toast notifications

### Phase 8: Testnet Submission (Day 4)
- [ ] README with demo instructions
- [ ] Video walkthrough
- [ ] Deployment guide
- [ ] Contract verification
- [ ] Live demo link
- [ ] GitHub repo cleanup

---

## Demo Scenario

### Sample Credentials

1. **QA Manual Testing Certificate**
   - Issuer: QA Bootcamp Academy
   - Holder: Alice (0x123...)
   - Category: QA Testing
   - Level: Intermediate
   - Score: 85/100
   - Evidence: GitHub test cases repo

2. **API Testing Badge**
   - Issuer: Tech Training Institute
   - Holder: Alice
   - Category: QA Testing
   - Level: Advanced
   - Evidence: Postman collection link

3. **Community Moderator Credential**
   - Issuer: DevCommunity DAO
   - Holder: Bob (0x456...)
   - Category: Community Management
   - Level: Expert
   - Evidence: Discord server stats

4. **Internship Completion Proof**
   - Issuer: StartupXYZ
   - Holder: Charlie (0x789...)
   - Category: Development
   - Level: Beginner
   - Evidence: Project portfolio

5. **Bug Bounty Participation**
   - Issuer: BugBounty Platform
   - Holder: Alice
   - Category: Bug Bounty
   - Level: Intermediate
   - Evidence: HackerOne profile

### Demo Flow
1. **Issuer**: QA Bootcamp issues certificate to Alice
2. **Holder**: Alice views her Skill Passport (2 QA credentials)
3. **AI Summary**: "Alice is an Intermediate-Advanced QA Tester with verified Manual and API testing skills"
4. **Verifier**: Recruiter opens Alice's verification link
5. **Result**: ✅ Valid, issued by QA Bootcamp, hash verified, not revoked
6. **Revocation**: Bootcamp revokes fake credential (demo)
7. **Re-verify**: ❌ Revoked status shown

---

## Success Criteria

### Reviewer Should Immediately Understand:

✅ **Why blockchain?**
- Tamper-proof credential hash
- Issuer identity anchoring
- Real-time revocation
- No central authority needed

✅ **Why not a normal web app?**
- Web app = issuer can edit/delete records
- Blockchain = immutable proof, cryptographic trust
- Web app = single point of failure
- Blockchain = portable across platforms

✅ **How parties interact?**
- Issuer → issues credential → on-chain hash + off-chain data
- Holder → receives → views in passport
- Verifier → checks → instant verification without asking issuer

✅ **How trust is improved?**
- PDF = easily faked
- Screenshot = trivial to edit
- Blockchain credential = cryptographically verifiable, issuer-signed, tamper-evident

---

## Technical Stack

### Smart Contract
- Solidity 0.8.x
- Foundry for testing/deployment
- Ritual testnet

### Frontend
- Next.js 15 + TypeScript
- Wagmi + Viem
- RainbowKit
- TailwindCSS
- shadcn/ui components
- Recharts for stats
- QR code generation

### Off-chain Storage (MVP)
- localStorage (demo)
- Future: IPFS, Ceramic, or encrypted cloud

### AI (Optional)
- Ritual AI precompile for skill summarization
- Or OpenAI API for demo

---

## Next Steps

Boss mau saya mulai dari mana?

1. **Smart contract dulu** - biar foundation solid
2. **Frontend skeleton** - biar bisa visualize flow
3. **Full build sekaligus** - saya delegate ke Luna

Pilih Boss! 🚀
