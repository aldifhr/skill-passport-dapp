// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/UniversalSkillPassport.sol";

contract UniversalSkillPassportTest is Test {
    UniversalSkillPassport public passport;
    
    address public admin;
    address public issuer1;
    address public issuer2;
    address public holder1;
    address public holder2;
    address public verifier;
    
    string constant ISSUER1_NAME = "MIT University";
    string constant ISSUER2_NAME = "Tech Bootcamp";
    string constant CRED_ID_1 = "cred-001";
    string constant CRED_ID_2 = "cred-002";
    bytes32 constant CRED_HASH_1 = keccak256("credential data 1");
    bytes32 constant CRED_HASH_2 = keccak256("credential data 2");
    
    event IssuerRegistered(address indexed issuer, string name, uint256 timestamp);
    event CredentialIssued(string indexed credentialId, address indexed issuer, address indexed holder, bytes32 credentialHash, uint256 timestamp);
    event CredentialRevoked(string indexed credentialId, address indexed issuer, uint256 timestamp);
    event CredentialVerified(string indexed credentialId, uint256 timestamp);
    
    function setUp() public {
        admin = address(this);
        issuer1 = makeAddr("issuer1");
        issuer2 = makeAddr("issuer2");
        holder1 = makeAddr("holder1");
        holder2 = makeAddr("holder2");
        verifier = makeAddr("verifier");
        
        passport = new UniversalSkillPassport();
    }
    
    // ============ Issuer Registration Tests ============
    
    function testRegisterIssuer() public {
        vm.startPrank(issuer1);
        
        vm.expectEmit(true, false, false, true);
        emit IssuerRegistered(issuer1, ISSUER1_NAME, block.timestamp);
        
        passport.registerIssuer(ISSUER1_NAME);
        
        UniversalSkillPassport.IssuerInfo memory info = passport.getIssuerInfo(issuer1);
        assertEq(info.name, ISSUER1_NAME);
        assertTrue(info.registered);
        assertEq(info.registeredAt, block.timestamp);
        assertEq(info.totalIssued, 0);
        assertEq(info.totalRevoked, 0);
        
        vm.stopPrank();
    }
    
    function testCannotRegisterTwice() public {
        vm.startPrank(issuer1);
        passport.registerIssuer(ISSUER1_NAME);
        
        vm.expectRevert("Already registered");
        passport.registerIssuer("New Name");
        
        vm.stopPrank();
    }
    
    function testCannotRegisterEmptyName() public {
        vm.startPrank(issuer1);
        
        vm.expectRevert("Name cannot be empty");
        passport.registerIssuer("");
        
        vm.stopPrank();
    }
    
    function testCannotRegisterTooLongName() public {
        vm.startPrank(issuer1);
        
        string memory longName = new string(101);
        vm.expectRevert("Name too long");
        passport.registerIssuer(longName);
        
        vm.stopPrank();
    }
    
    function testUpdateIssuerName() public {
        vm.startPrank(issuer1);
        passport.registerIssuer(ISSUER1_NAME);
        
        string memory newName = "MIT University - Updated";
        passport.updateIssuerName(newName);
        
        UniversalSkillPassport.IssuerInfo memory info = passport.getIssuerInfo(issuer1);
        assertEq(info.name, newName);
        
        vm.stopPrank();
    }
    
    function testVerifyIssuer() public {
        vm.prank(issuer1);
        passport.registerIssuer(ISSUER1_NAME);
        
        assertFalse(passport.isIssuerVerified(issuer1));
        
        passport.verifyIssuer(issuer1);
        
        assertTrue(passport.isIssuerVerified(issuer1));
    }
    
    function testOnlyAdminCanVerifyIssuer() public {
        vm.prank(issuer1);
        passport.registerIssuer(ISSUER1_NAME);
        
        vm.prank(issuer2);
        vm.expectRevert("Only admin");
        passport.verifyIssuer(issuer1);
    }
    
    // ============ Credential Issuance Tests ============
    
    function testIssueCredential() public {
        vm.prank(issuer1);
        passport.registerIssuer(ISSUER1_NAME);
        
        vm.startPrank(issuer1);
        
        vm.expectEmit(true, true, true, true);
        emit CredentialIssued(CRED_ID_1, issuer1, holder1, CRED_HASH_1, block.timestamp);
        
        passport.issueCredential(CRED_ID_1, CRED_HASH_1, holder1, 0);
        
        UniversalSkillPassport.CredentialRecord memory cred = passport.getCredentialRecord(CRED_ID_1);
        assertEq(cred.credentialHash, CRED_HASH_1);
        assertEq(cred.issuer, issuer1);
        assertEq(cred.holder, holder1);
        assertEq(cred.issuedAt, block.timestamp);
        assertEq(cred.expiresAt, 0);
        assertFalse(cred.revoked);
        assertEq(cred.verificationCount, 0);
        
        vm.stopPrank();
    }
    
    function testCannotIssueWithoutRegistration() public {
        vm.startPrank(issuer1);
        
        vm.expectRevert("Not a registered issuer");
        passport.issueCredential(CRED_ID_1, CRED_HASH_1, holder1, 0);
        
        vm.stopPrank();
    }
    
    function testCannotIssueDuplicateCredentialId() public {
        vm.prank(issuer1);
        passport.registerIssuer(ISSUER1_NAME);
        
        vm.startPrank(issuer1);
        passport.issueCredential(CRED_ID_1, CRED_HASH_1, holder1, 0);
        
        vm.expectRevert("Credential ID already exists");
        passport.issueCredential(CRED_ID_1, CRED_HASH_2, holder2, 0);
        
        vm.stopPrank();
    }
    
    function testCannotIssueWithInvalidHash() public {
        vm.prank(issuer1);
        passport.registerIssuer(ISSUER1_NAME);
        
        vm.startPrank(issuer1);
        
        vm.expectRevert("Invalid credential hash");
        passport.issueCredential(CRED_ID_1, bytes32(0), holder1, 0);
        
        vm.stopPrank();
    }
    
    function testCannotIssueWithInvalidHolder() public {
        vm.prank(issuer1);
        passport.registerIssuer(ISSUER1_NAME);
        
        vm.startPrank(issuer1);
        
        vm.expectRevert("Invalid holder address");
        passport.issueCredential(CRED_ID_1, CRED_HASH_1, address(0), 0);
        
        vm.stopPrank();
    }
    
    function testIssueCredentialWithExpiry() public {
        vm.prank(issuer1);
        passport.registerIssuer(ISSUER1_NAME);
        
        uint256 expiresAt = block.timestamp + 365 days;
        
        vm.startPrank(issuer1);
        passport.issueCredential(CRED_ID_1, CRED_HASH_1, holder1, expiresAt);
        
        UniversalSkillPassport.CredentialRecord memory cred = passport.getCredentialRecord(CRED_ID_1);
        assertEq(cred.expiresAt, expiresAt);
        
        vm.stopPrank();
    }
    
    function testCannotIssueWithPastExpiry() public {
        vm.prank(issuer1);
        passport.registerIssuer(ISSUER1_NAME);
        
        vm.warp(100 days); // Set block.timestamp to future first
        uint256 pastExpiry = block.timestamp - 1 days;
        
        vm.startPrank(issuer1);
        
        vm.expectRevert("Expiry must be in future or 0");
        passport.issueCredential(CRED_ID_1, CRED_HASH_1, holder1, pastExpiry);
        
        vm.stopPrank();
    }
    
    function testBatchIssueCredentials() public {
        vm.prank(issuer1);
        passport.registerIssuer(ISSUER1_NAME);
        
        string[] memory credIds = new string[](3);
        credIds[0] = "cred-batch-1";
        credIds[1] = "cred-batch-2";
        credIds[2] = "cred-batch-3";
        
        bytes32[] memory hashes = new bytes32[](3);
        hashes[0] = keccak256("batch 1");
        hashes[1] = keccak256("batch 2");
        hashes[2] = keccak256("batch 3");
        
        address[] memory holders = new address[](3);
        holders[0] = holder1;
        holders[1] = holder2;
        holders[2] = holder1;
        
        uint256[] memory expiries = new uint256[](3);
        expiries[0] = 0;
        expiries[1] = 0;
        expiries[2] = 0;
        
        vm.startPrank(issuer1);
        passport.batchIssueCredentials(credIds, hashes, holders, expiries);
        
        UniversalSkillPassport.CredentialRecord memory cred1 = passport.getCredentialRecord(credIds[0]);
        assertEq(cred1.holder, holder1);
        
        UniversalSkillPassport.CredentialRecord memory cred2 = passport.getCredentialRecord(credIds[1]);
        assertEq(cred2.holder, holder2);
        
        UniversalSkillPassport.IssuerInfo memory info = passport.getIssuerInfo(issuer1);
        assertEq(info.totalIssued, 3);
        
        vm.stopPrank();
    }
    
    // ============ Credential Revocation Tests ============
    
    function testRevokeCredential() public {
        vm.prank(issuer1);
        passport.registerIssuer(ISSUER1_NAME);
        
        vm.startPrank(issuer1);
        passport.issueCredential(CRED_ID_1, CRED_HASH_1, holder1, 0);
        
        vm.expectEmit(true, true, false, true);
        emit CredentialRevoked(CRED_ID_1, issuer1, block.timestamp);
        
        passport.revokeCredential(CRED_ID_1);
        
        UniversalSkillPassport.CredentialRecord memory cred = passport.getCredentialRecord(CRED_ID_1);
        assertTrue(cred.revoked);
        assertEq(cred.revokedAt, block.timestamp);
        
        UniversalSkillPassport.IssuerInfo memory info = passport.getIssuerInfo(issuer1);
        assertEq(info.totalRevoked, 1);
        
        vm.stopPrank();
    }
    
    function testCannotRevokeOthersCredential() public {
        vm.prank(issuer1);
        passport.registerIssuer(ISSUER1_NAME);
        
        vm.prank(issuer2);
        passport.registerIssuer(ISSUER2_NAME);
        
        vm.prank(issuer1);
        passport.issueCredential(CRED_ID_1, CRED_HASH_1, holder1, 0);
        
        vm.startPrank(issuer2);
        vm.expectRevert("Not the credential issuer");
        passport.revokeCredential(CRED_ID_1);
        vm.stopPrank();
    }
    
    function testCannotRevokeTwice() public {
        vm.prank(issuer1);
        passport.registerIssuer(ISSUER1_NAME);
        
        vm.startPrank(issuer1);
        passport.issueCredential(CRED_ID_1, CRED_HASH_1, holder1, 0);
        passport.revokeCredential(CRED_ID_1);
        
        vm.expectRevert("Already revoked");
        passport.revokeCredential(CRED_ID_1);
        
        vm.stopPrank();
    }
    
    // ============ Verification Tests ============
    
    function testVerifyValidCredential() public {
        vm.prank(issuer1);
        passport.registerIssuer(ISSUER1_NAME);
        
        vm.prank(issuer1);
        passport.issueCredential(CRED_ID_1, CRED_HASH_1, holder1, 0);
        
        vm.startPrank(verifier);
        
        (bool valid, bool revoked, bool expired, address issuer, address holder, bytes32 hash) = 
            passport.verifyCredential(CRED_ID_1);
        
        assertTrue(valid);
        assertFalse(revoked);
        assertFalse(expired);
        assertEq(issuer, issuer1);
        assertEq(holder, holder1);
        assertEq(hash, CRED_HASH_1);
        
        vm.stopPrank();
    }
    
    function testVerifyRevokedCredential() public {
        vm.prank(issuer1);
        passport.registerIssuer(ISSUER1_NAME);
        
        vm.startPrank(issuer1);
        passport.issueCredential(CRED_ID_1, CRED_HASH_1, holder1, 0);
        passport.revokeCredential(CRED_ID_1);
        vm.stopPrank();
        
        vm.startPrank(verifier);
        
        (bool valid, bool revoked, bool expired, , , ) = 
            passport.verifyCredential(CRED_ID_1);
        
        assertFalse(valid);
        assertTrue(revoked);
        assertFalse(expired);
        
        vm.stopPrank();
    }
    
    function testVerifyExpiredCredential() public {
        vm.prank(issuer1);
        passport.registerIssuer(ISSUER1_NAME);
        
        uint256 expiresAt = block.timestamp + 1 days;
        
        vm.prank(issuer1);
        passport.issueCredential(CRED_ID_1, CRED_HASH_1, holder1, expiresAt);
        
        // Fast forward past expiry
        vm.warp(expiresAt + 1);
        
        vm.startPrank(verifier);
        
        (bool valid, bool revoked, bool expired, , , ) = 
            passport.verifyCredential(CRED_ID_1);
        
        assertFalse(valid);
        assertFalse(revoked);
        assertTrue(expired);
        
        vm.stopPrank();
    }
    
    function testVerificationCountIncrement() public {
        vm.prank(issuer1);
        passport.registerIssuer(ISSUER1_NAME);
        
        vm.prank(issuer1);
        passport.issueCredential(CRED_ID_1, CRED_HASH_1, holder1, 0);
        
        vm.prank(verifier);
        passport.verifyCredential(CRED_ID_1);
        
        UniversalSkillPassport.CredentialRecord memory cred = passport.getCredentialRecord(CRED_ID_1);
        assertEq(cred.verificationCount, 1);
        
        vm.prank(verifier);
        passport.verifyCredential(CRED_ID_1);
        
        cred = passport.getCredentialRecord(CRED_ID_1);
        assertEq(cred.verificationCount, 2);
    }
    
    function testIsCredentialValid() public {
        vm.prank(issuer1);
        passport.registerIssuer(ISSUER1_NAME);
        
        vm.prank(issuer1);
        passport.issueCredential(CRED_ID_1, CRED_HASH_1, holder1, 0);
        
        assertTrue(passport.isCredentialValid(CRED_ID_1));
        
        vm.prank(issuer1);
        passport.revokeCredential(CRED_ID_1);
        
        assertFalse(passport.isCredentialValid(CRED_ID_1));
    }
    
    // ============ Query Tests ============
    
    function testGetHolderCredentials() public {
        vm.prank(issuer1);
        passport.registerIssuer(ISSUER1_NAME);
        
        vm.startPrank(issuer1);
        passport.issueCredential(CRED_ID_1, CRED_HASH_1, holder1, 0);
        passport.issueCredential(CRED_ID_2, CRED_HASH_2, holder1, 0);
        vm.stopPrank();
        
        string[] memory holderCreds = passport.getHolderCredentials(holder1);
        assertEq(holderCreds.length, 2);
        assertEq(holderCreds[0], CRED_ID_1);
        assertEq(holderCreds[1], CRED_ID_2);
    }
    
    function testGetIssuerCredentials() public {
        vm.prank(issuer1);
        passport.registerIssuer(ISSUER1_NAME);
        
        vm.startPrank(issuer1);
        passport.issueCredential(CRED_ID_1, CRED_HASH_1, holder1, 0);
        passport.issueCredential(CRED_ID_2, CRED_HASH_2, holder2, 0);
        vm.stopPrank();
        
        string[] memory issuerCreds = passport.getIssuerCredentials(issuer1);
        assertEq(issuerCreds.length, 2);
    }
    
    function testUpdateExpiry() public {
        vm.prank(issuer1);
        passport.registerIssuer(ISSUER1_NAME);
        
        vm.startPrank(issuer1);
        passport.issueCredential(CRED_ID_1, CRED_HASH_1, holder1, 0);
        
        uint256 newExpiry = block.timestamp + 365 days;
        passport.updateExpiry(CRED_ID_1, newExpiry);
        
        UniversalSkillPassport.CredentialRecord memory cred = passport.getCredentialRecord(CRED_ID_1);
        assertEq(cred.expiresAt, newExpiry);
        
        vm.stopPrank();
    }
}
