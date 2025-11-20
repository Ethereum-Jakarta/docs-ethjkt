---
id: hands-on-game
title: "Part 3: Hands-on - Join Game & Pilih Pemenang"
sidebar_label: "Part 3: Hands-on Game"
sidebar_position: 3
description: "Praktek langsung join raffle game on-chain, pilih pemenang, dan lihat USDC otomatis terkirim via smart contract di Base Sepolia"
---

# Part 3: Hands-on - Join Game & Pilih Pemenang

> **"Ini adalah momen yang kamu tunggu - sentuh blockchain secara real!"** 🎮

---

## 🎯 Tujuan Part Ini

Di part ini, peserta akan:

- ✅ Connect ke deployed contract via Remix
- ✅ Join game raffle GRATIS dengan panggil `joinGame()`
- ✅ Lihat transaksi di BaseScan
- ✅ Track semua players yang join
- ✅ Pilih pemenang dengan `pickWinner()`
- ✅ Verifikasi USDC terkirim ke winner
- ✅ Celebrate pengalaman Web3 pertama! 🎉

**Durasi:** 25 menit (30-55 menit di workshop)

---

## 📋 Prerequisites

Sebelum mulai part ini:

- ✅ Contract `SimpleVibeRaffle` sudah deployed (Part 2)
- ✅ Punya contract address (misal: `0xABC...123`)
- ✅ MetaMask di **Base Sepolia network**
- ✅ Punya sedikit ETH Base Sepolia untuk gas (~0.001 ETH)
- ✅ Remix sudah connect ke MetaMask

---

## 🎮 Section 1: Connect ke Deployed Contract

### Skenario

**Instructor sudah deploy contract** sebelum workshop.

Peserta akan **connect** ke contract yang sama untuk join game.

---

### Step 1: Dapatkan Contract Address

**Dari Instructor:**

Instructor akan share contract address di slide atau chat:

```
Contract Address:
0xABC123DEF456...  (contoh)

Copy address ini!
```

**Verifikasi Contract di BaseScan:**

1. Buka: **https://sepolia.basescan.org**

2. Paste address di search bar

3. Check:
   - ✅ Contract exists
   - ✅ Creator = instructor address
   - ✅ Token transfers (USDC jika sudah funded)

---

### Step 2: Load Contract di Remix

**Di Remix IDE:**

1. **Klik icon "Deploy" 🚀** di sidebar kiri

2. **Pastikan Environment:**
   ```
   Environment: Injected Provider - MetaMask
   Network: Base Sepolia (84532)
   ```

3. **Pilih Contract:**
   ```
   Contract dropdown: SimpleVibeRaffle
   ```

4. **Load Contract "At Address":**
   - Paste contract address di field "At Address"
   - Klik tombol "At Address" (warna pink/merah muda)

5. **Contract Akan Muncul!**

Lihat di section "Deployed Contracts":
```
📦 SimpleVibeRaffle at 0xABC...123

Functions:
🔵 owner
🔵 gameOpen
🔵 players
🟠 joinGame
🟠 pickWinner
...
```

**Success!** Kamu sekarang connected ke contract 🎉

---

### Step 3: Verify Contract Info

**Test Read Functions:**

Klik button berikut untuk verify:

**1. Check Owner:**
```
Klik: owner

Returns: 0x... (instructor address)
```

**2. Check Game Status:**
```
Klik: gameOpen

Returns: true (game masih buka)
```

**3. Check USDC Address:**
```
Klik: usdcToken

Returns: 0x036CbD53842c5426634e7929541eC2318f3dCF7e
```

**4. Check Prize Pool:**
```
Klik: getPrizePool

Returns: 10000000 (10 USDC dalam 6 decimals)
```

**5. Check Players:**
```
Klik: getPlayerCount

Returns: 0 (belum ada yang join)
```

**Kalau semua berfungsi = Ready to play!** ✅

---

## 🎲 Section 2: Join Game

### Cara Peserta Join Game

**Important:** Siapa saja bisa join, gratis (no entry fee)!

---

### Step 1: Panggil `joinGame()`

**Di Remix:**

1. **Scroll ke Deployed Contract**

2. **Cari button `joinGame`** (warna orange 🟠)

3. **Klik button "joinGame"**

4. **MetaMask akan popup:**
   ```
   SimpleVibeRaffle
   Function: joinGame()

   Gas Fee: ~0.0003 ETH

   [Reject] [Confirm]
   ```

5. **Klik "Confirm"**

6. **Tunggu transaksi di-mine** (~15-30 detik)

7. **Check Terminal Remix:**
   ```
   ✅ Transaction confirmed
   From: 0x1234...5678 (your address)
   To: 0xABC...123 (contract)
   Function: joinGame()
   Status: Success
   ```

**Selamat! Kamu sudah join game!** 🎊

---

### Step 2: Verify Join Berhasil

**Method 1: Via Remix**

Klik:
```
getPlayerCount → Returns: 1 (atau lebih kalau ada yang join duluan)
```

Klik:
```
getPlayers → Returns: ["0x1234...5678", ...] (array of addresses)
```

---

**Method 2: Via BaseScan**

1. Buka BaseScan Sepolia: https://sepolia.basescan.org

2. Paste **contract address**

3. Klik tab **"Events"**

4. Lihat event:
   ```
   PlayerJoined
   player: 0x1234...5678 (your address)
   timestamp: ... (kapan join)
   ```

---

**Method 3: Check Transaction Hash**

Di Remix terminal, klik transaction hash:
```
Transaction: 0xdef456...
```

Akan buka BaseScan dengan details:
```
Function: joinGame()
From: Your address
To: Contract address
Status: Success ✅
Gas Used: 50000
```

---

### Step 3: Multiple Entries (Opsional)

**Pro tip:** Join berkali-kali = peluang lebih besar!

**Cara:**

1. Panggil `joinGame()` lagi
2. Confirm di MetaMask
3. Repeat as many times as you want

**Contoh:**
```
Player A join 1x → 1 entry
Player B join 3x → 3 entries
Player C join 5x → 5 entries

Total players array: 9 entries
Player C punya peluang 5/9 = 55%!
```

**Catatan:**
- Butuh gas setiap kali join (~0.0003 ETH)
- Untuk workshop, 1-2x cukup (biar semua dapat kesempatan)

---

## 👥 Section 3: Monitor All Players

### Live Tracking

**Instructor bisa tampilkan di screen:**

**Di Remix:**

Klik button `getPlayers` berkala (setiap 30 detik):

```
getPlayers

Returns:
[
  "0x1111...aaaa",
  "0x2222...bbbb",
  "0x2222...bbbb",  ← Join 2x
  "0x3333...cccc",
  "0x4444...dddd",
  ...
]
```

**Lihat jumlah total:**
```
getPlayerCount

Returns: 15 (misalnya)
```

**Lihat prize pool:**
```
getPrizePool

Returns: 10000000 (10 USDC dalam 6 decimals)
```

---

### Visualisasi di Screen

**Instructor bisa buat slide/dashboard sederhana:**

```
┌─────────────────────────────────────────┐
│   WEB3 VIBE RAFFLE - LIVE STATS         │
├─────────────────────────────────────────┤
│                                          │
│  🎁 Prize Pool: 10 USDC                 │
│  👥 Total Entries: 15                   │
│  🎮 Game Status: OPEN                   │
│                                          │
│  Recent Players:                         │
│  - 0x1111...aaaa (1 entry)              │
│  - 0x2222...bbbb (2 entries)            │
│  - 0x3333...cccc (1 entry)              │
│  - 0x4444...dddd (3 entries)            │
│  - ...                                   │
│                                          │
│  ⏳ Waiting for more players...         │
│                                          │
└─────────────────────────────────────────┘
```

**Bikin excitement:**
- "Oke, sudah 10 orang join!"
- "Wow, ada yang join 5 kali - all in! 🚀"
- "Kita tunggu 5 menit lagi, terus pilih pemenang!"

---

## 🎯 Section 4: Pick Winner (The Big Moment!)

### Persiapan

**Sebelum pick winner:**

1. **Pastikan cukup players** (minimal 3-5 untuk seru)

2. **Announce:**
   ```
   "Oke guys, game ditutup dalam 1 menit!
   Yang mau join, sekarang terakhir kalinya!"
   ```

3. **Final check:**
   ```
   getPlayerCount → Returns: 20 (misalnya)
   getPrizePool → Returns: 10000000 (10 USDC)
   ```

4. **Build hype:**
   ```
   "Alright, 20 entries!
   Prize pool: 10 USDC di Base Sepolia!
   Mari kita lihat siapa yang beruntung hari ini! 🎲"
   ```

---

### Step 1: Call `pickWinner()`

**Hanya OWNER (instructor) yang bisa panggil!**

**Di Remix (Instructor's laptop):**

1. **Double-check account:**
   ```
   Account: 0x... (owner address)
   ```

2. **Klik button `pickWinner`** (orange 🟠)

3. **MetaMask popup:**
   ```
   Function: pickWinner()
   Gas Fee: ~0.001 ETH

   [Reject] [Confirm]
   ```

4. **Klik "Confirm"**

5. **Tunggu mining...**
   ```
   [pending] Waiting for transaction to be mined...
   ```

6. **Screen mungkin freeze sebentar** (normal!)

7. **Success! 🎉**
   ```
   ✅ Transaction confirmed
   Function: pickWinner()
   Status: Success
   Event: WinnerPicked(winner, prize)
   ```

---

### Step 2: Lihat Siapa Pemenangnya!

**Method 1: Via Remix Events**

Di terminal Remix, expand transaction:
```
Logs:
- WinnerPicked
  winner: 0x2222...bbbb
  prize: 10000000 (10 USDC dalam 6 decimals)
```

**Method 2: Via BaseScan (Better for presentation!)**

1. Copy transaction hash dari Remix

2. Buka di BaseScan: https://sepolia.basescan.org

3. Klik tab **"Logs"**

4. Lihat event:
   ```
   Event: WinnerPicked

   Topics:
   - winner: 0x2222...bbbb ← PEMENANG!

   Data:
   - prize: 10000000 (10 USDC dalam 6 decimals)
   ```

5. **Announce winner:**
   ```
   "PEMENANGNYA ADALAH...

   Address: 0x2222...bbbb

   Selamat! Kamu dapat 10 USDC di Base Sepolia! 🎉🎉🎉"
   ```

---

### Step 3: Verify Transfer Berhasil

**Check Winner Wallet:**

**Kalau winner ada di ruangan:**

Minta dia:
1. Buka MetaMask
2. Check balance USDC di Base Sepolia
3. Harusnya bertambah 10 USDC!
   (Mungkin perlu add USDC token manual ke MetaMask)

**Live Demo di Screen:**

1. Buka BaseScan

2. Paste winner address

3. Klik tab **"Token Transfers"**

4. Lihat:
   ```
   Recent Token Transfers:
   - IN: 10 USDC from Contract (just now!)
   ```

5. Klik transaction:
   ```
   ERC-20 Token Transfer:
   From: Contract (0xABC...123)
   To: Winner (0x2222...bbbb)
   Token: USDC (0x036C...)
   Value: 10 USDC
   Status: Success ✅
   ```

**Ini adalah momen magic!** ✨

**Tunjukkan ke peserta:**
```
"Lihat! Tidak ada yang manual.
Tidak ada transfer dari saya.
Smart contract OTOMATIS kirim USDC ke pemenang!

Ini adalah kekuatan Web3! 🚀"
```

---

### Step 4: Verify Game Closed

**Check state contract:**

```
gameOpen → Returns: false (game sudah ditutup)
```

**Coba join lagi:**

Kalau ada yang coba `joinGame()` sekarang:
```
❌ Transaction will revert
Error: "Game is closed"
```

**Perfect!** Contract bekerja sesuai logic 🎯

---

## 🎊 Section 5: Celebration & Debrief

### Celebrate! 🎉

**Momen ini penting untuk learning experience!**

**Instructor:**
```
"Give applause untuk pemenang! 👏👏👏

Dan give applause untuk KALIAN SEMUA!

Kalian baru saja:
✅ Berinteraksi dengan smart contract
✅ Mengirim transaksi on-chain
✅ Melihat ETH otomatis terkirim by code

Ini adalah pengalaman Web3 REAL! 🚀"
```

---

### Debrief: Apa Yang Baru Terjadi?

**Recap untuk peserta:**

**1. Join Game:**
```
- Kamu panggil fungsi joinGame()
- Address kamu masuk ke array players[]
- Transaksi tercatat permanent di blockchain
```

**2. Pick Winner:**
```
- Owner panggil pickWinner()
- Contract generate random number
- Pilih 1 address dari players array
- Transfer seluruh prize pool otomatis
```

**3. The Magic:**
```
- Tidak ada yang bisa curang
- Tidak ada manual transfer
- Semua transparan (bisa di-verify di BaseScan)
- Code adalah law!
```

---

### Key Takeaways

**Highlight untuk peserta:**

**✅ Trustless:**
```
Tidak perlu percaya instructor.
Percaya kode yang sudah di-deploy.
Siapa saja bisa verify kode di BaseScan.
```

**✅ Transparent:**
```
Semua transaksi public.
Semua orang bisa lihat:
- Siapa yang join
- Kapan join
- Siapa pemenang
- Berapa hadiah
```

**✅ Immutable:**
```
Kode tidak bisa diubah.
Rules sudah fixed sejak deploy.
Tidak ada yang bisa manipulate hasil.
```

**✅ Composable:**
```
Contract ini bisa di-combine dengan contract lain.
Misal: Tambah NFT sebagai tiket entry.
Atau: Integrate dengan DAO untuk governance.
```

---

## 🎓 Section 6: Eksperimen Lanjutan (Opsional)

Kalau masih ada waktu (~5-10 menit), bisa coba:

### Eksperimen 1: Check Old State

**Sekarang game sudah closed, tapi data masih ada!**

**Coba:**
```
getPlayers → Masih return array lengkap
getPlayerCount → Masih return jumlah total
getPrizePool → Return 0 (karena sudah transfer semua)
```

**Lesson:**
- State permanent di blockchain
- Bisa di-query kapan saja
- Useful untuk audit trail!

---

### Eksperimen 2: Try Call After Closed

**Coba join lagi:**

```
joinGame() → ❌ Revert: "Game is closed"
```

**Coba pick winner lagi:**

```
pickWinner() → ❌ Revert: "Game already closed"
```

**Lesson:**
- Validasi berfungsi!
- Contract enforce rules automatically
- Tidak bisa bypass logic

---

### Eksperimen 3: Lihat di Block Explorer

**Di BaseScan, explore:**

**Contract Page:**
- Total transactions
- Total value transferred
- Internal transactions
- Events emitted

**Winner Transaction:**
- Gas used
- Gas price
- Block number
- Timestamp
- Input data (function call)

**Lesson:**
- Blockchain adalah ledger public
- Semua traceable & verifiable
- Perfect for transparency!

---

## 📊 Workshop Stats Recap

**Tampilkan stats akhir:**

```
┌─────────────────────────────────────────┐
│   WEB3 VIBE RAFFLE - FINAL STATS        │
├─────────────────────────────────────────┤
│                                          │
│  🎁 Prize Pool: 10 USDC                 │
│  👥 Total Participants: 20               │
│  📝 Total Entries: 35                   │
│  🎯 Winner: 0x2222...bbbb               │
│  ⛽ Total Gas Used: ~0.005 ETH          │
│  ⏱️  Duration: 45 minutes               │
│  🎉 Success Rate: 100%                  │
│  🌐 Network: Base Sepolia               │
│                                          │
│  Fun Facts:                              │
│  - Fastest join: 3 seconds (Base fast!) │
│  - Most entries: 5x (0x4444...dddd)     │
│  - Lucky winner joined 2x only!         │
│                                          │
└─────────────────────────────────────────┘
```

---

## 💡 Q&A Session

### Common Questions & Answers

**Q: Kenapa random number tidak aman?**

A: Karena `block.timestamp`, `msg.sender`, dan data lain bisa diprediksi atau dimanipulasi oleh miner. Untuk uang real, pakai Chainlink VRF yang verifiable & unpredictable.

---

**Q: Bisa tidak 1 orang menang lebih dari 1 kali?**

A: Di contract ini, tidak. Setelah `pickWinner()` dipanggil, `gameOpen = false`. Untuk multi-winner, perlu ubah logic (pakai loop, pilih N winners).

---

**Q: Kalau owner jahat, bisa curang tidak?**

A: Di contract ini, owner punya control besar (bisa `pickWinner` kapan saja). Untuk production, bisa pakai:
- Time-lock (otomatis pick setelah X jam)
- Multi-sig (butuh approval multiple owners)
- Chainlink Automation (trigger otomatis)

---

**Q: Gas fee bisa lebih murah?**

A: Yes! Di Sepolia free (testnet). Di mainnet, bisa pakai:
- Layer 2 (Arbitrum, Optimism) → Gas 10-100x lebih murah
- Batch transactions
- Gas optimization di code

---

**Q: Bisa pakai untuk real money?**

A: Bisa, TAPI harus:
1. Audit security profesional
2. Pakai Chainlink VRF untuk random
3. Add access control yang proper
4. Comply dengan gambling laws (hati-hati legal!)
5. Insurance & emergency pause mechanism

---

**Q: Berapa biaya deploy contract di mainnet?**

A: Tergantung gas price. Estimasi:
- Contract deployment: ~0.01 - 0.05 ETH ($20-$100)
- Each transaction: ~0.001 - 0.01 ETH ($2-$20)

Makanya kita pakai testnet untuk belajar! 😄

---

## ✅ Final Checklist: What You Learned

Check yang sudah kamu pelajari:

### Konsep
- [ ] Paham apa itu smart contract
- [ ] Paham blockchain immutability
- [ ] Paham gas fee
- [ ] Paham events & logs
- [ ] Paham random number di blockchain

### Praktek
- [ ] Connect MetaMask ke Remix
- [ ] Load contract by address
- [ ] Panggil fungsi smart contract
- [ ] Kirim transaksi on-chain
- [ ] Lihat transaksi di BaseScan
- [ ] Verify state changes

### Tools
- [ ] Remix IDE untuk interact
- [ ] MetaMask untuk sign transactions
- [ ] BaseScan untuk verify
- [ ] Base Sepolia testnet untuk testing

---

## 🚀 What's Next?

### Immediate Next Steps:

**1. Explore More Contracts:**
- Lihat contracts di block explorers (BaseScan, Etherscan untuk Ethereum, dll)
- Coba interact dengan contract popular (misal: USDC di testnet)

**2. Learn Solidity:**
- [CryptoZombies](https://cryptozombies.io) - Interactive tutorial
- [Solidity by Example](https://solidity-by-example.org) - Code snippets
- [Ethereum.org Docs](https://ethereum.org/en/developers/docs/) - Official guide

**3. Build Your Own:**
- Modifikasi SimpleVibeRaffle (tambah fitur)
- Buat game/raffle sendiri
- Deploy & share dengan teman

---

### Intermediate Level:

**4. Learn Frameworks:**
- **Hardhat** - Testing & deployment
- **Foundry** - Fast Solidity development
- **Truffle** - Suite lengkap

**5. Frontend Integration:**
- Belajar **ethers.js** atau **viem**
- Build UI untuk interact dengan contract
- Next.js + Web3 integration

**6. Advanced Concepts:**
- Security best practices
- Gas optimization
- Upgradeable contracts
- Cross-chain bridges

---

### Resources:

**Free Courses:**
```
- Alchemy University (gratis!)
- Buildspace (project-based learning)
- LearnWeb3 DAO (structured curriculum)
```

**Communities:**
```
- Ethereum Stack Exchange (Q&A)
- /r/ethdev (Reddit)
- Discord: Ethereum, Alchemy, Chainlink
```

**Keep Building:**
```
- Hackathons (ETHGlobal, etc)
- Bounties (Gitcoin)
- Open source contributions
```

---

## 🎁 Bonus: Contract Address & Resources

### Workshop Materials

**Contract Address (Base Sepolia):**
```
[Instructor akan isi address di sini]
0x...
```

**BaseScan Link:**
```
https://sepolia.basescan.org/address/0x...
```

**USDC Address (Base Sepolia):**
```
0x036CbD53842c5426634e7929541eC2318f3dCF7e
```

**Source Code:**
```
GitHub: [link repo]
Gist: [link gist]
```

---

### Official Resources

**Base:**
- Website: https://base.org
- Docs: https://docs.base.org
- Base Sepolia Faucet (ETH): https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet
- Circle USDC Faucet: https://faucet.circle.com/

**Ethereum:**
- Website: https://ethereum.org
- Docs: https://ethereum.org/en/developers/docs/

**Tools:**
- Remix: https://remix.ethereum.org
- MetaMask: https://metamask.io
- BaseScan: https://basescan.org

**Learning:**
- Solidity Docs: https://docs.soliditylang.org
- CryptoZombies: https://cryptozombies.io
- Alchemy University: https://university.alchemy.com

---

## 🎉 Terima Kasih!

**Selamat!** Kamu sudah:
- ✅ Sentuh blockchain pertama kali
- ✅ Interact dengan smart contract
- ✅ Kirim transaksi on-chain
- ✅ Lihat ETH transfer otomatis by code
- ✅ Punya foundasi untuk belajar Web3!

**Ini baru permulaan!** 🚀

Web3 adalah future of internet, dan kamu sudah punya head start.

**Keep learning, keep building, and most importantly - have fun!** 🎊

---

**Follow Up:**

- Join komunitas Ethereum Jakarta
- Subscribe newsletter Web3
- Ikut workshop lanjutan
- Build & deploy project sendiri!

---

**Special Thanks:**

- Web3 Week Asia organizers
- Peserta yang enthusiastic
- Ethereum Foundation
- Open source community

---

**See you in the metaverse!** 👋

---

**[← Part 2: Smart Contract](./02-smart-contract-raffle.md)** | **[Main Index](./web3-vibe-raffle-workshop.md)**

---

**#Web3WeekAsia** | **#BuildWeb3** | **#LearnInPublic** | **#GM**
