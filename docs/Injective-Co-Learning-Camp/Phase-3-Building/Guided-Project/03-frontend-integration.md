---
sidebar_position: 3
title: 🖼️ Unit 3 — Frontend Integration
description: Membangun antarmuka React + Vite yang terhubung ke contract Celengan Target — design system, koneksi wallet RainbowKit, membaca daftar target, dan mengirim transaksi.
---

# 🖼️ Unit 3 — Frontend Integration

:::info Goal Unit Ini
Di akhir unit ini kamu akan punya:
- Aplikasi **React + Vite** yang terhubung ke contract-mu
- **Design system** yang rapi: token warna, font, dan komponen yang bisa dipakai ulang
- **Koneksi wallet** lewat RainbowKit
- **Daftar target** yang dibaca dari chain — tanpa perlu wallet
- **Buat target, setor, cairkan, tarik setoran** yang mengirim transaksi sungguhan
- **Penanganan error** yang menerjemahkan custom error contract jadi kalimat manusia
:::

:::note Prasyarat
- ✅ [Unit 2](./kontrak-dan-backend) — contract ter-deploy, alamat dan ABI tersedia
- ✅ [TS-SDK Unit 3](../TS-SDK/wallet-integration) — kamu paham pola koneksi wallet
:::

---

## 🏗️ Setup Project

Kita pakai **Vite**, mengikuti pola yang sama seperti di [Campus Hacks — Integrasi Frontend](../../../Tutorial/Campus-Hacks/integrasi-frontend).

```bash
npm create vite@latest celengan-ui -- --template react-ts
cd celengan-ui
npm install
npm install @rainbow-me/rainbowkit wagmi viem @tanstack/react-query react-hot-toast
npm install -D tailwindcss @tailwindcss/vite
```

| Paket | Gunanya |
|---|---|
| `wagmi` | React hooks untuk baca/tulis contract |
| `viem` | Library Ethereum TypeScript, dipakai wagmi di baliknya |
| `@rainbow-me/rainbowkit` | Komponen UI koneksi wallet siap pakai |
| `@tanstack/react-query` | Cache & state management (wajib untuk wagmi) |
| `react-hot-toast` | Notifikasi status transaksi |
| `tailwindcss` | Styling |

:::tip Kenapa Vite dan bukan Next.js?
Proyek ini murni **SPA** — tidak butuh server rendering, routing server, atau API route. Vite jauh lebih ringan, dev server-nya start dalam ~2 detik, dan hasil build-nya folder statis yang bisa di-host di mana saja.

Next.js baru layak dipakai kalau kamu butuh SSR atau backend.
:::

---

## 🎨 Design System

Sebelum menulis komponen, tetapkan dulu **token desain**. Ini yang membedakan aplikasi yang terlihat rapi dari yang terlihat seperti tumpukan utility acak.

Ganti isi `src/index.css` — atau lebih baik ganti namanya jadi `src/app.css` dan sesuaikan import di `src/main.tsx`:

```css
/*
 * Font HARUS di-import paling atas — lihat peringatan di bawah.
 */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Montserrat:wght@100..900&display=swap');

@import 'tailwindcss';

@theme {
  --font-inter: 'Inter', sans-serif;
  --font-montserrat: 'Montserrat', sans-serif;

  --color-primary: #f2b42d;
  --color-primary-foreground: #ffffff;
  --color-foreground: #131740;
  --color-very-tertiary: #0c102d;
  --color-background: #ffffff;
  --color-muted: #5a5d79;
  --color-secondary: #61c8f3;
  --color-secondary-foreground: #ffffff;
  --color-tertiary: #131740;
  --color-tertiary-foreground: #ffffff;
}

::-webkit-scrollbar {
  display: none;
}

body {
  scrollbar-width: none;
}
```

Blok `@theme` milik Tailwind v4 mengubah setiap token jadi utility: `--color-primary` otomatis jadi `bg-primary`, `text-primary`, `border-primary`, dan seterusnya.

| Token | Hex | Dipakai untuk |
|---|---|---|
| `primary` | `#F2B42D` | Tombol utama, aksen, angka persentase |
| `secondary` | `#61C8F3` | Aksen kedua, badge "tercapai" |
| `foreground` / `tertiary` | `#131740` | Teks utama (navy) |
| `muted` | `#5A5D79` | Teks sekunder, caption |
| `background` | `#FFFFFF` | Latar halaman |

Font: **Montserrat** untuk heading, **Inter** untuk body dan angka.

:::danger Urutan `@import` — jebakan yang diam-diam
Perhatikan import font ditaruh **sebelum** `@import 'tailwindcss'`. Ini bukan selera.

Spesifikasi CSS mewajibkan semua `@import` mendahului statement lain. Plugin Vite meng-inline `@import 'tailwindcss'` menjadi ribuan baris CSS — jadi kalau import font ditaruh sesudahnya, ia berakhir di tengah file dan PostCSS **membuangnya**:

```text
[vite:css][postcss] @import must precede all other statements
```

Efeknya jahat karena halus: tidak ada error yang menghentikan build, aplikasimu tetap jalan, tapi **Inter dan Montserrat tidak pernah termuat**. Browser diam-diam memakai font sistem, dan tampilannya cuma terasa "agak beda" tanpa kamu tahu kenapa.

Kalau melihat peringatan itu di terminal, jangan diabaikan.
:::

Aktifkan plugin Tailwind di `vite.config.ts`, sekalian pasang alias `$lib`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      $lib: fileURLToPath(new URL('./src/lib', import.meta.url)),
    },
  },
})
```

Dan daftarkan alias yang sama ke TypeScript di `tsconfig.app.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "$lib/*": ["./src/lib/*"]
    }
  }
}
```

:::warning Jangan tambahkan `baseUrl`
Contoh alias yang beredar biasanya menulis `"baseUrl": "."` bersama `paths`. Di TypeScript 6 opsi itu **sudah deprecated** dan build-nya gagal:

```text
error TS5101: Option 'baseUrl' is deprecated and will stop functioning in TypeScript 7.0.
```

Sejak TypeScript 5, `paths` sudah bisa berdiri sendiri — path-nya dihitung relatif terhadap file `tsconfig.json` itu sendiri. Cukup hapus `baseUrl`.
:::

---

## 📁 Struktur Proyek

Pakai pola **Atomic Design + feature-based**:

```
src/
├── app.css                    # token design system
├── main.tsx
├── App.tsx                    # provider + layout
└── lib/
    ├── components/            # UI yang dipakai ulang
    │   ├── atoms/             # Button, Input, Badge, Card, ProgressBar, Logo
    │   ├── molecules/         # FormField, SectionHeading
    │   └── organism/          # Navbar, Footer
    ├── features/
    │   └── celengan/
    │       ├── CelenganPage.tsx        # semua logika contract ada di sini
    │       └── components/             # HeroSection, TargetForm, TargetList, TargetCard
    ├── config/
    │   ├── chains.ts                   # definisi Injective testnet
    │   ├── wagmi.ts                    # config wagmi + RainbowKit
    │   └── constants/
    │       ├── CELENGAN_TARGET_ABI.json   # hasil `node scripts/export-abi.js`
    │       └── index.ts                   # ABI + alamat contract + RPC
    ├── utils/
    │   ├── errors.ts          # terjemahan custom error contract
    │   ├── format.ts          # formatINJ, formatPersen
    │   └── tunggu-receipt.ts  # polling receipt tahan-RPC-Injective
    └── types.ts
```

**Aturannya:**

- `components/` = dipakai ulang di seluruh app; `features/` = khusus satu domain
- **Atom** berdiri sendiri (Button, Input, Badge)
- **Molecule** menggabungkan atom (FormField = label + Input)
- **Organism** adalah bagian UI utuh (Navbar, Footer)

:::tip Kenapa repot memisahkan begini untuk proyek sekecil ini?
Karena batas ini yang membuat kamu **tidak** menulis `bg-[#f2b42d]` di tengah komponen saat buru-buru.

Ketika tombol hanya ada di satu tempat (`atoms/Button.tsx`), mengubah gaya seluruh aplikasi cukup satu file. Ketika gaya tombol tersebar di sepuluh komponen, kamu tidak akan pernah mengubahnya lagi — terlalu mahal.
:::

---

## ⚙️ Konfigurasi

`src/lib/config/constants/index.ts`:

```typescript
import type { Abi } from "viem";
import CELENGAN_TARGET_ABI_JSON from "./CELENGAN_TARGET_ABI.json";

export const CELENGAN_TARGET_ABI = CELENGAN_TARGET_ABI_JSON as Abi;

/** Ganti dengan alamat hasil deploy-mu (lihat celengan-contract/deployments.json) */
export const CELENGAN_CONTRACT = "0x_ganti_dengan_alamat_contract_kamu" as const;

export const EXPLORER_URL = "https://testnet.blockscout.injective.network";

export const INJECTIVE_TESTNET_RPC =
  "https://testnet.sentry.chain.json-rpc.injective.network/";
```

:::danger `as Abi` itu wajib, bukan hiasan
Tanpa cast, build gagal:

```text
error TS2322: Type 'string' is not assignable to type '"function"'.
```

TypeScript melebarkan setiap field JSON jadi `string`, sedangkan wagmi/viem menuntut tipe literal seperti `type: "function"`. Lakukan cast **sekali di sini**, bukan berulang-ulang di setiap pemakaian.
:::

:::danger Sekali lagi soal RPC
**Jangan** pakai `https://k8s.testnet.json-rpc.injective.network/`. Endpoint itu menerima transaksi tapi tidak pernah mengembalikan receipt, jadi aplikasimu akan selamanya menampilkan "Menunggu konfirmasi..." padahal transaksinya sudah sukses.
:::

`src/lib/config/chains.ts`:

```typescript
import type { Chain } from "wagmi/chains";
import { EXPLORER_URL, INJECTIVE_TESTNET_RPC } from "$lib/config/constants";

export const injectiveTestnet: Chain = {
  id: 1439,
  name: "Injective EVM Testnet",
  nativeCurrency: { decimals: 18, name: "Injective", symbol: "INJ" },
  rpcUrls: { default: { http: [INJECTIVE_TESTNET_RPC] } },
  blockExplorers: {
    default: {
      name: "Blockscout",
      url: EXPLORER_URL,
      // API ada di host terpisah — lihat Unit 2
      apiUrl: "https://testnet.blockscout-api.injective.network/api",
    },
  },
  testnet: true,
};
```

`src/lib/config/wagmi.ts`:

```typescript
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "wagmi";
import { injectiveTestnet } from "$lib/config/chains";
import { INJECTIVE_TESTNET_RPC } from "$lib/config/constants";

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID ?? "celengan-target-clc11";

export const config = getDefaultConfig({
  appName: "Celengan Target",
  projectId,
  chains: [injectiveTestnet],
  transports: {
    [injectiveTestnet.id]: http(INJECTIVE_TESTNET_RPC),
  },
  ssr: false,
});
```

:::warning `ssr: true` itu salah untuk Vite
Banyak contoh menyalin `ssr: true` dari dokumentasi Next.js. Opsi itu memberi tahu wagmi bahwa render pertama terjadi di server, sehingga wagmi menunda hidrasi state.

Vite adalah SPA murni. Kalau di-set `true`, status koneksi wallet jadi tidak sinkron setelah reload halaman.
:::

:::tip WalletConnect projectId itu opsional untuk latihan
Ambil gratis di [cloud.reown.com](https://cloud.reown.com) lalu simpan di `.env`:

```bash
VITE_WALLETCONNECT_PROJECT_ID=xxxxxxxxxxxx
```

Tanpa projectId asli, **MetaMask dan wallet injected lain tetap berfungsi normal** — hanya opsi WalletConnect (QR) yang tidak jalan, dan konsol menampilkan `Failed to fetch remote project configuration (403)`. Untuk demo camp itu sudah cukup.

Jangan lupa `.env` masuk `.gitignore` — template Vite **tidak** memasukkannya secara bawaan, jadi tambahkan sendiri.
:::

---

## 🔤 Types & Utils

`src/lib/types.ts`:

```typescript
export type Target = {
  id: number;
  pembuat: `0x${string}`;
  nama: string;
  jumlahTarget: bigint;
  terkumpul: bigint;
  sudahDicairkan: boolean;
  persentase: number;
};

/** Bentuk mentah struct Target yang dikembalikan `ambilTarget(uint256)`. */
export type TargetOnChain = Omit<Target, "id" | "persentase">;
```

`src/lib/utils/format.ts`:

```typescript
import { formatEther } from "viem";

export function formatINJ(wei: bigint, maksDesimal = 6): string {
  if (wei === 0n) return "0";
  const angka = Number(formatEther(wei));
  const terkecil = 10 ** -maksDesimal;
  if (angka > 0 && angka < terkecil) return `<${terkecil.toFixed(maksDesimal)}`;
  return angka.toFixed(maksDesimal).replace(/\.?0+$/, "");
}

export function formatPersen(nilai: number): string {
  return nilai > 999 ? "999+" : String(nilai);
}
```

:::tip Kenapa perlu formatter sendiri?
Karena data on-chain tidak sopan pada layout-mu.

Contract-nya benar, tapi kalau ada yang membuat target senilai **1 wei** lalu menyetor 0.001 INJ, `formatEther` menghasilkan `0.000000000000000001` dan `persentase` mengembalikan `100000000000000000`. Keduanya benar secara matematika dan **keduanya merusak kartu**.

Ini akan terjadi. Testnet itu tempat orang mencoba angka aneh — termasuk kamu sendiri saat menguji. Jangan berasumsi data on-chain akan berada dalam rentang yang cantik.
:::

`src/lib/utils/errors.ts`:

```typescript
import { BaseError, ContractFunctionRevertedError, UserRejectedRequestError } from "viem";

const PESAN: Record<string, string> = {
  TargetTidakAda: "Target tidak ditemukan.",
  JumlahNol: "Jumlah harus lebih dari nol.",
  NamaKosong: "Nama target tidak boleh kosong.",
  BukanPembuat: "Hanya pembuat target yang bisa mencairkan dana.",
  TargetBelumTercapai: "Target belum tercapai, dana belum bisa dicairkan.",
  SudahDicairkan: "Target ini sudah dicairkan.",
  TidakAdaKontribusi: "Kamu belum pernah menyetor ke target ini.",
  TargetSudahTercapai: "Target sudah tercapai — setoran tidak bisa ditarik lagi.",
  PengirimanGagal: "Pengiriman INJ gagal.",
};

export function terjemahkanError(e: unknown): string {
  if (e instanceof BaseError) {
    if (e.walk((err) => err instanceof UserRejectedRequestError)) {
      return "Transaksi dibatalkan.";
    }

    const revert = e.walk((err) => err instanceof ContractFunctionRevertedError);
    if (revert instanceof ContractFunctionRevertedError) {
      const nama = revert.data?.errorName;
      if (nama && PESAN[nama]) return PESAN[nama];
      if (nama) return `Transaksi ditolak contract: ${nama}`;
    }

    const pesan = e.shortMessage ?? e.message;
    if (pesan.includes("insufficient funds")) {
      return "Saldo INJ tidak cukup. Ambil testnet INJ dari faucet.";
    }
    return pesan;
  }

  // Fallback: sebagian error sampai ke sini sebagai string biasa
  const raw = e instanceof Error ? e.message : String(e);
  for (const [nama, pesan] of Object.entries(PESAN)) {
    if (raw.includes(nama)) return pesan;
  }
  if (raw.toLowerCase().includes("user rejected")) return "Transaksi dibatalkan.";
  return raw.slice(0, 160);
}
```

:::tip Kenapa `e.walk(...)` dan bukan `e.message.includes(...)`?
Pesan error mentah dari viem panjangnya bisa ratusan karakter — berisi ABI, request body, dan nomor versi. Menampilkannya apa adanya sama saja dengan tidak menampilkan apa-apa.

`walk()` menelusuri rantai `cause` sampai menemukan `ContractFunctionRevertedError`, lalu mengambil `errorName`-nya secara terstruktur. **Inilah bayaran dari memakai custom error di contract** — kalau contract-mu pakai `require("string")`, informasi ini tidak tersedia dalam bentuk terstruktur.
:::

`src/lib/utils/tunggu-receipt.ts`:

```typescript
import type { Hash, TransactionReceipt } from "viem";
import { getPublicClient } from "@wagmi/core";
import { config } from "$lib/config/wagmi";

export async function tungguReceipt(
  hash: Hash,
  { timeoutMs = 120_000, jedaMs = 2_000 } = {},
): Promise<TransactionReceipt> {
  const client = getPublicClient(config);
  if (!client) throw new Error("Public client tidak tersedia");

  const batas = Date.now() + timeoutMs;

  while (Date.now() < batas) {
    try {
      const receipt = await client.getTransactionReceipt({ hash });
      if (receipt) return receipt;
    } catch {
      // Node ini belum punya index untuk hash tersebut — coba lagi,
      // request berikutnya kemungkinan mendarat di node lain.
    }
    await new Promise((r) => setTimeout(r, jedaMs));
  }

  throw new Error(
    "Transaksi sudah dikirim tapi konfirmasinya tidak terbaca dalam 2 menit. " +
      "Cek langsung di explorer — kemungkinan besar sebenarnya berhasil.",
  );
}
```

:::danger Kenapa tidak pakai `waitForTransactionReceipt` bawaan wagmi?
Karena di Injective testnet **fungsi itu gagal**, dan gagalnya menyesatkan:

```text
TransactionReceiptNotFoundError: Transaction receipt with hash "0x2072…"
could not be found. The Transaction may not be processed on a block yet.
```

…padahal transaksinya sukses dan state on-chain sudah berubah.

**Penyebabnya:** RPC publik Injective berada di belakang load balancer, dan tiap node punya index transaksi sendiri yang tidak konsisten. Untuk satu hash yang sama, jawabannya bergantian:

```text
poll 0  null      poll 3  null
poll 1  OK        poll 4  null
poll 2  OK        poll 5  OK
```

Ketika receipt tidak ketemu, viem menduga transaksinya *replaced*, lalu menelusuri blok mencari transaksi pengganti dan memanggil `getTransactionReceipt` lagi. Kalau panggilan itu ikut kena node tanpa index, viem **menolak promise-nya** alih-alih terus menunggu.

Poller di atas menganggap `null` sebagai "belum, coba lagi" — persis seperti yang dilakukan `ethers`.

**Pelajaran yang lebih besar:** helper library dibangun dengan asumsi tentang perilaku RPC. Kalau chain-mu melanggar asumsi itu, kamu perlu tahu cukup banyak untuk turun satu lapis. Menyebutkan hal ini saat demo menunjukkan kamu benar-benar men-debug, bukan menyalin.
:::

---

## ⚛️ Atoms

`src/lib/components/atoms/Button.tsx` — satu-satunya sumber gaya tombol:

```tsx
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "tertiary" | "ghost";
type ButtonSize = "sm" | "md" | "lg" | "icon";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  className?: string;
  href?: string;
}

const baseClasses =
  "inline-flex items-center justify-center font-inter font-semibold rounded-full transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-primary text-primary-foreground",
  secondary: "bg-secondary text-secondary-foreground",
  tertiary: "bg-tertiary text-tertiary-foreground",
  ghost: "bg-transparent text-current",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
  icon: "p-2",
};

export default function Button({
  variant = "primary", size = "md", children, className = "", href, ...rest
}: Props) {
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  if (href) {
    return <a href={href} target="_blank" rel="noreferrer" className={classes}>{children}</a>;
  }
  return <button className={classes} {...rest}>{children}</button>;
}
```

`src/lib/components/atoms/Input.tsx`:

```tsx
import type { InputHTMLAttributes } from "react";

export default function Input({ className = "", ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full rounded-full border border-tertiary/20 bg-background px-5 py-3 font-inter text-foreground transition-colors placeholder:text-muted/60 focus:border-primary focus:outline-none disabled:opacity-50 ${className}`}
      {...rest}
    />
  );
}
```

`src/lib/components/atoms/Card.tsx`:

```tsx
import type { ReactNode } from "react";

export default function Card({
  children, className = "", interactive = false,
}: { children: ReactNode; className?: string; interactive?: boolean }) {
  return (
    <div
      className={`rounded-3xl border border-tertiary/10 bg-background p-6 shadow-sm md:p-8 ${
        interactive ? "transition-shadow hover:shadow-md" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
```

`src/lib/components/atoms/Badge.tsx`:

```tsx
import type { ReactNode } from "react";

type BadgeVariant = "primary" | "secondary" | "tertiary" | "outline";

const variantClasses: Record<BadgeVariant, string> = {
  primary: "bg-primary text-primary-foreground",
  secondary: "bg-secondary text-secondary-foreground",
  tertiary: "bg-tertiary text-tertiary-foreground",
  outline: "border border-tertiary/20 text-muted",
};

export default function Badge({
  variant = "primary", children, className = "",
}: { variant?: BadgeVariant; children: ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 font-inter text-xs font-semibold ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
}
```

`src/lib/components/atoms/ProgressBar.tsx`:

```tsx
export default function ProgressBar({
  value, className = "",
}: { value: number; className?: string }) {
  const lebar = Math.min(Math.max(value, 0), 100);
  const tercapai = value >= 100;

  return (
    <div
      className={`h-2.5 w-full overflow-hidden rounded-full bg-tertiary/10 ${className}`}
      role="progressbar" aria-valuenow={lebar} aria-valuemin={0} aria-valuemax={100}
    >
      <div
        className={`h-full rounded-full transition-all duration-500 ease-out ${
          tercapai ? "bg-secondary" : "bg-primary"
        }`}
        style={{ width: `${lebar}%` }}
      />
    </div>
  );
}
```

:::tip Warna yang membawa informasi
Progress bar berubah dari `primary` (kuning) ke `secondary` (biru) begitu mencapai 100%. Pengguna tahu target sudah penuh **tanpa membaca angkanya**.

Perhatikan juga `role="progressbar"` dan `aria-valuenow` — pembaca layar mengumumkan progresnya, bukan sekadar membaca sebuah div kosong. Menambahkannya butuh tiga atribut.
:::

Terakhir `src/lib/components/atoms/Logo.tsx`:

```tsx
export default function Logo({ className = "" }: { className?: string }) {
  return (
    <a href="/" className={`inline-flex items-center gap-2.5 ${className}`}>
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-lg">🎯</span>
      <span className="font-montserrat text-lg font-bold text-tertiary">Celengan Target</span>
    </a>
  );
}
```

---

## 🧬 Molecules & Organisms

`src/lib/components/molecules/FormField.tsx`:

```tsx
import type { InputHTMLAttributes } from "react";
import Input from "$lib/components/atoms/Input";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  hint?: string;
}

export default function FormField({ id, label, hint, ...rest }: Props) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block font-inter text-sm font-semibold text-foreground">
        {label}
      </label>
      <Input id={id} {...rest} />
      {hint && <p className="mt-1.5 font-inter text-xs text-muted">{hint}</p>}
    </div>
  );
}
```

`src/lib/components/molecules/SectionHeading.tsx`:

```tsx
import type { ReactNode } from "react";

export default function SectionHeading({
  title, subtitle, className = "",
}: { title: ReactNode; subtitle?: ReactNode; className?: string }) {
  return (
    <div className={`text-center ${className}`}>
      <h2 className="font-montserrat text-3xl font-bold text-foreground md:text-4xl">{title}</h2>
      {subtitle && <p className="mt-3 font-inter text-muted">{subtitle}</p>}
    </div>
  );
}
```

`src/lib/components/organism/Navbar.tsx`:

```tsx
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Logo from "$lib/components/atoms/Logo";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-tertiary/10 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-4">
        <Logo />
        <ConnectButton
          showBalance={false}
          accountStatus={{ smallScreen: "avatar", largeScreen: "full" }}
          chainStatus={{ smallScreen: "icon", largeScreen: "full" }}
        />
      </div>
    </header>
  );
}
```

`src/lib/components/organism/Footer.tsx` cukup menampilkan kredit dan tautan contract ke explorer.

---

## 🎨 App.tsx — Provider & Layout

```tsx
import "@rainbow-me/rainbowkit/styles.css";

import { RainbowKitProvider, lightTheme } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

import { config } from "$lib/config/wagmi";
import Navbar from "$lib/components/organism/Navbar";
import Footer from "$lib/components/organism/Footer";
import CelenganPage from "$lib/features/celengan/CelenganPage";

// Dibuat SEKALI di luar komponen.
const queryClient = new QueryClient();

// Tema RainbowKit disamakan dengan token desain kita.
const temaRainbow = lightTheme({
  accentColor: "#f2b42d",           // --color-primary
  accentColorForeground: "#ffffff", // --color-primary-foreground
  borderRadius: "large",
  fontStack: "system",
});

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={temaRainbow}>
          <div className="flex min-h-screen flex-col bg-background font-inter text-foreground">
            <Navbar />
            <main className="flex-1"><CelenganPage /></main>
            <Footer />
          </div>
          <Toaster position="top-center" />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
```

:::warning Jangan buat `QueryClient` di dalam komponen
Kesalahan yang sering disalin dari contoh:

```tsx
function App() {
  const queryClient = new QueryClient();   // ❌ dibuat ulang setiap render
```

Setiap render menghasilkan client baru, dan **seluruh cache react-query terbuang**. Gejalanya: daftar target berkedip, request ke RPC berjalan terus-menerus, loading state tidak pernah tenang.
:::

:::note Dua tempat yang boleh memakai hex
Perhatikan `temaRainbow` memakai `#f2b42d` langsung, padahal aturannya "jangan pernah hardcode hex".

Pengecualiannya jelas: `lightTheme()` dan objek gaya `react-hot-toast` adalah **API JavaScript milik library lain**, bukan class CSS — keduanya tidak bisa membaca token Tailwind. Yang penting, nilainya **disalin dari tabel token** dan diberi komentar nama token-nya, supaya saat token berubah kamu tahu file mana yang ikut disesuaikan.

Aturan gaya yang baik punya pengecualian yang **didokumentasikan**, bukan pengecualian yang diam-diam.
:::

---

## 🧠 CelenganPage — Logika Contract

`src/lib/features/celengan/CelenganPage.tsx` adalah tempat semua interaksi contract terjadi:

```tsx
import { useMemo } from "react";
import toast from "react-hot-toast";
import { formatEther, parseEther } from "viem";
import { useAccount, useReadContract, useReadContracts, useWriteContract } from "wagmi";

import Card from "$lib/components/atoms/Card";
import SectionHeading from "$lib/components/molecules/SectionHeading";
import { CELENGAN_TARGET_ABI, CELENGAN_CONTRACT, EXPLORER_URL } from "$lib/config/constants";
import { terjemahkanError } from "$lib/utils/errors";
import { tungguReceipt } from "$lib/utils/tunggu-receipt";
import type { Target, TargetOnChain } from "$lib/types";

import HeroSection from "./components/HeroSection";
import TargetForm from "./components/TargetForm";
import TargetList from "./components/TargetList";

const celenganContract = {
  address: CELENGAN_CONTRACT,
  abi: CELENGAN_TARGET_ABI,
} as const;

const gayaToast = {
  style: {
    background: "#131740",  // --color-tertiary
    color: "#ffffff",
    fontFamily: "Inter, sans-serif",
    borderRadius: "9999px",
    padding: "12px 20px",
  },
};

export default function CelenganPage() {
  const { address, isConnected } = useAccount();
  const { writeContractAsync } = useWriteContract();

  // TIDAK di-gate `enabled: isConnected` — pengunjung harus bisa melihat isi
  // aplikasi sebelum diminta menghubungkan wallet.
  const {
    data: total, refetch: refetchTotal, isLoading: memuatTotal, error: errorBaca,
  } = useReadContract({ ...celenganContract, functionName: "totalTarget" });

  const jumlahTarget = Number(total ?? 0n);

  // Satu batch untuk semua target, bukan 2N request berurutan.
  const kontrakBaca = useMemo(
    () =>
      Array.from({ length: jumlahTarget }).flatMap((_, i) => [
        { ...celenganContract, functionName: "ambilTarget", args: [BigInt(i)] },
        { ...celenganContract, functionName: "persentase", args: [BigInt(i)] },
      ]),
    [jumlahTarget],
  );

  const {
    data: detail, refetch: refetchDetail, isLoading: memuatDetail,
  } = useReadContracts({ contracts: kontrakBaca, query: { enabled: jumlahTarget > 0 } });

  const targets: Target[] = useMemo(() => {
    if (!detail) return [];
    const hasil: Target[] = [];
    for (let i = 0; i < jumlahTarget; i++) {
      const t = detail[i * 2]?.result as TargetOnChain | undefined;
      const p = detail[i * 2 + 1]?.result as bigint | undefined;
      if (!t) continue;
      hasil.push({
        id: i,
        pembuat: t.pembuat,
        nama: t.nama,
        jumlahTarget: t.jumlahTarget,
        terkumpul: t.terkumpul,
        sudahDicairkan: t.sudahDicairkan,
        persentase: Number(p ?? 0n),
      });
    }
    return hasil.reverse(); // terbaru di atas
  }, [detail, jumlahTarget]);

  const totalTerkumpul = useMemo(() => {
    const jumlah = targets.reduce((acc, t) => acc + t.terkumpul, 0n);
    const angka = Number(formatEther(jumlah));
    return angka.toFixed(angka < 1 ? 3 : 2);
  }, [targets]);

  async function muatUlang() {
    await refetchTotal();
    await refetchDetail();
  }

  /** Satu pembungkus untuk SEMUA aksi tulis: sign → tunggu → refresh. */
  async function kirim(
    label: string, functionName: string, args: readonly unknown[], value?: bigint,
  ) {
    if (!isConnected || !address) {
      toast.error("Hubungkan wallet dulu", gayaToast);
      return;
    }

    toast.dismiss();
    toast.loading("Konfirmasi di wallet-mu...", gayaToast);

    try {
      const hash = await writeContractAsync({
        ...celenganContract, functionName, args, value, account: address,
      });

      toast.dismiss();
      toast.loading("Menunggu konfirmasi jaringan...", gayaToast);

      const receipt = await tungguReceipt(hash);

      toast.dismiss();
      if (receipt.status === "reverted") {
        toast.error(`${label} gagal — transaksi di-revert.`, gayaToast);
        return;
      }

      toast.success(
        (t) => (
          <span>
            {label} berhasil.{" "}
            <a className="underline" href={`${EXPLORER_URL}/tx/${hash}`}
               target="_blank" rel="noreferrer" onClick={() => toast.dismiss(t.id)}>
              Lihat di explorer
            </a>
          </span>
        ),
        { ...gayaToast, duration: 8000 },
      );

      await muatUlang();
    } catch (e) {
      toast.dismiss();
      toast.error(terjemahkanError(e), gayaToast);
      console.error(e);
    }
  }

  async function handleBuatTarget(nama: string, jumlahINJ: string) {
    if (!nama.trim()) { toast.error("Nama target tidak boleh kosong", gayaToast); return; }
    if (!jumlahINJ || Number(jumlahINJ) <= 0) {
      toast.error("Jumlah target harus lebih dari nol", gayaToast); return;
    }
    await kirim("Buat target", "buatTarget", [nama.trim(), parseEther(jumlahINJ)]);
  }

  async function handleSetor(id: number, jumlahINJ: string) {
    if (!jumlahINJ || Number(jumlahINJ) <= 0) {
      toast.error("Jumlah setoran harus lebih dari nol", gayaToast); return;
    }
    await kirim("Setoran", "setor", [BigInt(id)], parseEther(jumlahINJ));
  }

  const handleTarikDana = (id: number) => kirim("Pencairan", "tarikDana", [BigInt(id)]);
  const handleTarikKontribusi = (id: number) =>
    kirim("Penarikan setoran", "tarikKontribusi", [BigInt(id)]);

  return (
    <>
      <HeroSection jumlahTarget={jumlahTarget} totalTerkumpul={totalTerkumpul} />

      <section className="bg-background py-16 md:py-20">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Daftar Target"
            subtitle="Semua data dibaca langsung dari contract di Injective testnet."
            className="mb-10"
          />

          {errorBaca && (
            <Card className="mb-8 border-primary/40 bg-primary/5 text-center">
              <p className="font-inter text-sm text-foreground">
                Gagal membaca data dari chain. Cek koneksi internet atau RPC-mu.
              </p>
            </Card>
          )}

          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,22rem)_1fr]">
            <div className="lg:sticky lg:top-24">
              {isConnected ? (
                <TargetForm onBuatTarget={handleBuatTarget} />
              ) : (
                <Card className="text-center">
                  <p className="font-montserrat text-base font-bold text-foreground">
                    Hubungkan wallet
                  </p>
                  <p className="mt-2 font-inter text-sm text-muted">
                    Diperlukan untuk membuat target atau menyetor. Daftar di
                    samping tetap bisa dibaca tanpa wallet.
                  </p>
                </Card>
              )}
            </div>

            <TargetList
              targets={targets}
              memuat={memuatTotal || (jumlahTarget > 0 && memuatDetail)}
              alamatSaya={address}
              onSetor={handleSetor}
              onTarikDana={handleTarikDana}
              onTarikKontribusi={handleTarikKontribusi}
            />
          </div>
        </div>
      </section>
    </>
  );
}
```

:::tip Membaca tidak butuh wallet
`useReadContract` di atas **tidak** memakai `query: { enabled: isConnected }`.

Artinya **pengunjung bisa melihat semua data tanpa menghubungkan wallet.** Orang bisa menilai aplikasimu dulu sebelum diminta menghubungkan wallet.

Banyak dApp memaksa koneksi wallet hanya untuk melihat halaman. Jangan lakukan itu. Aksi **tulis** memang butuh wallet; aksi **baca** tidak.
:::

:::note Satu pembungkus untuk semua aksi tulis
Function `kirim()` menangani keempat aksi tulis sekaligus. Alternatifnya menulis empat blok `try/catch` yang hampir identik — dan begitu ada empat salinan, tiga di antaranya pasti ketinggalan saat kamu memperbaiki penanganan error.

Perhatikan juga `muatUlang()` hanya dipanggil **setelah** transaksi sukses. Memanggilnya tanpa syarat setelah transaksi gagal hanya membuang request dan membuat UI terlihat seolah sesuatu terjadi padahal tidak.
:::

:::warning Batasan yang perlu kamu sadari
`useReadContracts` menggabungkan panggilan jadi satu batch, jauh lebih baik daripada loop `for` berisi `await` satu per satu. Tapi jumlahnya tetap **2 panggilan per target**.

Untuk 5–20 target, tidak masalah. Untuk 500 target, halaman akan berat.

Solusi produksi: baca **event** `TargetDibuat` dan `Disetor` untuk merekonstruksi state, atau tambahkan function `ambilBanyakTarget(uint256 mulai, uint256 batas)` di contract untuk paginasi.

Untuk camp ini sudah cukup — tapi **sebutkan keterbatasan ini saat demo.**
:::

---

## 🧩 Komponen Fitur

`TargetForm.tsx` memakai `Card` + `FormField` + `Button`, menyimpan state `nama`/`jumlah`, dan mengosongkan input setelah sukses.

`TargetList.tsx` menangani tiga keadaan: **memuat** (skeleton `animate-pulse`), **kosong**, dan **berisi** — lalu me-render `TargetCard` per item.

`TargetCard.tsx` adalah bagian paling menarik. Inti aturan tampilnya:

```tsx
const sayaPembuat = alamatSaya?.toLowerCase() === target.pembuat.toLowerCase();
const tercapai = target.terkumpul >= target.jumlahTarget;

// ...

{!target.sudahDicairkan && (
  <div className="flex flex-wrap gap-2">
    <Input type="number" step="0.001" min="0" placeholder="Jumlah INJ" … />
    <Button size="sm" onClick={…}>Setor</Button>

    {sayaPembuat && tercapai && (
      <Button size="sm" variant="secondary" onClick={…}>Cairkan Dana</Button>
    )}

    {!tercapai && (
      <Button size="sm" variant="ghost" className="border border-tertiary/20 text-foreground"
              onClick={…}>
        Tarik Setoranku
      </Button>
    )}
  </div>
)}
```

Dan angkanya selalu lewat formatter:

```tsx
<span className="font-semibold text-foreground">{formatINJ(target.terkumpul)}</span>{" "}
/ {formatINJ(target.jumlahTarget)} INJ
…
<span className="shrink-0 font-montserrat text-lg font-bold text-primary">
  {formatPersen(target.persentase)}%
</span>
```

:::tip Tombol yang muncul pada saat yang tepat
Perhatikan aturannya:

- **Cairkan Dana** hanya kalau `sayaPembuat && tercapai`
- **Tarik Setoranku** hanya kalau `!tercapai`
- Semua aksi hilang kalau `sudahDicairkan`

Ini mencerminkan aturan di contract. Menampilkan tombol yang pasti di-revert itu desain buruk: pengguna membayar gas untuk gagal, lalu menyalahkan aplikasimu.

Tapi **jangan pernah berhenti di validasi frontend.** Contract tetap mengecek ulang semuanya — siapa pun bisa memanggil contract langsung tanpa lewat UI-mu. Frontend menjaga pengalaman; **contract menjaga keamanan.**
:::

---

## ▶️ Jalankan

```bash
npm run dev
```

Buka `http://localhost:5173`.

**Yang seharusnya kamu lihat:** hero dengan statistik dari chain, lalu daftar target lengkap dengan progress bar — semuanya tampil **sebelum** kamu menekan Connect Wallet.

Sebelum menganggap selesai, jalankan juga:

```bash
npm run build
```

`npm run build` menjalankan `tsc -b` lebih dulu, jadi perintah ini sekaligus type-check. Error TypeScript yang tidak muncul di dev server akan ketahuan di sini.

---

## ✅ Checklist

- [ ] `npm run dev` jalan di `localhost:5173`
- [ ] **Tidak ada** peringatan `@import must precede all other statements` di terminal
- [ ] Font Montserrat & Inter benar-benar termuat (heading terlihat berbeda dari body)
- [ ] Daftar target tampil **tanpa** menghubungkan wallet
- [ ] Tombol Connect Wallet (RainbowKit) berfungsi, warnanya mengikuti `primary`
- [ ] Form "Buat Target" muncul setelah wallet terhubung
- [ ] Membuat target berhasil dan langsung muncul di daftar
- [ ] Setoran berhasil dan progress bar bergerak
- [ ] Toast "Konfirmasi di wallet" dan "Menunggu konfirmasi jaringan" tampil terpisah
- [ ] Tautan explorer muncul setelah berhasil
- [ ] Membatalkan transaksi menampilkan "Transaksi dibatalkan.", bukan pesan mentah viem
- [ ] Cairkan Dana hanya muncul untuk pembuat pada target yang sudah tercapai
- [ ] `npm run build` lolos tanpa error TypeScript
- [ ] Tidak ada hex hardcoded di `lib/components` dan `lib/features`

---

## 🎯 Rangkuman

:::tip Yang Harus Kamu Ingat
- **Tetapkan token desain dulu** lewat `@theme` — sesudah itu jangan pernah menulis hex di komponen
- Import font **sebelum** `@import 'tailwindcss'`, kalau tidak PostCSS membuangnya diam-diam
- `paths` tanpa `baseUrl` — `baseUrl` sudah deprecated di TypeScript 6
- **Membaca tidak butuh wallet** — jangan gate `useReadContract` dengan `isConnected`
- `ssr: false` untuk Vite; `QueryClient` dibuat **di luar** komponen
- ABI dari file JSON **wajib** di-cast `as Abi`
- `waitForTransactionReceipt` bawaan **tidak bisa dipakai** di Injective — pakai poller yang toleran terhadap `null`
- **Format data on-chain sebelum ditampilkan** — 1 wei dan 999999% akan muncul, dan akan merusak layout-mu
- **Terjemahkan custom error** lewat `e.walk(...)`, bukan `includes()`
- Tampilkan tombol hanya saat aksinya valid — tapi **contract tetap yang menegakkan aturan**
:::

---

**Lanjut:** [Unit 4 — Deploy & Demo](./deploy-dan-demo) 👉
