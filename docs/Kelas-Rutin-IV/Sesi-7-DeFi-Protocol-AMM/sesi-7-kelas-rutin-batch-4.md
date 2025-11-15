---
sidebar_position: 1
title: "Sesi 7: Decentralized Finance (DeFi) Protocol & Automated Market Makers"
---

# Sesi 7: Decentralized Finance (DeFi) Protocol & Automated Market Makers

## 📋 Overview

**Durasi:** 8 jam (09:00 - 17:00)
**Format:** Offline Workshop
**Level:** Intermediate to Advanced

**Prerequisites:**
- Memahami smart contract development (Sesi 1-2)
- Familiar dengan Solidity dan Hardhat/Foundry
- Memahami token standards (ERC-20)

---

## 🎯 Learning Objectives

Setelah menyelesaikan sesi ini, peserta akan mampu:

1. ✅ Memahami evolusi sistem keuangan dari barter hingga DeFi
2. ✅ Menjelaskan timeline dan milestone penting dalam perkembangan DeFi (2009-2024)
3. ✅ Memahami konsep Automated Market Maker (AMM) secara mendalam
4. ✅ Memahami formula x * y = k dan cara kerjanya
5. ✅ Memahami konsep Liquidity Pool dan Liquidity Provider
6. ✅ Membangun DEX sederhana dengan AMM menggunakan Solidity
7. ✅ Deploy dan test DEX di Lisk Sepolia testnet
8. ✅ Memahami risiko DeFi: Impermanent Loss, slippage, front-running

---

## 📚 Agenda

### **Part 1: Sejarah Sistem Keuangan** (90 menit)
- Zaman Barter (10,000 BC - 3,000 BC)
- Zaman Uang Komoditas: Emas & Perak (3,000 BC - 1900s)
- Zaman Uang Kertas (1661 - sekarang)
- Sistem Banking Modern & Central Banks
- Krisis Perbankan: Dari Great Depression hingga 2008 Financial Crisis
- Masalah dengan Sistem Keuangan Tradisional (TradFi)

### **Part 2: Evolusi Decentralized Finance** (90 menit)
- **2009:** Bitcoin - Digital Money
- **2015:** Ethereum - Smart Contracts & Programmable Agreements
- **2017:** MakerDAO - Collateralized Debt & DAI Stablecoin
- **2018:** Uniswap V1 - Automated Market Makers (AMM)
- **2020:** DeFi Summer - Composability & "Money Legos"
- **2021:** Layer 2 Scaling - Cheaper Transactions
- **2022:** Liquid Staking - Productive Capital
- **2023-2024:** Restaking - Securing Multiple Protocols

**Break: Makan Siang** (60 menit)

### **Part 3: Deep Dive - Automated Market Makers (AMM)** (120 menit)
- Apa itu DEX (Decentralized Exchange)?
- Order Book vs AMM
- Liquidity Pool: Konsep & Mekanisme
- Formula AMM: x * y = k (Constant Product Formula)
- Contoh Praktis dengan Analogi Petani (Whiteboard Crypto)
- Bagaimana Harga Ditentukan oleh Supply & Demand
- Slippage & Price Impact
- Liquidity Provider: Peran & Incentives
- Impermanent Loss: Risiko Utama LP

### **Part 4: Hands-on Lab - Build Your Own DEX** (150 menit)
- Setup project dengan Foundry/Hardhat
- Build Liquidity Pool contract
- Implement core functions:
  - `addLiquidity()`
  - `removeLiquidity()`
  - `swap()`
  - `getAmountOut()` - Price calculation
- Testing dengan Foundry
- Deploy ke Lisk Sepolia
- Interact dengan DEX via frontend (bonus)

### **Part 5: Wrap-up & Q&A** (30 menit)
- Best practices untuk DeFi development
- Security considerations
- Resources untuk belajar lebih lanjut
- Q&A session

---

## 📖 Table of Contents

1. [Part 1: Sejarah Sistem Keuangan](./01-sejarah-sistem-keuangan.md)
2. [Part 2: Evolusi Decentralized Finance](./02-evolusi-defi.md)
3. [Part 3: Understanding Automated Market Makers](./03-understanding-amm.md)
4. [Part 4: Hands-on Lab - Build Simple DEX](./04-build-simple-dex.md)

---

## 🛠️ Tech Stack

### Smart Contract Development
- **Solidity ^0.8.30**
- **Foundry** (testing & deployment)
- **OpenZeppelin Contracts**

### Testing & Deployment
- **Foundry Test Suite**
- **Lisk Sepolia Testnet**
- **Blockscout Explorer**

### Optional: Frontend Integration
- **Next.js 15**
- **Thirdweb SDK**
- **Panna SDK** (gasless swaps!)

---

## 📦 Prerequisites Setup

### 1. Install Foundry
```bash
# Mac/Linux
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Verify
forge --version
cast --version
```

### 2. Clone Starter Template
```bash
git clone https://github.com/ethereum-jakarta/simple-dex-starter
cd simple-dex-starter
forge install
```

### 3. Setup Environment Variables
```bash
cp .env.example .env
# Edit file .env dengan private key dan RPC URL Anda
```

### 4. Dapatkan Testnet ETH
- Faucet: https://sepolia-faucet.lisk.com
- Request 0.5 ETH untuk keperluan testing

---

## 🎓 Key Concepts Preview

### **Automated Market Maker (AMM)**
> "Algoritma yang memungkinkan trading otomatis tanpa order book. Harga ditentukan oleh rasio token di liquidity pool menggunakan formula matematika."

### **Liquidity Pool**
> "Smart contract yang menyimpan dua token (pair) untuk memfasilitasi trading. Seperti 'lampu ajaib' yang menjaga rasio nilai sempurna."

### **Formula: x * y = k**
```
x = jumlah Token A di pool
y = jumlah Token B di pool
k = konstanta yang harus selalu tetap
```

**Contoh:**
- Pool awal: 100 ETH × 200,000 USDC = 20,000,000 (k)
- Setelah swap: 110 ETH × 181,818 USDC = 20,000,000 (k tetap!)

### **Liquidity Provider (LP)**
> "Orang/entitas yang menyetorkan token ke liquidity pool. Sebagai imbalan, mereka mendapat LP tokens dan share dari trading fees."

### **Impermanent Loss**
> "Kerugian sementara yang dialami LP ketika harga token berubah dibanding saat deposit. Disebut 'impermanent' karena hilang jika harga kembali ke titik awal."

---

## 🏗️ What We'll Build

### **SimpleDEX Contract**

**Features:**
- ✅ Liquidity Pool untuk token pair (ETH/TokenA)
- ✅ Add & Remove Liquidity
- ✅ Swap tokens dengan AMM formula
- ✅ LP Token minting/burning
- ✅ Trading fee collection (0.3%)
- ✅ Price calculation & slippage protection

**Contract Architecture:**
```
SimpleDEX.sol
├── State Variables
│   ├── reserve0 (ETH)
│   ├── reserve1 (TokenA)
│   └── totalSupply (LP tokens)
├── Core Functions
│   ├── addLiquidity()
│   ├── removeLiquidity()
│   ├── swap()
│   └── getAmountOut()
└── View Functions
    ├── getReserves()
    ├── getPrice()
    └── calculateSlippage()
```

---

## 📊 Expected Outcomes

Setelah sesi ini, peserta akan memiliki:

1. ✅ **Pemahaman Mendalam:**
   - Mengapa DeFi penting (historical context)
   - Bagaimana AMM bekerja secara detail
   - Trade-offs antara DEX dan CEX

2. ✅ **Skills Teknis:**
   - Build & deploy DEX contract
   - Implement x * y = k formula
   - Test complex financial logic
   - Handle edge cases (slippage, minimum liquidity)

3. ✅ **Portfolio Project:**
   - Working DEX deployed ke testnet
   - Dapat di-showcase untuk job applications
   - Foundation untuk build more complex DeFi protocols

4. ✅ **Security Awareness:**
   - Memahami common DeFi exploits
   - Best practices untuk secure DeFi development
   - Risk management (reentrancy, price manipulation)

---

## 🔗 Resources

### Video References
- [Whiteboard Crypto: What is an Automated Market Maker?](https://www.youtube.com/watch?v=1PbZMudPP5E)
- [Finematics: How Do Liquidity Pools Work?](https://www.youtube.com/watch?v=cizLhxSKrAc)
- [Uniswap V2 Explained](https://www.youtube.com/watch?v=Ehm-OYBmlPM)

### Documentation
- [Uniswap V2 Whitepaper](https://uniswap.org/whitepaper.pdf)
- [Uniswap V2 Core Contracts](https://github.com/Uniswap/v2-core)
- [OpenZeppelin ERC20](https://docs.openzeppelin.com/contracts/4.x/erc20)

### Articles
- [Impermanent Loss Explained](https://academy.binance.com/en/articles/impermanent-loss-explained)
- [Understanding AMM Curves](https://medium.com/balancer-protocol/understanding-automated-market-makers-part-1-price-impact-7d0fc09c4e7a)
- [DeFi Timeline: A History](https://defiprime.com/defi-timeline)

### Tools
- [Desmos AMM Calculator](https://www.desmos.com/calculator/zk1dnmbjlg)
- [Uniswap Liquidity Calculator](https://uniswap.org/calculator)
- [Impermanent Loss Calculator](https://dailydefi.org/tools/impermanent-loss-calculator/)

---

## 🚀 Let's Get Started!

Pada sesi ini, kita akan memulai perjalanan dari **zaman barter 12,000 tahun yang lalu** hingga **DeFi protocols cutting-edge di 2024**.

Kita akan melihat bagaimana manusia telah berevolusi dalam cara bertransaksi, masalah yang muncul di setiap era, dan mengapa blockchain + smart contracts adalah solusi yang revolusioner.

Kemudian, kita akan **membangun sendiri** sebuah Decentralized Exchange (DEX) dengan Automated Market Maker - teknologi yang sama yang digunakan oleh Uniswap, SushiSwap, PancakeSwap, dan ratusan DEX lainnya dengan total volume **triliunan dollar**.

**Ready to dive in?** 🏊‍♂️

Mari kita mulai dengan [Part 1: Sejarah Sistem Keuangan →](./01-sejarah-sistem-keuangan.md)

---

## 📝 Notes untuk Instructor

### Teaching Tips:
1. **Gunakan analogi secara ekstensif** - Konsep DeFi sangat abstrak. Gunakan analogi petani kentang/apel untuk menjelaskan AMM.
2. **Kalkulasi interaktif** - Saat menjelaskan x*y=k, minta peserta menghitung sendiri menggunakan kalkulator.
3. **Live demo sangat penting** - Deploy contract dan tunjukkan swap transactions di Blockscout.
4. **Tekankan aspek keamanan** - DeFi = high stakes. Bug dapat mengakibatkan kerugian jutaan dollar.
5. **Dorong peserta bertanya** - DeFi kompleks, jangan ragu untuk menjelaskan ulang.

### Pacing:
- **Pagi (09:00-12:00):** Fokus teori (Part 1-2)
- **Siang (13:00-17:00):** Fokus hands-on (Part 3-4)
- **Sisipkan istirahat:** Setiap 90 menit
- **Buffer time:** 30 menit untuk Q&A dan troubleshooting

### Common Pitfalls:
- ❌ Terburu-buru menjelaskan formula x*y=k (alokasikan waktu yang cukup!)
- ❌ Tidak menjelaskan impermanent loss dengan jelas (konsep yang sangat membingungkan)
- ❌ Lupa mengetes edge cases (zero amounts, insufficient liquidity)
- ❌ Tidak menunjukkan WHY di balik DeFi (konteks historis sangat penting!)

---

**Prepared by:** Ethereum Jakarta x Lisk
**Last Updated:** November 2025
**Version:** 1.0
