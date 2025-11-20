---
id: persiapan-setup-environment
title: "Part 1: Persiapan & Setup Environment"
sidebar_label: "Part 1: Persiapan"
sidebar_position: 1
description: "Panduan lengkap setup MetaMask, network Sepolia, dan persiapan environment untuk workshop Web3 Vibe Raffle"
---

# Part 1: Persiapan & Setup Environment

> **"Persiapan yang baik = 50% kesuksesan workshop!"** 🎯

---

## 🎯 Tujuan Part Ini

Setelah menyelesaikan setup ini, kamu akan punya:

- ✅ MetaMask wallet yang siap digunakan
- ✅ Network Base Sepolia terkonfigurasi
- ✅ ETH Base Sepolia di wallet (gratis dari faucet!)
- ✅ Remix IDE yang sudah dicoba & tested
- ✅ Confidence untuk join workshop 🚀

**Estimasi waktu:** 15-20 menit (kalau lancar)

---

## 📋 Checklist Persiapan

Gunakan checklist ini untuk memastikan semua siap:

### Perangkat & Koneksi
- [ ] Laptop/PC sudah dinyalakan & battery full/tercolok
- [ ] Browser modern terinstall (Chrome/Brave/Firefox)
- [ ] Koneksi internet stabil (test buka beberapa website)
- [ ] Charger laptop dibawa (jaga-jaga!)

### Software & Accounts
- [ ] MetaMask extension terinstall di browser
- [ ] Wallet MetaMask sudah dibuat
- [ ] Seed phrase disimpan aman (tulis di kertas/password manager)
- [ ] Network Base Sepolia sudah ditambahkan
- [ ] Punya minimal 0.05 ETH Base Sepolia

### Test Environment
- [ ] Bisa buka [Remix](https://remix.ethereum.org) tanpa error
- [ ] Bisa buka [Base Sepolia BaseScan](https://sepolia.basescan.org)
- [ ] MetaMask bisa connect ke Remix

---

## 🦊 Step 1: Install MetaMask

### Apa Itu MetaMask?

**MetaMask** adalah wallet digital untuk Ethereum & blockchain lainnya.

**Analogi:**
```
MetaMask = Dompet + Kartu ATM + Tanda Tangan Digital

Seperti:
- Dompet: Simpan ETH & token
- Kartu ATM: Terima & kirim uang
- Tanda tangan: Approve transaksi
```

**Kenapa MetaMask?**
- 🦊 Paling populer (100+ juta pengguna)
- 🔒 Open source & secure
- 🌐 Support banyak network (Ethereum, Polygon, BSC, dll)
- 🔌 Integrasi mudah dengan dApps

---

### Instalasi MetaMask

#### **Untuk Chrome / Brave:**

1. **Buka Chrome Web Store**
   ```
   https://chrome.google.com/webstore/category/extensions
   ```

2. **Search "MetaMask"**
   - Atau langsung ke: https://metamask.io/download/

3. **Klik "Add to Chrome"**

4. **Klik "Add Extension"** saat konfirmasi muncul

5. **Tunggu download selesai** (~5 detik)

6. **Icon MetaMask 🦊 akan muncul** di toolbar browser (kanan atas)

---

#### **Untuk Firefox:**

1. **Buka Firefox Add-ons**
   ```
   https://addons.mozilla.org/en-US/firefox/
   ```

2. **Search "MetaMask"**

3. **Klik "Add to Firefox"**

4. **Klik "Add"** saat konfirmasi

5. **Pin extension** ke toolbar (klik icon puzzle → pin MetaMask)

---

### Setup Wallet Baru

**PENTING: Buat wallet BARU khusus workshop (recommended)**

Kenapa?
- ✅ Lebih aman (terpisah dari wallet utama)
- ✅ Fokus untuk testnet saja
- ✅ Tidak khawatir salah klik

**Langkah:**

1. **Klik icon MetaMask 🦊**

2. **Klik "Get Started"** (atau "Create a Wallet" kalau sudah pernah install)

3. **Pilih "Create a new wallet"**

4. **Setujui Terms of Use**

5. **Buat Password**
   - Minimal 8 karakter
   - Gunakan password yang kuat (kombinasi huruf, angka, simbol)
   - **Simpan password ini!** (Tidak bisa di-recover)

6. **Watch Video Tutorial** (opsional tapi recommended)

7. **Reveal Seed Phrase** (12 kata rahasia)

---

### 🔒 SANGAT PENTING: Seed Phrase

**Apa itu Seed Phrase?**

12 kata bahasa Inggris yang adalah **master key** wallet kamu.

**Contoh:**
```
witch collapse practice feed shame open despair
creek road again ice least
```

**Fungsi:**
- 🔑 Bisa restore wallet di device lain
- 🔑 Bisa akses wallet kalau lupa password
- 🔑 Satu-satunya cara recover wallet

**RULES EMAS:**

```
✅ DO:
- Tulis di kertas & simpan di tempat aman
- Simpan di password manager encrypted (1Password, Bitwarden)
- Buat backup di 2-3 tempat berbeda
- Catat urutan yang BENAR (urutan penting!)

❌ DON'T:
- JANGAN foto & simpan di cloud/email
- JANGAN share ke siapa pun (even instructor!)
- JANGAN ketik di website random
- JANGAN simpan di file text di komputer
- JANGAN sambil di-screenshot saat video call
```

**Kalau seed phrase hilang = wallet hilang selamanya!**
**Kalau seed phrase dicuri = uang kamu dicuri!**

---

8. **Konfirmasi Seed Phrase**
   - MetaMask akan minta kamu klik kata-kata sesuai urutan
   - Ini untuk memastikan kamu benar-benar catat

9. **Done! Wallet Created** 🎉

Kamu akan lihat:
```
Account 1
0x1234...5678  (address wallet kamu)
0 ETH
```

---

### Memahami MetaMask Interface

**Main Components:**

```
┌─────────────────────────────────┐
│  [Network] ▼     [Account] ▼    │  ← Network selector & Account
├─────────────────────────────────┤
│                                  │
│      Account 1                   │
│   0x1234...5678                  │  ← Your address
│                                  │
│      0 ETH                       │  ← Your balance
│                                  │
├─────────────────────────────────┤
│   [Buy]  [Send]  [Swap]         │  ← Actions
├─────────────────────────────────┤
│   Assets    Activity             │  ← Tabs
│                                  │
│   No tokens yet                  │
│                                  │
└─────────────────────────────────┘
```

**Istilah Penting:**

| Istilah | Artinya |
|---------|---------|
| **Address** | Alamat wallet kamu (seperti no. rekening) - boleh di-share |
| **Balance** | Saldo ETH yang kamu punya |
| **Network** | Blockchain yang sedang aktif (Mainnet, Sepolia, dll) |
| **Account** | Satu wallet bisa punya banyak account |
| **Gas** | Biaya transaksi (seperti biaya admin bank) |

---

## 🌐 Step 2: Tambahkan Network Base Sepolia

### Apa Itu Network di MetaMask?

**Analogi:**
```
Network = Server / Region berbeda

Seperti:
- WhatsApp di Indonesia vs Amerika (beda server, tapi app sama)
- Garena Indonesia vs Garena Global (beda server game)
```

**Network di Blockchain:**

| Network | Fungsi | ETH-nya |
|---------|--------|---------|
| **Ethereum Mainnet** | Production (real money) | Bernilai $$$ |
| **Base Mainnet** | Layer 2 Ethereum (production) | Bernilai $$$ |
| **Base Sepolia** | Testing & learning (Base testnet) | Gratis (no value) |
| **Ethereum Sepolia** | Ethereum testnet | Gratis (no value) |
| **Polygon, Arbitrum, dll** | Layer 2 networks | Beda ecosystem |

**Untuk workshop ini: BASE SEPOLIA TESTNET** 🎯

---

### Cara Tambahkan Base Sepolia Network

#### **Method 1: Manual (Recommended - Paham Step by Step)**

1. **Klik dropdown "Ethereum Mainnet"** di kiri atas MetaMask

2. **Scroll ke bawah → Klik "Add Network"**

3. **Klik "Add a network manually"** (di bawah)

4. **Isi Form Berikut:**

```
Network Name:
Base Sepolia

New RPC URL:
https://sepolia.base.org

Chain ID:
84532

Currency Symbol:
ETH

Block Explorer URL (Optional):
https://sepolia.basescan.org
```

5. **Klik "Save"**

6. **Klik "Switch to Base Sepolia"** (atau switch manual dari dropdown)

7. **Done!** Sekarang kamu di Base Sepolia network 🎉

---

#### **Method 2: Via Chainlist (Cepat)**

1. **Buka website:**
   ```
   https://chainlist.org
   ```

2. **Connect MetaMask** (klik "Connect Wallet")

3. **Search "Base Sepolia"** di search bar

4. **Klik "Add to MetaMask"** di Base Sepolia

5. **Approve di MetaMask** popup

6. **Switch network** kalau diminta

7. **Done!** 🚀

---

### Verifikasi Network Sudah Benar

Cek MetaMask:
```
✅ Dropdown network menunjukkan: "Base Sepolia"
✅ Chain ID: 84532
✅ Saldo: 0 ETH (normal, kita akan isi dari faucet)
```

**Screenshot untuk referensi:**
```
┌─────────────────────────────────┐
│  Base Sepolia ▼                  │  ← Harus ini!
│                                  │
│      Account 1                   │
│   0x1234...5678                  │
│                                  │
│      0 ETH                       │  ← Normal, isi nanti
│                                  │
└─────────────────────────────────┘
```

---

## 💧 Step 3: Dapatkan ETH Base Sepolia dari Faucet

### Apa Itu Faucet?

**Faucet** = Keran virtual yang kasih ETH testnet gratis.

**Analogi:**
```
Faucet = Dispenser air minum gratis di kantor

- Gratis untuk semua
- Ada batas per orang (misal: 0.1 ETH/hari)
- Untuk keperluan testing, bukan dijual
```

**Kenapa gratis?**
- ETH testnet tidak punya nilai uang
- Untuk memudahkan developer belajar & testing
- Didanai oleh komunitas & yayasan (Base = Coinbase)

---

### Cara Pakai Faucet

**Faucet Recommended untuk Base Sepolia:**

#### **Option 1: Base Sepolia Faucet (Official - Paling Mudah)**

Website: **https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet**

**Cara:**

1. **Buka website faucet**

2. **Sign in dengan Coinbase account**
   - Kalau belum punya, sign up gratis (1 menit)
   - Atau bisa pakai Google/Email

3. **Copy address MetaMask kamu:**
   - Buka MetaMask
   - Pastikan network sudah **Base Sepolia**
   - Klik address → akan auto-copy
   - Atau klik icon copy ⎘

4. **Paste address di faucet**

5. **Klik "Send Me ETH"**

6. **Tunggu ~30 detik**

7. **Check MetaMask** - ETH akan masuk!

**Amount:**
- Dapat 0.05-0.1 ETH per request
- Limit: 1x per 24 jam

**Tips:**
- Untuk workshop, 0.05 ETH sudah cukup (gas Base murah!)
- Coinbase account gratis & mudah dibuat

---

#### **Option 2: Alchemy Base Sepolia Faucet**

Website: **https://www.alchemy.com/faucets/base-sepolia**

**Cara:**

1. **Sign up Alchemy** (gratis)
   - Bisa pakai Google account

2. **Login**

3. **Paste address Base Sepolia kamu**

4. **Klik "Send Me ETH"**

5. **Dapat 0.1 ETH** (langsung!)

**Pros:**
- Instant (tidak perlu mining)
- Generous (0.1 ETH)

**Cons:**
- Butuh account
- Kadang queue kalau ramai

---

#### **Option 3: QuickNode Base Sepolia Faucet**

Website: **https://faucet.quicknode.com/base/sepolia**

**Cara:**

1. **Buka website**

2. **Connect wallet** atau paste address manual

3. **Verify (kadang butuh Twitter follow atau CAPTCHA)**

4. **Dapat ETH**

**Tips:**
- Reliable & fast
- Limit: 1x per hari per address

---

### Verifikasi ETH Sudah Masuk

**Check di MetaMask:**
```
┌─────────────────────────────────┐
│  Base Sepolia ▼                  │
│                                  │
│      Account 1                   │
│   0x1234...5678                  │
│                                  │
│      0.05 ETH                    │  ← Harusnya ada angka!
│                                  │
└─────────────────────────────────┘
```

**Check di BaseScan:**

1. Copy address kamu

2. Buka: **https://sepolia.basescan.org**

3. Paste di search bar

4. Lihat:
   - **Balance:** 0.05 ETH (atau jumlah yang kamu dapat)
   - **Transactions:** Ada 1 tx (incoming dari faucet)

**Screenshot transaksi:**
```
Transaction Details
From: Faucet (0xabc...)
To: Your Address (0x123...)
Value: 0.05 ETH
Network: Base Sepolia
Status: Success ✅
```

---

### Troubleshooting Faucet

**Problem: Faucet tidak kasih ETH**

Solusi:
- Coba faucet lain dari list
- Tunggu beberapa jam (mungkin daily limit habis)
- Pastikan address yang di-paste BUKAN mainnet (harus 0x...)

---

**Problem: ETH lama masuk**

Solusi:
- Tunggu 1-2 menit (blockchain butuh waktu)
- Refresh MetaMask (klik icon refresh ↻)
- Check di BaseScan - kalau di sana ada berarti sudah masuk

---

**Problem: Mining di PoW faucet stuck**

Solusi:
- Jangan close tab saat mining
- Pastikan laptop tidak sleep
- Kalau stuck, refresh & mulai lagi

---

## 🎨 Step 4: Setup Remix IDE

### Apa Itu Remix?

**Remix** adalah IDE (Integrated Development Environment) online untuk menulis, compile, dan deploy smart contract Solidity.

**Analogi:**
```
Remix = Google Docs untuk Smart Contract

Seperti:
- Google Docs: Nulis dokumen di browser (no install)
- Remix: Nulis smart contract di browser (no install)
```

**Kenapa Remix?**
- 🌐 Online - tidak perlu install
- 🚀 Fast - langsung bisa coding
- 🔧 Lengkap - compile, deploy, debug dalam 1 tool
- 📚 Banyak template & contoh
- 🔌 Integrasi langsung dengan MetaMask

---

### Cara Buka Remix

1. **Buka browser**

2. **Ke website:**
   ```
   https://remix.ethereum.org
   ```

3. **Tunggu load** (~5 detik)

4. **Remix IDE akan terbuka!**

---

### Tour Interface Remix

```
┌───────────────────────────────────────────────────┐
│  [File Explorer] │   [Editor]   │  [Compiler]     │
│                  │               │                 │
│  📁 contracts/   │ // Contract   │  Solidity       │
│    - Token.sol   │ code here     │  Compiler       │
│    - NFT.sol     │               │                 │
│                  │               │  [Compile]      │
│  📁 scripts/     │               │                 │
│  📁 tests/       │               │  [Deploy]       │
│                  │               │                 │
│  [+ New File]    │               │  Environment:   │
│                  │               │  [Injected]     │
└───────────────────────────────────────────────────┘
```

**Main Components:**

| Section | Fungsi |
|---------|--------|
| **File Explorer** (kiri) | Lihat & manage files |
| **Editor** (tengah) | Tulis kode Solidity |
| **Compiler** (kanan) | Compile contract |
| **Deploy** (kanan bawah) | Deploy ke blockchain |
| **Terminal** (bawah) | Lihat logs & errors |

---

### Test Remix Bisa Jalan

**Quick Test:**

1. **Klik icon "File Explorer"** (📁) di kiri

2. **Klik kanan di folder `contracts`**

3. **Klik "New File"**

4. **Nama file:** `HelloWorld.sol`

5. **Paste kode ini:**

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract HelloWorld {
    string public message = "Hello, Web3 Week Asia!";

    function getMessage() public view returns (string memory) {
        return message;
    }
}
```

6. **Klik icon "Solidity Compiler"** (📊) di sidebar kiri

7. **Klik "Compile HelloWorld.sol"**

8. **Harusnya muncul:**
   ```
   ✅ Compilation successful
   ```

9. **Klik icon "Deploy"** (🚀) di sidebar kiri

10. **Pilih Environment:**
    ```
    Remix VM (Shanghai) ← Pilih ini untuk test
    ```

11. **Klik "Deploy"**

12. **Contract akan muncul di "Deployed Contracts"**

13. **Klik `message` atau `getMessage()` → Harusnya muncul:**
    ```
    "Hello, Web3 Week Asia!"
    ```

**Kalau berhasil = Remix works!** ✅

---

### Connect Remix ke MetaMask

**Ini penting untuk workshop nanti!**

1. **Buka Remix**

2. **Klik icon "Deploy" (🚀)**

3. **Di "Environment" dropdown, pilih:**
   ```
   Injected Provider - MetaMask
   ```

4. **MetaMask akan popup** - Klik "Next" → "Connect"

5. **Remix sekarang connected ke MetaMask!**

6. **Verify:**
   ```
   Environment: Injected Provider - MetaMask
   Network: Base Sepolia (84532)
   Account: 0x1234...5678 (0.05 ETH)
   ```

**Screenshot:**
```
┌─────────────────────────────────┐
│ DEPLOY & RUN TRANSACTIONS       │
├─────────────────────────────────┤
│ Environment                      │
│ [Injected Provider - MetaMask] ▼ │  ← Ini!
├─────────────────────────────────┤
│ Account                          │
│ 0x1234...5678 (0.05 ether)      │  ← Your account
├─────────────────────────────────┤
│ Gas limit: 3000000              │
│                                  │
│ [Deploy]                         │
└─────────────────────────────────┘
```

**Done!** Remix siap untuk deploy ke Base Sepolia 🚀

---

## ✅ Final Checklist: Siap Workshop?

Pastikan semua ini sudah ✅ sebelum workshop:

### Environment Setup
- [ ] MetaMask extension terinstall
- [ ] Wallet baru sudah dibuat (atau pakai wallet testnet existing)
- [ ] Seed phrase sudah dicatat & disimpan aman
- [ ] Network **Base Sepolia** sudah ditambahkan di MetaMask
- [ ] Saldo: Punya minimal 0.05 ETH Base Sepolia

### Test Connections
- [ ] Bisa buka Remix di https://remix.ethereum.org
- [ ] Bisa compile contract di Remix
- [ ] Remix bisa connect ke MetaMask (Injected Provider)
- [ ] Environment menunjukkan "Base Sepolia (84532)" network
- [ ] Account address & balance terlihat di Remix

### Browser & Internet
- [ ] Browser tidak block Remix atau MetaMask
- [ ] Koneksi internet stabil (test buka BaseScan)
- [ ] Laptop battery full atau tercolok listrik

### Optional (Bagus Kalau Ada)
- [ ] Sudah baca overview workshop di file utama
- [ ] Sudah join group Telegram/Discord workshop
- [ ] Sudah bookmark Base Sepolia BaseScan
- [ ] Sudah copy address wallet untuk quick access

---

## 🎯 Quick Reference

### URLs Penting

**Tools:**
```
Remix IDE:
https://remix.ethereum.org

Base Sepolia Explorer (BaseScan):
https://sepolia.basescan.org

Chainlist:
https://chainlist.org
```

**Faucets ETH Base Sepolia:**
```
Coinbase Base Sepolia Faucet (Recommended):
https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet

Alchemy Faucet:
https://www.alchemy.com/faucets/base-sepolia

QuickNode Faucet:
https://faucet.quicknode.com/base/sepolia
```

**Faucet USDC (untuk Owner/Instructor):**
```
Circle USDC Faucet:
https://faucet.circle.com/

Note: USDC testnet diperlukan untuk fund prize pool.
Peserta tidak perlu USDC (join game gratis).
Hanya instructor/owner yang perlu USDC untuk hadiah.
```

**Guides:**
```
MetaMask Setup:
https://metamask.io/faqs/

Remix Documentation:
https://remix-ide.readthedocs.io

Base Official Docs:
https://docs.base.org
```

---

### Base Sepolia Network Info

**Copy-paste ini kalau perlu add network manual:**

```
Network Name: Base Sepolia
RPC URL: https://sepolia.base.org
Chain ID: 84532
Currency Symbol: ETH
Explorer: https://sepolia.basescan.org
```

**USDC Contract Address (Base Sepolia):**
```
0x036CbD53842c5426634e7929541eC2318f3dCF7e
```

---

### Shortcut Keys (Remix)

```
Ctrl/Cmd + S         = Save file
Ctrl/Cmd + Shift + F = Format code
Ctrl/Cmd + /         = Comment/uncomment
Ctrl/Cmd + F         = Find in file
```

---

## 🐛 Troubleshooting Common Issues

### Issue: MetaMask Tidak Muncul di Browser

**Solusi:**
1. Cek apakah extension sudah terinstall:
   - Chrome: `chrome://extensions`
   - Firefox: `about:addons`
2. Kalau ada tapi tidak muncul:
   - Klik icon puzzle 🧩 di toolbar
   - Pin MetaMask ke toolbar
3. Kalau benar-benar tidak ada:
   - Install ulang dari official website
   - Restart browser

---

### Issue: Tidak Bisa Switch ke Base Sepolia

**Solusi:**
1. Pastikan RPC URL benar: `https://sepolia.base.org`
2. Chain ID harus: `84532` (bukan yang lain!)
3. Coba add via Chainlist instead of manual
4. Restart MetaMask (klik icon → Settings → Advanced → Reset)

---

### Issue: Faucet Tidak Kasih ETH

**Solusi:**
1. Tunggu 5-10 menit (blockchain butuh waktu)
2. Check di BaseScan - paste address kamu
3. Coba faucet lain dari list
4. Pastikan pakai address yang benar (copy fresh dari MetaMask)
5. Kalau semua gagal, tanya di group chat workshop

---

### Issue: Remix Tidak Bisa Connect ke MetaMask

**Solusi:**
1. **Refresh Remix** (F5)
2. **Di MetaMask:**
   - Settings → Connected sites
   - Pastikan Remix ada di list
   - Kalau tidak ada, reconnect
3. **Di Remix:**
   - Deploy tab → Environment → Pilih "Injected Provider"
   - Approve di MetaMask popup
4. **Kalau masih gagal:**
   - Clear browser cache
   - Restart browser
   - Try different browser (Chrome recommended)

---

### Issue: ETH Base Sepolia Tidak Cukup untuk Gas

**Problem:**
```
Error: Insufficient funds for gas
```

**Solusi:**
1. Ke faucet lagi → minta lebih
2. Untuk workshop, 0.05 ETH Base Sepolia harusnya cukup (gas Base murah!)
3. Kalau masih kurang, bisa minta dari instructor saat workshop

---

## 🎓 Apa Selanjutnya?

### Kamu Sudah Siap Kalau:
✅ Punya MetaMask wallet
✅ Network Base Sepolia aktif
✅ Punya ETH Base Sepolia (min 0.05)
✅ Remix bisa connect ke MetaMask

### Next Steps:

**Sebelum Workshop:**
- [ ] Test deploy contract dummy di Remix (opsional)
- [ ] Familiarize dengan MetaMask interface
- [ ] Join group chat workshop

**Saat Workshop:**
- [ ] Bawa laptop & charger
- [ ] Pastikan internet connect
- [ ] Buka Remix & connect MetaMask
- [ ] Ready to code! 🚀

---

## 📚 Resources Tambahan

**Untuk Belajar Lebih:**
- [MetaMask Official Guide](https://metamask.io/faqs/)
- [Remix IDE Tutorial](https://remix-ide.readthedocs.io)
- [Ethereum Sepolia Info](https://sepolia.dev)
- [Solidity by Example](https://solidity-by-example.org)

**Video Tutorials:**
- Search YouTube: "MetaMask setup tutorial"
- Search YouTube: "Remix IDE tutorial"

**Community:**
- Ethereum Stack Exchange (untuk tanya teknis)
- Reddit r/ethdev (developer community)

---

## 🚀 Ready for Part 2!

Sekarang environment sudah ready, saatnya pahami smart contract!

**[📖 Part 2: Memahami Smart Contract SimpleVibeRaffle →](./02-smart-contract-raffle.md)**

---

**[← Back to Workshop Overview](./web3-vibe-raffle-workshop.md)** | **[Next: Part 2 - Smart Contract →](./02-smart-contract-raffle.md)**

---

**#Web3WeekAsia** | **#BuildWeb3** | **#LearnInPublic**
