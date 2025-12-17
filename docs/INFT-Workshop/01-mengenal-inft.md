---
id: mengenal-inft
title: Mengenal INFT
sidebar_position: 1
---

# Mengenal INFT: Intelligent Non-Fungible Token

## Apa itu INFT?

**INFT (Intelligent NFT)** adalah evolusi dari NFT tradisional yang tidak hanya menyimpan gambar atau metadata statis, tetapi juga mengandung **kecerdasan AI yang terenkripsi** dan dapat ditransfer bersama kepemilikan token.

:::info Definisi Sederhana
INFT = NFT + AI Agent yang bisa "hidup" dan berinteraksi
:::

## Masalah dengan NFT Tradisional

### NFT Saat Ini: Static & Limited

```
Traditional NFT
├── Image/Media (static)
├── Metadata (name, description)
├── Attributes (traits)
└── Ownership record
```

**Limitasi:**
- Hanya bisa "dilihat", tidak bisa "digunakan"
- Nilai hanya dari speculation dan collectibility
- Tidak ada utility beyond ownership
- AI capabilities tidak transferable

### Contoh Kasus

Bayangkan kamu punya AI assistant yang sudah di-train dengan preferensi dan style kamu selama berbulan-bulan. Dengan sistem tradisional:

- AI tersebut terikat dengan platform (OpenAI, dll)
- Tidak bisa dijual atau ditransfer
- Jika platform tutup, AI hilang
- Tidak ada cara prove ownership

## Solusi INFT

INFT memecahkan masalah ini dengan menggabungkan:

```
INFT Structure
├── Standard NFT (ERC-721 compatible)
│   ├── Token ID
│   ├── Owner
│   └── Transfer functions
│
├── Encrypted AI Configuration
│   ├── Model parameters
│   ├── System prompts
│   ├── Training data references
│   └── Personality settings
│
├── Re-encryption Mechanism
│   ├── Secure key transfer on sale
│   ├── Oracle verification
│   └── Privacy preservation
│
└── Usage Authorization
    ├── Rental/License system
    ├── Time-based access
    └── Scope limitations
```

## Perbandingan NFT vs INFT

| Aspek | NFT Tradisional | INFT |
|-------|-----------------|------|
| **Content** | Static media | AI intelligence |
| **Utility** | Display only | Interactive AI |
| **Value** | Speculation | Functional value |
| **Transfer** | Image only | AI + capabilities |
| **Privacy** | Public metadata | Encrypted config |
| **Rental** | Not possible | Built-in support |

## Cara Kerja INFT

### 1. Minting
Saat INFT di-mint:
- AI configuration di-encrypt dengan public key oracle
- Encrypted data di-store (on-chain atau off-chain)
- NFT token di-create dengan reference ke encrypted data

### 2. Ownership & Access
Pemilik dapat:
- Decrypt dan gunakan AI agent
- Grant usage rights ke orang lain (rental)
- Transfer full ownership

### 3. Transfer (Jual/Beli)
Saat INFT ditransfer:
- Oracle memverifikasi new owner
- Data di-re-encrypt untuk new owner's key
- Old owner kehilangan akses
- New owner mendapat full access

### 4. Usage Authorization (Rental)
Pemilik bisa:
- Grant temporary access ke user lain
- Set expiration time
- Define scope (apa yang boleh diakses)
- Revoke kapan saja

## Diagram Alur

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Creator    │     │    Owner     │     │    Renter    │
└──────┬───────┘     └──────┬───────┘     └──────┬───────┘
       │                    │                    │
       │ mint()             │                    │
       ├───────────────────►│                    │
       │                    │                    │
       │                    │ grantUsage()       │
       │                    ├───────────────────►│
       │                    │                    │
       │                    │                    │ useAgent()
       │                    │                    ├─────────►
       │                    │                    │
       │                    │ revokeUsage()      │
       │                    ├───────────────────►│
       │                    │                    │
       │                    │                    │ ❌ denied
       │                    │                    ├─────────►
```

## Use Cases INFT

### 1. Personal AI Assistants
- AI yang sudah "kenal" kamu
- Bisa dijual jika tidak dipakai
- Rental ke orang lain

### 2. Specialized AI Agents
- AI untuk trading strategies
- AI untuk content creation
- AI untuk customer service

### 3. Gaming Characters
- NPCs dengan personality unik
- Game characters yang "belajar"
- Transferable across games

### 4. Professional Services
- AI consultants
- AI tutors
- AI medical advisors

## Analogi Sederhana

### INFT seperti Franchise Bisnis

**Franchise Tradisional:**
- Beli hak untuk jalankan bisnis dengan sistem yang sudah terbukti
- Dapat training, SOP, brand, dll
- Bisa dijual kembali ke orang lain
- Owner tetap dapat fee/royalty

**INFT:**
- "Beli" AI yang sudah trained dan terbukti
- Dapat semua konfigurasi dan capabilities
- Bisa rental (franchise) ke orang lain
- Bisa jual full ownership

### INFT seperti Mobil dengan Sopir Ahli

**Mobil biasa (NFT):**
- Kamu dapat mobilnya
- Harus nyetir sendiri
- Value dari mobil itu sendiri

**Mobil + Sopir Ahli (INFT):**
- Kamu dapat mobil + sopir berpengalaman
- Sopir tahu rute terbaik, cara nyetir efisien
- Jual mobil = sopir ikut pindah ke owner baru
- Bisa "sewakan" sopir ke orang lain

## Technical Foundation

INFT dibangun di atas:

### ERC-721 Compatible
- Standard NFT interface
- Works dengan semua marketplace
- Composable dengan DeFi protocols

### ERC-7857 Extension
- Encrypted metadata handling
- Secure re-encryption protocol
- Oracle verification system
- Usage authorization mechanism

### 0G Infrastructure
- **0G Storage**: Simpan encrypted AI configs
- **0G Compute**: Run AI inference
- **0G DA**: Data availability untuk large models
- **0G Chain**: Smart contract execution

## Mengapa 0G untuk INFT?

| Requirement | 0G Solution |
|-------------|-------------|
| **Storage besar** | 0G Storage: 95% lebih murah |
| **AI Compute** | 0G Compute: Decentralized GPUs |
| **Fast Response** | 0G DA: High throughput |
| **EVM Compatible** | 0G Chain: Standard Solidity |
| **Security** | Ethereum-inherited security |

## Ecosystem INFT

```
┌─────────────────────────────────────────────────────────┐
│                    INFT Ecosystem                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐   │
│  │ Creators│  │ Owners  │  │ Renters │  │Platforms│   │
│  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘   │
│       │            │            │            │         │
│       └────────────┴────────────┴────────────┘         │
│                         │                               │
│                    ┌────▼────┐                         │
│                    │  INFT   │                         │
│                    │Contract │                         │
│                    └────┬────┘                         │
│                         │                               │
│       ┌─────────────────┼─────────────────┐            │
│       │                 │                 │            │
│  ┌────▼────┐      ┌────▼────┐      ┌────▼────┐       │
│  │   0G    │      │   0G    │      │   0G    │       │
│  │ Storage │      │ Compute │      │  Chain  │       │
│  └─────────┘      └─────────┘      └─────────┘       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Key Takeaways

1. **INFT = NFT + AI Intelligence** - Lebih dari sekadar gambar
2. **Transferable AI** - Jual/beli AI capabilities
3. **Rental System** - License tanpa transfer ownership
4. **Privacy Preserved** - Encrypted configuration
5. **0G Powered** - Infrastructure yang scalable

---

:::tip Lanjut Belajar
Sekarang kamu sudah paham konsep INFT, lanjut ke [ERC-7857 Standard](./02-erc7857-standard.md) untuk memahami technical specification!
:::
