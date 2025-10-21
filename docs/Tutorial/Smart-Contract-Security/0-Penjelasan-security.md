# Apa itu Smart Contract Security?

Smart contract adalah program di blockchain yang berjalan otomatis saat syarat tertentu terpenuhi. Kontrak ini memungkinkan kesepakatan digital tanpa perantara dan banyak digunakan di DeFi, NFT, DAO, dan game blockchain.

Keamanan smart contract adalah upaya memastikan kode bebas dari bug atau celah yang bisa dieksploitasi. Karena kontrak bersifat immutable (tak bisa diubah setelah di-deploy), kesalahan bisa menyebabkan kerugian besar seperti pencurian aset atau dana terkunci selamanya. Smart contract juga bersifat publik, sehingga siapa pun bisa memeriksa dan mencari kelemahannya. Karena itu, developer harus fokus bukan hanya pada fungsionalitas, tetapi juga keamanan kontrak dari awal.

## Jenis-Jenis Hack pada Smart Contract

Berikut ini adalah jenis-jenis serangan paling umum yang digunakan untuk mengeksploitasi smart contract:

### 1. Reentrancy Attack

- Serangan di mana contract eksternal dipanggil sebelum state contract diperbarui.
- Penyerang bisa memanggil ulang fungsi dan mencuri aset berulang kali.

### 2. Precision Loss

- Hilangnya akurasi angka desimal karena Solidity hanya menyimpan bilangan bulat.
- Kesalahan kecil ini bisa menumpuk dan memengaruhi hasil akhir perhitungan.

### 3. Denial of Service (DoS)

- Menyebabkan kontrak tidak bisa berfungsi, contohnya:
  - Mengisi daftar pemenang dengan address yang selalu gagal menerima transfer.
  - Membuat gas limit terlampaui dengan input yang terlalu besar.

### 4. Front-running (MEV Exploit)

- Penyerang mengirim transaksi yang sama tapi dengan gas fee lebih tinggi agar didahulukan.

### 5. Access Control Misconfigurations

- Fungsi penting (seperti `mint()`, `withdraw()`) tidak dibatasi dengan benar.
- Dapat diakses publik tanpa `onlyOwner` atau modifier sejenis.

### 6. Business Logic

- Logic error terjadi saat aturan bisnis smart contract salah diimplementasi, membuat kontrak berjalan tidak sesuai tujuan.

## Contoh Nyata Hack yang Terjadi

### 1. **The DAO Hack (2016)**

- **Kerugian:** $60 juta ETH dicuri.
- **Penyebab:** Reentrancy pada fungsi withdraw.
- **Dampak:** Ethereum melakukan hard fork menjadi Ethereum dan Ethereum Classic.

### 2. **Parity Multisig Wallet Hack (2017)**

- **Kerugian:** $150+ juta ETH dibekukan.
- **Penyebab:** `library contract` memiliki `selfdestruct()` tanpa proteksi. Seseorang menghapusnya, membuat semua wallet tidak bisa digunakan.

### 3. **Compound Bug (2021)**

- **Kerugian:** $80 juta COMP diberikan secara tidak sengaja.
- **Penyebab:** Upgrade smart contract tanpa cukup audit menyebabkan fungsi distribusi reward salah logika.

### 4. **Ronin Bridge Hack (Axie Infinity, 2022)**

- **Kerugian:** $600+ juta.
- **Penyebab:** Validator private key dicuri, bukan bug di smart contract, tapi tetap jadi pelajaran penting tentang keamanan off-chain.

### 5. **Cream Finance Hack (2021-2022)**

- **Kerugian:** Lebih dari $100 juta total dari beberapa eksploitasi.
- **Penyebab:** Flash loan exploits dan masalah harga oracle.

## Resources

1.  [OWASP (Top 10 Smart Contract Vulnerabilities)](https://owasp.org/www-project-smart-contract-top-10/)
2.  Audit Competition:

    - [Vigilseek (Kumpulan Competition)](https://www.vigilseek.com/)
    - [Codehawks](https://codehawks.cyfrin.io/?contestType=all&ended=true&judging=true&live=true&sort=state&upcoming=true)
    - [Sherlock](https://sherlock.xyz/)
    - [Code4Arena](https://code4rena.com/audits)
    - [Cantina](https://cantina.xyz/opportunities/competitions)
    - [Immnuefi](https://immunefi.com/)

3.  [Damn Vulnerable Defi (CTF)](https://www.damnvulnerabledefi.xyz/)
4.  [Ethernaut CTF by OpenZeppelin](https://ethernaut.openzeppelin.com/)
