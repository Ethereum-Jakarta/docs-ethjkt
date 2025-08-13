# Pengertian

Access control pada smart contract adalah mekanisme keamanan yang digunakan untuk membatasi dan mengatur siapa yang memiliki izin untuk menjalankan fungsi atau mengakses data tertentu di dalam kontrak. Tanpa pengaturan kontrol akses yang tepat, pihak yang tidak berwenang dapat memanggil fungsi sensitif seperti mencetak token baru, menarik dana dari kontrak, atau mengubah parameter penting protokol. Hal ini dapat berujung pada kerugian finansial, hilangnya kepercayaan pengguna, atau bahkan kehancuran total ekosistem yang dibangun.

## Contoh Nyata

Kasus umum terjadi ketika fungsi penting tidak diberi pembatasan `onlyOwner`, sehingga siapa pun bisa memanggilnya.

```solidity
contract Token {
    mapping(address => uint) public balances;

    function mint(address to, uint amount) external {
        balances[to] += amount; // Tidak ada pembatasan akses
    }
}
```

Dengan kode di atas, siapa pun dapat memanggil `mint()` dan mencetak token tanpa batas ke alamat mereka sendiri.

## Mitigasi

- Gunakan _modifier_ seperti `onlyOwner` atau _role-based access control_ (misalnya OpenZeppelin `AccessControl`).
- Audit secara menyeluruh semua fungsi publik dan eksternal.
- Terapkan pola _multi-signature_ untuk interaksi penting.
