---
sidebar_position: 2
title: 🔎 Unit 2 — Query Data Chain
description: Membaca saldo, info akun, state contract CosmWasm, dan data pasar dari Injective, serta menangani satuan desimal dengan benar.
---

# 🔎 Unit 2 — Query Data Chain

:::info Goal Unit Ini
Di akhir unit ini kamu akan:
- Bisa membaca **saldo, info akun, dan data pasar**
- Bisa mem-**query state contract CosmWasm** yang kamu deploy di Phase 2
- Bisa **mengonversi satuan** dengan benar antara tampilan dan on-chain
- Punya pola **penanganan error** yang layak dipakai di produksi
:::

:::note Prasyarat
- ✅ [Unit 1](./setup-injective-ts-sdk) selesai — query saldo pertama sudah berhasil
:::

---

## 🔢 Satuan — Selesaikan Ini Dulu

Sumber bug nomor satu bagi pemula. Mari beres di awal.

Blockchain menyimpan angka sebagai bilangan bulat. INJ punya **18 desimal**:

| Yang dilihat pengguna | Yang disimpan chain |
|---|---|
| 1 INJ | `1000000000000000000` |
| 0,5 INJ | `500000000000000000` |
| 0,000001 INJ | `1000000000000` |

Buat `src/utils.ts`:

```typescript
import { BigNumberInBase, BigNumberInWei } from "@injectivelabs/utils";

/** Dari satuan on-chain ke tampilan: 1000000000000000000 → "1" */
export function keTampilan(jumlahWei: string | number, desimal = 18): string {
  return new BigNumberInWei(jumlahWei).toBase(desimal).toFixed();
}

/** Dari tampilan ke satuan on-chain: "1" → "1000000000000000000" */
export function keOnChain(jumlah: string | number, desimal = 18): string {
  return new BigNumberInBase(jumlah).toWei(desimal).toFixed();
}
```

:::danger Jangan pakai `Number` untuk jumlah token
```typescript
// ❌ SALAH — kehilangan presisi
const jumlah = Number("1000000000000000000") / 1e18;

// ✅ BENAR
const jumlah = keTampilan("1000000000000000000");
```

Tipe `Number` di JavaScript hanya aman sampai sekitar 9 kuadriliun. Jumlah token dengan 18 desimal rutin melampaui itu, dan hasilnya **pembulatan diam-diam** — angka yang salah tanpa error apa pun.

Selalu pakai `BigNumberInBase` / `BigNumberInWei`, atau `BigInt` bawaan JavaScript. Jangan pernah `Number`.
:::

:::warning Tidak semua token punya 18 desimal
INJ punya 18, tapi banyak stablecoin punya 6. Kalau kamu menganggap semuanya 18, jumlahnya akan meleset **satu triliun kali lipat**.

Selalu ambil nilai desimal dari metadata token, jangan diasumsikan.
:::

---

## 💰 Query Saldo

Buat `src/queries/balance.ts`:

```typescript
import { ChainGrpcBankApi } from "@injectivelabs/sdk-ts/client/chain";
import { getNetworkEndpoints, Network } from "@injectivelabs/networks";
import { keTampilan } from "../utils";

const endpoints = getNetworkEndpoints(Network.Testnet);
const bankApi = new ChainGrpcBankApi(endpoints.grpc);

export async function ambilSaldo(alamat: string) {
  const balances = await bankApi.fetchBalances(alamat);

  return balances.balances.map((b) => ({
    denom: b.denom,
    jumlahOnChain: b.amount,
    // Catatan: 18 desimal hanya benar untuk INJ
    jumlahTampilan: b.denom === "inj" ? keTampilan(b.amount) : b.amount,
  }));
}

// Query satu denom saja
export async function ambilSaldoINJ(alamat: string) {
  const saldo = await bankApi.fetchBalance({
    accountAddress: alamat,
    denom: "inj",
  });
  return keTampilan(saldo.amount);
}
```

Pakai di `src/index.ts`:

```typescript
import { ambilSaldo, ambilSaldoINJ } from "./queries/balance";

const ALAMAT = "inj1ganti_dengan_alamatmu";

async function main() {
  const semua = await ambilSaldo(ALAMAT);
  console.table(semua);

  const inj = await ambilSaldoINJ(ALAMAT);
  console.log(`Saldo INJ: ${inj}`);
}

main().catch(console.error);
```

---

## 📜 Query State Contract CosmWasm

Di sinilah pekerjaan Phase 2 tersambung. Kalau kamu men-deploy contract counter di [Phase 2 Jalur B](../../Phase-2-Smart-Contracts/Rust-CosmWasm/build-deploy-cosmwasm), kamu bisa membacanya dari TypeScript.

Buat `src/queries/contract.ts`:

```typescript
import { ChainGrpcWasmApi } from "@injectivelabs/sdk-ts/client/chain";
import { getNetworkEndpoints, Network } from "@injectivelabs/networks";
import { toBase64, fromBase64 } from "@injectivelabs/sdk-ts";

const endpoints = getNetworkEndpoints(Network.Testnet);
const wasmApi = new ChainGrpcWasmApi(endpoints.grpc);

export async function queryCounter(alamatContract: string) {
  // Ini QueryMsg yang sama persis dengan yang kamu ketik di terminal
  const queryMsg = { get_count: {} };

  const response = await wasmApi.fetchSmartContractState(
    alamatContract,
    toBase64(queryMsg)
  );

  return fromBase64(Buffer.from(response.data).toString("base64"));
}
```

:::tip Perhatikan JSON-nya
`{ get_count: {} }` adalah objek yang **persis sama** dengan yang kamu ketik sebagai `GET_COUNT='{"get_count":{}}'` di terminal pada Phase 2 Unit 3.

Ini poin penting: enum `QueryMsg` yang kamu definisikan di Rust, JSON yang kamu ketik di terminal, dan objek yang kamu kirim dari TypeScript — **semuanya hal yang sama.** Kalau kamu paham satu, kamu paham ketiganya.
:::

---

## 📈 Query Data Pasar

Untuk data pasar dan riwayat, pakai **indexer**, bukan chain.

```typescript
import { IndexerGrpcSpotApi } from "@injectivelabs/sdk-ts/client/indexer";
import { getNetworkEndpoints, Network } from "@injectivelabs/networks";

const endpoints = getNetworkEndpoints(Network.Testnet);
const spotApi = new IndexerGrpcSpotApi(endpoints.indexer);

export async function daftarPasar() {
  const markets = await spotApi.fetchMarkets();
  return markets.map((m) => ({
    id: m.marketId,
    ticker: m.ticker,
    baseDenom: m.baseDenom,
    quoteDenom: m.quoteDenom,
  }));
}

export async function ambilOrderbook(marketId: string) {
  const orderbook = await spotApi.fetchOrderbookV2(marketId);
  return {
    bidTeratas: orderbook.buys.slice(0, 5),
    askTerbawah: orderbook.sells.slice(0, 5),
  };
}
```

:::info Inilah orderbook dari Phase 1
Data yang kamu ambil di sini adalah **orderbook on-chain** yang kita bahas panjang lebar di [Phase 1 Unit 2](../../Phase-1-Fundamentals/Concept-1-Arsitektur/exchange-module-orderbook) — bid, ask, dan spread yang sesungguhnya.

Ini juga sumber data yang sama yang dipakai Helix. Teori dari Phase 1 sekarang jadi data yang bisa kamu olah.
:::

:::note Nama method bisa berbeda antar versi
SDK berkembang, dan nama method seperti `fetchOrderbookV2` bisa berubah. Kalau ada yang tidak dikenali, cek [API reference resmi](https://injectivelabs.github.io/injective-ts/) untuk versi yang kamu pakai, atau ketik nama API lalu biarkan autocomplete editor menampilkan method yang tersedia.
:::

---

## 🛡️ Penanganan Error yang Layak

Kode contoh di atas mengasumsikan semuanya berjalan lancar. Kode sungguhan tidak boleh begitu.

```typescript
export async function ambilSaldoAman(alamat: string): Promise<string | null> {
  // Validasi input sebelum memanggil jaringan
  if (!alamat.startsWith("inj1")) {
    console.error("Format alamat tidak valid:", alamat);
    return null;
  }

  try {
    const saldo = await bankApi.fetchBalance({
      accountAddress: alamat,
      denom: "inj",
    });
    return keTampilan(saldo.amount);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Query gagal:", error.message);
    }
    return null;
  }
}
```

### Retry sederhana untuk endpoint yang sibuk

```typescript
export async function denganRetry<T>(
  fn: () => Promise<T>,
  percobaan = 3,
  jedaMs = 1000
): Promise<T> {
  let errorTerakhir: unknown;

  for (let i = 0; i < percobaan; i++) {
    try {
      return await fn();
    } catch (error) {
      errorTerakhir = error;
      console.warn(`Percobaan ${i + 1} gagal, mencoba lagi...`);
      await new Promise((r) => setTimeout(r, jedaMs * (i + 1)));
    }
  }

  throw errorTerakhir;
}
```

Pakai:

```typescript
const saldo = await denganRetry(() => ambilSaldoINJ(ALAMAT));
```

:::tip Endpoint publik sedang dipakai 71 orang sekaligus
Selama camp, semua peserta memakai endpoint testnet publik yang sama. Rate limit dan timeout **akan** terjadi.

Menambahkan retry bukan sekadar praktik yang baik di sini — ia benar-benar dibutuhkan supaya kodemu tidak gagal di tengah demo.
:::

---

## 🧪 Latihan

Buat script `src/latihan.ts` yang:

1. Mengambil saldo dari alamatmu dan menampilkannya dalam satuan yang mudah dibaca
2. Mengambil daftar pasar spot di testnet dan menampilkan 5 teratas
3. Mengambil orderbook salah satu pasar dan mencetak **spread**-nya
4. Kalau kamu punya contract CosmWasm dari Phase 2, query state-nya
5. Bungkus semuanya dengan retry dan penanganan error

:::note Latihan nomor 3
Spread = ask terendah dikurangi bid tertinggi. Kamu menghitung angka yang persis sama dengan yang dibahas di Phase 1 Unit 2 — sekarang dari data sungguhan.
:::

---

## 🎯 Rangkuman

:::tip Yang Harus Kamu Ingat
- **Jangan pernah pakai `Number`** untuk jumlah token — pakai `BigNumberInBase`/`BigNumberInWei`
- Jangan asumsikan semua token 18 desimal; **ambil dari metadata**
- **Chain gRPC** untuk state terkini, **Indexer** untuk riwayat dan data pasar
- Query CosmWasm dari TypeScript memakai **JSON yang sama** dengan di terminal
- Data orderbook yang kamu ambil adalah **orderbook on-chain** dari teori Phase 1
- Selalu **validasi input**, tangani error, dan pakai **retry** — endpoint publik akan gagal sesekali
:::

### ✅ Quick Check

1. Kenapa `Number("1000000000000000000") / 1e18` berbahaya?
2. Kamu butuh riwayat perdagangan sebuah pasar. Chain atau indexer?
3. `{ get_count: {} }` di TypeScript setara dengan apa di terminal `injectived`?
4. Kenapa retry penting selama camp ini secara khusus?

---

**Lanjut:** [Unit 3 — Wallet Integration](./wallet-integration) 👉
