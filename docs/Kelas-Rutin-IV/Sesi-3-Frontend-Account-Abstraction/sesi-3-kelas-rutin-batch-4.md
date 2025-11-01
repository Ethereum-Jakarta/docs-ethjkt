---
id: sesi-3-batch-4-offline
title: "Sesi 3: Frontend DApp Development"
sidebar_label: "#3 Frontend DApp"
sidebar_position: 0
description: "Hari ketiga Kelas Rutin Batch IV (OFFLINE): Membangun frontend DApp dengan Next.js 15, React 19, dan integrasi LiskGarden smart contract menggunakan Panna SDK & Thirdweb."
---

# Sesi 3: Frontend DApp Development

## 📋 Informasi Sesi

**Tanggal**: Sabtu, 1 November 2025
**Waktu**: 09:00 - 17:00 WIB (8 jam)
**Lokasi**: Kampus BINUS Kemanggisan
**Format**: Workshop tatap muka (offline)
**Peserta**: 40-80 pengembang
**Level**: Intermediate - Frontend & Web3 Integration

---

## 🎯 Tujuan Pembelajaran

Setelah menyelesaikan sesi ini, Anda akan mampu:

1. **Setup Modern Frontend Stack** - Next.js 15, React 19, TypeScript, Tailwind CSS
2. **Wallet Connection** - Integrasi wallet menggunakan Panna SDK dengan gasless transactions
3. **Smart Contract Interaction** - Read & write data menggunakan Thirdweb SDK
4. **Component Architecture** - Membangun modular React components
5. **Real-time Updates** - Auto-refresh data dari blockchain
6. **Production Deployment** - Deploy aplikasi ke Vercel

---

## 📅 Jadwal Workshop

| Waktu | Durasi | Aktivitas | Format |
|-------|--------|-----------|--------|
| 08:30 - 09:00 | 30m | Registrasi & Setup Environment | Persiapan |
| 09:00 - 09:15 | 15m | Review Sesi 1-2 & Agenda Hari Ini | Pembukaan |
| 09:15 - 10:45 | 90m | **Module 1**: Setup & Architecture | Theory + Setup |
| 10:45 - 11:00 | 15m | Istirahat | Break |
| 11:00 - 12:30 | 90m | **Module 2**: Contract Integration | Hands-on |
| 12:30 - 13:30 | 60m | Istirahat Makan Siang | Lunch |
| 13:30 - 15:00 | 90m | **Module 3**: UI Components (Part 1) | Hands-on |
| 15:00 - 15:15 | 15m | Istirahat | Break |
| 15:15 - 16:45 | 90m | **Module 3**: UI Components (Part 2) | Hands-on |
| 16:45 - 17:00 | 15m | Deployment & Closing | Wrap-up |

---

## 🚀 Prerequisites

### Yang Harus Sudah Selesai:

**✅ Sesi 1 - Fondasi Web3:**
- Memahami blockchain basics
- Solidity fundamentals
- **LiskGarden smart contract** sudah deployed ke Lisk Sepolia
- **PENTING**: Simpan contract address dari Sesi 1!

### Tools yang Dibutuhkan:

**✅ Development Tools:**
- **Node.js** v18.17+ ([Download](https://nodejs.org))
- **VS Code** atau code editor pilihan
- **Git** untuk version control

**✅ Blockchain Tools:**
- **MetaMask** wallet extension
- **Lisk Sepolia ETH** (dari faucet: [sepolia-faucet.lisk.com](https://sepolia-faucet.lisk.com))
- **LiskGarden Contract Address** dari Sesi 1

**✅ Accounts (Free):**
- **Panna SDK Account** - Sign up di [panna.network](https://panna.network) untuk client ID
- **Thirdweb Account** - Sign up di [thirdweb.com](https://thirdweb.com) untuk client ID (optional)

---

## 📚 Struktur Dokumentasi

Dokumentasi ini dibagi menjadi 3 parts untuk memudahkan pembelajaran:

### [📖 Part 1: Setup & Contract Integration](./01-setup-contract.md)
**Module 1 & 2 (09:15 - 12:30)**
- Setup Next.js 15 + React 19 project
- Install dependencies (Panna SDK, Thirdweb, shadcn/ui)
- Configure Lisk Sepolia network
- Setup contract types & ABI
- Create contract interaction utilities
- Build custom React hooks (useContract, usePlants)

### [📖 Part 2A: Building UI Components](./02-building-ui-COMPLETE.md)
**Module 3 Part A (13:30 - 15:00)**
- GardenHeader (wallet connection dengan Panna SDK)
- usePlantStageScheduler (auto-sync plant stages)
- PlantCard (individual plant cards)
- GardenGrid (responsive grid layout)

### [📖 Part 2B: Building UI Components (Lanjutan)](./02-building-ui-part-b.md)
**Module 3 Part B (15:15 - 16:45)**
- PlantDetailsModal (modal lengkap dengan visualization & actions)
- PlantSeedModal (modal untuk planting seeds)
- StatsSidebar (real-time statistics & game info)
- Main page.tsx (menggabungkan semua components)

### [📖 Part 3: Deployment & Production](./03-deployment.md)
**Deployment (16:45 - 17:00)**
- Build optimization
- Environment variables setup
- Deploy ke Vercel
- Testing production build

---

## 🎮 Aplikasi Yang Akan Dibangun

**LiskGarden DApp** - Game blockchain sederhana dengan mekanik:

### Core Features:
- 🌱 **Plant Seeds** - Tanam seed dengan bayar 0.001 ETH
- 💧 **Water Plants** - Siram plants untuk menjaga tetap hidup
- 📈 **Growth Stages** - Plants tumbuh melalui 4 stage dalam 3 menit
- 🌸 **Harvest Rewards** - Panen blooming plants untuk dapat 0.003 ETH
- ⚠️ **Water Depletion** - Water berkurang 20% setiap 30 detik
- 🔄 **Auto-Refresh** - Data update otomatis setiap 5 detik
- ⚡ **Gasless Transactions** - Gratis! Tidak perlu bayar gas fee (via Panna SDK)

### Growth Timeline (Total 3 menit):
1. 🌱 **Seed** (0-1 menit)
2. 🌿 **Sprout** (1-2 menit)
3. 🪴 **Growing** (2-3 menit)
4. 🌸 **Blooming** (Siap panen!)

### Game Economics:
- **Plant Cost**: 0.001 ETH
- **Harvest Reward**: 0.003 ETH
- **Profit**: 3x ROI (200% profit!)
- **Water Depletion**: 20% setiap 30 detik
- **Gas Fees**: GRATIS via Panna SDK Account Abstraction

---

## 🛠️ Tech Stack

### Frontend Framework:
- **Next.js 15.2.4** - React framework dengan App Router
- **React 19** - Latest React version
- **TypeScript 5** - Type safety
- **Tailwind CSS 4** - Utility-first CSS framework

### UI Components:
- **shadcn/ui** - Component library (built on Radix UI)
- **Lucide React** - Icon library
- **Geist Font** - Modern font dari Vercel

### Web3 Integration:
- **Panna SDK 0.1.0** - Wallet connection + Account Abstraction (gasless!)
- **Thirdweb SDK** - Smart contract interactions
- **ethers v6** - Ethereum utilities

### Development Tools:
- **next-themes** - Dark/light mode
- **sonner** - Toast notifications (via shadcn/ui)
- **date-fns** - Date formatting

### Deployment:
- **Vercel** - Hosting platform
- **Lisk Sepolia** - Blockchain network (Chain ID: 4202)

---

## 💡 Key Concepts: Panna SDK & Account Abstraction

### Apa itu Account Abstraction?

**Traditional Wallet (EOA):**
```
❌ User harus punya ETH untuk gas fees
❌ Setiap transaction butuh approve di wallet
❌ Kehilangan private key = kehilangan semua
❌ Complex UX untuk non-crypto users
```

**Account Abstraction (via Panna SDK):**
```
✅ Gasless transactions - app sponsor gas fees
✅ Better UX - seperti Web2 apps
✅ Smart contract wallet - programmable
✅ Social recovery options
```

### Panna SDK Features:

**🎯 Yang Sudah Otomatis:**
- ✅ **Gasless Transactions** - User tidak perlu bayar gas!
- ✅ **Wallet Connection** - Support MetaMask, WalletConnect, dll
- ✅ **Account Abstraction** - Smart contract wallet automatic
- ✅ **Multi-chain Support** - Mudah switch network

**📝 Yang Kita Lakukan:**
```typescript
// Cukup wrap app dengan PannaProvider
<PannaProvider clientId="..." partnerId="...">
  {children}
</PannaProvider>

// Gasless transactions OTOMATIS aktif! 🎉
```

---

## 📖 Cara Menggunakan Dokumentasi

### Navigasi:
1. Mulai dari **Part 1** (Setup & Contract Integration)
2. Lanjut ke **Part 2** (Building UI Components)
3. Selesaikan dengan **Part 3** (Deployment)
4. Setiap part memiliki link navigasi di bagian bawah

### Tips Belajar:
- ✅ **Follow step-by-step** - Jangan skip langkah apapun
- ✅ **Type code manually** - Jangan hanya copy-paste
- ✅ **Test incrementally** - Test setelah setiap section
- ✅ **Ask questions** - Instruktur siap membantu
- ✅ **Git commit** - Commit progress setelah setiap module

### Troubleshooting:
- Jika ada error, cek browser console (F12)
- Pastikan semua dependencies terinstall
- Verify contract address di `.env.local`
- Check wallet connected & network correct

---

## 🎯 Learning Outcomes

Setelah selesai workshop ini, Anda akan:

**✅ Memahami:**
- Modern Web3 frontend architecture
- Panna SDK untuk wallet management & gasless transactions
- Thirdweb SDK untuk contract interactions
- React hooks untuk Web3 operations
- Real-time blockchain data handling
- Production deployment best practices

**✅ Bisa Membuat:**
- Full-stack DApp dengan Next.js 15
- Wallet integration dengan multiple providers
- Interactive UI dengan real-time updates
- Production-ready Web3 application

**✅ Siap Untuk:**
- Build hackathon projects
- Apply to Lisk EMpower Fund
- Contribute to Web3 open source
- Career sebagai Web3 developer

---

## 📝 Important Notes

### Contract Address dari Sesi 1:
Pastikan Anda punya **LiskGarden contract address** yang sudah deploy di Sesi 1.

**Example Contract Address:**
```
0xf44adEdec3f5E7a9794bC8E830BE67e4855FA8fF
```

### Lisk Sepolia Network Info:
```
Chain ID: 4202
RPC URL: https://rpc.sepolia-api.lisk.com
Explorer: https://sepolia-blockscout.lisk.com
Faucet: https://sepolia-faucet.lisk.com
```

### Panna SDK Setup:
Anda perlu mendaftar di [panna.network](https://panna.network) untuk mendapatkan:
- `NEXT_PUBLIC_PANNA_CLIENT_ID`
- `NEXT_PUBLIC_PANNA_PARTNER_ID`

Kedua credentials ini GRATIS dan akan enable gasless transactions!

---

## 🚀 Ready to Start?

Mari kita mulai membangun DApp pertama Anda dengan gasless transactions!

**[📖 Part 1: Setup & Contract Integration →](./01-setup-contract.md)**

---

## 📞 Support & Resources

**Jika mengalami masalah:**
- Tanya instruktur di workshop
- Check Telegram group: Kelas Rutin Batch IV
- Refer to [Lisk Docs](https://docs.lisk.com)
- Review [Panna SDK Docs](https://docs.panna.network)
- Review [Thirdweb Docs](https://portal.thirdweb.com)

**Learning Resources:**
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com)

---

**Let's build your first gasless DApp! 🚀**

**#BuildOnLisk** | **#EthereumJakarta** | **#Web3Indonesia**
