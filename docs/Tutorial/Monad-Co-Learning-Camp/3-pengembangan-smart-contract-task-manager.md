---
sidebar_position: 3
title: 3. Membuat Smart Contract TaskManager
description: Membuat smart contract TaskManager sederhana untuk mempelajari konsep Solidity seperti visibility, state variables, dan functions
keywords: [solidity, smart contract, taskmanager, visibility, state variables, functions, ethereum, monad]
---

# 3. Membuat Smart Contract TaskManager

Setelah berhasil mengkonfigurasi lingkungan pengembangan, sekarang kita akan membuat smart contract **TaskManager** yang akan mengajarkan konsep fundamental Solidity seperti visibility functions, state variables, dan berbagai jenis functions.

## 1. Membuat File Contract TaskManager

Pertama, mari kita buat file smart contract baru. Hapus file `Lock.sol` yang dibuat otomatis oleh Hardhat dan buat file baru bernama `TaskManager.sol`.

### Langkah-langkah:

1. Buka folder `contracts/` di VS Code
2. Hapus file `Lock.sol` (klik kanan → Delete)
3. Buat file baru dengan nama `TaskManager.sol`
4. Salin dan tempel kode berikut:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract TaskManager {
    // State Variables & Scope
    address public owner;           // public: bisa dibaca siapa saja
    uint256 public taskCount;       // counter tasks
    bool private isActive;          // private: hanya contract ini
    
    // Mapping: alamat -> jumlah task user
    mapping(address => uint256) public userTaskCount;
    
    // Functions dengan berbagai visibility
    constructor() {
        owner = msg.sender;         // yang deploy = owner
        isActive = true;
        taskCount = 0;
    }
    
    // View function: baca data, no gas (kecuali dipanggil dari contract)
    function getOwner() public view returns(address) {
        return owner;
    }
    
    // Pure function: no read/write state, hanya komputasi
    function calculateFee(uint256 amount) public pure returns(uint256) {
        return amount * 2 / 100;    // 2% fee
    }
    
    // Public function: bisa dipanggil dari mana saja
    function addTask() public {
        require(isActive, "Contract not active");
        taskCount++;
        userTaskCount[msg.sender]++;
    }
    
    // Private function: hanya dari dalam contract
    function _updateStatus() private {
        isActive = taskCount < 1000;
    }
}
```

## 2. Memahami Komponen Smart Contract

Mari kita analisis setiap bagian dari smart contract TaskManager untuk memahami konsep Solidity yang diterapkan:

### License dan Pragma

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;
```

- **SPDX-License-Identifier**: Menentukan lisensi untuk smart contract
- **pragma solidity**: Menentukan versi compiler Solidity yang digunakan

### State Variables dengan Visibility

```solidity
address public owner;           // public: bisa dibaca siapa saja
uint256 public taskCount;       // counter tasks
bool private isActive;          // private: hanya contract ini
```

| Visibility | Deskripsi | Akses |
|------------|-----------|-------|
| **public** | Bisa diakses dari mana saja | External, Internal, Public |
| **private** | Hanya bisa diakses dari contract ini | Internal saja |
| **internal** | Bisa diakses contract ini & turunannya | Internal & Inherited |
| **external** | Hanya bisa dipanggil dari luar | External saja |

### Mapping

```solidity
mapping(address => uint256) public userTaskCount;
```

Mapping adalah struktur data key-value di Solidity yang memungkinkan kita menyimpan dan mengakses data berdasarkan kunci (key). Dalam contoh ini, kita memetakan alamat pengguna dengan jumlah task yang mereka miliki.

### Constructor

```solidity
constructor() {
    owner = msg.sender;         // yang deploy = owner
    isActive = true;
    taskCount = 0;
}
```

Constructor adalah function khusus yang:
- Dipanggil sekali saat contract di-deploy
- Digunakan untuk inisialisasi state variables
- `msg.sender` adalah alamat yang melakukan deploy contract

### Function Visibility dan Types

#### 1. View Function

```solidity
function getOwner() public view returns(address) {
    return owner;
}
```

- **view**: Function hanya membaca state, tidak mengubah
- Tidak memerlukan gas saat dipanggil dari luar blockchain
- Mengembalikan data tanpa mengubah state

#### 2. Pure Function

```solidity
function calculateFee(uint256 amount) public pure returns(uint256) {
    return amount * 2 / 100;    // 2% fee
}
```

- **pure**: Function tidak membaca atau mengubah state
- Hanya melakukan komputasi dengan parameter input
- Bersifat deterministik (input sama = output sama)

#### 3. Public Function dengan State Changes

```solidity
function addTask() public {
    require(isActive, "Contract not active");
    taskCount++;
    userTaskCount[msg.sender]++;
}
```

- **public**: Bisa dipanggil dari mana saja
- Mengubah state variables (memerlukan gas)
- Menggunakan `require()` untuk validasi

#### 4. Private Function

```solidity
function _updateStatus() private {
    isActive = taskCount < 1000;
}
```

- **private**: Hanya bisa dipanggil dari dalam contract ini
- Biasanya diawali dengan underscore (_) sebagai konvensi
- Digunakan untuk logic internal

## 3. Global Variables dan Keywords Penting

### msg.sender
```solidity
owner = msg.sender;
userTaskCount[msg.sender]++;
```

`msg.sender` adalah alamat yang memanggil function saat ini. Ini adalah salah satu global variable paling penting dalam Solidity.

### require()
```solidity
require(isActive, "Contract not active");
```

`require()` digunakan untuk validasi kondisi. Jika kondisi `false`, transaksi akan dibatalkan dan gas dikembalikan (sebagian).

## 4. Kompilasi Smart Contract

Setelah menulis smart contract, mari kita kompilasi untuk memastikan tidak ada error:

```bash
npx hardhat compile
```

Jika berhasil, Anda akan melihat output:

```
Compiled 1 Solidity file successfully
```

Jika ada error, periksa:
- Syntax Solidity sudah benar
- Import dan pragma sudah sesuai
- Tidak ada typo dalam kode

## 5. Memahami Hasil Kompilasi

Setelah kompilasi berhasil, Hardhat akan membuat beberapa folder dan file:

```
monad-taskmanager/
├── artifacts/
│   └── contracts/
│       └── TaskManager.sol/
│           ├── TaskManager.json      # ABI dan bytecode
│           └── TaskManager.dbg.json  # Debug info
├── cache/                           # Cache kompilasi
└── typechain-types/                 # TypeScript bindings
    ├── contracts/
    │   └── TaskManager.ts
    └── index.ts
```

### File Penting:

- **TaskManager.json**: Berisi ABI (Application Binary Interface) dan bytecode
- **typechain-types/**: TypeScript bindings untuk interaksi yang type-safe

## 6. Analisis Gas Usage

Smart contract yang baik harus mempertimbangkan efisiensi gas. Mari kita analisis fungsi-fungsi dalam TaskManager:

| Function | Gas Usage | Alasan |
|----------|-----------|---------|
| `getOwner()` | ~23,000 gas | View function, hanya baca storage |
| `calculateFee()` | ~21,000 gas | Pure function, hanya komputasi |
| `addTask()` | ~43,000-68,000 gas | Menulis ke storage (dua kali) |

:::tip Gas Optimization Tips
1. **Minimize Storage Writes**: Setiap write ke storage memakan banyak gas
2. **Use View/Pure Functions**: Lebih murah untuk operasi baca/komputasi
3. **Batch Operations**: Gabungkan beberapa operasi dalam satu transaksi
4. **Use Events**: Lebih murah daripada menyimpan data di storage
:::

## 7. Best Practices yang Diterapkan

Smart contract TaskManager menerapkan beberapa best practices:

### Security
- ✅ Menggunakan `require()` untuk validasi input
- ✅ Proper visibility modifiers
- ✅ Immutable owner (set di constructor)

### Code Organization
- ✅ Clear naming conventions
- ✅ Logical grouping of functions
- ✅ Appropriate comments

### Gas Efficiency
- ✅ Menggunakan view/pure functions saat memungkinkan
- ✅ Minimal storage operations

## 8. Konsep Lanjutan yang Akan Dipelajari

Dalam pengembangan selanjutnya, kita dapat memperluas TaskManager dengan:

1. **Events**: Untuk logging aktivitas
2. **Modifiers**: Untuk reusable access control
3. **Structs**: Untuk data task yang lebih kompleks
4. **Arrays**: Untuk menyimpan daftar tasks
5. **Error Handling**: Custom errors yang lebih efisien

## Kesimpulan

Pada bagian ini, kita telah berhasil:

1. Membuat smart contract TaskManager dengan berbagai konsep Solidity
2. Memahami visibility functions (public, private, view, pure)
3. Menerapkan state variables dengan scope yang tepat
4. Menggunakan mapping untuk penyimpanan data key-value
5. Menerapkan validasi dengan require()
6. Mengkompilasi contract tanpa error

Smart contract TaskManager ini memberikan fondasi yang solid untuk memahami konsep fundamental Solidity. Pada bagian selanjutnya, kita akan membuat comprehensive testing untuk memastikan contract berfungsi dengan benar sebelum deployment ke Monad Testnet.