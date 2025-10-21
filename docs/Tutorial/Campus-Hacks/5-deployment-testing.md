---
sidebar_position: 5
title: 5. Deployment dan Testing Smart Contract
description: Membuat script deployment, testing, dan berinteraksi dengan smart contract
keywords: [hardhat, testing, deployment, smart contract, monad, testnet, token factory, typescript, test suite, coverage]
---

# 5. Deployment dan Testing Smart Contract

Setelah mengembangkan smart contract Token Factory, langkah berikutnya adalah memastikan contract bekerja dengan baik melalui testing dan kemudian men-deploy-nya ke jaringan. Pada bagian ini, kita akan mempelajari cara membuat script deployment, menguji contract dengan test suite komprehensif, dan menganalisis coverage testing.

## 1. Kompilasi Smart Contract

Sebelum melakukan deployment atau testing, kita perlu mengkompilasi smart contract untuk memastikan tidak ada error sintaks atau logic.

Jalankan perintah berikut di direktori proyek:

```bash
npx hardhat compile
```

Jika kompilasi berhasil, Anda akan melihat output seperti:

```
Compiling 4 Solidity files
Successfully compiled 4 Solidity files
```

Kompilasi akan menghasilkan:
- Folder `artifacts/` berisi hasil kompilasi ABI dan bytecode
- Folder `typechain-types/` berisi TypeScript type definitions untuk kontrak

:::tip
Jika Anda melakukan perubahan pada smart contract, selalu jalankan `npx hardhat compile` kembali untuk memperbarui artifacts.
:::

## 2. Membuat Script Deployment TokenFactory

Mari kita buat script deployment untuk men-deploy TokenFactory ke jaringan Monad Testnet. Script deployment menggunakan Hardhat dan ethers.js untuk berinteraksi dengan blockchain.

### 2.1. Membuat File Script Deployment

Buat file baru bernama `deploy-token-factory.ts` di folder `scripts/`:

```typescript
// Script untuk men-deploy TokenFactory contract
import { ethers } from "hardhat";

async function main() {
  try {
    // Mendapatkan informasi jaringan
    const network = (await ethers.provider.getNetwork()).name;
    console.log(`Deploying TokenFactory to ${network} network...`);
    
    // Mendapatkan ContractFactory dari kompilasi Solidity
    const TokenFactory = await ethers.getContractFactory("TokenFactory");
    
    // Inisialisasi deployment
    console.log("Initiating deployment transaction...");
    const tokenFactory = await TokenFactory.deploy();
    
    // Tunggu sampai contract di-deploy ke jaringan
    console.log("Waiting for deployment transaction confirmation...");
    await tokenFactory.waitForDeployment();
    
    // Dapatkan alamat contract
    const contractAddress = await tokenFactory.getAddress();
    console.log(`TokenFactory deployed successfully to: ${contractAddress}`);
    
    // Informasi tambahan untuk Monad Testnet
    if (network === "monadTestnet") {
      console.log(`\nView your contract on Monad Testnet Explorer:`);
      console.log(`https://testnet.monadexplorer.com/address/${contractAddress}`);
    }
    
    return contractAddress;
  } catch (error) {
    console.error("Deployment failed with error:");
    console.error(error);
    process.exitCode = 1;
  }
}

// Pattern untuk menangani dan melaporkan error
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

### 2.2. Penjelasan Script Deployment

Mari kita pahami langkah-langkah utama dalam script deployment:

1. **Import Library**: Mengimpor ethers dari Hardhat untuk interaksi dengan blockchain
2. **Mendapatkan Informasi Jaringan**: Mengambil nama jaringan saat ini
3. **Membuat ContractFactory**: Menggunakan `getContractFactory` untuk mendapatkan factory dari kontrak yang dikompilasi
4. **Inisialisasi Deployment**: Memanggil `deploy()` untuk memulai proses deployment
5. **Menunggu Konfirmasi**: Menggunakan `waitForDeployment()` untuk menunggu konfirmasi transaksi
6. **Mendapatkan dan Menampilkan Alamat**: Memperoleh dan menampilkan alamat kontrak yang di-deploy
7. **Informasi Tambahan**: Menampilkan link ke explorer jika di-deploy ke Monad Testnet
8. **Penanganan Error**: Menggunakan blok try-catch untuk menangani error dengan baik

## 3. Membuat Script untuk Interaksi dengan TokenFactory

Setelah TokenFactory di-deploy, kita perlu script untuk berinteraksi dengannya, seperti membuat token baru. Mari buat script untuk menciptakan token ERC20 melalui factory.

### 3.1. Membuat Script Create New Token

Buat file baru bernama `create-new-token.ts` di folder `scripts/`:

```typescript
// Script untuk membuat token baru dengan TokenFactory
import { ethers } from "hardhat";
import { TokenFactory } from "../typechain-types";

// Alamat contract TokenFactory yang sudah di-deploy
// GANTI DENGAN ALAMAT HASIL DEPLOYMENT ANDA!
const FACTORY_ADDRESS = "0x0123456789abcdef0123456789abcdef01234567";

// Parameter untuk token baru
const TOKEN_NAME = "Monad Test Token";
const TOKEN_SYMBOL = "MTT";
const INITIAL_SUPPLY = 1000000; // 1 juta token

async function main() {
  try {
    // Dapatkan signer pertama sebagai pemilik token
    const [deployer] = await ethers.getSigners();
    const ownerAddress = await deployer.getAddress();
    
    // Tampilkan detail token yang akan dibuat
    console.log(`Creating token as owner: ${ownerAddress}`);
    console.log(`Token details:`);
    console.log(`- Name: ${TOKEN_NAME}`);
    console.log(`- Symbol: ${TOKEN_SYMBOL}`);
    console.log(`- Initial Supply: ${INITIAL_SUPPLY.toLocaleString()} tokens`);
    
    // Connect ke TokenFactory yang sudah di-deploy
    const TokenFactory = await ethers.getContractFactory("TokenFactory");
    const factory = await TokenFactory.attach(FACTORY_ADDRESS) as TokenFactory;
    
    // Buat token baru
    console.log(`\nCreating new token via TokenFactory at ${FACTORY_ADDRESS}...`);
    const tx = await factory.createToken(
      ownerAddress,
      INITIAL_SUPPLY,
      TOKEN_NAME,
      TOKEN_SYMBOL
    );
    
    // Tunggu konfirmasi transaksi
    console.log(`Transaction sent, waiting for confirmation...`);
    const receipt = await tx.wait();
    
    // Ambil event createTokenEvent untuk mendapatkan alamat token baru
    const event = receipt?.logs.filter((log) => {
      try {
        const parsedLog = factory.interface.parseLog(log as any);
        return parsedLog?.name === "createTokenEvent";
      } catch {
        return false;
      }
    })[0];
    
    const parsedEvent = factory.interface.parseLog(event as any);
    const newTokenAddress = parsedEvent?.args[1];
    
    // Tampilkan informasi token yang berhasil dibuat
    console.log(`\nToken created successfully!`);
    console.log(`New token address: ${newTokenAddress}`);
    console.log(`\nView the token on Monad Testnet Explorer:`);
    console.log(`https://testnet.monadexplorer.com/address/${newTokenAddress}`);
    
    // Dapatkan jumlah token yang telah dibuat
    const tokenCount = await factory.getTokensCount();
    console.log(`\nTotal tokens created by this factory: ${tokenCount}`);
    
  } catch (error) {
    console.error("Error creating token:");
    console.error(error);
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

### 3.2. Penjelasan Script Create New Token

Script ini melakukan beberapa langkah penting:

1. **Definisi Konstanta**: Mendefinisikan alamat factory dan parameter token (nama, simbol, supply)
2. **Mendapatkan Signer**: Memperoleh signer pertama sebagai pemilik token
3. **Connect ke Contract**: Menggunakan `attach()` untuk terhubung ke kontrak yang sudah di-deploy
4. **Membuat Token**: Memanggil metode `createToken()` dengan parameter yang ditentukan
5. **Parsing Event**: Mengekstrak alamat token baru dari event yang dipancarkan
6. **Menampilkan Informasi**: Menampilkan alamat token baru dan link ke explorer
7. **Penanganan Error**: Menangkap dan menampilkan error dengan jelas

:::warning Penting
Pastikan untuk mengganti `FACTORY_ADDRESS` dengan alamat TokenFactory yang sebenarnya setelah Anda men-deploy-nya.
:::

## 4. Membuat Test Suite untuk TokenFactory

Testing adalah bagian penting dalam pengembangan smart contract. Mari buat test suite komprehensif untuk memverifikasi fungsionalitas TokenFactory.

### 4.1. Membuat File Test

Buat file `TokenFactory.test.ts` di folder `test/`:

```typescript
import { expect } from "chai";
import { ethers } from "hardhat";
import { TokenFactory, Token } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("TokenFactory Contract", function () {
  // Variabel untuk menyimpan instance contract dan akun
  let TokenFactory: any;
  let tokenFactory: TokenFactory;
  let owner: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;
  
  // Konstanta untuk test
  const TOKEN_NAME = "Test Token";
  const TOKEN_SYMBOL = "TST";
  const INITIAL_SUPPLY = 1000000; // 1 juta token
  
  // Setup sebelum setiap test case
  beforeEach(async function () {
    // Dapatkan ContractFactory dan akun untuk testing
    TokenFactory = await ethers.getContractFactory("TokenFactory");
    [owner, user1, user2] = await ethers.getSigners();
    
    // Deploy TokenFactory
    tokenFactory = await TokenFactory.deploy();
    await tokenFactory.waitForDeployment();
  });
  
  // Test suite dimulai di sini
});
```

Kode di atas menyiapkan lingkungan test dengan:
- Mengimpor library dan type yang diperlukan
- Mendefinisikan variabel untuk menyimpan instance kontrak dan akun
- Menetapkan konstanta untuk parameter token
- Membuat fungsi `beforeEach` yang berjalan sebelum setiap test case

### 4.2. Menambahkan Test untuk Deployment

Tambahkan test untuk memverifikasi kondisi awal setelah deployment:

```typescript
describe("Deployment", function() {
  it("Seharusnya memiliki jumlah token awal 0", async function () {
    expect(await tokenFactory.getTokensCount()).to.equal(0);
    expect(await tokenFactory.getAllTokens()).to.be.an('array').that.is.empty;
  });
});
```

Test ini memastikan bahwa TokenFactory memiliki array token kosong saat pertama kali di-deploy.

### 4.3. Menambahkan Test untuk Pembuatan Token

Tambahkan test untuk verifikasi pembuatan token:

```typescript
describe("Token Creation", function() {
  it("Seharusnya berhasil membuat token baru", async function () {
    // Buat token baru
    const tx = await tokenFactory.createToken(
      owner.address,
      INITIAL_SUPPLY,
      TOKEN_NAME,
      TOKEN_SYMBOL
    );
    
    // Tunggu transaksi selesai
    const receipt = await tx.wait();
    
    // Verifikasi jumlah token bertambah
    expect(await tokenFactory.getTokensCount()).to.equal(1);
    
    // Ambil alamat token yang baru dibuat
    const tokenAddresses = await tokenFactory.getAllTokens();
    expect(tokenAddresses.length).to.equal(1);
    
    // Verifikasi event dipancarkan dengan benar
    await expect(tx)
      .to.emit(tokenFactory, "createTokenEvent")
      .withArgs(owner.address, tokenAddresses[0], INITIAL_SUPPLY);
      
    // Test interaksi dengan token yang baru dibuat
    const Token = await ethers.getContractFactory("Token");
    const newToken = Token.attach(tokenAddresses[0]) as Token;
    
    // Verifikasi properti token
    expect(await newToken.name()).to.equal(TOKEN_NAME);
    expect(await newToken.symbol()).to.equal(TOKEN_SYMBOL);
    expect(await newToken.decimals()).to.equal(18);
    
    // Verifikasi supply dan balance
    const expectedSupply = ethers.parseUnits(INITIAL_SUPPLY.toString(), 18);
    expect(await newToken.totalSupply()).to.equal(expectedSupply);
    expect(await newToken.balanceOf(owner.address)).to.equal(expectedSupply);
  });
  
  it("Seharusnya memungkinkan user lain membuat token", async function () {
    // User1 membuat token
    await tokenFactory.connect(user1).createToken(
      user1.address,
      INITIAL_SUPPLY,
      "User1 Token",
      "UT1"
    );
    
    // User2 membuat token
    await tokenFactory.connect(user2).createToken(
      user2.address,
      INITIAL_SUPPLY * 2,
      "User2 Token",
      "UT2"
    );
    
    // Verifikasi jumlah token
    expect(await tokenFactory.getTokensCount()).to.equal(2);
    
    // Ambil alamat token
    const tokenAddresses = await tokenFactory.getAllTokens();
    
    // Test token user1
    const Token = await ethers.getContractFactory("Token");
    const user1Token = Token.attach(tokenAddresses[0]) as Token;
    const user2Token = Token.attach(tokenAddresses[1]) as Token;
    
    // Verifikasi nama dan kepemilikan
    expect(await user1Token.name()).to.equal("User1 Token");
    expect(await user2Token.name()).to.equal("User2 Token");
    
    // Verifikasi supply
    const expectedSupply1 = ethers.parseUnits(INITIAL_SUPPLY.toString(), 18);
    const expectedSupply2 = ethers.parseUnits((INITIAL_SUPPLY * 2).toString(), 18);
    
    expect(await user1Token.balanceOf(user1.address)).to.equal(expectedSupply1);
    expect(await user2Token.balanceOf(user2.address)).to.equal(expectedSupply2);
  });
});
```

Test ini:
- Verifikasi pembuatan token oleh owner
- Memastikan event yang benar dipancarkan dengan parameter yang benar
- Memeriksa properti token (nama, simbol, desimal)
- Memeriksa total supply dan balance awal
- Memastikan user lain juga dapat membuat token
- Memverifikasi bahwa setiap token memiliki properti dan balances yang tepat

### 4.4. Menambahkan Test untuk Fungsionalitas Token

Tambahkan test untuk fungsi-fungsi token seperti burning:

```typescript
describe("Token Functionality", function() {
  let newTokenAddress: string;
  let newToken: Token;
  
  beforeEach(async function() {
    // Buat token baru untuk setiap test
    const tx = await tokenFactory.createToken(
      owner.address,
      INITIAL_SUPPLY,
      TOKEN_NAME,
      TOKEN_SYMBOL
    );
    await tx.wait();
    
    // Ambil alamat token yang baru dibuat
    const tokenAddresses = await tokenFactory.getAllTokens();
    newTokenAddress = tokenAddresses[0];
    
    // Attach ke token
    const Token = await ethers.getContractFactory("Token");
    newToken = Token.attach(newTokenAddress) as Token;
  });
  
  it("Seharusnya dapat membakar token", async function() {
    // Jumlah token yang akan dibakar
    const burnAmount = 1000; // 1000 token
    const burnAmountInWei = ethers.parseUnits(burnAmount.toString(), 18);
    
    // Cek balance awal
    const initialBalance = await newToken.balanceOf(owner.address);
    
    // Bakar token
    await newToken.burnToken(burnAmount);
    
    // Cek balance setelah pembakaran
    const finalBalance = await newToken.balanceOf(owner.address);
    expect(finalBalance).to.equal(initialBalance - burnAmountInWei);
    
    // Cek total supply juga berkurang
    const totalSupply = await newToken.totalSupply();
    const expectedSupply = ethers.parseUnits(INITIAL_SUPPLY.toString(), 18) - burnAmountInWei;
    expect(totalSupply).to.equal(expectedSupply);
  });
  
  it("Seharusnya gagal jika non-owner mencoba membakar token", async function() {
    // User1 mencoba membakar token (seharusnya gagal)
    await expect(
      newToken.connect(user1).burnToken(1000)
    ).to.be.revertedWithCustomError(newToken, "OwnableUnauthorizedAccount");
  });
  
  it("Seharusnya gagal jika mencoba membakar lebih dari balance", async function() {
    // Mencoba membakar lebih dari balance (seharusnya gagal)
    await expect(
      newToken.burnToken(INITIAL_SUPPLY + 1)
    ).to.be.revertedWith("Error: you need more tokens");
  });
});
```

Test ini memverifikasi:
- Fungsi burning token
- Perubahan balance dan total supply setelah burning
- Pembatasan akses dengan modifier onlyOwner
- Penanganan error saat mencoba membakar lebih dari balance

### 4.5. Test Suite Lengkap

Gabungkan semua bagian di atas untuk mendapatkan test suite lengkap. Pastikan semua fungsi berjalan seperti yang diharapkan.

## 5. Menjalankan Test dan Menganalisis Coverage

Setelah membuat test suite, mari jalankan test dan analisis cakupan kode.

### 5.1. Menjalankan Test

Jalankan test dengan perintah:

```bash
npx hardhat test
```

Jika semua test berhasil, output akan terlihat seperti:

```
TokenFactory Contract
  Deployment
    ✔ Seharusnya memiliki jumlah token awal 0
  Token Creation
    ✔ Seharusnya berhasil membuat token baru
    ✔ Seharusnya memungkinkan user lain membuat token
  Token Functionality
    ✔ Seharusnya dapat membakar token
    ✔ Seharusnya gagal jika non-owner mencoba membakar token
    ✔ Seharusnya gagal jika mencoba membakar lebih dari balance

6 passing (3.21s)
```

### 5.2. Menganalisis Gas Reporter

Hardhat gas reporter akan secara otomatis berjalan saat Anda menjalankan test jika sudah dikonfigurasi di `hardhat.config.ts`. Lihat file `gas-report.txt` untuk analisis biaya gas.

Contoh output:

```
·------------------------------|---------------------------|-------------|-----------------------------·
|     Solc version: 0.8.24     ·  Optimizer enabled: true  ·  Runs: 200  ·  Block limit: 30000000 gas  │
·······························|···························|·············|······························
|  Methods                     ·               20 gwei/gas               ·       1695.36 usd/eth       │
·············|·················|·············|·············|·············|···············|··············
|  Contract  ·  Method         ·  Min        ·  Max        ·  Avg        ·  # calls      ·  usd (avg)  │
·············|·················|·············|·············|·············|···············|··············
|  Token     ·  burnToken      ·      27023  ·      46095  ·      36559  ·            2  ·       1.24  │
·············|·················|·············|·············|·············|···············|··············
|  Token     ·  transfer       ·      35391  ·      52463  ·      43927  ·            1  ·       1.49  │
·············|·················|·············|·············|·············|···············|··············
|  TokenFactory  ·  createToken  ·     921456  ·    1053922  ·     987689  ·            4  ·      33.44  │
·············|·················|·············|·············|·············|···············|··············
```

Ini membantu Anda memahami:
- Biaya gas untuk setiap metode
- Estimasi biaya dalam USD
- Jumlah panggilan selama testing
- Variasi biaya gas (min, max, rata-rata)

### 5.3. Menganalisis Test Coverage

Untuk mendapatkan laporan cakupan test, jalankan:

```bash
npx hardhat coverage
```

Output akan terlihat seperti:

```
--------------|----------|----------|----------|----------|----------------|
File          |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
--------------|----------|----------|----------|----------|----------------|
 contracts/   |      100 |      100 |      100 |      100 |                |
  Token.sol   |      100 |      100 |      100 |      100 |                |
  TokenFactory.sol |      100 |      100 |      100 |      100 |                |
--------------|----------|----------|----------|----------|----------------|
All files     |      100 |      100 |      100 |      100 |                |
--------------|----------|----------|----------|----------|----------------|
```

Laporan ini menunjukkan:
- Persentase statement yang diuji
- Persentase branch condition yang diuji
- Persentase fungsi yang dipanggil
- Persentase baris kode yang dieksekusi
- Baris kode yang tidak tercakup oleh test

Cakupan test 100% berarti setiap bagian kode telah diuji, yang sangat penting untuk keamanan smart contract.

## 6. Menjalankan Deployment ke Jaringan

Setelah memastikan semua test berjalan dengan baik, saatnya men-deploy contract ke jaringan.

### 6.1. Deployment ke Localhost

Untuk testing deployment lokal, jalankan:

```bash
npx hardhat run scripts/deploy-token-factory.ts --network hardhat
```

### 6.2. Deployment ke Monad Testnet

Untuk men-deploy ke Monad Testnet:

```bash
npx hardhat run scripts/deploy-token-factory.ts --network monadTestnet
```

:::caution
Pastikan Anda telah mengatur PRIVATE_KEY dengan hardhat-vars dan memiliki cukup token MON di alamat Anda untuk gas fee sebelum men-deploy ke Monad Testnet.
:::

### 6.3. Membuat Token Baru di Monad Testnet

Setelah TokenFactory berhasil di-deploy, gunakan script untuk membuat token baru:

1. Edit file `scripts/create-new-token.ts` dan ganti `FACTORY_ADDRESS` dengan alamat TokenFactory yang sebenarnya
2. Jalankan script:

```bash
npx hardhat run scripts/create-new-token.ts --network monadTestnet
```

## Kesimpulan

Pada bagian ini, kita telah:

1. Mengkompilasi smart contract TokenFactory
2. Membuat script deployment untuk TokenFactory
3. Membuat script untuk berinteraksi dengan TokenFactory dan membuat token baru
4. Mengembangkan test suite komprehensif untuk TokenFactory
5. Menjalankan test dan menganalisis test coverage
6. Men-deploy TokenFactory ke jaringan dan membuat token baru

Testing dan deployment adalah bagian penting dari siklus pengembangan smart contract. Dengan memastikan test suite komprehensif dan coverage tinggi, kita meningkatkan keamanan dan keandalan contract sebelum men-deploy-nya ke jaringan utama.

Pada bagian selanjutnya, kita akan mempelajari cara berinteraksi dengan Token di Monad Testnet dan membangun antarmuka untuk TokenFactory.