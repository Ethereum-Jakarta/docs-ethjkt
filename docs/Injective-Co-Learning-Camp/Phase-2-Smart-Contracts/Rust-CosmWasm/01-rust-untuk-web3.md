---
sidebar_position: 1
title: 🦀 Unit 1 — Rust untuk Web3
description: Rust secukupnya untuk menulis smart contract CosmWasm — ownership, borrowing, Result dan Option, struct, enum, dan trait, tanpa mendalami hal yang tidak kamu butuhkan.
---

# 🦀 Unit 1 — Rust untuk Web3

:::info Goal Unit Ini
Di akhir unit ini kamu akan:
- Punya **Rust terpasang** dan bisa menjalankan program pertama
- Paham **ownership dan borrowing** — konsep khas Rust yang paling membingungkan pendatang baru
- Bisa memakai **`Result` dan `Option`** untuk penanganan error
- Bisa membaca **struct, enum, dan trait** yang akan kamu temui di kode CosmWasm
:::

:::note Prasyarat
- ✅ Pernah menulis kode dalam bahasa apa pun. Kalau kamu sudah melewati [Solidity Dasar](../Solidity/solidity-dasar), itu sudah cukup
:::

:::tip Ini bukan kursus Rust lengkap
Rust adalah bahasa besar, dan menguasainya butuh berbulan-bulan. **Kamu tidak butuh itu untuk CLC11.**

Unit ini hanya mengajarkan bagian yang benar-benar kamu perlukan untuk membaca dan menulis contract CosmWasm. Kalau ada konsep Rust yang tidak disebut di sini, artinya kamu tidak membutuhkannya sekarang.

Kalau kamu merasa Rust terlalu berat, **selesaikan dulu Jalur Solidity** dan kembali ke sini nanti. Solidity mencakup Learning Track Phase 3–4; Rust hanya Phase 5.
:::

---

## 🔧 Pasang Rust

<details>
<summary><strong>macOS / Linux / WSL2</strong></summary>

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

Pilih instalasi bawaan (opsi 1). Setelah selesai, buka terminal baru atau jalankan:

```bash
source "$HOME/.cargo/env"
```

</details>

<details>
<summary><strong>Windows</strong></summary>

Kami **sangat menyarankan memakai WSL2**, bukan Windows native. Tooling CosmWasm (terutama Docker optimizer) jauh lebih lancar di Linux.

Pasang WSL2 dari PowerShell sebagai administrator:

```powershell
wsl --install
```

Restart, buka terminal Ubuntu, lalu ikuti petunjuk macOS/Linux di atas.

</details>

Verifikasi:

```bash
rustc --version
cargo --version
```

Tambahkan target WebAssembly — ini yang membuat kode Rust-mu bisa dijalankan blockchain:

```bash
rustup target add wasm32-unknown-unknown
```

:::info Kenapa target `wasm32-unknown-unknown`?
Smart contract CosmWasm dikompilasi menjadi **WebAssembly (Wasm)** — format biner portabel yang bisa dijalankan chain dengan aman dan deterministik.

Jadi kamu menulis Rust, tapi yang dikirim ke blockchain adalah Wasm. Target ini memberitahu compiler untuk menghasilkan Wasm, bukan program biasa.
:::

---

## 👋 Program Pertama

```bash
cargo new halo-injective
cd halo-injective
cargo run
```

`cargo` adalah build tool dan package manager Rust — gabungan `npm` dan build script dalam satu alat.

Buka `src/main.rs`:

```rust
fn main() {
    println!("Halo dari Injective!");
}
```

---

## 📐 Dasar Sintaks

```rust
fn main() {
    // Variabel — TIDAK bisa diubah secara default
    let nama = "Injective";

    // Kalau mau bisa diubah, tambahkan `mut`
    let mut hitungan = 0;
    hitungan += 1;

    // Tipe biasanya bisa ditebak compiler, tapi bisa ditulis eksplisit
    let angka: u64 = 42;
    let desimal: f64 = 3.14;
    let benar: bool = true;

    println!("{} - hitungan: {}, angka: {}", nama, hitungan, angka);
}
```

:::tip Perbedaan pertama dari kebanyakan bahasa
Di Rust, variabel **immutable secara default.** Kamu harus menulis `mut` secara sengaja kalau mau mengubahnya.

Ini terasa merepotkan di awal, tapi tujuannya bagus: kamu jadi sadar persis bagian mana dari programmu yang berubah. Dalam konteks smart contract yang mengelola dana orang, ini fitur yang sangat berharga.
:::

### Tipe angka

| Tipe | Isinya |
|---|---|
| `u8`, `u32`, `u64`, `u128` | Bilangan bulat tanpa tanda |
| `i32`, `i64` | Bilangan bulat bertanda |
| `f64` | Desimal |
| `bool` | `true` / `false` |
| `String` | Teks yang bisa tumbuh |
| `&str` | Potongan teks (pinjaman) |

:::warning Di CosmWasm, jangan pakai tipe angka biasa untuk token
CosmWasm menyediakan `Uint128` dan `Uint256`. Pakai itu untuk jumlah token, bukan `u128` biasa.

Alasannya: tipe CosmWasm menangani serialisasi JSON dengan benar (angka besar dikirim sebagai string, supaya tidak kehilangan presisi) dan punya operasi aritmetika yang aman terhadap overflow.
:::

---

## 🔑 Ownership — Konsep Inti Rust

Ini bagian yang membuat Rust terasa berbeda. Luangkan waktu di sini.

### Masalah yang dipecahkan Rust

Bahasa lain mengelola memori dengan salah satu dari dua cara:
- **Manual** (C/C++) — cepat, tapi mudah salah dan menimbulkan bug keamanan
- **Garbage collector** (Java, Go, JavaScript) — aman, tapi ada jeda tak terduga saat runtime

Rust memilih jalan ketiga: **compiler memeriksa aturan kepemilikan saat kompilasi.** Tidak ada garbage collector, tapi juga tidak ada kebocoran memori.

### Tiga aturan ownership

1. Setiap nilai punya satu **owner**
2. Hanya boleh ada **satu owner** pada satu waktu
3. Ketika owner keluar dari cakupannya, nilainya **dibuang**

```rust
fn main() {
    let a = String::from("halo");
    let b = a;              // kepemilikan PINDAH dari a ke b

    // println!("{}", a);   // ❌ ERROR — a sudah tidak memiliki nilainya
    println!("{}", b);      // ✅ OK
}
```

:::info Ini bukan penyalinan, tapi pemindahan
Di kebanyakan bahasa, `let b = a` akan menyalin atau membuat referensi kedua. Di Rust, kepemilikannya **berpindah** — `a` menjadi tidak valid.

Awalnya ini terasa aneh. Tapi hasilnya: mustahil ada dua bagian kode yang mengira mereka memiliki data yang sama, sehingga sekelas bug memori hilang sepenuhnya.
:::

### Borrowing — meminjam tanpa mengambil alih

Kalau kamu hanya perlu *membaca*, pinjam saja dengan `&`:

```rust
fn panjang(teks: &String) -> usize {
    teks.len()
}

fn main() {
    let kata = String::from("Injective");
    let n = panjang(&kata);        // meminjam, bukan memindahkan
    println!("{} punya {} huruf", kata, n);   // ✅ kata masih valid
}
```

Kalau perlu mengubah, pinjam secara mutable dengan `&mut`:

```rust
fn tambah_seru(teks: &mut String) {
    teks.push_str("!");
}

fn main() {
    let mut kata = String::from("Injective");
    tambah_seru(&mut kata);
    println!("{}", kata);   // Injective!
}
```

**Aturan pinjaman:** pada satu waktu, kamu boleh punya **banyak pinjaman baca** ATAU **satu pinjaman tulis** — tidak keduanya sekaligus.

:::tip Kalau compiler menolak kodemu
Ini akan sering terjadi di awal, dan itu normal. Pesan error Rust termasuk yang paling membantu di antara semua bahasa — **baca sampai selesai**, biasanya ada saran perbaikan yang tepat.

Frustrasi dengan borrow checker adalah tahap wajib yang dilewati setiap orang yang belajar Rust. Ia akan mereda.
:::

---

## 🎁 `Option` dan `Result` — Penanganan Error

Rust **tidak punya `null`** dan **tidak punya exception**. Sebagai gantinya, ketidakpastian dinyatakan secara eksplisit di dalam tipe.

### `Option` — nilainya mungkin tidak ada

```rust
fn cari_peserta(id: u32) -> Option<String> {
    if id == 1 {
        Some(String::from("Budi"))
    } else {
        None
    }
}

fn main() {
    match cari_peserta(1) {
        Some(nama) => println!("Ketemu: {}", nama),
        None => println!("Tidak ditemukan"),
    }
}
```

### `Result` — operasinya mungkin gagal

```rust
fn bagi(a: u64, b: u64) -> Result<u64, String> {
    if b == 0 {
        Err(String::from("Tidak bisa dibagi nol"))
    } else {
        Ok(a / b)
    }
}

fn main() {
    match bagi(10, 2) {
        Ok(hasil) => println!("Hasil: {}", hasil),
        Err(pesan) => println!("Error: {}", pesan),
    }
}
```

:::info Kenapa ini penting untuk smart contract
Karena compiler **memaksamu menangani kemungkinan gagal.** Kamu tidak bisa lupa — kodemu tidak akan ter-compile kalau kamu mengabaikannya.

Dalam konteks kode yang mengelola dana orang, "tidak bisa lupa menangani error" adalah jaminan yang sangat berharga. Setiap function CosmWasm mengembalikan `Result`, dan kamu akan melihat pola ini di mana-mana.
:::

### Operator `?` — jalan pintas

```rust
fn hitung(a: u64, b: u64) -> Result<u64, String> {
    let hasil = bagi(a, b)?;   // kalau Err, langsung keluar dan kembalikan Err-nya
    Ok(hasil * 2)
}
```

Tanda `?` artinya: "kalau ini `Ok`, ambil isinya dan lanjut; kalau `Err`, hentikan function dan kembalikan error itu." Kamu akan melihat `?` di hampir setiap baris kode CosmWasm.

---

## 🏗️ Struct, Enum, dan Trait

### Struct

```rust
struct Peserta {
    nama: String,
    poin: u64,
    lulus: bool,
}

impl Peserta {
    // Konstruktor (konvensi, bukan kata kunci khusus)
    fn baru(nama: String) -> Self {
        Peserta { nama, poin: 0, lulus: false }
    }

    fn tambah_poin(&mut self, jumlah: u64) {
        self.poin += jumlah;
        if self.poin >= 100 {
            self.lulus = true;
        }
    }
}

fn main() {
    let mut p = Peserta::baru(String::from("Sari"));
    p.tambah_poin(120);
    println!("{} lulus: {}", p.nama, p.lulus);
}
```

Blok `impl` berisi method milik struct itu.

### Enum

Enum di Rust jauh lebih kuat daripada di kebanyakan bahasa — setiap varian bisa membawa data sendiri.

```rust
enum Aksi {
    Menabung { jumlah: u64 },
    Menarik { jumlah: u64 },
    CekSaldo,
}

fn proses(aksi: Aksi) {
    match aksi {
        Aksi::Menabung { jumlah } => println!("Menabung {}", jumlah),
        Aksi::Menarik { jumlah } => println!("Menarik {}", jumlah),
        Aksi::CekSaldo => println!("Cek saldo"),
    }
}
```

:::tip Ingat pola ini baik-baik
**Inilah persis cara CosmWasm mendefinisikan pesan contract.** `ExecuteMsg` adalah enum seperti di atas, dan function `execute` memakai `match` untuk memilih penanganan.

Kalau kamu paham blok kode ini, kamu sudah paham struktur inti sebuah contract CosmWasm.
:::

### Trait

Trait mirip interface — sekumpulan perilaku yang bisa diimplementasikan berbagai tipe.

```rust
trait BisaDisapa {
    fn sapa(&self) -> String;
}

impl BisaDisapa for Peserta {
    fn sapa(&self) -> String {
        format!("Halo, {}!", self.nama)
    }
}
```

Di CosmWasm kamu jarang menulis trait sendiri, tapi akan sering melihat **derive**:

```rust
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq)]
struct State {
    count: u64,
    owner: String,
}
```

`#[derive(...)]` menyuruh compiler membuatkan implementasi otomatis. `Serialize`/`Deserialize` memungkinkan struct diubah ke/dari JSON — wajib untuk state dan pesan CosmWasm.

---

## 📦 Cargo & Dependensi

`Cargo.toml` adalah `package.json`-nya Rust:

```toml
[package]
name = "halo-injective"
version = "0.1.0"
edition = "2021"

[dependencies]
serde = { version = "1.0", features = ["derive"] }
```

Perintah yang sering dipakai:

```bash
cargo build          # compile
cargo run            # compile lalu jalankan
cargo test           # jalankan test
cargo check          # cek error tanpa menghasilkan binary (cepat)
cargo fmt            # rapikan format kode
cargo clippy         # saran perbaikan kode
```

:::tip `cargo check` akan jadi teman terbaikmu
Jauh lebih cepat dari `cargo build` karena tidak menghasilkan binary. Saat sedang bergulat dengan borrow checker, pakai `cargo check` untuk iterasi cepat.
:::

---

## 🎯 Rangkuman

:::tip Yang Harus Kamu Ingat
- Variabel **immutable secara default**; tambahkan `mut` kalau perlu diubah
- **Ownership**: satu nilai, satu owner. `let b = a` **memindahkan**, bukan menyalin
- **Borrowing**: `&` untuk baca, `&mut` untuk tulis. Banyak pembaca ATAU satu penulis
- **Tidak ada `null`, tidak ada exception.** Pakai `Option` dan `Result`
- Operator **`?`** meneruskan error ke atas — akan kamu lihat di setiap contract CosmWasm
- **Enum dengan data** adalah cara CosmWasm mendefinisikan pesan contract
- `#[derive(Serialize, Deserialize)]` wajib untuk state dan pesan
- Target compile: **`wasm32-unknown-unknown`**
- Di CosmWasm pakai **`Uint128`**, bukan `u128`, untuk jumlah token
:::

### ✅ Quick Check

1. Apa yang terjadi pada `a` setelah `let b = a;` untuk sebuah `String`?
2. Apa beda `&String` dan `&mut String`?
3. Kenapa Rust tidak punya `null`, dan apa penggantinya?
4. Apa fungsi operator `?`?
5. Kenapa jumlah token di CosmWasm memakai `Uint128`, bukan `u128`?

---

**Lanjut:** [Unit 2 — CosmWasm Starter](./cosmwasm-starter) 👉
