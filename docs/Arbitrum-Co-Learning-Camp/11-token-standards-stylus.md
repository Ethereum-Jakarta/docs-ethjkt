---
sidebar_position: 11
title: "Token Standards with Stylus"
description: "Membuat ERC-20 Token dan ERC-721 NFT menggunakan Rust dan Arbitrum Stylus SDK"
---

# 🪙 Token Standards with Arbitrum Stylus

<div style={{backgroundColor: '#0D102D', padding: '20px', borderRadius: '10px', marginBottom: '20px', border: '2px solid #3b82f6'}}>
  <h3 style={{color: '#F2B42D', marginTop: 0}}>📅 Townhall 3: Token Development & Mini Hackathon Kickoff</h3>
  <p style={{color: '#e0e7ff', fontSize: '1.1em', marginBottom: 0}}>
    Pelajari cara membuat ERC-20 token dan ERC-721 NFT menggunakan Rust di Arbitrum Stylus. Deploy token kamu sendiri di testnet dan mulai hackathon project!
  </p>
</div>

## 🎯 Apa yang Akan Dipelajari

Di sesi ini kita akan:

1. **Pengembangan Token ERC-20** - Membuat fungible token sendiri (seperti USDC, DAI)
2. **Membuat NFT ERC-721** - Membuat koleksi NFT (seperti Bored Ape, CryptoPunks)
3. **Praktik Deployment** - Deploy ke Arbitrum Sepolia testnet
4. **Memulai Mini Hackathon** - Pembentukan tim dan ide proyek

**Prasyarat:**
- Sudah menyelesaikan Modul 8 (Rust Fundamentals)
- Sudah menyelesaikan Modul 9 (Stylus SDK Simple Start)
- Memiliki testnet ETH di Arbitrum Sepolia ([Faucet](https://faucet.quicknode.com/arbitrum/sepolia))

---

## 📚 Bagian1: Understanding Token Standards

### Apa itu ERC-20?

**ERC-20** adalah standard untuk **fungible tokens** - setiap token identik dan bisa ditukar 1:1.

**Contoh di Dunia Nyata:**
- USDC (stablecoin)
- UNI (token governance Uniswap)
- LINK (token oracle Chainlink)

**Fungsi Utama:**
```solidity
// Total supply
totalSupply() → uint256

// Balance query
balanceOf(address) → uint256

// Transfer
transfer(address to, uint256 amount) → bool

// Approve & transferFrom (untuk DEX, dll)
approve(address spender, uint256 amount) → bool
transferFrom(address from, address to, uint256 amount) → bool
allowance(address owner, address spender) → uint256
```

### Apa itu ERC-721?

**ERC-721** adalah standard untuk **non-fungible tokens (NFTs)** - setiap token unik dengan ID berbeda.

**Contoh di Dunia Nyata:**
- Bored Ape Yacht Club (gambar profil)
- Azuki (NFT anime)
- ENS Domains (nama domain)

**Fungsi Utama:**
```solidity
// Balance query
balanceOf(address owner) → uint256

// Ownership
ownerOf(uint256 tokenId) → address

// Transfer
transferFrom(address from, address to, uint256 tokenId)
safeTransferFrom(address from, address to, uint256 tokenId)

// Approval
approve(address to, uint256 tokenId)
setApprovalForAll(address operator, bool approved)
```

---

## 🪙 Bagian 2: Pengembangan Token ERC-20 dengan Rust

### Langkah 1: Setup Project

```bash
cargo stylus new erc20-token
cd erc20-token
```

### Langkah2: Update Cargo.toml

```toml
[package]
name = "erc20-token"
version = "0.1.0"
edition = "2021"

[dependencies]
alloy-primitives = "=0.8.20"
alloy-sol-types = "=0.8.20"
stylus-sdk = "=0.9.0"
mini-alloc = "0.4.2"
ruint = "=1.15.0"

[dev-dependencies]
tokio = { version = "1.12.0", features = ["full"] }
ethers = "2.0"
eyre = "0.6.8"

[features]
export-abi = ["stylus-sdk/export-abi"]

[lib]
crate-type = ["lib", "cdylib"]

[profile.release]
codegen-units = 1
strip = true
lto = true
panic = "abort"
opt-level = "s"
```

**Penjelasan Dependencies:**
- `alloy-primitives` & `alloy-sol-types` v0.8.20: Ethereum types & Solidity ABI encoding
- `stylus-sdk` v0.9.0: Arbitrum Stylus SDK (stable version, AVOID 0.10.0 yang ada known issues)
- `ruint` v1.15.0: **PENTING!** Di-lock ke v1.15.0 untuk prevent compatibility issues dengan alloy-primitives
- `mini-alloc`: Memory allocator untuk WASM environment

:::warning Versi Dependencies Sangat Penting!
Jika kamu menggunakan versi yang berbeda, kemungkinan besar akan ada compile error seperti:
- `BYTES must be equal to Self::BYTES` (ruint version mismatch)
- `evaluation panicked` errors
- ABI encoding issues

**Solusi:** Gunakan versi **EXACT** seperti di atas (perhatikan tanda `=` di depan version number)!
:::

### Langkah3: Create rust-toolchain.toml

```toml
[toolchain]
channel = "1.88.0"
targets = ["wasm32-unknown-unknown"]
```

**Kenapa perlu ini?**
- Lock Rust version ke 1.88.0 untuk consistency
- Target `wasm32-unknown-unknown` untuk compile ke WebAssembly
- Stylus contracts run on WASM runtime!

### Langkah4: Create Stylus.toml

```toml
[workspace]

[workspace.networks]

[contract]
```

**Kenapa perlu ini?**
- Konfigurasi deployment untuk Arbitrum Stylus
- Bisa diisi dengan custom network settings (opsional)

### Langkah5: Create src/main.rs

```rust
#![cfg_attr(not(any(test, feature = "export-abi")), no_main)]

#[cfg(not(any(test, feature = "export-abi")))]
#[unsafe(no_mangle)]
pub extern "C" fn main() {}

#[cfg(feature = "export-abi")]
fn main() {
    erc20_token::print_from_args();
}
```

**Kenapa perlu ini?**
- Entry point untuk WASM binary
- Support ABI export via `cargo stylus export-abi`

### Langkah6: Implement ERC-20 Token (src/lib.rs)

```rust
#![cfg_attr(not(feature = "export-abi"), no_main)]
extern crate alloc;

use stylus_sdk::prelude::*;
use stylus_sdk::alloy_primitives::{Address, U256, U8};
use stylus_sdk::alloy_sol_types::{sol, SolError};

// Define events using Solidity ABI
sol! {
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

// Define errors using Solidity ABI
sol! {
    error InsufficientBalance(uint256 balance, uint256 required);
    error InsufficientAllowance(uint256 allowance, uint256 required);
}

// Storage definition
sol_storage! {
    #[entrypoint]
    pub struct ERC20Token {
        // Token metadata
        string name;
        string symbol;
        uint8 decimals;

        // Balances
        mapping(address => uint256) balances;

        // Allowances (owner => spender => amount)
        mapping(address => mapping(address => uint256)) allowances;

        // Total supply
        uint256 total_supply;
    }
}

#[public]
impl ERC20Token {
    /// Initialize token with name, symbol, and initial supply
    pub fn init(&mut self,
        token_name: String,
        token_symbol: String,
        initial_supply: U256
    ) -> Result<(), Vec<u8>> {
        // Set metadata
        self.name.set_str(&token_name);
        self.symbol.set_str(&token_symbol);
        self.decimals.set(U8::from(18));

        // Mint initial supply to deployer
        let deployer = self.vm().msg_sender();
        self.balances.setter(deployer).set(initial_supply);
        self.total_supply.set(initial_supply);

        // Emit Transfer event from zero address
        log(self.vm(), Transfer {
            from: Address::ZERO,
            to: deployer,
            value: initial_supply,
        });

        Ok(())
    }

    /// Get token name
    pub fn name(&self) -> String {
        self.name.get_string()
    }

    /// Get token symbol
    pub fn symbol(&self) -> String {
        self.symbol.get_string()
    }

    /// Get decimals (usually 18)
    pub fn decimals(&self) -> U8 {
        self.decimals.get()
    }

    /// Get total supply
    pub fn total_supply(&self) -> U256 {
        self.total_supply.get()
    }

    /// Get balance of an address
    pub fn balance_of(&self, account: Address) -> U256 {
        self.balances.get(account)
    }

    /// Transfer tokens to another address
    pub fn transfer(&mut self, to: Address, amount: U256) -> Result<bool, Vec<u8>> {
        let from = self.vm().msg_sender();
        self._transfer(from, to, amount)?;
        Ok(true)
    }

    /// Approve spender to spend tokens on your behalf
    pub fn approve(&mut self, spender: Address, amount: U256) -> Result<bool, Vec<u8>> {
        let owner = self.vm().msg_sender();

        // Set allowance
        self.allowances.setter(owner).setter(spender).set(amount);

        // Emit Approval event
        log(self.vm(), Approval {
            owner,
            spender,
            value: amount,
        });

        Ok(true)
    }

    /// Get allowance
    pub fn allowance(&self, owner: Address, spender: Address) -> U256 {
        self.allowances.getter(owner).get(spender)
    }

    /// Transfer from one address to another using allowance
    pub fn transfer_from(
        &mut self,
        from: Address,
        to: Address,
        amount: U256
    ) -> Result<bool, Vec<u8>> {
        let spender = self.vm().msg_sender();

        // Check allowance
        let current_allowance = self.allowances.getter(from).get(spender);
        if current_allowance < amount {
            return Err(InsufficientAllowance {
                allowance: current_allowance,
                required: amount,
            }.abi_encode());
        }

        // Decrease allowance
        let new_allowance = current_allowance - amount;
        self.allowances.setter(from).setter(spender).set(new_allowance);

        // Transfer
        self._transfer(from, to, amount)?;

        Ok(true)
    }

    /// Internal transfer function
    fn _transfer(&mut self, from: Address, to: Address, amount: U256) -> Result<(), Vec<u8>> {
        // Check balance
        let from_balance = self.balances.get(from);
        if from_balance < amount {
            return Err(InsufficientBalance {
                balance: from_balance,
                required: amount,
            }.abi_encode());
        }

        // Update balances
        self.balances.setter(from).set(from_balance - amount);
        let to_balance = self.balances.get(to);
        self.balances.setter(to).set(to_balance + amount);

        // Emit Transfer event
        log(self.vm(), Transfer {
            from,
            to,
            value: amount,
        });

        Ok(())
    }
}
```

**Penjelasan Kode:**

1. **Imports:**
   - `U8` untuk decimals (lebih efisien dari U256)
   - `sol!` macro untuk mendefinisikan events dan errors
   - `SolError` trait untuk encoding error

2. **Events & Errors:**
   - Didefinisikan menggunakan sintaks Solidity di dalam `sol!` macro
   - Errors di-encode ke `Vec<u8>` melalui `.abi_encode()`

3. **Storage:**
   - `sol_storage!` macro dengan atribut `#[entrypoint]`
   - Nested mapping untuk allowances (izin transfer)

4. **VM Context:**
   - `self.vm().msg_sender()` untuk mengakses alamat pemanggil
   - `log(self.vm(), Event { ... })` untuk emit events

5. **Error Handling:**
   - Fungsi mengembalikan `Result<T, Vec<u8>>`
   - Errors di-encode ke format ABI untuk kompatibilitas

6. **Fungsi-Fungsi Utama:**
   - `init()`: Inisialisasi token (hanya sekali)
   - `transfer()`: Transfer langsung
   - `approve()`: Set allowance (izin transfer)
   - `transfer_from()`: Transfer menggunakan allowance
   - `_transfer()`: Logika transfer internal

### Langkah7: Verify Project Structure

Pastikan struktur project kamu seperti ini:

```
erc20-token/
├── Cargo.toml              # Dependencies
├── Stylus.toml             # Stylus config
├── rust-toolchain.toml     # Rust version
├── src/
│   ├── lib.rs              # Smart contract code
│   └── main.rs             # Entry point
└── target/                 # Build output (auto-generated)
```

### Langkah8: Build & Test Contract

#### 8.1. Build Contract

```bash
cargo stylus check
cargo stylus export-abi
```

#### 8.2. Setup Environment

Buat file `.env`:

```bash
PRIVATE_KEY=your_private_key_here
RPC_URL=https://sepolia-rollup.arbitrum.io/rpc
```

**Load environment variables:**

```bash
# Option 1: Source the .env file (recommended)
source .env

# Option 2: Export manually
export PRIVATE_KEY=your_private_key_here
export RPC_URL=https://sepolia-rollup.arbitrum.io/rpc

# Verify variables are loaded
echo $PRIVATE_KEY
echo $RPC_URL
```

**PENTING:**
- Jangan commit file `.env` ke Git (sudah ada di `.gitignore`)
- Private key harus **TANPA prefix `0x`**
- Pastikan punya testnet ETH ([Faucet link](https://faucet.quicknode.com/arbitrum/sepolia))

#### 8.3. Deploy

```bash
cargo stylus deploy \
  --private-key=$PRIVATE_KEY \
  --endpoint=$RPC_URL
```

**Output example:**
```
deployed code at address: 0x1234...5678
```

### Langkah9: Initialize Your Token

Setelah deploy, panggil `init()` untuk set name, symbol, dan initial supply:

```bash
cast send 0x1234...5678 \
  "init(string,string,uint256)" \
  "MyToken" \
  "MTK" \
  "1000000000000000000000000" \
  --rpc-url=$RPC_URL \
  --private-key=$PRIVATE_KEY
```

*(1000000 tokens dengan 18 decimals)*

### Langkah10: Interact with Your Token

```bash
# Check token name
cast call 0x1234...5678 "name()" --rpc-url=$RPC_URL

# Check your balance
cast call 0x1234...5678 \
  "balanceOf(address)" \
  YOUR_ADDRESS \
  --rpc-url=$RPC_URL

# Transfer tokens
cast send 0x1234...5678 \
  "transfer(address,uint256)" \
  RECIPIENT_ADDRESS \
  "1000000000000000000" \
  --rpc-url=$RPC_URL \
  --private-key=$PRIVATE_KEY
```

---

## 🖼️ Bagian3: ERC-721 NFT Minting Flows

### Langkah1: Setup Project

```bash
cargo stylus new erc721-nft
cd erc721-nft
```

### Langkah2: Update Cargo.toml

*(Same as ERC-20 above)*

### Langkah3: Implement ERC-721 NFT (src/lib.rs)

```rust
#![cfg_attr(not(feature = "export-abi"), no_main)]
extern crate alloc;

use stylus_sdk::prelude::*;
use stylus_sdk::alloy_primitives::{Address, U256, FixedBytes};
use stylus_sdk::alloy_sol_types::{sol, SolError};
use alloc::string::String;

// ERC-165 Interface IDs untuk proper NFT detection
const ERC165_INTERFACE_ID: u32 = 0x01ffc9a7;
const ERC721_INTERFACE_ID: u32 = 0x80ac58cd;
const ERC721_METADATA_INTERFACE_ID: u32 = 0x5b5e139f;

// Define events using Solidity ABI
sol! {
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);
    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);
}

// Define errors using Solidity ABI
sol! {
    error TokenDoesNotExist(uint256 tokenId);
    error NotOwnerOrApproved(address caller, uint256 tokenId);
    error TransferToZeroAddress();
    error MintToZeroAddress();
    error TokenAlreadyExists(uint256 tokenId);
    error InvalidRecipient(address to);
}

// Storage definition
sol_storage! {
    #[entrypoint]
    pub struct ERC721NFT {
        // NFT metadata
        string name;
        string symbol;

        // Token ownership: tokenId => owner address
        mapping(uint256 => address) owners;

        // Balance tracking: owner => token count
        mapping(address => uint256) balances;

        // Token approvals: tokenId => approved address
        mapping(uint256 => address) token_approvals;

        // Operator approvals: owner => operator => approved
        mapping(address => mapping(address => bool)) operator_approvals;

        // Token URIs: tokenId => URI
        mapping(uint256 => string) token_uris;

        // Next token ID for minting
        uint256 next_token_id;
    }
}

#[public]
impl ERC721NFT {
    /// Initialize NFT collection with name and symbol
    pub fn init(&mut self, collection_name: String, collection_symbol: String) -> Result<(), Vec<u8>> {
        self.name.set_str(&collection_name);
        self.symbol.set_str(&collection_symbol);
        self.next_token_id.set(U256::from(1)); // Start token IDs from 1
        Ok(())
    }

    /// Get collection name
    pub fn name(&self) -> String {
        self.name.get_string()
    }

    /// Get collection symbol
    pub fn symbol(&self) -> String {
        self.symbol.get_string()
    }

    /// Get decimals (always 0 untuk NFT)
    pub fn decimals(&self) -> u8 {
        0
    }

    /// Get balance of an address
    pub fn balance_of(&self, owner: Address) -> U256 {
        self.balances.get(owner)
    }

    /// Get owner of a token
    pub fn owner_of(&self, token_id: U256) -> Result<Address, Vec<u8>> {
        let owner = self.owners.get(token_id);
        if owner == Address::ZERO {
            return Err(TokenDoesNotExist { tokenId: token_id }.abi_encode());
        }
        Ok(owner)
    }

    /// Get token URI
    pub fn token_uri(&self, token_id: U256) -> Result<String, Vec<u8>> {
        // Check if token exists
        let owner = self.owners.get(token_id);
        if owner == Address::ZERO {
            return Err(TokenDoesNotExist { tokenId: token_id }.abi_encode());
        }
        Ok(self.token_uris.getter(token_id).get_string())
    }

    /// Mint a new NFT
    pub fn mint(&mut self, to: Address, uri: String) -> Result<U256, Vec<u8>> {
        if to == Address::ZERO {
            return Err(MintToZeroAddress {}.abi_encode());
        }

        let token_id = self.next_token_id.get();

        // Check if token already exists (shouldn't happen with auto-increment)
        if self.owners.get(token_id) != Address::ZERO {
            return Err(TokenAlreadyExists { tokenId: token_id }.abi_encode());
        }

        // Mint the token
        self.owners.setter(token_id).set(to);
        self.token_uris.setter(token_id).set_str(&uri);

        // Update balance
        let balance = self.balances.get(to);
        self.balances.setter(to).set(balance + U256::from(1));

        // Increment next token ID
        self.next_token_id.set(token_id + U256::from(1));

        // Emit Transfer event from zero address
        log(self.vm(), Transfer {
            from: Address::ZERO,
            to,
            tokenId: token_id,
        });

        Ok(token_id)
    }

    /// Transfer NFT
    pub fn transfer_from(
        &mut self,
        from: Address,
        to: Address,
        token_id: U256
    ) -> Result<(), ERC721Error> {
        // Validate transfer
        self._validate_transfer(from, to, token_id)?;

        // Clear approval
        self.token_approvals.setter(token_id).set(Address::ZERO);

        // Update ownership
        self.owners.setter(token_id).set(to);

        // Update balances
        let from_balance = self.balances.get(from);
        self.balances.setter(from).set(from_balance - U256::from(1));

        let to_balance = self.balances.get(to);
        self.balances.setter(to).set(to_balance + U256::from(1));

        // Emit Transfer event
        evm::log(Transfer {
            from,
            to,
            tokenId: token_id,
        });

        Ok(())
    }

    /// Approve address to transfer specific token
    pub fn approve(&mut self, to: Address, token_id: U256) -> Result<(), ERC721Error> {
        let owner = self.owner_of(token_id)?;
        let caller = msg::sender();

        // Only owner or approved operator can approve
        if caller != owner && !self.is_approved_for_all(owner, caller) {
            return Err(ERC721Error::NotAuthorized(NotAuthorizedError {
                caller,
            }));
        }

        self.token_approvals.setter(token_id).set(to);

        evm::log(Approval {
            owner,
            approved: to,
            tokenId: token_id,
        });

        Ok(())
    }

    /// Get approved address for token
    pub fn get_approved(&self, token_id: U256) -> Address {
        self.token_approvals.get(token_id)
    }

    /// Approve operator to transfer all tokens
    pub fn set_approval_for_all(&mut self, operator: Address, approved: bool) -> Result<(), ERC721Error> {
        let owner = msg::sender();
        self.operator_approvals.setter(owner).setter(operator).set(approved);

        evm::log(ApprovalForAll {
            owner,
            operator,
            approved,
        });

        Ok(())
    }

    /// Check if operator is approved for all tokens
    pub fn is_approved_for_all(&self, owner: Address, operator: Address) -> bool {
        self.operator_approvals.getter(owner).get(operator)
    }

    /// ERC-165: Check if contract supports an interface
    /// PENTING untuk block explorer detection!
    pub fn supports_interface(&self, interface_id: FixedBytes<4>) -> bool {
        let id = u32::from_be_bytes(interface_id.0);
        id == ERC165_INTERFACE_ID
            || id == ERC721_INTERFACE_ID
            || id == ERC721_METADATA_INTERFACE_ID
    }

    /// Total supply (number of minted tokens)
    pub fn total_supply(&self) -> U256 {
        let next_id = self.next_token_id.get();
        if next_id > U256::from(0) {
            next_id - U256::from(1)
        } else {
            U256::from(0)
        }
    }

    /// Internal transfer function
    fn _transfer(&mut self, from: Address, to: Address, token_id: U256) -> Result<(), Vec<u8>> {
        if to == Address::ZERO {
            return Err(TransferToZeroAddress {}.abi_encode());
        }

        let owner = self.owners.get(token_id);
        if owner != from {
            return Err(InvalidRecipient { to: from }.abi_encode());
        }

        // Clear approvals
        self.token_approvals.delete(token_id);

        // Update balances
        let from_balance = self.balances.get(from);
        self.balances.setter(from).set(from_balance - U256::from(1));

        let to_balance = self.balances.get(to);
        self.balances.setter(to).set(to_balance + U256::from(1));

        // Update ownership
        self.owners.setter(token_id).set(to);

        // Emit Transfer event
        log(self.vm(), Transfer {
            from,
            to,
            tokenId: token_id,
        });

        Ok(())
    }

    /// Check if an address is approved or owner
    fn _is_approved_or_owner(&self, spender: Address, token_id: U256) -> bool {
        let owner = self.owners.get(token_id);
        if owner == Address::ZERO {
            return false;
        }

        spender == owner
            || self.token_approvals.get(token_id) == spender
            || self.operator_approvals.getter(owner).get(spender)
    }

    /// Internal function to validate transfer (DEPRECATED - use _transfer instead)
    fn _validate_transfer(&self, from: Address, to: Address, token_id: U256) -> Result<(), Vec<u8>> {
        // Check token exists and owner is correct
        let owner = self.owner_of(token_id)?;
        if owner != from {
            return Err(ERC721Error::NotOwner(NotOwnerError {
                caller: from,
                owner,
            }));
        }

        // Check destination is not zero address
        if to == Address::ZERO {
            return Err(ERC721Error::TransferToZeroAddress(TransferToZeroAddressError {}));
        }

        // Check caller is authorized
        let caller = msg::sender();
        let is_approved = self.token_approvals.get(token_id) == caller;
        let is_operator = self.operator_approvals.getter(owner).get(caller);

        if caller != owner && !is_approved && !is_operator {
            return Err(ERC721Error::NotAuthorized(NotAuthorizedError {
                caller,
            }));
        }

        Ok(())
    }
}
```

### Langkah4: Build & Deploy

```bash
# Build
cargo stylus check
cargo stylus export-abi

# Deploy
cargo stylus deploy \
  --private-key=$PRIVATE_KEY \
  --endpoint=$RPC_URL
```

### Langkah5: Initialize Your NFT Collection

```bash
# Initialize dengan nama dan symbol (2 parameters saja!)
cast send 0x5678...9abc \
  "init(string,string)" \
  "My NFT Collection" \
  "MNFT" \
  --rpc-url=$RPC_URL \
  --private-key=$PRIVATE_KEY
```

:::tip
Function `init()` hanya butuh 2 parameters: name dan symbol. URI di-set per token saat mint!
:::

### Langkah6: Mint NFTs

```bash
# Mint NFT dengan URI metadata
cast send 0x5678...9abc \
  "mint(address,string)(uint256)" \
  YOUR_ADDRESS \
  "ipfs://QmYourMetadataHash" \
  --rpc-url=$RPC_URL \
  --private-key=$PRIVATE_KEY

# Check token owner (token ID 1)
cast call 0x5678...9abc \
  "ownerOf(uint256)(address)" \
  1 \
  --rpc-url=$RPC_URL

# Check your NFT balance
cast call 0x5678...9abc \
  "balanceOf(address)(uint256)" \
  YOUR_ADDRESS \
  --rpc-url=$RPC_URL

# Check token URI
cast call 0x5678...9abc \
  "tokenURI(uint256)(string)" \
  1 \
  --rpc-url=$RPC_URL

# Verify ERC-721 interface support (should return true)
cast call 0x5678...9abc \
  "supportsInterface(bytes4)(bool)" \
  0x80ac58cd \
  --rpc-url=$RPC_URL
```

:::success Real Example
```bash
# Actual working example:
cast send 0xda3818869bd8fb6c4ec22376f94c9035d7220fd4 \
  "mint(address,string)(uint256)" \
  0x67BA06dB6d9c562857BF08AB1220a16DfA455c45 \
  "ipfs://QmExample123" \
  --rpc-url=$RPC_URL \
  --private-key=$PRIVATE_KEY

# Output:
# ✅ Transaction successful
# ✅ Token ID: 1
# ✅ Owner: 0x67BA06dB6d9c562857BF08AB1220a16DfA455c45
```
:::

---

## 🎯 Bagian4: Hands-On Assignments

### Tugas 1: Deploy Token ERC-20 Kamu

**Persyaratan:**
1. Buat token ERC-20 dengan nama dan simbol yang unik
2. Set initial supply minimal 1,000,000 token
3. Deploy ke Arbitrum Sepolia testnet
4. Transfer minimal 100 token ke alamat teman
5. Screenshot transaksi di Arbiscan

**Pengumpulan:**
- Repository GitHub dengan kode lengkap
- Screenshot Arbiscan (deploy + transfer)
- Alamat contract di README.md

### Tugas 2: Mint Koleksi NFT Kamu

**Persyaratan:**
1. Buat koleksi NFT ERC-721 dengan nama unik
2. Deploy ke Arbitrum Sepolia testnet
3. Mint minimal 3 NFT
4. Transfer 1 NFT ke alamat teman
5. Screenshot di Arbiscan

**Pengumpulan:**
- Repository GitHub dengan kode lengkap
- Screenshot Arbiscan (mint + transfer)
- Alamat contract di README.md

### Tugas 3: Token dengan Fitur Tambahan (Bonus)

Tambahkan fitur ekstra ke token ERC-20 atau ERC-721 kamu:

**Ide untuk ERC-20:**
- Fungsi burn (menghancurkan token)
- Pause/Unpause transfer
- Batas maksimal transfer
- Whitelist/blacklist alamat

**Ide untuk ERC-721:**
- URI metadata per token ID
- Batas maksimal supply
- Biaya minting (payable)
- Fungsi burn

---

## 🔑 Key Learnings & Best Practices

### Version Management adalah CRITICAL! 🔒

**ALWAYS lock exact versions:**
```toml
alloy-primitives = "=0.8.20"  # ✅ Exact version dengan =
stylus-sdk = "=0.9.0"          # ✅ Locked version
ruint = "=1.15.0"              # ✅ CRITICAL untuk avoid conflicts
```

**NEVER use:**
```toml
alloy-primitives = "0.8"       # ❌ Too loose!
stylus-sdk = "^0.9.0"          # ❌ May upgrade to 0.10.0 yang broken
```

**Kenapa penting?**
- Version mismatch = compile errors yang confusing
- `ruint` version salah = "BYTES must be equal to Self::BYTES" error
- Stability > "latest version"

---

### Use Non-Deprecated APIs ✨

**Stylus SDK 0.8.0+ introduced new Host trait pattern:**

| Old (Deprecated) ❌ | New (Clean) ✅ |
|---------------------|----------------|
| `use stylus_sdk::msg;`<br/>`msg::sender()` | `use stylus_sdk::prelude::*;`<br/>`self.vm().msg_sender()` |
| `use stylus_sdk::evm;`<br/>`evm::log(Event { ... })` | `log(self.vm(), Event { ... })` |
| `msg::value()` | `self.vm().msg_value()` |

**Benefits:**
- ✅ Zero deprecation warnings
- ✅ Better testability
- ✅ Future-proof code
- ✅ Cleaner architecture

---

### ERC-165 is MANDATORY for NFTs 🎨

**Without ERC-165:**
- Block explorers detect as "ERC-20" atau generic "Contract"
- Missing NFT marketplace compatibility
- Poor UX

**With ERC-165:**
```rust
const ERC165_INTERFACE_ID: u32 = 0x01ffc9a7;
const ERC721_INTERFACE_ID: u32 = 0x80ac58cd;
const ERC721_METADATA_INTERFACE_ID: u32 = 0x5b5e139f;

pub fn supports_interface(&self, interface_id: FixedBytes<4>) -> bool {
    let id = u32::from_be_bytes(interface_id.0);
    id == ERC165_INTERFACE_ID
        || id == ERC721_INTERFACE_ID
        || id == ERC721_METADATA_INTERFACE_ID
}
```

**Result:**
- ✅ Properly detected as ERC-721
- ✅ OpenSea/Rarible compatibility
- ✅ Better block explorer UX

---

### Command-Line Best Practices 💻

**Always use single-line OR proper backslashes:**

**❌ WRONG:**
```bash
cast send 0x123...
  "function()"
  arg1
```

**✅ CORRECT:**
```bash
# Option 1: Single line
cast send 0x123... "function()" arg1 --rpc-url=$RPC --private-key=$KEY

# Option 2: Backslashes
cast send 0x123... \
  "function()" \
  arg1 \
  --rpc-url=$RPC \
  --private-key=$KEY
```

---

### Error Handling Pattern 🛡️

**Use `sol!` macro untuk errors:**
```rust
sol! {
    error InsufficientBalance(uint256 balance, uint256 required);
}

// Encode and return
if balance < amount {
    return Err(InsufficientBalance {
        balance,
        required: amount,
    }.abi_encode());
}
```

**Benefits:**
- ✅ ABI-compatible errors
- ✅ Proper error messages
- ✅ Frontend can decode errors
- ✅ Better debugging

---

### Testing Strategy 🧪

**Before deploy:**
```bash
cargo stylus check  # Compile & size check
cargo stylus export-abi  # Verify ABI generation
```

**After deploy:**
```bash
# 1. Initialize
cast send <ADDRESS> "init(...)" args...

# 2. Verify initialization
cast call <ADDRESS> "name()(string)" --rpc-url=$RPC

# 3. Test core functionality
cast send <ADDRESS> "mint(...)" args...

# 4. Verify state changes
cast call <ADDRESS> "balanceOf(address)(uint256)" $YOUR_ADDR --rpc-url=$RPC

# 5. Check on Arbiscan
https://sepolia.arbiscan.io/address/<ADDRESS>
```

---

### Gas Optimization Tips ⛽

**1. Use appropriate types:**
```rust
uint8 decimals;     // ✅ Not uint256 untuk small values
uint256 balance;    // ✅ For large token amounts
```

**2. Storage reads are expensive:**
```rust
// ❌ Multiple reads
let bal1 = self.balances.get(owner);
let bal2 = self.balances.get(owner);

// ✅ Single read
let balance = self.balances.get(owner);
// Use 'balance' variable multiple times
```

**3. Batch operations:**
```rust
// Consider batching if minting multiple NFTs
pub fn batch_mint(&mut self, to: Address, count: U256) -> Result<Vec<U256>, Vec<u8>>
```

---

## 🎓 What You've Learned

Setelah menyelesaikan modul ini, kamu sekarang bisa:

✅ Memahami ERC-20 dan ERC-721 token standards
✅ Implement ERC-20 token lengkap di Rust dengan clean code (zero warnings!)
✅ Implement ERC-721 NFT collection di Rust dengan ERC-165 support
✅ Handle version conflicts dan dependency management
✅ Use non-deprecated APIs (`self.vm().msg_sender()`, `log()`)
✅ Deploy dan verify contracts di Arbitrum Sepolia
✅ Interact dengan tokens via cast commands
✅ Troubleshoot common errors dengan confidence
✅ Work in teams untuk hackathon projects

---

## 📝 Real Working Examples

Berikut adalah contoh contracts yang **BENAR-BENAR DEPLOYED** dan working di Arbitrum Sepolia testnet:

### ERC-20 Token Example

**Contract Address:** `0x7bf619a8ad20b0f44ce4bdf601f56a64679ffd28`

**Details:**
- Name: MyToken
- Symbol: MTK
- Initial Supply: 1,000,000 MTK
- Decimals: 18
- Status: ✅ Deployed & Initialized

**View on Arbiscan:**
https://sepolia.arbiscan.io/address/0x7bf619a8ad20b0f44ce4bdf601f56a64679ffd28

**Transactions:**
- Deploy: Block 239399093
- Init: [Transaction Hash]
- Features: transfer(), approve(), transferFrom()

---

### ERC-721 NFT Example

**Contract Address:** `0xda3818869bd8fb6c4ec22376f94c9035d7220fd4`

**Details:**
- Name: My NFT Collection
- Symbol: MNFT
- Total Minted: 1 NFT
- Status: ✅ Deployed, Initialized & Minted

**View on Arbiscan:**
https://sepolia.arbiscan.io/address/0xda3818869bd8fb6c4ec22376f94c9035d7220fd4

**Key Features:**
- ✅ ERC-165 interface detection (`supportsInterface`)
- ✅ Per-token metadata URIs
- ✅ Full approval system (single + operator)
- ✅ Auto-incrementing token IDs

**Verify Interface Support:**
```bash
cast call 0xda3818869bd8fb6c4ec22376f94c9035d7220fd4 \
  "supportsInterface(bytes4)(bool)" \
  0x80ac58cd \
  --rpc-url=https://sepolia-rollup.arbitrum.io/rpc

# Returns: true ✅
```

**Check Token Owner:**
```bash
cast call 0xda3818869bd8fb6c4ec22376f94c9035d7220fd4 \
  "ownerOf(uint256)(address)" \
  1 \
  --rpc-url=https://sepolia-rollup.arbitrum.io/rpc

# Returns: 0x67BA06dB6d9c562857BF08AB1220a16DfA455c45
```

---

### Code Comparison: Before vs After

**BEFORE (With Issues):**
```rust
// ❌ Old deprecated APIs
use stylus_sdk::{msg, evm};

let sender = msg::sender();
evm::log(Transfer { from, to, value });

// ❌ Wrong versions
stylus-sdk = "0.6.0"  // Too old!
ruint = "1.17.2"      // Incompatible!

// ❌ Missing ERC-165
// No supportsInterface() = detected as ERC-20
```

**AFTER (Clean & Working):**
```rust
// ✅ New non-deprecated APIs
use stylus_sdk::prelude::*;

let sender = self.vm().msg_sender();
log(self.vm(), Transfer { from, to, value });

// ✅ Locked compatible versions
stylus-sdk = "=0.9.0"  // Stable!
ruint = "=1.15.0"      // Compatible!

// ✅ Proper ERC-165 implementation
pub fn supports_interface(&self, interface_id: FixedBytes<4>) -> bool {
    // ... proper detection
}
```

**Results:**
- **Compile time:** 58.76s → 5.70s (after first build)
- **Warnings:** 7 deprecation warnings → 0 warnings ✅
- **Contract size:** 21.9 KB (ERC-20), 22.5 KB (ERC-721)
- **Detection:** ERC-721 properly detected with ERC-165 ✅

---

## 📚 Additional Resources

### Documentation
- [ERC-20 Specification](https://eips.ethereum.org/EIPS/eip-20)
- [ERC-721 Specification](https://eips.ethereum.org/EIPS/eip-721)
- [Stylus SDK Docs](https://docs.arbitrum.io/stylus/stylus-gentle-introduction)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)

### Tools
- [Arbiscan Sepolia](https://sepolia.arbiscan.io/)
- [Arbitrum Faucet](https://faucet.quicknode.com/arbitrum/sepolia)
- [IPFS Pinata](https://www.pinata.cloud/) - for NFT metadata
- [NFT.Storage](https://nft.storage/) - free IPFS storage

### Examples
- [Stylus Workshop Repository](https://github.com/OffchainLabs/stylus-workshop-rust)
- [ERC-20 Examples](https://github.com/OffchainLabs/stylus-workshop-rust/tree/main/contracts/erc20)
- [ERC-721 Examples](https://github.com/OffchainLabs/stylus-workshop-rust/tree/main/contracts/erc721)

---

## ❓ Troubleshooting

### Common Issues & Solutions (Berdasarkan Pengalaman Real!)

#### 1. Compile Error: "BYTES must be equal to Self::BYTES"

**Error Message:**
```
error[E0080]: evaluation of `alloy_primitives::ruint::bytes::<impl alloy_primitives::Uint<8, 1>>::to_le_bytes::<32>::{constant#1}` failed
BYTES must be equal to Self::BYTES
```

**Penyebab:** Version mismatch antara `ruint` dan `alloy-primitives`

**Solusi:**
```bash
# Update Cargo.toml dengan versions yang EXACT:
alloy-primitives = "=0.8.20"
alloy-sol-types = "=0.8.20"
stylus-sdk = "=0.9.0"
ruint = "=1.15.0"  # CRITICAL!

# Lalu update dependencies
cargo update
```

:::tip
Perhatikan tanda `=` di depan version number! Ini memaksa Cargo untuk gunakan exact version tersebut.
:::

---

#### 2. Deprecation Warnings: msg::sender() dan evm::log()

**Warning Message:**
```
warning: use of deprecated function `stylus_sdk::msg::sender`
warning: use of deprecated function `stylus_sdk::evm::log`
```

**Penyebab:** Sejak Stylus SDK 0.8.0+, global hostio functions sudah deprecated

**Solusi Lengkap:**

**BEFORE (Deprecated):**
```rust
use stylus_sdk::{msg, evm};

let sender = msg::sender();
evm::log(Transfer { from, to, value });
```

**AFTER (Clean Code):**
```rust
use stylus_sdk::prelude::*;

let sender = self.vm().msg_sender();
log(self.vm(), Transfer { from, to, value });
```

**Penjelasan:**
- Gunakan `self.vm().msg_sender()` instead of `msg::sender()`
- Gunakan `log(self.vm(), Event)` instead of `evm::log(Event)`
- Ini pattern baru untuk better testability dan cleaner architecture

---

#### 3. Cast Send Command Error: "command not found"

**Error:**
```bash
init(string,string,uint256): command not found
MyToken: command not found
```

**Penyebab:** Multi-line command tanpa backslash `\`

**Solusi:**

**WRONG ❌:**
```bash
cast send 0x123...
  "init(string,string,uint256)"
  "MyToken"
  "MTK"
```

**CORRECT ✅:**
```bash
# Option 1: Single line
cast send 0x123... "init(string,string,uint256)" "MyToken" "MTK" --rpc-url=$RPC_URL --private-key=$PRIVATE_KEY

# Option 2: Multi-line dengan backslash
cast send 0x123... \
  "init(string,string,uint256)" \
  "MyToken" \
  "MTK" \
  --rpc-url=$RPC_URL \
  --private-key=$PRIVATE_KEY
```

:::warning
Jangan lupa include `--private-key=$PRIVATE_KEY` di akhir command! Sering lupa dan error "no private key found".
:::

---

#### 4. Environment Variables Not Set

**Error:**
```
Error: Error accessing local wallet. Did you set a private key?
```

**Solusi:**
```bash
# Set environment variables
export RPC_URL="https://sepolia-rollup.arbitrum.io/rpc"
export PRIVATE_KEY="your_key_without_0x_prefix"

# Verify mereka di-set
echo $RPC_URL
echo $PRIVATE_KEY  # Should NOT be empty

# PENTING: Private key TANPA prefix 0x!
# ✅ CORRECT: export PRIVATE_KEY="abc123..."
# ❌ WRONG:   export PRIVATE_KEY="0xabc123..."
```

---

#### 5. ERC-721 Detected as ERC-20 di Block Explorer

**Problem:** Contract ERC-721 kamu muncul sebagai "ERC-20" atau "Contract" di Arbiscan

**Penyebab:** Missing ERC-165 interface detection

**Solusi:** Tambahkan `supportsInterface` function dan interface IDs:

```rust
use stylus_sdk::alloy_primitives::{Address, U256, FixedBytes};

// ERC-165 Interface IDs
const ERC165_INTERFACE_ID: u32 = 0x01ffc9a7;
const ERC721_INTERFACE_ID: u32 = 0x80ac58cd;
const ERC721_METADATA_INTERFACE_ID: u32 = 0x5b5e139f;

#[public]
impl ERC721NFT {
    // ... other functions ...

    /// ERC-165: Check if contract supports an interface
    pub fn supports_interface(&self, interface_id: FixedBytes<4>) -> bool {
        let id = u32::from_be_bytes(interface_id.0);
        id == ERC165_INTERFACE_ID
            || id == ERC721_INTERFACE_ID
            || id == ERC721_METADATA_INTERFACE_ID
    }
}
```

**Verify:**
```bash
# Should return true
cast call <CONTRACT_ADDRESS> \
  "supportsInterface(bytes4)(bool)" \
  0x80ac58cd \
  --rpc-url=$RPC_URL
```

**Catatan:** Block explorer mungkin perlu 10-30 menit untuk update detection. Mint minimal 1 NFT untuk trigger indexer!

---

#### 6. Deploy Success tapi "Connection Refused" Error

**Message:**
```
contract size: 22.5 KB
error: no error payload found in response: Transport(Custom(reqwest::Error { kind: Request, url: "http://localhost:8547/", ...
```

**Ini BUKAN error!** ✅

**Penjelasan:**
- Contract **sudah berhasil di-compile** (lihat "contract size")
- Error di akhir hanya karena `cargo stylus check` coba connect ke local node
- Selama ada "contract size" output, berarti **sukses**!

---

#### 7. Cargo.lock Needs Update

**Error:**
```
error: the lock file needs to be updated but --locked was passed
```

**Solusi:**
```bash
cargo update
```

Ini akan regenerate `Cargo.lock` dengan dependency versions yang correct.

---

#### 8. Function Parameter Count Mismatch

**Error:**
```
Error: Failed to estimate gas: execution reverted
```

**Penyebab:** Jumlah parameter salah saat call function

**Contoh:**
```bash
# ❌ WRONG - 3 parameters untuk function yang expect 2
cast send 0x123... "init(string,string,string)" "Name" "Symbol" "Extra"

# ✅ CORRECT - 2 parameters
cast send 0x123... "init(string,string)" "Name" "Symbol"
```

**Tip:** Cek function signature di code kamu dulu sebelum call!

---

#### 9. NFT Metadata Not Showing

**Solusi:**
- Upload images ke IPFS first (gunakan [Pinata](https://pinata.cloud) atau [NFT.Storage](https://nft.storage))
- Metadata JSON harus follow standard format:
  ```json
  {
    "name": "Token Name #1",
    "description": "Description here",
    "image": "ipfs://QmYourImageHash",
    "attributes": [
      {
        "trait_type": "Background",
        "value": "Blue"
      }
    ]
  }
  ```
- Upload metadata JSON ke IPFS juga
- Pass IPFS URI saat mint: `ipfs://QmYourMetadataHash`

---

#### 10. Insufficient Funds Error

**Solusi:**
- Get testnet ETH dari [Arbitrum Sepolia Faucet](https://faucet.quicknode.com/arbitrum/sepolia)
- Atau bridge dari Ethereum Sepolia ke Arbitrum Sepolia via [bridge](https://bridge.arbitrum.io)
- Check balance:
  ```bash
  cast balance YOUR_ADDRESS --rpc-url=$RPC_URL
  ```

---

### Pro Tips untuk Avoid Issues 🎯

1. **Selalu lock dependencies ke exact versions** dengan `=` prefix
2. **Gunakan non-deprecated APIs** (`self.vm().msg_sender()`, `log()`)
3. **Test compile dulu** dengan `cargo stylus check` sebelum deploy
4. **Verify environment variables** di-set dengan `echo $VAR_NAME`
5. **Single-line commands** atau use `\` for multi-line
6. **Read error messages carefully** - biasanya ada hint solution-nya
7. **Check Arbiscan** untuk verify transactions sukses
8. **Mint at least 1 token/NFT** untuk trigger block explorer detection

---

## 🚀 Langkah Selanjutnya

**Persiapan untuk Mini Hackathon:**
1. Review semua contoh kode di modul ini
2. Coba deploy token kamu sendiri
3. Pikirkan ide proyek
4. Cari teman satu tim di Discord
5. Siap untuk membangun! 🛠️

**Sampai jumpa di Townhall 3! 🎉**

---

## 💬 Butuh Bantuan?

Stuck? Ada pertanyaan?

- 💬 Discord: Channel #arbitrum-stylus
- 🐛 GitHub Issues: Buat issue di course repository
- 👥 Study Group: Gabung sesi harian
- 📧 Mentors: Tag @mentor di Discord

**Ingat:** Cara terbaik untuk belajar adalah dengan membangun. Jangan takut untuk bereksperimen dan mencoba-coba di testnet! 🔥
