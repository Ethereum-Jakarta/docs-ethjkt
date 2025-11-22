# Bagian 4: Setup Circom & Persiapan Praktik

> **Catatan:** Bagian ini fokus pada setup environment untuk praktik dengan Circom. Materi praktik lengkap akan dibahas di sesi lanjutan.

---

## 📚 Tujuan Pembelajaran

Setelah menyelesaikan bagian ini, Anda akan mampu:

1. Memahami apa itu Circom dan snarkjs
2. Install Circom di sistem Anda
3. Setup project Circom pertama
4. Membuat circuit sederhana
5. Generate dan verify proof dasar
6. Memahami struktur project Circom

---

## 🎯 Apa Itu Circom?

### Definisi

**Circom** (Circuit Compiler) adalah:
- **Domain-Specific Language (DSL)** untuk menulis arithmetic circuits
- Compiler yang mengubah Circom code menjadi R1CS (Rank-1 Constraint System)
- Tool untuk membuat zk-SNARK circuits

### Komponen Ekosistem

```
┌─────────────────────────────────────────┐
│  CIRCOM ECOSYSTEM                       │
│  ─────────────────────────────────────  │
│                                          │
│  📝 Circom                               │
│     - DSL untuk circuits                │
│     - Compile ke R1CS                   │
│                                          │
│  🔧 snarkjs                              │
│     - JavaScript library                │
│     - Generate & verify proofs           │
│     - Setup ceremonies                   │
│                                          │
│  🎨 circomlib                            │
│     - Library circuits                  │
│     - Pre-built components              │
│     - Best practices                    │
└─────────────────────────────────────────┘
```

### Mengapa Circom?

**Kelebihan:**
- ✅ **Mudah dipelajari** - Syntax mirip JavaScript
- ✅ **Powerful** - Bisa buat complex circuits
- ✅ **Well-documented** - Documentation lengkap
- ✅ **Active community** - Banyak resources
- ✅ **Production-ready** - Digunakan banyak proyek

**Proyek yang Menggunakan Circom:**
- Tornado Cash
- Semaphore
- MACI (Minimal Anti-Collusion Infrastructure)
- Banyak proyek privacy lainnya

---

## ⚠️ Catatan Penting: Instalasi Circom 2.0

### JANGAN Install via npm!

**PENTING:** 
- ❌ **JANGAN** gunakan `npm install -g circom`
- ❌ Versi npm (0.5.46) sudah **deprecated** dan tidak didukung
- ✅ Circom 2.0 **HARUS** di-compile dari source menggunakan Rust/Cargo
- ✅ Gunakan `cargo install` untuk install Circom 2.0

**Mengapa?**
- Circom 2.0 ditulis dalam Rust (bukan JavaScript)
- Perlu di-compile dari source code
- Versi npm adalah versi lama yang tidak kompatibel

---

## 🛠️ Instalasi Circom

> **⚠️ PENTING:** Circom 2.0 **TIDAK BISA** diinstall via npm! Versi npm (0.5.46) sudah deprecated. Circom 2.0 harus di-compile dari source menggunakan Rust/Cargo.

### Prerequisites

**Yang Diperlukan:**

**Untuk macOS:**
- Rust dan Cargo (install via rustup)
- Git (biasanya sudah terinstall, atau via Xcode Command Line Tools)
- Node.js dan npm (untuk snarkjs, Node.js v10+ recommended)

**Untuk Windows (WSL/Ubuntu - Recommended):**
- WSL 2 dengan Ubuntu (Windows Subsystem for Linux)
- Rust dan Cargo (install via rustup)
- Git (biasanya sudah terinstall di Ubuntu)
- Node.js dan npm (untuk snarkjs)

**Untuk Windows (Git Bash - Not Recommended):**
- Git for Windows (includes Git Bash)
- Rust dan Cargo (install via rustup)
- Node.js dan npm
- Build Tools (Visual Studio Build Tools atau MinGW)

---

### Instalasi untuk macOS

#### Step 1: Install Rust

**Circom compiler ditulis dalam Rust, jadi perlu install Rust terlebih dahulu.**

```bash
# Install rustup (Rust toolchain installer)
curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh

# Ikuti prompt yang muncul, kemudian reload shell atau jalankan:
source $HOME/.cargo/env

# Verify instalasi
rustc --version
cargo --version
```

#### Step 2: Install Node.js (jika belum terinstall)

```bash
# Menggunakan Homebrew (recommended)
brew install node

# Atau download dari https://nodejs.org/

# Verify instalasi
node --version
npm --version
```

#### Step 3: Clone dan Build Circom

```bash
# Clone repository
git clone https://github.com/iden3/circom.git
cd circom

# Build dalam release mode (membutuhkan ~3-5 menit)
cargo build --release

# Install globally
cargo install --path circom
```

#### Step 4: Verify Instalasi

```bash
# Check version
circom --version
# Should output: circom compiler 2.2.3 (atau versi serupa)

# Check PATH (harus include ~/.cargo/bin)
echo $PATH | grep cargo
```

#### Step 5: Clean Up (Optional)

```bash
# Hapus repository yang di-clone jika tidak diperlukan
cd ..
rm -rf circom
```

---

### Instalasi untuk Windows (WSL/Ubuntu - Recommended)

#### Step 1: Install WSL 2 dengan Ubuntu

**Di PowerShell (sebagai Administrator):**
```powershell
# Install WSL
wsl --install

# Atau jika WSL sudah terinstall, update ke WSL 2:
wsl --set-default-version 2

# Install Ubuntu dari Microsoft Store jika belum terinstall
```

#### Step 2: Buka Ubuntu Terminal

- Buka Ubuntu dari Start Menu, atau jalankan `wsl` di PowerShell/CMD

#### Step 3: Update Ubuntu Packages

```bash
sudo apt update
sudo apt upgrade -y
```

#### Step 4: Install Rust

```bash
# Install rustup
curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh

# Ikuti prompt yang muncul, kemudian reload atau jalankan:
source $HOME/.cargo/env

# Verify instalasi
rustc --version
cargo --version
```

#### Step 5: Install Node.js

```bash
# Menggunakan NodeSource repository (recommended untuk LTS terbaru)
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# Atau menggunakan apt (mungkin versi lebih lama)
# sudo apt install nodejs npm

# Verify instalasi
node --version
npm --version
```

#### Step 6: Clone dan Build Circom

```bash
# Clone repository
git clone https://github.com/iden3/circom.git
cd circom

# Build dalam release mode (membutuhkan ~3-5 menit)
cargo build --release

# Install globally
cargo install --path circom
```

#### Step 7: Verify Instalasi

```bash
# Check version
circom --version
# Should output: circom compiler 2.2.3 (atau versi serupa)

# Check PATH
echo $PATH | grep cargo
```

#### Step 8: Clean Up (Optional)

```bash
# Hapus repository yang di-clone jika tidak diperlukan
cd ..
rm -rf circom
```

---

### Instalasi untuk Windows (Git Bash - Not Recommended)

> **⚠️ Catatan:** WSL sangat direkomendasikan daripada Git Bash untuk development Circom. Git Bash mungkin memiliki masalah kompatibilitas dengan Rust tooling.

#### Step 1: Install Git for Windows

- Download dari: https://git-scm.com/download/win
- Saat instalasi, pastikan "Git Bash" dipilih

#### Step 2: Install Rust

```bash
# Buka Git Bash dan jalankan:
curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh

# Ikuti prompt yang muncul, kemudian reload atau jalankan:
source $HOME/.cargo/env

# Verify instalasi
rustc --version
cargo --version
```

#### Step 3: Install Node.js

- Download dari: https://nodejs.org/
- Install versi LTS
- Verify di Git Bash:

```bash
node --version
npm --version
```

#### Step 4: Install Build Tools (jika diperlukan)

- Install Visual Studio Build Tools: https://visualstudio.microsoft.com/downloads/
- Pilih workload "C++ build tools"
- Atau install MinGW-w64

#### Step 5: Clone dan Build Circom

```bash
# Clone repository
git clone https://github.com/iden3/circom.git
cd circom

# Build dalam release mode
cargo build --release

# Install globally
cargo install --path circom
```

#### Step 6: Verify Instalasi

```bash
# Check version
circom --version
# Should output: circom compiler 2.2.3 (atau versi serupa)
```

---

### Troubleshooting Instalasi

#### Issue: `circom: command not found`

**Solusi:**
- Pastikan `~/.cargo/bin` ada di PATH Anda
- Tambahkan ke shell config file:
  - **macOS/Linux**: Tambahkan ke `~/.bashrc` atau `~/.zshrc`: 
    ```bash
    export PATH="$HOME/.cargo/bin:$PATH"
    ```
  - **Git Bash**: Tambahkan ke `~/.bashrc`:
    ```bash
    export PATH="$HOME/.cargo/bin:$PATH"
    ```
  - Kemudian reload: `source ~/.bashrc` atau restart terminal

#### Issue: Versi Circom lama masih digunakan

**Solusi:**
- Uninstall versi npm lama: `npm uninstall -g circom`
- Verify circom mana yang digunakan: `which circom` (harus menunjuk ke `~/.cargo/bin/circom`)

#### Issue: Build gagal di Windows

**Solusi:**
- Gunakan WSL daripada Git Bash (recommended)
- Pastikan Visual Studio Build Tools terinstall
- Coba: `cargo clean` kemudian `cargo build --release` lagi

#### Issue: Permission denied errors

**Solusi:**
- Di Linux/WSL: Gunakan `sudo` hanya jika diperlukan, tapi lebih baik user installation
- Di macOS: Mungkin perlu allow terminal di System Preferences > Security

---

### Verifikasi Instalasi

**Setelah instalasi, test dengan circuit sederhana:**

```bash
# Buat test circuit
mkdir -p circuits

cat > circuits/test.circom << 'EOF'
pragma circom 2.0.0;

template Test() {
    signal input x;
    signal output y;
    y <== x * 2;
}

component main = Test();
EOF

# Compile circuit
circom circuits/test.circom --r1cs --wasm --sym -o output/

# Harus melihat success message dan files di output/ directory
```

---

### Quick Reference: Instalasi Circom 2.0

**Install Rust:**
```bash
curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh
source $HOME/.cargo/env
```

**Install Circom 2.0:**
```bash
git clone https://github.com/iden3/circom.git
cd circom
cargo build --release
cargo install --path circom
```

**Verify:**
```bash
circom --version
```

**Compile circuit:**
```bash
circom circuits/hello.circom --r1cs --wasm --sym -o output/
```

**Catatan Penting:**
1. ❌ **JANGAN** install via npm: `npm install -g circom` (versi lama deprecated)
2. ✅ **SELALU** gunakan Cargo: Cara resmi install Circom 2.0 adalah via `cargo install`
3. ✅ **WSL recommended untuk Windows**: Git Bash mungkin bisa tapi WSL lebih kompatibel
4. ✅ **Keep Rust updated**: Jalankan `rustup update` secara berkala untuk mendapatkan Rust toolchain terbaru

---

### Step 3: Install snarkjs

**snarkjs adalah JavaScript library untuk generate & verify proofs:**

> **Catatan:** snarkjs **BISA** diinstall via npm (tidak seperti Circom)

```bash
npm install -g snarkjs
```

**Verify Instalasi:**
```bash
snarkjs --version
# Should show: snarkjs 0.x.x
```

### Step 4: Install circomlib (Optional)

**circomlib adalah library circuits yang sudah dibuat:**

```bash
git clone https://github.com/iden3/circomlib.git
cd circomlib
npm install
```

**Catatan:** circomlib akan digunakan sebagai reference untuk best practices.

---

## 🚀 Project Pertama: Hello World Circuit

### Step 1: Setup Project

**Buat folder project:**
```bash
mkdir my-first-circuit
cd my-first-circuit
npm init -y
```

**Install dependencies:**
```bash
npm install snarkjs
```

**Buat struktur folder:**
```bash
mkdir circuits
mkdir output
```

**Struktur Project Awal:**
```
my-first-circuit/
├── circuits/
│   └── hello.circom
├── output/                    # Folder untuk output files
├── input.json                 # Input untuk witness generation
├── package.json
└── README.md
```

**Struktur Project Setelah Semua Langkah Selesai:**
```
my-first-circuit/
├── circuits/
│   └── hello.circom           # Circuit source code
├── output/
│   ├── hello.r1cs            # Compiled constraint system
│   ├── hello.sym              # Symbol file (untuk debugging)
│   ├── hello_js/              # Auto-generated oleh Circom
│   │   ├── hello.wasm         # WebAssembly binary
│   │   ├── generate_witness.js
│   │   └── witness_calculator.js
│   ├── hello_0000.zkey        # Zkey awal (Phase 2)
│   ├── hello_0001.zkey        # Zkey setelah contribution
│   ├── verification_key.json  # Verification key
│   ├── witness.wtns           # Witness file (binary)
│   ├── proof.json             # Proof (Step 6)
│   └── public.json            # Public signals (Step 6)
├── pot12_0000.ptau            # Powers of tau awal
├── pot12_0001.ptau            # Powers of tau setelah contribution
├── pot12_final.ptau           # Powers of tau final (setelah phase 2)
├── Verifier.sol               # Smart contract verifier (Step 8)
├── witness.json               # Witness dalam format JSON (export)
├── input.json                 # Input untuk witness generation
├── package.json
└── package-lock.json
```

> **📌 Catatan:** 
> - File `.ptau` adalah powers of tau files dari trusted setup
> - File `.zkey` adalah proving/verification keys
> - File `.wtns` adalah witness dalam format binary
> - File `Verifier.sol` adalah smart contract untuk verify proofs on-chain

### Step 2: Buat Circuit Sederhana

**File: `circuits/hello.circom`**

```circom
pragma circom 2.0.0;

template Hello() {
    // Signal input
    signal input x;
    
    // Signal output
    signal output y;
    
    // Constraint: y = x * 2
    y <== x * 2;
}

component main = Hello();
```

**Penjelasan:**
- `pragma circom 2.0.0;` - Version Circom
- `template Hello()` - Template circuit
- `signal input x;` - Input signal
- `signal output y;` - Output signal
- `y <== x * 2;` - Constraint: y harus sama dengan x * 2
- `component main = Hello();` - Main component

### Step 3: Compile Circuit

**Compile menggunakan Circom:**
```bash
circom circuits/hello.circom --r1cs --wasm --sym -o output/
```

**Penjelasan flags:**
- `--r1cs` - Generate R1CS file (constraint system)
- `--wasm` - Generate WebAssembly file (untuk witness generation)
- `--sym` - Generate symbol file (untuk debugging)
- `-o output/` - Output directory

**Output yang Dihasilkan:**

Setelah compile berhasil, Anda akan melihat output seperti ini:
```
template instances: 1
non-linear constraints: 0
linear constraints: 1
public inputs: 0
private inputs: 1
public outputs: 1
wires: 3
labels: 3
Written successfully: output/hello.r1cs
Written successfully: output/hello.sym
Written successfully: output/hello_js/hello.wasm
Everything went okay
```

**Struktur File yang Ter-generate:**
```
output/
├── hello.r1cs              # Constraint system (R1CS format)
├── hello.sym                # Symbol file (untuk debugging)
└── hello_js/                # Folder untuk witness generation (AUTO-GENERATED)
    ├── hello.wasm           # WebAssembly file (binary, tidak bisa dibaca)
    ├── generate_witness.js   # Script untuk generate witness
    └── witness_calculator.js # Library untuk calculate witness
```

> **📌 Catatan Penting:** 
> - Folder `hello_js` **otomatis ter-generate** oleh Circom ketika menggunakan flag `--wasm`
> - Nama folder mengikuti pattern: `{circuit_name}_js`
> - Folder ini berisi semua file yang diperlukan untuk generate witness
> - File `hello.wasm` adalah binary WebAssembly (tidak bisa dibaca sebagai text)
> - File `generate_witness.js` adalah script yang siap digunakan untuk generate witness
> - File `witness_calculator.js` adalah library JavaScript untuk calculate witness dari WASM

**Penjelasan File-file di `hello_js/`:**

1. **`hello.wasm`** - WebAssembly binary file
   - Compiled circuit dalam format WASM
   - Digunakan untuk calculate witness secara efisien
   - Binary file (tidak bisa dibaca sebagai text)

2. **`generate_witness.js`** - Script untuk generate witness
   - Script yang sudah siap digunakan
   - Usage: `node generate_witness.js <file.wasm> <input.json> <output.wtns>`
   - Menggunakan `witness_calculator.js` untuk calculate witness

3. **`witness_calculator.js`** - Library untuk calculate witness
   - JavaScript library yang load dan execute WASM
   - Handle WebAssembly instantiation
   - Calculate witness dari input values

---

### Step 4: Generate Witness

**Witness adalah assignment values untuk signals yang memenuhi semua constraints dalam circuit.**

**Cara Generate Witness:**

Circom sudah menyediakan script `generate_witness.js` di folder `hello_js`. Kita hanya perlu:

1. **Buat file input JSON:**

**File: `input.json`**
```json
{
  "x": 5
}
```

2. **Generate Witness menggunakan script yang sudah ter-generate:**

```bash
node output/hello_js/generate_witness.js output/hello_js/hello.wasm input.json output/witness.wtns
```

**Penjelasan command:**
- `output/hello_js/generate_witness.js` - Script untuk generate witness
- `output/hello_js/hello.wasm` - WebAssembly file dari compile
- `input.json` - File input dengan nilai untuk signals
- `output/witness.wtns` - Output file witness (format binary untuk snarkjs)

**Output:**
- File `witness.wtns` akan ter-generate di folder `output/`
- File ini berisi witness dalam format binary yang kompatibel dengan snarkjs

**Verifikasi & Inspect Witness:**

Ada beberapa cara untuk memverifikasi dan melihat isi witness:

**1. Debug Witness (tidak menampilkan output jika tidak ada error):**

```bash
snarkjs wtns debug output/hello_js/hello.wasm input.json output/witness.wtns output/hello.sym
```

> **📌 Catatan:** Perintah `snarkjs wtns debug` tidak menampilkan output di terminal jika tidak ada error. Jika command berjalan tanpa error (exit code 0), berarti witness valid. Perintah ini digunakan untuk debugging internal.

**2. Export Witness ke JSON (untuk melihat isi witness):**

```bash
snarkjs wtns export json output/witness.wtns witness.json
```

**Output yang dihasilkan (`witness.json`):**
```json
[
  "1",    // Signal index 0 (constant 1)
  "10",   // Signal index 1 (output y = 5 * 2 = 10)
  "5"     // Signal index 2 (input x = 5)
]
```

**Penjelasan:**
- Index 0: Constant signal (selalu 1)
- Index 1: Output signal `y` (hasil dari x * 2 = 5 * 2 = 10)
- Index 2: Input signal `x` (nilai input = 5)

**3. Verifikasi Witness Memenuhi Constraints:**

```bash
snarkjs wtns check output/hello.r1cs output/witness.wtns
```

**Output jika valid:**
```
WITNESS IS CORRECT

3 wires (signals)
1 constraint
1 private input (x = 5)
1 output (y = 10)
```

**Output jika invalid:**
```
Error: Witness does not satisfy the circuit
```

**Kesimpulan:**
- `snarkjs wtns debug` - Debug witness (tidak menampilkan output jika tidak ada error)
- `snarkjs wtns export json` - Export witness ke JSON untuk melihat isi
- `snarkjs wtns check` - Verifikasi witness memenuhi semua constraints dalam circuit

---

### Step 5: Trusted Setup (Powers of Tau)

**Sebelum bisa generate proof, kita perlu melakukan trusted setup:**

> **📚 Referensi:** [Circom Documentation - Proving Circuits](https://docs.circom.io/getting-started/proving-circuits/)

**Groth16 memerlukan trusted setup per circuit. Trusted setup terdiri dari 2 bagian:**
1. **Powers of Tau** - Independent dari circuit (Phase 1)
2. **Phase 2** - Bergantung pada circuit

**Step 5.1: Powers of Tau (Phase 1)**

**Mulai powers of tau ceremony baru:**

```bash
# Buat powers of tau baru
# Parameter: bn128 (curve), 12 (power of 2 untuk max constraints: 2^12 = 4096)
snarkjs powersoftau new bn128 12 pot12_0000.ptau -v
```

**Contribute ke powers of tau ceremony:**

```bash
# Contribute ke ceremony
snarkjs powersoftau contribute pot12_0000.ptau pot12_0001.ptau --name="First contribution" -v
```

> **📌 Catatan:** Untuk production, lakukan multiple contributions dari partisipan berbeda untuk meningkatkan keamanan. Setiap contribution akan meminta random text input.

**Sekarang kita punya powers of tau di file `pot12_0001.ptau` dan bisa lanjut ke Phase 2.**

**Step 5.2: Phase 2 (Circuit-specific)**

**Phase 2 bergantung pada circuit. Prepare phase 2:**

```bash
# Prepare phase 2 dari powers of tau
snarkjs powersoftau prepare phase2 pot12_0001.ptau pot12_final.ptau -v
```

**Generate .zkey file (mengandung proving dan verification keys):**

```bash
# Setup groth16 untuk circuit kita
snarkjs groth16 setup output/hello.r1cs pot12_final.ptau output/hello_0000.zkey
```

**Contribute ke phase 2 ceremony:**

```bash
# Contribute ke phase 2
snarkjs zkey contribute output/hello_0000.zkey output/hello_0001.zkey --name="1st Contributor Name" -v
```

> **📌 Catatan:** Untuk production, lakukan multiple contributions untuk meningkatkan keamanan.

**Export verification key:**

```bash
# Export verification key untuk verify proofs
snarkjs zkey export verificationkey output/hello_0001.zkey output/verification_key.json
```

**File yang Ter-generate:**
```
output/
├── pot12_0000.ptau          # Powers of tau awal
├── pot12_0001.ptau          # Powers of tau setelah contribution
├── pot12_final.ptau         # Powers of tau final (setelah phase 2)
├── hello_0000.zkey         # Zkey awal
├── hello_0001.zkey         # Zkey setelah contribution
└── verification_key.json    # Verification key
```

> **💡 Catatan Alternatif:** Untuk development/testing yang lebih cepat, Anda bisa menggunakan powers of tau yang sudah ada (dari Hermez atau ceremony lain), tapi untuk production, selalu buat ceremony sendiri dengan multiple contributions.

---

### Step 6: Generate Proof

**Setelah witness dan setup selesai, kita bisa generate proof:**

```bash
snarkjs groth16 prove output/hello_0001.zkey output/witness.wtns output/proof.json output/public.json
```

**Penjelasan:**
- `output/hello_0001.zkey` - Proving key dari setup
- `output/witness.wtns` - Witness file yang sudah di-generate
- `output/proof.json` - Output file untuk proof
- `output/public.json` - Output file untuk public signals

**Output yang Dihasilkan:**
```
output/
├── proof.json           # Proof dalam format JSON
└── public.json          # Public signals
```

---

### Step 7: Verify Proof

**Verify proof menggunakan verification key:**

```bash
snarkjs groth16 verify output/verification_key.json output/public.json output/proof.json
```

**Output jika valid:**
```
OK
```

**Output jika invalid:**
```
INVALID
```

---

### Step 8: Generate Verifier Smart Contract (Optional)

**Untuk verify proof on-chain, generate Solidity verifier:**

**Opsi 1: Generate di root directory (lebih sederhana):**

```bash
snarkjs zkey export solidityverifier output/hello_0001.zkey Verifier.sol
```

**Opsi 2: Generate di folder contracts (jika folder sudah ada):**

```bash
# Buat folder contracts terlebih dahulu
mkdir -p contracts

# Generate verifier
snarkjs zkey export solidityverifier output/hello_0001.zkey contracts/Verifier.sol
```

> **📌 Catatan:** Jika folder `contracts/` belum ada, command akan gagal. Pastikan folder sudah dibuat terlebih dahulu, atau gunakan Opsi 1 untuk generate di root directory.

**Output:**
- File `Verifier.sol` akan ter-generate
- File ini berisi smart contract untuk verify proofs di blockchain
- Contract berisi dua contracts: `Pairing` dan `Verifier`
- Hanya perlu deploy contract `Verifier`

**Cara Menggunakan di Remix:**
1. Copy code dari `Verifier.sol`
2. Paste di Remix
3. Deploy contract `Verifier` (bukan `Pairing`)
4. Panggil function `verifyProof` dengan parameters dari proof

**Generate Call Parameters (untuk memudahkan testing):**

```bash
snarkjs generatecall
```

Command ini akan generate parameters untuk function `verifyProof` yang bisa langsung di-copy-paste ke Remix.

---

## 📋 Ringkasan Workflow Lengkap

**Langkah-langkah dari compile sampai verify:**

```bash
# 1. Compile circuit
circom circuits/hello.circom --r1cs --wasm --sym -o output/

# 2. Generate witness
node output/hello_js/generate_witness.js output/hello_js/hello.wasm input.json output/witness.wtns

# 3. Powers of Tau (Phase 1)
snarkjs powersoftau new bn128 12 pot12_0000.ptau -v
snarkjs powersoftau contribute pot12_0000.ptau pot12_0001.ptau --name="First contribution" -v

# 4. Prepare Phase 2
snarkjs powersoftau prepare phase2 pot12_0001.ptau pot12_final.ptau -v

# 5. Groth16 Setup (Phase 2)
snarkjs groth16 setup output/hello.r1cs pot12_final.ptau output/hello_0000.zkey
snarkjs zkey contribute output/hello_0000.zkey output/hello_0001.zkey --name="1st Contributor" -v
snarkjs zkey export verificationkey output/hello_0001.zkey output/verification_key.json

# 6. Generate proof
snarkjs groth16 prove output/hello_0001.zkey output/witness.wtns output/proof.json output/public.json

# 7. Verify proof
snarkjs groth16 verify output/verification_key.json output/public.json output/proof.json

# 8. (Optional) Generate verifier contract
snarkjs zkey export solidityverifier output/hello_0001.zkey Verifier.sol

# 9. (Optional) Generate call parameters untuk testing
snarkjs generatecall
```

> **💡 Catatan:** Untuk development/testing yang lebih cepat, Anda bisa menggunakan powers of tau yang sudah ada dari ceremony lain (misalnya Hermez), tapi untuk production selalu buat ceremony sendiri dengan multiple contributions.

> **📚 Referensi Lengkap:** 
> - [Circom Documentation - Installation](https://docs.circom.io/getting-started/installation/)
> - [Circom Documentation - Writing Circuits](https://docs.circom.io/getting-started/writing-circuits/)
> - [Circom Documentation - Compiling Circuits](https://docs.circom.io/getting-started/compiling-circuits/)
> - [Circom Documentation - Computing Witness](https://docs.circom.io/getting-started/computing-the-witness/)
> - [Circom Documentation - Proving Circuits](https://docs.circom.io/getting-started/proving-circuits/)

---

## 📁 Struktur Project Circom Lengkap

### Template Project Structure (Setelah Semua Langkah)

```
my-zksnark-project/
├── circuits/
│   ├── hello.circom          # Simple circuit
│   ├── complex.circom        # Complex circuit
│   └── utils/
│       └── helpers.circom    # Helper functions
├── output/
│   ├── *.r1cs                # Compiled circuits
│   ├── *.sym                 # Symbol files
│   ├── *_js/                 # Auto-generated WASM folders
│   │   ├── *.wasm
│   │   ├── generate_witness.js
│   │   └── witness_calculator.js
│   ├── *.zkey                # Proving keys (Phase 2)
│   ├── verification_key.json # Verification key
│   ├── *.wtns                # Witness files (binary)
│   ├── proof.json            # Proof
│   └── public.json           # Public signals
├── pot*.ptau                  # Powers of tau files
├── Verifier.sol               # Smart contract verifier
├── witness.json               # Witness (JSON export)
├── input.json                 # Input untuk witness
├── test/
│   └── circuit.test.js       # Tests
├── package.json
├── .gitignore
└── README.md
```

### File Penting

**`.gitignore`:**
```
node_modules/
output/
*.zkey
*.ptau
.DS_Store
```

**`package.json` scripts:**
```json
{
  "scripts": {
    "compile": "node scripts/compile.js",
    "setup": "node scripts/setup.js",
    "prove": "node scripts/generate-proof.js",
    "verify": "node scripts/verify.js"
  }
}
```

---

## 🔧 Tools & Utilities

### circom-helper

**Helper script untuk compile:**
```bash
npm install -g circom-helper
```

### circom_tester

**Testing library untuk circuits:**
```bash
npm install --save-dev circom_tester
```

**Contoh test:**
```javascript
const wasmTester = require("circom_tester").wasm;

describe("Hello Circuit", () => {
    let circuit;
    
    beforeAll(async () => {
        circuit = await wasmTester("circuits/hello.circom");
    });
    
    it("should multiply by 2", async () => {
        const input = { x: 5 };
        const witness = await circuit.calculateWitness(input);
        await circuit.assertOut(witness, { y: 10 });
    });
});
```

---

## 📚 Konsep Penting: R1CS

### Apa Itu R1CS?

**R1CS (Rank-1 Constraint System)** adalah:
- Representasi matematika dari circuit
- Set of constraints yang harus dipenuhi
- Format yang digunakan oleh zk-SNARK

### Contoh R1CS

**Circuit: `y = x * 2`**

**R1CS Representation:**
```
Constraint 1: y - 2*x = 0
```

**Untuk input x = 5:**
- y harus = 10
- Constraint: 10 - 2*5 = 0 ✅

### Inspect R1CS

**Gunakan snarkjs untuk inspect:**
```bash
snarkjs r1cs info output/hello.r1cs
```

**Output:**
```
[INFO] snarkJS: Curve: bn128
[INFO] snarkJS: # of Wires: 4
[INFO] snarkJS: # of Constraints: 1
[INFO] snarkJS: # of Private Inputs: 1
[INFO] snarkJS: # of Public Inputs: 0
[INFO] snarkJS: # of Outputs: 1
```

---

## 🎯 Persiapan untuk Praktik Lanjutan

### Yang Akan Dipelajari di Praktik:

1. **Trusted Setup Ceremony**
   - Powers of Tau ceremony
   - Phase 1 & Phase 2
   - Generate proving & verification keys

2. **Complex Circuits**
   - Multiple inputs/outputs
   - Conditional logic
   - Loops & arrays
   - Using circomlib components

3. **Proof Generation**
   - Generate witness
   - Create proof
   - Optimize proof size

4. **Verification**
   - Verify proof on-chain
   - Verify proof off-chain
   - Integration dengan smart contracts

5. **Best Practices**
   - Circuit optimization
   - Security considerations
   - Testing strategies
   - Deployment

### Resources untuk Belajar Lebih Lanjut:

**Documentation:**
- [Circom Documentation](https://docs.circom.io/)
- [snarkjs Documentation](https://github.com/iden3/snarkjs)
- [circomlib Examples](https://github.com/iden3/circomlib)

**Tutorials:**
- [Circom Tutorial](https://docs.circom.io/getting-started/installation/)
- [zk-SNARKs Tutorial](https://z.cash/technology/zksnarks/)

**Examples:**
- [Circom Examples](https://github.com/iden3/circomlib/tree/master/examples)
- [Tornado Cash Circuits](https://github.com/tornadocash/tornado-core)

---

## 🎓 Key Takeaways

1. **Circom adalah DSL untuk zk-SNARK circuits**
   - Mudah dipelajari
   - Powerful untuk complex circuits
   - Production-ready

2. **Setup Environment:**
   - Install Rust
   - Install Circom
   - Install snarkjs
   - Setup project structure

3. **Workflow Dasar:**
   - Write circuit (.circom)
   - Compile to R1CS
   - Generate witness
   - Create proof
   - Verify proof

4. **Persiapan untuk Praktik:**
   - Pahami konsep R1CS
   - Familiar dengan Circom syntax
   - Setup development environment
   - Explore examples

---

## 📝 Checklist Setup

Sebelum lanjut ke praktik, pastikan:

- [ ] Rust terinstall (`rustc --version`)
- [ ] Circom terinstall (`circom --version`)
- [ ] snarkjs terinstall (`snarkjs --version`)
- [ ] Project structure dibuat
- [ ] Hello World circuit berhasil di-compile
- [ ] Pahami konsep R1CS
- [ ] Baca Circom documentation
- [ ] Explore circomlib examples

---

## 🚀 Next Steps

**Setelah setup selesai, kita akan:**

1. **Membuat circuit yang lebih kompleks**
   - Multiple constraints
   - Conditional logic
   - Using libraries

2. **Trusted Setup Ceremony**
   - Powers of Tau
   - Generate keys
   - Security considerations

3. **Proof Generation & Verification**
   - Generate proofs
   - Verify proofs
   - Optimize performance

4. **Integration dengan Smart Contracts**
   - Deploy verifier contract
   - Verify proofs on-chain
   - Use cases praktis

---

## 📚 Referensi & Resources

**Documentation:**
- [Circom Official Docs](https://docs.circom.io/)
- [snarkjs GitHub](https://github.com/iden3/snarkjs)
- [circomlib GitHub](https://github.com/iden3/circomlib)

**Tutorials:**
- [Circom Getting Started](https://docs.circom.io/getting-started/installation/)
- [zk-SNARKs Explained](https://z.cash/technology/zksnarks/)

**Community:**
- [Circom Discord](https://discord.gg/iden3)
- [Zero-Knowledge Proofs Subreddit](https://reddit.com/r/zkproofs)

---

**Selamat! Environment Anda sudah siap untuk praktik ZKP! 🎉**

**Praktik lengkap akan dibahas di sesi lanjutan.**

---

**Selanjutnya:** [Bagian 5: Praktik - Age Verification →](./05-praktik-age-verification.md)

**Kembali ke:** [Sesi 9 Overview →](./sesi-9-kelas-rutin-batch-4.md)

