---
sidebar_position: 1
title: 1. MultiSigWallet - Setup Environment
description: Setup Environment untuk MultiSigWallet dengan Foundry dan Monad
---

# MultiSigWallet - Setup Environment

Dokumentasi lengkap untuk melakukan setup environment yang diperlukan untuk mengembangkan **MultiSigWallet** smart contract menggunakan Foundry dengan template Monad oficial. Tutorial ini akan memandu Anda melalui semua langkah setup yang diperlukan.

## Daftar Isi

1. [Apa itu MultiSigWallet?](#1-apa-itu-multisigwallet)
2. [Instalasi Foundry](#2-instalasi-foundry)
3. [Setup Proyek dengan Template Monad](#3-setup-proyek-dengan-template-monad)
4. [Konfigurasi Environment](#4-konfigurasi-environment)
5. [Setup Wallet Management](#5-setup-wallet-management)
6. [Verifikasi Setup](#6-verifikasi-setup)

---

## 1. Apa itu MultiSigWallet?

**MultiSigWallet** (Multi-Signature Wallet) adalah sistem wallet pintar yang memerlukan **multiple signatures** (tanda tangan ganda) untuk melakukan transaksi. Ini berbeda dengan wallet biasa yang hanya memerlukan satu private key.

### Konsep Dasar

**MultiSigWallet** menggunakan sistem **weighted voting** di mana:
- Setiap pemilik memiliki **bobot suara** berdasarkan governance token yang dimiliki
- Transaksi memerlukan **quorum** (jumlah minimal voting weight) untuk dijalankan
- Hanya **executor** yang dapat mengeksekusi transaksi (tapi tetap butuh signatures)

### Mengapa Menggunakan MultiSigWallet?

#### Keamanan
- **Tidak ada single point of failure** - Jika satu private key hilang, dana tetap aman
- **Proteksi dari insider threats** - Memerlukan kolaborasi multiple parties
- **Audit trail** - Semua transaksi tercatat dan dapat diaudit

#### Governance
- **Democratic decision making** - Keputusan berdasarkan voting
- **Proportional representation** - Voting power sesuai dengan stake
- **Flexible quorum** - Threshold dapat disesuaikan

#### Use Cases
- **DAO Treasury** - Mengelola dana organisasi
- **Corporate Wallet** - Treasury perusahaan dengan multiple approval
- **Family Trust** - Pengelolaan harta keluarga
- **Investment Fund** - Fund management dengan multiple partners

### Komponen Utama

#### 1. WalletGovToken (ERC20)
Token governance yang menentukan voting weight setiap user:
```
Total Supply: 1,000,000 tokens
Voting Weight = Token Balance
Transfer Protection: Tidak bisa transfer ke wallet contract
```

#### 2. WeightedMultiSigWallet
Core wallet contract yang mengatur transaksi:
```
Quorum System: Minimum voting weight untuk approve transaksi
Executor System: Address yang bisa execute (dengan signatures)
Nonce System: Prevent replay attacks
Signature Verification: ECDSA signature validation
```

### Contoh Skenario Penggunaan

**DAO dengan 4 Founders:**
```
Founder A: 400,000 tokens (40%)
Founder B: 300,000 tokens (30%)
Founder C: 200,000 tokens (20%)
Founder D: 100,000 tokens (10%)

Quorum: 600,000 tokens (60%)

Kombinasi yang bisa approve:
- A + B = 700,000 (70%) ✓
- A + C = 600,000 (60%) ✓
- B + C + D = 600,000 (60%) ✓
- A saja = 400,000 (40%) ✗
```

---

## 2. Instalasi Foundry

Foundry adalah toolkit yang sangat cepat dan portable untuk pengembangan smart contract Ethereum yang ditulis dalam Rust.

### Untuk macOS

#### Prasyarat
- macOS 10.15 Catalina atau lebih baru
- Aplikasi Terminal
- Setidaknya 1GB ruang disk kosong
- Homebrew (untuk dependencies)

#### Langkah Instalasi

1. **Buka Terminal**
   ```bash
   # Buka Terminal dari Applications > Utilities > Terminal
   # atau tekan Command + Space, ketik "Terminal"
   ```

2. **Install Homebrew (jika belum ada)**
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

3. **Install dependencies yang diperlukan**
   ```bash
   # Install libusb untuk hardware wallet support
   brew install libusb
   
   # Install git jika belum ada
   brew install git
   ```

4. **Download dan install Foundryup**
   ```bash
   curl -L https://foundry.paradigm.xyz | bash
   ```

5. **Restart terminal atau source profile**
   ```bash
   # Untuk zsh (default di macOS terbaru)
   source ~/.zshrc
   
   # Untuk bash
   source ~/.bash_profile
   ```

6. **Install Foundry toolchain**
   ```bash
   foundryup
   ```

7. **Verifikasi instalasi**
   ```bash
   forge --version
   # Output: forge 0.2.0 (...)
   
   cast --version
   # Output: cast 0.2.0 (...)
   
   anvil --version
   # Output: anvil 0.2.0 (...)
   ```

### Untuk Windows (dengan WSL)

#### Prasyarat
- Windows 10 versi 2004+ atau Windows 11
- Windows Subsystem for Linux (WSL)
- Akses administrator
- Setidaknya 5GB ruang disk kosong

#### Langkah Instalasi

1. **Aktifkan WSL**
   ```powershell
   # Buka PowerShell sebagai Administrator
   # Klik kanan Windows Start Button > Windows PowerShell (Admin)
   
   # Enable WSL feature
   dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
   
   # Enable Virtual Machine Platform
   dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
   ```

2. **Install WSL2**
   ```powershell
   # Download dan install WSL2
   wsl --install
   
   # Atau install Ubuntu spesifik
   wsl --install -d Ubuntu-22.04
   ```

3. **Restart komputer**
   ```
   Restart Windows untuk mengaktifkan WSL
   ```

4. **Setup Ubuntu di WSL**
   ```bash
   # Buka Ubuntu dari Start Menu
   # Ikuti setup wizard untuk membuat username dan password
   
   # Update package lists
   sudo apt update && sudo apt upgrade -y
   ```

5. **Install dependencies di Ubuntu**
   ```bash
   # Install curl dan git
   sudo apt install curl git build-essential -y
   
   # Install rust (diperlukan oleh Foundry)
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   source ~/.bashrc
   ```

6. **Install Foundry di WSL**
   ```bash
   # Download Foundryup
   curl -L https://foundry.paradigm.xyz | bash
   
   # Source bashrc
   source ~/.bashrc
   
   # Install Foundry
   foundryup
   ```

7. **Verifikasi instalasi**
   ```bash
   forge --version
   cast --version
   anvil --version
   ```

### Untuk Linux (Ubuntu/Debian)

#### Prasyarat
- Ubuntu 20.04+ atau Debian 11+
- Terminal access
- Sudo privileges

#### Langkah Instalasi

1. **Update system**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

2. **Install dependencies**
   ```bash
   # Install required packages
   sudo apt install curl git build-essential libssl-dev pkg-config -y
   
   # Install Rust
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   source ~/.bashrc
   ```

3. **Install Foundry**
   ```bash
   # Download Foundryup
   curl -L https://foundry.paradigm.xyz | bash
   
   # Source bashrc
   source ~/.bashrc
   
   # Install Foundry toolchain
   foundryup
   ```

4. **Verifikasi instalasi**
   ```bash
   forge --version
   cast --version
   anvil --version
   ```

### Troubleshooting Instalasi

#### Error: Command not found

**Solusi:**
```bash
# Cek apakah foundry ada di PATH
echo $PATH | grep foundry

# Jika tidak ada, tambahkan ke PATH
echo 'export PATH="$HOME/.foundry/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

#### Error: Permission denied

**Solusi macOS:**
```bash
# Grant execution permission
chmod +x ~/.foundry/bin/forge
chmod +x ~/.foundry/bin/cast
chmod +x ~/.foundry/bin/anvil
```

**Solusi Linux:**
```bash
# Same as macOS
chmod +x ~/.foundry/bin/*
```

#### Error: libusb not found

**Solusi macOS:**
```bash
brew install libusb
```

**Solusi Linux:**
```bash
sudo apt install libusb-1.0-0-dev
```

#### Update Foundry

```bash
# Update ke versi terbaru
foundryup

# Update ke versi spesifik
foundryup --version v0.2.0

# Update dari source (development version)
foundryup --branch master
```

---

## 3. Setup Proyek dengan Template Monad

Template Monad menyediakan setup yang sudah dikonfigurasi untuk Monad Testnet dengan semua dependencies dan konfigurasi yang diperlukan.

### Membuat Proyek Baru

```bash
# Pindah ke direktori workspace
cd ~/workspace  # atau direktori pilihan Anda

# Buat proyek baru dengan template Monad
forge init --template monad-developers/foundry-monad multisig-wallet

# Masuk ke direktori proyek
cd multisig-wallet
```

### Memahami Struktur Proyek

Setelah inisialisasi, struktur proyek akan terlihat seperti ini:

```
multisig-wallet/
├── foundry.toml           # Konfigurasi Foundry
├── script/                # Deployment scripts
│   └── Counter.s.sol      # Contoh deployment script
├── src/                   # Smart contracts
│   └── Counter.sol        # Contoh contract
├── test/                  # Test files
│   └── Counter.t.sol      # Contoh test file
├── lib/                   # Dependencies
│   └── forge-std/         # Foundry standard library
├── .env.example          # Template environment variables
├── .gitignore            # Git ignore rules
├── remappings.txt        # Import remappings
└── README.md             # Project documentation
```

#### Penjelasan Direktori

**foundry.toml**
File konfigurasi utama Foundry yang mengatur:
- Direktori source code
- Direktori output compilation
- Libraries dan dependencies
- Network configurations
- Compiler settings

**src/**
Direktori untuk menyimpan smart contracts:
- File .sol berisi contract code
- Organisasi berdasarkan functionality
- Import structure yang clear

**test/**
Direktori untuk test files:
- File berakhiran .t.sol
- Test contracts yang inherit dari forge-std/Test.sol
- Unit tests dan integration tests

**script/**
Direktori untuk deployment dan interaction scripts:
- Deployment scripts untuk different networks
- Configuration scripts
- Maintenance scripts

**lib/**
Direktori untuk external dependencies:
- forge-std: Foundry testing utilities
- OpenZeppelin: Security-audited contracts
- Custom libraries

### Memahami Konfigurasi foundry.toml

File `foundry.toml` berisi konfigurasi khusus untuk Monad:

```toml
[profile.default]
src = "src"                    # Direktori source contracts
out = "out"                    # Direktori output compilation
libs = ["lib"]                 # Direktori libraries
metadata = true                # Include metadata dalam compilation
metadata_hash = "none"         # Disable IPFS metadata
use_literal_content = true     # Use source code literal
solc_version = "0.8.26"       # Solidity compiler version

# Monad Testnet Configuration
eth-rpc-url = "https://testnet-rpc.monad.xyz"
chain_id = 10143

# Compiler optimizations
optimizer = true
optimizer_runs = 200

# Additional configurations
gas_reports = ["*"]
gas_price = 1000000000         # 1 gwei
```

#### Konfigurasi Penjelasan

**Basic Settings:**
- `src`: Lokasi contract source files
- `out`: Output directory untuk compiled contracts
- `libs`: Library directories untuk dependencies

**Solidity Settings:**
- `solc_version`: Versi Solidity compiler (0.8.26)
- `optimizer`: Enable/disable code optimization
- `optimizer_runs`: Jumlah expected runs untuk optimization

**Network Settings:**
- `eth-rpc-url`: RPC endpoint untuk Monad Testnet
- `chain_id`: Chain ID Monad Testnet (10143)
- `gas_price`: Default gas price untuk transactions

### Update Konfigurasi untuk Solidity 0.8.26

Edit file `foundry.toml` untuk memastikan menggunakan Solidity 0.8.26:

```toml
[profile.default]
src = "src"
out = "out"
libs = ["lib"]
metadata = true
metadata_hash = "none"
use_literal_content = true
solc_version = "0.8.26"        # Pastikan versi 0.8.26

# Monad Testnet Configuration
eth-rpc-url = "https://testnet-rpc.monad.xyz"
chain_id = 10143

# Optimization settings
optimizer = true
optimizer_runs = 1000          # Optimize untuk production

# Gas settings
gas_reports = ["*"]
gas_price = 1000000000

# Testing configurations
fuzz = { runs = 1000 }         # Fuzz testing runs
invariant = { runs = 100 }     # Invariant testing runs

# Additional useful settings
fs_permissions = [
    { access = "read-write", path = "./deployments" },
    { access = "read", path = "./lib" }
]
```

### Install Dependencies yang Diperlukan

#### 1. OpenZeppelin Contracts

OpenZeppelin menyediakan security-audited smart contracts:

```bash
# Install OpenZeppelin contracts
forge install OpenZeppelin/openzeppelin-contracts

# Verifikasi instalasi
ls lib/openzeppelin-contracts
```

#### 2. Forge Standard Library

Biasanya sudah terinstall, tapi pastikan up-to-date:

```bash
# Update forge-std jika diperlukan
forge install foundry-rs/forge-std

# Atau update existing
forge update lib/forge-std
```

#### 3. Setup Remappings

Edit file `remappings.txt` untuk import paths yang clean:

```txt
@openzeppelin/=lib/openzeppelin-contracts/
@forge-std/=lib/forge-std/src/
ds-test/=lib/forge-std/lib/ds-test/src/
```

### Cleanup Template Files

Hapus contoh files yang tidak diperlukan:

```bash
# Hapus contoh contracts
rm src/Counter.sol
rm test/Counter.t.sol
rm script/Counter.s.sol

# Buat direktori untuk MultiSigWallet
mkdir -p src/interfaces
mkdir -p test/unit
mkdir -p test/integration
mkdir -p script/deployment
mkdir -p script/management
```

### Verifikasi Setup Template

```bash
# Test compilation (should pass even without contracts)
forge build

# Test basic functionality
forge test

# Check remappings
forge remappings
```

---

## 4. Konfigurasi Environment

### Setup Environment Variables

Environment variables digunakan untuk menyimpan sensitive data seperti private keys dan API keys.

#### 1. Copy Template Environment

```bash
# Copy template ke file aktual
cp .env.example .env

# Edit file .env
nano .env  # atau editor pilihan Anda
```

#### 2. Konfigurasi .env File

Edit file `.env` dengan konfigurasi berikut:

```bash
# Private Keys (JANGAN COMMIT KE GIT!)
PRIVATE_KEY=your_private_key_here
DEPLOYER_PRIVATE_KEY=your_deployer_private_key_here

# Network Configuration
RPC_URL=https://testnet-rpc.monad.xyz
CHAIN_ID=10143

# Etherscan API Key untuk verification (opsional)
ETHERSCAN_API_KEY=your_etherscan_api_key_here

# Contract Addresses (akan diisi setelah deployment)
MULTISIG_WALLET_ADDRESS=
GOV_TOKEN_ADDRESS=

# Deployment Configuration
INITIAL_QUORUM=600000          # 60% quorum
INITIAL_FUNDING=1000000000000000000  # 1 ETH dalam wei

# Gas Configuration
GAS_PRICE=1000000000           # 1 gwei
GAS_LIMIT=8000000             # 8M gas limit

# Wallet Configuration
WALLET_NAME=multisig-deployer
WALLET_PASSWORD_FILE=.wallet_password
```

#### 3. Security Best Practices

**PENTING: Jangan commit private keys ke git!**

```bash
# Pastikan .env ada di .gitignore
echo ".env" >> .gitignore
echo ".wallet_password" >> .gitignore
echo "deployments/*.json" >> .gitignore
```

#### 4. Alternative: Environment Variable dalam Shell

Untuk security extra, gunakan shell environment variables:

```bash
# Tambahkan ke ~/.bashrc atau ~/.zshrc
export PRIVATE_KEY="your_private_key_here"
export RPC_URL="https://testnet-rpc.monad.xyz"
export CHAIN_ID="10143"

# Source the file
source ~/.bashrc  # atau ~/.zshrc
```

### Setup Network Configuration

#### 1. Verifikasi Koneksi ke Monad Testnet

```bash
# Test koneksi RPC
cast client --rpc-url https://testnet-rpc.monad.xyz

# Output yang diharapkan:
# Erigon/2.xx.x/darwin-amd64/go1.21.x (atau similar)
```

#### 2. Cek Chain ID

```bash
# Verifikasi chain ID
cast chain-id --rpc-url https://testnet-rpc.monad.xyz

# Output: 10143
```

#### 3. Cek Block Number

```bash
# Cek latest block untuk memastikan network aktif
cast block-number --rpc-url https://testnet-rpc.monad.xyz

# Output: current block number (angka yang terus berubah)
```

### Setup Direktori Deployment

Buat struktur direktori untuk menyimpan deployment artifacts:

```bash
# Buat direktori deployment
mkdir -p deployments/monad-testnet
mkdir -p deployments/mainnet

# Buat template deployment file
cat > deployments/monad-testnet/README.md << 'EOF'
# Monad Testnet Deployments

## Contract Addresses

- MultiSigWallet: TBD
- GovernanceToken: TBD

## Deployment Information

- Deploy Date: TBD
- Deployer: TBD
- Transaction Hash: TBD
- Gas Used: TBD

EOF
```

---

## 5. Setup Wallet Management

### Install Cast Wallet Management

Cast adalah CLI tool untuk berinteraksi dengan blockchain dan mengelola wallets.

#### 1. Verifikasi Cast Installation

```bash
# Cek versi cast
cast --version

# Output: cast 0.2.0 (...)
```

#### 2. Generate New Wallet

```bash
# Generate wallet baru dan lihat informasinya
cast wallet new

# Output:
# Successfully created new keypair.
# Address:     0x1234567890123456789012345678901234567890
# Private key: 0xabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdef
```

#### 3. Import Wallet ke Keystore

```bash
# Import private key ke encrypted keystore
cast wallet import multisig-deployer --private-key YOUR_PRIVATE_KEY_HERE

# Anda akan diminta password:
# Enter password: [masukkan password yang kuat]
# `multisig-deployer` keystore was saved successfully.
```

#### 4. Alternative: Import dari Mnemonic

```bash
# Jika Anda punya mnemonic phrase
cast wallet import multisig-deployer --mnemonic "your twelve word mnemonic phrase here"

# Atau dari specific derivation path
cast wallet import multisig-deployer --mnemonic "your mnemonic" --mnemonic-derivation-path "m/44'/60'/0'/0/0"
```

### Wallet Management Commands

#### 1. List Stored Wallets

```bash
# Lihat semua wallet yang tersimpan
cast wallet list

# Output:
# multisig-deployer (Local)
```

#### 2. Get Wallet Address

```bash
# Dapatkan address dari wallet
cast wallet address --account multisig-deployer

# Anda akan diminta password:
# Enter keystore password: [masukkan password]
# 0x1234567890123456789012345678901234567890
```

#### 3. Sign Message dengan Wallet

```bash
# Sign message untuk testing
cast wallet sign --account multisig-deployer "Hello World"

# Enter keystore password: [password]
# 0x... (signature)
```

#### 4. Backup Wallet

```bash
# Export private key (HATI-HATI!)
cast wallet private-key --account multisig-deployer

# Enter keystore password: [password]
# 0xabcdef... (private key - jangan share!)
```

### Mendapatkan Testnet Tokens

#### 1. Akses Monad Faucet

1. Buka browser dan kunjungi [Monad Testnet Faucet](https://faucet.testnet.monad.xyz/)
2. Connect wallet atau paste address
3. Request MON tokens
4. Wait untuk konfirmasi

#### 2. Verifikasi Balance

```bash
# Dapatkan address wallet
WALLET_ADDRESS=$(cast wallet address --account multisig-deployer)

# Cek balance dalam wei
cast balance $WALLET_ADDRESS --rpc-url https://testnet-rpc.monad.xyz

# Cek balance dalam ether untuk readability
cast balance $WALLET_ADDRESS --rpc-url https://testnet-rpc.monad.xyz | cast to-unit ether

# Output: 10.000000000000000000 (10 MON)
```

#### 3. Monitor Balance

```bash
# Script untuk monitor balance
cat > scripts/check-balance.sh << 'EOF'
#!/bin/bash

WALLET_ADDRESS=$(cast wallet address --account multisig-deployer 2>/dev/null)
if [ -z "$WALLET_ADDRESS" ]; then
    echo "Error: Could not get wallet address"
    exit 1
fi

BALANCE_WEI=$(cast balance $WALLET_ADDRESS --rpc-url https://testnet-rpc.monad.xyz)
BALANCE_ETH=$(echo $BALANCE_WEI | cast to-unit ether)

echo "Wallet Address: $WALLET_ADDRESS"
echo "Balance: $BALANCE_ETH MON"

# Warn if balance is low
BALANCE_INT=$(echo $BALANCE_ETH | cut -d. -f1)
if [ "$BALANCE_INT" -lt 1 ]; then
    echo "WARNING: Balance is low. Consider getting more tokens from faucet."
fi
EOF

chmod +x scripts/check-balance.sh
```

### Setup Multiple Wallets (Opsional)

Untuk testing multi-signature functionality, setup multiple wallets:

```bash
# Generate dan import wallet kedua
PRIVATE_KEY_2=$(cast wallet new | grep "Private key:" | awk '{print $3}')
cast wallet import multisig-user1 --private-key $PRIVATE_KEY_2

# Generate dan import wallet ketiga
PRIVATE_KEY_3=$(cast wallet new | grep "Private key:" | awk '{print $3}')
cast wallet import multisig-user2 --private-key $PRIVATE_KEY_3

# Generate dan import wallet keempat
PRIVATE_KEY_4=$(cast wallet new | grep "Private key:" | awk '{print $3}')
cast wallet import multisig-user3 --private-key $PRIVATE_KEY_4

# List semua wallets
cast wallet list
```

---

## 6. Verifikasi Setup

### Test Compilation

```bash
# Test bahwa environment bisa compile contracts
forge build

# Output yang diharapkan (tanpa errors):
# [⠒] Compiling...
# [⠢] Compiling 1 files with 0.8.26
# [⠆] Solc 0.8.26 finished in 234.56ms
# Compiler run successful!
```

### Test Network Connectivity

```bash
# Test semua network operations
echo "Testing Monad Testnet connectivity..."

# 1. RPC connection
echo "1. Testing RPC connection..."
cast client --rpc-url https://testnet-rpc.monad.xyz

# 2. Chain ID verification
echo "2. Verifying Chain ID..."
CHAIN_ID=$(cast chain-id --rpc-url https://testnet-rpc.monad.xyz)
echo "Chain ID: $CHAIN_ID"

# 3. Latest block
echo "3. Getting latest block..."
BLOCK_NUMBER=$(cast block-number --rpc-url https://testnet-rpc.monad.xyz)
echo "Latest block: $BLOCK_NUMBER"

# 4. Wallet balance
echo "4. Checking wallet balance..."
WALLET_ADDRESS=$(cast wallet address --account multisig-deployer 2>/dev/null)
if [ ! -z "$WALLET_ADDRESS" ]; then
    BALANCE=$(cast balance $WALLET_ADDRESS --rpc-url https://testnet-rpc.monad.xyz | cast to-unit ether)
    echo "Wallet balance: $BALANCE MON"
else
    echo "No wallet configured"
fi

echo "Network connectivity test completed!"
```

### Test Dependencies

```bash
# Test bahwa semua dependencies terinstall dengan benar
echo "Testing dependencies..."

# 1. OpenZeppelin
echo "1. Testing OpenZeppelin..."
ls lib/openzeppelin-contracts/contracts/token/ERC20/ERC20.sol
if [ $? -eq 0 ]; then
    echo "✓ OpenZeppelin contracts found"
else
    echo "✗ OpenZeppelin contracts missing"
fi

# 2. Forge-std
echo "2. Testing forge-std..."
ls lib/forge-std/src/Test.sol
if [ $? -eq 0 ]; then
    echo "✓ Forge-std found"
else
    echo "✗ Forge-std missing"
fi

# 3. Remappings
echo "3. Testing remappings..."
forge remappings | grep "@openzeppelin"
if [ $? -eq 0 ]; then
    echo "✓ Remappings configured"
else
    echo "✗ Remappings not configured"
fi

echo "Dependencies test completed!"
```

### Create Test Contract

Buat simple test contract untuk memastikan everything works:

```bash
# Buat simple test contract
cat > src/SetupTest.sol << 'EOF'
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract SetupTest {
    string public message;
    
    constructor() {
        message = "Setup successful!";
    }
    
    function getMessage() external view returns (string memory) {
        return message;
    }
}
EOF

# Buat test file
cat > test/SetupTest.t.sol << 'EOF'
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "forge-std/Test.sol";
import "../src/SetupTest.sol";

contract SetupTestContract is Test {
    SetupTest public setupTest;
    
    function setUp() public {
        setupTest = new SetupTest();
    }
    
    function test_SetupWorking() public {
        string memory message = setupTest.getMessage();
        assertEq(message, "Setup successful!");
    }
}
EOF
```

### Run Complete Verification

```bash
# Compile test contract
forge build

# Run test
forge test

# Output yang diharapkan:
# Running 1 test for test/SetupTest.t.sol:SetupTestContract
# [PASS] test_SetupWorking() (gas: 9876)
# Test result: ok. 1 passed; 0 failed; 0 skipped; finished in 1.23ms
```

### Create Verification Script

```bash
# Buat script lengkap untuk verifikasi setup
cat > scripts/verify-setup.sh << 'EOF'
#!/bin/bash

echo "=== MultiSigWallet Setup Verification ==="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print status
print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $2"
    else
        echo -e "${RED}✗${NC} $2"
    fi
}

# Function to print warning
print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

echo "1. Checking Foundry installation..."
forge --version > /dev/null 2>&1
print_status $? "Forge installed"

cast --version > /dev/null 2>&1
print_status $? "Cast installed"

anvil --version > /dev/null 2>&1
print_status $? "Anvil installed"

echo ""
echo "2. Checking project structure..."
[ -f "foundry.toml" ]
print_status $? "foundry.toml exists"

[ -d "src" ]
print_status $? "src/ directory exists"

[ -d "test" ]
print_status $? "test/ directory exists"

[ -d "script" ]
print_status $? "script/ directory exists"

echo ""
echo "3. Checking dependencies..."
[ -d "lib/openzeppelin-contracts" ]
print_status $? "OpenZeppelin contracts installed"

[ -d "lib/forge-std" ]
print_status $? "Forge-std installed"

[ -f "remappings.txt" ]
print_status $? "Remappings configured"

echo ""
echo "4. Testing compilation..."
forge build > /dev/null 2>&1
print_status $? "Contracts compile successfully"

echo ""
echo "5. Testing network connectivity..."
cast client --rpc-url https://testnet-rpc.monad.xyz > /dev/null 2>&1
print_status $? "Monad Testnet RPC accessible"

CHAIN_ID=$(cast chain-id --rpc-url https://testnet-rpc.monad.xyz 2>/dev/null)
if [ "$CHAIN_ID" = "10143" ]; then
    print_status 0 "Chain ID correct (10143)"
else
    print_status 1 "Chain ID incorrect (expected 10143, got $CHAIN_ID)"
fi

echo ""
echo "6. Checking wallet configuration..."
cast wallet list | grep -q "multisig-deployer"
print_status $? "Deployer wallet configured"

if cast wallet list | grep -q "multisig-deployer"; then
    WALLET_ADDRESS=$(cast wallet address --account multisig-deployer 2>/dev/null)
    if [ ! -z "$WALLET_ADDRESS" ]; then
        print_status 0 "Wallet address accessible"
        echo "   Address: $WALLET_ADDRESS"
        
        BALANCE=$(cast balance $WALLET_ADDRESS --rpc-url https://testnet-rpc.monad.xyz 2>/dev/null)
        if [ ! -z "$BALANCE" ]; then
            BALANCE_ETH=$(echo $BALANCE | cast to-unit ether)
            if [ $(echo "$BALANCE_ETH > 0" | bc -l 2>/dev/null || echo "0") -eq 1 ]; then
                print_status 0 "Wallet has balance ($BALANCE_ETH MON)"
            else
                print_warning "Wallet balance is 0. Get tokens from faucet."
            fi
        fi
    fi
fi

echo ""
echo "7. Environment variables check..."
[ -f ".env" ]
print_status $? ".env file exists"

if [ -f ".env" ]; then
    grep -q "PRIVATE_KEY" .env
    print_status $? "PRIVATE_KEY configured in .env"
    
    grep -q "RPC_URL" .env
    print_status $? "RPC_URL configured in .env"
fi

echo ""
echo "8. Running basic tests..."
if [ -f "test/SetupTest.t.sol" ]; then
    forge test --match-path test/SetupTest.t.sol > /dev/null 2>&1
    print_status $? "Basic tests passing"
else
    print_warning "No setup tests found"
fi

echo ""
echo "=== Setup Verification Complete ==="
echo ""
echo "If all items show ✓, your environment is ready for MultiSigWallet development!"
echo "If any items show ✗, please review the setup instructions."
echo ""
EOF

chmod +x scripts/verify-setup.sh
```

### Run Final Verification

```bash
# Jalankan script verifikasi
./scripts/verify-setup.sh
```

### Setup Completed Checklist

Pastikan semua item berikut sudah completed:

#### Foundry Installation
- [ ] Forge installed dan working
- [ ] Cast installed dan working
- [ ] Anvil installed dan working

#### Project Setup
- [ ] Project created dengan template Monad
- [ ] foundry.toml configured untuk Solidity 0.8.26
- [ ] Dependencies installed (OpenZeppelin, forge-std)
- [ ] Remappings configured
- [ ] Directory structure ready

#### Environment Configuration
- [ ] .env file configured
- [ ] Environment variables set
- [ ] Network connectivity verified
- [ ] Chain ID correct (10143)

#### Wallet Management
- [ ] Deployer wallet created dan imported
- [ ] Wallet password secured
- [ ] Testnet tokens obtained dari faucet
- [ ] Balance sufficient untuk deployment

#### Verification
- [ ] Compilation works
- [ ] Basic tests pass
- [ ] Network operations work
- [ ] All verification scripts pass

### Troubleshooting Common Issues

#### Issue: Foundry commands not found
**Solution:**
```bash
# Check PATH
echo $PATH | grep foundry

# If not found, add to PATH
echo 'export PATH="$HOME/.foundry/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

#### Issue: OpenZeppelin import errors
**Solution:**
```bash
# Reinstall OpenZeppelin
forge install OpenZeppelin/openzeppelin-contracts --force

# Update remappings
echo "@openzeppelin/=lib/openzeppelin-contracts/" >> remappings.txt
```

#### Issue: Network connection timeout
**Solution:**
```bash
# Try alternative RPC endpoints atau wait dan retry
cast client --rpc-url https://testnet-rpc.monad.xyz

# Check internet connection
ping google.com
```

#### Issue: Wallet import fails
**Solution:**
```bash
# Make sure private key format is correct (starts with 0x)
# Use proper password (secure but memorable)
# Check keystore directory permissions
ls -la ~/.foundry/keystores/
```

### Next Steps

Setelah setup environment berhasil, Anda siap untuk:

1. **Membuat Smart Contracts** - Implement MultiSigWallet dan WalletGovToken
2. **Writing Tests** - Comprehensive testing untuk semua functionality
3. **Deployment** - Deploy ke Monad Testnet
4. **Verification** - Verify contracts di block explorer
5. **Interaction** - Interact dengan deployed contracts

Environment setup completed! Anda sekarang siap melanjutkan ke tahap pembuatan smart contract.