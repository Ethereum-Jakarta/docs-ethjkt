---
id: circom-installation
title: "Panduan Instalasi dan Kompilasi Circom"
sidebar_label: "📦 Instalasi Circom"
sidebar_position: 6.1
description: "Panduan lengkap instalasi Circom compiler dan snarkjs untuk development Zero-Knowledge circuits di Windows, macOS, dan Linux."
---

# Panduan Instalasi dan Kompilasi Circom

## Overview

Circom adalah Domain Specific Language (DSL) untuk menulis arithmetic circuits yang dapat digunakan dalam Zero-Knowledge proofs. Dokumentasi ini akan memandu Anda melalui proses instalasi lengkap Circom compiler dan tools yang diperlukan.

:::info **Apa itu Circom?**
Circom memungkinkan developer untuk:
- Menulis arithmetic circuits dalam syntax yang familiar
- Generate R1CS (Rank-1 Constraint System) 
- Create witness computation programs
- Integrate dengan proving systems seperti Groth16
:::

---

## Prerequisites

Sebelum memulai instalasi Circom, pastikan sistem Anda memiliki:

### 1. Node.js dan npm
```bash
# Check jika sudah terinstall
node --version  # harus >= 16.0.0
npm --version   # harus >= 8.0.0

# Jika belum terinstall:
# - Windows: Download dari https://nodejs.org
# - macOS: brew install node
# - Linux: sudo apt install nodejs npm
```

### 2. Git
```bash
# Check instalasi Git
git --version

# Install Git jika belum ada:
# Windows: Download dari https://git-scm.com
# macOS: xcode-select --install
# Linux: sudo apt install git
```

### 3. Rust Toolchain (Required for building from source)
```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source ~/.cargo/env

# Verify installation
rustc --version
cargo --version
```

### 4. Build Tools (Platform Specific)

**Windows:**
```bash
# Option 1: Visual Studio Build Tools (Recommended)
# Download dari: https://visualstudio.microsoft.com/visual-cpp-build-tools/
# Install "C++ build tools" workload

# Option 2: Via npm
npm install -g windows-build-tools

# Option 3: WSL2 (Highly Recommended)
wsl --install -d Ubuntu-22.04
```

**macOS:**
```bash
# Install Xcode Command Line Tools
xcode-select --install

# Install Homebrew jika belum ada
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install build-essential curl libssl-dev pkg-config
```

**Linux (CentOS/RHEL/Fedora):**
```bash
sudo yum groupinstall "Development Tools"
sudo yum install openssl-devel curl
```

---

## Instalasi Circom

### Metode 1: Install dari Pre-compiled Binary (Recommended)

**Linux (Ubuntu/Debian):**
```bash
# Download dan install Circom binary
wget https://github.com/iden3/circom/releases/download/v2.1.8/circom-linux-amd64
chmod +x circom-linux-amd64
sudo mv circom-linux-amd64 /usr/local/bin/circom

# Verify instalasi
circom --version
```

**macOS:**
```bash
# Intel Mac
curl -sSfL https://github.com/iden3/circom/releases/download/v2.1.8/circom-macos-amd64 -o /tmp/circom
chmod +x /tmp/circom
sudo mv /tmp/circom /usr/local/bin

# Apple Silicon (M1/M2)
curl -sSfL https://github.com/iden3/circom/releases/download/v2.1.8/circom-macos-arm64 -o /tmp/circom
chmod +x /tmp/circom
sudo mv /tmp/circom /usr/local/bin

# Verify instalasi
circom --version
```

**Windows (Native):**
```powershell
# Download dari GitHub Releases
# https://github.com/iden3/circom/releases/download/v2.1.8/circom-windows.exe

# Via PowerShell (Admin)
Invoke-WebRequest -Uri "https://github.com/iden3/circom/releases/download/v2.1.8/circom-windows.exe" -OutFile "C:\Windows\System32\circom.exe"

# Verify instalasi
circom --version
```

**Windows (WSL2 - Recommended):**
```bash
# Dalam WSL2 terminal (Ubuntu)
wget https://github.com/iden3/circom/releases/download/v2.1.8/circom-linux-amd64
chmod +x circom-linux-amd64
sudo mv circom-linux-amd64 /usr/local/bin/circom

# Verify instalasi
circom --version
```

### Metode 2: Build from Source (All Platforms)

**1. Clone Repository:**
```bash
git clone https://github.com/iden3/circom.git
cd circom
```

**2. Build Circom:**

**Linux/macOS:**
```bash
# Build release version
cargo build --release

# Install to system PATH
cargo install --path circom

# Or copy binary manually
sudo cp target/release/circom /usr/local/bin/
```

**Windows (Native):**
```powershell
# Build dalam Command Prompt atau PowerShell
cargo build --release

# Copy binary ke system PATH
copy target\release\circom.exe C:\Windows\System32\
```

**3. Verify Installation:**
```bash
# Check Circom version
circom --version
# Expected output: circom compiler 2.1.8
```

---

## Instalasi snarkjs

snarkjs adalah JavaScript library untuk bekerja dengan zkSNARKs dan Circom circuits.

### Global Installation
```bash
# Install snarkjs globally
npm install -g snarkjs@latest

# Verify instalasi
snarkjs --version
# Expected output: snarkjs@0.7.3
```

### Project Installation
```bash
# Install locally dalam project (recommended untuk production)
npm install snarkjs

# Install sebagai dev dependency
npm install --save-dev snarkjs

# Verify dalam project
npx snarkjs --version
```

### Platform-Specific Notes

**Windows Native:**
```powershell
# Jika menggunakan PowerShell, enable execution policy
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Install global
npm install -g snarkjs@latest
```

**macOS:**
```bash
# Jika ada permission error
sudo npm install -g snarkjs@latest

# Atau gunakan nvm untuk avoid permission issues
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install node
npm install -g snarkjs@latest
```

**Linux:**
```bash
# Ubuntu/Debian
sudo npm install -g snarkjs@latest

# Atau gunakan node version manager
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install node
npm install -g snarkjs@latest
```

---

## Setup Development Environment

### 1. Create Project Structure

```bash
# Create project directory
mkdir zk-age-verification
cd zk-age-verification

# Create folder structure sesuai dengan project structure
mkdir -p circuits
mkdir -p circuits/build
mkdir -p scripts  
mkdir -p public/circuits
mkdir -p src/lib

# Project structure final:
# zk-age-verification/
# ├── circuits/
# │   ├── build/              # Compiled outputs
# │   └── ageVerification.circom
# ├── scripts/
# │   └── compile-circuit.sh  # Compilation scripts
# ├── public/circuits/        # Frontend assets
# ├── src/
# │   └── lib/               # ZK proof utilities
# └── package.json
```

### 2. Initialize npm Project

```bash
# Initialize package.json
npm init -y

# Install dependencies
npm install snarkjs circomlib

# Install development dependencies
npm install --save-dev @types/node typescript

# Update package.json dengan scripts
cat << 'EOF' > package.json
{
  "name": "zk-age-verification",
  "version": "1.0.0",
  "description": "Zero-Knowledge Age Verification using Circom",
  "main": "index.js",
  "scripts": {
    "compile-circuit": "./scripts/compile-circuit.sh ageVerification",
    "test-circuit": "node scripts/test-circuit.js",
    "clean": "rm -rf circuits/build/*"
  },
  "keywords": ["zero-knowledge", "circom", "age-verification"],
  "author": "Your Name",
  "license": "MIT",
  "dependencies": {
    "snarkjs": "^0.7.3",
    "circomlib": "^2.0.5"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0"
  }
}
EOF
```

---

## Test Circuit: Hello Circom

Mari test instalasi dengan circuit sederhana:

### 1. Create Test Circuit

**`circuits/test.circom`:**
```circom
pragma circom 2.0.0;

// Simple circuit to test installation
template HelloCircom() {
    signal input a;
    signal input b;
    signal output c;

    // Constraint: c = a * b
    c <== a * b;
}

// Main component
component main = HelloCircom();
```

### 2. Compile Test Circuit

```bash
# Navigate to project root
cd zk-circuits-project

# Compile circuit
circom circuits/test.circom --r1cs --wasm --sym -o circuits/build/

# Expected output:
# template instances: 1
# non-linear constraints: 1
# linear constraints: 0
# public inputs: 0
# private inputs: 2
# public outputs: 1
# wires: 4
# labels: 4
```

### 3. Verify Compilation Output

```bash
# Check generated files
ls circuits/build/test_js/
# Expected files:
# - test.wasm          # WebAssembly witness calculator
# - test_js/           # JavaScript witness calculator
# - test.r1cs          # R1CS constraint system
# - test.sym           # Symbol mapping

echo "✅ Circom installation berhasil!"
```

---

## Compilation Script

Buat script otomatis untuk kompilasi circuit:

**`scripts/compile-circuit.sh`:**
```bash
#!/bin/bash

# Colors untuk output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function untuk print dengan warna
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if circuit name provided
if [ -z "$1" ]; then
    print_error "Usage: ./compile-circuit.sh <circuit-name>"
    print_error "Example: ./compile-circuit.sh ageVerification"
    exit 1
fi

CIRCUIT_NAME=$1
CIRCUIT_FILE="circuits/${CIRCUIT_NAME}.circom"
BUILD_DIR="circuits/build"

# Check if circuit file exists
if [ ! -f "$CIRCUIT_FILE" ]; then
    print_error "Circuit file not found: $CIRCUIT_FILE"
    exit 1
fi

print_status "Starting compilation for $CIRCUIT_NAME..."

# Create build directory
mkdir -p $BUILD_DIR

# Step 1: Compile circuit
print_status "Step 1: Compiling circuit..."
circom $CIRCUIT_FILE --r1cs --wasm --sym -o $BUILD_DIR

if [ $? -ne 0 ]; then
    print_error "Circuit compilation failed"
    exit 1
fi

# Step 2: Generate powers of tau (trusted setup)
print_status "Step 2: Generating powers of tau..."
PTAU_FILE="$BUILD_DIR/pot14_0000.ptau"

if [ ! -f "$PTAU_FILE" ]; then
    snarkjs powersoftau new bn128 14 $PTAU_FILE -v
    
    if [ $? -ne 0 ]; then
        print_error "Powers of tau generation failed"
        exit 1
    fi
fi

# Step 3: Contribute to ceremony
print_status "Step 3: Contributing to ceremony..."
PTAU_CONTRIB="$BUILD_DIR/pot14_0001.ptau"

if [ ! -f "$PTAU_CONTRIB" ]; then
    snarkjs powersoftau contribute $PTAU_FILE $PTAU_CONTRIB \
        --name="First contribution" -v
    
    if [ $? -ne 0 ]; then
        print_error "Ceremony contribution failed"
        exit 1
    fi
fi

# Step 4: Phase 2 preparation
print_status "Step 4: Preparing phase 2..."
PTAU_FINAL="$BUILD_DIR/pot14_final.ptau"

if [ ! -f "$PTAU_FINAL" ]; then
    snarkjs powersoftau prepare phase2 $PTAU_CONTRIB $PTAU_FINAL -v
    
    if [ $? -ne 0 ]; then
        print_error "Phase 2 preparation failed"
        exit 1
    fi
fi

# Step 5: Generate zkey
print_status "Step 5: Generating zkey..."
ZKEY_0="$BUILD_DIR/${CIRCUIT_NAME}_0000.zkey"

if [ ! -f "$ZKEY_0" ]; then
    snarkjs groth16 setup "$BUILD_DIR/${CIRCUIT_NAME}.r1cs" $PTAU_FINAL $ZKEY_0
    
    if [ $? -ne 0 ]; then
        print_error "zkey generation failed"
        exit 1
    fi
fi

# Step 6: Contribute to phase 2
print_status "Step 6: Contributing to phase 2..."
ZKEY_FINAL="$BUILD_DIR/${CIRCUIT_NAME}_0001.zkey"

if [ ! -f "$ZKEY_FINAL" ]; then
    snarkjs zkey contribute $ZKEY_0 $ZKEY_FINAL \
        --name="First phase2 contribution" -v
    
    if [ $? -ne 0 ]; then
        print_error "Phase 2 contribution failed"
        exit 1
    fi
fi

# Step 7: Export verification key
print_status "Step 7: Exporting verification key..."
VKEY_FILE="$BUILD_DIR/verification_key.json"

snarkjs zkey export verificationkey $ZKEY_FINAL $VKEY_FILE

if [ $? -ne 0 ]; then
    print_error "Verification key export failed"
    exit 1
fi

# Step 8: Copy files untuk frontend
print_status "Step 8: Copying files for frontend..."
cp "$BUILD_DIR/${CIRCUIT_NAME}_js/${CIRCUIT_NAME}.wasm" "public/circuits/"
cp "$ZKEY_FINAL" "public/circuits/"
cp "$VKEY_FILE" "public/circuits/"

print_status "✅ Circuit compilation completed successfully!"
print_status "Generated files:"
print_status "  - public/circuits/${CIRCUIT_NAME}.wasm"
print_status "  - public/circuits/${CIRCUIT_NAME}_0001.zkey" 
print_status "  - public/circuits/verification_key.json"
```

**Make Script Executable:**
```bash
chmod +x scripts/compile-circuit.sh
```

---

## Age Verification Circuit

Sekarang mari implement Age Verification circuit untuk project ZK:

**`circuits/ageVerification.circom`:**
```circom
pragma circom 2.0.0;

include "circomlib/circuits/comparators.circom";
include "circomlib/circuits/poseidon.circom";

// Circuit untuk membuktikan umur >= 18 tahun
template AgeVerification() {
    // Private inputs (tidak akan di-reveal)
    signal private input birthDay;    // 1-31
    signal private input birthMonth;  // 1-12  
    signal private input birthYear;   // e.g., 1995
    signal private input salt;        // Random salt
    
    // Public inputs (akan di-reveal)
    signal input currentYear;  // e.g., 2024
    signal input currentMonth; // e.g., 12
    signal input currentDay;   // e.g., 15
    
    // Public output
    signal output isAdult;     // 1 if age >= 18, 0 otherwise
    signal output commitment;  // Hash commitment untuk privacy
    
    // Components untuk kalkulasi
    component lt1 = LessThan(8);  // For year comparison
    component lt2 = LessThan(8);  // For month comparison  
    component lt3 = LessThan(8);  // For day comparison
    
    // Hash component untuk commitment
    component hasher = Poseidon(4);
    hasher.inputs[0] <== birthDay;
    hasher.inputs[1] <== birthMonth;
    hasher.inputs[2] <== birthYear;
    hasher.inputs[3] <== salt;
    commitment <== hasher.out;
    
    // Calculate age in years
    signal yearDiff;
    yearDiff <== currentYear - birthYear;
    
    // Check if birthday has passed this year
    signal monthCheck;
    signal dayCheck;
    signal birthdayPassed;
    
    // Month comparison: currentMonth >= birthMonth
    lt1.in[0] <== birthMonth - 1;
    lt1.in[1] <== currentMonth;
    monthCheck <== lt1.out;
    
    // Day comparison: if same month, currentDay >= birthDay
    lt2.in[0] <== birthDay - 1;
    lt2.in[1] <== currentDay;
    dayCheck <== lt2.out;
    
    // Birthday passed if (month > birth_month) OR (month == birth_month AND day >= birth_day)
    signal sameMonth;
    sameMonth <== IsEqual()([currentMonth, birthMonth]);
    birthdayPassed <== monthCheck + sameMonth * dayCheck - monthCheck * sameMonth;
    
    // Actual age calculation
    signal actualAge;
    actualAge <== yearDiff - 1 + birthdayPassed;
    
    // Check if age >= 18
    lt3.in[0] <== 17;
    lt3.in[1] <== actualAge;
    isAdult <== lt3.out;
    
    // Constraints untuk memastikan input valid
    // Birth day: 1-31
    component dayRange = Range(8);
    dayRange.in <== birthDay;
    dayRange.min <== 1;
    dayRange.max <== 31;
    
    // Birth month: 1-12
    component monthRange = Range(8);
    monthRange.in <== birthMonth;
    monthRange.min <== 1;
    monthRange.max <== 12;
    
    // Birth year: reasonable range (1900-2010)
    component yearRange = Range(16);
    yearRange.in <== birthYear;
    yearRange.min <== 1900;
    yearRange.max <== 2010;
}

// Helper template untuk range checking
template Range(n) {
    signal input in;
    signal input min;
    signal input max;
    
    component lt1 = LessThan(n);
    component lt2 = LessThan(n);
    
    lt1.in[0] <== min - 1;
    lt1.in[1] <== in;
    lt1.out === 1;
    
    lt2.in[0] <== in;
    lt2.in[1] <== max + 1;
    lt2.out === 1;
}

// Helper template untuk equality check
template IsEqual() {
    signal input in[2];
    signal output out;
    
    component eq = IsZero();
    eq.in <== in[1] - in[0];
    out <== eq.out;
}

// Main component
component main = AgeVerification();
```

---

## Compile Age Verification Circuit

```bash
# Compile age verification circuit
./scripts/compile-circuit.sh ageVerification

# Expected output:
# [INFO] Starting compilation for ageVerification...
# [INFO] Step 1: Compiling circuit...
# [INFO] Step 2: Generating powers of tau...
# [INFO] Step 3: Contributing to ceremony...
# [INFO] Step 4: Preparing phase 2...
# [INFO] Step 5: Generating zkey...
# [INFO] Step 6: Contributing to phase 2...
# [INFO] Step 7: Exporting verification key...
# [INFO] Step 8: Copying files for frontend...
# [INFO] ✅ Circuit compilation completed successfully!
```

---

## Troubleshooting Common Issues

### Issue 1: "circom: command not found"

**Problem:** Circom tidak ditemukan di PATH

**Solution:**

**Linux/macOS:**
```bash
# Check PATH
echo $PATH

# Find circom binary
which circom

# Add to PATH jika perlu
export PATH=$PATH:/usr/local/bin

# Make permanent (add to ~/.bashrc or ~/.zshrc)
echo 'export PATH=$PATH:/usr/local/bin' >> ~/.bashrc
source ~/.bashrc
```

**Windows:**
```powershell
# Check PATH
echo $env:PATH

# Add to system PATH via PowerShell (Admin)
$env:PATH += ";C:\Windows\System32"

# Or via System Properties > Environment Variables
# Add C:\Windows\System32 to System PATH
```

### Issue 2: "error while loading shared libraries" (Linux)

**Problem:** Missing library dependencies

**Solution:**
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install build-essential libgmp-dev libssl-dev

# CentOS/RHEL/Fedora
sudo yum install gcc gcc-c++ openssl-devel gmp-devel

# Rebuild jika perlu
cargo clean && cargo build --release
```

### Issue 3: Memory Issues during Compilation

**Problem:** Out of memory saat compile circuit besar

**Solution:**

**Linux:**
```bash
# Check available memory
free -h

# Increase swap space
sudo dd if=/dev/zero of=/swapfile bs=1024 count=2097152
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Or use smaller powers of tau
snarkjs powersoftau new bn128 12 pot12_0000.ptau  # Instead of 14
```

**macOS:**
```bash
# Increase memory limit untuk process
ulimit -v 8388608  # 8GB virtual memory limit

# Monitor memory usage
top -o MEM
```

**Windows:**
```powershell
# Increase virtual memory via System Properties
# Control Panel > System > Advanced > Performance Settings > Advanced > Virtual Memory
```

### Issue 4: Windows Compilation Issues

**Problem:** Build tools missing pada Windows

**Solution:**

**Option 1: Visual Studio Build Tools**
```powershell
# Download dari: https://visualstudio.microsoft.com/visual-cpp-build-tools/
# Install "C++ build tools" workload
```

**Option 2: WSL2 (Recommended)**
```powershell
# Enable WSL2
wsl --install -d Ubuntu-22.04

# Install dalam WSL environment
wsl
# Continue dengan Linux instructions
```

**Option 3: Via npm**
```powershell
# Install build tools via npm
npm install -g windows-build-tools

# May require admin privileges
```

### Issue 5: snarkjs Version Conflicts

**Problem:** Incompatible snarkjs version

**Solution:**
```bash
# Check version
snarkjs --version

# Uninstall dan reinstall
npm uninstall -g snarkjs
npm install -g snarkjs@0.7.3

# Or use specific version locally
npm install snarkjs@0.7.3

# Clear npm cache jika ada issue
npm cache clean --force
```

### Issue 6: circomlib Import Errors

**Problem:** Cannot find circomlib templates

**Solution:**
```bash
# Install circomlib locally
npm install circomlib

# Check installation
ls node_modules/circomlib/circuits/

# In circuit file, use relative path:
include "node_modules/circomlib/circuits/comparators.circom";

# Or install globally
npm install -g circomlib
```

### Issue 7: Rust Compilation Errors

**Problem:** Rust build fails

**Solution:**
```bash
# Update Rust toolchain
rustup update

# Install specific target (if needed)
rustup target add x86_64-unknown-linux-gnu

# Clean dan rebuild
cargo clean
cargo build --release

# Check Rust version compatibility
rustc --version  # Should be >= 1.70.0
```

### Issue 8: Permission Denied (Linux/macOS)

**Problem:** Cannot write to /usr/local/bin

**Solution:**
```bash
# Use sudo untuk install
sudo mv circom /usr/local/bin/

# Or install to user directory
mkdir -p ~/.local/bin
mv circom ~/.local/bin/
echo 'export PATH=$PATH:~/.local/bin' >> ~/.bashrc
source ~/.bashrc
```

### Issue 9: PowerShell Execution Policy (Windows)

**Problem:** Cannot run PowerShell scripts

**Solution:**
```powershell
# Check current policy
Get-ExecutionPolicy

# Set execution policy
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Or bypass for single script
PowerShell -ExecutionPolicy Bypass -File script.ps1
```

### Issue 10: Node.js Version Compatibility

**Problem:** Node.js version too old

**Solution:**
```bash
# Check current version
node --version

# Install latest LTS via nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install --lts
nvm use --lts

# Or update via package manager
# Ubuntu: sudo apt install nodejs npm
# macOS: brew install node
# Windows: Download dari nodejs.org
```

---

## Performance Optimization

### 1. Compilation Optimization

```bash
# Use release mode untuk production
cargo build --release

# Parallel compilation
export MAKEFLAGS="-j$(nproc)"
```

### 2. Circuit Optimization

```circom
// Use efficient templates
include "circomlib/circuits/bitify.circom";
include "circomlib/circuits/comparators.circom";

// Minimize constraints
// Bad: Multiple separate comparisons
// Good: Combined logic where possible

// Use appropriate bit widths
component lt = LessThan(8);  // For values < 256
component ltBig = LessThan(32); // For larger values
```

### 3. Memory Optimization

```bash
# Compile dengan memory limit
ulimit -v 4194304  # 4GB virtual memory limit
circom circuit.circom --r1cs --wasm
```

---

## Integration dengan Frontend

### 1. Copy Files ke Public Directory

```bash
# Ensure files tersedia untuk frontend
ls public/circuits/
# Should contain:
# - ageVerification.wasm
# - ageVerification_0001.zkey
# - verification_key.json
```

### 2. Frontend Setup

```typescript
// src/lib/circuit.ts
export const CIRCUIT_WASM = '/circuits/ageVerification.wasm';
export const CIRCUIT_ZKEY = '/circuits/ageVerification_0001.zkey';
export const VERIFICATION_KEY = '/circuits/verification_key.json';
```

### 3. Load snarkjs dalam Browser

```html
<!-- Add to index.html -->
<script src="https://unpkg.com/snarkjs@latest/build/snarkjs.min.js"></script>
```

---

## Development Workflow

### 1. Circuit Development Cycle

```bash
# 1. Edit circuit
vim circuits/ageVerification.circom

# 2. Quick compile untuk syntax check
circom circuits/ageVerification.circom --r1cs --wasm

# 3. Full compilation untuk production
./scripts/compile-circuit.sh ageVerification

# 4. Test dalam frontend
npm run dev
```

### 2. Version Control

```bash
# .gitignore additions
echo "circuits/build/" >> .gitignore
echo "public/circuits/*.ptau" >> .gitignore
echo "public/circuits/*.zkey" >> .gitignore

# Keep important files
git add circuits/*.circom
git add scripts/compile-circuit.sh
git add public/circuits/*.json  # verification keys
```

---

## Next Steps

Setelah instalasi berhasil:

1. **✅ Test Circuit**: Compile dan test circuit sederhana
2. **✅ Age Verification**: Implement circuit untuk age verification
3. **🔄 Frontend Integration**: Connect dengan React application
4. **🔄 Smart Contract**: Deploy verifier contract
5. **🔄 End-to-End Testing**: Test complete ZK flow

---

## Resources dan Referensi

### Official Documentation
- [Circom Documentation](https://docs.circom.io/)
- [snarkjs Documentation](https://github.com/iden3/snarkjs)
- [circomlib Library](https://github.com/iden3/circomlib)

### Useful Links
- [Circom GitHub](https://github.com/iden3/circom)
- [ZK Learning Resources](https://zkp.science/)
- [Practical ZK](https://github.com/ingonyama-zk/ingopedia)

### Community
- [Circom Telegram](https://t.me/circom_zkp)
- [0xPARC Discord](https://discord.gg/0xparc)
- [ZK Study Group](https://zkstudyclub.com/)

---

:::tip **Pro Tips**
1. **Always backup** trusted setup files (.ptau, .zkey)
2. **Use version control** untuk circuit files
3. **Test circuits** dengan multiple input combinations
4. **Monitor memory usage** saat compile circuit kompleks
5. **Keep dependencies updated** tapi test compatibility
:::

:::warning **Security Notes**
- Never reuse trusted setup files across different circuits
- Validate all input constraints dalam circuit
- Use proper randomness untuk salt generation
- Audit circuits before production deployment
:::

**🎉 Circom installation complete! Ready untuk build Zero-Knowledge circuits!**