---
sidebar_position: 1
title: 📜 Unit 1 — Solidity Dasar
description: Solidity dari benar-benar nol, satu konsep satu contract kecil — tipe data, function, visibility, mapping, event, require, dan payable, masing-masing langsung diuji di Remix.
---

# 📜 Unit 1 — Solidity Dasar

:::info Goal Unit Ini
Di akhir unit ini kamu akan:
- Bisa membaca dan menulis **contract Solidity sederhana** dari nol
- Paham **tipe data**, **variabel state**, dan **function**
- Paham **visibility** (`public`, `private`, `external`, `internal`) dan kapan memakainya
- Paham **mapping**, **event**, **require**, dan **payable**
- Sudah **men-deploy dan menguji sendiri** setiap konsep di browser, tanpa install apa pun
:::

:::note Prasyarat
- ✅ [Phase 0 Unit 4](../../Phase-0-Prerequisites/setup-wallet-dan-testnet) — wallet sudah siap
- 💡 Pernah ngoding bahasa apa pun akan membantu, tapi **tidak wajib**
:::

:::tip Cara unit ini bekerja — baca ini dulu
Unit ini **tidak** meminta kamu membaca teori panjang lalu berharap paham. Formatnya:

> **satu konsep → satu contract kecil → deploy → klik tombolnya → lihat hasilnya**

Setiap bagian punya blok **🧪 Coba di Remix** berisi langkah klik yang konkret beserta **hasil yang seharusnya kamu lihat.** Kalau hasilmu berbeda, kamu langsung tahu ada yang salah — bukan tiga jam kemudian.

Jangan cuma dibaca. Contract-contract di sini sengaja dibuat sangat kecil supaya kamu benar-benar mengetiknya dan menjalankannya. **Lima belas menit mengklik di Remix mengajarkan lebih banyak daripada satu jam membaca.**
:::

---

## 🤔 Apa itu Smart Contract?

**Smart contract** adalah program yang berjalan di blockchain.

Bedanya dengan program biasa:

| | Program biasa | Smart contract |
|---|---|---|
| Berjalan di | Komputer/server tertentu | Semua node blockchain |
| Bisa diubah setelah rilis? | Ya, tinggal deploy ulang | ❌ **Tidak** (secara default) |
| Menyimpan data di | Database | State blockchain |
| Biaya menjalankan | Biaya server | Gas, dibayar pemanggil |
| Siapa yang bisa memanggil | Sesuai autentikasi aplikasi | Siapa pun, kecuali kamu batasi |

:::danger Dua hal yang mengubah cara kamu ngoding
**1. Kode yang sudah di-deploy tidak bisa diubah.** Tidak ada hotfix. Bug yang lolos ke mainnet akan tetap ada selamanya, dan bisa dieksploitasi siapa pun.

**2. Siapa pun bisa memanggil function-mu.** Bukan hanya frontend buatanmu — siapa saja, dengan input apa saja, dalam urutan apa saja.

Karena itu di Solidity kamu menulis dengan pola pikir yang berbeda: **anggap setiap pemanggil adalah penyerang** sampai kamu buktikan sebaliknya.
:::

---

## 🛠️ Setup — 5 Menit, Tanpa Install

### Step 1 — Buka Remix

Buka **[remix.ethereum.org](https://remix.ethereum.org)**. Tidak perlu daftar, tidak perlu install.

Kenali empat bagiannya:

| Bagian | Isinya |
|---|---|
| **Kiri** — File Explorer | Daftar file `.sol` milikmu |
| **Tengah** — Editor | Tempat menulis kode |
| **Bawah** — Terminal | Hasil, log, dan pesan error |
| **Ikon kiri jauh** | Tab **Solidity Compiler** dan **Deploy & Run Transactions** |

### Step 2 — Pakai Remix VM dulu (bukan testnet)

Buka tab **Deploy & Run Transactions**. Di dropdown **Environment**, pilih **Remix VM** (namanya bisa `Remix VM (Cancun)` atau nama hard fork lain — tidak masalah).

Remix VM adalah **blockchain simulasi di dalam browser-mu.** Artinya:

- ✅ Gratis dan instan — tidak butuh gas sungguhan
- ✅ Tidak butuh wallet, tidak butuh faucet
- ✅ Kamu langsung dapat **beberapa akun uji** dengan saldo penuh
- ✅ Salah pun tidak ada konsekuensi apa pun

:::tip Kerjakan SEMUA latihan di unit ini pakai Remix VM
Baru di bagian terakhir kita deploy satu contract ke Injective testnet sungguhan.

Alasannya sederhana: di Remix VM tidak ada faucet yang habis, tidak ada transaksi yang lambat, dan tidak ada popup wallet setiap kali kamu mengklik tombol. Kamu bisa fokus belajar Solidity-nya dulu.
:::

### Step 3 — Kenali warna tombol di Remix

Ini kecil tapi sangat membantu. Setelah contract di-deploy, tombol function-nya diberi warna berbeda:

| Warna tombol | Artinya | Gas |
|---|---|---|
| 🔵 **Biru** | Hanya membaca (`view` / `pure`) | 🆓 Gratis |
| 🟠 **Oranye** | Mengubah state | 💰 Bayar gas |
| 🔴 **Merah** | Mengubah state **dan** bisa menerima token (`payable`) | 💰 Bayar gas |

:::note Kalau warnanya sedikit berbeda di versi Remix-mu
Aturannya tetap sama dan bisa kamu cek sendiri: **function baca hasilnya muncul seketika**, sedangkan function tulis menghasilkan **transaksi** di Terminal (dan popup wallet kalau kamu tidak sedang di Remix VM).
:::

### Step 4 — Nanti saja: sambungkan ke Injective EVM Testnet

Kamu **belum** butuh ini sekarang, tapi begini caranya nanti di bagian akhir unit:

1. Pastikan MetaMask sudah punya jaringan **Injective EVM Testnet (Chain ID `1439`)** — lihat [Phase 0 Unit 4](../../Phase-0-Prerequisites/setup-wallet-dan-testnet), atau tambahkan lewat [Chainlist](https://chainlist.org/?search=injective&testnets=true)
2. Pastikan ada testnet INJ dari [faucet](https://testnet.faucet.injective.network/)
3. Di Remix, ganti **Environment** menjadi **Injected Provider - MetaMask**
4. Pastikan MetaMask sedang memilih jaringan **Injective EVM Testnet**

:::warning Selalu cek jaringannya sebelum deploy
Saat Environment-nya **Injected Provider**, Remix men-deploy ke jaringan mana pun yang sedang aktif di MetaMask. Kalau MetaMask sedang di Ethereum Mainnet, kamu akan mencoba deploy dengan **uang sungguhan**.

Sebelum menekan Deploy, lihat dua tempat: dropdown jaringan di MetaMask, dan alamat akun di panel Remix.
:::

---

## 📘 Solidity 101 — Tipe Data, Satu per Satu

Kita pakai konteks yang dekat denganmu: **data peserta camp.**

Setiap contract di bawah ini berdiri sendiri. Buat file baru untuk masing-masing, deploy, lalu klik tombolnya.

---

### 1. String — Teks

**Apa itu:** menyimpan teks, seperti `"Budi Santoso"` atau `"Injective"`.

**Kenapa penting:** untuk nama, judul, deskripsi, dan semua data berbentuk tulisan.

Buat file `BelajarString.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract BelajarString {
    // Variabel state — tersimpan permanen di blockchain
    string public namaPeserta;

    // Constructor jalan SEKALI saja, saat contract di-deploy
    constructor() {
        namaPeserta = "Budi Santoso";
    }

    // Function untuk mengubah nama
    function ubahNama(string memory _namaBaru) public {
        namaPeserta = _namaBaru;
    }
}
```

**Penjelasan:**

- `// SPDX-License-Identifier: MIT` — penanda lisensi. Tanpa ini compiler memberi peringatan. Selalu tulis.
- `pragma solidity ^0.8.20;` — versi compiler. `^` berarti "0.8.20 ke atas, tapi di bawah 0.9.0".
- `contract BelajarString { ... }` — deklarasi contract, mirip `class` di bahasa lain.
- `string public namaPeserta;` — variabel **state**. Kata `public` otomatis membuatkan **getter**, itulah kenapa nanti ada tombolnya di Remix.
- `constructor()` — dijalankan sekali saat deploy, untuk mengisi nilai awal.
- `string memory _namaBaru` — parameter. `memory` berarti data sementara, tidak disimpan permanen.

:::info Kenapa versi compiler penting
Solidity berubah cukup sering, dan perubahannya bisa memengaruhi keamanan. Contoh nyata: **sejak versi 0.8.0, penjumlahan yang melebihi batas tipe otomatis gagal.** Sebelumnya angka akan "berputar" ke nilai terkecil tanpa peringatan — sumber banyak eksploitasi mahal di masa lalu.

Pakai 0.8.x ke atas. Selalu. Seluruh dokumentasi camp ini memakai `^0.8.20`.
:::

#### 🧪 Coba di Remix

1. Tab **Solidity Compiler** → pilih versi `0.8.20` atau lebih baru → klik **Compile**
2. Tab **Deploy & Run** → Environment **Remix VM** → klik **Deploy**
3. Buka **Deployed Contracts** di bawah, klik tombol biru `namaPeserta`

   → **Hasil: `Budi Santoso`**

4. Ketik `"Ani Wijaya"` di kolom sebelah `ubahNama` → klik `ubahNama` (tombol oranye)
5. Klik `namaPeserta` lagi

   → **Hasil: `Ani Wijaya`** ✅

:::tip Perhatikan bedanya
`namaPeserta` (biru) langsung menampilkan hasil. `ubahNama` (oranye) menghasilkan **transaksi** — lihat Terminal di bawah, ada entri baru di sana.

Itulah beda **membaca** dan **menulis** di blockchain, dan kamu baru saja melihatnya sendiri.
:::

---

### 2. uint256 — Angka

**Apa itu:** bilangan bulat **positif**, dari 0 sampai angka yang sangat besar.

**Kenapa penting:** untuk ID, jumlah, skor, saldo, timestamp — hampir semua data numerik di Web3.

Buat `BelajarAngka.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract BelajarAngka {
    uint256 public nomorPeserta;
    uint256 public poin;

    constructor() {
        nomorPeserta = 11001;
        poin = 0;
    }

    function ubahNomor(uint256 _nomorBaru) public {
        nomorPeserta = _nomorBaru;
    }

    function tambahPoin() public {
        poin = poin + 10;
        // Bisa juga ditulis singkat: poin += 10;
    }
}
```

**Penjelasan:**

- `uint256` — *unsigned integer* 256-bit. "Unsigned" artinya **tidak bisa negatif.**
- `uint` saja sama dengan `uint256`.
- `poin += 10` — cara singkat dari `poin = poin + 10`.

| Tipe | Isinya | Catatan |
|---|---|---|
| `uint256` | 0 sampai angka sangat besar | Paling umum dipakai |
| `int256` | Bilangan bulat, **bisa negatif** | Lebih jarang |
| `bool` | `true` / `false` | |
| `address` | Alamat 20-byte | Punya `.balance` |
| `string` | Teks | Lebih mahal dari `bytes32` |
| `bytes32` | 32 byte tetap | Lebih murah untuk data ukuran tetap |

:::warning Tidak ada bilangan desimal di Solidity
Solidity **tidak punya tipe float atau double.** Ini mengejutkan hampir semua pendatang baru.

Cara mengatasinya: simpan nilai dalam **satuan terkecil**. INJ punya 18 desimal, jadi 1 INJ direpresentasikan sebagai `1000000000000000000` (1 diikuti 18 nol).

```solidity
uint256 satuINJ = 1 ether;  // = 1000000000000000000
```

Kata kunci `ether` di sini hanyalah pengali `10^18` — tidak ada hubungannya dengan Ethereum. Di Injective ia bekerja sama saja karena INJ juga 18 desimal.

**Konsekuensi praktis:** pembagian membuang sisa. `7 / 2` menghasilkan `3`, bukan `3.5`. Kalau menghitung persentase, **kalikan dulu baru bagi.**
:::

#### 🧪 Coba di Remix

1. Compile → Deploy
2. Klik `poin` → **Hasil: `0`**
3. Klik `tambahPoin` **empat kali**
4. Klik `poin` lagi → **Hasil: `40`** ✅
5. Klik `nomorPeserta` → **Hasil: `11001`**
6. Ketik `-5` di `ubahNomor` lalu klik

   → **Hasil: gagal.** Remix menolaknya karena `uint256` tidak menerima angka negatif. Ini contoh compiler/encoder menyelamatkanmu dari bug.

---

### 3. bool — Benar atau Salah

**Apa itu:** hanya dua nilai, `true` atau `false`.

**Kenapa penting:** untuk status aktif/nonaktif, lulus/belum, sudah dibayar/belum — semua kondisi ya-tidak.

Buat `BelajarBoolean.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract BelajarBoolean {
    bool public sedangAktif;
    bool public sudahLulus;

    constructor() {
        sedangAktif = true;
        sudahLulus = false;
    }

    function ubahStatus(bool _status) public {
        sedangAktif = _status;
    }

    function luluskan() public {
        sudahLulus = true;
    }
}
```

**Penjelasan:**

- `bool` hanya menerima `true` atau `false` — tidak ada `1`, `0`, atau `"ya"`.
- Nilai default sebuah `bool` yang belum diisi adalah `false`.

#### 🧪 Coba di Remix

1. Compile → Deploy
2. Klik `sudahLulus` → **Hasil: `false`**
3. Klik `luluskan`
4. Klik `sudahLulus` lagi → **Hasil: `true`** ✅
5. Ketik `false` di `ubahStatus` → klik → cek `sedangAktif` → **Hasil: `false`**

---

### 4. address — Alamat Wallet

**Apa itu:** menyimpan alamat wallet atau contract, bentuknya `0x` diikuti 40 karakter heksadesimal.

**Kenapa penting:** ini dasar dari **kepemilikan** dan **kontrol akses** — siapa boleh melakukan apa.

Buat `BelajarAddress.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract BelajarAddress {
    address public admin;
    address public peserta;

    constructor() {
        admin = msg.sender;   // msg.sender = alamat yang men-deploy contract ini
    }

    function setPeserta(address _peserta) public {
        peserta = _peserta;
    }

    function siapaYangMemanggil() public view returns (address) {
        return msg.sender;
    }
}
```

**Penjelasan:**

- `msg.sender` — **alamat yang sedang memanggil function ini.** Salah satu variabel terpenting di Solidity.
- Di dalam `constructor`, `msg.sender` berarti **alamat yang men-deploy** contract.
- Di dalam function biasa, `msg.sender` berarti **siapa pun yang mengklik tombol itu.**

Variabel global lain yang sering dipakai:

| Variabel global | Isinya |
|---|---|
| `msg.sender` | Alamat pemanggil |
| `msg.value` | Jumlah token yang dikirim bersama panggilan |
| `block.timestamp` | Waktu blok saat ini (detik, Unix timestamp) |
| `block.number` | Nomor blok saat ini |
| `block.chainid` | Chain ID jaringan (Injective EVM Testnet = `1439`) |

#### 🧪 Coba di Remix

1. Compile → Deploy
2. Klik `admin`

   → **Hasil: alamatmu sendiri** — cocokkan dengan dropdown **ACCOUNT** di panel Remix. Sama, kan?

3. Sekarang bagian menariknya. Buka dropdown **ACCOUNT** di Remix, **ganti ke akun kedua**
4. Klik `siapaYangMemanggil`

   → **Hasil: alamat akun kedua**, bukan `admin`

5. Klik `admin` sekali lagi

   → **Hasil: tetap alamat akun pertama** ✅

:::tip Kamu baru saja memahami inti kontrol akses
`admin` **tidak berubah** karena disimpan sekali saat deploy. `msg.sender` **berubah** mengikuti siapa yang memanggil.

Membandingkan keduanya — `msg.sender == admin` — adalah pola di balik hampir semua izin di smart contract. Kita pakai betulan di bagian `require` nanti.

Remix VM memberimu beberapa akun uji persis supaya kamu bisa mencoba hal seperti ini. Manfaatkan.
:::

---

## 🔧 Function, `view`, dan `pure`

**Apa itu:** blok kode yang bisa dipanggil, dengan atau tanpa mengubah data.

**Kenapa penting:** menentukan apakah pemakai aplikasimu **membayar gas** atau tidak.

Buat `BelajarFunction.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract BelajarFunction {
    uint256 public hitungan;

    // Mengubah state → butuh gas
    function tambah() public {
        hitungan = hitungan + 1;
    }

    function tambahSebanyak(uint256 _jumlah) public {
        hitungan = hitungan + _jumlah;
    }

    // Hanya MEMBACA state → view
    function lihatHitungan() public view returns (uint256) {
        return hitungan;
    }

    // Tidak baca, tidak tulis state → pure
    function jumlahkan(uint256 a, uint256 b) public pure returns (uint256) {
        return a + b;
    }
}
```

### Anatomi sebuah function

```
function  tambahSebanyak  (uint256 _jumlah)  public  view  returns (uint256)
   │            │                 │             │       │           │
kata kunci     nama           parameter    visibility  sifat   nilai balik
```

### Beda `view` dan `pure`

| Kata kunci | Artinya | Biaya gas kalau dipanggil dari luar |
|---|---|---|
| *(tidak ada)* | Bisa mengubah state | 💰 Bayar gas |
| `view` | Hanya **membaca** state | 🆓 Gratis |
| `pure` | **Tidak** baca, **tidak** tulis state | 🆓 Gratis |

:::tip Kenapa ini penting untuk dipahami sejak awal
Function `view` dan `pure` gratis dipanggil dari luar chain (misalnya dari frontend) karena tidak mengubah apa pun, jadi tidak perlu masuk ke dalam blok.

Biasakan menandai function dengan benar. Selain menghemat gas pengguna aplikasimu, **compiler juga akan menangkap kesalahanmu** — kalau kamu menandai sesuatu `view` lalu tidak sengaja mengubah state, kodenya tidak akan ter-compile.
:::

#### 🧪 Coba di Remix

1. Compile → Deploy
2. Perhatikan warna tombolnya: `tambah` dan `tambahSebanyak` **oranye**, `lihatHitungan` dan `jumlahkan` **biru**
3. Klik `tambah` → lihat **Terminal**: muncul entri transaksi baru
4. Klik `lihatHitungan` → hasil `1` muncul **seketika**, dan **tidak ada transaksi baru** di Terminal ✅
5. Isi `a = 7`, `b = 5` di `jumlahkan` → klik → **Hasil: `12`**
6. Klik `hitungan` → **Hasil: tetap `1`** — `jumlahkan` memang tidak menyentuh state apa pun

:::note Eksperimen kecil yang sangat menjelaskan
Coba ubah `lihatHitungan` menjadi seperti ini, lalu compile:

```solidity
function lihatHitungan() public view returns (uint256) {
    hitungan = hitungan + 1;   // menulis state di dalam view
    return hitungan;
}
```

Compiler akan **menolaknya**. Bacalah pesan errornya sampai habis — itu contoh bagus bahwa `view` bukan sekadar hiasan, tapi janji yang ditegakkan compiler.

Kembalikan lagi setelah mencoba.
:::

---

## 👁️ Visibility — Siapa yang Boleh Memanggil

**Apa itu:** aturan tentang dari mana sebuah function atau variabel bisa diakses.

**Kenapa penting:** membatasi permukaan serang contract-mu. Semakin sedikit yang terbuka, semakin sedikit yang bisa disalahgunakan.

| Visibility | Bisa dipanggil dari |
|---|---|
| `public` | Mana saja — luar chain, contract lain, dalam contract |
| `external` | Hanya dari luar contract |
| `internal` | Dalam contract ini dan turunannya |
| `private` | **Hanya** dalam contract ini |

Buat `BelajarVisibility.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract BelajarVisibility {
    uint256 public terlihat = 1;      // otomatis punya getter
    uint256 private rahasia = 2;      // TIDAK ada getter otomatis

    function siapaPunBisa() public pure returns (string memory) {
        return "dipanggil dari mana saja";
    }

    function hanyaDariLuar() external pure returns (string memory) {
        return "hanya dari luar contract";
    }

    // Karena `rahasia` private, kita butuh function sendiri untuk membacanya
    function intipRahasia() public view returns (uint256) {
        return rahasia;
    }
}
```

#### 🧪 Coba di Remix

1. Compile → Deploy
2. Lihat daftar tombolnya: ada `terlihat`, **tidak ada** `rahasia` ✅
3. Klik `terlihat` → **Hasil: `1`**
4. Klik `intipRahasia` → **Hasil: `2`** — datanya ada, hanya tidak punya getter otomatis

:::danger `private` TIDAK berarti rahasia
Ini kesalahpahaman paling berbahaya bagi pemula Solidity, dan latihan di atas bisa menyesatkan kalau berhenti di situ.

`private` hanya membatasi **akses dari kode lain**. Tapi **semua data di blockchain bisa dibaca siapa saja** — cukup baca langsung slot penyimpanan contract-nya lewat RPC. Tidak butuh alat khusus, tidak butuh izin, dan tidak meninggalkan jejak.

Nilai `2` di atas terlihat jelas oleh siapa pun yang mau melihat, dengan atau tanpa `intipRahasia`.

**Jangan pernah menyimpan apa pun yang benar-benar rahasia di dalam smart contract.** Bukan password, bukan kunci API, bukan data pribadi. Tidak ada satu pun cara membuatnya rahasia.
:::

---

## 🗺️ Mapping — Menyimpan Data Banyak Orang

**Apa itu:** struktur kunci-nilai, mirip dictionary atau HashMap.

**Kenapa penting:** ini cara standar menyimpan data **per alamat** — saldo, kepemilikan, izin. Hampir semua contract nyata memakainya.

Buat `BelajarMapping.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract BelajarMapping {
    // Setiap alamat punya poinnya sendiri
    mapping(address => uint256) public poin;

    // Setiap nomor peserta punya namanya sendiri
    mapping(uint256 => string) public namaPeserta;

    function tambahPoinSaya(uint256 _jumlah) public {
        poin[msg.sender] = poin[msg.sender] + _jumlah;
    }

    function daftarkan(uint256 _nomor, string memory _nama) public {
        namaPeserta[_nomor] = _nama;
    }

    function lihatPoin(address _siapa) public view returns (uint256) {
        return poin[_siapa];
    }
}
```

**Penjelasan:**

- `mapping(address => uint256)` — dari alamat, ke angka.
- `poin[msg.sender]` — poin milik **si pemanggil**, bukan milik orang lain. Pola ini muncul di mana-mana.
- `public` pada mapping otomatis membuat getter yang menerima kunci sebagai input.

:::warning Dua sifat mapping yang wajib kamu tahu
1. **Semua kunci "sudah ada"** dan bernilai nol. Tidak ada konsep "key tidak ditemukan" — `poin[alamatAsing]` mengembalikan `0`, bukan error. Kalau kamu perlu membedakan "nol" dari "belum pernah ada", simpan penanda `bool` terpisah.
2. **Mapping tidak bisa di-loop.** Tidak ada cara mengambil daftar semua kunci. Kalau butuh itu, simpan array kunci secara terpisah — kita bahas array di [Unit 2](./solidity-lanjutan).
:::

#### 🧪 Coba di Remix

1. Compile → Deploy
2. Ketik `50` di `tambahPoinSaya` → klik
3. Salin alamat aktifmu dari dropdown **ACCOUNT**, tempel ke `lihatPoin` → klik

   → **Hasil: `50`**

4. **Ganti ke akun kedua** di dropdown ACCOUNT
5. Klik `lihatPoin` dengan alamat akun kedua

   → **Hasil: `0`** — poin akun pertama tidak ikut terbawa ✅

6. Dari akun kedua, ketik `7` di `tambahPoinSaya` → klik → cek lagi

   → **Hasil: `7`**, sementara akun pertama tetap `50`

7. Sekarang tempel **alamat acak** (misalnya `0x0000000000000000000000000000000000000001`) ke `lihatPoin`

   → **Hasil: `0`**, bukan error — persis seperti peringatan di atas

8. Untuk mapping kedua: ketik `11001` dan `"Budi"` di `daftarkan` → klik → ketik `11001` di `namaPeserta` → **Hasil: `Budi`**

---

## 🛡️ require — Penjaga Contract-mu

**Apa itu:** pemeriksaan kondisi. Kalau kondisinya `false`, **seluruh transaksi dibatalkan.**

**Kenapa penting:** ini alat validasi utama di Solidity. Tanpa `require`, siapa pun bisa melakukan apa pun terhadap contract-mu.

Buat `BelajarRequire.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract BelajarRequire {
    address public admin;
    mapping(address => uint256) public poin;

    constructor() {
        admin = msg.sender;
    }

    // Hanya admin yang boleh memberi poin
    function beriPoin(address _kepada, uint256 _jumlah) public {
        require(msg.sender == admin, "Hanya admin yang boleh");
        require(_jumlah > 0, "Jumlah harus lebih dari nol");

        poin[_kepada] = poin[_kepada] + _jumlah;
    }
}
```

**Penjelasan:**

- `require(kondisi, "pesan")` — kalau `kondisi` benar, kode lanjut. Kalau salah, transaksi **dibatalkan seluruhnya** dan pesan dikembalikan.
- "Dibatalkan seluruhnya" itu penting: perubahan state yang sudah terjadi **sebelum** `require` gagal pun ikut dibatalkan. Tidak ada kondisi setengah jadi.
- `msg.sender == admin` — pola kontrol akses yang kita bangun di bagian `address` tadi, sekarang dipakai betulan.

#### 🧪 Coba di Remix

1. Compile → Deploy **dari akun pertama** (akun ini jadi `admin`)
2. Salin alamat akun pertama, tempel ke `_kepada`, isi `_jumlah` = `10` → klik `beriPoin`

   → **Hasil: berhasil.** Cek `poin` dengan alamat itu → `10`

3. Coba `_jumlah` = `0` → klik `beriPoin`

   → **Hasil: GAGAL** dengan pesan `"Jumlah harus lebih dari nol"` ✅

4. Sekarang **ganti ke akun kedua** di dropdown ACCOUNT
5. Coba `beriPoin` lagi dengan jumlah berapa pun

   → **Hasil: GAGAL** dengan pesan `"Hanya admin yang boleh"` ✅

6. Buka **Terminal** di bawah dan baca detail transaksi yang gagal — di sana tertulis alasan `revert`-nya

:::tip Sengaja bikin gagal — ini latihan yang paling berharga
Kebanyakan orang hanya menguji jalur yang berhasil. Padahal di Web3, **jalur yang gagal justru yang melindungi uang orang.**

Biasakan bertanya untuk setiap function yang kamu tulis: *"siapa yang seharusnya TIDAK boleh memanggil ini, dan apa yang terjadi kalau mereka mencobanya?"*
:::

---

## 📢 Event — Cara Contract Berbicara ke Dunia Luar

**Apa itu:** log yang dipancarkan contract dan bisa didengarkan aplikasi di luar chain.

**Kenapa penting:** jauh lebih murah daripada menyimpan data di state, dan ini cara frontend tahu bahwa sesuatu telah terjadi.

Buat `BelajarEvent.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract BelajarEvent {
    mapping(address => uint256) public poin;

    // Deklarasi event
    event PoinDitambah(address indexed kepada, uint256 jumlah, uint256 totalSekarang);

    function tambahPoin(uint256 _jumlah) public {
        require(_jumlah > 0, "Jumlah harus lebih dari nol");

        poin[msg.sender] = poin[msg.sender] + _jumlah;

        // Pancarkan event
        emit PoinDitambah(msg.sender, _jumlah, poin[msg.sender]);
    }
}
```

**Penjelasan:**

- `event PoinDitambah(...)` — mendeklarasikan **bentuk** log-nya.
- `emit PoinDitambah(...)` — benar-benar memancarkannya.
- `indexed` — membuat parameter itu bisa **difilter**, misalnya "tampilkan semua penambahan poin untuk alamat ini". Maksimal 3 parameter `indexed` per event.

Kenapa event penting:

- **Jauh lebih murah** daripada menyimpan data di state
- Frontend bisa **mendengarkan** dan memperbarui tampilan secara realtime
- Menjadi **riwayat** aktivitas contract yang bisa dibaca explorer seperti Blockscout

:::info Event tidak bisa dibaca dari dalam contract
Event ditujukan untuk **dunia luar**. Smart contract lain tidak bisa membaca event. Kalau datanya perlu dibaca contract lain, simpan di state.
:::

#### 🧪 Coba di Remix

1. Compile → Deploy
2. Ketik `25` di `tambahPoin` → klik
3. Di **Terminal**, klik baris transaksi tadi untuk membukanya
4. Cari bagian **`logs`** dan buka

   → **Hasil: ada entri `PoinDitambah`** berisi alamatmu, `25`, dan total `25` ✅

5. Klik `tambahPoin` lagi dengan `25`, lalu lihat log-nya

   → **Hasil: `jumlah` = `25` tapi `totalSekarang` = `50`**

:::tip Inilah yang dilihat frontend
Di [Phase 3](../../Phase-3-Building/TS-SDK/setup-injective-ts-sdk) kamu akan menulis aplikasi yang mendengarkan event seperti ini untuk memperbarui tampilan tanpa perlu menanyai chain terus-menerus.

Membuka `logs` di Remix sekarang membuat bagian itu jauh lebih masuk akal nanti.
:::

---

## 💰 payable — Menerima INJ

**Apa itu:** kata kunci yang membuat function boleh **menerima token**.

**Kenapa penting:** tanpa `payable`, setiap upaya mengirim INJ ke function-mu akan gagal.

Buat `BelajarPayable.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract BelajarPayable {
    mapping(address => uint256) public setoran;

    // payable = function ini boleh menerima INJ
    function setor() public payable {
        require(msg.value > 0, "Kirim INJ lebih dari nol");

        setoran[msg.sender] = setoran[msg.sender] + msg.value;
    }

    // Saldo yang dipegang contract ini
    function saldoContract() public view returns (uint256) {
        return address(this).balance;
    }
}
```

**Penjelasan:**

- `payable` — tanpa kata ini, mengirim token ke function akan **ditolak**.
- `msg.value` — jumlah token yang ikut terkirim, **dalam satuan terkecil** (wei-nya INJ).
- `address(this).balance` — saldo yang dipegang contract ini sendiri.

:::note Remix menulis "Ether", yang kamu kirim adalah INJ
Di kolom **VALUE**, satuan yang ditawarkan Remix bernama Wei / Gwei / Finney / Ether. Nama-nama itu warisan dari Ethereum dan **tidak berubah** meski kamu berada di jaringan lain.

Di Injective, yang benar-benar berpindah adalah **INJ**. Karena INJ juga punya 18 desimal, `1 Ether` di kolom Remix berarti **1 INJ**. Anggap saja "Ether" di Remix sebagai label satuan `10^18`.
:::

#### 🧪 Coba di Remix

1. Compile → Deploy
2. Cari kolom **VALUE** di atas tombol Deploy. Isi `1` dan pilih satuan **Ether**
3. Klik `setor` (tombolnya **merah**, karena payable)
4. Klik `saldoContract`

   → **Hasil: `1000000000000000000`** — yaitu 1 INJ dalam satuan terkecil ✅

5. Klik `setoran` dengan alamatmu → **Hasil: angka yang sama**
6. Sekarang **kembalikan VALUE ke `0`**, lalu klik `setor` lagi

   → **Hasil: GAGAL** dengan pesan `"Kirim INJ lebih dari nol"` ✅

:::warning Kesalahan yang bikin orang bingung berjam-jam
Kalau kamu lupa mengisi kolom **VALUE**, `msg.value` bernilai `0` — walaupun function-nya sudah `payable`.

Menandai function `payable` hanya berarti "boleh menerima". Yang benar-benar mengirim token adalah **kolom VALUE**, terpisah dari argumen function.
:::

---

## 🧩 Tantangan — Tulis Sendiri `DataPeserta.sol`

Sekarang giliranmu. **Jangan copy-paste** — ini bagian yang benar-benar memindahkan pemahaman dari "mengerti saat dibaca" ke "bisa menulis sendiri".

### Spesifikasi

**Variabel state yang dibutuhkan:**

| Nama | Tipe | Isi |
|---|---|---|
| `nama` | `string public` | Nama peserta |
| `nomorPeserta` | `uint256 public` | Nomor peserta |
| `aktif` | `bool public` | Status keaktifan |
| `wallet` | `address public` | Alamat yang men-deploy |
| `waktuDaftar` | `uint256 public` | Waktu pendaftaran |
| `poin` | `uint256 public` | Poin, mulai dari 0 |

**Constructor** harus mengisi: `nama` = `"Budi Santoso"`, `nomorPeserta` = `11001`, `aktif` = `true`, `wallet` = alamat pen-deploy, `waktuDaftar` = waktu sekarang.

**Function yang dibutuhkan:**

| Function | Sifat | Yang dilakukan |
|---|---|---|
| `tambahPoin(uint256 _jumlah)` | `public` | Tambah poin, tolak kalau `_jumlah` nol |
| `lamaTerdaftar()` | `public view returns (uint256)` | Berapa detik sejak mendaftar |
| `nonaktifkan()` | `public` | Set `aktif` jadi `false`, **hanya boleh dipanggil `wallet`** |

### Kerangka awal

Buat file `DataPeserta.sol` dan mulai dari sini:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract DataPeserta {
    // TODO 1: Deklarasikan 6 variabel state sesuai tabel di atas
    // Petunjuk: string public nama;
    // Petunjuk: uint256 public nomorPeserta;
    // ... tulis 4 sisanya



    // TODO 2: Buat constructor yang mengisi nilai awal
    constructor() {
        // Petunjuk: nama = "Budi Santoso";
        // Petunjuk: wallet = msg.sender;
        // Petunjuk: waktuDaftar = block.timestamp;


    }

    // TODO 3: Buat tambahPoin(uint256 _jumlah)
    // Petunjuk: pakai require(_jumlah > 0, "...") lebih dulu


    // TODO 4: Buat lamaTerdaftar()
    // Petunjuk: function lamaTerdaftar() public view returns (uint256) { ... }
    // Petunjuk: return block.timestamp - waktuDaftar;


    // TODO 5: Buat nonaktifkan()
    // Petunjuk: require(msg.sender == wallet, "...") lalu ubah `aktif`


}
```

### ✅ Checklist verifikasi

- [ ] Ada 6 variabel state, semuanya `public`
- [ ] Constructor mengisi kelima nilai awal
- [ ] `tambahPoin` menolak jumlah nol
- [ ] `lamaTerdaftar` bersifat `view` dan mengembalikan `uint256`
- [ ] `nonaktifkan` hanya bisa dipanggil oleh alamat pen-deploy
- [ ] Contract ter-compile **tanpa error**

### 🧪 Cara menguji hasilmu

1. **Deploy**, lalu klik satu per satu: `nama`, `nomorPeserta`, `aktif`, `wallet`, `waktuDaftar`

   → nilainya harus sesuai constructor, dan `wallet` = alamat akun aktifmu

2. Klik `lamaTerdaftar` → **Hasil: angka kecil** (baru saja deploy)
3. **Tunggu sekitar satu menit**, klik lagi → **Hasil: bertambah sekitar 60** ✅
4. Ketik `10` di `tambahPoin` → klik → cek `poin` → **Hasil: `10`**
5. Ketik `0` di `tambahPoin` → **Hasil: GAGAL** ✅
6. **Ganti ke akun kedua** → klik `nonaktifkan` → **Hasil: GAGAL** ✅
7. Kembali ke akun pertama → klik `nonaktifkan` → cek `aktif` → **Hasil: `false`** ✅

:::note Kenapa `lamaTerdaftar` bisa bertambah di Remix VM
`block.timestamp` mengikuti waktu blok. Di Remix VM, blok baru dibuat setiap kali ada transaksi, dan waktunya mengikuti jam komputermu — jadi angkanya memang bertambah seiring waktu nyata.
:::

### 🛠️ Error yang paling sering muncul

| Pesan error | Artinya |
|---|---|
| `ParserError: Expected ';' but got '}'` | Lupa titik koma di akhir baris |
| `DeclarationError: Undeclared identifier` | Variabel belum dideklarasikan, atau salah ketik namanya |
| `TypeError: Member "sender" not found` | Salah tulis `msg.sender` — semuanya huruf kecil |
| `TypeError: Different number of arguments` | Jumlah parameter tidak cocok dengan deklarasinya |
| `Function declared as view but this expression modifies the state` | Ada penulisan state di dalam function `view` |

:::tip Kalau macet
1. Buka lagi contract-contract kecil di atas — semua pola yang kamu butuhkan sudah pernah muncul di sana
2. Kerjakan **satu TODO dalam satu waktu**, compile setiap selesai satu bagian. Jangan tulis semuanya lalu compile sekali di akhir
3. **Baca pesan error sampai habis**, bukan hanya baris pertama — Solidity biasanya menyebutkan nomor barisnya
4. Masih macet? Tanyakan di grup Telegram, sertakan kode dan pesan errornya
:::

---

## 🧪 Menyatukan Semuanya — Celengan Bersama

Sekarang gabungkan semua konsep tadi jadi satu contract utuh yang benar-benar memegang INJ.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title Celengan — contoh contract CLC11 Injective
/// @notice Setiap orang bisa menabung dan menarik tabungannya sendiri
contract Celengan {
    // ---- State ----
    mapping(address => uint256) private tabungan;
    uint256 public totalTersimpan;
    address public pemilik;

    // ---- Event ----
    event Menabung(address indexed penabung, uint256 jumlah);
    event Menarik(address indexed penabung, uint256 jumlah);

    // ---- Constructor: jalan sekali saat deploy ----
    constructor() {
        pemilik = msg.sender;
    }

    // ---- Menabung: payable = bisa menerima INJ ----
    function menabung() public payable {
        require(msg.value > 0, "Jumlah harus lebih dari nol");

        tabungan[msg.sender] = tabungan[msg.sender] + msg.value;
        totalTersimpan = totalTersimpan + msg.value;

        emit Menabung(msg.sender, msg.value);
    }

    // ---- Menarik tabungan sendiri ----
    function menarik(uint256 jumlah) public {
        require(tabungan[msg.sender] >= jumlah, "Tabungan tidak cukup");

        // Kurangi state DULU, baru kirim (lihat catatan di bawah)
        tabungan[msg.sender] = tabungan[msg.sender] - jumlah;
        totalTersimpan = totalTersimpan - jumlah;

        emit Menarik(msg.sender, jumlah);

        (bool sukses, ) = msg.sender.call{value: jumlah}("");
        require(sukses, "Pengiriman gagal");
    }

    // ---- Lihat tabungan sendiri ----
    function tabunganSaya() public view returns (uint256) {
        return tabungan[msg.sender];
    }
}
```

### Yang baru di contoh ini

Semua yang lain sudah kamu pakai. Yang benar-benar baru hanya satu baris:

```solidity
(bool sukses, ) = msg.sender.call{value: jumlah}("");
require(sukses, "Pengiriman gagal");
```

Ini cara **mengirim INJ dari contract ke sebuah alamat**. Nilai baliknya adalah penanda berhasil/gagal, dan kamu **wajib memeriksanya** dengan `require` — kalau tidak, kegagalan pengiriman akan lolos tanpa ketahuan.

:::danger Perhatikan urutan di function `menarik`
Kita mengurangi saldo **sebelum** mengirim token. Ini disengaja, dan namanya pola **checks-effects-interactions**:

1. **Checks** — validasi dengan `require`
2. **Effects** — ubah state
3. **Interactions** — baru kirim token atau panggil contract lain

Kalau urutannya dibalik (kirim dulu, kurangi belakangan), contract-mu rentan terhadap **reentrancy attack**: contract penerima bisa memanggil `menarik` lagi sebelum saldonya sempat dikurangi, dan menguras seluruh isi contract.

Serangan ini pernah menyebabkan salah satu kerugian terbesar dalam sejarah Ethereum. **Selalu ikuti urutan ini.** Kita bahas lebih dalam di [Unit 2](./solidity-lanjutan).
:::

#### 🧪 Coba di Remix — skenario lengkap

Kali ini kita uji seperti pengguna sungguhan, dengan dua akun.

1. Compile → Deploy dari **akun pertama**
2. Isi **VALUE** = `2` **Ether** → klik `menabung`
3. Klik `tabunganSaya` → **Hasil: `2000000000000000000`** (2 INJ)
4. Klik `totalTersimpan` → **Hasil: sama, `2000000000000000000`**
5. **Ganti ke akun kedua.** Isi VALUE = `1` Ether → klik `menabung`
6. Klik `tabunganSaya` (masih sebagai akun kedua) → **Hasil: `1000000000000000000`**
7. Klik `totalTersimpan` → **Hasil: `3000000000000000000`** — total gabungan ✅
8. Masih sebagai akun kedua, coba tarik lebih dari tabunganmu: ketik `2000000000000000000` di `menarik`

   → **Hasil: GAGAL** dengan `"Tabungan tidak cukup"` ✅
   → **Akun kedua tidak bisa menyentuh tabungan akun pertama.** Itulah gunanya `mapping` dengan `msg.sender`

9. Tarik jumlah yang wajar: ketik `500000000000000000` (0,5 INJ) → klik `menarik`
10. Cek `tabunganSaya` → **Hasil: `500000000000000000`**, dan saldo akun kedua di panel Remix bertambah
11. Buka transaksi terakhir di Terminal → **`logs`** → **Hasil: event `Menarik`** ✅

:::tip Sengaja rusak, lalu perbaiki
Setelah semuanya berhasil, coba hal-hal ini — masing-masing mengajarkan sesuatu:

- Hapus `payable` dari `menabung`, compile, dan lihat apa yang terjadi
- Ubah `require(msg.value > 0, ...)` menjadi `require(msg.value > 1 ether, ...)`, lalu coba setor 0,5 INJ
- Hapus `require(sukses, ...)` — masih ter-compile, dan itulah masalahnya. Renungkan kenapa itu berbahaya

Remix VM adalah tempat paling aman untuk salah. Manfaatkan sekarang, sebelum kodenya memegang uang sungguhan.
:::

---

## 🚀 Naik Kelas — Deploy ke Injective EVM Testnet

Semua di atas berjalan di simulasi browser. Sekarang jalankan **satu** contract di jaringan Injective sungguhan, supaya kamu merasakan bedanya.

:::note Prasyarat langkah ini
- Jaringan **Injective EVM Testnet (Chain ID `1439`)** sudah ada di MetaMask
- Ada **testnet INJ** dari [faucet](https://testnet.faucet.injective.network/)

Belum siap? Kembali ke [Phase 0 Unit 4](../../Phase-0-Prerequisites/setup-wallet-dan-testnet) dulu.
:::

1. Buka MetaMask, pilih jaringan **Injective EVM Testnet**
2. Di Remix, tab **Deploy & Run** → Environment → **Injected Provider - MetaMask**
3. Setujui permintaan koneksi dari MetaMask
4. **Periksa dulu:** alamat di panel Remix harus sama dengan alamat MetaMask-mu, dan saldonya harus menunjukkan testnet INJ-mu
5. Pilih contract `Celengan` → klik **Deploy** → **konfirmasi di MetaMask**
6. Tunggu beberapa detik sampai transaksinya masuk blok
7. Salin **alamat contract** dari Remix, lalu cari di **[Blockscout testnet](https://testnet.blockscout.injective.network/)**

   → **Hasil: contract-mu ada di explorer publik**, dengan riwayat transaksinya ✅

8. Coba `menabung` dengan VALUE kecil (misalnya `0.01` Ether = 0,01 INJ) → konfirmasi di MetaMask
9. Buka lagi di Blockscout → **Hasil: transaksinya muncul, beserta event `Menabung`**

### Apa yang berubah dibanding Remix VM?

| | Remix VM | Injective EVM Testnet |
|---|---|---|
| Kecepatan | Instan | Beberapa detik per transaksi |
| Biaya | Gratis | Gas dibayar pakai testnet INJ |
| Konfirmasi | Tidak ada | Popup MetaMask tiap transaksi |
| Siapa yang bisa melihat | Hanya kamu | **Siapa pun**, lewat explorer |
| Kalau salah | Hilang saat refresh | **Permanen** di chain |

:::tip Simpan alamat contract-mu
Catat alamat contract yang barusan kamu deploy. Kamu akan butuh alamat seperti ini di [Phase 3](../../Phase-3-Building/TS-SDK/setup-injective-ts-sdk) saat menghubungkan frontend, dan di [guided project](../../Phase-3-Building/Guided-Project/project-overview) sebagai bukti pekerjaanmu.
:::

---

## 🎯 Rangkuman

:::tip Yang Harus Kamu Ingat
- Smart contract **tidak bisa diubah** setelah deploy, dan **siapa pun bisa memanggilnya**
- Selalu pakai `pragma solidity ^0.8.x` — versi 0.8+ punya proteksi overflow bawaan
- **Tidak ada desimal** di Solidity; pakai satuan terkecil (18 desimal untuk INJ)
- `view` dan `pure` gratis dipanggil dari luar — di Remix tombolnya **biru**, dan tidak menghasilkan transaksi
- **`private` tidak berarti rahasia** — semua data on-chain bisa dibaca siapa saja
- `mapping` tidak bisa di-loop, dan semua kuncinya bernilai nol secara default
- `msg.sender` adalah dasar dari hampir semua kontrol akses; `require` adalah alat penegaknya
- `payable` hanya berarti "boleh menerima" — yang mengirim token adalah kolom **VALUE**
- **Checks → Effects → Interactions.** Ubah state sebelum mengirim token
- **Uji jalur yang gagal**, bukan hanya jalur yang berhasil
:::

### ✅ Quick Check

1. Apa beda `view` dan `pure`?
2. Kenapa `1 ether` sama dengan `1000000000000000000`?
3. Kamu menyimpan data dengan `private`. Apakah orang lain bisa membacanya? Jelaskan.
4. Function-mu sudah `payable` tapi `msg.value` selalu `0`. Apa yang paling mungkin kamu lupa?
5. Apa yang terjadi kalau kamu mengirim token **sebelum** mengurangi saldo di state?
6. Apa hasil dari `7 / 2` di Solidity?

:::note Jawaban #4 dan #6
**#4** — Kolom **VALUE** di Remix belum diisi. `payable` hanya mengizinkan penerimaan; jumlah yang dikirim ditentukan terpisah dari argumen function.

**#6** — `3`. Solidity membuang sisa pembagian. Kalau kamu butuh presisi, kalikan dulu dengan faktor skala baru bagi.
:::

---

**Lanjut:** [Unit 2 — Solidity Lanjutan](./solidity-lanjutan) 👉
