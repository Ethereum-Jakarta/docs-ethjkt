---
id: dasar-solidity
title: Dasar-Dasar Solidity dan Advanced Solidity
sidebar_position: 11
---

# Dasar-Dasar Solidity dan Advanced Solidity

Dalam tutorial ini, kita akan belajar Solidity step-by-step dari yang paling dasar. Setiap konsep akan dijelaskan satu per satu dengan contoh sederhana menggunakan data mahasiswa kampus.

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
3. Tambahkan 0G Network dengan data ini:

```
Network Name: 0G-Galileo-Testnet
RPC URL: https://evmrpc-testnet.0g.ai
Chain ID: 16601
Currency Symbol: OG
Block Explorer: https://chainscan-galileo.0g.ai
```

### 3. Dapatkan Test Token

1. Kunjungi [https://faucet.0g.ai](https://faucet.0g.ai)
2. Masukkan address wallet Anda
3. Tunggu token OG masuk (untuk bayar gas fee)

### 4. Hubungkan Remix dengan MetaMask

1. Di Remix, klik tab **"Deploy & Run Transactions"**
2. Di bagian Environment, pilih **"Injected Provider - MetaMask"**
3. Pastikan MetaMask terhubung ke 0G Network

:::success Siap!
Sekarang Anda sudah siap untuk belajar Solidity dan deploy ke 0G Network!
:::

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
    // Variabel untuk menyimpan NIM
    uint256 public nim;
    uint256 public umur;
    
    constructor() {
        nim = 21110001;
        umur = 20;
    }
    
    // Fungsi untuk mengubah NIM
    function ubahNIM(uint256 _nimBaru) public {
        nim = _nimBaru;
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
- `nim = 21110001` = mengisi nilai ke variabel nim
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

contract DataMahasiswa {
    // Variabel untuk menyimpan data mahasiswa
    string public nama;
    uint256 public nim;
    string public jurusan;
    bool public statusAktif;
    
    // Constructor untuk mengisi data awal
    constructor() {
        nama = "Budi Santoso";
        nim = 21110001;
        jurusan = "Teknik Informatika";
        statusAktif = true;
    }
    
    // Fungsi untuk mengubah nama
    function ubahNama(string memory _nama) public {
        nama = _nama;
    }
    
    // Fungsi untuk mengubah NIM
    function ubahNIM(uint256 _nim) public {
        nim = _nim;
    }
    
    // Fungsi untuk mengubah jurusan
    function ubahJurusan(string memory _jurusan) public {
        jurusan = _jurusan;
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

### 5. Mengenal Mapping

**Mapping** adalah seperti kamus atau daftar telepon - kita bisa cari data berdasarkan kunci tertentu.

#### Mapping Sederhana

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract BelajarMapping {
    // Mapping dari NIM ke Nama
    mapping(uint256 => string) public nimKeNama;
    
    // Fungsi untuk menambah data
    function tambahMahasiswa(uint256 _nim, string memory _nama) public {
        nimKeNama[_nim] = _nama;
    }
    
    // Fungsi untuk mengambil nama berdasarkan NIM
    function getNama(uint256 _nim) public view returns (string memory) {
        return nimKeNama[_nim];
    }
}
```

**Penjelasan:**
- `mapping(uint256 => string)` = kamus dari angka NIM ke nama
- `nimKeNama[21110001] = "Budi"` = mengisi data
- `nimKeNama[21110001]` = mengambil data

#### Mapping untuk Menyimpan Nilai

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract NilaiMahasiswa {
    // Mapping dari NIM ke Nilai
    mapping(uint256 => uint256) public nilaiMahasiswa;
    
    // Fungsi untuk mengisi nilai
    function isiNilai(uint256 _nim, uint256 _nilai) public {
        nilaiMahasiswa[_nim] = _nilai;
    }
    
    // Fungsi untuk cek kelulusan
    function cekLulus(uint256 _nim) public view returns (bool) {
        if (nilaiMahasiswa[_nim] >= 60) {
            return true;  // Lulus
        } else {
            return false; // Tidak lulus
        }
    }
}
```

**Penjelasan:**
- Kita bisa simpan nilai mahasiswa berdasarkan NIM
- `if` digunakan untuk membuat kondisi
- `return true/false` untuk mengembalikan hasil

### 6. Fungsi dan Parameter

Mari pelajari cara membuat fungsi yang lebih baik:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract BelajarFungsi {
    uint256 public totalMahasiswa = 0;
    mapping(uint256 => string) public daftarMahasiswa;
    
    // Fungsi dengan parameter
    function tambahMahasiswa(uint256 _nim, string memory _nama) public {
        daftarMahasiswa[_nim] = _nama;
        totalMahasiswa = totalMahasiswa + 1;
    }
    
    // Fungsi tanpa parameter
    function resetTotal() public {
        totalMahasiswa = 0;
    }
    
    // Fungsi yang mengembalikan nilai (returns)
    function hitungMahasiswa() public view returns (uint256) {
        return totalMahasiswa;
    }
    
    // Fungsi dengan multiple parameter
    function cekDataLengkap(
        string memory _nama, 
        uint256 _nim, 
        uint256 _umur
    ) public pure returns (bool) {
        
        // Cek apakah data lengkap
        if (bytes(_nama).length > 0 && _nim > 0 && _umur > 17) {
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

## Solidity 102: Struct dan Array

Sekarang kita belajar cara mengelompokkan data dengan Struct dan menyimpan banyak data dengan Array.

### 1. Mengenal Struct

**Struct** adalah cara untuk mengelompokkan beberapa data jadi satu. Seperti map biodata yang isinya nama, umur, alamat, dll.

#### Struct Sederhana

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract BelajarStruct {
    // Buat struct untuk data mahasiswa
    struct Mahasiswa {
        string nama;
        uint256 nim;
        uint256 umur;
        bool aktif;
    }
    
    // Variabel dengan tipe struct
    Mahasiswa public mahasiswaPertama;
    
    // Fungsi untuk mengisi data struct
    function isiDataMahasiswa() public {
        mahasiswaPertama = Mahasiswa({
            nama: "Budi Santoso",
            nim: 21110001,
            umur: 20,
            aktif: true
        });
    }
    
    // Fungsi untuk mengubah nama saja
    function ubahNama(string memory _namaBaru) public {
        mahasiswaPertama.nama = _namaBaru;
    }
    
    // Fungsi untuk mendapatkan data
    function getDataMahasiswa() public view returns (
        string memory nama,
        uint256 nim,
        uint256 umur,
        bool aktif
    ) {
        return (
            mahasiswaPertama.nama,
            mahasiswaPertama.nim,
            mahasiswaPertama.umur,
            mahasiswaPertama.aktif
        );
    }
}
```

**Penjelasan:**
- `struct Mahasiswa { ... }` = membuat template data mahasiswa
- `Mahasiswa public mahasiswaPertama` = membuat variabel dengan tipe struct
- `mahasiswaPertama.nama` = mengakses bagian tertentu dari struct

### 2. Mapping dengan Struct

Sekarang kita gabungkan Mapping dengan Struct untuk menyimpan banyak mahasiswa:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract DataBanyakMahasiswa {
    // Struct untuk data mahasiswa
    struct Mahasiswa {
        string nama;
        string jurusan;
        uint256 umur;
        bool aktif;
    }
    
    // Mapping dari NIM ke data mahasiswa
    mapping(uint256 => Mahasiswa) public daftarMahasiswa;
    
    // Fungsi untuk tambah mahasiswa baru
    function tambahMahasiswa(
        uint256 _nim,
        string memory _nama,
        string memory _jurusan,
        uint256 _umur
    ) public {
        daftarMahasiswa[_nim] = Mahasiswa({
            nama: _nama,
            jurusan: _jurusan,
            umur: _umur,
            aktif: true
        });
    }
    
    // Fungsi untuk nonaktifkan mahasiswa
    function nonaktifkanMahasiswa(uint256 _nim) public {
        daftarMahasiswa[_nim].aktif = false;
    }
    
    // Fungsi untuk mengubah jurusan
    function pindahJurusan(uint256 _nim, string memory _jurusanBaru) public {
        daftarMahasiswa[_nim].jurusan = _jurusanBaru;
    }
}
```

**Penjelasan:**
- Kita bisa simpan banyak mahasiswa dengan NIM sebagai kunci
- Setiap mahasiswa punya data lengkap dalam struct
- Kita bisa ubah sebagian data tanpa mengganti semua

### 3. Mengenal Array

**Array** adalah daftar atau list yang bisa menyimpan banyak data dengan tipe yang sama.

#### Array Sederhana

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract BelajarArray {
    // Array untuk menyimpan daftar NIM
    uint256[] public daftarNIM;
    
    // Array untuk menyimpan nama-nama mahasiswa
    string[] public daftarNama;
    
    // Fungsi untuk tambah NIM ke array
    function tambahNIM(uint256 _nim) public {
        daftarNIM.push(_nim);
    }
    
    // Fungsi untuk tambah nama ke array
    function tambahNama(string memory _nama) public {
        daftarNama.push(_nama);
    }
    
    // Fungsi untuk melihat berapa banyak data
    function jumlahMahasiswa() public view returns (uint256) {
        return daftarNIM.length;
    }
    
    // Fungsi untuk mengambil NIM berdasarkan urutan
    function getNIMUrutan(uint256 _index) public view returns (uint256) {
        return daftarNIM[_index];
    }
    
    // Fungsi untuk mengambil semua NIM
    function getAllNIM() public view returns (uint256[] memory) {
        return daftarNIM;
    }
}
```

**Penjelasan:**
- `uint256[] public daftarNIM` = array untuk menyimpan banyak angka NIM
- `daftarNIM.push(_nim)` = menambah data ke array
- `daftarNIM.length` = menghitung jumlah data dalam array
- `daftarNIM[0]` = mengambil data urutan pertama (dimulai dari 0)

### 4. Gabungkan Struct, Mapping, dan Array

Mari buat sistem yang lebih lengkap:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract SistemMahasiswa {
    // Struct untuk data mahasiswa
    struct Mahasiswa {
        string nama;
        string jurusan;
        bool aktif;
    }
    
    // Mapping untuk menyimpan data detail mahasiswa
    mapping(uint256 => Mahasiswa) public dataMahasiswa;
    
    // Array untuk menyimpan daftar semua NIM yang terdaftar
    uint256[] public semuaNIM;
    
    // Fungsi untuk daftar mahasiswa baru
    function daftarMahasiswa(
        uint256 _nim,
        string memory _nama,
        string memory _jurusan
    ) public {
        // Simpan data ke mapping
        dataMahasiswa[_nim] = Mahasiswa({
            nama: _nama,
            jurusan: _jurusan,
            aktif: true
        });
        
        // Tambah NIM ke array
        semuaNIM.push(_nim);
    }
    
    // Fungsi untuk melihat total mahasiswa
    function totalMahasiswa() public view returns (uint256) {
        return semuaNIM.length;
    }
    
    // Fungsi untuk melihat NIM mahasiswa ke-berapa
    function getMahasiswaKe(uint256 _urutan) public view returns (
        uint256 nim,
        string memory nama,
        string memory jurusan,
        bool aktif
    ) {
        uint256 nim_mahasiswa = semuaNIM[_urutan];
        Mahasiswa memory mhs = dataMahasiswa[nim_mahasiswa];
        
        return (nim_mahasiswa, mhs.nama, mhs.jurusan, mhs.aktif);
    }
    
    // Fungsi untuk nonaktifkan mahasiswa
    function nonaktifkanMahasiswa(uint256 _nim) public {
        dataMahasiswa[_nim].aktif = false;
    }
}
```

**Penjelasan:**
- Kita pakai Mapping untuk simpan data detail mahasiswa
- Kita pakai Array untuk track semua NIM yang terdaftar
- Dengan kombinasi ini, kita bisa akses data dengan 2 cara: 
  - Berdasarkan NIM (lewat mapping)
  - Berdasarkan urutan (lewat array)

## Solidity 103: Flow Control dan Advanced Features

### Flow Control, Enum, Modifier, dan Interaksi Kontrak

#### Contoh 1: Enum dan Flow Control

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract ManajemenMahasiswa {
    // Enum untuk status mahasiswa
    enum StatusMahasiswa { 
        Tidak_Terdaftar,    // 0
        Aktif,              // 1
        Cuti,               // 2
        Alumni,             // 3
        Drop_Out            // 4
    }
    
    // Enum untuk jenis mata kuliah
    enum JenisMataKuliah {
        Wajib,              // 0
        Pilihan,            // 1
        Praktek,            // 2
        Skripsi             // 3
    }
    
    struct Mahasiswa {
        string nama;
        uint256 nim;
        string jurusan;
        uint8 semester;
        StatusMahasiswa status;
        uint256 totalSKS;
    }
    
    struct MataKuliah {
        string nama;
        uint8 sks;
        JenisMataKuliah jenis;
        bool tersedia;
    }
    
    // Mapping dan state variables
    mapping(uint256 => Mahasiswa) public mahasiswa;
    mapping(string => MataKuliah) public mataKuliah;
    mapping(uint256 => string[]) public mataKuliahMahasiswa; // NIM -> daftar MK
    
    address public admin;
    uint256 public maxSKSPerSemester = 24;
    
    // Events untuk logging
    event MahasiswaDidaftarkan(uint256 indexed nim, string nama);
    event StatusMahasiswaDiubah(uint256 indexed nim, StatusMahasiswa statusLama, StatusMahasiswa statusBaru);
    event MataKuliahDiambil(uint256 indexed nim, string mataKuliah);
    
    // Modifier untuk akses control
    modifier hanyaAdmin() {
        require(msg.sender == admin, "Hanya admin yang bisa mengakses");
        _;
    }
    
    modifier mahasiswaAktif(uint256 _nim) {
        require(mahasiswa[_nim].status == StatusMahasiswa.Aktif, "Mahasiswa tidak aktif");
        _;
    }
    
    modifier mataKuliahValid(string memory _kodeMK) {
        require(mataKuliah[_kodeMK].tersedia, "Mata kuliah tidak tersedia");
        _;
    }
    
    constructor() {
        admin = msg.sender;
    }
    
    // Function untuk menambah mata kuliah (hanya admin)
    function tambahMataKuliah(
        string memory _kodeMK,
        string memory _nama,
        uint8 _sks,
        JenisMataKuliah _jenis
    ) public hanyaAdmin {
        mataKuliah[_kodeMK] = MataKuliah({
            nama: _nama,
            sks: _sks,
            jenis: _jenis,
            tersedia: true
        });
    }
    
    // Function untuk registrasi mahasiswa
    function registrasiMahasiswa(
        uint256 _nim,
        string memory _nama,
        string memory _jurusan
    ) public hanyaAdmin {
        require(mahasiswa[_nim].status == StatusMahasiswa.Tidak_Terdaftar, "Mahasiswa sudah terdaftar");
        
        mahasiswa[_nim] = Mahasiswa({
            nama: _nama,
            nim: _nim,
            jurusan: _jurusan,
            semester: 1,
            status: StatusMahasiswa.Aktif,
            totalSKS: 0
        });
        
        emit MahasiswaDidaftarkan(_nim, _nama);
    }
    
    // Function untuk mengubah status mahasiswa
    function ubahStatusMahasiswa(uint256 _nim, StatusMahasiswa _statusBaru) public hanyaAdmin {
        StatusMahasiswa statusLama = mahasiswa[_nim].status;
        mahasiswa[_nim].status = _statusBaru;
        
        emit StatusMahasiswaDiubah(_nim, statusLama, _statusBaru);
    }
    
    // Function untuk mahasiswa mengambil mata kuliah
    function ambilMataKuliah(uint256 _nim, string memory _kodeMK) 
        public 
        mahasiswaAktif(_nim) 
        mataKuliahValid(_kodeMK) 
    {
        // Cek apakah mahasiswa ini yang memanggil atau admin
        require(
            msg.sender == admin || addressKeNIM[msg.sender] == _nim,
            "Tidak bisa mengambil MK untuk mahasiswa lain"
        );
        
        // Cek apakah SKS tidak melebihi batas
        uint256 totalSKSSaatIni = hitungSKSSemesterIni(_nim);
        uint8 sksMataKuliah = mataKuliah[_kodeMK].sks;
        
        require(
            totalSKSSaatIni + sksMataKuliah <= maxSKSPerSemester,
            "Melebihi batas SKS per semester"
        );
        
        // Cek apakah mata kuliah sudah diambil
        require(!sudahMengambilMataKuliah(_nim, _kodeMK), "Mata kuliah sudah diambil");
        
        // Tambahkan mata kuliah ke daftar mahasiswa
        mataKuliahMahasiswa[_nim].push(_kodeMK);
        
        emit MataKuliahDiambil(_nim, _kodeMK);
    }
    
    // Function untuk cek apakah mahasiswa bisa lulus
    function cekKelulusan(uint256 _nim) public view returns (bool bisaLulus, string memory alasan) {
        Mahasiswa memory mhs = mahasiswa[_nim];
        
        // Flow control dengan if-else
        if (mhs.status != StatusMahasiswa.Aktif) {
            return (false, "Status mahasiswa tidak aktif");
        } else if (mhs.semester < 8) {
            return (false, "Belum mencapai semester minimal");
        } else if (mhs.totalSKS < 144) {
            return (false, "Total SKS belum mencukupi (minimal 144)");
        } else {
            return (true, "Memenuhi syarat kelulusan");
        }
    }
    
    // Function internal untuk menghitung SKS semester ini
    function hitungSKSSemesterIni(uint256 _nim) internal view returns (uint256) {
        string[] memory daftarMK = mataKuliahMahasiswa[_nim];
        uint256 totalSKS = 0;
        
        // Loop untuk menghitung total SKS
        for (uint256 i = 0; i < daftarMK.length; i++) {
            totalSKS += mataKuliah[daftarMK[i]].sks;
        }
        
        return totalSKS;
    }
    
    // Function untuk cek apakah sudah mengambil mata kuliah
    function sudahMengambilMataKuliah(uint256 _nim, string memory _kodeMK) 
        internal view returns (bool) 
    {
        string[] memory daftarMK = mataKuliahMahasiswa[_nim];
        
        for (uint256 i = 0; i < daftarMK.length; i++) {
            if (keccak256(bytes(daftarMK[i])) == keccak256(bytes(_kodeMK))) {
                return true;
            }
        }
        
        return false;
    }
    
    // Mapping tambahan untuk hubungan address ke NIM
    mapping(address => uint256) public addressKeNIM;
    
    // Function untuk menghubungkan address dengan NIM
    function hubungkanAddress(uint256 _nim, address _alamat) public hanyaAdmin {
        addressKeNIM[_alamat] = _nim;
    }
    
    // Function untuk mendapatkan status dalam string
    function getStatusString(uint256 _nim) public view returns (string memory) {
        StatusMahasiswa status = mahasiswa[_nim].status;
        
        if (status == StatusMahasiswa.Tidak_Terdaftar) return "Tidak Terdaftar";
        if (status == StatusMahasiswa.Aktif) return "Aktif";
        if (status == StatusMahasiswa.Cuti) return "Cuti";
        if (status == StatusMahasiswa.Alumni) return "Alumni";
        if (status == StatusMahasiswa.Drop_Out) return "Drop Out";
        
        return "Status Tidak Dikenal";
    }
}
```

**Konsep Penting**:
- **Enum**: Tipe data khusus dengan nilai yang sudah ditentukan
- **Modifier**: Fungsi untuk mengecek kondisi sebelum menjalankan function
- **require()**: Untuk validasi input dan kondisi
- **Events**: Untuk logging aktivitas di blockchain
- **Flow Control**: if-else, for loop untuk kontrol alur program

## Solidity 104: Fitur Lanjutan (Sederhana)

Sekarang kita belajar beberapa fitur yang berguna untuk membuat smart contract yang lebih baik.

### 1. Error Handling dengan require()

**require()** digunakan untuk mengecek kondisi. Jika kondisi salah, transaksi akan dibatalkan.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract PengecekanError {
    mapping(uint256 => string) public namaMahasiswa;
    mapping(uint256 => uint256) public nilaiMahasiswa;
    
    // Fungsi dengan pengecekan error
    function tambahMahasiswa(uint256 _nim, string memory _nama) public {
        // Cek apakah nama tidak kosong
        require(bytes(_nama).length > 0, "Nama tidak boleh kosong");
        
        // Cek apakah NIM belum ada
        require(bytes(namaMahasiswa[_nim]).length == 0, "NIM sudah terdaftar");
        
        namaMahasiswa[_nim] = _nama;
    }
    
    // Fungsi untuk isi nilai dengan pengecekan
    function isiNilai(uint256 _nim, uint256 _nilai) public {
        // Cek apakah mahasiswa sudah terdaftar
        require(bytes(namaMahasiswa[_nim]).length > 0, "Mahasiswa tidak ditemukan");
        
        // Cek apakah nilai valid (0-100)
        require(_nilai <= 100, "Nilai maksimal 100");
        
        nilaiMahasiswa[_nim] = _nilai;
    }
    
    // Fungsi untuk cek kelulusan
    function cekLulus(uint256 _nim) public view returns (bool) {
        require(bytes(namaMahasiswa[_nim]).length > 0, "Mahasiswa tidak ditemukan");
        
        return nilaiMahasiswa[_nim] >= 60;
    }
}
```

**Penjelasan:**
- `require(kondisi, "pesan error")` = jika kondisi false, transaksi gagal
- `bytes(_nama).length > 0` = cara mengecek apakah string kosong
- Error handling membuat kontrak lebih aman

### 2. Access Control Sederhana

**Access Control** adalah cara mengatur siapa yang boleh memanggil fungsi tertentu.

```solidity
library MathUtils {
    // Function untuk menghitung IPK
    function hitungIPK(uint256 totalNilai, uint256 totalSKS) internal pure returns (uint256) {
        if (totalSKS == 0) return 0;
        return (totalNilai * 100) / totalSKS; // IPK dalam bentuk integer x100
    }
    
    // Function untuk konversi nilai huruf ke angka
    function nilaiHurufKeAngka(string memory huruf) internal pure returns (uint8) {
        bytes32 hurufHash = keccak256(bytes(huruf));
        
        if (hurufHash == keccak256("A")) return 4;
        if (hurufHash == keccak256("B")) return 3;
        if (hurufHash == keccak256("C")) return 2;
        if (hurufHash == keccak256("D")) return 1;
        return 0; // E
    }
}

// Interface untuk sistem pembayaran
interface IPembayaranSPP {
    function cekStatusPembayaran(uint256 nim) external view returns (bool);
    function bayarSPP(uint256 nim) external payable;
    function getSisaTagihan(uint256 nim) external view returns (uint256);
}

// Interface untuk sistem akademik
interface ISistemAkademik {
    function getMahasiswa(uint256 nim) external view returns (string memory nama, string memory jurusan);
    function cekKelulusan(uint256 nim) external view returns (bool);
}

// Base contract untuk access control
abstract contract AccessControl {
    mapping(address => bool) public admin;
    mapping(address => bool) public dosen;
    
    event AdminAdded(address indexed account);
    event DosenAdded(address indexed account);
    
    modifier onlyAdmin() {
        if (!admin[msg.sender]) revert NotAuthorized(msg.sender);
        _;
    }
    
    modifier onlyDosen() {
        if (!dosen[msg.sender] && !admin[msg.sender]) revert NotAuthorized(msg.sender);
        _;
    }
    
    constructor() {
        admin[msg.sender] = true;
        emit AdminAdded(msg.sender);
    }
    
    function tambahAdmin(address account) public virtual onlyAdmin {
        admin[account] = true;
        emit AdminAdded(account);
    }
    
    function tambahDosen(address account) public virtual onlyAdmin {
        dosen[account] = true;
        emit DosenAdded(account);
    }
}

// Main contract yang inherit dari AccessControl
contract SistemNilaiMahasiswa is AccessControl, ISistemAkademik {
    using MathUtils for *; // Using directive untuk library
    
    struct NilaiMahasiswa {
        string kodeMK;
        string namaMK;
        uint8 sks;
        uint8 nilaiAngka;
        string nilaiHuruf;
        address dosenPenilai;
    }
    
    struct Mahasiswa {
        string nama;
        string jurusan;
        bool aktif;
        uint256 totalSKSLulus;
        uint256 totalNilaiTertimbang;
    }
    
    mapping(uint256 => Mahasiswa) private mahasiswaData;
    mapping(uint256 => NilaiMahasiswa[]) private nilaiMahasiswa;
    mapping(uint256 => bool) private mahasiswaExists;
    
    // Events
    event MahasiswaRegistered(uint256 indexed nim, string nama, string jurusan);
    event NilaiAdded(uint256 indexed nim, string kodeMK, uint8 nilai, address dosen);
    event NilaiUpdated(uint256 indexed nim, string kodeMK, uint8 nilaiBaru, uint8 nilaiLama);
    
    // Function untuk registrasi mahasiswa dengan error handling
    function registrasiMahasiswa(
        uint256 nim,
        string calldata nama,
        string calldata jurusan
    ) external onlyAdmin {
        // Validasi input
        if (bytes(nama).length == 0) revert("Nama tidak boleh kosong");
        if (bytes(jurusan).length == 0) revert("Jurusan tidak boleh kosong");
        if (mahasiswaExists[nim]) revert("NIM sudah terdaftar");
        
        // Simpan data mahasiswa
        mahasiswaData[nim] = Mahasiswa({
            nama: nama,
            jurusan: jurusan,
            aktif: true,
            totalSKSLulus: 0,
            totalNilaiTertimbang: 0
        });
        
        mahasiswaExists[nim] = true;
        
        emit MahasiswaRegistered(nim, nama, jurusan);
    }
    
    // Function untuk menambah nilai dengan extensive error handling
    function tambahNilai(
        uint256 nim,
        string calldata kodeMK,
        string calldata namaMK,
        uint8 sks,
        uint8 nilaiAngka
    ) external onlyDosen {
        // Validasi mahasiswa
        if (!mahasiswaExists[nim]) revert MahasiswaNotFound(nim);
        if (!mahasiswaData[nim].aktif) revert("Mahasiswa tidak aktif");
        
        // Validasi nilai
        if (nilaiAngka > 100) revert InvalidGrade(nilaiAngka);
        if (sks == 0 || sks > 6) revert("SKS tidak valid (1-6)");
        
        // Cek apakah mata kuliah sudah ada
        if (_sudahAdaNilai(nim, kodeMK)) {
            revert MataKuliahAlreadyTaken(kodeMK);
        }
        
        // Konversi nilai angka ke huruf
        string memory nilaiHuruf = _konversiNilaiHuruf(nilaiAngka);
        
        // Buat struct nilai baru
        NilaiMahasiswa memory nilai = NilaiMahasiswa({
            kodeMK: kodeMK,
            namaMK: namaMK,
            sks: sks,
            nilaiAngka: nilaiAngka,
            nilaiHuruf: nilaiHuruf,
            dosenPenilai: msg.sender
        });
        
        // Tambahkan nilai ke array
        nilaiMahasiswa[nim].push(nilai);
        
        // Update total SKS dan nilai tertimbang jika lulus
        if (nilaiAngka >= 60) {
            mahasiswaData[nim].totalSKSLulus += sks;
            uint8 nilaiBobot = MathUtils.nilaiHurufKeAngka(nilaiHuruf);
            mahasiswaData[nim].totalNilaiTertimbang += (nilaiBobot * sks);
        }
        
        emit NilaiAdded(nim, kodeMK, nilaiAngka, msg.sender);
    }
    
    // Function untuk update nilai dengan error handling
    function updateNilai(
        uint256 nim,
        string calldata kodeMK,
        uint8 nilaiBaru
    ) external onlyDosen {
        if (!mahasiswaExists[nim]) revert MahasiswaNotFound(nim);
        if (nilaiBaru > 100) revert InvalidGrade(nilaiBaru);
        
        NilaiMahasiswa[] storage daftarNilai = nilaiMahasiswa[nim];
        bool found = false;
        uint8 nilaiLama;
        
        for (uint i = 0; i < daftarNilai.length; i++) {
            if (keccak256(bytes(daftarNilai[i].kodeMK)) == keccak256(bytes(kodeMK))) {
                // Hanya dosen yang memberikan nilai yang bisa update
                if (daftarNilai[i].dosenPenilai != msg.sender && !admin[msg.sender]) {
                    revert NotAuthorized(msg.sender);
                }
                
                nilaiLama = daftarNilai[i].nilaiAngka;
                uint8 sks = daftarNilai[i].sks;
                
                // Update nilai
                daftarNilai[i].nilaiAngka = nilaiBaru;
                daftarNilai[i].nilaiHuruf = _konversiNilaiHuruf(nilaiBaru);
                
                // Recalculate total SKS dan nilai tertimbang
                _recalculateIPK(nim, sks, nilaiLama, nilaiBaru);
                
                found = true;
                break;
            }
        }
        
        if (!found) revert("Mata kuliah tidak ditemukan");
        
        emit NilaiUpdated(nim, kodeMK, nilaiBaru, nilaiLama);
    }
    
    // Function untuk menghitung IPK dengan error handling
    function getIPK(uint256 nim) external view returns (uint256 ipk) {
        if (!mahasiswaExists[nim]) revert MahasiswaNotFound(nim);
        
        Mahasiswa memory mhs = mahasiswaData[nim];
        
        if (mhs.totalSKSLulus == 0) {
            return 0;
        }
        
        return MathUtils.hitungIPK(mhs.totalNilaiTertimbang, mhs.totalSKSLulus);
    }
    
    // Implementation interface ISistemAkademik
    function getMahasiswa(uint256 nim) 
        external 
        view 
        override 
        returns (string memory nama, string memory jurusan) 
    {
        if (!mahasiswaExists[nim]) revert MahasiswaNotFound(nim);
        
        Mahasiswa memory mhs = mahasiswaData[nim];
        return (mhs.nama, mhs.jurusan);
    }
    
    function cekKelulusan(uint256 nim) external view override returns (bool) {
        if (!mahasiswaExists[nim]) revert MahasiswaNotFound(nim);
        
        Mahasiswa memory mhs = mahasiswaData[nim];
        uint256 ipk = MathUtils.hitungIPK(mhs.totalNilaiTertimbang, mhs.totalSKSLulus);
        
        return mhs.totalSKSLulus >= 144 && ipk >= 200; // IPK minimal 2.00
    }
    
    // Function untuk mendapatkan semua nilai mahasiswa
    function getAllNilai(uint256 nim) 
        external 
        view 
        returns (NilaiMahasiswa[] memory) 
    {
        if (!mahasiswaExists[nim]) revert MahasiswaNotFound(nim);
        return nilaiMahasiswa[nim];
    }
    
    // Internal functions
    function _sudahAdaNilai(uint256 nim, string calldata kodeMK) 
        internal 
        view 
        returns (bool) 
    {
        NilaiMahasiswa[] memory daftarNilai = nilaiMahasiswa[nim];
        
        for (uint i = 0; i < daftarNilai.length; i++) {
            if (keccak256(bytes(daftarNilai[i].kodeMK)) == keccak256(bytes(kodeMK))) {
                return true;
            }
        }
        return false;
    }
    
    function _konversiNilaiHuruf(uint8 nilaiAngka) internal pure returns (string memory) {
        if (nilaiAngka >= 85) return "A";
        if (nilaiAngka >= 70) return "B";
        if (nilaiAngka >= 60) return "C";
        if (nilaiAngka >= 50) return "D";
        return "E";
    }
    
    function _recalculateIPK(
        uint256 nim, 
        uint8 sks, 
        uint8 nilaiLama, 
        uint8 nilaiBaru
    ) internal {
        // Remove old grade contribution
        if (nilaiLama >= 60) {
            mahasiswaData[nim].totalSKSLulus -= sks;
            uint8 bobotLama = MathUtils.nilaiHurufKeAngka(_konversiNilaiHuruf(nilaiLama));
            mahasiswaData[nim].totalNilaiTertimbang -= (bobotLama * sks);
        }
        
        // Add new grade contribution
        if (nilaiBaru >= 60) {
            mahasiswaData[nim].totalSKSLulus += sks;
            uint8 bobotBaru = MathUtils.nilaiHurufKeAngka(_konversiNilaiHuruf(nilaiBaru));
            mahasiswaData[nim].totalNilaiTertimbang += (bobotBaru * sks);
        }
    }
    
    // Function untuk emergency pause (inheritance dari AccessControl)
    function pauseMahasiswa(uint256 nim) external onlyAdmin {
        if (!mahasiswaExists[nim]) revert MahasiswaNotFound(nim);
        mahasiswaData[nim].aktif = false;
    }
    
    function unpauseMahasiswa(uint256 nim) external onlyAdmin {
        if (!mahasiswaExists[nim]) revert MahasiswaNotFound(nim);
        mahasiswaData[nim].aktif = true;
    }
}

// Contract untuk demonstrasi multiple inheritance
contract SistemPembayaran is AccessControl, IPembayaranSPP {
    mapping(uint256 => uint256) private tagihan;
    mapping(uint256 => uint256) private terbayar;
    
    uint256 public constant SPP_PER_SEMESTER = 5000000; // 5 juta wei
    
    function setSPP(uint256 nim, uint256 jumlah) external onlyAdmin {
        tagihan[nim] = jumlah;
    }
    
    function bayarSPP(uint256 nim) external payable override {
        require(msg.value > 0, "Pembayaran harus lebih dari 0");
        terbayar[nim] += msg.value;
    }
    
    function cekStatusPembayaran(uint256 nim) external view override returns (bool) {
        return terbayar[nim] >= tagihan[nim];
    }
    
    function getSisaTagihan(uint256 nim) external view override returns (uint256) {
        if (terbayar[nim] >= tagihan[nim]) return 0;
        return tagihan[nim] - terbayar[nim];
    }
}
```

**Konsep Penting**:
- **Custom Errors**: Lebih gas efficient, dapat menyertakan parameter
- **Library**: Kumpulan fungsi yang dapat digunakan berulang
- **Interface**: Kontrak yang hanya mendefinisikan signature function
- **Inheritance**: Contract dapat inherit dari contract lain
- **Abstract Contract**: Contract yang tidak dapat di-deploy langsung
- **Override**: Menimpa function dari parent contract

## Solidity 105: Konsep Lanjutan (Opsional)

Ini adalah konsep yang lebih advanced. Anda bisa skip bagian ini dulu jika masih pemula.

### 1. Payable Functions (Menerima Ether)

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

// Interface untuk demonstrasi ABI encoding
interface IExternalContract {
    function processData(uint256 nim, string calldata data) external returns (bool);
    function getData(uint256 id) external view returns (string memory);
}

contract AdvancedSistemUniversitas {
    // Events untuk demonstrasi encoding
    event DataProcessed(bytes indexed encodedData, bytes4 indexed selector);
    event LowLevelCallMade(address indexed target, bytes data, bool success);
    
    // Mapping untuk menyimpan contract addresses
    mapping(string => address) public externalContracts;
    mapping(bytes4 => string) public functionNames;
    
    address public admin;
    
    constructor() {
        admin = msg.sender;
        
        // Register function selectors
        functionNames[bytes4(keccak256("processData(uint256,string)"))] = "processData";
        functionNames[bytes4(keccak256("getData(uint256)"))] = "getData";
        functionNames[bytes4(keccak256("updateStudent(uint256,string,string)"))] = "updateStudent";
    }
    
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }
    
    // Function untuk register external contract
    function registerExternalContract(string calldata name, address contractAddress) 
        external 
        onlyAdmin 
    {
        externalContracts[name] = contractAddress;
    }
    
    // Demonstrasi ABI encoding dan function selector
    function demonstrasiABIEncoding(uint256 nim, string calldata nama, string calldata jurusan) 
        external 
        pure 
        returns (
            bytes memory encodedData,
            bytes4 selector,
            bytes32 dataHash
        ) 
    {
        // ABI encode data
        encodedData = abi.encode(nim, nama, jurusan);
        
        // ABI encode packed (lebih efisien tapi tidak standard)
        bytes memory packedData = abi.encodePacked(nim, nama, jurusan);
        
        // Function selector
        selector = bytes4(keccak256("updateStudent(uint256,string,string)"));
        
        // Hash dari data
        dataHash = keccak256(encodedData);
        
        return (encodedData, selector, dataHash);
    }
    
    // Demonstrasi ABI decoding
    function demonstrasiABIDecoding(bytes calldata encodedData) 
        external 
        pure 
        returns (uint256 nim, string memory nama, string memory jurusan) 
    {
        // ABI decode
        (nim, nama, jurusan) = abi.decode(encodedData, (uint256, string, string));
        
        return (nim, nama, jurusan);
    }
    
    // Low-level call dengan error handling
    function lowLevelCall(
        string calldata contractName,
        bytes calldata data
    ) external onlyAdmin returns (bool success, bytes memory returnData) {
        address target = externalContracts[contractName];
        require(target != address(0), "Contract not registered");
        
        // Low-level call
        (success, returnData) = target.call(data);
        
        emit LowLevelCallMade(target, data, success);
        
        if (!success) {
            // Jika ada revert reason, forward error tersebut
            if (returnData.length > 0) {
                assembly {
                    let returnDataSize := mload(returnData)
                    revert(add(32, returnData), returnDataSize)
                }
            } else {
                revert("Call failed without reason");
            }
        }
        
        return (success, returnData);
    }
    
    // Delegatecall untuk proxy pattern
    function delegateCall(
        string calldata contractName,
        bytes calldata data
    ) external onlyAdmin returns (bool success, bytes memory returnData) {
        address target = externalContracts[contractName];
        require(target != address(0), "Contract not registered");
        
        // Delegatecall - executes in current contract's context
        (success, returnData) = target.delegatecall(data);
        
        require(success, "Delegatecall failed");
        
        return (success, returnData);
    }
    
    // Static call untuk read-only operations
    function staticCall(
        string calldata contractName,
        bytes calldata data
    ) external view returns (bool success, bytes memory returnData) {
        address target = externalContracts[contractName];
        require(target != address(0), "Contract not registered");
        
        // Static call - tidak bisa mengubah state
        (success, returnData) = target.staticcall(data);
        
        return (success, returnData);
    }
    
    // Function untuk create contract address prediction
    function predictContractAddress(address creator, uint256 nonce) 
        external 
        pure 
        returns (address) 
    {
        // Predict address using CREATE
        return address(uint160(uint256(keccak256(abi.encodePacked(
            bytes1(0xd6),
            bytes1(0x94),
            creator,
            nonce
        )))));
    }
    
    // Function untuk create2 address prediction
    function predictCreate2Address(
        address creator,
        bytes32 salt,
        bytes32 bytecodeHash
    ) external pure returns (address) {
        // Predict address using CREATE2
        return address(uint160(uint256(keccak256(abi.encodePacked(
            bytes1(0xff),
            creator,
            salt,
            bytecodeHash
        )))));
    }
    
    // Built-in functions demonstration
    function demonstrasiBuiltInFunctions(
        address account,
        bytes calldata signature,
        bytes32 messageHash
    ) external view returns (
        uint256 blockNumber,
        uint256 blockTimestamp,
        address blockMiner,
        uint256 gasLeft,
        bytes32 blockHash,
        address recoveredAddress,
        bool isContract
    ) {
        // Block properties
        blockNumber = block.number;
        blockTimestamp = block.timestamp;
        blockMiner = block.coinbase;
        
        // Gas
        gasLeft = gasleft();
        
        // Block hash
        blockHash = blockhash(block.number - 1);
        
        // ECRECOVER untuk verifikasi signature
        recoveredAddress = _recover(messageHash, signature);
        
        // Check if address is contract
        isContract = account.code.length > 0;
        
        return (
            blockNumber,
            blockTimestamp,
            blockMiner,
            gasLeft,
            blockHash,
            recoveredAddress,
            isContract
        );
    }
    
    // Function untuk memory dan storage operations
    function demonstrasiMemoryStorage() external pure returns (bytes32) {
        bytes32 result;
        
        assembly {
            // Allocate memory
            let memPtr := mload(0x40)
            
            // Store data in memory
            mstore(memPtr, 0x48656c6c6f20576f726c64) // "Hello World"
            
            // Load data from memory
            result := mload(memPtr)
            
            // Update free memory pointer
            mstore(0x40, add(memPtr, 0x20))
        }
        
        return result;
    }
    
    // Advanced signature verification
    function verifySignature(
        address signer,
        uint256 nim,
        string calldata data,
        bytes calldata signature
    ) external pure returns (bool) {
        // Create message hash
        bytes32 messageHash = keccak256(abi.encodePacked(nim, data));
        bytes32 ethSignedMessageHash = keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", messageHash)
        );
        
        // Recover signer
        address recoveredSigner = _recover(ethSignedMessageHash, signature);
        
        return recoveredSigner == signer;
    }
    
    // Internal function untuk ECRECOVER
    function _recover(bytes32 hash, bytes memory signature) 
        internal 
        pure 
        returns (address) 
    {
        if (signature.length != 65) {
            return address(0);
        }
        
        bytes32 r;
        bytes32 s;
        uint8 v;
        
        assembly {
            r := mload(add(signature, 32))
            s := mload(add(signature, 64))
            v := byte(0, mload(add(signature, 96)))
        }
        
        if (v < 27) v += 27;
        
        if (v != 27 && v != 28) {
            return address(0);
        }
        
        return ecrecover(hash, v, r, s);
    }
    
    // Function untuk demonstrasi inline assembly
    function assemblyExample(uint256 a, uint256 b) 
        external 
        pure 
        returns (uint256 result) 
    {
        assembly {
            // Basic arithmetic
            result := add(a, b)
            
            // Conditional
            if lt(result, a) {
                result := 0 // Overflow protection
            }
            
            // Loop
            let i := 0
            for { } lt(i, 10) { i := add(i, 1) } {
                result := add(result, i)
            }
        }
        
        return result;
    }
    
    // Fallback function untuk handle unknown function calls
    fallback() external payable {
        bytes4 selector = bytes4(msg.data);
        string memory functionName = functionNames[selector];
        
        // Log unknown function call
        emit DataProcessed(msg.data, selector);
        
        // Revert dengan informasi
        revert(string(abi.encodePacked("Unknown function: ", functionName)));
    }
    
    // Receive function untuk handle plain Ether transfers
    receive() external payable {
        // Handle plain Ether transfer
    }
    
    // Function untuk withdraw (demonstrasi built-in transfer)
    function withdraw(uint256 amount) external onlyAdmin {
        require(address(this).balance >= amount, "Insufficient balance");
        
        // Transfer menggunakan call (recommended)
        (bool success, ) = payable(admin).call{value: amount}("");
        require(success, "Transfer failed");
    }
    
    // Function untuk emergency selfdestruct
    function emergencyDestruct() external onlyAdmin {
        selfdestruct(payable(admin));
    }
}

// Contract untuk demonstrasi sebagai external contract
contract ExternalDataProcessor is IExternalContract {
    mapping(uint256 => string) private data;
    
    function processData(uint256 nim, string calldata _data) 
        external 
        override 
        returns (bool) 
    {
        data[nim] = _data;
        return true;
    }
    
    function getData(uint256 id) 
        external 
        view 
        override 
        returns (string memory) 
    {
        return data[id];
    }
}
```

**Konsep Penting**:
- **ABI Encoding/Decoding**: Cara data dikodekan untuk function calls
- **Function Selector**: 4 byte pertama dari keccak256 hash function signature
- **Low-Level Calls**: call, delegatecall, staticcall
- **Built-in Functions**: block properties, gas, ecrecover
- **Assembly**: Inline assembly untuk operasi low-level
- **CREATE/CREATE2**: Prediksi address contract yang akan dibuat

## Pengenalan Hardhat

### Testing Kontrak dan Deploy dengan Hardhat

Sekarang kita akan belajar menggunakan Hardhat untuk testing dan deployment yang lebih professional.

#### Setup Hardhat Project

1. **Buat folder project baru**:
```bash
mkdir sistem-universitas-hardhat
cd sistem-universitas-hardhat
```

2. **Initialize npm project**:
```bash
npm init -y
```

3. **Install Hardhat dan dependencies**:
```bash
npm install --save-dev hardhat
npm install --save-dev @nomicfoundation/hardhat-toolbox
npm install --save-dev @nomicfoundation/hardhat-verify
npm install --save-dev hardhat-gas-reporter
npm install --save-dev solidity-coverage
```

4. **Initialize Hardhat project**:
```bash
npx hardhat init
```

Pilih "Create a TypeScript project" dan ikuti petunjuk.

#### Struktur Project Hardhat

Setelah setup, struktur folder akan seperti ini:
```
sistem-universitas-hardhat/
├── contracts/          # Smart contracts
├── scripts/            # Deployment scripts
├── test/              # Test files
├── hardhat.config.ts  # Konfigurasi Hardhat
└── package.json
```

#### Konfigurasi Hardhat untuk 0G Network

Edit file `hardhat.config.ts`:

```typescript
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-verify";
import { vars } from "hardhat/config";
import "hardhat-gas-reporter";
import "solidity-coverage";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.30",
    settings: {
      metadata: {
        bytecodeHash: "none",      // ⬅ prevents IPFS-hash mismatch
        useLiteralContent: true,   // ⬅ embeds the full source in metadata
      },
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    // Local development network
    hardhat: {
      chainId: 31337,
    },
    // Konfigurasi untuk 0G-Galileo-Testnet
    "0gGalileoTestnet": {
      url: vars.get("OG_RPC_URL", "https://evmrpc-testnet.0g.ai"),
      chainId: 16601,
      accounts: vars.has("PRIVATE_KEY") ? [`0x${vars.get("PRIVATE_KEY")}`] : [],
      gasPrice: "auto",
    }
  },
  gasReporter: {
    enabled: true,
    currency: 'USD',
    outputFile: "gas-report.txt",
    noColors: true,
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
};

export default config;
```

#### Setup Environment Variables

Alih-alih menggunakan `.env` file, kita akan menggunakan Hardhat vars yang lebih aman:

```bash
# Set private key (ganti dengan private key Anda)
npx hardhat vars set PRIVATE_KEY

# Set RPC URL (opsional, default sudah disetting)
npx hardhat vars set OG_RPC_URL https://evmrpc-testnet.0g.ai
```

:::tip Keamanan
Hardhat vars menyimpan data terenkripsi, lebih aman daripada `.env` files.
:::

#### Contract untuk Testing

Buat file `contracts/SistemUniversitas.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract SistemUniversitas {
    struct Mahasiswa {
        string nama;
        string jurusan;
        uint8 semester;
        bool aktif;
    }
    
    mapping(uint256 => Mahasiswa) public mahasiswa;
    mapping(address => uint256) public addressKeNIM;
    address public admin;
    
    event MahasiswaRegistered(uint256 indexed nim, string nama, string jurusan);
    event StatusChanged(uint256 indexed nim, bool status);
    
    constructor() {
        admin = msg.sender;
    }
    
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }
    
    function registrasiMahasiswa(
        uint256 nim,
        string memory nama,
        string memory jurusan,
        address alamatMahasiswa
    ) public onlyAdmin {
        require(bytes(mahasiswa[nim].nama).length == 0, "NIM sudah terdaftar");
        
        mahasiswa[nim] = Mahasiswa({
            nama: nama,
            jurusan: jurusan,
            semester: 1,
            aktif: true
        });
        
        addressKeNIM[alamatMahasiswa] = nim;
        
        emit MahasiswaRegistered(nim, nama, jurusan);
    }
    
    function ubahStatus(uint256 nim, bool status) public onlyAdmin {
        require(bytes(mahasiswa[nim].nama).length > 0, "Mahasiswa tidak ditemukan");
        mahasiswa[nim].aktif = status;
        
        emit StatusChanged(nim, status);
    }
    
    function getMahasiswa(uint256 nim) public view returns (
        string memory nama,
        string memory jurusan,
        uint8 semester,
        bool aktif
    ) {
        Mahasiswa memory mhs = mahasiswa[nim];
        return (mhs.nama, mhs.jurusan, mhs.semester, mhs.aktif);
    }
    
    function getNIMFromAddress(address alamat) public view returns (uint256) {
        return addressKeNIM[alamat];
    }
}
```

### Testing dengan Hardhat

Buat file `test/SistemUniversitas.test.js`:

```javascript
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SistemUniversitas", function () {
  let sistemUniversitas;
  let admin;
  let mahasiswa1;
  let mahasiswa2;

  beforeEach(async function () {
    // Deploy contract setiap test
    [admin, mahasiswa1, mahasiswa2] = await ethers.getSigners();
    
    const SistemUniversitas = await ethers.getContractFactory("SistemUniversitas");
    sistemUniversitas = await SistemUniversitas.deploy();
    await sistemUniversitas.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set admin correctly", async function () {
      expect(await sistemUniversitas.admin()).to.equal(admin.address);
    });
  });

  describe("Registrasi Mahasiswa", function () {
    it("Should register mahasiswa successfully", async function () {
      const nim = 21110001;
      const nama = "Budi Santoso";
      const jurusan = "Teknik Informatika";

      // Register mahasiswa
      await sistemUniversitas.registrasiMahasiswa(
        nim, 
        nama, 
        jurusan, 
        mahasiswa1.address
      );

      // Verify data
      const [namaMhs, jurusanMhs, semester, aktif] = await sistemUniversitas.getMahasiswa(nim);
      
      expect(namaMhs).to.equal(nama);
      expect(jurusanMhs).to.equal(jurusan);
      expect(semester).to.equal(1);
      expect(aktif).to.equal(true);
    });

    it("Should emit MahasiswaRegistered event", async function () {
      const nim = 21110001;
      const nama = "Budi Santoso";
      const jurusan = "Teknik Informatika";

      await expect(
        sistemUniversitas.registrasiMahasiswa(nim, nama, jurusan, mahasiswa1.address)
      ).to.emit(sistemUniversitas, "MahasiswaRegistered")
       .withArgs(nim, nama, jurusan);
    });

    it("Should link address to NIM correctly", async function () {
      const nim = 21110001;
      
      await sistemUniversitas.registrasiMahasiswa(
        nim, 
        "Budi Santoso", 
        "Teknik Informatika", 
        mahasiswa1.address
      );

      expect(await sistemUniversitas.getNIMFromAddress(mahasiswa1.address))
        .to.equal(nim);
    });

    it("Should fail if not admin", async function () {
      await expect(
        sistemUniversitas.connect(mahasiswa1).registrasiMahasiswa(
          21110001,
          "Test",
          "Test Jurusan",
          mahasiswa1.address
        )
      ).to.be.revertedWith("Only admin");
    });

    it("Should fail if NIM already exists", async function () {
      const nim = 21110001;
      
      // Register pertama kali
      await sistemUniversitas.registrasiMahasiswa(
        nim, 
        "Budi Santoso", 
        "Teknik Informatika", 
        mahasiswa1.address
      );

      // Coba register lagi dengan NIM sama
      await expect(
        sistemUniversitas.registrasiMahasiswa(
          nim,
          "Andi Wijaya",
          "Sistem Informasi",
          mahasiswa2.address
        )
      ).to.be.revertedWith("NIM sudah terdaftar");
    });
  });

  describe("Ubah Status", function () {
    beforeEach(async function () {
      // Register mahasiswa dulu
      await sistemUniversitas.registrasiMahasiswa(
        21110001,
        "Budi Santoso",
        "Teknik Informatika",
        mahasiswa1.address
      );
    });

    it("Should change status successfully", async function () {
      const nim = 21110001;
      
      // Ubah status ke non-aktif
      await sistemUniversitas.ubahStatus(nim, false);
      
      const [, , , aktif] = await sistemUniversitas.getMahasiswa(nim);
      expect(aktif).to.equal(false);
    });

    it("Should emit StatusChanged event", async function () {
      const nim = 21110001;
      
      await expect(
        sistemUniversitas.ubahStatus(nim, false)
      ).to.emit(sistemUniversitas, "StatusChanged")
       .withArgs(nim, false);
    });

    it("Should fail if mahasiswa not found", async function () {
      await expect(
        sistemUniversitas.ubahStatus(99999999, false)
      ).to.be.revertedWith("Mahasiswa tidak ditemukan");
    });

    it("Should fail if not admin", async function () {
      await expect(
        sistemUniversitas.connect(mahasiswa1).ubahStatus(21110001, false)
      ).to.be.revertedWith("Only admin");
    });
  });

  describe("Get Functions", function () {
    beforeEach(async function () {
      await sistemUniversitas.registrasiMahasiswa(
        21110001,
        "Budi Santoso",
        "Teknik Informatika",
        mahasiswa1.address
      );
    });

    it("Should return correct mahasiswa data", async function () {
      const [nama, jurusan, semester, aktif] = await sistemUniversitas.getMahasiswa(21110001);
      
      expect(nama).to.equal("Budi Santoso");
      expect(jurusan).to.equal("Teknik Informatika");
      expect(semester).to.equal(1);
      expect(aktif).to.equal(true);
    });

    it("Should return correct NIM for address", async function () {
      const nim = await sistemUniversitas.getNIMFromAddress(mahasiswa1.address);
      expect(nim).to.equal(21110001);
    });

    it("Should return empty data for non-existent mahasiswa", async function () {
      const [nama, jurusan, semester, aktif] = await sistemUniversitas.getMahasiswa(99999999);
      
      expect(nama).to.equal("");
      expect(jurusan).to.equal("");
      expect(semester).to.equal(0);
      expect(aktif).to.equal(false);
    });
  });

  describe("Gas Usage", function () {
    it("Should not exceed gas limit for registration", async function () {
      const tx = await sistemUniversitas.registrasiMahasiswa(
        21110001,
        "Budi Santoso",
        "Teknik Informatika",
        mahasiswa1.address
      );
      
      const receipt = await tx.wait();
      console.log(`Gas used for registration: ${receipt.gasUsed}`);
      
      // Expect gas usage to be reasonable (under 200k gas)
      expect(receipt.gasUsed).to.be.below(200000);
    });
  });
});
```

### Menjalankan Test

```bash
# Jalankan semua test
npx hardhat test

# Jalankan test dengan gas reporting
npx hardhat test --reporter gas

# Jalankan test specific
npx hardhat test test/SistemUniversitas.test.js

# Jalankan dengan coverage
npx hardhat coverage
```

### Deploy Script

Buat file `scripts/deploy.js`:

```javascript
const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying SistemUniversitas contract...");
  
  // Get deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  
  // Get account balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "OG");
  
  // Deploy contract
  const SistemUniversitas = await ethers.getContractFactory("SistemUniversitas");
  const sistemUniversitas = await SistemUniversitas.deploy();
  
  // Wait for deployment
  await sistemUniversitas.waitForDeployment();
  
  const contractAddress = await sistemUniversitas.getAddress();
  console.log("SistemUniversitas deployed to:", contractAddress);
  
  // Verify deployment
  console.log("Verifying deployment...");
  const admin = await sistemUniversitas.admin();
  console.log("Admin address:", admin);
  
  // Save deployment info
  const deploymentInfo = {
    contractAddress: contractAddress,
    deployer: deployer.address,
    admin: admin,
    network: network.name,
    chainId: network.config.chainId,
    deployedAt: new Date().toISOString()
  };
  
  console.log("Deployment completed successfully!");
  console.log("Deployment info:", JSON.stringify(deploymentInfo, null, 2));
  
  return deploymentInfo;
}

// Handle errors
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });
```

### Deploy ke 0G Network

```bash
# Deploy ke local network (untuk testing)
npx hardhat run scripts/deploy.js

# Deploy ke 0G testnet
npx hardhat run scripts/deploy.js --network 0gGalileoTestnet

# Compile contracts
npx hardhat compile
```

### Commands yang Berguna

```bash
# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Deploy ke 0G testnet
npx hardhat run scripts/deploy.js --network 0gGalileoTestnet

# Check gas usage
npx hardhat test --reporter gas

# Generate coverage report
npx hardhat coverage
```

### Script Interaksi dengan Contract

Buat file `scripts/interact.js`:

```javascript
const { ethers } = require("hardhat");

async function main() {
  // Contract address (ganti dengan address yang sudah di-deploy)
  const contractAddress = "YOUR_CONTRACT_ADDRESS";
  
  // Get contract instance
  const SistemUniversitas = await ethers.getContractFactory("SistemUniversitas");
  const sistemUniversitas = SistemUniversitas.attach(contractAddress);
  
  // Get accounts
  const [admin, mahasiswa1] = await ethers.getSigners();
  
  console.log("Interacting with contract at:", contractAddress);
  console.log("Admin address:", admin.address);
  
  try {
    // Register mahasiswa
    console.log("\n1. Registering mahasiswa...");
    const tx1 = await sistemUniversitas.registrasiMahasiswa(
      21110001,
      "Budi Santoso",
      "Teknik Informatika",
      mahasiswa1.address
    );
    await tx1.wait();
    console.log("Mahasiswa registered successfully!");
    
    // Get mahasiswa data
    console.log("\n2. Getting mahasiswa data...");
    const [nama, jurusan, semester, aktif] = await sistemUniversitas.getMahasiswa(21110001);
    console.log(`Nama: ${nama}`);
    console.log(`Jurusan: ${jurusan}`);
    console.log(`Semester: ${semester}`);
    console.log(`Status: ${aktif ? 'Aktif' : 'Tidak Aktif'}`);
    
    // Check address to NIM mapping
    console.log("\n3. Checking address to NIM mapping...");
    const nim = await sistemUniversitas.getNIMFromAddress(mahasiswa1.address);
    console.log(`NIM for address ${mahasiswa1.address}: ${nim}`);
    
    // Change status
    console.log("\n4. Changing mahasiswa status...");
    const tx2 = await sistemUniversitas.ubahStatus(21110001, false);
    await tx2.wait();
    console.log("Status changed successfully!");
    
    // Verify status change
    const [, , , statusBaru] = await sistemUniversitas.getMahasiswa(21110001);
    console.log(`New status: ${statusBaru ? 'Aktif' : 'Tidak Aktif'}`);
    
    console.log("\n✅ All interactions completed successfully!");
    
  } catch (error) {
    console.error("❌ Interaction failed:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

### Menjalankan Script Interaksi

```bash
# Jalankan di local network
npx hardhat run scripts/interact.js

# Jalankan di 0G testnet
npx hardhat run scripts/interact.js --network 0gGalileoTestnet
```

## Kesimpulan

Selamat! Anda telah menyelesaikan tutorial lengkap Solidity dari dasar hingga advanced, serta deployment menggunakan Hardhat. Berikut rangkuman yang telah kita pelajari:

### Yang Sudah Dipelajari:

1. **Setup Awal**: Remix, MetaMask, dan konfigurasi 0G Network
2. **Solidity 101**: Variabel, fungsi, mapping dengan konteks data mahasiswa
3. **Solidity 102**: Struct, string, array dinamis untuk sistem akademik
4. **Solidity 103**: Flow control, enum, modifier, dan interaksi kontrak
5. **Solidity 104**: Error handling, library, inheritance, dan interface
6. **Solidity 105**: ABI, function selector, built-in functions, low-level calls
7. **Hardhat**: Testing profesional dan deployment ke 0G Network

### Langkah Selanjutnya:

- Eksplorasi fitur-fitur 0G lainnya seperti Storage dan Compute
- Belajar framework frontend seperti React untuk membuat UI
- Pelajari security best practices untuk smart contracts
- Bergabung dengan komunitas [Discord ETHJKT](https://discord.gg/p5b6RFEnnk)

:::tip Terus Berlatih!
Smart contract development adalah skill yang butuh banyak practice. Mulai dengan project kecil dan tingkatkan kompleksitasnya secara bertahap.
:::

---

Ready to build the next generation of decentralized applications on 0G! 🚀