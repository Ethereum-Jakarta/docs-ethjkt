---
id: arbitrum-classic
title: Arbitrum Classic - History & Evolution
sidebar_position: 2
---

# Arbitrum Classic - History & Evolution

Arbitrum Classic adalah implementasi pertama dari protokol Arbitrum, diluncurkan sebagai mainnet beta pada Mei 2021 dan mainnet publik pada Agustus 2021. Memahami Classic penting untuk mengerti evolusi teknologi Arbitrum dan keputusan desain yang dibuat untuk Nitro (versi saat ini).

---

## Sejarah dan Founding

**Offchain Labs** didirikan tahun 2018 oleh trio peneliti dari Princeton University:

<div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))',gap:'16px',margin:'20px 0'}}>

<div style={{background:'#f8f9fa',borderRadius:'12px',padding:'20px',border:'2px solid #e0e0e0'}}>
  <div style={{fontSize:'24px',marginBottom:'8px'}}>👨‍💻</div>
  <div style={{fontSize:'18px',fontWeight:'700',marginBottom:'8px'}}>Ed Felten</div>
  <div style={{fontSize:'14px',color:'#666'}}>
    Former Deputy CTO of US White House<br/>
    CS Professor Princeton University<br/>
    Expert in security & privacy
  </div>
</div>

<div style={{background:'#f8f9fa',borderRadius:'12px',padding:'20px',border:'2px solid #e0e0e0'}}>
  <div style={{fontSize:'24px',marginBottom:'8px'}}>👨‍💻</div>
  <div style={{fontSize:'18px',fontWeight:'700',marginBottom:'8px'}}>Steven Goldfeder</div>
  <div style={{fontSize:'14px',color:'#666'}}>
    CS PhD Princeton University<br/>
    Cryptocurrency security expert<br/>
    Co-author of Bitcoin textbook
  </div>
</div>

<div style={{background:'#f8f9fa',borderRadius:'12px',padding:'20px',border:'2px solid #e0e0e0'}}>
  <div style={{fontSize:'24px',marginBottom:'8px'}}>👨‍💻</div>
  <div style={{fontSize:'18px',fontWeight:'700',marginBottom:'8px'}}>Harry Kalodner</div>
  <div style={{fontSize:'14px',color:'#666'}}>
    CS PhD Princeton University<br/>
    Blockchain researcher<br/>
    Optimistic Rollup pioneer
  </div>
</div>

</div>

---

## Timeline Penting Arbitrum Classic

<div style={{background:'#E8F5E9',borderRadius:'8px',padding:'16px',margin:'16px 0'}}>

| Tanggal | Milestone | Signifikansi |
|---------|-----------|--------------|
| **2018** | Offchain Labs founded | Research on Optimistic Rollup dimulai |
| **2019** | First whitepaper published | Konsep Arbitrum diperkenalkan ke publik |
| **2020** | Testnet launch | Early developer onboarding |
| **Mei 2021** | Mainnet beta launch | Developer-only access, invite-based |
| **31 Agustus 2021** | Public mainnet launch 🚀 | Anyone can use - historic moment! |
| **Nov 2021** | $2B TVL milestone | Membuktikan product-market fit |
| **Agustus 2022** | Nitro upgrade announced | Migrasi dari Classic ke Nitro |
| **Sept 2022** | Arbitrum Nova launch | Expanding dengan AnyTrust chain |

</div>

:::info Fakta Menarik
Arbitrum One adalah **Optimistic Rollup pertama yang mencapai produksi mainnet**. Optimism (kompetitor utama) baru launch Desember 2021, 4 bulan setelah Arbitrum!
:::

---

## Arsitektur Arbitrum Classic

Classic menggunakan virtual machine kustom dan arsitektur yang berbeda dari Nitro saat ini:

### Komponen Utama

<div style={{background:'#FFF3E0',borderRadius:'8px',padding:'16px',margin:'16px 0'}}>

**1️⃣ Custom AVM (Arbitrum Virtual Machine)**
- VM yang dirancang khusus, bukan berbasis WASM seperti Nitro
- Instruction set yang dioptimasi untuk rollup operations
- Lebih lambat tapi sudah proven di production

**2️⃣ Interactive Fraud Proofs**
- Protokol bisection interaktif multi-ronde untuk penyelesaian sengketa
- Challenger dan asserter bermain "game" untuk menemukan instruksi yang salah
- Lebih kompleks tapi gas-efficient

**3️⃣ Solidity Compiler Kustom**
- Compiler kustom untuk menerjemahkan Solidity → instruksi AVM
- Harus di-maintain setiap ada update Solidity
- Beban development tinggi

**4️⃣ Centralized Sequencer**
- Sequencer tunggal dioperasikan oleh Offchain Labs
- Sama seperti Nitro (belum terdesentralisasi)

**5️⃣ Data Availability di L1**
- Semua data transaksi diposting ke Ethereum untuk keamanan
- Sama seperti Rollup pada umumnya

</div>

---

## Classic vs Nitro: Key Differences

| Aspect | Arbitrum Classic | Arbitrum Nitro |
|--------|------------------|----------------|
| **Virtual Machine** | Custom AVM | WASM-based (WebAssembly) |
| **Geth Compatibility** | Custom implementation | Fork of Geth (100% compatible) |
| **Performance** | ~4,000 TPS | 40,000+ TPS (10x faster) |
| **Gas Costs** | 5-10x cheaper than L1 | 10-20x cheaper than L1 |
| **Fraud Proof** | Multi-round interactive | One-step fraud proof (simpler) |
| **Calldata Compression** | Basic compression | Advanced BLS-based compression |
| **Developer Experience** | Good EVM compatibility | Perfect EVM compatibility |
| **Maintenance** | High (custom compiler) | Low (fork Geth directly) |

:::warning Keterbatasan Classic
Meskipun revolutionary untuk zamannya, Classic memiliki beberapa keterbatasan:
- **Performa bottleneck:** AVM kustom lebih lambat dari eksekusi WASM
- **Beban maintenance:** Compiler kustom perlu update terus
- **Fraud proofs kompleks:** Multi-round lebih lama dan rumit
- **Gas costs lebih tinggi:** Kompresi calldata kurang efisien
:::

---

## Why the Migration to Nitro?

Pada Agustus 2022, Arbitrum melakukan **upgrade yang mulus** dari Classic ke Nitro. Ini adalah pencapaian teknis besar!

### Alasan Migrasi

<div style={{background:'#E3F2FD',borderRadius:'8px',padding:'16px',margin:'16px 0'}}>

**🚀 Performance:**
- WASM 10x lebih cepat dari AVM kustom
- Native code execution vs interpreted

**💰 Lower Costs:**
- Kompresi calldata lebih baik → biaya posting L1 turun
- Eksekusi efisien → gas per transaksi turun

**🛠️ Developer Experience:**
- Fork Geth langsung → 100% kompatibilitas EVM
- No custom compiler → less maintenance
- Opcode support lengkap

**🔒 Simplified Fraud Proofs:**
- One-step proof lebih simple dan cepat
- Reduced attack surface

**🔮 Future-Proof:**
- WASM adalah standar industri
- Support multi-language (Stylus!)

</div>

---

## Upgrade Nitro: Technical Marvel

### Apa yang Membuat Upgrade Ini Luar Biasa?

**✅ Tanpa Downtime**
- Chain tidak pernah berhenti
- User tidak perlu melakukan apa-apa

**✅ State Migration Sempurna**
- Seluruh state blockchain (akun, kontrak, saldo) bermigrasi otomatis
- Zero data loss

**✅ Backward Compatible**
- Semua kontrak yang ada tetap berfungsi
- No need to redeploy contracts

**✅ Instant Benefits**
- User langsung merasakan gas 10x lebih rendah
- Throughput naik drastis

### Code Example: Same Contract Works!

```solidity
// Contract deployed di Classic (2021)
pragma solidity ^0.8.0;

contract SimpleStorage {
    uint256 public value;

    function setValue(uint256 _value) public {
        value = _value;
    }

    function getValue() public view returns (uint256) {
        return value;
    }
}

// After Nitro upgrade (2022):
// ✅ Still works perfectly
// ✅ Same address
// ✅ State preserved
// ✅ Zero developer action required
// ✅ 10x cheaper gas
```

:::success Technical Achievement
Migrasi seamless dari satu VM architecture ke yang lain sambil preserve state dan tanpa downtime adalah **prestasi engineering yang luar biasa** dan belum pernah dilakukan sebelumnya di scale ini!
:::

---

## Warisan dan Dampak Arbitrum Classic

<div style={{background:'#F3E5F5',borderRadius:'8px',padding:'20px',margin:'16px 0'}}>

### 🏆 Pencapaian Historic

**1. Proof of Concept**
- Membuktikan Optimistic Rollup layak untuk produksi
- Menginspirasi lahirnya Optimism, Base, Metis, Boba

**2. Security Model Validated**
- Fraud proof mechanism tidak pernah dieksploitasi
- Model keamanan terbukti robust

**3. Ecosystem Bootstrap**
- Menarik protokol besar: Uniswap, Aave, Curve
- Membangun komunitas builder yang kuat

**4. Foundation untuk Nitro**
- Pembelajaran dari Classic memungkinkan design Nitro yang superior
- Iterasi cepat berkat production data

**5. Institutional Confidence**
- TVL $2B+ membuktikan kepercayaan institusional
- Regulatory clarity pathway

</div>

---

## Pembelajaran Utama dari Era Classic

:::info Key Takeaways
✅ **Iterasi adalah kunci:** Classic → Nitro menunjukkan pentingnya continuous improvement

✅ **Production data invaluable:** Tidak bisa di-simulate, harus deployed

✅ **Community matters:** Early adopters membentuk kultur ecosystem

✅ **Open source wins:** Transparansi membangun kepercayaan

✅ **Performance matters:** User care about UX lebih dari technical details
:::

---

## Resources Historical

<div style={{background:'#f8f9fa',borderRadius:'8px',padding:'16px',margin:'16px 0'}}>

### 📖 **Original Resources**
- [Mainnet Launch Announcement](https://medium.com/offchainlabs/arbitrum-one-is-live-on-mainnet-d5d7e98f0b9f) - Historic post
- [Nitro Upgrade Announcement](https://medium.com/offchainlabs/arbitrum-nitro-sneak-preview-44550d9054f5) - Technical details
- [Original Whitepaper](https://arxiv.org/abs/2003.10748) - Academic paper
- [Classic Documentation](https://developer.arbitrum.io/migration/dapp_migration) - Migration guide

</div>

---

## Next Steps

Sekarang Anda memahami sejarah Arbitrum! Di modul berikutnya, kita akan deep dive ke:

**Arbitrum One (Nitro)** - Versi current dengan 10x performance boost dan ekosistem yang berkembang pesat.

:::success Historical Context Matters 📚
Memahami evolusi teknologi membantu Anda membuat keputusan design yang lebih baik untuk aplikasi Anda!
:::
