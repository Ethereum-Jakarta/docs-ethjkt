---
sidebar_position: 5
title: 🛠️ Tooling & Framework
description: viem, Monad Foundry, coding-assistant skills, Agent Hub, dokumentasi resmi, x402, MPP, ERC-8004, dan template mobile untuk membangun di Monad.
---

# 🛠️ Tooling & Framework

:::info Goal Unit Ini
Di akhir unit ini kamu akan:
- Tahu **framework resmi** untuk membangun di Monad
- Tahu ada **skill untuk AI coding assistant** yang mempercepat kerjamu hari ini
- Kenal **primitif agentic**: x402, MPP, dan ERC-8004
- Tahu **di mana dokumentasi** yang paling padat isinya
:::

---

## 📦 Framework Resmi

### viem (2.40+)

> **Dukungan native untuk Monad testnet dan mainnet.**

Sejak versi 2.40, viem sudah menyertakan definisi chain Monad. Pola client yang kamu pakai sekarang tidak berubah sama sekali.

```ts
import { createPublicClient, http } from 'viem'
import { monadTestnet } from 'viem/chains'

const client = createPublicClient({
  chain: monadTestnet,
  transport: http(),
})

const blockNumber = await client.getBlockNumber()
```

### Monad Foundry

> **Fork Foundry dengan precompile Monad, dekode trace yang akurat, dan gas saat simulasi.**

Tiga kelebihannya dibanding Foundry biasa:

| Fitur | Manfaat |
|---|---|
| **Precompile Monad** | Precompile khusus Monad dikenali saat testing lokal |
| **Dekode trace akurat** | `forge test -vvvv` menampilkan trace yang benar |
| **Gas saat simulasi** | Estimasi gas sesuai kondisi Monad, bukan Ethereum |

---

## 🤖 Skill untuk AI Coding Assistant

### skills.devnads.com

> ### 🔗 [skills.devnads.com](https://skills.devnads.com)
> Kumpulan **coding-assistant skills** yang memungkinkan kamu membangun aplikasi di Monad hanya dengan beberapa prompt. Kirim aplikasi full-stack yang jalan, langsung dari editor.

Yang tercakup di dalamnya:

- ✅ **Faucet testnet bawaan**
- ✅ **Development & deploy smart contract**
- ✅ **Development & deploy frontend**
- ✅ **Deployment indexer**

:::tip Ini Sangat Relevan Hari Ini
Monad Blitz disebut sebagai **"vibecoding hackathon"** — memakai AI coding assistant memang bagian dari format acaranya, bukan sesuatu yang perlu disembunyikan.

Kalau kamu memakai Claude Code, Cursor, atau sejenisnya, memasang skill ini di awal hari bisa menghemat berjam-jam pada bagian setup dan deploy.
:::

### Agent Hub — app.monad.xyz/agents

> ### 🔗 [app.monad.xyz/agents](https://app.monad.xyz/agents)
> **Skill yang bisa dibaca agent**, dipublikasikan oleh proyek-proyek ekosistem. Arahkan agent-mu ke sebuah protokol, dan biarkan ia melakukan quoting, membangun, dan menyiapkan transaksi.

Protokol yang tersedia:

| Kategori | Protokol |
|---|---|
| **DeFi** | Uniswap, Morpho, Balancer, Kuru, Clober |
| **Launchpad & token** | Nad.fun |
| **Gaming & prediction** | DevFun, Blinq.fi |

:::warning Disclaimer Resmi
> Skills are maintained by ecosystem projects and are **not audited by Monad Foundation**.

Berlaku untuk `skills.devnads.com` maupun Agent Hub. Untuk hackathon ini tidak masalah — tapi jangan langsung memercayakan dana sungguhan padanya.
:::

---

## 📚 Dokumentasi

### docs.monad.xyz/developer-essentials

> ### 🔗 [docs.monad.xyz/developer-essentials](https://docs.monad.xyz/developer-essentials)
> Hampir semua yang kamu butuhkan untuk membangun ada di halaman developer-essentials.

Isinya mencakup network information, token & bridge, ringkasan deployment, tooling & infra, referensi RPC, dan **perbedaan Monad vs Ethereum**.

### docs.monad.xyz/llms-full.txt

> ### 🔗 [docs.monad.xyz/llms-full.txt](https://docs.monad.xyz/llms-full.txt)
> Sumber **satu file yang komprehensif** untuk integrasi LLM dan AI coding assistant.

:::tip Trik Cepat
Kalau AI assistant kamu belum mengenal Monad dengan baik, berikan URL ini ke dalam konteksnya. Satu file berisi seluruh dokumentasi — jauh lebih efektif daripada membiarkannya menebak-nebak.
:::

---

## 💸 Agentic Payments

### x402 di Monad

> ### 🔗 [docs.monad.xyz/guides/x402-guide](https://docs.monad.xyz/guides/x402-guide)
> **Facilitator x402 gratis yang dihosting oleh Monad.**

x402 adalah standar pembayaran yang menghidupkan kembali kode status HTTP `402 Payment Required`. Konsepnya: sebuah API bisa membalas permintaan dengan `402`, klien (atau AI agent) membayar secara onchain, lalu mengulang permintaannya.

Monad menyediakan **facilitator gratis** untuk ini.

:::tip Ide Project
"Bayar per panggilan API dengan AI agent" adalah kategori ide yang cocok sekali dengan Blitz: baru, jelas terlihat saat demo, dan memanfaatkan kecepatan Monad — karena pembayaran mikro membutuhkan konfirmasi yang cepat agar terasa masuk akal.
:::

### MPP di Monad

> **`@monad-crypto/mpp`**

Package resmi Monad untuk kebutuhan agentic payments, tersedia melalui npm.

```bash
npm install @monad-crypto/mpp
```

---

## 🪪 Identitas Agent

### ERC-8004 di Monad

> **Identitas onchain untuk AI agent.**

ERC-8004 adalah registry identitas untuk AI agent. Kalau project-mu melibatkan beberapa agent yang saling berinteraksi, standar ini memberi mereka identitas yang bisa diverifikasi di chain.

Gabungan yang menarik: **ERC-8004 (siapa agent-nya) + x402 (bagaimana agent membayar)** menghasilkan agent yang punya identitas sekaligus kemampuan bertransaksi.

---

## 📱 Mobile

> **Bangun aplikasi mobile native di Monad.**

Tersedia template **React Native** dan **PWA**.

:::tip Pembeda yang Murah
Hampir semua submission hackathon adalah web app di desktop. Demo dari **layar ponsel** langsung terasa berbeda — dan template ini membuat jalur itu tidak mahal.
:::

---

## 🧾 Ringkasan Link

| Kebutuhan | Link |
|---|---|
| Dokumentasi utama | [docs.monad.xyz/developer-essentials](https://docs.monad.xyz/developer-essentials) |
| Konteks untuk AI assistant | [docs.monad.xyz/llms-full.txt](https://docs.monad.xyz/llms-full.txt) |
| Skill coding assistant | [skills.devnads.com](https://skills.devnads.com) |
| Skill protokol untuk agent | [app.monad.xyz/agents](https://app.monad.xyz/agents) |
| Panduan x402 | [docs.monad.xyz/guides/x402-guide](https://docs.monad.xyz/guides/x402-guide) |
| Contoh & starter kit | [github.com/monad-developers](https://github.com/monad-developers) |
| Portal developer | [developers.monad.xyz](https://developers.monad.xyz) |

:::note Tetap Dekat dengan Sumbernya
Deck secara khusus menyarankan mengikuti **[github.com/monad-developers](https://github.com/monad-developers)** untuk contoh kode, starter kit, dan perubahan terbaru pada toolchain developer.
:::

---

:::tip Lanjut
Sebelum kamu menulis kode dari nol, cek dulu apa yang sudah tersedia: [Ekosistem Infra](./ekosistem-infra).
:::
