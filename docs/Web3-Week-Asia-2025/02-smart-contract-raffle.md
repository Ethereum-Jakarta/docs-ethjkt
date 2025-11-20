---
id: smart-contract-raffle
title: "Part 2: Memahami Smart Contract SimpleVibeRaffle"
sidebar_label: "Part 2: Smart Contract"
sidebar_position: 2
description: "Bedah lengkap smart contract raffle game: dari teori Solidity basics hingga deploy ke Sepolia testnet"
---

# Part 2: Memahami Smart Contract SimpleVibeRaffle

> **"Smart contract itu tidak seseram yang kamu kira - mari kita bedah bareng!"** 🔍

---

## 🎯 Tujuan Part Ini

Setelah menyelesaikan part ini, kamu akan:

- ✅ Paham struktur dasar smart contract Solidity
- ✅ Mengerti setiap baris kode SimpleVibeRaffle
- ✅ Tahu cara compile contract di Remix
- ✅ Bisa deploy contract ke Base Sepolia testnet
- ✅ Memahami bagaimana contract interact dengan USDC token (ERC-20)

**Durasi:** 15 menit (saat workshop)

---

## 📖 Intro: Apa Itu Smart Contract?

### Definisi Sederhana

**Smart Contract** = Kode yang berjalan di blockchain & tidak bisa diubah.

**Analogi:**
```
Smart Contract = Mesin Vending Otomatis

Mesin Vending:
1. Kamu masukkan uang
2. Pilih barang
3. Mesin otomatis kasih barang
4. Tidak ada penjual yang bisa curang

Smart Contract:
1. Kamu kirim ETH ke contract
2. Panggil fungsi (misal: join game)
3. Contract otomatis execute logic
4. Tidak ada yang bisa ubah aturan
```

---

### Karakteristik Smart Contract

| Sifat | Penjelasan | Analogi |
|-------|------------|---------|
| **Immutable** | Tidak bisa diubah setelah deploy | Seperti kontrak yang sudah ditandatangani |
| **Deterministic** | Input sama = output sama (selalu!) | Seperti kalkulator (2+2 selalu 4) |
| **Trustless** | Tidak perlu percaya orang, percaya kode | Mesin ATM (tidak butuh teller) |
| **Transparent** | Semua orang bisa lihat kodenya | Open source code |
| **Autonomous** | Jalan sendiri tanpa intervensi | Autopilot |

---

### Bahasa Pemrograman: Solidity

**Solidity** adalah bahasa untuk menulis smart contract di Ethereum.

**Fun Facts:**
- 🎂 Dibuat tahun 2014 (masih muda!)
- 👨‍💻 Syntax mirip JavaScript & C++
- 📝 File extension: `.sol`
- ⚡ Compile jadi bytecode (EVM = Ethereum Virtual Machine)

**Contoh Kode Sederhana:**
```solidity
contract Hello {
    string public message = "GM!";
}
```

Itu aja udah smart contract! 🎉

---

## 🎲 SimpleVibeRaffle: Overview

### Apa yang Dilakukan Contract Ini?

**SimpleVibeRaffle** adalah game undian on-chain dengan fitur:

1. **Join Game GRATIS** - Tidak perlu deposit untuk join!
2. **USDC Prize Pool** - Hadiah menggunakan USDC token (bukan ETH)
3. **Dual Registration** - Self-register atau admin add manual
4. **Pick Winner** - Owner bisa pilih pemenang random
5. **Auto Transfer USDC** - Hadiah otomatis terkirim ke pemenang

---

### Alur Game

```
┌──────────────────────────────────────────────────┐
│                                                   │
│  1. OWNER DEPLOY CONTRACT                        │
│     → Set USDC address (Base Sepolia)            │
│     → Fund prize pool dengan USDC                │
│                                                   │
│  2. PLAYERS JOIN GAME (2 Cara)                   │
│     A. Self-Register:                            │
│        → Connect wallet                          │
│        → Panggil joinGame() - GRATIS!            │
│     B. Admin Register:                           │
│        → Admin panggil addPlayer(address)        │
│        → Untuk registrasi offline/manual         │
│                                                   │
│  3. OWNER PICK WINNER                            │
│     → Panggil pickWinner()                       │
│     → Contract random pilih 1 player             │
│                                                   │
│  4. AUTO TRANSFER USDC                           │
│     → Seluruh prize pool USDC terkirim otomatis  │
│     → Winner dapat USDC di wallet!               │
│                                                   │
└──────────────────────────────────────────────────┘
```

---

## 💻 Full Source Code

### SimpleVibeRaffle.sol

Copy kode ini ke Remix nanti:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

/**
 * @title IERC20
 * @notice Interface untuk USDC token
 */
interface IERC20 {
    function approve(address spender, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

/**
 * @title SimpleVibeRaffle
 * @notice Smart contract untuk raffle game dengan USDC prize pool
 * @dev Educational purpose - NOT production ready!
 */
contract SimpleVibeRaffle {
    // ============================================
    // STATE VARIABLES
    // ============================================

    address public owner;           // Address yang deploy contract
    address[] public players;       // Array semua peserta
    bool public gameOpen;           // Status game (open/closed)
    address public lastWinner;      // Address pemenang terakhir
    uint256 public lastPrize;       // Hadiah terakhir yang diberikan
    uint256 public totalGamesPlayed; // Total game yang sudah dimainkan

    IERC20 public usdcToken;        // USDC token contract

    // ============================================
    // EVENTS
    // ============================================

    event PlayerJoined(address indexed player);
    event PlayersAddedByAdmin(address[] players, address indexed admin);
    event WinnerPicked(address indexed winner, uint256 prize);
    event PrizeFunded(address indexed funder, uint256 amount);
    event GameReset(address indexed admin, uint256 timestamp);

    // ============================================
    // CONSTRUCTOR
    // ============================================

    /**
     * @dev Constructor dipanggil saat deploy
     * @param _usdcAddress Address USDC token di Base Sepolia
     */
    constructor(address _usdcAddress) {
        owner = msg.sender;
        gameOpen = true;
        usdcToken = IERC20(_usdcAddress);
        totalGamesPlayed = 0;
    }

    // ============================================
    // MODIFIERS
    // ============================================

    /**
     * @dev Modifier untuk restrict fungsi hanya untuk owner
     */
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    // ============================================
    // FUNCTIONS - OWNER ONLY
    // ============================================

    /**
     * @notice Owner bisa tambah prize pool dengan USDC
     * @dev Owner harus approve USDC dulu sebelum panggil fungsi ini
     * @param amount Jumlah USDC yang ditambahkan (dalam unit USDC)
     */
    function fundPrize(uint256 amount) external onlyOwner {
        uint256 amountInDecimals = amount * 10**6; // Convert to 6 decimals
        require(
            usdcToken.transferFrom(msg.sender, address(this), amountInDecimals),
            "USDC transfer failed"
        );

        emit PrizeFunded(msg.sender, amountInDecimals);
    }

    /**
     * @notice Admin bisa add player manual dari backend (single)
     * @dev Untuk registrasi offline atau manual registration
     * @param playerAddress Address player yang ingin ditambahkan
     */
    function addPlayer(address playerAddress) external onlyOwner {
        require(gameOpen, "Game is closed");
        require(playerAddress != address(0), "Invalid address");

        // Tambahkan address ke array players
        players.push(playerAddress);

        // Emit event untuk single player
        address[] memory singlePlayer = new address[](1);
        singlePlayer[0] = playerAddress;
        emit PlayersAddedByAdmin(singlePlayer, msg.sender);
    }

    /**
     * @notice Admin bisa add multiple players sekaligus (batch)
     * @dev Untuk batch registration, lebih gas efficient
     * @param playerAddresses Array of player addresses yang ingin ditambahkan
     */
    function addPlayersBatch(address[] calldata playerAddresses) external onlyOwner {
        require(gameOpen, "Game is closed");
        require(playerAddresses.length > 0, "Empty array");
        require(playerAddresses.length <= 100, "Too many players at once"); // Limit untuk gas

        for (uint256 i = 0; i < playerAddresses.length; i++) {
            require(playerAddresses[i] != address(0), "Invalid address in batch");
            players.push(playerAddresses[i]);
        }

        // Emit event untuk batch
        emit PlayersAddedByAdmin(playerAddresses, msg.sender);
    }

    /**
     * @notice Pilih pemenang secara random
     * @dev PERINGATAN: Random ini tidak aman untuk production!
     */
    function pickWinner() external onlyOwner {
        require(gameOpen, "Game already closed");
        require(players.length > 0, "No players joined");

        // Tutup game agar tidak ada yang bisa join lagi
        gameOpen = false;

        // Generate random number (SIMPLE, NOT SECURE!)
        uint256 random = uint256(
            keccak256(
                abi.encodePacked(
                    block.timestamp,    // Waktu block saat ini
                    msg.sender,         // Address owner
                    players.length,     // Jumlah players
                    blockhash(block.number - 1) // Hash block sebelumnya
                )
            )
        );

        // Pilih index pemenang
        uint256 winnerIndex = random % players.length;
        address winner = players[winnerIndex];

        // Ambil seluruh saldo USDC contract
        uint256 prize = usdcToken.balanceOf(address(this));

        // Simpan data pemenang
        lastWinner = winner;
        lastPrize = prize;
        totalGamesPlayed++;

        // Transfer USDC ke pemenang
        require(usdcToken.transfer(winner, prize), "USDC transfer to winner failed");

        // Emit event
        emit WinnerPicked(winner, prize);
    }

    /**
     * @notice Reset game untuk mulai raffle baru
     * @dev Hapus semua players dan buka game lagi
     */
    function resetGame() external onlyOwner {
        require(!gameOpen, "Game is still open, pick winner first");

        // Reset array players
        delete players;

        // Buka game lagi
        gameOpen = true;

        // Emit event
        emit GameReset(msg.sender, block.timestamp);
    }

    /**
     * @notice Emergency reset - bisa dipanggil kapan saja
     * @dev Gunakan hanya jika ada masalah atau ingin cancel game
     */
    function emergencyReset() external onlyOwner {
        // Reset array players
        delete players;

        // Buka game lagi
        gameOpen = true;

        // Emit event
        emit GameReset(msg.sender, block.timestamp);
    }

    // ============================================
    // FUNCTIONS - PUBLIC
    // ============================================

    /**
     * @notice Join game raffle - GRATIS!
     * @dev Siapa saja bisa panggil, tidak perlu deposit
     */
    function joinGame() external {
        require(gameOpen, "Game is closed");

        // Tambahkan address ke array players
        players.push(msg.sender);

        // Emit event
        emit PlayerJoined(msg.sender);
    }

    /**
     * @notice Lihat semua players yang sudah join
     * @return Array of player addresses
     */
    function getPlayers() external view returns (address[] memory) {
        return players;
    }

    /**
     * @notice Lihat jumlah players
     * @return Total number of players
     */
    function getPlayerCount() external view returns (uint256) {
        return players.length;
    }

    /**
     * @notice Lihat total prize pool dalam USDC
     * @return Prize amount (6 decimals)
     */
    function getPrizePool() external view returns (uint256) {
        return usdcToken.balanceOf(address(this));
    }

    /**
     * @notice Lihat informasi pemenang terakhir
     * @return winner Address pemenang terakhir
     * @return prize Jumlah hadiah terakhir
     */
    function getLastWinner() external view returns (address winner, uint256 prize) {
        return (lastWinner, lastPrize);
    }

    /**
     * @notice Lihat total game yang sudah dimainkan
     * @return Total games played
     */
    function getTotalGamesPlayed() external view returns (uint256) {
        return totalGamesPlayed;
    }
}
```

**Total:** ~240 baris (dengan comments & interface!)
**Tanpa comments:** ~120 baris clean code

**Key Features & Updates:**
- ✅ Menggunakan USDC (ERC-20 token) untuk prize pool
- ✅ Network: Base Sepolia (bukan Ethereum Sepolia)
- ✅ Join game tetap GRATIS (no deposit required)
- ✅ Interface IERC20 untuk interact dengan USDC contract
- ✅ **NEW**: Batch player registration (`addPlayersBatch()`)
- ✅ **NEW**: Game reset functionality (`resetGame()`, `emergencyReset()`)
- ✅ **NEW**: Winner history tracking (`lastWinner`, `lastPrize`, `totalGamesPlayed`)
- ✅ **NEW**: Enhanced random dengan `blockhash`
- ✅ **NEW**: View functions untuk lihat history (`getLastWinner()`, `getTotalGamesPlayed()`)

---

## 🔍 Bedah Kode: Baris per Baris

### 1. License & Pragma

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;
```

**Penjelasan:**
- `SPDX-License-Identifier` = Lisensi kode (MIT = open source)
- `pragma solidity ^0.8.30` = Versi compiler yang dipakai
  - `^0.8.30` = Versi 0.8.30 atau lebih baru (tapi di bawah 0.9.0)
  - Version update untuk fitur dan optimizations terbaru

**Analogi:**
```
Seperti di file HTML:
<!DOCTYPE html>  ← Tentukan versi
```

---

### 2. State Variables

```solidity
address public owner;
address[] public players;
bool public gameOpen;
address public lastWinner;
uint256 public lastPrize;
uint256 public totalGamesPlayed;
```

**Penjelasan:**

| Variable | Type | Fungsi |
|----------|------|--------|
| `owner` | `address` | Alamat yang deploy contract (owner) |
| `players` | `address[]` | Array (list) semua peserta |
| `gameOpen` | `bool` | Status game (true/false) |
| `lastWinner` | `address` | Address pemenang terakhir (history) |
| `lastPrize` | `uint256` | Jumlah hadiah terakhir dalam USDC (6 decimals) |
| `totalGamesPlayed` | `uint256` | Counter total game yang sudah selesai |

**Keyword `public`:**
- Auto-generate fungsi getter
- Siapa saja bisa baca (tapi tidak bisa ubah langsung!)

**Contoh:**
```solidity
address public owner;

// Otomatis ada fungsi:
function owner() public view returns (address) {
    return owner;
}
```

---

### 3. Events

```solidity
event PlayerJoined(address indexed player);
event PlayersAddedByAdmin(address[] players, address indexed admin);
event WinnerPicked(address indexed winner, uint256 prize);
event PrizeFunded(address indexed funder, uint256 amount);
event GameReset(address indexed admin, uint256 timestamp);
```

**Apa itu Event?**

Event = Log yang tersimpan di blockchain.

**Fungsi:**
- 📝 Recording aktivitas (audit trail)
- 🔔 Notifikasi untuk frontend (via WebSocket)
- 🔍 Mudah di-search (kalau pakai `indexed`)

**Event Breakdown:**

| Event | Purpose | Indexed Parameters |
|-------|---------|-------------------|
| `PlayerJoined` | Player join sendiri via `joinGame()` | player |
| `PlayersAddedByAdmin` | Admin add player(s) manual | admin |
| `WinnerPicked` | Pemenang terpilih dan prize terkirim | winner |
| `PrizeFunded` | Owner top-up prize pool | funder |
| `GameReset` | Game direset untuk round baru | admin |

**Analogi:**
```
Event = Mutasi rekening bank

Setiap transaksi tercatat:
- Tanggal
- Jenis transaksi
- Jumlah
- Dari/ke siapa
```

**Keyword `indexed`:**
- Maksimal 3 parameter bisa `indexed`
- Indexed = bisa di-filter saat query
- Contoh: Cari semua event di mana `player = 0x123...`

**Note:** `PlayersAddedByAdmin` menggunakan array untuk support batch operations

---

### 4. Constructor

```solidity
constructor(address _usdcAddress) {
    owner = msg.sender;
    gameOpen = true;
    usdcToken = IERC20(_usdcAddress);
    totalGamesPlayed = 0;
}
```

**Apa itu Constructor?**

Constructor = Fungsi yang jalan **HANYA SAAT DEPLOY**.

**Karakteristik:**
- Jalan 1x saja (saat contract dibuat)
- Tidak bisa dipanggil lagi
- Biasa untuk setup awal

**Parameter `_usdcAddress`:**
- Address USDC token contract di Base Sepolia
- Value: `0x036CbD53842c5426634e7929541eC2318f3dCF7e`
- Contract menyimpan address ini untuk interact dengan USDC

**Initialization:**
- `owner = msg.sender` - Deployer menjadi owner
- `gameOpen = true` - Game langsung open
- `usdcToken = IERC20(_usdcAddress)` - Set USDC interface
- `totalGamesPlayed = 0` - Counter dimulai dari 0 **(NEW!)**

**`msg.sender`:**
- Global variable
- Address yang kirim transaksi
- Di constructor, `msg.sender` = deployer (becomes owner)

**`usdcToken = IERC20(_usdcAddress)`:**
- Inisialisasi interface IERC20 dengan address USDC
- Setelah ini, contract bisa call USDC functions (transfer, balanceOf, dll)

**Contoh Deploy:**
```
Kamu deploy contract dengan parameter:
_usdcAddress = 0x036CbD53842c5426634e7929541eC2318f3dCF7e

→ constructor() jalan
→ owner = address kamu
→ gameOpen = true
→ usdcToken = USDC contract interface
→ totalGamesPlayed = 0
→ Prize pool = 0 (owner perlu fund manual)
```

---

### 5. Modifier

```solidity
modifier onlyOwner() {
    require(msg.sender == owner, "Not owner");
    _;
}
```

**Apa itu Modifier?**

Modifier = Reusable guard/check untuk fungsi.

**Struktur:**
- `require(kondisi, "error message")` = Check condition
- `_` = Placeholder untuk kode fungsi yang pakai modifier

**Flow:**
```
function pickWinner() onlyOwner {
    // 1. Cek modifier dulu
    //    require(msg.sender == owner)
    // 2. Kalau pass, jalankan function body
    //    ...
}
```

**Kenapa Pakai Modifier?**

**Tanpa Modifier (Repetitive):**
```solidity
function pickWinner() {
    require(msg.sender == owner, "Not owner");
    // ... logic
}

function fundPrize() {
    require(msg.sender == owner, "Not owner");
    // ... logic
}
```

**Dengan Modifier (DRY - Don't Repeat Yourself):**
```solidity
function pickWinner() onlyOwner {
    // ... logic
}

function fundPrize() onlyOwner {
    // ... logic
}
```

**Lebih clean!** ✨

---

### 6. Function: fundPrize()

```solidity
function fundPrize(uint256 amount) external onlyOwner {
    uint256 amountInDecimals = amount * 10**6;
    require(
        usdcToken.transferFrom(msg.sender, address(this), amountInDecimals),
        "USDC transfer failed"
    );
    emit PrizeFunded(msg.sender, amountInDecimals);
}
```

**Penjelasan:**

| Keyword | Artinya |
|---------|---------|
| `external` | Hanya bisa dipanggil dari luar contract |
| `onlyOwner` | Hanya owner yang bisa panggil |
| `amount` | Parameter: jumlah USDC (dalam unit, bukan decimals) |

**Flow Fungsi:**
1. **Convert amount ke decimals:** USDC punya 6 decimals, jadi 10 USDC = 10,000,000
2. **Transfer USDC:** Pakai `transferFrom()` untuk ambil USDC dari owner ke contract
3. **Emit event:** Log berapa USDC yang di-fund

**⚠️ PENTING: Butuh Approval Dulu!**

Sebelum call `fundPrize()`, owner HARUS approve USDC contract dulu:
```solidity
// Di USDC contract:
approve(contractAddress, 1000 * 10**6) // Approve 1000 USDC
```

**Kenapa perlu approve?**
- ERC-20 security mechanism
- Contract tidak bisa ambil token tanpa izin
- Owner explicitly approve berapa max yang boleh di-transfer

**Contoh:**
```
1. Owner approve USDC: 1000 USDC
2. Owner call fundPrize(10) → Transfer 10 USDC
3. Prize pool sekarang: 10 USDC
4. Allowance tersisa: 990 USDC
```

---

### 7. Function: joinGame()

```solidity
function joinGame() external {
    require(gameOpen, "Game is closed");
    players.push(msg.sender);
    emit PlayerJoined(msg.sender);
}
```

**Penjelasan Baris per Baris:**

**Line 1: `require(gameOpen, "Game is closed")`**
- Check apakah game masih open
- Kalau `gameOpen == false`, revert dengan error

**Line 2: `players.push(msg.sender)`**
- Tambahkan address pemanggil ke array `players`
- `push()` = append ke akhir array

**Line 3: `emit PlayerJoined(msg.sender)`**
- Emit event untuk log

**Flow:**
```
User A panggil joinGame()
→ Check: gameOpen? ✅ true
→ players = [addressA]
→ Emit event: PlayerJoined(addressA)

User B panggil joinGame()
→ Check: gameOpen? ✅ true
→ players = [addressA, addressB]
→ Emit event: PlayerJoined(addressB)
```

**Catatan Penting:**
- Fungsi ini GRATIS (tidak pakai `payable`)
- Satu address bisa join berkali-kali
  - joinGame() 3x = 3 entries = peluang 3x lebih besar!

---

### 8. Function: pickWinner()

Ini adalah **jantung** dari contract! Mari kita bedah detail.

```solidity
function pickWinner() external onlyOwner {
    require(gameOpen, "Game already closed");
    require(players.length > 0, "No players joined");

    gameOpen = false;

    uint256 random = uint256(
        keccak256(
            abi.encodePacked(
                block.timestamp,
                msg.sender,
                players.length
            )
        )
    );

    uint256 winnerIndex = random % players.length;
    address winner = players[winnerIndex];

    uint256 prize = address(this).balance;

    (bool success, ) = winner.call{value: prize}("");
    require(success, "Transfer failed");

    emit WinnerPicked(winner, prize);
}
```

**Mari bedah step by step:**

---

#### Step 1: Validation

```solidity
require(gameOpen, "Game already closed");
require(players.length > 0, "No players joined");
```

**Check:**
1. Game masih open?
2. Ada minimal 1 player?

Kalau salah satu false → transaksi revert.

---

#### Step 2: Close Game

```solidity
gameOpen = false;
```

**Kenapa?**
- Agar tidak ada yang bisa `joinGame()` lagi setelah winner dipilih
- Prevent manipulation

---

#### Step 3: Generate Random Number

```solidity
uint256 random = uint256(
    keccak256(
        abi.encodePacked(
            block.timestamp,    // Waktu block saat ini
            msg.sender,         // Address owner
            players.length      // Jumlah players
        )
    )
);
```

**Breakdown:**

1. `abi.encodePacked(...)` = Gabungkan 4 nilai jadi bytes **(update: +blockhash)**
2. `keccak256(...)` = Hash bytes tersebut (SHA-3)
3. `uint256(...)` = Convert hash jadi angka

**Komponen Random:**
- `block.timestamp` = Timestamp block (selalu beda tiap block)
- `msg.sender` = Address owner (constant)
- `players.length` = Jumlah players (beda tiap game)
- `blockhash(block.number - 1)` = Hash dari block sebelumnya **(NEW!)**

**⚠️ PERINGATAN PENTING:**

**Ini BUKAN random yang aman!**

**Kenapa tidak aman?**
- Miner bisa manipulasi `block.timestamp` (±15 detik)
- `msg.sender` & `players.length` bisa diprediksi
- Untuk uang beneran, bisa di-exploit!

**Solusi untuk production:**
- Gunakan **Chainlink VRF** (Verifiable Random Function)
- VRF = Random yang benar-benar tidak bisa di-manipulate

**Tapi untuk workshop & testnet? Ini cukup!** ✅

---

#### Step 4: Pick Winner

```solidity
uint256 winnerIndex = random % players.length;
address winner = players[winnerIndex];
```

**Penjelasan:**

`%` = Modulo (sisa bagi)

**Contoh:**
```
players.length = 5 (5 players)
random = 123456789

winnerIndex = 123456789 % 5 = 4

players = [A, B, C, D, E]
           0  1  2  3  4
                      ↑
                   winner = E
```

**Kenapa pakai modulo?**
- Memastikan index selalu valid (0 sampai length-1)
- Distribusi merata

---

#### Step 5: Get Prize Amount

```solidity
uint256 prize = usdcToken.balanceOf(address(this));
```

**Penjelasan:**

- `usdcToken` = Interface IERC20 yang pointing ke USDC contract
- `.balanceOf(address(this))` = Check saldo USDC yang dimiliki contract ini
- `address(this)` = Address contract SimpleVibeRaffle
- `prize` = Seluruh saldo USDC contract

**Contoh:**
```
Contract USDC balance: 10,000,000 (dalam 6 decimals)
→ prize = 10,000,000 = 10 USDC (seluruhnya untuk pemenang!)
```

---

#### Step 6: Save Winner History **(NEW!)**

```solidity
lastWinner = winner;
lastPrize = prize;
totalGamesPlayed++;
```

**Penjelasan:**

Contract sekarang menyimpan history pemenang!

**State Variables Updated:**
- `lastWinner` = Address pemenang yang baru terpilih
- `lastPrize` = Jumlah USDC yang dimenangkan
- `totalGamesPlayed` = Increment counter (game ke berapa)

**Benefit:**
- 📊 Bisa lihat siapa pemenang terakhir
- 📈 Track berapa game sudah dimainkan
- 🔍 Transparency dan accountability

**Use Case:**
```
Game 1: Winner A dapat 10 USDC
Game 2: Winner B dapat 5 USDC
Game 3: Winner C dapat 15 USDC

Setelah Game 3:
- lastWinner = C
- lastPrize = 15 USDC
- totalGamesPlayed = 3
```

---

#### Step 7: Transfer USDC to Winner

```solidity
require(usdcToken.transfer(winner, prize), "USDC transfer to winner failed");
```

**Ini adalah bagian yang paling keren!** 💸

**Penjelasan:**

`usdcToken.transfer(winner, prize)` = Transfer USDC ke winner

**Breakdown:**
- `usdcToken.transfer()` = Call fungsi transfer di USDC contract
- `winner` = Address pemenang yang dipilih
- `prize` = Jumlah USDC (seluruh balance contract)
- Returns `bool` = true kalau sukses, false kalau gagal

**Kenapa pakai `.transfer()` untuk ERC-20?**

| Pattern | Use Case |
|---------|----------|
| **Native ETH**: `.call{value}("")` | Transfer ETH (native token) |
| **ERC-20 Token**: `.transfer()` | Transfer token seperti USDC, DAI, dll |

**Perbedaan ETH vs USDC:**
```
ETH (native):
contract.call{value: 1 ether}("")  // Direct transfer

USDC (ERC-20):
usdcToken.transfer(address, amount)  // Call USDC contract function
```

**`require(..., "USDC transfer to winner failed")`:**
- Kalau transfer return false, revert seluruh transaksi
- Winner pasti dapat USDC atau tidak ada yang terjadi
- Atomic execution = all or nothing!

---

#### Step 8: Emit Event

```solidity
emit WinnerPicked(winner, prize);
```

**Log:**
- Siapa pemenang
- Berapa hadiahnya

Event ini bisa dilihat di BaseScan! 🎉

---

### 9. New Functions: Batch Operations & Reset **(NEW!)**

Contract sekarang punya fungsi-fungsi tambahan untuk flexibility!

#### `addPlayersBatch()` - Batch Registration

```solidity
function addPlayersBatch(address[] calldata playerAddresses) external onlyOwner {
    require(gameOpen, "Game is closed");
    require(playerAddresses.length > 0, "Empty array");
    require(playerAddresses.length <= 100, "Too many players at once");

    for (uint256 i = 0; i < playerAddresses.length; i++) {
        require(playerAddresses[i] != address(0), "Invalid address in batch");
        players.push(playerAddresses[i]);
    }

    emit PlayersAddedByAdmin(playerAddresses, msg.sender);
}
```

**Purpose:**
- Add MULTIPLE players sekaligus (batch)
- Lebih gas-efficient daripada call `addPlayer()` berkali-kali
- Max 100 players per batch (limit untuk prevent out-of-gas)

**Use Case:**
```
Offline event dengan 50 peserta
→ Admin tinggal call addPlayersBatch([addr1, addr2, ..., addr50])
→ Lebih murah daripada 50x addPlayer() calls!
```

---

#### `resetGame()` - Normal Reset

```solidity
function resetGame() external onlyOwner {
    require(!gameOpen, "Game is still open, pick winner first");
    delete players;
    gameOpen = true;
    emit GameReset(msg.sender, block.timestamp);
}
```

**Purpose:**
- Reset game setelah winner dipilih
- Hapus semua players, buka game lagi
- HARUS pick winner dulu (safety check)

**Flow:**
```
1. pickWinner() → gameOpen = false
2. resetGame() → delete players, gameOpen = true
3. Siap untuk round baru!
```

---

#### `emergencyReset()` - Force Reset

```solidity
function emergencyReset() external onlyOwner {
    delete players;
    gameOpen = true;
    emit GameReset(msg.sender, block.timestamp);
}
```

**Purpose:**
- Reset paksa TANPA pick winner
- Untuk emergency situations
- Misal: ada bug, salah konfigurasi, atau ingin cancel game

**⚠️ Use with Caution:**
- Akan hapus semua players tanpa memberikan hadiah
- Only use jika memang perlu!

---

### 10. New View Functions: History Tracking **(NEW!)**

#### `getLastWinner()` - Lihat Pemenang Terakhir

```solidity
function getLastWinner() external view returns (address winner, uint256 prize) {
    return (lastWinner, lastPrize);
}
```

**Returns:**
- `winner`: Address pemenang terakhir
- `prize`: Jumlah USDC yang dimenangkan (6 decimals)

**Use Case:**
```
Di frontend: "Last Winner: 0x123...abc won 10 USDC"
```

---

#### `getTotalGamesPlayed()` - Total Games

```solidity
function getTotalGamesPlayed() external view returns (uint256) {
    return totalGamesPlayed;
}
```

**Returns:**
- Total number of games yang sudah selesai

**Use Case:**
```
Stats dashboard: "Total Games Played: 15"
```

---

### 11. Original View Functions

```solidity
function getPlayers() external view returns (address[] memory) {
    return players;
}

function getPlayerCount() external view returns (uint256) {
    return players.length;
}

function getPrizePool() external view returns (uint256) {
    return usdcToken.balanceOf(address(this));
}
```

**Apa itu `view` function?**

- **Read-only** (tidak ubah state)
- **Gratis** (tidak perlu gas kalau dipanggil dari luar blockchain)
- **Tidak bisa kirim transaksi**

**Fungsi:**
- `getPlayers()` = Lihat semua player addresses
- `getPlayerCount()` = Lihat jumlah players
- `getPrizePool()` = Lihat total hadiah

**Kapan pakai `view`?**
- ✅ Baca data
- ❌ Ubah data (pakai function biasa)

---

## 🛠️ Compile Contract di Remix

### Step-by-Step Compile

**1. Buat File Baru**

- Buka Remix: https://remix.ethereum.org
- Klik icon "File Explorer" 📁
- Klik kanan folder `contracts`
- Pilih "New File"
- Nama: `SimpleVibeRaffle.sol`

**2. Copy-Paste Kode**

- Copy kode SimpleVibeRaffle dari section sebelumnya
- Paste ke file yang baru dibuat

**3. Compile**

- Klik icon "Solidity Compiler" 📊 di sidebar kiri
- **Compiler version:** Pilih `0.8.20` atau lebih baru
- **Auto compile:** ON (recommended)
- Klik "Compile SimpleVibeRaffle.sol"

**4. Check Hasil**

Kalau sukses, akan ada:
```
✅ Compilation successful

Contract artifacts:
- SimpleVibeRaffle
```

**5. Lihat Details (Opsional)**

Klik "Compilation Details" untuk lihat:
- **ABI** (Application Binary Interface) - Seperti API contract
- **Bytecode** - Kode yang di-deploy ke blockchain
- **Gas estimates** - Estimasi biaya setiap fungsi

---

### Troubleshooting Compile Errors

**Error: Version mismatch**
```
Error: Source file requires different compiler version
```

**Solusi:**
- Check `pragma solidity ^0.8.20` di kode
- Set compiler version yang sesuai di Remix

---

**Error: Syntax error**
```
ParserError: Expected ';' but got ')'
```

**Solusi:**
- Check syntax (titik koma, kurung, dll)
- Pastikan copy-paste kode complete (tidak terpotong)

---

## 🚀 Deploy Contract ke Base Sepolia

### Persiapan

Pastikan:
- ✅ Contract sudah compiled tanpa error
- ✅ MetaMask connected ke Remix
- ✅ Network di MetaMask = **Base Sepolia**
- ✅ Punya ETH Base Sepolia (minimal 0.01 untuk gas)
- ✅ Punya USDC Base Sepolia untuk prize pool

---

### Step-by-Step Deploy

**1. Buka Deploy Tab**

- Klik icon "Deploy & Run Transactions" 🚀

**2. Pilih Environment**

```
Environment: Injected Provider - MetaMask
```

**3. Verify Connection**

Check di Remix:
```
Account: 0x1234...5678 (your address)
Balance: 0.01 ETH (your balance)
Network: Base Sepolia (84532)
```

**IMPORTANT:** Pastikan network adalah **Base Sepolia (84532)**, bukan Ethereum Sepolia!

**4. Set Constructor Parameters**

Contract ini butuh 1 parameter saat deploy:

Di field **"Deploy"** ada input untuk constructor:

```
_USDCADDRESS: 0x036CbD53842c5426634e7929541eC2318f3dCF7e
```

**Penjelasan:**
- `_usdcAddress` = Address USDC token di Base Sepolia
- Copy-paste: `0x036CbD53842c5426634e7929541eC2318f3dCF7e`

**5. Deploy!**

- Contract dropdown: Pilih `SimpleVibeRaffle`
- Input parameter: Paste USDC address
- Klik tombol "Deploy" (warna orange)

**6. Confirm di MetaMask**

MetaMask akan popup:
```
Contract Deployment
Network: Base Sepolia
Gas fee: ~0.0005 ETH

[Reject] [Confirm]
```

Klik **Confirm**

**7. Tunggu Mining**

Remix akan show:
```
[pending] Waiting for transaction to be mined...
```

Tunggu ~5-10 detik (Base lebih cepat dari Ethereum!).

**8. Success! 🎉**

Terminal akan show:
```
✅ Contract deployed at: 0xABC...123
Gas used: 450000
Transaction hash: 0xdef...456
```

---

### Verify Deployment

**Di Remix:**

Check section "Deployed Contracts":
```
📦 SimpleVibeRaffle at 0xABC...123

Functions:
- owner
- gameOpen
- joinGame
- pickWinner
- getPlayers
- ...
```

---

**Di BaseScan:**

1. Copy contract address: `0xABC...123`

2. Buka: **https://sepolia.basescan.org**

3. Paste address di search bar

4. Akan lihat:
```
Contract: 0xABC...123
Balance: 0 ETH (normal, prize dalam USDC)
Creator: 0x1234...5678 (you)
Creation Tx: 0xdef...456
```

5. Klik tab "Contract" → Harusnya ada bytecode

---

**Test Fungsi Read:**

Di Remix, klik button:
- `owner` → Harusnya return address kamu
- `gameOpen` → Harusnya return `true`
- `usdcToken` → Harusnya return `0x036CbD53842c5426634e7929541eC2318f3dCF7e`
- `getPlayerCount` → Harusnya return `0` (belum ada yang join)
- `getPrizePool` → Harusnya return `0` (belum fund prize)

**Kalau semua berfungsi = Deploy sukses!** ✅

---

## 💰 Fund Prize Pool dengan USDC

Sekarang contract sudah deployed, tapi prize pool masih **0 USDC**!

Owner perlu fund prize pool agar ada hadiah untuk pemenang.

### ⚠️ PENTING: Kenapa Perlu Approve?

**Masalah:**
Contract SimpleVibeRaffle ingin mengambil USDC dari wallet kamu, tapi **USDC contract belum kasih izin**!

**Solusi:**
Kamu harus **approve** USDC contract dulu, agar SimpleVibeRaffle boleh ambil USDC dari wallet kamu.

**Analogi:**
```
Seperti kasih kartu akses:

Tanpa Approve:
- Contract: "Saya mau ambil 10 USDC dari wallet owner"
- USDC: "Tidak bisa! Kamu tidak punya izin!" ❌

Dengan Approve:
- Owner: "USDC, izinkan contract ambil max 1000 USDC"
- USDC: "OK, izin tercatat!" ✅
- Contract: "Ambil 10 USDC"
- USDC: "Boleh! (1000-10=990 tersisa)" ✅
```

---

### Step 1: Load USDC Contract di Remix

**USDC sudah deployed** di Base Sepolia, kita cuma perlu **connect** ke contract tersebut.

**1. Pastikan Interface IERC20 Ada**

Check apakah interface IERC20 sudah ada di file `SimpleVibeRaffle.sol`.

Kalau belum, pastikan ada interface ini di atas contract:

```solidity
interface IERC20 {
    function approve(address spender, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}
```

**2. Compile Interface**

- Klik "Solidity Compiler" 📊
- Pastikan `SimpleVibeRaffle.sol` sudah compiled
- Interface IERC20 otomatis ikut compiled ✅

**3. Load USDC Contract (JANGAN Deploy!)**

Di tab **"Deploy & Run Transactions"** 🚀:

1. **Di Contract dropdown, pilih:**
   ```
   IERC20 - SimpleVibeRaffle.sol
   ```
   (Bukan SimpleVibeRaffle, tapi IERC20 interface!)

2. **Scroll ke bawah, cari field "At Address"**

3. **Paste USDC contract address:**
   ```
   0x036CbD53842c5426634e7929541eC2318f3dCF7e
   ```

4. **Klik tombol "At Address"** (warna pink/merah muda)

5. **USDC Contract akan muncul di "Deployed Contracts":**
   ```
   📦 IERC20 at 0x036C...CF7e

   Functions:
   🔵 allowance
   🔵 balanceOf
   🟠 approve
   🟠 transfer
   ```

**Catatan Penting:**
- ❌ **JANGAN klik "Deploy"** - ini akan deploy contract baru!
- ✅ **Gunakan "At Address"** - ini connect ke contract yang sudah ada!

---

### Step 2: Check USDC Balance (Opsional)

**Verify kamu punya USDC:**

1. **Klik function `balanceOf`** (blue button)

2. **Input:**
   ```
   account: 0x296f...C86 (paste address wallet kamu)
   ```

3. **Klik "call"**

4. **Harusnya return angka > 0** (misal: `10000000` = 10 USDC)

**Kalau balance = 0:**
- Kamu perlu minta USDC testnet dulu
- **Circle USDC Faucet:** https://faucet.circle.com/
- Pilih network: Base Sepolia
- Paste address wallet kamu
- Atau untuk workshop, instructor akan kasih

---

### Step 3: Approve USDC ke Contract

**Ini adalah step WAJIB sebelum fundPrize!**

**Di IERC20 contract (yang baru kamu load):**

1. **Expand function `approve`** (orange button 🟠)

2. **Input parameters:**
   ```
   spender: 0x0d247121788afC6F510B3fCE0a672D74947125de
   (Paste address SimpleVibeRaffle contract kamu)

   amount: 1000000000
   (1000 USDC dalam 6 decimals)
   ```

   **Penjelasan amount:**
   - USDC punya 6 decimals
   - 1 USDC = 1,000,000 (1 juta)
   - 1000 USDC = 1,000,000,000 (1 miliar)
   - Approve 1000 USDC sekaligus biar tidak perlu approve terus-terusan

3. **Klik "transact"**

4. **MetaMask akan popup:**
   ```
   Token Approval

   Allow SimpleVibeRaffle to spend your USDC?
   Amount: 1000 USDC

   Network: Base Sepolia
   Gas fee: ~0.0001 ETH

   [Reject] [Confirm]
   ```

5. **Klik "Confirm"**

6. **Tunggu transaksi success** (~5-10 detik)

7. **Terminal Remix akan show:**
   ```
   ✅ Transaction confirmed
   Status: Success
   Function: approve
   ```

**Selamat! USDC sudah di-approve!** ✅

---

### Step 4: Verify Approval (Opsional)

**Double-check approval berhasil:**

1. **Klik function `allowance`** (blue button)

2. **Input:**
   ```
   owner: 0x296f...C86 (address wallet kamu)
   spender: 0x0d24...25de (address SimpleVibeRaffle contract)
   ```

3. **Klik "call"**

4. **Harusnya return:**
   ```
   1000000000
   ```

**Kalau return angka tersebut = Approval berhasil!** ✅

---

### Step 5: Fund Prize Pool

**Sekarang kamu bisa fund prize pool!**

**Kembali ke SimpleVibeRaffle contract:**

1. **Expand function `fundPrize`** (orange button 🟠)

2. **Input:**
   ```
   amount: 10
   (Akan jadi 10 USDC, karena di contract dikali 10^6)
   ```

3. **Klik "transact"**

4. **MetaMask popup:**
   ```
   Contract Interaction

   Function: fundPrize
   Network: Base Sepolia
   Gas fee: ~0.0002 ETH

   [Reject] [Confirm]
   ```

5. **Klik "Confirm"**

6. **Tunggu success!**

7. **Terminal akan show:**
   ```
   ✅ Transaction confirmed
   Status: Success
   Event: PrizeFunded(funder, 10000000)
   ```

**Prize pool sudah terisi!** 🎉

---

### Step 6: Verify Prize Pool

**Check prize pool sudah masuk:**

1. **Klik function `getPrizePool`** (blue button)

2. **Harusnya return:**
   ```
   10000000
   (10 USDC dalam 6 decimals)
   ```

**Kalau angka tersebut muncul = Fund prize berhasil!** ✅

---

### Troubleshooting Fund Prize

#### Error: "ERC20: transfer amount exceeds allowance"

**Solusi:**
- Kamu **belum approve** atau approve amount terlalu kecil
- Ulangi **Step 3** (approve USDC)
- Pastikan approve amount >= amount yang mau di-fund

---

#### Error: "ERC20: transfer amount exceeds balance"

**Solusi:**
- USDC balance kamu tidak cukup
- Check balance dengan `balanceOf()`
- Minta USDC dari faucet atau swap di testnet

---

#### Approval Sudah Habis

Kalau sudah fund beberapa kali dan allowance habis:

```
Contoh:
Approve: 1000 USDC
Fund 1: -10 USDC (sisa 990)
Fund 2: -10 USDC (sisa 980)
...
Fund 100: -10 USDC (sisa 0) ❌ Error!

Solusi: Approve lagi!
```

---

### Summary: Complete Flow

```
┌─────────────────────────────────────────┐
│                                          │
│  1. DEPLOY SimpleVibeRaffle              │
│     ✅ Contract address: 0x0d24...      │
│                                          │
│  2. LOAD USDC Contract                   │
│     → At Address: 0x036C...             │
│     ✅ IERC20 loaded                     │
│                                          │
│  3. APPROVE USDC                         │
│     → approve(contract, 1000 USDC)      │
│     ✅ Allowance: 1000 USDC              │
│                                          │
│  4. FUND PRIZE                           │
│     → fundPrize(10)                     │
│     ✅ Prize pool: 10 USDC               │
│                                          │
│  5. READY TO PLAY!                       │
│     → Game open, prize funded           │
│     ✅ Workshop can start!               │
│                                          │
└─────────────────────────────────────────┘
```

**Sekarang contract ready untuk workshop!** 🚀

---

## 📊 Contract State Tracking

### Memahami State Contract

**State** = Data yang tersimpan di contract.

**Current state setelah deploy (dan fund prize):**

```
owner: 0x1234...5678 (address kamu)
players: [] (array kosong)
gameOpen: true
lastWinner: 0x0000...0000 (belum ada winner)
lastPrize: 0 (belum ada prize diberikan)
totalGamesPlayed: 0 (belum ada game selesai)
usdcToken: 0x036CbD...CF7e (USDC contract address)
```

**USDC Balance (bukan state variable, tapi penting):**
```
Contract USDC balance: 10000000 (10 USDC jika sudah fund)
(Dihitung via: usdcToken.balanceOf(address(this)))
```

**State akan berubah kalau:**
- Ada yang `joinGame()` → `players` bertambah
- Owner `fundPrize()` → Contract USDC balance bertambah
- Owner `pickWinner()` → `gameOpen = false`, `lastWinner` = winner address, `lastPrize` = prize amount, `totalGamesPlayed++`, contract USDC balance = 0
- Owner `resetGame()` atau `emergencyReset()` → `players = []`, `gameOpen = true`

---

### Lihat State di Remix

**Variables Public:**

Klik button di "Deployed Contracts":

```
owner (blue) → Returns address
players (blue, dengan input field untuk index) → Returns address at index
gameOpen (blue) → Returns bool
```

**View Functions:**

Klik button:

```
getPlayers (blue) → Returns array
getPlayerCount (blue) → Returns uint256
getPrizePool (blue) → Returns uint256
```

**Color Code:**
- 🔵 Blue = Read (view/pure) - Gratis
- 🟠 Orange = Write (state-changing) - Perlu gas
- 🔴 Red = Payable (kirim ETH) - Perlu gas + value

---

## 🎯 Quick Reference

### Contract Functions Cheat Sheet

**Owner Functions:**

| Function | Type | Gas | Fungsi |
|----------|------|-----|--------|
| `fundPrize(uint256)` | External | Yes | Tambah prize pool dengan USDC (butuh approve dulu) |
| `addPlayer(address)` | External | Yes | Add 1 player manual dari backend |
| `addPlayersBatch(address[])` | External | Yes | Add multiple players sekaligus **(NEW!)** |
| `pickWinner()` | External | Yes | Pilih winner & transfer USDC, simpan history **(UPDATED!)** |
| `resetGame()` | External | Yes | Reset game setelah pickWinner (normal) **(NEW!)** |
| `emergencyReset()` | External | Yes | Force reset tanpa pickWinner (emergency) **(NEW!)** |

**Public Functions:**

| Function | Type | Who | Gas | Fungsi |
|----------|------|-----|-----|--------|
| `joinGame()` | External | Anyone | Yes | Join raffle - GRATIS! No deposit! |

**View Functions (Read-Only, No Gas):**

| Function | Type | Returns | Fungsi |
|----------|------|---------|--------|
| `getPlayers()` | View | `address[]` | List semua players yang join |
| `getPlayerCount()` | View | `uint256` | Jumlah total players |
| `getPrizePool()` | View | `uint256` | Total USDC prize pool (6 decimals) |
| `getLastWinner()` | View | `address, uint256` | Pemenang terakhir & hadiah **(NEW!)** |
| `getTotalGamesPlayed()` | View | `uint256` | Total games yang sudah selesai **(NEW!)** |

**Public State Variables (Auto-Generated Getters):**

| Variable | Type | Returns | Info |
|----------|------|---------|------|
| `owner` | address | `address` | Address owner contract |
| `gameOpen` | bool | `bool` | Status game (true = open, false = closed) |
| `lastWinner` | address | `address` | Pemenang terakhir **(NEW!)** |
| `lastPrize` | uint256 | `uint256` | Hadiah terakhir dalam USDC **(NEW!)** |
| `totalGamesPlayed` | uint256 | `uint256` | Counter total games **(NEW!)** |
| `usdcToken` | IERC20 | `address` | USDC contract address |
| `players(uint256)` | address[] | `address` | Get player by index |

---

### Solidity Keywords Reference

| Keyword | Artinya |
|---------|---------|
| `contract` | Definisi contract |
| `function` | Definisi fungsi |
| `modifier` | Reusable guard |
| `constructor` | Fungsi deploy |
| `public` | Bisa diakses siapa saja |
| `external` | Hanya dari luar contract |
| `view` | Read-only, gratis |
| `payable` | Bisa terima ETH |
| `require()` | Assert condition |
| `emit` | Emit event/log |

---

## ✅ Checklist: Ready for Part 3?

Sebelum lanjut, pastikan:

### Understanding
- [ ] Paham struktur contract (state vars, functions, events, interface)
- [ ] Paham setiap fungsi di SimpleVibeRaffle
- [ ] Paham kenapa perlu approve USDC sebelum fundPrize
- [ ] Paham perbedaan "Deploy" vs "At Address"

### Contract Deployment
- [ ] Contract sudah compiled tanpa error
- [ ] Contract sudah deployed ke **Base Sepolia**
- [ ] Punya contract address (copy & save!)
- [ ] Bisa lihat contract di **BaseScan**
- [ ] Test fungsi `owner`, `gameOpen`, `usdcToken` works

### Prize Pool Setup
- [ ] USDC contract sudah di-load dengan "At Address"
- [ ] USDC sudah di-approve ke SimpleVibeRaffle contract
- [ ] Prize pool sudah di-fund (minimal 10 USDC)
- [ ] `getPrizePool()` return angka > 0
- [ ] Bisa lihat event `PrizeFunded` di BaseScan

---

## 🚀 Next: Hands-on Game!

Sekarang contract sudah deploy & ready!

Saatnya:
1. Join game dari wallet peserta
2. Pick winner
3. Celebrate! 🎉

**[📖 Part 3: Hands-on - Join Game & Pilih Pemenang →](./03-hands-on-game.md)**

---

**[← Part 1: Setup](./01-persiapan-setup.md)** | **[Main Index](./web3-vibe-raffle-workshop.md)** | **[Part 3: Hands-on →](./03-hands-on-game.md)**

---

**#Web3WeekAsia** | **#BuildWeb3** | **#SmartContracts**
