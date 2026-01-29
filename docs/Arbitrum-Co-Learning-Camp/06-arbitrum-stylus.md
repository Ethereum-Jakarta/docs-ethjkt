---
id: arbitrum-stylus
title: Arbitrum Stylus - Multi-Language Contracts
sidebar_position: 6
---

# Arbitrum Stylus - Multi-Language Contracts

**Arbitrum Stylus** adalah inovasi terobosan yang memungkinkan developer menulis smart contracts dalam **Rust, C++**, dan bahasa lain yang dikompilasi ke WebAssembly (WASM). Stylus membuka pengembangan Web3 untuk jutaan developer non-Solidity.

---

## Apa itu Stylus?

Stylus adalah **virtual machine kedua** yang berjalan bersama EVM di Arbitrum. Keduanya fully interoperable - contract Solidity dapat call contract Rust dan sebaliknya!

<div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))',gap:'16px',margin:'20px 0'}}>

<div style={{background:'#0D102D',borderRadius:'12px',padding:'20px',color:'#fff',border:'2px solid #F2B42D'}}>
  <div style={{fontSize:'20px',fontWeight:'700',marginBottom:'8px',color:'#F2B42D'}}>🦀 Multi-Language Support</div>
  <div style={{fontSize:'14px',opacity:'0.9'}}>
    Tulis smart contracts dalam Rust, C++, atau bahasa apa pun yang compile ke WASM
  </div>
</div>

<div style={{background:'#0D102D',borderRadius:'12px',padding:'20px',color:'#fff',border:'2px solid #F2B42D'}}>
  <div style={{fontSize:'20px',fontWeight:'700',marginBottom:'8px',color:'#F2B42D'}}>⚡ 10x-100x Faster</div>
  <div style={{fontSize:'14px',opacity:'0.9'}}>
    WASM execution drastically faster untuk compute-heavy operations
  </div>
</div>

<div style={{background:'#0D102D',borderRadius:'12px',padding:'20px',color:'#fff',border:'2px solid #F2B42D'}}>
  <div style={{fontSize:'20px',fontWeight:'700',marginBottom:'8px',color:'#F2B42D'}}>💰 Lower Gas Costs</div>
  <div style={{fontSize:'14px',opacity:'0.9'}}>
    Efficient execution = significantly lower gas untuk complex logic
  </div>
</div>

<div style={{background:'#0D102D',borderRadius:'12px',padding:'20px',color:'#fff',border:'2px solid #F2B42D'}}>
  <div style={{fontSize:'20px',fontWeight:'700',marginBottom:'8px',color:'#F2B42D'}}>🔗 Full Interoperability</div>
  <div style={{fontSize:'14px',opacity:'0.9'}}>
    Call Solidity contracts from Rust dan sebaliknya - seamless composability
  </div>
</div>

<div style={{background:'#0D102D',borderRadius:'12px',padding:'20px',color:'#fff',border:'2px solid #F2B42D'}}>
  <div style={{fontSize:'20px',fontWeight:'700',marginBottom:'8px',color:'#F2B42D'}}>🛡️ Memory Safety</div>
  <div style={{fontSize:'14px',opacity:'0.9'}}>
    Rust's borrow checker prevents entire classes of vulnerabilities
  </div>
</div>

<div style={{background:'#0D102D',borderRadius:'12px',padding:'20px',color:'#fff',border:'2px solid #F2B42D'}}>
  <div style={{fontSize:'20px',fontWeight:'700',marginBottom:'8px',color:'#F2B42D'}}>📚 Ecosystem Access</div>
  <div style={{fontSize:'14px',opacity:'0.9'}}>
    Use existing Rust crates (libraries) - don't reinvent the wheel
  </div>
</div>

</div>

---

## Kenapa Stylus Mengubah Permainan?

<div style={{background:'#E8F5E9',borderRadius:'8px',padding:'16px',margin:'16px 0'}}>

### 🎯 **Revolutionary Impact:**

**1. Onboard Non-EVM Developers**
- Jutaan Rust/C++ developers dapat contribute ke Web3
- No need to learn Solidity dari scratch

**2. Performance-Critical Apps**
- Game engines dengan complex physics
- AI/ML inference on-chain
- Advanced cryptography (ZK, signatures)
- Scientific computing

**3. Security Benefits**
- Rust's memory safety eliminates buffer overflows
- Borrow checker prevents use-after-free
- Type system catches bugs at compile-time

**4. Developer Productivity**
- Use familiar tools (cargo, rustfmt, clippy)
- Rich ecosystem (crates.io 100K+ libraries)
- Better testing frameworks

**5. Future-Proof**
- WASM adalah standar industri
- Growing ecosystem dan adoption
- Path to more languages (Go, Swift, Python)

</div>

:::success Game Changer 🚀
Stylus adalah **first production-ready multi-language smart contract platform** di dunia. Tidak ada blockchain lain yang punya ini!
:::

---

## Rust vs Solidity: Performance Comparison

| Operation | Solidity (EVM) | Rust (Stylus) | Speedup |
|-----------|----------------|---------------|---------|
| **Basic Arithmetic** | Baseline | ~3x faster | 3x |
| **Cryptography (Hashing)** | Baseline | ~10x faster | 10x |
| **Signature Verification** | Baseline | ~50x faster | 50x |
| **Complex Computation** | Baseline | ~100x faster | **100x** |
| **Memory Operations** | Baseline | ~5x faster | 5x |

:::info Real Impact
Untuk operations yang compute-intensive, Stylus bisa **100x lebih cepat** dari Solidity sambil **10x lebih murah** gas!
:::

---

## Getting Started with Stylus

### Prerequisites

```bash
# 1. Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Restart terminal, then verify
rustc --version
cargo --version

# 2. Add WASM target
rustup target add wasm32-unknown-unknown

# 3. Install Stylus CLI
cargo install cargo-stylus
```

### Create New Project

```bash
# Create new Stylus project
cargo stylus new my-stylus-contract
cd my-stylus-contract

# Project structure
my-stylus-contract/
├── Cargo.toml          # Rust dependencies
├── src/
│   └── lib.rs          # Main contract code
└── tests/
    └── tests.rs        # Unit tests
```

---

## Example 1: Counter Contract in Rust

```rust
// src/lib.rs
#![cfg_attr(not(feature = "export-abi"), no_main)]
extern crate alloc;

use stylus_sdk::{
    prelude::*,
    alloy_primitives::U256,
    storage::StorageU256,
};

// Define contract storage
#[storage]
#[entrypoint]
pub struct Counter {
    number: StorageU256,
}

// Implement contract methods
#[public]
impl Counter {
    // Increment counter
    pub fn increment(&mut self) {
        let count = self.number.get() + U256::from(1);
        self.number.set(count);
    }

    // Decrement counter
    pub fn decrement(&mut self) {
        let count = self.number.get();
        if count > U256::from(0) {
            self.number.set(count - U256::from(1));
        }
    }

    // Get current value
    pub fn number(&self) -> U256 {
        self.number.get()
    }

    // Set value directly
    pub fn set_number(&mut self, new_number: U256) {
        self.number.set(new_number);
    }
}
```

### Build and Deploy

```bash
# Build contract
cargo stylus build

# Check WASM size
cargo stylus check

# Deploy to Arbitrum Sepolia
cargo stylus deploy \
  --private-key=$PRIVATE_KEY \
  --endpoint=https://sepolia-rollup.arbitrum.io/rpc

# Output:
# ✅ Contract deployed at: 0x...
# Gas used: 1,234,567
```

---

## Example 2: ERC-20 Token in Rust

```rust
use stylus_sdk::{
    prelude::*,
    alloy_primitives::{Address, U256},
    storage::{StorageMap, StorageU256},
    msg,
};

#[storage]
#[entrypoint]
pub struct Erc20 {
    balances: StorageMap<Address, U256>,
    allowances: StorageMap<Address, StorageMap<Address, U256>>,
    total_supply: StorageU256,
}

#[public]
impl Erc20 {
    // Constructor
    pub fn new(initial_supply: U256) -> Self {
        let mut token = Self::default();
        let sender = msg::sender();

        token.balances.insert(sender, initial_supply);
        token.total_supply.set(initial_supply);

        token
    }

    // Get balance of address
    pub fn balance_of(&self, owner: Address) -> U256 {
        self.balances.get(owner)
    }

    // Get total supply
    pub fn total_supply(&self) -> U256 {
        self.total_supply.get()
    }

    // Transfer tokens
    pub fn transfer(&mut self, to: Address, amount: U256) -> bool {
        let sender = msg::sender();
        let sender_balance = self.balances.get(sender);

        if sender_balance < amount {
            return false;
        }

        self.balances.insert(sender, sender_balance - amount);
        self.balances.insert(to, self.balances.get(to) + amount);

        true
    }

    // Approve spending
    pub fn approve(&mut self, spender: Address, amount: U256) -> bool {
        let owner = msg::sender();
        self.allowances.setter(owner).insert(spender, amount);
        true
    }

    // Get allowance
    pub fn allowance(&self, owner: Address, spender: Address) -> U256 {
        self.allowances.getter(owner).get(spender)
    }

    // Transfer from (for approved spenders)
    pub fn transfer_from(
        &mut self,
        from: Address,
        to: Address,
        amount: U256
    ) -> bool {
        let spender = msg::sender();
        let allowance = self.allowances.getter(from).get(spender);

        if allowance < amount {
            return false;
        }

        let from_balance = self.balances.get(from);
        if from_balance < amount {
            return false;
        }

        // Update allowance
        self.allowances.setter(from).insert(spender, allowance - amount);

        // Update balances
        self.balances.insert(from, from_balance - amount);
        self.balances.insert(to, self.balances.get(to) + amount);

        true
    }
}
```

---

## Interoperability: Calling Solidity dari Rust

Salah satu fitur paling powerful dari Stylus adalah **seamless interoperability** dengan Solidity contracts!

```rust
// Call existing Solidity contract from Rust

use stylus_sdk::{
    call::Call,
    alloy_primitives::Address,
    sol_interface,
};

// Define Solidity interface
sol_interface! {
    interface IUniswapV2Router {
        function swapExactTokensForTokens(
            uint amountIn,
            uint amountOutMin,
            address[] calldata path,
            address to,
            uint deadline
        ) external returns (uint[] memory amounts);
    }
}

#[public]
impl MyContract {
    pub fn execute_swap(&mut self, amount: U256) -> Result<Vec<U256>, Vec<u8>> {
        // Instantiate Uniswap router
        let router = IUniswapV2Router::new(UNISWAP_ROUTER_ADDRESS);

        // Call Solidity contract
        let result = router.swap_exact_tokens_for_tokens(
            self,           // caller context
            amount,         // amount in
            min_amount,     // min amount out
            path,           // token path
            recipient,      // recipient
            deadline        // deadline
        )?;

        Ok(result.amounts)
    }
}

// Stylus contracts dapat seamlessly call ANY Solidity contract!
// Full composability dengan DeFi ecosystem.
```

---

## Kasus Penggunaan Ideal untuk Stylus

<div style={{background:'#E3F2FD',borderRadius:'8px',padding:'16px',margin:'16px 0'}}>

### ✅ **Perfect Fit:**

**🎮 Gaming On-Chain**
- Physics engine execution
- Procedural generation
- Complex game logic
- Real-time simulations

**🔐 Advanced Cryptography**
- ZK proof verification
- Complex signature schemes
- Homomorphic encryption
- Post-quantum crypto

**📊 DeFi Algorithms**
- Complex pricing models
- Risk calculations
- Portfolio rebalancing
- High-frequency operations

**🤖 AI/ML On-Chain**
- Neural network inference
- Decision tree execution
- Linear algebra operations
- Model scoring

**📈 Data Processing**
- Large dataset manipulation
- Statistical analysis
- Complex transformations
- Aggregation operations

**🔬 Scientific Computing**
- Simulations
- Numerical analysis
- Mathematical modeling

</div>

---

## Keunggulan Rust untuk Smart Contracts

<div style={{background:'#E8F5E9',borderRadius:'8px',padding:'16px',margin:'16px 0'}}>

### 🦀 **Why Rust is Great:**

**Memory Safety**
- Borrow checker prevents use-after-free
- No double-free bugs
- No buffer overflows
- No null pointer dereferences

**Zero-Cost Abstractions**
- High-level code compiles to efficient low-level code
- No runtime overhead

**Type Safety**
- Catch bugs at compile-time
- Rich type system dengan generics
- Pattern matching untuk safe handling

**No Garbage Collector**
- Deterministic performance
- No GC pauses
- Predictable memory usage

**Rich Ecosystem**
- crates.io dengan 100K+ libraries
- Crypto crates: curve25519, sha3, etc
- Math crates: num, nalgebra
- Serialization: serde, borsh

**Developer Tools**
- cargo (package manager)
- rustfmt (formatter)
- clippy (linter)
- rust-analyzer (IDE support)

**Testing Framework**
- Built-in unit tests
- Integration tests
- Property-based testing (proptest)
- Benchmark support

</div>

---

## Keterbatasan dan Pertimbangan

:::warning ⚠️ **Things to Know:**

**Learning Curve**
- Rust lebih sulit dari Solidity
- Borrow checker butuh waktu untuk dipahami
- Ownership model berbeda dari garbage-collected languages

**Ecosystem Maturity**
- Stylus SDK masih berkembang
- Fewer examples dan tutorials vs Solidity
- Community lebih kecil (sementara)

**Auditor Availability**
- Lebih sedikit auditor familiar dengan Rust smart contracts
- Higher audit costs potentially

**Tooling Gaps**
- IDE support tidak se-mature Solidity
- Debugging tools masih developing
- Block explorer integration terbatas

**Gas Metering**
- Perlu hati-hati dengan loops
- WASM gas metering berbeda dari EVM
- Optimize untuk WASM, bukan EVM

:::

---

## Stylus vs Solidity: When to Choose

| Factor | Choose Solidity (EVM) | Choose Rust (Stylus) |
|--------|----------------------|---------------------|
| **Developer Background** | New to Web3, know JavaScript | Systems programming, know Rust |
| **Performance Needs** | Simple logic, standard DeFi | Compute-heavy, gaming, ML |
| **Audit Requirements** | Need audits soon (more auditors) | Can wait atau internal security |
| **Ecosystem Integration** | Need max composability | Custom logic, less dependencies |
| **Time to Market** | Fast (familiar, many examples) | Slower (learning curve) |
| **Gas Optimization** | Standard operations | Compute-intensive operations |

:::info Best of Both Worlds
**Recommendation:** Start dengan Solidity untuk standard logic (token, governance). Use Stylus untuk compute-heavy modules (cryptography, algorithms).

Mix and match untuk optimal results!
:::

---

## Advanced Example: Signature Verification

Contoh real-world di mana Stylus **50x faster** dan **10x cheaper** dari Solidity:

```rust
use stylus_sdk::prelude::*;
use k256::{
    ecdsa::{Signature, VerifyingKey, signature::Verifier},
    elliptic_curve::sec1::ToEncodedPoint,
};

#[storage]
#[entrypoint]
pub struct SignatureVerifier;

#[public]
impl SignatureVerifier {
    // Verify ECDSA signature (secp256k1)
    pub fn verify_signature(
        &self,
        message: Vec<u8>,
        signature: Vec<u8>,
        public_key: Vec<u8>
    ) -> bool {
        // Parse signature
        let sig = match Signature::try_from(signature.as_slice()) {
            Ok(s) => s,
            Err(_) => return false,
        };

        // Parse public key
        let vk = match VerifyingKey::from_sec1_bytes(&public_key) {
            Ok(k) => k,
            Err(_) => return false,
        };

        // Verify
        vk.verify(&message, &sig).is_ok()
    }
}

// This is 50x faster than Solidity ecrecover!
// Gas cost: ~10x cheaper
// Can verify thousands of signatures economically
```

---

## Development Workflow

### Local Testing

```bash
# Run tests
cargo test

# Run with output
cargo test -- --nocapture

# Test specific function
cargo test test_increment

# Benchmark
cargo bench
```

### Deploy Script

```rust
// deploy.rs
use ethers::prelude::*;

async fn deploy() -> Result<(), Box<dyn std::error::Error>> {
    let provider = Provider::<Http>::try_from(
        "https://sepolia-rollup.arbitrum.io/rpc"
    )?;

    let wallet = "YOUR_PRIVATE_KEY"
        .parse::<LocalWallet>()?
        .with_chain_id(421614u64);

    let client = SignerMiddleware::new(provider, wallet);

    // Deploy contract
    let wasm = include_bytes!("../target/wasm32-unknown-unknown/release/contract.wasm");

    let tx = TransactionRequest::new()
        .data(wasm.to_vec())
        .gas(3_000_000);

    let receipt = client.send_transaction(tx, None).await?.await?;

    println!("Deployed at: {:?}", receipt.contract_address);

    Ok(())
}
```

---

## Resources

<div style={{background:'#f8f9fa',borderRadius:'8px',padding:'16px',margin:'16px 0'}}>

### 📖 **Documentation**
- [Stylus Docs](https://docs.arbitrum.io/stylus) - Official documentation
- [Rust SDK](https://github.com/OffchainLabs/stylus-sdk-rs) - Rust SDK repo
- [Stylus by Example](https://stylus-by-example.org) - Code examples

### 🎓 **Learning Resources**
- [The Rust Book](https://doc.rust-lang.org/book/) - Learn Rust
- [Rustlings](https://github.com/rust-lang/rustlings) - Rust exercises
- [Stylus Workshop](https://github.com/OffchainLabs/stylus-workshop) - Hands-on workshop

### 🛠️ **Tools**
- [Cargo Stylus](https://github.com/OffchainLabs/cargo-stylus) - CLI tool
- [rust-analyzer](https://rust-analyzer.github.io/) - IDE support
- [Stylus Playground](https://stylus-playground.arbitrum.io) - Online editor

</div>

---

## Next Steps

Congratulations! Anda sudah mempelajari **complete Arbitrum ecosystem** - dari fundamental L2 hingga cutting-edge Stylus!

Di modul final, kita akan recap everything dan discuss **next steps** untuk journey Web3 development Anda!

:::success Welcome to the Future 🦀
Stylus membuka Web3 untuk jutaan developers. The multi-language smart contract era has begun!
:::
