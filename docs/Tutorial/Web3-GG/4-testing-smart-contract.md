---
sidebar_position: 4
title: 4. Testing Smart Contract TugWar Game
description: Membuat test suite sederhana untuk TugWar Game menggunakan Hardhat, TypeScript, dan Chai untuk memastikan game mechanics bekerja dengan benar
keywords: [hardhat, testing, typescript, chai, mocha, tugwar, game, smart contract, solidity, test]
---

# 4. Testing Smart Contract TugWar Game

Setelah membuat smart contract TugWar Game, langkah selanjutnya adalah membuat **test suite** untuk memastikan semua game mechanics bekerja dengan benar, aman, dan efisien. Testing yang baik adalah kunci untuk deployment yang sukses.

## Daftar Isi

1. [Setup Testing Environment](#1-setup-testing-environment)
2. [Membuat Test File](#2-membuat-test-file)
3. [Menjalankan Tests](#3-menjalankan-tests)
4. [Test Coverage](#4-test-coverage)

## 1. Setup Testing Environment

### Menghapus Test Default

```bash
rm test/Lock.ts
```

## 2. Membuat Test File

### Membuat TugWarContract.test.ts

Buat file `test/TugWarContract.test.ts`:

```typescript
import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { TugWarContract } from "../typechain-types";

describe("TugWarContract", function () {
    // Test fixture untuk setup contract
    async function deployTugWarFixture() {
        const [owner, player1, player2, otherAccount] = await ethers.getSigners();

        const TugWarContract = await ethers.getContractFactory("TugWarContract");
        const tugwar = await TugWarContract.deploy(owner.address);

        return { tugwar, owner, player1, player2, otherAccount };
    }

    // ═══════════════════════════════════════════════════════════════
    // DEPLOYMENT TESTS
    // ═══════════════════════════════════════════════════════════════

    describe("Deployment", function () {
        it("Should deploy with correct owner", async function () {
            const { tugwar, owner } = await loadFixture(deployTugWarFixture);
            expect(await tugwar.owner()).to.equal(owner.address);
        });

        it("Should initialize with default game state", async function () {
            const { tugwar } = await loadFixture(deployTugWarFixture);
            
            expect(await tugwar.ropePosition()).to.equal(0);
            expect(await tugwar.team1Score()).to.equal(0);
            expect(await tugwar.team2Score()).to.equal(0);
            expect(await tugwar.maxScoreDifference()).to.equal(5);
            expect(await tugwar.totalPulls()).to.equal(0);
            expect(await tugwar.gamesPlayed()).to.equal(0);
        });

        it("Should emit GameReset event on deployment", async function () {
            const [owner] = await ethers.getSigners();
            const TugWarContract = await ethers.getContractFactory("TugWarContract");
            
            const tugwar = await TugWarContract.deploy(owner.address);
            
            await expect(tugwar.deploymentTransaction())
                .to.emit(tugwar, "GameReset")
                .withArgs(owner.address, 5);
        });

        it("Should use deployer as owner when zero address passed", async function () {
            const [deployer] = await ethers.getSigners();
            const TugWarContract = await ethers.getContractFactory("TugWarContract");
            const tugwar = await TugWarContract.deploy(ethers.ZeroAddress);
            
            expect(await tugwar.owner()).to.equal(deployer.address);
        });
    });

    // ═══════════════════════════════════════════════════════════════
    // CORE GAME MECHANICS TESTS
    // ═══════════════════════════════════════════════════════════════

    describe("Core Game Mechanics", function () {
        describe("Pull Function", function () {
            it("Should execute Team 1 pull correctly", async function () {
                const { tugwar, player1 } = await loadFixture(deployTugWarFixture);
                
                await expect(tugwar.connect(player1).pull(true))
                    .to.emit(tugwar, "PullExecuted")
                    .withArgs(player1.address, true, -1, 1, 0);
                
                expect(await tugwar.team1Score()).to.equal(1);
                expect(await tugwar.team2Score()).to.equal(0);
                expect(await tugwar.ropePosition()).to.equal(-1);
                expect(await tugwar.totalPulls()).to.equal(1);
            });

            it("Should execute Team 2 pull correctly", async function () {
                const { tugwar, player2 } = await loadFixture(deployTugWarFixture);
                
                await expect(tugwar.connect(player2).pull(false))
                    .to.emit(tugwar, "PullExecuted")
                    .withArgs(player2.address, false, 1, 0, 1);
                
                expect(await tugwar.team1Score()).to.equal(0);
                expect(await tugwar.team2Score()).to.equal(1);
                expect(await tugwar.ropePosition()).to.equal(1);
                expect(await tugwar.totalPulls()).to.equal(1);
            });

            it("Should prevent pulls when game is over", async function () {
                const { tugwar, owner, player1 } = await loadFixture(deployTugWarFixture);
                
                // Set low max score difference and let team 1 win
                await tugwar.connect(owner).reSet(1);
                await tugwar.connect(player1).pull(true);
                
                // Try to pull after game over
                await expect(tugwar.connect(player1).pull(true))
                    .to.be.revertedWithCustomError(tugwar, "GameOver");
            });
        });

        describe("Win Conditions", function () {
            it("Should detect Team 1 win", async function () {
                const { tugwar, owner, player1 } = await loadFixture(deployTugWarFixture);
                
                await tugwar.connect(owner).reSet(3);
                
                // Team 1 needs 3 more than Team 2
                for (let i = 0; i < 3; i++) {
                    await tugwar.connect(player1).pull(true);
                }
                
                expect(await tugwar.getWinStatus()).to.equal(1);
            });

            it("Should detect Team 2 win", async function () {
                const { tugwar, owner, player2 } = await loadFixture(deployTugWarFixture);
                
                await tugwar.connect(owner).reSet(3);
                
                // Team 2 needs 3 more than Team 1
                for (let i = 0; i < 3; i++) {
                    await tugwar.connect(player2).pull(false);
                }
                
                expect(await tugwar.getWinStatus()).to.equal(2);
            });

            it("Should emit GameWon event", async function () {
                const { tugwar, owner, player1 } = await loadFixture(deployTugWarFixture);
                
                await tugwar.connect(owner).reSet(1);
                
                await expect(tugwar.connect(player1).pull(true))
                    .to.emit(tugwar, "GameWon")
                    .withArgs(1, 1, 0);
            });
        });
    });

    // ═══════════════════════════════════════════════════════════════
    // OWNER MANAGEMENT TESTS
    // ═══════════════════════════════════════════════════════════════

    describe("Owner Management", function () {
        describe("Reset Game", function () {
            it("Should reset game state correctly", async function () {
                const { tugwar, owner, player1 } = await loadFixture(deployTugWarFixture);
                
                // Make some moves first
                await tugwar.connect(player1).pull(true);
                
                // Verify game has some state
                expect(await tugwar.team1Score()).to.equal(1);
                
                await expect(tugwar.connect(owner).reSet(10))
                    .to.emit(tugwar, "GameReset")
                    .withArgs(owner.address, 10);
                
                expect(await tugwar.team1Score()).to.equal(0);
                expect(await tugwar.team2Score()).to.equal(0);
                expect(await tugwar.ropePosition()).to.equal(0);
                expect(await tugwar.totalPulls()).to.equal(0);
                expect(await tugwar.maxScoreDifference()).to.equal(10);
                expect(await tugwar.gamesPlayed()).to.equal(1);
            });

            it("Should validate max score difference", async function () {
                const { tugwar, owner } = await loadFixture(deployTugWarFixture);
                
                await expect(tugwar.connect(owner).reSet(0))
                    .to.be.revertedWithCustomError(tugwar, "InvalidMaxScoreDifference");
                
                await expect(tugwar.connect(owner).reSet(51))
                    .to.be.revertedWithCustomError(tugwar, "InvalidMaxScoreDifference");
            });

            it("Should only allow owner to reset", async function () {
                const { tugwar, player1 } = await loadFixture(deployTugWarFixture);
                
                await expect(tugwar.connect(player1).reSet(10))
                    .to.be.revertedWithCustomError(tugwar, "OnlyOwner");
            });
        });

        describe("Ownership Transfer", function () {
            it("Should transfer ownership correctly", async function () {
                const { tugwar, owner, player1 } = await loadFixture(deployTugWarFixture);
                
                await expect(tugwar.connect(owner).transferOwnership(player1.address))
                    .to.emit(tugwar, "OwnershipTransferred")
                    .withArgs(owner.address, player1.address);
                
                expect(await tugwar.owner()).to.equal(player1.address);
            });

            it("Should reject zero address", async function () {
                const { tugwar, owner } = await loadFixture(deployTugWarFixture);
                
                await expect(tugwar.connect(owner).transferOwnership(ethers.ZeroAddress))
                    .to.be.revertedWith("New owner cannot be zero address");
            });

            it("Should only allow current owner to transfer", async function () {
                const { tugwar, player1, player2 } = await loadFixture(deployTugWarFixture);
                
                await expect(tugwar.connect(player1).transferOwnership(player2.address))
                    .to.be.revertedWithCustomError(tugwar, "OnlyOwner");
            });
        });
    });

    // ═══════════════════════════════════════════════════════════════
    // VIEW FUNCTIONS TESTS
    // ═══════════════════════════════════════════════════════════════

    describe("View Functions", function () {
        describe("Game Info", function () {
            it("Should return correct game info", async function () {
                const { tugwar, player1, player2 } = await loadFixture(deployTugWarFixture);
                
                // Make some moves
                await tugwar.connect(player1).pull(true);   // Team 1: 1
                await tugwar.connect(player2).pull(false);  // Team 2: 1
                
                const [currentRopePos, score1, score2, maxDiff, winner, pulls, games] = 
                    await tugwar.getGameInfo();
                
                expect(currentRopePos).to.equal(0); // 1 pull each direction
                expect(score1).to.equal(1);
                expect(score2).to.equal(1);
                expect(maxDiff).to.equal(5);
                expect(winner).to.equal(0); // No winner yet
                expect(pulls).to.equal(2);
                expect(games).to.equal(0);
            });
        });

        describe("Team Stats", function () {
            it("Should return correct Team 1 stats", async function () {
                const { tugwar, player1 } = await loadFixture(deployTugWarFixture);
                
                // Team 1 gets 3 pulls
                for (let i = 0; i < 3; i++) {
                    await tugwar.connect(player1).pull(true);
                }
                
                const [score, isWinning, advantage] = await tugwar.getTeamStats(1);
                
                expect(score).to.equal(3);
                expect(isWinning).to.equal(true);
                expect(advantage).to.equal(3);
            });

            it("Should return correct Team 2 stats when behind", async function () {
                const { tugwar, player1 } = await loadFixture(deployTugWarFixture);
                
                // Team 1 gets 3 pulls
                for (let i = 0; i < 3; i++) {
                    await tugwar.connect(player1).pull(true);
                }
                
                const [score, isWinning, advantage] = await tugwar.getTeamStats(2);
                
                expect(score).to.equal(0);
                expect(isWinning).to.equal(false);
                expect(advantage).to.equal(0);
            });

            it("Should reject invalid team number", async function () {
                const { tugwar } = await loadFixture(deployTugWarFixture);
                
                await expect(tugwar.getTeamStats(0))
                    .to.be.revertedWith("Invalid team number");
                
                await expect(tugwar.getTeamStats(3))
                    .to.be.revertedWith("Invalid team number");
            });
        });

        describe("Prediction System", function () {
            it("Should return no prediction for new game", async function () {
                const { tugwar } = await loadFixture(deployTugWarFixture);
                
                const [predictedWinner, confidence] = await tugwar.getPrediction();
                
                expect(predictedWinner).to.equal(0);
                expect(confidence).to.equal(0);
            });

            it("Should predict Team 1 advantage", async function () {
                const { tugwar, player1 } = await loadFixture(deployTugWarFixture);
                
                for (let i = 0; i < 3; i++) {
                    await tugwar.connect(player1).pull(true);
                }
                
                const [predictedWinner, confidence] = await tugwar.getPrediction();
                
                expect(predictedWinner).to.equal(1);
                expect(confidence).to.equal(60); // (3 * 100) / 5 = 60%
            });

            it("Should handle tied game", async function () {
                const { tugwar, player1, player2 } = await loadFixture(deployTugWarFixture);
                
                await tugwar.connect(player1).pull(true);   // Team 1: 1
                await tugwar.connect(player2).pull(false);  // Team 2: 1
                
                const [predictedWinner, confidence] = await tugwar.getPrediction();
                
                expect(predictedWinner).to.equal(0);
                expect(confidence).to.equal(0);
            });
        });

        describe("Utility Functions", function () {
            it("Should check if game can start", async function () {
                const { tugwar, owner } = await loadFixture(deployTugWarFixture);
                
                expect(await tugwar.canStartGame()).to.equal(true);
                
                // After winning, should return false
                await tugwar.connect(owner).reSet(1);
                await tugwar.connect(owner).pull(true);
                
                expect(await tugwar.canStartGame()).to.equal(false);
            });
        });
    });

    // ═══════════════════════════════════════════════════════════════
    // GAME SCENARIO TESTS
    // ═══════════════════════════════════════════════════════════════

    describe("Game Scenarios", function () {
        it("Should handle complete game scenario", async function () {
            const { tugwar, owner, player1, player2 } = await loadFixture(deployTugWarFixture);
            
            console.log("🎮 Testing complete TugWar game scenario...");
            
            // Set game parameters
            await tugwar.connect(owner).reSet(3);
            
            // Alternating gameplay
            await tugwar.connect(player1).pull(true);   // Team 1: 1
            await tugwar.connect(player2).pull(false);  // Team 2: 1
            await tugwar.connect(player1).pull(true);   // Team 1: 2
            
            // Check current state
            expect(await tugwar.getWinStatus()).to.equal(0); // No winner yet
            
            // Final decisive pulls
            await tugwar.connect(player1).pull(true);   // Team 1: 3
            await tugwar.connect(player1).pull(true);   // Team 1: 4, wins!
            
            const finalWinStatus = await tugwar.getWinStatus();
            console.log(`🎉 Game Result: Team ${finalWinStatus} WINS!`);
            
            expect(finalWinStatus).to.equal(1);
            expect(await tugwar.team1Score()).to.equal(4);
            expect(await tugwar.team2Score()).to.equal(1);
        });

        it("Should handle multiple game sessions", async function () {
            const { tugwar, owner, player1, player2 } = await loadFixture(deployTugWarFixture);
            
            console.log("🏆 Testing multiple game sessions...");
            
            const totalGames = 3;
            
            for (let game = 1; game <= totalGames; game++) {
                console.log(`🎮 Game ${game}/${totalGames}:`);
                
                // Reset for new game
                await tugwar.connect(owner).reSet(2);
                
                // Quick game simulation
                while ((await tugwar.getWinStatus()) === 0n) {
                    const teamChoice = Math.random() < 0.5;
                    const player = teamChoice ? player1 : player2;
                    
                    await tugwar.connect(player).pull(teamChoice);
                }
                
                const winner = await tugwar.getWinStatus();
                const [, score1, score2] = await tugwar.getGameInfo();
                
                console.log(`   Winner: Team ${winner} (${score1}-${score2})`);
            }
            
            // Verify game counter
            expect(await tugwar.gamesPlayed()).to.equal(totalGames);
        });
    });

    // ═══════════════════════════════════════════════════════════════
    // SECURITY TESTS
    // ═══════════════════════════════════════════════════════════════

    describe("Security", function () {
        it("Should prevent non-owner from resetting game", async function () {
            const { tugwar, player1 } = await loadFixture(deployTugWarFixture);
            
            await expect(tugwar.connect(player1).reSet(10))
                .to.be.revertedWithCustomError(tugwar, "OnlyOwner");
        });

        it("Should validate resetGame parameters", async function () {
            const { tugwar, owner } = await loadFixture(deployTugWarFixture);
            
            await expect(tugwar.connect(owner).reSet(0))
                .to.be.revertedWithCustomError(tugwar, "InvalidMaxScoreDifference");
            
            await expect(tugwar.connect(owner).reSet(51))
                .to.be.revertedWithCustomError(tugwar, "InvalidMaxScoreDifference");
        });

        it("Should prevent pulls when game is over", async function () {
            const { tugwar, owner, player1 } = await loadFixture(deployTugWarFixture);
            
            await tugwar.connect(owner).reSet(1);
            await tugwar.connect(player1).pull(true);
            
            await expect(tugwar.connect(player1).pull(true))
                .to.be.revertedWithCustomError(tugwar, "GameOver");
        });
    });
});
```

## 3. Menjalankan Tests

### Update package.json

Tambahkan script testing di `package.json`:

```json
{
  "scripts": {
    "test": "hardhat test",
    "test:gas": "REPORT_GAS=true hardhat test",
    "test:coverage": "hardhat coverage"
  }
}
```

### Menjalankan Test Suite

```bash
# Jalankan semua tests
npm run test

# Jalankan tests dengan gas reporting
npm run test:gas

# Jalankan coverage analysis
npm run test:coverage

# Jalankan test spesifik
npx hardhat test --grep "Deployment"
npx hardhat test --grep "Core Game Mechanics"
```

### Output yang Diharapkan

```
  TugWarContract
    Deployment
      ✓ Should deploy with correct owner
      ✓ Should initialize with default game state
      ✓ Should emit GameReset event on deployment
      ✓ Should use deployer as owner when zero address passed

    Core Game Mechanics
      Pull Function
        ✓ Should execute Team 1 pull correctly
        ✓ Should execute Team 2 pull correctly
        ✓ Should prevent pulls when game is over
      Win Conditions
        ✓ Should detect Team 1 win
        ✓ Should detect Team 2 win
        ✓ Should emit GameWon event

    Owner Management
      Reset Game
        ✓ Should reset game state correctly
        ✓ Should validate max score difference
        ✓ Should only allow owner to reset
      Ownership Transfer
        ✓ Should transfer ownership correctly
        ✓ Should reject zero address
        ✓ Should only allow current owner to transfer

    View Functions
      Game Info
        ✓ Should return correct game info
      Team Stats
        ✓ Should return correct Team 1 stats
        ✓ Should return correct Team 2 stats when behind
        ✓ Should reject invalid team number
      Prediction System
        ✓ Should return no prediction for new game
        ✓ Should predict Team 1 advantage
        ✓ Should handle tied game
      Utility Functions
        ✓ Should check if game can start

    Game Scenarios
      ✓ Should handle complete game scenario
      ✓ Should handle multiple game sessions

    Security
      ✓ Should prevent non-owner from resetting game
      ✓ Should validate resetGame parameters
      ✓ Should prevent pulls when game is over

  27 passing (2s)
```

## 4. Test Coverage

### Install Coverage Plugin

Plugin coverage sudah terinstall sebagai bagian dari dependencies:

```bash
npm install --save-dev solidity-coverage
```

### Generate Coverage Report

```bash
npx hardhat coverage
```

### Target Coverage yang Baik

Untuk smart contract yang berkualitas:

- **Statements**: >95%
- **Branches**: >90% 
- **Functions**: 100%
- **Lines**: >95%

### Contoh Coverage Output

```
--------------------|----------|----------|----------|----------|----------------|
File                |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
--------------------|----------|----------|----------|----------|----------------|
 contracts/         |      100 |    91.67 |      100 |      100 |                |
  TugWarContract.sol |      100 |    91.67 |      100 |      100 |                |
--------------------|----------|----------|----------|----------|----------------|
All files           |      100 |    91.67 |      100 |      100 |                |
--------------------|----------|----------|----------|----------|----------------|
```

## Kesimpulan

Selamat! Anda telah membuat test suite yang sederhana namun comprehensive untuk TugWar Game dengan:

### ✅ Test Categories Covered
1. **Deployment Tests** - Contract initialization
2. **Core Game Mechanics** - Pull function dan win conditions  
3. **Owner Management** - Reset game dan ownership transfer
4. **View Functions** - Game info, team stats, predictions
5. **Game Scenarios** - Complete gameplay simulation
6. **Security Tests** - Access control dan input validation

### ✅ Testing Best Practices
1. **Fixtures** - Reusable test setups dengan loadFixture
2. **Event Testing** - Comprehensive event verification
3. **Type Safety** - TypeScript integration
4. **Coverage Analysis** - Quality assurance
5. **Error Testing** - Custom error handling verification

### ✅ Game-Specific Testing
1. **Gameplay Flow** - Complete game scenarios
2. **Multiple Sessions** - Tournament-style testing
3. **Win Conditions** - Proper game ending
4. **Access Control** - Owner-only functions
5. **Input Validation** - Parameter checking

### 🎯 Key Metrics
- **25+ Test Cases** - Comprehensive coverage
- **All Core Functions** - Every function tested
- **Event Verification** - All events validated
- **Security Validation** - Access control verified
- **Real Scenarios** - Actual gameplay tested

Test suite ini memberikan confidence yang tinggi bahwa smart contract TugWar Game akan bekerja dengan benar saat di-deploy ke Monad Testnet.

Pada bagian selanjutnya, kita akan melakukan deployment ke Monad Testnet dan setup monitoring tools.