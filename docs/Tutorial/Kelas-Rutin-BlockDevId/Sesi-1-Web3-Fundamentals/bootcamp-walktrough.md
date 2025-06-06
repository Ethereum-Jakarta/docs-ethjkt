---
id: sesi-1
title: "Deep Web3 Fundamentals & Infrastructure Setup"
sidebar_label: "#1 Deep Web3 Fundamentals & Infrastructure Setup"
sidebar_position: 1
description: "Pengantar konsep Web3, EVM, arsitektur wallet, dan setup lingkungan pengembangan untuk smart contract."
---

# Sesi 1: Deep Web3 Fundamentals & Infrastructure Setup

## Informasi Umum Sesi

**Tanggal**: Hari 1  
**Durasi Total**: 8 jam (08:00 - 16:30)  
**Tema Pembelajaran**: Fondasi Inti & Arsitektur Smart Contract  

Pada sesi ini, peserta akan membangun fondasi yang kuat dalam ekosistem Web3 dan menguasai peralatan pengembangan yang essential untuk pengembangan smart contract.

---

## Jadwal Harian Detail

| Waktu          | Aktivitas                           | Tujuan                                      | Materi & Fokus Utama                         |
|----------------|-------------------------------------|---------------------------------------------|-----------------------------------------------|
| 08:00 - 09:00  | Persiapan Pagi & Setup              | Persiapan teknis dan mental bootcamp       | Pengecekan hardware, verifikasi software, networking |
| 09:00 - 10:00  | Orientasi Peserta                   | Orientasi bootcamp dan ekspektasi          | Overview program, perkenalan, tanya jawab    |
| 10:00 - 11:00  | Kursus Pertama: Dasar-dasar Web3   | Membangun pemahaman dasar Web3             | Intro Web3, EVM, wallet, peralatan development |
| 11:00 - 12:00  | Tantangan Pertama                   | Praktik implementasi tools dan deployment  | Setup environment, wallet, deploy contract   |
| 12:00 - 13:30  | Waktu Istirahat                     | Istirahat makan siang & networking         | Istirahat dan diskusi informal               |
| 13:30 - 14:30  | Kursus Kedua: Dasar-dasar Solidity | Penguatan syntax Solidity                  | Tipe data, fungsi, struktur kontrol         |
| 14:30 - 16:00  | Tantangan Kedua: Contract Bertingkat| Implementasi kompleksitas progressif      | 3 tantangan dengan tingkat kesulitan meningkat |
| 16:00 - 16:30  | Sesi Evaluasi & Review              | Penilaian dan umpan balik                  | Review teknis, kuis, preview sesi berikutnya |

---

## Persiapan Pagi & Setup (08:00 - 09:00)

### Tujuan
Persiapan teknis dan mental untuk bootcamp intensif pengembangan Web3

### Aktivitas
- **Pengecekan Hardware & Software**: Verifikasi laptop, RAM, storage requirements
- **Test Konektivitas Internet**: Test kecepatan dan stabilitas untuk development
- **Verifikasi Lingkungan Development**: Pengecekan software yang sudah terinstal
- **Kopi Selamat Datang & Networking**: Perkenalan informal antar peserta

### Daftar Periksa Persiapan
- [ ] Laptop dengan minimal 8GB RAM dan 50GB storage kosong
- [ ] Koneksi internet minimal 10 Mbps
- [ ] Web browser dengan kemampuan extension MetaMask
- [ ] Code editor (VS Code direkomendasikan) terinstal
- [ ] Akses terminal/command line terverifikasi

---

## Orientasi Peserta (09:00 - 10:00)

### Tujuan
Orientasi bootcamp dan penetapan ekspektasi pembelajaran yang jelas

### Aktivitas

#### Overview Bootcamp & Tujuan Pembelajaran (15 menit)
- Struktur program Web3 Hacker House
- Roadmap pembelajaran 6 sesi
- Hasil yang diharapkan dan peluang karir
- Metodologi pembelajaran: teori + hands-on + tantangan

#### Perkenalan Peserta & Penilaian Latar Belakang (30 menit)
- Perkenalan diri: nama, latar belakang, tingkat pengalaman Web3
- Penilaian pengalaman programming
- Berbagi tujuan pembelajaran personal
- Pembentukan tim untuk pembelajaran kolaboratif

#### Penjelasan Metodologi Pembelajaran (10 menit)
- Siklus Kursus → Tantangan → Review
- Pendekatan kesulitan bertingkat
- Budaya peer learning dan code review
- Membangun dokumentasi dan portfolio

#### Sesi Tanya Jawab (5 menit)
- Pertanyaan tentang struktur program
- Klarifikasi mengenai ekspektasi
- Konfirmasi persyaratan teknis

---

## Kursus Pertama: Dasar-dasar Web3 & Infrastructure (10:00 - 11:00)

### Tujuan
Membangun pemahaman dasar tentang ekosistem Web3 dan infrastructure development

### Pengantar Web3 (15 menit)

#### Konsep Desentralisasi
```
Web1 (Baca)    →    Web2 (Baca-Tulis)    →    Web3 (Baca-Tulis-Miliki)
Situs Statis         Platform Sosial             Aplikasi Terdesentralisasi
```

**Perbedaan Kunci**:
- **Web2**: Platform memiliki data dan konten Anda
- **Web3**: Anda memiliki data, identitas, dan aset digital Anda
- **Desentralisasi**: Tidak ada satu titik kontrol atau kegagalan

#### Dasar-dasar Blockchain
- **Distributed Ledger**: Data direplikasi di multiple nodes
- **Immutability**: Catatan historis tidak dapat diubah
- **Transparansi**: Semua transaksi dapat diverifikasi publik
- **Konsensus**: Kesepakatan jaringan tanpa otoritas pusat

### Arsitektur EVM (15 menit)

#### Overview Ethereum Virtual Machine
- **World Computer**: Platform komputasi terdesentralisasi
- **Smart Contracts**: Kode yang mengeksekusi diri dengan logika bisnis
- **Sistem Gas**: Penetapan harga sumber daya untuk pekerjaan komputasi
- **State Machine**: Transisi state global melalui transaksi

#### Siklus Hidup Transaksi
```
Transaksi Dibuat → Ditandatangani → Disiarkan → Divalidasi → Dimasukkan ke Blok → Dikonfirmasi
```

#### Mekanika Gas
- **Gas Limit**: Maksimum pekerjaan komputasi yang diizinkan
- **Gas Price**: Harga per unit komputasi (dalam Gwei)
- **Biaya Transaksi**: Gas Used × Gas Price

### Arsitektur Wallet (15 menit)

#### Jenis-jenis Akun
**Externally Owned Account (EOA)**:
- Dikontrol oleh private key
- Dapat memulai transaksi
- Alamat 20-byte yang diturunkan dari public key

**Smart Contract Account**:
- Dikontrol oleh kode kontrak
- Tidak dapat memulai transaksi secara independen
- Dapat menampung dana dan mengeksekusi logika kompleks

#### Fondasi Kriptografi
```
Private Key (256-bit) → Public Key (ECDSA) → Alamat Ethereum (20 bytes)
```

#### Keamanan Wallet
- **Seed Phrase**: 12/24 kata untuk pemulihan wallet
- **Hardware Wallets**: Private key disimpan offline
- **Jangan pernah berbagi private key**: Kontrol penuh atas dana

### Setup Peralatan Development (15 menit)

#### Overview Peralatan Essential
- **Node.js**: Runtime JavaScript untuk peralatan development
- **Hardhat**: Framework pengembangan smart contract
- **Foundry**: Toolkit pengembangan alternatif (advanced)
- **GitHub**: Version control dan kolaborasi
- **Alchemy**: Penyedia infrastructure blockchain

#### Demo Setup Cepat
```bash
# Instalasi Node.js
node --version
npm --version

# Inisialisasi proyek
mkdir proyek-web3 && cd proyek-web3
npm init -y

# Instalasi Hardhat
npm install --save-dev hardhat
npx hardhat
```

#### Target Blockchain Networks
Dalam bootcamp ini, kita akan fokus pada 3 blockchain utama:
- **Sepolia Testnet**: Ethereum testnet utama untuk development
- **Monad Testnet**: High-performance blockchain dengan EVM compatibility  
- **Scroll Testnet**: Zero-Knowledge (ZK) rollup solution untuk scalability

---

## Tantangan Pertama (11:00 - 12:00)

### Tujuan
Praktik langsung implementasi tools dan deployment contract pertama

### Tugas Tantangan

#### Setup Infrastructure (15 menit)
**Objective**: Menyelesaikan konfigurasi lingkungan pengembangan
**Tugas**:
- Instalasi Node.js dan npm
- Setup proyek Hardhat baru
- Konfigurasi file `.env` dengan API keys
- Verifikasi semua dependencies terinstal dengan benar

#### Pembuatan Wallet (10 menit)
**Objective**: Setup MetaMask dan konfigurasi testnet
**Tugas**:
- Instalasi MetaMask browser extension
- Membuat wallet baru atau import existing
- Menambahkan Sepolia testnet ke MetaMask
- Mendapatkan testnet ETH dari Sepolia faucet

#### Optimasi Text Editor (10 menit)
**Objective**: Setup VS Code dengan extension Solidity
**Tugas**:
- Instalasi VS Code Solidity extension
- Konfigurasi syntax highlighting
- Setup auto-completion untuk Solidity
- Test dengan membuka file `.sol`

#### Deployment Contract (20 menit)
**Objective**: Deploy dan test simple "Hello World" contract
**Tugas**:
- Buat contract `HelloWorld.sol`
- Tulis script deployment sederhana
- Deploy ke Sepolia testnet
- Verifikasi deployment berhasil

#### Proses Verifikasi (5 menit)
**Objective**: Verifikasi contract di block explorer
**Tugas**:
- Copy alamat contract dari deployment
- Buka Sepolia Etherscan
- Verifikasi contract source code
- Test interaksi melalui Etherscan interface

### Kriteria Keberhasilan
- ✅ Semua tools terinstal dan terkonfigurasi dengan benar
- ✅ Berhasil deploy contract ke Sepolia testnet
- ✅ Contract terverifikasi dan dapat dilihat di Sepolia Etherscan
- ✅ Mendemonstrasikan pemahaman dasar transaksi

### Network Configuration untuk Development

#### Sepolia Testnet Setup
```javascript
// hardhat.config.js
module.exports = {
  networks: {
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [PRIVATE_KEY],
      chainId: 11155111,
      gasPrice: 20000000000, // 20 gwei
    }
  }
};
```

#### MetaMask Network Configuration
**Sepolia Testnet Details**:
- Network Name: Sepolia
- RPC URL: `https://sepolia.infura.io/v3/YOUR-PROJECT-ID`
- Chain ID: 11155111
- Currency Symbol: ETH
- Block Explorer: `https://sepolia.etherscan.io`

#### Faucet Resources
- **Sepolia ETH Faucet**: `https://sepoliafaucet.com/`
- **Alchemy Sepolia Faucet**: `https://sepoliafaucet.net/`
- **Alternative Faucet**: `https://faucet.sepolia.dev/`

### Contoh Contract HelloWorld

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract HelloWorld {
    string public message;
    address public owner;
    
    constructor(string memory _message) {
        message = _message;
        owner = msg.sender;
    }
    
    function updateMessage(string memory _newMessage) public {
        require(msg.sender == owner, "Hanya owner yang dapat mengupdate");
        message = _newMessage;
    }
    
    function getMessage() public view returns (string memory) {
        return message;
    }
}
```

---

## Waktu Istirahat (12:00 - 13:30)

### Aktivitas
- Istirahat makan siang
- Networking informal antar peserta
- Diskusi bebas tentang pengalaman tantangan pertama
- Troubleshooting issues bersama mentor

---

## Kursus Kedua: Dasar-dasar Solidity (13:30 - 14:30)

### Tujuan
Penguatan fundamental syntax Solidity untuk development

### Struktur Pembelajaran (4 × 15 menit)

#### Blok 1: Tipe Data & Variabel (15 menit)

**Primitive Types**:
```solidity
// Tipe data numerik
uint256 public angkaPositif = 100;
int256 public angkaBertanda = -50;
bool public statusAktif = true;

// Tipe data alamat dan string
address public owner = 0x1234...;
string public nama = "Web3 Bootcamp";
bytes32 public hash = 0xabcd...;
```

**Variable Scopes**:
- **State Variables**: Disimpan di blockchain storage
- **Local Variables**: Temporary dalam function execution
- **Global Variables**: `msg.sender`, `block.timestamp`, `tx.origin`

**Visibility Modifiers**:
- `public`: Dapat diakses dari mana saja
- `private`: Hanya dalam contract yang sama
- `internal`: Contract dan turunannya
- `external`: Hanya dari luar contract

#### Blok 2: Fungsi & Modifier (15 menit)

**Function Syntax**:
```solidity
function namaFungsi(uint256 _parameter) 
    public 
    view 
    returns (uint256) 
{
    return _parameter * 2;
}
```

**Function Modifiers**:
- `view`: Membaca state tanpa mengubah
- `pure`: Tidak membaca atau mengubah state
- `payable`: Dapat menerima Ether

**Custom Modifiers**:
```solidity
modifier onlyOwner() {
    require(msg.sender == owner, "Hanya owner");
    _;
}

function fungsiKhusus() public onlyOwner {
    // Logika fungsi
}
```

**Error Handling**:
- `require()`: Validasi input dan kondisi
- `assert()`: Internal error checking
- `revert()`: Manual error dengan pesan

#### Blok 3: Struktur Kontrol & Events (15 menit)

**Conditional Statements**:
```solidity
if (saldo >= amount) {
    // Transfer berhasil
} else {
    revert("Saldo tidak cukup");
}
```

**Loops**:
```solidity
// For loop
for (uint i = 0; i < array.length; i++) {
    // Process array[i]
}

// While loop
while (kondisi) {
    // Process
}
```

**Event Definition & Emission**:
```solidity
event Transfer(
    address indexed from, 
    address indexed to, 
    uint256 amount
);

function transfer(address to, uint256 amount) public {
    // Transfer logic
    emit Transfer(msg.sender, to, amount);
}
```

#### Blok 4: Arrays, Mappings & Structs (15 menit)

**Arrays**:
```solidity
// Dynamic array
uint256[] public dynamicArray;

// Fixed array
uint256[10] public fixedArray;

// Array operations
function addElement(uint256 _value) public {
    dynamicArray.push(_value);
}
```

**Mappings**:
```solidity
// Key-value storage
mapping(address => uint256) public balances;
mapping(address => mapping(address => uint256)) public allowances;

function getBalance(address user) public view returns (uint256) {
    return balances[user];
}
```

**Structs**:
```solidity
struct Student {
    string name;
    uint256 id;
    uint256 grade;
    bool isActive;
}

mapping(uint256 => Student) public students;

function addStudent(
    uint256 _id, 
    string memory _name
) public {
    students[_id] = Student(_name, _id, 0, true);
}
```

---

## Tantangan Kedua: Progressive Smart Contracts (14:30 - 16:00)

### Tujuan
Implementasi kompleksitas progressive dalam pengembangan smart contract

### Tema Cerita: "Membangun Ekosistem Digital Kampus"

#### Tantangan 1 (30 menit): Digital Wallet Kampus

**Objective**: Membuat sistem digital wallet kampus yang aman
**Features yang dibutuhkan**:
- Deposit ETH ke wallet kampus
- Cek saldo mahasiswa
- Withdraw dana dengan approval
- Transfer antar mahasiswa

**Focus Pembelajaran**: Struktur contract dasar, payable functions, access control

**Template Contract**:
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract DigitalWalletKampus {
    mapping(address => uint256) public balances;
    address public admin;
    
    event Deposit(address indexed user, uint256 amount);
    event Withdrawal(address indexed user, uint256 amount);
    event Transfer(address indexed from, address indexed to, uint256 amount);
    
    constructor() {
        admin = msg.sender;
    }
    
    function deposit() public payable {
        require(msg.value > 0, "Amount harus lebih dari 0");
        balances[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }
    
    // TODO: Implementasikan withdraw function
    // TODO: Implementasikan transfer function
    // TODO: Tambahkan access control
}
```

#### Tantangan 2 (30 menit): Sistem Akademik Blockchain

**Objective**: Membangun sistem registry mahasiswa yang tamper-proof
**Features yang dibutuhkan**:
- Enrollment mahasiswa baru
- Management nilai mahasiswa
- Retrieval data akademik
- Validasi status mahasiswa

**Focus Pembelajaran**: Structs, mappings, arrays, penanganan data kompleks

**Template Contract**:
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract SistemAkademik {
    struct Mahasiswa {
        string nama;
        uint256 nim;
        string jurusan;
        uint256[] nilai;
        bool isActive;
    }
    
    mapping(uint256 => Mahasiswa) public mahasiswa;
    mapping(address => bool) public authorized;
    uint256[] public daftarNIM;
    
    event MahasiswaEnrolled(uint256 nim, string nama);
    event NilaiAdded(uint256 nim, uint256 nilai);
    
    modifier onlyAuthorized() {
        require(authorized[msg.sender], "Tidak memiliki akses");
        _;
    }
    
    constructor() {
        authorized[msg.sender] = true;
    }
    
    // TODO: Implementasikan enrollment function
    // TODO: Implementasikan add grade function
    // TODO: Implementasikan get student info function
}
```

#### Tantangan 3 (30 menit): Pemilihan Ketua BEM Digital

**Objective**: Mengembangkan sistem voting yang transparan
**Features yang dibutuhkan**:
- Management kandidat
- Sistem voting yang aman
- Kalkulasi hasil real-time
- Time-based controls

**Focus Pembelajaran**: Advanced logic, time-based controls, security patterns

**Template Contract**:
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract PemilihanBEM {
    struct Kandidat {
        string nama;
        string visi;
        uint256 suara;
    }
    
    Kandidat[] public kandidat;
    mapping(address => bool) public sudahMemilih;
    mapping(address => bool) public pemilihTerdaftar;
    
    uint256 public waktuMulai;
    uint256 public waktuSelesai;
    address public admin;
    
    event VoteCasted(address indexed voter, uint256 kandidatIndex);
    event KandidatAdded(string nama);
    
    modifier onlyDuringVoting() {
        require(
            block.timestamp >= waktuMulai && 
            block.timestamp <= waktuSelesai, 
            "Voting belum dimulai atau sudah selesai"
        );
        _;
    }
    
    // TODO: Implementasikan add candidate function
    // TODO: Implementasikan vote function
    // TODO: Implementasikan get results function
}
```

### Progressive Difficulty

**Level 1**: Implementasi fungsionalitas dasar
- Basic function implementation
- Simple state management
- Basic event emission

**Level 2**: Management struktur data kompleks
- Complex data structure handling
- Multiple mapping interactions
- Array operations

**Level 3**: Implementasi security dan logic advanced
- Time-based access control
- Complex business logic
- Security pattern implementation
- Gas optimization considerations

---

## Sesi Evaluasi & Review (16:00 - 16:30)

### Tujuan
Assessment dan feedback untuk continuous improvement

### Aktivitas Evaluasi

#### Technical Assessment (10 menit)
**Review fungsionalitas contract**:
- Compilation berhasil tanpa error
- Deployment ke testnet sukses
- Basic functionality bekerja dengan benar
- Event emission sesuai ekspektasi

#### Code Quality Review (5 menit)
**Pengecekan implementasi best practices**:
- Naming convention yang consistent
- Proper visibility modifiers
- Error handling yang tepat
- Gas efficiency considerations

#### Problem-Solving Evaluation (5 menit)
**Analisis penyelesaian tantangan**:
- Approach yang digunakan untuk solve problems
- Debugging skills demonstration
- Creativity dalam implementation
- Time management selama challenges

#### Knowledge Check (5 menit)
**Kuis cepat konsep fundamental**:

1. **Apa perbedaan utama antara Web2 dan Web3?**
2. **Sebutkan 3 jenis visibility modifier dalam Solidity**
3. **Apa fungsi gas dalam Ethereum?**
4. **Kapan menggunakan `view` vs `pure` function?**
5. **Bagaimana cara emit event dalam smart contract?**

#### Peer Review (Bonus)
**Sesi review kode antar peserta**:
- Code review session antar tim
- Sharing best practices yang ditemukan
- Diskusi alternative approaches
- Collaborative learning reinforcement

### Instructor Feedback

#### Individual Feedback
- **Strengths**: Apa yang sudah dikuasai dengan baik
- **Areas for Improvement**: Fokus pembelajaran selanjutnya
- **Specific Recommendations**: Action items untuk self-study

#### Group Feedback
- **Overall Performance**: Performa grup secara keseluruhan
- **Common Challenges**: Issues yang dihadapi banyak peserta
- **Collaboration Quality**: Kualitas teamwork dan peer support

### Next Session Preview

#### Sesi 2: Smart Contract Modular Architecture
**Yang akan dipelajari**:
- Advanced Solidity patterns
- ERC standards implementation
- Contract inheritance dan composition
- Proxy patterns untuk upgradeable contracts

**Persiapan yang dibutuhkan**:
- Complete unfinished deliverables dari Sesi 1
- Review ERC-20 dan ERC-721 standards
- Practice dengan more complex Solidity syntax
- Setup multiple testnet accounts untuk testing
- Familiarize dengan Monad dan Scroll testnet (untuk sesi mendatang)

---

## Deliverables

### Deliverables Wajib

**✅ 1. Tiga Smart Contract yang Berfungsi**
- HelloWorld contract (dari Tantangan 1)
- Digital Wallet Kampus contract 
- Sistem Akademik atau Pemilihan BEM contract
- Semua deployed ke Sepolia testnet dengan verification

**✅ 2. Repository GitHub dengan Dokumentasi**
- Clean code structure dengan proper organization
- README dengan setup instructions
- Deployment addresses dan transaction hashes
- Code comments dalam Bahasa Indonesia

**✅ 3. Penyelesaian Assessment Pemahaman**
- Knowledge check quiz completed
- Technical assessment passed
- Code quality review feedback addressed

**✅ 4. Submission Refleksi Pembelajaran Personal**
- Apa yang dipelajari hari ini
- Challenges yang dihadapi dan cara mengatasinya
- Goals untuk sesi berikutnya
- Areas yang perlu diperdalam

### Format Submission

**GitHub Repository Structure**:
```
sesi-1-web3-fundamentals/
├── contracts/
│   ├── HelloWorld.sol
│   ├── DigitalWalletKampus.sol
│   └── SistemAkademik.sol (atau PemilihanBEM.sol)
├── scripts/
│   ├── deploy.js
│   └── interact.js
├── test/
│   └── basic-tests.js
├── deployments/
│   └── sepolia-addresses.json
├── README.md
└── REFLEKSI.md
```

**Deadline Submission**: Sebelum Sesi 2 dimulai (hari berikutnya)

---

## Resources & Referensi

### Dokumentasi Essential
- [Ethereum Development Documentation](https://ethereum.org/id/developers/)
- [Solidity Language Guide](https://docs.soliditylang.org/)
- [Hardhat Documentation](https://hardhat.org/docs)
- [MetaMask User Guide](https://docs.metamask.io/)

### Tools yang Digunakan
- [Remix IDE](https://remix.ethereum.org/) - Browser-based Solidity IDE
- [Sepolia Etherscan](https://sepolia.etherscan.io/) - Testnet block explorer
- [Sepolia Faucet](https://sepoliafaucet.com/) - Gratis testnet ETH
- [VS Code](https://code.visualstudio.com/) - Code editor

### Komunitas & Support
- Discord channel bootcamp untuk tanya jawab
- Stack Overflow untuk technical questions
- Ethereum Stack Exchange untuk blockchain-specific questions

---

## Kesimpulan Sesi 1

🎉 **Selamat!** Anda telah berhasil menyelesaikan Sesi 1 dari Web3 Hacker House Bootcamp.

**Pencapaian Hari Ini**:
- ✨ Memahami fundamental Web3 dan blockchain technology
- 🛠️ Setup complete development environment
- 🚀 Deploy smart contract pertama ke testnet  
- 💻 Membangun 3 contract dengan complexity bertingkat
- 📚 Menguasai basic Solidity syntax dan patterns

**Foundation yang telah dibangun hari ini** adalah stepping stone untuk journey pengembangan Web3 Anda. Setiap konsep yang dipelajari dan setiap baris kode yang ditulis adalah investasi dalam skill masa depan.

**Ingat**: Pengembangan Web3 adalah marathon, bukan sprint. Focus pada pemahaman fundamental dengan baik sebelum moving ke topik advanced.

**Sesi berikutnya akan build upon foundation ini** dengan patterns Solidity yang lebih advanced dan konsep modular architecture.

**Terus berlatih, tetap curious, dan sampai jumpa di Sesi 2! 🚀**

---

*"Setiap expert dulunya adalah beginner. Setiap professional dulunya adalah amateur. Setiap ikon dulunya adalah unknown."*