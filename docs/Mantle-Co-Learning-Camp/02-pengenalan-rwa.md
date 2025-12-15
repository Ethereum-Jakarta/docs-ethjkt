---
id: pengenalan-rwa
title: Pengenalan Real World Assets (RWA)
sidebar_position: 2
---

# Pengenalan Real World Assets (RWA)

Real World Assets (RWA) adalah salah satu narasi terbesar dalam industri blockchain saat ini. Tokenisasi aset dunia nyata membuka peluang investasi yang sebelumnya tidak terjangkau oleh kebanyakan orang, sekaligus membawa efisiensi dan transparansi ke pasar keuangan tradisional.

:::info Project Tutorial: IndonesiaPropertyToken
Sepanjang dokumentasi ini, kita akan membangun satu project lengkap: **IndonesiaPropertyToken** - platform tokenisasi properti real estate di Indonesia. Semua smart contract dapat langsung dicoba di [Remix IDE](https://remix.ethereum.org).
:::

---

## 1. Apa itu RWA?

### 1.1 Definisi

**Real World Assets (RWA)** adalah representasi digital dari aset fisik atau finansial dunia nyata di blockchain dalam bentuk token. Proses mengubah aset dunia nyata menjadi token digital disebut **tokenisasi**.

> Sumber: [CoinGecko - What Are Real World Assets](https://www.coingecko.com/learn/what-are-real-world-assets-exploring-rwa-protocols)

Secara sederhana, tokenisasi adalah proses mengambil aset yang ada di dunia nyata (seperti properti, emas, atau obligasi) dan membuat representasi digitalnya di blockchain. Token ini kemudian dapat diperdagangkan, dipinjamkan, atau digunakan sebagai jaminan dalam ekosistem DeFi.

### 1.2 Mengapa RWA Penting?

RWA menjembatani dua dunia yang selama ini terpisah:

```
TRADITIONAL FINANCE (TradFi)          DECENTRALIZED FINANCE (DeFi)
============================          ============================

+ Aset bernilai triliunan dollar      + Transparansi & auditability
+ Regulasi yang established           + Programmable & composable
+ Trust dari institusi                + 24/7 trading
+ Likuiditas pasar yang dalam         + Fractional ownership
                                      + Borderless access

                    RWA TOKENIZATION
                    ================
                    Menggabungkan keunggulan
                    kedua dunia
```

**Masalah yang Diselesaikan RWA:**

| Masalah TradFi | Solusi RWA |
|----------------|------------|
| Minimum investasi tinggi ($100K+) | Fractional ownership mulai $10 |
| Settlement T+2 sampai T+5 | Settlement instan (T+0) |
| Trading hours terbatas (9-5) | 24/7/365 trading |
| Akses terbatas (geografis, status) | Global, permissionless access |
| Biaya intermediary tinggi | Direct peer-to-peer, lower fees |
| Kurang transparan | On-chain, auditable |

### 1.3 Bagaimana Tokenisasi Bekerja?

Proses tokenisasi melibatkan beberapa tahap:

```
TAHAP TOKENISASI RWA
====================

TAHAP 1: ASSET ORIGINATION
--------------------------
- Identifikasi aset yang akan di-tokenisasi
- Valuasi independen oleh appraiser
- Due diligence legal (kepemilikan, encumbrance)

TAHAP 2: LEGAL STRUCTURING
--------------------------
- Pembentukan SPV (Special Purpose Vehicle)
- Transfer kepemilikan aset ke SPV
- Penyusunan dokumen legal (prospektus, terms)

TAHAP 3: TOKEN CREATION
-----------------------
- Deploy smart contract di blockchain
- Mint token sesuai valuasi aset
- Setup compliance (KYC, transfer restrictions)

TAHAP 4: DISTRIBUTION
---------------------
- Primary offering ke investor
- KYC/AML verification
- Token distribution ke wallet investor

TAHAP 5: SECONDARY MARKET
-------------------------
- Trading di DEX/CEX
- Ongoing compliance monitoring
- Corporate actions (dividen, voting)

TAHAP 6: REDEMPTION
-------------------
- Burn token untuk redeem underlying asset
- Atau hold sampai maturity
```

### 1.4 Komponen Ekosistem RWA

```
EKOSISTEM RWA
=============

+------------------+     +------------------+     +------------------+
|   ASSET OWNER    |     |   TOKENIZATION   |     |    INVESTORS     |
|                  |     |    PLATFORM      |     |                  |
| - Property owner | --> | - Legal wrapper  | --> | - Retail         |
| - Fund manager   |     | - Smart contract |     | - Institutional  |
| - Government     |     | - Compliance     |     | - DAOs           |
+------------------+     +------------------+     +------------------+
        |                        |                        |
        v                        v                        v
+------------------+     +------------------+     +------------------+
|    CUSTODIAN     |     |     ORACLE       |     |    EXCHANGE      |
|                  |     |                  |     |                  |
| - Asset custody  |     | - Price feeds    |     | - Primary market |
| - Proof of       |     | - NAV updates    |     | - Secondary      |
|   reserves       |     | - Events         |     |   trading        |
+------------------+     +------------------+     +------------------+
        |                        |                        |
        +------------------------+------------------------+
                                 |
                                 v
                    +------------------------+
                    |      REGULATORS        |
                    |                        |
                    | - Securities laws      |
                    | - AML/KYC requirements |
                    | - Investor protection  |
                    +------------------------+
```

### 1.5 Jenis Aset yang Dapat Di-tokenisasi

| Kategori | Contoh Aset | Market Size | Karakteristik |
|----------|-------------|-------------|---------------|
| **Real Estate** | Properti komersial, apartemen, tanah | $300+ Triliun | Illiquid, high value, stable yield |
| **Commodities** | Emas, perak, minyak, komoditas pertanian | $50+ Triliun | Fungible, price volatile |
| **Securities** | Saham, obligasi, ETF, reksa dana | $100+ Triliun | Regulated, dividend/interest |
| **Private Credit** | Pinjaman korporasi, invoice financing | $1.5+ Triliun | Higher yield, credit risk |
| **Collectibles** | Seni, barang mewah, memorabilia | $500+ Miliar | Unique, subjective value |
| **Intellectual Property** | Hak cipta, paten, royalti | $5+ Triliun | Cash flow based |

### 1.6 Market Opportunity

```
PERTUMBUHAN PASAR RWA TOKENIZATION
==================================

2020: $85 Juta        #
2023: $5 Miliar       #####
2024: $15.2 Miliar    ###############
2025: $33 Miliar      #################################
2030: $10-30 Triliun  (Proyeksi)

Growth Rate: ~200% YoY (2020-2025)
```

> Sumber: [CoinGecko RWA Report 2025](https://www.coingecko.com/learn/what-are-real-world-assets-exploring-rwa-protocols), [VanEck Research](https://www.vaneck.com/)

### 1.7 Breakdown Pasar RWA (2025)

| Kategori | Nilai | Persentase | Trend |
|----------|-------|------------|-------|
| Stablecoins (Fiat-backed) | $224.9 Miliar | 97.5% | Stabil |
| Tokenized Treasuries | $8.7 Miliar | 0.4% | Naik cepat (+251% YoY) |
| Private Credit | $18.7 Miliar | 0.8% | Naik stabil |
| Commodities | $2.9 Miliar | 0.1% | Naik (+164% YoY) |
| Real Estate | $500+ Juta | Kurang dari 0.1% | Early stage |

> Sumber: [RWA.xyz Analytics](https://rwa.xyz/)

---

## 2. Legal Framework & Structuring

### 2.1 Pertanyaan Fundamental

Pertanyaan paling penting dalam tokenisasi RWA:

> **"Apakah memiliki token = memiliki aset secara legal?"**

Jawabannya bergantung pada **legal structuring** yang digunakan.

### 2.2 Model Legal Structuring

Ada tiga model utama yang digunakan dalam tokenisasi RWA:

#### Model 1: SPV (Special Purpose Vehicle)

```
SPV MODEL
=========

+------------------+
|   REAL ASSET     |
|   (Properti)     |
+--------+---------+
         |
         | Kepemilikan legal
         v
+------------------+
|       SPV        |
| (PT. Properti    |
|  Tokenisasi)     |
+--------+---------+
         |
         | Saham SPV di-tokenisasi
         v
+------------------+
|  TOKEN HOLDERS   |
| (Pemegang token  |
|  = pemegang      |
|  saham SPV)      |
+------------------+

Keuntungan:
- Legal structure yang jelas
- Bankruptcy remote
- Familiar untuk investor tradisional

Kekurangan:
- Setup cost tinggi
- Ongoing compliance
- Jurisdictional complexity
```

**Contoh Penggunaan:** RealT (real estate), Centrifuge (private credit)

#### Model 2: Direct Ownership

```
DIRECT OWNERSHIP MODEL
======================

+------------------+
|   REAL ASSET     |
|   (Properti)     |
+--------+---------+
         |
         | Token = Title deed
         | (Statutory recognition)
         v
+------------------+
|  TOKEN HOLDERS   |
| (Token = legal   |
|  ownership)      |
+------------------+

Keuntungan:
- Paling sederhana
- Token = kepemilikan langsung
- No intermediary

Kekurangan:
- Butuh statutory recognition
- Sangat terbatas (hanya beberapa jurisdiksi)
- Technical complexity
```

**Jurisdiksi yang Support:**
- Wyoming, USA (DAO recognition)
- Liechtenstein (Token Act)
- Switzerland (DLT Act)

#### Model 3: Contractual Claims

```
CONTRACTUAL CLAIMS MODEL
========================

+------------------+
|   REAL ASSET     |
|   (Properti)     |
+--------+---------+
         |
         | Custody agreement
         v
+------------------+
|    CUSTODIAN     |
| (Holds asset on  |
|  behalf of token |
|  holders)        |
+--------+---------+
         |
         | Contractual right
         v
+------------------+
|  TOKEN HOLDERS   |
| (Token = claim   |
|  on custodian)   |
+------------------+

Keuntungan:
- Flexible
- Works in most jurisdictions
- Easier to setup

Kekurangan:
- Counterparty risk (custodian)
- Not direct ownership
- Trust dependent
```

**Contoh Penggunaan:** Paxos Gold, Tether Gold

### 2.3 Regulatory Landscape Global

| Jurisdiksi | Regulasi | Status RWA | Notes |
|------------|----------|------------|-------|
| **USA** | SEC/CFTC | Securities law applies | Howey Test untuk determine security |
| **EU** | MiCA | Harmonized framework | Asset-Referenced Tokens (ART) |
| **Singapore** | MAS | Supportive sandbox | Payment Services Act |
| **UAE** | ADGM/DFSA | Progressive | Virtual Asset Framework |
| **Switzerland** | FINMA | DLT Act | Legal recognition of tokens |
| **Indonesia** | OJK (2025) | Developing | PP 28/2025, sandbox framework |

> Sumber: [RWA.io - Regulatory Challenges](https://www.rwa.io/post/regulatory-challenges-of-tokenizing-real-world-assets)

### 2.4 Klasifikasi Token

```
KLASIFIKASI TOKEN BERDASARKAN REGULASI
======================================

+-------------------+-------------------+-------------------+
|   UTILITY TOKEN   |  SECURITY TOKEN   |   PAYMENT TOKEN   |
+-------------------+-------------------+-------------------+
| Access to service | Investment        | Medium of         |
| or platform       | contract          | exchange          |
+-------------------+-------------------+-------------------+
| - Gaming tokens   | - Tokenized       | - Stablecoins     |
| - Governance      |   stocks          | - CBDCs           |
| - Memberships     | - Tokenized       | - Crypto          |
|                   |   bonds           |   currencies      |
|                   | - Real estate     |                   |
|                   |   tokens          |                   |
+-------------------+-------------------+-------------------+
| Light regulation  | Heavy regulation  | Medium regulation |
| (most cases)      | (securities law)  | (payment law)     |
+-------------------+-------------------+-------------------+

SEBAGIAN BESAR RWA TOKEN = SECURITY TOKEN
- Harus comply dengan securities law
- Butuh registration/exemption
- KYC/AML mandatory
- Restricted transferability
```

### 2.5 Howey Test (USA)

Untuk menentukan apakah token adalah security, SEC menggunakan **Howey Test**:

```
HOWEY TEST
==========

Token adalah SECURITY jika memenuhi SEMUA kriteria:

1. INVESTMENT OF MONEY
   └── Investor memberikan uang/value

2. COMMON ENTERPRISE
   └── Dana pooled bersama investor lain

3. EXPECTATION OF PROFITS
   └── Investor mengharapkan keuntungan

4. FROM EFFORTS OF OTHERS
   └── Profit bergantung pada pihak ketiga

Contoh RWA Token:
+-------------------+--------+--------+--------+--------+----------+
| Token             | Money  | Common | Profit | Others | Security |
+-------------------+--------+--------+--------+--------+----------+
| Real Estate Token |   ✓    |   ✓    |   ✓    |   ✓    |    YES   |
| Gold Token        |   ✓    |   ✓    |   ?    |   ✗    |   MAYBE  |
| Invoice Token     |   ✓    |   ✓    |   ✓    |   ✓    |    YES   |
+-------------------+--------+--------+--------+--------+----------+
```

---

## 3. Contoh Proyek RWA Global

### 3.1 Tokenized Treasuries (Obligasi Pemerintah)

Tokenized Treasuries adalah RWA dengan pertumbuhan tercepat (+251% YoY).

| Project | Deskripsi | Platform | AUM | Yield |
|---------|-----------|----------|-----|-------|
| [BlackRock BUIDL](https://securitize.io/buidl) | Money market fund ter-tokenisasi pertama dari BlackRock | Ethereum (Securitize) | $500M+ | ~5% |
| [Ondo Finance USDY](https://ondo.finance/) | Tokenized US Treasury dengan yield harian | Multi-chain | $300M+ | ~5% |
| [Franklin Templeton BENJI](https://www.franklintempleton.com/) | On-chain US Government Money Fund | Stellar, Polygon | $400M+ | ~5% |

**Mengapa Tokenized Treasuries Populer?**

```
KEUNGGULAN TOKENIZED TREASURIES
===============================

1. YIELD YANG KOMPETITIF
   - US Treasury yield: ~5%
   - Lebih tinggi dari DeFi stablecoin yield
   - Risk-free rate benchmark

2. BACKING YANG AMAN
   - Full-reserve backing
   - US Government credit
   - No rehypothecation risk

3. COMPOSABILITY
   - Dapat digunakan sebagai collateral di DeFi
   - Yield + DeFi yield stacking
   - 24/7 liquidity

4. INSTITUTIONAL ADOPTION
   - BlackRock, Franklin Templeton
   - Regulated issuers
   - Compliance built-in
```

### 3.2 Tokenized Real Estate

| Project | Model | Minimum | Yield | Total Tokenized |
|---------|-------|---------|-------|-----------------|
| [RealT](https://realt.co/) | Fractionalized ownership | $50 | 8-12% APY | $100M+ |
| [Propy](https://propy.com/) | NFT property deeds | Varies | - | $100M+ |
| [Blocksquare](https://blocksquare.io/) | Tokenization platform | $100 | 6-10% APY | $96M+ (21 countries) |

**Bagaimana Real Estate Tokenization Bekerja:**

```
REAL ESTATE TOKENIZATION FLOW
=============================

PROPERTI: Apartemen Jakarta, Nilai Rp 10 Miliar

Step 1: SPV Formation
+------------------+
| PT. Apartemen    |
| Tokenisasi       |
| (SPV)            |
+------------------+
        |
        v
Step 2: Asset Transfer
+------------------+
| Properti         |
| ditransfer ke    |
| SPV              |
+------------------+
        |
        v
Step 3: Token Minting
+------------------+
| 10,000 Tokens    |
| minted           |
| 1 token = 0.01%  |
| ownership        |
+------------------+
        |
        v
Step 4: Distribution
+------------------+
| Investor A: 100  | = 1% ownership = Rp 100 Juta
| Investor B: 500  | = 5% ownership = Rp 500 Juta
| Investor C: 50   | = 0.5% ownership = Rp 50 Juta
+------------------+
        |
        v
Step 5: Yield Distribution
+------------------+
| Rental income    |
| distributed      |
| proportionally   |
| via smart        |
| contract         |
+------------------+
```

### 3.3 Tokenized Commodities

| Project | Underlying | Ratio | Market Cap | Custody |
|---------|------------|-------|------------|---------|
| [Paxos Gold (PAXG)](https://paxos.com/paxgold/) | Physical gold bars | 1 token = 1 oz | $500M+ | Brink's London |
| [Tether Gold (XAUT)](https://gold.tether.to/) | Gold reserves | 1 token = 1 oz | $700M+ | Switzerland |

**Proof of Reserves:**

```
PROOF OF RESERVES UNTUK COMMODITY TOKENS
========================================

Untuk memastikan token benar-benar backed oleh underlying asset:

1. CUSTODIAN ATTESTATION
   - Auditor independen verifikasi holdings
   - Quarterly/monthly reports
   - Contoh: Paxos - audited by Withum

2. ON-CHAIN PROOF OF RESERVES
   - Chainlink Proof of Reserve
   - Real-time verification
   - Automated monitoring

3. REDEMPTION MECHANISM
   - User bisa redeem token untuk physical gold
   - Minimum redemption: 1 oz (PAXG)
   - Delivery atau pickup

FLOW:
+----------+     +-----------+     +----------+
| Physical |     | Custodian |     | On-chain |
| Gold     | --> | Vault     | --> | Token    |
| 1 oz     |     | (Brink's) |     | (PAXG)   |
+----------+     +-----------+     +----------+
                       |
                       v
              +----------------+
              | Proof of       |
              | Reserves       |
              | (Chainlink/    |
              |  Auditor)      |
              +----------------+
```

### 3.4 Private Credit

| Project | Fokus | Integration | TVL | Borrowers |
|---------|-------|-------------|-----|-----------|
| [Centrifuge](https://centrifuge.io/) | Invoice financing, trade finance | MakerDAO, Aave | $300M+ | SMEs globally |
| [Maple Finance](https://maple.finance/) | Institutional lending | - | $2B+ originated | Crypto institutions |
| [Goldfinch](https://goldfinch.finance/) | Emerging market loans | - | $100M+ | Fintech lenders |

**Private Credit Tokenization:**

```
PRIVATE CREDIT FLOW
===================

TRADITIONAL:
Borrower --> Bank --> Fund --> Investor
           (High fees, slow, opaque)

TOKENIZED (Centrifuge):
+----------+     +-----------+     +----------+     +----------+
| Borrower | --> | Centrifuge| --> | Token    | --> | DeFi     |
| (MSME)   |     | Pool      |     | (DROP/   |     | Protocol |
|          |     |           |     |  TIN)    |     | (Aave)   |
+----------+     +-----------+     +----------+     +----------+
                       |
                       v
              +----------------+
              | Collateral:    |
              | - Invoices     |
              | - Receivables  |
              | - Real estate  |
              +----------------+

TRANCHING:
+------------------+------------------+
|    DROP Token    |    TIN Token     |
| (Senior Tranche) | (Junior Tranche) |
+------------------+------------------+
| Lower yield      | Higher yield     |
| Lower risk       | Higher risk      |
| First to be paid | Last to be paid  |
| (5-10% APY)      | (10-20% APY)     |
+------------------+------------------+
```

### 3.5 Tokenized Equities

| Project | Products | Partner | Trading |
|---------|----------|---------|---------|
| [Backed Finance (xStocks)](https://backed.fi/) | AAPL, NVDA, MSFT, TSLA | Mantle, Bybit | 24/7 |

> Sumber: [Mantle x Backed Collaboration](https://www.prnewswire.com/news-releases/mantle-collaborates-with-bybit-and-backed-to-bring-us-equities-onchain-pioneering-next-trillion-dollar-wave-of-tokenized-assets-302608743.html)

**Bagaimana Tokenized Stocks Bekerja:**

```
TOKENIZED STOCKS (xStocks)
==========================

Traditional Stock:
+----------+     +-----------+     +----------+
| AAPL     | --> | Broker    | --> | Investor |
| Stock    |     | (Fidelity)|     | Account  |
+----------+     +-----------+     +----------+
                 Trading: 9:30 AM - 4:00 PM EST
                 Settlement: T+2

Tokenized Stock:
+----------+     +-----------+     +----------+     +----------+
| AAPL     | --> | Custodian | --> | Token    | --> | Any      |
| Stock    |     | (Backed)  |     | (AAPLx)  |     | Wallet   |
+----------+     +-----------+     +----------+     +----------+
                 Trading: 24/7/365
                 Settlement: Instant

VALUE PROPOSITION:
1. 24/7 Trading - Trade Apple stock on Sunday
2. Fractional - Buy $10 worth of NVDA
3. Global Access - No brokerage account needed
4. DeFi Composability - Use as collateral
```

---

## 4. Contoh RWA di Indonesia

### 4.1 Inisiatif Tokenize Indonesia

Pada November 2024, **Tokenize Indonesia** diluncurkan sebagai platform eksperimental untuk institusi Indonesia mengeksplorasi tokenisasi aset.

> Sumber: [Media Indonesia - Tokenize Indonesia](https://mediaindonesia.com/ekonomi/809739/aset-dunia-nyata-didorong-masuk-blockchain-lewat-tokenize-indonesia)

**Pendiri & Partner:**
- [Saison Capital](https://www.saisoncapital.com/)
- [Coinvestasi](https://coinvestasi.com/)
- [BRI Ventures (BVI)](https://briventures.id/)

**Institusi yang Bergabung:**

| Institusi | Market Cap | Fokus RWA | Potential Use Case |
|-----------|------------|-----------|-------------------|
| **Bank BRI** | $35+ Miliar | Tokenized deposits, trade finance | MSME lending tokens |
| **Pegadaian** | BUMN | Tokenized gold, pawn receipts | Gold-backed stablecoin |
| **Pos Indonesia** | BUMN | Logistics tokenization | Supply chain tokens |
| **MDI Ventures** | Telkom Group | Investment tokenization | Startup equity tokens |

### 4.2 Potensi Pasar Indonesia

Berdasarkan laporan **"Project Wira - Indonesia's Asset Tokenization Opportunity"** (November 2024):

```
POTENSI TOKENISASI ASET INDONESIA
=================================

Total Market Opportunity: US$ 88 MILIAR

Breakdown by Asset Class:
+----------------------+---------------+------------------+
| Asset Class          | Market Size   | Tokenization     |
|                      |               | Opportunity      |
+----------------------+---------------+------------------+
| Real Estate          | $40+ Miliar   | Fractional       |
|                      |               | ownership        |
+----------------------+---------------+------------------+
| Gold & Commodities   | $20+ Miliar   | Gold-backed      |
| (Pegadaian, Antam)   |               | tokens           |
+----------------------+---------------+------------------+
| Government Bonds     | $15+ Miliar   | Tokenized SBN,   |
| (SBN, ORI)           |               | ORI              |
+----------------------+---------------+------------------+
| Private Credit       | $8+ Miliar    | Invoice          |
| (MSME Financing)     |               | tokenization     |
+----------------------+---------------+------------------+
| Other Assets         | $5+ Miliar    | IP, collectibles |
+----------------------+---------------+------------------+
```

> Sumber: [Bisnis.com - Tokenisasi RWA](https://market.bisnis.com/read/20250429/94/1872775/tokenisasi-aset-dunia-nyata-rwa-tumbuh-85-bakal-jadi-tren-blockchain-2025)

### 4.3 Use Case Spesifik Indonesia

#### Use Case 1: Tokenized SBN (Surat Berharga Negara)

```
TOKENIZED SBN
=============

Current State:
- ORI (Obligasi Ritel Indonesia): Min Rp 1 Juta
- SBR (Savings Bond Ritel): Min Rp 1 Juta
- Trading: Secondary market limited

Tokenized State:
- Min investment: Rp 10,000
- Trading: 24/7 on-chain
- Instant settlement
- DeFi composability (collateral)

Impact:
- Financial inclusion meningkat
- Liquidity market SBN meningkat
- Retail participation naik
```

#### Use Case 2: Tokenized Gold (Pegadaian)

```
TOKENIZED GOLD via PEGADAIAN
============================

Current State:
- Tabungan Emas Pegadaian
- Min: 0.01 gram
- Trading: Business hours only
- Physical redemption: Manual process

Tokenized State:
+------------------+
| Gold stored at   |
| Pegadaian vault  |
+--------+---------+
         |
         v
+------------------+
| Smart contract   |
| mints GOLD token |
| 1 token = 1 gram |
+--------+---------+
         |
         v
+------------------+
| Features:        |
| - 24/7 trading   |
| - Instant redeem |
| - DeFi collateral|
| - Fractional     |
+------------------+
```

#### Use Case 3: MSME Invoice Financing

```
MSME INVOICE TOKENIZATION
=========================

Problem:
- 60+ juta MSME di Indonesia
- Access to credit terbatas
- Invoice payment: 30-90 days
- Cash flow gap

Solution:
+------------------+
| MSME has invoice |
| to large company |
| (Rp 100 Juta)    |
+--------+---------+
         |
         v
+------------------+
| Invoice verified |
| & tokenized      |
+--------+---------+
         |
         v
+------------------+
| Token sold to    |
| liquidity pool   |
| at discount      |
| (Rp 95 Juta)     |
+--------+---------+
         |
         v
+------------------+
| MSME gets        |
| instant cash     |
| Investor gets    |
| yield when       |
| invoice paid     |
+------------------+
```

### 4.4 Regulasi Indonesia

**Timeline Regulasi:**

| Tahun | Event | Impact |
|-------|-------|--------|
| 2019 | Bappebti regulate crypto | Crypto sebagai komoditas |
| 2024 | 20.9 juta users terdaftar | Mass adoption |
| Jan 2025 | OJK ambil alih dari Bappebti | Securities framework |
| 2025 | PP No. 28/2025 | Blockchain dalam strategi digital nasional |

> Sumber: [Detik Finance - Regulasi Aset Digital](https://finance.detik.com/fintech/d-7889655/begini-prospek-perkembangan-aset-digital-di-indonesia)

**PP No. 28/2025 Key Points:**
- Blockchain sebagai bagian strategi digital nasional
- Framework sandbox untuk inovator fintech & blockchain
- Klasifikasi ulang aset digital
- Pathway untuk RWA tokenization

### 4.5 Ekosistem Crypto Indonesia

| Metrik | 2021 | 2024 | Pertumbuhan |
|--------|------|------|-------------|
| Pengguna Terdaftar | 9.9 Juta | 20.9 Juta | +111% |
| Volume Transaksi Bulanan | $739 Juta | $2.25 Miliar | +204% |
| Ranking Global Adopsi Web3 | - | #3 | Top 3 Dunia |

---

## 5. Kenapa Mantle untuk RWA?

Mantle Network telah memposisikan diri sebagai **"gateway"** utama untuk institusi dan TradFi terhubung dengan ekosistem on-chain dan real-world assets.

> Sumber: [Mantle 2025 RWApped](https://www.prnewswire.com/apac/news-releases/mantle-2025-rwapped-a-year-of-unstoppable-momntum-and-global-rwa-expansion-302635316.html)

### 5.1 Keunggulan Teknis Mantle

```
MANTLE NETWORK ARCHITECTURE
===========================

+----------------------------------------------------------+
|                    MANTLE NETWORK                         |
+----------------------------------------------------------+
|                                                          |
|  +-------------------+     +------------------------+    |
|  | Execution Layer   |     | Data Availability      |    |
|  | (OP Stack)        |     | (EigenDA)              |    |
|  +-------------------+     +------------------------+    |
|           |                          |                   |
|           v                          v                   |
|  +-------------------+     +------------------------+    |
|  | Settlement Layer  |     | Consensus              |    |
|  | (Ethereum L1)     |     | (OP Stack + ZK)        |    |
|  +-------------------+     +------------------------+    |
|                                                          |
+----------------------------------------------------------+

SPECIFICATIONS:
+------------------------+----------------------------------+
| Feature                | Specification                    |
+------------------------+----------------------------------+
| Gas Fees               | 95%+ cheaper than Ethereum       |
| Deploy Cost            | $1-5 vs $150-300 on Ethereum     |
| TPS                    | High throughput                  |
| Finality               | Minutes (vs hours on other L2s)  |
| Technology             | First OP Stack L2 as ZK Rollup   |
| TVL Ranking            | Largest ZK rollup by TVL         |
| Treasury               | $7.9 Billion (peak)              |
+------------------------+----------------------------------+
```

### 5.2 Mengapa Mantle Ideal untuk RWA?

```
MANTLE VALUE PROPOSITION untuk RWA
==================================

1. LOW COST
   ├── Deploy RWA contract: $1-5
   ├── Transfer token: < $0.01
   └── Makes micro-investments viable

2. HIGH THROUGHPUT
   ├── Supports high-volume trading
   ├── Corporate actions (dividends) at scale
   └── Real-time settlement

3. INSTITUTIONAL BACKING
   ├── Bybit as anchor exchange
   ├── $7.9B treasury for ecosystem development
   └── Credibility for TradFi institutions

4. RWA-FOCUSED ECOSYSTEM
   ├── Ondo USDY native integration
   ├── Backed xStocks partnership
   ├── Securitize collaboration
   └── RWA as "Top Priority" track

5. REGULATORY READINESS
   ├── Compliance-friendly architecture
   ├── Institutional-grade security
   └── Audit trail on-chain
```

### 5.3 Ekosistem RWA di Mantle

Pada **1 Oktober 2025**, Mantle melakukan integrasi besar-besaran dengan protokol RWA:

| Protokol | Kategori | Deskripsi | Link |
|----------|----------|-----------|------|
| Ondo USDY | Tokenized Treasury | Treasury-backed stablecoin, ~5% yield | [ondo.finance](https://ondo.finance/) |
| Ethena USDe | Synthetic Dollar | Delta-hedged stable asset | [ethena.fi](https://ethena.fi/) |
| Backed/xStocks | Tokenized Equities | AAPL, NVDA, MSFT tokens | [backed.fi](https://backed.fi/) |
| Securitize | Tokenization Platform | BlackRock BUIDL partner | [securitize.io](https://securitize.io/) |
| Aave | DeFi Lending | RWA as collateral | [aave.com](https://aave.com/) |
| Anchorage | Custody | Institutional-grade custody | [anchorage.com](https://anchorage.com/) |

### 5.4 Mantle vs Kompetitor untuk RWA

| Fitur | Mantle | Ethereum | Polygon | Solana | Avalanche |
|-------|--------|----------|---------|--------|-----------|
| Gas Cost | Very Low | High | Low | Very Low | Low |
| TPS | High | Low | Medium | Very High | High |
| Institutional Trust | High | Very High | Medium | Medium | Medium |
| Treasury Support | $7.9B | N/A | N/A | N/A | N/A |
| EVM Compatible | Yes | Native | Yes | No | Yes |
| RWA Ecosystem | Growing Fast | Established | Growing | Limited | Growing |
| ZK Technology | Yes | Via L2s | Yes | No | No |

---

## 6. Tokenization Standards

### 6.1 Evolution of Token Standards

```
EVOLUTION OF TOKEN STANDARDS
============================

2015: ERC-20
├── Basic fungible token
├── No compliance features
├── Simple transfer() function
└── Used for: Utility tokens, basic cryptocurrencies

2017: ERC-721
├── Non-fungible tokens (NFTs)
├── Unique asset representation
├── tokenURI for metadata
└── Used for: Art, collectibles, gaming

2018: ERC-1400
├── Security token standard
├── Partitions (tranches)
├── Transfer restrictions
├── Document management
└── Used for: Equity tokens, bonds

2021: ERC-1155
├── Multi-token standard
├── Batch transfers
├── Both fungible & non-fungible
└── Used for: Gaming, mixed assets

2025: ERC-3643 (Official)
├── Permissioned token standard
├── Built-in identity (ONCHAINID)
├── Modular compliance
├── $28B+ assets tokenized
└── Used for: RWA, security tokens
```

### 6.2 ERC-3643 Deep Dive

ERC-3643 (sebelumnya T-REX Protocol) adalah standar yang paling banyak digunakan untuk RWA tokenization.

> Sumber: [ERC-3643 Official](https://www.erc3643.org/), [Tokeny Documentation](https://tokeny.com/erc3643/)

#### Arsitektur ERC-3643

```
ERC-3643 ARCHITECTURE
=====================

+------------------------------------------------------------------+
|                         ERC-3643 TOKEN                            |
|                     (ERC-20 Compatible)                           |
+------------------------------------------------------------------+
         |                    |                    |
         v                    v                    v
+------------------+  +------------------+  +------------------+
| IDENTITY         |  | COMPLIANCE       |  | TRUSTED ISSUERS  |
| REGISTRY         |  | MODULE           |  | REGISTRY         |
+------------------+  +------------------+  +------------------+
| Maps wallets to  |  | Pluggable rules  |  | Authorized KYC   |
| verified         |  | for transfers:   |  | providers:       |
| identities       |  | - Country        |  | - KYC Provider A |
|                  |  |   restrictions   |  | - KYC Provider B |
| wallet -> ONCHAINID| - Max holders    |  | - Government ID  |
|                  |  | - Lock-up        |  |                  |
|                  |  | - Investment     |  |                  |
|                  |  |   limits         |  |                  |
+------------------+  +------------------+  +------------------+
         |                    |                    |
         +--------------------+--------------------+
                              |
                              v
                    +------------------+
                    |    ONCHAINID     |
                    | (Decentralized   |
                    |  Identity)       |
                    +------------------+
                    | - KYC claims     |
                    | - Accreditation  |
                    | - Country        |
                    | - Expiry         |
                    +------------------+
```

#### Komponen ERC-3643

| Komponen | Fungsi | Contoh Implementasi |
|----------|--------|---------------------|
| **Token** | ERC-20 + compliance hooks | Transfer checks identity & compliance |
| **Identity Registry** | Maps wallet -> identity | `isVerified(address)` |
| **Modular Compliance** | Pluggable transfer rules | Country restriction, max holders |
| **Trusted Issuers** | Authorized KYC providers | Approved claim issuers |
| **ONCHAINID** | Self-sovereign identity | Stores KYC claims |

#### Fitur Unik ERC-3643

```
FITUR ERC-3643
==============

1. PERMISSIONED TRANSFERS
   - Setiap transfer di-check
   - Sender & receiver harus verified
   - Compliance rules enforced on-chain

2. IDENTITY VERIFICATION
   - ONCHAINID: Self-sovereign identity
   - Claims from trusted issuers
   - Privacy-preserving (only claims, not data)

3. MODULAR COMPLIANCE
   - Add/remove compliance modules tanpa redeploy
   - Examples:
     - CountryRestrictionModule
     - MaxHolderModule
     - LockUpModule
     - InvestmentLimitModule

4. TOKEN RECOVERY
   - Lost wallet? Admin bisa recover tokens
   - Important untuk regulated securities
   - Requires identity verification

5. FORCED TRANSFERS
   - Legal orders, court decisions
   - Estate settlement
   - Corporate actions

6. FREEZE/UNFREEZE
   - AML/sanctions compliance
   - Regulatory hold
   - Dispute resolution
```

### 6.3 ERC-3643 vs ERC-1400

| Aspek | ERC-1400 | ERC-3643 |
|-------|----------|----------|
| **Status** | Proposal/Draft | Official ERC Standard |
| **Focus** | Security tokens only | All permissioned assets |
| **Identity** | External, not standardized | Built-in ONCHAINID |
| **Compliance** | Basic, in-contract | Modular, pluggable |
| **Partitions** | Yes (tranches) | No (but can be added) |
| **Token Recovery** | No | Yes, built-in |
| **Freeze Function** | No | Yes, built-in |
| **DeFi Compatible** | Limited | Yes, ERC-20 compatible |
| **Assets Tokenized** | Unknown | $28+ Billion |
| **Documentation** | Limited | Extensive |

#### Kapan Menggunakan Masing-masing?

```
DECISION TREE: ERC-1400 vs ERC-3643
===================================

START
  |
  v
Butuh PARTITIONS (tranches) untuk kelas aset berbeda?
  |
  +-- YES --> Pertimbangkan ERC-1400
  |           (e.g., Preferred vs Common stock)
  |
  +-- NO
       |
       v
     Butuh IDENTITY VERIFICATION on-chain?
       |
       +-- YES --> ERC-3643 ✓
       |
       +-- NO --> Standard ERC-20 mungkin cukup
            |
            v
          Butuh MODULAR COMPLIANCE yang bisa di-update?
            |
            +-- YES --> ERC-3643 ✓
            |
            +-- NO
                 |
                 v
               Butuh TOKEN RECOVERY untuk lost keys?
                 |
                 +-- YES --> ERC-3643 ✓
                 |
                 +-- NO
                      |
                      v
                    Butuh FREEZE function untuk AML?
                      |
                      +-- YES --> ERC-3643 ✓
                      |
                      +-- NO --> Bisa pakai ERC-20 atau ERC-1400
```

### 6.4 Standar Lainnya

| Standard | Use Case | Key Feature |
|----------|----------|-------------|
| **ERC-20** | Basic fungible tokens | Simple, widely supported |
| **ERC-721** | NFTs, unique assets | Non-fungible, metadata |
| **ERC-1155** | Multi-token (gaming) | Batch operations |
| **ERC-1400** | Security tokens | Partitions, documents |
| **ERC-3643** | Permissioned RWA | Identity, compliance |
| **ERC-4626** | Tokenized vaults | Yield-bearing tokens |

---

## 7. Compliance Patterns

### 7.1 Mengapa Compliance Penting untuk RWA?

```
COMPLIANCE adalah MANDATORY untuk RWA
=====================================

Tanpa compliance:
- Token tidak bisa legally di-issue
- Institusi tidak mau adopt
- Regulatory enforcement risk
- Investor protection concerns

Dengan compliance:
+ Legal certainty
+ Institutional adoption
+ Regulatory approval
+ Investor confidence
```

### 7.2 KYC (Know Your Customer)

#### Apa itu KYC?

**KYC** adalah proses verifikasi identitas customer sebelum mereka dapat menggunakan layanan keuangan. Dalam konteks RWA, KYC memastikan hanya investor yang terverifikasi yang dapat memegang token.

> Sumber: [iDenfy - RWA KYC](https://www.idenfy.com/blog/rwa-tokenization-kyc/)

#### KYC Levels

```
KYC LEVELS untuk RWA
====================

LEVEL 0: NO KYC
├── Tidak terverifikasi
├── Tidak bisa hold token
└── Blocked dari semua activities

LEVEL 1: BASIC KYC
├── ID verification (KTP/Passport)
├── Selfie match
├── Basic background check
└── Limit: Retail investor, small amounts

LEVEL 2: ENHANCED KYC
├── All Level 1 requirements
├── Proof of address
├── Source of funds
├── Tax ID (NPWP)
└── Limit: Higher amounts

LEVEL 3: ACCREDITED INVESTOR
├── All Level 2 requirements
├── Income/net worth verification
├── Professional investor status
├── Suitability assessment
└── Limit: No limit, access to all offerings
```

#### KYC Flow untuk RWA

```
KYC FLOW
========

STEP 1: DOCUMENT SUBMISSION (Off-chain)
+------------------+
| User submits:    |
| - ID Card/KTP    |
| - Selfie         |
| - Proof of       |
|   Address        |
+--------+---------+
         |
         v
STEP 2: VERIFICATION (Off-chain, KYC Provider)
+------------------+
| KYC Provider:    |
| - Document       |
|   authenticity   |
| - Face match     |
| - Liveness check |
| - Sanctions      |
|   screening      |
| - PEP check      |
+--------+---------+
         |
         v
STEP 3: CLAIM ISSUANCE (On-chain)
+------------------+
| Trusted Issuer   |
| signs claim:     |
| - KYC verified   |
| - Country code   |
| - Expiry date    |
| - KYC level      |
+--------+---------+
         |
         v
STEP 4: IDENTITY REGISTRATION (On-chain)
+------------------+
| KYCRegistry:     |
| registerInvestor(|
|   wallet,        |
|   level,         |
|   country,       |
|   expiry         |
| )                |
+--------+---------+
         |
         v
STEP 5: WALLET WHITELISTED
+------------------+
| User can now:    |
| - Receive tokens |
| - Transfer tokens|
| - Participate in |
|   offerings      |
+------------------+
```

### 7.3 AML (Anti-Money Laundering)

#### Apa itu AML?

**AML** adalah serangkaian prosedur untuk mencegah pencucian uang dan pendanaan terorisme. Dalam blockchain, ini melibatkan:
- Transaction monitoring
- Sanctions screening
- Suspicious activity reporting

#### AML Components

```
AML FRAMEWORK untuk RWA
=======================

1. CUSTOMER DUE DILIGENCE (CDD)
   ├── Identity verification (KYC)
   ├── Source of funds
   ├── Purpose of investment
   └── Ongoing monitoring

2. SANCTIONS SCREENING
   ├── OFAC (US)
   ├── UN sanctions
   ├── EU sanctions
   └── Local sanctions lists

3. PEP SCREENING
   ├── Politically Exposed Persons
   ├── Family members
   ├── Close associates
   └── Enhanced due diligence if PEP

4. TRANSACTION MONITORING
   ├── Unusual patterns
   ├── Large transactions
   ├── Rapid movement
   └── Round-trip transactions

5. SUSPICIOUS ACTIVITY REPORTING
   ├── SAR filing
   ├── Regulatory notification
   └── Internal escalation
```

#### On-chain AML Implementation

```
ON-CHAIN AML CHECK
==================

Setiap transfer melalui flow ini:

+----------+     +-------------+     +----------+
|  Sender  | --> | AML Module  | --> | Receiver |
+----------+     +------+------+     +----------+
                        |
         +--------------+--------------+
         |              |              |
         v              v              v
   +-----------+  +-----------+  +-----------+
   | Sanctions |  | Risk      |  | Pattern   |
   | Check     |  | Score     |  | Analysis  |
   +-----------+  +-----------+  +-----------+
         |              |              |
         v              v              v
   +-------------------------------------------+
   |              RESULT                        |
   +-------------------------------------------+
   | PASS   | Transfer proceeds                |
   | FLAG   | Manual review required           |
   | BLOCK  | Transfer rejected                |
   +-------------------------------------------+
```

### 7.4 Whitelisting

#### Apa itu Whitelisting?

**Whitelisting** adalah mekanisme untuk membatasi siapa yang boleh memegang dan mentransfer token. Hanya wallet yang ada di whitelist yang diizinkan berinteraksi dengan token.

#### Whitelist Implementation

```
WHITELIST SYSTEM
================

+------------------+
| WHITELIST        |
| REGISTRY         |
+------------------+
| address -> {     |
|   status,        |
|   level,         |
|   limit,         |
|   expiry         |
| }                |
+------------------+

STATUS:
- NOT_WHITELISTED (0): Tidak bisa transfer
- PENDING (1): Menunggu approval
- APPROVED (2): Bisa transfer
- SUSPENDED (3): Temporary block
- REVOKED (4): Permanent block

TRANSFER CHECK:
+----------+     +-----------+     +----------+
|  Sender  | --> | Whitelist | --> | Receiver |
|          |     | Check     |     |          |
+----------+     +-----------+     +----------+
                       |
         Both APPROVED?
              |
    +---------+---------+
    |                   |
   YES                 NO
    |                   |
    v                   v
 ALLOW              REVERT
```

### 7.5 Transfer Restrictions

#### Types of Restrictions

```
TRANSFER RESTRICTIONS
=====================

1. COUNTRY RESTRICTION
   +------------------+
   | Banned countries |
   | - Sanctioned     |
   | - No legal       |
   |   framework      |
   +------------------+
   Check: investorCountry NOT IN bannedList

2. LOCK-UP PERIOD
   +------------------+
   | Time-based lock  |
   | - 6 months       |
   | - 1 year         |
   | - Until event    |
   +------------------+
   Check: block.timestamp > lockUpEnd

3. INVESTMENT LIMIT
   +------------------+
   | Max holdings per |
   | investor         |
   | - % of total     |
   | - Absolute       |
   +------------------+
   Check: balance + amount <= maxLimit

4. MAX HOLDERS
   +------------------+
   | Total number of  |
   | unique holders   |
   | - Regulatory     |
   | - For exemptions |
   +------------------+
   Check: holderCount < maxHolders

5. ACCREDITATION
   +------------------+
   | Minimum investor |
   | qualification    |
   | - Accredited     |
   | - Professional   |
   +------------------+
   Check: kycLevel >= required
```

### 7.6 Complete Compliance Flow

```
COMPLETE COMPLIANCE FLOW
========================

INVESTOR ONBOARDING:
====================
1. Submit KYC documents
2. KYC Provider verifies identity
3. AML screening (sanctions, PEP check)
4. Accreditation verification (if required)
5. Risk assessment
6. Claim issued by Trusted Issuer
7. Identity registered on-chain
8. Added to whitelist

TOKEN TRANSFER:
==============
+----------+     +------------------------------------+     +----------+
|  Sender  | --> |         COMPLIANCE CHECK           | --> | Receiver |
+----------+     +------------------------------------+     +----------+
                 |                                    |
                 | 1. Is sender whitelisted?          |
                 |    └── NO: REVERT                  |
                 |                                    |
                 | 2. Is receiver whitelisted?        |
                 |    └── NO: REVERT                  |
                 |                                    |
                 | 3. Is sender frozen?               |
                 |    └── YES: REVERT                 |
                 |                                    |
                 | 4. Is receiver frozen?             |
                 |    └── YES: REVERT                 |
                 |                                    |
                 | 5. Is sender KYC valid?            |
                 |    └── NO: REVERT                  |
                 |                                    |
                 | 6. Is receiver KYC valid?          |
                 |    └── NO: REVERT                  |
                 |                                    |
                 | 7. Country restrictions?           |
                 |    └── YES: REVERT                 |
                 |                                    |
                 | 8. Lock-up period active?          |
                 |    └── YES: REVERT                 |
                 |                                    |
                 | 9. Exceeds investment limit?       |
                 |    └── YES: REVERT                 |
                 |                                    |
                 | 10. All checks pass?               |
                 |     └── YES: ALLOW                 |
                 +------------------------------------+

ONGOING MONITORING:
==================
- Transaction pattern analysis
- Periodic KYC refresh
- Sanctions list updates
- Risk score recalculation
- Regulatory reporting
```

---

## 8. Oracle & Off-chain Data

### 8.1 Mengapa Oracle Penting untuk RWA?

RWA adalah jembatan antara dunia on-chain dan off-chain. Oracle diperlukan untuk membawa data off-chain ke blockchain.

```
ORACLE dalam RWA
================

OFF-CHAIN WORLD                 ON-CHAIN WORLD
===============                 ==============

+---------------+               +---------------+
| Asset Value   |               | Smart         |
| (Appraisal)   |               | Contract      |
+---------------+               +---------------+
        |                               ^
        |                               |
        +------- ORACLE ----------------+
                   |
           +-------+-------+
           |       |       |
           v       v       v
        Price   Events   Status
        Feed    Feed     Feed
```

### 8.2 Jenis Oracle untuk RWA

| Oracle Type | Data | Provider | Use Case |
|-------------|------|----------|----------|
| **Price Feed** | Asset prices | Chainlink, Pyth | NAV calculation, collateral value |
| **Proof of Reserve** | Custodian holdings | Chainlink PoR | Verify backing |
| **Identity Oracle** | KYC status | ONCHAINID, Civic | Compliance |
| **Event Oracle** | Corporate actions | Custom | Dividends, votes |
| **NAV Oracle** | Fund valuations | Custom | Fund tokens |

### 8.3 Chainlink Proof of Reserve

```
PROOF OF RESERVE FLOW
=====================

+------------------+     +------------------+     +------------------+
| CUSTODIAN        | --> | CHAINLINK        | --> | SMART CONTRACT   |
| (Off-chain)      |     | ORACLE           |     | (On-chain)       |
+------------------+     +------------------+     +------------------+
|                  |     |                  |     |                  |
| Gold: 1000 oz    |     | Verify &         |     | Check:           |
| in vault         |     | attest           |     | totalSupply <=   |
|                  |     |                  |     | proofOfReserve   |
+------------------+     +------------------+     +------------------+

USE CASES:
- Gold-backed tokens (PAXG)
- Stablecoins (USDC)
- Tokenized treasuries
- Real estate tokens
```

> Sumber: [Chainlink Proof of Reserve](https://chain.link/proof-of-reserve)

### 8.4 Oracle Implementation Considerations

```
ORACLE CONSIDERATIONS
=====================

1. DATA FRESHNESS
   - How often is data updated?
   - Acceptable staleness?
   - Heartbeat interval

2. DATA SOURCE
   - Single source vs multiple
   - Decentralized aggregation
   - Source reputation

3. COST
   - Oracle fees
   - Gas cost for updates
   - Update frequency

4. TRUST MODEL
   - Centralized oracle risk
   - Decentralized oracle (Chainlink)
   - Hybrid approaches

5. FALLBACK
   - What if oracle fails?
   - Backup data sources
   - Circuit breakers
```

---

## 9. DeFi x RWA Integration

### 9.1 Convergence of DeFi and TradFi

```
DEFI + RWA = NEXT FINANCIAL SYSTEM
==================================

             TRADITIONAL FINANCE
             +------------------+
             | - Stable yields  |
             | - Real backing   |
             | - Regulatory     |
             |   clarity        |
             +--------+---------+
                      |
                      v
            +---------+---------+
            |    RWA TOKENS     |
            | Tokenized real    |
            | world assets      |
            +---------+---------+
                      |
                      v
             +--------+---------+
             |    DEFI          |
             | - Composability  |
             | - 24/7 trading   |
             | - Programmable   |
             +------------------+
```

### 9.2 DeFi Use Cases untuk RWA

#### Use Case 1: RWA sebagai Collateral

```
RWA as COLLATERAL
=================

Scenario: Use tokenized Treasury sebagai collateral untuk borrow stablecoin

+------------------+     +------------------+     +------------------+
| Deposit USDY     | --> | AAVE Protocol    | --> | Borrow USDC      |
| (Treasury token) |     | (Lending)        |     |                  |
| Value: $10,000   |     | LTV: 80%         |     | Amount: $8,000   |
+------------------+     +------------------+     +------------------+

Benefits:
- USDY earning ~5% yield
- Borrowed USDC can be used elsewhere
- Net cost = Borrow rate - USDY yield
- No selling, keep exposure
```

#### Use Case 2: RWA Yield Aggregation

```
RWA YIELD AGGREGATION
=====================

+------------------+
| User deposits    |
| USDC             |
+--------+---------+
         |
         v
+------------------+
| Yield Aggregator |
| (e.g., Yearn)    |
+--------+---------+
         |
    +----+----+
    |         |
    v         v
+-------+ +-------+
| USDY  | | BUIDL |
| 5.2%  | | 5.0%  |
+-------+ +-------+
    |         |
    +----+----+
         |
         v
+------------------+
| Best yield       |
| automatically    |
| selected         |
+------------------+
```

#### Use Case 3: RWA-backed Stablecoin

```
RWA-BACKED STABLECOIN
=====================

Traditional (USDC):
+------------------+
| 1 USDC =         |
| $1 in bank       |
| account          |
+------------------+

RWA-backed (USDY):
+------------------+
| 1 USDY =         |
| $1 + yield from  |
| Treasury bonds   |
+------------------+

MakerDAO (DAI):
+------------------+
| DAI backed by:   |
| - ETH (crypto)   |
| - USDC           |
| - RWA (via       |
|   Centrifuge)    |
+------------------+
```

### 9.3 Challenges DeFi x RWA

```
CHALLENGES
==========

1. COMPLIANCE
   - DeFi = permissionless
   - RWA = permissioned
   - How to reconcile?

   Solution: Permissioned DeFi pools
   - Separate pools for KYC'd users
   - Compliance at pool level
   - Example: Aave Arc, Compound Treasury

2. LIQUIDITY
   - RWA tokens less liquid
   - Larger spreads
   - Price discovery issues

   Solution:
   - Market makers
   - Liquidity mining
   - Multiple trading venues

3. ORACLE DEPENDENCY
   - NAV updates needed
   - Off-chain data dependency
   - Oracle failure risk

   Solution:
   - Multiple oracle sources
   - Circuit breakers
   - Fallback mechanisms

4. REDEMPTION
   - DeFi = instant
   - Real assets = not instant
   - Mismatch

   Solution:
   - Liquidity buffers
   - Redemption queues
   - Notice periods
```

---

## 10. Contoh Proyek RWA di Hackathon

Berikut adalah contoh-contoh proyek RWA yang memenangkan atau berpartisipasi di berbagai hackathon:

### 10.1 Mantle Global Hackathon 2025

> Sumber: [HackQuest - Mantle Global Hackathon](https://www.hackquest.io/hackathons/Mantle-Global-Hackathon-2025)

| Info | Detail |
|------|--------|
| **Prize Pool** | $150,000 USDT |
| **Participants** | 800+ builders |
| **Top Priority Track** | RWA/RealFi |
| **Submission Deadline** | January 15, 2026 |
| **Winner Announcement** | February 7, 2026 |

**RWA Track Focus:**
- Tokenization of real estate, bonds, invoices
- KYC flows & custody models
- Compliant yield distribution

> Sumber: [Castle Labs - Mantle RWA Push](https://castlelabs.substack.com/p/mantles-rwa-push-over-150k-in-builder)

### 10.2 Hedera #HelloFuture Hackathon 2024

> Sumber: [Hedera Blog - HelloFuture Winners](https://hedera.com/blog/these-are-the-winners-of-the-2024-hellofuture-hackathon)

**RWA Winners:**

| Project | Deskripsi | Innovation |
|---------|-----------|------------|
| **Solo** | Tokenizing government bonds on private/public blockchain | Hybrid chain approach |
| **Savera** | Blockchain wallet for underserved communities | Financial inclusion |

### 10.3 Chainlink Constellation Hackathon

> Sumber: [Chainlink Blog - Constellation Winners](https://blog.chain.link/constellation-hackathon-winners/)

**Notable RWA Projects:**
- Cross-chain RWA bridges
- Oracle-powered asset valuation
- Automated compliance verification

### 10.4 Ide Project untuk Hackathon

| Kategori | Ide Project | Kompleksitas | Key Features |
|----------|-------------|--------------|--------------|
| Real Estate | Fractional property ownership | Medium | KYC, fractional, yield distribution |
| Invoice Financing | MSME invoice tokenization | Medium | Credit scoring, tranching |
| Commodities | Gold-backed token dengan PoR | High | Oracle integration, custody |
| Government Bonds | Tokenized SBN Indonesia | High | Regulatory compliance, yield |
| Carbon Credits | Tokenized carbon offsets | Medium | Verification, retirement |

---

## 11. Hands-on: IndonesiaPropertyToken

:::tip Bisa Langsung Dicoba di Remix!
Semua smart contract di bawah ini dapat langsung di-copy dan di-deploy di [Remix IDE](https://remix.ethereum.org). Pilih compiler version `0.8.20` dan environment `Remix VM`.
:::

### 11.1 Project Overview

**IndonesiaPropertyToken** adalah platform tokenisasi properti real estate di Indonesia dengan fitur:
- KYC/Whitelist verification
- Fractional ownership
- Compliant transfers
- Admin controls

```
ARCHITECTURE: IndonesiaPropertyToken
====================================

+-------------------+     +-------------------+
|   PropertyToken   |<----|   KYCRegistry     |
|   (ERC-20 + RWA)  |     |   (Whitelist)     |
+-------------------+     +-------------------+
         |                         |
         v                         v
+-------------------+     +-------------------+
|   PropertyInfo    |     |   Compliance      |
|   (Asset Data)    |     |   (Transfer Rules)|
+-------------------+     +-------------------+
```

### 11.2 Step 1: KYC Registry Contract

Contract pertama untuk mengelola whitelist investor yang sudah KYC.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title KYCRegistry
 * @notice Manages KYC verification for IndonesiaPropertyToken
 * @dev Deploy this contract first, then use its address in PropertyToken
 *
 * Tutorial: https://docs.openzeppelin.com/contracts
 */
contract KYCRegistry {

    // ============ STATE VARIABLES ============

    address public admin;

    // KYC Levels
    enum KYCLevel {
        NONE,           // 0 - Belum KYC
        BASIC,          // 1 - KYC dasar (KTP)
        VERIFIED,       // 2 - KYC lengkap (KTP + NPWP)
        ACCREDITED      // 3 - Investor terakreditasi
    }

    struct Investor {
        KYCLevel level;
        uint256 expiryDate;
        uint16 countryCode;     // 360 = Indonesia
        bool isActive;
    }

    // Mapping: wallet address => investor data
    mapping(address => Investor) public investors;

    // Total registered investors
    uint256 public totalInvestors;

    // ============ EVENTS ============

    event InvestorRegistered(address indexed investor, KYCLevel level);
    event InvestorUpdated(address indexed investor, KYCLevel newLevel);
    event InvestorRevoked(address indexed investor);

    // ============ MODIFIERS ============

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }

    // ============ CONSTRUCTOR ============

    constructor() {
        admin = msg.sender;
    }

    // ============ ADMIN FUNCTIONS ============

    /**
     * @notice Register new investor after KYC verification
     * @param _investor Wallet address of investor
     * @param _level KYC level (1-3)
     * @param _countryCode Country code (360 for Indonesia)
     * @param _validDays How many days KYC is valid
     */
    function registerInvestor(
        address _investor,
        KYCLevel _level,
        uint16 _countryCode,
        uint256 _validDays
    ) external onlyAdmin {
        require(_investor != address(0), "Invalid address");
        require(_level != KYCLevel.NONE, "Invalid KYC level");
        require(!investors[_investor].isActive, "Already registered");

        investors[_investor] = Investor({
            level: _level,
            expiryDate: block.timestamp + (_validDays * 1 days),
            countryCode: _countryCode,
            isActive: true
        });

        totalInvestors++;
        emit InvestorRegistered(_investor, _level);
    }

    /**
     * @notice Update investor KYC level
     */
    function updateInvestor(
        address _investor,
        KYCLevel _newLevel
    ) external onlyAdmin {
        require(investors[_investor].isActive, "Not registered");
        investors[_investor].level = _newLevel;
        emit InvestorUpdated(_investor, _newLevel);
    }

    /**
     * @notice Revoke investor KYC (blacklist)
     */
    function revokeInvestor(address _investor) external onlyAdmin {
        require(investors[_investor].isActive, "Not registered");
        investors[_investor].isActive = false;
        totalInvestors--;
        emit InvestorRevoked(_investor);
    }

    // ============ VIEW FUNCTIONS ============

    /**
     * @notice Check if investor is verified and active
     */
    function isVerified(address _investor) public view returns (bool) {
        Investor memory inv = investors[_investor];

        if (!inv.isActive) return false;
        if (inv.level == KYCLevel.NONE) return false;
        if (block.timestamp > inv.expiryDate) return false;

        return true;
    }

    /**
     * @notice Check if investor meets minimum KYC level
     */
    function meetsLevel(
        address _investor,
        KYCLevel _requiredLevel
    ) public view returns (bool) {
        if (!isVerified(_investor)) return false;
        return uint8(investors[_investor].level) >= uint8(_requiredLevel);
    }

    /**
     * @notice Get investor details
     */
    function getInvestor(address _investor) external view returns (
        KYCLevel level,
        uint256 expiryDate,
        uint16 countryCode,
        bool isActive
    ) {
        Investor memory inv = investors[_investor];
        return (inv.level, inv.expiryDate, inv.countryCode, inv.isActive);
    }
}
```

**Cara Test di Remix:**

1. Deploy `KYCRegistry`
2. Copy address contract
3. Call `registerInvestor` dengan parameter:
   - `_investor`: address wallet (bisa pakai address kedua dari Remix)
   - `_level`: 1 (BASIC), 2 (VERIFIED), atau 3 (ACCREDITED)
   - `_countryCode`: 360 (Indonesia)
   - `_validDays`: 365
4. Call `isVerified` untuk cek status

---

### 11.3 Step 2: Property Token Contract

Contract utama untuk token properti dengan compliance built-in.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IndonesiaPropertyToken
 * @notice ERC-20 token representing fractional ownership of Indonesian real estate
 * @dev Implements compliance checks via KYCRegistry
 *
 * Reference: https://www.erc3643.org/
 */
contract IndonesiaPropertyToken {

    // ============ TOKEN METADATA ============

    string public name;
    string public symbol;
    uint8 public constant decimals = 18;
    uint256 public totalSupply;

    // ============ PROPERTY INFO ============

    struct PropertyInfo {
        string propertyName;        // "Apartemen Sudirman Tower"
        string location;            // "Jakarta Selatan"
        uint256 totalValue;         // Total property value in IDR
        uint256 totalTokens;        // Total tokens representing 100%
        string legalDocument;       // IPFS hash of legal docs
        bool isActive;
    }

    PropertyInfo public property;

    // ============ COMPLIANCE ============

    address public admin;
    address public kycRegistry;     // KYCRegistry contract address

    mapping(address => bool) public frozen;     // Frozen accounts
    mapping(address => uint256) public balances;
    mapping(address => mapping(address => uint256)) public allowances;

    // Investment limits
    uint256 public minInvestment = 1 ether;         // Min 1 token
    uint256 public maxInvestment = 1000 ether;      // Max 1000 tokens

    // ============ EVENTS ============

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event AccountFrozen(address indexed account, string reason);
    event AccountUnfrozen(address indexed account);
    event PropertyUpdated(string propertyName, uint256 totalValue);

    // ============ MODIFIERS ============

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }

    modifier notFrozen(address _account) {
        require(!frozen[_account], "Account is frozen");
        _;
    }

    modifier onlyVerified(address _account) {
        require(_isVerified(_account), "Not KYC verified");
        _;
    }

    // ============ CONSTRUCTOR ============

    /**
     * @notice Deploy property token
     * @param _name Token name (e.g., "Sudirman Tower Token")
     * @param _symbol Token symbol (e.g., "SDMN")
     * @param _kycRegistry Address of deployed KYCRegistry
     * @param _propertyName Name of the property
     * @param _location Property location
     * @param _totalValue Total property value in IDR
     * @param _totalTokens Total tokens to mint (representing 100%)
     */
    constructor(
        string memory _name,
        string memory _symbol,
        address _kycRegistry,
        string memory _propertyName,
        string memory _location,
        uint256 _totalValue,
        uint256 _totalTokens
    ) {
        require(_kycRegistry != address(0), "Invalid KYC registry");

        name = _name;
        symbol = _symbol;
        admin = msg.sender;
        kycRegistry = _kycRegistry;

        property = PropertyInfo({
            propertyName: _propertyName,
            location: _location,
            totalValue: _totalValue,
            totalTokens: _totalTokens,
            legalDocument: "",
            isActive: true
        });

        // Mint all tokens to admin initially
        totalSupply = _totalTokens;
        balances[msg.sender] = _totalTokens;
        emit Transfer(address(0), msg.sender, _totalTokens);
    }

    // ============ ERC-20 FUNCTIONS ============

    function balanceOf(address _owner) public view returns (uint256) {
        return balances[_owner];
    }

    /**
     * @notice Transfer tokens with compliance checks
     * @dev Both sender and receiver must be KYC verified and not frozen
     */
    function transfer(
        address _to,
        uint256 _value
    )
        public
        notFrozen(msg.sender)
        notFrozen(_to)
        onlyVerified(msg.sender)
        onlyVerified(_to)
        returns (bool)
    {
        require(_to != address(0), "Invalid recipient");
        require(balances[msg.sender] >= _value, "Insufficient balance");

        // Check investment limits for receiver
        uint256 newBalance = balances[_to] + _value;
        require(newBalance <= maxInvestment, "Exceeds max investment");

        balances[msg.sender] -= _value;
        balances[_to] += _value;

        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function approve(address _spender, uint256 _value) public returns (bool) {
        allowances[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function allowance(address _owner, address _spender) public view returns (uint256) {
        return allowances[_owner][_spender];
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    )
        public
        notFrozen(_from)
        notFrozen(_to)
        onlyVerified(_from)
        onlyVerified(_to)
        returns (bool)
    {
        require(_to != address(0), "Invalid recipient");
        require(balances[_from] >= _value, "Insufficient balance");
        require(allowances[_from][msg.sender] >= _value, "Insufficient allowance");

        uint256 newBalance = balances[_to] + _value;
        require(newBalance <= maxInvestment, "Exceeds max investment");

        balances[_from] -= _value;
        balances[_to] += _value;
        allowances[_from][msg.sender] -= _value;

        emit Transfer(_from, _to, _value);
        return true;
    }

    // ============ ADMIN FUNCTIONS ============

    /**
     * @notice Freeze account (for AML/compliance)
     */
    function freezeAccount(
        address _account,
        string calldata _reason
    ) external onlyAdmin {
        frozen[_account] = true;
        emit AccountFrozen(_account, _reason);
    }

    /**
     * @notice Unfreeze account
     */
    function unfreezeAccount(address _account) external onlyAdmin {
        frozen[_account] = false;
        emit AccountUnfrozen(_account);
    }

    /**
     * @notice Force transfer (for legal compliance, recovery)
     */
    function forceTransfer(
        address _from,
        address _to,
        uint256 _value
    ) external onlyAdmin {
        require(balances[_from] >= _value, "Insufficient balance");

        balances[_from] -= _value;
        balances[_to] += _value;

        emit Transfer(_from, _to, _value);
    }

    /**
     * @notice Update property legal documents
     */
    function setLegalDocument(string calldata _ipfsHash) external onlyAdmin {
        property.legalDocument = _ipfsHash;
    }

    /**
     * @notice Update investment limits
     */
    function setInvestmentLimits(
        uint256 _min,
        uint256 _max
    ) external onlyAdmin {
        require(_min < _max, "Invalid limits");
        minInvestment = _min;
        maxInvestment = _max;
    }

    // ============ VIEW FUNCTIONS ============

    /**
     * @notice Get ownership percentage
     */
    function getOwnershipPercent(address _owner) public view returns (uint256) {
        if (totalSupply == 0) return 0;
        return (balances[_owner] * 10000) / totalSupply; // Returns basis points (100% = 10000)
    }

    /**
     * @notice Get token value in IDR
     */
    function getTokenValueIDR() public view returns (uint256) {
        if (property.totalTokens == 0) return 0;
        return property.totalValue / property.totalTokens;
    }

    /**
     * @notice Check if transfer would be allowed
     */
    function canTransfer(
        address _from,
        address _to,
        uint256 _value
    ) public view returns (bool, string memory) {
        if (frozen[_from]) return (false, "Sender is frozen");
        if (frozen[_to]) return (false, "Receiver is frozen");
        if (!_isVerified(_from)) return (false, "Sender not KYC verified");
        if (!_isVerified(_to)) return (false, "Receiver not KYC verified");
        if (balances[_from] < _value) return (false, "Insufficient balance");
        if (balances[_to] + _value > maxInvestment) return (false, "Exceeds max investment");

        return (true, "Transfer allowed");
    }

    // ============ INTERNAL FUNCTIONS ============

    function _isVerified(address _account) internal view returns (bool) {
        // Admin is always verified
        if (_account == admin) return true;

        // Check KYC registry
        (bool success, bytes memory data) = kycRegistry.staticcall(
            abi.encodeWithSignature("isVerified(address)", _account)
        );

        if (!success) return false;
        return abi.decode(data, (bool));
    }
}
```

**Cara Test di Remix:**

1. Deploy `KYCRegistry` terlebih dahulu
2. Copy address `KYCRegistry`
3. Deploy `IndonesiaPropertyToken` dengan parameter:
   - `_name`: "Sudirman Tower Token"
   - `_symbol`: "SDMN"
   - `_kycRegistry`: (paste address KYCRegistry)
   - `_propertyName`: "Apartemen Sudirman Tower"
   - `_location`: "Jakarta Selatan"
   - `_totalValue`: 10000000000000 (10 Miliar IDR)
   - `_totalTokens`: 10000000000000000000000 (10,000 tokens dengan 18 decimals)

4. Register investor di `KYCRegistry`
5. Transfer token ke investor yang sudah KYC

---

### 11.4 Testing Flow

```
COMPLETE TESTING FLOW
=====================

1. DEPLOY CONTRACTS
   a. Deploy KYCRegistry
      - Note the contract address
   b. Deploy IndonesiaPropertyToken
      - Use KYCRegistry address

2. REGISTER INVESTORS
   In KYCRegistry:
   - registerInvestor(investor1_address, 2, 360, 365)
   - registerInvestor(investor2_address, 2, 360, 365)

3. TEST TRANSFERS
   In PropertyToken:
   a. Check canTransfer(admin, investor1, 100 ether)
      Expected: (true, "Transfer allowed")

   b. transfer(investor1, 100 ether)
      Expected: Success

   c. Switch to investor1 account
   d. transfer(investor2, 50 ether)
      Expected: Success

4. TEST COMPLIANCE
   a. freezeAccount(investor1, "AML investigation")
   b. Try transfer from investor1
      Expected: Revert "Account is frozen"
   c. unfreezeAccount(investor1)
   d. Transfer should work now

5. TEST REVOCATION
   In KYCRegistry:
   a. revokeInvestor(investor2)
   b. Try transfer to investor2
      Expected: Revert "Not KYC verified"

6. CHECK OWNERSHIP
   - getOwnershipPercent(investor1)
   - getTokenValueIDR()
```

---

## 12. Resources & References

### Official Documentation

| Resource | Link |
|----------|------|
| ERC-3643 Standard | [erc3643.org](https://www.erc3643.org/) |
| T-REX GitHub | [github.com/TokenySolutions/T-REX](https://github.com/TokenySolutions/T-REX) |
| ERC-3643 Simplified (Raptor) | [github.com/Aboudjem/ERC-3643](https://github.com/Aboudjem/ERC-3643) |
| Tokeny Documentation | [tokeny.com/erc3643](https://tokeny.com/erc3643/) |
| QuillHash RWA Guide | [github.com/Quillhash/Real-World-Assets-RWA](https://github.com/Quillhash/Real-World-Assets-RWA) |

### Mantle Resources

| Resource | Link |
|----------|------|
| Mantle Docs | [docs.mantle.xyz](https://docs.mantle.xyz/) |
| Mantle RWA Ecosystem | [mantle.xyz/blog](https://www.mantle.xyz/blog/ecosystem/mantle-ecowaves-rwa-revolution-and-meth-integration-insights) |
| Mantle Hackathon | [hackquest.io/hackathons/Mantle-Global-Hackathon-2025](https://www.hackquest.io/hackathons/Mantle-Global-Hackathon-2025) |

### Indonesian Resources

| Resource | Link |
|----------|------|
| Tokenize Indonesia | [mediaindonesia.com](https://mediaindonesia.com/ekonomi/809739/aset-dunia-nyata-didorong-masuk-blockchain-lewat-tokenize-indonesia) |
| RWA Indonesia News | [bisnis.com](https://market.bisnis.com/read/20250429/94/1872775/tokenisasi-aset-dunia-nyata-rwa-tumbuh-85-bakal-jadi-tren-blockchain-2025) |
| OJK Regulations | [ojk.go.id](https://www.ojk.go.id/) |

### Analytics & Data

| Resource | Link |
|----------|------|
| RWA Analytics | [rwa.xyz](https://rwa.xyz/) |
| CoinGecko RWA | [coingecko.com/learn](https://www.coingecko.com/learn/what-are-real-world-assets-exploring-rwa-protocols) |
| RWA Market Cap | [coinmarketcap.com/real-world-assets](https://coinmarketcap.com/real-world-assets/) |

### Tools

| Tool | Link |
|------|------|
| Remix IDE | [remix.ethereum.org](https://remix.ethereum.org/) |
| OpenZeppelin Contracts | [docs.openzeppelin.com](https://docs.openzeppelin.com/contracts/) |
| Chainlist (Mantle) | [chainlist.org/?search=mantle](https://chainlist.org/?search=mantle&testnets=true) |

---

## 13. Summary

Real World Assets (RWA) merepresentasikan konvergensi antara keuangan tradisional dan blockchain:

| Aspek | Detail |
|-------|--------|
| **Market Size** | $33 Miliar (2025) → $10-30 Triliun (2030) |
| **Indonesia Opportunity** | $88 Miliar potensi tokenisasi |
| **Standard** | ERC-3643 ($28B+ tokenized) |
| **Key Compliance** | KYC, AML, Whitelisting |
| **Mantle Advantage** | Low gas, $7.9B treasury, RWA ecosystem |

### Key Takeaways

1. **RWA menjembatani TradFi dan DeFi** - Membawa likuiditas, transparansi, dan efisiensi ke aset tradisional

2. **Legal structuring sangat penting** - SPV model paling umum digunakan

3. **Compliance adalah mandatory** - KYC/AML/Whitelisting bukan opsional

4. **ERC-3643 adalah standar de facto** - Built-in identity dan modular compliance

5. **Indonesia memiliki potensi besar** - $88B market opportunity dengan regulasi yang berkembang

6. **Mantle ideal untuk RWA** - Low cost, institutional backing, RWA-focused ecosystem

### Next Steps

1. **Practice**: Deploy IndonesiaPropertyToken di Remix
2. **Explore**: Baca dokumentasi ERC-3643 dan T-REX
3. **Build**: Kembangkan project untuk Mantle Hackathon
4. **Connect**: Join Mantle Discord untuk komunitas

:::success Challenge
Modifikasi `IndonesiaPropertyToken` untuk menambahkan fitur:
- Dividend distribution
- Voting mechanism
- Secondary market listing
- Multi-property support
:::
