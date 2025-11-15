---
sidebar_position: 4
title: "Part 3: Understanding Automated Market Makers (AMM)"
---

# Part 3: Understanding Automated Market Makers (AMM)

> **"AMM adalah inovasi yang mengubah setiap orang menjadi market maker - pekerjaan yang sebelumnya hanya bisa dilakukan oleh institusi Wall Street."**

---

## 📚 Overview

Di Part 2, kita belajar bahwa **Uniswap (2018)** revolusioner karena memperkenalkan **Automated Market Maker (AMM)**.

**Di Part 3 ini, kita akan melakukan pembahasan mendalam:**
- Bagaimana AMM bekerja secara detail
- Formula **x × y = k** dengan contoh praktis
- Analogi petani kentang & apel (dari Whiteboard Crypto)
- Liquidity pools & liquidity providers
- Slippage & price impact
- Impermanent loss (risiko terbesar!)

**Durasi:** 120 menit (2 jam)

---

## 🎯 Apa itu Automated Market Maker (AMM)?

### Definition

**Automated Market Maker (AMM)** adalah algoritma yang:
1. ✅ Menentukan harga aset berdasarkan **rasio di liquidity pool**
2. ✅ Memungkinkan trading **instant** tanpa order book
3. ✅ Menggunakan formula matematika (biasanya **x × y = k**)
4. ✅ Berjalan 24/7 **tanpa manusia** (pure smart contract)

---

### AMM vs Order Book

Mari bandingkan kedua model:

#### **Order Book (Traditional)**

**Cara kerja:**
```
BUY ORDERS (Bids):          SELL ORDERS (Asks):
Alice: 1 ETH @ $2,450       David: 1 ETH @ $2,470
Bob:   2 ETH @ $2,445       Eve:   3 ETH @ $2,475
Carol: 5 ETH @ $2,440       Frank: 2 ETH @ $2,480

Spread = $2,470 - $2,450 = $20
```

**Pros:**
- ✅ Price discovery (market sets exact price)
- ✅ Tidak ada price impact untuk limit orders
- ✅ Familiar untuk traders

**Cons:**
- ❌ Butuh **market makers** (professionals yang provide liquidity)
- ❌ Gas intensive di blockchain (setiap order = transaction)
- ❌ Slow matching di blockchain
- ❌ **Liquidity fragmentation** (berbeda di setiap exchange)

---

#### **AMM (Uniswap Model)**

**Cara kerja:**
```
Liquidity Pool:
100 ETH + 250,000 USDC = 25,000,000 (k)

Current Price:
250,000 USDC / 100 ETH = 2,500 USDC per ETH

No orders needed - trade instantly!
```

**Pros:**
- ✅ **Instant trading** (tidak perlu menunggu untuk pencocokan)
- ✅ **Always liquid** (selama ada tokens di pool)
- ✅ **Permissionless** (anyone can be liquidity provider)
- ✅ **Simple** (no complex order management)
- ✅ **Passive income** untuk LPs (earn fees)

**Cons:**
- ❌ **Price impact** (large trades move price significantly)
- ❌ **Slippage** (harga berubah selama trading)
- ❌ **Impermanent loss** untuk LPs (risiko karena volatilitas harga)
- ❌ Kurang capital efficient (idle capital di pool)

---

## 🧮 Formula AMM: x × y = k

### Core Concept

**Constant Product Formula** (digunakan oleh Uniswap V1 & V2):

```
x × y = k

x = jumlah Token A di pool
y = jumlah Token B di pool
k = konstanta yang HARUS SELALU TETAP
```

**Rules:**
1. 🔒 **k harus tetap konstan** (kecuali ada liquidity added/removed)
2. 📊 **Price = y / x** (ratio dari kedua token)
3. 🔄 **Setiap swap:** jumlah x naik, maka y turun (atau sebaliknya) agar k tetap konstan

---

### Why "Constant Product"?

**Constant Product** = hasil kali (product) dari x dan y harus **konstan** (constant).

**Matematika:**
```
Before swap: x₁ × y₁ = k
After swap:  x₂ × y₂ = k

Therefore: x₁ × y₁ = x₂ × y₂
```

**Implikasi penting:**
- Semakin banyak token A di pool → semakin murah token A
- Semakin sedikit token B di pool → semakin mahal token B
- **Automatic price adjustment!** 📈📉

---

### Visual: The Curve

**Grafik x × y = k** membentuk **hyperbola** (kurva melengkung):

```
y (Token B)
│
│ ╱
│╱
│     ╲
│      ╲
│       ╲_______________
│                       x (Token A)
└────────────────────────

Titik di kurva = possible pool states
Semakin jauh dari origin = semakin banyak liquidity
```

**Properties:**
- 📉 **Asymptotic:** Kurva mendekati axis tapi tidak pernah menyentuh (pool tidak pernah kosong!)
- 📊 **Slope = price:** Kemiringan kurva di setiap titik adalah harga relatif
- 🔄 **Trades move along curve:** Swap menggerakkan titik pool sepanjang kurva

**Ini adalah BRILLIANT design!** Matematika memastikan pool tidak pernah kehabisan salah satu token. 🧠

---

## 🥔🍎 Analogi Petani: Kentang & Apel

> **Video reference: Whiteboard Crypto - "What is an Automated Market Maker?"**

Mari kita gunakan analogi sederhana untuk memahami AMM!

---

### 🌾 Setting: Dua Desa Petani

**Desa A:** Petani kentang 🥔
- Bosan makan kentang terus
- Ingin apel 🍎

**Desa B:** Petani apel 🍎
- Bosan makan apel terus
- Ingin kentang 🥔

**Problem:** Desa terlalu jauh, sulit barter langsung.

---

### 🧞‍♂️ Pedagang & "Jin Ajaib"

**Pedagang datang dengan solusi:**

> "Saya punya **jin ajaib** yang tinggal di **lampu ajaib**. Jin ini akan menyimpan kentang dan apel, dan siapapun bisa datang menukar kapanpun!"

**Setup awal:**
- Desa A deposit: **50,000 kentang** 🥔
- Desa B deposit: **50,000 apel** 🍎

**Lampu ajaib** sekarang berisi:
```
50,000 kentang × 50,000 apel = 2,500,000,000 (ini adalah k!)
```

---

### 📜 Aturan Jin: "Rasio Nilai Sempurna"

**Jin punya satu aturan sakral:**

> **"Jumlah kentang DIKALI jumlah apel harus SELALU sama dengan 2,500,000,000!"**

```
kentang × apel = 2,500,000,000 (k)

ATAU

x × y = k
```

**Mengapa aturan ini cemerlang?**
- ✅ Mencegah pool kehabisan kentang atau apel
- ✅ Harga menyesuaikan otomatis berdasarkan supply & demand
- ✅ Simple (cuma satu formula!)

---

## 📐 Contoh Swap #1: Menukar 7,000 Kentang

**Timeline: 00:03:02 di video Whiteboard Crypto**

---

### Step-by-Step Calculation

**State Awal:**
```
Kentang (x) = 50,000
Apel (y) = 50,000
k = 2,500,000,000

Harga awal:
1 kentang = 50,000 apel / 50,000 kentang = 1 apel
1 apel = 1 kentang
```

Rasio 1:1 karena jumlah sama! 📊

---

**Petani Charlie datang dengan 7,000 kentang:**

> "Jin, saya mau tukar 7,000 kentang. Berapa apel yang saya dapat?"

---

**Step 1: Jin terima kentang**
```
Kentang baru di lampu = 50,000 + 7,000 = 57,000 kentang
```

---

**Step 2: Jin hitung berapa apel yang tersisa agar k = 2,500,000,000**
```
x × y = k
57,000 × y = 2,500,000,000

y = 2,500,000,000 / 57,000
y = 43,859.65 apel (pembulatan: 43,860)
```

Jin harus **menyimpan 43,860 apel** di lampu!

---

**Step 3: Berapa apel yang diberikan ke Charlie?**
```
Apel awal - Apel tersisa = Apel untuk Charlie
50,000 - 43,860 = 6,140 apel 🍎
```

---

### 🤔 Analisis: Mengapa 7,000 kentang = 6,140 apel?

**Perhatikan:**
- Charlie kasih: 7,000 kentang
- Charlie dapat: 6,140 apel
- Ratio: 6,140 / 7,000 = **0.877 apel per kentang**

**Initial ratio: 1 apel per kentang**
**Actual ratio: 0.877 apel per kentang**

**Charlie dapat KURANG dari expected! Kenapa?** 🤔

**Jawaban: PRICE IMPACT!**

Saat Charlie "membeli" apel (dengan menjual kentang):
- ❌ Supply apel di pool **turun** (50,000 → 43,860) - apel jadi **langka**
- ✅ Supply kentang di pool **naik** (50,000 → 57,000) - kentang jadi **banyak**

**Hasilnya:** Harga apel naik, harga kentang turun **selama trading**! 📈📉

---

### 💰 Harga Baru Setelah Swap

**Asumsi:** Total value di setiap sisi = $50,000 awal

**Harga kentang baru:**
```
$50,000 / 57,000 kentang = $0.877 per kentang
(Turun dari $1 karena supply naik!)
```

**Harga apel baru:**
```
$50,000 / 43,860 apel = $1.14 per apel
(Naik dari $1 karena supply turun!)
```

**Spread:**
```
1 apel = 1.14 / 0.877 = 1.30 kentang
(Sebelumnya 1:1, sekarang butuh 1.3 kentang untuk 1 apel!)
```

**Pool secara otomatis menyesuaikan harga berdasarkan trading activity!** 🔄

---

### 📊 State Pool Setelah Swap #1

```
BEFORE:                        AFTER:
50,000 kentang                 57,000 kentang (+14%)
50,000 apel                    43,860 apel (-12.3%)
k = 2,500,000,000              k = 2,499,942,000 ✅ (virtually same, rounding)

Price: 1 apel = 1 kentang      Price: 1 apel = 1.3 kentang
```

**Pool masih balanced** (k preserved)! ✅

---

## 📐 Contoh Swap #2: Menukar 10,000 Kentang Lagi

**Timeline: 00:06:02 di video**

Petani lain datang, kali ini dengan **10,000 kentang**!

---

### Calculation

**State sebelum swap:**
```
Kentang = 57,000
Apel = 43,860
k = 2,500,000,000 (approximately)
```

---

**Step 1: Kentang masuk pool**
```
57,000 + 10,000 = 67,000 kentang
```

---

**Step 2: Calculate apel yang tersisa**
```
67,000 × y = 2,500,000,000
y = 2,500,000,000 / 67,000
y = 37,313 apel
```

---

**Step 3: Apel yang diberikan**
```
43,860 - 37,313 = 6,547 apel
```

---

### 🤔 Analisis Swap #2

**Petani kedua:**
- Kasih: 10,000 kentang (lebih banyak dari Charlie!)
- Dapat: 6,547 apel

**Ratio: 6,547 / 10,000 = 0.655 apel per kentang**

**Compare dengan Charlie (swap #1):**
- Charlie: 0.877 apel per kentang
- Petani kedua: 0.655 apel per kentang (25% lebih buruk!)

**Kenapa lebih buruk?** 🤔

**Jawaban: LARGER PRICE IMPACT!**

Pool sudah "imbalanced" dari swap #1:
- Kentang sudah banyak (57,000) → kentang sudah murah
- Apel sudah sedikit (43,860) → apel sudah mahal

**Trading 10,000 kentang** (14.9% dari pool) menggerakkan harga secara signifikan! 📉

**Pelajaran:** **Larger trades = worse price (exponential impact)** 💡

---

### 💰 Harga Setelah Swap #2

**Harga kentang:**
```
$50,000 / 67,000 = $0.746 per kentang (turun lagi!)
```

**Harga apel:**
```
$50,000 / 37,313 = $1.34 per apel (naik lagi!)
```

**Spread:**
```
1 apel = 1.34 / 0.746 = 1.80 kentang
(Butuh 1.8 kentang untuk 1 apel sekarang!)
```

**Pool semakin imbalanced!** ⚠️

---

## 📐 Contoh Swap #3: Menukar 2,000 Apel (Reverse Direction)

**Timeline: 00:07:53 di video**

Sekarang petani **apel** datang! Dia bosan apel, mau kentang.

---

### Calculation

**State sebelum swap:**
```
Kentang = 67,000
Apel = 37,313
k = 2,500,000,000
```

**Petani deposit: 2,000 apel**

---

**Step 1: Apel masuk pool**
```
37,313 + 2,000 = 39,313 apel
```

---

**Step 2: Calculate kentang tersisa**
```
x × 39,313 = 2,500,000,000
x = 2,500,000,000 / 39,313
x = 63,592 kentang
```

---

**Step 3: Kentang yang diberikan**
```
67,000 - 63,592 = 3,408 kentang 🥔
```

---

### 🎉 Analisis Swap #3

**Petani apel:**
- Kasih: 2,000 apel
- Dapat: 3,408 kentang

**Ratio: 3,408 / 2,000 = 1.704 kentang per apel**

**Bandingkan dengan ratio sebelumnya (1:1):**
- Initial: 1 apel = 1 kentang
- Now: 1 apel = 1.704 kentang (**70% better!**) 🎉

**Kenapa petani apel dapat deal bagus?** 🤔

**Jawaban: Pool IMBALANCED ke arah kentang!**

```
67,000 kentang vs 37,313 apel

Ratio: 67,000 / 37,313 = 1.80
(Ada 1.8x lebih banyak kentang!)

→ Kentang murah, apel mahal
→ Selling apel = great deal!
```

**Pelajaran:** **Trade ke arah yang imbalanced = better price** 💡

---

### 🔄 Arbitrage Opportunity!

**Bayangkan:**

**Initial state (equal value):**
- 1 apel = $1
- 1 kentang = $1

**After swaps (imbalanced):**
- 1 apel = $1.34 (di pool)
- 1 kentang = $0.746 (di pool)

**Arbitrage strategy:**
1. Beli kentang murah dari pool ($0.746)
2. Jual kentang di market eksternal ($1)
3. Profit: $1 - $0.746 = $0.254 per kentang (34% profit!)

**Atau:**
1. Beli apel dari market eksternal ($1)
2. Jual apel di pool ($1.34)
3. Profit: $0.34 per apel (34% profit!)

**Arbitrageurs akan balance pool kembali!** 🔄

**Inilah cara AMM tetap sejalan dengan harga pasar eksternal.** (This is how AMMs stay roughly in line with external market prices.) ✅

---

## 🏊‍♂️ Liquidity Pools: Deeper Dive

### Apa itu Liquidity Pool?

**Liquidity Pool** = smart contract yang menyimpan **dua tokens** (pair) untuk memfasilitasi trading.

**Dalam analogi kita:**
- **Liquidity Pool** = "lampu ajaib" 🪔
- **Tokens** = kentang & apel
- **Jin** = smart contract algorithm

---

### Pool Size = Stability

**Rule:** **Semakin besar pool, semakin stabil harga!**

**Example:**

**Small Pool:**
```
100 ETH × 250,000 USDC = 25,000,000 (k)

Swap 10 ETH (10% of pool):
110 ETH × y = 25,000,000
y = 227,272 USDC

Price impact: 250,000 - 227,272 = 22,728 USDC for 10 ETH
= 2,272 per ETH (9.1% worse than initial 2,500!)
```

**Large Pool:**
```
10,000 ETH × 25,000,000 USDC = 250,000,000,000 (k)

Swap 10 ETH (0.1% of pool):
10,010 ETH × y = 250,000,000,000
y = 24,975,024 USDC

Price impact: 25,000,000 - 24,975,024 = 24,976 USDC for 10 ETH
= 2,498 per ETH (0.09% worse than initial 2,500!)
```

**10 ETH swap:**
- Small pool: **9.1% price impact** ❌
- Large pool: **0.09% price impact** ✅ (100x better!)

**Kesimpulan: Deep liquidity = minimal slippage!** 💧

---

### Initial Liquidity & Price Setting

**Q: Siapa yang menentukan harga awal pool?**

**A: FIRST LIQUIDITY PROVIDER!**

**Scenario:**

Alice creates ETH/USDC pool:
```
She deposits:
- 100 ETH
- 200,000 USDC

Initial price: 200,000 / 100 = 2,000 USDC per ETH
```

**Alice sets initial price at $2,000!**

---

**Q: Bagaimana jika Alice set harga salah?**

**Example:**
```
Alice deposits:
- 100 ETH
- 100,000 USDC

Initial price: 100,000 / 100 = 1,000 USDC per ETH

Market price di CEX: 2,500 USDC per ETH
```

**Alice's price: $1,000 (60% below market!)**

**What happens?**

**Arbitrageurs INSTANTLY:**
1. Buy cheap ETH dari pool (pay 1,000 USDC, get 1 ETH)
2. Sell ETH di Coinbase (receive 2,500 USDC)
3. Profit: 1,500 USDC per ETH! 💰

**Arbitrageurs drain pool until price = market price.**

**Alice loses money!** ❌

**Pelajaran: ALWAYS set initial price = market price!** ⚠️

---

## 🎁 Liquidity Providers (LPs): The Heroes

### Siapa itu Liquidity Provider?

**Liquidity Provider (LP)** = orang/entitas yang **deposit tokens** ke liquidity pool.

**Dalam analogi:**
- Desa A & Desa B yang deposit 50,000 kentang & apel awal = **initial LPs**

---

### Mengapa Jadi LP?

**Incentives:**

**1. Trading Fees** 💰
- Setiap swap charge fee (typically 0.3% di Uniswap)
- Fee dibagi ke **semua LP sesuai proporsi share** mereka
- Passive income!

**Example:**
```
Pool has $10M total liquidity
You provide $100,000 (1% of pool)

Daily trading volume: $5M
Daily fees: $5M × 0.3% = $15,000

Your share: $15,000 × 1% = $150 per day
= $54,750 per year

ROI: $54,750 / $100,000 = 54.75% APR 🚀
```

---

**2. Liquidity Mining Rewards** 🌾

Many protocols give **extra tokens** to LPs:

```
Uniswap LP earnings:
- Trading fees: 20% APR
- UNI rewards: 30% APR
- Total: 50% APR 🤑
```

---

**3. Support Your Own Token** 💪

If you launch token, **you provide initial liquidity** to enable trading!

---

### LP Tokens: Proof of Deposit

**Saat Anda deposit, Anda menerima "LP tokens"** (ERC-20) sebagai **bukti deposit**.

**Example:**

**You deposit:**
```
10 ETH + 25,000 USDC
(Total value: $50,000)
```

**Pool has:**
```
100 ETH + 2,500,000 USDC
(Total value: $5,000,000)

Your share: $50,000 / $5,000,000 = 1%
```

**You receive:**
```
LP tokens representing 1% of pool
(Exact amount depends on contract, maybe 100 LP tokens)
```

---

**LP tokens are:**
- ✅ **Transferable** (you can send/sell them)
- ✅ **Composable** (use in other DeFi protocols)
- ✅ **Redeemable** (burn untuk menarik proportional share dari pool)

---

### How to Become LP (Uniswap)

**Step-by-step:**

**1. Choose pair** (e.g., ETH/USDC)

**2. Deposit nilai yang sama dari kedua tokens**
```
Example:
- 1 ETH (worth $2,500)
- $2,500 USDC
```

**3. Receive LP tokens**
```
UNI-V2 LP tokens (proof of deposit)
```

**4. Earn fees automatically**
```
Fees accumulate in pool
Your share grows over time
```

**5. Withdraw anytime**
```
Burn LP tokens → receive proportional ETH + USDC
```

---

## 📉 Slippage & Price Impact

### Slippage vs Price Impact

**Often confused! Let's clarify:**

---

#### **Price Impact** 📊

**Definition:** Seberapa besar trade Anda **mengubah harga pool**.

**Caused by:** Trade size relative to pool size

**Formula:**
```
Price Impact = |New Price - Old Price| / Old Price × 100%
```

**Example:**
```
Before swap:
Pool: 100 ETH × 250,000 USDC
Price: 2,500 USDC per ETH

After swapping 10 ETH → USDC:
Pool: 110 ETH × 227,272 USDC
Price: 2,066 USDC per ETH

Price Impact = |2,066 - 2,500| / 2,500 × 100%
            = 17.4% 📉
```

**You moved price 17.4% with 10 ETH swap!**

---

#### **Slippage** 🎢

**Definition:** Perbedaan antara **expected price** (saat submit transaction) dan **actual execution price**.

**Caused by:**
1. **Price impact** (your trade)
2. **Other trades** yang execute sebelum Anda (front-running, atau organic trading)

**Example:**

**You submit transaction:**
```
Expected: 1 ETH = 2,500 USDC
Slippage tolerance: 1%
Min acceptable: 2,475 USDC
```

**By the time transaction executes (12 seconds later):**
```
Actual: 1 ETH = 2,460 USDC (1.6% slippage)
```

**Within tolerance → transaction succeeds ✅**

**If slippage was 2,400 USDC (4% slippage):**
```
Below min acceptable (2,475)
→ Transaction REVERTS ❌
```

---

### Setting Slippage Tolerance

**UI typically has slider:**

```
Slippage Tolerance: [0.1%] [0.5%] [1%] [5%] [Custom]
```

**Trade-offs:**

**Low slippage (0.1-0.5%):**
- ✅ Protected from bad prices
- ❌ Transaction likely fails (reverts) during volatility
- **Use for:** Stableswap pairs (USDC/USDT), low volatility

**Medium slippage (1-2%):**
- ✅ Balanced
- **Use for:** Normal trading

**High slippage (5%+):**
- ✅ Transaction likely succeeds
- ❌ Vulnerable to **sandwich attacks** (MEV bots)
- **Use for:** Low liquidity tokens (only if desperate!)

---

### 🥪 Sandwich Attacks (MEV)

**Sandwich attack** = MEV bot mengeksploitasi Anda dengan front-run & back-run transaction Anda.

**Attack flow:**

**1. Bot sees your pending transaction:**
```
You: Swap 10 ETH → USDC
Your slippage: 5%
```

**2. Bot front-runs (transaction execute BEFORE yours):**
```
Bot: Swap 50 ETH → USDC
→ Price moves up (ETH becomes expensive)
```

**3. Your transaction executes:**
```
You: Get worse price (5% worse, within tolerance)
```

**4. Bot back-runs (transaction execute AFTER yours):**
```
Bot: Swap USDC → ETH
→ Buy back ETH at lower price
→ Profit = difference 💰
```

**You lose, bot profits.** 😞

**Protection:**
- ✅ Use **low slippage** (harder to sandwich)
- ✅ Use **private RPC** (Flashbots Protect)
- ✅ Trade on **low-latency L2s** (Arbitrum, Optimism)

---

## 💔 Impermanent Loss: The LP's Biggest Risk

### Apa itu Impermanent Loss?

**Impermanent Loss (IL)** = kerugian "sementara" yang dialami LP ketika **harga tokens berubah** dibandingkan dengan saat deposit.

**Disebut "impermanent" karena:**
- Kerugian hilang jika harga kembali ke titik awal
- Menjadi permanen jika Anda withdraw

---

### Example: ETH/USDC Pool

**Scenario:**

**Initial deposit (Day 0):**
```
Price: 1 ETH = 2,000 USDC

You deposit:
- 1 ETH
- 2,000 USDC
Total value: $4,000

Pool total:
- 100 ETH
- 200,000 USDC
Your share: 1%
```

---

**Strategy A: Just HODL (tidak jadi LP)**
```
Day 0: 1 ETH + 2,000 USDC = $4,000
```

**After 30 days: ETH price DOUBLES (2,000 → 4,000 USDC)**
```
Your holdings:
- 1 ETH (worth $4,000)
- 2,000 USDC (worth $2,000)
Total: $6,000 🎉

Gain: $2,000 (50% profit)
```

---

**Strategy B: LP di pool**

**After ETH doubles, arbitrageurs balance pool:**

**Before arbitrage:**
```
100 ETH × 200,000 USDC = 20,000,000 (k)
External price: 4,000 USDC per ETH
Pool price: 2,000 USDC per ETH (out of sync!)
```

**Arbitrageurs buy cheap ETH dari pool until prices match:**

**After arbitrage (balanced):**
```
Pool must satisfy:
- x × y = 20,000,000
- y / x = 4,000 (match market price)

Solving:
x × (4,000x) = 20,000,000
4,000x² = 20,000,000
x² = 5,000
x = 70.71 ETH

y = 4,000 × 70.71 = 282,843 USDC
```

**New pool composition:**
```
70.71 ETH × 282,843 USDC = 20,000,000 ✅

(Was 100 ETH × 200,000 USDC initially)
```

---

**Your 1% share:**
```
You receive:
- 0.7071 ETH (worth $2,828)
- 2,828 USDC (worth $2,828)
Total: $5,656

Plus trading fees earned: ~$50 (assumed)
Grand total: $5,706
```

---

**Compare strategies:**

```
Strategy A (HODL):      $6,000 ✅
Strategy B (LP):        $5,706 ❌

Impermanent Loss: $6,000 - $5,706 = $294
IL percentage: $294 / $6,000 = 4.9%
```

**You LOST $294 by being LP instead of HODL!** 😞

---

### 🧮 IL Formula

**For x% price change:**

```
IL = 2 × √(price_ratio) / (1 + price_ratio) - 1
```

**Where:**
```
price_ratio = new_price / initial_price
```

---

**Common IL scenarios:**

| Price Change | Impermanent Loss |
|--------------|------------------|
| 1.25x (25% up) | -0.6% |
| 1.5x (50% up)  | -2.0% |
| 2x (100% up)   | -5.7% |
| 3x (200% up)   | -13.4% |
| 4x (300% up)   | -20.0% |
| 5x (400% up)   | -25.5% |

**Observations:**
- 📈 **Higher price change = higher IL** (exponential!)
- ⚠️ **4x price = 20% IL** (significant!)
- 😱 **Large moves = devastating IL**

---

### When Do Fees Overcome IL?

**LPs profit when:**
```
Trading Fees Earned > Impermanent Loss
```

**Example:**

**ETH doubles (2x), IL = 5.7%**
```
Your initial value: $4,000
IL loss: $4,000 × 5.7% = $228

If you earned $300 in fees:
Net profit: $300 - $228 = +$72 ✅
```

**Key factors:**
1. **High trading volume** = more fees
2. **Low volatility** = less IL
3. **Time** = more fees accumulate

**Best pairs untuk menjadi LP:**
- ✅ **Stablecoin pairs** (USDC/USDT, DAI/USDC) - minimal IL
- ✅ **Correlated assets** (ETH/stETH, WBTC/renBTC) - low IL
- ⚠️ **Volatile pairs** (ETH/SHIB, ETH/MEME) - high IL risk

---

### IL Visualization

**Graph:**

```
Profit/Loss (%)
│
│     HODL (linear growth)
│    ╱
│   ╱
│  ╱
│ ╱
│╱_____________________ Price Change
│     ╲
│      ╲
│       ╲ LP (IL drag)
│        ╲
```

**Interpretation:**
- When price is stable → LP earns fees (ahead of HODL)
- When price moves significantly → HODL outperforms (IL kicks in)

---

## 🛡️ IL Protection Strategies

### 1. Choose Low-IL Pairs

**Stablecoin pairs:**
```
USDC/DAI, USDT/USDC
→ Minimal IL (maybe 0.01%)
→ Lower fees (0.01% instead of 0.3%)
→ Still profitable due to high volume
```

---

### 2. Provide Liquidity Short-Term

**During high volatility:**
- ❌ Avoid LP (too much IL risk)

**During consolidation/sideways:**
- ✅ LP aggressively (fees without IL)

**Withdraw before major moves!**

---

### 3. Use Concentrated Liquidity (Uniswap V3)

**Uniswap V3** allows you to provide liquidity in **specific price range**:

```
Instead of:
0 → ∞ (inefficient, most capital idle)

You choose:
2,400 - 2,600 USDC per ETH (concentrated!)
```

**Benefits:**
- ✅ **Capital efficient** (earn more fees per $)
- ✅ **Lower IL** (if price stays in range)

**Risks:**
- ❌ **Out-of-range** = no fees earned (need active management)

---

### 4. IL Insurance/Protection

Some protocols offer **IL protection**:

**Bancor:**
- 100% IL protection after 100 days staked
- Protocol uses BNT emissions untuk menutupi IL

**Tokemak:**
- "Liquidity Directors" vote on incentives
- Single-sided staking (no IL!)

---

## 🎯 Advanced AMM Variants

### 1. Constant Product (x × y = k)

**Used by:** Uniswap V1, V2, SushiSwap

**Pros:**
- ✅ Simple
- ✅ Works for any pair

**Cons:**
- ❌ Capital inefficient (most idle)
- ❌ High slippage untuk trading besar

---

### 2. Stable Swap (Curve)

**Formula:** Hybrid antara constant product & constant sum

**Optimized for:** Stablecoin pairs

**Example:**
```
USDC/USDT/DAI pool
→ Minimal slippage even untuk trading besar
→ 0.04% fee (lower than Uniswap)
```

**Hasilnya:**
- ✅ Deep liquidity untuk stables
- ✅ Minimal IL

---

### 3. Concentrated Liquidity (Uniswap V3)

**LPs choose price range:**

```
Traditional: Provide liquidity 0 → ∞
V3: Provide liquidity 2,400 → 2,600 USDC per ETH
```

**Benefits:**
- ✅ **4,000x more capital efficient** (if range tight!)
- ✅ **Earn more fees** per $ deposited

**Trade-offs:**
- ❌ Active management needed
- ❌ Out-of-range = no fees

---

### 4. Dynamic Fees (Uniswap V4, Balancer)

**Fees adjust based on volatility:**

```
Low volatility: 0.05% fee
High volatility: 1% fee (melindungi LPs dari IL)
```

---

### 5. Weighted Pools (Balancer)

**Not 50/50, can be any ratio:**

```
Example:
80% WETH / 20% USDC

→ Less IL (more exposure to WETH)
→ Similar to "hodling" with some LP fees
```

---

## 🧠 Key Takeaways

### AMM Core Concepts

1. ✅ **x × y = k** is simple but brilliant formula
2. ✅ **Larger pool = more stable price** (less slippage)
3. ✅ **Price impact** meningkat secara eksponensial sesuai dengan ukuran trade
4. ✅ **Arbitrageurs** keep AMM prices synced dengan external markets

---

### For Traders

1. ✅ **Check price impact** before large trades
2. ✅ **Set appropriate slippage** (1-2% for most trades)
3. ✅ **Split large orders** untuk mengurangi impact
4. ✅ **Use aggregators** (1inch, Matcha) untuk mendapatkan harga terbaik

---

### For LPs

1. ✅ **Understand IL** - biggest risk!
2. ✅ **Choose pairs wisely** (correlated = less IL)
3. ✅ **High volume pairs** = more fees to overcome IL
4. ✅ **Monitor positions** (pertimbangkan active management untuk V3)
5. ✅ **Calculate break-even:**
   ```
   Days to break-even = IL / Daily fees
   ```

---

## 🔜 Next: Build Your Own DEX!

Di [Part 4: Hands-on Lab - Build Simple DEX →](./04-build-simple-dex.md), kita akan:

- 💻 **Build SimpleDEX smart contract** dengan Solidity
- ⚙️ Implement **x × y = k** formula di code
- 🧪 Write comprehensive **tests**
- 🚀 **Deploy** ke Lisk Sepolia testnet
- 🎨 (Optional) Build **frontend** interface

**Sekarang Anda paham teori. Time to code it!** 💪

---

## 📚 Further Resources

### Videos
- [Whiteboard Crypto: What is an Automated Market Maker?](https://www.youtube.com/watch?v=1PbZMudPP5E) - Analogi petani!
- [Finematics: How Do Liquidity Pools Work?](https://www.youtube.com/watch?v=cizLhxSKrAc)
- [Finematics: Impermanent Loss Explained](https://www.youtube.com/watch?v=8XJ1MSTEuU0)

### Articles
- [Uniswap V2 Whitepaper](https://uniswap.org/whitepaper.pdf)
- [Understanding Impermanent Loss](https://academy.binance.com/en/articles/impermanent-loss-explained)
- [The Ultimate Guide to Uniswap](https://defiprime.com/uniswap)

### Tools
- [Impermanent Loss Calculator](https://dailydefi.org/tools/impermanent-loss-calculator/)
- [Uniswap Pool Calculator](https://uniswap.org/calculator)
- [AMM Curve Visualizer](https://www.desmos.com/calculator/zk1dnmbjlg)

### Deep Dives
- [Uniswap V3 Math Explained](https://atiselsts.github.io/pdfs/uniswap-v3-liquidity-math.pdf)
- [Curve StableSwap Paper](https://curve.fi/files/stableswap-paper.pdf)
- [MEV & Sandwich Attacks](https://www.mev.wiki/)

---

**Ready to code?** [Let's build! Part 4 →](./04-build-simple-dex.md) 🚀
