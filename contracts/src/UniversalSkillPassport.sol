// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title UniversalSkillPassport
 * @notice Decentralized registry for verifiable skill credentials
 * @dev Stores minimal on-chain data (hashes, references, status) for trust layer
 *      Full credential content stored off-chain for privacy
 */
contract UniversalSkillPassport {
    
    // ============ Structs ============
    
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
    
    // ============ State Variables ============
    
    // Issuer registry
    mapping(address => IssuerInfo) public issuers;
    mapping(address => bool) public verifiedIssuers;  // Admin-verified issuers
    
    // Credential registry
    mapping(string => CredentialRecord) public credentials;
    mapping(address => string[]) private holderCredentialIds;
    mapping(address => string[]) private issuerCredentialIds;
    
    // Admin
    address public admin;
    
    // ============ Events ============
    
    event IssuerRegistered(
        address indexed issuer,
        string name,
        uint256 timestamp
    );
    
    event IssuerVerified(
        address indexed issuer,
        uint256 timestamp
    );
    
    event CredentialIssued(
        string indexed credentialId,
        address indexed issuer,
        address indexed holder,
        bytes32 credentialHash,
        uint256 timestamp
    );
    
    event CredentialRevoked(
        string indexed credentialId,
        address indexed issuer,
        uint256 timestamp
    );
    
    event CredentialVerified(
        string indexed credentialId,
        uint256 timestamp
    );
    
    event ExpiryUpdated(
        string indexed credentialId,
        uint256 newExpiresAt,
        uint256 timestamp
    );
    
    // ============ Modifiers ============
    
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }
    
    modifier onlyRegisteredIssuer() {
        require(issuers[msg.sender].registered, "Not a registered issuer");
        _;
    }
    
    modifier onlyCredentialIssuer(string memory credentialId) {
        require(
            credentials[credentialId].issuer == msg.sender,
            "Not the credential issuer"
        );
        _;
    }
    
    modifier credentialExists(string memory credentialId) {
        require(
            credentials[credentialId].issuer != address(0),
            "Credential does not exist"
        );
        _;
    }
    
    // ============ Constructor ============
    
    constructor() {
        admin = msg.sender;
    }
    
    // ============ Admin Functions ============
    
    function verifyIssuer(address issuer) external onlyAdmin {
        require(issuers[issuer].registered, "Issuer not registered");
        verifiedIssuers[issuer] = true;
        emit IssuerVerified(issuer, block.timestamp);
    }
    
    function unverifyIssuer(address issuer) external onlyAdmin {
        verifiedIssuers[issuer] = false;
    }
    
    function transferAdmin(address newAdmin) external onlyAdmin {
        require(newAdmin != address(0), "Invalid admin address");
        admin = newAdmin;
    }
    
    // ============ Issuer Management ============
    
    function registerIssuer(string memory name) external {
        require(!issuers[msg.sender].registered, "Already registered");
        require(bytes(name).length > 0, "Name cannot be empty");
        require(bytes(name).length <= 100, "Name too long");
        
        issuers[msg.sender] = IssuerInfo({
            name: name,
            registered: true,
            registeredAt: block.timestamp,
            totalIssued: 0,
            totalRevoked: 0
        });
        
        emit IssuerRegistered(msg.sender, name, block.timestamp);
    }
    
    function updateIssuerName(string memory newName) external onlyRegisteredIssuer {
        require(bytes(newName).length > 0, "Name cannot be empty");
        require(bytes(newName).length <= 100, "Name too long");
        
        issuers[msg.sender].name = newName;
    }
    
    function getIssuerInfo(address issuer) external view returns (IssuerInfo memory) {
        return issuers[issuer];
    }
    
    function isIssuerVerified(address issuer) external view returns (bool) {
        return verifiedIssuers[issuer];
    }
    
    // ============ Credential Issuance ============
    
    function issueCredential(
        string memory credentialId,
        bytes32 credentialHash,
        address holder,
        uint256 expiresAt
    ) external onlyRegisteredIssuer {
        require(bytes(credentialId).length > 0, "Credential ID cannot be empty");
        require(credentials[credentialId].issuer == address(0), "Credential ID already exists");
        require(credentialHash != bytes32(0), "Invalid credential hash");
        require(holder != address(0), "Invalid holder address");
        require(
            expiresAt == 0 || expiresAt > block.timestamp,
            "Expiry must be in future or 0"
        );
        
        credentials[credentialId] = CredentialRecord({
            credentialHash: credentialHash,
            issuer: msg.sender,
            holder: holder,
            issuedAt: block.timestamp,
            expiresAt: expiresAt,
            revoked: false,
            revokedAt: 0,
            verificationCount: 0
        });
        
        holderCredentialIds[holder].push(credentialId);
        issuerCredentialIds[msg.sender].push(credentialId);
        
        issuers[msg.sender].totalIssued++;
        
        emit CredentialIssued(
            credentialId,
            msg.sender,
            holder,
            credentialHash,
            block.timestamp
        );
    }
    
    function batchIssueCredentials(
        string[] memory credentialIds,
        bytes32[] memory credentialHashes,
        address[] memory holders,
        uint256[] memory expiresAts
    ) external onlyRegisteredIssuer {
        require(
            credentialIds.length == credentialHashes.length &&
            credentialIds.length == holders.length &&
            credentialIds.length == expiresAts.length,
            "Array length mismatch"
        );
        require(credentialIds.length > 0, "Empty arrays");
        require(credentialIds.length <= 50, "Batch too large"); // Gas limit protection
        
        for (uint256 i = 0; i < credentialIds.length; i++) {
            require(bytes(credentialIds[i]).length > 0, "Credential ID cannot be empty");
            require(credentials[credentialIds[i]].issuer == address(0), "Credential ID already exists");
            require(credentialHashes[i] != bytes32(0), "Invalid credential hash");
            require(holders[i] != address(0), "Invalid holder address");
            require(
                expiresAts[i] == 0 || expiresAts[i] > block.timestamp,
                "Expiry must be in future or 0"
            );
            
            credentials[credentialIds[i]] = CredentialRecord({
                credentialHash: credentialHashes[i],
                issuer: msg.sender,
                holder: holders[i],
                issuedAt: block.timestamp,
                expiresAt: expiresAts[i],
                revoked: false,
                revokedAt: 0,
                verificationCount: 0
            });
            
            holderCredentialIds[holders[i]].push(credentialIds[i]);
            issuerCredentialIds[msg.sender].push(credentialIds[i]);
            
            emit CredentialIssued(
                credentialIds[i],
                msg.sender,
                holders[i],
                credentialHashes[i],
                block.timestamp
            );
        }
        
        issuers[msg.sender].totalIssued += credentialIds.length;
    }
    
    // ============ Credential Management ============
    
    function revokeCredential(string memory credentialId)
        external
        credentialExists(credentialId)
        onlyCredentialIssuer(credentialId)
    {
        require(!credentials[credentialId].revoked, "Already revoked");
        
        credentials[credentialId].revoked = true;
        credentials[credentialId].revokedAt = block.timestamp;
        
        issuers[msg.sender].totalRevoked++;
        
        emit CredentialRevoked(credentialId, msg.sender, block.timestamp);
    }
    
    function updateExpiry(string memory credentialId, uint256 newExpiresAt)
        external
        credentialExists(credentialId)
        onlyCredentialIssuer(credentialId)
    {
        require(
            newExpiresAt == 0 || newExpiresAt > block.timestamp,
            "Expiry must be in future or 0"
        );
        
        credentials[credentialId].expiresAt = newExpiresAt;
        
        emit ExpiryUpdated(credentialId, newExpiresAt, block.timestamp);
    }
    
    // ============ Verification ============
    
    function verifyCredential(string memory credentialId)
        external
        credentialExists(credentialId)
        returns (
            bool valid,
            bool revoked,
            bool expired,
            address issuer,
            address holder,
            bytes32 credentialHash
        )
    {
        CredentialRecord storage cred = credentials[credentialId];
        
        revoked = cred.revoked;
        expired = cred.expiresAt != 0 && cred.expiresAt < block.timestamp;
        valid = !revoked && !expired;
        issuer = cred.issuer;
        holder = cred.holder;
        credentialHash = cred.credentialHash;
        
        // Increment verification count
        cred.verificationCount++;
        
        emit CredentialVerified(credentialId, block.timestamp);
    }
    
    function isCredentialValid(string memory credentialId)
        external
        view
        credentialExists(credentialId)
        returns (bool)
    {
        CredentialRecord storage cred = credentials[credentialId];
        
        bool notRevoked = !cred.revoked;
        bool notExpired = cred.expiresAt == 0 || cred.expiresAt >= block.timestamp;
        
        return notRevoked && notExpired;
    }
    
    function getCredentialRecord(string memory credentialId)
        external
        view
        credentialExists(credentialId)
        returns (CredentialRecord memory)
    {
        return credentials[credentialId];
    }
    
    // ============ Queries ============
    
    function getHolderCredentials(address holder)
        external
        view
        returns (string[] memory)
    {
        return holderCredentialIds[holder];
    }
    
    function getIssuerCredentials(address issuer)
        external
        view
        returns (string[] memory)
    {
        return issuerCredentialIds[issuer];
    }
    
    function getHolderCredentialCount(address holder)
        external
        view
        returns (uint256)
    {
        return holderCredentialIds[holder].length;
    }
    
    function getIssuerCredentialCount(address issuer)
        external
        view
        returns (uint256)
    {
        return issuerCredentialIds[issuer].length;
    }
}
