# ZK Age Verifier dengan Foundry - Deployment Guide

Dokumentasi lengkap untuk deploy ZK Age Verification smart contract menggunakan Foundry pada Monad Testnet.

## Daftar Isi

1. [Instalasi Foundry](#1-instalasi-foundry)
2. [Setup Proyek ZK Age Verifier](#2-setup-proyek-zk-age-verifier)
3. [Smart Contract Implementation](#3-smart-contract-implementation)
4. [Testing dengan Foundry](#4-testing-dengan-foundry)
5. [Script Deployment](#5-script-deployment)
6. [Wallet Management](#6-wallet-management)
7. [Deployment ke Monad Testnet](#7-deployment-ke-monad-testnet)
8. [Verifikasi Contract](#8-verifikasi-contract)
9. [Interaksi dengan Contract](#9-interaksi-dengan-contract)
10. [Best Practices](#10-best-practices)

---

## 1. Instalasi Foundry

### macOS

```bash
# Install Foundry
curl -L https://foundry.paradigm.xyz | bash
source ~/.zshrc
foundryup

# Verify installation
forge --version
cast --version
anvil --version
```

### Windows (WSL2)

```bash
# Enable WSL2 first (PowerShell as Admin)
wsl --install -d Ubuntu-22.04

# In WSL terminal
curl -L https://foundry.paradigm.xyz | bash
source ~/.bashrc
foundryup

# Verify installation
forge --version
cast --version
anvil --version
```

### Linux

```bash
# Install dependencies
sudo apt update && sudo apt install -y build-essential curl

# Install Foundry
curl -L https://foundry.paradigm.xyz | bash
source ~/.bashrc
foundryup

# Verify installation
forge --version
cast --version
anvil --version
```

---

## 2. Setup Proyek ZK Age Verifier

### Membuat Proyek

```bash
# Create project dengan template Monad
forge init --template monad-developers/foundry-monad zk-age-verifier
cd zk-age-verifier
```

### Struktur Proyek

```
zk-age-verifier/
├── foundry.toml           # Foundry configuration
├── src/                   # Smart contracts
│   ├── AgeVerifier.sol    # Main contract
│   └── verifier.sol       # Generated verifier
├── script/                # Deployment scripts
│   └── DeployAgeVerifier.s.sol
├── test/                  # Test files
│   └── AgeVerifier.t.sol
└── lib/                   # Dependencies
```
---

## 3. Smart Contract Implementation

### A. Verifier Contract (Generated)

File `src/verifier.sol` - Generated dari circom:

```solidity
// [Generated Groth16Verifier]
// SPDX-License-Identifier: GPL-3.0
/*
    Copyright 2021 0KIMS association.

    This file is generated with [snarkJS](https://github.com/iden3/snarkjs).

    snarkJS is a free software: you can redistribute it and/or modify it
    under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    snarkJS is distributed in the hope that it will be useful, but WITHOUT
    ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
    or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public
    License for more details.

    You should have received a copy of the GNU General Public License
    along with snarkJS. If not, see <https://www.gnu.org/licenses/>.
*/

pragma solidity >=0.7.0 <0.9.0;

contract Groth16Verifier {
    // Scalar field size
    uint256 constant r    = 21888242871839275222246405745257275088548364400416034343698204186575808495617;
    // Base field size
    uint256 constant q   = 21888242871839275222246405745257275088696311157297823662689037894645226208583;

    // Verification Key data
    uint256 constant alphax  = 17830313052904208913517404857644971561368899276789277150540827506716754308637;
    uint256 constant alphay  = 11668252373809705476227858584700343501633782836058733065708323581290952789335;
    uint256 constant betax1  = 7397295700448039613724656164740184681760528234593126562581160580322927936655;
    uint256 constant betax2  = 1773591838052893867596560577751879479114879147860651345513263167488110001323;
    uint256 constant betay1  = 10082557598417285154977799102616865921652207394877343781888614683452975965061;
    uint256 constant betay2  = 8586082397888794502876055996464820492834647726548725475951608782845958555292;
    uint256 constant gammax1 = 11559732032986387107991004021392285783925812861821192530917403151452391805634;
    uint256 constant gammax2 = 10857046999023057135944570762232829481370756359578518086990519993285655852781;
    uint256 constant gammay1 = 4082367875863433681332203403145435568316851327593401208105741076214120093531;
    uint256 constant gammay2 = 8495653923123431417604973247489272438418190587263600148770280649306958101930;
    uint256 constant deltax1 = 1009902423178140595599952278056326855288881425691696783838587975714565923726;
    uint256 constant deltax2 = 7652232427752936584404495843459955470525444367600622825034274003442329428987;
    uint256 constant deltay1 = 8362492161809570090245098711187312628707154415206612904695330856503995787335;
    uint256 constant deltay2 = 12471836502749657585161202210233814311798858412641187368656584167499878414;

    
    uint256 constant IC0x = 13237631534469309276720992609857385429467419672094666722717149134802359008630;
    uint256 constant IC0y = 15545703059273467096109392212267448053841292147834289577522660765605653232598;
    
    uint256 constant IC1x = 21399311123273237875705926281595101735060289885348567206618886341837214589570;
    uint256 constant IC1y = 16251994641923374038368523827571662146398599269782500315142110994009136415676;
    
    uint256 constant IC2x = 10848247039458140928170936131266342071922716263759180514052764028771855918014;
    uint256 constant IC2y = 1892711327196706703812871085753008347159985148207627250956486391138907121804;
    
 
    // Memory data
    uint16 constant pVk = 0;
    uint16 constant pPairing = 128;

    uint16 constant pLastMem = 896;

    function verifyProof(uint[2] calldata _pA, uint[2][2] calldata _pB, uint[2] calldata _pC, uint[2] calldata _pubSignals) public view returns (bool) {
        assembly {
            function checkField(v) {
                if iszero(lt(v, r)) {
                    mstore(0, 0)
                    return(0, 0x20)
                }
            }
            
            // G1 function to multiply a G1 value(x,y) to value in an address
            function g1_mulAccC(pR, x, y, s) {
                let success
                let mIn := mload(0x40)
                mstore(mIn, x)
                mstore(add(mIn, 32), y)
                mstore(add(mIn, 64), s)

                success := staticcall(sub(gas(), 2000), 7, mIn, 96, mIn, 64)

                if iszero(success) {
                    mstore(0, 0)
                    return(0, 0x20)
                }

                mstore(add(mIn, 64), mload(pR))
                mstore(add(mIn, 96), mload(add(pR, 32)))

                success := staticcall(sub(gas(), 2000), 6, mIn, 128, pR, 64)

                if iszero(success) {
                    mstore(0, 0)
                    return(0, 0x20)
                }
            }

            function checkPairing(pA, pB, pC, pubSignals, pMem) -> isOk {
                let _pPairing := add(pMem, pPairing)
                let _pVk := add(pMem, pVk)

                mstore(_pVk, IC0x)
                mstore(add(_pVk, 32), IC0y)

                // Compute the linear combination vk_x
                
                g1_mulAccC(_pVk, IC1x, IC1y, calldataload(add(pubSignals, 0)))
                
                g1_mulAccC(_pVk, IC2x, IC2y, calldataload(add(pubSignals, 32)))
                

                // -A
                mstore(_pPairing, calldataload(pA))
                mstore(add(_pPairing, 32), mod(sub(q, calldataload(add(pA, 32))), q))

                // B
                mstore(add(_pPairing, 64), calldataload(pB))
                mstore(add(_pPairing, 96), calldataload(add(pB, 32)))
                mstore(add(_pPairing, 128), calldataload(add(pB, 64)))
                mstore(add(_pPairing, 160), calldataload(add(pB, 96)))

                // alpha1
                mstore(add(_pPairing, 192), alphax)
                mstore(add(_pPairing, 224), alphay)

                // beta2
                mstore(add(_pPairing, 256), betax1)
                mstore(add(_pPairing, 288), betax2)
                mstore(add(_pPairing, 320), betay1)
                mstore(add(_pPairing, 352), betay2)

                // vk_x
                mstore(add(_pPairing, 384), mload(add(pMem, pVk)))
                mstore(add(_pPairing, 416), mload(add(pMem, add(pVk, 32))))


                // gamma2
                mstore(add(_pPairing, 448), gammax1)
                mstore(add(_pPairing, 480), gammax2)
                mstore(add(_pPairing, 512), gammay1)
                mstore(add(_pPairing, 544), gammay2)

                // C
                mstore(add(_pPairing, 576), calldataload(pC))
                mstore(add(_pPairing, 608), calldataload(add(pC, 32)))

                // delta2
                mstore(add(_pPairing, 640), deltax1)
                mstore(add(_pPairing, 672), deltax2)
                mstore(add(_pPairing, 704), deltay1)
                mstore(add(_pPairing, 736), deltay2)


                let success := staticcall(sub(gas(), 2000), 8, _pPairing, 768, _pPairing, 0x20)

                isOk := and(success, mload(_pPairing))
            }

            let pMem := mload(0x40)
            mstore(0x40, add(pMem, pLastMem))

            // Validate that all evaluations ∈ F
            
            checkField(calldataload(add(_pubSignals, 0)))
            
            checkField(calldataload(add(_pubSignals, 32)))
            

            // Validate all evaluations
            let isValid := checkPairing(_pA, _pB, _pC, _pubSignals, pMem)

            mstore(0, isValid)
             return(0, 0x20)
         }
     }
 }

```

### B. AgeVerifier Contract

File `src/AgeVerifier.sol` - Main verification contract:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "./verifier.sol"; // Generated dari circom

/**
 * @title AgeVerifier
 * @dev Smart contract untuk verifikasi umur menggunakan ZK proofs
 */
contract AgeVerifier {
    // Generated verifier contract
    Groth16Verifier public immutable verifier;
    
    // Verified commitments untuk prevent replay attacks
    mapping(uint256 => bool) public usedCommitments;
    
    // Verified addresses
    mapping(address => bool) public verifiedAdults;
    mapping(address => uint256) public verificationTimestamp;
    
    // Events
    event AgeVerified(
        address indexed user,
        uint256 commitment,
        bool isAdult,
        uint256 timestamp
    );
    
    event VerificationRevoked(
        address indexed user,
        uint256 timestamp
    );
    
    constructor(address _verifier) {
        verifier = Groth16Verifier(_verifier);
    }
    
    function verifyAge(
        uint[2] memory _pA,
        uint[2][2] memory _pB,
        uint[2] memory _pC,
        uint[2] memory _publicSignals  // Changed from uint[1] to uint[2]
    ) external {
        // Extract public signals
        uint256 isAdult = _publicSignals[0];      // First output: isAdult (0 or 1)
        uint256 commitment = _publicSignals[1];   // Second output: commitment
        
        // Check that isAdult is 1 (true)
        require(isAdult == 1, "Age verification failed: not adult");
        
        // Check commitment belum pernah digunakan
        require(!usedCommitments[commitment], "Commitment already used");
        
        // Verify ZK proof
        bool isValid = verifier.verifyProof(_pA, _pB, _pC, _publicSignals);
        require(isValid, "Invalid age proof");
        
        // Mark commitment as used
        usedCommitments[commitment] = true;
        
        // Mark user as verified adult
        verifiedAdults[msg.sender] = true;
        verificationTimestamp[msg.sender] = block.timestamp;
        
        emit AgeVerified(msg.sender, commitment, true, block.timestamp);
    }
    
    /**
     * @dev Check if address adalah verified adult
     */
    function isVerifiedAdult(address user) external view returns (bool) {
        return verifiedAdults[user];
    }
    
    /**
     * @dev Get verification timestamp
     */
    function getVerificationTime(address user) external view returns (uint256) {
        return verificationTimestamp[user];
    }
    
    /**
     * @dev Revoke verification (for testing purposes)
     */
    function revokeVerification() external {
        require(verifiedAdults[msg.sender], "Not verified");
        
        verifiedAdults[msg.sender] = false;
        verificationTimestamp[msg.sender] = 0;
        
        emit VerificationRevoked(msg.sender, block.timestamp);
    }
    
    /**
     * @dev Batch check multiple addresses
     */
    function batchCheckVerification(address[] calldata users) 
        external 
        view 
        returns (bool[] memory results) 
    {
        results = new bool[](users.length);
        for (uint i = 0; i < users.length; i++) {
            results[i] = verifiedAdults[users[i]];
        }
    }
    
    /**
     * @dev Get commitment status
     */
    function isCommitmentUsed(uint256 commitment) external view returns (bool) {
        return usedCommitments[commitment];
    }
}
```

---

## 4. Testing dengan Foundry

### Main Test File

File `test/AgeVerifier.t.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "forge-std/Test.sol";
import "forge-std/console.sol";
import "../src/AgeVerifier.sol";
import "../src/verifier.sol";

contract AgeVerifierTest is Test {
    AgeVerifier public ageVerifier;
    Groth16Verifier public verifier;
    
    // Test addresses
    address public alice = address(0x1);
    address public bob = address(0x2);
    address public charlie = address(0x3);
    
    // Sample valid proof data (these would be generated from circom)
    // Note: These are dummy values for testing - real values would come from circom
    uint[2] public validProofA = [
        0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef,
        0xfedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321
    ];
    
    uint[2][2] public validProofB = [
        [0x1111222233334444555566667777888899990000aaaabbbbccccddddeeee0000,
         0xffff0000ddddeeeebbbbcccc8888999955556666222233331111444400001111],
        [0xabcd1234efab5678cdab9012ef563456ab127890cd561234ab785678cd129012,
         0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba]
    ];
    
    uint[2] public validProofC = [
        0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef,
        0xcafebabecafebabecafebabecafebabecafebabecafebabecafebabecafebabe
    ];
    
    // Valid public signals: [isAdult, commitment]
    uint[2] public validAdultSignals = [
        1, // isAdult = 1 (true)
        0x123456789abcdef123456789abcdef123456789abcdef123456789abcdef1234 // commitment
    ];
    
    uint[2] public invalidNotAdultSignals = [
        0, // isAdult = 0 (false)
        0x987654321fedcba987654321fedcba987654321fedcba987654321fedcba9876 // commitment
    ];
    
    // Events to test
    event AgeVerified(
        address indexed user,
        uint256 commitment,
        bool isAdult,
        uint256 timestamp
    );
    
    event VerificationRevoked(
        address indexed user,
        uint256 timestamp
    );
    
    function setUp() public {
        // Deploy verifier contract
        verifier = new Groth16Verifier();
        
        // Deploy age verifier contract
        ageVerifier = new AgeVerifier(address(verifier));
        
        // Label addresses for better trace
        vm.label(alice, "Alice");
        vm.label(bob, "Bob");
        vm.label(charlie, "Charlie");
        vm.label(address(ageVerifier), "AgeVerifier");
        vm.label(address(verifier), "Groth16Verifier");
    }
    
    // Test successful deployment
    function testDeployment() public view {
        assertEq(address(ageVerifier.verifier()), address(verifier));
        assertFalse(ageVerifier.isVerifiedAdult(alice));
        assertEq(ageVerifier.getVerificationTime(alice), 0);
    }
    
    // Test successful age verification (mocked)
    function testSuccessfulAgeVerification() public {
        vm.startPrank(alice);
        
        // Mock the verifier to return true
        vm.mockCall(
            address(verifier),
            abi.encodeWithSelector(
                Groth16Verifier.verifyProof.selector,
                validProofA,
                validProofB,
                validProofC,
                validAdultSignals
            ),
            abi.encode(true)
        );
        
        // Expect the AgeVerified event
        vm.expectEmit(true, false, false, true);
        emit AgeVerified(alice, validAdultSignals[1], true, block.timestamp);
        
        // Call verifyAge
        ageVerifier.verifyAge(
            validProofA,
            validProofB,
            validProofC,
            validAdultSignals
        );
        
        // Verify state changes
        assertTrue(ageVerifier.isVerifiedAdult(alice));
        assertEq(ageVerifier.getVerificationTime(alice), block.timestamp);
        assertTrue(ageVerifier.isCommitmentUsed(validAdultSignals[1]));
        assertTrue(ageVerifier.usedCommitments(validAdultSignals[1]));
        
        vm.stopPrank();
    }
    
    // Test failed verification when not adult
    function test_RevertWhen_NotAdult() public {
        vm.startPrank(alice);
        
        // Mock the verifier to return true (proof is valid but isAdult = 0)
        vm.mockCall(
            address(verifier),
            abi.encodeWithSelector(
                Groth16Verifier.verifyProof.selector,
                validProofA,
                validProofB,
                validProofC,
                invalidNotAdultSignals
            ),
            abi.encode(true)
        );
        
        // Should revert with "Age verification failed: not adult"
        vm.expectRevert("Age verification failed: not adult");
        ageVerifier.verifyAge(
            validProofA,
            validProofB,
            validProofC,
            invalidNotAdultSignals
        );
        
        vm.stopPrank();
    }
    
    // Test failed verification with invalid proof
    function test_RevertWhen_InvalidProof() public {
        vm.startPrank(alice);
        
        // Mock the verifier to return false
        vm.mockCall(
            address(verifier),
            abi.encodeWithSelector(
                Groth16Verifier.verifyProof.selector,
                validProofA,
                validProofB,
                validProofC,
                validAdultSignals
            ),
            abi.encode(false)
        );
        
        // Should revert with "Invalid age proof"
        vm.expectRevert("Invalid age proof");
        ageVerifier.verifyAge(
            validProofA,
            validProofB,
            validProofC,
            validAdultSignals
        );
        
        vm.stopPrank();
    }
    
    // Test commitment replay protection
    function testCommitmentReplayProtection() public {
        // First verification by Alice
        vm.startPrank(alice);
        
        vm.mockCall(
            address(verifier),
            abi.encodeWithSelector(
                Groth16Verifier.verifyProof.selector,
                validProofA,
                validProofB,
                validProofC,
                validAdultSignals
            ),
            abi.encode(true)
        );
        
        ageVerifier.verifyAge(
            validProofA,
            validProofB,
            validProofC,
            validAdultSignals
        );
        
        vm.stopPrank();
        
        // Try to use same commitment with Bob
        vm.startPrank(bob);
        
        vm.mockCall(
            address(verifier),
            abi.encodeWithSelector(
                Groth16Verifier.verifyProof.selector,
                validProofA,
                validProofB,
                validProofC,
                validAdultSignals
            ),
            abi.encode(true)
        );
        
        // Should revert with "Commitment already used"
        vm.expectRevert("Commitment already used");
        ageVerifier.verifyAge(
            validProofA,
            validProofB,
            validProofC,
            validAdultSignals
        );
        
        vm.stopPrank();
    }
    
    // Test revoke verification
    function testRevokeVerification() public {
        // First verify Alice
        vm.startPrank(alice);
        
        vm.mockCall(
            address(verifier),
            abi.encodeWithSelector(
                Groth16Verifier.verifyProof.selector,
                validProofA,
                validProofB,
                validProofC,
                validAdultSignals
            ),
            abi.encode(true)
        );
        
        ageVerifier.verifyAge(
            validProofA,
            validProofB,
            validProofC,
            validAdultSignals
        );
        
        assertTrue(ageVerifier.isVerifiedAdult(alice));
        
        // Expect VerificationRevoked event
        vm.expectEmit(true, false, false, true);
        emit VerificationRevoked(alice, block.timestamp);
        
        // Revoke verification
        ageVerifier.revokeVerification();
        
        // Check state
        assertFalse(ageVerifier.isVerifiedAdult(alice));
        assertEq(ageVerifier.getVerificationTime(alice), 0);
        
        vm.stopPrank();
    }
    
    // Test revoke verification when not verified
    function test_RevertWhen_NotVerified() public {
        vm.startPrank(alice);
        
        // Should revert with "Not verified"
        vm.expectRevert("Not verified");
        ageVerifier.revokeVerification();
        
        vm.stopPrank();
    }
    
    // Test batch check verification
    function testBatchCheckVerification() public {
        // Verify Alice
        vm.startPrank(alice);
        
        vm.mockCall(
            address(verifier),
            abi.encodeWithSelector(
                Groth16Verifier.verifyProof.selector,
                validProofA,
                validProofB,
                validProofC,
                validAdultSignals
            ),
            abi.encode(true)
        );
        
        ageVerifier.verifyAge(
            validProofA,
            validProofB,
            validProofC,
            validAdultSignals
        );
        
        vm.stopPrank();
        
        // Create address array
        address[] memory users = new address[](3);
        users[0] = alice;
        users[1] = bob;
        users[2] = charlie;
        
        // Check batch verification
        bool[] memory results = ageVerifier.batchCheckVerification(users);
        
        assertTrue(results[0]); // Alice is verified
        assertFalse(results[1]); // Bob is not verified
        assertFalse(results[2]); // Charlie is not verified
    }
    
    // Test multiple users verification with different commitments
    function testMultipleUsersVerification() public {
        uint[2] memory bobSignals = [
            1, // isAdult = 1
            0x987654321fedcba987654321fedcba987654321fedcba987654321fedcba9876 // different commitment
        ];
        
        // Verify Alice
        vm.startPrank(alice);
        
        vm.mockCall(
            address(verifier),
            abi.encodeWithSelector(
                Groth16Verifier.verifyProof.selector,
                validProofA,
                validProofB,
                validProofC,
                validAdultSignals
            ),
            abi.encode(true)
        );
        
        ageVerifier.verifyAge(
            validProofA,
            validProofB,
            validProofC,
            validAdultSignals
        );
        
        vm.stopPrank();
        
        // Verify Bob with different commitment
        vm.startPrank(bob);
        
        vm.mockCall(
            address(verifier),
            abi.encodeWithSelector(
                Groth16Verifier.verifyProof.selector,
                validProofA,
                validProofB,
                validProofC,
                bobSignals
            ),
            abi.encode(true)
        );
        
        ageVerifier.verifyAge(
            validProofA,
            validProofB,
            validProofC,
            bobSignals
        );
        
        vm.stopPrank();
        
        // Both should be verified
        assertTrue(ageVerifier.isVerifiedAdult(alice));
        assertTrue(ageVerifier.isVerifiedAdult(bob));
        assertFalse(ageVerifier.isVerifiedAdult(charlie));
        
        // Different commitments should be used
        assertTrue(ageVerifier.isCommitmentUsed(validAdultSignals[1]));
        assertTrue(ageVerifier.isCommitmentUsed(bobSignals[1]));
    }
    
    // Test edge cases and boundary conditions
    function testEdgeCases() public view {
        // Test with empty address array
        address[] memory emptyUsers = new address[](0);
        bool[] memory emptyResults = ageVerifier.batchCheckVerification(emptyUsers);
        assertEq(emptyResults.length, 0);
        
        // Test commitment status for unused commitment
        uint256 unusedCommitment = 0x1111111111111111111111111111111111111111111111111111111111111111;
        assertFalse(ageVerifier.isCommitmentUsed(unusedCommitment));
    }
    
    // Test gas consumption
    function testGasConsumption() public {
        vm.startPrank(alice);
        
        vm.mockCall(
            address(verifier),
            abi.encodeWithSelector(
                Groth16Verifier.verifyProof.selector,
                validProofA,
                validProofB,
                validProofC,
                validAdultSignals
            ),
            abi.encode(true)
        );
        
        uint256 gasBefore = gasleft();
        
        ageVerifier.verifyAge(
            validProofA,
            validProofB,
            validProofC,
            validAdultSignals
        );
        
        uint256 gasUsed = gasBefore - gasleft();
        console.log("Gas used for verifyAge:", gasUsed);
        
        // Gas should be reasonable (less than 200k for mocked version)
        assertLt(gasUsed, 200000);
        
        vm.stopPrank();
    }
    
    // Test time progression
    function testTimeProgression() public {
        vm.startPrank(alice);
        
        vm.mockCall(
            address(verifier),
            abi.encodeWithSelector(
                Groth16Verifier.verifyProof.selector,
                validProofA,
                validProofB,
                validProofC,
                validAdultSignals
            ),
            abi.encode(true)
        );
        
        uint256 initialTime = block.timestamp;
        
        ageVerifier.verifyAge(
            validProofA,
            validProofB,
            validProofC,
            validAdultSignals
        );
        
        assertEq(ageVerifier.getVerificationTime(alice), initialTime);
        
        // Move time forward
        vm.warp(block.timestamp + 1 days);
        
        // Verification time should remain the same
        assertEq(ageVerifier.getVerificationTime(alice), initialTime);
        
        vm.stopPrank();
    }
    
    // Fuzz test with random addresses
    function testFuzzRandomAddresses(address randomUser) public view {
        vm.assume(randomUser != address(0));
        
        // Initially should not be verified
        assertFalse(ageVerifier.isVerifiedAdult(randomUser));
        assertEq(ageVerifier.getVerificationTime(randomUser), 0);
    }
    
    // Fuzz test with random commitments
    function testFuzzRandomCommitments(uint256 randomCommitment) public view {
        // Initially should not be used
        assertFalse(ageVerifier.isCommitmentUsed(randomCommitment));
    }
}
```

### Menjalankan Tests

```bash
# Compile contracts
forge build

# Run all tests
forge test

# Run with verbose output
forge test -vvv

# Run specific test
forge test --match-test test_ShouldVerifyAgeSuccessfully

# Run with gas reporting
forge test --gas-report

# Run fuzz tests
forge test --fuzz-runs 1000 --match-test testFuzz_

# Check code coverage
forge coverage
```

---

## 5. Script Deployment

### Deployment Script

File `script/DeployAgeVerifier.s.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Script, console} from "lib/forge-std/src/Script.sol";
import {AgeVerifier} from "../src/AgeVerifier.sol";
import {Groth16Verifier} from "../src/verifier.sol";

contract DeployAgeVerifier is Script {
    AgeVerifier public ageVerifier;
    Groth16Verifier public groth16Verifier;

    function setUp() public {}

    function run() public returns (AgeVerifier, Groth16Verifier, address, address) {
        console.log("Starting Age Verification System deployment to Monad Testnet...\n");

        // Get deployer account from private key
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        console.log("Deployment Details:");
        console.log("Deployer address:", deployer);
        
        // Check balance
        uint256 balance = deployer.balance;
        console.log("Deployer balance:", balance / 1e18, "MON");
        
        if (balance < 0.05 ether) {
            console.log("Warning: Low balance. Make sure you have enough MON for deployment.");
            console.log("Recommended minimum: 0.05 MON for deploying 2 contracts");
        }

        // Get network info
        console.log("Network: Monad Testnet");
        console.log("Chain ID: 10143");
        console.log("RPC URL: https://testnet-rpc.monad.xyz/\n");

        // Start broadcasting transactions
        vm.startBroadcast(deployerPrivateKey);

        console.log("Step 1: Deploying Groth16Verifier contract...");
        
        // Deploy Groth16Verifier first
        groth16Verifier = new Groth16Verifier();
        address verifierAddress = address(groth16Verifier);
        
        console.log("Groth16Verifier deployed at:", verifierAddress);

        console.log("Step 2: Deploying AgeVerifier contract...");
        
        // Deploy AgeVerifier with verifier address
        ageVerifier = new AgeVerifier(verifierAddress);
        address ageVerifierAddress = address(ageVerifier);

        vm.stopBroadcast();

        console.log("\n=== DEPLOYMENT SUCCESSFUL ===");
        console.log("Groth16Verifier address:", verifierAddress);
        console.log("AgeVerifier address:", ageVerifierAddress);
        console.log("Groth16Verifier explorer:");
        console.log(string.concat("https://testnet.monadexplorer.com/address/", _addressToString(verifierAddress)));
        console.log("AgeVerifier explorer:");
        console.log(string.concat("https://testnet.monadexplorer.com/address/", _addressToString(ageVerifierAddress)));

        // Verify initial state
        console.log("\nVerifying initial contract state...");
        address linkedVerifier = address(ageVerifier.verifier());
        
        console.log("AgeVerifier linked verifier:", linkedVerifier);
        console.log("Verifier linkage correct:", linkedVerifier == verifierAddress ? "YES" : "NO");
        
        // Test some view functions
        console.log("Initial verification states:");
        console.log("- Deployer is verified adult:", ageVerifier.isVerifiedAdult(deployer) ? "YES" : "NO");
        console.log("- Deployer verification time:", ageVerifier.getVerificationTime(deployer));
        
        // Test commitment status with dummy value
        uint256 dummyCommitment = 0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef;
        console.log("- Dummy commitment used:", ageVerifier.isCommitmentUsed(dummyCommitment) ? "YES" : "NO");

        // Gas cost estimation
        console.log("\nEstimated gas costs:");
        console.log("- Groth16Verifier deployment: ~1,500,000 gas");
        console.log("- AgeVerifier deployment: ~800,000 gas");
        console.log("- Age verification call: ~150,000-200,000 gas");

        // Provide next steps
        console.log("\n=== NEXT STEPS ===");
        console.log("1. Save contract addresses for future interactions");
        console.log("2. Verify contracts on block explorer (optional)");
        console.log("3. Generate ZK proofs using your circom circuit");
        console.log("4. Test age verification with valid proofs");
        console.log("5. Integrate with your frontend application");
        console.log("6. Set up monitoring for verification events");

        // Frontend integration info
        console.log("\n=== FRONTEND INTEGRATION ===");
        console.log("Add these to your environment variables:");
        console.log("REACT_APP_AGE_VERIFIER_ADDRESS=", ageVerifierAddress);
        console.log("REACT_APP_GROTH16_VERIFIER_ADDRESS=", verifierAddress);
        console.log("REACT_APP_MONAD_TESTNET_RPC=https://testnet-rpc.monad.xyz/");
        console.log("REACT_APP_CHAIN_ID=10143");

        // Cast command examples
        console.log("\n=== CAST COMMANDS FOR TESTING ===");
        console.log("Check if address is verified:");
        console.log("cast call", ageVerifierAddress, "\"isVerifiedAdult(address)(bool)\" <ADDRESS> --rpc-url https://testnet-rpc.monad.xyz/");
        console.log("\nCheck commitment status:");
        console.log("cast call", ageVerifierAddress, "\"isCommitmentUsed(uint256)(bool)\" <COMMITMENT> --rpc-url https://testnet-rpc.monad.xyz/");

        // Save deployment info (with proper error handling)
        _saveDeploymentInfo(ageVerifierAddress, verifierAddress, deployer);

        console.log("\n=== DEPLOYMENT COMPLETED SUCCESSFULLY ===");

        return (ageVerifier, groth16Verifier, ageVerifierAddress, verifierAddress);
    }

    function _saveDeploymentInfo(address ageVerifierAddress, address verifierAddress, address deployer) internal {
        string memory deploymentInfo = string.concat(
            "{\n",
            '  "network": "Monad Testnet",\n',
            '  "chainId": "10143",\n',
            '  "rpcUrl": "https://testnet-rpc.monad.xyz/",\n',
            '  "blockExplorer": "https://testnet.monadexplorer.com",\n',
            '  "deployerAddress": "', _addressToString(deployer), '",\n',
            '  "contracts": {\n',
            '    "AgeVerifier": {\n',
            '      "address": "', _addressToString(ageVerifierAddress), '",\n',
            '      "explorer": "https://testnet.monadexplorer.com/address/', _addressToString(ageVerifierAddress), '"\n',
            '    },\n',
            '    "Groth16Verifier": {\n',
            '      "address": "', _addressToString(verifierAddress), '",\n',
            '      "explorer": "https://testnet.monadexplorer.com/address/', _addressToString(verifierAddress), '"\n',
            '    }\n',
            '  },\n',
            '  "deploymentTimestamp": "', _getTimestamp(), '",\n',
            '  "estimatedGasCosts": {\n',
            '    "groth16VerifierDeployment": "1500000",\n',
            '    "ageVerifierDeployment": "800000",\n',
            '    "ageVerificationCall": "150000-200000"\n',
            '  },\n',
            '  "frontendEnvVars": {\n',
            '    "REACT_APP_AGE_VERIFIER_ADDRESS": "', _addressToString(ageVerifierAddress), '",\n',
            '    "REACT_APP_GROTH16_VERIFIER_ADDRESS": "', _addressToString(verifierAddress), '",\n',
            '    "REACT_APP_MONAD_TESTNET_RPC": "https://testnet-rpc.monad.xyz/",\n',
            '    "REACT_APP_CHAIN_ID": "10143"\n',
            '  }\n',
            "}"
        );

        // Try to write deployment info to file (with error handling)
        try vm.writeFile("deployments/age-verifier-monad-testnet.json", deploymentInfo) {
            console.log("\nDeployment info saved to: deployments/age-verifier-monad-testnet.json");
        } catch {
            console.log("\nNote: Could not save deployment file (permission issue)");
            console.log("You can manually save this deployment info:");
            console.log("=== DEPLOYMENT JSON ===");
            console.log(deploymentInfo);
            console.log("=== END JSON ===");
        }
    }

    function _addressToString(address _addr) internal pure returns (string memory) {
        bytes32 value = bytes32(uint256(uint160(_addr)));
        bytes memory alphabet = "0123456789abcdef";
        bytes memory str = new bytes(42);
        str[0] = "0";
        str[1] = "x";
        for (uint256 i = 0; i < 20; i++) {
            str[2 + i * 2] = alphabet[uint8(value[i + 12] >> 4)];
            str[3 + i * 2] = alphabet[uint8(value[i + 12] & 0x0f)];
        }
        return string(str);
    }

    function _getTimestamp() internal view returns (string memory) {
        // Return block number as timestamp since we can't get actual timestamp in scripts
        return vm.toString(block.number);
    }

    // Helper function for batch verification testing (view only)
    function batchVerificationHelper(address[] memory testAddresses) external view returns (bool[] memory) {
        require(address(ageVerifier) != address(0), "AgeVerifier not deployed");
        return ageVerifier.batchCheckVerification(testAddresses);
    }

    // Helper function to estimate gas for age verification (not a test)
    function estimateVerificationGasHelper(
        uint[2] memory _pA,
        uint[2][2] memory _pB,
        uint[2] memory _pC,
        uint[2] memory _publicSignals
    ) external returns (uint256) {
        require(address(ageVerifier) != address(0), "AgeVerifier not deployed");
        
        uint256 gasBefore = gasleft();
        
        try ageVerifier.verifyAge(_pA, _pB, _pC, _publicSignals) {
            // If successful
            return gasBefore - gasleft();
        } catch {
            // If failed, still return gas used
            return gasBefore - gasleft();
        }
    }
}
```

### Test Deployment (Dry Run)

```bash
# Test deployment script tanpa broadcast
forge script script/DeployAgeVerifier.s.sol --rpc-url https://testnet-rpc.monad.xyz/

# Test dengan fork
forge script script/DeployAgeVerifier.s.sol --fork-url https://testnet-rpc.monad.xyz/
```

---

## 6. Wallet Management

### Membuat Wallet

```bash
# Generate wallet baru
cast wallet new

# Import dengan private key
cast wallet import zk-deployer --private-key YOUR_PRIVATE_KEY_HERE

# Verify wallet
cast wallet address --account zk-deployer
# Enter keystore password: [password]
```

### Check Balance

```bash
# Check balance
cast balance $(cast wallet address --account zk-deployer) --rpc-url https://testnet-rpc.monad.xyz/

# Convert to readable format
cast balance $(cast wallet address --account zk-deployer) --rpc-url https://testnet-rpc.monad.xyz/ | cast to-unit ether
```

### Get Testnet MON

```bash
# Visit faucet
echo "Get MON from: https://faucet.testnet.monad.xyz/"
echo "Wallet address: $(cast wallet address --account zk-deployer)"

# Verify after receiving
cast balance $(cast wallet address --account zk-deployer) --rpc-url https://testnet-rpc.monad.xyz/ | cast to-unit ether
```

---

## 7. Deployment ke Monad Testnet

### Metode 1: Deploy dengan Script (Recommended)

```bash
# Setup private key
export PRIVATE_KEY=$(cast wallet private-key --account zk-deployer)
# Enter keystore password: [password]

# Deploy dengan script
forge script script/DeployAgeVerifier.s.sol:DeployAgeVerifier \
  --rpc-url https://testnet-rpc.monad.xyz/ \
  --broadcast \
  --account zk-deployer
```

### Metode 2: Deploy Individual Contracts

```bash
# Deploy Groth16Verifier first
forge create src/verifier.sol:Groth16Verifier \
  --account zk-deployer \
  --rpc-url https://testnet-rpc.monad.xyz/ \
  --broadcast

# Deploy AgeVerifier (replace VERIFIER_ADDRESS)
forge create src/AgeVerifier.sol:AgeVerifier \
  --constructor-args VERIFIER_ADDRESS \
  --account zk-deployer \
  --rpc-url https://testnet-rpc.monad.xyz/ \
  --broadcast
```

### Metode 3: Deploy dengan Gas Settings

```bash
# Deploy dengan custom gas
forge create src/verifier.sol:Groth16Verifier \
  --account zk-deployer \
  --rpc-url https://testnet-rpc.monad.xyz/ \
  --broadcast \
  --gas-limit 3000000 \
  --gas-price 2000000000

# Deploy dengan legacy transaction
forge create src/verifier.sol:Groth16Verifier \
  --account zk-deployer \
  --rpc-url https://testnet-rpc.monad.xyz/ \
  --broadcast \
  --legacy
```

---

## 8. Verifikasi Contract

### Verifikasi Groth16Verifier

```bash
# Verify dengan Sourcify
forge verify-contract \
  YOUR_VERIFIER_ADDRESS \
  src/verifier.sol:Groth16Verifier \
  --chain 10143 \
  --verifier sourcify \
  --verifier-url https://sourcify-api-monad.blockvision.org
```

### Verifikasi AgeVerifier

```bash
# Verify dengan constructor args
forge verify-contract \
  YOUR_AGE_VERIFIER_ADDRESS \
  src/AgeVerifier.sol:AgeVerifier \
  --chain 10143 \
  --verifier sourcify \
  --verifier-url https://sourcify-api-monad.blockvision.org \
  --constructor-args $(cast abi-encode "constructor(address)" YOUR_VERIFIER_ADDRESS)
```

### Alternative Verification

```bash
# Dengan Etherscan API (jika tersedia)
forge verify-contract \
  YOUR_AGE_VERIFIER_ADDRESS \
  src/AgeVerifier.sol:AgeVerifier \
  --chain 10143 \
  --etherscan-api-key YOUR_API_KEY \
  --constructor-args $(cast abi-encode "constructor(address)" YOUR_VERIFIER_ADDRESS)
```

---

## 9. Interaksi dengan Contract

### Setup Environment

```bash
# Set contract addresses
export AGE_VERIFIER_ADDRESS="YOUR_AGE_VERIFIER_ADDRESS"
export GROTH16_VERIFIER_ADDRESS="YOUR_VERIFIER_ADDRESS"
export RPC_URL="https://testnet-rpc.monad.xyz/"
```

### Read Functions

```bash
# Check owner
cast call $AGE_VERIFIER_ADDRESS "owner()" --rpc-url $RPC_URL | cast parse-bytes32-address

# Check if paused
cast call $AGE_VERIFIER_ADDRESS "paused()" --rpc-url $RPC_URL | cast to-dec

# Check total verifications
cast call $AGE_VERIFIER_ADDRESS "totalVerifications()" --rpc-url $RPC_URL | cast to-dec

# Check if address is verified
cast call $AGE_VERIFIER_ADDRESS "isVerifiedAdult(address)" $(cast wallet address --account zk-deployer) --rpc-url $RPC_URL | cast to-dec

# Check verification time
cast call $AGE_VERIFIER_ADDRESS "getVerificationTime(address)" $(cast wallet address --account zk-deployer) --rpc-url $RPC_URL | cast to-dec

# Check commitment status
cast call $AGE_VERIFIER_ADDRESS "isCommitmentUsed(uint256)" 0x123456789abcdef --rpc-url $RPC_URL | cast to-dec

# Get linked verifier
cast call $AGE_VERIFIER_ADDRESS "verifier()" --rpc-url $RPC_URL | cast parse-bytes32-address
```

### Write Functions

```bash
# Pause contract (owner only)
cast send $AGE_VERIFIER_ADDRESS \
  "setPaused(bool)" \
  true \
  --account zk-deployer \
  --rpc-url $RPC_URL

# Unpause contract
cast send $AGE_VERIFIER_ADDRESS \
  "setPaused(bool)" \
  false \
  --account zk-deployer \
  --rpc-url $RPC_URL

# Revoke own verification
cast send $AGE_VERIFIER_ADDRESS \
  "revokeVerification()" \
  --account zk-deployer \
  --rpc-url $RPC_URL
```

### Batch Operations

```bash
# Batch check verification
cast call $AGE_VERIFIER_ADDRESS \
  "batchCheckVerification(address[])" \
  "[$(cast wallet address --account zk-deployer),0x1234567890123456789012345678901234567890]" \
  --rpc-url $RPC_URL
```

### Event Monitoring

```bash
# Monitor all events
cast logs \
  --address $AGE_VERIFIER_ADDRESS \
  --rpc-url $RPC_URL

# Monitor AgeVerified events
cast logs \
  --address $AGE_VERIFIER_ADDRESS \
  --rpc-url $RPC_URL \
  "AgeVerified(address,uint256,bool,uint256)"

# Monitor from specific block
cast logs \
  --address $AGE_VERIFIER_ADDRESS \
  --from-block 1000000 \
  --to-block latest \
  --rpc-url $RPC_URL
```

### Age Verification dengan ZK Proof

```bash
# Format untuk verifyAge function (requires valid ZK proof)
# Note: Proof components harus dari circom circuit yang valid

cast send $AGE_VERIFIER_ADDRESS \
  "verifyAge(uint256[2],uint256[2][2],uint256[2],uint256[2])" \
  "[PI_A_0,PI_A_1]" \
  "[[PI_B_0_0,PI_B_0_1],[PI_B_1_0,PI_B_1_1]]" \
  "[PI_C_0,PI_C_1]" \
  "[IS_ADULT,COMMITMENT]" \
  --account zk-deployer \
  --rpc-url $RPC_URL
```

---

## 10. Best Practices

### Security Checklist

```bash
# Before deployment
- [ ] All tests passing: forge test
- [ ] Code coverage adequate: forge coverage  
- [ ] Gas usage optimized: forge test --gas-report
- [ ] Contract size acceptable: forge build
```

### Deployment Checklist

```bash
# Pre-deployment
- [ ] Sufficient balance: cast balance ADDRESS
- [ ] Network connectivity: cast client --rpc-url URL
- [ ] Script tested: forge script --fork-url URL

# Post-deployment  
- [ ] Contract verified: forge verify-contract
- [ ] Functions working: cast call CONTRACT FUNCTION
- [ ] Events monitoring: cast logs --address CONTRACT
- [ ] Documentation updated
```

### Troubleshooting

#### Insufficient Funds
```bash
# Check balance
cast balance $(cast wallet address --account zk-deployer) --rpc-url https://testnet-rpc.monad.xyz/ | cast to-unit ether

# Get testnet tokens
echo "Visit: https://faucet.testnet.monad.xyz/"
```

#### Nonce Issues
```bash
# Check current nonce
cast nonce $(cast wallet address --account zk-deployer) --rpc-url https://testnet-rpc.monad.xyz/

# Reset with specific nonce
forge create CONTRACT --nonce NONCE_NUMBER
```

#### Gas Issues
```bash
# Estimate gas
cast estimate CONTRACT_ADDRESS FUNCTION_SIGNATURE --rpc-url URL

# Use higher gas limit
forge create CONTRACT --gas-limit 3000000
```

#### Network Issues
```bash
# Test RPC connection
cast client --rpc-url https://testnet-rpc.monad.xyz/

# Check latest block
cast block-number --rpc-url https://testnet-rpc.monad.xyz/
```

### Useful Commands Reference

```bash
# Development
forge build                    # Compile contracts
forge test                     # Run tests
forge test -vvv               # Verbose test output
forge coverage                # Test coverage
forge clean                   # Clean build artifacts

# Deployment
forge create CONTRACT --account ACCOUNT
forge script SCRIPT --broadcast --account ACCOUNT
forge verify-contract ADDRESS CONTRACT --chain CHAIN_ID

# Interaction
cast call CONTRACT FUNCTION --rpc-url URL
cast send CONTRACT FUNCTION --account ACCOUNT --rpc-url URL
cast logs --address CONTRACT --rpc-url URL

# Wallet
cast wallet new               # Generate new wallet
cast wallet import NAME --private-key KEY
cast wallet address --account NAME
cast balance ADDRESS --rpc-url URL

# Utilities
cast abi-encode "function(type)" value
cast to-unit wei ether
cast to-dec HEX_VALUE
cast parse-bytes32-address HEX
```

---

## Kesimpulan

Tutorial ini mencakup complete workflow untuk deploy ZK Age Verification system menggunakan Foundry:

### ✅ Yang Telah Dipelajari

1. **Foundry Setup** - Installation untuk semua platforms
2. **Project Structure** - ZK-specific project organization
3. **Smart Contract Development** - AgeVerifier dan Groth16Verifier contracts
4. **Comprehensive Testing** - Unit tests dengan mocking untuk ZK proofs
5. **Professional Deployment** - Script deployment dengan logging
6. **Contract Verification** - Source code verification pada block explorer
7. **Contract Interaction** - Read/write operations menggunakan cast
8. **Best Practices** - Security, testing, dan deployment guidelines

### 🚀 Next Steps

1. **Generate Real ZK Proofs** - Setup circom circuit dan generate valid proofs
2. **Frontend Integration** - Connect dengan React application
3. **Advanced Features** - Add batch verification, admin functions
4. **Production Deployment** - Deploy to mainnet dengan proper security
5. **Monitoring** - Setup event monitoring dan analytics

Foundry memberikan environment yang powerful untuk ZK smart contract development dengan fast compilation, comprehensive testing, dan professional deployment tools.

**Ready untuk implement complete ZK Age Verification system! 🚀🔐**