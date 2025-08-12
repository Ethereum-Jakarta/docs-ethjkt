# Denial Of Service

Denial of Service (DoS) pada smart contract adalah serangan yang bertujuan untuk mengganggu atau menghentikan fungsi kontrak agar tidak dapat dijalankan sebagaimana mestinya. Serangan ini dapat dilakukan dengan memanfaatkan celah logika, biaya gas yang sangat tinggi, atau interaksi dengan kontrak eksternal yang gagal. Dampaknya bisa berupa penundaan transaksi, penguncian dana, atau bahkan penghentian permanen fungsi kontrak tertentu.

## Contoh Nyata

Salah satu bentuk DoS adalah ketika kontrak bergantung pada external call yang gagal. Jika penerima tidak dapat menerima ETH (misalnya fallback function mereka revert), maka transaksi akan gagal dan mencegah eksekusi lanjutan.

```solidity
function distributeFunds(address[] memory recipients, uint amount) external {
    for (uint i = 0; i < recipients.length; i++) {
        (bool success, ) = recipients[i].call{value: amount}("");
        require(success, "Transfer failed");
    }
}
```

Jika salah satu penerima membuat fallback function yang selalu revert, maka seluruh proses distribusi akan gagal, menyebabkan DoS bagi semua penerima lainnya.

## Mitigasi

- Gunakan withdraw payment pattern sehingga pengguna mengambil sendiri dana mereka.
- Validasi input agar tidak ada alamat bermasalah yang menghalangi eksekusi.
