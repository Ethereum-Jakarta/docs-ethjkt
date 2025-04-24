---
sidebar_position: 7
title: 7. Integrasi Frontend dengan Token Factory
description: Membuat frontend React dengan Vite untuk berinteraksi dengan Token Factory smart contract
keywords: [frontend, react, vite, token factory, web3, wagmi, rainbowkit, tailwindcss, erc20, integration]
---

# 7. Integrasi Frontend dengan Token Factory

Pada bagian ini, kita akan membuat frontend sederhana menggunakan React, Vite, dan TailwindCSS untuk berinteraksi dengan smart contract Token Factory yang telah kita deploy. Frontend ini akan memungkinkan pengguna untuk membuat token baru dan melihat token yang telah dibuat.

![Tampilan Frontend Monad Token Factory](/img/monad-fe.png)

## 1. Setup Proyek Frontend

Mari mulai dengan membuat proyek React + Vite baru dengan TypeScript.

### 1.1. Membuat Proyek Vite

```bash
npm create vite@latest erc20-factory-ui -- --template react-ts
cd erc20-factory-ui
```

### 1.2. Menginstal Dependensi

Install paket yang diperlukan untuk mengintegrasikan frontend dengan blockchain:

```bash
npm install @rainbow-me/rainbowkit wagmi viem @tanstack/react-query react-hot-toast
npm install -D tailwindcss @tailwindcss/vite
```

Penjelasan dependensi:
- **@rainbow-me/rainbowkit**: Komponen UI untuk koneksi wallet
- **wagmi**: Library untuk berinteraksi dengan kontrak Ethereum
- **viem**: Library Ethereum untuk TypeScript
- **@tanstack/react-query**: Untuk manajemen state dan caching data
- **react-hot-toast**: Untuk menampilkan notifikasi
- **tailwindcss**: Framework CSS utility-first

## 2. Konfigurasi TailwindCSS

### 2.1. Konfigurasi Vite

Update file `vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

### 2.2. Konfigurasi CSS

Buat file `src/index.css` dengan konten:

```css
@import "tailwindcss";

body {
  font-family: "Inter", sans-serif;
}
```

## 3. Struktur Proyek

Berikut adalah struktur proyek yang akan kita buat:

```
src/
├── components/
│   ├── Container.tsx    # Komponen utama yang berisi logika interaksi dengan kontrak
│   ├── Header.tsx       # Header dengan tombol connect wallet
│   ├── TokenForm.tsx    # Form untuk membuat token baru
│   └── TokenList.tsx    # Tabel untuk menampilkan token yang dibuat
├── constants/
│   ├── ERC20_FACTORY_ABI.json  # ABI untuk kontrak factory
│   ├── ERC20_TOKEN_ABI.json    # ABI untuk kontrak token ERC20
│   └── index.tsx               # Export konstanta
├── App.tsx              # Komponen root dengan provider
├── main.tsx             # Entry point
└── index.css            # Stylesheet utama
```

## 4. Menyiapkan Konstanta dan ABI

Pertama, kita perlu menyiapkan ABI (Application Binary Interface) untuk kontrak kita dan alamat kontrak.

### 4.1. ABI Factory Contract

Buat folder `src/constants` dan file `ERC20_FACTORY_ABI.json` dengan ABI dari kontrak TokenFactory:

```json
[
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "tokenAddress",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "initialSupply",
        "type": "uint256"
      }
    ],
    "name": "TokenCreated",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "initialOwner",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "initialSupply",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "symbol",
        "type": "string"
      }
    ],
    "name": "createToken",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllTokens",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "",
        "type": "address[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTokenCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]
```

### 4.2. ABI Token ERC20

Buat file `ERC20_TOKEN_ABI.json` dengan ABI dari kontrak Token ERC20.

### 4.3. Export Konstanta

Buat file `src/constants/index.tsx`:

```typescript
import ERC20_JSON from "./ERC20_FACTORY_ABI.json"
import TOKEN_JSON from "./ERC20_TOKEN_ABI.json"

export const ERC20_FACTORY_ABI_JSON = ERC20_JSON;
export const ERC20_TOKEN_ABI_JSON = TOKEN_JSON;
export const ERC20_FACTORY_CONTRACT = "0xYOUR_DEPLOYED_FACTORY_ADDRESS";
```

> ⚠️ **Penting**: Ganti `0xYOUR_DEPLOYED_FACTORY_ADDRESS` dengan alamat kontrak TokenFactory yang sudah Anda deploy ke Monad Testnet.

## 5. Setup RainbowKit dan Wagmi

### 5.1. Konfigurasi App.tsx

Perbarui `src/App.tsx` untuk mengatur provider dan konfigurasi:

```typescript
import Header from './components/Header';
import '@rainbow-me/rainbowkit/styles.css';

import {
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
  Chain
} from 'wagmi/chains';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import Container from "./components/Container";

// Konfigurasi Chain Monad Testnet
const monadTestnet: Chain = {
  id: 10143,
  name: 'Monad Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'MON',
    symbol: 'MON',
  },
  rpcUrls: {
    default: {
      http: ['https://testnet-rpc.monad.xyz/'],
    },
    public: {
      http: ['https://testnet-rpc.monad.xyz/'],
    },
  },
  blockExplorers: {
    default: {
      name: 'MonadScan',
      url: 'https://testnet.monadexplorer.com',
    },
  },
  testnet: true,
};

// eslint-disable-next-line react-refresh/only-export-components
export const config = getDefaultConfig({
  appName: 'ERC20 Factory',
  projectId: 'YOUR_WALLETCONNECT_PROJECT_ID', // Dapatkan dari https://cloud.walletconnect.com
  chains: [monadTestnet],
  ssr: true,
});

function App() {
  const queryClient = new QueryClient();
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <div className="h-screen bg-gray-900 text-white">
            <Header />
            <Container />
          </div>
          <Toaster position="top-center" />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default App
```

> ⚠️ **Penting**: Daftar di [WalletConnect Cloud](https://cloud.walletconnect.com) untuk mendapatkan projectId.

## 6. Membuat Komponen Header

Buat file `src/components/Header.tsx` untuk menampilkan header dan tombol connect wallet:

```typescript
import { ConnectButton } from "@rainbow-me/rainbowkit"

const Header = () => {
  return (
    <header className="bg-gray-800 py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="text-xl font-bold">Monad Token Factory</div>
        <ConnectButton />
      </div>
    </header>
  )
}

export default Header
```

## 7. Membuat Form Pembuatan Token

Buat file `src/components/TokenForm.tsx`:

```typescript
import { useState } from "react"

const TokenForm = ({handleAddToken}: {
  handleAddToken: (e: React.FormEvent, tokenName: string, tokenSymbol: string, tokenSupply: string) => void
}) => {
  const [tokenName, setTokenName] = useState("")
  const [tokenSymbol, setTokenSymbol] = useState("")
  const [tokenSupply, setTokenSupply] = useState("")

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
      <h2 className="text-2xl font-bold mb-4">Create New Token</h2>
      <form onSubmit={(e) => {
        handleAddToken(e, tokenName, tokenSymbol, tokenSupply)
        setTokenName("");
        setTokenSupply("");
        setTokenSymbol("");
      }}>
        <div className="mb-4">
          <label htmlFor="tokenName" className="block text-sm font-medium mb-1">
            Token Name
          </label>
          <input
            type="text"
            id="tokenName"
            value={tokenName}
            onChange={(e) => setTokenName(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="tokenSymbol" className="block text-sm font-medium mb-1">
            Token Symbol
          </label>
          <input
            type="text"
            id="tokenSymbol"
            value={tokenSymbol}
            onChange={(e) => setTokenSymbol(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="tokenSupply" className="block text-sm font-medium mb-1">
            Initial Supply
          </label>
          <input
            type="number"
            id="tokenSupply"
            value={tokenSupply}
            onChange={(e) => setTokenSupply(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button type="submit" className="w-full cursor-pointer bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
          Create Token
        </button>
      </form>
    </div>
  )
}

export default TokenForm
```

## 8. Membuat Komponen untuk Menampilkan Token

Buat file `src/components/TokenList.tsx`:

```typescript
type Token = {
    name: string;
    symbol: string;
    supply: number;
    address: `0x${string}`;
  }
  
  const TokenList = ({tokens} : {tokens: Token[]}) => {
    return (
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Tokens History</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left bg-gray-700">
                <th className="p-2">Name</th>
                <th className="p-2">Symbol</th>
                <th className="p-2">Supply</th>
                <th className="p-2">Address</th>
              </tr>
            </thead>
            <tbody>
              {tokens.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-2 text-center">No tokens created yet</td>
                </tr>
              ) : (
                tokens.map((token, index) => (
                  <tr key={index} className="border-b border-gray-700">
                    <td className="p-2">{token.name}</td>
                    <td className="p-2">{token.symbol}</td>
                    <td className="p-2">{token.supply.toFixed(0)}</td>
                    <td className="p-2 text-xs md:text-sm">{token.address}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  export default TokenList
```

## 9. Implementasi Komponen Container

Buat file `src/components/Container.tsx` yang akan berisi logika interaksi dengan kontrak:

```typescript
import { useMemo } from "react"
import toast from "react-hot-toast"
import { useAccount, useReadContract, useReadContracts, useWriteContract } from "wagmi";
import { ERC20_FACTORY_ABI_JSON, ERC20_FACTORY_CONTRACT, ERC20_TOKEN_ABI_JSON } from "../constants";
import { waitForTransactionReceipt } from "@wagmi/core";
import { config } from "../App";
import TokenForm from "./TokenForm";
import TokenList from "./TokenList";
import { Address } from "viem";

export type Token = {
  name: string;
  symbol: string;
  supply: number;
  address: `0x${string}`;
}

const erc20FactoryContract = {
  address: ERC20_FACTORY_CONTRACT as `0x${string}`,
  abi: ERC20_FACTORY_ABI_JSON,
};

const Container = () => {
  const { address, isConnected } = useAccount();
  const { writeContractAsync } = useWriteContract();
  
  // Membaca data token dari kontrak
  const { data: tokenAddresses, refetch } = useReadContract({
    ...erc20FactoryContract,
    functionName: "getAllTokens",
    account: address,
    query: {
      enabled: isConnected,
    },
  }) as { data: Address[] | undefined, refetch: () => void };

  // Menyiapkan konfigurasi untuk batch reading token details
  const tokenDetailsConfig = useMemo(() => {
    if (!tokenAddresses) return [];

    return tokenAddresses.flatMap((tokenAddress) => [
      {
        abi: ERC20_TOKEN_ABI_JSON,
        address: tokenAddress,
        functionName: 'name',
      },
      {
        abi: ERC20_TOKEN_ABI_JSON,
        address: tokenAddress,
        functionName: 'symbol',
      },
      {
        abi: ERC20_TOKEN_ABI_JSON,
        address: tokenAddress,
        functionName: 'totalSupply',
      },
    ]);
  }, [tokenAddresses]);

  // Batch read semua detail token
  const { data: tokenDetails } = useReadContracts({
    contracts: tokenDetailsConfig,
    query: {
      enabled: Boolean(tokenAddresses?.length),
    },
  });

  // Memproses data detail token
  const tokens: Token[] = useMemo(() => {
    if (!tokenAddresses || !tokenDetails) return [];

    const result: Token[] = [];
    for (let i = 0; i < tokenAddresses.length; i++) {
      result.push({
        address: tokenAddresses[i],
        name: String(tokenDetails[i * 3].result),
        symbol: String(tokenDetails[i * 3 + 1].result),
        supply: Number(tokenDetails[i * 3 + 2].result) / (10 ** 18),
      });
    }

    return result;
  }, [tokenAddresses, tokenDetails]);

  // Fungsi untuk membuat token baru
  async function handleAddToken(e: React.FormEvent, tokenName: string, tokenSymbol: string, tokenSupply: string) {
    e.preventDefault()
    
    // Validasi input
    if (tokenName.length === 0 || tokenSymbol.length === 0 || tokenSupply.length === 0) {
      toast.dismiss();
      toast.error("Please fill the form", {
        style: {
          background: "#2B2F36",
          color: "#fff",
        },
      });
      return
    }

    toast.loading("Submitting Form...", {
      style: {
        background: "#2B2F36",
        color: "#fff",
      },
    });
    
    try {
      // Menulis ke kontrak
      const result = await writeContractAsync({
        ...erc20FactoryContract,
        functionName: "createToken",
        args: [address, Number(tokenSupply), tokenName, tokenSymbol],
        account: address as `0x${string}`,
      });

      toast.dismiss();
      toast.loading("Creating your token...", {
        style: {
          background: "#2B2F36",
          color: "#fff",
        },
      });

      // Menunggu transaksi dikonfirmasi
      await waitForTransactionReceipt(config, {
        hash: result as `0x${string}`,
      });
      
      toast.dismiss();
      toast.success("Token Successfully Created!", {
        style: {
          background: "#2B2F36",
          color: "#fff",
        },
      });
      
      // Refresh data
      refetch();
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to create token", {
        style: {
          background: "#2B2F36",
          color: "#fff",
        },
      });
      console.error(error);
    }
  }

  return (
    <main className="container mx-auto px-4 md:px-8 lg:px-20 xl:px-60 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">ERC20 Token Factory</h1>
      {isConnected ? (
        <>
          <TokenForm handleAddToken={handleAddToken} />
          <TokenList tokens={tokens} />
        </>
      ) : (
        <div className="text-center py-10">
          <p className="text-xl mb-4">Please connect your wallet to continue</p>
        </div>
      )}
    </main>
  )
}

export default Container
```

## 10. Menjalankan Aplikasi

Jalankan aplikasi dengan perintah:

```bash
npm run dev
```

Akses aplikasi di `http://localhost:5173/`.

## 11. Penjelasan Kode Container

Mari kita pahami bagian-bagian penting dari kode `Container.tsx`:

### 11.1. Hooks Wagmi

```typescript
const { address, isConnected } = useAccount();
const { writeContractAsync } = useWriteContract();
const { data: tokenAddresses, refetch } = useReadContract({...});
const { data: tokenDetails } = useReadContracts({...});
```

- **useAccount**: Mendapatkan informasi alamat wallet yang terhubung
- **useWriteContract**: Untuk menulis ke smart contract (membuat token)
- **useReadContract**: Untuk membaca data dari contract (daftar token)
- **useReadContracts**: Untuk batch reading data dari kontrak

### 11.2. Batch Reading Token Details

```typescript
const tokenDetailsConfig = useMemo(() => {
  if (!tokenAddresses) return [];

  return tokenAddresses.flatMap((tokenAddress) => [
    // ... konfigurasi untuk nama, simbol, dan total supply
  ]);
}, [tokenAddresses]);
```

- **useMemo**: Membuat cache konfigurasi untuk batch reading
- **flatMap**: Untuk setiap alamat token, buat 3 konfigurasi (nama, simbol, supply)

### 11.3. Memproses Data Token

```typescript
const tokens: Token[] = useMemo(() => {
  if (!tokenAddresses || !tokenDetails) return [];

  const result: Token[] = [];
  for (let i = 0; i < tokenAddresses.length; i++) {
    result.push({
      address: tokenAddresses[i],
      name: String(tokenDetails[i * 3].result),
      symbol: String(tokenDetails[i * 3 + 1].result),
      supply: Number(tokenDetails[i * 3 + 2].result) / (10 ** 18),
    });
  }

  return result;
}, [tokenAddresses, tokenDetails]);
```

- **Mengorganisasi Data**: Mengkonversi hasil batch reading menjadi array token
- **Konversi Unit**: Mengkonversi supply dari wei (10^18) ke unit token yang dapat dibaca

### 11.4. Membuat Token Baru

```typescript
async function handleAddToken(e: React.FormEvent, tokenName: string, tokenSymbol: string, tokenSupply: string) {
  // ... validasi dan toast loading
  
  try {
    // Menulis ke kontrak
    const result = await writeContractAsync({
      ...erc20FactoryContract,
      functionName: "createToken",
      args: [address, Number(tokenSupply), tokenName, tokenSymbol],
      account: address as `0x${string}`,
    });

    // Menunggu transaksi dikonfirmasi
    await waitForTransactionReceipt(config, {
      hash: result as `0x${string}`,
    });
    
    // ... tampilkan sukses dan refresh data
  } catch (error) {
    // ... handle error
  }
}
```

- **writeContractAsync**: Untuk menulis ke kontrak (membuat token)
- **waitForTransactionReceipt**: Menunggu transaksi dikonfirmasi oleh blockchain
- **refetch**: Memuat ulang data token setelah transaksi berhasil

## 12. Optimasi dan Tips Frontend

### 12.1. Loading States

Tambahkan indikator loading untuk meningkatkan user experience:

```tsx
// Tambahkan di Container.tsx
const { data: tokenAddresses, refetch, isLoading: isLoadingTokens } = useReadContract({
  // ... konfigurasi yang sudah ada
});

// Tampilkan loading state di render
{isLoadingTokens ? (
  <div className="text-center py-4">Loading tokens...</div>
) : (
  <TokenList tokens={tokens} />
)}
```

### 12.2. Error Handling

Tangani error dengan lebih baik:

```tsx
// Tambahkan di Container.tsx
const { data: tokenAddresses, refetch, isLoading: isLoadingTokens, error } = useReadContract({
  // ... konfigurasi yang sudah ada
});

// Tampilkan pesan error jika ada
{error && (
  <div className="text-red-500 mb-4">Error loading tokens: {error.message}</div>
)}
```

### 12.3. Responsif Design

Pastikan UI responsif untuk berbagai ukuran layar:

```tsx
// Contoh di Container.tsx
<main className="container mx-auto px-4 md:px-8 lg:px-20 xl:px-60 py-8">
  {/* ... konten yang ada */}
</main>
```

## 13. Build dan Deploy

### 13.1. Build untuk Produksi

```bash
npm run build
```

Ini akan menghasilkan folder `dist/` dengan file static yang dapat di-deploy.

## Kesimpulan

Selamat! Anda telah berhasil membuat frontend interaktif untuk Token Factory menggunakan React, Vite, dan TailwindCSS. Aplikasi ini memungkinkan pengguna untuk:

1. Terhubung dengan wallet mereka menggunakan RainbowKit
2. Berinteraksi dengan kontrak TokenFactory yang di-deploy di Monad Testnet
3. Membuat token ERC20 baru dengan nama, simbol, dan jumlah awal yang kustom
4. Melihat daftar token yang telah dibuat

Frontend ini memberikan antarmuka yang user-friendly untuk smart contract TokenFactory, membuatnya lebih mudah digunakan oleh pengguna akhir yang mungkin tidak terbiasa dengan berinteraksi langsung dengan blockchain.

<!-- ![Preview Token Factory UI](/img/token-factory-ui-preview.png) -->

## Langkah Selanjutnya

Untuk pengembangan lebih lanjut, Anda dapat:

1. **Tambahkan Fitur Transfer**: Memungkinkan pengguna mentransfer token yang mereka miliki
2. **Implementasikan Burning UI**: Tambahkan UI untuk membakar token
3. **Tambahkan Detail Token**: Halaman terpisah untuk melihat detail lengkap token
4. **Tambahkan Fitur Pencarian**: Untuk mencari token berdasarkan nama atau alamat
5. **Integrasi dengan Dex**: Memungkinkan pengguna menukar token mereka