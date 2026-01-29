---
sidebar_position: 8
title: "Rust Fundamentals untuk Web3"
description: "Belajar Rust dari dasar dengan contoh game RPG - step by step untuk pemula"
---

# 🦀 Rust Fundamentals untuk Web3

<div style={{backgroundColor: '#1e3a8a', padding: '20px', borderRadius: '10px', marginBottom: '20px', border: '2px solid #3b82f6'}}>
  <h3 style={{color: '#60a5fa', marginTop: 0}}>📅 Townhall Session 2 - 29 Januari 2026</h3>
  <p style={{color: '#e0e7ff', fontSize: '1.1em', marginBottom: 0}}>
    Pelajari Rust step-by-step menggunakan contoh Game RPG Character. Setiap konsep dijelaskan satu per satu dengan mudah!
  </p>
</div>

## 🎯 Apa yang Akan Dipelajari

Dalam tutorial ini kita akan belajar Rust **satu konsep per waktu** menggunakan konteks **Game RPG Character**. Sama seperti membuat karakter game, kita akan mulai dari yang paling dasar!

- ✅ **Variables & Types** - nama, level, HP
- ✅ **Ownership & Borrowing** - sistem unik Rust
- ✅ **Struct** - karakter game yang kompleks
- ✅ **Enum** - status: Idle, Fighting, Resting
- ✅ **Function & Method** - attack, heal, level up
- ✅ **Error Handling** - item tidak ada, HP habis

---

## 🚀 Setup Awal

### 1. Install Rust

**Rust** adalah bahasa pemrograman yang aman dan cepat untuk smart contract.

**Langkah-langkah:**

```bash
# Install Rust (Linux/Mac)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Install Rust (Windows)
# Download dari: https://www.rust-lang.org/tools/install

# Verifikasi instalasi
rustc --version
# Output: rustc 1.75.0 (atau lebih baru)

cargo --version
# Output: cargo 1.75.0 (atau lebih baru)
```

:::success Berhasil!
Jika muncul versi Rust, Anda siap belajar!
:::

### 2. Setup Project Rust Pertama

```bash
# Buat project baru
cargo new learn-rust
cd learn-rust

# Struktur folder
# learn-rust/
# ├── Cargo.toml  (seperti package.json)
# └── src/
#     └── main.rs (kode utama)

# Jalankan program
cargo run
# Output: Hello, world!
```

**Penjelasan:**
- `cargo` - package manager Rust (seperti npm)
- `cargo new` - membuat project baru
- `cargo run` - compile dan jalankan program
- `main.rs` - entry point program

### 3. Kenali Rust Playground

**Rust Playground** adalah tempat coding Rust online tanpa install apapun!

**Langkah-langkah:**
1. Buka [https://play.rust-lang.org](https://play.rust-lang.org)
2. Kenali bagian-bagian:
   - **Kiri**: Editor kode
   - **Atas**: Tombol RUN
   - **Bawah**: Output/hasil

:::tip Gunakan Playground!
Untuk belajar cepat, gunakan Rust Playground. Tidak perlu install apa-apa!
:::

---

## 1. Variables & Types - Data Karakter Game

Kita akan belajar **satu tipe data per waktu** menggunakan contoh karakter RPG.

### 1.1 String (Nama Karakter)

**Apa itu:** Tipe data untuk menyimpan teks seperti "Warrior Budi" atau "Mage Ani"

**Mengapa penting:** Untuk nama pemain, nama item, nama skill, dan semua data berbentuk teks

**Contoh: Nama Hero**

```rust
fn main() {
    // Immutable - tidak bisa diubah (default Rust)
    let hero_name = "Warrior Budi";
    println!("Hero: {}", hero_name);

    // Mutable - bisa diubah (harus pakai keyword mut)
    let mut current_name = "Noob Player";
    println!("Sebelum: {}", current_name);

    current_name = "Pro Player";
    println!("Sesudah: {}", current_name);
}
```

**Penjelasan:**
- `let hero_name` - variabel immutable (tidak bisa diubah)
- `let mut current_name` - variabel mutable (bisa diubah)
- `println!` - macro untuk print ke console (mirip console.log)
- `{}` - placeholder untuk variabel

**Coba di Playground:**
1. Copy code ke [Rust Playground](https://play.rust-lang.org)
2. Klik tombol **RUN**
3. Lihat output: "Hero: Warrior Budi"
4. Coba ubah `hero_name` tanpa `mut` → Error!
5. Coba ubah `current_name` dengan `mut` → Berhasil!

---

### 1.2 Number (Level, HP, MP)

**Apa itu:** Tipe data untuk menyimpan angka seperti level 5, HP 100, atau damage 25

**Mengapa penting:** Untuk statistik game, perhitungan damage, jumlah item

**Contoh: Statistik Hero**

```rust
fn main() {
    // Tipe data angka
    let level: u32 = 5;          // u32 = unsigned 32-bit (0 sampai 4 miliar)
    let health: u32 = 100;       // HP hero
    let mana: u32 = 50;          // MP hero

    println!("Level: {}", level);
    println!("HP: {}", health);
    println!("MP: {}", mana);

    // Operasi matematika dasar
    let mut current_hp: u32 = 100;
    current_hp = current_hp - 25;  // Kena damage 25
    println!("HP setelah kena damage: {}", current_hp);

    // Cara singkat dengan operator assignment
    let mut current_mp: u32 = 50;
    current_mp -= 10;  // Pakai skill, MP berkurang 10
    println!("MP setelah pakai skill: {}", current_mp);
}
```

**Penjelasan:**
- `u32` - unsigned integer 32-bit (tidak bisa negatif)
- `u64` - untuk angka lebih besar
- `i32` - signed integer (bisa negatif)
- `-=` - operator assignment (singkatan dari `current_mp = current_mp - 10`)

**Tipe Angka di Rust:**

| Tipe | Range | Kegunaan |
|------|-------|----------|
| `u8` | 0 - 255 | Level (0-100), percentage |
| `u32` | 0 - 4 miliar | HP, gold, jumlah item |
| `u64` | 0 - 18 quintillion | Token balance, timestamp |
| `i32` | -2 miliar - +2 miliar | Damage (bisa negatif = heal) |

**Coba di Playground:**
1. Copy code ke Playground
2. Klik **RUN**
3. Coba ubah `current_hp -= 25` → Lihat HP berkurang!
4. Coba buat `current_hp -= 150` → Error! (Underflow)

:::warning Underflow Error
Rust tidak bisa kurangi u32 sampai negatif! Ini fitur keamanan. Untuk perhitungan yang bisa negatif, gunakan `i32`.
:::

---

### 1.3 Boolean (Status Aktif)

**Apa itu:** Tipe data yang hanya punya dua nilai - `true` atau `false`

**Mengapa penting:** Untuk status hidup/mati, aktif/tidak, quest selesai/belum

**Contoh: Status Hero**

```rust
fn main() {
    let is_alive: bool = true;
    let is_fighting: bool = false;
    let has_sword: bool = true;

    println!("Hidup: {}", is_alive);
    println!("Bertarung: {}", is_fighting);
    println!("Punya Pedang: {}", has_sword);

    // Logic dengan boolean
    if is_alive && has_sword {
        println!("Hero siap bertarung!");
    }

    if !is_fighting {
        println!("Hero sedang idle");
    }
}
```

**Penjelasan:**
- `bool` - tipe data boolean (true/false)
- `&&` - operator AND (keduanya harus true)
- `||` - operator OR (salah satu true)
- `!` - operator NOT (kebalikan)

**Coba di Playground:**
1. Copy code dan **RUN**
2. Ubah `is_alive = false` → Lihat efeknya
3. Ubah `has_sword = false` → Apakah hero siap bertarung?

---

### 1.4 🎯 MINI CHALLENGE: Buat Hero Sendiri!

**Tujuan:** Gabungkan String, Number, dan Boolean untuk buat hero!

**Spesifikasi:**

```rust
fn main() {
    // TODO 1: Buat variabel untuk hero Anda
    let hero_name = "???";           // Isi dengan nama hero Anda
    let level: u32 = ???;            // Level 1-100
    let health: u32 = ???;           // HP hero
    let mana: u32 = ???;             // MP hero
    let is_alive: bool = ???;        // true atau false
    let has_weapon: bool = ???;      // true atau false

    // TODO 2: Print statistik hero
    println!("=== HERO STATS ===");
    println!("Nama: {}", hero_name);
    // ... print sisanya!

    // TODO 3: Simulasi pertempuran
    let mut current_hp = health;
    println!("\n=== BATTLE START ===");

    // Kena damage 30
    current_hp -= 30;
    println!("Kena serangan musuh! HP: {}", current_hp);

    // Pakai healing potion (+20 HP)
    current_hp += 20;
    println!("Pakai potion! HP: {}", current_hp);

    // TODO 4: Cek apakah hero masih hidup
    if current_hp > 0 {
        println!("Hero masih bertahan!");
    } else {
        println!("Game Over!");
    }
}
```

**Coba di Playground:**
1. Copy template di atas
2. Isi semua `???` dengan nilai yang sesuai
3. Hapus comment untuk line yang dibutuhkan
4. Klik **RUN** dan lihat hasil!

:::tip Tips
Mulai dengan nilai sederhana dulu, misal: level 10, HP 100, MP 50
:::

---

## 2. Ownership - Konsep Paling Penting di Rust

**Ownership** adalah aturan unik Rust yang membuat program aman dari bug memory!

### Analogi Mudah: Kepemilikan Pedang

Bayangkan ada pedang legendaris:

**Aturan Rust:**
1. Hanya **SATU orang** boleh pegang pedang
2. Kalau kasih ke teman, **kamu sudah tidak pegang lagi**
3. Pedang hilang kalau pemilik hilang

```rust
fn main() {
    // Budi punya pedang
    let sword = String::from("Legendary Sword");
    println!("Budi punya: {}", sword);

    // Budi kasih pedang ke Ani (ownership pindah)
    let ani_sword = sword;
    println!("Ani punya: {}", ani_sword);

    // ERROR! Budi sudah tidak punya pedang!
    // println!("Budi coba pakai lagi: {}", sword); // ❌ Error!
}
```

**Coba di Playground:**
1. Copy code di atas
2. **RUN** → Berhasil!
3. Hapus comment `//` pada baris terakhir
4. **RUN** lagi → Error! "value borrowed here after move"

**Penjelasan Error:**
- `let ani_sword = sword` → Ownership pedang PINDAH ke Ani
- `sword` sudah tidak valid lagi
- Rust mencegah Budi pakai pedang yang sudah dikasih!

### Solusi 1: Clone (Duplikat Pedang)

```rust
fn main() {
    let sword = String::from("Legendary Sword");
    println!("Budi punya: {}", sword);

    // Buat COPY pedang untuk Ani
    let ani_sword = sword.clone();
    println!("Ani punya: {}", ani_sword);

    // Sekarang Budi masih punya!
    println!("Budi masih punya: {}", sword); // ✅ OK!
}
```

**Penjelasan:**
- `.clone()` - membuat duplikat data
- Sekarang ada 2 pedang (memory lebih boros)
- Tapi keduanya valid!

**Coba di Playground:**
1. Copy code dan **RUN**
2. Lihat: Budi dan Ani sama-sama punya pedang!

### Solusi 2: Borrowing (Pinjam Pedang)

```rust
fn main() {
    let sword = String::from("Legendary Sword");

    // Ani PINJAM pedang (borrow)
    let borrowed_sword = &sword;

    println!("Budi punya: {}", sword);           // ✅ OK!
    println!("Ani pinjam: {}", borrowed_sword);  // ✅ OK!
}
```

**Penjelasan:**
- `&sword` - pinjam (borrow), ownership tidak pindah
- Budi masih pemilik, Ani cuma lihat/baca
- Seperti Ani baca buku Budi, tapi bukunya tetap milik Budi

**Aturan Borrowing:**
- Boleh banyak orang **lihat** (immutable borrow `&`)
- Hanya satu orang boleh **ubah** (mutable borrow `&mut`)

```rust
fn main() {
    let mut sword = String::from("Iron Sword");

    // Ani PINJAM untuk UBAH (mutable borrow)
    let upgrade_sword = &mut sword;
    upgrade_sword.push_str(" +5");

    println!("Upgraded: {}", sword);
    // Output: "Iron Sword +5"
}
```

**Coba di Playground:**
1. Copy code borrowing
2. **RUN** dan lihat hasilnya
3. Coba tambah `println!` lain untuk eksperimen

:::success Kunci Pemahaman
- **Move** - pindah kepemilikan (sword → ani_sword)
- **Clone** - duplikat data (dua pedang terpisah)
- **Borrow** - pinjam sementara (&sword, tidak pindah)
:::

---

## 3. Struct - Karakter Game yang Kompleks

**Apa itu:** Cara mengelompokkan data yang saling berhubungan

**Mengapa penting:** Hero punya banyak atribut: nama, level, HP, MP, inventory

### 3.1 Buat Struct Pertama

```rust
// Definisi struct (template karakter)
struct Hero {
    name: String,
    level: u32,
    health: u32,
    mana: u32,
    is_alive: bool,
}

fn main() {
    // Buat instance hero
    let budi = Hero {
        name: String::from("Warrior Budi"),
        level: 10,
        health: 150,
        mana: 50,
        is_alive: true,
    };

    // Akses field
    println!("Nama: {}", budi.name);
    println!("Level: {}", budi.level);
    println!("HP: {}", budi.health);
}
```

**Penjelasan:**
- `struct Hero { ... }` - template karakter
- `let budi = Hero { ... }` - membuat karakter baru
- `budi.name` - mengakses field tertentu
- Seperti `class` di bahasa lain tapi lebih sederhana

**Coba di Playground:**
1. Copy code dan **RUN**
2. Buat hero kedua (Ani) dengan stats berbeda
3. Print stats kedua hero

### 3.2 Struct dengan Method

**Method** adalah fungsi yang melekat pada struct

```rust
struct Hero {
    name: String,
    level: u32,
    health: u32,
    mana: u32,
}

impl Hero {
    // Method untuk menyerang
    fn attack(&self) -> u32 {
        let damage = self.level * 10;
        println!("{} menyerang dengan damage {}!", self.name, damage);
        damage
    }

    // Method untuk heal
    fn heal(&mut self, amount: u32) {
        self.health += amount;
        println!("{} heal sebesar {}. HP sekarang: {}", self.name, amount, self.health);
    }

    // Method untuk naik level
    fn level_up(&mut self) {
        self.level += 1;
        self.health += 20;
        println!("{} naik ke level {}!", self.name, self.level);
    }
}

fn main() {
    let mut hero = Hero {
        name: String::from("Budi"),
        level: 5,
        health: 100,
        mana: 50,
    };

    // Panggil method
    hero.attack();
    hero.heal(30);
    hero.level_up();
}
```

**Penjelasan:**
- `impl Hero { ... }` - implementasi method untuk struct Hero
- `&self` - borrow self (read-only, tidak ubah data)
- `&mut self` - mutable borrow (bisa ubah data)
- `hero.attack()` - memanggil method

**Coba di Playground:**
1. Copy code dan **RUN**
2. Tambahkan method `take_damage(amount: u32)`
3. Simulasi pertempuran: attack → take_damage → heal

---

## 4. Enum - Status Karakter

**Apa itu:** Tipe data dengan nilai yang sudah ditentukan sebelumnya

**Mengapa penting:** Status game: Idle, Fighting, Resting, Dead

### 4.1 Enum Sederhana

```rust
enum HeroStatus {
    Idle,       // 0
    Fighting,   // 1
    Resting,    // 2
    Dead,       // 3
}

struct Hero {
    name: String,
    health: u32,
    status: HeroStatus,
}

fn main() {
    let mut hero = Hero {
        name: String::from("Budi"),
        health: 100,
        status: HeroStatus::Idle,
    };

    // Ubah status
    hero.status = HeroStatus::Fighting;

    // Cek status dengan match
    match hero.status {
        HeroStatus::Idle => println!("{} sedang idle", hero.name),
        HeroStatus::Fighting => println!("{} sedang bertarung!", hero.name),
        HeroStatus::Resting => println!("{} sedang istirahat", hero.name),
        HeroStatus::Dead => println!("{} mati!", hero.name),
    }
}
```

**Penjelasan:**
- `enum HeroStatus { ... }` - definisi status yang mungkin
- `HeroStatus::Fighting` - set status ke Fighting
- `match` - seperti switch-case tapi lebih powerful dan aman

**Coba di Playground:**
1. Copy code dan **RUN**
2. Ubah status ke `Resting` dan lihat hasilnya
3. Tambahkan status baru: `Sleeping`

### 4.2 Enum dengan Data

```rust
enum GameAction {
    Move { x: i32, y: i32 },
    Attack { target: String, damage: u32 },
    UseItem { item: String },
    Say { message: String },
}

fn main() {
    let action1 = GameAction::Move { x: 10, y: 20 };
    let action2 = GameAction::Attack {
        target: String::from("Goblin"),
        damage: 50,
    };
    let action3 = GameAction::UseItem {
        item: String::from("Potion"),
    };

    // Process action
    match action2 {
        GameAction::Move { x, y } => {
            println!("Bergerak ke posisi ({}, {})", x, y);
        }
        GameAction::Attack { target, damage } => {
            println!("Menyerang {} dengan damage {}!", target, damage);
        }
        GameAction::UseItem { item } => {
            println!("Menggunakan {}", item);
        }
        GameAction::Say { message } => {
            println!("Berkata: {}", message);
        }
    }
}
```

**Coba di Playground:**
1. Copy code dan **RUN**
2. Process `action1` dan `action3` juga
3. Tambahkan action baru: `Defend`

---

## 5. Error Handling - Menangani Kesalahan

**Apa itu:** Cara menangani error yang aman tanpa crash

**Mengapa penting:** Item tidak ada, HP habis, level tidak cukup → harus di-handle!

### 5.1 Option - Ada atau Tidak Ada

```rust
struct Inventory {
    items: Vec<String>,
}

impl Inventory {
    fn get_item(&self, index: usize) -> Option<&String> {
        self.items.get(index)
    }
}

fn main() {
    let inventory = Inventory {
        items: vec![
            String::from("Sword"),
            String::from("Shield"),
            String::from("Potion"),
        ],
    };

    // Coba ambil item yang ada
    match inventory.get_item(0) {
        Some(item) => println!("Ditemukan: {}", item),
        None => println!("Item tidak ditemukan!"),
    }

    // Coba ambil item yang tidak ada
    match inventory.get_item(10) {
        Some(item) => println!("Ditemukan: {}", item),
        None => println!("Item tidak ditemukan!"),  // Ini yang akan jalan
    }
}
```

**Penjelasan:**
- `Option<T>` - bisa `Some(value)` atau `None`
- `Some(item)` - item ditemukan
- `None` - item tidak ditemukan
- Seperti `null` tapi lebih aman!

### 5.2 Result - Berhasil atau Error

```rust
struct Hero {
    name: String,
    health: u32,
    mana: u32,
}

impl Hero {
    fn cast_spell(&mut self, cost: u32) -> Result<(), String> {
        if self.mana < cost {
            return Err(String::from("Mana tidak cukup!"));
        }

        self.mana -= cost;
        Ok(())
    }

    fn take_damage(&mut self, damage: u32) -> Result<(), String> {
        if damage >= self.health {
            self.health = 0;
            return Err(String::from("Hero mati!"));
        }

        self.health -= damage;
        Ok(())
    }
}

fn main() {
    let mut hero = Hero {
        name: String::from("Budi"),
        health: 100,
        mana: 30,
    };

    // Coba cast spell (berhasil)
    match hero.cast_spell(20) {
        Ok(()) => println!("Spell berhasil dicast!"),
        Err(e) => println!("Error: {}", e),
    }

    // Coba cast lagi (mana tidak cukup)
    match hero.cast_spell(20) {
        Ok(()) => println!("Spell berhasil dicast!"),
        Err(e) => println!("Error: {}", e),  // "Mana tidak cukup!"
    }
}
```

**Penjelasan:**
- `Result<T, E>` - bisa `Ok(value)` atau `Err(error)`
- `Ok(())` - operasi berhasil (tanpa return value)
- `Err(String)` - operasi gagal dengan pesan error
- Wajib handle kedua case!

**Coba di Playground:**
1. Copy code dan **RUN**
2. Coba `take_damage(150)` → Hero mati
3. Tambahkan method `use_potion()` dengan error handling

---

## 🎯 FINAL CHALLENGE: RPG Battle System

**Tujuan:** Gabungkan SEMUA konsep untuk membuat sistem battle!

### Spesifikasi:

```rust
// TODO 1: Definisi enum HeroStatus
enum HeroStatus {
    // Isi dengan: Idle, Fighting, Dead
}

// TODO 2: Definisi struct Hero
struct Hero {
    name: String,
    level: u32,
    health: u32,
    max_health: u32,
    mana: u32,
    max_mana: u32,
    status: HeroStatus,
}

impl Hero {
    // TODO 3: Constructor untuk membuat Hero baru
    fn new(name: String, level: u32) -> Hero {
        let max_hp = level * 50;
        let max_mp = level * 20;

        Hero {
            name,
            level,
            health: max_hp,
            max_health: max_hp,
            mana: max_mp,
            max_mana: max_mp,
            status: HeroStatus::Idle,
        }
    }

    // TODO 4: Method attack - return damage
    fn attack(&self) -> u32 {
        // Return damage = level * 10
        // Print "{name} menyerang dengan damage {damage}!"
        todo!()
    }

    // TODO 5: Method take_damage - terima damage
    fn take_damage(&mut self, damage: u32) -> Result<(), String> {
        // Jika damage >= health:
        //   - Set health = 0
        //   - Set status = Dead
        //   - Return Err("Hero mati!")
        // Else:
        //   - Kurangi health dengan damage
        //   - Return Ok(())
        todo!()
    }

    // TODO 6: Method heal - sembuhkan HP
    fn heal(&mut self, amount: u32) {
        // Tambah health (maksimal = max_health)
        // Print "{name} heal sebesar {amount}. HP: {health}/{max_health}"
        todo!()
    }

    // TODO 7: Method is_alive - cek masih hidup
    fn is_alive(&self) -> bool {
        // Return true jika health > 0
        todo!()
    }
}

// TODO 8: Fungsi main untuk battle simulation
fn main() {
    println!("=== RPG BATTLE SYSTEM ===\n");

    // Buat 2 hero
    let mut hero1 = Hero::new(String::from("Warrior Budi"), 5);
    let mut hero2 = Hero::new(String::from("Mage Ani"), 4);

    // Battle loop
    let mut turn = 1;

    while hero1.is_alive() && hero2.is_alive() {
        println!("--- Turn {} ---", turn);

        // Hero1 menyerang Hero2
        let damage = hero1.attack();
        match hero2.take_damage(damage) {
            Ok(()) => println!("{} HP: {}", hero2.name, hero2.health),
            Err(e) => {
                println!("{}", e);
                break;
            }
        }

        // Cek apakah hero2 mati
        if !hero2.is_alive() {
            break;
        }

        // Hero2 menyerang Hero1
        let damage = hero2.attack();
        match hero1.take_damage(damage) {
            Ok(()) => println!("{} HP: {}", hero1.name, hero1.health),
            Err(e) => {
                println!("{}", e);
                break;
            }
        }

        turn += 1;
        println!();
    }

    // Umumkan pemenang
    println!("\n=== BATTLE END ===");
    if hero1.is_alive() {
        println!("Pemenang: {}", hero1.name);
    } else {
        println!("Pemenang: {}", hero2.name);
    }
}
```

### ✅ Checklist:

Sebelum submit, pastikan:

- [ ] Enum `HeroStatus` lengkap (Idle, Fighting, Dead)
- [ ] Struct `Hero` lengkap dengan semua field
- [ ] Constructor `new()` berfungsi dengan benar
- [ ] Method `attack()` return damage dan print pesan
- [ ] Method `take_damage()` handle death dengan `Result`
- [ ] Method `heal()` tidak melebihi max_health
- [ ] Method `is_alive()` return boolean yang benar
- [ ] Battle simulation berjalan tanpa error
- [ ] Program print pemenang di akhir

### 🧪 Test:

1. Copy template ke Rust Playground
2. Ganti semua `todo!()` dengan implementasi yang benar
3. Klik **RUN** → Harus tampil battle simulation
4. Lihat turn-by-turn combat
5. Lihat pengumuman pemenang

:::tip Tips Mengerjakan
1. Kerjakan satu TODO per waktu
2. Test setelah selesai satu method
3. Gunakan `println!` untuk debug
4. Jangan langsung isi semua, test step-by-step!
:::

---

## 📝 Assignment Submission

<div style={{backgroundColor: '#fef3c7', padding: '20px', borderRadius: '10px', marginBottom: '20px', border: '2px solid #f59e0b'}}>
  <h3 style={{color: '#92400e', marginTop: 0}}>🎯 Tugas: RPG Inventory System</h3>

**Requirements:**

Buat sistem inventory dengan fitur:

1. **Struct `Item`:**
   - `name: String`
   - `item_type: ItemType` (enum: Weapon, Armor, Potion)
   - `value: u32`

2. **Struct `Inventory`:**
   - `items: Vec<Item>`
   - `max_slots: usize`

3. **Method yang harus dibuat:**
   - `add_item(item: Item) -> Result<(), String>`
   - `remove_item(index: usize) -> Result<Item, String>`
   - `get_item(index: usize) -> Option<&Item>`
   - `is_full() -> bool`
   - `total_value() -> u32`

4. **Program main:**
   - Tambahkan 5 item berbeda
   - Coba tambah item saat inventory penuh → handle error
   - Remove item tertentu
   - Hitung total value semua item
   - Print semua item

**Deliverables:**
- Code lengkap di Rust Playground
- Screenshot output
- Submit link Playground ke HackQuest

**Deadline:** 31 Januari 2026, 23:59 WIB
</div>

---

## 🎓 Checklist Pembelajaran

Pastikan Anda memahami:

- [ ] Variabel: `let`, `let mut`, shadowing
- [ ] Tipe data: `String`, `u32`, `bool`
- [ ] Ownership: move, clone, borrow
- [ ] Borrowing: `&T` (immutable), `&mut T` (mutable)
- [ ] Struct: definisi dan instance
- [ ] Method: `&self`, `&mut self`
- [ ] Enum: sederhana dan dengan data
- [ ] Pattern matching dengan `match`
- [ ] `Option` untuk handle nilai yang mungkin tidak ada
- [ ] `Result` untuk error handling

---

## 🔗 Resources

### Belajar Lebih Lanjut
- [The Rust Book](https://doc.rust-lang.org/book/) - Tutorial resmi
- [Rust by Example](https://doc.rust-lang.org/rust-by-example/) - Belajar dengan praktek
- [Rustlings](https://github.com/rust-lang/rustlings) - Exercise interaktif

### Practice
- [Rust Playground](https://play.rust-lang.org/) - Online editor
- [Exercism Rust Track](https://exercism.org/tracks/rust) - Guided exercises

---

## ⏭️ Next Steps

Setelah menguasai Rust basics, lanjut ke:

1. **Stylus SDK** - Build smart contract dengan Rust
2. **Storage Patterns** - Data on-chain
3. **ERC-20 Token** - Token standard dengan Rust
4. **Deploy to Arbitrum** - Launch contract ke testnet

<div style={{backgroundColor: '#dcfce7', padding: '20px', borderRadius: '10px', marginTop: '20px', border: '2px solid #16a34a'}}>
  <strong>🎉 Selamat!</strong> Anda sudah menguasai Rust fundamentals! Ownership dan borrowing adalah konsep paling sulit. Kalau sudah paham ini, Stylus akan mudah! 💪
</div>

---

**Keep Learning! 🦀🚀**
