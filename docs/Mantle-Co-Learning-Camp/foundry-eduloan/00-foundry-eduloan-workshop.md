---
id: foundry-eduloan-workshop
title: "Foundry Workshop: Testing & Deploy EduLoan"
sidebar_label: "Foundry EduLoan Workshop"
sidebar_position: 0
description: "Workshop lengkap menggunakan Foundry untuk testing, gas optimization, dan deployment EduLoan smart contract ke Mantle Sepolia."
---

# Foundry Workshop: Testing & Deploy EduLoan

## Tentang Workshop Ini

<div style={{background:'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',borderRadius:'12px',padding:'24px',margin:'0 0 24px',color:'#fff'}}>
  <h3 style={{margin:'0 0 12px',fontSize:'20px',fontWeight:'700'}}>Level Up: Dari Remix ke Foundry!</h3>
  <p style={{margin:'0 0 16px',fontSize:'14px',opacity:'0.95'}}>
    Setelah berhasil membuat EduLoan di Remix, saatnya naik level! Workshop ini akan mengajarkan cara professional developers membangun, testing, dan deploy smart contract menggunakan Foundry.
  </p>
  <div style={{display:'flex',gap:'12px',flexWrap:'wrap'}}>
    <span style={{background:'rgba(255,255,255,0.2)',padding:'6px 12px',borderRadius:'20px',fontSize:'12px'}}>⚒️ Foundry</span>
    <span style={{background:'rgba(255,255,255,0.2)',padding:'6px 12px',borderRadius:'20px',fontSize:'12px'}}>🧪 Testing</span>
    <span style={{background:'rgba(255,255,255,0.2)',padding:'6px 12px',borderRadius:'20px',fontSize:'12px'}}>⚡ Gas Optimization</span>
    <span style={{background:'rgba(255,255,255,0.2)',padding:'6px 12px',borderRadius:'20px',fontSize:'12px'}}>🚀 Mantle Sepolia</span>
  </div>
</div>

---

## 🎯 Tujuan Pembelajaran

Setelah menyelesaikan workshop ini, Anda akan mampu:

1. **Setup Foundry** - Install dan konfigurasi Foundry di Windows/Mac
2. **Project Structure** - Memahami struktur project Foundry
3. **Unit Testing** - Menulis comprehensive tests dalam Solidity (bukan JavaScript!)
4. **Fuzz Testing** - Menemukan edge cases dengan random inputs
5. **Gas Optimization** - Teknik optimasi gas dengan measurement akurat
6. **Deployment** - Deploy EduLoan ke Mantle Sepolia dengan script

---

## 💡 Kenapa Foundry?

### Analogi: Remix vs Foundry

**Remix IDE (Yang Sudah Anda Pakai):**
```
🎨 Seperti menggambar dengan pensil dan kertas
- Mudah untuk belajar
- Bagus untuk eksperimen cepat
- Terbatas untuk project besar
- Testing manual satu per satu
```

**Foundry (Professional Tool):**
```
🏭 Seperti pabrik dengan mesin otomatis
- Testing otomatis ratusan kali per detik
- Gas report akurat
- Deployment script reusable
- Industry standard untuk DeFi protocols
```

### Perbandingan Langsung

| Fitur | Remix | Foundry |
|-------|-------|---------|
| **Testing** | Manual klik satu-satu | Otomatis 256+ test cases |
| **Gas Report** | Lihat per transaksi | Report lengkap semua fungsi |
| **Fuzz Testing** | ❌ Tidak ada | ✅ Built-in |
| **Deployment** | Manual via UI | Script otomatis |
| **Speed** | Tergantung browser | ⚡ Super cepat (native Rust) |
| **Professional** | Learning tool | Production-grade |

### Real World Usage

**Protocol yang pakai Foundry:**
- Uniswap V4
- Aave V3
- Compound
- OpenSea Seaport
- Lido
- ...dan ratusan protocol DeFi lainnya!

**Takeaway:** Belajar Foundry = Skill yang dicari industry! 🎯

---

## 📋 Prerequisites

### Yang Harus Sudah Dipahami:

**✅ Dari Mantle Co-Learning Camp:**
- Solidity basics (tipe data, struct, mapping, enum)
- Smart contract structure
- Events dan modifiers
- Payable functions
- EduLoan contract (sudah dibuat di challenge sebelumnya)

**✅ Command Line Basics:**
- Familiar dengan terminal/command prompt
- Navigasi folder (`cd`, `ls`)
- Basic git commands

### Tools yang Dibutuhkan:

**✅ Development:**
- **VS Code** atau code editor pilihan
- **Git** untuk version control
- **Terminal** (built-in di OS)

**✅ Blockchain:**
- **MetaMask** wallet
- **Mantle Sepolia MNT** dari faucet

**💡 TIDAK PERLU Node.js!** Foundry berbasis Rust, tidak butuh npm!

---

## 📚 Struktur Workshop

Workshop dibagi menjadi 4 bagian yang fokus pada **EduLoan smart contract**:

### [📖 Part 1: Instalasi Foundry](./01-instalasi-foundry.md)
- Apa itu Foundry? Foundry Suite (forge, cast, anvil, chisel)
- Instalasi di Windows (Git Bash / WSL)
- Instalasi di Mac (Homebrew)
- Setup project pertama
- Basic commands

### [📖 Part 2: Setup EduLoan Project](./02-setup-eduloan-project.md)
- Membuat Foundry project untuk EduLoan
- Memahami EduLoan contract
- Compile dan inspect contract
- Testing manual dengan Chisel

### [📖 Part 3: Testing EduLoan](./03-testing-eduloan.md)
- Filosofi testing smart contract
- Unit tests untuk semua fungsi EduLoan
- Fuzz testing untuk edge cases
- Test coverage measurement
- Testing best practices

### [📖 Part 4: Gas Optimization & Deployment](./04-gas-optimization-deployment.md)
- Gas optimization techniques
- Membandingkan before/after
- Deploy ke Mantle Sepolia
- Verifikasi contract
- Production checklist

---

## 🛠️ Tech Stack

### Foundry Suite:

| Tool | Fungsi |
|------|--------|
| **forge** | Build, test, deploy smart contracts |
| **cast** | Interact dengan contracts & blockchain |
| **anvil** | Local Ethereum node untuk testing |
| **chisel** | Solidity REPL untuk eksperimen cepat |

### Development:

- **Solidity ^0.8.30** - Smart contract language
- **VS Code** - Code editor dengan Solidity extension
- **Git** - Version control

### Network:

- **Mantle Sepolia Testnet** - Untuk deployment
- **Chain ID:** 5003
- **RPC:** https://rpc.sepolia.mantle.xyz
- **Explorer:** https://sepolia.mantlescan.xyz

---

## 🎮 Project Yang Akan Dibangun

**EduLoan Contract** - Sistem pinjaman pendidikan dengan fitur lengkap:

### Core Features:
- 📝 **Apply Loan** - Mahasiswa mengajukan pinjaman
- ✅ **Approve/Reject** - Admin review pengajuan
- 💰 **Disburse** - Pencairan dana ke borrower
- 💳 **Make Payment** - Pembayaran cicilan
- ⏰ **Check Default** - Cek status gagal bayar

### Testing Coverage:
- ✅ Happy path untuk semua fungsi
- ✅ Revert cases (error handling)
- ✅ Edge cases dengan fuzz testing
- ✅ Access control testing
- ✅ Time-based logic testing

### Gas Optimization:
- ✅ Before/after comparison
- ✅ Optimization techniques applied
- ✅ Gas snapshot tracking

---

## 📅 Alur Pembelajaran

```
Part 1: Setup Foundation
    ↓
    Install Foundry
    Setup VS Code
    Create first project
    ↓
Part 2: Understand EduLoan
    ↓
    Setup EduLoan project
    Compile & inspect
    Manual testing dengan Chisel
    ↓
Part 3: Write Tests
    ↓
    Unit tests semua fungsi
    Fuzz testing
    Coverage 100%
    ↓
Part 4: Optimize & Deploy
    ↓
    Gas optimization
    Deploy ke Mantle Sepolia
    Verify contract
    ↓
    🎉 Production Ready!
```

---

## 💡 Tips Belajar

1. **Ikuti urutan Part 1 → 4** - Jangan skip, setiap part membangun dari sebelumnya
2. **Ketik sendiri, jangan copy-paste** - Muscle memory penting untuk coding
3. **Baca error messages** - Foundry memberikan error yang informatif
4. **Eksperimen dengan Chisel** - Coba variasi untuk memahami lebih dalam
5. **Commit setiap milestone** - Version control adalah best practice

---

## 🔗 Resources

### Mantle Network:

<div style={{background:'#E8F5E9',borderRadius:'8px',padding:'16px',margin:'0 0 18px'}}>
  <p style={{fontSize:'15px',fontWeight:'600',margin:'0 0 12px'}}>🔧 Mantle Sepolia Testnet:</p>

  <div style={{background:'#fff',borderRadius:'6px',padding:'12px',margin:'0 0 10px'}}>
    <p style={{fontSize:'14px',fontWeight:'600',margin:'0 0 6px'}}>Network Details:</p>
    <ul style={{margin:'0',paddingLeft:'20px',fontSize:'13px'}}>
      <li><strong>Network Name:</strong> Mantle Sepolia Testnet</li>
      <li><strong>Chain ID:</strong> 5003</li>
      <li><strong>RPC URL:</strong> https://rpc.sepolia.mantle.xyz</li>
      <li><strong>Currency:</strong> MNT</li>
      <li><strong>Explorer:</strong> https://sepolia.mantlescan.xyz</li>
    </ul>
  </div>

  <div style={{background:'#fff',borderRadius:'6px',padding:'12px'}}>
    <p style={{fontSize:'14px',fontWeight:'600',margin:'0 0 6px'}}>Faucets:</p>
    <a href="https://faucet.sepolia.mantle.xyz/" target="_blank"
       style={{display:'inline-block',padding:'8px 16px',fontSize:'13px',fontWeight:'600',color:'#333',background:'linear-gradient(135deg, #F2A9DD 0%, #C8B2F5 50%, #F7FAE4 100%)',
              textDecoration:'none',borderRadius:'6px',marginRight:'8px'}}>
      🚰 Mantle Faucet
    </a>
  </div>
</div>

### Documentation:

- [Foundry Book](https://book.getfoundry.sh) - Official Foundry documentation
- [Mantle Docs](https://docs.mantle.xyz) - Mantle Network documentation
- [Solidity Docs](https://docs.soliditylang.org) - Solidity language reference

### Community:

- [Discord ETHJKT](https://discord.gg/p5b6RFEnnk) - Ethereum Jakarta community
- [Foundry Telegram](https://t.me/foundry_support) - Foundry community support

---

## 🚀 Ready to Start?

Mari tingkatkan skill Solidity Anda ke level professional!

**[📖 Part 1: Instalasi Foundry →](./01-instalasi-foundry.md)**

---

**#BuildWithFoundry** | **#MantleNetwork** | **#EthereumJakarta**
