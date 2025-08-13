# Pengertian

Logic Error (Business Logic) adalah jenis kerentanan dalam smart contract yang terjadi ketika alur atau aturan bisnis yang diharapkan tidak dijalankan sesuai rancangan akibat kesalahan pada implementasi logika kode. Kesalahan ini tidak selalu menyebabkan runtime error atau kegagalan kompilasi, sehingga kontrak dapat tetap berjalan tetapi dengan perilaku yang salah atau dapat dieksploitasi.

## Contoh Nyata

Kasus di bawah ini memperlihatkan variabel `totalSupply` yang salah digunakan. Alih-alih menambah total suplai token saat _minting_, kode ini malah meng-assign ulang `totalSupply` ke nilai terakhir yang dimintakan, sehingga suplai menjadi tidak konsisten dan bisa dieksploitasi.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BadToken {
    mapping(address => uint256) public balanceOf;
    uint256 public totalSupply;

    function mint(address _to, uint256 _amount) external {
        // Salah: totalSupply diassign ulang, bukan ditambah
        totalSupply = _amount;
        balanceOf[_to] += _amount;
    }
}
```

### Skema Eksploitasi

1. Pengguna A _mint_ 100 token → totalSupply = 100.
2. Pengguna B _mint_ 1 token → totalSupply jadi 1, padahal A masih punya 100 token.
3. Sistem yang bergantung pada `totalSupply` (misalnya hitung harga, voting weight) jadi salah.

## Mitigasi

- Selalu uji konsistensi variabel global yang memengaruhi state penting.
- Terapkan _unit test_ untuk memastikan variabel berperilaku sesuai ekspektasi di setiap fungsi.
- Gunakan _code review_ untuk mendeteksi kesalahan sederhana yang berdampak besar pada logika.
