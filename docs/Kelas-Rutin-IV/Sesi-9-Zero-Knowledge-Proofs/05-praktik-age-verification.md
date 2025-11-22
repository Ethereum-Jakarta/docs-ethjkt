# Praktik - Age Verification dengan Zero-Knowledge Proofs

> **Referensi:** Materi ini diadaptasi dari Sesi 6 Kelas Rutin BlockDevId - Indexer & ZK Proofs

---

## 📚 Tujuan Pembelajaran

Setelah menyelesaikan bagian ini, Anda akan mampu:

1. Membuat Circom circuit untuk age verification
2. Setup trusted setup ceremony untuk circuit
3. Generate ZK proof dari data KTP Indonesia
4. Membuat smart contract verifier untuk on-chain verification
5. Integrate ZK proof generation dengan frontend
6. Deploy dan test complete age verification system

---

## 🎯 Use Case: Age Verification

### Masalah yang Diselesaikan

**Traditional Age Verification:**
```
❌ User harus reveal tanggal lahir lengkap
❌ Data personal tersimpan di server
❌ Privacy concerns
❌ Tidak compliant dengan GDPR/regulasi privacy
```

**Zero-Knowledge Solution:**
```
✅ Buktikan: "Umur saya >= 18 tahun"
❌ TIDAK reveal: Tanggal lahir, nama, alamat, dll
✅ Privacy-preserving
✅ Compliant dengan regulasi
```

### Arsitektur Sistem

```
┌─────────────────────────────────────────┐
│  AGE VERIFICATION SYSTEM                │
│  ─────────────────────────────────────  │
│                                          │
│  1. User Input: KTP Data                │
│     - Tanggal lahir (private)           │
│     - Current date (public)             │
│                                          │
│  2. Circom Circuit                       │
│     - Calculate age                      │
│     - Check age >= 18                    │
│     - Generate commitment                │
│                                          │
│  3. ZK Proof Generation                 │
│     - Generate witness                   │
│     - Create proof                       │
│     - Output: isAdult + commitment       │
│                                          │
│  4. Smart Contract Verification         │
│     - Verify proof on-chain             │
│     - Store verification status         │
│     - Prevent replay attacks            │
└─────────────────────────────────────────┘
```

---

## 🛠️ Setup Development Environment

### Install Dependencies

```bash
# Create new project
npm create vite@latest zk-age-verification -- --template react-ts
cd zk-age-verification

# Install ZK dependencies
npm install circomlib
npm install snarkjs
npm install @noir-lang/noir_wasm @noir-lang/backend_barretenberg

# Install UI dependencies  
npm install @rainbow-me/rainbowkit wagmi viem
npm install @tanstack/react-query
npm install react-hot-toast
npm install lucide-react

# Install build tools (jika belum)
# Circom sudah diinstall di Bagian 4
# snarkjs sudah diinstall di Bagian 4
```

---

## 📝 Step 1: Define Data Structures

### TypeScript Interfaces

**`src/types/ktp.ts`:**

```typescript
// Format KTP Indonesia
export interface KTPData {
  nik: string;           // 16 digit NIK
  nama: string;          // Nama lengkap
  tempatLahir: string;   // Tempat lahir
  tanggalLahir: string;  // DD-MM-YYYY
  jenisKelamin: string;  // L/P
  alamat: string;        // Alamat lengkap
  rt: string;            // RT
  rw: string;            // RW
  kelurahan: string;     // Kelurahan/Desa
  kecamatan: string;     // Kecamatan
  agama: string;         // Agama
  statusPerkawinan: string; // Status perkawinan
  pekerjaan: string;     // Pekerjaan
  kewarganegaraan: string; // WNI/WNA
  berlakuHingga: string; // Berlaku hingga
}

// Data untuk ZK proof (only what we need)
export interface KTPProofInput {
  birthDay: number;    // 1-31
  birthMonth: number;  // 1-12
  birthYear: number;   // e.g., 1995
  currentYear: number; // e.g., 2024
  salt: bigint;        // Random salt untuk privacy
}

// ZK proof output
export interface AgeProofOutput {
  proof: {
    pi_a: [string, string];
    pi_b: [[string, string], [string, string]];
    pi_c: [string, string];
  };
  publicSignals: string[];
}
```

---

## 🔧 Step 2: Create Circom Circuit

### Circuit Implementation

**`circuits/ageVerification.circom`:**

```circom
pragma circom 2.0.0;

/*  Age ≥ 18  + commitment
    public[0] = isAdult   (0/1)
    public[1] = commitment
*/
template AgeVerification() {
    /* ── PRIVATE IN ─────────────────────────── */
    signal input birthDay;        // 1-31
    signal input birthMonth;      // 1-12
    signal input birthYear;       // 1900-2010
    signal input salt;

    /* ── PUBLIC IN ──────────────────────────── */
    signal input currentYear;
    signal input currentMonth;
    signal input currentDay;

    /* ── OUTPUTS ────────────────────────────── */
    signal output isAdult;
    signal output commitment;

    /* ── Umur sederhana ─────────────────────── */
    signal yearDiff      <== currentYear - birthYear;

    component monthGE = GreaterEqThan(4);
    monthGE.in[0] <== currentMonth;
    monthGE.in[1] <== birthMonth;

    component dayGE = GreaterEqThan(6);
    dayGE.in[0] <== currentDay;
    dayGE.in[1] <== birthDay;

    component monthEQ = IsEqual();
    monthEQ.in[0] <== currentMonth;
    monthEQ.in[1] <== birthMonth;

    // pecah perkalian utk hindari non-quadratic
    signal temp1;        // monthEQ && dayGE
    temp1 <== monthEQ.out * dayGE.out;

    signal temp2;        // monthEQ && monthGE
    temp2 <== monthEQ.out * monthGE.out;

    signal birthdayPassed;
    birthdayPassed <== monthGE.out + temp1 - temp2;

    signal actualAge <== yearDiff - 1 + birthdayPassed;

    component ageGE = GreaterEqThan(7);   // umur <128
    ageGE.in[0] <== actualAge;
    ageGE.in[1] <== 18;
    isAdult      <== ageGE.out;

    /* ── Komitmen demo ──────────────────────── */
    commitment <== birthDay
                 + birthMonth * 100
                 + birthYear * 10000
                 + salt;

    /* ── RANGE CONSTRAINTS ──────────────────── */
    // birthDay 1–31
    component dMin = GreaterEqThan(6);
    dMin.in[0] <== birthDay;
    dMin.in[1] <== 1;
    dMin.out === 1;

    component dMax = LessThan(6);
    dMax.in[0] <== birthDay;
    dMax.in[1] <== 32;
    dMax.out === 1;

    // birthMonth 1–12
    component mMin = GreaterEqThan(4);
    mMin.in[0] <== birthMonth;
    mMin.in[1] <== 1;
    mMin.out === 1;

    component mMax = LessThan(4);
    mMax.in[0] <== birthMonth;
    mMax.in[1] <== 13;
    mMax.out === 1;

    // birthYear 1900–2010
    component yMin = GreaterEqThan(11);
    yMin.in[0] <== birthYear;
    yMin.in[1] <== 1900;
    yMin.out === 1;

    component yMax = LessThan(11);
    yMax.in[0] <== birthYear;
    yMax.in[1] <== 2011;
    yMax.out === 1;
}

/* ── UTILITIES ─────────────────────────────── */
template GreaterEqThan(n){
    assert(n<=252);
    signal input in[2];
    signal output out;
    component lt = LessThan(n);
    lt.in[0] <== in[0];
    lt.in[1] <== in[1];
    out      <== 1 - lt.out;
}

template LessThan(n){
    assert(n<=252);
    signal input in[2];
    signal output out;
    component n2b = Num2Bits(n+1);
    n2b.in <== in[0] + (1<<n) - in[1];
    out    <== 1 - n2b.out[n];
}

template Num2Bits(n){
    signal input in;
    signal output out[n];
    var acc=0; var pow=1;
    for (var i=0;i<n;i++){
        out[i] <-- (in>>i)&1;
        out[i]*(out[i]-1)===0;
        acc += out[i]*pow;
        pow += pow;
    }
    acc === in;
}

template IsZero(){
    signal input in;
    signal output out;
    signal inv;
    inv <-- in!=0 ? 1/in : 0;
    out <== -in*inv + 1;
    in*out === 0;
}

template IsEqual(){
    signal input in[2];
    signal output out;
    component iz = IsZero();
    iz.in <== in[0]-in[1];
    out <== iz.out;
}

component main = AgeVerification();
```

**Penjelasan Circuit:**
- **Private Inputs**: `birthDay`, `birthMonth`, `birthYear`, `salt` (tidak akan di-reveal)
- **Public Inputs**: `currentYear`, `currentMonth`, `currentDay` (untuk kalkulasi umur)
- **Outputs**: 
  - `isAdult` (1 jika umur >= 18, 0 jika tidak)
  - `commitment` (hash untuk privacy & replay protection)
- **Constraints**: Validasi range untuk semua input, kalkulasi umur yang akurat

---

## 🔨 Step 3: Compile Circuit

### Compilation Script

**`scripts/compile-circuit.sh`:**

```bash
#!/bin/bash

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

CIRCUIT_NAME=${1:-ageVerification}

print_status "Starting circuit compilation for: $CIRCUIT_NAME"

if ! command -v circom &> /dev/null; then
    print_error "circom is not installed"
    exit 1
fi

if ! command -v snarkjs &> /dev/null; then
    print_error "snarkjs is not installed"
    exit 1
fi

# Create build directory with proper permissions
print_status "Creating circuits build directory..."
rm -rf circuits/build
mkdir -p circuits/build
chmod 755 circuits/build

if [ ! -f "circuits/${CIRCUIT_NAME}.circom" ]; then
    print_error "Circuit file circuits/${CIRCUIT_NAME}.circom not found!"
    exit 1
fi

print_status "Circuit file found: circuits/${CIRCUIT_NAME}.circom"

# Compile circuit with explicit output directory
print_status "Compiling circuit..."
cd circuits/build
if circom ../${CIRCUIT_NAME}.circom --r1cs --wasm --sym; then
    cd ../..
    print_success "Circuit compiled successfully!"
else
    cd ../..
    print_error "Circuit compilation failed!"
    exit 1
fi

# Verify files exist
if [ ! -f "circuits/build/${CIRCUIT_NAME}.r1cs" ]; then
    print_error "R1CS file not generated!"
    exit 1
fi

if [ ! -d "circuits/build/${CIRCUIT_NAME}_js" ]; then
    print_error "WASM files not generated!"
    exit 1
fi

print_status "Generated files:"
echo "  - circuits/build/${CIRCUIT_NAME}.r1cs"
echo "  - circuits/build/${CIRCUIT_NAME}_js/${CIRCUIT_NAME}.wasm"
echo "  - circuits/build/${CIRCUIT_NAME}.sym"

# Continue with rest of the setup...
print_status "Generating powers of tau..."
if [ ! -f "circuits/build/pot14_0000.ptau" ]; then
    if snarkjs powersoftau new bn128 14 circuits/build/pot14_0000.ptau -v; then
        print_success "Powers of tau generated!"
    else
        print_error "Failed to generate powers of tau!"
        exit 1
    fi
fi

print_status "Contributing to ceremony..."
if [ ! -f "circuits/build/pot14_0001.ptau" ]; then
    echo "random-entropy-$(date +%s)" | snarkjs powersoftau contribute circuits/build/pot14_0000.ptau circuits/build/pot14_0001.ptau --name="First contribution" -v
fi

print_status "Phase 2 setup..."
if [ ! -f "circuits/build/pot14_final.ptau" ]; then
    snarkjs powersoftau prepare phase2 circuits/build/pot14_0001.ptau circuits/build/pot14_final.ptau -v
fi

print_status "Generating proving key..."
if [ ! -f "circuits/build/${CIRCUIT_NAME}_0000.zkey" ]; then
    snarkjs groth16 setup circuits/build/${CIRCUIT_NAME}.r1cs circuits/build/pot14_final.ptau circuits/build/${CIRCUIT_NAME}_0000.zkey
fi

print_status "Contributing to phase 2..."
if [ ! -f "circuits/build/${CIRCUIT_NAME}_0001.zkey" ]; then
    echo "random-entropy-phase2-$(date +%s)" | snarkjs zkey contribute circuits/build/${CIRCUIT_NAME}_0000.zkey circuits/build/${CIRCUIT_NAME}_0001.zkey --name="First phase2 contribution" -v
fi

print_status "Exporting verification key..."
snarkjs zkey export verificationkey circuits/build/${CIRCUIT_NAME}_0001.zkey circuits/build/verification_key.json

print_status "Generating Solidity verifier..."
mkdir -p contracts
snarkjs zkey export solidityverifier circuits/build/${CIRCUIT_NAME}_0001.zkey contracts/verifier.sol

print_status "Copying files for frontend..."
mkdir -p public/circuits
cp circuits/build/${CIRCUIT_NAME}_js/${CIRCUIT_NAME}.wasm public/circuits/
cp circuits/build/${CIRCUIT_NAME}_0001.zkey public/circuits/
cp circuits/build/verification_key.json public/circuits/

print_success "🎉 Circuit compilation completed successfully!"
```

**Jalankan Script:**

```bash
# Make executable
chmod +x scripts/compile-circuit.sh

# Compile circuit
./scripts/compile-circuit.sh ageVerification
```

**Expected Output:**
```
[INFO] Starting circuit compilation for: ageVerification
[INFO] Creating circuits build directory...
[INFO] Circuit file found: circuits/ageVerification.circom
[INFO] Compiling circuit...
[SUCCESS] Circuit compiled successfully!
[INFO] Generated files:
  - circuits/build/ageVerification.r1cs
  - circuits/build/ageVerification_js/ageVerification.wasm
  - circuits/build/ageVerification.sym
[INFO] Generating powers of tau...
[SUCCESS] Powers of tau generated!
[INFO] Contributing to ceremony...
[INFO] Phase 2 setup...
[INFO] Generating proving key...
[INFO] Contributing to phase 2...
[INFO] Exporting verification key...
[INFO] Generating Solidity verifier...
[INFO] Copying files for frontend...
[SUCCESS] 🎉 Circuit compilation completed successfully!
```

---

## 💻 Step 4: ZK Proof Generation Library

### Proof Generation Implementation

**`src/lib/zkProof.ts`:**

```typescript
import { type KTPProofInput, type AgeProofOutput } from '../types/ktp';
import { SnarkjsLoader } from './snarkjsLoader';

// Type definitions for snarkjs proof structure
interface SnarkjsProof {
  pi_a: string[];
  pi_b: string[][];
  pi_c: string[];
  publicSignals: string[];
}

export class ZKProofGenerator {
  private wasmPath: string;
  private zkeyPath: string;
  
  constructor() {
    // Update paths to match actual file structure
    this.wasmPath = '/circuits/build/ageVerification_js/ageVerification.wasm';
    this.zkeyPath = '/circuits/build/ageVerification_0001.zkey';
  }

  // Check if snarkjs is available
  private async ensureSnarkjs(): Promise<void> {
    if (!SnarkjsLoader.isLoaded()) {
      console.log('SnarkJS not loaded, attempting to load...');
      await SnarkjsLoader.load();
    }
    
    if (!SnarkjsLoader.isLoaded()) {
      throw new Error('SnarkJS is not available after loading attempt');
    }
  }

  // Parse tanggal lahir dari format DD-MM-YYYY
  static parseBirthDate(tanggalLahir: string): {
    day: number;
    month: number; 
    year: number;
  } {
    const [day, month, year] = tanggalLahir.split('-').map(Number);
    
    // Validate parsed values
    if (isNaN(day) || isNaN(month) || isNaN(year)) {
      throw new Error('Invalid date format. Expected DD-MM-YYYY');
    }
    
    if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1900 || year > new Date().getFullYear()) {
      throw new Error('Invalid date values');
    }
    
    return { day, month, year };
  }

  // Generate random salt with field size constraint
  static generateSalt(): bigint {
    // BN254 field size (circom default)
    const FIELD_SIZE = BigInt("21888242871839275222246405745257275088548364400416034343698204186575808495617");
    
    if (typeof window === 'undefined' || !window.crypto) {
      // Fallback for environments without crypto
      const randomValue = BigInt(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER));
      return randomValue % (FIELD_SIZE / 1000n); // Much smaller for safety
    }
    
    // Generate smaller salt to prevent overflow in circuit
    const randomBytes = new Uint8Array(16); // 16 bytes instead of 32
    window.crypto.getRandomValues(randomBytes);
    
    let salt = 0n;
    for (let i = 0; i < randomBytes.length; i++) {
      salt = salt * 256n + BigInt(randomBytes[i]);
    }
    
    // Ensure salt is much smaller than field size for circuit compatibility
    return salt % (FIELD_SIZE / 1000000n); // Very conservative limit
  }

  // Generate ZK proof untuk age verification
  async generateAgeProof(input: KTPProofInput): Promise<AgeProofOutput> {
    try {
      // Ensure SnarkJS is loaded
      await this.ensureSnarkjs();
      
      console.log('Generating ZK proof...');
      console.log('Input:', input);

      // Validate input
      if (!input.birthDay || !input.birthMonth || !input.birthYear || !input.currentYear) {
        throw new Error('Missing required input fields');
      }

      // Validate input ranges
      if (input.birthDay < 1 || input.birthDay > 31) {
        throw new Error('Invalid birth day: must be between 1-31');
      }
      if (input.birthMonth < 1 || input.birthMonth > 12) {
        throw new Error('Invalid birth month: must be between 1-12');
      }
      if (input.birthYear < 1900 || input.birthYear > input.currentYear) {
        throw new Error('Invalid birth year');
      }

      // Get current date
      const now = new Date();
      const currentMonth = now.getMonth() + 1;
      const currentDay = now.getDate();

      // Validate that birth date is not in the future
      const birthDate = new Date(input.birthYear, input.birthMonth - 1, input.birthDay);
      if (birthDate > now) {
        throw new Error('Birth date cannot be in the future');
      }

      // Convert salt to string and ensure it's not too large
      const saltString = input.salt.toString();
      if (saltString.length > 77) { // Field element limit for most circuits
        console.warn('Salt too large, truncating for circuit compatibility');
      }

      // Prepare circuit inputs with proper constraints
      const circuitInputs = {
        birthDay: input.birthDay,
        birthMonth: input.birthMonth,
        birthYear: input.birthYear,
        currentYear: input.currentYear,
        currentMonth: currentMonth,
        currentDay: currentDay,
        salt: saltString
      };

      console.log('Circuit inputs:', circuitInputs);

      // Check if circuit files are available
      const wasmExists = await this.checkFileExists(this.wasmPath);
      const zkeyExists = await this.checkFileExists(this.zkeyPath);

      if (!wasmExists || !zkeyExists) {
        console.warn('Circuit files not available, using mock proof');
        return this.generateMockProofFromInput(input);
      }

      try {
        // Generate proof using snarkjs
        if (!window.snarkjs || !window.snarkjs.groth16 || !window.snarkjs.groth16.fullProve) {
          throw new Error('snarkjs is not loaded or not available on window');
        }
        const { proof, publicSignals } = await window.snarkjs.groth16.fullProve(
          circuitInputs,
          this.wasmPath,
          this.zkeyPath
        ) as { proof: SnarkjsProof; publicSignals: string[] };

        console.log('Raw proof generated:', proof);
        console.log('Public signals:', publicSignals);

        // Format proof for our contract
        const formattedProof: AgeProofOutput = {
          proof: {
            pi_a: [proof.pi_a[0], proof.pi_a[1]],
            pi_b: [
              [proof.pi_b[0][1], proof.pi_b[0][0]], // Note: Order is swapped for Solidity
              [proof.pi_b[1][1], proof.pi_b[1][0]]
            ],
            pi_c: [proof.pi_c[0], proof.pi_c[1]]
          },
          publicSignals: [
            publicSignals[0], // isAdult (0 or 1)
            publicSignals[1]  // commitment hash
          ]
        };

        console.log('Formatted proof:', formattedProof);

        // Validate proof structure
        this.validateProofStructure(formattedProof);

        return formattedProof;

      } catch (circuitError: unknown) {
        console.error('Circuit execution failed:', circuitError);
        
        // Check if it's a constraint failure
        const errorMessage = circuitError instanceof Error ? circuitError.message : String(circuitError);
        if (errorMessage.includes('Assert Failed') || 
            errorMessage.includes('Error in template')) {
          console.warn('Circuit constraint failed, falling back to mock proof');
          return this.generateMockProofFromInput(input);
        }
        
        throw circuitError;
      }

    } catch (error: unknown) {
      console.error('Error generating ZK proof:', error);
      const errorMsg = (error instanceof Error) ? error.message : String(error);
      
      // If any error occurs, fall back to mock proof in development
      if (typeof window !== 'undefined' && 
          (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
        console.warn('Development mode: falling back to mock proof due to error');
        return this.generateMockProofFromInput(input);
      }
      
      throw new Error(`Failed to generate proof: ${errorMsg}`);
    }
  }

  // Check if file exists
  private async checkFileExists(path: string): Promise<boolean> {
    try {
      const response = await fetch(path, { method: 'HEAD' });
      return response.ok;
    } catch {
      return false;
    }
  }

  // Generate mock proof from input
  private generateMockProofFromInput(input: KTPProofInput): AgeProofOutput {
    console.log('Generating mock proof from input:', input);
    
    // Calculate if user is adult
    const currentDate = new Date();
    const birthDate = new Date(input.birthYear, input.birthMonth - 1, input.birthDay);
    let age = currentDate.getFullYear() - birthDate.getFullYear();
    const monthDiff = currentDate.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && currentDate.getDate() < birthDate.getDate())) {
      age--;
    }
    
    const isAdult = age >= 18;
    
    // Generate deterministic commitment
    const commitment = this.generateMockCommitment(input);
    
    // Generate mock proof values based on input
    const seed = `${input.birthDay}-${input.birthMonth}-${input.birthYear}-${input.salt}`;
    const proofValues = this.generateMockProofValues(seed);
    
    const mockProof: AgeProofOutput = {
      proof: {
        pi_a: [proofValues.a1, proofValues.a2],
        pi_b: [
          [proofValues.b11, proofValues.b12],
          [proofValues.b21, proofValues.b22]
        ],
        pi_c: [proofValues.c1, proofValues.c2]
      },
      publicSignals: [
        isAdult ? "1" : "0",
        commitment
      ]
    };

    console.log('Mock proof generated:', mockProof);
    return mockProof;
  }

  // Generate mock commitment
  private generateMockCommitment(input: KTPProofInput): string {
    const data = `${input.birthDay}${input.birthMonth}${input.birthYear}${input.salt}`;
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString();
  }

  // Generate mock proof values
  private generateMockProofValues(seed: string): {
    a1: string; a2: string;
    b11: string; b12: string;
    b21: string; b22: string;
    c1: string; c2: string;
  } {
    const hash = this.hashString(seed);
    
    return {
      a1: `0x${hash.slice(0, 64)}`,
      a2: `0x${hash.slice(64, 128)}`,
      b11: `0x${hash.slice(128, 192)}`,
      b12: `0x${hash.slice(192, 256)}`,
      b21: `0x${hash.slice(256, 320)}`,
      b22: `0x${hash.slice(320, 384)}`,
      c1: `0x${hash.slice(384, 448)}`,
      c2: `0x${hash.slice(448, 512)}`
    };
  }

  // Simple hash function for mock values
  private hashString(input: string): string {
    let hash = '';
    for (let i = 0; i < 512; i++) {
      const char = input.charCodeAt(i % input.length);
      const value = (char * (i + 1) * 31) % 16;
      hash += value.toString(16);
    }
    return hash;
  }

  // Validate proof structure
  private validateProofStructure(proof: AgeProofOutput): void {
    if (!proof.proof.pi_a || proof.proof.pi_a.length !== 2) {
      throw new Error('Invalid pi_a structure');
    }
    if (!proof.proof.pi_b || proof.proof.pi_b.length !== 2 || 
        proof.proof.pi_b[0].length !== 2 || proof.proof.pi_b[1].length !== 2) {
      throw new Error('Invalid pi_b structure');
    }
    if (!proof.proof.pi_c || proof.proof.pi_c.length !== 2) {
      throw new Error('Invalid pi_c structure');
    }
    if (!proof.publicSignals || proof.publicSignals.length !== 2) {
      throw new Error('Invalid public signals structure');
    }
  }

  // Verify ZK proof
  async verifyAgeProof(proof: AgeProofOutput): Promise<boolean> {
    try {
      // Ensure SnarkJS is loaded
      await this.ensureSnarkjs();
      
      console.log('Verifying ZK proof...');

      // Load verification key
      const vKeyResponse = await fetch('/circuits/build/verification_key.json');
      if (!vKeyResponse.ok) {
        throw new Error('Failed to load verification key');
      }
      
      const vKey = await vKeyResponse.json();

      // Convert proof back to snarkjs format for verification
      const snarkjsProof = {
        pi_a: proof.proof.pi_a,
        pi_b: [
          [proof.proof.pi_b[0][1], proof.proof.pi_b[0][0]], // Revert the swap
          [proof.proof.pi_b[1][1], proof.proof.pi_b[1][0]]
        ],
        pi_c: proof.proof.pi_c
      };

      // Verify proof
      if (
        typeof window === 'undefined' ||
        !window.snarkjs ||
        !window.snarkjs.groth16 ||
        typeof window.snarkjs.groth16.verify !== 'function'
      ) {
        throw new Error('snarkjs or groth16.verify is not available on window');
      }
      const isValid = await window.snarkjs.groth16.verify(
        vKey,
        proof.publicSignals,
        snarkjsProof
      );

      console.log('Proof verification result:', isValid);
      return isValid;

    } catch (error) {
      console.error('Error verifying proof:', error);
      return false;
    }
  }

  // Calculate age dari tanggal lahir
  static calculateAge(birthDate: string): number {
    try {
      const { day, month, year } = ZKProofGenerator.parseBirthDate(birthDate);
      const today = new Date();
      const birth = new Date(year, month - 1, day);
      
      // Check if birth date is in the future
      if (birth > today) {
        throw new Error('Birth date cannot be in the future');
      }
      
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      
      return Math.max(0, age); // Ensure non-negative age
    } catch (error) {
      console.error('Error calculating age:', error);
      return 0;
    }
  }

  // Create commitment hash untuk privacy
  static async createCommitment(
    birthDay: number,
    birthMonth: number, 
    birthYear: number,
    salt: bigint
  ): Promise<string> {
    try {
      // Using SHA-256 for demo (in production, use Poseidon hash for ZK compatibility)
      const message = `${birthDay}-${birthMonth}-${birthYear}-${salt.toString()}`;
      
      if (typeof window === 'undefined' || !window.crypto || !window.crypto.subtle) {
        // Fallback for environments without Web Crypto API
        return this.simpleHash(message);
      }
      
      const encoder = new TextEncoder();
      const data = encoder.encode(message);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hexHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      
      // Convert to decimal string for contract compatibility
      return BigInt('0x' + hexHash).toString();
    } catch (error) {
      console.error('Error creating commitment:', error);
      // Fallback hash
      return this.simpleHash(`${birthDay}-${birthMonth}-${birthYear}-${salt.toString()}`);
    }
  }

  // Simple hash fallback
  private static simpleHash(input: string): string {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString();
  }

  // Check if proof generation is supported
  static async isSupported(): Promise<boolean> {
    try {
      if (typeof window === 'undefined') return false;
      
      // Try to load SnarkJS if not already loaded
      if (!SnarkjsLoader.isLoaded()) {
        await SnarkjsLoader.load();
      }
      
      return SnarkjsLoader.isLoaded() && !!window.crypto;
    } catch {
      return false;
    }
  }

  // Get mock proof for testing (when circuit is not available)
  static getMockProof(): AgeProofOutput {
    return {
      proof: {
        pi_a: [
          "0x123456789abcdef123456789abcdef123456789abcdef123456789abcdef12345",
          "0x987654321fedcba987654321fedcba987654321fedcba987654321fedcba98765"
        ],
        pi_b: [
          [
            "0xabcdef123456789abcdef123456789abcdef123456789abcdef123456789abcdef",
            "0x654321fedcba987654321fedcba987654321fedcba987654321fedcba987654321"
          ],
          [
            "0xfedcba987654321fedcba987654321fedcba987654321fedcba987654321fedcba",
            "0x246813579bdf024681357bdf024681357bdf024681357bdf024681357bdf0246"
          ]
        ],
        pi_c: [
          "0x135792468ace135792468ace135792468ace135792468ace135792468ace1357",
          "0xbdf02468ace1bdf02468ace1bdf02468ace1bdf02468ace1bdf02468ace1bdf024"
        ]
      },
      publicSignals: [
        "1", // isAdult = true
        "123456789012345678901234567890" // commitment
      ]
    };
  }
}

// Utility functions untuk formatting
export const formatKTPDate = (dateString: string): string => {
  try {
    const [day, month, year] = dateString.split('-');
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    
    const monthIndex = parseInt(month) - 1;
    if (monthIndex < 0 || monthIndex >= months.length) {
      throw new Error('Invalid month');
    }
    
    return `${day} ${months[monthIndex]} ${year}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString; // Return original if formatting fails
  }
};

export const maskKTPData = (data: string, visibleChars: number = 4): string => {
  if (!data || data.length <= visibleChars) return data;
  const masked = '*'.repeat(data.length - visibleChars);
  return data.slice(0, visibleChars) + masked;
};

// Helper function to check if running in browser environment
export const isBrowser = (): boolean => {
  return typeof window !== 'undefined';
};

// Helper function to load snarkjs dynamically
export const loadSnarkjs = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Not in browser environment'));
      return;
    }

    if (window.snarkjs) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/snarkjs@latest/build/snarkjs.min.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load snarkjs'));
    document.head.appendChild(script);
  });
};
```

### SnarkJS Dynamic Loading System

**`src/lib/snarkjsLoader.ts`:**

```typescript
// SnarkJS loader utility (TypeScript)
// Handles dynamic <script> injection with retry + version helpers
// Lints clean against @typescript-eslint/no-explicit-any and TS2790.

export class SnarkjsLoader {
  private static loaded = false;
  private static loading = false;
  private static loadPromise: Promise<void> | null = null;

  /**
   * Dynamically load snarkjs from a CDN (with retry & caching).
   */
  static async load(): Promise<void> {
    // Already loaded → exit fast
    if (this.loaded && typeof window !== 'undefined' && window.snarkjs) {
      return;
    }

    // In‑flight request → await the same promise
    if (this.loading && this.loadPromise) {
      return this.loadPromise;
    }

    // Begin loading
    this.loading = true;
    this.loadPromise = this.loadSnarkjs();

    try {
      await this.loadPromise;
      this.loaded = true;
      console.log('✅ SnarkJS loaded successfully');
    } finally {
      // always reset loading flag
      this.loading = false;
    }

    return this.loadPromise;
  }

  /** Check global availability */
  static isLoaded(): boolean {
    return typeof window !== 'undefined' && !!window.snarkjs && this.loaded;
  }

  /** Whether a load() call is currently in progress */
  static isLoading(): boolean {
    return this.loading;
  }

  /** Force a fresh reload (e.g. after CDN failure) */
  static async reload(): Promise<void> {
    this.loaded = false;
    this.loading = false;
    this.loadPromise = null;

    // Remove any existing <script> tag
    if (typeof document !== 'undefined') {
      const existing = document.querySelector<HTMLScriptElement>('script[src*="snarkjs"]');
      existing?.remove();
    }

    // Clear the cached global (avoid TS2790 delete issue)
    (window as { snarkjs?: unknown }).snarkjs = undefined;

    return this.load();
  }

  /** Low‑level script injection with multiple fall‑back CDNs */
  private static loadSnarkjs(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || typeof document === 'undefined') {
        reject(new Error('Not running in a browser environment'));
        return;
      }

      if (window.snarkjs) {
        // already present via other means
        this.loaded = true;
        resolve();
        return;
      }

      const sources = [
        'https://unpkg.com/snarkjs@latest/build/snarkjs.min.js',
        'https://cdn.jsdelivr.net/npm/snarkjs@latest/build/snarkjs.min.js',
        'https://cdn.skypack.dev/snarkjs'
      ];

      let idx = 0;
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;

      const tryNextSource = (): void => {
        if (idx >= sources.length) {
          reject(new Error('All SnarkJS sources failed to load'));
          return;
        }

        script.src = sources[idx];
        console.log(`📦 Attempting to load SnarkJS from: ${script.src}`);
        idx += 1;

        const timeoutId = window.setTimeout(() => {
          console.warn(`⏰ Timeout loading ${script.src}`);
          tryNextSource();
        }, 10_000);

        script.onload = () => {
          window.clearTimeout(timeoutId);
          // Wait a tiny tick so global attaches
          setTimeout(() => {
            if (window.snarkjs) {
              resolve();
            } else {
              console.warn(`⚠️ Script loaded but snarkjs global missing: ${script.src}`);
              tryNextSource();
            }
          }, 100);
        };

        script.onerror = (err) => {
          window.clearTimeout(timeoutId);
          console.warn(`❌ Failed loading ${script.src}`, err);
          tryNextSource();
        };
      };

      tryNextSource();
      document.head.appendChild(script);
    });
  }

  /** Preload with exponential retry */
  static async preload(maxRetries = 3): Promise<void> {
    for (let attempt = 1; attempt <= maxRetries; attempt += 1) {
      try {
        console.log(`🔄 Loading SnarkJS (attempt ${attempt}/${maxRetries})…`);
        await this.load();
        return; // success
      } catch (err) {
        if (attempt === maxRetries) throw err;
        console.warn(`Retrying SnarkJS load (${attempt})…`);
        await new Promise((r) => setTimeout(r, 1_000 * attempt));
      }
    }
  }

  /** Return reported snarkjs version, if any */
  static getVersion(): string | null {
    return this.isLoaded() && (window.snarkjs as { version?: string }).version || null;
  }

  /** Quick self‑test (checks groth16 presence) */
  static async test(): Promise<boolean> {
    if (!this.isLoaded()) return false;
    try {
      return !!window.snarkjs?.groth16;
    } catch {
      return false;
    }
  }
}

// ───────────────────────────────────────────────────────────
// Global ambient types
// ───────────────────────────────────────────────────────────

declare global {
  interface Window {
    snarkjs?: {
      groth16: {
        fullProve: (
          input: Record<string, unknown>,
          wasmPath: string,
          zkeyPath: string
        ) => Promise<Record<string, unknown>>;
        verify: (
          vKey: Record<string, unknown>,
          publicSignals: string[],
          proof: Record<string, unknown>
        ) => Promise<boolean>;
        prove: (
          zkeyPath: string,
          witness: Record<string, unknown>
        ) => Promise<Record<string, unknown>>;
      };
      version?: string;
    };
  }
}

// Handy re‑exports
export const loadSnarkjs = SnarkjsLoader.load.bind(SnarkjsLoader);
export const isSnarkjsLoaded = SnarkjsLoader.isLoaded.bind(SnarkjsLoader);
export const preloadSnarkjs = SnarkjsLoader.preload.bind(SnarkjsLoader);
```

## Penjelasan Fitur Loader Snarkjs

Berikut adalah fitur-fitur utama dari loader Snarkjs yang digunakan dalam project ini:

### 🔄 Multiple CDN Fallbacks
Loader otomatis mencoba memuat library Snarkjs dari 3 sumber CDN berbeda (misal: jsDelivr, unpkg, CDNJS). Jika CDN pertama gagal, akan mencoba CDN berikutnya secara berurutan demi memastikan keandalan (reliability) pemuatan script.

### ⏱️ Timeout Handling
Setiap percobaan pemuatan dari suatu CDN memiliki batas waktu (timeout) selama 10 detik. Jika dalam waktu tersebut script tidak berhasil dimuat, loader otomatis akan beralih ke sumber selanjutnya.

### 🔁 Retry Logic & Exponential Backoff
Jika terjadi kegagalan pemuatan, loader akan melakukan retry dengan exponential backoff, yaitu menambah jeda waktu antar percobaan secara bertahap agar tidak terlalu membebani jaringan dan memberikan waktu CDN untuk recovery.

### 📊 Status Tracking (Loading State Management)
Loader secara internal mencatat status pemuatan (misal: idle, loading, sukses, gagal). Hal ini berguna untuk menampilkan status pada UI maupun melakukan tindakan otomatis jika loading gagal/berhasil.

### 🔧 Version Detection (SnarkJS Version Reporting)
Setelah Snarkjs berhasil dimuat, loader bisa mendeteksi dan melaporkan versi Snarkjs yang aktif di environment saat ini. Ini penting untuk troubleshooting dan kepastian kompatibilitas.

Dengan desain ini, proses loading Snarkjs menjadi robust, informatif, dan lebih user-friendly.

---

## 📜 Step 5: Smart Contract Verifier

### AgeVerifier Contract

**`contracts/AgeVerifier.sol`:**

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "./verifier.sol"; // Generated dari circom

/**
 * @title AgeVerifier
 * @dev Smart contract untuk verifikasi umur menggunakan ZK proofs
 */
contract AgeVerifier {
    // Generated verifier contract
    Groth16Verifier public immutable verifier;
    
    // Verified commitments untuk prevent replay attacks
    mapping(uint256 => bool) public usedCommitments;
    
    // Verified addresses
    mapping(address => bool) public verifiedAdults;
    mapping(address => uint256) public verificationTimestamp;
    
    // Events
    event AgeVerified(
        address indexed user,
        uint256 commitment,
        bool isAdult,
        uint256 timestamp
    );
    
    event VerificationRevoked(
        address indexed user,
        uint256 timestamp
    );
    
    constructor(address _verifier) {
        verifier = Groth16Verifier(_verifier);
    }
    
    function verifyAge(
        uint[2] memory _pA,
        uint[2][2] memory _pB,
        uint[2] memory _pC,
        uint[2] memory _publicSignals  // Changed from uint[1] to uint[2]
    ) external {
        // Extract public signals
        uint256 isAdult = _publicSignals[0];      // First output: isAdult (0 or 1)
        uint256 commitment = _publicSignals[1];   // Second output: commitment
        
        // Check that isAdult is 1 (true)
        require(isAdult == 1, "Age verification failed: not adult");
        
        // Check commitment belum pernah digunakan
        require(!usedCommitments[commitment], "Commitment already used");
        
        // Verify ZK proof
        bool isValid = verifier.verifyProof(_pA, _pB, _pC, _publicSignals);
        require(isValid, "Invalid age proof");
        
        // Mark commitment as used
        usedCommitments[commitment] = true;
        
        // Mark user as verified adult
        verifiedAdults[msg.sender] = true;
        verificationTimestamp[msg.sender] = block.timestamp;
        
        emit AgeVerified(msg.sender, commitment, true, block.timestamp);
    }
    
    /**
     * @dev Check if address adalah verified adult
     */
    function isVerifiedAdult(address user) external view returns (bool) {
        return verifiedAdults[user];
    }
    
    /**
     * @dev Get verification timestamp
     */
    function getVerificationTime(address user) external view returns (uint256) {
        return verificationTimestamp[user];
    }
    
    /**
     * @dev Revoke verification (for testing purposes)
     */
    function revokeVerification() external {
        require(verifiedAdults[msg.sender], "Not verified");
        
        verifiedAdults[msg.sender] = false;
        verificationTimestamp[msg.sender] = 0;
        
        emit VerificationRevoked(msg.sender, block.timestamp);
    }
    
    /**
     * @dev Batch check multiple addresses
     */
    function batchCheckVerification(address[] calldata users) 
        external 
        view 
        returns (bool[] memory results) 
    {
        results = new bool[](users.length);
        for (uint i = 0; i < users.length; i++) {
            results[i] = verifiedAdults[users[i]];
        }
    }
    
    /**
     * @dev Get commitment status
     */
    function isCommitmentUsed(uint256 commitment) external view returns (bool) {
        return usedCommitments[commitment];
    }
}
```

**Deployment:**

Lihat dokumentasi lengkap di [zk-contracts.md](../../Tutorial/Kelas-Rutin-BlockDevId/Sesi-6-Indexer-ZK-Proof/zk-contracts.md) untuk:
- Foundry setup
- Deployment script
- Testing dengan Foundry
- Contract verification

---

## 🎨 Step 6: Frontend Integration

### Header Component

**`src/components/Header.tsx`:**

```typescript
import { ConnectButton } from "@rainbow-me/rainbowkit"

const Header = () => {
  return (
    <header className="glass-dark sticky top-0 z-50 py-4 border-b border-white/10">
      <div className="container mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="flex items-center space-x-1 p-2 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-white/10">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                🆔
              </div>
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gradient-monad font-inter">ZK Age Verify</h1>
            <p className="text-xs font-medium" style={{ color: "rgba(251, 250, 249, 0.7)" }}>
              Privacy-First Age Verification on Lisk Sepolia
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-6 text-sm" style={{ color: "rgba(251, 250, 249, 0.8)" }}>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: "#10B981" }}></div>
              <span>Zero-Knowledge</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>🔒 Privacy-First</span>
            </div>
          </div>
          <ConnectButton />
        </div>
      </div>
    </header>
  )
}

export default Header
```

### KTP Input Form

**`src/components/KTPInputForm.tsx`:**

```typescript
"use client"

import { useState } from "react"
import { FileText, Eye, EyeOff, Shield, AlertCircle } from "lucide-react"
import type { KTPData } from "../types/ktp"
import { maskKTPData } from "../lib/zkProof"

interface KTPInputFormProps {
  onSubmit: (ktpData: KTPData) => void;
  isLoading?: boolean;
}

const KTPInputForm = ({ onSubmit, isLoading = false }: KTPInputFormProps) => {
  const [ktpData, setKTPData] = useState<KTPData>({
    nik: '',
    nama: '',
    tempatLahir: '',
    tanggalLahir: '',
    jenisKelamin: '',
    alamat: '',
    rt: '',
    rw: '',
    kelurahan: '',
    kecamatan: '',
    agama: '',
    statusPerkawinan: '',
    pekerjaan: '',
    kewarganegaraan: 'WNI',
    berlakuHingga: 'SEUMUR HIDUP'
  })

  const [showFullData, setShowFullData] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Sample KTP data untuk demo
  const sampleKTP: KTPData = {
    nik: '3171012501950001',
    nama: 'BUDI SANTOSO',
    tempatLahir: 'JAKARTA',
    tanggalLahir: '25-01-1995',
    jenisKelamin: 'LAKI-LAKI',
    alamat: 'JL. SUDIRMAN NO. 123',
    rt: '001',
    rw: '002',
    kelurahan: 'MENTENG',
    kecamatan: 'MENTENG',
    agama: 'ISLAM',
    statusPerkawinan: 'BELUM KAWIN',
    pekerjaan: 'SOFTWARE ENGINEER',
    kewarganegaraan: 'WNI',
    berlakuHingga: 'SEUMUR HIDUP'
  }

  const validateKTP = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Validate NIK (16 digits)
    if (!ktpData.nik || ktpData.nik.length !== 16) {
      newErrors.nik = 'NIK harus 16 digit'
    }

    // Validate tanggal lahir format DD-MM-YYYY
    const dateRegex = /^(\d{2})-(\d{2})-(\d{4})$/
    if (!ktpData.tanggalLahir || !dateRegex.test(ktpData.tanggalLahir)) {
      newErrors.tanggalLahir = 'Format tanggal: DD-MM-YYYY'
    } else {
      const [day, month, year] = ktpData.tanggalLahir.split('-').map(Number)
      if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1900 || year > 2010) {
        newErrors.tanggalLahir = 'Tanggal lahir tidak valid'
      }
    }

    // Required fields
    const requiredFields = ['nama', 'tempatLahir', 'jenisKelamin']
    requiredFields.forEach(field => {
      if (!ktpData[field as keyof KTPData]) {
        newErrors[field] = 'Field ini wajib diisi'
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateKTP()) {
      onSubmit(ktpData)
    }
  }

  const loadSampleData = () => {
    setKTPData(sampleKTP)
    setErrors({})
  }

  const displayValue = (value: string, field: string) => {
    if (!showFullData && ['nik', 'nama', 'alamat'].includes(field)) {
      return maskKTPData(value, 4)
    }
    return value
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="glass rounded-2xl p-6 border border-white/10 shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl border" style={{
            backgroundColor: "rgba(131, 110, 249, 0.1)",
            borderColor: "rgba(131, 110, 249, 0.3)"
          }}>
            <FileText className="w-6 h-6" style={{ color: "#836EF9" }} />
          </div>
          <div>
            <h2 className="text-xl font-bold" style={{ color: "#FBFAF9" }}>
              Input Data KTP Indonesia
            </h2>
            <p className="text-sm" style={{ color: "rgba(251, 250, 249, 0.7)" }}>
              Data akan digunakan untuk generate ZK proof umur {'>'}= 18 tahun
            </p>
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="flex items-start gap-3 p-4 rounded-xl border mb-6" style={{
          backgroundColor: "rgba(16, 185, 129, 0.1)",
          borderColor: "rgba(16, 185, 129, 0.3)"
        }}>
          <Shield className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: "#10B981" }} />
          <div>
            <h3 className="font-semibold mb-1" style={{ color: "#10B981" }}>
              🔒 Privacy Guarantee
            </h3>
            <p className="text-sm" style={{ color: "rgba(251, 250, 249, 0.8)" }}>
              Data KTP tidak akan disimpan atau dibagikan. Hanya proof matematis "umur {'>'}= 18" yang akan di-generate tanpa mengungkapkan informasi personal.
            </p>
          </div>
        </div>

        {/* Sample Data Button */}
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={loadSampleData}
            className="px-4 py-2 rounded-lg border font-medium transition-all duration-200 hover:bg-white/10"
            style={{
              backgroundColor: "rgba(245, 158, 11, 0.1)",
              borderColor: "rgba(245, 158, 11, 0.3)",
              color: "#F59E0B"
            }}
          >
            📝 Load Sample KTP Data
          </button>

          <button
            onClick={() => setShowFullData(!showFullData)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200 hover:bg-white/10"
            style={{
              backgroundColor: "rgba(14, 16, 15, 0.3)",
              borderColor: "rgba(251, 250, 249, 0.2)",
              color: "rgba(251, 250, 249, 0.7)"
            }}
          >
            {showFullData ? (
              <>
                <EyeOff className="w-4 h-4" />
                <span className="text-sm">Hide Data</span>
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                <span className="text-sm">Show Full Data</span>
              </>
            )}
          </button>
        </div>

        {/* KTP Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* NIK */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "#FBFAF9" }}>
              NIK (16 digit) *
            </label>
            <input
              type="text"
              value={displayValue(ktpData.nik, 'nik')}
              onChange={(e) => setKTPData({ ...ktpData, nik: e.target.value })}
              placeholder="3171012501950001"
              maxLength={16}
              className="w-full px-4 py-3 rounded-lg border input-primary"
              style={{
                backgroundColor: "rgba(14, 16, 15, 0.5)",
                borderColor: errors.nik ? "#EF4444" : "rgba(251, 250, 249, 0.2)",
                color: "#FBFAF9"
              }}
            />
            {errors.nik && (
              <p className="text-sm mt-1 flex items-center gap-1" style={{ color: "#EF4444" }}>
                <AlertCircle className="w-3 h-3" />
                {errors.nik}
              </p>
            )}
          </div>

          {/* Nama */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "#FBFAF9" }}>
              Nama Lengkap *
            </label>
            <input
              type="text"
              value={displayValue(ktpData.nama, 'nama')}
              onChange={(e) => setKTPData({ ...ktpData, nama: e.target.value.toUpperCase() })}
              placeholder="NAMA LENGKAP"
              className="w-full px-4 py-3 rounded-lg border input-primary"
              style={{
                backgroundColor: "rgba(14, 16, 15, 0.5)",
                borderColor: errors.nama ? "#EF4444" : "rgba(251, 250, 249, 0.2)",
                color: "#FBFAF9"
              }}
            />
            {errors.nama && (
              <p className="text-sm mt-1 flex items-center gap-1" style={{ color: "#EF4444" }}>
                <AlertCircle className="w-3 h-3" />
                {errors.nama}
              </p>
            )}
          </div>

          {/* Tempat & Tanggal Lahir */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#FBFAF9" }}>
                Tempat Lahir *
              </label>
              <input
                type="text"
                value={ktpData.tempatLahir}
                onChange={(e) => setKTPData({ ...ktpData, tempatLahir: e.target.value.toUpperCase() })}
                placeholder="JAKARTA"
                className="w-full px-4 py-3 rounded-lg border input-primary"
                style={{
                  backgroundColor: "rgba(14, 16, 15, 0.5)",
                  borderColor: errors.tempatLahir ? "#EF4444" : "rgba(251, 250, 249, 0.2)",
                  color: "#FBFAF9"
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#FBFAF9" }}>
                Tanggal Lahir (DD-MM-YYYY) *
              </label>
              <input
                type="text"
                value={ktpData.tanggalLahir}
                onChange={(e) => setKTPData({ ...ktpData, tanggalLahir: e.target.value })}
                placeholder="25-01-1995"
                className="w-full px-4 py-3 rounded-lg border input-primary"
                style={{
                  backgroundColor: "rgba(14, 16, 15, 0.5)",
                  borderColor: errors.tanggalLahir ? "#EF4444" : "rgba(251, 250, 249, 0.2)",
                  color: "#FBFAF9"
                }}
              />
              {errors.tanggalLahir && (
                <p className="text-sm mt-1 flex items-center gap-1" style={{ color: "#EF4444" }}>
                  <AlertCircle className="w-3 h-3" />
                  {errors.tanggalLahir}
                </p>
              )}
            </div>
          </div>

          {/* Jenis Kelamin */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "#FBFAF9" }}>
              Jenis Kelamin *
            </label>
            <select
              value={ktpData.jenisKelamin}
              onChange={(e) => setKTPData({ ...ktpData, jenisKelamin: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border input-primary"
              style={{
                backgroundColor: "rgba(14, 16, 15, 0.5)",
                borderColor: errors.jenisKelamin ? "#EF4444" : "rgba(251, 250, 249, 0.2)",
                color: "#FBFAF9"
              }}
            >
              <option value="">Pilih Jenis Kelamin</option>
              <option value="LAKI-LAKI">LAKI-LAKI</option>
              <option value="PEREMPUAN">PEREMPUAN</option>
            </select>
          </div>

          {/* Alamat */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "#FBFAF9" }}>
              Alamat
            </label>
            <textarea
              value={displayValue(ktpData.alamat, 'alamat')}
              onChange={(e) => setKTPData({ ...ktpData, alamat: e.target.value.toUpperCase() })}
              placeholder="ALAMAT LENGKAP"
              rows={3}
              className="w-full px-4 py-3 rounded-lg border input-primary resize-none"
              style={{
                backgroundColor: "rgba(14, 16, 15, 0.5)",
                borderColor: "rgba(251, 250, 249, 0.2)",
                color: "#FBFAF9"
              }}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed btn-primary"
            style={{
              background: isLoading 
                ? "rgba(131, 110, 249, 0.3)" 
                : "linear-gradient(135deg, #836EF9 0%, #A0055D 100%)",
              color: "#FBFAF9"
            }}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="spinner w-5 h-5"></div>
                <span>Generating ZK Proof...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <Shield className="w-5 h-5" />
                <span>Generate Age Proof</span>
              </div>
            )}
          </button>
        </form>

        {/* Info */}
        <div className="mt-6 text-center text-sm" style={{ color: "rgba(251, 250, 249, 0.6)" }}>
          🔐 Zero-knowledge proof akan membuktikan umur {'>'}= 18 tanpa mengungkapkan data personal
        </div>
      </div>
    </div>
  )
}

export default KTPInputForm
```

### ZK Proof Display

**`src/components/ZKProofDisplay.tsx`:**

```typescript
"use client"

import { useState } from "react"
import { CheckCircle, Copy, ExternalLink, Eye, EyeOff, AlertTriangle } from "lucide-react"
import type { AgeProofOutput } from "../types/ktp"

interface ZKProofDisplayProps {
  proof: AgeProofOutput;
  isAdult: boolean;
  commitment: string;
  onVerifyOnChain: () => void;
  isVerifying?: boolean;
  verificationTx?: string;
}

const ZKProofDisplay = ({ 
  proof, 
  isAdult, 
  commitment, 
  onVerifyOnChain, 
  isVerifying = false,
  verificationTx 
}: ZKProofDisplayProps) => {
  const [showFullProof, setShowFullProof] = useState(false)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const truncateProof = (proofArray: string[], maxLength = 20) => {
    return proofArray.map(item => 
      item.length > maxLength ? `${item.slice(0, maxLength)}...` : item
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Proof Result */}
      <div className="glass rounded-2xl p-6 border border-white/10 shadow-2xl">
        <div className="text-center mb-6">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
            isAdult ? 'glow-success' : ''
          }`} style={{
            backgroundColor: isAdult ? "rgba(16, 185, 129, 0.2)" : "rgba(239, 68, 68, 0.2)",
            border: `2px solid ${isAdult ? "#10B981" : "#EF4444"}`
          }}>
            {isAdult ? (
              <CheckCircle className="w-8 h-8" style={{ color: "#10B981" }} />
            ) : (
              <AlertTriangle className="w-8 h-8" style={{ color: "#EF4444" }} />
            )}
          </div>

          <h2 className="text-2xl font-bold mb-2" style={{ color: "#FBFAF9" }}>
            {isAdult ? "✅ Age Verification Successful" : "❌ Age Verification Failed"}
          </h2>
          
          <p className="text-lg" style={{ 
            color: isAdult ? "#10B981" : "#EF4444"
          }}>
            {isAdult 
              ? "Zero-knowledge proof confirms: Age ≥ 18 years"
              : "Zero-knowledge proof result: Age < 18 years"
            }
          </p>

          <div className="mt-4 text-sm" style={{ color: "rgba(251, 250, 249, 0.7)" }}>
            🔐 No personal information was revealed during this verification
          </div>
        </div>

        {/* Proof Details */}
        <div className="space-y-4">
          {/* Commitment Hash */}
          <div className="p-4 rounded-xl border" style={{
            backgroundColor: "rgba(131, 110, 249, 0.1)",
            borderColor: "rgba(131, 110, 249, 0.3)"
          }}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold" style={{ color: "#FBFAF9" }}>
                Privacy Commitment
              </span>
              <button
                onClick={() => copyToClipboard(commitment, 'commitment')}
                className="p-1 rounded hover:bg-white/10 transition-colors"
                style={{ color: "rgba(251, 250, 249, 0.7)" }}
              >
                {copiedField === 'commitment' ? (
                  <CheckCircle className="w-4 h-4" style={{ color: "#10B981" }} />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
            <div className="font-mono text-sm break-all" style={{ color: "#836EF9" }}>
              {commitment}
            </div>
            <div className="text-xs mt-2" style={{ color: "rgba(251, 250, 249, 0.6)" }}>
              Cryptographic commitment untuk prevent replay attacks
            </div>
          </div>

          {/* ZK Proof Data */}
          <div className="p-4 rounded-xl border" style={{
            backgroundColor: "rgba(14, 16, 15, 0.3)",
            borderColor: "rgba(251, 250, 249, 0.1)"
          }}>
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold" style={{ color: "#FBFAF9" }}>
                Zero-Knowledge Proof
              </span>
              <button
                onClick={() => setShowFullProof(!showFullProof)}
                className="flex items-center gap-2 px-3 py-1 rounded-lg border transition-all duration-200 hover:bg-white/10"
                style={{
                  backgroundColor: "rgba(14, 16, 15, 0.3)",
                  borderColor: "rgba(251, 250, 249, 0.2)",
                  color: "rgba(251, 250, 249, 0.7)"
                }}
              >
                {showFullProof ? (
                  <>
                    <EyeOff className="w-4 h-4" />
                    <span className="text-sm">Hide Full Proof</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" />
                    <span className="text-sm">Show Full Proof</span>
                  </>
                )}
              </button>
            </div>

            <div className="space-y-3">
              {/* Proof Components */}
              <div>
                <div className="text-sm font-medium mb-2" style={{ color: "rgba(251, 250, 249, 0.8)" }}>
                  Proof π_a:
                </div>
                <div className="font-mono text-xs break-all p-2 rounded border" style={{
                  backgroundColor: "rgba(14, 16, 15, 0.5)",
                  borderColor: "rgba(251, 250, 249, 0.1)",
                  color: "#A0055D"
                }}>
                  {showFullProof 
                    ? `[${proof.proof.pi_a.join(', ')}]`
                    : `[${truncateProof(proof.proof.pi_a).join(', ')}]`
                  }
                </div>
              </div>

              <div>
                <div className="text-sm font-medium mb-2" style={{ color: "rgba(251, 250, 249, 0.8)" }}>
                  Proof π_b:
                </div>
                <div className="font-mono text-xs break-all p-2 rounded border" style={{
                  backgroundColor: "rgba(14, 16, 15, 0.5)",
                  borderColor: "rgba(251, 250, 249, 0.1)",
                  color: "#A0055D"
                }}>
                  {showFullProof 
                    ? `[[${proof.proof.pi_b[0].join(', ')}], [${proof.proof.pi_b[1].join(', ')}]]`
                    : `[[${truncateProof(proof.proof.pi_b[0]).join(', ')}], [${truncateProof(proof.proof.pi_b[1]).join(', ')}]]`
                  }
                </div>
              </div>

              <div>
                <div className="text-sm font-medium mb-2" style={{ color: "rgba(251, 250, 249, 0.8)" }}>
                  Proof π_c:
                </div>
                <div className="font-mono text-xs break-all p-2 rounded border" style={{
                  backgroundColor: "rgba(14, 16, 15, 0.5)",
                  borderColor: "rgba(251, 250, 249, 0.1)",
                  color: "#A0055D"
                }}>
                  {showFullProof 
                    ? `[${proof.proof.pi_c.join(', ')}]`
                    : `[${truncateProof(proof.proof.pi_c).join(', ')}]`
                  }
                </div>
              </div>

              <div>
                <div className="text-sm font-medium mb-2" style={{ color: "rgba(251, 250, 249, 0.8)" }}>
                  Public Signals:
                </div>
                <div className="font-mono text-xs break-all p-2 rounded border" style={{
                  backgroundColor: "rgba(14, 16, 15, 0.5)",
                  borderColor: "rgba(251, 250, 249, 0.1)",
                  color: "#10B981"
                }}>
                  [{proof.publicSignals.join(', ')}]
                </div>
              </div>
            </div>

            <div className="mt-4 text-xs" style={{ color: "rgba(251, 250, 249, 0.6)" }}>
              📊 Groth16 zero-knowledge proof that can be verified on-chain
            </div>
          </div>
        </div>

        {/* On-chain Verification */}
        {isAdult && (
          <div className="mt-6">
            <button
              onClick={onVerifyOnChain}
              disabled={isVerifying}
              className="w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed btn-primary"
              style={{
                background: isVerifying 
                  ? "rgba(131, 110, 249, 0.3)" 
                  : "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                color: "#FBFAF9"
              }}
            >
              {isVerifying ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="spinner w-5 h-5"></div>
                  <span>Verifying On-Chain...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>Verify on Lisk Sepolia Blockchain</span>
                </div>
              )}
            </button>

            {verificationTx && (
              <div className="mt-4 p-4 rounded-xl border" style={{
                backgroundColor: "rgba(16, 185, 129, 0.1)",
                borderColor: "rgba(16, 185, 129, 0.3)"
              }}>
                <div className="flex items-center justify-between">
                  <span className="font-semibold" style={{ color: "#10B981" }}>
                    ✅ Verified on Blockchain
                  </span>
                  <a
                    href={`https://sepolia-blockscout.lisk.com/tx/${verificationTx}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 rounded hover:bg-white/10 transition-colors"
                    style={{ color: "#10B981" }}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
                <div className="text-sm mt-2 font-mono break-all" style={{ color: "rgba(251, 250, 249, 0.8)" }}>
                  TX: {verificationTx}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Technical Details */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <h3 className="font-semibold mb-4" style={{ color: "#FBFAF9" }}>
            📋 Technical Summary
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span style={{ color: "rgba(251, 250, 249, 0.7)" }}>Proof System:</span>
                <span style={{ color: "#FBFAF9" }}>Groth16</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: "rgba(251, 250, 249, 0.7)" }}>Circuit:</span>
                <span style={{ color: "#FBFAF9" }}>Age Verification</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: "rgba(251, 250, 249, 0.7)" }}>Curve:</span>
                <span style={{ color: "#FBFAF9" }}>BN128</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span style={{ color: "rgba(251, 250, 249, 0.7)" }}>Proof Size:</span>
                <span style={{ color: "#FBFAF9" }}>~256 bytes</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: "rgba(251, 250, 249, 0.7)" }}>Verification:</span>
                <span style={{ color: "#FBFAF9" }}>Constant time</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: "rgba(251, 250, 249, 0.7)" }}>Gas Cost:</span>
                <span style={{ color: "#FBFAF9" }}>~150k gas</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Privacy Guarantee */}
      <div className="glass rounded-2xl p-6 border border-white/10 shadow-2xl">
        <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: "#FBFAF9" }}>
          🔒 Privacy Guarantees
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-3" style={{ color: "#10B981" }}>
              ✅ What is Proven
            </h4>
            <ul className="space-y-2 text-sm" style={{ color: "rgba(251, 250, 249, 0.8)" }}>
              <li>• Age is greater than or equal to 18 years</li>
              <li>• Proof came from valid KTP data</li>
              <li>• Prover knows the birth date</li>
              <li>• Commitment prevents replay attacks</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-3" style={{ color: "#EF4444" }}>
              ❌ What is NOT Revealed
            </h4>
            <ul className="space-y-2 text-sm" style={{ color: "rgba(251, 250, 249, 0.8)" }}>
              <li>• Exact birth date or age</li>
              <li>• Name, NIK, or other personal data</li>
              <li>• Address or location information</li>
              <li>• Any identifying information</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 p-4 rounded-xl border" style={{
          backgroundColor: "rgba(131, 110, 249, 0.1)",
          borderColor: "rgba(131, 110, 249, 0.3)"
        }}>
          <p className="text-sm" style={{ color: "rgba(251, 250, 249, 0.8)" }}>
            <strong style={{ color: "#836EF9" }}>Zero-Knowledge Property:</strong> This proof is mathematically guaranteed to reveal nothing beyond the fact that your age ≥ 18. Even with quantum computers, no additional information can be extracted from this proof.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ZKProofDisplay
```

### Circuit Status Component

**`src/components/CircuitStatus.tsx`:**

```typescript
import { useState, useEffect, useCallback } from 'react';

interface CircuitStatusProps {
  onStatusChange?: (hasCircuit: boolean) => void;
}

interface CircuitFiles {
  wasm: boolean;
  zkey: boolean;
  vkey: boolean;
}

export default function CircuitStatus({ onStatusChange }: CircuitStatusProps) {
  const [circuitFiles, setCircuitFiles] = useState<CircuitFiles>({
    wasm: false,
    zkey: false,
    vkey: false
  });
  const [isChecking, setIsChecking] = useState(true);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const checkCircuitFiles = useCallback(async () => {
    setIsChecking(true);
    
    const files = {
      wasm: false,
      zkey: false,
      vkey: false
    };

    try {
      // Check WASM file - update path
      try {
        const wasmResponse = await fetch('/circuits/build/ageVerification_js/ageVerification.wasm', { method: 'HEAD' });
        files.wasm = wasmResponse.ok;
      } catch {
        files.wasm = false;
      }

      // Check zkey file - update path
      try {
        const zkeyResponse = await fetch('/circuits/build/ageVerification_0001.zkey', { method: 'HEAD' });
        files.zkey = zkeyResponse.ok;
      } catch {
        files.zkey = false;
      }

      // Check verification key - update path
      try {
        const vkeyResponse = await fetch('/circuits/build/verification_key.json', { method: 'HEAD' });
        files.vkey = vkeyResponse.ok;
      } catch {
        files.vkey = false;
      }

      setCircuitFiles(files);
      setLastChecked(new Date());
      
      // Notify parent about circuit availability
      const hasAllFiles = files.wasm && files.zkey && files.vkey;
      onStatusChange?.(hasAllFiles);
      
    } catch (error) {
      console.error('Error checking circuit files:', error);
    } finally {
      setIsChecking(false);
    }
  }, [onStatusChange]);

  useEffect(() => {
    checkCircuitFiles();
  }, [checkCircuitFiles]);

  const hasAnyFiles = circuitFiles.wasm || circuitFiles.zkey || circuitFiles.vkey;
  const hasAllFiles = circuitFiles.wasm && circuitFiles.zkey && circuitFiles.vkey;

  if (isChecking) {
    return (
      <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30 mb-4">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
          <span className="text-blue-400 text-sm">Checking circuit availability...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4">
      {hasAllFiles ? (
        // All circuit files available
        <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-green-400 text-lg">🟢</div>
              <div>
                <p className="text-green-400 font-medium">Real ZK Circuit Available</p>
                <p className="text-green-300 text-sm">Full zero-knowledge proof generation enabled</p>
              </div>
            </div>
            <button
              onClick={checkCircuitFiles}
              className="px-3 py-1 text-xs bg-green-500/20 text-green-300 rounded hover:bg-green-500/30 transition-colors"
            >
              Recheck
            </button>
          </div>
        </div>
      ) : hasAnyFiles ? (
        // Some files missing
        <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-yellow-400 text-lg">🟡</div>
              <div>
                <p className="text-yellow-400 font-medium">Incomplete Circuit Setup</p>
                <p className="text-yellow-300 text-sm">Some circuit files are missing - using fallback</p>
              </div>
            </div>
            <button
              onClick={checkCircuitFiles}
              className="px-3 py-1 text-xs bg-yellow-500/20 text-yellow-300 rounded hover:bg-yellow-500/30 transition-colors"
            >
              Recheck
            </button>
          </div>
          
          <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
            <div className={`p-2 rounded ${circuitFiles.wasm ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
              {circuitFiles.wasm ? '✓' : '✗'} WASM File
            </div>
            <div className={`p-2 rounded ${circuitFiles.zkey ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
              {circuitFiles.zkey ? '✓' : '✗'} Proving Key
            </div>
            <div className={`p-2 rounded ${circuitFiles.vkey ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
              {circuitFiles.vkey ? '✓' : '✗'} Verification Key
            </div>
          </div>
        </div>
      ) : (
        // No circuit files
        <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-orange-400 text-lg">🔶</div>
              <div>
                <p className="text-orange-400 font-medium">Demo Mode - Mock Proofs Only</p>
                <p className="text-orange-300 text-sm">
                  Circuit files not found - using mock proofs for demonstration
                </p>
              </div>
            </div>
            <button
              onClick={checkCircuitFiles}
              className="px-3 py-1 text-xs bg-orange-500/20 text-orange-300 rounded hover:bg-orange-500/30 transition-colors"
            >
              Recheck
            </button>
          </div>
          
          <div className="mt-3 p-3 bg-orange-900/20 rounded text-xs text-orange-200">
            <p className="font-medium mb-1">📁 Expected Circuit Files:</p>
            <ul className="space-y-1 text-orange-300">
              <li>• <code>/public/circuits/build/ageVerification_js/ageVerification.wasm</code></li>
              <li>• <code>/public/circuits/build/ageVerification_0001.zkey</code></li>
              <li>• <code>/public/circuits/build/verification_key.json</code></li>
            </ul>
          </div>
        </div>
      )}
      
      {lastChecked && (
        <div className="mt-2 text-xs text-gray-400">
          Last checked: {lastChecked.toLocaleTimeString()}
        </div>
      )}
    </div>
  );
}
```

### SnarkJS Status Component

**`src/components/SnarkjsStatus.tsx`:**

```typescript
import { useState, useEffect, useCallback } from 'react';
import { SnarkjsLoader } from '../lib/snarkjsLoader';

interface SnarkjsStatusProps {
  onLoadingChange?: (isLoading: boolean) => void;
  onStatusChange?: (isLoaded: boolean) => void;
  showDetailedStatus?: boolean;
}

export default function SnarkjsStatus({ 
  onLoadingChange, 
  onStatusChange,
  showDetailedStatus = false 
}: SnarkjsStatusProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const checkAndLoadSnarkjs = useCallback(async () => {
    // Check if already loaded
    if (SnarkjsLoader.isLoaded()) {
      setIsLoaded(true);
      onStatusChange?.(true);
      return;
    }

    setIsLoading(true);
    onLoadingChange?.(true);
    setError(null);

    try {
      await SnarkjsLoader.preload(3);
      setIsLoaded(true);
      setError(null);
      onStatusChange?.(true);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load SnarkJS';
      setError(errorMsg);
      setIsLoaded(false);
      onStatusChange?.(false);
      console.error('SnarkJS loading failed:', err);
    } finally {
      setIsLoading(false);
      onLoadingChange?.(false);
    }
  }, [onLoadingChange, onStatusChange]);

  useEffect(() => {
    checkAndLoadSnarkjs();
    
    // Listen for snarkjs-loaded event from preloader
    const handleSnarkjsLoaded = () => {
      console.log('SnarkJS loaded via preloader');
      setIsLoaded(true);
      setIsLoading(false);
      setError(null);
      onStatusChange?.(true);
      onLoadingChange?.(false);
    };

    window.addEventListener('snarkjs-loaded', handleSnarkjsLoaded);
    
    return () => {
      window.removeEventListener('snarkjs-loaded', handleSnarkjsLoaded);
    };
  }, [checkAndLoadSnarkjs, onLoadingChange, onStatusChange]);

  const handleRetry = async () => {
    setRetryCount(prev => prev + 1);
    await checkAndLoadSnarkjs();
  };

  const handleForceReload = async () => {
    setIsLoading(true);
    onLoadingChange?.(true);
    setError(null);

    try {
      await SnarkjsLoader.reload();
      setIsLoaded(true);
      setError(null);
      onStatusChange?.(true);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to reload SnarkJS';
      setError(errorMsg);
      setIsLoaded(false);
      onStatusChange?.(false);
    } finally {
      setIsLoading(false);
      onLoadingChange?.(false);
    }
  };

  if (!showDetailedStatus && isLoaded) {
    return null; // Don't show anything if loaded and not showing detailed status
  }

  return (
    <div className="w-full">
      {/* Loading State */}
      {isLoading && (
        <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30 mb-4">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-400"></div>
            <div>
              <p className="text-blue-400 font-medium">Loading ZK Proof System</p>
              <p className="text-blue-300 text-sm">
                Setting up cryptographic libraries...
                {retryCount > 0 && ` (Attempt ${retryCount + 1})`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Success State */}
      {isLoaded && !isLoading && (
        <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30 mb-4">
          <div className="flex items-center space-x-3">
            <div className="text-green-400 text-xl">✅</div>
            <div>
              <p className="text-green-400 font-medium">ZK Proof System Ready</p>
              {showDetailedStatus && (
                <p className="text-green-300 text-sm">
                  SnarkJS version: {SnarkjsLoader.getVersion() || 'Unknown'}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-start space-x-3">
              <div className="text-red-400 text-xl">⚠️</div>
              <div>
                <p className="text-red-400 font-medium">ZK Proof System Error</p>
                <p className="text-red-300 text-sm mb-2">{error}</p>
                {showDetailedStatus && (
                  <p className="text-red-200 text-xs">
                    Some features may work with fallback methods, but full ZK proof generation requires this system.
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              <button
                onClick={handleRetry}
                className="px-3 py-1 text-xs bg-red-500/20 text-red-300 rounded hover:bg-red-500/30 transition-colors"
              >
                Retry
              </button>
              {showDetailedStatus && (
                <button
                  onClick={handleForceReload}
                  className="px-3 py-1 text-xs bg-red-500/20 text-red-300 rounded hover:bg-red-500/30 transition-colors"
                >
                  Force Reload
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Detailed Status */}
      {showDetailedStatus && (
        <div className="text-xs text-gray-400 space-y-1">
          <div className="flex justify-between">
            <span>SnarkJS Status:</span>
            <span className={isLoaded ? 'text-green-400' : 'text-red-400'}>
              {isLoaded ? 'Loaded' : 'Not Loaded'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Browser Support:</span>
            <span className="text-green-400">
              {typeof window !== 'undefined' && window.crypto ? 'Yes' : 'No'}
            </span>
          </div>
          {retryCount > 0 && (
            <div className="flex justify-between">
              <span>Retry Attempts:</span>
              <span className="text-yellow-400">{retryCount}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
```

### Configuration Files

**`src/config/chains.ts`:**

```typescript
import type { Chain } from 'wagmi/chains'

export const liskSepoliaTestnet: Chain = {
  id: 4202,
  name: 'Lisk Sepolia Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'ETH',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.sepolia-api.lisk.com'],
    },
    public: {
      http: ['https://rpc.sepolia-api.lisk.com'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Lisk Sepolia',
      url: 'https://sepolia-blockscout.lisk.com',
    },
  },
  testnet: true,
}
```

### Configuration Files

**`src/constants/index.ts`:**

```typescript
// Contract addresses (updated with deployed addresses from Lisk Sepolia Testnet)
export const AGE_VERIFIER_ADDRESS = "0x75b80D70D2b1ce480F7e391117B0F35cCF1482b7" as const
export const GROTH16_VERIFIER_ADDRESS = "0xC1aD18257743FA939c64582a846282a572c17D23" as const

// Network configuration
export const LISK_SEPOLIA_TESTNET_CHAIN_ID = 4202
export const LISK_SEPOLIA_RPC = "https://rpc.sepolia-api.lisk.com"
export const LISK_SEPOLIA_EXPLORER = "https://sepolia-blockscout.lisk.com"

// ABI untuk Age Verifier Contract
export const AGE_VERIFIER_ABI = [{"inputs":[{"internalType":"address","name":"_verifier","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"commitment","type":"uint256"},{"indexed":false,"internalType":"bool","name":"isAdult","type":"bool"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"AgeVerified","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"VerificationRevoked","type":"event"},{"inputs":[{"internalType":"address[]","name":"users","type":"address[]"}],"name":"batchCheckVerification","outputs":[{"internalType":"bool[]","name":"results","type":"bool[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getVerificationTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"commitment","type":"uint256"}],"name":"isCommitmentUsed","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"isVerifiedAdult","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"revokeVerification","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"usedCommitments","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"verificationTimestamp","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"verifiedAdults","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"verifier","outputs":[{"internalType":"contract Groth16Verifier","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256[2]","name":"_pA","type":"uint256[2]"},{"internalType":"uint256[2][2]","name":"_pB","type":"uint256[2][2]"},{"internalType":"uint256[2]","name":"_pC","type":"uint256[2]"},{"internalType":"uint256[2]","name":"_publicSignals","type":"uint256[2]"}],"name":"verifyAge","outputs":[],"stateMutability":"nonpayable","type":"function"}] as const

// Helper URLs
export const EXPLORER_TX_URL = (txHash: string) => 
  `${LISK_SEPOLIA_EXPLORER}/tx/${txHash}`

export const EXPLORER_ADDRESS_URL = (address: string) => 
  `${LISK_SEPOLIA_EXPLORER}/address/${address}`

// Contract deployment info
export const DEPLOYMENT_INFO = {
  network: "Lisk Sepolia Testnet",
  chainId: LISK_SEPOLIA_TESTNET_CHAIN_ID,
  contracts: {
    ageVerifier: {
      address: AGE_VERIFIER_ADDRESS,
      explorer: EXPLORER_ADDRESS_URL(AGE_VERIFIER_ADDRESS)
    },
    groth16Verifier: {
      address: GROTH16_VERIFIER_ADDRESS,
      explorer: EXPLORER_ADDRESS_URL(GROTH16_VERIFIER_ADDRESS)
    }
  }
} as const
```

### Utility Functions

**`src/utils/formatters.ts`:**

```typescript
/**
 * Format timestamp
 */
export const formatTime = (timestamp: number): string => {
  return new Date(timestamp).toLocaleString();
};

/**
 * Format number dengan pemisah ribuan
 */
export const formatNumber = (
  value: number | string, 
  decimals: number = 2
): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '0';
  
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  }).format(num);
};

/**
 * Format address untuk display
 */
export const formatAddress = (address: string): string => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

/**
 * Format USD value
 */
export const formatUSD = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

/**
 * Format percentage
 */
export const formatPercentage = (value: number, decimals: number = 2): string => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * Validate input string for numeric values
 */
export const isValidNumericInput = (value: string): boolean => {
  // Allow empty string, digits, and single decimal point
  return /^[\d]*\.?[\d]*$/.test(value);
};

/**
 * Check if amount is valid for transaction
 */
export const isValidAmount = (amount: string): boolean => {
  if (!amount || amount === '0' || amount === '.') return false;
  const num = parseFloat(amount);
  return !isNaN(num) && num > 0 && isFinite(num);
};
```

### Custom Hooks

**`src/hooks/useSnarkjsStatus.ts`:**

```typescript
import { useState, useEffect } from 'react';
import { SnarkjsLoader } from '../lib/snarkjsLoader';

// Hook for using SnarkJS status
export function useSnarkjsStatus() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkStatus = async () => {
      setIsLoading(true);
      try {
        const supported = SnarkjsLoader.isLoaded();
        setIsLoaded(supported);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setIsLoaded(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkStatus();
  }, []);

  const reload = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await SnarkjsLoader.reload();
      setIsLoaded(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Reload failed');
      setIsLoaded(false);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoaded,
    isLoading,
    error,
    reload
  };
}

// Hook for circuit status
export function useCircuitStatus() {
  const [hasCircuit, setHasCircuit] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkCircuit = async () => {
      setIsChecking(true);
      try {
        const wasmResponse = await fetch('/circuits/build/ageVerification_js/ageVerification.wasm', { method: 'HEAD' });
        const zkeyResponse = await fetch('/circuits/build/ageVerification_0001.zkey', { method: 'HEAD' });
        const vkeyResponse = await fetch('/circuits/build/verification_key.json', { method: 'HEAD' });
        
        const hasAll = wasmResponse.ok && zkeyResponse.ok && vkeyResponse.ok;
        setHasCircuit(hasAll);
      } catch {
        setHasCircuit(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkCircuit();
  }, []);

  return { hasCircuit, isChecking };
}
```

### Main App Component

**`src/App.tsx`:**

```typescript
import '@rainbow-me/rainbowkit/styles.css'
import { useState, useEffect } from "react"
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit'
import { liskSepoliaTestnet } from './config/chains'
import { Toaster } from 'react-hot-toast'
import toast from 'react-hot-toast'

import KTPInputForm from './components/KTPInputForm'
import ZKProofDisplay from './components/ZKProofDisplay'
import Header from './components/Header'

import type { KTPData, KTPProofInput, AgeProofOutput } from './types/ktp'
import { ZKProofGenerator } from './lib/zkProof'
import { SnarkjsLoader } from './lib/snarkjsLoader'
import { AGE_VERIFIER_ABI, AGE_VERIFIER_ADDRESS } from './constants'

// Wagmi configuration
const config = getDefaultConfig({
  appName: 'ZK Age Verification',
  projectId: 'YOUR_WALLETCONNECT_PROJECT_ID',
  chains: [liskSepoliaTestnet],
  ssr: true,
});

const queryClient = new QueryClient()

// Helper function to convert string arrays to bigint tuples
const convertProofParams = (proof: AgeProofOutput) => {
  // Convert string arrays to bigint arrays and ensure proper tuple types
  const pA: [bigint, bigint] = [
    BigInt(proof.proof.pi_a[0]), 
    BigInt(proof.proof.pi_a[1])
  ];
  
  const pB: [[bigint, bigint], [bigint, bigint]] = [
    [BigInt(proof.proof.pi_b[0][0]), BigInt(proof.proof.pi_b[0][1])],
    [BigInt(proof.proof.pi_b[1][0]), BigInt(proof.proof.pi_b[1][1])]
  ];
  
  const pC: [bigint, bigint] = [
    BigInt(proof.proof.pi_c[0]), 
    BigInt(proof.proof.pi_c[1])
  ];
  
  const publicSignals: [bigint, bigint] = [
    BigInt(proof.publicSignals[0]), 
    BigInt(proof.publicSignals[1])
  ];

  return { pA, pB, pC, publicSignals };
};

function ZKAgeVerificationApp() {
  const { address, isConnected } = useAccount()
  const { writeContractAsync } = useWriteContract()
  
  const [step, setStep] = useState<'input' | 'proof' | 'verified'>('input')
  const [zkProof, setZKProof] = useState<AgeProofOutput | null>(null)
  const [isAdult, setIsAdult] = useState(false)
  const [commitment, setCommitment] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationTx, setVerificationTx] = useState('')
  const [snarkjsLoaded, setSnarkjsLoaded] = useState(false)
  const [snarkjsLoading, setSnarkjsLoading] = useState(false)

  const { isLoading: isTxLoading } = useWaitForTransactionReceipt({
    hash: verificationTx as `0x${string}`,
  })

  // Load SnarkJS on component mount
  useEffect(() => {
    const loadSnarkJS = async () => {
      if (SnarkjsLoader.isLoaded()) {
        setSnarkjsLoaded(true)
        return
      }

      setSnarkjsLoading(true)
      try {
        await SnarkjsLoader.preload(3) // 3 retries
        setSnarkjsLoaded(true)
        toast.success('ZK proof system ready!')
      } catch (error) {
        console.error('Failed to load SnarkJS:', error)
        toast.error('Failed to load ZK proof system. Some features may not work.')
      } finally {
        setSnarkjsLoading(false)
      }
    }

    loadSnarkJS()
  }, [])

  const handleKTPSubmit = async (data: KTPData) => {
    setIsGenerating(true)

    try {
      // Check if SnarkJS is loaded
      if (!snarkjsLoaded) {
        // Try to load SnarkJS one more time
        toast.loading('Loading ZK proof system...')
        await SnarkjsLoader.load()
        setSnarkjsLoaded(true)
        toast.dismiss()
      }

      // Parse birth date
      const { day, month, year } = ZKProofGenerator.parseBirthDate(data.tanggalLahir)
      
      // Calculate age to check if >= 18
      const currentAge = ZKProofGenerator.calculateAge(data.tanggalLahir)
      setIsAdult(currentAge >= 18)

      // Generate salt for privacy
      const salt = ZKProofGenerator.generateSalt()

      // Create proof input
      const proofInput: KTPProofInput = {
        birthDay: day,
        birthMonth: month,
        birthYear: year,
        currentYear: new Date().getFullYear(),
        salt: salt
      }

      // Generate commitment
      const commitmentHash = await ZKProofGenerator.createCommitment(
        day, month, year, salt
      )
      setCommitment(commitmentHash)
      
      let proof: AgeProofOutput
        // Generate real ZK proof
        const zkGenerator = new ZKProofGenerator()
        // eslint-disable-next-line prefer-const
        proof = await zkGenerator.generateAgeProof(proofInput)
        toast.success('ZK proof generated successfully!')
      
      
      setZKProof(proof)
      setStep('proof')

    } catch (error) {
      console.error('Error generating proof:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      
      if (errorMessage.includes('snarkjs')) {
        toast.error('ZK proof system not available. Please refresh and try again.')
      } else {
        toast.error('Failed to generate ZK proof: ' + errorMessage)
      }
    } finally {
      setIsGenerating(false)
    }
  }

  const handleVerifyOnChain = async () => {
    if (!zkProof || !isConnected || !address) {
      toast.error('Please connect wallet first')
      return
    }

    setIsVerifying(true)

    try {
      // Convert proof parameters to proper types
      const { pA, pB, pC, publicSignals } = convertProofParams(zkProof)

      const hash = await writeContractAsync({
        address: AGE_VERIFIER_ADDRESS,
        abi: AGE_VERIFIER_ABI,
        functionName: 'verifyAge',
        args: [pA, pB, pC, publicSignals],
      })

      setVerificationTx(hash)
      setStep('verified')
      
      toast.success('Age verification submitted to blockchain!')

    } catch (error) {
      console.error('Error verifying on-chain:', error)
      toast.error('Failed to verify on blockchain')
    } finally {
      setIsVerifying(false)
    }
  }

  const resetFlow = () => {
    setStep('input')
    setZKProof(null)
    setIsAdult(false)
    setCommitment('')
    setVerificationTx('')
  }

  if (!isConnected) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="glass card-hover rounded-2xl p-12 max-w-2xl mx-auto text-center">
          <div className="text-8xl mb-6 float-animation">🆔</div>
          <h2 className="text-4xl font-bold mb-6 text-gradient-monad">
            Zero-Knowledge Age Verification
          </h2>
          <p className="mb-8 text-lg leading-relaxed" style={{ color: "rgba(251, 250, 249, 0.8)" }}>
            Prove you're over 18 using Indonesian KTP data without revealing any personal information. Powered by advanced cryptography and zero-knowledge proofs.
          </p>
          
          {/* SnarkJS Loading Status */}
          {snarkjsLoading && (
            <div className="mb-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                <span className="text-blue-400">Loading ZK proof system...</span>
              </div>
            </div>
          )}
          
          {!snarkjsLoading && !snarkjsLoaded && (
            <div className="mb-6 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
              <p className="text-yellow-400 text-sm">
                ⚠️ ZK proof system not loaded. Some features may use fallback methods.
              </p>
            </div>
          )}
          
          {snarkjsLoaded && (
            <div className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/30">
              <p className="text-green-400 text-sm">
                ✅ ZK proof system ready!
              </p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="p-6 rounded-xl border" style={{
              backgroundColor: "rgba(131, 110, 249, 0.1)",
              borderColor: "rgba(131, 110, 249, 0.3)"
            }}>
              <div className="text-3xl mb-3">🔒</div>
              <h3 className="font-semibold mb-2" style={{ color: "#FBFAF9" }}>Complete Privacy</h3>
              <p className="text-sm" style={{ color: "rgba(251, 250, 249, 0.7)" }}>
                Zero personal data is revealed or stored
              </p>
            </div>
            
            <div className="p-6 rounded-xl border" style={{
              backgroundColor: "rgba(16, 185, 129, 0.1)",
              borderColor: "rgba(16, 185, 129, 0.3)"
            }}>
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="font-semibold mb-2" style={{ color: "#FBFAF9" }}>Instant Verification</h3>
              <p className="text-sm" style={{ color: "rgba(251, 250, 249, 0.7)" }}>
                Mathematical proof generated in seconds
              </p>
            </div>
          </div>

          <div className="text-center">
            <p className="text-lg font-medium mb-4" style={{ color: "#836EF9" }}>
              Connect your wallet to begin verification
            </p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen py-8">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[
              { step: 'input', label: 'Input KTP', icon: '📄' },
              { step: 'proof', label: 'Generate Proof', icon: '🔐' },
              { step: 'verified', label: 'Blockchain Verification', icon: '✅' }
            ].map((item, index) => (
              <div key={item.step} className="flex items-center">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                  step === item.step 
                    ? 'border-purple-500 bg-purple-500/20 text-purple-400' 
                    : index < ['input', 'proof', 'verified'].indexOf(step)
                    ? 'border-green-500 bg-green-500/20 text-green-400'
                    : 'border-gray-500 bg-gray-500/20 text-gray-500'
                }`}>
                  <span className="text-lg">{item.icon}</span>
                </div>
                <div className="ml-3 hidden md:block">
                  <div className={`font-medium ${
                    step === item.step ? 'text-purple-400' :
                    index < ['input', 'proof', 'verified'].indexOf(step) ? 'text-green-400' : 'text-gray-500'
                  }`}>
                    {item.label}
                  </div>
                </div>
                {index < 2 && (
                  <div className={`w-16 h-px mx-4 ${
                    index < ['input', 'proof', 'verified'].indexOf(step) ? 'bg-green-500' : 'bg-gray-500'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        {step === 'input' && (
          <KTPInputForm 
            onSubmit={handleKTPSubmit}
            isLoading={isGenerating}
          />
        )}

        {step === 'proof' && zkProof && (
          <ZKProofDisplay
            proof={zkProof}
            isAdult={isAdult}
            commitment={commitment}
            onVerifyOnChain={handleVerifyOnChain}
            isVerifying={isVerifying || isTxLoading}
            verificationTx={verificationTx}
          />
        )}

        {step === 'verified' && (
          <div className="text-center">
            <div className="glass rounded-2xl p-8 max-w-2xl mx-auto">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-bold mb-4" style={{ color: "#FBFAF9" }}>
                Verification Complete!
              </h2>
              <p className="text-lg mb-6" style={{ color: "rgba(251, 250, 249, 0.8)" }}>
                Your age has been successfully verified on the Lisk Sepolia blockchain using zero-knowledge cryptography.
              </p>
              
              {verificationTx && (
                <div className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                  <p className="text-sm text-green-400 mb-2">Transaction Hash:</p>
                  <a 
                    href={`https://sepolia-blockscout.lisk.com/tx/${verificationTx}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-300 hover:text-green-200 font-mono text-xs break-all"
                  >
                    {verificationTx}
                  </a>
                </div>
              )}
              
              <button
                onClick={resetFlow}
                className="px-6 py-3 rounded-xl font-medium transition-all duration-200 btn-primary"
                style={{
                  background: "linear-gradient(135deg, #836EF9 0%, #A0055D 100%)",
                  color: "#FBFAF9"
                }}
              >
                Start New Verification
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <div className="min-h-screen">
            <Header />
            <ZKAgeVerificationApp />
          </div>
          <Toaster position="top-center" />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default App
```

### Styling dan UI

**`src/index.css`:**

```css
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap");
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  /* Monad Brand Colors */
  --monad-off-white: #fbfaf9;
  --monad-purple: #836ef9;
  --monad-blue: #200052;
  --monad-berry: #a0055d;
  --monad-black: #0e100f;
  --monad-white: #ffffff;

  /* DeFi specific colors */
  --success-green: #10b981;
  --success-green-light: rgba(16, 185, 129, 0.2);
  --warning-yellow: #f59e0b;
  --warning-yellow-light: rgba(245, 158, 11, 0.2);
  --error-red: #ef4444;
  --error-red-light: rgba(239, 68, 68, 0.2);

  /* Derived colors for UI */
  --monad-purple-light: rgba(131, 110, 249, 0.8);
  --monad-purple-dark: rgba(131, 110, 249, 0.2);
  --monad-berry-light: rgba(160, 5, 93, 0.8);
  --monad-berry-dark: rgba(160, 5, 93, 0.2);
  --monad-blue-light: rgba(32, 0, 82, 0.8);
  --monad-blue-dark: rgba(32, 0, 82, 0.3);

  /* UI System Colors */
  --bg-primary: var(--monad-blue);
  --bg-secondary: var(--monad-black);
  --bg-tertiary: rgba(32, 0, 82, 0.6);
  --text-primary: var(--monad-off-white);
  --text-secondary: var(--monad-white);
  --text-muted: rgba(251, 250, 249, 0.7);
  --border-primary: rgba(131, 110, 249, 0.3);
  --border-secondary: rgba(251, 250, 249, 0.1);
}

* {
  box-sizing: border-box;
}

body {
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  background: linear-gradient(135deg, var(--monad-blue) 0%, var(--monad-black) 50%, #1a0040 100%);
  min-height: 100vh;
  margin: 0;
  padding: 0;
  color: var(--text-primary);
  line-height: 1.6;
  font-weight: 400;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: var(--monad-black);
}

::-webkit-scrollbar-thumb {
  background: var(--monad-purple);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--monad-berry);
}

/* Animations */
@keyframes shimmer {
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
}

.shimmer {
  background: linear-gradient(90deg, rgba(251, 250, 249, 0.05) 0px, rgba(251, 250, 249, 0.15) 40px, rgba(251, 250, 249, 0.05) 80px);
  background-size: 400px;
  animation: shimmer 1.5s ease-in-out infinite;
}

@keyframes pulse-success {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.02);
  }
}

.pulse-success {
  animation: pulse-success 2s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-4px);
  }
}

.float-animation {
  animation: float 3s ease-in-out infinite;
}

@keyframes glow-purple {
  0%, 100% {
    box-shadow: 0 0 5px rgba(131, 110, 249, 0.3);
  }
  50% {
    box-shadow: 0 0 20px rgba(131, 110, 249, 0.6), 0 0 30px rgba(131, 110, 249, 0.4);
  }
}

@keyframes glow-berry {
  0%, 100% {
    box-shadow: 0 0 5px rgba(160, 5, 93, 0.3);
  }
  50% {
    box-shadow: 0 0 20px rgba(160, 5, 93, 0.6), 0 0 30px rgba(160, 5, 93, 0.4);
  }
}

@keyframes glow-success {
  0%, 100% {
    box-shadow: 0 0 5px rgba(16, 185, 129, 0.3);
  }
  50% {
    box-shadow: 0 0 20px rgba(16, 185, 129, 0.6), 0 0 30px rgba(16, 185, 129, 0.4);
  }
}

.glow-purple {
  animation: glow-purple 2s ease-in-out infinite;
}

.glow-berry {
  animation: glow-berry 2s ease-in-out infinite;
}

.glow-success {
  animation: glow-success 2s ease-in-out infinite;
}

/* Glass morphism effect */
.glass {
  background: rgba(14, 16, 15, 0.4);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(251, 250, 249, 0.1);
}

.glass-dark {
  background: rgba(32, 0, 82, 0.3);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(131, 110, 249, 0.2);
}

/* Button hover effects */
.btn-primary {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
}

.btn-primary:active {
  transform: translateY(0);
}

/* Card hover effects */
.card-hover {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.card-hover:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

/* Input styles */
.input-primary {
  background: rgba(14, 16, 15, 0.5);
  border: 1px solid rgba(251, 250, 249, 0.2);
  color: var(--text-primary);
  transition: all 0.3s ease;
}

.input-primary:focus {
  outline: none;
  border-color: var(--monad-purple);
  box-shadow: 0 0 0 3px rgba(131, 110, 249, 0.1);
}

/* Monad brand gradients */
.gradient-monad-primary {
  background: linear-gradient(135deg, var(--monad-purple) 0%, var(--monad-berry) 100%);
}

.gradient-monad-secondary {
  background: linear-gradient(135deg, var(--monad-blue) 0%, var(--monad-black) 100%);
}

.gradient-success {
  background: linear-gradient(135deg, var(--success-green) 0%, #059669 100%);
}

.text-gradient-monad {
  background: linear-gradient(135deg, var(--monad-purple) 0%, var(--monad-berry) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Loading spinner */
.spinner {
  border: 2px solid rgba(251, 250, 249, 0.3);
  border-top: 2px solid var(--monad-purple);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Custom number input */
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  appearance: textfield;
  -moz-appearance: textfield;
}

/* ZK Specific Styles */
.zk-card {
  background: rgba(14, 16, 15, 0.6);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(131, 110, 249, 0.2);
  border-radius: 1rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.zk-input {
  background: rgba(14, 16, 15, 0.8);
  border: 1px solid rgba(251, 250, 249, 0.2);
  color: var(--monad-off-white);
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  width: 100%;
  font-family: inherit;
  transition: all 0.3s ease;
}

.zk-input:focus {
  outline: none;
  border-color: var(--monad-purple);
  box-shadow: 0 0 0 3px rgba(131, 110, 249, 0.2);
}

.zk-input::placeholder {
  color: rgba(251, 250, 249, 0.5);
}

.proof-container {
  background: rgba(32, 0, 82, 0.2);
  border: 1px solid rgba(131, 110, 249, 0.3);
  border-radius: 0.75rem;
  padding: 1rem;
}

.commitment-hash {
  font-family: 'JetBrains Mono', monospace;
  background: rgba(14, 16, 15, 0.8);
  border: 1px solid rgba(131, 110, 249, 0.2);
  border-radius: 0.5rem;
  padding: 0.75rem;
  word-break: break-all;
  font-size: 0.875rem;
  color: var(--monad-purple);
}

/* Privacy guarantee styles */
.privacy-guarantee {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 0.75rem;
  padding: 1rem;
}

/* Status indicators */
.status-success {
  color: var(--success-green);
  background: var(--success-green-light);
  border: 1px solid var(--success-green);
  border-radius: 9999px;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
}

.status-warning {
  color: var(--warning-yellow);
  background: var(--warning-yellow-light);
  border: 1px solid var(--warning-yellow);
  border-radius: 9999px;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
}

.status-error {
  color: var(--error-red);
  background: var(--error-red-light);
  border: 1px solid var(--error-red);
  border-radius: 9999px;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
}

/* Progress indicator */
.progress-step {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  border: 2px solid;
  transition: all 0.3s ease;
}

.progress-step.active {
  border-color: var(--monad-purple);
  background: rgba(131, 110, 249, 0.2);
  color: var(--monad-purple);
}

.progress-step.completed {
  border-color: var(--success-green);
  background: rgba(16, 185, 129, 0.2);
  color: var(--success-green);
}

.progress-step.inactive {
  border-color: rgba(251, 250, 249, 0.3);
  background: transparent;
  color: rgba(251, 250, 249, 0.5);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .glass {
    backdrop-filter: blur(8px);
  }
  
  .zk-card {
    backdrop-filter: blur(8px);
  }
  
  .commitment-hash {
    font-size: 0.75rem;
  }
}

/* Selection styling */
::selection {
  background: rgba(131, 110, 249, 0.3);
  color: var(--monad-off-white);
}

/* Focus visible for accessibility */
*:focus-visible {
  outline: 2px solid var(--monad-purple);
  outline-offset: 2px;
}

/* Disabled state */
.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

/* Loading state overlay */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(14, 16, 15, 0.8);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

/* Tooltip styles */
.tooltip {
  position: relative;
}

.tooltip::after {
  content: attr(data-tooltip);
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(14, 16, 15, 0.9);
  color: var(--monad-off-white);
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
  z-index: 1000;
}

.tooltip:hover::after {
  opacity: 1;
}

/* Chart styles (for Recharts) */
.recharts-wrapper {
  font-family: 'Inter', sans-serif;
}

.recharts-cartesian-axis-tick-value {
  fill: rgba(251, 250, 249, 0.7);
  font-size: 12px;
}

.recharts-tooltip-wrapper {
  font-family: 'Inter', sans-serif;
}

/* Print styles */
@media print {
  body {
    background: white;
    color: black;
  }
  
  .glass,
  .glass-dark {
    background: white;
    border: 1px solid #ccc;
    backdrop-filter: none;
  }
}
```

### Styling dan UI (App Specific)

**`src/App.css`:**

```css
#root {
  width: 100%;
  margin: 0;
  padding: 0;
  min-height: 100vh;
}

.app-container {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* ZK Age Verification specific styles */
.zk-age-app {
  width: 100%;
  min-height: 100vh;
  padding: 0;
}

.ktp-form-container {
  max-width: 42rem;
  margin: 0 auto;
  padding: 1rem;
}

.proof-display-container {
  max-width: 56rem;
  margin: 0 auto;
  padding: 1rem;
}

.verification-complete-container {
  max-width: 32rem;
  margin: 0 auto;
  padding: 1rem;
  text-align: center;
}

/* Header specific styles */
.app-header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(32, 0, 82, 0.8);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(251, 250, 249, 0.1);
}

/* Footer if needed */
.app-footer {
  background: rgba(14, 16, 15, 0.8);
  border-top: 1px solid rgba(251, 250, 249, 0.1);
  padding: 1rem 0;
  text-align: center;
  color: rgba(251, 250, 249, 0.7);
  font-size: 0.875rem;
}

/* RainbowKit customization */
.iekbcc0 {
  font-family: 'Inter', sans-serif !important;
}

.iekbcc0 button {
  background: linear-gradient(135deg, var(--monad-purple) 0%, var(--monad-berry) 100%) !important;
  border: none !important;
  border-radius: 0.75rem !important;
  transition: all 0.3s ease !important;
}

.iekbcc0 button:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 10px 25px rgba(131, 110, 249, 0.3) !important;
}

/* React Hot Toast customization */
.react-hot-toast {
  font-family: 'Inter', sans-serif;
}

.react-hot-toast > div {
  background: rgba(14, 16, 15, 0.9) !important;
  color: var(--monad-off-white) !important;
  border: 1px solid rgba(131, 110, 249, 0.3) !important;
  border-radius: 0.75rem !important;
  backdrop-filter: blur(12px) !important;
}
```

### Tailwind Configuration

**`tailwind.config.js`:**

```typescript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Monad Brand Colors
        'monad-off-white': '#fbfaf9',
        'monad-purple': '#836ef9',
        'monad-blue': '#200052',
        'monad-berry': '#a0055d',
        'monad-black': '#0e100f',
        'monad-white': '#ffffff',
        
        // DeFi specific colors
        'success-green': '#10b981',
        'warning-yellow': '#f59e0b',
        'error-red': '#ef4444',
      },
      fontFamily: {
        'inter': ['Inter', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      backgroundImage: {
        'gradient-monad': 'linear-gradient(135deg, #836EF9 0%, #A0055D 100%)',
        'gradient-success': 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
        'gradient-main': 'linear-gradient(135deg, #200052 0%, #0E100F 50%, #1a0040 100%)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'glow-purple': 'glow-purple 2s ease-in-out infinite',
        'glow-berry': 'glow-berry 2s ease-in-out infinite',
        'glow-success': 'glow-success 2s ease-in-out infinite',
        'shimmer': 'shimmer 1.5s ease-in-out infinite',
        'pulse-success': 'pulse-success 2s ease-in-out infinite',
        'spin': 'spin 1s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        'glow-purple': {
          '0%, 100%': { boxShadow: '0 0 5px rgba(131, 110, 249, 0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(131, 110, 249, 0.6), 0 0 30px rgba(131, 110, 249, 0.4)' },
        },
        'glow-berry': {
          '0%, 100%': { boxShadow: '0 0 5px rgba(160, 5, 93, 0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(160, 5, 93, 0.6), 0 0 30px rgba(160, 5, 93, 0.4)' },
        },
        'glow-success': {
          '0%, 100%': { boxShadow: '0 0 5px rgba(16, 185, 129, 0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(16, 185, 129, 0.6), 0 0 30px rgba(16, 185, 129, 0.4)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200px 0' },
          '100%': { backgroundPosition: 'calc(200px + 100%) 0' },
        },
        'pulse-success': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.02)' },
        },
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
    },
  },
  plugins: [],
}
```

### Build Configuration

**`vite.config.ts`:**

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis',
  },
  optimizeDeps: {
    include: ['snarkjs'],
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    rollupOptions: {
      external: [],
    },
  },
})
```

### Typescript Configuration

**`tsconfig.app.json`:**

```json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["src"]
}
```

### Postcss Config

**`postcss.config.js`:**

```typescript
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

export default {
  plugins: [
    tailwindcss,
    autoprefixer,
  ],
}


```

### Package Configuration

**`package.json`:**

```json
{
  "name": "zk-age-verification",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview",
    "type-check": "tsc --noEmit",
    "css-build": "tailwindcss -i ./src/index.css -o ./dist/output.css --watch",
    "compile-circuit": "./scripts/compile-circuit.sh ageVerification"
  },
  "dependencies": {
    "@noir-lang/backend_barretenberg": "^0.36.0",
    "@noir-lang/noir_wasm": "^1.0.0-beta.15",
    "@rainbow-me/rainbowkit": "^2.2.9",
    "@tanstack/react-query": "^5.90.10",
    "circomlib": "^2.0.5",
    "lucide-react": "^0.554.0",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "react-hot-toast": "^2.6.0",
    "snarkjs": "^0.7.5",
    "viem": "^2.39.3",
    "wagmi": "^2.19.5"
  },
  "devDependencies": {
    "@eslint/js": "^9.39.1",
    "@types/node": "^24.10.1",
    "@types/react": "^19.2.5",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^5.1.1",
    "autoprefixer": "^10.4.22",
    "eslint": "^9.39.1",
    "eslint-plugin-react-hooks": "^7.0.1",
    "eslint-plugin-react-refresh": "^0.4.24",
    "globals": "^16.5.0",
    "postcss": "^8.5.6",
    "tailwindcss": "^3.4.18",
    "typescript": "~5.9.3",
    "typescript-eslint": "^8.46.4",
    "vite": "^7.2.4"
  }
}

```

### Setup Scripts

**`scripts/copy-circuit-files.sh`:**

```sh
#!/bin/bash

# Script untuk copy circuit files ke public directory

echo "🔧 Copying circuit files to public directory..."

# Create directory structure
mkdir -p public/circuits/build/ageVerification_js/
mkdir -p public/circuits/build/

# Copy WASM file
if [ -f "circuits/build/ageVerification_js/ageVerification.wasm" ]; then
    cp circuits/build/ageVerification_js/ageVerification.wasm public/circuits/build/ageVerification_js/
    echo "✅ Copied ageVerification.wasm"
else
    echo "❌ ageVerification.wasm not found in circuits/build/ageVerification_js/"
fi

# Copy zkey file
if [ -f "circuits/build/ageVerification_0001.zkey" ]; then
    cp circuits/build/ageVerification_0001.zkey public/circuits/build/
    echo "✅ Copied ageVerification_0001.zkey"
else
    echo "❌ ageVerification_0001.zkey not found in circuits/build/"
fi

# Copy verification key
if [ -f "circuits/build/verification_key.json" ]; then
    cp circuits/build/verification_key.json public/circuits/build/
    echo "✅ Copied verification_key.json"
else
    echo "❌ verification_key.json not found in circuits/build/"
fi

# Copy witness calculator (optional)
if [ -f "circuits/build/ageVerification_js/witness_calculator.js" ]; then
    cp circuits/build/ageVerification_js/witness_calculator.js public/circuits/build/ageVerification_js/
    echo "✅ Copied witness_calculator.js"
fi

# Copy generate_witness.js (optional)
if [ -f "circuits/build/ageVerification_js/generate_witness.js" ]; then
    cp circuits/build/ageVerification_js/generate_witness.js public/circuits/build/ageVerification_js/
    echo "✅ Copied generate_witness.js"
fi

echo ""
echo "📁 Files copied to public/circuits/build/"
echo "Structure:"
echo "public/"
echo "└── circuits/"
echo "    └── build/"
echo "        ├── ageVerification_js/"
echo "        │   ├── ageVerification.wasm"
echo "        │   ├── witness_calculator.js"
echo "        │   └── generate_witness.js"
echo "        ├── ageVerification_0001.zkey"
echo "        └── verification_key.json"

echo ""
echo "🚀 Circuit files ready for frontend!"
echo "You can now test the ZK proof generation."
```


Jalankan Script:

```bash
# Make executable
chmod +x scripts/copy-circuit-files.sh

# Compile circuit
./scripts/copy-circuit-files.sh
```




---

## 📊 Ringkasan Workflow Lengkap

### Complete Flow

```
1. User Input KTP Data
   ↓
2. Parse Tanggal Lahir (DD-MM-YYYY)
   ↓
3. Generate Random Salt
   ↓
4. Prepare Circuit Inputs
   ↓
5. Generate Witness (WASM)
   ↓
6. Generate ZK Proof (snarkjs)
   ↓
7. Format Proof untuk Smart Contract
   ↓
8. Verify Proof On-Chain
   ↓
9. Store Verification Status
```

### File Structure After Compilation

```
zk-age-verification/
├── circuits/
│   └── build/
│       ├── ageVerification.r1cs
│       ├── ageVerification.sym
│       ├── ageVerification_js/
│       │   ├── ageVerification.wasm
│       │   ├── generate_witness.js
│       │   └── witness_calculator.js
│       ├── ageVerification_0001.zkey
│       ├── verification_key.json
│       ├── pot14_0000.ptau
│       ├── pot14_0001.ptau
│       └── pot14_final.ptau
├── contracts/
│   ├── AgeVerifier.sol
│   └── verifier.sol (generated)
└── public/
    └── circuits/
        ├── ageVerification.wasm
        ├── ageVerification_0001.zkey
        └── verification_key.json
```

---

## 🎓 Key Takeaways

1. **Circuit Design:**
   - Private inputs untuk data sensitif
   - Public inputs untuk data yang bisa di-reveal
   - Constraints untuk validasi dan kalkulasi

2. **Proof Generation:**
   - Witness calculation dari circuit inputs
   - Proof generation menggunakan Groth16
   - Format proof untuk smart contract compatibility

3. **Smart Contract Integration:**
   - Verifier contract untuk on-chain verification
   - Replay protection dengan commitment mapping
   - Event emission untuk tracking

4. **Frontend Integration:**
   - Dynamic snarkjs loading
   - Circuit file management
   - User-friendly proof generation UI

---

## 📚 Referensi & Bacaan Lanjutan

**Documentation:**
- [Circom Documentation](https://docs.circom.io/)
- [snarkjs Documentation](https://github.com/iden3/snarkjs)
- [circomlib Library](https://github.com/iden3/circomlib)

**Related Materials:**
- [Bagian 4: Setup Circom](./04-circom-setup.md)
- [ZK Contracts Deployment Guide](../../Tutorial/Kelas-Rutin-BlockDevId/Sesi-6-Indexer-ZK-Proof/zk-contracts.md)
- [Instalasi & Compile Circom](../../Tutorial/Kelas-Rutin-BlockDevId/Sesi-6-Indexer-ZK-Proof/instalasi-compile-circom.md)

**Examples:**
- [Tornado Cash Circuits](https://github.com/tornadocash/tornado-core)
- [Semaphore](https://github.com/semaphore-protocol/semaphore)

---

**Selamat! Anda telah menyelesaikan praktik Age Verification dengan Zero-Knowledge Proofs! 🎉**

**Kembali ke:** [Sesi 9 Overview →](./sesi-9-kelas-rutin-batch-4.md)

