---
sidebar_position: 9
title: "Stylus SDK - Mulai dari Nol"
description: "Belajar Stylus SDK step-by-step dengan membuat Counter Contract"
---

# ⚡ Stylus SDK - Mulai dari Nol

<div style={{backgroundColor: '#1e3a8a', padding: '20px', borderRadius: '10px', marginBottom: '20px', border: '2px solid #3b82f6'}}>
  <h3 style={{color: '#60a5fa', marginTop: 0}}>📅 Townhall Session 2 - 29 Januari 2026 (Part 2)</h3>
  <p style={{color: '#e0e7ff', fontSize: '1.1em', marginBottom: 0}}>
    Belajar membuat smart contract pertama dengan Rust dan Stylus SDK. Mulai dari yang paling sederhana!
  </p>
</div>

## 🎯 Apa yang Akan Dibuat

Dalam tutorial ini, kita akan membuat **Counter Contract** - smart contract paling sederhana untuk memahami Stylus SDK.

Counter Contract ini bisa:
- ✅ Menyimpan angka counter
- ✅ Menambah counter (+1)
- ✅ Membaca nilai counter
- ✅ Reset counter ke 0

**Mengapa mulai dari Counter?**
- Mudah dipahami (hanya 1 variabel)
- Tidak perlu logic kompleks
- Perfect untuk belajar storage, methods, dan deployment
- Sama seperti "Hello World" tapi lebih berguna!

---

## ✅ Prerequisites

Sebelum memulai, pastikan sudah terinstall:

| Tool | Minimum Version | Stable/Working | Check Command |
|------|----------------|----------------|---------------|
| **Rust** | 1.81.0 | 1.88.0-1.93.0 | `rustc --version` |
| **Cargo** | 1.81.0 | 1.88.0-1.93.0 | `cargo --version` |
| **cargo-stylus** | 0.5.0 | 0.6.3 | `cargo stylus --version` |

:::info Versi Penting
- **Rust 1.81+** diperlukan untuk compile Stylus contracts
- **cargo-stylus 0.5.0+** diperlukan untuk contract verification di Arbiscan
- **cargo-stylus 0.6.3** adalah versi terbaru (29 Januari 2026)

:::warning Versi SDK yang Stable
Per Januari 2026, gunakan **stylus-sdk 0.9.0** (bukan 0.10.0) untuk stability:
- `stylus-sdk = "=0.9.0"` ✅ STABLE & PROVEN WORKING
- `stylus-sdk = "0.10.0"` ⚠️ Ada known issues dengan cargo-stylus

Dokumentasi ini menggunakan **0.9.0** untuk ensure workshop berjalan lancar!
:::

**Install Rust (jika belum):**
```bash
# Install rustup (Rust installer)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Setup environment
source "$HOME/.cargo/env"

# Verifikasi
rustc --version  # Should be 1.81.0 or higher
```

---

## 🚀 1. Setup Stylus Project

### 1.1. Install cargo-stylus

Pertama, install tool Stylus CLI:

```bash
# Install cargo-stylus versi terbaru
cargo install cargo-stylus

# Verifikasi instalasi
cargo stylus --version
# Output: cargo-stylus 0.6.3 (atau lebih baru)
```

:::success Berhasil!
Jika muncul versi cargo-stylus, Anda siap melanjutkan!
:::

:::tip Update cargo-stylus
Jika sudah install sebelumnya, update ke versi terbaru:
```bash
cargo install cargo-stylus --force
```
:::

### 1.2. Buat Project Baru

Buat project Stylus dari template resmi:

```bash
# Buat project baru bernama "my-counter"
cargo stylus new my-counter

# Masuk ke folder project
cd my-counter

# Struktur folder:
# my-counter/
# ├── Cargo.toml      # Konfigurasi project & dependencies
# ├── src/
# │   └── lib.rs      # Smart contract kita
# └── .gitignore
```

**Penjelasan:**
- `cargo stylus new` - membuat project Stylus baru dengan template
- `my-counter` - nama project (bisa diganti sesuai keinginan)
- `Cargo.toml` - seperti `package.json` untuk Rust
- `src/lib.rs` - file utama smart contract

**Verifikasi Cargo.toml:**

Buka `Cargo.toml` dan pastikan strukturnya lengkap seperti ini:

```toml
[package]
name = "my-counter"
version = "0.1.0"
edition = "2021"

[dependencies]
alloy-primitives = "=0.8.20"  # EXACT version untuk stability
alloy-sol-types = "=0.8.20"   # EXACT version untuk stability
stylus-sdk = "=0.9.0"         # STABLE version (Jan 2026)
hex = { version = "0.4", default-features = false }
ruint = "=1.15.0"             # Lock untuk avoid conflicts

[dev-dependencies]
tokio = { version = "1", features = ["full"], default-features = false }
ethers = "2"

[features]
export-abi = ["stylus-sdk/export-abi"]
default = ["mini-alloc"]
mini-alloc = []

[lib]
crate-type = ["lib", "cdylib"]

[profile.release]
codegen-units = 1
opt-level = 3
lto = true
panic = "abort"
strip = true
```

:::success Versi yang Proven Working!
Template di atas menggunakan **exact versions** (`=`) untuk mencegah dependency conflicts. Setup ini sudah tested dan guaranteed working per Januari 2026!
:::

:::danger Common Error
Jika Anda hanya punya section `[dependencies]` tanpa `[package]`, Anda akan mendapat error:
```
error: this virtual manifest specifies a `dependencies` section, which is not allowed
```

Solusi: Pastikan ada section `[package]` di atas `[dependencies]`!
:::

:::info stylus-sdk v0.10.0
Versi 0.10.0 (rilis 12 Januari 2026) memperkenalkan:
- `stylus-tools` untuk programmatic deployment
- `contract-client-gen` feature flag untuk library contracts
- Improved workspace support dengan `Stylus.toml`
:::

### 1.3. Verifikasi Project Bisa Di-compile

Test apakah project bisa di-compile:

```bash
# Compile project
cargo build --release --target wasm32-unknown-unknown

# Jika berhasil, akan muncul:
# Compiling my-counter v0.1.0
# Finished release [optimized] target(s) in X.XXs
```

:::tip Target WASM
`wasm32-unknown-unknown` adalah target compile untuk WebAssembly. Stylus menggunakan WASM untuk menjalankan smart contract Rust!
:::

---

## 📝 2. Membuat Counter Contract

Sekarang kita akan menulis Counter Contract step-by-step.

### 2.1. Hapus Template Default

Buka file `src/lib.rs` dan **hapus semua isinya**. Kita akan menulis dari nol untuk memahami setiap baris!

### 2.2. Import Dependencies

Tambahkan import yang diperlukan:

```rust
// lib.rs
#![cfg_attr(not(any(test, feature = "export-abi")), no_main)]
#![cfg_attr(not(any(test, feature = "export-abi")), no_std)]
extern crate alloc;

// Import untuk ABI export
use alloc::vec;
use alloc::vec::Vec;

// Import dari Stylus SDK
use stylus_sdk::prelude::*;
use stylus_sdk::storage::StorageU256;
use stylus_sdk::alloy_primitives::U256;
```

**Penjelasan:**
- `#![cfg_attr(..., no_main)]` - disable main function untuk WASM
- `#![cfg_attr(..., no_std)]` - no standard library (untuk WASM optimization)
- `extern crate alloc` - untuk alokasi memory (wajib di WASM)
- `use alloc::vec` - import Vec untuk ABI export compatibility
- `use stylus_sdk::prelude::*` - import semua yang sering dipakai
- `StorageU256` - tipe storage untuk angka (seperti `uint256` di Solidity)
- `U256` - tipe data untuk angka besar (256-bit)

:::info StorageU256 vs U256
- `StorageU256` - untuk menyimpan data ON-CHAIN (permanent)
- `U256` - untuk variable temporary (seperti parameter function)
:::

### 2.3. Definisi Storage

Buat struct untuk menyimpan state contract:

```rust
// Definisi storage contract
#[storage]
#[entrypoint]
pub struct Counter {
    count: StorageU256,  // Variabel untuk menyimpan counter
}
```

**Penjelasan:**
- `#[storage]` - attribute yang menandai ini adalah storage contract
- `#[entrypoint]` - menandai ini adalah contract utama yang bisa dipanggil
- `pub struct Counter` - nama contract kita (seperti `contract Counter` di Solidity)
- `count: StorageU256` - variabel state untuk menyimpan nilai counter

**Analogi Solidity:**
```solidity
contract Counter {
    uint256 public count;  // Sama seperti ini di Solidity!
}
```

### 2.4. Implementasi Methods

Sekarang tambahkan fungsi-fungsi untuk interact dengan counter:

```rust
#[public]
impl Counter {
    // Fungsi untuk increment counter (+1)
    pub fn increment(&mut self) {
        let current = self.count.get();           // Baca nilai sekarang
        let new_value = current + U256::from(1);  // Tambah 1
        self.count.set(new_value);                // Simpan nilai baru
    }

    // Fungsi untuk membaca nilai counter
    pub fn get_count(&self) -> U256 {
        self.count.get()  // Return nilai counter
    }

    // Fungsi untuk reset counter ke 0
    pub fn reset(&mut self) {
        self.count.set(U256::from(0));  // Set ke 0
    }
}
```

**Penjelasan setiap fungsi:**

**1. `increment()` - Menambah counter**
- `&mut self` - mutable reference (bisa ubah data)
- `self.count.get()` - membaca nilai counter dari storage
- `U256::from(1)` - convert angka 1 menjadi U256
- `self.count.set(new_value)` - menyimpan nilai baru ke storage

**2. `get_count()` - Membaca nilai**
- `&self` - immutable reference (hanya baca, tidak ubah)
- `-> U256` - function return nilai bertipe U256
- Gratis dipanggil (tidak butuh gas!)

**3. `reset()` - Reset ke 0**
- `&mut self` - perlu mutate data
- `U256::from(0)` - convert 0 menjadi U256

:::tip View vs Non-View
- Fungsi dengan `&self` (get_count) - **GRATIS**, hanya baca data
- Fungsi dengan `&mut self` (increment, reset) - **BUTUH GAS**, mengubah state
:::

### 2.5. Code Lengkap

Berikut adalah code lengkap `src/lib.rs`:

```rust
// src/lib.rs
#![cfg_attr(not(any(test, feature = "export-abi")), no_main)]
#![cfg_attr(not(any(test, feature = "export-abi")), no_std)]
extern crate alloc;

use alloc::vec;
use alloc::vec::Vec;
use stylus_sdk::prelude::*;
use stylus_sdk::storage::StorageU256;
use stylus_sdk::alloy_primitives::U256;

// Storage contract
#[storage]
#[entrypoint]
pub struct Counter {
    count: StorageU256,
}

// Public methods
#[public]
impl Counter {
    /// Increment counter by 1
    pub fn increment(&mut self) {
        let current = self.count.get();
        let new_value = current + U256::from(1);
        self.count.set(new_value);
    }

    /// Get current counter value
    pub fn get_count(&self) -> U256 {
        self.count.get()
    }

    /// Reset counter to 0
    pub fn reset(&mut self) {
        self.count.set(U256::from(0));
    }
}
```

**File tambahan: `src/main.rs`**

Untuk support ABI export, buat file `src/main.rs`:

```rust
// src/main.rs
#![cfg_attr(not(any(test, feature = "export-abi")), no_main)]

#[cfg(not(any(test, feature = "export-abi")))]
#[no_mangle]
pub extern "C" fn main() {}

#[cfg(feature = "export-abi")]
fn main() {
    my_counter::print_from_args();
}
```

:::info Struktur Project
Project Stylus membutuhkan 2 file:
- **`src/lib.rs`** - Contract logic utama
- **`src/main.rs`** - Entry point untuk ABI export (auto-generated oleh macros)

File `main.rs` ini hanya diperlukan untuk `cargo stylus export-abi`, tidak affect deployment contract!
:::

---

## 🔨 3. Compile dan Check Contract

### 3.1. Compile ke WASM

Compile contract menjadi WebAssembly:

```bash
# Compile dengan optimization
cargo build --release --target wasm32-unknown-unknown

# Jika berhasil:
# Compiling stylus-sdk v0.9.0
# Compiling my-counter v0.1.0
# Finished release [optimized] target(s) in 15.2s
```

File WASM akan ada di:
```
target/wasm32-unknown-unknown/release/my_counter.wasm
```

### 3.2. Check Contract Valid

Verifikasi bahwa contract valid untuk Stylus:

```bash
# Check apakah contract bisa di-deploy
cargo stylus check

# Output jika berhasil:
#    Compiling stylus-sdk v0.9.0
#    Compiling my-counter v0.1.0
#     Finished `release` profile [optimized] target(s) in 51.29s
# contract size: 4.8 KB (4807 bytes)
```

:::success Validasi Berhasil!
Jika muncul `contract size: X KB`, artinya contract kita berhasil di-compile menjadi WASM dan siap di-deploy!
:::

:::warning Error "Connection refused"
Jika muncul error:
```
error: no error payload found in response: Transport(Custom(reqwest::Error ...
Connection refused ...
```

Ini **NORMAL** dan bisa diabaikan! Error ini muncul karena `cargo stylus check` mencoba connect ke local node (localhost:8547) yang tidak running. Yang penting adalah:
- ✅ Compilation berhasil
- ✅ Contract size muncul (e.g., `4.8 KB`)

Contract Anda **VALID** dan siap deploy ke testnet!
:::

### 3.3. Export ABI

Generate ABI untuk interaksi dari frontend:

```bash
# Generate ABI JSON (save to file)
cargo stylus export-abi > abi.json

# Atau lihat langsung di terminal
cargo stylus export-abi
```

:::tip Membutuhkan src/main.rs
Command `export-abi` membutuhkan file `src/main.rs` yang sudah kita buat di step 2.5. Jika Anda mendapat error "a bin target must be available", pastikan file `src/main.rs` ada!
:::

**Output ABI (Solidity-compatible):**

```solidity
// SPDX-License-Identifier: MIT-OR-APACHE-2.0
pragma solidity ^0.8.23;

interface ICounter {
    function increment() external;

    function getCount() external view returns (uint256);

    function reset() external;
}
```

**Penjelasan ABI:**
- `increment()` - function untuk tambah counter (butuh gas)
- `getCount()` - function view untuk baca counter (gratis!)
- `reset()` - function untuk reset counter (butuh gas)

:::info Apa itu ABI?
ABI (Application Binary Interface) adalah "manual instruction" yang menjelaskan cara interact dengan smart contract. Frontend perlu ABI untuk panggil function contract!

Stylus menggenerate ABI dalam format Solidity interface, sehingga compatible dengan tools Ethereum ecosystem seperti ethers.js, web3.js, dll.
:::

---

## 🚀 4. Deploy ke Arbitrum Sepolia

### 4.1. Setup Arbitrum Sepolia

Sebelum deploy, pastikan sudah:

**1. Punya wallet dengan private key**

**2. Punya Sepolia ETH untuk gas**
- Claim dari [Google Cloud Faucet](https://cloud.google.com/application/web3/faucet/ethereum/sepolia)
- Atau [Alchemy Faucet](https://sepoliafaucet.com/)

**3. Bridge ETH ke Arbitrum Sepolia**
- Buka [Arbitrum Bridge Sepolia](https://bridge.arbitrum.io/?destinationChain=arbitrum-sepolia)
- Connect wallet
- Bridge minimal 0.01 ETH ke Arbitrum Sepolia

:::warning PENTING!
Pastikan bridge ke **Arbitrum Sepolia** (testnet), BUKAN Arbitrum One (mainnet)!
:::

### 4.2. Set Environment Variables

Buat file `.env` untuk menyimpan private key:

```bash
# Buat file .env di root project
touch .env

# Edit .env dan tambahkan:
PRIVATE_KEY=your_private_key_here_without_0x_prefix
```

**Cara mendapatkan private key dari MetaMask:**
1. Buka MetaMask
2. Klik titik 3 → Account Details
3. Klik "Export Private Key"
4. Masukkan password MetaMask
5. Copy private key (tanpa "0x")

:::danger Keamanan Private Key!
- JANGAN commit file `.env` ke Git!
- Pastikan `.env` ada di `.gitignore`
- Gunakan wallet testnet, JANGAN wallet dengan ETH asli!
:::

### 4.3. Deploy Contract

Deploy contract ke Arbitrum Sepolia:

```bash
# Deploy dengan cargo stylus
cargo stylus deploy \
  --private-key-path=.env \
  --endpoint=https://sepolia-rollup.arbitrum.io/rpc

# Process deployment (tunggu 30-60 detik):
# Reading WASM file...
# Deploying contract to Arbitrum Sepolia...
# Transaction sent: 0x1234...
# Waiting for confirmation...
# Contract deployed at: 0xabcd1234...
```

:::tip RPC Endpoint
`https://sepolia-rollup.arbitrum.io/rpc` adalah RPC endpoint untuk Arbitrum Sepolia testnet. Ini GRATIS digunakan!
:::

### 4.4. Simpan Contract Address

Setelah deploy berhasil, **SIMPAN contract address**!

Contoh:
```
Contract deployed at: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
```

Anda akan butuh address ini untuk interact dengan contract!

### 4.5. (Optional) Cache Contract untuk Gas Optimization

Setelah deployment berhasil, Anda akan melihat rekomendasi untuk cache contract:

```bash
# Cache contract di ArbOS
cargo stylus cache bid YOUR_CONTRACT_ADDRESS 0

# Contoh:
cargo stylus cache bid 0x95597662d6306b6591f33b966a1a6d2843638288 0
```

**Mengapa perlu caching?**
- ✅ **Cheaper calls** - Contract calls menjadi lebih murah
- ✅ **Faster execution** - Contract execution lebih cepat
- ✅ **Better UX** - User experience lebih baik karena lower gas fees

:::info Contract Caching
Caching adalah optional tapi **sangat direkomendasikan** untuk production contracts. Cache menyimpan compiled WASM di ArbOS cache untuk akses yang lebih efisien.

Baca lebih lanjut: [Stylus Contract Caching](https://docs.arbitrum.io/stylus/how-tos/caching-contracts)
:::

### 4.6. Verify Contract di Arbiscan

Contract verification membuat source code Anda visible & verifiable di Arbiscan. Ini **penting** untuk:
- ✅ Transparency - User bisa lihat source code
- ✅ Trust - User tahu contract aman
- ✅ Interaction - Arbiscan bisa generate UI untuk interact

Ada **3 metode** verification:
1. **API V2** - Modern, reliable (RECOMMENDED)
2. **Command Line** - Local verification
3. **Web Interface** - Currently broken di Sepolia (API V1 deprecated)

---

#### Method 1: API V2 Verification (RECOMMENDED) ⭐

**Prerequisites:**

| Item | Value | Link |
|------|-------|------|
| Arbiscan API Key | Get free key | [arbiscan.io/myapikey](https://arbiscan.io/myapikey) |
| GitHub Repository | Public repo | Push code to GitHub (root directory!) |
| Chain ID | `421614` | Arbitrum Sepolia |

**Step 1: Get API Key**

1. Visit https://arbiscan.io/myapikey
2. Login/Register (gratis!)
3. Click **"Add"** → Create new API key
4. Copy API key Anda

**Step 2: Push Code to GitHub**

```bash
# Di directory project Anda
git init
git add .
git commit -m "Add Stylus Counter Contract"

# Create repo di GitHub, lalu:
git remote add origin https://github.com/YOUR_USERNAME/my-counter.git
git push -u origin main
```

:::warning Important!
Contract **HARUS** di root directory repo, tidak bisa di subdirectory!

✅ Correct:
```
my-counter/        ← Root
├── Cargo.toml
└── src/lib.rs
```

❌ Wrong:
```
repo/
└── contracts/
    └── my-counter/   ← Subdirectory tidak supported!
```
:::

**Step 3: Verify via API**

```bash
# Replace values with yours:
API_KEY="YOUR_API_KEY"
CONTRACT="0x95597662d6306b6591f33b966a1a6d2843638288"
GITHUB_REPO="https://github.com/YOUR_USERNAME/my-counter"

curl -X POST "https://api.arbiscan.io/api" \
  -d "chainid=421614" \
  -d "module=contract" \
  -d "action=verifysourcecode" \
  -d "apikey=$API_KEY" \
  -d "codeformat=stylus" \
  -d "sourceCode=$GITHUB_REPO" \
  -d "contractaddress=$CONTRACT" \
  -d "contractname=my_counter" \
  -d "compilerversion=stylus:0.6.3" \
  -d "licenseType=3"
```

**Expected Response:**
```json
{
  "status": "1",
  "message": "OK",
  "result": "a7lpxkm9kpcpicx7daftmjifrfhiuhf5vqqnawhkfhzfrcpnxj"
}
```

**Step 4: Check Status**

```bash
# Use GUID from previous response
GUID="a7lpxkm9kpcpicx7daftmjifrfhiuhf5vqqnawhkfhzfrcpnxj"

curl "https://api.arbiscan.io/api?module=contract&action=checkverifystatus&guid=$GUID&apikey=$API_KEY"
```

**Success Response:**
```json
{
  "status": "1",
  "message": "OK",
  "result": "Pass - Verified"
}
```

**License Types:**

| Code | License |
|------|---------|
| `1` | No License (None) |
| `2` | The Unlicense (Unlicense) |
| `3` | MIT License (MIT) |
| `4` | GNU GPLv2 (GNU GPLv2) |
| `5` | GNU GPLv3 (GNU GPLv3) |
| `6` | Apache 2.0 (Apache-2.0) |

:::tip Automated Script
Saya sudah buat script `verify-contract.sh` di project directory Anda yang automate semua steps ini!

```bash
# Edit API_KEY di script, lalu run:
chmod +x verify-contract.sh
./verify-contract.sh
```

Script ini akan:
1. ✅ Submit verification request
2. ✅ Get GUID untuk tracking
3. ✅ Auto-check status setelah 10 seconds
4. ✅ Show verification result
:::

---

#### Method 2: Command Line Verification

Local verification untuk prove reproducibility:

```bash
cargo stylus verify \
  --deployment-tx YOUR_DEPLOYMENT_TX_HASH \
  --endpoint https://sepolia-rollup.arbitrum.io/rpc \
  --no-verify
```

**Expected Output:**
```
✅ Verification successful
📊 Contract size: 4.8 KB
🔒 Metadata hash: d5d1e2b15036069b7c500c378ca15809d61e4e1d4354dce29b9990e7ea9a663a
```

---

#### Method 3: Web Interface (Currently Broken)

:::danger Deprecated API V1
Web verification di Arbiscan Sepolia currently broken dengan error:
```
Error: You are using a deprecated V1 endpoint
```

**Status per Januari 2026:**
- ❌ Arbiscan Sepolia - Broken (API V1)
- ✅ Arbiscan One (Mainnet) - Working (API V2)

Gunakan **Method 1 (API V2)** atau **Method 2 (CLI)** sebagai gantinya.
:::

---

#### Cek Status Verification

1. Buka contract di Arbiscan Sepolia:
   ```
   https://sepolia.arbiscan.io/address/YOUR_CONTRACT_ADDRESS
   ```

2. Klik tab **"Contract"**

3. Lihat status:
   - ✅ **"Contract Source Code Verified"** - Sudah verified!
   - ❌ **"Are you the contract creator?"** - Belum verified

#### Manual Verification (Jika Belum Verified)

**Step 1: Buka Verification Page**

Option A - Direct:
```
https://sepolia.arbiscan.io/verifyContract
```

Option B - From contract page:
- Tab "Contract" → Click "Verify and Publish"

**Step 2: Fill Details**

| Field | Value |
|-------|-------|
| **Contract Address** | `YOUR_CONTRACT_ADDRESS` |
| **Compiler Type** | Stylus (Rust) |
| **Compiler Version** | v0.6.3 |
| **License** | MIT atau Apache-2.0 |

**Step 3: Upload Source Code**

**Option A - Copy-Paste:**
- Upload `src/lib.rs` dan `Cargo.toml`
- Paste lengkap dengan dependencies

**Option B - Fetch from Git (Recommended):**
- Push project ke GitHub (di root directory!)
- Pilih "Fetch from Git"
- Enter repository URL

:::warning Project Structure
Jika menggunakan "Fetch from Git", pastikan:
- ❌ Contract BUKAN di subdirectory
- ✅ Contract di ROOT repository
- ✅ Include `Cargo.toml`, `Cargo.lock`, `src/lib.rs`
:::

**Step 4: Verify**

- Click **"Verify and Publish"**
- Wait 10-30 seconds
- Refresh page

**Expected Result:**
```
✅ Contract Source Code Verified (Exact Match)
```

### 4.7. Verification Troubleshooting

**Error: "Contract source code not found"**
- ✅ Pastikan GitHub repo PUBLIC (bukan private)
- ✅ Pastikan contract di ROOT directory repo
- ✅ Pastikan `Cargo.toml` dan `src/lib.rs` accessible

**Error: "Compilation failed"**
- ✅ Check compiler version match: `stylus:0.6.3`
- ✅ Check contract name match (gunakan `_` bukan `-`)
- ✅ Pastikan dependencies di Cargo.toml correct

**Error: "Bytecode does not match"**
- ✅ Pastikan source code di GitHub = source code deployed
- ✅ Pastikan tidak ada uncommitted changes
- ✅ Check Cargo.lock committed ke repo

**Status: "Pending in queue"**
- ⏳ Tunggu 30-60 seconds
- ⏳ Check status lagi dengan checkverifystatus endpoint
- ⏳ Normal untuk verification memakan waktu

---

### 4.8. View Verified Contract

Setelah verification, cek contract di Arbiscan Sepolia:

1. Buka https://sepolia.arbiscan.io/address/YOUR_CONTRACT_ADDRESS
2. Tab "Contract" akan menampilkan:
   - ✅ **Green checkmark** "Contract Source Code Verified"
   - ✅ Source code (Rust) yang bisa dibaca
   - ✅ ABI interface
   - ✅ **Read Contract** tab - View functions (gratis!)
   - ✅ **Write Contract** tab - State-changing functions

:::success Verification Benefits
Setelah verified, user bisa:
- 📖 Read source code langsung di browser
- 🔍 Verify contract logic aman
- 🎮 Interact via Arbiscan UI (no need cast!)
- 📊 See all contract methods & events
- 🔗 Share verifiable contract dengan community
:::

**Expected Deployment Output:**

```bash
$ cargo stylus deploy --private-key-path=.env --endpoint=https://sepolia-rollup.arbitrum.io/rpc

Building project with Cargo.toml version: 0.1.0
    Finished `release` profile [optimized] target(s) in 1.30s
contract size: 4.8 KB (4831 bytes)
wasm data fee: 0.000067 ETH
deployed code at address: 0x95597662d6306b6591f33b966a1a6d2843638288
deployment tx hash: 0xbe550788c54bbf9f1784062fc2369251e5235d1b43588016ff386752d742b44c
successfully activated contract
```

:::success Deployment Berhasil!
Jika muncul "successfully activated contract" dengan contract address, deployment Anda berhasil! 🎉

Simpan contract address untuk interact nanti!
:::

---

## 🎮 5. Interact dengan Contract

### 5.1. Menggunakan Cast (Foundry)

Install Foundry jika belum punya:

```bash
# Install Foundry
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

**Baca nilai counter (view function - gratis!):**

```bash
# Panggil getCount
cast call YOUR_CONTRACT_ADDRESS \
  "getCount()(uint256)" \
  --rpc-url https://sepolia-rollup.arbitrum.io/rpc

# Contoh dengan contract yang sudah deployed:
cast call 0x95597662d6306b6591f33b966a1a6d2843638288 \
  "getCount()(uint256)" \
  --rpc-url https://sepolia-rollup.arbitrum.io/rpc

# Output:
# 0x0000000000000000000000000000000000000000000000000000000000000000
# (dalam hex = 0 dalam decimal)
```

:::tip Convert Hex ke Decimal
Gunakan `cast --to-base` untuk convert:
```bash
cast --to-base 0x0000000000000000000000000000000000000000000000000000000000000001 10
# Output: 1
```
:::

**Increment counter (butuh gas):**

```bash
# Panggil increment (butuh private key untuk sign transaksi)
cast send YOUR_CONTRACT_ADDRESS \
  "increment()" \
  --private-key YOUR_PRIVATE_KEY \
  --rpc-url https://sepolia-rollup.arbitrum.io/rpc

# Output:
# Transaction hash: 0x...
# Block: 12345
# Gas used: 45000
```

**Baca counter lagi (seharusnya 1):**

```bash
cast call YOUR_CONTRACT_ADDRESS \
  "getCount()(uint256)" \
  --rpc-url https://sepolia-rollup.arbitrum.io/rpc

# Output:
# 0x0000000000000000000000000000000000000000000000000000000000000001
# (1 dalam decimal!)
```

**Reset counter:**

```bash
cast send YOUR_CONTRACT_ADDRESS \
  "reset()" \
  --private-key YOUR_PRIVATE_KEY \
  --rpc-url https://sepolia-rollup.arbitrum.io/rpc
```

### 5.2. Menggunakan ethers.js

Buat file JavaScript untuk interact:

```javascript
// interact.js
const { ethers } = require('ethers');

// Setup
const PRIVATE_KEY = 'your_private_key';
const CONTRACT_ADDRESS = 'your_contract_address';
const RPC_URL = 'https://sepolia-rollup.arbitrum.io/rpc';

// ABI - hanya function yang kita butuhkan
const ABI = [
  "function getCount() view returns (uint256)",
  "function increment()",
  "function reset()"
];

async function main() {
  // Connect ke Arbitrum Sepolia
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet);

  // Baca counter
  const count = await contract.getCount();
  console.log('Current count:', count.toString());

  // Increment
  console.log('Incrementing...');
  const tx = await contract.increment();
  await tx.wait();
  console.log('Incremented!');

  // Baca lagi
  const newCount = await contract.getCount();
  console.log('New count:', newCount.toString());
}

main();
```

Jalankan:
```bash
node interact.js
```

---

## 🐛 6. Troubleshooting

### 6.1. Error: "this virtual manifest specifies a `dependencies` section"

**Penyebab:** Cargo.toml tidak lengkap, hanya ada `[dependencies]` tanpa `[package]`.

**Solusi:**
Pastikan Cargo.toml memiliki struktur lengkap:

```toml
[package]           # ← WAJIB ada ini!
name = "my-counter"
version = "0.1.0"
edition = "2021"

[dependencies]
stylus-sdk = "0.10.0"
alloy-primitives = "1.0.1"
alloy-sol-types = "1.0.1"

[lib]
crate-type = ["cdylib"]
```

### 6.2. Error: "insufficient funds for gas"

**Penyebab:** Wallet tidak punya cukup ETH di Arbitrum Sepolia.

**Solusi:**
1. Bridge lebih banyak ETH ke Arbitrum Sepolia
2. Claim dari faucet lagi
3. Cek balance: `cast balance YOUR_ADDRESS --rpc-url https://sepolia-rollup.arbitrum.io/rpc`

### 6.3. Error: "WASM validation failed"

**Penyebab:** Contract tidak valid atau terlalu besar.

**Solusi:**
1. Pastikan compile dengan `--release`:
   ```bash
   cargo build --release --target wasm32-unknown-unknown
   ```
2. Check contract: `cargo stylus check`

### 6.4. Error: "nonce too high"

**Penyebab:** Nonce transaksi tidak sinkron.

**Solusi:**
Reset account di MetaMask:
1. Settings → Advanced
2. Clear activity tab data

### 6.5. Error: "evaluation of ... failed" atau "BYTES must be equal"

**Penyebab:** Dependency version conflict, biasanya dengan `ruint` package.

**Error message:**
```
error[E0080]: evaluation of `alloy_primitives::ruint::bytes::<impl ...>` failed
BYTES must be equal to Self::BYTES
```

**Solusi:**
Lock `ruint` ke versi 1.15.0:

```toml
[dependencies]
alloy-primitives = "=0.8.20"
alloy-sol-types = "=0.8.20"
stylus-sdk = "=0.9.0"
ruint = "=1.15.0"  # ← IMPORTANT!
```

Lalu update:
```bash
cargo update
cargo clean
cargo stylus check
```

### 6.6. Error: "build did not generate wasm file"

**Penyebab:** Ada `src/main.rs` yang conflict dengan library setup.

**Solusi:**
Hapus file `src/main.rs` jika ada:

```bash
rm src/main.rs
cargo clean
cargo stylus check
```

Stylus contracts hanya butuh `src/lib.rs`, tidak butuh `main.rs`!

### 6.7. Contract deployed tapi tidak bisa dipanggil

**Penyebab:** Mungkin lupa `#[public]` di impl block.

**Solusi:**
Pastikan ada `#[public]` sebelum `impl Counter`:
```rust
#[public]  // ← WAJIB ada ini!
impl Counter {
    // ...
}
```

### 6.8. Warning: "unexpected cfg condition value: contract-client-gen"

**Penyebab:** Warning harmless dari internal stylus-sdk macros.

**Pesan warning:**
```
warning: unexpected `cfg` condition value: `contract-client-gen`
  --> src/lib.rs:10:1
   |
10 | #[storage]
   | ^^^^^^^^^^
```

**Solusi:**
Warning ini **AMAN dan bisa diabaikan**. Tidak mempengaruhi functionality contract. Ini adalah internal feature flag dari stylus-sdk yang muncul di compile time tapi tidak affect runtime behavior.

### 6.9. Arbiscan Error: "deprecated V1 endpoint"

**Penyebab:** Arbiscan Sepolia masih menggunakan deprecated API V1 untuk Stylus verification.

**Error message:**
```
Error: You are using a deprecated V1 endpoint,
switch to Etherscan API V2 using https://docs.etherscan.io/v2-migration
```

**Ini BUKAN kesalahan Anda!** Ini adalah bug dari Arbiscan Sepolia yang belum migrate ke API V2.

**Solusi - Command Line Verification:**

Gunakan `cargo stylus verify` untuk verify contract secara lokal:

```bash
# Verify contract deployment
cargo stylus verify \
  --deployment-tx YOUR_DEPLOYMENT_TX_HASH \
  --endpoint https://sepolia-rollup.arbitrum.io/rpc \
  --no-verify

# Expected output:
# Verification successful
# project metadata hash: d5d1e2b15036069b7c500c378ca15809d61e4e1d4354dce29b9990e7ea9a663a
```

**Deployment TX Hash** bisa dilihat dari output `cargo stylus deploy`:
```
deployment tx hash: 0xbe550788c54bbf9f1784062fc2369251e5235d1b43588016ff386752d742b44c
```

**Apa arti "Verification successful"?**
- ✅ Deployed contract cocok 100% dengan source code lokal
- ✅ Contract reproducible dan bisa diverifikasi
- ✅ Deployment authentic tanpa tampering

:::info Status Arbiscan Verification
Per Januari 2026:
- ❌ **Arbiscan Sepolia** - Broken (API V1 deprecated)
- ✅ **Arbiscan One (Mainnet)** - Working (API V2)
- ✅ **Command Line Verification** - Always works

Untuk testnet, gunakan command line verification. Untuk mainnet production, web verification di Arbiscan One sudah working.
:::

---

## 📊 7. Perbandingan Rust vs Solidity

Mari bandingkan Counter Contract di Rust (Stylus) vs Solidity:

**Rust (Stylus):**
```rust
#[storage]
pub struct Counter {
    count: StorageU256,
}

#[public]
impl Counter {
    pub fn increment(&mut self) {
        let current = self.count.get();
        self.count.set(current + U256::from(1));
    }
}
```

**Solidity:**
```solidity
contract Counter {
    uint256 public count;

    function increment() public {
        count++;
    }
}
```

**Perbedaan:**

| Aspek | Rust (Stylus) | Solidity |
|-------|---------------|----------|
| **Syntax** | Lebih verbose | Lebih ringkas |
| **Type Safety** | Sangat ketat (compile-time) | Kurang ketat |
| **Gas Cost** | **10x lebih murah** untuk logic kompleks | Standard |
| **Performance** | **10-100x lebih cepat** | Standard |
| **Learning Curve** | Lebih tinggi | Lebih rendah |
| **Memory Safety** | Guaranteed by compiler | Manual checks |

**Kapan pakai Stylus:**
- ✅ Logic kompleks (game, ML, crypto)
- ✅ Butuh performance tinggi
- ✅ Butuh gas optimization maksimal

**Kapan pakai Solidity:**
- ✅ Contract sederhana (token, NFT)
- ✅ Tim sudah familiar Solidity
- ✅ Banyak library existing

---

## 🎓 Checklist Pembelajaran

Pastikan Anda memahami:

- [ ] Cara install dan setup cargo-stylus
- [ ] Struktur project Stylus (Cargo.toml, src/lib.rs)
- [ ] **Struktur lengkap Cargo.toml** (package, dependencies, lib)
- [ ] **Versi dependencies yang benar** (stylus-sdk 0.10.0, alloy 1.0.1)
- [ ] Attribute `#[storage]`, `#[entrypoint]`, `#[public]`
- [ ] Perbedaan `StorageU256` dan `U256`
- [ ] Method dengan `&self` (view) vs `&mut self` (state-changing)
- [ ] Compile project ke WASM
- [ ] Deploy contract ke Arbitrum Sepolia
- [ ] Interact dengan contract menggunakan cast/ethers

---

## 🔍 Quick Reference: Verification Methods

### Comparison Table

| Method | Status | Use Case | Complexity | Public Visibility |
|--------|--------|----------|------------|-------------------|
| **API V2** | ✅ Working | Production verification | ⭐⭐ Medium | ✅ Yes (Arbiscan) |
| **Command Line** | ✅ Working | Local verification | ⭐ Easy | ❌ No (local only) |
| **Web Interface** | ❌ Broken | N/A (deprecated) | ⭐⭐⭐ Easy | Would be ✅ |

### When to Use Each Method

**API V2 (Recommended for Production):**
- ✅ Want contract visible on Arbiscan
- ✅ Need public verification
- ✅ Have GitHub public repo
- ✅ Want users to interact via Arbiscan UI

**Command Line (Good for Testing):**
- ✅ Want to prove reproducibility
- ✅ Local verification only
- ✅ Don't need Arbiscan visibility
- ✅ Quick verification check

**Web Interface:**
- ❌ Currently broken (API V1 deprecated)
- ⏳ Wait for Arbiscan Sepolia update

### API V2 Quick Command

```bash
# One-liner verification (replace values!)
curl -X POST "https://api.arbiscan.io/api" \
  -d "chainid=421614" \
  -d "module=contract" \
  -d "action=verifysourcecode" \
  -d "apikey=YOUR_API_KEY" \
  -d "codeformat=stylus" \
  -d "sourceCode=https://github.com/YOUR_USERNAME/YOUR_REPO" \
  -d "contractaddress=YOUR_CONTRACT_ADDRESS" \
  -d "contractname=YOUR_CONTRACT_NAME" \
  -d "compilerversion=stylus:0.6.3" \
  -d "licenseType=3"
```

### CLI Quick Command

```bash
# One-liner local verification
cargo stylus verify \
  --deployment-tx YOUR_TX_HASH \
  --endpoint https://sepolia-rollup.arbitrum.io/rpc \
  --no-verify
```

---

## 📦 Quick Reference: Project Template

### Cargo.toml

Simpan template ini untuk semua project Stylus Anda:

```toml
[package]
name = "your-project-name"    # Ganti dengan nama project
version = "0.1.0"
edition = "2021"

[dependencies]
alloy-primitives = "=0.8.20"  # ✅ EXACT version (proven working)
alloy-sol-types = "=0.8.20"   # ✅ EXACT version (proven working)
stylus-sdk = "=0.9.0"         # ✅ STABLE version (Jan 2026)
hex = { version = "0.4", default-features = false }
ruint = "=1.15.0"             # ✅ Lock version to avoid conflicts

[dev-dependencies]
tokio = { version = "1", features = ["full"], default-features = false }
ethers = "2"

[features]
export-abi = ["stylus-sdk/export-abi"]
default = ["mini-alloc"]
mini-alloc = []

[lib]
crate-type = ["lib", "cdylib"] # ✅ Required for WASM

[profile.release]
codegen-units = 1              # Optimize for size
opt-level = 3                  # Optimization level
lto = true                     # Link-time optimization
panic = "abort"                # Reduce binary size
strip = true                   # Strip symbols
```

**Catatan Penting:**
- ✅ **GUNAKAN** exact versions (`=`) untuk stability
- ✅ **GUNAKAN** stylus-sdk 0.9.0 (stable), bukan 0.10.0 (ada known issues)
- ❌ **JANGAN** lupakan section `[package]`
- ❌ **JANGAN** lupakan section `[lib]` dengan `crate-type = ["lib", "cdylib"]`
- ✅ **SELALU** lock `ruint = "=1.15.0"` untuk avoid version conflicts

---

### src/lib.rs (Template Minimal)

```rust
#![cfg_attr(not(any(test, feature = "export-abi")), no_main)]
#![cfg_attr(not(any(test, feature = "export-abi")), no_std)]
extern crate alloc;

use alloc::vec;
use alloc::vec::Vec;
use stylus_sdk::prelude::*;
use stylus_sdk::storage::StorageU256;
use stylus_sdk::alloy_primitives::U256;

#[storage]
#[entrypoint]
pub struct YourContract {
    // Storage variables here
}

#[public]
impl YourContract {
    // Public functions here
}
```

---

### src/main.rs (Required untuk ABI Export)

```rust
#![cfg_attr(not(any(test, feature = "export-abi")), no_main)]

#[cfg(not(any(test, feature = "export-abi")))]
#[no_mangle]
pub extern "C" fn main() {}

#[cfg(feature = "export-abi")]
fn main() {
    your_project_name::print_from_args();
}
```

:::warning Project Name
Ganti `your_project_name` dengan nama project Anda di `Cargo.toml` (field `name`).

Contoh: Jika `name = "my-counter"`, maka gunakan `my_counter::print_from_args()`
(ganti `-` dengan `_`)
:::

---

## 📝 Assignment

<div style={{backgroundColor: '#fef3c7', padding: '20px', borderRadius: '10px', marginBottom: '20px', border: '2px solid #f59e0b'}}>
  <h3 style={{color: '#92400e', marginTop: 0}}>🎯 Tugas: Deploy Counter Sendiri</h3>

**Requirements:**

1. Setup Stylus project bernama `my-first-counter`

:::tip Template Cargo.toml
Gunakan template lengkap ini untuk `Cargo.toml`:
```toml
[package]
name = "my-first-counter"
version = "0.1.0"
edition = "2021"

[dependencies]
alloy-primitives = "=0.8.20"
alloy-sol-types = "=0.8.20"
stylus-sdk = "=0.9.0"
hex = { version = "0.4", default-features = false }
ruint = "=1.15.0"

[dev-dependencies]
tokio = { version = "1", features = ["full"], default-features = false }
ethers = "2"

[features]
export-abi = ["stylus-sdk/export-abi"]
default = ["mini-alloc"]
mini-alloc = []

[lib]
crate-type = ["lib", "cdylib"]

[profile.release]
codegen-units = 1
opt-level = 3
lto = true
panic = "abort"
strip = true
```
:::

2. Buat Counter contract dengan 4 fungsi:
   - `increment()` - tambah 1
   - `decrement()` - kurang 1 (jangan sampai underflow!)
   - `get_count()` - baca nilai
   - `add(amount: U256)` - tambah sejumlah amount
3. Deploy ke Arbitrum Sepolia
4. Interact minimal 5 kali (increment, add, decrement, dll)
5. Screenshot transaksi di Arbiscan

**Deliverables:**
- Link GitHub repository dengan code
- Contract address di Sepolia
- Screenshot Arbiscan dengan minimal 5 transaksi
- Submit ke HackQuest platform

**Deadline:** 3 Februari 2026, 23:59 WIB
</div>

---

## 🔗 Resources & Links

### Official Documentation (Updated 2026)
- [Arbitrum Stylus Docs](https://docs.arbitrum.io/stylus/gentle-introduction) - Getting started guide
- [Stylus Quickstart](https://docs.arbitrum.io/stylus/stylus-quickstart) - Official quickstart
- [Stylus Rust SDK Guide](https://docs.arbitrum.io/stylus/reference/rust-sdk-guide) - Advanced features
- [Using Stylus CLI](https://docs.arbitrum.io/stylus/using-cli) - CLI reference

### GitHub Repositories
- [cargo-stylus](https://github.com/OffchainLabs/cargo-stylus) - Latest releases & changelog
- [stylus-sdk-rs](https://github.com/OffchainLabs/stylus-sdk-rs) - SDK source code
- [awesome-stylus](https://github.com/OffchainLabs/awesome-stylus) - Curated examples

### Package Registries
- [cargo-stylus on crates.io](https://crates.io/crates/cargo-stylus) - Latest version info
- [stylus-sdk on crates.io](https://crates.io/crates/stylus-sdk) - SDK versions

---

## ⏭️ Next Steps

Setelah menguasai Counter Contract, lanjut ke:

1. **Storage Patterns** - StorageMap, StorageVec, nested storage
2. **Events & Logging** - Emit events dari Rust
3. **ERC-20 Token** - Build token standard dengan Rust
4. **External Calls** - Panggil Solidity contract dari Rust

<div style={{backgroundColor: '#dcfce7', padding: '20px', borderRadius: '10px', marginTop: '20px', border: '2px solid #16a34a'}}>
  <strong>🎉 Selamat!</strong> Anda sudah berhasil membuat, deploy, dan interact dengan Stylus smart contract pertama! Next step adalah buat contract yang lebih kompleks. 💪
</div>

---

## 📊 Deployment Success Example

Berikut adalah contoh successful deployment dari workshop participant:

**Contract Details:**
- **Contract Address**: [`0x95597662d6306b6591f33b966a1a6d2843638288`](https://sepolia.arbiscan.io/address/0x95597662d6306b6591f33b966a1a6d2843638288)
- **Network**: Arbitrum Sepolia Testnet
- **Contract Size**: 4.8 KB (4831 bytes)
- **Deployment Cost**: ~0.000067 ETH
- **Status**: ✅ Successfully Activated

**Verification:**
```bash
# View on Arbiscan
https://sepolia.arbiscan.io/address/0x95597662d6306b6591f33b966a1a6d2843638288

# Interact via cast
cast call 0x95597662d6306b6591f33b966a1a6d2843638288 \
  "getCount()(uint256)" \
  --rpc-url https://sepolia-rollup.arbitrum.io/rpc
```

:::success Workshop Achievement
Contract ini adalah hasil dari workshop Townhall Session 2 (29 Januari 2026). Semua peserta workshop berhasil deploy Counter Contract mereka ke Arbitrum Sepolia! 🚀
:::

---

**Keep Building! 🦀⚡**
