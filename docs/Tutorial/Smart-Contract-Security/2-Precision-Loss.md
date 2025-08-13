# Rounding Error (Kesalahan Pembulatan)

Rounding error adalah kerentanan yang terjadi ketika hasil perhitungan di smart contract tidak akurat akibat keterbatasan representasi angka. Di Ethereum dan kebanyakan blockchain, smart contract tidak memiliki tipe data **floating point** (angka desimal) seperti pada bahasa pemrograman lain, melainkan hanya bekerja dengan **integer** (bilangan bulat). Untuk mengatasi ini, angka desimal biasanya diwakili dengan mengalikan nilai dengan faktor tertentu (misalnya `1e18` untuk token ERC20).

Masalah muncul ketika pembagian dilakukan pada bilangan bulat. Integer division di Solidity selalu membulatkan ke bawah(floor), sehingga sisa desimal akan hilang. Walaupun terlihat kecil, kesalahan pembulatan ini bisa menumpuk seiring banyaknya transaksi dan bahkan dapat dimanfaatkan oleh pihak berbahaya untuk mendapatkan keuntungan.

## Contoh Nyata

Misalkan sebuah smart contract membagi reward 5 token ke 2 user:

```solidity
uint256 totalReward = 5;
uint256 recipients = 2;
uint256 rewardPerUser = totalReward / recipients;
// hasil: 2, bukan 2.5
```

Setiap user akan menerima 2 token, sehingga ada 1 token yang tersisa di kontrak dan tidak dibagikan.
Dalam sistem DeFi, selisih ini bisa dimanfaatkan oleh penyerang untuk menarik sisa token berulang kali.

Contoh Finding -> User menerima reward lebih sedikit dari seharusnya karena precision loss. ([Link Finding](https://github.com/sherlock-audit/2024-12-numa-audit-judging/issues/161))

## Mitigasi

- Gunakan faktor presisi besar (misalnya `1e18`) untuk semua perhitungan, lalu dibagi pada akhir proses.
- Hindari pembagian di awal perhitungan.
- Pertimbangkan mekanisme pembagian sisa hasil pembulatan ke salah satu pihak atau disimpan di treasury untuk mencegah penyalahgunaan.
