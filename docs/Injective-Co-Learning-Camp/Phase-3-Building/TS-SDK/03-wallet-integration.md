---
sidebar_position: 3
title: 👛 Unit 3 — Wallet Integration
description: Menghubungkan Keplr dan MetaMask ke aplikasi web, mengelola state koneksi, dan menangani kasus tepi yang sering dilupakan pemula.
---

# 👛 Unit 3 — Wallet Integration

:::info Goal Unit Ini
Di akhir unit ini kamu akan:
- Bisa menghubungkan **Keplr** dan **MetaMask** ke aplikasi web
- Paham **wallet strategy** sebagai lapisan abstraksi
- Bisa mengelola **state koneksi** dengan benar
- Menangani kasus tepi: wallet belum terpasang, ganti akun, ganti jaringan
:::

:::note Prasyarat
- ✅ [Unit 2](./query-chain-data) selesai
- 💡 Familiar dengan React akan membantu — contoh di sini memakai React, tapi konsepnya berlaku umum
:::

---

## 🎯 Masalah yang Diselesaikan

Injective punya dua jenis wallet (ingat MultiVM dari [Phase 0 Unit 3](../../Phase-0-Prerequisites/cosmos-ibc-dan-multivm)):

- **Keplr** dan wallet Cosmos lain → alamat `inj1...`
- **MetaMask** dan wallet EVM lain → alamat `0x...`

Kalau kamu menangani keduanya secara manual, kamu akan menulis dua jalur kode yang sangat berbeda: cara koneksi berbeda, cara tanda tangan berbeda, format alamat berbeda.

**Wallet strategy** menyatukan itu di balik satu antarmuka.

```bash
npm install @injectivelabs/wallet-strategy
```

---

## 🔌 Setup Wallet Strategy

Buat `src/wallet.ts`:

```typescript
import { WalletStrategy } from "@injectivelabs/wallet-strategy";
import { Wallet } from "@injectivelabs/wallet-base";
import { Network } from "@injectivelabs/networks";
import { ChainId, EthereumChainId } from "@injectivelabs/ts-types";

export const walletStrategy = new WalletStrategy({
  chainId: ChainId.Testnet,
  ethereumOptions: {
    ethereumChainId: EthereumChainId.Injective,
  },
});

export async function hubungkan(wallet: Wallet) {
  walletStrategy.setWallet(wallet);
  const addresses = await walletStrategy.getAddresses();

  if (addresses.length === 0) {
    throw new Error("Tidak ada akun yang tersedia di wallet");
  }

  return addresses[0];
}
```

:::note Nama paket dan enum bisa berbeda antar versi
Ekosistem wallet Injective sempat direstrukturisasi — beberapa versi memakai `@injectivelabs/wallet-ts`, yang lebih baru memecahnya menjadi `@injectivelabs/wallet-strategy` dan `@injectivelabs/wallet-base`.

Kalau impor di atas gagal, periksa paket apa yang benar-benar terpasang:

```bash
npm ls | grep injectivelabs
```

lalu cocokkan dengan [API reference resmi](https://injectivelabs.github.io/injective-ts/). Pola konseptualnya tetap sama meski nama paketnya bergeser.
:::

---

## ⚛️ Hook React untuk Koneksi Wallet

Buat `src/hooks/useWallet.ts`:

```typescript
import { useState, useCallback, useEffect } from "react";
import { Wallet } from "@injectivelabs/wallet-base";
import { walletStrategy } from "../wallet";

interface StateWallet {
  alamat: string | null;
  sedangMenghubungkan: boolean;
  error: string | null;
  walletTerpilih: Wallet | null;
}

export function useWallet() {
  const [state, setState] = useState<StateWallet>({
    alamat: null,
    sedangMenghubungkan: false,
    error: null,
    walletTerpilih: null,
  });

  const hubungkan = useCallback(async (wallet: Wallet) => {
    setState((s) => ({ ...s, sedangMenghubungkan: true, error: null }));

    try {
      walletStrategy.setWallet(wallet);
      const addresses = await walletStrategy.getAddresses();

      if (addresses.length === 0) {
        throw new Error("Tidak ada akun tersedia. Buka wallet-mu dan buat akun.");
      }

      setState({
        alamat: addresses[0],
        sedangMenghubungkan: false,
        error: null,
        walletTerpilih: wallet,
      });

      // Ingat pilihan untuk kunjungan berikutnya
      localStorage.setItem("wallet-terakhir", wallet);
    } catch (error) {
      setState({
        alamat: null,
        sedangMenghubungkan: false,
        error: pesanErrorRamah(error),
        walletTerpilih: null,
      });
    }
  }, []);

  const putuskan = useCallback(() => {
    localStorage.removeItem("wallet-terakhir");
    setState({
      alamat: null,
      sedangMenghubungkan: false,
      error: null,
      walletTerpilih: null,
    });
  }, []);

  // Sambungkan ulang otomatis saat halaman dimuat
  useEffect(() => {
    const terakhir = localStorage.getItem("wallet-terakhir") as Wallet | null;
    if (terakhir) {
      hubungkan(terakhir);
    }
  }, [hubungkan]);

  return { ...state, hubungkan, putuskan };
}

function pesanErrorRamah(error: unknown): string {
  const pesan = error instanceof Error ? error.message : String(error);

  if (pesan.includes("not installed") || pesan.includes("undefined")) {
    return "Wallet belum terpasang. Pasang ekstensinya lalu muat ulang halaman.";
  }
  if (pesan.includes("rejected") || pesan.includes("denied")) {
    return "Koneksi dibatalkan.";
  }
  return pesan;
}
```

:::tip Perhatikan `pesanErrorRamah`
Pesan error mentah dari wallet sering tidak bisa dipahami pengguna biasa — misalnya `"window.keplr is undefined"`.

Menerjemahkannya jadi kalimat yang bisa ditindaklanjuti adalah pembeda antara aplikasi yang terasa profesional dan yang terasa seperti proyek latihan. **Ini detail kecil yang akan diperhatikan juri saat showcase.**
:::

---

## 🎨 Komponen Tombol Koneksi

```tsx
import { Wallet } from "@injectivelabs/wallet-base";
import { useWallet } from "../hooks/useWallet";

export function TombolWallet() {
  const { alamat, sedangMenghubungkan, error, hubungkan, putuskan } = useWallet();

  if (alamat) {
    return (
      <div>
        <span>{potongAlamat(alamat)}</span>
        <button onClick={putuskan}>Putuskan</button>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => hubungkan(Wallet.Keplr)}
        disabled={sedangMenghubungkan}
      >
        {sedangMenghubungkan ? "Menghubungkan..." : "Hubungkan Keplr"}
      </button>

      <button
        onClick={() => hubungkan(Wallet.Metamask)}
        disabled={sedangMenghubungkan}
      >
        Hubungkan MetaMask
      </button>

      {error && <p role="alert">{error}</p>}
    </div>
  );
}

function potongAlamat(alamat: string): string {
  return `${alamat.slice(0, 8)}...${alamat.slice(-6)}`;
}
```

---

## ⚠️ Kasus Tepi yang Sering Dilupakan

Bagian ini yang memisahkan aplikasi yang berfungsi di demo dari yang berfungsi di tangan pengguna sungguhan.

### 1. Wallet belum terpasang

```typescript
function keplrTerpasang(): boolean {
  return typeof window !== "undefined" && "keplr" in window;
}

function metamaskTerpasang(): boolean {
  return typeof window !== "undefined" && "ethereum" in window;
}
```

Tampilkan tautan pemasangan, jangan sekadar error.

### 2. Pengguna mengganti akun di wallet

Pengguna bisa berganti akun kapan saja tanpa memberi tahu aplikasimu.

```typescript
useEffect(() => {
  if (typeof window === "undefined") return;

  const ethereum = (window as any).ethereum;
  if (!ethereum?.on) return;

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      putuskan();
    } else {
      // Muat ulang data untuk akun baru
      window.location.reload();
    }
  };

  ethereum.on("accountsChanged", handleAccountsChanged);
  return () => ethereum.removeListener?.("accountsChanged", handleAccountsChanged);
}, [putuskan]);
```

:::danger Kalau kamu tidak menangani pergantian akun
Aplikasimu akan menampilkan saldo akun A sementara transaksi ditandatangani oleh akun B.

Pengguna akan mengira mereka mengirim dari satu akun padahal dari akun lain. Di aplikasi keuangan sungguhan, bug seperti ini menyebabkan kehilangan dana.
:::

### 3. Jaringan salah

Kalau pengguna terhubung ke Ethereum Mainnet padahal aplikasimu butuh Injective testnet, semua transaksi akan gagal dengan pesan membingungkan.

Deteksi dan tawarkan tombol untuk berpindah:

```typescript
async function pastikanJaringanBenar() {
  const ethereum = (window as any).ethereum;
  if (!ethereum) return;

  const chainIdSaatIni = await ethereum.request({ method: "eth_chainId" });
  const chainIdInjective = "0x59f"; // 1439 dalam heksadesimal

  if (chainIdSaatIni !== chainIdInjective) {
    try {
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: chainIdInjective }],
      });
    } catch (error: any) {
      // Kode 4902 = jaringan belum ada di wallet, tambahkan dulu
      if (error.code === 4902) {
        await ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: chainIdInjective,
              chainName: "Injective EVM Testnet",
              rpcUrls: ["https://testnet.sentry.chain.json-rpc.injective.network/"],
              nativeCurrency: { name: "INJ", symbol: "INJ", decimals: 18 },
              blockExplorerUrls: ["https://testnet.blockscout.injective.network/"],
            },
          ],
        });
      }
    }
  }
}
```

:::tip Fitur "tambahkan jaringan otomatis" sangat berharga
Ingat betapa merepotkannya menambahkan jaringan secara manual di [Phase 0 Unit 4](../../Phase-0-Prerequisites/setup-wallet-dan-testnet)?

Kode di atas melakukannya untuk pengguna dengan satu klik. Ini salah satu peningkatan pengalaman pengguna dengan rasio manfaat-terhadap-usaha tertinggi yang bisa kamu tambahkan ke dApp-mu.
:::

### 4. Server-side rendering

Kalau kamu memakai Next.js, kode wallet **hanya boleh berjalan di browser**. `window` tidak ada di server.

```typescript
if (typeof window === "undefined") return;
```

Atau impor komponen wallet secara dinamis dengan `ssr: false`.

---

## 🔐 Praktik Keamanan

:::danger Aturan yang tidak boleh dilanggar
1. **Jangan pernah meminta seed phrase atau private key** di aplikasimu. Wallet yang menandatangani, bukan aplikasimu. Aplikasi apa pun yang memintanya adalah penipuan — dan kalau kamu membuatnya, pengguna berhak mencurigaimu.
2. **Jangan simpan data sensitif di localStorage.** Menyimpan preferensi wallet mana yang dipakai (seperti di contoh) tidak apa-apa. Menyimpan key tidak pernah boleh.
3. **Selalu tampilkan dengan jelas apa yang akan ditandatangani** sebelum meminta tanda tangan.
4. **Verifikasi jaringan sebelum transaksi** — jangan biarkan pengguna tidak sengaja bertransaksi di mainnet.
:::

---

## ✅ Checklist

- [ ] Tombol koneksi berfungsi untuk Keplr
- [ ] Tombol koneksi berfungsi untuk MetaMask
- [ ] Alamat ditampilkan dalam bentuk terpotong setelah terhubung
- [ ] Tombol putuskan berfungsi
- [ ] Sambung-ulang otomatis saat halaman dimuat berjalan
- [ ] Pesan error ramah pengguna, bukan pesan mentah
- [ ] Pergantian akun ditangani
- [ ] Pengecekan jaringan yang benar ada

---

## 🎯 Rangkuman

:::tip Yang Harus Kamu Ingat
- **Wallet strategy** menyatukan wallet Cosmos dan EVM di balik satu antarmuka
- Simpan pilihan wallet di `localStorage` untuk sambung-ulang otomatis — **jangan pernah simpan key**
- **Terjemahkan pesan error** wallet menjadi kalimat yang bisa ditindaklanjuti
- Empat kasus tepi wajib: **belum terpasang**, **ganti akun**, **jaringan salah**, **SSR**
- Tidak menangani pergantian akun bisa menyebabkan **pengguna bertransaksi dari akun yang salah**
- Fitur **tambah jaringan otomatis** menghilangkan langkah paling merepotkan bagi pengguna baru
- Aplikasimu **tidak pernah** menyentuh private key — wallet yang menandatangani
:::

### ✅ Quick Check

1. Kenapa wallet strategy lebih baik daripada menangani Keplr dan MetaMask secara terpisah?
2. Apa yang terjadi kalau kamu tidak menangani event `accountsChanged`?
3. Berapa chain ID Injective testnet dalam heksadesimal, dan kenapa formatnya begitu?
4. Apa arti kode error `4902`?

---

**Lanjut:** [Unit 4 — Build & Broadcast Transaction](./build-transaction) 👉
