---
sidebar_position: 3
title: 🔐 Unit 3 — Wallet Setup (Coldkey & Hotkey)
description: Buat wallet Bittensor dengan coldkey dan hotkey, pahami perbedaan fungsinya, backup mnemonic dengan aman, dan dapatkan TAO testnet gratis dari faucet.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 🔐 Unit 3 — Wallet Setup (Coldkey & Hotkey)

:::info Goal Unit Ini
Di akhir unit ini kamu akan:
- Paham **perbedaan coldkey vs hotkey** dan kenapa keduanya diperlukan
- Punya **coldkey + hotkey** yang dibuat via btcli
- **Mnemonic ter-backup** di tempat aman (bukan di komputer)
- Punya **TAO testnet** dari faucet untuk bisa register
:::

:::note Prasyarat
- ✅ [Unit 2](./instalasi-btcli) selesai — btcli terinstall dan `btcli --help` berjalan
- ✅ venv aktif: `source ~/bittensor-env-v10/bin/activate`
:::

---

## 🔑 Coldkey vs Hotkey — Pahami Dulu Sebelum Buat

Bittensor memisahkan operasi wallet menjadi dua layer keamanan:

| | **Coldkey** | **Hotkey** |
|---|---|---|
| **Fungsi** | Vault utama — simpan TAO | Worker key — operasional miner |
| **Aksi yang butuh coldkey** | Transfer TAO, stake/unstake, register miner | — |
| **Aksi yang butuh hotkey** | — | Tanda tangan query validator, emit data |
| **Harus online?** | Sesedikit mungkin | 24/7 aktif saat miner jalan |
| **Simpan di mana?** | Lokal, tidak di VPS/server | Boleh di server (VPS/lokal) |
| **Kalau hilang?** | Kehilangan akses ke semua TAO | Bisa buat hotkey baru |

:::danger Coldkey = Nyawa TAO Kamu
Siapapun yang punya **mnemonic coldkey** punya kendali penuh atas semua TAO di wallet kamu. Jangan pernah share ke siapapun, termasuk "admin Bittensor" di Discord/Telegram — itu scammer.
:::

---

## 👜 Step 1 — Buat Coldkey

Pastikan venv aktif dulu:

```bash
source ~/bittensor-env-v10/bin/activate
```

Buat coldkey dengan nama wallet:

```bash
btcli wallet create --wallet-name mywallet --hotkey miner1
```

Command ini akan:
1. Meminta kamu konfirmasi nama wallet
2. Membuat **coldkey** dan tampilkan **24-kata mnemonic**
3. Meminta kamu set **password** untuk enkripsi file coldkey lokal
4. Membuat **hotkey** bernama `miner1` sekaligus

:::warning Tulis Mnemonic Sekarang!
Saat btcli tampilkan 24 kata mnemonic — **tulis di kertas fisik**, bukan di:
- ❌ Screenshot
- ❌ File teks di komputer
- ❌ Chat WhatsApp/Telegram
- ❌ Cloud Notes (Google Keep, Notion, dll)

Simpan kertas di tempat aman. Mnemonic ini adalah satu-satunya cara recovery kalau file wallet hilang atau komputer rusak.
:::

---

## 👜 Step 2 — Buat Hotkey (Jika Belum Ada)

Kalau kamu sudah punya wallet tapi belum punya hotkey, atau mau hotkey terpisah per subnet, buat manual:

```bash
btcli wallet new_hotkey --wallet-name mywallet --hotkey miner1
```

:::important Nama Hotkey Harus Konsisten
Gunakan nama yang **sama** di semua unit berikutnya. Docs ini memakai `miner1` sebagai contoh — pastikan nama hotkey yang kamu buat sama dengan yang kamu pakai di Unit 4 (register) dan Unit 5 (jalankan miner).

Untuk cek hotkey apa yang sudah ada:
```bash
btcli wallet list
```
:::

Hotkey juga punya mnemonic sendiri — backup juga, walau tidak sekritis coldkey.

---

## 📋 Step 3 — Verifikasi Wallet

```bash
# List semua wallet
btcli wallet list

# Overview wallet (balance & hotkeys)
btcli wallet overview --wallet-name mywallet
```

Output `btcli wallet list`:

```text
Wallets
└── mywallet  (~/.bittensor/wallets/mywallet)
    └── miner1
```

Output `btcli wallet overview`:

```text
Wallet: mywallet
  coldkeypub: 5Gx1...abcd
  balance: τ 0.000000

  Hotkeys:
  ┌────────────────┬────────────────────────────────────────────────────┬────────┐
  │ Hotkey         │ Address                                            │ Stake  │
  ├────────────────┼────────────────────────────────────────────────────┼────────┤
  │ miner1         │ 5Gx1...xyz9                                        │ τ 0.00 │
  └────────────────┴────────────────────────────────────────────────────┴────────┘
```

---

## 📁 Lokasi File Wallet

Wallet tersimpan di:

```
~/.bittensor/wallets/
└── mywallet/
    ├── coldkey          ← file terenkripsi (butuh password)
    ├── coldkeypub.txt   ← public key (aman dibagikan)
    └── hotkeys/
        └── miner1       ← hotkey (terenkripsi)
```

:::tip Backup File Wallet
Selain mnemonic, backup juga folder `~/.bittensor/wallets/` ke USB drive atau encrypted cloud storage. Tapi ingat: **file saja tidak cukup** kalau kamu lupa password — mnemonic tetap jadi backup utama.
:::

---

## 🚰 Step 4 — Dapatkan TAO Testnet dari Faucet

Untuk register miner di testnet, kamu butuh sedikit TAO testnet (tidak perlu beli — gratis dari faucet).

:::warning Ketersediaan Faucet Berubah-ubah
Faucet testnet kadang dimatikan atau diganti. Kalau faucet web di bawah tidak jalan, **jalur paling andal adalah Discord Bittensor** (channel faucet testnet). Ingat: faucet hanya butuh **public address coldkey** kamu — **jangan pernah** masukkan mnemonic ke website faucet manapun.
:::

### Opsi A: Miner's Union Faucet (Paling Mudah)

1. Buka browser: **app.minersunion.ai/testnet-faucet**
2. Masukkan **public address coldkey** kamu (dari output `btcli wallet overview`, baris `coldkeypub`)
3. Klik "Request TAO"
4. Tunggu beberapa menit

Verifikasi setelah beberapa menit:

```bash
btcli wallet balance --wallet-name mywallet --network test
```

:::warning Testnet: cek balance pakai script SDK
Per Juni 2026, `btcli wallet balance --network test` gagal (`Storage function "Swap.AlphaSqrtPrice" not found`) karena runtime testnet belum sinkron dengan btcli terbaru. Ini bukan salah instalasimu. Untuk cek balance di **testnet**, pakai script SDK dari repo fork:
```bash
# Clone repo dulu kalau belum (dipakai lagi di Unit 4 & 5)
cd ~ && git clone https://github.com/Ethereum-Jakarta/bittensor-subnet-template-v10.git
cd bittensor-subnet-template-v10

# Cek balance + status registrasi via SDK
python scripts/status.py --wallet.name mywallet --wallet.hotkey miner1 --netuid 1
```
btcli `wallet balance` tetap normal untuk **mainnet**.
:::

### Opsi B: Bittensor Discord Faucet

1. Join Discord Bittensor: **discord.gg/bittensor**
2. Masuk ke channel **#requests-for-testnet-tao** (atau channel faucet yang aktif)
3. Post public address coldkey kamu dengan format yang diminta
4. Bot atau moderator akan kirim TAO testnet

:::note Berapa TAO Testnet yang Dibutuhkan?
Biaya registrasi (recycle) di testnet bervariasi — biasanya sangat murah. **1 τ testnet** cukup untuk beberapa kali percobaan register.

Catatan: registrasi memakai **recycle TAO** (era dTAO), jadi TAO testnet dari faucet wajib ada sebelum register.
:::

---

## 🔒 Step 5 — Keamanan Wallet Dasar

### Browser Extension Wallet (Opsional)

Selain btcli, kamu juga bisa menggunakan **Bittensor Wallet Extension** di Chrome/Brave untuk memantau balance via UI:

- Cari "Bittensor Wallet" di Chrome Web Store (pastikan dari developer resmi)
- Import wallet menggunakan mnemonic coldkey

:::warning Verifikasi Extension!
Selalu cek bahwa extension yang kamu install adalah dari publisher resmi. Ada banyak extension palsu yang mencuri mnemonic. Lihat jumlah download dan review.
:::

### Anti-Scam Checklist

Bittensor punya komunitas besar tapi juga banyak scammer. Ingat:

- ❌ **Tidak ada admin Bittensor yang DM duluan** untuk bantu setup
- ❌ **Tidak ada "double your TAO" scheme** yang legit
- ❌ **Jangan pernah ketik mnemonic di website apapun** yang bukan btcli lokal kamu
- ❌ **Jangan share screen** saat wallet kamu terbuka ke orang yang tidak kamu kenal
- ✅ Admin komunitas asli hanya bantu di channel publik, bukan DM pribadi

---

## 🐛 Troubleshooting Wallet

| Error | Penyebab | Solusi |
|-------|----------|--------|
| `Wallet not found` | Nama wallet salah | Cek: `btcli wallet list` |
| `Invalid password` | Typo password | Coba lagi — 3x salah kena cooldown |
| `Wallet file corrupted` | File rusak | Restore dari mnemonic: `btcli wallet regen_coldkey` |
| Balance testnet tidak muncul | Faucet belum proses / network delay | Tunggu 5 menit, cek lagi |
| `Connection refused` ke testnet | Subtensor testnet down | Coba besok atau cek status di Discord |

### Restore Wallet dari Mnemonic

Kalau pindah komputer atau file hilang:

```bash
# Restore coldkey
btcli wallet regen_coldkey --wallet-name mywallet
# Akan minta mnemonic 24 kata kamu

# Restore hotkey
btcli wallet regen_hotkey --wallet-name mywallet --hotkey miner1
# Akan minta mnemonic hotkey
```

---

## 🎯 Rangkuman

- **Coldkey** = vault TAO, hanya aktifkan saat perlu transfer/stake/register
- **Hotkey** = worker key, boleh ada di server, dipakai miner 24/7
- Command buat wallet: `btcli wallet create --wallet-name mywallet --hotkey miner1`
- Backup **24-kata mnemonic di kertas fisik** — tidak ada recovery lain
- TAO testnet gratis dari **app.minersunion.ai/testnet-faucet** atau Bittensor Discord

### ✅ Quick Check

1. Apa perbedaan fungsi coldkey dan hotkey?
2. Kenapa mnemonic harus disimpan di kertas, bukan di file digital?
3. Di mana lokasi default file wallet tersimpan di sistem kamu?
4. Apa yang terjadi kalau kamu lupa password coldkey tapi punya mnemonic?

<details>
<summary>💡 Jawaban</summary>

1. **Coldkey** = vault, untuk transfer TAO & register. **Hotkey** = worker, untuk operasional miner & tanda tangan query.
2. File digital rentan: diretas, sync ke cloud, di-screenshot → ketahuan. Kertas fisik offline = paling aman untuk seed phrase.
3. Default: `~/.bittensor/wallets/<nama_wallet>/`
4. Bisa restore: `btcli wallet regen_coldkey` → masukkan mnemonic → set password baru.

</details>

---

**Next:** [Unit 4 — Register Miner di Subnet Testnet →](./register-subnet-testnet)

*Your keys, your TAO. 🔑*
