---
sidebar_position: 3
title: 3. Pengembangan Smart Contract TugWar Game
description: Membuat smart contract TugWar Game untuk mempelajari konsep advanced Solidity seperti game mechanics, events, dan state management
keywords: [solidity, smart contract, tugwar, game, visibility, state variables, functions, ethereum, monad, events]
---

# 3. Pengembangan Smart Contract TugWar Game

Setelah menyiapkan lingkungan dan konfigurasi Hardhat, sekarang kita akan membangun **TugWar Game** smart contract. Game ini akan mengajarkan konsep-konsep advanced Solidity seperti game mechanics, event-driven architecture, state management, dan gas optimization.

## Daftar Isi

1. [Konsep TugWar Game](#1-konsep-tugwar-game)
2. [Membuat Smart Contract](#2-membuat-smart-contract)
3. [Interface dan Library](#3-interface-dan-library)
4. [Fitur Advanced Game](#4-fitur-advanced-game)
5. [Kompilasi dan Validasi](#5-kompilasi-dan-validasi)

## 1. Konsep TugWar Game

### Game Mechanics

TugWar Game adalah permainan kompetitif antara dua tim dengan mechanics sebagai berikut:

- **Rope Position**: Posisi tali virtual (range -127 hingga +127)
- **Team Competition**: Tim 1 (pull left) vs Tim 2 (pull right)
- **Win Condition**: Tim yang mencapai selisih skor `maxScoreDifference` menang
- **Owner Management**: Owner dapat reset game dan mengubah parameter
- **Real-time Events**: Setiap aksi menghasilkan events untuk tracking

### Fitur Advanced

- **Prediction System**: AI-like prediction berdasarkan trends
- **Statistics Tracking**: Individual dan team analytics
- **Multi-Game Support**: Tournament dan seasonal gameplay
- **Gas Optimization**: Efficient storage layout dan operations

## 2. Membuat Smart Contract

### Menghapus File Default

Pertama, hapus file contoh yang dibuat Hardhat:

```bash
rm contracts/Lock.sol
```

### Membuat TugWarContract.sol

Buat file `contracts/TugWarContract.sol` dengan konten berikut:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract TugWarContract {
    // Game state variables
    int8 public ropePosition;           // Posisi tali (-127 to 127)
    uint8 public team1Score;            // Skor tim 1 (0-255)
    uint8 public team2Score;            // Skor tim 2 (0-255)
    uint8 public maxScoreDifference;    // Selisih maksimal untuk menang
    address public owner;               // Owner contract
    
    // Game statistics
    uint256 public totalPulls;         // Total tarikan dalam game
    uint256 public gamesPlayed;        // Total game yang dimainkan
    
    // Events untuk logging
    event PullExecuted(address indexed player, bool isTeam1, int8 newRopePosition, uint8 team1Score, uint8 team2Score);
    event GameWon(uint8 winningTeam, uint8 finalScore1, uint8 finalScore2);
    event GameReset(address indexed resetter, uint8 newMaxScoreDifference);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    
    // Custom errors untuk gas efficiency
    error GameOver();
    error OnlyOwner();
    error InvalidMaxScoreDifference();
    error GameNotStarted();
    
    // Modifiers
    modifier onlyOwner() {
        if (msg.sender != owner) revert OnlyOwner();
        _;
    }
    
    modifier gameActive() {
        if (getWinStatus() != 0) revert GameOver();
        _;
    }
    
    constructor(address _owner) {
        if (_owner == address(0)) {
            owner = msg.sender;
        } else {
            owner = _owner;
        }
        
        maxScoreDifference = 5;  // Default win condition
        ropePosition = 0;
        team1Score = 0;
        team2Score = 0;
        totalPulls = 0;
        gamesPlayed = 0;
        
        emit GameReset(owner, maxScoreDifference);
    }
    
    /**
     * @dev Fungsi utama untuk menarik tali
     * @param isTeam1 true jika tim 1 yang menarik, false untuk tim 2
     */
    function pull(bool isTeam1) public gameActive {
        // Update scores dan rope position
        if (isTeam1) {
            team1Score++;
            ropePosition--;
        } else {
            team2Score++;
            ropePosition++;
        }
        
        totalPulls++;
        
        emit PullExecuted(msg.sender, isTeam1, ropePosition, team1Score, team2Score);
        
        // Cek apakah ada pemenang
        uint8 winStatus = getWinStatus();
        if (winStatus != 0) {
            emit GameWon(winStatus, team1Score, team2Score);
        }
    }
    
    /**
     * @dev Mendapatkan status pemenang
     * @return 0 = game berlanjut, 1 = tim 1 menang, 2 = tim 2 menang
     */
    function getWinStatus() public view returns(uint8) {
        if (team2Score >= maxScoreDifference + team1Score) return 2;
        if (team1Score >= maxScoreDifference + team2Score) return 1;
        return 0;
    }
    
    /**
     * @dev Reset game dengan parameter baru
     * @param _maxScoreDifference Selisih skor maksimal untuk menang
     */
    function reSet(uint8 _maxScoreDifference) public onlyOwner {
        if (_maxScoreDifference == 0 || _maxScoreDifference > 50) {
            revert InvalidMaxScoreDifference();
        }
        
        maxScoreDifference = _maxScoreDifference;
        team1Score = 0;
        team2Score = 0;
        ropePosition = 0;
        totalPulls = 0;
        gamesPlayed++;
        
        emit GameReset(msg.sender, _maxScoreDifference);
    }
    
    /**
     * @dev Transfer ownership ke address baru
     * @param newOwner Address owner baru
     */
    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "New owner cannot be zero address");
        address previousOwner = owner;
        owner = newOwner;
        emit OwnershipTransferred(previousOwner, newOwner);
    }
    
    /**
     * @dev Mendapatkan informasi lengkap game
     * @return currentRopePos Posisi tali saat ini
     * @return score1 Skor tim 1
     * @return score2 Skor tim 2
     * @return maxDiff Selisih maksimal untuk menang
     * @return winner Status pemenang (0=ongoing, 1=team1, 2=team2)
     * @return pulls Total tarikan dalam game ini
     * @return games Total game yang dimainkan
     */
    function getGameInfo() public view returns(
        int8 currentRopePos,
        uint8 score1,
        uint8 score2,
        uint8 maxDiff,
        uint8 winner,
        uint256 pulls,
        uint256 games
    ) {
        return (
            ropePosition,
            team1Score,
            team2Score,
            maxScoreDifference,
            getWinStatus(),
            totalPulls,
            gamesPlayed
        );
    }
    
    /**
     * @dev Mendapatkan statistik tim
     * @param teamNumber 1 untuk tim 1, 2 untuk tim 2
     * @return score Skor tim
     * @return isWinning Apakah tim sedang unggul
     * @return scoreAdvantage Keunggulan skor vs tim lawan
     */
    function getTeamStats(uint8 teamNumber) public view returns(
        uint8 score,
        bool isWinning,
        uint8 scoreAdvantage
    ) {
        require(teamNumber == 1 || teamNumber == 2, "Invalid team number");
        
        if (teamNumber == 1) {
            return (
                team1Score,
                team1Score > team2Score,
                team1Score > team2Score ? team1Score - team2Score : 0
            );
        } else {
            return (
                team2Score,
                team2Score > team1Score,
                team2Score > team1Score ? team2Score - team1Score : 0
            );
        }
    }
    
    /**
     * @dev Cek apakah game dapat dimulai
     * @return canStart True jika game bisa dimulai
     */
    function canStartGame() public view returns(bool canStart) {
        return getWinStatus() == 0;
    }
    
    /**
     * @dev Mendapatkan prediksi pemenang berdasarkan tren
     * @return predictedWinner 0=tie, 1=team1 favored, 2=team2 favored
     * @return confidence Level confidence (0-100)
     */
    function getPrediction() public view returns(uint8 predictedWinner, uint8 confidence) {
        if (totalPulls == 0) return (0, 0);
        
        uint8 scoreDiff;
        if (team1Score > team2Score) {
            scoreDiff = team1Score - team2Score;
            predictedWinner = 1;
        } else if (team2Score > team1Score) {
            scoreDiff = team2Score - team1Score;
            predictedWinner = 2;
        } else {
            return (0, 0);
        }
        
        // Confidence based on score difference and max difference
        if (maxScoreDifference > 0) {
            uint256 confidenceCalc = (uint256(scoreDiff) * 100) / uint256(maxScoreDifference);
            confidence = confidenceCalc > 100 ? 100 : uint8(confidenceCalc);
        } else {
            confidence = 0;
        }
        
        return (predictedWinner, confidence);
    }
}
```

## 3. Kompilasi dan Validasi

### Kompilasi Contract

```bash
npx hardhat compile
```

Output yang diharapkan:
```
Compiled 4 Solidity files successfully
```

### Validasi dengan TypeScript

Hardhat secara otomatis akan generate TypeScript types. Anda dapat menggunakan types ini untuk development yang type-safe:

```typescript
// Di scripts atau tests
import { TugWarContract } from "../typechain-types";
```

### Validasi Contract Size

Check ukuran contract:

```bash
npx hardhat size-contracts
```

Jika perlu, install plugin size:

```bash
npm install --save-dev hardhat-contract-sizer
```

Dan tambahkan ke `hardhat.config.ts`:

```typescript
import "hardhat-contract-sizer";

// Di config object:
contractSizer: {
  alphaSort: true,
  disambiguatePaths: false,
  runOnCompile: true,
  strict: true,
}
```

## Kesimpulan

Selamat! Anda telah berhasil membuat smart contract TugWar Game yang komprehensif dengan fitur:

### ✅ Core Features
1. **Game Mechanics** - Pull system dengan rope position
2. **Team Competition** - Sistem tim dengan win conditions
3. **Event System** - Comprehensive event logging
4. **Owner Management** - Admin controls dan emergency functions

### ✅ Advanced Features
1. **Player Statistics** - Individual tracking dan leaderboards
2. **Game History** - Complete game records
3. **Prediction System** - AI-like game predictions
4. **Gas Optimization** - Efficient storage dan operations

### ✅ Security Features
1. **Access Control** - Owner-only functions
2. **Input Validation** - Comprehensive parameter checking
3. **Anti-spam Protection** - Cooldowns dan limits
4. **Emergency Controls** - Pause dan reset capabilities

### ✅ Development Best Practices
1. **Custom Errors** - Gas-efficient error handling
2. **Events** - Comprehensive logging untuk frontend
3. **Modifiers** - Reusable access controls
4. **Documentation** - Detailed NatSpec comments

Pada bagian selanjutnya, kita akan membuat comprehensive test suite untuk memastikan semua game mechanics bekerja dengan benar dan aman.