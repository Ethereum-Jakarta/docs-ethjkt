---
sidebar_position: 2.3
title: 2.3. Pengembangan Smart Contract Token Factory
description: Membuat smart contract untuk Token ERC20 dan Token Factory dengan fitur burning dan pelacakan
keywords: [smart contract, token, erc20, solidity, factory, monad, testnet, openzeppelin, burning, inheritance]
---

# 2.3. Pengembangan Smart Contract Token Factory

Pada bagian ini, kita akan mengembangkan dua smart contract utama: `Token.sol` untuk token ERC20 dan `TokenFactory.sol` untuk membuat token ERC20 secara dinamis. Kedua kontrak ini bekerja sama untuk memberikan platform yang fleksibel untuk pembuatan token.

## 1. Persiapan Awal

Sebelum mulai, pastikan Anda telah mengikuti bagian sebelumnya untuk menyiapkan lingkungan dan konfigurasi Hardhat. Struktur folder utama kita akan berupa:

```
monad-token-factory/
└── contracts/            # Di sini kita akan membuat smart contract
```

Mari hapus file `Lock.sol` yang dibuat secara default oleh Hardhat dan mulai dengan kontrak kita sendiri.

## 2. Membuat Token.sol

Kontrak `Token.sol` merupakan implementasi token ERC20 dengan kemampuan burning token. Kita akan menggunakan library OpenZeppelin untuk memastikan keamanan dan standar.

### 2.1. Membuat File Token.sol

1. Buat file baru bernama `Token.sol` di folder `contracts/`
2. Tambahkan kode berikut:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Token
 * @dev Contract untuk token ERC20 yang dapat dibuat oleh TokenFactory
 */
contract Token is ERC20, Ownable {
    /**
     * @dev Constructor untuk membuat token baru dengan parameter yang ditentukan
     * @param initialOwner Alamat pemilik awal token
     * @param initialSupply Jumlah awal token yang akan dicetak (dalam satuan token utuh)
     * @param tokenName Nama token yang akan dibuat
     * @param tokenSymbol Simbol token yang akan dibuat
     */
    constructor(
        address initialOwner, 
        uint256 initialSupply, 
        string memory tokenName, 
        string memory tokenSymbol
    ) 
    ERC20(tokenName, tokenSymbol)
    Ownable(initialOwner)
    {
        // Transfer kepemilikan ke pemilik awal
        _transferOwnership(initialOwner);
        
        // Mencetak token awal dengan menyesuaikan jumlah desimal
        // Contoh: 1000 token dengan 18 desimal menjadi 1000 * 10^18
        _mint(initialOwner, initialSupply * 10 ** decimals());
    }

    /**
     * @dev Fungsi untuk membakar (burn) token
     * @param burnAmount Jumlah token yang akan dibakar (dalam satuan token utuh)
     */
    function burnToken(uint256 burnAmount) public onlyOwner {
        // Cek apakah pemilik memiliki cukup token untuk dibakar
        require(balanceOf(msg.sender) >= burnAmount * 10 ** decimals(), "Error: you need more tokens");
        
        // Bakar token dari pemilik sesuai jumlah yang ditentukan
        _burn(msg.sender, burnAmount * 10 ** decimals());
    }
}
```

## 3. Membuat TokenFactory.sol

Kontrak `TokenFactory.sol` berfungsi sebagai factory untuk membuat token ERC20 dengan berbagai parameter. Kontrak ini akan melacak semua token yang telah dibuat dan memancarkan event saat token baru dibuat.

### 3.1. Membuat File TokenFactory.sol

1. Buat file baru bernama `TokenFactory.sol` di folder `contracts/`
2. Tambahkan kode berikut:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Token.sol";

/**
 * @title TokenFactory
 * @dev Contract factory untuk membuat token ERC20 baru
 */
contract TokenFactory {
    // Array untuk menyimpan alamat semua token yang telah dibuat
    address[] public createdTokens;
    
    // Event yang dipancarkan saat token baru dibuat
    event createTokenEvent(
        address indexed owner, 
        address indexed tokenAddress, 
        uint256 totalSupply
    );

    /**
     * @dev Fungsi untuk membuat token ERC20 baru
     * @param initialOwner Alamat pemilik awal token
     * @param initialSupply Jumlah awal token yang akan dicetak
     * @param tokenName Nama token yang akan dibuat
     * @param tokenSymbol Simbol token yang akan dibuat
     * @return Alamat contract token baru
     */
    function createToken(
        address initialOwner, 
        uint256 initialSupply, 
        string memory tokenName, 
        string memory tokenSymbol
    ) public returns (address) {
        // Buat instance token baru
        Token newToken = new Token(
            initialOwner, 
            initialSupply, 
            tokenName, 
            tokenSymbol
        );
        
        // Simpan alamat token dalam array
        createdTokens.push(address(newToken));
        
        // Pancarkan event dengan informasi token baru
        emit createTokenEvent(initialOwner, address(newToken), initialSupply);
        
        // Kembalikan alamat token yang baru dibuat
        return address(newToken);
    }

    /**
     * @dev Fungsi untuk mendapatkan daftar semua token yang telah dibuat
     * @return Array alamat semua token
     */
    function getAllTokens() public view returns(address[] memory) {
        return createdTokens;
    }

    /**
     * @dev Fungsi untuk mendapatkan jumlah token yang telah dibuat
     * @return Jumlah token
     */
    function getTokensCount() public view returns(uint256) {
        return createdTokens.length;
    }
}
```

## 4. Penjelasan Detail Smart Contract

### 4.1. Contract Token.sol

#### Import dan Inheritance

```solidity
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Token is ERC20, Ownable { ... }
```

Token.sol mewarisi dari dua kontrak OpenZeppelin:

1. **ERC20**: Implementasi standar ERC20 yang menyediakan fungsi dasar token seperti `transfer`, `balanceOf`, dan `approve`.
2. **Ownable**: Menambahkan sistem manajemen kepemilikan untuk membatasi akses ke fungsi tertentu.

:::info Apa itu ERC20?
ERC20 adalah standar token pada blockchain Ethereum yang mendefinisikan set aturan dan fungsi yang harus diimplementasikan token. Standar ini memungkinkan token berinteraksi dengan dApp, bursa, dan dompet dalam cara yang seragam.
:::

#### Constructor

```solidity
constructor(
    address initialOwner, 
    uint256 initialSupply, 
    string memory tokenName, 
    string memory tokenSymbol
) 
ERC20(tokenName, tokenSymbol)
Ownable(initialOwner)
{
    _transferOwnership(initialOwner);
    _mint(initialOwner, initialSupply * 10 ** decimals());
}
```

Constructor menerima 4 parameter penting:

1. **initialOwner**: Alamat yang akan menjadi pemilik token dan menerima supply awal
2. **initialSupply**: Jumlah token yang akan dicetak (dalam satuan utuh)
3. **tokenName**: Nama lengkap token (misalnya "Monad Test Token")
4. **tokenSymbol**: Simbol token (misalnya "MTT")

Constructor ini melakukan beberapa hal:
- Memanggil constructor ERC20 untuk mengatur nama dan simbol token
- Memanggil constructor Ownable untuk mengatur pemilik awal
- Mencetak token untuk pemilik awal dengan jumlah `initialSupply * 10^18`

:::tip Desimal Token
ERC20 secara default menggunakan 18 desimal, artinya 1 token utuh = 10^18 unit terkecil. Ini seperti 1 ETH = 10^18 wei. Kita mengalikan `initialSupply` dengan 10^18 untuk mencetak jumlah token yang tepat.
:::

#### Fungsi burnToken

```solidity
function burnToken(uint256 burnAmount) public onlyOwner {
    require(balanceOf(msg.sender) >= burnAmount * 10 ** decimals(), "Error: you need more tokens");
    _burn(msg.sender, burnAmount * 10 ** decimals());
}
```

Fungsi ini memungkinkan pemilik token untuk membakar (menghancurkan) sejumlah token:
- **onlyOwner**: Modifier yang memastikan hanya pemilik yang dapat memanggil fungsi ini
- **require**: Memverifikasi bahwa pemilik memiliki cukup token untuk dibakar
- **_burn**: Fungsi internal ERC20 yang mengurangi total supply dan balance pengirim

### 4.2. Contract TokenFactory.sol

#### State Variables dan Events

```solidity
address[] public createdTokens;
event createTokenEvent(address indexed owner, address indexed tokenAddress, uint256 totalSupply);
```

- **createdTokens**: Array publik yang menyimpan alamat semua token yang dibuat
- **createTokenEvent**: Event yang dipancarkan saat token baru dibuat dengan 3 parameter:
  - **owner**: Alamat pemilik token (diindeks untuk pencarian)
  - **tokenAddress**: Alamat kontrak token baru (diindeks untuk pencarian)
  - **totalSupply**: Jumlah token yang dicetak

:::info Apa itu Events?
Events dalam Solidity memungkinkan aplikasi frontend dan layanan lainnya "mendengarkan" perubahan dalam blockchain. Events terindeks memungkinkan pencarian efisien berdasarkan parameter tertentu.
:::

#### Fungsi createToken

```solidity
function createToken(
    address initialOwner, 
    uint256 initialSupply, 
    string memory tokenName, 
    string memory tokenSymbol
) public returns (address) {
    Token newToken = new Token(initialOwner, initialSupply, tokenName, tokenSymbol);
    createdTokens.push(address(newToken));
    emit createTokenEvent(initialOwner, address(newToken), initialSupply);
    return address(newToken);
}
```

Fungsi ini adalah inti dari TokenFactory:
1. Membuat instance baru dari kontrak Token dengan parameter yang diberikan
2. Menyimpan alamat token baru dalam array createdTokens
3. Memancarkan event createTokenEvent dengan informasi token
4. Mengembalikan alamat token yang baru dibuat

Siapapun dapat memanggil fungsi ini untuk membuat token baru. Ini memungkinkan fleksibilitas yang besar dalam pembuatan token.

#### Fungsi Utilitas

```solidity
function getAllTokens() public view returns(address[] memory) {
    return createdTokens;
}

function getTokensCount() public view returns(uint256) {
    return createdTokens.length;
}
```

Kedua fungsi ini menyediakan cara untuk mengakses informasi tentang token yang telah dibuat:
- **getAllTokens**: Mengembalikan array semua alamat token yang telah dibuat
- **getTokensCount**: Mengembalikan jumlah total token yang telah dibuat

## 5. Diagram Smart Contract

Berikut adalah diagram hubungan antar kontrak:

```
┌───────────────────┐     menciptakan     ┌───────────────┐     mewarisi     ┌─────────────┐
│   TokenFactory    │────────────────────>│     Token     │────────────────>│    ERC20     │
└───────────────────┘                     └───────────────┘                  └─────────────┘
         │                                        │                                 
         │                                        │                                 
         │                                        │        mewarisi     ┌─────────────┐
         │                                        └───────────────────>│   Ownable    │
         │                                                             └─────────────┘
         │                                                                    
         │     menghasilkan                                                   
         ▼                                                                    
┌───────────────────┐                                                         
│ createTokenEvent  │                                                         
└───────────────────┘                                                         
```

## 6. Pengujian Kompilasi

Sebelum melanjutkan, pastikan smart contract kita dapat dikompilasi dengan benar.

Jalankan perintah compile Hardhat:

```bash
npx hardhat compile
```

Jika kompilasi berhasil, Anda akan melihat output:

```
Compiling 4 Solidity files
Successfully compiled 4 Solidity files
```

Dan folder `artifacts/` akan dibuat dengan hasil kompilasi, serta folder `typechain-types/` yang berisi TypeScript bindings untuk contract Anda.

## 7. Praktik Terbaik dan Pertimbangan Keamanan

### 7.1. Batasan Token Factory

Token Factory yang kita buat adalah implementasi dasar. Untuk aplikasi produksi, pertimbangkan fitur tambahan:

- **Pembatasan Pembuatan**: Membatasi siapa yang dapat membuat token
- **Biaya Pembuatan**: Memungut biaya untuk pembuatan token
- **Verifikasi Parameter**: Memvalidasi parameter token (nama, simbol, supply)
- **Upgrade Mekanisme**: Memungkinkan upgrade kontrak

### 7.2. Keamanan Token ERC20

OpenZeppelin menyediakan implementasi ERC20 yang aman, tetapi pertimbangkan praktik keamanan tambahan:

- **Pausable**: Menambahkan kemampuan untuk menjeda transfer dalam keadaan darurat
- **Capped Supply**: Membatasi jumlah maksimum token yang dapat dicetak
- **Minting Bertahap**: Mencetak token sesuai jadwal alih-alih sekaligus
- **Multi-signature**: Mengharuskan beberapa tanda tangan untuk operasi penting

## Kesimpulan

Selamat! Anda telah berhasil mengembangkan dua smart contract penting:

1. **Token.sol**: Smart contract ERC20 dengan fitur burning
2. **TokenFactory.sol**: Factory untuk membuat token ERC20 baru dengan parameter kustom

Kedua kontrak ini memanfaatkan library OpenZeppelin untuk keamanan dan standar, serta menyediakan fungsionalitas untuk membuat dan mengelola token ERC20.

Pada bagian selanjutnya, kita akan membuat script deployment dan berinteraksi dengan smart contract untuk menguji fungsionalitasnya.