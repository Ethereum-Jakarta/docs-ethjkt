---
sidebar_position: 3
title: 📖 Referensi & Network Info
description: Konfigurasi lengkap Monad Testnet dan Mainnet, cara setup wallet dan Foundry, kumpulan seluruh link resmi, serta glosarium istilah yang dipakai di Monad Blitz.
---

# 📖 Referensi & Network Info

Halaman ini adalah lampiran teknis: konfigurasi network, perintah yang sering dipakai, seluruh link resmi, dan glosarium.

:::note Tentang Sumber
Bagian **Konfigurasi Network** dan **Setup Cepat** tidak berasal dari deck acara — keduanya diambil dari [dokumentasi resmi Monad](https://docs.monad.xyz/developer-essentials) agar dokumentasi ini langsung bisa dipakai saat ngoding. Bagian lainnya bersumber dari deck.
:::

---

## 🌐 Konfigurasi Network

### Monad Testnet

Ini yang akan kamu pakai untuk Blitz.

| Parameter | Nilai |
|---|---|
| **Network Name** | Monad Testnet |
| **Chain ID** | `10143` |
| **Currency Symbol** | `MON` |
| **RPC URL** | `https://testnet-rpc.monad.xyz` |
| **RPC alternatif** | `https://rpc.ankr.com/monad_testnet`<br/>`https://rpc-testnet.monadinfra.com` |
| **WebSocket** | `wss://testnet-rpc.monad.xyz`<br/>`wss://rpc-testnet.monadinfra.com` |
| **Explorer** | `https://testnet.monadvision.com`<br/>`https://testnet.monadscan.com` |
| **Faucet** | `https://faucet.monad.xyz` |

### Monad Mainnet

| Parameter | Nilai |
|---|---|
| **Network Name** | Monad Mainnet |
| **Chain ID** | `143` |
| **Currency Symbol** | `MON` |
| **RPC URL** | `https://rpc.monad.xyz` |
| **RPC alternatif** | `https://rpc1.monad.xyz`<br/>`https://rpc2.monad.xyz`<br/>`https://rpc3.monad.xyz`<br/>`https://rpc-mainnet.monadinfra.com` |
| **Explorer** | `https://monadvision.com`<br/>`https://monadscan.com` |

:::tip Testnet atau Mainnet?
[Syarat eligibility](../Hackathon-Brief/aturan-dan-eligibility) menerima **keduanya**. Untuk hackathon satu hari, **testnet** adalah pilihan yang wajar — gratis, dan tidak ada risiko kehilangan dana sungguhan.
:::

---

## ⚡ Setup Cepat

### Tambahkan Monad Testnet ke MetaMask

Cara tercepat: buka **[faucet.monad.xyz](https://faucet.monad.xyz)** dan klik tombol tambah network di sana. Kalau mau manual, masukkan nilai dari tabel Testnet di atas lewat **Settings → Networks → Add network manually**.

### Foundry

```bash
# Deploy
forge create src/MyContract.sol:MyContract \
  --rpc-url https://testnet-rpc.monad.xyz \
  --private-key $PRIVATE_KEY \
  --broadcast

# Panggil fungsi read
cast call <CONTRACT_ADDRESS> "totalSupply()(uint256)" \
  --rpc-url https://testnet-rpc.monad.xyz

# Kirim transaksi
cast send <CONTRACT_ADDRESS> "mint(uint256)" 1 \
  --rpc-url https://testnet-rpc.monad.xyz \
  --private-key $PRIVATE_KEY

# Cek saldo
cast balance <ADDRESS> --rpc-url https://testnet-rpc.monad.xyz
```

Untuk trace dan estimasi gas yang akurat, pakai **[Monad Foundry](../Monad-101/tooling-dan-framework#monad-foundry)** alih-alih Foundry standar.

### viem

```ts
import { createPublicClient, createWalletClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { monadTestnet } from 'viem/chains'

const publicClient = createPublicClient({
  chain: monadTestnet,
  transport: http(),
})

const walletClient = createWalletClient({
  account: privateKeyToAccount(`0x${process.env.PRIVATE_KEY}`),
  chain: monadTestnet,
  transport: http(),
})
```

:::warning Keamanan Private Key
Pakai wallet **khusus hackathon** yang terpisah dari wallet utamamu, dan simpan key-nya di `.env`. Pastikan `.env` masuk ke `.gitignore` — repo-mu wajib publik, dan private key yang bocor di GitHub akan terkuras dalam hitungan detik oleh bot.
:::

---

## 🇮🇩 Tutorial Hands-On Monad di Situs Ini

Kalau kamu butuh panduan langkah demi langkah dalam Bahasa Indonesia, ETHJKT sudah punya serangkaian tutorial Monad yang bisa langsung kamu pakai hari ini:

| Tutorial | Isi |
|---|---|
| [Persiapan Lingkungan](../../Tutorial/Monad-Co-Learning-Camp/persiapan-lingkungan-task-manager) | Setup awal development di Monad |
| [Konfigurasi Hardhat](../../Tutorial/Monad-Co-Learning-Camp/konfigurasi-hardhat-task-manager) | Menyiapkan Hardhat untuk Monad |
| [Pengembangan Smart Contract](../../Tutorial/Monad-Co-Learning-Camp/pengembangan-smart-contract-task-manager) | Menulis kontrak TaskManager |
| [Testing Smart Contract](../../Tutorial/Monad-Co-Learning-Camp/testing-smart-contract-task-manager) | Menguji kontrak sebelum deploy |
| [Deployment](../../Tutorial/Monad-Co-Learning-Camp/deployment-smart-contract) | Deploy ke Monad Testnet |
| [Foundry + Template Monad](../../Tutorial/Monad-Co-Learning-Camp/Foundry/monad-foundry-full) | Alur lengkap dengan Foundry |
| [Token Factory](../../Tutorial/Monad-Co-Learning-Camp/Foundry/monad-token-factory) | Contoh kontrak pembuat token |
| [DeFi Project](../../Tutorial/Monad-Co-Learning-Camp/Foundry/DefiProject/smart-contract-defi-project) | Contoh project DeFi + UI |
| [MultiSig Wallet](../../Tutorial/Monad-Co-Learning-Camp/Foundry/MultiSigWallet/setup-environment) | Contoh wallet multi-tanda tangan |
| [Tug of War Game](../../Tutorial/Monad-Co-Learning-Camp/Foundry/Tug-Of-War-Game/monad-tug-war-game) | Contoh game onchain + UI |

:::tip Contoh Kode Siap Pakai
Kalau kamu butuh titik awal yang sudah jalan, tutorial **Tug of War Game** dan **Token Factory** adalah dua yang paling cepat menghasilkan sesuatu yang bisa didemokan.

Ingat [aturan "start fresh"](../Hackathon-Brief/aturan-dan-eligibility): tutorial dan template publik boleh dipakai sebagai referensi, tapi kode project-mu harus ditulis hari ini.
:::

---

## 🔗 Seluruh Link dari Deck

### Acara

| Keperluan | Link |
|---|---|
| Token, submission, voting | [blitz.devnads.com](https://blitz.devnads.com) |

### Dokumentasi & Portal

| Keperluan | Link |
|---|---|
| Portal developer | [developers.monad.xyz](https://developers.monad.xyz) |
| Developer essentials | [docs.monad.xyz/developer-essentials](https://docs.monad.xyz/developer-essentials) |
| Sumber satu file untuk LLM | [docs.monad.xyz/llms-full.txt](https://docs.monad.xyz/llms-full.txt) |
| Katalog tooling & infra | [docs.monad.xyz/tooling-and-infra](https://docs.monad.xyz/tooling-and-infra) |
| Panduan x402 | [docs.monad.xyz/guides/x402-guide](https://docs.monad.xyz/guides/x402-guide) |
| Contoh & starter kit | [github.com/monad-developers](https://github.com/monad-developers) |

### Tools

| Keperluan | Link |
|---|---|
| Skill coding assistant | [skills.devnads.com](https://skills.devnads.com) |
| Skill protokol untuk agent | [app.monad.xyz/agents](https://app.monad.xyz/agents) |
| Tampilan validator real-time | [gmonads.com](https://gmonads.com) |
| Faucet testnet | [faucet.monad.xyz](https://faucet.monad.xyz) |

### Program Lanjutan

| Program | Link |
|---|---|
| Belajar sampai production-ready | [BuildAnything.so](https://buildanything.so) |
| MOST · Delta V · AI Blueprint | Lihat [Peluang Setelah Blitz](./peluang-setelah-blitz) |

### Media Sosial

[@monad](https://x.com/monad) · [@monad_dev](https://x.com/monad_dev) · [@geeky_kartikey](https://x.com/geeky_kartikey) · [@verestraa](https://x.com/verestraa)

---

## 📚 Glosarium

| Istilah | Arti |
|---|---|
| **Blitz** | Hackathon satu hari format Monad — sprint inovasi, bukan maraton |
| **TPS** | *Transactions Per Second*, jumlah transaksi yang diproses per detik |
| **Gas** | Satuan biaya komputasi di EVM |
| **Block time** | Jeda antar pembuatan blok baru (Monad: 0,3 detik) |
| **Finality** | Titik sejak transaksi dijamin tidak bisa dibatalkan (Monad: 0,6 detik) |
| **EVM** | *Ethereum Virtual Machine*, mesin yang menjalankan smart contract |
| **Asynchronous Execution** | Konsensus dan eksekusi berjalan terpisah, tidak saling menunggu |
| **Optimistic Parallel Execution** | Transaksi dijalankan bersamaan, hanya yang bentrok yang diulang |
| **MonadDB** | Database khusus state blockchain agar operasi baca tidak jadi hambatan |
| **MonadBFT** | Protokol konsensus Monad, final dalam satu ronde (600ms) |
| **Raptorcast** | Penyebaran blok secara paralel dalam potongan-potongan |
| **JIT Compilation** | Bytecode dikompilasi ke kode native sekali, lalu dipakai dari cache |
| **Cold slot** | Storage slot yang belum tersentuh dalam sebuah transaksi — lebih mahal dibaca |
| **MIP-8** | Proposal Monad untuk menurunkan biaya akses cold slot (akan datang) |
| **x402** | Standar pembayaran berbasis HTTP status `402 Payment Required` |
| **MPP** | Package agentic payments Monad, `@monad-crypto/mpp` |
| **ERC-8004** | Standar registry identitas onchain untuk AI agent |
| **Account Abstraction** | Teknik agar wallet dan transaksi terasa seperti aplikasi biasa |
| **Indexer** | Layanan yang membaca dan menyusun data onchain agar mudah di-query |
| **Vibecoding** | Membangun aplikasi terutama lewat prompt ke AI coding assistant |

---

## ✅ Checklist Terakhir

Sebelum hari ini berakhir:

- [ ] Project sudah disubmit di [blitz.devnads.com](https://blitz.devnads.com) sebelum **17:45**
- [ ] Sudah memberi suara untuk project peserta lain
- [ ] Sudah bergabung ke **Monad Developers Indonesia** (scan QR di venue)
- [ ] Repo dibiarkan tetap publik — kode ini jadi bagian portofoliomu
- [ ] Meninggalkan The Studio dalam kondisi seperti saat kamu menemukannya

---

:::tip Selamat Membangun
> **Time to build.** All the best, Jakarta.
:::
