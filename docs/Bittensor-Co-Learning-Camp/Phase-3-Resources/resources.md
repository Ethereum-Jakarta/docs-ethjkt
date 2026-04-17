---
sidebar_position: 1
title: 📚 More Bittensor Resources
description: Kumpulan referensi resmi Bittensor — dokumentasi, explorer, repo subnet, YouTube, faucet testnet, komunitas Indonesia, dan glossary istilah penting untuk lanjut eksplorasi setelah CLC9 selesai.
---

# 📚 More Bittensor Resources

:::info Cara Pakai Halaman Ini
Halaman ini adalah **referensi sepanjang hidup** kamu sebagai Bittensor miner/builder. Bookmark link yang relevan, lanjut eksplorasi mandiri, dan pakai glossary di bawah sebagai kamus saat baca dokumen / forum teknis.

Kategori tersusun dari "paling fundamental" (official docs) ke "community & tools". Kalau kamu baru selesai CLC9, mulai dari **Learning Resources** → **Subnet Repos** untuk menentukan specialization selanjutnya.
:::

---

## 📖 Official Documentation

Dokumen canonical — sumber kebenaran absolut untuk arsitektur & API Bittensor.

| Resource | URL | Deskripsi |
|----------|-----|-----------|
| 📘 **Bittensor Docs** | [docs.bittensor.com](https://docs.bittensor.com) | Dokumentasi resmi: install, btcli, SDK Python, Yuma Consensus, subnet creation |
| 📄 **Whitepaper v2** | [bittensor.com/whitepaper](https://bittensor.com/whitepaper) | Paper akademik — mekanisme incentive, Yuma consensus math, tokenomics TAO |
| 🏗️ **Bittensor SDK Python** | [github.com/opentensor/bittensor](https://github.com/opentensor/bittensor) | Source code SDK — berguna saat debug SDK errors |
| ⚙️ **Subtensor Chain** | [github.com/opentensor/subtensor](https://github.com/opentensor/subtensor) | Source blockchain layer (Substrate-based) |

---

## 📊 Explorer & Analytics

Untuk memantau subnet, miner, validator, dan tokenomics realtime.

| Resource | URL | Deskripsi |
|----------|-----|-----------|
| 📈 **Taostats** ⭐ | [taostats.io](https://taostats.io) | Explorer #1 — subnet leaderboards, validator rankings, price chart, metagraph per netuid |
| 💰 **TaoMarketCap** | [taomarketcap.com](https://taomarketcap.com) | Price tracker TAO + subnet tokens (setelah dynamic TAO launch) |
| 🔎 **Polkadot.js Apps** | [polkadot.js.org/apps](https://polkadot.js.org/apps/?rpc=wss://entrypoint-finney.opentensor.ai) | Raw chain explorer — inspect block, extrinsic, storage |
| 📊 **Subnet Dashboard** | [bittensor.com/scan](https://bittensor.com/scan) | Official subnet overview dari OTF |
| 🏆 **Data Universe Dashboard** | [data-universe.macrocosmos.ai](https://data-universe.macrocosmos.ai) | Khusus SN13 miner leaderboard & freshness stats |
| ⚽ **Sportstensor Dashboard** | [sportstensor.com](https://sportstensor.com) | Khusus SN41 — accuracy leaderboard miner |

---

## 🌐 Official Site & Social

Official channel untuk update governance, new subnet launch, announcement.

| Channel | URL | Catatan |
|---------|-----|---------|
| 🌍 **bittensor.com** | [bittensor.com](https://bittensor.com) | Landing page utama |
| 🏛️ **Open Tensor Foundation** | [opentensorfoundation.org](https://opentensorfoundation.org) | OTF — organisasi nirlaba di balik Bittensor |
| 🐦 **@bittensor (Twitter/X)** | [@bittensor](https://x.com/bittensor) | Update resmi, partnership, milestone |
| 🐦 **@MacrocosmosAI** | [@MacrocosmosAI](https://x.com/MacrocosmosAI) | Tim di balik SN13 Data Universe |
| 💬 **Discord Bittensor** | [discord.gg/bittensor](https://discord.gg/bittensor) | Komunitas global — #general, channel per subnet, #dev-help |
| 📣 **Telegram Announcements** | [t.me/BittensorAnnouncements](https://t.me/BittensorAnnouncements) | Low-volume update channel |
| 📰 **Bittensor Blog** | [bittensor.com/blog](https://bittensor.com/blog) | Deep-dive teknis + update product |

---

## 🧬 Subnet Repos (GitHub)

Source code subnet-subnet populer. Fork + study untuk paham internals & cari ide kontribusi.

### Phase 2 Curriculum Subnets

| Subnet | Repo | Bahasan |
|--------|------|---------|
| **Sportstensor (SN41)** | [github.com/taoshidev/sportstensor](https://github.com/taoshidev/sportstensor) | Predictive model sports event |
| **Data Universe (SN13)** ⭐ | [github.com/macrocosm-os/data-universe](https://github.com/macrocosm-os/data-universe) | Scraping decentralized data |

### Other Major Subnets

| Subnet | Repo | Bahasan |
|--------|------|---------|
| **Chutes (SN64)** | [github.com/rayonlabs/chutes-api](https://github.com/rayonlabs/chutes-api) | Decentralized inference infrastructure |
| **Ridges (SN62)** | [github.com/ridgesai/ridges](https://github.com/ridgesai/ridges) | Code intelligence & engineering agent |
| **Targon (SN4)** | [github.com/manifold-inc/targon](https://github.com/manifold-inc/targon) | LLM inference subnet |
| **Omron (SN2)** | [github.com/inference-labs-inc/omron-subnet](https://github.com/inference-labs-inc/omron-subnet) | zkML verifiable inference |
| **Cortex.t (SN18)** | [github.com/corcel-api/cortex.t](https://github.com/corcel-api/cortex.t) | Text generation API |

:::tip Cara Baca Subnet Repo
1. `README.md` — overview dulu
2. `neurons/miner.py` dan `neurons/validator.py` — entry point kode
3. `protocol.py` — schema synapse (interaksi chain ↔ miner ↔ validator)
4. `scoring/` atau `rewards/` — mechanism incentive
:::

---

## 🎥 Learning Resources

Video, blog, dan podcast untuk belajar Bittensor lebih dalam.

### YouTube Channels

| Channel | URL | Konten |
|---------|-----|--------|
| 🎓 **Bittensor Guru** | [youtube.com/@BittensorGuru](https://www.youtube.com/@BittensorGuru) | Tutorial pemula-lanjutan, subnet review |
| 🧪 **Open Tensor Foundation** | [youtube.com/@opentensor](https://www.youtube.com/@opentensor) | Channel resmi — keynote, AMA, product update |
| 🌌 **Macrocosmos AI** | [youtube.com/@MacrocosmosAI](https://www.youtube.com/@MacrocosmosAI) | Deep dive SN13 + subnet family mereka |
| 🎙️ **Tensor Tuesdays** (podcast) | cari di Spotify | Weekly podcast dengan subnet operators |

### Blogs & Long-Form Reads

| Resource | URL | Catatan |
|----------|-----|---------|
| 📝 **Corcel Blog** | [corcel.io/blog](https://corcel.io/blog) | Deep dive technical — LLM subnet, inference |
| 📝 **Taostats Blog** | [taostats.io/blog](https://taostats.io/blog) | Analytics heavy — emission trends, validator econ |
| 📝 **OTF Newsroom** | [bittensor.com/blog](https://bittensor.com/blog) | Official announcements |
| 📝 **Messari Bittensor Report** | cari "Messari Bittensor" di Google | Institutional-grade research |

---

## 🧪 Testnet & Dev Tools

Sebelum deploy ke mainnet, **selalu test di testnet** (tidak pakai TAO real).

| Tool | URL / Command | Fungsi |
|------|---------------|--------|
| 💧 **Testnet Faucet** | [faucet.bittensor.com](https://faucet.bittensor.com) | Gratis test TAO untuk dev |
| 🌐 **Testnet Endpoint** | `wss://test.finney.opentensor.ai:443` | Subtensor testnet chain |
| 🔧 **Btcli** | `pip install bittensor` → `btcli --help` | CLI wallet, subnet, stake management |
| 🐳 **Subtensor Docker** | [hub.docker.com/u/opentensorfdn](https://hub.docker.com/u/opentensorfdn) | Run local subtensor node |
| 🔨 **Bittensor Wallet GUI** | [chrome web store search: bittensor wallet](https://chromewebstore.google.com/) | Browser extension wallet (masih beta) |
| 📦 **Mock Subtensor** | [github.com/opentensor/bittensor/blob/master/bittensor/mock/subtensor_mock.py](https://github.com/opentensor/bittensor/) | Mock chain untuk unit testing |

:::tip Testnet Workflow
Deploy subnet kamu sendiri? Ikuti: **Testnet (netuid 99, 100, dst) → Mainnet registration**. Testnet faucet 1 TAO/day/wallet. Cukup untuk beberapa register cycle.
:::

---

## 🇮🇩 Community Indonesia

Kamu tidak sendirian! Komunitas Web3 & Bittensor Indonesia aktif dan welcoming.

| Community | Channel | Fokus |
|-----------|---------|-------|
| 🦆 **ETHJKT** | [t.me/ethjakarta](https://t.me/ethjakarta) · [@ETHJKT](https://x.com/ETHJKT) | Ethereum & Web3 community Jakarta, meetup offline, hackathon |
| 🎓 **HackQuest Indonesia** | [@HackQuest_](https://x.com/HackQuest_) | Platform learn-to-earn Web3, CLC series |
| 🐦 **Quack Believers** | Invite-only (graduate CLC9) | Alumni network — diskusi advanced, job referral, grant |
| 💬 **Bittensor Indonesia (unofficial)** | cari Telegram "Bittensor Indonesia" | Diskusi Bahasa Indonesia seputar mining & subnet |
| 🌏 **Web3 Indonesia Telegram** | [t.me/web3indonesia](https://t.me/web3indonesia) | Umbrella Web3 ID community |

:::tip Join Quack Believers!
Setelah graduate CLC9, kamu akan dapat invitation ke **Quack Believers** — alumni-only community. Di sana ada:
- 🛠️ Dedicated help channel untuk miner issue
- 💼 Job & grant board (Bittensor ecosystem hiring)
- 🎟️ Priority access ke CLC selanjutnya
- 🤝 Co-founder matching untuk bangun subnet baru

**Attendance TH1-TH4 + submission lengkap = kunci graduate.**
:::

---

## 📖 Glossary — Istilah Penting

Simpan ini sebagai kamus saat baca dokumen atau forum Bittensor.

### Core Concepts

**Bittensor**
: Protokol decentralized AI yang menggabungkan incentive crypto dengan compute/intelligence marketplace. Token asli: **TAO**.

**TAO (τ)**
: Native token Bittensor. Supply cap 21M (mirip Bitcoin). Di-emit ke miner & validator berdasarkan kontribusi mereka.

**Subnet**
: "Market" individual untuk task AI spesifik (inference, data scraping, prediction, dll). Masing-masing punya **NetUID**.

**NetUID**
: ID numerik subnet (SN13 = Data Universe, SN41 = Sportstensor, SN1 = Text Prompting, dst).

**Tempo**
: Interval waktu (~72 menit, ~360 block) di mana validator set weights dan emission didistribusi.

**Epoch**
: Periode perhitungan score yang lebih panjang, biasanya ~24 jam untuk scoring aggregation.

### Wallet & Keys

**Coldkey**
: Kunci utama — kontrol penuh atas stake TAO dan authority account. **Simpan offline / hardware wallet**, JANGAN pernah di VPS.

**Hotkey**
: Operational key turunan — boleh "sign" transaksi miner/validator tapi TIDAK BISA transfer TAO. Aman disimpan di VPS.

**SS58 Address**
: Format alamat blockchain Substrate/Polkadot (contoh: `5FHneW46...`). Mirip Ethereum address tapi format berbeda.

**Mnemonic**
: 12 atau 24 kata seed phrase untuk recover wallet. Anggap kata ini = PIN ATM kamu — **TIDAK BOLEH di-share.**

### Economics

**Stake**
: Jumlah TAO yang di-delegate ke hotkey (validator atau miner) untuk participate di subnet. Lebih banyak stake = lebih banyak pengaruh.

**Emission**
: TAO yang di-mint dan didistribusi ke miner/validator setiap tempo berdasarkan performance.

**Incentive**
: Score normalized (0-1) yang ditentukan validator untuk tiap miner. Determinan emission.

**Dividend**
: Reward untuk validator (dari stake delegators).

**Weights**
: Array nilai yang validator set on-chain untuk menentukan siapa miner terbaik. Sum of weights = 1.

**Yuma Consensus**
: Algoritma consensus Bittensor untuk agregasi weights validator → incentive scoring robust vs dishonest validator.

**Recycled TAO**
: TAO yang "dibakar" saat miner register di subnet — fungsi anti-sybil.

**Burn**
: Menghancurkan TAO permanent; bagian dari mekanisme deflasi.

### Node Roles

**Miner (Server)**
: Neuron yang kontribusi work (compute, data, prediction) dan di-rate oleh validator.

**Validator**
: Neuron yang evaluate kualitas work miner dan set weights on-chain.

**Subnet Owner**
: Pembuat subnet — dapet cut emission sebagai insentif jalankan subnet.

**Delegator (Nominator)**
: Holder TAO yang stake ke validator untuk dapat share dividend tanpa run node sendiri.

**Axon**
: HTTP/RPC endpoint miner — interface di mana validator kirim query & ambil response.

**Dendrite**
: Client side validator — library yang kirim synapse request ke axon.

**Synapse**
: Data schema request/response antara validator ↔ miner (pydantic model di framework bittensor).

**Metagraph**
: Snapshot state subnet di tempo tertentu — list UID, hotkey, stake, weights, incentive, dll.

**UID**
: Unique slot ID di subnet (0 sampai `max_uids - 1`). Setiap miner occupy 1 slot.

**Immunity Period**
: Periode grace setelah register (~5000 block) di mana miner baru tidak akan di-deregister meski scoring rendah.

**Deregistration**
: Proses kick miner dengan score terendah saat ada miner baru register dengan TAO recycle lebih tinggi.

### Technical Stack

**Substrate**
: Framework blockchain Rust (dari Parity) yang mendasari Subtensor.

**Finney**
: Nama codename mainnet Bittensor (dari Hal Finney, pioneer Bitcoin).

**Subtensor**
: Nama chain client Bittensor.

**btcli**
: Command-line interface Bittensor — `pip install bittensor` termasuk btcli.

**PM2**
: Process manager Node.js populer untuk jaga miner auto-restart.

**Axon Port**
: Port TCP di mana miner listening (default 8091). Harus public-reachable.

### SN13-Specific

**Label**
: Kategori konten (subreddit, hashtag, channel YouTube).

**Data Entity**
: Satu unit data (satu post/tweet/transcript segment).

**Freshness**
: Dimensi scoring — seberapa baru data yang di-scrape.

**Coverage**
: Dimensi scoring — diversity source data miner.

**S3-Compatible Storage**
: Cloud storage yang implement S3 API — AWS S3, Cloudflare R2, Backblaze B2, Wasabi.

---

## 🔥 Bonus: Advanced Reading List

Kalau kamu mau jadi subnet owner atau validator expert, mulai baca:

1. **Paper**: ["Yuma Consensus: Decentralized Machine Intelligence"](https://bittensor.com/whitepaper)
2. **Thesis**: Look for "Decentralized Mixture of Experts" papers — filosofi dasar Bittensor
3. **Book**: "Crypto and AI" — framing tokenomics × machine learning
4. **Code**: `bittensor/core/extrinsics/` di SDK — cara bikin custom extrinsic chain

---

## 🎓 Selamat!

:::tip Kamu sudah menyelesaikan kurikulum CLC9 Bittensor 🎉
Mulai dari tidak tahu apa itu Web3 maupun AI, sampai bisa running miner produksi di dua subnet berbeda (SN41 Sportstensor & SN13 Data Universe) — itu **achievement besar.** Bangga sama diri sendiri!

**Langkah selanjutnya:**

1. 🎯 **Submit semua bukti** di HackQuest Learning Track sebelum TH4
2. 🏆 **Hadir Graduation Day (TH4)** untuk dapat NFT Certificate
3. 🦆 **Terima undangan Quack Believers** — alumni network untuk graduate
4. 🚀 **Pilih specialization**:
   - Mau jadi **subnet owner**? Pelajari Substrate + Rust
   - Mau jadi **validator**? Akumulasi TAO & bangun reputasi uptime
   - Mau **contribute open source**? Cari good-first-issue di repo subnet favorit
   - Mau **start startup**? Join grant program OTF — funding up to $250k untuk proyek Bittensor ecosystem
5. 🇮🇩 **Tetap aktif di ETHJKT & HackQuest Indonesia** — ajak teman ke CLC10!

> *In Builders We Trust. In Decentralized AI We Thrive. 🤝⚡*

Sampai jumpa di Graduation Day — dan di batch CLC berikutnya!
:::

---

*Halaman ini living document. Kalau kamu temukan link mati, resource baru, atau istilah yang belum tercantum, open issue/PR di [repo docs-ethjkt](https://github.com/ethjkt/docs-ethjkt). Kontribusi kamu bikin kurikulum ini lebih baik untuk batch selanjutnya.*

**— Tim CLC9 Bittensor (ETHJKT × HackQuest Indonesia × Bittensor) 🦆**
