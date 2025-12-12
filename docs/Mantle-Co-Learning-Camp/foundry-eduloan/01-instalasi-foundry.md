---
id: instalasi-foundry-mantle
title: "Part 1: Instalasi Foundry"
sidebar_label: "Part 1: Instalasi"
sidebar_position: 1
description: "Instalasi Foundry di Windows dan Mac, setup VS Code, dan membuat project pertama."
---

# Part 1: Instalasi Foundry

## 🎯 Tujuan

Setelah menyelesaikan bagian ini, Anda akan:
- ✅ Berhasil install Foundry di komputer Anda
- ✅ Memahami Foundry Suite (forge, cast, anvil, chisel)
- ✅ Setup VS Code untuk Solidity development
- ✅ Membuat project Foundry pertama
- ✅ Familiar dengan basic commands

---

## 💡 Apa Itu Foundry?

### Analogi: Foundry = Workshop Lengkap

Bayangkan Anda seorang tukang kayu:

**Tanpa Foundry (Pakai tools terpisah):**
```
🪚 Gergaji (compiler) → beli sendiri
🔨 Palu (tester) → beli sendiri
📏 Meteran (gas checker) → beli sendiri
🎨 Cat (deployer) → beli sendiri

Problem: Banyak tools, ribet koordinasi!
```

**Dengan Foundry (Workshop all-in-one):**
```
🏭 Satu workshop lengkap dengan:
   ⚒️  forge  → Build, test, deploy (main tool)
   🔮 cast   → Interact dengan blockchain
   ⚙️  anvil  → Local blockchain untuk testing
   ✂️  chisel → Solidity REPL untuk eksperimen

Benefit: Semua terintegrasi, super cepat!
```

### Foundry Suite

| Tool | Fungsi | Analogi |
|------|--------|---------|
| **forge** | Compile, test, deploy | Mesin utama di workshop |
| **cast** | Query blockchain, kirim transaksi | Swiss army knife |
| **anvil** | Local Ethereum node | Kayu latihan (bisa dibuang) |
| **chisel** | Interactive Solidity REPL | Sketsa cepat sebelum build |

---

## 🪟 Instalasi di Windows

### Opsi 1: Git Bash (Recommended untuk Pemula)

**Step 1: Install Git for Windows**

1. Download dari [https://git-scm.com/download/win](https://git-scm.com/download/win)
2. Install dengan settings default
3. Pastikan "Git Bash" tercentang

**Step 2: Buka Git Bash**

Cari "Git Bash" di Start Menu dan buka.

**Step 3: Install Foundryup**

Copy-paste command ini di Git Bash:

```bash
curl -L https://foundry.paradigm.xyz | bash
```

**Output yang diharapkan:**
```
Downloading foundryup...
######################################################################## 100.0%
Installing foundryup...

Detected your preferred shell is bash and added foundryup to PATH.
Run 'source /c/Users/YourName/.bashrc' or start a new terminal session to use foundryup.

Then, simply run 'foundryup' to install Foundry.
```

**Step 4: Reload Terminal**

```bash
source ~/.bashrc
```

Atau tutup Git Bash dan buka lagi.

**Step 5: Install Foundry**

```bash
foundryup
```

**Proses instalasi (~2-3 menit):**
```
foundryup: installing foundry (version nightly-xxx)
foundryup: downloading latest forge, cast, anvil, and chisel
######################################################################### 100.0%
foundryup: downloading manpages
######################################################################### 100.0%
foundryup: installed - forge 0.2.0
foundryup: installed - cast 0.2.0
foundryup: installed - anvil 0.2.0
foundryup: installed - chisel 0.2.0
foundryup: done!
```

**Step 6: Verifikasi Instalasi**

```bash
forge --version
```

**Output:**
```
forge 0.2.0 (xxxxxxx 2024-xx-xx)
```

✅ **Berhasil!** Foundry terinstall di Windows!

---

### Opsi 2: WSL (Windows Subsystem for Linux)

**Kapan pakai WSL?**
- Git Bash bermasalah
- Ingin environment Linux yang lebih lengkap
- Sudah familiar dengan Linux

**Step 1: Enable WSL**

Buka **PowerShell sebagai Administrator**, run:

```powershell
wsl --install
```

**Restart komputer** setelah selesai.

**Step 2: Install Ubuntu**

1. Buka Microsoft Store
2. Search "Ubuntu 22.04 LTS"
3. Install dan Launch
4. Setup username & password

**Step 3: Install Foundry di WSL**

Di Ubuntu terminal:

```bash
# Install foundryup
curl -L https://foundry.paradigm.xyz | bash

# Reload terminal
source ~/.bashrc

# Install foundry
foundryup
```

**Step 4: Verifikasi**

```bash
forge --version
```

✅ **Berhasil!** Foundry terinstall di WSL!

---

### Troubleshooting Windows

**Error: `curl: command not found`**
```bash
# Pastikan menggunakan Git Bash, bukan CMD atau PowerShell
# Atau install WSL
```

**Error: `Permission denied`**
```bash
# Run Git Bash sebagai Administrator
# Right-click Git Bash → "Run as administrator"
```

**Error: Antivirus blocking**
```bash
# Temporary disable antivirus saat install
# Atau tambah exception untuk folder: C:\Users\YourName\.foundry
```

**Error: `forge: command not found` setelah install**
```bash
# Reload terminal
source ~/.bashrc

# Atau restart Git Bash/WSL
```

---

## 🍎 Instalasi di Mac

### Step 1: Check Homebrew

Buka **Terminal**, cek apakah Homebrew sudah terinstall:

```bash
brew --version
```

**Jika belum ada**, install Homebrew dulu:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### Step 2: Install Foundryup

```bash
curl -L https://foundry.paradigm.xyz | bash
```

### Step 3: Reload Terminal

```bash
source ~/.zshrc
# Atau jika pakai bash:
source ~/.bashrc
```

### Step 4: Install Foundry

```bash
foundryup
```

### Step 5: Verifikasi

```bash
forge --version
cast --version
anvil --version
chisel --version
```

**Output:**
```
forge 0.2.0 (xxxxxxx)
cast 0.2.0 (xxxxxxx)
anvil 0.2.0 (xxxxxxx)
chisel 0.2.0 (xxxxxxx)
```

✅ **Berhasil!** Foundry terinstall di Mac!

---

### Troubleshooting Mac

**Error di Apple Silicon (M1/M2/M3)**
```bash
# Install Rosetta 2 jika belum
softwareupdate --install-rosetta

# Lalu install foundry
foundryup
```

**Error: Permission denied**
```bash
# Coba dengan sudo
sudo foundryup
```

---

## 🎨 Setup VS Code

### Install Extensions

1. Buka VS Code
2. Klik icon Extensions (Ctrl+Shift+X atau Cmd+Shift+X)
3. Install extensions berikut:

**Wajib:**
- **Solidity** by Juan Blanco
  - Syntax highlighting
  - Compiler errors inline
  - Auto-completion

**Recommended:**
- **Solidity Visual Developer** by tintinweb
  - Code navigation
  - Function signatures

- **Better TOML** by bungcip
  - Untuk edit `foundry.toml`

### Configure Solidity Extension

1. File → Preferences → Settings
2. Search "Solidity"
3. Set compiler version:

```
Solidity: Compile Using Remote Version: v0.8.30
```

✅ VS Code siap untuk Foundry development!

---

## 🏗️ Membuat Project Pertama

### Step 1: Buat Folder

```bash
# Buat folder project
mkdir foundry-test
cd foundry-test
```

### Step 2: Initialize Project

```bash
forge init
```

**Output:**
```
Initializing /path/to/foundry-test...
Installing forge-std in /path/to/foundry-test/lib/forge-std
    Installed forge-std v1.8.1
    Initialized forge project.
```

### Step 3: Lihat Struktur Project

```bash
ls -la
```

**Struktur folder:**
```
foundry-test/
├── lib/                    # Dependencies (seperti node_modules)
│   └── forge-std/          # Foundry standard library
├── script/                 # Deployment scripts
│   └── Counter.s.sol
├── src/                    # Smart contracts
│   └── Counter.sol
├── test/                   # Test files
│   └── Counter.t.sol
├── .gitignore
├── foundry.toml            # Config file
└── README.md
```

**Penjelasan:**

| Folder/File | Fungsi |
|-------------|--------|
| `src/` | Smart contracts utama (*.sol) |
| `test/` | Test files (*.t.sol) |
| `script/` | Deployment scripts (*.s.sol) |
| `lib/` | Dependencies |
| `foundry.toml` | Konfigurasi project |

### Step 4: Compile

```bash
forge build
```

**Output:**
```
[⠊] Compiling...
[⠒] Compiling 27 files with Solc 0.8.30
[⠢] Solc 0.8.30 finished in 2.34s
Compiler run successful!
```

### Step 5: Run Tests

```bash
forge test
```

**Output:**
```
[⠊] Compiling...
No files changed, compilation skipped

Ran 2 tests for test/Counter.t.sol:CounterTest
[PASS] testFuzz_SetNumber(uint256) (runs: 256, μ: 31245, ~: 31288)
[PASS] test_Increment() (gas: 31303)
Suite result: ok. 2 passed; 0 failed; 0 skipped; finished in 18.45ms
```

✅ **Project berhasil dibuat!**

---

## ⚒️ Basic Commands

### Compile

```bash
forge build           # Compile semua contracts
forge build --sizes   # Compile + tampilkan ukuran contract
forge clean           # Hapus build artifacts
```

### Test

```bash
forge test            # Run semua tests
forge test -vv        # Dengan logs
forge test -vvvv      # Dengan detailed traces
forge test --gas-report   # Dengan gas report
```

### Local Blockchain

```bash
anvil                 # Start local node di port 8545
```

### Interactive Console

```bash
chisel                # Solidity REPL
```

**Contoh di Chisel:**
```solidity
➜ uint256 x = 42;
➜ x * 2
Type: uint256
└ Decimal: 84

➜ !quit              # Exit chisel
```

### Convert Units (Cast)

```bash
# Wei ke Ether
cast to-unit 1000000000000000000 ether
# Output: 1.000000000000000000

# Ether ke Wei
cast to-wei 1 ether
# Output: 1000000000000000000
```

---

## 🎯 Hands-on: Verifikasi Instalasi

Pastikan semua sudah berfungsi dengan mengerjakan tasks berikut:

### Task 1: Check Versions

```bash
forge --version
cast --version
anvil --version
chisel --version
```

✅ Semua menampilkan version number

### Task 2: Create & Build Project

```bash
mkdir verify-foundry
cd verify-foundry
forge init
forge build
```

✅ "Compiler run successful!"

### Task 3: Run Tests

```bash
forge test
```

✅ "2 passed; 0 failed"

### Task 4: Coba Chisel

```bash
chisel
```

Di dalam chisel:
```solidity
➜ string memory name = "EduLoan";
➜ name
Type: string
└ "EduLoan"

➜ uint256 amount = 1 ether;
➜ amount
Type: uint256
└ Decimal: 1000000000000000000

➜ !quit
```

✅ Bisa run Solidity interaktif

### Task 5: Start Anvil

```bash
anvil
```

✅ Local node running dengan 10 test accounts

**Stop Anvil:** Tekan `Ctrl+C`

---

## ✅ Checklist Sebelum Lanjut

Sebelum ke Part 2, pastikan:

- [ ] Foundry terinstall (`forge --version` berhasil)
- [ ] VS Code dengan Solidity extension
- [ ] Berhasil `forge init` project
- [ ] Berhasil `forge build` (compile)
- [ ] Berhasil `forge test` (all passed)
- [ ] Bisa menggunakan `chisel`
- [ ] Bisa menjalankan `anvil`

**Semua checked?** ✅ Lanjut ke Part 2!

---

## 📚 Command Cheat Sheet

```bash
# === Project Setup ===
forge init                    # Create new project
forge init --template <repo>  # From template

# === Build ===
forge build                   # Compile
forge build --sizes           # With contract sizes
forge clean                   # Clean artifacts

# === Testing ===
forge test                    # Run all tests
forge test -vv                # With logs
forge test -vvvv              # With traces
forge test --gas-report       # Gas report
forge test --match-test <name>    # Specific test
forge test --match-contract <name> # Specific contract

# === Coverage ===
forge coverage                # Test coverage report

# === Local Node ===
anvil                         # Start local blockchain

# === Interactive ===
chisel                        # Solidity REPL

# === Utilities ===
cast to-wei 1 ether           # Convert to wei
cast to-unit <wei> ether      # Convert to ether
cast balance <address>        # Get ETH balance

# === Format ===
forge fmt                     # Format all .sol files
```

---

## 🚀 Next: Setup EduLoan Project

Foundry sudah terinstall! Saatnya setup project untuk EduLoan.

**Part 2 akan cover:**
- Membuat Foundry project untuk EduLoan
- Copy EduLoan contract dari challenge
- Compile dan inspect contract
- Testing manual dengan Chisel

**[📖 Part 2: Setup EduLoan Project →](./02-setup-eduloan-project.md)**

---

**Happy Forging! ⚒️**
