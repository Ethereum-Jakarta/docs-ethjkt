---
sidebar_position: 1
title: 🌍 Unit 1 — Ekosistem dApp & Helix
description: Peta aplikasi yang berjalan di Injective, studi kasus Helix sebagai DEX flagship, dan cara membaca ekosistem untuk menemukan celah yang bisa kamu bangun.
---

# 🌍 Unit 1 — Ekosistem dApp & Helix

:::info Goal Unit Ini
Di akhir unit ini kamu akan:
- Punya **peta kategori aplikasi** yang berjalan di Injective
- Paham **Helix** sebagai studi kasus konkret pemanfaatan exchange module
- Bisa **membaca ekosistem** untuk menemukan celah yang layak dibangun
- Punya bahan untuk memilih ide **guided project** kamu nanti
:::

:::note Prasyarat
- ✅ [Concept I Unit 2](../Concept-1-Arsitektur/exchange-module-orderbook) — kamu paham shared liquidity dan exchange module
:::

---

## 🗺️ Kategori Aplikasi di Injective

Karena Injective dioptimalkan untuk keuangan, ekosistemnya condong ke arah itu — tapi lebih beragam dari sekadar "tempat trading".

| Kategori | Yang dilakukan | Kenapa cocok di Injective |
|---|---|---|
| **Spot & derivatives DEX** | Perdagangan token dan kontrak berjangka | Langsung memakai exchange module |
| **Structured products** | Produk terstruktur, strategi otomatis | Butuh eksekusi presisi dan finality cepat |
| **Lending & borrowing** | Pinjam-meminjam dengan jaminan | Butuh oracle harga andal untuk likuidasi |
| **Real-world assets (RWA)** | Tokenisasi aset dunia nyata | Butuh infrastruktur pasar yang matang |
| **Prediction markets** | Pasar prediksi hasil peristiwa | Binary options didukung native |
| **Infrastruktur & tooling** | Wallet, explorer, indexer, bot | Selalu dibutuhkan ekosistem yang tumbuh |
| **AI × DeFi** | Agen otomatis untuk strategi keuangan | Finality cepat cocok untuk eksekusi agen |

:::tip Cara membaca tabel ini sebagai calon builder
Kolom paling berguna adalah yang ketiga. Setiap kategori ada di Injective karena ada **alasan teknis**, bukan kebetulan.

Kalau ide proyekmu tidak punya alasan teknis untuk berada di Injective — kalau ia sama saja dibangun di chain mana pun — itu sinyal untuk memikirkan ulang. Proyek terbaik memanfaatkan sesuatu yang **hanya** bisa dilakukan di sini.
:::

---

## 💹 Studi Kasus: Helix

**Helix** adalah DEX flagship di Injective dan contoh paling jelas dari apa yang dimungkinkan exchange module. Kunjungi di [helixapp.com](https://helixapp.com).

### Kenapa Helix menarik untuk dipelajari developer

**1. Ia tidak membangun orderbook-nya sendiri.**
Helix memakai exchange module bawaan chain. Yang dibangun timnya adalah antarmuka, pengalaman pengguna, dan fitur di atasnya — bukan mesin bursanya.

Pelajarannya: di Injective, **nilai tambahmu ada di lapisan aplikasi**, bukan di infrastruktur pasar. Itu menghemat berbulan-bulan pekerjaan.

**2. Ia merasakan pengalaman bursa terpusat, tapi non-kustodial.**
Order kamu di orderbook on-chain, asetmu di wallet-mu sendiri. Tidak ada perusahaan yang menahan danamu.

**3. Likuiditasnya bersama.**
Order di Helix ada di orderbook chain yang sama dengan aplikasi lain. Ini shared liquidity dari [Concept I Unit 2](../Concept-1-Arsitektur/exchange-module-orderbook) dalam praktik nyata.

### Latihan yang direkomendasikan

:::tip Buka Helix sambil membaca ini
Bukan untuk trading — untuk **membaca antarmukanya sebagai developer**:

1. Lihat orderbook-nya. Kenali bid, ask, dan spread yang kita bahas di Concept I Unit 2
2. Perhatikan perbedaan tampilan pasar **spot** dan **perpetual**
3. Perhatikan berapa cepat data ter-update — itu efek dari blok sub-detik
4. Tanyakan pada dirimu: **data apa saja yang harus diambil aplikasi ini dari chain?** Di Phase 3 kamu akan mengambil data yang persis sama lewat TypeScript SDK

Kamu tidak perlu menghubungkan wallet atau melakukan transaksi apa pun untuk latihan ini.
:::

---

## 🔎 Cara Menjelajahi Ekosistem Sendiri

Daftar aplikasi berubah cepat, dan halaman ini akan usang. Yang lebih berguna adalah **tahu cara mencarinya sendiri**:

| Sumber | Untuk apa |
|---|---|
| [injective.com](https://injective.com) | Halaman ekosistem resmi, biasanya paling mutakhir |
| [Explorer](https://blockscout.injective.network/) | Lihat contract yang benar-benar aktif dipakai, bukan sekadar terdaftar |
| [GitHub InjectiveLabs](https://github.com/InjectiveLabs) | Kode sumber, contoh, dan SDK |
| Grup Telegram CLC11 | Tanya peserta lain dan mentor |

:::warning Bedakan "terdaftar" dan "hidup"
Halaman ekosistem sering menampilkan proyek yang sudah lama tidak aktif. Cara memverifikasi: cari alamat contract-nya di explorer dan **lihat kapan transaksi terakhirnya.**

Ini kebiasaan riset yang berguna jauh melampaui camp ini — baik untuk menilai proyek yang mau kamu pakai, maupun untuk menghindari membangun sesuatu yang ternyata sudah ada dan mati karena tidak ada permintaannya.
:::

---

## 💡 Menemukan Celah untuk Dibangun

Menjelang [guided project](../../Phase-3-Building/Guided-Project/project-overview) di Phase 3, kamu akan butuh ide. Beberapa cara mencarinya:

**1. Cari friksi yang kamu alami sendiri.**
Selama Phase 0 kamu setup wallet dan faucet. Ada bagian yang membingungkan? Alat yang membuatnya lebih mudah punya pengguna nyata — yaitu peserta camp berikutnya.

**2. Cari yang ada di chain lain tapi belum ada di sini.**
Kategori aplikasi yang sudah matang di ekosistem lain sering belum punya padanan di Injective.

**3. Ambil sudut lokal.**
Kebutuhan pengguna Indonesia jarang jadi prioritas tim global: antarmuka bahasa Indonesia, penyajian harga dalam rupiah, alur onboarding untuk yang baru pertama kali punya wallet. Ini celah nyata, dan kamu lebih paham konteksnya daripada tim mana pun di luar negeri.

**4. Bangun alat untuk developer.**
Dashboard, indexer, contoh kode, template starter. Ekosistem yang sedang tumbuh selalu kekurangan ini.

:::tip Untuk guided project, kecil itu bagus
Kamu punya waktu sekitar satu minggu. **Proyek kecil yang selesai jauh lebih baik daripada proyek ambisius yang setengah jadi** — untuk kelulusan maupun untuk portofoliomu.

Satu fitur yang berjalan mulus mengalahkan lima fitur yang setengah jalan.
:::

---

## 🎯 Rangkuman

:::tip Yang Harus Kamu Ingat
- Ekosistem Injective condong ke keuangan: DEX, derivatif, lending, RWA, prediction market, tooling, AI × DeFi
- **Helix** memakai exchange module bawaan — timnya membangun aplikasi, bukan mesin bursa
- Di Injective, nilai tambah developer ada di **lapisan aplikasi**
- Verifikasi proyek "hidup" atau tidak lewat **transaksi terakhirnya di explorer**, bukan dari daftar ekosistem
- Celah ide: friksi yang kamu alami sendiri · yang belum ada di sini · **sudut lokal Indonesia** · tooling developer
- Untuk guided project: **kecil dan selesai** mengalahkan besar dan setengah jadi
:::

### ✅ Quick Check

1. Kenapa Helix tidak perlu membangun orderbook-nya sendiri?
2. Bagaimana cara memverifikasi sebuah dApp benar-benar masih aktif?
3. Sebutkan satu kategori aplikasi dan alasan teknis kenapa ia cocok di Injective.
4. Sebutkan satu ide proyek dengan sudut lokal Indonesia yang bisa dibangun di Injective.

---

**Lanjut:** [Unit 2 — Oracle, Bridge & Interoperabilitas](./oracle-bridge-interop) 👉
