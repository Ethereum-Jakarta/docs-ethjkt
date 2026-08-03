---
sidebar_position: 4
title: 🔐 Unit 4 — Setup Wallet & Testnet
description: Pasang Keplr dan MetaMask, tambahkan Injective EVM Testnet (chain ID 1439), ambil testnet INJ dari faucet, dan verifikasi saldo di explorer.
---

# 🔐 Unit 4 — Setup Wallet & Testnet

:::info Goal Unit Ini
Di akhir unit ini kamu akan punya:
- **Keplr** terpasang dengan akun Injective (alamat `inj1...`)
- **MetaMask** terpasang dengan jaringan **Injective EVM Testnet** (alamat `0x...`)
- **Testnet INJ** di kedua wallet
- Kemampuan **memverifikasi saldo di explorer**
- Seed phrase **ter-backup di kertas**
:::

:::note Prasyarat
- ✅ [Unit 3](./cosmos-ibc-dan-multivm) selesai — kamu paham beda alamat `inj1...` dan `0x...`
- 💻 Browser desktop (Chrome, Brave, atau Edge). Ekstensi wallet tidak berjalan baik di browser HP
:::

:::danger Unit ini adalah blocker
Hampir semua unit setelah ini butuh wallet dan testnet INJ. **Selesaikan unit ini sebelum TH2 (3 Agustus).** Kalau macet, tanya di grup Telegram hari itu juga — jangan menunggu.
:::

---

## 🧭 Kenapa Dua Wallet?

Karena Injective punya dua sisi (ingat MultiVM dari Unit 3):

| Wallet | Untuk sisi | Format alamat | Dipakai di |
|---|---|---|---|
| **Keplr** | Cosmos-native | `inj1...` | CosmWasm, injectived, TS SDK |
| **MetaMask** | EVM | `0x...` | Solidity, Hardhat, Foundry |

Pasang keduanya sekarang, supaya nanti tidak terhambat di tengah materi.

---

## 👜 Step 1 — Pasang Keplr

1. Buka [keplr.app/download](https://www.keplr.app/download) dan pasang ekstensi untuk browser-mu.

   :::warning Hanya dari situs resmi
   Ekstensi wallet palsu adalah cara penipuan paling umum di Web3. Pastikan URL-nya benar-benar `keplr.app`. Jangan pasang dari link yang dikirim orang di Telegram atau Discord — termasuk dari grup CLC11.
   :::

2. Klik **Create a new wallet**.

3. Keplr akan menampilkan **12 atau 24 kata recovery phrase**.

   :::danger Tulis Sekarang, di Kertas
   Saat kata-kata itu muncul — **tulis di kertas fisik**. Bukan di:
   - ❌ Screenshot
   - ❌ Notes / file teks di komputer
   - ❌ Google Docs atau cloud apa pun
   - ❌ Chat WhatsApp/Telegram, termasuk ke diri sendiri

   Kalau kamu kehilangan kertas ini, wallet-mu hilang selamanya. Kalau orang lain menemukannya, semua isinya jadi milik mereka.
   :::

4. Konfirmasi urutan kata, buat password, selesai.

5. Cari **Injective** di daftar chain Keplr. Klik akunmu untuk menyalin alamat — bentuknya `inj1...`.

   ```
   Contoh bentuk alamat Keplr:
   inj1qwerty0987asdfgh1234zxcvbn5678poiuytre
   ```

:::tip Kalau Injective tidak muncul di Keplr
Buka menu Keplr → **Manage Chain Visibility** → cari "Injective" → aktifkan. Beberapa versi Keplr menyembunyikan chain yang belum punya saldo.
:::

---

## 🦊 Step 2 — Pasang MetaMask & Tambah Injective EVM Testnet

1. Pasang MetaMask dari [metamask.io/download](https://metamask.io/download) — **hanya dari situs resmi**.

2. Buat wallet baru. **Backup seed phrase di kertas**, aturan yang sama seperti Keplr.

3. Tambahkan jaringan Injective EVM Testnet. Ada **dua cara** — hasilnya sama, pilih salah satu.

### Cara A — Lewat Chainlist (satu klik)

[Chainlist](https://chainlist.org) adalah direktori jaringan EVM yang bisa menambahkan jaringan ke MetaMask untukmu, tanpa mengetik apa pun.

1. Buka **[chainlist.org/?search=injective&testnets=true](https://chainlist.org/?search=injective&testnets=true)**

   Tautan ini sudah menyalakan filter **Include Testnets**. Kalau kamu membuka Chainlist dari halaman depan, nyalakan toggle itu dulu — tanpa itu jaringan testnet tidak muncul sama sekali.

2. Kamu akan melihat **dua** entri Injective. Perhatikan baik-baik:

   | Entri di Chainlist | Chain ID | Pakai? |
   |---|---|---|
   | **Injective Testnet** | `1439` | ✅ **Ini yang kita pakai** |
   | Injective | `1776` | ❌ Mainnet — uang sungguhan |

3. Klik tombol pada kartu **Injective Testnet**, lalu setujui permintaan MetaMask untuk menambahkan jaringan.

   Label tombolnya tergantung keadaan: **Connect Wallet** kalau MetaMask belum terhubung ke Chainlist, atau **Add to MetaMask** kalau sudah. Kalau muncul "Connect Wallet", klik itu dulu, lalu klik sekali lagi untuk menambahkan jaringannya.

:::danger Baca chain ID-nya sebelum menyetujui
Saat MetaMask menampilkan dialog konfirmasi, dialog itu memperlihatkan chain ID dan RPC URL yang akan ditambahkan. **Baca dulu, jangan langsung klik Approve.**

Yang harus tertulis: **Chain ID `1439`**. Kalau yang muncul `1776`, kamu mengklik kartu yang salah — batalkan dan ulangi.

Kebiasaan membaca dialog wallet sebelum menyetujui adalah salah satu kebiasaan paling penting di Web3. Di dunia nyata, dialog seperti inilah yang membedakan antara menandatangani transaksi biasa dan memberikan izin penuh atas asetmu kepada penipu.
:::

:::warning Chainlist adalah pihak ketiga, bukan situs resmi Injective
Chainlist berguna dan dipakai luas, tapi ia **agregator komunitas** — datanya dikirim lewat kontribusi publik, bukan diterbitkan Injective.

Karena itu: setelah jaringan ditambahkan, **cocokkan nilainya dengan tabel di Cara B di bawah.** Kalau ada yang tidak cocok, percayai tabel di dokumentasi ini dan [docs.injective.network](https://docs.injective.network), bukan Chainlist.

Ini pola berpikir yang sama seperti soal paket npm di [TS-SDK Unit 1](../Phase-3-Building/TS-SDK/setup-injective-ts-sdk) — alat pihak ketiga itu berguna, tapi verifikasi tetap tanggung jawabmu.
:::

:::note Kalau kamu melihat entri bernama "inEVM"
Itu **jaringan yang berbeda** (chain ID `2424` / `2525`), meskipun mata uangnya juga bernama INJ. Bukan itu yang kita pakai di camp ini. Yang benar namanya persis **Injective Testnet**, chain ID `1439`.
:::

### Cara B — Manual (kamu tahu persis apa yang kamu masukkan)

**MetaMask → Settings → Networks → Add a network → Add a network manually**

Isi persis seperti ini:

| Field | Nilai |
|---|---|
| Network Name | `Injective EVM Testnet` |
| New RPC URL | `https://k8s.testnet.json-rpc.injective.network/` |
| Chain ID | `1439` |
| Currency Symbol | `INJ` |
| Block Explorer URL | `https://testnet.blockscout.injective.network/` |

:::tip Cara mana yang sebaiknya dipilih?
**Cara A lebih cepat, Cara B lebih mendidik.**

Kalau ini pertama kalinya kamu menambahkan jaringan ke MetaMask, kerjakan **Cara B minimal sekali** — supaya kamu paham bahwa sebuah "jaringan" di wallet hanyalah kumpulan lima nilai ini, bukan sesuatu yang ajaib. Setelah itu, pakai Chainlist untuk chain lain sesukamu.

Tabel di Cara B tetap jadi **acuan kebenaran** di seluruh dokumentasi ini.
:::

4. Simpan, lalu pilih jaringan itu di dropdown MetaMask.

:::note Soal garis miring di akhir RPC URL
Chainlist menambahkan RPC tanpa garis miring di akhir (`...injective.network`), sedangkan tabel di atas memakainya (`...injective.network/`). **Keduanya berfungsi** untuk MetaMask — jangan bingung kalau nilainya terlihat sedikit berbeda.

Chainlist juga menampilkan beberapa **RPC alternatif** (misalnya dari Polkachu) untuk jaringan yang sama. Simpan informasi itu: kalau RPC resmi sedang lambat karena banyak peserta memakainya bersamaan, RPC alternatif adalah jalan keluarmu.
:::

:::note Untuk referensi — jangan dipakai selama camp
Ini nilai **mainnet** (uang sungguhan). Kita **tidak** memakainya di CLC11, tapi ditulis di sini supaya kamu tidak salah mengira testnet dan mainnet itu sama.

| Field | Mainnet |
|---|---|
| Chain ID | `1776` |
| RPC URL | `https://sentry.evm-rpc.injective.network/` |
| Explorer | `https://blockscout.injective.network/` |

**Semua tugas camp memakai testnet (1439).** Jangan pernah mengirim INJ asli ke contract latihanmu.
:::

:::info WebSocket endpoint
Kalau nanti kamu butuh koneksi realtime (misalnya memantau event contract), endpoint WebSocket testnet-nya: `wss://k8s.testnet.ws.injective.network/`
:::

---

## 💧 Step 3 — Ambil Testnet INJ dari Faucet

Testnet INJ tidak punya nilai uang. Fungsinya hanya untuk membayar gas saat latihan.

1. Buka faucet resmi: **[testnet.faucet.injective.network](https://testnet.faucet.injective.network/)**

2. Tempel alamat wallet-mu dan minta token.

3. Tunggu beberapa saat, lalu cek saldo.

:::tip Faucet alternatif kalau yang resmi sedang penuh
Faucet sering kena rate-limit saat banyak orang memakainya bersamaan — dan 71 peserta camp mengambil token di minggu yang sama adalah persis situasi itu.

Alternatif:
- Google Cloud Web3 Faucet: [cloud.google.com/application/web3/faucet/injective/testnet](https://cloud.google.com/application/web3/faucet/injective/testnet)

Kalau semua gagal, **tanya di grup Telegram** — biasanya ada peserta lain yang punya sisa testnet INJ dan bisa mengirimkannya. Testnet token boleh dibagi bebas; tidak ada nilainya.
:::

:::warning Ambil secukupnya
Faucet adalah sumber daya bersama dengan rate limit. Ambil sesuai kebutuhan, jangan spam. Kalau kamu menghabiskan jatah, peserta lain tidak kebagian.
:::

---

## 🔍 Step 4 — Verifikasi di Explorer

Jangan percaya angka di wallet saja — biasakan **memverifikasi di explorer.** Ini kebiasaan yang akan menyelamatkanmu berkali-kali nanti saat debugging.

1. Buka **[testnet.blockscout.injective.network](https://testnet.blockscout.injective.network/)**

2. Tempel alamatmu di kolom pencarian.

3. Yang harus kamu lihat:
   - **Balance** — jumlah testnet INJ-mu
   - **Transactions** — daftar transaksi, termasuk yang dari faucet

:::tip Explorer adalah alat debugging utamamu
Nanti saat contract-mu gagal deploy atau transaksi tidak jalan, **explorer adalah tempat pertama yang harus kamu buka.** Di sana kamu bisa melihat status transaksi, pesan error, dan gas yang terpakai. Biasakan sekarang saat masih sederhana.
:::

---

## ✅ Checklist Sebelum Lanjut

Pastikan semuanya sudah tercentang:

- [ ] Keplr terpasang, punya alamat `inj1...`
- [ ] MetaMask terpasang, punya alamat `0x...`
- [ ] Jaringan **Injective EVM Testnet (Chain ID 1439)** sudah ada di MetaMask dan terpilih
- [ ] Sudah dapat testnet INJ dari faucet
- [ ] Saldo terlihat di [explorer testnet](https://testnet.blockscout.injective.network/)
- [ ] **Seed phrase kedua wallet tertulis di kertas fisik**, bukan di perangkat mana pun

---

## 🛠️ Troubleshooting

<details>
<summary><strong>MetaMask bilang "Chain ID sudah dipakai jaringan lain"</strong></summary>

Kemungkinan kamu pernah menambahkan Injective testnet dengan nama berbeda. Buka **Settings → Networks**, cari entri dengan Chain ID `1439`, hapus, lalu tambahkan ulang.

</details>

<details>
<summary><strong>Chainlist tidak menampilkan Injective Testnet</strong></summary>

Toggle **Include Testnets** belum menyala. Pakai tautan yang sudah menyalakannya: [chainlist.org/?search=injective&testnets=true](https://chainlist.org/?search=injective&testnets=true).

Kalau tombol **Connect Wallet** tidak bereaksi, biasanya MetaMask sedang terkunci — buka ekstensinya, masukkan password, lalu muat ulang halaman Chainlist.

</details>

<details>
<summary><strong>Terlanjur menambahkan Injective Mainnet (1776) lewat Chainlist</strong></summary>

Tidak berbahaya selama kamu tidak mengirim aset ke sana — menambahkan jaringan hanya menyimpan konfigurasi, tidak memindahkan apa pun.

Buka **Settings → Networks**, hapus entri dengan Chain ID `1776`, lalu tambahkan yang `1439`. Menghapusnya lebih baik daripada membiarkannya, supaya kamu tidak salah pilih di dropdown saat sedang buru-buru.

</details>

<details>
<summary><strong>Faucet bilang "already claimed" padahal saldo masih kosong</strong></summary>

Faucet menerapkan rate limit per alamat dan per IP. Tunggu beberapa jam, atau coba faucet alternatif Google Cloud. Kalau kamu satu jaringan WiFi dengan peserta lain (misalnya di kampus), IP kalian bisa dianggap sama — coba pakai koneksi lain.

</details>

<details>
<summary><strong>Saldo tidak muncul di MetaMask tapi ada di explorer</strong></summary>

Hampir selalu karena jaringan yang salah dipilih. Pastikan dropdown MetaMask menunjuk **Injective EVM Testnet**, bukan Ethereum Mainnet. Kalau masih kosong, coba Settings → Advanced → **Clear activity tab data**, lalu muat ulang browser.

</details>

<details>
<summary><strong>Transaksi "pending" lama sekali</strong></summary>

Cek dulu di explorer apakah transaksinya benar-benar masuk. Kalau ada di explorer tapi MetaMask masih pending, itu masalah tampilan — muat ulang saja. Kalau tidak ada di explorer, transaksinya tidak pernah terkirim; periksa apakah RPC URL-mu benar.

</details>

<details>
<summary><strong>Ekstensi wallet tidak muncul di browser</strong></summary>

Klik ikon puzzle di toolbar browser dan pin ekstensinya. Kalau memakai Brave, pastikan Brave Wallet tidak bentrok — nonaktifkan di `brave://settings/web3` dengan mengatur default wallet ke "Extensions".

</details>

---

## 🎯 Rangkuman

:::tip Yang Harus Kamu Ingat
- **Keplr** untuk sisi Cosmos (`inj1...`), **MetaMask** untuk sisi EVM (`0x...`) — pasang keduanya
- Injective EVM Testnet: **Chain ID `1439`**, RPC `https://k8s.testnet.json-rpc.injective.network/`
- Testnet ≠ mainnet. **Chain ID 1439 = latihan. Chain ID 1776 = uang sungguhan.** Jangan tertukar
- [Chainlist](https://chainlist.org/?search=injective&testnets=true) bisa menambahkan jaringan dalam satu klik — tapi **baca chain ID di dialog MetaMask sebelum menyetujui**, dan cocokkan dengan tabel resmi
- Faucet punya rate limit; ambil secukupnya dan minta bantuan di Telegram kalau kehabisan
- **Explorer adalah alat debugging utamamu** — biasakan memakainya sejak sekarang
- Seed phrase di **kertas**, tidak pernah di perangkat, tidak pernah dibagikan
:::

### ✅ Quick Check

1. Berapa Chain ID Injective EVM Testnet, dan berapa mainnet?
2. Kamu mau deploy contract Solidity — wallet mana yang dipakai?
3. Saldo terlihat di explorer tapi tidak di MetaMask. Apa hal pertama yang kamu periksa?
4. Faucet menolak permintaanmu. Sebutkan dua alternatif.

---

🎉 **Phase 0 selesai!** Kamu sekarang punya fondasi konsep dan lingkungan kerja yang siap.

**Lanjut:** [Phase 1 — Arsitektur Injective](../Phase-1-Fundamentals/Concept-1-Arsitektur/arsitektur-injective) 👉
