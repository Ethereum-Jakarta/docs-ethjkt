---
sidebar_position: 10
title: "Stylus Hands-On Examples"
description: "Praktek membuat 4 smart contract dari sederhana hingga kompleks"
---

# 🛠️ Stylus Hands-On Examples

<div style={{backgroundColor: '#1e3a8a', padding: '20px', borderRadius: '10px', marginBottom: '20px', border: '2px solid #3b82f6'}}>
  <h3 style={{color: '#60a5fa', marginTop: 0}}>💻 Practical Workshop - Build Real Contracts</h3>
  <p style={{color: '#e0e7ff', fontSize: '1.1em', marginBottom: 0}}>
    Latihan membuat 4 smart contract dengan tingkat kesulitan bertahap. Dari sederhana ke kompleks!
  </p>
</div>

## 🎯 Apa yang Akan Dibuat

Kita akan membuat 4 smart contract dengan progression yang natural:

1. **Greeting Contract** - Simpan dan update pesan (beginner)
2. **Simple Voting** - Vote yes/no untuk proposal (intermediate)
3. **Token Balance** - Tracking balance tanpa transfer dulu (intermediate)
4. **Basic Marketplace** - Jual beli item sederhana (advanced)

**Mengapa urutan ini?**
- Dimulai dari yang paling sederhana (1 variabel)
- Bertambah kompleks secara bertahap
- Setiap contract mengajarkan konsep baru
- Build confidence step-by-step!

---

## 📘 Example 1: Greeting Contract

### Konsep

Contract untuk menyimpan greeting message yang bisa diupdate. Mirip guest book!

**Fitur:**
- Set greeting message
- Get greeting message
- Track siapa yang terakhir update

### Implementasi Step-by-Step

#### 1.1. Setup Project

```bash
cargo stylus new greeting-contract
cd greeting-contract
```

#### 1.2. Edit src/lib.rs

```rust
#![cfg_attr(not(feature = "export-abi"), no_main)]
extern crate alloc;

use stylus_sdk::prelude::*;
use stylus_sdk::storage::{StorageString, StorageAddress};
use stylus_sdk::alloy_primitives::Address;
use stylus_sdk::msg;

// Storage contract
#[storage]
#[entrypoint]
pub struct GreetingContract {
    message: StorageString,        // Pesan greeting
    last_updater: StorageAddress,  // Siapa yang terakhir update
}

#[public]
impl GreetingContract {
    /// Set greeting message baru
    pub fn set_greeting(&mut self, new_message: String) {
        // Simpan message baru
        self.message.set_str(&new_message);

        // Simpan siapa yang update
        self.last_updater.set(msg::sender());
    }

    /// Baca greeting message
    pub fn get_greeting(&self) -> String {
        self.message.get_string()
    }

    /// Baca siapa yang terakhir update
    pub fn get_last_updater(&self) -> Address {
        self.last_updater.get()
    }
}
```

#### 1.3. Penjelasan Detail

**Storage Variables:**
- `message: StorageString` - Menyimpan text greeting (bisa panjang!)
- `last_updater: StorageAddress` - Menyimpan address yang terakhir update

**Method `set_greeting`:**
```rust
pub fn set_greeting(&mut self, new_message: String) {
    self.message.set_str(&new_message);    // Simpan string
    self.last_updater.set(msg::sender());  // Simpan caller address
}
```
- `&mut self` - perlu mutate storage
- `new_message: String` - parameter input bertipe String
- `msg::sender()` - mendapatkan address yang panggil function (seperti di Solidity!)

**Method `get_greeting`:**
```rust
pub fn get_greeting(&self) -> String {
    self.message.get_string()  // Return string dari storage
}
```
- `&self` - hanya baca, tidak ubah
- `-> String` - return value bertipe String
- GRATIS dipanggil (view function)

:::info msg::sender()
`msg::sender()` adalah global variable seperti di Solidity yang return address pemanggil function. Sangat berguna untuk access control!
:::

#### 1.4. Compile dan Deploy

```bash
# Compile
cargo build --release --target wasm32-unknown-unknown

# Check
cargo stylus check

# Deploy (ganti dengan private key Anda)
cargo stylus deploy \
  --private-key-path=.env \
  --endpoint=https://sepolia-rollup.arbitrum.io/rpc
```

#### 1.5. Interact dengan Contract

```bash
# Set greeting (butuh gas)
cast send YOUR_CONTRACT_ADDRESS \
  "setGreeting(string)" \
  "Hello from Stylus!" \
  --private-key YOUR_PRIVATE_KEY \
  --rpc-url https://sepolia-rollup.arbitrum.io/rpc

# Get greeting (gratis!)
cast call YOUR_CONTRACT_ADDRESS \
  "getGreeting()(string)" \
  --rpc-url https://sepolia-rollup.arbitrum.io/rpc

# Get last updater
cast call YOUR_CONTRACT_ADDRESS \
  "getLastUpdater()(address)" \
  --rpc-url https://sepolia-rollup.arbitrum.io/rpc
```

---

## 🗳️ Example 2: Simple Voting

### Konsep

Contract untuk voting proposal dengan yes/no. Setiap address hanya bisa vote 1x.

**Fitur:**
- Vote yes atau no
- Cek total yes dan no votes
- Cek apakah address sudah vote
- Tentukan winner

### Implementasi

```rust
#![cfg_attr(not(feature = "export-abi"), no_main)]
extern crate alloc;

use stylus_sdk::prelude::*;
use stylus_sdk::storage::{StorageU256, StorageMap, StorageBool, StorageString};
use stylus_sdk::alloy_primitives::{Address, U256};
use stylus_sdk::msg;

#[storage]
#[entrypoint]
pub struct SimpleVoting {
    proposal: StorageString,                    // Judul proposal
    yes_votes: StorageU256,                     // Total vote yes
    no_votes: StorageU256,                      // Total vote no
    has_voted: StorageMap<Address, StorageBool>, // Track yang sudah vote
}

#[public]
impl SimpleVoting {
    /// Inisialisasi dengan proposal
    pub fn initialize(&mut self, proposal_text: String) {
        self.proposal.set_str(&proposal_text);
        self.yes_votes.set(U256::from(0));
        self.no_votes.set(U256::from(0));
    }

    /// Vote yes untuk proposal
    pub fn vote_yes(&mut self) -> Result<(), Vec<u8>> {
        let voter = msg::sender();

        // Cek apakah sudah vote
        if self.has_voted.get(voter).get() {
            return Err(b"Already voted!".to_vec());
        }

        // Tambah yes vote
        let current_yes = self.yes_votes.get();
        self.yes_votes.set(current_yes + U256::from(1));

        // Mark sudah vote
        self.has_voted.setter(voter).set(true);

        Ok(())
    }

    /// Vote no untuk proposal
    pub fn vote_no(&mut self) -> Result<(), Vec<u8>> {
        let voter = msg::sender();

        // Cek apakah sudah vote
        if self.has_voted.get(voter).get() {
            return Err(b"Already voted!".to_vec());
        }

        // Tambah no vote
        let current_no = self.no_votes.get();
        self.no_votes.set(current_no + U256::from(1));

        // Mark sudah vote
        self.has_voted.setter(voter).set(true);

        Ok(())
    }

    /// Get hasil voting
    pub fn get_results(&self) -> (U256, U256) {
        (self.yes_votes.get(), self.no_votes.get())
    }

    /// Cek apakah address sudah vote
    pub fn has_user_voted(&self, user: Address) -> bool {
        self.has_voted.get(user).get()
    }

    /// Get pemenang (yes/no/tie)
    pub fn get_winner(&self) -> String {
        let yes = self.yes_votes.get();
        let no = self.no_votes.get();

        if yes > no {
            String::from("YES wins!")
        } else if no > yes {
            String::from("NO wins!")
        } else {
            String::from("It's a tie!")
        }
    }

    /// Get proposal text
    pub fn get_proposal(&self) -> String {
        self.proposal.get_string()
    }
}
```

### Penjelasan Konsep Baru

**1. StorageMap untuk Tracking**
```rust
has_voted: StorageMap<Address, StorageBool>
```
- Mapping dari Address → Bool
- Mirip `mapping(address => bool)` di Solidity
- Untuk track siapa yang sudah vote

**2. Result untuk Error Handling**
```rust
pub fn vote_yes(&mut self) -> Result<(), Vec<u8>> {
    if self.has_voted.get(voter).get() {
        return Err(b"Already voted!".to_vec());
    }
    // ...
    Ok(())
}
```
- `Result<(), Vec<u8>>` - return OK atau Error
- `Err(b"Already voted!".to_vec())` - return error message
- `Ok(())` - return success tanpa value

**3. Tuple Return**
```rust
pub fn get_results(&self) -> (U256, U256) {
    (self.yes_votes.get(), self.no_votes.get())
}
```
- Return 2 nilai sekaligus
- Pertama: yes votes
- Kedua: no votes

:::tip StorageMap Pattern
Untuk access StorageMap:
- **Read**: `self.has_voted.get(address).get()`
- **Write**: `self.has_voted.setter(address).set(true)`
:::

### Interact dengan Voting

```bash
# Initialize proposal
cast send CONTRACT_ADDRESS \
  "initialize(string)" \
  "Should we adopt Stylus?" \
  --private-key PRIVATE_KEY \
  --rpc-url https://sepolia-rollup.arbitrum.io/rpc

# Vote yes
cast send CONTRACT_ADDRESS \
  "voteYes()" \
  --private-key PRIVATE_KEY \
  --rpc-url https://sepolia-rollup.arbitrum.io/rpc

# Get results
cast call CONTRACT_ADDRESS \
  "getResults()(uint256,uint256)" \
  --rpc-url https://sepolia-rollup.arbitrum.io/rpc

# Get winner
cast call CONTRACT_ADDRESS \
  "getWinner()(string)" \
  --rpc-url https://sepolia-rollup.arbitrum.io/rpc
```

---

## 💰 Example 3: Token Balance Tracker

### Konsep

Contract sederhana untuk tracking token balance per user. Seperti bank account tapi belum bisa transfer.

**Fitur:**
- Mint token ke user (owner only)
- Burn token dari user
- Cek balance
- Cek total supply

### Implementasi

```rust
#![cfg_attr(not(feature = "export-abi"), no_main)]
extern crate alloc;

use stylus_sdk::prelude::*;
use stylus_sdk::storage::{StorageU256, StorageMap, StorageAddress};
use stylus_sdk::alloy_primitives::{Address, U256};
use stylus_sdk::msg;

#[storage]
#[entrypoint]
pub struct TokenTracker {
    owner: StorageAddress,                     // Owner contract
    total_supply: StorageU256,                 // Total semua token
    balances: StorageMap<Address, StorageU256>, // Balance per address
}

#[public]
impl TokenTracker {
    /// Constructor - set owner
    pub fn initialize(&mut self) {
        self.owner.set(msg::sender());
        self.total_supply.set(U256::from(0));
    }

    /// Mint token ke address (only owner)
    pub fn mint(&mut self, to: Address, amount: U256) -> Result<(), Vec<u8>> {
        // Cek caller adalah owner
        if msg::sender() != self.owner.get() {
            return Err(b"Only owner can mint!".to_vec());
        }

        // Tambah balance user
        let current_balance = self.balances.get(to).get();
        self.balances.setter(to).set(current_balance + amount);

        // Tambah total supply
        let current_supply = self.total_supply.get();
        self.total_supply.set(current_supply + amount);

        Ok(())
    }

    /// Burn token dari caller
    pub fn burn(&mut self, amount: U256) -> Result<(), Vec<u8>> {
        let caller = msg::sender();
        let balance = self.balances.get(caller).get();

        // Cek balance cukup
        if balance < amount {
            return Err(b"Insufficient balance!".to_vec());
        }

        // Kurangi balance
        self.balances.setter(caller).set(balance - amount);

        // Kurangi total supply
        let supply = self.total_supply.get();
        self.total_supply.set(supply - amount);

        Ok(())
    }

    /// Get balance of address
    pub fn balance_of(&self, account: Address) -> U256 {
        self.balances.get(account).get()
    }

    /// Get total supply
    pub fn get_total_supply(&self) -> U256 {
        self.total_supply.get()
    }

    /// Get owner address
    pub fn get_owner(&self) -> Address {
        self.owner.get()
    }
}
```

### Penjelasan Access Control

```rust
pub fn mint(&mut self, to: Address, amount: U256) -> Result<(), Vec<u8>> {
    // Cek caller adalah owner
    if msg::sender() != self.owner.get() {
        return Err(b"Only owner can mint!".to_vec());
    }
    // ... lanjut mint
}
```

**Pattern Owner-Only:**
1. Simpan owner di storage saat initialize
2. Di function yang restricted, cek `msg::sender() == owner`
3. Return error jika bukan owner

:::warning Security Check
Selalu validate `msg::sender()` untuk function yang restricted! Jangan lupa return error jika unauthorized.
:::

### Interact

```bash
# Initialize (set owner)
cast send CONTRACT \
  "initialize()" \
  --private-key PRIVATE_KEY \
  --rpc-url RPC_URL

# Mint 1000 token ke address
cast send CONTRACT \
  "mint(address,uint256)" \
  0xRecipientAddress 1000 \
  --private-key PRIVATE_KEY \
  --rpc-url RPC_URL

# Cek balance
cast call CONTRACT \
  "balanceOf(address)(uint256)" \
  0xRecipientAddress \
  --rpc-url RPC_URL

# Burn 500 token
cast send CONTRACT \
  "burn(uint256)" \
  500 \
  --private-key PRIVATE_KEY \
  --rpc-url RPC_URL
```

---

## 🛒 Example 4: Basic Marketplace

### Konsep

Marketplace sederhana untuk listing dan buying items. Seller bisa list item, buyer bisa buy.

**Fitur:**
- List item dengan nama dan harga
- Buy item (mark as sold)
- Get daftar semua item
- Get detail item

### Implementasi

```rust
#![cfg_attr(not(feature = "export-abi"), no_main)]
extern crate alloc;

use stylus_sdk::prelude::*;
use stylus_sdk::storage::{StorageU256, StorageVec, StorageAddress, StorageString, StorageBool};
use stylus_sdk::alloy_primitives::{Address, U256};
use stylus_sdk::msg;

// Struct untuk 1 item
#[storage]
pub struct Item {
    seller: StorageAddress,   // Penjual
    name: StorageString,      // Nama item
    price: StorageU256,       // Harga
    is_sold: StorageBool,     // Sudah terjual?
}

#[storage]
#[entrypoint]
pub struct Marketplace {
    items: StorageVec<Item>,      // Daftar semua item
    item_count: StorageU256,       // Total item
}

#[public]
impl Marketplace {
    /// List item baru
    pub fn list_item(&mut self, name: String, price: U256) -> Result<U256, Vec<u8>> {
        // Validasi
        if price == U256::from(0) {
            return Err(b"Price must be > 0".to_vec());
        }

        // Buat item baru
        let mut new_item = Item {
            seller: StorageAddress::default(),
            name: StorageString::default(),
            price: StorageU256::default(),
            is_sold: StorageBool::default(),
        };

        new_item.seller.set(msg::sender());
        new_item.name.set_str(&name);
        new_item.price.set(price);
        new_item.is_sold.set(false);

        // Simpan ke array
        self.items.push(new_item);

        // Increment count
        let count = self.item_count.get();
        self.item_count.set(count + U256::from(1));

        // Return item ID (index)
        Ok(count)
    }

    /// Buy item by ID
    #[payable]
    pub fn buy_item(&mut self, item_id: U256) -> Result<(), Vec<u8>> {
        // Validasi ID
        if item_id >= self.item_count.get() {
            return Err(b"Item not found".to_vec());
        }

        let index = item_id.as_limbs()[0] as usize;
        let item = self.items.get(index).ok_or(b"Item not found".to_vec())?;

        // Cek sudah terjual belum
        if item.is_sold.get() {
            return Err(b"Item already sold".to_vec());
        }

        // Cek buyer bukan seller
        if msg::sender() == item.seller.get() {
            return Err(b"Cannot buy your own item".to_vec());
        }

        // Mark as sold
        let item_mut = self.items.get_mut(index).ok_or(b"Item not found".to_vec())?;
        item_mut.is_sold.set(true);

        // NOTE: Dalam real marketplace, di sini transfer ETH ke seller
        // Untuk kesederhanaan, kita skip transfer dulu

        Ok(())
    }

    /// Get total items
    pub fn get_item_count(&self) -> U256 {
        self.item_count.get()
    }

    /// Get item details
    pub fn get_item(&self, item_id: U256) -> Result<(Address, String, U256, bool), Vec<u8>> {
        if item_id >= self.item_count.get() {
            return Err(b"Item not found".to_vec());
        }

        let index = item_id.as_limbs()[0] as usize;
        let item = self.items.get(index).ok_or(b"Item not found".to_vec())?;

        Ok((
            item.seller.get(),
            item.name.get_string(),
            item.price.get(),
            item.is_sold.get(),
        ))
    }
}
```

### Penjelasan Konsep Baru

**1. StorageVec - Dynamic Array**
```rust
items: StorageVec<Item>
```
- Array dinamis yang bisa bertambah
- Seperti `Item[] public items` di Solidity
- Push dengan `self.items.push(item)`

**2. Nested Struct**
```rust
#[storage]
pub struct Item {
    seller: StorageAddress,
    name: StorageString,
    // ...
}
```
- Struct di dalam struct
- Setiap Item punya field sendiri
- Harus annotate dengan `#[storage]`

**3. Payable Function**
```rust
#[payable]
pub fn buy_item(&mut self, item_id: U256) -> Result<(), Vec<u8>> {
    // Function ini bisa terima ETH!
}
```
- `#[payable]` - function bisa receive ETH
- Tanpa ini, kirim ETH akan error

:::info Get vs Get Mut
- `self.items.get(index)` - get immutable reference (hanya baca)
- `self.items.get_mut(index)` - get mutable reference (bisa ubah)
:::

### Interact

```bash
# List item
cast send CONTRACT \
  "listItem(string,uint256)" \
  "iPhone 15" 1000 \
  --private-key PRIVATE_KEY \
  --rpc-url RPC_URL

# Get item details
cast call CONTRACT \
  "getItem(uint256)(address,string,uint256,bool)" \
  0 \
  --rpc-url RPC_URL

# Buy item (dengan value 0 untuk simplified version)
cast send CONTRACT \
  "buyItem(uint256)" \
  0 \
  --private-key PRIVATE_KEY \
  --rpc-url RPC_URL

# Check if sold
cast call CONTRACT \
  "getItem(uint256)(address,string,uint256,bool)" \
  0 \
  --rpc-url RPC_URL
```

---

## 🎯 Mini Hackathon Challenge

<div style={{backgroundColor: '#fef3c7', padding: '20px', borderRadius: '10px', marginBottom: '20px', border: '2px solid #f59e0b'}}>
  <h3 style={{color: '#92400e', marginTop: 0}}>🏆 Challenge: Build Your Own dApp</h3>

**Pilih SATU project untuk diimplementasikan:**

### Option 1: Todo List Contract
- Add todo item
- Mark todo as complete
- Get all todos
- Delete todo

### Option 2: Simple Escrow
- Buyer deposit ETH
- Seller deliver product (mark delivered)
- Buyer confirm receipt (release payment)
- Refund if dispute

### Option 3: Name Registry
- Register username (unique)
- Transfer username ke address lain
- Lookup address by username
- Reverse lookup username by address

### Option 4: Your Custom Idea
- Propose idea sendiri
- Minimal 3 functions
- Must use StorageMap atau StorageVec
- Production quality code

**Requirements (Semua Projects):**
- ✅ Full implementation dengan Rust
- ✅ Deploy ke Arbitrum Sepolia
- ✅ Minimal 5 transaksi interact
- ✅ Screenshot dari Arbiscan
- ✅ README dengan cara pakai

**Judging Criteria:**
- Code quality (30%)
- Functionality (25%)
- Documentation (20%)
- Gas efficiency (15%)
- Innovation (10%)

**Deadline:** 6 Februari 2026, 20:00 WIB
</div>

---

## 📊 Comparison Table

| Contract | Complexity | New Concepts | Lines of Code |
|----------|-----------|--------------|---------------|
| Greeting | ⭐ Easy | StorageString, msg::sender() | ~40 |
| Voting | ⭐⭐ Medium | StorageMap, Result, Tuple | ~80 |
| Token Tracker | ⭐⭐⭐ Medium+ | Access control, Math operations | ~90 |
| Marketplace | ⭐⭐⭐⭐ Advanced | StorageVec, Nested struct, Payable | ~120 |

---

## 🐛 Common Errors & Solutions

### Error: "getter method not found"

```rust
// ❌ Wrong
pub fn get_value(&self) {
    self.value.get()  // Return diabaikan!
}

// ✅ Correct
pub fn get_value(&self) -> U256 {
    self.value.get()
}
```

### Error: "cannot borrow as mutable"

```rust
// ❌ Wrong
pub fn update(&self) {  // &self tidak bisa mutate!
    self.value.set(U256::from(10));
}

// ✅ Correct
pub fn update(&mut self) {  // &mut self
    self.value.set(U256::from(10));
}
```

### Error: "index out of bounds"

```rust
// ❌ Wrong - tidak cek bounds
let item = self.items.get(index).unwrap();  // Bisa panic!

// ✅ Correct - handle error
let item = self.items.get(index)
    .ok_or(b"Index out of bounds".to_vec())?;
```

---

## 🎓 Checklist Pembelajaran

Pastikan Anda memahami:

- [ ] StorageString untuk simpan text
- [ ] StorageMap untuk mapping address → value
- [ ] StorageVec untuk dynamic array
- [ ] Result type untuk error handling
- [ ] msg::sender() untuk get caller
- [ ] Access control pattern (owner only)
- [ ] Tuple return untuk multiple values
- [ ] #[payable] untuk receive ETH
- [ ] Get vs get_mut untuk StorageVec

---

## 🔗 Resources

### Code Examples (Updated 2026)
- [Stylus Workshop Rust](https://github.com/OffchainLabs/stylus-workshop-rust) - Workshop examples
- [Stylus by Example](https://stylus-by-example.org/) - Learn by examples
- [Awesome Stylus](https://github.com/OffchainLabs/awesome-stylus) - Curated list

### Official Documentation
- [Stylus Rust SDK Guide](https://docs.arbitrum.io/stylus/reference/rust-sdk-guide) - Advanced features
- [Storage Types Reference](https://docs.arbitrum.io/stylus/reference/overview) - Storage patterns
- [Testing Stylus Contracts](https://docs.arbitrum.io/stylus/how-tos/testing-contracts) - Unit testing guide

### Libraries & Tools
- [OpenZeppelin Stylus](https://github.com/OpenZeppelin/rust-contracts-stylus) - Secure contract library
- [stylus-sdk v0.10.0](https://crates.io/crates/stylus-sdk) - Latest SDK
- [cargo-stylus v0.6.3](https://crates.io/crates/cargo-stylus) - CLI tool

---

## ⏭️ Next Steps

Setelah menguasai examples ini, lanjut ke:

1. **Full ERC-20 Token** dengan transfer & approval
2. **Events & Indexing** untuk frontend integration
3. **External Calls** ke Solidity contracts
4. **Gas Optimization** techniques

<div style={{backgroundColor: '#dcfce7', padding: '20px', borderRadius: '10px', marginTop: '20px', border: '2px solid #16a34a'}}>
  <strong>💪 Great Job!</strong> Anda sudah praktek 4 contract dengan complexity bertahap. Sekarang waktunya build project sendiri! 🚀
</div>

---

**Keep Shipping! 🦀⚡**
