---
id: testnet-overview
title: Testnet Overview
sidebar_position: 10
---

# 0G Testnet (Galileo)

Test aplikasi Anda di infrastruktur 0G tanpa biaya atau risiko nyata.

## Detail Jaringan

| Parameter | Detail Jaringan |
|----------------|---|
| **Nama Network** | 0G-Galileo-Testnet |
| **Chain ID** | 16601 |
| **Symbol Token** | OG |
| **Block Explorer** | ```https://chainscan-galileo.0g.ai``` |
| **Faucet** | https://faucet.0g.ai |

#### ✅ 3rd Party RPCs (Direkomendasikan untuk production)
- [QuickNode](https://www.quicknode.com/chains/0g)
- [ThirdWeb](https://thirdweb.com/0g-galileo-testnet-16601)
- [Ankr](https://www.ankr.com/rpc/0g/)

## Mulai Menggunakan

### Step 1: Tambahkan Network ke Wallet

:::warning Hapus Konfigurasi Lama
Hapus konfigurasi 0G testnet lama sebelum menambahkan Galileo untuk menghindari konflik.
:::

#### 🚀 Quick Add (Recommended)

<div style={{ display: 'flex', gap: '16px', margin: '16px 0', flexWrap: 'wrap' }}>
  <button 
    onClick={async () => {
      if (window.ethereum) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0x40d9',
              chainName: '0G-Galileo-Testnet',
              nativeCurrency: {
                name: 'OG',
                symbol: 'OG',
                decimals: 18
              },
              rpcUrls: ['https://evmrpc-testnet.0g.ai'],
              blockExplorerUrls: ['https://chainscan-galileo.0g.ai']
            }]
          });
        } catch (error) {
          console.error('Error adding network:', error);
          alert('Gagal menambahkan network. Silakan coba manual configuration di bawah.');
        }
      } else {
        alert('MetaMask tidak terdeteksi. Silakan install MetaMask terlebih dahulu.');
      }
    }}
    style={{
      backgroundColor: '#f6851b',
      color: 'white',
      border: 'none',
      padding: '12px 24px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: 'bold'
    }}
  >
    🦊 Add to MetaMask
  </button>
  
  <button 
    onClick={async () => {
      if (window.okxwallet) {
        try {
          await window.okxwallet.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0x40d9',
              chainName: '0G-Galileo-Testnet',
              nativeCurrency: {
                name: 'OG',
                symbol: 'OG',
                decimals: 18
              },
              rpcUrls: ['https://evmrpc-testnet.0g.ai'],
              blockExplorerUrls: ['https://chainscan-galileo.0g.ai']
            }]
          });
        } catch (error) {
          console.error('Error adding network:', error);
          alert('Gagal menambahkan network. Silakan coba manual configuration di bawah.');
        }
      } else {
        alert('OKX Wallet tidak terdeteksi. Silakan install OKX Wallet terlebih dahulu.');
      }
    }}
    style={{
      backgroundColor: '#000000',
      color: 'white',
      border: 'none',
      padding: '12px 24px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: 'bold'
    }}
  >
    🅾️ Add to OKX Wallet
  </button>
</div>

#### Manual Configuration (Jika Quick Add Tidak Bekerja)

**Untuk MetaMask:**
1. **Buka MetaMask** → Klik dropdown network → **Add Network**
2. **Isi detail berikut:**

```
Network Name: 0G-Galileo-Testnet
New RPC URL: https://evmrpc-testnet.0g.ai
Chain ID: 16601
Currency Symbol: OG
Block Explorer URL: https://chainscan-galileo.0g.ai
```

3. **Save** dan switch ke network baru

**Untuk OKX Wallet:**
1. **Buka OKX Wallet** → **Settings** → **Networks**
2. **Add Custom Network** dengan detail yang sama
3. **Confirm** dan aktifkan network

### Step 2: Setup Development Environment

Sebelum mulai building di 0G, Anda perlu menginstall beberapa tools dan dependencies yang dibutuhkan.

#### Prerequisites yang Harus Diinstall:

**1. Node.js (LTS Version)**
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# macOS (dengan Homebrew)
brew install node

# Windows
# Download dari https://nodejs.org
```

**2. Git**
```bash
# Ubuntu/Debian
sudo apt-get install git

# macOS
brew install git

# Windows
# Download dari https://git-scm.com
```

**3. Code Editor (Recommended: VS Code)**
- Download dari [https://code.visualstudio.com](https://code.visualstudio.com)
- Install extension: **Solidity** untuk smart contract development

#### Install 0G Development Tools:

```bash
# Install Hardhat untuk smart contract development
npm install -g hardhat

# Install 0G SDK libraries (untuk project specific)
npm install @0glabs/0g-js-sdk
npm install @0glabs/0g-storage-client
npm install @0glabs/0g-compute-client
```

#### Verifikasi Installation:

```bash
# Check Node.js version
node --version  # Should be v18+ or higher

# Check npm version
npm --version

# Check Git
git --version

# Check Hardhat
npx hardhat --version
```

:::tip Ready untuk Next Steps?
Setelah semua tools terinstall, lanjut ke tutorial berikutnya untuk dapatkan test tokens dan mulai building!
:::

### Langkah Selanjutnya

Setelah environment setup complete:
- **[Faucet & Test Tokens](https://faucet.0g.ai)** - Dapatkan OG tokens gratis
- **[Deploy Smart Contracts](https://docs.0g.ai/developer-hub/building-on-0g/contracts-on-0g/deploy-contracts)** - Deploy contract pertama
- **[Storage Integration](https://docs.0g.ai/developer-hub/building-on-0g/storage/sdk)** - Menggunakan 0G Storage SDK  
- **[Compute Integration](https://docs.0g.ai/developer-hub/building-on-0g/compute-network/sdk)** - Menggunakan 0G Compute SDK

## Useful Resources

### Block Explorers
- **[Chain Explorer](https://chainscan-galileo.0g.ai)**: View transaksi, blok, dan smart contracts
- **[Storage Explorer](https://storagescan-galileo.0g.ai)**: Track operasi storage dan metrics
- **[Validator Dashboard](https://testnet.0g.explorers.guru)**: Monitor network validators

### Contract Addresses (Reference)

:::caution Address Dapat Berubah
Address ini dapat berubah selama fase testnet. Selalu check dokumentasi terbaru.
:::

**0G Storage**
- Flow: `0xbD75117F80b4E22698D0Cd7612d92BDb8eaff628`
- Mine: `0x3A0d1d67497Ad770d6f72e7f4B8F0BAbaa2A649C`
- Market: `0x53191725d260221bBa307D8EeD6e2Be8DD265e19`
- Reward: `0xd3D4D91125D76112AE256327410Dd0414Ee08Cb4`

**0G DA**
- DAEntrance: `0xE75A073dA5bb7b0eC622170Fd268f35E675a957B`

**Deployment Block**: `326165`

## Community Support

### Indonesian Developer Community
- **[Discord ETHJKT](https://discord.gg/p5b6RFEnnk)**: Indonesian developer community
- **[Telegram](https://t.me/ethjkt_dev)**: Daily technical discussions
- **[Workshop ETHJKT](https://ethjkt.com)**: Monthly hands-on sessions

### Global 0G Community
- **[Discord 0G](https://discord.com/invite/0glabs)**: Official support dan faucet requests
- **[GitHub](https://github.com/0glabs)**: Source code dan examples
- **[Documentation](https://docs.0g.ai)**: Complete technical documentation

:::tip Siap untuk Development?
Environment setup complete! Lanjut ke tutorial berikutnya untuk mulai building aplikasi pertama Anda di 0G! 🚀
:::

---

**Next**: **[Official 0G Documentation](https://docs.0g.ai/developer-hub/getting-started)** - Complete development guides