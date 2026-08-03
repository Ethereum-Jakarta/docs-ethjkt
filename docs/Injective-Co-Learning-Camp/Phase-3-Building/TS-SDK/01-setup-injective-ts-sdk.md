---
sidebar_position: 1
title: 🧰 Unit 1 — Setup Injective TypeScript SDK
description: Memasang @injectivelabs/sdk-ts dengan versi yang aman, memahami pembagian paketnya, dan menghubungkan project ke endpoint testnet Injective.
---

# 🧰 Unit 1 — Setup Injective TypeScript SDK

:::info Goal Unit Ini
Di akhir unit ini kamu akan:
- Punya project TypeScript yang terhubung ke **Injective testnet**
- Paham pembagian **paket-paket** Injective dan fungsinya masing-masing
- Tahu cara **memilih versi paket yang aman** dan kenapa itu penting
- Berhasil menjalankan **query pertama** ke chain
:::

:::note Prasyarat
- ✅ [Phase 0 Unit 4](../../Phase-0-Prerequisites/setup-wallet-dan-testnet) — wallet dan testnet INJ sudah siap
- 💻 **Node.js v18+** — cek dengan `node --version`
- 💡 Familiar dengan JavaScript/TypeScript dasar
:::

---

## 🚨 Baca Ini Sebelum `npm install`

:::danger Paket Injective pernah dikompromikan pada Juli 2026
Pada **8 Juli 2026**, versi **`@injectivelabs/sdk-ts@1.20.21`** dirilis ke npm dengan **kode berbahaya di dalamnya.** Serangan ini terjadi lewat pipeline publikasi resmi repo, jadi paketnya terlihat sah sepenuhnya.

**Apa yang dilakukan malware itu:** ia memodifikasi fungsi yang dipakai untuk menurunkan private key, dengan kedok "telemetry", lalu **mengirim data yang cukup untuk merekonstruksi private key dan seed phrase** ke server penyerang.

Sekitar 17 paket lain dalam scope `@injectivelabs` juga menerbitkan versi `1.20.21` yang terdampak.

**Yang harus kamu lakukan:**
- ✅ Pakai versi **`1.20.23` atau lebih baru** — ini versi bersih yang dirilis sebagai perbaikan
- ❌ **Jangan pernah** memasang versi `1.20.21`
- ⚠️ Kalau kamu **pernah** menjalankan kode dengan versi itu, **anggap private key dan seed phrase apa pun yang lewat di sana sudah bocor** dan segera pindahkan asetmu ke wallet baru

Selama camp kita hanya memakai testnet, jadi risikonya kecil. Tapi kebiasaan yang kamu bangun sekarang akan terbawa ke pekerjaan sungguhan nanti.
:::

### Pelajaran yang lebih besar

Ini bukan soal Injective. Ini soal **cara kerja seluruh ekosistem npm.**

Ketika kamu menjalankan `npm install`, kamu menjalankan kode dari orang yang tidak kamu kenal, di komputer yang berisi kunci-kuncimu. Kebiasaan yang melindungimu:

| Kebiasaan | Kenapa |
|---|---|
| **Pin versi** di `package.json`, jangan pakai `^` untuk paket kripto | Mencegah upgrade otomatis ke versi jahat |
| **Commit lockfile** (`package-lock.json`) | Semua orang di tim memasang byte yang sama |
| **Jangan taruh private key asli** di komputer development | Kalau bocor, tidak ada yang hilang |
| **Pakai wallet terpisah** untuk development | Batasi kerugian maksimum |
| Periksa **tanggal rilis** paket sebelum upgrade | Versi yang baru rilis beberapa jam patut dicurigai |

:::tip Ini bagus untuk post refleksi X kamu
Salah satu syarat kelulusan adalah menulis post di X tentang apa yang kamu pelajari. Kesadaran keamanan supply chain adalah topik yang jauh lebih berbobot daripada "saya belajar deploy contract" — dan menunjukkan kamu berpikir seperti engineer sungguhan.
:::

---

## 📦 Paket-Paket Injective

SDK Injective terbagi jadi beberapa paket. Kamu tidak butuh semuanya.

| Paket | Untuk apa | Butuh di camp? |
|---|---|---|
| `@injectivelabs/sdk-ts` | Inti — query, pesan, transaksi | ✅ Ya |
| `@injectivelabs/networks` | Konfigurasi endpoint per jaringan | ✅ Ya |
| `@injectivelabs/utils` | Utilitas angka & konversi satuan | ✅ Ya |
| `@injectivelabs/wallet-strategy` | Koneksi wallet browser | ✅ Di Unit 3 |
| `@injectivelabs/ts-types` | Tipe bersama | Ikut sebagai dependensi |

---

## 🛠️ Setup Project

### Step 1 — Buat project

```bash
mkdir injective-sdk-latihan
cd injective-sdk-latihan
npm init -y
```

### Step 2 — Pasang dependensi

```bash
npm install @injectivelabs/sdk-ts@^1.20.23 @injectivelabs/networks @injectivelabs/utils
npm install --save-dev typescript tsx @types/node
```

:::warning Verifikasi versi yang terpasang
Setelah instalasi, **selalu periksa** versi mana yang benar-benar masuk:

```bash
npm list @injectivelabs/sdk-ts
```

Pastikan hasilnya `1.20.23` atau lebih tinggi. Kalau ternyata `1.20.21`, hapus dan pasang ulang dengan versi eksplisit:

```bash
npm install @injectivelabs/sdk-ts@1.20.23
```
:::

### Step 3 — Konfigurasi TypeScript

Buat `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true,
    "outDir": "./dist"
  },
  "include": ["src/**/*"]
}
```

### Step 4 — Struktur folder

```bash
mkdir src
```

Tambahkan script di `package.json`:

```json
{
  "scripts": {
    "dev": "tsx src/index.ts"
  }
}
```

---

## 🌐 Jaringan dan Endpoint

Paket `@injectivelabs/networks` menyediakan semua endpoint sekaligus, jadi kamu tidak perlu menghafal URL.

Buat `src/network.ts`:

```typescript
import { getNetworkEndpoints, Network } from "@injectivelabs/networks";

// Selalu Testnet selama camp ini
export const NETWORK = Network.Testnet;
export const endpoints = getNetworkEndpoints(NETWORK);

console.log("Endpoint yang dipakai:");
console.log(endpoints);
```

Jalankan untuk melihat isinya:

```bash
npx tsx src/network.ts
```

Kamu akan melihat objek berisi endpoint `grpc`, `rest`, `indexer`, dan lainnya.

:::danger Testnet vs Mainnet
`Network.Testnet` = latihan. `Network.Mainnet` = **uang sungguhan**.

Satu kata yang salah ketik bisa berarti transaksi dengan aset asli. Definisikan jaringan di **satu tempat** (seperti file `network.ts` di atas) dan impor dari sana — jangan tulis `Network.X` tersebar di banyak file.
:::

### Dua jenis sumber data

| Sumber | Isinya | Contoh pemakaian |
|---|---|---|
| **Chain (gRPC)** | State langsung dari node | Saldo, info akun, state contract |
| **Indexer** | Data yang sudah diolah & di-index | Riwayat transaksi, data orderbook, statistik |

Aturan praktisnya: kalau butuh **kebenaran saat ini**, pakai chain. Kalau butuh **riwayat atau data teragregasi**, pakai indexer.

---

## 🚀 Query Pertama

Buat `src/index.ts`:

```typescript
import { ChainGrpcBankApi } from "@injectivelabs/sdk-ts/client/chain";
import { getNetworkEndpoints, Network } from "@injectivelabs/networks";

const endpoints = getNetworkEndpoints(Network.Testnet);
const bankApi = new ChainGrpcBankApi(endpoints.grpc);

// Ganti dengan alamat inj1... milikmu dari Keplr
const injectiveAddress = "inj1ganti_dengan_alamatmu";

async function main() {
  try {
    const balances = await bankApi.fetchBalances(injectiveAddress);
    console.log("Saldo:", JSON.stringify(balances, null, 2));
  } catch (error) {
    console.error("Gagal mengambil saldo:", error);
  }
}

main();
```

Jalankan:

```bash
npm run dev
```

Kalau berhasil, kamu akan melihat saldo testnet INJ-mu.

:::note Kenapa angkanya sangat besar?
Saldo dikembalikan dalam satuan terkecil. INJ punya 18 desimal, jadi `1000000000000000000` berarti 1 INJ.

Ini pola yang sama dengan yang kita bahas di [Solidity Dasar](../../Phase-2-Smart-Contracts/Solidity/solidity-dasar) — blockchain tidak memakai bilangan desimal. Kita akan mengonversinya ke bentuk yang mudah dibaca di [Unit 2](./query-chain-data).
:::

---

## 🛠️ Troubleshooting

<details>
<summary><strong>"Cannot find module '@injectivelabs/sdk-ts/client/chain'"</strong></summary>

Beberapa versi SDK mengekspor dari path yang berbeda. Coba impor dari root paket:

```typescript
import { ChainGrpcBankApi } from "@injectivelabs/sdk-ts";
```

Kalau masih gagal, periksa versi terpasangmu dengan `npm list @injectivelabs/sdk-ts` dan cocokkan dengan [API reference resmi](https://injectivelabs.github.io/injective-ts/).

</details>

<details>
<summary><strong>Error TypeScript soal `esModuleInterop` atau import</strong></summary>

Pastikan `tsconfig.json`-mu punya `"esModuleInterop": true` dan `"moduleResolution": "node"` seperti contoh di atas.

</details>

<details>
<summary><strong>Query menggantung lalu timeout</strong></summary>

Endpoint publik kadang lambat. Coba lagi. Kalau berulang, verifikasi endpoint yang dipakai dengan `console.log(endpoints)` dan bandingkan dengan [dokumentasi resmi](https://docs.injective.network).

</details>

<details>
<summary><strong>Saldo kosong padahal ada di explorer</strong></summary>

Periksa dua hal: (1) alamatnya `inj1...` yang benar, bukan alamat `0x...`, dan (2) kamu memakai `Network.Testnet`, bukan Mainnet.

</details>

---

## ✅ Checklist

- [ ] Project TypeScript berjalan
- [ ] `npm list @injectivelabs/sdk-ts` menunjukkan **1.20.23 atau lebih baru**
- [ ] `src/network.ts` mencetak daftar endpoint
- [ ] Query saldo berhasil mengembalikan data
- [ ] Kamu paham beda sumber **chain** dan **indexer**

---

## 🎯 Rangkuman

:::tip Yang Harus Kamu Ingat
- **`@injectivelabs/sdk-ts` versi 1.20.21 berbahaya** — pakai **1.20.23+**, dan selalu verifikasi dengan `npm list`
- Keamanan supply chain itu nyata: **pin versi**, commit lockfile, jangan simpan key asli di mesin dev
- `getNetworkEndpoints(Network.Testnet)` memberi semua endpoint sekaligus
- Definisikan jaringan di **satu tempat** supaya tidak salah ketik ke Mainnet
- **Chain (gRPC)** untuk state terkini; **Indexer** untuk riwayat dan agregasi
- Saldo dikembalikan dalam **satuan terkecil** (18 desimal untuk INJ)
:::

### ✅ Quick Check

1. Versi `@injectivelabs/sdk-ts` mana yang harus dihindari, dan mana yang aman?
2. Sebutkan dua kebiasaan yang mengurangi risiko serangan supply chain npm.
3. Kapan kamu memakai indexer, bukan chain gRPC?
4. Saldomu tampil sebagai `5000000000000000000`. Berapa INJ itu?

---

**Lanjut:** [Unit 2 — Query Data Chain](./query-chain-data) 👉
