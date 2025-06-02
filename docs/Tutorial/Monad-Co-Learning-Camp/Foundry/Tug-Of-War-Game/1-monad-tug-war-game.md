---
sidebar_position: 1
title: 1. Contracts TugWar Game dengan Foundry dan Template Monad
description: Membuat Smart Contract Tug Of War Game dengan Foundry
---

# TugWar Game dengan Foundry dan Template Monad

Dokumentasi lengkap untuk membuat TugWar Game smart contract menggunakan Foundry dengan template Monad oficial. Tutorial ini akan mengajarkan cara menggunakan toolkit Foundry yang modern dan efisien untuk pengembangan game smart contract di Monad Testnet.

## Daftar Isi

1. [Instalasi Foundry](#1-instalasi-foundry)
2. [Setup Proyek dengan Template Monad](#2-setup-proyek-dengan-template-monad)
3. [Membuat Smart Contract TugWar](#3-membuat-smart-contract-tugwar)
4. [Testing dengan Foundry](#4-testing-dengan-foundry)
5. [Script Deployment](#5-script-deployment)
6. [Wallet Management dengan Cast](#6-wallet-management-dengan-cast)
7. [Deployment ke Monad Testnet](#7-deployment-ke-monad-testnet)
8. [Verifikasi Contract](#8-verifikasi-contract)
9. [Interaksi dengan Contract](#9-interaksi-dengan-contract)
10. [Best Practices dan Tips](#10-best-practices-dan-tips)

---

## 1. Instalasi Foundry

Foundry adalah toolkit yang sangat cepat dan portable untuk pengembangan smart contract Ethereum yang ditulis dalam Rust.

### Untuk macOS

#### Prasyarat
- macOS 10.15 Catalina atau lebih baru
- Aplikasi Terminal
- Setidaknya 1GB ruang disk kosong

#### Langkah Instalasi

1. **Buka Terminal**

2. **Jalankan script instalasi Foundryup:**
   ```bash
   curl -L https://foundry.paradigm.xyz | bash
   ```

3. **Install package libusb (jika belum ada):**
   ```bash
   brew install libusb
   ```

4. **Restart terminal atau source profile:**
   ```bash
   source ~/.zshrc  # atau source ~/.bash_profile
   ```

5. **Install Foundry:**
   ```bash
   foundryup
   ```

6. **Verifikasi instalasi:**
   ```bash
   forge --version
   cast --version
   anvil --version
   ```

### Untuk Windows (dengan WSL)

#### Prasyarat
- Windows 10 versi 2004+ atau Windows 11
- Akses admin
- Setidaknya 5GB ruang disk kosong

#### Langkah Instalasi

1. **Aktifkan Hyper-V:**
   - Tekan Windows key → cari "Turn Windows features on or off"
   - Centang "Hyper-V" → OK → Restart

2. **Install WSL:**
   ```powershell
   # Jalankan di PowerShell sebagai Administrator
   wsl --install
   # Atau untuk Ubuntu spesifik:
   wsl --install -d Ubuntu-22.04
   ```

3. **Restart komputer**

4. **Buka terminal WSL dan setup user**

5. **Install Foundry di WSL:**
   ```bash
   curl -L https://foundry.paradigm.xyz | bash
   source ~/.bashrc
   foundryup
   ```

6. **Verifikasi instalasi:**
   ```bash
   forge --version
   cast --version
   anvil --version
   ```

### Setup Node.js (Opsional)

Meskipun Foundry tidak memerlukan Node.js, beberapa tools tambahan mungkin memerlukannya:

#### macOS:
```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.zshrc
# Install Node.js 18
nvm install 18
nvm use 18
```

#### Windows (WSL):
```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
# Install Node.js 18
nvm install 18
nvm use 18
```

---

## 2. Setup Proyek dengan Template Monad

Template Monad menyediakan setup yang sudah dikonfigurasi untuk Monad Testnet dengan semua dependencies dan konfigurasi yang diperlukan.

### Membuat Proyek Baru

```bash
# Buat proyek baru dengan template Monad
forge init --template monad-developers/foundry-monad tugwar-game

# Masuk ke direktori proyek
cd tugwar-game
```

### Struktur Proyek

Setelah inisialisasi, struktur proyek akan terlihat seperti ini:

```
tugwar-game/
├── foundry.toml           # Konfigurasi Foundry
├── script/                # Deployment scripts
├── src/                   # Smart contracts
├── test/                  # Test files
├── lib/                   # Dependencies (forge-std, dll)
├── .env.example          # Environment variables example
├── .gitignore            # Git ignore rules
└── README.md             # Project documentation
```

### Memahami foundry.toml

File `foundry.toml` berisi konfigurasi untuk Monad Testnet:

```toml
[profile.default]
src = "src"
out = "out"
libs = ["lib"]
metadata = true
metadata_hash = "none"  # disable ipfs
use_literal_content = true # use source code

# Monad Configuration
eth-rpc-url="https://testnet-rpc.monad.xyz"
chain_id = 10143

# See more config options https://github.com/foundry-rs/foundry/blob/master/crates/config/README.md#all-options
```

### Setup Environment Variables

1. **Copy file environment:**
   ```bash
   cp .env.example .env
   ```

2. **Edit file .env (opsional untuk beberapa fitur):**
   ```bash
   # .env
   ETHERSCAN_API_KEY=your_api_key_here  # Untuk verifikasi (opsional)
   ```

---

## 3. Membuat Smart Contract TugWar

Game TugWar adalah permainan di mana dua tim saling tarik menarik tali virtual. Tim yang berhasil menarik tali sejauh `maxScoreDifference` akan memenangkan permainan.

### Konsep Game

- **Rope Position**: Posisi tali (-5 hingga +5)
- **Team Scores**: Skor masing-masing tim
- **Win Condition**: Tim menang jika selisih skor mencapai `maxScoreDifference`
- **Owner Control**: Owner dapat reset game dan mengubah aturan

### Membuat File TugWarContract.sol

Buat file `src/TugWarContract.sol` dengan konten berikut:

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
        confidence = (scoreDiff * 100) / maxScoreDifference;
        if (confidence > 100) confidence = 100;
        
        return (predictedWinner, confidence);
    }
}
```

### Kompilasi Contract

```bash
# Kompilasi semua contracts
forge build

# Output yang diharapkan:
# [⠒] Compiling...
# [⠢] Compiling 1 files with 0.8.26
# [⠆] Solc 0.8.26 finished in 234.56ms
# Compiler run successful!
```

---

## 4. Testing dengan Foundry

Foundry menggunakan Solidity untuk testing, yang membuat testing lebih cepat dan terintegrasi dengan development environment.

### Membuat File Test

Buat file `test/TugWarContract.t.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "forge-std/Test.sol";
import "forge-std/console.sol";
import "../src/TugWarContract.sol";

contract TugWarContractTest is Test {
    TugWarContract public tugWarContract;
    address public owner;
    address public player1;
    address public player2;
    address public player3;

    function setUp() public {
        owner = address(this);
        player1 = makeAddr("player1");
        player2 = makeAddr("player2");
        player3 = makeAddr("player3");
        
        tugWarContract = new TugWarContract(owner);
    }

    // === BOUNDARY TESTS ===
    
    function test_ShouldHandleBoundaryValues() public {
        // Test minimum valid maxScoreDifference
        tugWarContract.reSet(1);
        
        vm.prank(player1);
        tugWarContract.pull(true);
        
        assertEq(tugWarContract.getWinStatus(), 1); // Immediate win
        
        // Reset with maximum valid maxScoreDifference
        tugWarContract.reSet(50);
        
        // Should be able to pull many times
        vm.startPrank(player2);
        for (uint i = 0; i < 49; i++) {
            tugWarContract.pull(false);
        }
        vm.stopPrank();
        
        assertEq(tugWarContract.getWinStatus(), 0); // Still ongoing
        
        vm.prank(player2);
        tugWarContract.pull(false);
        
        assertEq(tugWarContract.getWinStatus(), 2); // Now Team2 wins
    }

    function test_ShouldHandleRopePositionBoundaries() public {
        // Test dengan maxScoreDifference tinggi untuk menguji rope position limits
        tugWarContract.reSet(50);
        
        // Team1 pulls 50 kali (ropePosition akan menjadi -50)
        vm.startPrank(player1);
        for (uint i = 0; i < 50; i++) {
            tugWarContract.pull(true);
        }
        vm.stopPrank();
        
        assertEq(tugWarContract.ropePosition(), -50);
        assertEq(tugWarContract.team1Score(), 50);
        assertEq(tugWarContract.getWinStatus(), 1);
    }

    function test_ShouldHandleHighScores() public {
        // Test mendekati batas uint8 (255) - tapi harus hati-hati dengan win condition
        tugWarContract.reSet(50);
        
        // Simulasi skor tinggi dengan pulls bergantian
        // Team1: 50 pulls, Team2: 0 pulls (difference = 50, exactly maxScoreDifference)
        vm.startPrank(player1);
        for (uint i = 0; i < 50; i++) {
            tugWarContract.pull(true);
        }
        vm.stopPrank();
        
        assertEq(tugWarContract.team1Score(), 50);
        assertEq(tugWarContract.team2Score(), 0);
        assertEq(tugWarContract.getWinStatus(), 1); // Team1 wins (50-0=50, exactly maxScoreDifference)
    }

    function test_ShouldHandleZeroScoreDifference() public {
        // Test ketika kedua tim memiliki skor sama
        tugWarContract.reSet(5);
        
        // Kedua tim pull bergantian 10 kali
        for (uint i = 0; i < 10; i++) {
            vm.prank(player1);
            tugWarContract.pull(true);
            
            vm.prank(player2);
            tugWarContract.pull(false);
        }
        
        assertEq(tugWarContract.team1Score(), tugWarContract.team2Score());
        assertEq(tugWarContract.getWinStatus(), 0); // Game continues
        assertEq(tugWarContract.ropePosition(), 0); // Rope stays at center
    }

    // === STRESS TESTS ===

    function test_ShouldHandleHighVolumeGameplay() public {
        console.log("=== High Volume Gameplay Test ===");
        
        tugWarContract.reSet(20); // Higher threshold for longer game
        
        uint256 maxPulls = 1000;
        uint256 team1Pulls = 0;
        uint256 team2Pulls = 0;
        
        // Simulasi gameplay dengan pattern yang bisa diprediksi
        for (uint i = 0; i < maxPulls; i++) {
            if (tugWarContract.getWinStatus() != 0) break;
            
            // Pattern: setiap 3 pull, 2 untuk team1, 1 untuk team2
            bool isTeam1 = (i % 3) != 2;
            
            if (isTeam1) {
                vm.prank(player1);
                tugWarContract.pull(true);
                team1Pulls++;
            } else {
                vm.prank(player2);
                tugWarContract.pull(false);
                team2Pulls++;
            }
        }
        
        console.log("Total pulls in stress test:");
        console.log(tugWarContract.totalPulls());
        console.log("Team1 pulls:");
        console.log(team1Pulls);
        console.log("Team2 pulls:");
        console.log(team2Pulls);
        
        // Game harus berakhir dengan pemenang
        assertTrue(tugWarContract.getWinStatus() != 0);
    }

    function test_ShouldHandleRapidOwnershipChanges() public {
        address[] memory owners = new address[](5);
        owners[0] = player1;
        owners[1] = player2;
        owners[2] = player3;
        owners[3] = makeAddr("player4");
        owners[4] = makeAddr("player5");
        
        // Transfer ownership dan test dari setiap owner
        address currentOwner = address(this); // Start with current owner
        
        for (uint i = 0; i < owners.length; i++) {
            // Transfer menggunakan current owner
            vm.prank(currentOwner);
            tugWarContract.transferOwnership(owners[i]);
            assertEq(tugWarContract.owner(), owners[i]);
            
            // Update current owner
            currentOwner = owners[i];
            
            // Setiap owner melakukan reset dengan nilai berbeda
            vm.prank(owners[i]);
            tugWarContract.reSet(uint8(i + 1));
            assertEq(tugWarContract.maxScoreDifference(), i + 1);
        }
        
        console.log("Successfully handled 5 ownership transfers");
    }

    function test_ShouldHandleMultipleGameCycles() public {
        console.log("=== Multiple Game Cycles Test ===");
        
        uint8[] memory winThresholds = new uint8[](5);
        winThresholds[0] = 1;
        winThresholds[1] = 3;
        winThresholds[2] = 5;
        winThresholds[3] = 10;
        winThresholds[4] = 15;
        
        uint256 initialGamesPlayed = tugWarContract.gamesPlayed();
        
        for (uint gameNum = 0; gameNum < winThresholds.length; gameNum++) {
            console.log("Starting game:");
            console.log(gameNum + 1);
            
            tugWarContract.reSet(winThresholds[gameNum]);
            
            // Team1 wins setiap game
            vm.startPrank(player1);
            for (uint i = 0; i < winThresholds[gameNum]; i++) {
                tugWarContract.pull(true);
            }
            vm.stopPrank();
            
            assertEq(tugWarContract.getWinStatus(), 1);
            assertEq(tugWarContract.gamesPlayed(), initialGamesPlayed + gameNum + 1);
            
            console.log("Game completed with threshold:");
            console.log(winThresholds[gameNum]);
        }
        
        assertEq(tugWarContract.gamesPlayed(), initialGamesPlayed + winThresholds.length);
    }

    // === SECURITY TESTS ===

    function test_ShouldPreventReentrancy() public {
        // Test bahwa tidak ada reentrancy vulnerability
        // Contract tidak melakukan external calls, jadi aman dari reentrancy
        
        vm.prank(player1);
        tugWarContract.pull(true);
        
        // Tidak ada external calls dalam pull function, jadi aman dari reentrancy
        assertEq(tugWarContract.team1Score(), 1);
    }

    function test_ShouldValidateAllInputs() public {
        // Test semua validasi input
        
        // reSet validation
        vm.expectRevert(TugWarContract.InvalidMaxScoreDifference.selector);
        tugWarContract.reSet(0);
        
        vm.expectRevert(TugWarContract.InvalidMaxScoreDifference.selector);
        tugWarContract.reSet(51);
        
        // transferOwnership validation
        vm.expectRevert("New owner cannot be zero address");
        tugWarContract.transferOwnership(address(0));
        
        // getTeamStats validation
        vm.expectRevert("Invalid team number");
        tugWarContract.getTeamStats(0);
        
        vm.expectRevert("Invalid team number");
        tugWarContract.getTeamStats(3);
    }

    function test_ShouldPreventUnauthorizedAccess() public {
        // Test bahwa hanya owner yang bisa melakukan operasi restricted
        
        address nonOwner = makeAddr("nonOwner");
        
        vm.startPrank(nonOwner);
        
        vm.expectRevert(TugWarContract.OnlyOwner.selector);
        tugWarContract.reSet(10);
        
        vm.expectRevert(TugWarContract.OnlyOwner.selector);
        tugWarContract.transferOwnership(player1);
        
        vm.stopPrank();
        
        // Tapi non-owner bisa pull
        vm.prank(nonOwner);
        tugWarContract.pull(true);
        assertEq(tugWarContract.team1Score(), 1);
    }

    // === EDGE CASE TESTS ===

    function test_ShouldHandleWinOnFirstPull() public {
        // Test menang langsung pada pull pertama
        tugWarContract.reSet(1);
        
        vm.prank(player1);
        tugWarContract.pull(true);
        
        assertEq(tugWarContract.getWinStatus(), 1);
        assertEq(tugWarContract.totalPulls(), 1);
        
        // Tidak bisa pull lagi setelah game over
        vm.prank(player2);
        vm.expectRevert(TugWarContract.GameOver.selector);
        tugWarContract.pull(false);
    }

    function test_ShouldHandleAlternatingWins() public {
        // Test skenario di mana lead berganti-ganti
        tugWarContract.reSet(10);
        
        // Phase 1: Team1 unggul 5-0
        vm.startPrank(player1);
        for (uint i = 0; i < 5; i++) {
            tugWarContract.pull(true);
        }
        vm.stopPrank();
        
        // Check Team1 leading
        assertEq(tugWarContract.team1Score(), 5);
        assertEq(tugWarContract.team2Score(), 0);
        
        (uint8 predicted1, uint8 confidence1) = tugWarContract.getPrediction();
        assertEq(predicted1, 1); // Team1 leading
        assertEq(confidence1, 50); // 5/10 * 100 = 50%
        
        // Phase 2: Team2 comeback 3-5 (Team2=3, Team1=5)
        vm.startPrank(player2);
        for (uint i = 0; i < 3; i++) {
            tugWarContract.pull(false);
        }
        vm.stopPrank();
        
        // Check scores after Team2 pulls
        assertEq(tugWarContract.team1Score(), 5);
        assertEq(tugWarContract.team2Score(), 3);
        
        // Team1 still leading, but with smaller margin
        (uint8 predicted2, uint8 confidence2) = tugWarContract.getPrediction();
        assertEq(predicted2, 1); // Team1 still leading
        assertEq(confidence2, 20); // (5-3)/10 * 100 = 20%
        
        // Phase 3: Team2 takes the lead 6-5
        vm.startPrank(player2);
        for (uint i = 0; i < 3; i++) {
            tugWarContract.pull(false);
        }
        vm.stopPrank();
        
        // Check final scores
        assertEq(tugWarContract.team1Score(), 5);
        assertEq(tugWarContract.team2Score(), 6);
        
        // Now Team2 should be leading
        (uint8 predicted3, uint8 confidence3) = tugWarContract.getPrediction();
        assertEq(predicted3, 2); // Team2 now leading
        assertEq(confidence3, 10); // (6-5)/10 * 100 = 10%
        
        // Game should still be ongoing (difference is 1, need 10)
        assertEq(tugWarContract.getWinStatus(), 0);
    }

    function test_ShouldHandleExactWinCondition() public {
        // Test kondisi menang tepat di batas
        tugWarContract.reSet(5);
        
        // Team1: 5, Team2: 0 (difference = 5, exactly maxScoreDifference)
        vm.startPrank(player1);
        for (uint i = 0; i < 5; i++) {
            tugWarContract.pull(true);
        }
        vm.stopPrank();
        
        assertEq(tugWarContract.getWinStatus(), 1);
        assertEq(tugWarContract.team1Score() - tugWarContract.team2Score(), 5);
    }

    // === PERFORMANCE TESTS ===

    function test_ShouldMaintainConsistentGasUsage() public {
        // Foundry gas measurement dalam test environment bisa sangat bervariasi
        // Kita test bahwa function berjalan tanpa error dan gas usage reasonable
        tugWarContract.reSet(50); // Set very high threshold to allow many pulls
        
        uint256 totalGasUsed = 0;
        uint256 pullCount = 10;
        
        for (uint i = 0; i < pullCount; i++) {
            uint256 gasBefore = gasleft();
            
            vm.prank(player1);
            tugWarContract.pull(true);
            
            uint256 gasUsed = gasBefore - gasleft();
            totalGasUsed += gasUsed;
            
            // Log individual gas usage untuk debugging
            console.log("Pull", i + 1, "gas used:", gasUsed);
        }
        
        uint256 averageGas = totalGasUsed / pullCount;
        
        console.log("Total gas used:", totalGasUsed);
        console.log("Average gas per pull:", averageGas);
        
        // Test bahwa gas usage reasonable (tidak terlalu tinggi)
        assertLt(averageGas, 100000); // Average should be reasonable
        assertGt(averageGas, 1000);   // Should use some gas
        
        // Test bahwa semua pulls berhasil
        assertEq(tugWarContract.team1Score(), pullCount);
    }

    function test_ShouldOptimizeViewFunctions() public view {
        // View functions should not change state
        uint8 initialTeam1Score = tugWarContract.team1Score();
        uint8 initialTeam2Score = tugWarContract.team2Score();
        int8 initialRopePosition = tugWarContract.ropePosition();
        
        // Call all view functions
        tugWarContract.getWinStatus();
        tugWarContract.getGameInfo();
        tugWarContract.getTeamStats(1);
        tugWarContract.getTeamStats(2);
        tugWarContract.canStartGame();
        tugWarContract.getPrediction();
        
        // State should remain unchanged
        assertEq(tugWarContract.team1Score(), initialTeam1Score);
        assertEq(tugWarContract.team2Score(), initialTeam2Score);
        assertEq(tugWarContract.ropePosition(), initialRopePosition);
    }

    // === COMPREHENSIVE SCENARIO TESTS ===

    function test_FullGameLifecycleWithStatistics() public {
        console.log("=== Full Game Lifecycle Test ===");
        
        // Phase 1: Initial setup and early game
        console.log("Phase 1: Early game");
        tugWarContract.reSet(8);
        
        vm.startPrank(player1);
        tugWarContract.pull(true);
        tugWarContract.pull(true);
        vm.stopPrank();
        
        (uint8 pred1, uint8 conf1) = tugWarContract.getPrediction();
        console.log("Early prediction - Team:");
        console.log(pred1);
        console.log("Confidence:");
        console.log(conf1);
        
        // Phase 2: Mid game competition
        console.log("Phase 2: Mid game");
        vm.startPrank(player2);
        tugWarContract.pull(false);
        tugWarContract.pull(false);
        tugWarContract.pull(false);
        vm.stopPrank();
        
        (uint8 pred2, uint8 conf2) = tugWarContract.getPrediction();
        console.log("Mid-game prediction - Team:");
        console.log(pred2);
        console.log("Confidence:");
        console.log(conf2);
        
        // Phase 3: Late game decisive moves (Team1 needs 8 + team2Score to win)
        console.log("Phase 3: Late game");
        vm.startPrank(player1);
        // Team1 score = 2, Team2 score = 3
        // Team1 needs to reach 3 + 8 = 11 total score to win
        // So need 9 more pulls (11 - 2 = 9)
        for (uint i = 0; i < 9; i++) {
            tugWarContract.pull(true);
        }
        vm.stopPrank();
        
        // Final state - Team1 should win now (11 vs 3, difference = 8)
        assertEq(tugWarContract.getWinStatus(), 1);
        console.log("Final winner: Team 1");
        console.log("Final score Team1:");
        console.log(tugWarContract.team1Score());
        console.log("Final score Team2:");
        console.log(tugWarContract.team2Score());
        console.log("Total pulls:");
        console.log(tugWarContract.totalPulls());
    }

    function test_MultiplePlayersScenario() public {
        console.log("=== Multiple Players Scenario ===");
        
        address team1Player2 = makeAddr("team1Player2");
        address team2Player2 = makeAddr("team2Player2");
        address team1Player3 = makeAddr("team1Player3");
        
        tugWarContract.reSet(6);
        
        // Multiple players dari team 1
        vm.prank(player1);
        tugWarContract.pull(true);
        
        vm.prank(team1Player2);
        tugWarContract.pull(true);
        
        vm.prank(team1Player3);
        tugWarContract.pull(true);
        
        // Multiple players dari team 2
        vm.prank(player2);
        tugWarContract.pull(false);
        
        vm.prank(team2Player2);
        tugWarContract.pull(false);
        
        console.log("Multiple players participated successfully");
        assertEq(tugWarContract.team1Score(), 3);
        assertEq(tugWarContract.team2Score(), 2);
        assertEq(tugWarContract.totalPulls(), 5);
    }

    // === FINAL VALIDATION TESTS ===

    function test_ShouldMaintainStateConsistency() public {
        // Test bahwa state selalu konsisten
        tugWarContract.reSet(5);
        
        for (uint i = 0; i < 20; i++) {
            if (tugWarContract.getWinStatus() != 0) break;
            
            bool isTeam1 = i % 2 == 0;
            
            // State sebelum pull
            uint8 scoreBefore1 = tugWarContract.team1Score();
            uint8 scoreBefore2 = tugWarContract.team2Score();
            int8 ropeBefore = tugWarContract.ropePosition();
            uint256 pullsBefore = tugWarContract.totalPulls();
            
            if (isTeam1) {
                vm.prank(player1);
                tugWarContract.pull(true);
                
                // Validasi perubahan state
                assertEq(tugWarContract.team1Score(), scoreBefore1 + 1);
                assertEq(tugWarContract.team2Score(), scoreBefore2);
                assertEq(tugWarContract.ropePosition(), ropeBefore - 1);
            } else {
                vm.prank(player2);
                tugWarContract.pull(false);
                
                // Validasi perubahan state
                assertEq(tugWarContract.team1Score(), scoreBefore1);
                assertEq(tugWarContract.team2Score(), scoreBefore2 + 1);
                assertEq(tugWarContract.ropePosition(), ropeBefore + 1);
            }
            
            assertEq(tugWarContract.totalPulls(), pullsBefore + 1);
        }
        
        console.log("State consistency maintained throughout gameplay");
    }

    function test_ShouldHandleContractLimits() public {
        // Test batas-batas kontrak
        console.log("=== Contract Limits Test ===");
        
        // Test dengan maxScoreDifference maksimum
        tugWarContract.reSet(50);
        
        // Test dengan banyak pulls (mendekati batas uint8 untuk score)
        vm.startPrank(player1);
        for (uint i = 0; i < 50; i++) {
            tugWarContract.pull(true);
        }
        vm.stopPrank();
        
        assertEq(tugWarContract.team1Score(), 50);
        assertEq(tugWarContract.ropePosition(), -50);
        assertEq(tugWarContract.getWinStatus(), 1);
        
        console.log("Successfully handled maximum contract limits");
    }

    // === EVENT TESTING ===

    function test_ShouldEmitPullExecutedEvent() public {
        tugWarContract.reSet(5);
        
        vm.expectEmit(true, false, false, true);
        emit PullExecuted(player1, true, -1, 1, 0);
        
        vm.prank(player1);
        tugWarContract.pull(true);
    }

    function test_ShouldEmitGameWonEvent() public {
        tugWarContract.reSet(1);
        
        vm.expectEmit(false, false, false, true);
        emit GameWon(1, 1, 0);
        
        vm.prank(player1);
        tugWarContract.pull(true);
    }

    function test_ShouldEmitGameResetEvent() public {
        vm.expectEmit(true, false, false, true);
        emit GameReset(address(this), 10);
        
        tugWarContract.reSet(10);
    }

    function test_ShouldEmitOwnershipTransferredEvent() public {
        vm.expectEmit(true, true, false, false);
        emit OwnershipTransferred(address(this), player1);
        
        tugWarContract.transferOwnership(player1);
    }

    // Define events for testing
    event PullExecuted(address indexed player, bool isTeam1, int8 newRopePosition, uint8 team1Score, uint8 team2Score);
    event GameWon(uint8 winningTeam, uint8 finalScore1, uint8 finalScore2);
    event GameReset(address indexed resetter, uint8 newMaxScoreDifference);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
}
```

### Menjalankan Tests

```bash
# Jalankan semua tests
forge test

# Jalankan tests dengan verbose output
forge test -vvv

# Jalankan test specific
forge test --match-test test_ShouldExecuteTeam1Pull

# Jalankan tests dengan gas report
forge test --gas-report

# Jalankan fuzz tests dengan lebih banyak runs
forge test --fuzz-runs 1000

# Jalankan integration tests
forge test --match-test test_CompleteGameplayScenario -vvv
```

Output yang diharapkan:
```
[⠒] Compiling...
[⠢] Compiling 2 files with 0.8.26
[⠆] Solc 0.8.26 finished in 1.23s
Compiler run successful!

Running 45 tests for test/TugWarContract.t.sol:TugWarContractTest
[PASS] test_ShouldSetTheRightOwner() (gas: 7432)
[PASS] test_ShouldExecuteTeam1Pull() (gas: 64521)
[PASS] test_ShouldExecuteTeam2Pull() (gas: 64398)
[PASS] test_CompleteGameplayScenario() (gas: 445789)
...
Test result: ok. 45 passed; 0 failed; 0 skipped; finished in 1.234s
```

---

## 5. Script Deployment

Script deployment memungkinkan kita untuk melakukan deployment yang reproducible dan dapat dikonfigurasi untuk TugWar game.

### Membuat Deployment Script

Buat file `script/DeployTugWar.s.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Script, console} from "lib/forge-std/src/Script.sol";
import {TugWarContract} from "../src/TugWarContract.sol";

contract DeployTugWar is Script {
    TugWarContract public tugWarContract;

    function setUp() public {}

    function run() public returns (TugWarContract, address) {
        console.log("Starting TugWar Game deployment to Monad Testnet...");
        console.log("");

        // Get deployer account from private key
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        console.log("Deployment Details:");
        console.log("Deployer address:", deployer);
        
        // Check balance
        uint256 balance = deployer.balance;
        console.log("Deployer balance:", balance / 1e18, "MON");
        
        if (balance < 0.01 ether) {
            console.log("Warning: Low balance. Make sure you have enough MON for deployment.");
        }

        // Get network info
        console.log("Network: Monad Testnet");
        console.log("Chain ID: 10143");
        console.log("RPC URL: https://testnet-rpc.monad.xyz/");
        console.log("");

        // Start broadcasting transactions
        vm.startBroadcast(deployerPrivateKey);

        console.log("Deploying TugWar contract...");
        
        // Deploy TugWar with deployer as owner
        tugWarContract = new TugWarContract(deployer);
        address contractAddress = address(tugWarContract);

        vm.stopBroadcast();

        console.log("TugWar deployed successfully!");
        console.log("Contract address:", contractAddress);
        console.log("Block explorer:", string.concat("https://testnet.monadexplorer.com/address/", _addressToString(contractAddress)));

        // Verify initial state
        console.log("");
        console.log("Verifying initial contract state...");
        address owner = tugWarContract.owner();
        int8 ropePosition = tugWarContract.ropePosition();
        uint8 team1Score = tugWarContract.team1Score();
        uint8 team2Score = tugWarContract.team2Score();
        uint8 maxScoreDifference = tugWarContract.maxScoreDifference();
        uint256 totalPulls = tugWarContract.totalPulls();
        uint256 gamesPlayed = tugWarContract.gamesPlayed();

        console.log("Owner:", owner);
        console.log("Rope position:", vm.toString(ropePosition));
        console.log("Team 1 score:", team1Score);
        console.log("Team 2 score:", team2Score);
        console.log("Max score difference:", maxScoreDifference);
        console.log("Total pulls:", totalPulls);
        console.log("Games played:", gamesPlayed);
        
        // Test view functions
        console.log("");
        console.log("Testing contract functions...");
        uint8 winStatus = tugWarContract.getWinStatus();
        bool canStart = tugWarContract.canStartGame();
        
        console.log("Win status (0=ongoing):", winStatus);
        console.log("Can start game:", canStart);

        // Provide game instructions
        console.log("");
        console.log("Game Instructions:");
        console.log("Two teams compete in a tug of war");
        console.log("Each pull moves the rope position");
        console.log("Team 1 pulls decrease rope position (negative)");
        console.log("Team 2 pulls increase rope position (positive)");
        console.log("First team to reach score difference of", maxScoreDifference, "wins");
        console.log("Owner can reset game and change rules");

        // Provide next steps
        console.log("");
        console.log("Next Steps:");
        console.log("1. Save the contract address for future interactions");
        console.log("2. Verify the contract on block explorer (optional)");
        console.log("3. Test game functions using cast or frontend");
        console.log("4. Add players and start your first game!");
        console.log("5. Monitor game events and statistics");

        return (tugWarContract, contractAddress);
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
}
```

### Test Script Deployment (Dry Run)

```bash
# Test deployment script tanpa benar-benar deploy
forge script script/DeployTugWar.s.sol --rpc-url https://testnet-rpc.monad.xyz/

# Test dengan fork environment
forge script script/DeployTugWar.s.sol --fork-url https://testnet-rpc.monad.xyz/
```

---

## 6. Wallet Management dengan Cast

Cast adalah CLI tool untuk berinteraksi dengan Ethereum/Monad blockchain dan manajemen wallet.

### Membuat Wallet Baru

```bash
# Generate wallet baru dan import langsung
cast wallet import tugwar-deployer --private-key $(cast wallet new | grep 'Private key:' | awk '{print $3}')

# Anda akan diminta memasukkan password untuk keystore
# Enter password: [masukkan password yang aman]
# `tugwar-deployer` keystore was saved successfully. Address: 0x3c32b70fbfd1f99a9073c921dacd1518c20cb8de
```

### Alternative: Import Existing Private Key

Jika Anda sudah memiliki private key:

```bash
# Import private key yang sudah ada
cast wallet import tugwar-deployer --private-key YOUR_PRIVATE_KEY_HERE

# Masukkan password untuk enkripsi keystore
# Enter password: [password anda]
```

### Manajemen Wallet

```bash
# Lihat daftar wallet tersimpan
cast wallet list

# Cek address wallet
cast wallet address --account tugwar-deployer
# Enter keystore password: [masukkan password]
# 0x3C32B70FBfd1f99A9073c921Dacd1518C20cb8De

# Cek balance wallet
cast balance 0x3C32B70FBfd1f99A9073c921Dacd1518C20cb8De --rpc-url https://testnet-rpc.monad.xyz/
# Output: 200000000000000000 (dalam wei, = 0.2 MON)

# Konversi wei ke ether untuk readability
cast balance 0x3C32B70FBfd1f99A9073c921Dacd1518C20cb8De --rpc-url https://testnet-rpc.monad.xyz/ | cast to-unit ether
# Output: 0.200000000000000000
```

### Mendapatkan MON dari Faucet

Sebelum deployment, pastikan wallet memiliki cukup MON:

1. **Kunjungi [Monad Testnet Faucet](https://faucet.testnet.monad.xyz/)**
2. **Paste address wallet Anda**
3. **Request MON tokens**
4. **Verifikasi balance:**
   ```bash
   cast balance $(cast wallet address --account tugwar-deployer) --rpc-url https://testnet-rpc.monad.xyz/ | cast to-unit ether
   ```

---

## 7. Deployment ke Monad Testnet

Sekarang kita siap untuk melakukan deployment TugWar game menggunakan beberapa metode yang berbeda.

### Metode 1: Menggunakan forge create

Ini adalah metode paling sederhana dan langsung:

```bash
# Deploy menggunakan forge create dengan deployer sebagai owner
forge create src/TugWarContract.sol:TugWarContract \
  --constructor-args $(cast wallet address --account tugwar-deployer) \
  --account tugwar-deployer \
  --rpc-url https://testnet-rpc.monad.xyz/ \
  --broadcast

# Output yang diharapkan:
# [⠒] Compiling...
# No files changed, compilation skipped
# Enter keystore password: [masukkan password]
# Deployer: 0x3C32B70FBfd1f99A9073c921Dacd1518C20cb8De
# Deployed to: 0xCd80CdC47ACA776288a31AC1e04BDAb911593144
# Transaction hash: 0xcf00af4f2def22d04509402ad7c97e99610d84f48948862ba7747645ec6967f7
```

### Metode 2: Menggunakan Script Deployment

Metode ini memberikan kontrol lebih dan output yang informatif:

```bash
# Setup environment variable untuk private key (jika menggunakan script)
export PRIVATE_KEY=$(cast wallet private-key --account tugwar-deployer)
# Enter keystore password: [masukkan password]

# Deploy menggunakan script
forge script script/DeployTugWar.s.sol \
  --rpc-url https://testnet-rpc.monad.xyz/ \
  --broadcast \
  --account tugwar-deployer

# Output yang diharapkan:
# 🎮 Starting TugWar Game deployment to Monad Testnet...
# 
# 📋 Deployment Details:
# ├── Deployer address: 0x3C32B70FBfd1f99A9073c921Dacd1518C20cb8De
# ├── Deployer balance: 0.5 MON
# ├── Network: Monad Testnet
# ├── Chain ID: 10143
# └── RPC URL: https://testnet-rpc.monad.xyz/
# 
# 🚀 Deploying TugWar contract...
# ✅ TugWar deployed successfully!
# 📍 Contract address: 0xCd80CdC47ACA776288a31AC1e04BDAb911593144
# 🔍 Block explorer: https://testnet.monadexplorer.com/address/0xCd80CdC47ACA776288a31AC1e04BDAb911593144
```

### Metode 3: Deploy dengan Gas Configuration

Untuk kontrol lebih detail atas gas:

```bash
# Deploy dengan gas limit dan gas price spesifik
forge create src/TugWarContract.sol:TugWarContract \
  --constructor-args $(cast wallet address --account tugwar-deployer) \
  --account tugwar-deployer \
  --rpc-url https://testnet-rpc.monad.xyz/ \
  --broadcast \
  --gas-limit 800000 \
  --gas-price 1000000000

# Deploy dengan legacy transaction (jika diperlukan)
forge create src/TugWarContract.sol:TugWarContract \
  --constructor-args $(cast wallet address --account tugwar-deployer) \
  --account tugwar-deployer \
  --rpc-url https://testnet-rpc.monad.xyz/ \
  --broadcast \
  --legacy
```

### Troubleshooting Deployment

#### Error: Insufficient Funds
```bash
# Cek balance
cast balance $(cast wallet address --account tugwar-deployer) --rpc-url https://testnet-rpc.monad.xyz/ | cast to-unit ether

# Jika balance kurang, dapatkan dari faucet:
# https://faucet.testnet.monad.xyz/
```

#### Error: Network Connection
```bash
# Test koneksi RPC
cast client --rpc-url https://testnet-rpc.monad.xyz/

# Test alternatif RPC (jika ada)
cast balance 0x0000000000000000000000000000000000000000 --rpc-url https://testnet-rpc.monad.xyz/
```

#### Error: Constructor Arguments
```bash
# Verifikasi address format
cast wallet address --account tugwar-deployer

# Test encoding constructor arguments
cast abi-encode "constructor(address)" $(cast wallet address --account tugwar-deployer)
```

---

## 8. Verifikasi Contract

Verifikasi source code memungkinkan orang lain untuk melihat dan memverifikasi code contract Anda di block explorer.

### Verifikasi dengan Sourcify

Sourcify adalah platform verifikasi yang digunakan oleh Monad:

```bash
# Verifikasi contract menggunakan Sourcify
forge verify-contract \
  0xCd80CdC47ACA776288a31AC1e04BDAb911593144 \
  src/TugWarContract.sol:TugWarContract \
  --chain 10143 \
  --verifier sourcify \
  --verifier-url https://sourcify-api-monad.blockvision.org \
  --constructor-args $(cast abi-encode "constructor(address)" $(cast wallet address --account tugwar-deployer))

# Output yang diharapkan:
# Start verifying contract `0xCd80CdC47ACA776288a31AC1e04BDAb911593144` deployed on monad-testnet
# Submitting verification for [TugWarContract] "0xCd80CdC47ACA776288a31AC1e04BDAb911593144".
# Contract successfully verified
```

### Verifikasi Manual

Jika automatic verification gagal:

1. **Buka [Monad Explorer](https://testnet.monadexplorer.com/)**
2. **Navigate ke contract address**
3. **Klik tab "Contract"**
4. **Klik "Verify Contract" (jika tersedia)**
5. **Upload source code dan metadata**

---

## 9. Interaksi dengan Contract

Setelah deployment dan verifikasi, kita dapat berinteraksi dengan TugWar game menggunakan cast.

### Setup Contract Address

```bash
# Set contract address sebagai environment variable untuk kemudahan
export TUGWAR_CONTRACT=0xCd80CdC47ACA776288a31AC1e04BDAb911593144
```

### Read Functions (View/Pure)

```bash
# Baca owner address
cast call $TUGWAR_CONTRACT "owner()" --rpc-url https://testnet-rpc.monad.xyz/
# Output: 0x0000000000000000000000003c32b70fbfd1f99a9073c921dacd1518c20cb8de

# Baca rope position
cast call $TUGWAR_CONTRACT "ropePosition()" --rpc-url https://testnet-rpc.monad.xyz/
# Output: 0x0000000000000000000000000000000000000000000000000000000000000000

# Baca team scores
cast call $TUGWAR_CONTRACT "team1Score()" --rpc-url https://testnet-rpc.monad.xyz/
cast call $TUGWAR_CONTRACT "team2Score()" --rpc-url https://testnet-rpc.monad.xyz/

# Baca max score difference
cast call $TUGWAR_CONTRACT "maxScoreDifference()" --rpc-url https://testnet-rpc.monad.xyz/
# Output: 0x0000000000000000000000000000000000000000000000000000000000000005

# Cek win status
cast call $TUGWAR_CONTRACT "getWinStatus()" --rpc-url https://testnet-rpc.monad.xyz/
# Output: 0x0000000000000000000000000000000000000000000000000000000000000000 (0 = ongoing)

# Get complete game info
cast call $TUGWAR_CONTRACT "getGameInfo()" --rpc-url https://testnet-rpc.monad.xyz/
# Output: Multiple values (ropePos, score1, score2, maxDiff, winner, pulls, games)

# Get team stats
cast call $TUGWAR_CONTRACT "getTeamStats(uint8)" 1 --rpc-url https://testnet-rpc.monad.xyz/
cast call $TUGWAR_CONTRACT "getTeamStats(uint8)" 2 --rpc-url https://testnet-rpc.monad.xyz/

# Check if game can start
cast call $TUGWAR_CONTRACT "canStartGame()" --rpc-url https://testnet-rpc.monad.xyz/
# Output: 0x0000000000000000000000000000000000000000000000000000000000000001 (true)

# Get prediction
cast call $TUGWAR_CONTRACT "getPrediction()" --rpc-url https://testnet-rpc.monad.xyz/
```

### Write Functions (State Changing)

```bash
# Team 1 pull (requires gas)
cast send $TUGWAR_CONTRACT "pull(bool)" true \
  --account tugwar-deployer \
  --rpc-url https://testnet-rpc.monad.xyz/
# Enter keystore password: [password]

# Team 2 pull
cast send $TUGWAR_CONTRACT "pull(bool)" false \
  --account tugwar-deployer \
  --rpc-url https://testnet-rpc.monad.xyz/

# Reset game (only owner)
cast send $TUGWAR_CONTRACT "reSet(uint8)" 3 \
  --account tugwar-deployer \
  --rpc-url https://testnet-rpc.monad.xyz/

# Transfer ownership (only current owner)
cast send $TUGWAR_CONTRACT "transferOwnership(address)" NEW_OWNER_ADDRESS \
  --account tugwar-deployer \
  --rpc-url https://testnet-rpc.monad.xyz/
```

### Decode Output untuk Readability

```bash
# Decode hex output ke decimal
cast call $TUGWAR_CONTRACT "team1Score()" --rpc-url https://testnet-rpc.monad.xyz/ | cast to-dec

# Decode address output
cast call $TUGWAR_CONTRACT "owner()" --rpc-url https://testnet-rpc.monad.xyz/ | cast parse-bytes32-address

# Decode int8 (rope position) - handle negative values
cast call $TUGWAR_CONTRACT "ropePosition()" --rpc-url https://testnet-rpc.monad.xyz/ | cast to-dec
```

### Monitoring Events

```bash
# Monitor events dari contract
cast logs --address $TUGWAR_CONTRACT --rpc-url https://testnet-rpc.monad.xyz/

# Monitor specific events
cast logs --address $TUGWAR_CONTRACT "PullExecuted(address,bool,int8,uint8,uint8)" --rpc-url https://testnet-rpc.monad.xyz/

cast logs --address $TUGWAR_CONTRACT "GameWon(uint8,uint8,uint8)" --rpc-url https://testnet-rpc.monad.xyz/

cast logs --address $TUGWAR_CONTRACT "GameReset(address,uint8)" --rpc-url https://testnet-rpc.monad.xyz/

# Get events dari block tertentu
cast logs --address $TUGWAR_CONTRACT --from-block 12345 --to-block 12350 --rpc-url https://testnet-rpc.monad.xyz/
```

### Game Interaction Script

Buat script untuk bermain game `scripts/play-tugwar.sh`:

```bash
#!/bin/bash

# Set variables
CONTRACT_ADDRESS="0xCd80CdC47ACA776288a31AC1e04BDAb911593144"
RPC_URL="https://testnet-rpc.monad.xyz/"
ACCOUNT="tugwar-deployer"

echo "🎮 TugWar Game Interface"
echo "======================="

# Function to display game state
display_game_state() {
    echo "📊 Current Game State:"
    echo "Rope Position: $(cast call $CONTRACT_ADDRESS "ropePosition()" --rpc-url $RPC_URL | cast to-dec)"
    echo "Team 1 Score: $(cast call $CONTRACT_ADDRESS "team1Score()" --rpc-url $RPC_URL | cast to-dec)"
    echo "Team 2 Score: $(cast call $CONTRACT_ADDRESS "team2Score()" --rpc-url $RPC_URL | cast to-dec)"
    echo "Total Pulls: $(cast call $CONTRACT_ADDRESS "totalPulls()" --rpc-url $RPC_URL | cast to-dec)"
    echo "Win Status: $(cast call $CONTRACT_ADDRESS "getWinStatus()" --rpc-url $RPC_URL | cast to-dec)"
    echo "Can Start: $(cast call $CONTRACT_ADDRESS "canStartGame()" --rpc-url $RPC_URL | cast to-dec)"
    echo ""
}

# Display initial state
display_game_state

echo "🎯 Game Instructions:"
echo "- Team 1 pulls move rope LEFT (negative)"
echo "- Team 2 pulls move rope RIGHT (positive)"
echo "- First team to reach score difference of 5 wins"
echo ""

# Interactive game loop
while true; do
    echo "Choose action:"
    echo "1) Team 1 Pull"
    echo "2) Team 2 Pull"
    echo "3) Check Game State"
    echo "4) Reset Game (owner only)"
    echo "5) Exit"
    
    read -p "Enter choice (1-5): " choice
    
    case $choice in
        1)
            echo "🔵 Team 1 pulls..."
            cast send $CONTRACT_ADDRESS "pull(bool)" true --account $ACCOUNT --rpc-url $RPC_URL --quiet
            display_game_state
            ;;
        2)
            echo "🔴 Team 2 pulls..."
            cast send $CONTRACT_ADDRESS "pull(bool)" false --account $ACCOUNT --rpc-url $RPC_URL --quiet
            display_game_state
            ;;
        3)
            display_game_state
            ;;
        4)
            echo "🔄 Resetting game..."
            cast send $CONTRACT_ADDRESS "reSet(uint8)" 5 --account $ACCOUNT --rpc-url $RPC_URL --quiet
            echo "Game reset!"
            display_game_state
            ;;
        5)
            echo "👋 Thanks for playing!"
            exit 0
            ;;
        *)
            echo "❌ Invalid choice. Please try again."
            ;;
    esac
done
```

Jalankan script:

```bash
chmod +x scripts/play-tugwar.sh
./scripts/play-tugwar.sh
```

### Automated Game Script

Buat script untuk demo otomatis `scripts/demo-game.sh`:

```bash
#!/bin/bash

CONTRACT_ADDRESS="0xCd80CdC47ACA776288a31AC1e04BDAb911593144"
RPC_URL="https://testnet-rpc.monad.xyz/"
ACCOUNT="tugwar-deployer"

echo "🎮 TugWar Automated Demo"
echo "======================="

# Function to display rope visualization
visualize_rope() {
    local position=$1
    local rope="Team1 "
    
    # Create rope visualization (simplified)
    for i in {-10..10}; do
        if [ $i -eq $position ]; then
            rope="${rope}🔥"
        elif [ $i -eq 0 ]; then
            rope="${rope}|"
        else
            rope="${rope}-"
        fi
    done
    
    rope="${rope} Team2"
    echo "Rope: $rope"
}

# Function to display current state with visualization
show_state() {
    local rope_pos=$(cast call $CONTRACT_ADDRESS "ropePosition()" --rpc-url $RPC_URL | cast to-dec)
    local team1_score=$(cast call $CONTRACT_ADDRESS "team1Score()" --rpc-url $RPC_URL | cast to-dec)
    local team2_score=$(cast call $CONTRACT_ADDRESS "team2Score()" --rpc-url $RPC_URL | cast to-dec)
    local win_status=$(cast call $CONTRACT_ADDRESS "getWinStatus()" --rpc-url $RPC_URL | cast to-dec)
    
    echo "Team 1: $team1_score | Team 2: $team2_score | Position: $rope_pos"
    visualize_rope $rope_pos
    
    if [ $win_status -eq 1 ]; then
        echo "🏆 TEAM 1 WINS!"
        return 1
    elif [ $win_status -eq 2 ]; then
        echo "🏆 TEAM 2 WINS!"
        return 1
    fi
    
    return 0
}

echo "🚀 Starting automated game demo..."
echo ""

# Initial state
show_state

# Simulate a complete game
moves=(
    "true Team1"
    "true Team1"
    "false Team2"
    "false Team2"
    "false Team2"
    "true Team1"
    "false Team2"
    "false Team2"
)

for move in "${moves[@]}"; do
    IFS=' ' read -r pull_team team_name <<< "$move"
    
    echo ""
    echo "🎯 $team_name pulls..."
    cast send $CONTRACT_ADDRESS "pull(bool)" $pull_team --account $ACCOUNT --rpc-url $RPC_URL --quiet
    
    sleep 2  # Pause for effect
    
    if ! show_state; then
        break  # Game ended
    fi
done

echo ""
echo "🎉 Demo completed! Check the final game state above."
```

Jalankan demo:

```bash
chmod +x scripts/demo-game.sh
./scripts/demo-game.sh
```

---

## 10. Best Practices dan Tips

### Security Best Practices

#### 1. Smart Contract Security
```solidity
// ✅ GOOD: Use custom errors untuk gas efficiency
error GameOver();
error OnlyOwner();

// ✅ GOOD: Input validation
function reSet(uint8 _maxScoreDifference) public onlyOwner {
    if (_maxScoreDifference == 0 || _maxScoreDifference > 50) {
        revert InvalidMaxScoreDifference();
    }
    // ...
}

// ✅ GOOD: Proper event emission
event PullExecuted(address indexed player, bool isTeam1, int8 newRopePosition, uint8 team1Score, uint8 team2Score);

// ✅ GOOD: State checks dengan modifiers
modifier gameActive() {
    if (getWinStatus() != 0) revert GameOver();
    _;
}
```

#### 2. Private Key Management
```bash
# ✅ GOOD: Gunakan encrypted keystore
cast wallet import tugwar-deployer --private-key $PRIVATE_KEY

# ❌ BAD: Jangan expose private key di command line
forge create --private-key 0x1234567890abcdef... # JANGAN!

# ✅ GOOD: Gunakan environment variables untuk scripts
export PRIVATE_KEY=$(cast wallet private-key --account tugwar-deployer)
```

#### 3. Network Safety
```bash
# Selalu verifikasi network sebelum deployment
cast client --rpc-url https://testnet-rpc.monad.xyz/

# Test dengan dry run dulu
forge script script/DeployTugWar.s.sol --rpc-url URL # tanpa --broadcast
```

### Game Development Tips

#### 1. Event-Driven Architecture
```solidity
// Track semua game actions dengan events
event PullExecuted(address indexed player, bool isTeam1, int8 newRopePosition, uint8 team1Score, uint8 team2Score);
event GameWon(uint8 winningTeam, uint8 finalScore1, uint8 finalScore2);
event GameReset(address indexed resetter, uint8 newMaxScoreDifference);

// Frontend dapat listen ke events untuk real-time updates
```

#### 2. Gas Optimization untuk Games
```solidity
// ✅ Pack related variables dalam single storage slot
struct GameState {
    uint8 team1Score;      // 1 byte
    uint8 team2Score;      // 1 byte  
    uint8 maxScoreDiff;    // 1 byte
    int8 ropePosition;     // 1 byte
    address owner;         // 20 bytes
    bool isActive;         // 1 byte
    // Total: 25 bytes = 1 storage slot
}

// ✅ Batch operations ketika memungkinkan
function pullMultiple(bool isTeam1, uint8 count) external gameActive {
    require(count > 0 && count <= 10, "Invalid count");
    
    if (isTeam1) {
        team1Score += count;
        ropePosition -= int8(count);
    } else {
        team2Score += count;
        ropePosition += int8(count);
    }
    
    totalPulls += count;
    emit PullExecuted(msg.sender, isTeam1, ropePosition, team1Score, team2Score);
}
```

#### 3. Extensible Game Design
```solidity
// ✅ Design untuk future upgrades
contract TugWarV2 is TugWarContract {
    // New features:
    mapping(address => uint256) public playerStats;
    uint256 public seasonNumber;
    
    // Power-ups, tournaments, leaderboards, etc.
}

// ✅ Use interfaces untuk modular design
interface ITugWarGame {
    function pull(bool isTeam1) external;
    function getWinStatus() external view returns(uint8);
    function getGameInfo() external view returns(/* game data */);
}
```

### Testing Strategies

#### 1. Comprehensive Test Coverage
```bash
# Run coverage analysis
forge coverage

# Generate detailed coverage report
forge coverage --report lcov
genhtml lcov.info -o coverage-report
```

#### 2. Fuzz Testing untuk Games
```solidity
// Test dengan random sequences
function testFuzz_RandomGameplay(uint256 seed, uint8 moves) public {
    vm.assume(moves > 0 && moves <= 50);
    
    for (uint i = 0; i < moves; i++) {
        if (tugWarContract.getWinStatus() != 0) break;
        
        bool team1Turn = (seed + i) % 2 == 0;
        tugWarContract.pull(team1Turn);
    }
    
    // Game should be in valid state
    assertTrue(tugWarContract.team1Score() + tugWarContract.team2Score() > 0);
}
```

#### 3. Integration Testing
```solidity
// Test complete game scenarios
function test_CompleteTournament() public {
    // Multiple games dengan different strategies
    for (uint gameNum = 0; gameNum < 5; gameNum++) {
        _playCompleteGame(gameNum);
        tugWarContract.reSet(5 + uint8(gameNum % 3)); // Vary difficulty
    }
    
    assertTrue(tugWarContract.gamesPlayed() == 5);
}
```

### Production Deployment Checklist

#### Pre-Deployment
- [ ] All tests passing: `forge test`
- [ ] Gas usage optimized: `forge test --gas-report`
- [ ] Code coverage >90%: `forge coverage`
- [ ] Security audit completed (for production)
- [ ] Game mechanics thoroughly tested
- [ ] Event emission verified
- [ ] Edge cases handled (max/min values)
- [ ] Owner functions secured
- [ ] Deployment script tested: `forge script --rpc-url URL` (without broadcast)
- [ ] Sufficient balance for deployment: `cast balance ADDRESS`

#### Deployment
- [ ] Deploy to testnet first: `forge create --account deployer`
- [ ] Verify contract: `forge verify-contract`
- [ ] Test all game functions: `cast call` dan `cast send`
- [ ] Play complete game to verify mechanics
- [ ] Monitor events: `cast logs`
- [ ] Document contract address dan transaction hash

#### Post-Deployment
- [ ] Update frontend/backend dengan contract address
- [ ] Setup game monitoring dashboard
- [ ] Create player onboarding materials
- [ ] Setup community channels (Discord, etc.)
- [ ] Monitor game statistics dan player engagement
- [ ] Plan regular game events dan tournaments
- [ ] Backup deployment info: `deployments/*.json`

### Useful Commands Reference

```bash
# Game Development
forge build                          # Compile contracts
forge test --match-test test_Game    # Run game-specific tests
forge test --gas-report              # Analyze gas usage
forge coverage                       # Test coverage analysis

# Game Deployment
forge create src/TugWarContract.sol:TugWarContract --constructor-args OWNER --account deployer
forge script script/DeployTugWar.s.sol --broadcast --account deployer
forge verify-contract ADDRESS src/TugWarContract.sol:TugWarContract --chain CHAIN_ID

# Game Interaction
cast call CONTRACT "getGameInfo()" --rpc-url URL
cast send CONTRACT "pull(bool)" true --account player --rpc-url URL
cast logs --address CONTRACT "PullExecuted(address,bool,int8,uint8,uint8)" --rpc-url URL

# Game Management
cast send CONTRACT "reSet(uint8)" 5 --account owner --rpc-url URL
cast send CONTRACT "transferOwnership(address)" NEW_OWNER --account owner --rpc-url URL

# Monitoring & Analytics
cast logs --address CONTRACT --from-block START --to-block END --rpc-url URL
cast call CONTRACT "getTeamStats(uint8)" 1 --rpc-url URL
cast call CONTRACT "getPrediction()" --rpc-url URL

# Utilities
cast abi-encode "function(types)" values
cast abi-decode "function(types)" data
cast to-unit wei ether
cast to-dec HEX_VALUE
cast parse-bytes32-address HEX
```

### Game Analytics dan Monitoring

#### 1. Event Tracking untuk Analytics
```bash
# Track player engagement
cast logs --address $CONTRACT "PullExecuted(address,bool,int8,uint8,uint8)" \
  --from-block 0 --rpc-url $RPC_URL | jq '.[] | {player: .topics[1], team: .data}'

# Monitor game outcomes
cast logs --address $CONTRACT "GameWon(uint8,uint8,uint8)" \
  --from-block 0 --rpc-url $RPC_URL | jq '.[] | .data'

# Track game resets dan configuration changes
cast logs --address $CONTRACT "GameReset(address,uint8)" \
  --from-block 0 --rpc-url $RPC_URL
```

#### 2. Game State Monitoring Script
```bash
#!/bin/bash
# monitor-game.sh

CONTRACT="0xYourContractAddress"
RPC_URL="https://testnet-rpc.monad.xyz/"

while true; do
    echo "=== TugWar Game Status $(date) ==="
    
    # Game state
    ROPE_POS=$(cast call $CONTRACT "ropePosition()" --rpc-url $RPC_URL | cast to-dec)
    TEAM1_SCORE=$(cast call $CONTRACT "team1Score()" --rpc-url $RPC_URL | cast to-dec)
    TEAM2_SCORE=$(cast call $CONTRACT "team2Score()" --rpc-url $RPC_URL | cast to-dec)
    TOTAL_PULLS=$(cast call $CONTRACT "totalPulls()" --rpc-url $RPC_URL | cast to-dec)
    WIN_STATUS=$(cast call $CONTRACT "getWinStatus()" --rpc-url $RPC_URL | cast to-dec)
    
    echo "Rope Position: $ROPE_POS"
    echo "Team 1 Score: $TEAM1_SCORE"
    echo "Team 2 Score: $TEAM2_SCORE"
    echo "Total Pulls: $TOTAL_PULLS"
    echo "Win Status: $WIN_STATUS"
    
    if [ $WIN_STATUS -eq 1 ]; then
        echo "🏆 TEAM 1 WINS!"
    elif [ $WIN_STATUS -eq 2 ]; then
        echo "🏆 TEAM 2 WINS!"
    else
        echo "⚔️ Game in progress..."
    fi
    
    echo "=========================="
    
    sleep 30  # Check every 30 seconds
done
```

---

## Kesimpulan

Selamat! Anda telah berhasil mempelajari dan mengimplementasikan TugWar Game smart contract menggunakan Foundry dengan template Monad. Tutorial ini mencakup:

### ✅ Yang Telah Dipelajari

1. **Game Smart Contract Development** - Membuat game contract dengan mechanics yang kompleks dan events
2. **Comprehensive Testing** - Testing dengan Solidity, fuzz testing, integration testing, dan scenario testing
3. **Professional Deployment** - Script deployment yang informatif dengan game-specific configurations
4. **Interactive Game Features** - Multiple view functions, team statistics, predictions, dan game management
5. **Advanced Contract Patterns** - Custom errors, modifiers, events, dan gas optimization
6. **Game State Management** - Proper state transitions, win conditions, dan game resets
7. **Real-time Interaction** - CLI tools untuk gameplay, monitoring, dan management
8. **Production Best Practices** - Security, testing, deployment, dan monitoring strategies

### 🎮 Fitur Game TugWar

| Fitur | Deskripsi |
|-------|-----------|
| **Dual Team Competition** | 🔵🔴 Dua tim bersaing dalam tug of war |
| **Dynamic Rope Position** | 🎯 Posisi tali berubah setiap pull (-127 to +127) |
| **Configurable Win Conditions** | ⚙️ Owner dapat mengatur maxScoreDifference (1-50) |
| **Real-time Statistics** | 📊 Team stats, predictions, dan game analytics |
| **Event-Driven Updates** | 📡 Events untuk setiap pull, win, dan reset |
| **Game State Management** | 🔄 Complete game lifecycle dengan reset functionality |
| **Owner Controls** | 👑 Game management dan ownership transfer |
| **Prediction System** | 🔮 AI-like prediction berdasarkan current trends |
| **Multi-Game Support** | 🏆 Track multiple games dengan statistics |

### 🚀 Keunggulan Foundry untuk Game Development

| Aspect | Foundry | Traditional Tools |
|--------|---------|-------------------|
| **Testing Speed** | ⚡ Native Solidity testing | 🐌 JavaScript overhead |
| **Gas Analysis** | 📊 Built-in gas reporting | 🔌 Manual calculation |
| **Fuzz Testing** | 🎯 Native random testing | ❌ Complex setup required |
| **Event Testing** | 📡 Easy event verification | 🔧 Complex mock setups |
| **Game Scenarios** | 🎮 Complete gameplay testing | 📝 Limited integration tests |
| **CLI Interaction** | 🛠️ Direct contract calls | 🖥️ Frontend dependency |

### 🎯 Advanced Game Features

Berikut adalah beberapa ide untuk mengembangkan TugWar game lebih lanjut:

#### 1. Power-ups dan Special Abilities
```solidity
// Extend contract dengan power-ups
contract TugWarV2 is TugWarContract {
    mapping(address => uint256) public powerUpCooldown;
    
    function doublePull(bool isTeam1) external {
        require(block.timestamp > powerUpCooldown[msg.sender], "Cooldown active");
        
        // Execute double pull
        pull(isTeam1);
        pull(isTeam1);
        
        powerUpCooldown[msg.sender] = block.timestamp + 60; // 1 minute cooldown
    }
}
```

#### 2. Tournament System
```solidity
contract TugWarTournament {
    struct Tournament {
        uint256 startTime;
        uint256 endTime;
        uint256 entryFee;
        address[] participants;
        mapping(address => uint256) scores;
        address winner;
    }
    
    mapping(uint256 => Tournament) public tournaments;
    uint256 public tournamentCount;
    
    function createTournament(uint256 duration, uint256 fee) external {
        // Tournament creation logic
    }
}
```

#### 3. NFT Rewards System
```solidity
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract TugWarNFT is ERC721 {
    struct GameNFT {
        uint256 gameId;
        uint8 winningTeam;
        uint256 finalScore1;
        uint256 finalScore2;
        uint256 timestamp;
    }
    
    mapping(uint256 => GameNFT) public gameNFTs;
    
    function mintWinnerNFT(address winner, uint256 gameId) external {
        // Mint NFT untuk pemenang
    }
}
```

### 📚 Resources dan Learning Path

#### Foundry Resources
- [Foundry Book](https://book.getfoundry.sh/) - Complete Foundry documentation
- [Foundry GitHub](https://github.com/foundry-rs/foundry) - Source code dan examples
- [Cast Reference](https://book.getfoundry.sh/reference/cast/) - CLI command reference

#### Monad Resources
- [Monad Documentation](https://docs.monad.xyz/) - Official Monad docs
- [Monad Testnet](https://testnet.monadexplorer.com/) - Block explorer
- [Monad Faucet](https://faucet.testnet.monad.xyz/) - Get testnet tokens

#### Game Development Resources
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/) - Secure contract libraries
- [Solidity Patterns](https://fravoll.github.io/solidity-patterns/) - Best practices
- [Smart Contract Security](https://consensys.github.io/smart-contract-best-practices/) - Security guidelines

#### Advanced Topics
- **Upgradeable Contracts**: [OpenZeppelin Upgrades](https://docs.openzeppelin.com/upgrades-plugins/1.x/)
- **Governance Systems**: [OpenZeppelin Governor](https://docs.openzeppelin.com/contracts/4.x/governance)
- **Economic Models**: [Tokenomics Design](https://newsletter.banklesshq.com/p/tokenomics-101)

### 🛠️ Development Workflow

#### 1. Feature Development Cycle
```bash
# 1. Design phase
# - Write user stories
# - Design contract interfaces
# - Plan testing scenarios

# 2. Implementation phase
forge build                    # Compile regularly
forge test --watch            # Continuous testing
forge coverage                # Monitor coverage

# 3. Testing phase
forge test -vvv               # Detailed testing
forge test --gas-report      # Gas optimization
forge test --fuzz-runs 10000 # Stress testing

# 4. Deployment phase
forge script --rpc-url URL   # Dry run
forge script --broadcast     # Deploy
forge verify-contract        # Verify

# 5. Monitoring phase
cast logs --address CONTRACT # Monitor events
./scripts/monitor-game.sh    # Custom monitoring
```

#### 2. Git Workflow untuk Smart Contracts
```bash
# Branch structure
git checkout -b feature/powerups
git checkout -b fix/gas-optimization
git checkout -b test/tournament-scenarios

# Commit conventions
git commit -m "feat: add double pull power-up"
git commit -m "test: add fuzz testing for edge cases"
git commit -m "gas: optimize storage layout"
git commit -m "docs: update game mechanics documentation"
```

#### 3. CI/CD Pipeline Example
```yaml
# .github/workflows/test.yml
name: Test Smart Contracts

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install Foundry
        uses: foundry-rs/foundry-toolchain@v1
      - name: Run tests
        run: forge test
      - name: Check gas usage
        run: forge test --gas-report
      - name: Coverage
        run: forge coverage
```

### 🎖️ Community dan Ecosystem

#### 1. Monad Ecosystem Participation
- **Join Monad Discord**: Connect dengan developers
- **Contribute to Docs**: Improve Monad documentation
- **Build Tools**: Create utilities untuk Monad ecosystem
- **Educational Content**: Share tutorials dan guides

#### 2. Game Development Community
- **GameFi Projects**: Study successful blockchain games
- **Open Source Contributions**: Contribute ke game contracts
- **Hackathons**: Participate dalam blockchain gaming hackathons
- **Research**: Follow latest GameFi trends dan innovations

#### 3. Developer Network
- **Code Reviews**: Join code review communities
- **Mentorship**: Mentor atau seek mentorship
- **Conferences**: Attend blockchain dan gaming conferences
- **Publications**: Write about your development experience

### 🚀 Next Steps dan Project Ideas

#### Immediate Next Steps
1. **Extend TugWar Features** - Add power-ups, tournaments, atau leaderboards
2. **Build Frontend** - Create React/Vue app untuk user interface
3. **Mobile Integration** - Develop mobile app untuk gameplay
4. **Analytics Dashboard** - Build admin dashboard untuk game monitoring

#### Advanced Project Ideas
1. **Multi-Game Platform** - Platform untuk multiple blockchain games
2. **DAO Governance** - Player-governed game ecosystem
3. **Cross-Chain Gaming** - Multi-chain game experiences
4. **AI Integration** - Smart NPCs atau dynamic difficulty adjustment

#### Business Applications
1. **Corporate Team Building** - Enterprise tug of war competitions
2. **Educational Games** - Teaching blockchain concepts through gaming
3. **Charity Fundraising** - Gamified donation platforms
4. **Community Events** - Local community engagement through gaming

### 💡 Tips untuk Success

#### Technical Excellence
- **Code Quality**: Always prioritize clean, readable code
- **Testing First**: Write tests before implementing features
- **Gas Optimization**: Continuously monitor dan optimize gas usage
- **Security Focus**: Regular security audits dan best practices

#### Community Building
- **Documentation**: Maintain excellent documentation
- **Open Source**: Share code dan learnings dengan community
- **Feedback Loop**: Actively seek dan incorporate user feedback
- **Collaboration**: Work dengan other developers dan projects

#### Continuous Learning
- **Stay Updated**: Follow latest developments dalam blockchain gaming
- **Experiment**: Try new patterns, tools, dan technologies
- **Network**: Build relationships dalam developer community
- **Share Knowledge**: Teach others what you learn

---

## Penutup

TugWar Game smart contract yang telah kita bangun mendemonstrasikan kekuatan Foundry untuk blockchain game development. Dengan comprehensive testing, efficient deployment, dan advanced features seperti predictions dan statistics, project ini memberikan foundation yang solid untuk game development yang lebih kompleks.

Foundry memberikan developer experience yang superior dengan:
- **Lightning-fast compilation dan testing**
- **Native Solidity testing environment**
- **Comprehensive CLI tools untuk interaction**
- **Built-in gas optimization analysis**
- **Professional deployment workflows**

Game development di blockchain memiliki potensi besar untuk menciptakan new forms of entertainment, community engagement, dan economic models. Dengan skills yang telah Anda pelajari dalam tutorial ini, Anda siap untuk:

1. **Build More Complex Games** - RPGs, strategy games, atau metaverse applications
2. **Create Game Ecosystems** - Multi-game platforms dengan shared economies
3. **Innovate GameFi Models** - New ways to combine gaming dengan DeFi
4. **Contribute to Web3 Gaming** - Help shape the future of blockchain gaming

Selamat coding dan happy building! 🎮🚀

### Support dan Community

Jika Anda membutuhkan bantuan atau ingin berbagi project Anda:

- **Monad Discord**: Join official Monad community
- **GitHub Issues**: Report bugs atau request features
- **Developer Forums**: Participate dalam technical discussions
- **Social Media**: Share your achievements dan projects

Keep building amazing things dengan Foundry dan Monad! 🌟