---
id: belajar-solidity-basic
title: Belajar Solidity Basic - Step by Step
sidebar_position: 1
---

# Belajar Solidity Basic - Step by Step

Dalam tutorial ini, kita akan belajar Solidity step-by-step dari yang paling dasar menggunakan konteks mahasiswa. Setiap konsep akan dijelaskan satu per satu dengan contoh yang mudah dipahami.

---

## Setup Awal

### 1. Setup Remix IDE

**Remix** adalah tempat untuk menulis dan menjalankan smart contract secara online.

**Langkah-langkah:**
1. Buka [https://remix.ethereum.org](https://remix.ethereum.org)
2. Kenali bagian-bagian Remix:
   - **Kiri**: File Explorer - tempat file kontrak
   - **Tengah**: Editor - tempat menulis kode
   - **Bawah**: Terminal - tempat melihat hasil
   - **Kanan**: Compiler dan Deploy

### 2. Setup MetaMask

**MetaMask** adalah dompet digital untuk berinteraksi dengan blockchain.

**Langkah-langkah:**
1. Download MetaMask dari [metamask.io](https://metamask.io)
2. Buat wallet baru (simpan seed phrase dengan aman!)

### 3. Setup Mantle Sepolia Testnet (WAJIB!)

<div style={{background:'#E8F5E9',borderRadius:'8px',padding:'16px',margin:'0 0 18px'}}>
  <p style={{fontSize:'15px',fontWeight:'600',margin:'0 0 12px'}}>🔧 Setup Mantle Sepolia Testnet (WAJIB!):</p>
  <p style={{fontSize:'14px',margin:'0 0 12px',color:'#666'}}>Ikuti langkah-langkah berikut untuk setup testnet:</p>

  <div style={{background:'#fff',borderRadius:'6px',padding:'12px',margin:'0 0 10px'}}>
    <p style={{fontSize:'14px',fontWeight:'600',margin:'0 0 6px'}}>Step 1: Tambah Mantle Sepolia ke MetaMask</p>
    <p style={{fontSize:'13px',margin:'0 0 8px',color:'#666'}}>Buka Chainlist dan connect wallet untuk auto-add network:</p>
    <a href="https://chainlist.org/?chain=11155111&search=mantle+sepolia&testnets=true" target="_blank"
       style={{display:'inline-block',padding:'8px 16px',fontSize:'13px',fontWeight:'600',color:'#333',background:'linear-gradient(135deg, #F2A9DD 0%, #C8B2F5 50%, #F7FAE4 100%)',
              textDecoration:'none',borderRadius:'6px'}}>
      🔗 Chainlist - Add Mantle Sepolia
    </a>
  </div>

  <div style={{background:'#fff',borderRadius:'6px',padding:'12px',margin:'0 0 10px'}}>
    <p style={{fontSize:'14px',fontWeight:'600',margin:'0 0 6px'}}>Step 2: Claim MNT di Sepolia Ethereum</p>
    <p style={{fontSize:'13px',margin:'0 0 8px',color:'#666'}}>Claim token MNT gratis di chain Sepolia Ethereum dari Mantle Faucet:</p>
    <a href="https://faucet.sepolia.mantle.xyz/" target="_blank"
       style={{display:'inline-block',padding:'8px 16px',fontSize:'13px',fontWeight:'600',color:'#333',background:'linear-gradient(135deg, #F2A9DD 0%, #C8B2F5 50%, #F7FAE4 100%)',
              textDecoration:'none',borderRadius:'6px'}}>
      🚰 Mantle Sepolia Faucet
    </a>
  </div>

  <div style={{background:'#fff',borderRadius:'6px',padding:'12px',margin:'0 0 10px'}}>
    <p style={{fontSize:'14px',fontWeight:'600',margin:'0 0 6px'}}>Step 3: Ambil Sepolia ETH (untuk gas bridge)</p>
    <p style={{fontSize:'13px',margin:'0 0 8px',color:'#666'}}>Claim Sepolia ETH gratis dari Google Cloud Faucet untuk biaya gas bridge:</p>
    <a href="https://cloud.google.com/application/web3/faucet/ethereum/sepolia" target="_blank"
       style={{display:'inline-block',padding:'8px 16px',fontSize:'13px',fontWeight:'600',color:'#333',background:'linear-gradient(135deg, #F2A9DD 0%, #C8B2F5 50%, #F7FAE4 100%)',
              textDecoration:'none',borderRadius:'6px'}}>
      🚰 Google Sepolia Faucet
    </a>
  </div>

  <div style={{background:'#fff',borderRadius:'6px',padding:'12px',margin:'0'}}>
    <p style={{fontSize:'14px',fontWeight:'600',margin:'0 0 6px'}}>Step 4: Bridge MNT ke Mantle Sepolia</p>
    <p style={{fontSize:'13px',margin:'0 0 8px',color:'#666'}}>Bridge token MNT dari Sepolia Ethereum ke Mantle Sepolia:</p>
    <a href="https://app.mantle.xyz/bridge?network=sepolia" target="_blank"
       style={{display:'inline-block',padding:'8px 16px',fontSize:'13px',fontWeight:'600',color:'#333',background:'linear-gradient(135deg, #F2A9DD 0%, #C8B2F5 50%, #F7FAE4 100%)',
              textDecoration:'none',borderRadius:'6px'}}>
      🌉 Mantle Bridge (Sepolia)
    </a>
  </div>
</div>

:::info Catatan Penting
- Pastikan Anda memiliki Sepolia ETH untuk membayar gas fee saat bridge
- Proses bridge membutuhkan waktu beberapa menit
- Setelah bridge selesai, MNT akan muncul di wallet Anda pada network Mantle Sepolia
:::

### 4. Hubungkan Remix dengan MetaMask

1. Di Remix, klik tab **"Deploy & Run Transactions"**
2. Di bagian Environment, pilih **"Injected Provider - MetaMask"**
3. Pastikan MetaMask terhubung ke **Mantle Sepolia Network**

:::success Siap!
Sekarang Anda sudah siap untuk belajar Solidity!
:::

---

## 4.1 Solidity 101: Tipe Data Dasar

Kita akan belajar satu tipe data per waktu menggunakan contoh data mahasiswa.

### 1. String (Teks)

**Apa itu:** Menyimpan teks seperti "Budi Santoso" atau "Teknik Informatika"

**Mengapa penting:** Digunakan untuk nama, alamat, deskripsi, dan semua data berbentuk teks

Buat file `LearnString.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract LearnString {
    // Variabel string untuk menyimpan nama mahasiswa
    string public studentName;

    // Constructor mengatur nilai awal
    constructor() {
        studentName = "Budi Santoso";
    }

    // Fungsi untuk mengubah nama
    function changeName(string memory _newName) public {
        studentName = _newName;
    }
}
```

**Penjelasan:**
- `string public studentName` - membuat variabel string yang bisa dibaca orang lain
- `constructor()` - fungsi yang jalan sekali saat kontrak dibuat
- `string memory _newName` - parameter input bertipe string (temporary di memory)
- `memory` - kata kunci untuk data temporary (tidak tersimpan permanent)

**Coba:**
1. Deploy → Klik `studentName` → Lihat "Budi Santoso"
2. Ketik "Ani Wijaya" → Klik `changeName`
3. Klik `studentName` → Sekarang "Ani Wijaya"!

---

### 2. Number (uint256)

**Apa itu:** Menyimpan bilangan bulat positif dari 0 hingga sangat besar (2^256-1)

**Mengapa penting:** Untuk ID, NIM, nilai, jumlah, score, dan semua data numerik

Buat `LearnNumber.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract LearnNumber {
    // Angka untuk data mahasiswa
    uint256 public studentId;
    uint256 public credits;

    constructor() {
        studentId = 2101001;
        credits = 0;
    }

    function changeStudentId(uint256 _newId) public {
        studentId = _newId;
    }

    function addCredits() public {
        credits = credits + 3;
        // Bisa juga ditulis: credits += 3;
    }
}
```

**Penjelasan:**
- `uint256` - unsigned integer 256-bit (0 sampai 2^256-1)
- `studentId = 2101001` - mengisi nilai ke variabel
- `credits += 3` - cara singkat untuk credits = credits + 3

**Coba:**
1. Deploy → Klik `credits` → Lihat 0
2. Klik `addCredits` 4 kali
3. Klik `credits` → Sekarang 12 (4 x 3)!

---

### 3. Boolean (Benar/Salah)

**Apa itu:** Hanya dua nilai - `true` atau `false`

**Mengapa penting:** Untuk status aktif/tidak, lulus/tidak lulus, dan semua kondisi ya/tidak

Buat `LearnBoolean.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract LearnBoolean {
    bool public isActive;
    bool public hasGraduated;

    constructor() {
        isActive = true;
        hasGraduated = false;
    }

    // Fungsi untuk mengubah status
    function changeStatus(bool _status) public {
        isActive = _status;
    }

    // Fungsi untuk lulus
    function graduate() public {
        hasGraduated = true;
    }
}
```

**Penjelasan:**
- `bool` - tipe data yang hanya bisa `true` atau `false`
- `isActive = true` - mengisi nilai boolean
- Berguna untuk menyimpan status ya/tidak

**Coba:**
1. Deploy → Klik `hasGraduated` → Lihat false
2. Klik `graduate`
3. Klik `hasGraduated` → Sekarang true!

---

### 4. Address (Alamat Wallet)

**Apa itu:** Menyimpan alamat wallet Ethereum (20 bytes, seperti 0x742d35Cc...)

**Mengapa penting:** Untuk identifikasi kepemilikan, pengirim transaksi, dan tujuan pembayaran

Buat `LearnAddress.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract LearnAddress {
    address public admin;
    address public student;

    constructor() {
        admin = msg.sender;  // msg.sender = alamat wallet Anda
    }

    function setStudent(address _student) public {
        student = _student;
    }
}
```

**Poin Penting:**
- `address` - menyimpan alamat wallet (0x742d35Cc...)
- `msg.sender` - alamat yang memanggil fungsi
- Digunakan untuk kepemilikan, pembayaran, kontrol akses

**Coba:**
1. Deploy → Klik `admin` → Lihat alamat wallet Anda!
2. Salin alamat lain → Paste di `setStudent`
3. Klik `student` → Lihat alamat tersebut

---

### 5. 🎯 TANTANGAN: Buat StudentData Sendiri!

**Apa yang dipelajari:** Menggabungkan semua tipe data dalam satu contract

**Tujuan:** Tulis contract `StudentData.sol` SENDIRI tanpa copy-paste!

#### 📋 Spesifikasi Contract:

**State Variables yang dibutuhkan:**
1. `studentName` (tipe: string, public) → nama mahasiswa
2. `studentId` (tipe: uint256, public) → NIM
3. `isActive` (tipe: bool, public) → status aktif
4. `wallet` (tipe: address, public) → alamat wallet
5. `registeredTime` (tipe: uint256, public) → waktu pendaftaran

**Constructor:**
- Set `studentName` = "Budi Santoso"
- Set `studentId` = 2101001
- Set `isActive` = true
- Set `wallet` = alamat yang deploy (gunakan `msg.sender`)
- Set `registeredTime` = waktu sekarang (gunakan `block.timestamp`)

**Fungsi yang dibutuhkan:**
1. `updateCredits()` - Tipe: public - Aksi: Menambah state variable `credits` (uint256) sebesar 3
2. `getAge()` - Tipe: public view - Return: uint256 - Aksi: Hitung lama terdaftar (waktu sekarang - waktu daftar)

#### 🔨 Mulai Coding:

Buat file baru `StudentData.sol` di Remix dan mulai dari template ini:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract StudentData {
    // TODO 1: Deklarasikan 6 state variables
    // Hint: string public studentName;
    // Hint: uint256 public studentId;
    // ... tulis 4 lainnya!






    // TODO 2: Buat constructor
    constructor() {
        // Set nilai awal untuk semua variables
        // Hint: studentName = "Budi Santoso";
        // Hint: wallet = msg.sender;



    }

    // TODO 3: Buat fungsi updateCredits()
    // Hint: function updateCredits() public { ... }


    // TODO 4: Buat fungsi getAge()
    // Hint: function getAge() public view returns (uint256) { ... }
    // Hint: return block.timestamp - registeredTime;


}
```

#### ✅ Checklist Verifikasi:

Setelah selesai, cek apakah contract Anda memenuhi ini:

- [ ] Ada 6 state variables (string, uint256, bool, address, uint256, uint256)
- [ ] Semua variables adalah public
- [ ] Constructor mengatur semua nilai awal
- [ ] Fungsi `updateCredits()` menambah credits sebesar 3
- [ ] Fungsi `getAge()` adalah view dan return uint256
- [ ] Fungsi `getAge()` menghitung selisih waktu
- [ ] Contract dapat di-compile tanpa error

#### 🧪 Test Contract Anda:

**1. Deploy**
- Klik "Deploy" di Remix
- Lihat contract muncul di "Deployed Contracts"

**2. Test Variables**
- Klik `studentName` → Harus tampil "Budi Santoso"
- Klik `studentId` → Harus tampil 2101001
- Klik `isActive` → Harus tampil true
- Klik `wallet` → Harus tampil alamat wallet Anda
- Klik `registeredTime` → Harus tampil angka (Unix timestamp)

**3. Test Fungsi updateCredits()**
- Klik `updateCredits` → Popup MetaMask muncul
- Confirm transaksi
- Klik `credits` → Harus tampil 3

**4. Test Fungsi getAge()**
- Klik `getAge` → Langsung tampil angka (GRATIS!)
- Tunggu 1 menit
- Klik `getAge` lagi → Angka bertambah ~60 detik!

#### 🎓 Penjelasan Konsep:

**Variabel Khusus Solidity:**
- `msg.sender` - alamat wallet yang memanggil fungsi
- `block.timestamp` - waktu blok saat ini (Unix timestamp dalam detik)

**Modifier Fungsi:**
- `public` - siapa saja dapat memanggil fungsi
- `view` - hanya membaca, tidak mengubah state → GRATIS!
- `returns (uint256)` - fungsi mengembalikan angka

**Cara Kerja:**
- Constructor berjalan sekali saat deploy
- State variables tersimpan permanen di blockchain
- Fungsi view GRATIS dipanggil dari luar (no gas!)
- Fungsi yang mengubah state butuh gas (popup MetaMask)

#### 💡 Tips Debugging:

**Error Umum:**

```
"ParserError: Expected ';' but got '}'"
→ Lupa titik koma di akhir statement

"TypeError: Member 'sender' not found"
→ Salah ketik: msg.sender (huruf kecil semua!)

"DeclarationError: Undeclared identifier"
→ Variabel belum dideklarasikan atau typo nama

"TypeError: Different number of arguments"
→ Cek parameter fungsi, apakah sudah sesuai?
```

**Jika Stuck:**
1. Cek kembali 4 contract sebelumnya (String, Number, Boolean, Address)
2. Lihat pattern yang sama
3. Kombinasikan pattern tersebut
4. Jangan menyerah! Ini proses belajar 💪

#### 🏆 Setelah Berhasil:

Selamat! Anda sudah menguasai:
- ✅ 4 tipe data dasar (string, uint256, bool, address)
- ✅ State variables
- ✅ Constructor
- ✅ Public functions
- ✅ View functions (read-only)
- ✅ Global variables (msg.sender, block.timestamp)

**Selanjutnya:** Pelajari Struct & Enum untuk data yang lebih kompleks!

---

### 6. Global Variables (Variabel Bawaan Solidity)

**Apa itu:** Variabel khusus yang sudah disediakan oleh Solidity dan dapat diakses dari mana saja dalam smart contract tanpa perlu mendeklarasikannya.

**Mengapa penting:** Memberikan informasi penting tentang transaksi, block, dan konteks eksekusi yang diperlukan untuk logic smart contract.

#### Kategori Global Variables

##### 1. Block Properties

| Variable | Tipe | Deskripsi |
|----------|------|-----------|
| `block.timestamp` | `uint256` | Waktu block saat ini (Unix timestamp dalam detik) |
| `block.number` | `uint256` | Nomor block saat ini |
| `block.chainid` | `uint256` | Chain ID dari blockchain (Mantle Sepolia = 5003) |
| `block.coinbase` | `address payable` | Alamat miner/validator yang membuat block |
| `block.difficulty` | `uint256` | Difficulty block saat ini |
| `block.gaslimit` | `uint256` | Gas limit block saat ini |
| `block.basefee` | `uint256` | Base fee block saat ini (EIP-1559) |
| `blockhash(uint256)` | `bytes32` | Hash dari block tertentu (hanya 256 block terakhir) |

##### 2. Transaction Properties (msg)

| Variable | Tipe | Deskripsi |
|----------|------|-----------|
| `msg.sender` | `address` | Alamat yang memanggil fungsi saat ini |
| `msg.value` | `uint256` | Jumlah wei (ETH) yang dikirim bersama transaksi |
| `msg.data` | `bytes` | Data lengkap dari calldata |
| `msg.sig` | `bytes4` | 4 byte pertama dari calldata (function selector) |

##### 3. Transaction Properties (tx)

| Variable | Tipe | Deskripsi |
|----------|------|-----------|
| `tx.origin` | `address` | Alamat yang memulai transaksi (EOA asli) |
| `tx.gasprice` | `uint256` | Harga gas dari transaksi |

##### 4. Contract Properties

| Variable | Tipe | Deskripsi |
|----------|------|-----------|
| `this` | `address` | Alamat contract saat ini |
| `address(this).balance` | `uint256` | Saldo ETH/MNT contract saat ini |

#### Contoh Penggunaan Global Variables

Buat `LearnGlobalVariables.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract LearnGlobalVariables {
    // ============================================
    // BLOCK PROPERTIES
    // ============================================

    // Mendapatkan waktu block saat ini
    function getCurrentTimestamp() public view returns (uint256) {
        return block.timestamp;
    }

    // Mendapatkan nomor block saat ini
    function getCurrentBlockNumber() public view returns (uint256) {
        return block.number;
    }

    // Mendapatkan chain ID (Mantle Sepolia = 5003)
    function getChainId() public view returns (uint256) {
        return block.chainid;
    }

    // Mendapatkan alamat validator/miner
    function getBlockCoinbase() public view returns (address) {
        return block.coinbase;
    }

    // Mendapatkan gas limit block
    function getBlockGasLimit() public view returns (uint256) {
        return block.gaslimit;
    }

    // Mendapatkan hash dari block sebelumnya
    function getPreviousBlockHash() public view returns (bytes32) {
        return blockhash(block.number - 1);
    }

    // ============================================
    // MESSAGE (MSG) PROPERTIES
    // ============================================

    // Mendapatkan alamat pemanggil fungsi
    function getMsgSender() public view returns (address) {
        return msg.sender;
    }

    // Mendapatkan jumlah MNT/ETH yang dikirim (dalam wei)
    function getMsgValue() public payable returns (uint256) {
        return msg.value;
    }

    // Mendapatkan calldata lengkap
    function getMsgData() public pure returns (bytes calldata) {
        return msg.data;
    }

    // Mendapatkan function selector (4 bytes pertama)
    function getMsgSig() public pure returns (bytes4) {
        return msg.sig;
    }

    // ============================================
    // TRANSACTION (TX) PROPERTIES
    // ============================================

    // Mendapatkan alamat EOA yang memulai transaksi
    function getTxOrigin() public view returns (address) {
        return tx.origin;
    }

    // Mendapatkan harga gas transaksi
    function getTxGasPrice() public view returns (uint256) {
        return tx.gasprice;
    }

    // ============================================
    // CONTRACT PROPERTIES
    // ============================================

    // Mendapatkan alamat contract ini
    function getContractAddress() public view returns (address) {
        return address(this);
    }

    // Mendapatkan saldo contract (dalam wei)
    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }

    // ============================================
    // PRACTICAL EXAMPLES
    // ============================================

    address public owner;
    uint256 public deployTime;
    uint256 public deployBlock;

    constructor() {
        owner = msg.sender;           // Simpan alamat deployer
        deployTime = block.timestamp; // Simpan waktu deploy
        deployBlock = block.number;   // Simpan block deploy
    }

    // Contoh: Hanya owner yang bisa memanggil
    function onlyOwnerCanCall() public view returns (string memory) {
        require(msg.sender == owner, "Bukan owner!");
        return "Anda adalah owner!";
    }

    // Contoh: Hitung berapa lama contract sudah di-deploy
    function getContractAge() public view returns (uint256) {
        return block.timestamp - deployTime;
    }

    // Contoh: Hitung berapa block sejak deploy
    function getBlocksSinceDeploy() public view returns (uint256) {
        return block.number - deployBlock;
    }

    // Contoh: Terima MNT/ETH dan catat pengirim
    event Received(address indexed sender, uint256 amount, uint256 timestamp);

    function deposit() public payable {
        emit Received(msg.sender, msg.value, block.timestamp);
    }

    // Contoh: Validasi chain ID (pastikan di Mantle Sepolia)
    function validateChain() public view returns (bool) {
        return block.chainid == 5003; // Mantle Sepolia Chain ID
    }
}
```

#### Coba di Remix:

1. **Deploy** contract di Mantle Sepolia
2. **Test Block Properties:**
   - Klik `getCurrentTimestamp` → Lihat Unix timestamp
   - Klik `getCurrentBlockNumber` → Lihat nomor block
   - Klik `getChainId` → Harus 5003 (Mantle Sepolia)
3. **Test Msg Properties:**
   - Klik `getMsgSender` → Lihat alamat wallet Anda
   - Masukkan VALUE 0.001 MNT → Klik `getMsgValue` → Lihat jumlah wei
4. **Test Tx Properties:**
   - Klik `getTxOrigin` → Sama dengan msg.sender (jika langsung dari wallet)
5. **Test Contract Properties:**
   - Klik `getContractAddress` → Alamat contract
   - Klik `getContractBalance` → Saldo contract (0 jika belum ada deposit)
6. **Test Practical Examples:**
   - Klik `onlyOwnerCanCall` → "Anda adalah owner!"
   - Klik `getContractAge` → Detik sejak deploy
   - Masukkan VALUE → Klik `deposit` → Lihat event di logs

#### ⚠️ Perbedaan Penting: `msg.sender` vs `tx.origin`

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract ContractA {
    function callContractB(address _contractB) public view returns (address, address) {
        return ContractB(_contractB).whoCalledMe();
    }
}

contract ContractB {
    function whoCalledMe() public view returns (address sender, address origin) {
        sender = msg.sender;  // Alamat yang LANGSUNG memanggil (bisa contract)
        origin = tx.origin;   // Alamat EOA yang MEMULAI transaksi
    }
}
```

**Skenario:**
- User (EOA: 0xUser) → ContractA → ContractB
- Di ContractB:
  - `msg.sender` = alamat ContractA
  - `tx.origin` = alamat User (0xUser)

:::warning Peringatan Keamanan
**JANGAN** gunakan `tx.origin` untuk autentikasi! Rentan terhadap phishing attack. Selalu gunakan `msg.sender` untuk cek kepemilikan.
:::

#### 📊 Ringkasan Global Variables

| Variable | Kegunaan Utama |
|----------|----------------|
| `msg.sender` | Cek siapa yang memanggil, access control |
| `msg.value` | Cek jumlah ETH/MNT yang dikirim |
| `block.timestamp` | Logic berbasis waktu, deadline |
| `block.number` | Tracking block, randomness (tidak aman) |
| `block.chainid` | Validasi network yang benar |
| `address(this)` | Referensi ke contract sendiri |
| `address(this).balance` | Cek saldo contract |

---

## 4.2 Solidity 102: Struct & Enum

Sekarang kita akan belajar cara mengelompokkan data dengan Struct dan Enum.

### 1. Enum (Angka Bernama)

**Apa itu:** Tipe data dengan nilai yang sudah ditentukan sebelumnya

**Mengapa penting:** Membuat kode lebih mudah dibaca dan mencegah nilai yang tidak valid

Buat `LearnEnum.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract LearnEnum {
    enum StudentStatus {
        NotRegistered,  // 0
        Active,         // 1
        OnLeave,        // 2
        Graduated,      // 3
        Dropped         // 4
    }

    StudentStatus public currentStatus;

    constructor() {
        currentStatus = StudentStatus.NotRegistered;
    }

    function register() public {
        currentStatus = StudentStatus.Active;
    }

    function takeLeave() public {
        if (currentStatus == StudentStatus.Active) {
            currentStatus = StudentStatus.OnLeave;
        }
    }

    function graduate() public {
        if (currentStatus == StudentStatus.Active) {
            currentStatus = StudentStatus.Graduated;
        }
    }
}
```

**Penjelasan:**
- `enum StudentStatus { ... }` - mendefinisikan tipe data dengan nilai fixed
- `NotRegistered` = 0, `Active` = 1, dst (otomatis increment)
- `currentStatus = StudentStatus.Active` - mengisi nilai enum
- Lebih aman dan mudah dibaca daripada menggunakan angka langsung

**Coba:**
1. Deploy → Klik `currentStatus` → Lihat 0 (NotRegistered)
2. Klik `register` → Status berubah ke 1 (Active)
3. Klik `graduate` → Status berubah ke 3 (Graduated)

---

### 2. Struct (Kelompok Data)

**Apa itu:** Cara untuk mengelompokkan beberapa variabel menjadi satu tipe data kustom

**Mengapa penting:** Mengorganisir data yang saling berhubungan, membuat kode lebih rapi

Buat `LearnStruct.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract LearnStruct {
    enum StudentStatus { NotRegistered, Active, OnLeave, Graduated }

    struct Student {
        uint256 id;
        string name;
        address wallet;
        StudentStatus status;
        uint8 credits;
        bool isActive;
    }

    Student public myStudent;

    constructor() {
        myStudent = Student({
            id: 2101001,
            name: "Budi Santoso",
            wallet: msg.sender,
            status: StudentStatus.Active,
            credits: 0,
            isActive: true
        });
    }

    function addCredits() public {
        myStudent.credits += 3;
    }

    function changeStatus(StudentStatus _status) public {
        myStudent.status = _status;
    }
}
```

**Penjelasan:**
- `struct Student { ... }` - membuat tipe kustom baru yang mengelompokkan data
- Seperti membuat template: setiap Student memiliki id, name, wallet, dll
- `Student public myStudent` - membuat variabel bertipe Student
- `myStudent = Student({ ... })` - mengisi struct dengan data
- `myStudent.credits += 3` - akses dan ubah field tertentu

**Coba:**
1. Deploy
2. Klik `myStudent` → Lihat semua data tergabung
3. Klik `addCredits` → Credits bertambah 3
4. Klik `myStudent` lagi → Lihat perubahan!

---

## 4.3 Solidity 103: Mapping & Array

Pelajari cara mengelola banyak mahasiswa.

### 1. Mapping (Kamus)

**Apa itu:** Seperti kamus - memetakan kunci ke nilai (studentId → data)

**Mengapa penting:** Mengasosiasikan data dengan identifier unik, pencarian cepat berdasarkan kunci

Buat `LearnMapping.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract LearnMapping {
    // Mapping: studentId => name
    mapping(uint256 => string) public studentName;

    // Mapping: studentId => credits
    mapping(uint256 => uint256) public studentCredits;

    function addStudent(uint256 _id, string memory _name) public {
        studentName[_id] = _name;
        studentCredits[_id] = 0;
    }

    function addCredits(uint256 _id, uint256 _amount) public {
        studentCredits[_id] += _amount;
    }
}
```

**Penjelasan:**
- `mapping(uint256 => string)` - seperti kamus, map studentId (key) ke name (value)
- `mapping(uint256 => uint256)` - map studentId ke credits
- `studentName[_id] = _name` - set nama untuk student ID tertentu
- `public` pada mapping otomatis membuat fungsi getter

**Coba:**
1. Deploy
2. Ketik 2101001, "Budi" → Klik `addStudent`
3. Ketik 2101002, "Ani" → Klik `addStudent`
4. Ketik 2101001 di `studentName` → Lihat "Budi"
5. Ketik 2101002 di `studentName` → Lihat "Ani"
6. Sekarang Anda punya 2 mahasiswa!

---

### 2. Array (Daftar)

**Apa itu:** Daftar berurutan yang dapat bertambah ukurannya

**Mengapa penting:** Menyimpan koleksi yang dapat diiterasi, mendapatkan semua item sekaligus

Buat `LearnArray.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract LearnArray {
    // Array untuk menyimpan student ID
    uint256[] public allStudentIds;

    // Tambah mahasiswa
    function addStudent(uint256 _id) public {
        allStudentIds.push(_id);
    }

    // Dapatkan total mahasiswa
    function getTotalStudents() public view returns (uint256) {
        return allStudentIds.length;
    }

    // Dapatkan semua student ID
    function getAllStudents() public view returns (uint256[] memory) {
        return allStudentIds;
    }

    // Dapatkan student tertentu by index
    function getStudentByIndex(uint256 _index) public view returns (uint256) {
        return allStudentIds[_index];
    }
}
```

**Penjelasan:**
- `uint256[]` - array dinamis yang dapat bertambah ukurannya
- `allStudentIds.push(_id)` - menambahkan elemen ke akhir array
- `allStudentIds.length` - mengembalikan jumlah elemen
- `allStudentIds[0]` - akses elemen pertama (array dimulai dari indeks 0!)
- `returns (uint256[] memory)` - mengembalikan seluruh array

**Coba:**
1. Deploy
2. Tambah student dengan ID: 2101001, 2101002, 2101003
3. Klik `getTotalStudents` → Lihat 3
4. Klik `getAllStudents` → Lihat [2101001, 2101002, 2101003]
5. Ketik 0 di `getStudentByIndex` → Lihat 2101001 (index pertama!)

---

### 3. Mapping + Struct (Banyak Mahasiswa)

**Apa itu:** Menggabungkan mapping dengan struct untuk menyimpan banyak item kompleks

**Mengapa penting:** Mengelola banyak item dengan data kompleks, pola smart contract dunia nyata

Buat `MultipleStudents.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract MultipleStudents {
    enum StudentStatus { NotRegistered, Active, OnLeave, Graduated }

    struct Student {
        uint256 id;
        string name;
        address wallet;
        StudentStatus status;
        uint8 credits;
        bool exists;
    }

    // Mapping untuk menyimpan mahasiswa
    mapping(uint256 => Student) public students;

    // Counter
    uint256 public studentCounter;

    // Tambah mahasiswa baru
    function addStudent(string memory _name) public returns (uint256) {
        studentCounter++;

        students[studentCounter] = Student({
            id: studentCounter,
            name: _name,
            wallet: msg.sender,
            status: StudentStatus.Active,
            credits: 0,
            exists: true
        });

        return studentCounter;
    }

    // Tambah credits
    function addCredits(uint256 _id, uint8 _amount) public {
        students[_id].credits += _amount;
    }

    // Dapatkan info mahasiswa
    function getStudent(uint256 _id) public view returns (Student memory) {
        return students[_id];
    }

    // Check apakah mahasiswa exist
    function studentExists(uint256 _id) public view returns (bool) {
        return students[_id].exists;
    }
}
```

**Penjelasan:**
- `mapping(uint256 => Student) public students` - map studentId ke Student struct
- `studentCounter++` - increment counter (membuat ID unik)
- `students[studentCounter] = Student({ ... })` - simpan mahasiswa baru di mapping
- `returns (uint256)` - fungsi mengembalikan ID mahasiswa baru
- `returns (Student memory)` - fungsi mengembalikan copy Student struct
- Menggabungkan mapping + struct untuk kelola banyak mahasiswa!

**Coba:**
1. Deploy
2. Ketik "Budi" → Klik `addStudent` → Return studentId=1
3. Ketik "Ani" → Klik `addStudent` → Return studentId=2
4. Ketik 1 di `getStudent` → Lihat data mahasiswa #1
5. Ketik 2 di `getStudent` → Lihat data mahasiswa #2
6. Ketik 1, 6 di `addCredits` → Tambah 6 credits untuk mahasiswa #1
7. Ketik 1 di `getStudent` → Lihat credits bertambah!

---

## 4.4 Solidity 104: Modifier & Event

Tambahkan keamanan dan komunikasi.

### 1. Require (Validasi)

**Apa itu:** Penjaga keamanan yang memeriksa kondisi sebelum menjalankan kode

**Mengapa penting:** Mencegah tindakan tidak sah, validasi input, penting untuk keamanan

Buat `LearnRequire.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract LearnRequire {
    mapping(uint256 => address) public studentOwner;
    mapping(uint256 => uint256) public studentCredits;

    function registerStudent(uint256 _id) public {
        studentOwner[_id] = msg.sender;
        studentCredits[_id] = 0;
    }

    function addCredits(uint256 _id, uint256 _amount) public {
        // Cek apakah caller adalah pemilik student
        require(studentOwner[_id] == msg.sender, "Bukan student Anda!");

        // Cek amount valid
        require(_amount > 0, "Amount harus lebih dari 0");

        studentCredits[_id] += _amount;
    }
}
```

**Penjelasan:**
- `require(condition, "error message")` - cek apakah kondisi benar
- Jika kondisi FALSE → transaksi gagal dan tampilkan pesan error
- Jika kondisi TRUE → kode lanjut ke baris berikutnya
- `studentOwner[_id] == msg.sender` - cek apakah caller adalah pemilik
- Digunakan untuk validasi dan security checks

**Coba:**
1. Deploy
2. Ketik 2101001 → Klik `registerStudent`
3. Ketik 2101001, 3 → Klik `addCredits` → BERHASIL (Anda pemiliknya)
4. Ganti ke akun lain di MetaMask
5. Ketik 2101001, 3 → Coba `addCredits` → GAGAL "Bukan student Anda!"
6. Ketik 2101001, 0 → Coba `addCredits` → GAGAL "Amount harus lebih dari 0"

---

### 2. Modifier (Pemeriksaan Reusable)

**Apa itu:** Pembungkus validasi yang dapat digunakan kembali untuk banyak fungsi

**Mengapa penting:** Hindari pengulangan require, kode lebih bersih, prinsip DRY

Buat `LearnModifier.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract LearnModifier {
    address public admin;
    mapping(uint256 => address) public studentOwner;
    mapping(uint256 => uint256) public studentCredits;
    uint256 public adminActionCount;

    constructor() {
        admin = msg.sender;
    }

    // Modifier: hanya admin yang bisa call
    modifier onlyAdmin() {
        require(msg.sender == admin, "Hanya admin!");
        _;
    }

    // Modifier: harus pemilik student
    modifier onlyStudentOwner(uint256 _id) {
        require(studentOwner[_id] == msg.sender, "Bukan student Anda!");
        _;
    }

    function registerStudent(uint256 _id) public {
        studentOwner[_id] = msg.sender;
        studentCredits[_id] = 0;
    }

    // Hanya admin yang bisa call ini
    function adminFunction() public onlyAdmin {
        adminActionCount++;
    }

    // Hanya pemilik student yang bisa add credits
    function addCredits(uint256 _id, uint256 _amount) public onlyStudentOwner(_id) {
        require(_amount > 0, "Amount harus lebih dari 0");
        studentCredits[_id] += _amount;
    }
}
```

**Penjelasan:**
- `modifier onlyAdmin() { ... }` - membuat check yang reusable
- `_` - placeholder di mana kode fungsi akan berjalan
- `function adminFunction() public onlyAdmin` - apply modifier
- Modifier berjalan SEBELUM fungsi (check kondisi dulu)
- `adminActionCount++` - tambah counter (hanya admin bisa)
- Lebih bersih daripada menulis require di setiap fungsi!
- Dapat gunakan beberapa modifier pada satu fungsi

**Coba:**
1. Deploy
2. Klik `adminActionCount` → Lihat 0
3. Klik `adminFunction` → BERHASIL (Anda admin)
4. Klik `adminActionCount` → Sekarang 1!
5. Ganti akun → Coba `adminFunction` → GAGAL "Hanya admin!"
6. Ketik 2101001 → `registerStudent` → BERHASIL
7. Ketik 2101001, 3 → `addCredits` → BERHASIL
8. Ganti akun → Ketik 2101001, 3 → `addCredits` → GAGAL "Bukan student Anda!"

---

### 3. Event (Komunikasi)

**Apa itu:** Menyiarkan log tentang apa yang terjadi di contract (disimpan di blockchain)

**Mengapa penting:** Frontend listen real-time updates, track history, debugging tool

Buat `LearnEvents.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract LearnEvents {
    // Deklarasi event
    event StudentRegistered(address indexed owner, uint256 indexed studentId, string name);
    event CreditsAdded(uint256 indexed studentId, uint256 credits, uint256 totalCredits);

    mapping(uint256 => address) public studentOwner;
    mapping(uint256 => string) public studentName;
    mapping(uint256 => uint256) public studentCredits;
    uint256 public studentCounter;

    function registerStudent(string memory _name) public {
        studentCounter++;
        studentOwner[studentCounter] = msg.sender;
        studentName[studentCounter] = _name;
        studentCredits[studentCounter] = 0;

        // Emit event
        emit StudentRegistered(msg.sender, studentCounter, _name);
    }

    function addCredits(uint256 _id, uint256 _amount) public {
        require(studentOwner[_id] == msg.sender, "Bukan student Anda!");
        require(_amount > 0, "Amount harus lebih dari 0");

        studentCredits[_id] += _amount;

        // Emit event
        emit CreditsAdded(_id, _amount, studentCredits[_id]);
    }
}
```

**Penjelasan:**
- `event StudentRegistered(...)` - deklarasi event (data apa yang dicatat)
- `indexed` - membuat parameter searchable (max 3 indexed parameters)
- `emit StudentRegistered(msg.sender, studentCounter, _name)` - trigger event
- Event disimpan di blockchain tapi TIDAK menghabiskan gas untuk dibaca
- Frontend dapat listen event secara real-time
- Digunakan untuk: logging, notifications, track history

**Coba:**
1. Deploy
2. Ketik "Budi" → Klik `registerStudent`
3. Lihat transaksi di console Remix
4. Klik "logs" → Lihat event StudentRegistered!
5. Ketik 1, 3 → Klik `addCredits`
6. Lihat event CreditsAdded di logs!

---

## 4.5 Solidity 105: Payable & Time-Based

Akhirnya, tambahkan uang (ETH) dan logic berbasis waktu!

### 1. Fungsi Payable

**Apa itu:** Keyword yang memungkinkan fungsi menerima ETH (msg.value)

**Mengapa penting:** Menerima pembayaran, donasi, hadiah. Tanpa ini, kirim ETH akan gagal

Buat `LearnPayable.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract LearnPayable {
    uint256 public studentCounter;
    mapping(uint256 => address) public studentOwner;

    // Fungsi payable dapat menerima ETH
    function registerStudent() public payable returns (uint256) {
        require(msg.value >= 0.001 ether, "Perlu 0.001 ETH untuk registrasi");

        studentCounter++;
        studentOwner[studentCounter] = msg.sender;

        return studentCounter;
    }

    // Cek saldo contract
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
```

**Penjelasan:**
- `payable` - keyword yang allow fungsi terima ETH
- `msg.value` - jumlah ETH yang dikirim dengan transaksi (dalam wei)
- `0.001 ether` - compiler convert ke wei (1 ether = 10^18 wei)
- `require(msg.value >= 0.001 ether)` - check minimum payment
- `address(this).balance` - saldo ETH contract
- Tanpa `payable`, kirim ETH akan gagal!

**Coba:**
1. Deploy
2. Di Remix, cari field "VALUE" (di atas tombol Deploy)
3. Masukkan 1 dan pilih milliether (= 0.001 ETH)
4. Klik `registerStudent` → Konfirmasi di MetaMask
5. Klik `getBalance` → Lihat 0.001 ETH di contract!

---

### 2. Mengirim ETH

**Apa itu:** Mengirim ETH dari contract ke alamat menggunakan `.call{value: amount}("")`

**Mengapa penting:** Membayar hadiah, refund, withdrawal. Selalu check success!

Buat `LearnSendETH.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract LearnSendETH {
    address public admin;
    mapping(address => uint256) public scholarships;

    constructor() {
        admin = msg.sender;
    }

    // Terima ETH untuk scholarship fund
    function deposit() public payable {}

    // Kirim scholarship ke student
    function sendScholarship(address _student, uint256 _amount) public {
        require(msg.sender == admin, "Hanya admin");
        require(address(this).balance >= _amount, "Saldo tidak cukup");

        // Kirim ETH
        (bool success, ) = _student.call{value: _amount}("");
        require(success, "Transfer gagal");

        scholarships[_student] += _amount;
    }

    // Cek saldo
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
```

**Penjelasan:**
- `function deposit() public payable {}` - terima ETH tanpa kode
- `_student.call{value: _amount}("")` - kirim ETH ke alamat
- `(bool success, ) = ...` - tangkap apakah transfer berhasil
- `require(success, "Transfer gagal")` - revert jika kirim gagal
- `.call` adalah cara modern dan aman untuk kirim ETH
- Cara lama: `.transfer()` dan `.send()` TIDAK recommended

**Coba:**
1. Deploy
2. Kirim ETH menggunakan `deposit` dengan field VALUE (misal: 10 milliether)
3. Klik `getBalance` → Lihat deposit Anda
4. Ketik alamat student dan amount (misal: 1000000000000000 = 0.001 ETH)
5. Klik `sendScholarship` → ETH terkirim!

---

### 3. Time-Based Logic

**Apa itu:** Menggunakan block timestamp untuk logic berbasis waktu

**Mengapa penting:** Untuk deadline, cooldown, durasi event, aging system

Buat `LearnTime.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract LearnTime {
    mapping(uint256 => uint256) public studentRegisteredTime;
    mapping(uint256 => uint256) public lastSubmission;

    uint256 public constant ASSIGNMENT_COOLDOWN = 1 days;

    function registerStudent(uint256 _id) public {
        studentRegisteredTime[_id] = block.timestamp;
    }

    // Check berapa lama sudah terdaftar (dalam detik)
    function getStudentAge(uint256 _id) public view returns (uint256) {
        require(studentRegisteredTime[_id] > 0, "Student belum terdaftar");
        return block.timestamp - studentRegisteredTime[_id];
    }

    // Submit assignment (max 1x per hari)
    function submitAssignment(uint256 _id) public {
        require(
            block.timestamp >= lastSubmission[_id] + ASSIGNMENT_COOLDOWN,
            "Harus tunggu 1 hari"
        );

        lastSubmission[_id] = block.timestamp;
    }

    // Check kapan bisa submit lagi
    function timeUntilNextSubmission(uint256 _id) public view returns (uint256) {
        if (lastSubmission[_id] == 0) {
            return 0; // Bisa submit sekarang
        }

        uint256 nextSubmissionTime = lastSubmission[_id] + ASSIGNMENT_COOLDOWN;

        if (block.timestamp >= nextSubmissionTime) {
            return 0; // Bisa submit sekarang
        }

        return nextSubmissionTime - block.timestamp;
    }
}
```

**Penjelasan:**
- `block.timestamp` - waktu block saat ini (Unix timestamp dalam detik)
- `1 days`, `1 hours`, `1 minutes` - time units
- `constant` - nilai tidak bisa diubah setelah di-set
- `studentRegisteredTime[_id] = block.timestamp` - catat waktu registrasi
- `block.timestamp - studentRegisteredTime[_id]` - hitung umur
- `block.timestamp >= lastSubmission[_id] + ASSIGNMENT_COOLDOWN` - cek cooldown
- ⚠️ Bisa dimanipulasi miner (±15 detik) - jangan untuk high-security timing!

**Coba:**
1. Deploy
2. Ketik 2101001 → `registerStudent`
3. Ketik 2101001 → `getStudentAge` → Lihat 0 (baru terdaftar)
4. Tunggu 1 menit → `getStudentAge` → Lihat ~60 detik
5. Ketik 2101001 → `submitAssignment` → BERHASIL
6. Langsung coba `submitAssignment` lagi → GAGAL "Harus tunggu 1 hari"
7. Ketik 2101001 → `timeUntilNextSubmission` → Lihat sisa waktu (dalam detik)

---

## 🏆 Final Challenge: EduLoan - Student Loan DApp

### Tentang Challenge Ini

<div style={{background:'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',borderRadius:'12px',padding:'24px',margin:'0 0 24px',color:'#fff'}}>
  <h3 style={{margin:'0 0 12px',fontSize:'20px',fontWeight:'700'}}>EduLoan: Decentralized Student Loan System</h3>
  <p style={{margin:'0 0 16px',fontSize:'14px',opacity:'0.95'}}>
    Bangun sistem pinjaman pendidikan terdesentralisasi di Mantle Network! Challenge ini menggabungkan semua konsep yang telah dipelajari untuk menciptakan solusi Real World Asset (RWA) yang nyata.
  </p>
  <div style={{display:'flex',gap:'12px',flexWrap:'wrap'}}>
    <span style={{background:'rgba(255,255,255,0.2)',padding:'6px 12px',borderRadius:'20px',fontSize:'12px'}}>💰 DeFi</span>
    <span style={{background:'rgba(255,255,255,0.2)',padding:'6px 12px',borderRadius:'20px',fontSize:'12px'}}>🏛️ RWA</span>
    <span style={{background:'rgba(255,255,255,0.2)',padding:'6px 12px',borderRadius:'20px',fontSize:'12px'}}>📚 Education</span>
    <span style={{background:'rgba(255,255,255,0.2)',padding:'6px 12px',borderRadius:'20px',fontSize:'12px'}}>⛓️ Mantle Network</span>
  </div>
</div>

### 📋 Deskripsi Challenge

**Latar Belakang:**
Banyak mahasiswa membutuhkan pinjaman untuk biaya pendidikan. Sistem pinjaman tradisional seringkali tidak transparan dan memiliki proses yang rumit. Dengan blockchain, kita bisa membuat sistem pinjaman yang:
- **Transparan** - Semua transaksi tercatat on-chain
- **Trustless** - Tidak perlu perantara
- **Efisien** - Proses otomatis via smart contract
- **Trackable** - Riwayat pembayaran jelas

**Misi Anda:**
Buat smart contract `EduLoan.sol` yang memungkinkan:
1. Mahasiswa mengajukan pinjaman pendidikan
2. Admin (kampus/lembaga) menyetujui/menolak pengajuan
3. Sistem tracking cicilan dan pembayaran
4. Penghitungan bunga sederhana
5. Deadline pembayaran dengan penalti

---

### 🔧 Spesifikasi Teknis

#### Data Structures

```solidity
// Status pinjaman
enum LoanStatus {
    Pending,    // 0: Menunggu approval
    Approved,   // 1: Disetujui, menunggu pencairan
    Active,     // 2: Sudah dicairkan, dalam masa cicilan
    Repaid,     // 3: Sudah lunas
    Defaulted   // 4: Gagal bayar (melewati deadline)
}

// Data pinjaman
struct Loan {
    uint256 loanId;
    address borrower;
    uint256 principalAmount;    // Jumlah pinjaman pokok
    uint256 interestRate;       // Bunga dalam basis points (100 = 1%)
    uint256 totalAmount;        // Total yang harus dibayar (pokok + bunga)
    uint256 amountRepaid;       // Jumlah yang sudah dibayar
    uint256 applicationTime;    // Waktu pengajuan
    uint256 approvalTime;       // Waktu disetujui
    uint256 deadline;           // Batas waktu pelunasan
    LoanStatus status;
    string purpose;             // Tujuan pinjaman (SPP, buku, dll)
}
```

#### State Variables yang Dibutuhkan

```solidity
address public admin;
uint256 public loanCounter;
uint256 public constant INTEREST_RATE = 500; // 5% dalam basis points
uint256 public constant LOAN_DURATION = 365 days;
uint256 public constant MIN_LOAN = 0.01 ether;
uint256 public constant MAX_LOAN = 10 ether;

mapping(uint256 => Loan) public loans;
mapping(address => uint256[]) public borrowerLoans;
```

#### Events yang Dibutuhkan

```solidity
event LoanApplied(uint256 indexed loanId, address indexed borrower, uint256 amount, string purpose);
event LoanApproved(uint256 indexed loanId, address indexed borrower, uint256 totalAmount);
event LoanRejected(uint256 indexed loanId, address indexed borrower, string reason);
event LoanDisbursed(uint256 indexed loanId, address indexed borrower, uint256 amount);
event PaymentMade(uint256 indexed loanId, address indexed borrower, uint256 amount, uint256 remaining);
event LoanRepaid(uint256 indexed loanId, address indexed borrower);
event LoanDefaulted(uint256 indexed loanId, address indexed borrower);
```

#### Functions yang Harus Dibuat

| Function | Akses | Deskripsi |
|----------|-------|-----------|
| `applyLoan(uint256 _amount, string memory _purpose)` | Public | Mahasiswa mengajukan pinjaman |
| `approveLoan(uint256 _loanId)` | Admin Only | Menyetujui pengajuan pinjaman |
| `rejectLoan(uint256 _loanId, string memory _reason)` | Admin Only | Menolak pengajuan pinjaman |
| `disburseLoan(uint256 _loanId)` | Admin Only, Payable | Mencairkan dana pinjaman |
| `makePayment(uint256 _loanId)` | Borrower Only, Payable | Membayar cicilan |
| `checkDefault(uint256 _loanId)` | Public | Cek dan update status default |
| `getLoanDetails(uint256 _loanId)` | View | Lihat detail pinjaman |
| `getMyLoans()` | View | Lihat semua pinjaman milik caller |
| `calculateInterest(uint256 _principal)` | Pure | Hitung bunga |
| `getRemainingAmount(uint256 _loanId)` | View | Lihat sisa yang harus dibayar |
| `depositFunds()` | Admin Only, Payable | Admin deposit dana ke contract |
| `getContractBalance()` | View | Lihat saldo contract |

#### Modifiers yang Dibutuhkan

```solidity
modifier onlyAdmin()
modifier onlyBorrower(uint256 _loanId)
modifier loanExists(uint256 _loanId)
modifier inStatus(uint256 _loanId, LoanStatus _status)
```

---

### 📝 Template Starter Code

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

/// @title EduLoan - Decentralized Student Loan System
/// @author [Nama Anda]
/// @notice Sistem pinjaman pendidikan terdesentralisasi di Mantle Network
/// @dev Challenge Final Mantle Co-Learning Camp

contract EduLoan {
    // ============================================
    // ENUMS & STRUCTS
    // ============================================

    enum LoanStatus {
        Pending,
        Approved,
        Active,
        Repaid,
        Defaulted
    }

    struct Loan {
        uint256 loanId;
        address borrower;
        uint256 principalAmount;
        uint256 interestRate;
        uint256 totalAmount;
        uint256 amountRepaid;
        uint256 applicationTime;
        uint256 approvalTime;
        uint256 deadline;
        LoanStatus status;
        string purpose;
    }

    // ============================================
    // STATE VARIABLES
    // ============================================

    // TODO: Deklarasikan state variables
    // Hint: admin, loanCounter, constants, mappings


    // ============================================
    // EVENTS
    // ============================================

    // TODO: Deklarasikan semua events


    // ============================================
    // MODIFIERS
    // ============================================

    // TODO: Buat modifiers (onlyAdmin, onlyBorrower, dll)


    // ============================================
    // CONSTRUCTOR
    // ============================================

    constructor() {
        // TODO: Set admin = msg.sender
    }

    // ============================================
    // MAIN FUNCTIONS
    // ============================================

    /// @notice Mahasiswa mengajukan pinjaman
    /// @param _amount Jumlah pinjaman yang diajukan
    /// @param _purpose Tujuan pinjaman
    function applyLoan(uint256 _amount, string memory _purpose) public {
        // TODO: Implementasi
        // 1. Validasi amount (MIN_LOAN <= amount <= MAX_LOAN)
        // 2. Increment loanCounter
        // 3. Hitung total dengan bunga
        // 4. Buat Loan struct baru
        // 5. Simpan di mapping
        // 6. Tambahkan loanId ke borrowerLoans
        // 7. Emit event
    }

    /// @notice Admin menyetujui pinjaman
    /// @param _loanId ID pinjaman yang disetujui
    function approveLoan(uint256 _loanId) public {
        // TODO: Implementasi
    }

    /// @notice Admin menolak pinjaman
    /// @param _loanId ID pinjaman yang ditolak
    /// @param _reason Alasan penolakan
    function rejectLoan(uint256 _loanId, string memory _reason) public {
        // TODO: Implementasi
    }

    /// @notice Admin mencairkan dana pinjaman
    /// @param _loanId ID pinjaman yang dicairkan
    function disburseLoan(uint256 _loanId) public {
        // TODO: Implementasi
        // 1. Validasi status = Approved
        // 2. Validasi contract balance cukup
        // 3. Transfer dana ke borrower
        // 4. Set deadline
        // 5. Update status ke Active
        // 6. Emit event
    }

    /// @notice Borrower membayar cicilan
    /// @param _loanId ID pinjaman
    function makePayment(uint256 _loanId) public payable {
        // TODO: Implementasi
        // 1. Validasi status = Active
        // 2. Validasi msg.value > 0
        // 3. Update amountRepaid
        // 4. Jika lunas, update status ke Repaid
        // 5. Emit event
    }

    /// @notice Cek apakah pinjaman sudah default
    /// @param _loanId ID pinjaman
    function checkDefault(uint256 _loanId) public {
        // TODO: Implementasi
        // Jika melewati deadline dan belum lunas, set status Defaulted
    }

    // ============================================
    // VIEW FUNCTIONS
    // ============================================

    /// @notice Lihat detail pinjaman
    function getLoanDetails(uint256 _loanId) public view returns (Loan memory) {
        // TODO: Implementasi
    }

    /// @notice Lihat semua pinjaman milik caller
    function getMyLoans() public view returns (uint256[] memory) {
        // TODO: Implementasi
    }

    /// @notice Hitung bunga dari principal
    function calculateInterest(uint256 _principal) public pure returns (uint256) {
        // TODO: Implementasi
        // Formula: (_principal * INTEREST_RATE) / 10000
    }

    /// @notice Lihat sisa yang harus dibayar
    function getRemainingAmount(uint256 _loanId) public view returns (uint256) {
        // TODO: Implementasi
    }

    /// @notice Lihat saldo contract
    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }

    // ============================================
    // ADMIN FUNCTIONS
    // ============================================

    /// @notice Admin deposit dana ke contract
    function depositFunds() public payable {
        // TODO: Implementasi (onlyAdmin)
    }

    /// @notice Admin withdraw dana dari contract
    function withdrawFunds(uint256 _amount) public {
        // TODO: Implementasi (onlyAdmin)
    }
}
```

---

### 📤 Cara Submit Challenge

#### Step 1: Buat Repository GitHub

1. Buat repository baru di GitHub dengan nama: `mantle-eduloan-[nama-anda]`
2. Struktur folder:
```
mantle-eduloan-[nama-anda]/
├── contracts/
│   └── EduLoan.sol
├── README.md
└── screenshots/
    ├── deploy.png
    ├── apply-loan.png
    ├── approve-loan.png
    └── payment.png
```

#### Step 2: Isi README.md

```markdown
# EduLoan - Mantle Co-Learning Camp Challenge

## Author
- Nama: [Nama Lengkap]
- GitHub: [username]
- Wallet: [address yang digunakan untuk deploy]

## Contract Address (Mantle Sepolia)
`0x...`

## Features Implemented
- [x] Apply Loan
- [x] Approve/Reject Loan
- [x] Disburse Loan
- [x] Make Payment
- [x] Check Default
- [ ] Bonus: [sebutkan jika ada]

## Screenshots
[Sertakan screenshots dari Remix]

## How to Test
1. Deploy contract di Mantle Sepolia
2. Admin deposit funds
3. User apply loan
4. Admin approve loan
5. Admin disburse loan
6. User make payment

## Lessons Learned
[Tulis apa yang Anda pelajari dari challenge ini]
```

#### Step 3: Submit di HackQuest

<div style={{background:'#E3F2FD',borderRadius:'8px',padding:'16px',margin:'16px 0'}}>
  <p style={{fontSize:'14px',fontWeight:'600',margin:'0 0 8px'}}>📝 Detail Submission HackQuest:</p>
  <ul style={{margin:'0',paddingLeft:'20px',fontSize:'13px'}}>
    <li><strong>Task Type:</strong> Link</li>
    <li><strong>Link:</strong> URL GitHub Repository Anda</li>
    <li><strong>Section:</strong> Belajar dengan HackQuest</li>
  </ul>
</div>

---

### 💡 Tips Mengerjakan Challenge

1. **Mulai dari yang simple** - Implementasi applyLoan dan getLoanDetails dulu
2. **Test setiap fungsi** - Jangan lanjut sebelum fungsi sebelumnya bekerja
3. **Gunakan Remix** - Deploy di Remix VM dulu sebelum ke Mantle Sepolia
4. **Baca error message** - Error Solidity biasanya informatif
5. **Cek gas** - Pastikan ada cukup MNT untuk deploy dan testing

### 🎓 Konsep yang Diuji

Challenge ini menguji pemahaman Anda tentang:
- ✅ Tipe data dasar (string, uint256, bool, address)
- ✅ Struct & Enum
- ✅ Mapping & Array
- ✅ Modifier & Access Control
- ✅ Events
- ✅ Payable Functions
- ✅ Time-based Logic
- ✅ Global Variables (msg.sender, msg.value, block.timestamp)

---

### 🏅 Rewards

Peserta yang berhasil menyelesaikan challenge akan mendapatkan:
- **Points** di HackQuest Community
- **Certificate of Completion** dari Mantle Co-Learning Camp
- **Networking** dengan komunitas Web3 Indonesia

### Tips Belajar Solidity

1. **Mulai dari yang sederhana** - Jangan langsung membuat contract kompleks
2. **Test setiap fungsi** - Pastikan setiap fungsi bekerja sebelum lanjut
3. **Baca error message** - Error message memberikan petunjuk masalah
4. **Practice, practice, practice** - Semakin banyak latihan, semakin paham
5. **Join komunitas** - Bergabung dengan [Discord ETHJKT](https://discord.gg/p5b6RFEnnk)

---

## Langkah Selanjutnya

Setelah menguasai basic Solidity, lanjut ke:
1. **Hardhat Development** - Professional development tools
2. **Token Standards** - ERC-20, ERC-721, ERC-1155
3. **DeFi Basics** - Memahami decentralized finance
4. **Security Best Practices** - Membuat contract yang aman

:::tip Terus Berlatih!
Smart contract development adalah skill yang butuh banyak practice. Mulai dengan project kecil dan tingkatkan kompleksitasnya secara bertahap.
:::

---

Ready to build on Ethereum! 🚀
