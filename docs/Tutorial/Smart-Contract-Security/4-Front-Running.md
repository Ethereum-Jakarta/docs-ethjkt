# Front Running

**Front-running** adalah serangan di mana pihak ketiga memantau **mempool** (tempat transaksi menunggu sebelum masuk ke blok) untuk melihat transaksi yang akan diproses.
Penyerang kemudian mengirim transaksi **serupa atau terkait** dengan **gas fee lebih tinggi** agar transaksinya diproses **lebih dulu** oleh miner/validator.

Di smart contract, hal ini sering dimanfaatkan untuk:

- Mengambil keuntungan dari **perubahan harga**
- Menutup peluang **arbitrase**
- Memanipulasi urutan eksekusi transaksi

## Contoh Nyata — DEX Swap + Sandwich Attack

Bayangkan di sebuah DEX (misal Uniswap-like AMM):

1. **Kondisi awal pool**

   ```
   Pool: 100 ETH ↔ 100,000 TOKEN
   Harga awal: 1 ETH = 1,000 TOKEN
   ```

2. **Transaksi korban**
   Alice ingin swap **10 ETH** → TOKEN.
   Transaksi ini masuk ke mempool **belum di-mine**.
   Kalau swap ini diproses:

   - TOKEN akan naik harga (karena AMM formula `x * y = k`)
   - Perubahan harga ini bisa dimanfaatkan.

3. **Penyerang memantau mempool**
   Bob (penyerang) melihat transaksi Alice dan **menghitung dampaknya**:
   Setelah swap Alice, harga akan naik sehingga 1 ETH = < 1,000 TOKEN.
   Artinya kalau Bob beli TOKEN **sebelum** Alice, lalu jual lagi **setelah** Alice, dia untung.

4. **Serangan sandwich:**

   - **Step 1 (Front-run)**: Bob kirim transaksi beli TOKEN (ETH → TOKEN) dengan **gas fee lebih tinggi** agar prosesnya **mendahului** transaksi Alice.
     → Harga TOKEN naik sedikit.
   - **Step 2 (Victim transaction)**: Transaksi Alice masuk, harga TOKEN naik **lebih tinggi lagi**.
   - **Step 3 (Back-run)**: Bob kirim transaksi jual TOKEN (TOKEN → ETH) untuk mengembalikan harga, tapi dengan keuntungan karena Alice sudah memompa harga.

5. **Hasil akhir**:

   - Alice dapat TOKEN lebih sedikit dari seharusnya (karena harga sudah naik akibat pembelian Bob sebelumnya).
   - Bob dapat ETH lebih banyak dari awal, mengambil keuntungan dari urutan transaksi ini.

### Contoh kode sederhana tanpa proteksi

```solidity
function swapToken(uint amountIn) external {
    uint amountOut = getAmountOut(amountIn);
    // Update state dan kirim tokenOut
    tokenOut.transfer(msg.sender, amountOut);
}
```

Jika ini dipanggil publik tanpa proteksi **slippage**, front-running menjadi mudah dilakukan.

### Mitigasi

1. **Slippage protection**

   ```solidity
   function swapToken(uint amountIn, uint minAmountOut) external {
       uint amountOut = getAmountOut(amountIn);
       require(amountOut >= minAmountOut, "Slippage too high");
       tokenOut.transfer(msg.sender, amountOut);
   }
   ```

   - Jika harga berubah signifikan akibat front-running, transaksi batal.

2. **Private transaction**

   - Gunakan **Flashbots** atau RPC dengan **private mempool** agar transaksi tidak terlihat publik sebelum di-include.

3. **Batch auction / commit-reveal**

   - Memproses transaksi dalam batch untuk menghilangkan keuntungan urutan eksekusi.
