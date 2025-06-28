---
id: circom-installation
title: "Panduan Instalasi dan Kompilasi Circom"
sidebar_label: "📦 Instalasi Circom"
sidebar_position: 6.1
description: "Panduan lengkap instalasi Circom compiler dan snarkjs untuk development Zero-Knowledge circuits di Windows, macOS, dan Linux."
---

# Panduan Lengkap Instalasi Circom & Zero-Knowledge Setup

## Overview

Circom adalah Domain Specific Language (DSL) untuk menulis arithmetic circuits yang dapat digunakan dalam Zero-Knowledge proofs. Dokumentasi ini akan memandu Anda melalui proses instalasi lengkap Circom compiler dan tools yang diperlukan untuk semua platform.

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

## Instalasi Dependencies untuk ZK Age Verification

Untuk project ZK Age Verification yang sudah ada, install dependencies tambahan:

```bash
# Navigate ke project directory
cd zk-age-verification

# Install circomlib untuk circuit templates
npm install circomlib

# Install additional dependencies
npm install @noir-lang/backend_barretenberg @noir-lang/noir_wasm

# Verify installation
npm list circomlib
```

---

## Setup Age Verification Circuit

### 1. Circuit Implementation

Menggunakan circuit yang sudah ada di project:

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
    signal input currentYear;  // e.g., 2025
    signal input currentMonth; // e.g., 6
    signal input currentDay;   // e.g., 28
    
    // Public outputs
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
    
    // Birthday passed calculation
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
    
    // Input validation constraints
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

// Helper templates
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

## Compilation dan Setup Process

### Step 1: Compile Circuit

Menggunakan script yang sudah ada:

```bash
# Make script executable (Linux/macOS)
chmod +x scripts/compile-circuit.sh

# Compile age verification circuit
./scripts/compile-circuit.sh ageVerification
```

**Windows:**
```powershell
# Jika menggunakan PowerShell
bash scripts/compile-circuit.sh ageVerification

# Atau gunakan WSL2
wsl ./scripts/compile-circuit.sh ageVerification
```

**Expected Output:**
```
[INFO] Starting compilation for ageVerification...
[INFO] Step 1: Compiling circuit...
template instances: 1
non-linear constraints: 45
linear constraints: 0
public inputs: 3
private inputs: 4
public outputs: 2
wires: 89
labels: 165

[INFO] Step 2: Generating powers of tau...
[INFO] Step 3: Contributing to ceremony...
[INFO] Step 4: Preparing phase 2...
[INFO] Step 5: Generating zkey...
[INFO] Step 6: Contributing to phase 2...
[INFO] Step 7: Exporting verification key...
[INFO] Step 8: Copying files for frontend...
[INFO] ✅ Circuit compilation completed successfully!
```

### Step 2: Create Input File

Membuat file input untuk testing circuit:

```bash
# Buat input.json (semua nilai harus string untuk compatibility!)
cat > input.json <<'EOF'
{
  "birthDay":     "25",
  "birthMonth":   "1", 
  "birthYear":    "1995",
  "salt":         "323756239817902338231976232645994317121",
  "currentYear":  "2025",
  "currentMonth": "6",
  "currentDay":   "28"
}
EOF
```

**Penjelasan Input:**
- `birthDay`: Tanggal lahir (1-31)
- `birthMonth`: Bulan lahir (1-12)
- `birthYear`: Tahun lahir (1995 = umur 30 tahun)
- `salt`: Random number untuk privacy
- `currentYear/Month/Day`: Tanggal hari ini untuk kalkulasi umur

**⚠️ Important:** Semua nilai harus dalam format string, bukan number!

### Step 3: Calculate Witness

Witness adalah perhitungan internal circuit berdasarkan input:

```bash
# Hitung witness dari input
snarkjs wtns calculate \
  circuits/build/ageVerification_js/ageVerification.wasm \
  input.json \
  witness.wtns
```

**Expected Output:**
```
Loading CircomJS Library
Loading Circuit Wasm from circuits/build/ageVerification_js/ageVerification.wasm
Calculating witness...
Witness calculated!
```

**Penjelasan:** Witness adalah semua internal signals circuit yang dihitung dari input Anda.

### Step 4: Generate Proof

Membuat zero-knowledge proof dari witness:

```bash
# Buat proof + public signals
snarkjs groth16 prove \
  circuits/build/ageVerification_0001.zkey \
  witness.wtns \
  proof.json \
  public.json
```

**Expected Output:**
```
Generating proof...
Proof generated successfully!
```

**File Results:**
- `proof.json`: Zero-knowledge proof yang bisa dikirim ke verifier
- `public.json`: Public outputs (isAdult dan commitment hash)

### Step 5: Verify Proof Locally

Test verifikasi proof sebelum kirim ke blockchain:

```bash
# Verifikasi lokal
snarkjs groth16 verify \
  circuits/build/verification_key.json \
  public.json \
  proof.json
```

**Expected Output:**
```
[INFO]  snarkJS: Reading Verification Key...
[INFO]  snarkJS: Reading Public Signals...
[INFO]  snarkJS: Reading Proof...
OK
```

**✅ "OK" artinya proof valid!**

### Step 6: Export Solidity Calldata (Optional)

Untuk integrate dengan smart contract:

```bash
# Export calldata format untuk Solidity
snarkjs groth16 exportsoliditycalldata proof.json public.json > calldata.txt

# Lihat hasil
cat calldata.txt
```

**Output Example:**
```
["0x123...","0x456..."],
[["0x789...","0xabc..."],["0xdef...","0x012..."]],
["0x345...","0x678..."],
["0x9ab...","0xcde..."]
```

**Penjelasan:** Format ini bisa langsung digunakan untuk memanggil smart contract verification function.

### Step 7: Copy Files ke Frontend

Jalankan script untuk copy files ke public directory:

```bash
# Copy circuit files untuk frontend
./scripts/copy-circuit-files.sh
```

**Expected Output:**
```
🔧 Copying circuit files to public directory...
✅ Copied ageVerification.wasm
✅ Copied ageVerification_0001.zkey
✅ Copied verification_key.json
✅ Copied witness_calculator.js
✅ Copied generate_witness.js

📁 Files copied to public/circuits/build/
Structure:
public/
└── circuits/
    └── build/
        ├── ageVerification_js/
        │   ├── ageVerification.wasm
        │   ├── witness_calculator.js
        │   └── generate_witness.js
        ├── ageVerification_0001.zkey
        └── verification_key.json

🚀 Circuit files ready for frontend!
You can now test the ZK proof generation.
```

---

## Understanding the ZK Proof Process

### 1. What Happens in Each Step?

**Step 1: Compilation**
- Circom mengubah circuit code jadi matematis constraints
- Generate WebAssembly untuk browser computation
- Create proving/verification keys

**Step 2: Input Preparation**  
- Format data sesuai circuit requirements
- Semua input jadi strings untuk compatibility

**Step 3: Witness Calculation**
- Circuit compute semua internal values
- Verify semua constraints satisfied
- Create witness file

**Step 4: Proof Generation**
- Transform witness jadi zero-knowledge proof
- Output proof + public signals only
- Private inputs tetap secret

**Step 5: Verification**
- Check proof validity secara matematis
- Tidak reveal private inputs
- Binary result: valid or invalid

### 2. File Purposes

| File | Purpose | Contains |
|------|---------|----------|
| `input.json` | Circuit inputs | Birth date, salt, current date |
| `witness.wtns` | Internal computation | All circuit signals (private) |
| `proof.json` | ZK proof | Cryptographic proof data |
| `public.json` | Public outputs | isAdult result + commitment |
| `verification_key.json` | Verifier setup | Public parameters for verification |

### 3. Security Properties

**🔒 What Stays Private:**
- Exact birth date
- Salt value
- All intermediate calculations

**🔓 What Becomes Public:**
- Boolean result (adult/not adult)
- Commitment hash
- Current date used for calculation

---

## Testing Different Scenarios

### Test Case 1: Adult (Age >= 18)
```bash
# Test dengan birth year 1995 (age 30)
cat > input_adult.json <<'EOF'
{
  "birthDay":     "15",
  "birthMonth":   "6",
  "birthYear":    "1995",
  "salt":         "123456789012345678901234567890",
  "currentYear":  "2025",
  "currentMonth": "6", 
  "currentDay":   "28"
}
EOF

# Generate proof
snarkjs wtns calculate circuits/build/ageVerification_js/ageVerification.wasm input_adult.json witness_adult.wtns
snarkjs groth16 prove circuits/build/ageVerification_0001.zkey witness_adult.wtns proof_adult.json public_adult.json

# Check result
cat public_adult.json
# Should show: ["1", "..."] (1 = adult)
```

### Test Case 2: Minor (Age < 18)
```bash
# Test dengan birth year 2010 (age 15)
cat > input_minor.json <<'EOF'
{
  "birthDay":     "15",
  "birthMonth":   "6", 
  "birthYear":    "2010",
  "salt":         "987654321098765432109876543210",
  "currentYear":  "2025",
  "currentMonth": "6",
  "currentDay":   "28"
}
EOF

# Generate proof
snarkjs wtns calculate circuits/build/ageVerification_js/ageVerification.wasm input_minor.json witness_minor.wtns
snarkjs groth16 prove circuits/build/ageVerification_0001.zkey witness_minor.wtns proof_minor.json public_minor.json

# Check result
cat public_minor.json  
# Should show: ["0", "..."] (0 = minor)
```

### Test Case 3: Edge Case (Exactly 18)
```bash
# Test dengan exactly 18 years old
cat > input_edge.json <<'EOF'
{
  "birthDay":     "28",
  "birthMonth":   "6",
  "birthYear":    "2007", 
  "salt":         "555666777888999000111222333444",
  "currentYear":  "2025",
  "currentMonth": "6",
  "currentDay":   "28"
}
EOF

# Generate proof
snarkjs wtns calculate circuits/build/ageVerification_js/ageVerification.wasm input_edge.json witness_edge.wtns
snarkjs groth16 prove circuits/build/ageVerification_0001.zkey witness_edge.wtns proof_edge.json public_edge.json

# Check result (should be adult = 1)
cat public_edge.json
```

---

## Frontend Integration Verification

### 1. Check Files Are Available

```bash
# Verify all files exist for frontend
ls -la public/circuits/build/

# Should show:
# ageVerification_js/ageVerification.wasm
# ageVerification_0001.zkey
# verification_key.json
```

### 2. Test Frontend Loading

```bash
# Start development server
npm run dev

# Open browser to http://localhost:3000
# Check browser console for any loading errors
```

### 3. Verify Circuit Status

Di frontend, component `CircuitStatus` akan check file availability:
- 🟢 Green: All files available, real ZK proofs enabled
- 🟡 Yellow: Some files missing, partial functionality
- 🔶 Orange: No files, mock proofs only

---

## Troubleshooting Common Issues

### Issue 1: "template not found" during compilation

**Problem:** circomlib templates tidak ditemukan

**Solution:**
```bash
# Install circomlib locally
npm install circomlib

# Or install globally
npm install -g circomlib

# Check installation
ls node_modules/circomlib/circuits/
```

### Issue 2: "Assert failed" during witness calculation

**Problem:** Input violates circuit constraints

**Solutions:**
```bash
# Check input ranges:
# birthDay: 1-31
# birthMonth: 1-12  
# birthYear: 1900-2010
# All values must be strings!

# Example fix:
{
  "birthDay": "25",     // ✅ String
  "birthMonth": "1",    // ✅ String
  "birthYear": "1995"   // ✅ String, not 1995
}
```

### Issue 3: Memory errors during compilation

**Problem:** Circuit too complex for available memory

**Solutions:**

**Linux/macOS:**
```bash
# Increase swap space
sudo dd if=/dev/zero of=/swapfile bs=1024 count=2097152
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

**Windows:**
```powershell
# Use WSL2 instead of native Windows
wsl --install -d Ubuntu-22.04
```

### Issue 4: snarkjs command not found

**Problem:** snarkjs tidak terinstall atau tidak di PATH

**Solution:**
```bash
# Check installation
which snarkjs
npm list -g snarkjs

# Reinstall if needed
npm uninstall -g snarkjs
npm install -g snarkjs@latest

# Use npx if global install fails
npx snarkjs --version
```

### Issue 5: "Invalid witness" error

**Problem:** Witness file corrupted atau tidak compatible

**Solution:**
```bash
# Delete dan regenerate witness
rm witness.wtns
snarkjs wtns calculate \
  circuits/build/ageVerification_js/ageVerification.wasm \
  input.json \
  witness.wtns
```

### Issue 6: Frontend tidak bisa load circuit files

**Problem:** Files tidak tersedia di public directory

**Solution:**
```bash
# Re-run copy script
./scripts/copy-circuit-files.sh

# Check file permissions (Linux/macOS)
chmod 644 public/circuits/build/*

# Check file sizes (should not be 0)
ls -la public/circuits/build/
```

---

## Performance Optimization

### 1. Circuit Optimization

```circom
// Use appropriate bit widths untuk comparisons
component lt8 = LessThan(8);   // For values < 256
component lt16 = LessThan(16); // For values < 65536

// Minimize constraints where possible
// Combine multiple checks into single constraint
```

### 2. Compilation Speed

```bash
# Use release mode
export CARGO_PROFILE_RELEASE_BUILD_OVERRIDE_OPT_LEVEL=3

# Parallel compilation
export MAKEFLAGS="-j$(nproc)"
```

### 3. Frontend Loading

```typescript
// Preload circuit files
const preloadCircuitFiles = async () => {
  const files = [
    '/circuits/build/ageVerification.wasm',
    '/circuits/build/ageVerification_0001.zkey',
    '/circuits/build/verification_key.json'
  ];
  
  await Promise.all(files.map(url => fetch(url)));
};
```

---

## Production Deployment Checklist

### Pre-deployment:
- [ ] ✅ All circuit files compiled successfully
- [ ] ✅ Test cases pass (adult, minor, edge cases)
- [ ] ✅ Frontend loads circuit files correctly
- [ ] ✅ snarkjs integration working
- [ ] ✅ Mock fallback system tested

### Security:
- [ ] ✅ Input validation in circuit
- [ ] ✅ Proper salt generation
- [ ] ✅ Commitment scheme prevents replay
- [ ] ✅ No sensitive data in public outputs
- [ ] ✅ Circuit constraints prevent manipulation

### Performance:
- [ ] ✅ Circuit compilation time acceptable
- [ ] ✅ Proof generation time < 10 seconds
- [ ] ✅ File sizes reasonable for web delivery
- [ ] ✅ Memory usage within limits

---

## Next Steps

Setelah setup complete:

1. **✅ Circuit Setup Complete**: Age verification circuit compiled dan tested
2. **🔄 Frontend Integration**: Test proof generation di browser
3. **🔄 Smart Contract**: Deploy verifier contract untuk on-chain verification
4. **🔄 End-to-End Testing**: Complete flow dari input sampai blockchain
5. **🔄 Production Deploy**: Optimize dan deploy ke production

---

## Resources dan Referensi

### Official Documentation
- [Circom Documentation](https://docs.circom.io/)
- [snarkjs Documentation](https://github.com/iden3/snarkjs)
- [circomlib Library](https://github.com/iden3/circomlib)

### Useful Commands Reference

```bash
# Compilation
circom circuit.circom --r1cs --wasm --sym -o build/

# Witness calculation
snarkjs wtns calculate circuit.wasm input.json witness.wtns

# Proof generation
snarkjs groth16 prove circuit.zkey witness.wtns proof.json public.json

# Verification
snarkjs groth16 verify verification_key.json public.json proof.json

# Solidity export
snarkjs groth16 exportsoliditycalldata proof.json public.json
```

### Community
- [Circom Telegram](https://t.me/circom_zkp)
- [0xPARC Discord](https://discord.gg/0xparc)
- [ZK Study Group](https://zkstudyclub.com/)

---

:::tip **Pro Tips**
1. **Always use strings** untuk numeric inputs dalam JSON
2. **Test edge cases** seperti exactly 18 years old
3. **Monitor memory** usage saat compile circuit kompleks
4. **Keep backup** dari trusted setup files (.ptau, .zkey)
5. **Validate inputs** di circuit level untuk security
:::

:::warning **Security Notes**
- Never reuse salt values across different proofs
- Validate all input ranges dalam circuit constraints
- Use proper randomness untuk salt generation
- Test circuit dengan malicious inputs
- Audit circuit logic before production deployment
:::

**🎉 Circom setup complete! Ready untuk generate Zero-Knowledge age verification proofs!**