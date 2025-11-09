---
id: sesi-6-batch-4-offline
title: "Sesi 6: Foundry Testing, Gas Optimization, Deployment"
sidebar_label: "#6 Foundry Testing & Deployment"
sidebar_position: 0
description: "Hari keenam Kelas Rutin Batch IV (OFFLINE): Menguasai Foundry framework untuk smart contract testing, gas optimization, dan deployment ke Lisk Sepolia testnet."
---

# Sesi 6: Foundry Testing, Gas Optimization, Deployment

## 📋 Informasi Sesi

**Tanggal**: Sabtu, TBD
**Waktu**: 09:00 - 17:00 WIB (8 jam)
**Lokasi**: Jura Kemanggisan
**Format**: Workshop tatap muka (offline)
**Peserta**: 40-80 pengembang
**Level**: Intermediate - Smart Contract Development & Testing

---

## 🎯 Tujuan Pembelajaran

Setelah menyelesaikan sesi ini, Anda akan mampu:

1. **Memahami Foundry** - Mengapa Foundry adalah toolkit modern untuk smart contract development
2. **Setup Development Environment** - Install Foundry di Windows & Mac, setup project dari scratch
3. **Write Smart Contracts** - Membuat contract dengan best practices menggunakan analogi dunia nyata
4. **Unit Testing** - Menulis comprehensive tests dalam Solidity (bukan JavaScript!)
5. **Gas Optimization** - Teknik optimasi gas fee dengan measurement yang akurat
6. **Deployment** - Deploy ke testnet dengan script yang reusable

---

## 📅 Jadwal Workshop

| Waktu | Durasi | Aktivitas | Format |
|-------|--------|-----------|--------|
| 08:30 - 09:00 | 30m | Registrasi & Setup Environment | Persiapan |
| 09:00 - 09:15 | 15m | Intro: Foundry vs Hardhat & Why Foundry? | Pembukaan |
| 09:15 - 10:45 | 90m | **Module 1**: Instalasi & First Project | Setup + Hands-on |
| 10:45 - 11:00 | 15m | Istirahat | Break |
| 11:00 - 12:30 | 90m | **Module 2**: Smart Contract Development | Hands-on |
| 12:30 - 13:30 | 60m | Istirahat Makan Siang | Lunch |
| 13:30 - 15:00 | 90m | **Module 3**: Unit Testing & Fuzzing | Hands-on |
| 15:00 - 15:15 | 15m | Istirahat | Break |
| 15:15 - 16:45 | 90m | **Module 4**: Gas Optimization & Deployment | Hands-on |
| 16:45 - 17:00 | 15m | Best Practices & Closing | Wrap-up |

---

## 🚀 Prerequisites

### Yang Harus Sudah Dipahami:

**✅ Solidity Basics:**
- Tipe data (uint, string, address, bool)
- Struct, mapping, array
- Functions, modifiers, events
- Basic contract structure

**✅ Command Line:**
- Familiar dengan terminal/command prompt
- Navigasi folder (cd, ls/dir)
- Basic git commands

### Tools yang Dibutuhkan:

**✅ Development Tools:**
- **VS Code** atau code editor pilihan
- **Git** untuk version control
- **Terminal/PowerShell** (sudah built-in di OS)

**✅ Blockchain Tools:**
- **MetaMask** wallet extension
- **Lisk Sepolia ETH** dari faucet untuk testing

**💡 TIDAK PERLU Node.js!** - Foundry adalah Rust-based, tidak butuh npm/node!

---

## 📚 Struktur Dokumentasi

Dokumentasi ini dibagi menjadi 4 bagian yang fokus pada **SimpleBank smart contract** dari awal sampai production:

### [📖 Part 1: Instalasi Foundry](./01-instalasi-foundry.md)
**Module 1 (09:15 - 10:45)**
- Apa itu Foundry? Kenapa menggunakan Foundry?
- Instalasi di Windows (PowerShell + WSL)
- Instalasi di Mac (homebrew)
- Setup VS Code extensions
- Project pertama: forge init
- Struktur project & basic commands

### [📖 Part 2: Membuat SimpleBank Smart Contract](./02-smart-contract-dasar.md)
**Module 2 (11:00 - 12:30)**
- Analogi dunia nyata: Membangun sistem Bank
- Membuat SimpleBank contract dengan fitur:
  - Deposit ETH
  - Withdraw ETH
  - Transfer antar user
- Implementasi events & custom errors
- Security patterns (CEI, reentrancy protection)
- Compile & verifikasi ukuran contract

### [📖 Part 3: Testing SimpleBank Contract](./03-unit-testing.md)
**Module 3 (13:30 - 15:00)**
- Filosofi testing: Mengapa test penting?
- Menulis tests untuk SimpleBank:
  - Test deposit function
  - Test withdraw function
  - Test transfer function
- Fuzz testing untuk edge cases
- Mengukur test coverage
- Testing best practices

### [📖 Part 4: Optimasi & Deployment SimpleBank](./04-gas-optimization.md)
**Module 4 (15:15 - 16:45)**
- Gas optimization untuk SimpleBank
- Membandingkan versi before/after optimization
- Gas snapshot & comparison
- Deploy SimpleBank ke Lisk Sepolia
- Verifikasi contract di Blockscout
- Production deployment checklist

---

## 🎯 Apa Itu Foundry?

### Analogi: Foundry vs Hardhat

**Bayangkan Anda sedang membangun rumah:**

**Hardhat (JavaScript-based):**
```
🏗️ Seperti menggunakan arsitektur + kontraktor terpisah
- Arsitektur (Solidity) pakai bahasa berbeda dari kontraktor (JavaScript)
- Butuh interpreter untuk terjemahkan (Node.js)
- Testing pakai bahasa lain (Mocha/Chai)
- Lebih lambat karena ada translation layer
```

**Foundry (All Solidity):**
```
⚡ Seperti arsitek yang juga kontraktor
- Semua pakai bahasa yang sama (Solidity)
- Tidak butuh interpreter (langsung Rust binary)
- Testing juga di Solidity (1 bahasa!)
- SUPER CEPAT karena native Rust
```

### Kenapa Foundry Populer di 2024-2025?

**Speed:**
- ⚡ **10-100x lebih cepat** dari Hardhat untuk testing
- Compile dalam hitungan detik, bukan menit

**Developer Experience:**
- 🎯 **1 bahasa** untuk semua (Solidity)
- Test ditulis di Solidity, tidak perlu switch context
- Fuzzing built-in untuk find edge cases

**Gas Optimization:**
- 📊 **Gas reports** otomatis & akurat
- Gas snapshot untuk track optimization
- Forge inspect untuk analyze bytecode

**Production Ready:**
- 🔥 Digunakan oleh protokol besar (Uniswap, Aave, Compound)
- Battle-tested di billions of dollars TVL
- Active development & community

---

## 🛠️ Tech Stack

### Foundry Suite:

- **forge** - Build, test, deploy smart contracts
- **cast** - Interact dengan contracts & RPC
- **anvil** - Local Ethereum node (seperti Hardhat node)
- **chisel** - Solidity REPL untuk coba code cepat

### Development Tools:

- **Solidity ^0.8.30** - Smart contract language
- **VS Code** - Code editor
- **soldeer** - Package manager (alternatif npm untuk Solidity)

### Deployment:

- **Lisk Sepolia Testnet** - Testing deployment
- **Blockscout** - Contract verification & block explorer

---

## 💡 Foundry vs Hardhat: Quick Comparison

| Feature | Foundry | Hardhat |
|---------|---------|---------|
| **Language** | Solidity (testing juga!) | JavaScript/TypeScript |
| **Speed** | ⚡⚡⚡ SUPER FAST | 🐢 Slower |
| **Testing** | Solidity (.t.sol) | JavaScript/TypeScript |
| **Fuzzing** | ✅ Built-in | ❌ Perlu plugin |
| **Gas Reports** | ✅ Super akurat | ⚠️ Kurang detail |
| **Learning Curve** | Moderate (1 language) | Easy (JS familiar) |
| **Dependencies** | Rust binary (no npm!) | Node.js + 100+ packages |
| **Use Case** | Protocol dev, auditing | Quick prototypes, familiar JS devs |

**Kapan Pakai Foundry?**
- ✅ Building production protocols
- ✅ Need accurate gas reports
- ✅ Want fast test iterations
- ✅ Security-critical contracts

**Kapan Pakai Hardhat?**
- ✅ Frontend integration (JS ecosystem)
- ✅ Quick hackathon projects
- ✅ Team sudah familiar dengan JS
- ✅ Need extensive plugin ecosystem

**Ideal: Pakai Keduanya!** 🎯
- Foundry untuk testing & optimization
- Hardhat untuk deployment & frontend integration

---

## 📖 Cara Menggunakan Dokumentasi

### Alur Pembelajaran (Linear SimpleBank Journey):

**Part 1: Setup Foundation** → Install Foundry & setup project

**Part 2: Build SimpleBank** → Menulis smart contract SimpleBank dengan:
- Function deposit, withdraw, transfer
- Events & custom errors
- Security patterns

**Part 3: Test SimpleBank** → Menulis tests untuk SimpleBank:
- Test semua functions
- Fuzz testing untuk edge cases
- Measure test coverage

**Part 4: Optimize & Deploy** → Mengoptimasi SimpleBank:
- Gas optimization techniques
- Deploy ke Lisk Sepolia
- Verifikasi di Blockscout

### Tips Belajar:
- ✅ **Ikuti urutan Part 1 → 2 → 3 → 4** - Jangan skip atau loncat-loncat
- ✅ **Praktek setiap command** - Jangan hanya baca, ketik sendiri!
- ✅ **Pahami error messages** - Foundry memberikan error message yang jelas
- ✅ **Fokus pada SimpleBank** - Satu contract dipelajari secara mendalam
- ✅ **Test sebelum optimize** - Pastikan contract bekerja benar dulu

### Troubleshooting:
- Error di Windows? Gunakan WSL atau Git Bash
- `forge: command not found`? Restart terminal setelah instalasi
- Test gagal? Baca error message dan trace dengan `-vvvv`
- Gas tinggi? Lihat Part 4 untuk optimization techniques

---

## 🎮 Project Yang Akan Dibangun

**SimpleBank Contract** - Bank sederhana dengan real-world features:

### Core Features:
- 💰 **Deposit ETH** - Simpan uang ke bank
- 💸 **Withdraw** - Tarik uang (dengan validasi saldo)
- 🔄 **Transfer** - Kirim uang ke user lain
- 📊 **Balance Tracking** - Track saldo setiap user
- 🔒 **Access Control** - Only owner can certain actions
- 📈 **Events** - Log semua transaksi

### Security Features:
- ✅ Reentrancy protection
- ✅ Overflow protection (Solidity ^0.8.0)
- ✅ Access control checks
- ✅ Input validation

### Testing Coverage:
- ✅ Happy path tests
- ✅ Failure cases
- ✅ Edge cases with fuzzing
- ✅ Gas optimization tests

### Analogi Dunia Nyata:
```
SimpleBank = Bank digital seperti BCA/Mandiri mobile

Deposit   = Transfer uang ke rekening
Withdraw  = Tarik tunai di ATM
Transfer  = Transfer antar rekening
Balance   = Cek saldo
Events    = Mutasi rekening

Bedanya: Semua on-chain & transparent! 🔗
```

---

## 🎯 Learning Outcomes

Setelah selesai workshop ini, Anda akan:

**✅ Memahami:**
- Foundry architecture & workflow
- Solidity testing best practices
- Gas optimization techniques
- Smart contract security patterns
- Professional development workflow

**✅ Bisa Membuat:**
- Foundry project dari scratch
- Comprehensive test suites dalam Solidity
- Gas-optimized contracts
- Deployment scripts yang reusable
- Verified contracts di Blockscout

**✅ Siap Untuk:**
- Contribute to DeFi protocols
- Smart contract auditing career
- Build production-grade contracts
- Participate in audit contests (Code4rena, Sherlock)

---

## 📝 Important Notes

### System Requirements:

**Windows:**
- Windows 10/11 (64-bit)
- PowerShell atau WSL2 (recommended)
- ~500MB disk space

**Mac:**
- macOS 10.15 (Catalina) atau lebih baru
- Homebrew package manager
- ~500MB disk space

**Linux:**
- Ubuntu 20.04+ atau equivalent
- ~500MB disk space

### Persiapan Sebelum Workshop:

**1 Hari Sebelum Workshop:**
- Install Git (jika belum punya)
- Pastikan MetaMask sudah setup
- Dapatkan Lisk Sepolia ETH dari faucet
- Download VS Code (optional tapi recommended)

**Pagi Hari Workshop:**
- Charge laptop full battery
- Bawa charger (venue ada power outlet)
- Bawa notebook untuk catatan
- Install Foundry (atau ikuti step saat workshop)

### Lisk Sepolia Network Info:

**Network Details:**
```
Network Name: Lisk Sepolia Testnet
Chain ID: 4202
RPC URL: https://rpc.sepolia-api.lisk.com
Currency Symbol: ETH
Block Explorer: https://sepolia-blockscout.lisk.com
```

**Faucet:**
- Lisk Sepolia Faucet: [https://sepolia-faucet.lisk.com](https://sepolia-faucet.lisk.com)
- Gratis! Request 0.05 ETH per hari

**Add to MetaMask:**
1. Buka MetaMask
2. Klik Networks → Add Network
3. Add Network Manually
4. Masukkan details di atas
5. Save & Switch

---

## 🚀 Ready to Start?

Mari kita mulai perjalanan menjadi Foundry expert!

**Struktur workshop:**
1. 🔧 **Install Foundry** - Setup development environment
2. 🏗️ **Build Contract** - Create SimpleBank dengan real-world logic
3. 🧪 **Write Tests** - Comprehensive testing including fuzzing
4. ⚡ **Optimize Gas** - Reduce gas costs dengan proven techniques
5. 🚀 **Deploy** - Launch to testnet & verify

**[📖 Part 1: Instalasi Foundry →](./01-instalasi-foundry.md)**

---

## 📞 Support & Resources

**Jika mengalami masalah:**
- Tanya instruktur di workshop
- Check Telegram group: Kelas Rutin Batch IV
- Foundry Discord: [https://discord.gg/foundry](https://discord.gg/foundry)
- GitHub Issues: [https://github.com/foundry-rs/foundry](https://github.com/foundry-rs/foundry)

**Learning Resources:**
- [Foundry Book](https://book.getfoundry.sh) - Official documentation
- [Foundry Examples](https://github.com/foundry-rs/foundry-examples)
- [Solidity by Example](https://solidity-by-example.org)
- [Smart Contract Security Best Practices](https://consensys.github.io/smart-contract-best-practices/)

**Community:**
- Foundry Discord (very active!)
- Ethereum Jakarta Telegram
- #FoundryFriday on Twitter

---

**Let's forge ahead! ⚒️🔥**

**#BuildWithFoundry** | **#EthereumJakarta** | **#Web3Indonesia**
