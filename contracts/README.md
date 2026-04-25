# Universal Skill Passport - Smart Contract

## Overview

Decentralized registry for verifiable skill credentials. Stores minimal on-chain data (hashes, references, status) for trust layer while keeping full credential content off-chain for privacy.

## Contract: `UniversalSkillPassport.sol`

### Features

- **Issuer Registry**: Register and verify credential issuers
- **Credential Issuance**: Issue credentials with cryptographic hash anchoring
- **Batch Issuance**: Issue multiple credentials in one transaction (up to 50)
- **Revocation**: Issuers can revoke credentials
- **Verification**: Public verification of credential validity
- **Expiry Management**: Optional expiry dates with update capability
- **Analytics**: Track verification counts

### Key Functions

#### Issuer Management
- `registerIssuer(string name)` - Register as credential issuer
- `updateIssuerName(string newName)` - Update issuer name
- `verifyIssuer(address issuer)` - Admin verifies trusted issuer
- `getIssuerInfo(address issuer)` - Get issuer details

#### Credential Issuance
- `issueCredential(credentialId, hash, holder, expiresAt)` - Issue single credential
- `batchIssueCredentials(ids, hashes, holders, expiries)` - Batch issue up to 50 credentials

#### Credential Management
- `revokeCredential(credentialId)` - Revoke a credential (issuer only)
- `updateExpiry(credentialId, newExpiresAt)` - Update expiry date

#### Verification
- `verifyCredential(credentialId)` - Verify credential and get full details
- `isCredentialValid(credentialId)` - Quick validity check
- `getCredentialRecord(credentialId)` - Get credential data

#### Queries
- `getHolderCredentials(holder)` - Get all credentials for a holder
- `getIssuerCredentials(issuer)` - Get all credentials issued by issuer
- `getHolderCredentialCount(holder)` - Count holder's credentials
- `getIssuerCredentialCount(issuer)` - Count issuer's credentials

### Data Structures

```solidity
struct IssuerInfo {
    string name;
    bool registered;
    uint256 registeredAt;
    uint256 totalIssued;
    uint256 totalRevoked;
}

struct CredentialRecord {
    bytes32 credentialHash;      // keccak256(credential data)
    address issuer;
    address holder;
    uint256 issuedAt;
    uint256 expiresAt;           // 0 = no expiry
    bool revoked;
    uint256 revokedAt;
    uint256 verificationCount;
}
```

### Events

- `IssuerRegistered(issuer, name, timestamp)`
- `IssuerVerified(issuer, timestamp)`
- `CredentialIssued(credentialId, issuer, holder, hash, timestamp)`
- `CredentialRevoked(credentialId, issuer, timestamp)`
- `CredentialVerified(credentialId, timestamp)`
- `ExpiryUpdated(credentialId, newExpiresAt, timestamp)`

## Testing

Comprehensive test suite with 26 tests covering:
- Issuer registration and verification
- Credential issuance (single and batch)
- Revocation
- Verification (valid, revoked, expired)
- Access control
- Edge cases and error handling

### Run Tests

```bash
forge test -vv
```

### Test Results

```
Ran 26 tests for test/UniversalSkillPassport.t.sol:UniversalSkillPassportTest
[PASS] 26 tests passed
```

## Deployment

### Prerequisites

1. Install Foundry:
```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

2. Set environment variables:
```bash
export PRIVATE_KEY=your_private_key
export RITUAL_RPC_URL=https://rpc.ritualfoundation.org
```

### Deploy to Ritual Testnet

```bash
forge script script/Deploy.s.sol \
  --rpc-url $RITUAL_RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast \
  --verify
```

### Verify Contract

```bash
forge verify-contract \
  --chain-id 1979 \
  --compiler-version 0.8.20 \
  <CONTRACT_ADDRESS> \
  src/UniversalSkillPassport.sol:UniversalSkillPassport
```

## Gas Optimization

- Optimized storage layout
- Batch operations for multiple credentials
- Efficient mappings for queries
- Minimal on-chain data storage

### Gas Estimates

- Register Issuer: ~94,000 gas
- Issue Credential: ~310,000 gas
- Batch Issue (10 credentials): ~1,200,000 gas
- Revoke Credential: ~378,000 gas
- Verify Credential: ~330,000 gas

## Security Considerations

- **Access Control**: Only issuers can revoke their own credentials
- **Input Validation**: All inputs validated (non-zero addresses, valid hashes, etc.)
- **Reentrancy Protection**: State changes before external calls
- **Unique IDs**: Credential IDs must be unique
- **Expiry Validation**: Expiry dates must be in future or 0
- **Batch Limits**: Max 50 credentials per batch to prevent gas issues

## Privacy Design

**On-Chain** (public):
- Credential hash (for tamper detection)
- Issuer address
- Holder address
- Timestamps
- Revocation status
- Verification count

**Off-Chain** (private):
- Holder name
- Credential details
- Skills data
- Evidence links
- Personal information

This design ensures:
- Cryptographic verification
- Privacy protection
- Minimal gas costs
- GDPR compliance potential

## Integration Guide

### Issue a Credential

```solidity
// 1. Register as issuer
passport.registerIssuer("MIT University");

// 2. Generate credential hash off-chain
bytes32 hash = keccak256(abi.encodePacked(
    credentialData.title,
    credentialData.description,
    credentialData.skills,
    // ... other fields
));

// 3. Issue credential
passport.issueCredential(
    "cred-uuid-123",
    hash,
    holderAddress,
    block.timestamp + 365 days  // expires in 1 year
);
```

### Verify a Credential

```solidity
// Check if valid
bool valid = passport.isCredentialValid("cred-uuid-123");

// Get full details
(
    bool valid,
    bool revoked,
    bool expired,
    address issuer,
    address holder,
    bytes32 hash
) = passport.verifyCredential("cred-uuid-123");

// Verify hash matches off-chain data
bytes32 computedHash = keccak256(abi.encodePacked(offChainData));
require(computedHash == hash, "Credential tampered");
```

### Revoke a Credential

```solidity
// Only issuer can revoke
passport.revokeCredential("cred-uuid-123");
```

## License

MIT

## Contact

For questions or issues, please open a GitHub issue.
