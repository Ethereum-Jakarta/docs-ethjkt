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
3. Tambahkan Sepolia Testnet:
   - Klik Networks → Add Network
   - Pilih Sepolia dari daftar

### 3. Dapatkan Test Token

1. Kunjungi [https://sepoliafaucet.com](https://sepoliafaucet.com)
2. Masukkan address wallet Anda
3. Tunggu token ETH masuk (untuk bayar gas fee)

### 4. Hubungkan Remix dengan MetaMask

1. Di Remix, klik tab **"Deploy & Run Transactions"**
2. Di bagian Environment, pilih **"Injected Provider - MetaMask"**
3. Pastikan MetaMask terhubung ke Sepolia Network

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

## Latihan dan Tips

### Latihan 1: Buat Simple Student Registry
Buat contract untuk registrasi mahasiswa sederhana:
- Mapping address ke nama
- Fungsi register
- Fungsi update nama
- Fungsi lihat nama berdasarkan address

### Latihan 2: Buat Grade System
Buat contract nilai mahasiswa:
- Mapping studentId ke nilai
- Fungsi tambah nilai
- Fungsi cek kelulusan (nilai >= 60)
- Event ketika nilai ditambahkan

### Latihan 3: Buat Scholarship System
Buat contract beasiswa:
- Payable function untuk donate ke scholarship fund
- Function untuk give scholarship ke student (hanya admin)
- Track total scholarship per student
- Event untuk setiap pemberian beasiswa

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
