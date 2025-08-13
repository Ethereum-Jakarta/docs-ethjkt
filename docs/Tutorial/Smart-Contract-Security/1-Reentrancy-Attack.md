# Reentrancy Attack

Reentrancy attack adalah serangan pada smart contract yang terjadi ketika sebuah kontrak memanggil kontrak eksternal sebelum memperbarui state internalnya. Hal ini memungkinkan kontrak eksternal tersebut untuk memanggil ulang (re-enter) fungsi awal secara berulang dalam satu transaksi, sehingga logika kontrak rusak, misalnya saldo belum berkurang tetapi dana sudah terkirim.

## Ilustrasi Sederhana

Misalkan kita memiliki fungsi `withdraw()` seperti berikut:

```solidity
function withdraw(uint _amount) public {
    require(balances[msg.sender] >= _amount);

    // Kirim ETH ke pengguna
    (bool success, ) = msg.sender.call{value: _amount}("");
    require(success, "Transfer failed");

    // Update saldo setelah kirim
    balances[msg.sender] -= _amount;
}
```

Masalahnya:

- Saldo baru dikurangi setelah ETH dikirim.
- Jika `msg.sender` adalah kontrak berbahaya dengan fallback seperti ini:

```solidity
fallback() external payable {
    victim.withdraw(1 ether);
}
```

Maka saat `call` mengirim ETH, fallback akan dipanggil, lalu kontrak berbahaya bisa memanggil ulang `withdraw()` sebelum saldo diperbarui, sehingga bisa menarik dana berkali-kali.

## Contoh Nyata

The DAO Hack (2016)

- Kerugian: ± \$60 juta ETH
- Mekanisme: Penyerang memanfaatkan reentrancy untuk memanggil `withdraw()` berkali-kali.
- Dampak: Hard fork Ethereum → lahirnya Ethereum Classic.

## Cara Mencegah

### 1. Checks-Effects-Interactions Pattern

Urutkan kode menjadi:
Cek kondisi → Update state → Interaksi eksternal

```solidity
function withdraw(uint _amount) public {
    require(balances[msg.sender] >= _amount);

    // Update saldo dulu
    balances[msg.sender] -= _amount;

    // Baru kirim ETH
    (bool success, ) = msg.sender.call{value: _amount}("");
    require(success, "Transfer failed");
}
```

### 2. Gunakan ReentrancyGuard

Memakai library OpenZeppelin dan modifier `nonReentrant` untuk mencegah panggilan berulang pada fungsi yang sama.

### 3. Minimalkan Interaksi Eksternal

- Hindari `call` atau transfer otomatis jika tidak perlu.
- Gunakan pola withdrawal pattern ketimbang pembayaran langsung.
