---
id: instalasi-foundry
title: "Part 1: Instalasi Foundry"
sidebar_label: "Part 1: Instalasi"
sidebar_position: 1
description: "Instalasi Foundry di Windows dan Mac, setup first project, dan memahami command-command dasar."
---

# Part 1: Instalasi Foundry

## 🎯 Tujuan Module

Setelah menyelesaikan module ini, Anda akan:
- ✅ Berhasil install Foundry di Windows/Mac
- ✅ Memahami foundry suite (forge, cast, anvil, chisel)
- ✅ Membuat first Foundry project
- ✅ Familiar dengan project structure
- ✅ Menjalankan basic commands

---

## 💡 Apa Itu Foundry?

### Analogi Sederhana: Foundry = Workshop Lengkap

Bayangkan Anda seorang pengrajin kayu:

**Tanpa Foundry (Manual):**
```
🪚 Punya gergaji (compiler) terpisah
🔨 Punya palu (testing tool) terpisah
📏 Punya meteran (gas checker) terpisah
🎨 Punya cat (deployer) terpisah

Problem: Banyak tools, ribet koordinasi
```

**Dengan Foundry (All-in-One Workshop):**
```
🏭 Satu workshop dengan semua tools:
   ⚒️  forge  = Main workbench (build, test, deploy)
   🔮 cast   = Swiss army knife (blockchain interactions)
   ⚙️  anvil  = Practice wood (local blockchain)
   ✂️  chisel = Quick sketching tool (Solidity REPL)

Benefit: Semua terintegrasi, super cepat!
```

### Kenapa Foundry Cepat?

**Hardhat (JavaScript):**
```javascript
// Test di JavaScript - butuh translation
describe("Counter", function() {
  it("should increment", async function() {
    await counter.increment(); // JS → EVM (slow)
  });
});
```

**Foundry (Solidity):**
```solidity
// Test langsung di Solidity - native!
function testIncrement() public {
    counter.increment(); // Direct EVM (FAST ⚡)
}
```

**Result:** Foundry **10-100x lebih cepat** karena tidak ada translation layer!

---

## 🪟 Instalasi di Windows

### Opsi 1: Foundryup via Git Bash (Recommended)

**Step 1: Install Git for Windows**

1. Download dari [https://git-scm.com/download/win](https://git-scm.com/download/win)
2. Install dengan settings default
3. Git Bash akan otomatis terinstall

**Step 2: Run Foundryup Installer**

Buka **Git Bash** (bukan CMD/PowerShell), lalu run:

```bash
curl -L https://foundry.paradigm.xyz | bash
```

**Output yang diharapkan:**
```
Downloading foundryup...
######################################################################## 100.0%
Installing foundryup...
Foundryup installed successfully!

Run 'foundryup' to install foundry.
```

**Step 3: Install Foundry**

Masih di Git Bash, run:

```bash
foundryup
```

**Proses instalasi (~2-3 menit):**
```
Installing foundry (version nightly-xxx)...
Downloading forge...
Downloading cast...
Downloading anvil...
Downloading chisel...

Foundry installed successfully!
```

**Step 4: Verify Installation**

```bash
forge --version
cast --version
anvil --version
chisel --version
```

**Expected output:**
```
forge 0.2.0 (xxx)
cast 0.2.0 (xxx)
anvil 0.2.0 (xxx)
chisel 0.2.0 (xxx)
```

✅ **Success!** Foundry sudah terinstall!

---

### Opsi 2: Foundryup via WSL (Windows Subsystem for Linux)

**Kapan pakai WSL?**
- Git Bash tidak berfungsi
- Ingin development environment seperti Linux
- Lebih nyaman dengan Linux commands

**Step 1: Enable WSL**

Buka **PowerShell as Administrator**, run:

```powershell
wsl --install
```

**Restart komputer** setelah instalasi selesai.

**Step 2: Install Ubuntu dari Microsoft Store**

1. Buka Microsoft Store
2. Search "Ubuntu"
3. Install "Ubuntu 22.04 LTS"
4. Launch Ubuntu dan setup username/password

**Step 3: Install Foundry di WSL**

Di Ubuntu terminal, run:

```bash
# Install foundryup
curl -L https://foundry.paradigm.xyz | bash

# Reload terminal
source ~/.bashrc

# Install foundry
foundryup
```

**Step 4: Verify**

```bash
forge --version
```

✅ **Success!** Foundry terinstall di WSL!

---

### Troubleshooting Windows:

**Error: `curl: command not found`**
```bash
# Pastikan menggunakan Git Bash, bukan CMD/PowerShell
# Atau install WSL
```

**Error: `Permission denied`**
```bash
# Run Git Bash as Administrator
# Right-click Git Bash → "Run as administrator"
```

**Error: Antivirus blocking**
```bash
# Temporary disable antivirus saat install
# Atau add exception untuk folder: C:\Users\<YourName>\.foundry
```

---

## 🍎 Instalasi di Mac

### Install via Homebrew (Recommended)

**Step 1: Check Homebrew**

Buka **Terminal**, check apakah sudah punya Homebrew:

```bash
brew --version
```

**Jika belum punya Homebrew**, install dulu:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

**Step 2: Install Foundryup**

```bash
curl -L https://foundry.paradigm.xyz | bash
```

**Step 3: Reload Terminal**

```bash
source ~/.zshrc
# Atau jika pakai bash:
source ~/.bashrc
```

**Step 4: Install Foundry**

```bash
foundryup
```

**Proses instalasi:**
```
Installing foundry (version nightly-xxx)...
⠋ Downloading binaries...
⠙ Installing forge, cast, anvil, chisel...
✓ Foundry installed successfully!
```

**Step 5: Verify Installation**

```bash
forge --version
cast --version
anvil --version
chisel --version
```

✅ **Success!** Foundry terinstall di Mac!

---

### Troubleshooting Mac:

**Error: `curl: command not found`**
```bash
# curl harusnya sudah built-in di Mac
# Jika tidak ada, install dengan:
brew install curl
```

**Error: Permission denied**
```bash
# Run dengan sudo jika diperlukan:
sudo foundryup
```

**Error di Apple Silicon (M1/M2/M3)**
```bash
# Install Rosetta 2 jika belum:
softwareupdate --install-rosetta

# Lalu install foundry normal
foundryup
```

---

## 🎨 Setup VS Code (Optional tapi Recommended)

### Install VS Code Extensions

1. **Solidity** by Juan Blanco
   - Syntax highlighting untuk .sol files
   - Inline compiler errors

2. **Solidity Visual Developer** by tintinweb
   - Code navigation
   - Function signatures

3. **Better TOML** by bungcip
   - Untuk edit foundry.toml dengan highlighting

### Install dari VS Code:

```
1. Buka VS Code
2. Klik Extensions icon (Ctrl+Shift+X)
3. Search "Solidity"
4. Install "Solidity" by Juan Blanco
5. Search "Solidity Visual Developer"
6. Install extension tersebut
7. Search "Better TOML"
8. Install extension tersebut
```

### Configure Solidity Extension

**File → Preferences → Settings → Search "Solidity"**

Set compiler version:
```
Solidity: Compiler Version = 0.8.30
```

✅ VS Code siap untuk Foundry development!

---

## 🏗️ Membuat First Foundry Project

### Step 1: Buat Folder Project

```bash
# Buat folder
mkdir foundry-tutorial
cd foundry-tutorial
```

### Step 2: Initialize Foundry Project

```bash
forge init
```

**Output:**
```
Initializing /path/to/foundry-tutorial...
Installing forge-std in /path/to/foundry-tutorial/lib/forge-std
    Installed forge-std v1.8.1
    Initialized forge project.
```

✅ **Project created!**

### Step 3: Explore Project Structure

```bash
ls -la
```

**Project structure:**
```
foundry-tutorial/
├── lib/
│   └── forge-std/          # Testing library (seperti npm packages)
├── script/
│   └── Counter.s.sol       # Deployment scripts
├── src/
│   └── Counter.sol         # Smart contracts
├── test/
│   └── Counter.t.sol       # Test files (*.t.sol)
├── .gitignore
├── foundry.toml            # Config file
└── README.md
```

**Penjelasan struktur:**

| Folder/File | Fungsi |
|------------|--------|
| `src/` | Smart contracts utama (.sol) |
| `test/` | Test files (*.t.sol) |
| `script/` | Deployment scripts (*.s.sol) |
| `lib/` | Dependencies (seperti node_modules) |
| `foundry.toml` | Config file (seperti hardhat.config.js) |
| `out/` | Compiled artifacts (auto-generated) |
| `cache/` | Cache files (auto-generated) |

---

## 🔍 Memahami Sample Files

### Counter.sol - Sample Contract

```bash
cat src/Counter.sol
```

```solidity
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract Counter {
    uint256 public number;

    function setNumber(uint256 newNumber) public {
        number = newNumber;
    }

    function increment() public {
        number++;
    }
}
```

**Simple counter contract:**
- State variable: `number`
- Function: `setNumber()` - set angka
- Function: `increment()` - tambah 1

### Counter.t.sol - Sample Test

```bash
cat test/Counter.t.sol
```

```solidity
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {Counter} from "../src/Counter.sol";

contract CounterTest is Test {
    Counter public counter;

    function setUp() public {
        counter = new Counter();
        counter.setNumber(0);
    }

    function test_Increment() public {
        counter.increment();
        assertEq(counter.number(), 1);
    }

    function testFuzz_SetNumber(uint256 x) public {
        counter.setNumber(x);
        assertEq(counter.number(), x);
    }
}
```

**Test highlights:**
- `setUp()` - Runs before each test (seperti beforeEach)
- `test_*` - Test functions (harus prefix "test")
- `assertEq(a, b)` - Assert a equals b
- `testFuzz_*` - Fuzz testing (Foundry generates random inputs!)

---

## ⚒️ Foundry Commands - Quick Tour

### 1. Compile Contract

```bash
forge build
```

**Output:**
```
[⠊] Compiling...
[⠒] Compiling 2 files with 0.8.30
[⠢] Solc 0.8.30 finished in 1.23s
Compiler run successful!
```

**Files created:**
- `out/Counter.sol/Counter.json` - ABI & bytecode

### 2. Run Tests

```bash
forge test
```

**Output:**
```
[⠊] Compiling...
No files changed, compilation skipped

Running 2 tests for test/Counter.t.sol:CounterTest
[PASS] testFuzz_SetNumber(uint256) (runs: 256, μ: 28613, ~: 28632)
[PASS] test_Increment() (gas: 28379)
Test result: ok. 2 passed; 0 failed; 0 skipped; finished in 18.53ms
```

✅ **All tests passed!**

### 3. Run Tests with Details

```bash
forge test -vv
```

`-vv` = verbosity level (more v's = more details)

**Verbosity levels:**
- `-v` - Show test names
- `-vv` - Show test names + logs
- `-vvv` - Show test names + logs + traces
- `-vvvv` - Show test names + logs + traces + setup traces

### 4. Test Specific File

```bash
forge test --match-path test/Counter.t.sol
```

### 5. Test Specific Function

```bash
forge test --match-test test_Increment
```

### 6. Gas Report

```bash
forge test --gas-report
```

**Output:**
```
| src/Counter.sol:Counter contract |                 |       |        |       |         |
|----------------------------------|-----------------|-------|--------|-------|---------|
| Deployment Cost                  | Deployment Size |       |        |       |         |
| 67017                            | 337             |       |        |       |         |
| Function Name                    | min             | avg   | median | max   | # calls |
| increment                        | 28379           | 28379 | 28379  | 28379 | 1       |
| setNumber                        | 22363           | 24613 | 22363  | 28613 | 257     |
```

📊 **Gas usage per function!**

---

## 🔮 Cast - Swiss Army Knife

Cast = Tools untuk interact dengan blockchain

### Basic Commands:

**1. Convert units:**
```bash
# Wei to Ether
cast to-unit 1000000000000000000 ether
# Output: 1.000000000000000000

# Ether to Wei
cast to-wei 1 ether
# Output: 1000000000000000000
```

**2. Get block number:**
```bash
cast block-number --rpc-url https://rpc.sepolia-api.lisk.com
# Output: 5123456
```

**3. Get ETH balance:**
```bash
cast balance 0xYourAddress --rpc-url https://rpc.sepolia-api.lisk.com
# Output: 1000000000000000000 (1 ETH)
```

**4. Call contract:**
```bash
cast call 0xContractAddress "number()" --rpc-url https://rpc.sepolia-api.lisk.com
# Output: 0x0000000000000000000000000000000000000000000000000000000000000042
```

---

## ⚙️ Anvil - Local Blockchain

Anvil = Local Ethereum node untuk testing

### Start Local Node:

```bash
anvil
```

**Output:**
```
                             _   _
                            (_) | |
      __ _   _ __  __   __  _  | |
     / _` | | '_ \ \ \ / / | | | |
    | (_| | | | | | \ V /  | | | |
     \__,_| |_| |_|  \_/   |_| |_|

Available Accounts
==================
(0) 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
(1) 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 (10000 ETH)
...

Private Keys
==================
(0) 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
...

Listening on 127.0.0.1:8545
```

🎯 **10 accounts dengan 10,000 ETH each!** Perfect untuk testing!

### Use Anvil for Testing:

**Terminal 1:**
```bash
anvil
```

**Terminal 2:**
```bash
# Deploy ke Anvil
forge script script/Counter.s.sol --rpc-url http://127.0.0.1:8545 --broadcast

# Test contract
forge test --rpc-url http://127.0.0.1:8545
```

---

## ✂️ Chisel - Solidity REPL

Chisel = Interactive Solidity console

### Start Chisel:

```bash
chisel
```

**Try commands:**
```solidity
➜ uint256 x = 42;
➜ x
Type: uint256
├ Hex: 0x2a
├ Hex (full word): 0x000000000000000000000000000000000000000000000000000000000000002a
└ Decimal: 42

➜ x + 8
Type: uint256
├ Hex: 0x32
└ Decimal: 50

➜ address addr = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266;
➜ addr
Type: address
└ 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
```

🎯 **Perfect untuk test syntax cepat tanpa compile!**

**Exit chisel:**
```
➜ !quit
```

---

## 📝 Foundry Config (foundry.toml)

### Basic Config:

```toml
[profile.default]
src = "src"
out = "out"
libs = ["lib"]
solc_version = "0.8.30"

# Optimizer settings
optimizer = true
optimizer_runs = 200

# Gas reports
gas_reports = ["*"]

# Remappings
remappings = [
    "forge-std/=lib/forge-std/src/"
]

# RPC endpoints
[rpc_endpoints]
lisk_sepolia = "https://rpc.sepolia-api.lisk.com"
mainnet = "https://eth.llamarpc.com"
```

**Config explained:**

| Setting | Fungsi |
|---------|--------|
| `src` | Folder untuk contracts |
| `out` | Folder untuk compiled output |
| `libs` | Folder untuk dependencies |
| `solc_version` | Solidity compiler version |
| `optimizer` | Enable gas optimization |
| `optimizer_runs` | Optimization level (200 = balanced) |
| `gas_reports` | Contracts to report gas |
| `remappings` | Import aliases |
| `rpc_endpoints` | Named RPC URLs |

---

## 🎯 Hands-on Exercise

### Challenge: Setup & Verify Installation

**Task 1: Create New Project**
```bash
mkdir my-first-foundry
cd my-first-foundry
forge init
```

**Task 2: Compile**
```bash
forge build
```

✅ Check: `out/` folder exists dengan compiled files

**Task 3: Run Tests**
```bash
forge test
```

✅ Check: "2 passed" muncul

**Task 4: Get Gas Report**
```bash
forge test --gas-report
```

✅ Check: Gas usage table muncul

**Task 5: Experiment with Chisel**
```bash
chisel
```

Try:
```solidity
➜ uint256 balance = 1000;
➜ balance * 2
➜ string memory name = "Foundry";
➜ name
➜ !quit
```

✅ Check: Bisa run Solidity code interactively

**Task 6: Start Anvil**
```bash
anvil
```

✅ Check: Local node running di port 8545

**Stop Anvil:** Press `Ctrl+C`

---

## ✅ Checklist: Ready for Next Module?

Sebelum lanjut ke Part 2, pastikan:

- [ ] Foundry terinstall (`forge --version` works)
- [ ] VS Code dengan Solidity extension (optional)
- [ ] Berhasil `forge init` project
- [ ] Berhasil `forge build` (compile)
- [ ] Berhasil `forge test` (all tests pass)
- [ ] Understand project structure (src, test, script)
- [ ] Familiar dengan basic commands (forge, cast, anvil, chisel)

**Semua checked?** ✅ Let's build real contracts!

---

## 📚 Command Cheat Sheet

```bash
# Project Setup
forge init                          # Create new project
forge install <github-repo>         # Install dependency

# Build & Compile
forge build                         # Compile contracts
forge clean                         # Remove build artifacts

# Testing
forge test                          # Run all tests
forge test -vv                      # Run with logs
forge test -vvvv                    # Run with traces
forge test --gas-report             # Show gas report
forge test --match-test <name>      # Run specific test
forge test --match-path <path>      # Run tests in file

# Coverage
forge coverage                      # Generate coverage report

# Formatting
forge fmt                           # Format all .sol files

# Local Blockchain
anvil                               # Start local node (localhost:8545)

# Interactions (Cast)
cast balance <address>              # Get ETH balance
cast call <address> "func()"        # Call view function
cast send <address> "func()"        # Send transaction
cast to-wei 1 ether                 # Convert to wei
cast to-unit <wei> ether            # Convert to ether

# Interactive Console
chisel                              # Start Solidity REPL
```

---

## 🐛 Troubleshooting Common Issues

### Error: `forge: command not found`

**Solution:**
```bash
# Reload terminal
source ~/.bashrc    # Linux/WSL
source ~/.zshrc     # Mac

# Or restart terminal completely
```

### Error: Compilation failed

**Solution:**
```bash
# Check Solidity version in contract
pragma solidity ^0.8.30;

# Match with foundry.toml
solc_version = "0.8.30"

# Clean and rebuild
forge clean
forge build
```

### Error: Test failed

**Solution:**
```bash
# Run with verbose output to see error
forge test -vvvv

# Check setUp() function runs properly
# Check assertion logic
```

### Error: Git not found (when installing dependencies)

**Solution:**
```bash
# Install git
# Windows: https://git-scm.com/download/win
# Mac: brew install git
# Linux: sudo apt install git
```

---

## 🎓 Summary

**Apa yang sudah dipelajari:**

✅ **Foundry Suite:**
- `forge` - Build, test, deploy
- `cast` - Blockchain interactions
- `anvil` - Local Ethereum node
- `chisel` - Solidity REPL

✅ **Installation:**
- Windows: Git Bash atau WSL
- Mac: Homebrew
- Verification: forge --version

✅ **Project Structure:**
- `src/` - Contracts
- `test/` - Tests (*.t.sol)
- `script/` - Deploy scripts
- `foundry.toml` - Config

✅ **Basic Commands:**
- `forge init` - New project
- `forge build` - Compile
- `forge test` - Run tests
- `anvil` - Local node

✅ **Lisk Sepolia Configuration:**
- RPC URL: https://rpc.sepolia-api.lisk.com
- Chain ID: 4202
- Block Explorer: https://sepolia-blockscout.lisk.com
- Faucet: https://sepolia-faucet.lisk.com

---

## 🚀 Next Steps

Sekarang environment sudah ready! Saatnya build real contract.

**Part 2 akan cover:**
- Smart contract development dengan real-world analogy
- SimpleBank contract (deposit, withdraw, transfer)
- Events, modifiers, error handling
- Best practices & security patterns

**[📖 Part 2: Smart Contract Development →](./02-smart-contract-dasar.md)**

---

**Happy Forging! ⚒️🔥**
