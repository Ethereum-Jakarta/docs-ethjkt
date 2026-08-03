---
sidebar_position: 3
title: 🖼️ Unit 3 — Frontend Integration
description: Membangun antarmuka React yang terhubung ke contract Celengan Target — koneksi wallet, membaca daftar target, dan mengirim transaksi setoran.
---

# 🖼️ Unit 3 — Frontend Integration

:::info Goal Unit Ini
Di akhir unit ini kamu akan punya:
- Aplikasi **Next.js** yang terhubung ke contract-mu
- **Koneksi wallet** yang berfungsi
- Tampilan **daftar target** yang dibaca dari chain
- **Form setoran** yang mengirim transaksi sungguhan
:::

:::note Prasyarat
- ✅ [Unit 2](./kontrak-dan-backend) — contract ter-deploy, alamat dan ABI tersedia
- ✅ [TS-SDK Unit 3](../TS-SDK/wallet-integration) — kamu paham pola koneksi wallet
:::

---

## 🏗️ Setup Project

```bash
npx create-next-app@latest celengan-frontend --typescript --app --no-tailwind
cd celengan-frontend
npm install ethers
```

:::tip Kenapa `ethers` dan bukan Injective SDK di sini?
Karena contract kita adalah **Solidity di Injective EVM**, `ethers.js` adalah alat paling langsung dan paling banyak contohnya.

Kalau kamu memilih jalur CosmWasm di Unit 2, pakai `@injectivelabs/sdk-ts` dengan `MsgExecuteContractCompat` seperti di [TS-SDK Unit 4](../TS-SDK/build-transaction) sebagai gantinya. Struktur komponennya tetap sama.
:::

---

## ⚙️ Konfigurasi

Buat `lib/config.ts`:

```typescript
export const INJECTIVE_TESTNET = {
  chainId: 1439,
  chainIdHex: "0x59f",
  name: "Injective EVM Testnet",
  rpcUrl: "https://k8s.testnet.json-rpc.injective.network/",
  explorer: "https://testnet.blockscout.injective.network",
  currency: { name: "INJ", symbol: "INJ", decimals: 18 },
};

export const CONTRACT_ADDRESS = "0x_ganti_dengan_alamat_contract_kamu";

export const CONTRACT_ABI = [
  "function buatTarget(string nama, uint256 jumlahTarget) external returns (uint256)",
  "function setor(uint256 id) external payable",
  "function tarikDana(uint256 id) external",
  "function tarikKontribusi(uint256 id) external",
  "function jumlahTarget() external view returns (uint256)",
  "function ambilTarget(uint256 id) external view returns (tuple(address pembuat, string nama, uint256 jumlahTarget, uint256 terkumpul, bool sudahDicairkan))",
  "function persentase(uint256 id) external view returns (uint256)",
  "event TargetDibuat(uint256 indexed id, address indexed pembuat, string nama, uint256 jumlahTarget)",
  "event Disetor(uint256 indexed id, address indexed penyetor, uint256 jumlah)",
];
```

:::note ABI dalam format "human-readable"
`ethers.js` menerima ABI sebagai daftar signature seperti di atas — jauh lebih ringkas daripada JSON penuh dari `artifacts/`.

Kalau kamu lebih suka, impor saja file JSON-nya dan pakai field `abi`-nya. Keduanya sama-sama bekerja.
:::

---

## 🔌 Hook Koneksi Wallet

Buat `hooks/useWallet.ts`:

```typescript
"use client";

import { useState, useEffect, useCallback } from "react";
import { BrowserProvider } from "ethers";
import { INJECTIVE_TESTNET } from "../lib/config";

export function useWallet() {
  const [alamat, setAlamat] = useState<string | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [sedangProses, setSedangProses] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hubungkan = useCallback(async () => {
    setError(null);

    if (typeof window === "undefined" || !(window as any).ethereum) {
      setError("MetaMask belum terpasang. Pasang ekstensinya lalu muat ulang halaman.");
      return;
    }

    setSedangProses(true);
    try {
      const ethereum = (window as any).ethereum;
      await ethereum.request({ method: "eth_requestAccounts" });
      await pastikanJaringan(ethereum);

      const p = new BrowserProvider(ethereum);
      const signer = await p.getSigner();

      setProvider(p);
      setAlamat(await signer.getAddress());
    } catch (e: any) {
      setError(
        e?.code === 4001
          ? "Koneksi dibatalkan."
          : e?.message ?? "Gagal menghubungkan wallet"
      );
    } finally {
      setSedangProses(false);
    }
  }, []);

  // Tangani pergantian akun
  useEffect(() => {
    if (typeof window === "undefined") return;
    const ethereum = (window as any).ethereum;
    if (!ethereum?.on) return;

    const onAccountsChanged = (akun: string[]) => {
      if (akun.length === 0) {
        setAlamat(null);
        setProvider(null);
      } else {
        setAlamat(akun[0]);
      }
    };

    ethereum.on("accountsChanged", onAccountsChanged);
    ethereum.on("chainChanged", () => window.location.reload());

    return () => {
      ethereum.removeListener?.("accountsChanged", onAccountsChanged);
    };
  }, []);

  return { alamat, provider, sedangProses, error, hubungkan };
}

async function pastikanJaringan(ethereum: any) {
  const saatIni = await ethereum.request({ method: "eth_chainId" });
  if (saatIni === INJECTIVE_TESTNET.chainIdHex) return;

  try {
    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: INJECTIVE_TESTNET.chainIdHex }],
    });
  } catch (e: any) {
    if (e.code === 4902) {
      await ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: INJECTIVE_TESTNET.chainIdHex,
            chainName: INJECTIVE_TESTNET.name,
            rpcUrls: [INJECTIVE_TESTNET.rpcUrl],
            nativeCurrency: INJECTIVE_TESTNET.currency,
            blockExplorerUrls: [INJECTIVE_TESTNET.explorer],
          },
        ],
      });
    } else {
      throw e;
    }
  }
}
```

---

## 📖 Hook Membaca Data Contract

Buat `hooks/useTargets.ts`:

```typescript
"use client";

import { useState, useEffect, useCallback } from "react";
import { Contract, JsonRpcProvider, formatEther } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI, INJECTIVE_TESTNET } from "../lib/config";

export interface TargetTampilan {
  id: number;
  pembuat: string;
  nama: string;
  jumlahTarget: string;
  terkumpul: string;
  persentase: number;
  sudahDicairkan: boolean;
}

export function useTargets() {
  const [targets, setTargets] = useState<TargetTampilan[]>([]);
  const [memuat, setMemuat] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const muat = useCallback(async () => {
    setMemuat(true);
    setError(null);

    try {
      // Baca pakai RPC publik — tidak butuh wallet
      const provider = new JsonRpcProvider(INJECTIVE_TESTNET.rpcUrl);
      const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

      const jumlah = Number(await contract.jumlahTarget());
      const hasil: TargetTampilan[] = [];

      for (let i = 0; i < jumlah; i++) {
        const t = await contract.ambilTarget(i);
        const p = Number(await contract.persentase(i));

        hasil.push({
          id: i,
          pembuat: t.pembuat,
          nama: t.nama,
          jumlahTarget: formatEther(t.jumlahTarget),
          terkumpul: formatEther(t.terkumpul),
          persentase: p,
          sudahDicairkan: t.sudahDicairkan,
        });
      }

      setTargets(hasil);
    } catch (e: any) {
      setError("Gagal memuat data. Coba muat ulang halaman.");
      console.error(e);
    } finally {
      setMemuat(false);
    }
  }, []);

  useEffect(() => {
    muat();
  }, [muat]);

  return { targets, memuat, error, muatUlang: muat };
}
```

:::tip Membaca tidak butuh wallet
Perhatikan `useTargets` memakai `JsonRpcProvider`, bukan wallet pengguna.

Artinya **pengunjung bisa melihat semua data tanpa menghubungkan wallet.** Ini pengalaman pengguna yang jauh lebih baik — orang bisa menilai aplikasimu dulu sebelum diminta menghubungkan wallet.

Banyak dApp memaksa koneksi wallet hanya untuk melihat halaman. Jangan lakukan itu.
:::

:::warning Loop query ini tidak akan skalabel
`useTargets` memanggil contract dua kali per target dalam sebuah loop. Untuk 5 target itu baik-baik saja; untuk 500 target akan sangat lambat.

Solusi produksi: pakai **multicall**, atau baca **event** `TargetDibuat` dan `Disetor` untuk merekonstruksi state.

Untuk camp ini pendekatan sederhana sudah cukup — tapi **sebutkan keterbatasan ini saat demo.** Menyadari batas skalabilitas kodemu adalah tanda engineer yang baik.
:::

---

## ✍️ Hook Menulis ke Contract

Buat `hooks/useSetor.ts`:

```typescript
"use client";

import { useState } from "react";
import { Contract, BrowserProvider, parseEther } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI, INJECTIVE_TESTNET } from "../lib/config";

type Status = "idle" | "menandatangani" | "menunggu" | "sukses" | "gagal";

export function useSetor(provider: BrowserProvider | null) {
  const [status, setStatus] = useState<Status>("idle");
  const [txHash, setTxHash] = useState<string | null>(null);
  const [pesan, setPesan] = useState<string | null>(null);

  async function setor(id: number, jumlahINJ: string) {
    if (!provider) {
      setPesan("Hubungkan wallet dulu");
      setStatus("gagal");
      return;
    }
    if (!jumlahINJ || Number(jumlahINJ) <= 0) {
      setPesan("Jumlah harus lebih dari nol");
      setStatus("gagal");
      return;
    }

    setPesan(null);
    setTxHash(null);
    setStatus("menandatangani");

    try {
      const signer = await provider.getSigner();
      const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const tx = await contract.setor(id, { value: parseEther(jumlahINJ) });
      setTxHash(tx.hash);
      setStatus("menunggu");

      await tx.wait();
      setStatus("sukses");
    } catch (e: any) {
      setPesan(terjemahkan(e));
      setStatus("gagal");
    }
  }

  const urlExplorer = txHash ? `${INJECTIVE_TESTNET.explorer}/tx/${txHash}` : null;

  return { setor, status, txHash, urlExplorer, pesan };
}

function terjemahkan(e: any): string {
  const raw = e?.reason ?? e?.shortMessage ?? e?.message ?? String(e);

  if (e?.code === 4001 || raw.includes("rejected")) return "Transaksi dibatalkan.";
  if (raw.includes("insufficient funds"))
    return "Saldo INJ tidak cukup. Ambil testnet INJ dari faucet.";
  if (raw.includes("SudahDicairkan")) return "Target ini sudah dicairkan.";
  if (raw.includes("JumlahNol")) return "Jumlah harus lebih dari nol.";
  if (raw.includes("TargetTidakAda")) return "Target tidak ditemukan.";

  return `Transaksi gagal: ${raw}`;
}
```

---

## 🎨 Komponen Halaman

Buat `app/page.tsx`:

```tsx
"use client";

import { useWallet } from "../hooks/useWallet";
import { useTargets } from "../hooks/useTargets";
import { useSetor } from "../hooks/useSetor";
import { useState } from "react";

export default function Home() {
  const { alamat, provider, sedangProses, error: errorWallet, hubungkan } = useWallet();
  const { targets, memuat, muatUlang } = useTargets();

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: 24 }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Celengan Target</h1>
        {alamat ? (
          <span>{alamat.slice(0, 6)}...{alamat.slice(-4)}</span>
        ) : (
          <button onClick={hubungkan} disabled={sedangProses}>
            {sedangProses ? "Menghubungkan..." : "Hubungkan Wallet"}
          </button>
        )}
      </header>

      {errorWallet && <p role="alert">{errorWallet}</p>}

      {memuat ? (
        <p>Memuat target...</p>
      ) : targets.length === 0 ? (
        <p>Belum ada target. Buat yang pertama!</p>
      ) : (
        targets.map((t) => (
          <KartuTarget key={t.id} target={t} provider={provider} onSukses={muatUlang} />
        ))
      )}
    </main>
  );
}

function KartuTarget({ target, provider, onSukses }: any) {
  const [jumlah, setJumlah] = useState("");
  const { setor, status, urlExplorer, pesan } = useSetor(provider);

  async function handleSetor() {
    await setor(target.id, jumlah);
    setJumlah("");
    onSukses();
  }

  return (
    <article style={{ border: "1px solid #ccc", borderRadius: 8, padding: 16, marginTop: 16 }}>
      <h2>{target.nama}</h2>
      <p>
        {target.terkumpul} / {target.jumlahTarget} INJ ({target.persentase}%)
      </p>

      <div style={{ background: "#eee", height: 8, borderRadius: 4 }}>
        <div
          style={{
            background: "#0082FA",
            height: 8,
            borderRadius: 4,
            width: `${Math.min(target.persentase, 100)}%`,
          }}
        />
      </div>

      {!target.sudahDicairkan && (
        <div style={{ marginTop: 12 }}>
          <input
            type="number"
            step="0.01"
            min="0"
            placeholder="Jumlah INJ"
            value={jumlah}
            onChange={(e) => setJumlah(e.target.value)}
            disabled={status === "menandatangani" || status === "menunggu"}
          />
          <button
            onClick={handleSetor}
            disabled={!provider || status === "menandatangani" || status === "menunggu"}
          >
            Setor
          </button>
        </div>
      )}

      {status === "menandatangani" && <p>Konfirmasi di wallet-mu...</p>}
      {status === "menunggu" && <p>Menunggu konfirmasi jaringan...</p>}
      {status === "sukses" && urlExplorer && (
        <p>
          Berhasil.{" "}
          <a href={urlExplorer} target="_blank" rel="noreferrer">
            Lihat di explorer
          </a>
        </p>
      )}
      {status === "gagal" && <p role="alert">{pesan}</p>}
    </article>
  );
}
```

Jalankan:

```bash
npm run dev
```

Buka `http://localhost:3000`.

---

## ✅ Checklist

- [ ] Aplikasi berjalan di localhost
- [ ] Daftar target tampil **tanpa** perlu menghubungkan wallet
- [ ] Tombol hubungkan wallet berfungsi
- [ ] Pindah jaringan otomatis berfungsi kalau wallet ada di jaringan lain
- [ ] Setoran berhasil dan progress bar bergerak
- [ ] Status "menandatangani" dan "menunggu" tampil terpisah
- [ ] Tautan explorer muncul setelah berhasil
- [ ] Membatalkan transaksi menampilkan pesan ramah, bukan crash

---

## 🎯 Rangkuman

:::tip Yang Harus Kamu Ingat
- **Membaca tidak butuh wallet** — pakai `JsonRpcProvider` supaya pengunjung bisa melihat dulu
- **Menulis butuh signer** dari wallet pengguna
- Tangani **pergantian akun** dan **pergantian jaringan**
- **Pindah/tambah jaringan otomatis** menghilangkan hambatan terbesar pengguna baru
- Bedakan status **"menandatangani"** dan **"menunggu jaringan"**
- **Terjemahkan nama custom error** contract jadi kalimat manusia
- Loop query tidak skalabel — **ketahui dan sebutkan** keterbatasan ini
:::

---

**Lanjut:** [Unit 4 — Deploy & Demo](./deploy-dan-demo) 👉
