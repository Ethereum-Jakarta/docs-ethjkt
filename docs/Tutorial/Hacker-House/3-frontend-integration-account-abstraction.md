---
id: sesi-3
title: "Sesi 3: Frontend Integration + Account Abstraction (AA)"
sidebar_label: "Sesi 3: Frontend Integration + Account Abstraction (AA)"
description: "Integrasi frontend Web3 modern dan implementasi Account Abstraction (ERC-4337)"
---

# Sesi 3: Frontend Integration + Account Abstraction (AA)

Selamat datang di sesi ketiga Bootcamp **Web3 Hacker House**! Pada sesi ini, kita akan membahas integrasi frontend modern untuk aplikasi Web3 dan mempelajari konsep Account Abstraction (AA) melalui standar ERC-4337. Di akhir sesi, kita akan melakukan hands-on dengan mengimplementasikan bundler dan mensimulasikan sponsored transaction.

---

## Bagian 1: Frontend Integration dengan Library Modern

Ekosistem frontend Web3 telah berkembang pesat dalam beberapa tahun terakhir. Kita akan fokus pada library dan tools paling modern yang memudahkan pengembangan dApp.

### 1.1 Evolusi Frontend Web3

Sebelum memulai, mari kita lihat evolusi frontend Web3:

**Generasi 1: Web3.js & Direct Provider**
- Interaksi langsung dengan provider Web3
- Manajemen state manual
- Pengalaman pengguna terbatas

**Generasi 2: Ethers.js & Web3-React**
- Library yang lebih abstrak dan friendly
- Hooks untuk React
- Dukungan provider yang lebih baik

**Generasi 3: Viem, Wagmi & Web3Modal v3**
- Pemisahan concern yang lebih baik
- TypeScript first
- Performa dan DX yang lebih baik
- Dukungan multi-chain yang lebih baik

### 1.2 Core Library: Viem

[Viem](https://viem.sh/) adalah library transport dan utilitas untuk Ethereum yang menggantikan ethers.js dan web3.js dengan pendekatan yang lebih modern.

**Keunggulan Viem:**
- TypeScript first dengan tipe yang lengkap
- Modular dan tree-shakable
- Performa tinggi
- API yang konsisten
- Dukungan untuk semua standard JSON-RPC

**Instalasi:**

```bash
npm install viem
```

**Contoh Dasar Viem:**

```typescript
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

// Buat client public
const client = createPublicClient({
  chain: mainnet,
  transport: http()
})

// Dapatkan block terbaru
const blockNumber = await client.getBlockNumber()
console.log(blockNumber) // 17868933n

// Dapatkan balance
const balance = await client.getBalance({
  address: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
})
console.log(balance) // 10000000000000000000000n (wei)
```

**Berinteraksi dengan Kontrak:**

```typescript
import { createPublicClient, http, parseAbi } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http()
})

// ABI dari kontrak
const abi = parseAbi([
  'function balanceOf(address) view returns (uint256)',
  'function transfer(address to, uint256 value) returns (bool)',
])

// Baca data dari kontrak (read)
const balance = await client.readContract({
  address: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e', // token address
  abi,
  functionName: 'balanceOf',
  args: ['0xA0Cf798816D4b9b9866b5330EEa46a18382f251e']
})

// Untuk menulis ke kontrak (write), Anda memerlukan wallet client
import { createWalletClient, custom } from 'viem'

// Gunakan provider dari browser (MetaMask, dll)
const walletClient = createWalletClient({
  chain: mainnet,
  transport: custom(window.ethereum)
})

// Request akses ke akun
const [address] = await walletClient.requestAddresses()

// Kirim transaksi untuk memanggil fungsi kontrak
const hash = await walletClient.writeContract({
  address: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
  abi,
  functionName: 'transfer',
  args: ['0xRecipientAddress', 1000000000000000000n] // 1 token
})
```

### 1.3 React Hooks: Wagmi

[Wagmi](https://wagmi.sh/) adalah kumpulan React Hooks untuk Ethereum yang memudahkan integrasi dengan Viem. Wagmi berfungsi sebagai abstraksi yang membuat Anda lebih produktif saat membangun dApp.

**Keunggulan Wagmi:**
- React Hooks yang deklaratif
- Caching dan batching
- Manajemen state otomatis
- Dukungan untuk banyak wallet
- Typescript first

**Instalasi:**

```bash
npm install wagmi viem
```

**Setup Dasar Wagmi:**

```tsx
// config.ts
import { createConfig, http } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'

export const config = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
})
```

```tsx
// main.tsx
import { WagmiProvider } from 'wagmi'
import { config } from './config'

function App() {
  return (
    <WagmiProvider config={config}>
      <YourApp />
    </WagmiProvider>
  )
}
```

**Hooks untuk Membaca Data:**

```tsx
import { useReadContract } from 'wagmi'
import { erc20Abi } from 'viem'

function TokenBalance({ address }) {
  const { data, isError, isLoading } = useReadContract({
    address: '0xTokenAddress',
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [address],
  })

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error fetching balance</div>
  
  return <div>Balance: {data?.toString() || '0'}</div>
}
```

**Hooks untuk Menulis Data:**

```tsx
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { erc20Abi } from 'viem'

function TransferButton({ to, amount }) {
  const { data: hash, isPending, writeContract } = useWriteContract()
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ 
      hash, 
    })

  return (
    <div>
      <button
        disabled={isPending}
        onClick={() =>
          writeContract({
            address: '0xTokenAddress',
            abi: erc20Abi,
            functionName: 'transfer',
            args: [to, amount],
          })
        }
      >
        {isPending ? 'Confirming...' : 'Transfer'}
      </button>
      
      {isConfirming && <div>Waiting for confirmation...</div>}
      {isConfirmed && <div>Transfer confirmed!</div>}
    </div>
  )
}
```

**Account Connection Hooks:**

```tsx
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { injected } from 'wagmi/connectors'

function Profile() {
  const { address, isConnected } = useAccount()
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()

  if (isConnected)
    return (
      <div>
        Connected to {address}
        <button onClick={() => disconnect()}>Disconnect</button>
      </div>
    )
    
  return (
    <button onClick={() => connect({ connector: injected() })}>
      Connect Wallet
    </button>
  )
}
```

### 1.4 Web3Modal v3

[Web3Modal](https://web3modal.com/) adalah library yang menyediakan UI untuk menghubungkan berbagai wallet, termasuk mobile wallets melalui WalletConnect.

**Keunggulan Web3Modal v3:**
- UI/UX yang lebih baik
- QR code scanning for mobile wallets
- Multi-chain support
- Mendukung WalletConnect v2
- Dapat dikustomisasi sesuai branding Anda

**Instalasi:**

```bash
npm install @web3modal/wagmi @web3modal/ethereum viem wagmi
```

**Setup Web3Modal dengan Wagmi:**

```tsx
// config.ts
import { defaultWagmiConfig } from '@web3modal/wagmi'
import { mainnet, sepolia } from 'viem/chains'

export const projectId = 'YOUR_WALLETCONNECT_PROJECT_ID'

export const config = defaultWagmiConfig({
  chains: [mainnet, sepolia],
  projectId,
  metadata: {
    name: 'Your dApp',
    description: 'Your dApp description',
    url: 'https://yourdapp.com',
    icons: ['https://yourdapp.com/icon.png']
  }
})
```

```tsx
// main.tsx
import { WagmiProvider, createConfig } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { config, projectId } from './config'
import { Web3Modal } from '@web3modal/wagmi/react'

const queryClient = new QueryClient()

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <Web3Modal projectId={projectId} />
        <YourApp />
      </QueryClientProvider>
    </WagmiProvider>
  )
}
```

**Menggunakan Web3Modal:**

```tsx
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { useAccount } from 'wagmi'

function ConnectButton() {
  const { open } = useWeb3Modal()
  const { isConnected } = useAccount()

  return (
    <button onClick={() => open()}>
      {isConnected ? 'Change Wallet' : 'Connect Wallet'}
    </button>
  )
}
```

### 1.5 WalletConnect

WalletConnect adalah protokol untuk menghubungkan dApps dengan mobile wallets. Web3Modal menggunakan WalletConnect di belakang layar, tetapi Anda juga bisa menggunakannya langsung.

**WalletConnect v2 vs v1:**
- Multi-chain support
- Peningkatan performa dan keandalan
- Perbaikan UX untuk menghubungkan dApp dengan wallet
- API yang lebih konsisten

**WalletConnect dengan Web3Modal:**
Web3Modal sudah mengimplementasikan WalletConnect, jadi Anda tidak perlu mengonfigurasinya secara manual. Cukup gunakan project ID WalletConnect Anda.

### 1.6 Privy & Dynamic Auth

Selain Web3Modal, ada alternatif seperti Privy dan Dynamic yang menawarkan pengalaman otentikasi yang lebih seamless dengan kombinasi Web2 dan Web3.

#### Privy

[Privy](https://www.privy.io/) mengkombinasikan otentikasi tradisional (email, sosial) dengan wallet crypto.

**Instalasi:**

```bash
npm install @privy-io/react-auth
```

**Setup Privy:**

```tsx
import { PrivyProvider } from '@privy-io/react-auth'

function App() {
  return (
    <PrivyProvider
      appId="YOUR_PRIVY_APP_ID"
      config={{
        loginMethods: ['email', 'wallet', 'google'],
        appearance: {
          theme: 'light',
          accentColor: '#676FFF',
        },
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
      }}
    >
      <YourApp />
    </PrivyProvider>
  )
}
```

**Menggunakan Privy:**

```tsx
import { usePrivy } from '@privy-io/react-auth'

function AuthButton() {
  const { login, logout, authenticated, user } = usePrivy()

  if (authenticated) {
    return (
      <div>
        <p>Welcome, {user.email || user.wallet.address}!</p>
        <button onClick={logout}>Log Out</button>
      </div>
    )
  }

  return <button onClick={login}>Login</button>
}
```

#### Dynamic

[Dynamic](https://www.dynamic.xyz/) fokus pada otentikasi yang mencakup Web2 dan Web3 dengan fitur enterprise seperti KYC.

**Instalasi:**

```bash
npm install @dynamic-labs/sdk-react-core @dynamic-labs/wagmi-connector
```

**Setup Dynamic:**

```tsx
import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core'
import { DynamicWagmiConnector } from '@dynamic-labs/wagmi-connector'

function App() {
  return (
    <DynamicContextProvider
      settings={{
        environmentId: 'YOUR_DYNAMIC_ENVIRONMENT_ID',
      }}
    >
      <DynamicWagmiConnector>
        <YourApp />
      </DynamicWagmiConnector>
    </DynamicContextProvider>
  )
}
```

**Menggunakan Dynamic:**

```tsx
import { useDynamicContext } from '@dynamic-labs/sdk-react-core'

function AuthButton() {
  const { isAuthenticated, user, handleLogOut, showAuthFlow } = useDynamicContext()

  if (isAuthenticated) {
    return (
      <div>
        <p>Welcome, {user.primaryWallet.address}!</p>
        <button onClick={handleLogOut}>Log Out</button>
      </div>
    )
  }

  return <button onClick={showAuthFlow}>Login</button>
}
```

### 1.7 Server Components & Next.js

React Server Components dan Next.js App Router memungkinkan pendekatan baru untuk aplikasi Web3.

**Viem dengan Server Components:**

```tsx
// app/page.tsx
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

export default async function Page() {
  const client = createPublicClient({
    chain: mainnet,
    transport: http()
  })
  
  const blockNumber = await client.getBlockNumber()
  
  return <div>Current block: {blockNumber.toString()}</div>
}
```

**Wagmi dengan Next.js:**

Untuk integrasi Wagmi dengan Next.js App Router, gunakan paket khusus:

```bash
npm install @wagmi/core wagmi viem next-query-params
```

```tsx
// app/providers.tsx
'use client'

import { WagmiProvider } from 'wagmi'
import { config } from './config'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

export function Providers({ children }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
```

```tsx
// app/layout.tsx
import { Providers } from './providers'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
```

## Bagian 2: Account Abstraction (AA) dengan ERC-4337

Account Abstraction adalah salah satu inovasi terpenting dalam ekosistem Ethereum yang memungkinkan pengalaman pengguna yang lebih baik dan fungsionalitas wallet yang canggih.

### 2.1 Konsep Dasar Account Abstraction

#### Apa itu Account Abstraction?

Account Abstraction (AA) merujuk pada kemampuan untuk mendefinisikan logika kustom untuk bagaimana transaksi divalidasi dan dieksekusi, alih-alih mengikuti model EOA (Externally Owned Account) standar yang hanya menggunakan signature ECDSA.

**Masalah dengan Model EOA Tradisional:**
- Memerlukan ETH untuk gas (tidak ada abstraksi biaya gas)
- Tidak ada recovery mechanism
- Tidak ada batasan transaksi (mis. batas pengeluaran)
- Tidak ada batching transaksi
- UX yang buruk untuk user baru

**Solusi Account Abstraction:**
- Sponsored transactions (gas dibayar oleh pihak lain)
- Social recovery
- Batasan transaksi (mis. batas pengeluaran harian)
- Batching transaksi
- Session keys (izin terbatas untuk apps)
- Dan banyak inovasi lainnya

#### Evolusi Account Abstraction

Sebelum ERC-4337, ada beberapa pendekatan untuk Account Abstraction:

1. **Meta-transactions:** Transaksi ditandatangani oleh pengguna tetapi dieksekusi oleh relayer
2. **GSN (Gas Station Network):** Infrastruktur terdesentralisasi untuk meta-transactions
3. **EIP-2938:** Proposal untuk Account Abstraction di level protokol (tidak diimplementasikan)
4. **ERC-4337:** Solusi "tanpa fork" yang bekerja dengan infrastruktur Ethereum yang ada

### 2.2 ERC-4337: Standar Account Abstraction Tanpa Fork

ERC-4337 adalah standar yang memungkinkan Account Abstraction tanpa memerlukan perubahan pada protokol Ethereum inti.

#### Komponen Utama ERC-4337

1. **UserOperation:** Format data baru (bukan transaksi) yang mendeskripsikan tindakan yang diinginkan pengguna
2. **Bundler:** Entity yang mengelompokkan UserOperations dan mengirimkannya ke EntryPoint
3. **EntryPoint Contract:** Smart contract yang memproses UserOperations
4. **Smart Account Contract:** Smart contract yang dikendalikan pengguna (wallet) yang mengimplementasikan logika validasi
5. **Paymaster:** Optional contract yang dapat membayar gas untuk pengguna

#### Alur ERC-4337

1. User membuat dan menandatangani UserOperation
2. UserOperation dikirim ke Bundler (off-chain)
3. Bundler memvalidasi dan mengelompokkan beberapa UserOperation
4. Bundler mengirim batch ke EntryPoint contract melalui transaksi reguler
5. EntryPoint memverifikasi setiap UserOperation dengan memanggil kontrak wallet pengguna
6. Jika valid, EntryPoint mengeksekusi UserOperation dengan memanggil wallet pengguna

#### UserOperation

UserOperation adalah struktur data yang berisi informasi tentang operasi yang ingin dilakukan pengguna.

```solidity
struct UserOperation {
    address sender;              // Alamat smart contract wallet
    uint256 nonce;               // Nonce unik
    bytes initCode;              // Kode untuk deploy wallet baru (jika diperlukan)
    bytes callData;              // Data untuk dieksekusi oleh wallet
    uint256 callGasLimit;        // Batas gas untuk eksekusi
    uint256 verificationGasLimit;// Batas gas untuk verifikasi
    uint256 preVerificationGas;  // Gas untuk overhead BundlerTransactions
    uint256 maxFeePerGas;        // Max fee per gas (seperti EIP-1559)
    uint256 maxPriorityFeePerGas;// Max priority fee (seperti EIP-1559)
    bytes paymasterAndData;      // Alamat Paymaster + data tambahan
    bytes signature;             // Tanda tangan untuk memvalidasi operasi
}
```

### 2.3 SimpleAccount: Implementasi Reference ERC-4337

SimpleAccount adalah implementasi referensi dari smart contract wallet yang kompatibel dengan ERC-4337.

**Fitur SimpleAccount:**
- Validasi signature standar
- Upgrade-ability (proxy pattern)
- Executions batching
- Deposit/withdrawal ETH
- Dukungan ERC-1271 (signature validation)

**Contoh Kode SimpleAccount:**

```solidity
// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.12;

import "@account-abstraction/contracts/core/BaseAccount.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";

contract SimpleAccount is BaseAccount, Initializable, UUPSUpgradeable {
    using ECDSA for bytes32;

    address public owner;
    IEntryPoint private immutable _entryPoint;

    event SimpleAccountInitialized(IEntryPoint indexed entryPoint, address indexed owner);

    modifier onlyOwner() {
        require(msg.sender == owner, "only owner");
        _;
    }

    constructor(IEntryPoint anEntryPoint) {
        _entryPoint = anEntryPoint;
        _disableInitializers();
    }

    function initialize(address anOwner) public initializer {
        owner = anOwner;
        emit SimpleAccountInitialized(_entryPoint, owner);
    }

    function _validateSignature(UserOperation calldata userOp, bytes32 userOpHash)
    internal override virtual returns (uint256 validationData) {
        bytes32 hash = userOpHash.toEthSignedMessageHash();
        if (owner != hash.recover(userOp.signature))
            return SIG_VALIDATION_FAILED;
        return 0;
    }

    function _authorizeUpgrade(address newImplementation) internal view override {
        (newImplementation);
        require(msg.sender == owner, "only owner");
    }

    function entryPoint() public view override returns (IEntryPoint) {
        return _entryPoint;
    }

    function execute(address dest, uint256 value, bytes calldata func) external {
        _requireFromEntryPointOrOwner();
        _call(dest, value, func);
    }

    function executeBatch(address[] calldata dest, bytes[] calldata func) external {
        _requireFromEntryPointOrOwner();
        require(dest.length == func.length, "wrong array lengths");
        for (uint256 i = 0; i < dest.length; i++) {
            _call(dest[i], 0, func[i]);
        }
    }

    function _requireFromEntryPointOrOwner() internal view {
        require(msg.sender == address(entryPoint()) || msg.sender == owner, "account: not Owner or EntryPoint");
    }

    function _call(address target, uint256 value, bytes memory data) internal {
        (bool success, bytes memory result) = target.call{value: value}(data);
        if (!success) {
            assembly {
                revert(add(result, 32), mload(result))
            }
        }
    }

    receive() external payable {}
}
```

### 2.4 Bundler: Infrastruktur untuk UserOperation

Bundler adalah infrastruktur off-chain yang mengumpulkan dan mengirimkan UserOperation ke EntryPoint contract.

**Tipe Bundler:**
1. **Public RPC Bundler:** API publik yang menerima UserOperation dari siapa saja
2. **Private Bundler:** Hanya menerima UserOperation dari sumber terpercaya 
3. **App-specific Bundler:** Dirancang untuk aplikasi tertentu dengan optimasi khusus

**Implementasi Bundler Populer:**
- [Stackup](https://www.stackup.sh/)
- [Alchemy Account Kit](https://www.alchemy.com/account-kit)
- [Pimlico](https://pimlico.io/)
- [Biconomy](https://www.biconomy.io/)

**Arsitektur Bundler:**

![Bundler Architecture](https://storage.googleapis.com/ethglobal-api-production/organizations%2Fptikq%2Fimages%2FScreen%20Shot%202023-03-02%20at%208.08.56%20PM.png)

### 2.5 Paymaster: Sponsored Transaction

Paymaster adalah kontrak yang memungkinkan pihak ketiga membayar gas untuk transaksi pengguna.

**Tipe Paymaster:**
1. **Verifying Paymaster:** Validasi transaksi berdasarkan logika kustom
2. **Token Paymaster:** Mengizinkan pembayaran gas dengan token (bukan ETH)
3. **Sponsored Paymaster:** Menanggung biaya gas untuk user tertentu/transaksi tertentu

**Contoh Kode Paymaster Sederhana:**

```solidity
// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.12;

import "@account-abstraction/contracts/core/BasePaymaster.sol";

contract SponsorPaymaster is BasePaymaster {
    mapping(address => bool) public sponsoredAddresses;
    
    constructor(IEntryPoint _entryPoint) BasePaymaster(_entryPoint) {}
    
    function addSponsoredUser(address user) external onlyOwner {
        sponsoredAddresses[user] = true;
    }
    
    function removeSponsoredUser(address user) external onlyOwner {
        sponsoredAddresses[user] = false;
    }
    
    function _validatePaymasterUserOp(
        UserOperation calldata userOp,
        bytes32 userOpHash,
        uint256 maxCost
    ) internal view override returns (bytes memory context, uint256 validationData) {
        // Verify this is a sponsored user
        require(sponsoredAddresses[userOp.sender], "Not a sponsored user");
        
        return (abi.encode(userOp.sender), 0);
    }
    
    function _postOp(
        PostOpMode mode,
        bytes calldata context,
        uint256 actualGasCost
    ) internal override {
        // Payment handling logic after operation execution
        // Could implement limits, quotas, etc.
    }
}
```

## Bagian 3: Hands-on: Implementasi Bundler dan Simulasi Sponsored Transaction

Mari kita implementasikan full-stack dApp dengan Account Abstraction dan sponsored transactions.

### 3.1 Setup Proyek

Kita akan membuat proyek yang terdiri dari:
1. Smart contract wallet (berdasarkan SimpleAccount)
2. Paymaster untuk sponsored transactions
3. Frontend React dengan Web3Modal, wagmi, dan viem
4. Interaksi dengan bundler (Stackup/Alchemy/Pimlico)

**Struktur Proyek:**

```
aa-project/
├── contracts/            # Smart contracts
│   ├── SimpleWallet.sol  # Wallet contract
│   └── SponsorPaymaster.sol # Paymaster contract
├── scripts/              # Deployment scripts
├── frontend/             # React frontend
└── hardhat.config.js     # Hardhat config
```

**Inisialisasi Proyek:**

```bash
# Buat proyek baru
mkdir aa-project
cd aa-project

# Inisialisasi hardhat
npm init -y
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox

# Inisialisasi hardhat project
npx hardhat init
# Pilih "Create a TypeScript project"

# Install dependensi AA
npm install --save-dev @account-abstraction/contracts @openzeppelin/contracts

# Di direktori yang sama, inisialisasi frontend
npx create-react-app frontend
cd frontend
npm install viem wagmi @web3modal/wagmi @web3modal/ethereum @tanstack/react-query
```

### 3.2 Smart Contract Wallet dan Paymaster

**Implementasi SimpleWallet (SimpleWallet.sol):**

```solidity
// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.12;

import "@account-abstraction/contracts/core/BaseAccount.sol";
import "@account-abstraction/contracts/samples/SimpleAccount.sol";
import "@openzeppelin/contracts/utils/Create2.sol";

contract SimpleWalletFactory {
    SimpleAccount public immutable accountImplementation;

    constructor(IEntryPoint _entryPoint) {
        accountImplementation = new SimpleAccount(_entryPoint);
    }

    function createAccount(address owner, uint256 salt) public returns (SimpleAccount) {
        address addr = getAddress(owner, salt);
        uint codeSize = addr.code.length;
        if (codeSize > 0) {
            return SimpleAccount(payable(addr));
        }
        
        SimpleAccount account = SimpleAccount(payable(
            Create2.deploy(
                0,
                bytes32(salt),
                abi.encodePacked(
                    type(SimpleAccount).creationCode,
                    abi.encode(address(accountImplementation), abi.encodeCall(SimpleAccount.initialize, (owner)))
                )
            )
        ));
        
        return account;
    }

    function getAddress(address owner, uint256 salt) public view returns (address) {
        return Create2.computeAddress(
            bytes32(salt),
            keccak256(abi.encodePacked(
                type(SimpleAccount).creationCode,
                abi.encode(address(accountImplementation), abi.encodeCall(SimpleAccount.initialize, (owner)))
            ))
        );
    }
}
```

**Implementasi SponsorPaymaster (SponsorPaymaster.sol):**

```solidity
// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.12;

import "@account-abstraction/contracts/core/BasePaymaster.sol";

contract SponsorPaymaster is BasePaymaster {
    // Mapping untuk alamat yang di-sponsor
    mapping(address => bool) public sponsoredWallets;
    
    // Batas gas untuk validasi
    uint256 constant public VALIDATION_GAS_LIMIT = 50000;
    
    // Biaya overhead per operasi
    uint256 constant public POST_OP_OVERHEAD = 35000;
    
    event WalletSponsored(address indexed wallet, bool sponsored);

    constructor(IEntryPoint _entryPoint) BasePaymaster(_entryPoint) {}
    
    function addSponsoredWallet(address wallet) external onlyOwner {
        sponsoredWallets[wallet] = true;
        emit WalletSponsored(wallet, true);
    }
    
    function removeSponsoredWallet(address wallet) external onlyOwner {
        sponsoredWallets[wallet] = false;
        emit WalletSponsored(wallet, false);
    }
    
    // Deposit ETH ke EntryPoint untuk pembayaran gas
    function deposit() public payable {
        entryPoint.depositTo{value: msg.value}(address(this));
    }
    
    // Tentukan apakah UserOperation valid untuk disponsori
    function _validatePaymasterUserOp(
        UserOperation calldata userOp,
        bytes32 userOpHash,
        uint256 maxCost
    ) internal view override returns (bytes memory context, uint256 validationData) {
        // Pastikan wallet pengguna terdaftar untuk disponsori
        require(sponsoredWallets[userOp.sender], "Wallet not sponsored");
        
        // Return context kosong dan validationData=0 (valid)
        return (abi.encode(userOp.sender), 0);
    }
    
    // Post-operation handler
    function _postOp(
        PostOpMode mode,
        bytes calldata context,
        uint256 actualGasCost
    ) internal override {
        // Disini bisa ditambahkan logika tambahan, misalnya:
        // - Batas penggunaan per wallet
        // - Tracking penggunaan untuk analitik
        // - Logika bisnis khusus lainnya
    }
}
```

### 3.3 Deploy Smart Contracts

Buat script deployment untuk wallet factory dan paymaster:

**scripts/deploy.ts:**

```typescript
import { ethers } from "hardhat";

// Alamat EntryPoint dari ERC-4337 di testnet
const ENTRY_POINT_ADDRESS = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  
  // Deploy SimpleWalletFactory
  const SimpleWalletFactory = await ethers.getContractFactory("SimpleWalletFactory");
  const simpleWalletFactory = await SimpleWalletFactory.deploy(ENTRY_POINT_ADDRESS);
  await simpleWalletFactory.deployed();
  console.log("SimpleWalletFactory deployed to:", simpleWalletFactory.address);
  
  // Deploy SponsorPaymaster
  const SponsorPaymaster = await ethers.getContractFactory("SponsorPaymaster");
  const sponsorPaymaster = await SponsorPaymaster.deploy(ENTRY_POINT_ADDRESS);
  await sponsorPaymaster.deployed();
  console.log("SponsorPaymaster deployed to:", sponsorPaymaster.address);
  
  // Fund the paymaster with ETH for gas
  const tx = await deployer.sendTransaction({
    to: sponsorPaymaster.address,
    value: ethers.utils.parseEther("0.5"), // Kirim 0.5 ETH
  });
  await tx.wait();
  console.log("Funded paymaster with 0.5 ETH");
  
  // Deposit ETH ke EntryPoint
  const depositTx = await sponsorPaymaster.deposit({ value: ethers.utils.parseEther("0.2") });
  await depositTx.wait();
  console.log("Deposited 0.2 ETH to EntryPoint for the paymaster");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

**Konfigurasi Hardhat untuk Testnet:**

```typescript
// hardhat.config.ts
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
  networks: {
    sepolia: {
      url: process.env.ALCHEMY_SEPOLIA_URL || "",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

export default config;
```

**Deploy ke Testnet:**

```bash
# Tambahkan file .env dengan kredensial Anda
echo "ALCHEMY_SEPOLIA_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY" > .env
echo "PRIVATE_KEY=your_private_key_here" >> .env
echo "ETHERSCAN_API_KEY=your_etherscan_api_key" >> .env

# Deploy kontrak
npx hardhat run scripts/deploy.ts --network sepolia
```

### 3.4 Integrasi dengan Bundler

Kita akan menggunakan Stackup sebagai bundler service, namun prinsip yang sama berlaku untuk Pimlico, Alchemy, atau bundler lainnya.

**Mendaftar di Bundler Service:**

1. Daftar di [Stackup](https://www.stackup.sh/)
2. Buat project dan dapatkan API key
3. Pilih jaringan (Sepolia untuk contoh ini)

**Konfigurasi Bundler:**

```typescript
// bundler.ts
import { ethers } from "ethers";
import { Client, Presets } from "userop";

// Konstanta
const BUNDLER_URL = "https://api.stackup.sh/v1/node/YOUR_API_KEY";
const ENTRY_POINT_ADDRESS = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";
const SIMPLE_WALLET_FACTORY_ADDRESS = "your_deployed_factory_address";
const SPONSOR_PAYMASTER_ADDRESS = "your_deployed_paymaster_address";

// Fungsi untuk membuat client ERC-4337
export async function createClient(signer: ethers.Signer) {
  const bundlerProvider = new ethers.providers.JsonRpcProvider(BUNDLER_URL);
  const entryPoint = new ethers.Contract(
    ENTRY_POINT_ADDRESS,
    ["function getNonce(address sender, uint192 key) view returns (uint256)"],
    bundlerProvider
  );
  
  return new Client({
    entryPoint: ENTRY_POINT_ADDRESS,
    bundlerUrl: BUNDLER_URL,
    walletFactory: SIMPLE_WALLET_FACTORY_ADDRESS,
    walletFactoryData: async (owner: string) => {
      const factory = new ethers.Contract(
        SIMPLE_WALLET_FACTORY_ADDRESS,
        ["function createAccount(address owner, uint256 salt) returns (address)"],
        signer
      );
      
      return factory.interface.encodeFunctionData("createAccount", [
        owner,
        0 // salt
      ]);
    },
  });
}

// Fungsi untuk mendapatkan alamat smart account
export async function getAccountAddress(owner: string) {
  const factory = new ethers.Contract(
    SIMPLE_WALLET_FACTORY_ADDRESS,
    ["function getAddress(address owner, uint256 salt) view returns (address)"],
    new ethers.providers.JsonRpcProvider(BUNDLER_URL)
  );
  
  return factory.getAddress(owner, 0);
}

// Fungsi untuk membuat UserOperation dengan sponsored gas
export async function createSponsoredUserOp(
  client: Client,
  signer: ethers.Signer,
  to: string,
  value: string,
  data: string
) {
  const owner = await signer.getAddress();
  const accountAddress = await getAccountAddress(owner);
  
  // Buat builder untuk UserOperation
  const builder = await Presets.Builder.SimpleAccount.init(
    client,
    accountAddress,
    await signer.getAddress()
  );
  
  // Tambahkan operasi yang ingin dilakukan
  builder.execute(to, value, data);
  
  // Tambahkan informasi paymaster untuk sponsored transaction
  builder.usePaymaster(
    SPONSOR_PAYMASTER_ADDRESS,
    "0x" // Tidak ada data tambahan yang diperlukan
  );
  
  // Bangun dan tandatangani UserOperation
  const userOp = await builder.buildOp({
    gasPrice: ethers.utils.parseUnits("1", "gwei").toString(), // Gas price rendah karena disponsori
  });
  
  return userOp;
}

// Fungsi untuk mengirim dan menunggu UserOperation
export async function sendUserOp(client: Client, userOp: any) {
  try {
    const userOpHash = await client.sendUserOperation(userOp);
    console.log("UserOperation hash:", userOpHash);
    
    // Tunggu sampai UserOperation diproses
    const receipt = await client.waitForUserOperation(userOpHash);
    console.log("Transaction receipt:", receipt);
    
    return {
      userOpHash,
      receipt,
      success: true,
    };
  } catch (error) {
    console.error("Error sending UserOperation:", error);
    return {
      success: false,
      error,
    };
  }
}
```

### 3.5 Frontend dengan React, Wagmi, dan Web3Modal

Sekarang kita akan membuat frontend untuk menggunakan Account Abstraction, Web3Modal untuk koneksi wallet, dan sponsored transaction melalui bundler.

**Setup Frontend Config:**

```tsx
// frontend/src/config.ts
import { createConfig, http } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';

// Your WalletConnect project ID
export const projectId = 'YOUR_WALLETCONNECT_PROJECT_ID';

export const config = createConfig({
  chains: [sepolia],
  connectors: [
    injected(),
    walletConnect({ projectId }),
  ],
  transports: {
    [sepolia.id]: http('https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY'),
  },
});

// Contract addresses
export const SIMPLE_WALLET_FACTORY_ADDRESS = 'your_deployed_factory_address';
export const SPONSOR_PAYMASTER_ADDRESS = 'your_deployed_paymaster_address';
export const TOKEN_ADDRESS = 'address_of_test_token'; // Untuk demonstrasi transfer token
```

**App Component:**

```tsx
// frontend/src/App.tsx
import React from 'react';
import { WagmiProvider } from 'wagmi';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { Web3Modal } from '@web3modal/wagmi/react';
import { config, projectId } from './config';
import AccountAbstraction from './components/AccountAbstraction';

// Inisialisasi React Query client
const queryClient = new QueryClient();

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <Web3Modal projectId={projectId} />
        <div className="App">
          <header className="App-header">
            <h1>Account Abstraction Demo</h1>
          </header>
          <main>
            <AccountAbstraction />
          </main>
        </div>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
```

**Account Abstraction Component:**

```tsx
// frontend/src/components/AccountAbstraction.tsx
import React, { useState, useEffect } from 'react';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useAccount, useBalance, useReadContract, useWriteContract } from 'wagmi';
import { ethers } from 'ethers';
import { formatEther, parseEther } from 'viem';
import { createClient, getAccountAddress, createSponsoredUserOp, sendUserOp } from '../utils/bundler';
import { TOKEN_ADDRESS } from '../config';
import { erc20Abi } from 'viem';

const AccountAbstraction = () => {
  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount();
  const [smartWalletAddress, setSmartWalletAddress] = useState('');
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [transactionHash, setTransactionHash] = useState('');
  const [error, setError] = useState('');
  
  // Cek balance EOA dan Smart Wallet
  const { data: eoaBalance } = useBalance({
    address,
    enabled: !!address,
  });
  
  const { data: smartWalletBalance } = useBalance({
    address: smartWalletAddress as `0x${string}`,
    enabled: !!smartWalletAddress,
  });
  
  // Cek balance token pada Smart Wallet
  const { data: tokenBalance } = useReadContract({
    address: TOKEN_ADDRESS as `0x${string}`,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [smartWalletAddress],
    enabled: !!smartWalletAddress,
  });
  
  // Get wallet address dari factory
  useEffect(() => {
    const fetchSmartWalletAddress = async () => {
      if (address) {
        try {
          const accountAddress = await getAccountAddress(address);
          setSmartWalletAddress(accountAddress);
        } catch (err) {
          console.error("Error getting smart wallet address:", err);
        }
      }
    };
    
    fetchSmartWalletAddress();
  }, [address]);
  
  // Fungsi untuk mengirim transaksi melalui smart wallet dengan sponsored gas
  const sendSponsoredTransaction = async () => {
    if (!address || !smartWalletAddress || !recipient || !amount) return;
    
    setLoading(true);
    setError('');
    setTransactionHash('');
    
    try {
      // Connect ke provider
      const provider = new ethers.providers.Web3Provider(window.ethereum as any);
      const signer = provider.getSigner();
      
      // Buat client untuk interaksi dengan bundler
      const client = await createClient(signer);
      
      // Encode data transfer ERC-20
      const tokenInterface = new ethers.utils.Interface(erc20Abi);
      const callData = tokenInterface.encodeFunctionData("transfer", [
        recipient,
        ethers.utils.parseEther(amount)
      ]);
      
      // Buat UserOperation dengan sponsored gas
      const userOp = await createSponsoredUserOp(
        client,
        signer,
        TOKEN_ADDRESS, // alamat token ERC-20
        "0", // tidak mengirim ETH
        callData // data untuk transfer token
      );
      
      // Kirim UserOperation
      const result = await sendUserOp(client, userOp);
      
      if (result.success) {
        setTransactionHash(result.receipt?.transactionHash || '');
      } else {
        setError('Transaction failed. See console for details.');
      }
    } catch (err: any) {
      console.error("Error sending sponsored transaction:", err);
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };
  
  if (!isConnected) {
    return (
      <div className="connect-section">
        <h2>Connect your wallet to start</h2>
        <button className="connect-button" onClick={() => open()}>
          Connect Wallet
        </button>
      </div>
    );
  }
  
  return (
    <div className="aa-container">
      <div className="wallet-info">
        <h2>Wallet Info</h2>
        <p><strong>EOA Address:</strong> {address}</p>
        <p><strong>EOA Balance:</strong> {eoaBalance ? `${formatEther(eoaBalance.value)} ETH` : 'Loading...'}</p>
        <p><strong>Smart Wallet Address:</strong> {smartWalletAddress || 'Loading...'}</p>
        <p><strong>Smart Wallet ETH Balance:</strong> {smartWalletBalance ? `${formatEther(smartWalletBalance.value)} ETH` : 'Loading...'}</p>
        <p><strong>Smart Wallet Token Balance:</strong> {tokenBalance ? `${formatEther(tokenBalance as bigint)} Tokens` : 'Loading...'}</p>
      </div>
      
      <div className="transaction-form">
        <h2>Send Sponsored Transaction</h2>
        <p>Send tokens without paying for gas!</p>
        
        <div className="form-group">
          <label>Recipient Address:</label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="0x..."
          />
        </div>
        
        <div className="form-group">
          <label>Amount:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.0"
            min="0"
            step="0.01"
          />
        </div>
        
        <button
          className="send-button"
          onClick={sendSponsoredTransaction}
          disabled={loading || !recipient || !amount}
        >
          {loading ? 'Processing...' : 'Send Sponsored Transaction'}
        </button>
        
        {error && <div className="error-message">{error}</div>}
        
        {transactionHash && (
          <div className="success-message">
            <p>Transaction submitted successfully!</p>
            <a
              href={`https://sepolia.etherscan.io/tx/${transactionHash}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              View on Etherscan
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountAbstraction;
```

**Styling:**

```css
/* frontend/src/index.css */
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #f5f7fa;
}

.App {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.App-header {
  margin-bottom: 40px;
  text-align: center;
}

.aa-container {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.wallet-info, .transaction-form {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.connect-section {
  text-align: center;
  padding: 50px 0;
}

.connect-button, .send-button {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.connect-button:hover, .send-button:hover {
  background-color: #2980b9;
}

.connect-button:disabled, .send-button:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.error-message {
  color: #e74c3c;
  margin-top: 10px;
  padding: 10px;
  background-color: #fadbd8;
  border-radius: 4px;
}

.success-message {
  color: #27ae60;
  margin-top: 10px;
  padding: 10px;
  background-color: #d5f5e3;
  border-radius: 4px;
}

.success-message a {
  color: #2980b9;
  text-decoration: none;
}

.success-message a:hover {
  text-decoration: underline;
}
```

### 3.6 Testing Flow

Berikut adalah flow lengkap untuk menguji implementasi Account Abstraction:

1. **Setup Test Token**:
   Kita memerlukan token ERC-20 yang dapat ditransfer. Buat dan deploy token ERC-20 sederhana atau gunakan yang sudah ada di testnet.

2. **Fund Smart Wallet**:
   - Deploy smart wallet factory dan paymaster
   - Fund smart wallet dengan token ERC-20
   - Daftarkan smart wallet di paymaster (addSponsoredWallet)

3. **Set Allowances dan Permissions**:
   - Deposit ETH ke paymaster
   - Paymaster deposit ke EntryPoint

4. **Test Flow Lengkap**:
   - Connect dengan wallet (EOA)
   - Dapatkan alamat smart wallet
   - Kirim token tanpa memerlukan ETH menggunakan sponsored transaction

### 3.7 Pengembangan Lanjutan

Setelah implementasi dasar, Anda dapat mengeksplorasi fitur-fitur lanjutan Account Abstraction:

1. **Session Keys**:
   Implementasikan kemampuan untuk memberikan aplikasi izin terbatas untuk mengirim transaksi.

   ```solidity
   // Contoh tambahan untuk SimpleWallet
   mapping(address => mapping(bytes4 => bool)) public sessionKeys;
   
   function setSessionKey(address key, bytes4 method, bool enabled) external onlyOwner {
       sessionKeys[key][method] = enabled;
   }
   
   function _validateSignature(UserOperation calldata userOp, bytes32 userOpHash)
       internal override returns (uint256 validationData) {
       // Cek format tanda tangan
       if (userOp.signature.length == 65) {
           // Regular signature
           bytes32 hash = userOpHash.toEthSignedMessageHash();
           if (owner != hash.recover(userOp.signature))
               return SIG_VALIDATION_FAILED;
           return 0;
       } else if (userOp.signature.length == 21) {
           // Session key signature (address + selector)
           address sessionKey = address(bytes20(userOp.signature));
           bytes4 method = bytes4(userOp.callData);
           if (!sessionKeys[sessionKey][method])
               return SIG_VALIDATION_FAILED;
           return 0;
       }
       return SIG_VALIDATION_FAILED;
   }
   ```

2. **Social Recovery**:
   Tambahkan kemampuan untuk memulihkan akses jika pemilik kehilangan kunci privat.

   ```solidity
   // Contoh implementasi dasar social recovery
   mapping(address => bool) public guardians;
   uint256 public requiredGuardians;
   address public pendingOwner;
   uint256 public recoveryInitiated;
   
   function addGuardian(address guardian) external onlyOwner {
       guardians[guardian] = true;
   }
   
   function initiateRecovery(address newOwner) external {
       require(guardians[msg.sender], "Not a guardian");
       pendingOwner = newOwner;
       recoveryInitiated = block.timestamp;
   }
   
   function completeRecovery() external {
       require(block.timestamp >= recoveryInitiated + 3 days, "Waiting period not over");
       owner = pendingOwner;
       pendingOwner = address(0);
       recoveryInitiated = 0;
   }
   ```

3. **Batched Transactions**:
   Implementasikan UI untuk mengirim beberapa transaksi sekaligus.

4. **Gas Estimation dan Optimasi**:
   Tambahkan fitur untuk mengestimasi biaya gas dan mengoptimalkan transaksi.

5. **Transaction Limit**:
   Tambahkan fitur untuk membatasi jumlah transaksi per hari atau per sesi.

## Kesimpulan

Pada sesi ketiga ini, Anda telah:

1. Mempelajari library frontend modern untuk Web3 (Viem, Wagmi, Web3Modal)
2. Memahami konsep Account Abstraction dan standar ERC-4337
3. Mengimplementasikan smart contract wallet dan paymaster
4. Mengintegrasikan frontend dengan bundler untuk sponsored transactions
5. Membuat full-stack dApp dengan fitur Account Abstraction

Account Abstraction membuka banyak kemungkinan baru untuk pengalaman pengguna di Web3, dari sponsored transactions hingga recovery mechanisms dan batched operations. Dengan kombinasi frontend modern dan standard ERC-4337, kita dapat menciptakan aplikasi yang lebih ramah pengguna dan kompetitif dengan aplikasi web2 tradisional.

**Sumber Daya Tambahan:**

1. [ERC-4337 Spesifikasi](https://eips.ethereum.org/EIPS/eip-4337)
2. [Viem Documentation](https://viem.sh/docs/getting-started.html)
3. [Wagmi Documentation](https://wagmi.sh/react/getting-started)
4. [Web3Modal Documentation](https://web3modal.com)
5. [Stackup Documentation](https://docs.stackup.sh)
6. [Alchemy's Account Kit](https://www.alchemy.com/account-kit)
7. [WalletConnect Documentation](https://docs.walletconnect.com)

**Proyek Lanjutan untuk Dikerjakan:**

1. Implementasikan multi-chain support untuk smart wallet
2. Integrasikan dengan DeFi protokol untuk transaksi yang lebih kompleks
3. Bangun aplikasi sosial dengan login Web2-like menggunakan AA
4. Implementasikan sistem voting DAO dengan smart wallet dan AA
5. Buat NFT marketplace dengan gas-less minting melalui AA

Account Abstraction adalah masa depan UX untuk Web3, dan keterampilan yang Anda pelajari di sesi ini akan menjadi sangat berharga dalam pengembangan dApp modern.