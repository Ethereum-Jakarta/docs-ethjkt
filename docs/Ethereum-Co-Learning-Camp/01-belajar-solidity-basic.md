---
id: belajar-solidity-basic
title: Belajar Solidity Basic - Step by Step
sidebar_position: 1
---

# Belajar Solidity Basic - Step by Step

Dalam tutorial ini, kita akan belajar Solidity step-by-step dari yang paling dasar. Setiap konsep akan dijelaskan satu per satu dengan contoh sederhana.

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

## Solidity 101: Mengenal Tipe Data

Mari kita mulai dengan memahami tipe data dasar di Solidity satu per satu.

### 1. Tipe Data String

**String** digunakan untuk menyimpan teks.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract BelajarString {
    // Variabel string untuk menyimpan nama
    string public nama;

    // Constructor untuk mengisi nilai awal
    constructor() {
        nama = "Budi Santoso";
    }

    // Fungsi untuk mengubah nama
    function ubahNama(string memory _namaBaru) public {
        nama = _namaBaru;
    }
}
```

**Penjelasan:**
- `string public nama` = membuat variabel string bernama "nama" yang bisa dibaca orang lain
- `constructor()` = fungsi yang jalan sekali saat kontrak dibuat
- `string memory _namaBaru` = parameter input bertipe string

### 2. Tipe Data Number (uint256)

**uint256** digunakan untuk menyimpan angka positif (0 sampai sangat besar).

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract BelajarNumber {
    // Variabel untuk menyimpan angka
    uint256 public angka;
    uint256 public umur;

    constructor() {
        angka = 100;
        umur = 20;
    }

    // Fungsi untuk mengubah angka
    function ubahAngka(uint256 _angkaBaru) public {
        angka = _angkaBaru;
    }

    // Fungsi untuk menambah umur
    function tambahUmur() public {
        umur = umur + 1;
        // atau bisa ditulis: umur++;
    }
}
```

**Penjelasan:**
- `uint256` = tipe data angka dari 0 sampai 2^256-1
- `angka = 100` = mengisi nilai ke variabel angka
- `umur++` = cara singkat untuk umur = umur + 1

### 3. Tipe Data Boolean

**Boolean** hanya punya 2 nilai: `true` atau `false`.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract BelajarBoolean {
    // Variabel boolean untuk status
    bool public statusAktif;
    bool public sudahLulus;

    constructor() {
        statusAktif = true;
        sudahLulus = false;
    }

    // Fungsi untuk mengubah status
    function ubahStatus(bool _status) public {
        statusAktif = _status;
    }

    // Fungsi untuk lulus
    function setLulus() public {
        sudahLulus = true;
    }
}
```

**Penjelasan:**
- `bool` = tipe data yang cuma bisa `true` atau `false`
- `statusAktif = true` = mengisi nilai true
- Berguna untuk menyimpan status ya/tidak

### 4. Gabungkan Semua Tipe Data

Sekarang kita gabungkan semua tipe data dalam satu kontrak sederhana:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract DataPengguna {
    // Variabel untuk menyimpan data pengguna
    string public nama;
    uint256 public umur;
    string public alamat;
    bool public statusAktif;

    // Constructor untuk mengisi data awal
    constructor() {
        nama = "Budi Santoso";
        umur = 25;
        alamat = "Jakarta";
        statusAktif = true;
    }

    // Fungsi untuk mengubah nama
    function ubahNama(string memory _nama) public {
        nama = _nama;
    }

    // Fungsi untuk mengubah umur
    function ubahUmur(uint256 _umur) public {
        umur = _umur;
    }

    // Fungsi untuk mengubah alamat
    function ubahAlamat(string memory _alamat) public {
        alamat = _alamat;
    }

    // Fungsi untuk mengubah status
    function ubahStatus(bool _status) public {
        statusAktif = _status;
    }
}
```

**Cara menggunakan:**
1. Copy kode di atas ke Remix
2. Compile dengan tombol "Compile"
3. Deploy dengan tombol "Deploy"
4. Coba panggil fungsi-fungsi yang ada

---

## Solidity 102: Mapping dan Fungsi

### 1. Mengenal Mapping

**Mapping** adalah seperti kamus atau daftar telepon - kita bisa cari data berdasarkan kunci tertentu.

#### Mapping Sederhana

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract BelajarMapping {
    // Mapping dari ID ke Nama
    mapping(uint256 => string) public idKeNama;

    // Fungsi untuk menambah data
    function tambahPengguna(uint256 _id, string memory _nama) public {
        idKeNama[_id] = _nama;
    }

    // Fungsi untuk mengambil nama berdasarkan ID
    function getNama(uint256 _id) public view returns (string memory) {
        return idKeNama[_id];
    }
}
```

**Penjelasan:**
- `mapping(uint256 => string)` = kamus dari angka ID ke nama
- `idKeNama[1] = "Budi"` = mengisi data
- `idKeNama[1]` = mengambil data

#### Mapping untuk Menyimpan Saldo

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract SaldoPengguna {
    // Mapping dari address ke saldo
    mapping(address => uint256) public saldo;

    // Fungsi untuk tambah saldo
    function tambahSaldo(uint256 _jumlah) public {
        saldo[msg.sender] = saldo[msg.sender] + _jumlah;
    }

    // Fungsi untuk cek saldo
    function cekSaldo() public view returns (uint256) {
        return saldo[msg.sender];
    }
}
```

**Penjelasan:**
- `msg.sender` = address yang memanggil fungsi
- Kita bisa simpan saldo setiap address yang berbeda

### 2. Fungsi dan Parameter

Mari pelajari cara membuat fungsi yang lebih baik:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract BelajarFungsi {
    uint256 public totalPengguna = 0;
    mapping(uint256 => string) public daftarPengguna;

    // Fungsi dengan parameter
    function tambahPengguna(uint256 _id, string memory _nama) public {
        daftarPengguna[_id] = _nama;
        totalPengguna = totalPengguna + 1;
    }

    // Fungsi tanpa parameter
    function resetTotal() public {
        totalPengguna = 0;
    }

    // Fungsi yang mengembalikan nilai (returns)
    function hitungPengguna() public view returns (uint256) {
        return totalPengguna;
    }

    // Fungsi dengan multiple parameter
    function cekDataLengkap(
        string memory _nama,
        uint256 _id,
        uint256 _umur
    ) public pure returns (bool) {
        // Cek apakah data lengkap
        if (bytes(_nama).length > 0 && _id > 0 && _umur > 17) {
            return true;
        } else {
            return false;
        }
    }
}
```

**Penjelasan Jenis Fungsi:**
- `public` = bisa dipanggil dari luar kontrak
- `view` = hanya membaca data, tidak mengubah
- `pure` = tidak membaca dan tidak mengubah data
- `returns` = fungsi mengembalikan nilai

---

## Solidity 103: Struct dan Array

### 1. Mengenal Struct

**Struct** adalah cara untuk mengelompokkan beberapa data jadi satu.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract BelajarStruct {
    // Buat struct untuk data pengguna
    struct Pengguna {
        string nama;
        uint256 id;
        uint256 umur;
        bool aktif;
    }

    // Variabel dengan tipe struct
    Pengguna public penggunaPertama;

    // Fungsi untuk mengisi data struct
    function isiDataPengguna() public {
        penggunaPertama = Pengguna({
            nama: "Budi Santoso",
            id: 1,
            umur: 20,
            aktif: true
        });
    }

    // Fungsi untuk mengubah nama saja
    function ubahNama(string memory _namaBaru) public {
        penggunaPertama.nama = _namaBaru;
    }
}
```

**Penjelasan:**
- `struct Pengguna { ... }` = membuat template data pengguna
- `Pengguna public penggunaPertama` = membuat variabel dengan tipe struct
- `penggunaPertama.nama` = mengakses bagian tertentu dari struct

### 2. Mapping dengan Struct

Sekarang kita gabungkan Mapping dengan Struct:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract DataBanyakPengguna {
    // Struct untuk data pengguna
    struct Pengguna {
        string nama;
        string email;
        uint256 umur;
        bool aktif;
    }

    // Mapping dari ID ke data pengguna
    mapping(uint256 => Pengguna) public daftarPengguna;

    // Fungsi untuk tambah pengguna baru
    function tambahPengguna(
        uint256 _id,
        string memory _nama,
        string memory _email,
        uint256 _umur
    ) public {
        daftarPengguna[_id] = Pengguna({
            nama: _nama,
            email: _email,
            umur: _umur,
            aktif: true
        });
    }

    // Fungsi untuk nonaktifkan pengguna
    function nonaktifkanPengguna(uint256 _id) public {
        daftarPengguna[_id].aktif = false;
    }
}
```

### 3. Mengenal Array

**Array** adalah daftar atau list yang bisa menyimpan banyak data dengan tipe yang sama.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract BelajarArray {
    // Array untuk menyimpan daftar ID
    uint256[] public daftarID;

    // Array untuk menyimpan nama-nama pengguna
    string[] public daftarNama;

    // Fungsi untuk tambah ID ke array
    function tambahID(uint256 _id) public {
        daftarID.push(_id);
    }

    // Fungsi untuk tambah nama ke array
    function tambahNama(string memory _nama) public {
        daftarNama.push(_nama);
    }

    // Fungsi untuk melihat berapa banyak data
    function jumlahPengguna() public view returns (uint256) {
        return daftarID.length;
    }

    // Fungsi untuk mengambil ID berdasarkan urutan
    function getIDUrutan(uint256 _index) public view returns (uint256) {
        return daftarID[_index];
    }

    // Fungsi untuk mengambil semua ID
    function getAllID() public view returns (uint256[] memory) {
        return daftarID;
    }
}
```

**Penjelasan:**
- `uint256[] public daftarID` = array untuk menyimpan banyak angka ID
- `daftarID.push(_id)` = menambah data ke array
- `daftarID.length` = menghitung jumlah data dalam array
- `daftarID[0]` = mengambil data urutan pertama (dimulai dari 0)

### 4. Gabungkan Struct, Mapping, dan Array

Mari buat sistem yang lebih lengkap:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract SistemPengguna {
    // Struct untuk data pengguna
    struct Pengguna {
        string nama;
        string email;
        bool aktif;
    }

    // Mapping untuk menyimpan data detail pengguna
    mapping(uint256 => Pengguna) public dataPengguna;

    // Array untuk menyimpan daftar semua ID yang terdaftar
    uint256[] public semuaID;

    // Fungsi untuk daftar pengguna baru
    function daftarPengguna(
        uint256 _id,
        string memory _nama,
        string memory _email
    ) public {
        // Simpan data ke mapping
        dataPengguna[_id] = Pengguna({
            nama: _nama,
            email: _email,
            aktif: true
        });

        // Tambah ID ke array
        semuaID.push(_id);
    }

    // Fungsi untuk melihat total pengguna
    function totalPengguna() public view returns (uint256) {
        return semuaID.length;
    }

    // Fungsi untuk melihat pengguna ke-berapa
    function getPenggunaKe(uint256 _urutan) public view returns (
        uint256 id,
        string memory nama,
        string memory email,
        bool aktif
    ) {
        uint256 id_pengguna = semuaID[_urutan];
        Pengguna memory usr = dataPengguna[id_pengguna];

        return (id_pengguna, usr.nama, usr.email, usr.aktif);
    }

    // Fungsi untuk nonaktifkan pengguna
    function nonaktifkanPengguna(uint256 _id) public {
        dataPengguna[_id].aktif = false;
    }
}
```

**Penjelasan:**
- Kita pakai Mapping untuk simpan data detail pengguna
- Kita pakai Array untuk track semua ID yang terdaftar
- Dengan kombinasi ini, kita bisa akses data dengan 2 cara:
  - Berdasarkan ID (lewat mapping)
  - Berdasarkan urutan (lewat array)

---

## Solidity 103: Flow Control, Enum, dan Events

### 1. Flow Control (if-else, for loops)

**Flow Control** mengatur alur eksekusi program berdasarkan kondisi.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract FlowControl {
    // Function dengan if-else
    function cekNilai(uint256 _nilai) public pure returns (string memory) {
        if (_nilai >= 80) {
            return "A - Sangat Baik";
        } else if (_nilai >= 70) {
            return "B - Baik";
        } else if (_nilai >= 60) {
            return "C - Cukup";
        } else if (_nilai >= 50) {
            return "D - Kurang";
        } else {
            return "E - Gagal";
        }
    }

    // Function dengan for loop
    function hitungTotal(uint256[] memory _angka) public pure returns (uint256) {
        uint256 total = 0;

        for (uint256 i = 0; i < _angka.length; i++) {
            total += _angka[i];
        }

        return total;
    }

    // Function dengan while loop
    function hitungSampai(uint256 _target) public pure returns (uint256) {
        uint256 hasil = 0;
        uint256 counter = 0;

        while (counter < _target) {
            hasil += counter;
            counter++;
        }

        return hasil;
    }
}
```

**Penjelasan:**
- `if-else` = membuat keputusan berdasarkan kondisi
- `for loop` = mengulang kode sejumlah tertentu
- `while loop` = mengulang selama kondisi terpenuhi

### 2. Mengenal Enum

**Enum** adalah tipe data dengan nilai yang sudah ditentukan.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract BelajarEnum {
    // Enum untuk status pesanan
    enum StatusPesanan {
        Pending,        // 0
        Diproses,       // 1
        Dikirim,        // 2
        Selesai,        // 3
        Dibatalkan      // 4
    }

    // Struct untuk pesanan
    struct Pesanan {
        uint256 id;
        string namaProduk;
        StatusPesanan status;
        address pembeli;
    }

    // Mapping dari ID ke pesanan
    mapping(uint256 => Pesanan) public pesanan;
    uint256 public pesananCounter = 0;

    // Function untuk buat pesanan baru
    function buatPesanan(string memory _namaProduk) public {
        pesananCounter++;

        pesanan[pesananCounter] = Pesanan({
            id: pesananCounter,
            namaProduk: _namaProduk,
            status: StatusPesanan.Pending,
            pembeli: msg.sender
        });
    }

    // Function untuk update status
    function updateStatus(uint256 _id, StatusPesanan _status) public {
        pesanan[_id].status = _status;
    }

    // Function untuk get status dalam string
    function getStatusString(uint256 _id) public view returns (string memory) {
        StatusPesanan status = pesanan[_id].status;

        if (status == StatusPesanan.Pending) return "Pending";
        if (status == StatusPesanan.Diproses) return "Diproses";
        if (status == StatusPesanan.Dikirim) return "Dikirim";
        if (status == StatusPesanan.Selesai) return "Selesai";
        if (status == StatusPesanan.Dibatalkan) return "Dibatalkan";

        return "Status Tidak Dikenal";
    }
}
```

**Penjelasan:**
- `enum` = tipe data dengan nilai predefined
- Lebih aman dari uint256 biasa
- Membuat kode lebih mudah dibaca

### 3. Events (Logging)

**Events** digunakan untuk logging aktivitas di blockchain.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract BelajarEvents {
    // Definisi Events
    event PenggunaDidaftarkan(
        address indexed pengguna,
        uint256 indexed id,
        string nama,
        uint256 timestamp
    );

    event DataDiubah(
        address indexed pengguna,
        uint256 indexed id,
        string dataLama,
        string dataBaru
    );

    // State variables
    mapping(uint256 => string) public dataPengguna;
    mapping(address => uint256) public addressKeID;
    uint256 public penggunaCounter = 0;

    // Function yang emit event
    function daftarPengguna(string memory _nama) public {
        penggunaCounter++;

        dataPengguna[penggunaCounter] = _nama;
        addressKeID[msg.sender] = penggunaCounter;

        // Emit event
        emit PenggunaDidaftarkan(
            msg.sender,
            penggunaCounter,
            _nama,
            block.timestamp
        );
    }

    // Function untuk ubah data
    function ubahData(uint256 _id, string memory _dataBaru) public {
        string memory dataLama = dataPengguna[_id];
        dataPengguna[_id] = _dataBaru;

        // Emit event
        emit DataDiubah(msg.sender, _id, dataLama, _dataBaru);
    }
}
```

**Penjelasan:**
- `event` = deklarasi event untuk logging
- `indexed` = parameter bisa di-filter saat query
- `emit` = trigger event
- Events dicatat di blockchain log (tidak di state)
- Lebih murah dari storage

### 4. Contoh Lengkap: Sistem Manajemen dengan Enum, Events, dan Modifiers

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract SistemManajemen {
    // Enum untuk status
    enum StatusPengguna {
        Tidak_Terdaftar,    // 0
        Aktif,              // 1
        Cuti,               // 2
        Alumni,             // 3
        Drop_Out            // 4
    }

    // Struct untuk pengguna
    struct Pengguna {
        string nama;
        uint256 id;
        string email;
        uint8 level;
        StatusPengguna status;
    }

    // State variables
    mapping(uint256 => Pengguna) public pengguna;
    mapping(address => uint256) public addressKeID;
    address public admin;
    uint256 public maxLevel = 10;

    // Events
    event PenggunaDidaftarkan(uint256 indexed id, string nama);
    event StatusDiubah(uint256 indexed id, StatusPengguna statusLama, StatusPengguna statusBaru);
    event LevelDinaikkan(uint256 indexed id, uint8 levelLama, uint8 levelBaru);

    // Modifier untuk akses control
    modifier hanyaAdmin() {
        require(msg.sender == admin, "Hanya admin yang bisa mengakses");
        _;
    }

    modifier penggunaAktif(uint256 _id) {
        require(pengguna[_id].status == StatusPengguna.Aktif, "Pengguna tidak aktif");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    // Function untuk registrasi pengguna
    function registrasiPengguna(
        uint256 _id,
        string memory _nama,
        string memory _email
    ) public hanyaAdmin {
        require(pengguna[_id].status == StatusPengguna.Tidak_Terdaftar, "Pengguna sudah terdaftar");

        pengguna[_id] = Pengguna({
            nama: _nama,
            id: _id,
            email: _email,
            level: 1,
            status: StatusPengguna.Aktif
        });

        emit PenggunaDidaftarkan(_id, _nama);
    }

    // Function untuk mengubah status pengguna
    function ubahStatusPengguna(uint256 _id, StatusPengguna _statusBaru) public hanyaAdmin {
        StatusPengguna statusLama = pengguna[_id].status;
        pengguna[_id].status = _statusBaru;

        emit StatusDiubah(_id, statusLama, _statusBaru);
    }

    // Function untuk naikkan level
    function naikkanLevel(uint256 _id) public penggunaAktif(_id) {
        require(pengguna[_id].level < maxLevel, "Sudah mencapai level maksimal");

        uint8 levelLama = pengguna[_id].level;
        pengguna[_id].level++;

        emit LevelDinaikkan(_id, levelLama, pengguna[_id].level);
    }

    // Function untuk cek eligibilitas
    function cekEligibilitas(uint256 _id) public view returns (bool eligible, string memory alasan) {
        Pengguna memory usr = pengguna[_id];

        if (usr.status != StatusPengguna.Aktif) {
            return (false, "Status pengguna tidak aktif");
        } else if (usr.level < 5) {
            return (false, "Level belum mencapai minimal");
        } else {
            return (true, "Memenuhi syarat");
        }
    }

    // Function untuk mendapatkan status dalam string
    function getStatusString(uint256 _id) public view returns (string memory) {
        StatusPengguna status = pengguna[_id].status;

        if (status == StatusPengguna.Tidak_Terdaftar) return "Tidak Terdaftar";
        if (status == StatusPengguna.Aktif) return "Aktif";
        if (status == StatusPengguna.Cuti) return "Cuti";
        if (status == StatusPengguna.Alumni) return "Alumni";
        if (status == StatusPengguna.Drop_Out) return "Drop Out";

        return "Status Tidak Dikenal";
    }
}
```

**Konsep Penting:**
- **Enum**: Tipe data khusus dengan nilai yang sudah ditentukan
- **Modifier**: Fungsi untuk mengecek kondisi sebelum menjalankan function
- **require()**: Untuk validasi input dan kondisi
- **Events**: Untuk logging aktivitas di blockchain
- **Flow Control**: if-else, for loop untuk kontrol alur program

---

## Solidity 104: Error Handling dan Modifiers

### 1. Error Handling dengan require()

**require()** digunakan untuk mengecek kondisi. Jika kondisi salah, transaksi akan dibatalkan.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract PengecekanError {
    mapping(uint256 => string) public namaPengguna;
    mapping(uint256 => uint256) public saldoPengguna;

    // Fungsi dengan pengecekan error
    function tambahPengguna(uint256 _id, string memory _nama) public {
        // Cek apakah nama tidak kosong
        require(bytes(_nama).length > 0, "Nama tidak boleh kosong");

        // Cek apakah ID belum ada
        require(bytes(namaPengguna[_id]).length == 0, "ID sudah terdaftar");

        namaPengguna[_id] = _nama;
    }

    // Fungsi untuk isi saldo dengan pengecekan
    function isiSaldo(uint256 _id, uint256 _saldo) public {
        // Cek apakah pengguna sudah terdaftar
        require(bytes(namaPengguna[_id]).length > 0, "Pengguna tidak ditemukan");

        // Cek apakah saldo valid
        require(_saldo > 0, "Saldo harus lebih dari 0");

        saldoPengguna[_id] = _saldo;
    }
}
```

**Penjelasan:**
- `require(kondisi, "pesan error")` = jika kondisi false, transaksi gagal
- `bytes(_nama).length > 0` = cara mengecek apakah string kosong
- Error handling membuat kontrak lebih aman

### 2. Access Control dengan Modifiers

**Modifiers** adalah cara untuk mengatur siapa yang boleh memanggil fungsi tertentu.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract AksesKontrol {
    address public admin;
    mapping(uint256 => string) public dataPengguna;

    constructor() {
        admin = msg.sender; // Yang deploy kontrak jadi admin
    }

    // Modifier untuk cek admin
    modifier hanyaAdmin() {
        require(msg.sender == admin, "Hanya admin yang bisa mengakses");
        _; // Lanjutkan eksekusi fungsi
    }

    // Fungsi yang hanya bisa dipanggil admin
    function tambahData(uint256 _id, string memory _data) public hanyaAdmin {
        dataPengguna[_id] = _data;
    }

    // Fungsi untuk ganti admin
    function gantiAdmin(address _adminBaru) public hanyaAdmin {
        admin = _adminBaru;
    }

    // Fungsi public yang bisa dipanggil siapa saja
    function lihatData(uint256 _id) public view returns (string memory) {
        return dataPengguna[_id];
    }
}
```

**Penjelasan:**
- `modifier hanyaAdmin()` = membuat modifier untuk cek admin
- `_` = placeholder tempat kode fungsi akan dieksekusi
- `hanyaAdmin` di fungsi = fungsi hanya bisa dipanggil oleh admin

### 3. Custom Errors (Gas Efficient)

**Custom Errors** lebih hemat gas dibanding require string.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract CustomErrors {
    // Define custom errors
    error PenggunaNotFound(uint256 id);
    error InvalidData(string reason);
    error UnauthorizedAccess(address caller);

    mapping(uint256 => string) public data;
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        if (msg.sender != owner) {
            revert UnauthorizedAccess(msg.sender);
        }
        _;
    }

    function setData(uint256 _id, string memory _data) public onlyOwner {
        if (bytes(_data).length == 0) {
            revert InvalidData("Data tidak boleh kosong");
        }
        data[_id] = _data;
    }

    function getData(uint256 _id) public view returns (string memory) {
        if (bytes(data[_id]).length == 0) {
            revert PenggunaNotFound(_id);
        }
        return data[_id];
    }
}
```

**Penjelasan:**
- `error ErrorName(params)` = define custom error
- `revert ErrorName(value)` = trigger error dengan parameter
- Lebih gas efficient dari `require()`
- Bisa include parameter untuk debugging

### 4. Library (Code Reusability)

**Library** adalah kumpulan fungsi yang bisa digunakan berulang.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

// Library untuk operasi matematika
library MathUtils {
    // Function untuk mencari nilai maksimum
    function max(uint256 a, uint256 b) internal pure returns (uint256) {
        return a >= b ? a : b;
    }

    // Function untuk mencari nilai minimum
    function min(uint256 a, uint256 b) internal pure returns (uint256) {
        return a < b ? a : b;
    }

    // Function untuk menghitung rata-rata
    function average(uint256 a, uint256 b) internal pure returns (uint256) {
        return (a + b) / 2;
    }
}

// Library untuk operasi string
library StringUtils {
    // Function untuk cek string kosong
    function isEmpty(string memory str) internal pure returns (bool) {
        return bytes(str).length == 0;
    }

    // Function untuk compare strings
    function isEqual(string memory a, string memory b) internal pure returns (bool) {
        return keccak256(bytes(a)) == keccak256(bytes(b));
    }
}

// Contract yang menggunakan library
contract UsingLibrary {
    using MathUtils for uint256;
    using StringUtils for string;

    function compareNumbers(uint256 a, uint256 b) public pure returns (
        uint256 maximum,
        uint256 minimum,
        uint256 avg
    ) {
        maximum = MathUtils.max(a, b);
        minimum = MathUtils.min(a, b);
        avg = MathUtils.average(a, b);

        return (maximum, minimum, avg);
    }

    function compareStrings(string memory a, string memory b) public pure returns (bool) {
        return a.isEqual(b);
    }

    function checkEmpty(string memory str) public pure returns (bool) {
        return str.isEmpty();
    }
}
```

**Penjelasan:**
- `library` = kumpulan fungsi reusable
- `using LibraryName for Type` = attach library ke tipe data
- `internal` = fungsi hanya bisa dipanggil dari dalam contract/library
- Gas efficient karena tidak deploy ulang kode yang sama

### 5. Interface (Contract Interaction)

**Interface** mendefinisikan fungsi yang harus diimplementasikan.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

// Interface untuk token
interface IToken {
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 amount) external returns (bool);
}

// Interface untuk data storage
interface IDataStorage {
    function storeData(uint256 id, string calldata data) external;
    function getData(uint256 id) external view returns (string memory);
}

// Contract yang implement interface
contract DataStorage is IDataStorage {
    mapping(uint256 => string) private data;

    function storeData(uint256 id, string calldata _data) external override {
        data[id] = _data;
    }

    function getData(uint256 id) external view override returns (string memory) {
        return data[id];
    }
}

// Contract yang berinteraksi dengan interface
contract DataConsumer {
    IDataStorage public dataStorage;

    constructor(address _dataStorageAddress) {
        dataStorage = IDataStorage(_dataStorageAddress);
    }

    function saveData(uint256 id, string calldata data) public {
        dataStorage.storeData(id, data);
    }

    function readData(uint256 id) public view returns (string memory) {
        return dataStorage.getData(id);
    }
}
```

**Penjelasan:**
- `interface` = contract tanpa implementasi
- Semua fungsi `external`
- Tidak bisa punya state variables
- Digunakan untuk interact dengan contract lain

### 6. Inheritance (Pewarisan)

**Inheritance** memungkinkan contract mewarisi dari contract lain.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

// Base contract (parent)
contract Ownable {
    address public owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    constructor() {
        owner = msg.sender;
        emit OwnershipTransferred(address(0), msg.sender);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    function transferOwnership(address newOwner) public virtual onlyOwner {
        require(newOwner != address(0), "Invalid address");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }
}

// Another base contract
contract Pausable {
    bool public paused;

    event Paused(address account);
    event Unpaused(address account);

    modifier whenNotPaused() {
        require(!paused, "Contract is paused");
        _;
    }

    modifier whenPaused() {
        require(paused, "Contract is not paused");
        _;
    }

    function _pause() internal {
        paused = true;
        emit Paused(msg.sender);
    }

    function _unpause() internal {
        paused = false;
        emit Unpaused(msg.sender);
    }
}

// Contract yang inherit dari multiple contracts
contract MyContract is Ownable, Pausable {
    mapping(uint256 => string) public data;

    // Function dengan multiple modifiers
    function setData(uint256 id, string memory _data) public onlyOwner whenNotPaused {
        data[id] = _data;
    }

    // Override function dari parent
    function transferOwnership(address newOwner) public override onlyOwner {
        super.transferOwnership(newOwner);
        // Tambahan logic custom
    }

    // Function untuk pause contract
    function pause() public onlyOwner {
        _pause();
    }

    // Function untuk unpause contract
    function unpause() public onlyOwner {
        _unpause();
    }
}
```

**Penjelasan:**
- `is ParentContract` = inherit dari parent
- `virtual` = fungsi bisa di-override
- `override` = override fungsi dari parent
- `super` = call fungsi dari parent
- Multiple inheritance = `is Parent1, Parent2`

### 7. Abstract Contract

**Abstract Contract** tidak bisa di-deploy, harus di-inherit.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

// Abstract contract
abstract contract BaseContract {
    // State variable
    uint256 public value;

    // Implemented function
    function setValue(uint256 _value) public {
        value = _value;
    }

    // Abstract function (harus diimplementasikan di child)
    function getValue() public view virtual returns (uint256);

    // Abstract function dengan logic tambahan
    function processValue() public virtual returns (uint256);
}

// Contract yang implement abstract contract
contract ConcreteContract is BaseContract {
    // Implement abstract function
    function getValue() public view override returns (uint256) {
        return value;
    }

    function processValue() public override returns (uint256) {
        return value * 2;
    }
}
```

**Penjelasan:**
- `abstract contract` = contract yang tidak lengkap
- Tidak bisa di-deploy langsung
- Minimal punya 1 fungsi tanpa implementasi
- Child contract harus implement semua abstract functions

---

## Solidity 105: Konsep Lanjutan (Opsional)

### 1. Payable Functions (Menerima Ether)

**Payable** memungkinkan fungsi menerima Ether.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract PayableContract {
    address public owner;
    mapping(address => uint256) public balances;

    event Deposit(address indexed from, uint256 amount);
    event Withdrawal(address indexed to, uint256 amount);

    constructor() {
        owner = msg.sender;
    }

    // Function payable untuk menerima Ether
    function deposit() public payable {
        require(msg.value > 0, "Must send ETH");
        balances[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }

    // Function untuk withdraw
    function withdraw(uint256 amount) public {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;

        // Transfer ETH menggunakan call (recommended)
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Transfer failed");

        emit Withdrawal(msg.sender, amount);
    }

    // Receive function untuk plain ETH transfer
    receive() external payable {
        balances[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }

    // Fallback function
    fallback() external payable {
        balances[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }

    // Check contract balance
    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
```

**Penjelasan:**
- `payable` = fungsi bisa menerima Ether
- `msg.value` = jumlah Ether yang dikirim
- `address(this).balance` = balance contract
- `receive()` = dipanggil saat ETH dikirim tanpa data
- `fallback()` = dipanggil saat fungsi tidak ditemukan

### 2. Time-based Logic

**Block timestamp** untuk logic berbasis waktu.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract TimeBasedContract {
    uint256 public startTime;
    uint256 public constant DURATION = 7 days;

    mapping(address => uint256) public lastClaim;
    mapping(address => uint256) public rewards;

    constructor() {
        startTime = block.timestamp;
    }

    // Check apakah periode sudah selesai
    function isEnded() public view returns (bool) {
        return block.timestamp >= startTime + DURATION;
    }

    // Check waktu tersisa
    function timeRemaining() public view returns (uint256) {
        if (isEnded()) {
            return 0;
        }
        return (startTime + DURATION) - block.timestamp;
    }

    // Claim reward (maksimal 1x per hari)
    function claimReward() public {
        require(block.timestamp >= lastClaim[msg.sender] + 1 days, "Harus tunggu 1 hari");
        require(!isEnded(), "Event sudah berakhir");

        lastClaim[msg.sender] = block.timestamp;
        rewards[msg.sender] += 100;
    }
}
```

**Penjelasan:**
- `block.timestamp` = waktu block saat ini (Unix timestamp)
- `1 days`, `1 hours`, `1 minutes` = time units
- ⚠️ Bisa dimanipulasi miner (±15 detik)

### 3. Gas Optimization Tips

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract GasOptimization {
    // ❌ Expensive: storage variable in loop
    function sumBad(uint256[] memory numbers) public returns (uint256) {
        uint256 total;  // Default di storage
        for (uint256 i = 0; i < numbers.length; i++) {
            total += numbers[i];  // Storage write setiap iteration
        }
        return total;
    }

    // ✅ Cheap: memory variable
    function sumGood(uint256[] memory numbers) public pure returns (uint256) {
        uint256 total = 0;  // Memory variable
        for (uint256 i = 0; i < numbers.length; i++) {
            total += numbers[i];  // Memory write (lebih murah)
        }
        return total;
    }

    // ✅ Use calldata untuk read-only array parameters
    function processCalldata(uint256[] calldata numbers) external pure returns (uint256) {
        uint256 total = 0;
        for (uint256 i = 0; i < numbers.length; i++) {
            total += numbers[i];
        }
        return total;
    }

    // ✅ Cache array length
    function sumOptimized(uint256[] memory numbers) public pure returns (uint256) {
        uint256 total = 0;
        uint256 length = numbers.length;  // Cache length
        for (uint256 i = 0; i < length; i++) {
            total += numbers[i];
        }
        return total;
    }

    // ✅ Use unchecked untuk save gas (hanya jika yakin tidak overflow)
    function sumUnchecked(uint256[] memory numbers) public pure returns (uint256) {
        uint256 total = 0;
        unchecked {
            for (uint256 i = 0; i < numbers.length; i++) {
                total += numbers[i];
            }
        }
        return total;
    }
}
```

**Gas Optimization Tips:**
- ✅ Use `memory` untuk temporary data
- ✅ Use `calldata` untuk read-only function parameters
- ✅ Cache array length di loops
- ✅ Use `unchecked` jika yakin tidak overflow
- ✅ Minimize storage writes
- ✅ Use events untuk data yang tidak perlu di-query on-chain
- ✅ Batch operations
- ❌ Hindari storage writes dalam loop

### 4. Security Best Practices

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract SecurityBestPractices {
    mapping(address => uint256) public balances;

    // ✅ GOOD: Checks-Effects-Interactions pattern
    function withdrawGood(uint256 amount) public {
        // 1. Checks
        require(balances[msg.sender] >= amount, "Insufficient balance");

        // 2. Effects (update state dulu)
        balances[msg.sender] -= amount;

        // 3. Interactions (external call terakhir)
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Transfer failed");
    }

    // ❌ BAD: Vulnerable to reentrancy
    function withdrawBad(uint256 amount) public {
        require(balances[msg.sender] >= amount, "Insufficient balance");

        // External call sebelum update state = DANGEROUS!
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Transfer failed");

        balances[msg.sender] -= amount;  // Too late!
    }

    // ✅ Use ReentrancyGuard
    bool private locked;

    modifier nonReentrant() {
        require(!locked, "No reentrancy");
        locked = true;
        _;
        locked = false;
    }

    function withdrawSafe(uint256 amount) public nonReentrant {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;

        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Transfer failed");
    }
}
```

**Security Tips:**
- ✅ Follow Checks-Effects-Interactions pattern
- ✅ Use ReentrancyGuard
- ✅ Validate all inputs dengan `require()`
- ✅ Use `call()` instead of `transfer()` atau `send()`
- ✅ Avoid delegatecall ke untrusted contracts
- ✅ Test extensively
- ❌ Never trust external calls
- ❌ Jangan simpan sensitive data di blockchain

---

## Latihan dan Tips

### Latihan 1: Buat Simple Storage
Buat kontrak untuk menyimpan dan membaca data favorit Anda:
- Warna favorit
- Angka favorit
- Nama favorit

### Latihan 2: Buat User Registry
Buat kontrak untuk mendaftar pengguna dengan:
- Mapping address ke nama
- Fungsi register
- Fungsi update nama
- Fungsi lihat nama berdasarkan address

### Latihan 3: Buat Simple Voting
Buat kontrak voting sederhana:
- Mapping address ke pilihan (A atau B)
- Counter untuk setiap pilihan
- Fungsi vote
- Fungsi lihat hasil

### Tips Belajar Solidity

1. **Mulai dari yang sederhana** - Jangan langsung membuat kontrak kompleks
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
4. **Security Best Practices** - Membuat kontrak yang aman

:::tip Terus Berlatih!
Smart contract development adalah skill yang butuh banyak practice. Mulai dengan project kecil dan tingkatkan kompleksitasnya secara bertahap.
:::

---

Ready to build on Ethereum! 🚀
