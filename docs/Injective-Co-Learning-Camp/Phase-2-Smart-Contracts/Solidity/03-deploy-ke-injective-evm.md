---
sidebar_position: 3
title: 🚀 Unit 3 — Deploy ke Injective EVM
description: Deploy contract Solidity ke Injective EVM Testnet (chain ID 1439) memakai Hardhat atau Foundry, dengan output yang diharapkan di setiap langkah, lalu verifikasi hasilnya di Blockscout.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 🚀 Unit 3 — Deploy ke Injective EVM

:::info Goal Unit Ini
Di akhir unit ini kamu akan:
- Punya project **Hardhat** atau **Foundry** yang terkonfigurasi untuk Injective testnet
- Berhasil **deploy contract ke Injective EVM Testnet (chain ID 1439)**
- Bisa **berinteraksi** dengan contract yang sudah di-deploy
- Bisa **melihat dan memverifikasi contract-mu di Blockscout**
:::

:::note Prasyarat
- ✅ [Unit 1](./solidity-dasar) dan [Unit 2](./solidity-lanjutan) selesai — kamu sudah punya contract `Celengan` yang teruji di Remix
- ✅ [Phase 0 Unit 4](../../Phase-0-Prerequisites/setup-wallet-dan-testnet) — MetaMask sudah punya jaringan Injective EVM Testnet dan **ada testnet INJ di dalamnya**
- 💻 **Node.js v18+** terpasang — cek dengan `node --version`
:::

:::tip Cara unit ini bekerja — dan apa bedanya dari Unit 1
Formatnya tetap sama seperti dua unit sebelumnya: **satu langkah → jalankan → lihat hasil yang seharusnya muncul.** Setiap perintah penting diikuti blok **Yang seharusnya kamu lihat**, supaya kamu langsung tahu kalau ada yang salah.

Bedanya cuma satu, tapi besar: sampai sekarang kamu bermain di **Remix VM**, simulasi di dalam browser. Mulai unit ini kamu berpindah ke **jaringan Injective sungguhan**. Artinya transaksi butuh beberapa detik, membayar gas dengan testnet INJ, dan **permanen serta terlihat publik** di explorer.
:::

:::note Kamu sebenarnya sudah pernah deploy sekali
Di akhir [Unit 1](./solidity-dasar), kamu sempat men-deploy `Celengan` ke Injective testnet lewat **Remix → Injected Provider**. Itu cara tercepat untuk sekali coba.

Unit ini memakai **Hardhat atau Foundry** — cara yang dipakai tim sungguhan, karena project-nya bisa masuk version control, punya test otomatis, dan bisa diulang dengan satu perintah. Ini keterampilan yang terbawa langsung ke [Phase 3](../../Phase-3-Building/TS-SDK/setup-injective-ts-sdk) dan ke [guided project](../../Phase-3-Building/Guided-Project/project-overview).
:::

:::danger Sebelum mulai: soal private key
Unit ini butuh private key wallet-mu untuk menandatangani transaksi deploy.

**Pakai wallet khusus latihan.** Buat akun baru di MetaMask yang hanya berisi testnet INJ, dan pakai itu. Jangan pernah memakai wallet yang berisi aset sungguhan untuk latihan.

Kita akan menyimpan private key di file `.env` dan **memastikan file itu tidak pernah masuk git.** Private key yang ter-commit ke GitHub akan ditemukan bot dalam hitungan detik.
:::

---

## 🧰 Hardhat atau Foundry?

Keduanya adalah kerangka kerja untuk mengembangkan smart contract. Pilih satu.

| | **Hardhat** | **Foundry** |
|---|---|---|
| Bahasa | JavaScript / TypeScript | Rust (tapi kamu menulis test dalam Solidity) |
| Belajar | Lebih mudah kalau kamu tahu JS | Lebih cepat, tapi asing di awal |
| Kecepatan test | Sedang | Sangat cepat |
| Cocok untuk | Pemula, integrasi frontend | Testing intensif |

:::tip Rekomendasi untuk CLC11
Pakai **Hardhat** kalau kamu belum pernah memakai keduanya. Ekosistem JavaScript-nya menyambung langsung ke Phase 3 (TypeScript SDK), jadi ilmunya berlanjut.

Pilih **Foundry** kalau kamu sudah nyaman dengan terminal dan ingin test yang cepat.
:::

---

<Tabs groupId="framework">
<TabItem value="hardhat" label="Hardhat" default>

## 📦 Setup Hardhat

### Step 1 — Buat project

```bash
mkdir celengan-injective
cd celengan-injective
npm init -y
npm install --save-dev hardhat
npx hardhat init
```

Pilih **"Create a JavaScript project"** dan setujui opsi bawaannya.

**Yang seharusnya kamu lihat:** sebuah folder project dengan `contracts/`, `scripts/`, `test/`, dan file `hardhat.config.js`. Cek dengan `ls`:

```text
contracts  hardhat.config.js  node_modules  package.json  scripts  test
```

### Step 2 — Pasang dependensi

```bash
npm install --save-dev @nomicfoundation/hardhat-toolbox dotenv
npm install @openzeppelin/contracts
```

### Step 3 — Simpan private key dengan aman

Buat file `.env`:

```bash
PRIVATE_KEY=masukkan_private_key_wallet_latihanmu_disini
```

Lalu **segera** pastikan file itu diabaikan git:

```bash
echo ".env" >> .gitignore
```

:::danger Verifikasi langkah ini sekarang
Jalankan `cat .gitignore` dan pastikan `.env` ada di dalamnya **sebelum** kamu melakukan `git commit` apa pun.

```text
node_modules
.env          ← pastikan baris ini ada
```

Private key yang ter-push ke repo publik akan dipindai bot otomatis dan dikuras dalam hitungan detik. Ini terjadi setiap hari kepada developer sungguhan.
:::

Cara mengambil private key dari MetaMask: klik tiga titik di sebelah akun → **Account details** → **Show private key** → masukkan password.

### Step 4 — Konfigurasi jaringan Injective

Ganti isi `hardhat.config.js`:

```javascript
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: { enabled: true, runs: 200 },
    },
  },
  networks: {
    injectiveTestnet: {
      url: "https://k8s.testnet.json-rpc.injective.network/",
      chainId: 1439,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    apiKey: {
      injectiveTestnet: "kosong-tidak-dipakai-blockscout",
    },
    customChains: [
      {
        network: "injectiveTestnet",
        chainId: 1439,
        urls: {
          apiURL: "https://testnet.blockscout.injective.network/api",
          browserURL: "https://testnet.blockscout.injective.network/",
        },
      },
    ],
  },
};
```

### Step 5 — Simpan contract

Buat `contracts/Celengan.sol` dan isi dengan contract dari [Unit 1](./solidity-dasar).

Compile:

```bash
npx hardhat compile
```

**Yang seharusnya kamu lihat:**

```text
Compiled 1 Solidity file successfully (evm target: paris).
```

:::note Kalau muncul peringatan, bukan error
Peringatan (warning) berwarna kuning tidak menghentikan compile. Yang menghentikan adalah **error** merah — biasanya salah ketik atau versi `pragma` tidak cocok dengan `0.8.20` di config. Baca barisnya sampai habis.
:::

### Step 6 — Script deploy

Buat `scripts/deploy.js`:

```javascript
const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploy dari akun:", deployer.address);

  const saldo = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Saldo:", hre.ethers.formatEther(saldo), "INJ");

  const Celengan = await hre.ethers.getContractFactory("Celengan");
  const celengan = await Celengan.deploy();
  await celengan.waitForDeployment();

  const alamat = await celengan.getAddress();
  console.log("Celengan ter-deploy di:", alamat);
  console.log(
    "Lihat di explorer: https://testnet.blockscout.injective.network/address/" + alamat
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

### Step 7 — Deploy!

```bash
npx hardhat run scripts/deploy.js --network injectiveTestnet
```

**Yang seharusnya kamu lihat** (alamat dan angka akan berbeda):

```text
Deploy dari akun: 0x3aF1...9c2b
Saldo: 0.5 INJ
Celengan ter-deploy di: 0x8bC4...71aA
Lihat di explorer: https://testnet.blockscout.injective.network/address/0x8bC4...71aA
```

:::tip 🧪 Verifikasi pertama — buka link explorer-nya
**Simpan alamat contract itu**, lalu buka link explorer yang dicetak. Kamu akan melihat contract-mu ada di jaringan publik dengan transaksi pembuatannya. ✅

Kalau `Saldo` tercetak `0.0 INJ`, deploy akan gagal di sini — ambil testnet INJ dari [faucet](https://testnet.faucet.injective.network/) dulu.
:::

### Step 8 — Berinteraksi dengan contract

Buat `scripts/interact.js`:

```javascript
const hre = require("hardhat");

const ALAMAT_CONTRACT = "0x_ganti_dengan_alamat_hasil_deploy";

async function main() {
  const celengan = await hre.ethers.getContractAt("Celengan", ALAMAT_CONTRACT);

  // Menabung 0.01 INJ
  console.log("Menabung...");
  const tx = await celengan.menabung({
    value: hre.ethers.parseEther("0.01"),
  });
  await tx.wait();
  console.log("Selesai. Hash:", tx.hash);

  // Cek tabungan
  const tabungan = await celengan.tabunganSaya();
  console.log("Tabungan saya:", hre.ethers.formatEther(tabungan), "INJ");

  const total = await celengan.totalTersimpan();
  console.log("Total tersimpan:", hre.ethers.formatEther(total), "INJ");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

Jalankan:

```bash
npx hardhat run scripts/interact.js --network injectiveTestnet
```

**Yang seharusnya kamu lihat:**

```text
Menabung...
Selesai. Hash: 0x5d2c...e0f7
Tabungan saya: 0.01 INJ
Total tersimpan: 0.01 INJ
```

:::tip 🧪 Verifikasi kedua — cocokkan dengan explorer
Salin **Hash** transaksinya, tempel di [Blockscout](https://testnet.blockscout.injective.network/). Kamu akan melihat transaksi `menabung`, gas yang terpakai, dan **event `Menabung`** yang kamu pancarkan di Unit 1 — persis seperti yang kamu lihat di panel `logs` Remix, tapi sekarang di explorer publik. ✅
:::

</TabItem>
<TabItem value="foundry" label="Foundry">

## ⚒️ Setup Foundry

### Step 1 — Pasang Foundry

```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

Verifikasi:

```bash
forge --version
```

**Yang seharusnya kamu lihat** (versi bisa berbeda):

```text
forge 0.2.0 (a1b2c3d 2026-07-15T00:00:00.000000000Z)
```

:::note Pengguna Windows
Foundry paling baik dijalankan di **WSL2**, bukan PowerShell atau CMD. Kalau kamu belum punya WSL2, jalankan `wsl --install` di PowerShell sebagai administrator, lalu ulangi langkah di atas dari dalam terminal Ubuntu.
:::

### Step 2 — Buat project

```bash
forge init celengan-injective
cd celengan-injective
```

**Yang seharusnya kamu lihat:** folder dengan `src/`, `test/`, `lib/`, dan `foundry.toml`. Foundry juga membuat contoh `Counter.sol` — boleh kamu hapus nanti.

### Step 3 — Pasang OpenZeppelin

```bash
forge install OpenZeppelin/openzeppelin-contracts
```

**Yang seharusnya kamu lihat:** OpenZeppelin terunduh ke `lib/openzeppelin-contracts`. Kalau `forge` mengeluh soal perubahan git yang belum di-commit, tambahkan `--no-commit` di akhir perintah.

### Step 4 — Simpan private key

Buat `.env`:

```bash
PRIVATE_KEY=masukkan_private_key_wallet_latihanmu_disini
INJECTIVE_TESTNET_RPC=https://k8s.testnet.json-rpc.injective.network/
```

Pastikan diabaikan git:

```bash
echo ".env" >> .gitignore
cat .gitignore
```

:::danger Verifikasi `.env` ada di `.gitignore` sebelum commit apa pun
Output `cat .gitignore` harus memuat baris `.env`. Bot memindai GitHub untuk private key secara terus-menerus. Ini bukan kemungkinan teoretis.
:::

### Step 5 — Konfigurasi `foundry.toml`

```toml
[profile.default]
src = "src"
out = "out"
libs = ["lib"]
solc = "0.8.20"
optimizer = true
optimizer_runs = 200

[rpc_endpoints]
injective_testnet = "https://k8s.testnet.json-rpc.injective.network/"

[etherscan]
injective_testnet = { key = "kosong", url = "https://testnet.blockscout.injective.network/api", chain = 1439 }
```

### Step 6 — Simpan contract

Buat `src/Celengan.sol` dengan contract dari [Unit 1](./solidity-dasar).

Compile:

```bash
forge build
```

**Yang seharusnya kamu lihat:**

```text
[⠢] Compiling...
[⠰] Compiling 2 files with 0.8.20
[⠔] Solc 0.8.20 finished in 1.23s
Compiler run successful!
```

### Step 7 — Tulis test (keunggulan utama Foundry)

Buat `test/Celengan.t.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/Celengan.sol";

contract CelenganTest is Test {
    Celengan celengan;
    address alice = address(0x1);

    function setUp() public {
        celengan = new Celengan();
        vm.deal(alice, 10 ether);
    }

    function testMenabung() public {
        vm.prank(alice);
        celengan.menabung{value: 1 ether}();

        vm.prank(alice);
        assertEq(celengan.tabunganSaya(), 1 ether);
    }

    function testTidakBisaMenarikLebihDariTabungan() public {
        vm.prank(alice);
        celengan.menabung{value: 1 ether}();

        vm.prank(alice);
        vm.expectRevert("Tabungan tidak cukup");
        celengan.menarik(2 ether);
    }
}
```

Jalankan:

```bash
forge test -vv
```

**Yang seharusnya kamu lihat:**

```text
Ran 2 tests for test/Celengan.t.sol:CelenganTest
[PASS] testMenabung() (gas: 68421)
[PASS] testTidakBisaMenarikLebihDariTabungan() (gas: 71034)
Suite result: ok. 2 passed; 0 failed; 0 skipped
```

:::tip 🧪 Ini keunggulan Foundry — pengujian yang sama seperti di Remix, tapi otomatis
Di Unit 1 dan 2 kamu menguji dengan mengklik tombol dan berganti akun. `vm.prank(alice)` melakukan hal yang sama — membuat panggilan berikutnya seolah datang dari `alice` — tapi dalam kode yang bisa dijalankan ulang kapan saja. `vm.deal` memberi saldo palsu, dan `vm.expectRevert` menegaskan bahwa sebuah panggilan **memang harus gagal**.

Coba **sengaja rusak**: ubah `assertEq(..., 1 ether)` menjadi `2 ether`, jalankan lagi, dan lihat test-nya `[FAIL]`. Itulah gunanya test — menangkap kesalahan sebelum sampai ke jaringan.
:::

### Step 8 — Deploy

```bash
source .env

forge create src/Celengan.sol:Celengan \
  --rpc-url $INJECTIVE_TESTNET_RPC \
  --private-key $PRIVATE_KEY \
  --broadcast
```

**Yang seharusnya kamu lihat:**

```text
Deployer: 0x3aF1...9c2b
Deployed to: 0x8bC4...71aA
Transaction hash: 0x5d2c...e0f7
```

:::tip 🧪 Verifikasi pertama — buka contract-nya di explorer
Catat alamat di baris **`Deployed to:`**, lalu buka `https://testnet.blockscout.injective.network/address/<ALAMAT>`. Contract-mu ada di sana. ✅
:::

### Step 9 — Berinteraksi

```bash
# Menabung 0.01 INJ
cast send <ALAMAT_CONTRACT> "menabung()" \
  --value 0.01ether \
  --rpc-url $INJECTIVE_TESTNET_RPC \
  --private-key $PRIVATE_KEY

# Baca total tersimpan
cast call <ALAMAT_CONTRACT> "totalTersimpan()(uint256)" \
  --rpc-url $INJECTIVE_TESTNET_RPC
```

**Yang seharusnya kamu lihat** dari `cast call`:

```text
10000000000000000 [1e16]
```

:::tip 🧪 Verifikasi kedua — angkanya masuk akal?
`10000000000000000` adalah `0.01 INJ` dalam satuan terkecil (18 desimal) — persis yang kamu setor. Ini pola "tidak ada desimal" dari [Unit 1](./solidity-dasar) yang muncul lagi. `cast send` juga mencetak `transactionHash` yang bisa kamu cari di Blockscout. ✅
:::

</TabItem>
</Tabs>

---

## 🎁 Bonus — Deploy Juga Token ERC-20 dari Unit 2

Ini opsional tapi sangat memuaskan. Di [Unit 2](./solidity-lanjutan) kamu membuat `TokenCLC`, sebuah token ERC-20 penuh. Deploy dengan langkah yang **persis sama** (taruh di `contracts/TokenCLC.sol` atau `src/TokenCLC.sol`, ganti nama contract di script/perintah deploy dari `Celengan` ke `TokenCLC`).

**Yang membuatnya menyenangkan:** setelah ter-deploy dan terverifikasi, buka contract-nya di Blockscout — Blockscout akan mengenalinya sebagai **token** dan menampilkan tab khusus token. Kamu bahkan bisa **menambahkan token itu ke MetaMask** (Import tokens → tempel alamat contract) dan melihat saldo 1 juta CLC11-mu muncul di wallet seperti token sungguhan.

:::tip Ini bahan bagus untuk post refleksi X
Salah satu syarat kelulusan adalah post di X. "Saya men-deploy token pertama saya di Injective dan melihatnya muncul di wallet" jauh lebih berkesan dengan screenshot MetaMask yang menampilkan token buatanmu sendiri.
:::

---

## 🔍 Verifikasi di Blockscout

Setelah deploy, buka:

```
https://testnet.blockscout.injective.network/address/ALAMAT_CONTRACT_KAMU
```

Yang bisa kamu lihat:
- **Transactions** — riwayat interaksi contract
- **Contract** — bytecode, dan source code kalau sudah diverifikasi
- **Balance** — saldo INJ yang tersimpan di contract

### Kenapa memverifikasi source code?

Verifikasi mengunggah kode Solidity-mu ke explorer, sehingga siapa pun bisa membacanya — dan explorer akan menampilkan antarmuka **Read/Write Contract** yang bisa dipakai langsung tanpa menulis kode.

:::tip Verifikasi bagus untuk submission kelulusan
Contract yang terverifikasi jauh lebih meyakinkan sebagai bukti pekerjaan. Reviewer bisa langsung membaca kodemu di explorer, bukan hanya melihat alamat.
:::

<Tabs groupId="framework">
<TabItem value="hardhat" label="Hardhat" default>

```bash
npx hardhat verify --network injectiveTestnet ALAMAT_CONTRACT_KAMU
```

**Yang seharusnya kamu lihat:**

```text
Successfully verified contract Celengan on the block explorer.
https://testnet.blockscout.injective.network/address/0x8bC4...71aA#code
```

</TabItem>
<TabItem value="foundry" label="Foundry">

```bash
forge verify-contract \
  --chain-id 1439 \
  --verifier blockscout \
  --verifier-url https://testnet.blockscout.injective.network/api \
  ALAMAT_CONTRACT_KAMU \
  src/Celengan.sol:Celengan
```

**Yang seharusnya kamu lihat:**

```text
Submitting verification for [src/Celengan.sol:Celengan] 0x8bC4...71aA.
Contract successfully verified
```

</TabItem>
</Tabs>

:::tip 🧪 Verifikasi ketiga — buka tab Contract
Setelah verifikasi berhasil, muat ulang halaman contract di Blockscout dan buka tab **Contract**. Sekarang ada tanda centang hijau, source code Solidity-mu terlihat, dan muncul sub-tab **Read Contract** / **Write Contract** yang bisa kamu klik langsung tanpa menulis kode apa pun. ✅
:::

:::note Kalau verifikasi otomatis gagal
Blockscout juga menyediakan verifikasi manual lewat antarmuka web-nya: buka halaman alamat contract → tab **Contract** → **Verify & Publish**, lalu tempel source code dan pilih versi compiler yang sama persis dengan yang kamu pakai.

Verifikasi bukan syarat kelulusan — kalau macet, lanjutkan saja dan tanyakan di Telegram.
:::

---

## 🛠️ Troubleshooting

<details>
<summary><strong>"insufficient funds for gas"</strong></summary>

Saldo testnet INJ-mu habis atau kosong. Ambil lagi dari [faucet](https://testnet.faucet.injective.network/).

Periksa juga bahwa kamu memakai akun yang benar — private key di `.env` harus milik akun yang berisi testnet INJ, bukan akun lain di MetaMask. Ingat, script deploy Hardhat mencetak `Saldo:` di awal — kalau angkanya `0.0`, di situlah masalahnya.

</details>

<details>
<summary><strong>"invalid chain id" atau "network mismatch"</strong></summary>

Pastikan `chainId: 1439` di konfigurasimu dan RPC URL-nya persis `https://k8s.testnet.json-rpc.injective.network/` (termasuk garis miring di akhir).

</details>

<details>
<summary><strong>"nonce too low" atau "replacement transaction underpriced"</strong></summary>

Ada transaksi sebelumnya yang tersangkut. Di MetaMask: **Settings → Advanced → Clear activity tab data**, lalu coba lagi.

</details>

<details>
<summary><strong>Deploy berjalan lama lalu timeout</strong></summary>

RPC publik kadang lambat, terutama saat banyak orang memakainya bersamaan. Coba lagi. Kalau berulang, periksa apakah transaksinya sebenarnya berhasil di [explorer](https://testnet.blockscout.injective.network/) — kadang transaksinya masuk tapi respons ke klien-nya gagal. Kamu juga bisa mencoba RPC alternatif dari [Chainlist](https://chainlist.org/?search=injective&testnets=true).

</details>

<details>
<summary><strong>"cannot estimate gas; transaction may fail"</strong></summary>

Biasanya artinya transaksinya memang akan gagal. Penyebab tersering: constructor melempar error, atau argumen yang kamu kirim salah. Coba deploy contract yang sama di **Remix VM** dulu untuk mengisolasi masalahnya — persis lingkungan yang kamu pakai di Unit 1 dan 2.

</details>

<details>
<summary><strong>Foundry: "command not found: forge"</strong></summary>

Jalankan `foundryup` lagi, lalu buka terminal baru. Kalau masih gagal, tambahkan `~/.foundry/bin` ke `PATH`-mu.

</details>

---

## ✅ Checklist Sebelum Lanjut

- [ ] Project Hardhat atau Foundry berjalan, `compile`/`build` sukses
- [ ] `.env` berisi private key wallet **latihan**, dan **ada di `.gitignore`**
- [ ] Contract berhasil di-deploy ke Injective EVM Testnet
- [ ] Alamat contract tercatat
- [ ] Sudah berhasil memanggil minimal satu function yang mengubah state, dan **outputnya sesuai** yang diharapkan
- [ ] Transaksinya terlihat di [Blockscout](https://testnet.blockscout.injective.network/)
- [ ] (Bonus) Source code terverifikasi, atau token ERC-20 dari Unit 2 ter-deploy

:::tip Simpan bukti sekarang
Screenshot halaman contract-mu di Blockscout, dan simpan alamat contract di catatan.

Kamu akan membutuhkannya untuk [submission kelulusan](../../Phase-4-Graduation/panduan-submission), dan jauh lebih mudah mengumpulkannya sekarang daripada mencarinya lagi tanggal 9 Agustus.
:::

---

## 🎯 Rangkuman

:::tip Yang Harus Kamu Ingat
- Injective EVM Testnet: **chain ID `1439`**, RPC `https://k8s.testnet.json-rpc.injective.network/`
- **Hardhat** untuk yang nyaman dengan JavaScript; **Foundry** untuk test cepat
- Private key **selalu** di `.env`, dan `.env` **selalu** di `.gitignore` — verifikasi sebelum commit
- Pakai **wallet khusus latihan**, jangan wallet berisi aset sungguhan
- Setiap perintah punya **output yang diharapkan** — kalau berbeda, kamu langsung tahu ada yang salah, bukan tiga jam kemudian
- **Blockscout** adalah alat debugging dan bukti pekerjaanmu; verifikasi source membuatnya bisa dibaca dan dipakai langsung
- Beda dari Remix VM: transaksi di sini **lambat, berbayar gas, permanen, dan publik**
:::

### ✅ Quick Check

1. Berapa chain ID Injective EVM Testnet?
2. Apa dua hal yang harus kamu pastikan sebelum `git commit` pertama?
3. Kamu dapat error "insufficient funds for gas". Dua hal apa yang kamu periksa? (Petunjuk: script deploy Hardhat mencetak sesuatu di awal.)
4. `cast call` mengembalikan `10000000000000000` setelah kamu menabung 0.01 INJ. Kenapa angkanya sebesar itu?
5. Apa keuntungan memverifikasi source code di explorer?

:::note Jawaban #4
`0.01 INJ` dalam satuan terkecil. INJ punya 18 desimal, jadi 0.01 × 10¹⁸ = 10000000000000000. Blockchain tidak memakai bilangan desimal — pola yang sama seperti di Unit 1.
:::

---

🎉 **Jalur A (Solidity) selesai!** Ini mencakup Learning Track Phase 3 dan 4.

**Lanjut:** [Jalur B — Rust untuk Web3](../Rust-CosmWasm/rust-untuk-web3) 👉
