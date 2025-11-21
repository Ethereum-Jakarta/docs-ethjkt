# Bagian 2: Perbandingan zk-SNARK vs zk-STARK

> **Referensi:** [Chainlink Education - zk-SNARKs vs zk-STARKs](https://chain.link/education-hub/zk-snarks-vs-zk-starks)

---

## 📚 Tujuan Pembelajaran

Setelah menyelesaikan bagian ini, Anda akan mampu:

1. Memahami apa itu zk-SNARK dan zk-STARK
2. Membandingkan kelebihan dan kekurangan masing-masing
3. Memahami konsep Trusted Setup
4. Menjelaskan perbedaan proof size dan verification time
5. Memahami quantum resistance
6. Memilih teknologi yang tepat untuk use case tertentu

---

## 🎯 Apa Itu zk-SNARK?

### Definisi

**zk-SNARK** adalah singkatan dari:
- **Z**ero-**K**nowledge
- **S**uccinct (Ringkas)
- **N**on-**I**nteractive
- **A**rgument of **K**nowledge

### Sejarah

**Paper Fundamental (2012):**
- **Penulis:** Nir Bitansky, Ran Canetti, Alessandro Chiesa, Eran Tromer
- **Kontribusi:** Memperkenalkan konsep SNARKs
- **Aplikasi Pertama:** Zcash (2016) - Cryptocurrency dengan private transactions

### Karakteristik Utama

```
┌─────────────────────────────────────────┐
│  zk-SNARK PROPERTIES                    │
│  ─────────────────────────────────────  │
│                                          │
│  ✅ Proof Size: KECIL (~200 bytes)      │
│  ✅ Verification Time: CEPAT (ms)       │
│  ✅ Gas Cost: RENDAH                    │
│  ⚠️  Trusted Setup: DIPERLUKAN          │
│  ⚠️  Quantum Resistance: BELUM          │
│  ✅ Mature Technology                   │
└─────────────────────────────────────────┘
```

### Trusted Setup: Konsep Penting

**Apa itu Trusted Setup?**

Trusted Setup adalah **upacara awal** dimana:
1. Keys untuk membuat proofs dibuat
2. Keys untuk verify proofs dibuat
3. **Secrets harus dihancurkan** setelah upacara

**Mengapa Penting?**

```
Jika secrets TIDAK dihancurkan:
→ Seseorang bisa membuat FALSE PROOFS
→ Bisa forge transactions
→ Bisa mint tokens dari udara
→ TIDAK ada cara verify bahwa proof palsu
```

**Contoh Trusted Setup:**

**Zcash Powers of Tau Ceremony (2016-2017):**
- Ribuan partisipan dari seluruh dunia
- Setiap partisipan membuat & menghancurkan secrets
- Probabilitas semua partisipan jahat = sangat kecil
- **Masih:** Beberapa orang mengkritik sebagai "security weak link"

**PLONK (Universal Setup):**
- Satu trusted setup untuk semua program
- Bisa digunakan oleh banyak proyek
- Masih memerlukan kepercayaan pada upacara

### Kelebihan zk-SNARK

1. **Proof Size Kecil**
   ```
   ~200 bytes untuk proof
   → Hemat gas saat verify di blockchain
   → Cocok untuk on-chain verification
   ```

2. **Verification Cepat**
   ```
   Millisecond untuk verify
   → User experience bagus
   → Real-time verification
   ```

3. **Gas Efficient**
   ```
   Biaya verify rendah
   → Cocok untuk high-frequency transactions
   → Scalable untuk banyak users
   ```

4. **Mature Technology**
   ```
   Sudah digunakan 6+ tahun
   → Banyak tools & libraries
   → Community support besar
   → Battle-tested
   ```

### Kekurangan zk-SNARK

1. **Trusted Setup Required**
   ```
   ⚠️  Perlu upacara trusted setup
   ⚠️  Jika compromised, security hilang
   ⚠️  Kritik dari beberapa ahli kriptografi
   ```

2. **Tidak Quantum-Resistant**
   ```
   ⚠️  Bisa dipecah oleh quantum computers
   ⚠️  Menggunakan elliptic curves
   ⚠️  Perlu upgrade di masa depan
   ```

3. **Setup Complexity**
   ```
   ⚠️  Setup awal kompleks
   ⚠️  Perlu koordinasi banyak partisipan
   ⚠️  Biaya & waktu untuk ceremony
   ```

---

## 🎯 Apa Itu zk-STARK?

### Definisi

**zk-STARK** adalah singkatan dari:
- **Z**ero-**K**nowledge
- **S**calable
- **T**ransparent
- **A**rgument of **K**nowledge

### Sejarah

**Paper Fundamental (2018):**
- **Penulis:** Eli Ben-Sasson, Iddo Bentov, Yinon Horesh, Michael Riabzev
- **Kontribusi:** Alternatif untuk SNARKs tanpa trusted setup
- **Aplikasi Utama:** StarkNet, StarkEx (StarkWare)

### Filosofi STARK

> *"Human dignity demands that personal information, like medical and forensic data, be hidden from the public. But veils of secrecy designed to preserve privacy may also be abused to cover up lies and deceit by institutions entrusted with data, unjustly harming citizens and eroding trust in central institutions. Zero-knowledge (ZK) proof systems are an ingenious cryptographic solution to this tension between the ideals of personal privacy and institutional integrity, enforcing the latter in a way that does not compromise the former."*

**- Paper zk-STARK (2018)**

### Karakteristik Utama

```
┌─────────────────────────────────────────┐
│  zk-STARK PROPERTIES                   │
│  ─────────────────────────────────────  │
│                                          │
│  ✅ Trusted Setup: TIDAK DIPERLUKAN    │
│  ✅ Quantum Resistance: YA              │
│  ✅ Transparent: Semua parameter publik│
│  ⚠️  Proof Size: BESAR (~100 KB)      │
│  ⚠️  Verification Time: LEBIH LAMBAT     │
│  ⚠️  Gas Cost: LEBIH TINGGI             │
│  ✅ Auditable: Mudah di-audit           │
└─────────────────────────────────────────┘
```

### Mengapa Tidak Perlu Trusted Setup?

**STARK menggunakan:**
- **Hash functions** (bukan elliptic curves)
- **Public randomness** (bukan secret parameters)
- **Transparent parameters** (semua bisa diverifikasi)

**Hasil:**
```
✅ Tidak perlu upacara trusted setup
✅ Tidak ada "security weak link"
✅ Semua parameter bisa di-audit publik
✅ Tidak perlu percaya pada partisipan
```

### Kelebihan zk-STARK

1. **Tidak Perlu Trusted Setup**
   ```
   ✅ Transparent & auditable
   ✅ Tidak ada "security weak link"
   ✅ Tidak perlu percaya pada upacara
   ```

2. **Quantum-Resistant**
   ```
   ✅ Menggunakan hash functions
   ✅ Aman dari quantum computers
   ✅ Future-proof
   ```

3. **Scalable**
   ```
   ✅ Proof generation cepat untuk large computations
   ✅ Cocok untuk batch processing
   ✅ Verification time tidak bertambah banyak
   ```

4. **Transparent**
   ```
   ✅ Semua parameter publik
   ✅ Mudah di-audit
   ✅ Tidak ada "black box"
   ```

### Kekurangan zk-STARK

1. **Proof Size Besar**
   ```
   ⚠️  ~100 KB untuk proof (vs ~200 bytes SNARK)
   ⚠️  Lebih mahal untuk on-chain verification
   ⚠️  Tidak efisien untuk small proofs
   ```

2. **Verification Lebih Lambat**
   ```
   ⚠️  Lebih lama dari SNARK (tapi masih cepat)
   ⚠️  Lebih banyak gas untuk verify
   ```

3. **Technology Lebih Baru**
   ```
   ⚠️  Baru 6 tahun (vs SNARK 12+ tahun)
   ⚠️  Tools & libraries masih berkembang
   ⚠️  Community lebih kecil
   ```

---

## ⚖️ Perbandingan Head-to-Head

### Tabel Perbandingan

| Aspek | zk-SNARK | zk-STARK |
|-------|----------|----------|
| **Proof Size** | ~200 bytes ⚡ | ~100 KB 🐢 |
| **Verification Time** | Millisecond ⚡ | Beberapa millisecond 🐢 |
| **Gas Cost** | Rendah 💰 | Lebih tinggi 💰💰 |
| **Trusted Setup** | Diperlukan ⚠️ | Tidak diperlukan ✅ |
| **Quantum Resistance** | Tidak ❌ | Ya ✅ |
| **Transparency** | Terbatas ⚠️ | Penuh ✅ |
| **Maturity** | 12+ tahun ✅ | 6 tahun ⚠️ |
| **Tools & Libraries** | Banyak ✅ | Sedang berkembang ⚠️ |
| **Use Case** | On-chain verify | Off-chain compute |

### Proof Size Comparison

```
┌─────────────────────────────────────────┐
│  PROOF SIZE COMPARISON                  │
│  ─────────────────────────────────────  │
│                                          │
│  zk-SNARK:  ~200 bytes                   │
│  └─ Seperti 1 paragraf teks             │
│                                          │
│  zk-STARK:  ~100 KB                     │
│  └─ Seperti 50 halaman dokumen         │
│                                          │
│  Perbedaan: 500x lebih besar!           │
└─────────────────────────────────────────┘
```

**Dampak:**
- SNARK: Hemat gas, cocok untuk on-chain
- STARK: Lebih mahal, cocok untuk off-chain compute

### Verification Time Comparison

```
┌─────────────────────────────────────────┐
│  VERIFICATION TIME                      │
│  ─────────────────────────────────────  │
│                                          │
│  zk-SNARK:  ~5-10 ms                    │
│  └─ Sangat cepat                        │
│                                          │
│  zk-STARK:  ~50-100 ms                  │
│  └─ Masih cepat, tapi lebih lambat      │
│                                          │
│  Perbedaan: 10x lebih lambat            │
└─────────────────────────────────────────┘
```

**Dampak:**
- SNARK: User experience lebih baik
- STARK: Masih acceptable untuk kebanyakan use cases

### Trusted Setup: Trade-off Penting

**zk-SNARK:**
```
✅ Proof kecil & cepat
⚠️  Perlu trusted setup
⚠️  Jika compromised → security hilang
⚠️  Kritik dari ahli kriptografi
```

**zk-STARK:**
```
⚠️  Proof besar & lebih lambat
✅ Tidak perlu trusted setup
✅ Transparent & auditable
✅ Tidak ada "security weak link"
```

---

## 🔬 Quantum Resistance

### Mengapa Penting?

**Quantum Computers:**
- Dapat memecah beberapa algoritma kriptografi
- Elliptic curve cryptography rentan
- Hash functions lebih aman

### Perbandingan

**zk-SNARK:**
```
❌ Menggunakan elliptic curves
❌ Rentan terhadap quantum computers
⚠️  Perlu upgrade di masa depan
```

**zk-STARK:**
```
✅ Menggunakan hash functions
✅ Quantum-resistant
✅ Future-proof
```

**Catatan:**
- Quantum computers masih dalam tahap awal
- Tapi penting untuk future-proofing
- STARK lebih siap untuk era quantum

---

## 🎯 Use Cases: Kapan Pakai Yang Mana?

### Gunakan zk-SNARK Jika:

1. **On-Chain Verification**
   ```
   ✅ Proof kecil → hemat gas
   ✅ Verification cepat → UX baik
   ✅ Cocok untuk smart contracts
   ```

2. **High-Frequency Transactions**
   ```
   ✅ Gas cost rendah
   ✅ Bisa verify banyak proofs
   ✅ Scalable untuk volume tinggi
   ```

3. **Mature Ecosystem**
   ```
   ✅ Banyak tools (Circom, snarkjs)
   ✅ Community support besar
   ✅ Documentation lengkap
   ```

**Contoh Proyek:**
- Zcash (private transactions)
- Tornado Cash (privacy mixer)
- zkSync (Layer 2 scaling)

### Gunakan zk-STARK Jika:

1. **Off-Chain Computation**
   ```
   ✅ Proof size tidak masalah
   ✅ Focus pada computation besar
   ✅ Batch processing
   ```

2. **Transparency Critical**
   ```
   ✅ Tidak mau trusted setup
   ✅ Perlu auditable
   ✅ Regulatory compliance
   ```

3. **Future-Proofing**
   ```
   ✅ Quantum resistance penting
   ✅ Long-term security
   ✅ Enterprise adoption
   ```

**Contoh Proyek:**
- StarkNet (Layer 2)
- StarkEx (Exchange scaling)
- Immutable X (NFT scaling)

---

## 📊 Proyek yang Menggunakan Masing-Masing

### zk-SNARK Projects

**Zcash (2016):**
- Cryptocurrency dengan private transactions
- Shielded transactions menggunakan zk-SNARKs
- Sender, receiver, amount semua private

**Tornado Cash:**
- Privacy mixer untuk Ethereum
- Deposit & withdraw tanpa link
- Menggunakan zk-SNARKs

**zkSync:**
- Layer 2 scaling untuk Ethereum
- zk-Rollup menggunakan SNARKs
- On-chain verification efisien

**Loopring:**
- DEX dengan zk-Rollup
- High throughput, low fees
- SNARK-based verification

### zk-STARK Projects

**StarkNet:**
- Layer 2 dengan zk-STARKs
- General-purpose smart contracts
- Tidak perlu trusted setup

**StarkEx:**
- Exchange scaling solution
- Powering dYdX, Immutable X
- STARK-based batch processing

**Immutable X:**
- NFT marketplace scaling
- Zero gas fees untuk users
- STARK-based proof system

---

## 🎓 Ringkasan Perbandingan

### zk-SNARK: "Efisien tapi Perlu Kepercayaan"

```
✅ Proof kecil & cepat
✅ Gas efficient
✅ Mature technology
⚠️  Perlu trusted setup
⚠️  Tidak quantum-resistant
```

**Ideal untuk:**
- On-chain verification
- High-frequency transactions
- Applications yang perlu proof kecil

### zk-STARK: "Transparent tapi Lebih Besar"

```
✅ Tidak perlu trusted setup
✅ Quantum-resistant
✅ Transparent & auditable
⚠️  Proof lebih besar
⚠️  Verification lebih lambat
```

**Ideal untuk:**
- Off-chain computation
- Applications yang perlu transparency
- Future-proofing untuk quantum era

### Kesimpulan

**Keduanya adalah teknologi canggih dengan trade-offs berbeda:**

- **SNARK:** Efisiensi & kematangan teknologi
- **STARK:** Transparansi & ketahanan quantum

**Pilihan tergantung pada:**
- Use case spesifik
- Prioritas (size vs transparency)
- Risk tolerance (trusted setup)
- Future considerations (quantum)

---

## 📚 Referensi & Bacaan Lanjutan

**Paper Fundamental:**
- [zk-SNARKs (2012)](https://eprint.iacr.org/2013/279.pdf) - Bitansky, Canetti, Chiesa, Tromer
- [zk-STARKs (2018)](https://eprint.iacr.org/2018/046.pdf) - Ben-Sasson, Bentov, Horesh, Riabzev

**Artikel Pendidikan:**
- [Chainlink: zk-SNARKs vs zk-STARKs](https://chain.link/education-hub/zk-snarks-vs-zk-starks)
- [Ethereum.org: zk-SNARKs](https://ethereum.org/en/zero-knowledge-proofs/#zk-snarks)
- [StarkWare: STARK Technology](https://starkware.co/stark/)

**Proyek Implementasi:**
- [Zcash: How It Works](https://z.cash/technology/)
- [StarkNet Documentation](https://docs.starknet.io/)
- [zkSync Documentation](https://docs.zksync.io/)

---

**Selanjutnya:** [Bagian 3: Use Cases & Implementasi ZKP →](./03-use-cases-zkp.md)

