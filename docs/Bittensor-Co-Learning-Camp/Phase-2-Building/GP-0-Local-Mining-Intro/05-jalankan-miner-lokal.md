---
sidebar_position: 5
title: ⛏️ Unit 5 — Jalankan Miner Lokal
description: Clone subnet-template yang sudah di-port ke Bittensor SDK 10.x, install dependencies, dan jalankan miner di komputer lokal (Windows WSL2, macOS, Linux) dengan screen/tmux supaya tetap berjalan di background.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# ⛏️ Unit 5 — Jalankan Miner Lokal

:::info Goal Unit Ini
Di akhir unit ini kamu akan:
- **Clone dan install** template miner yang sudah kompatibel dengan **Bittensor SDK 10.x**
- **Menjalankan miner** di lokal untuk pertama kali dan lihat log koneksi ke testnet
- **Menggunakan screen atau tmux** supaya miner tetap jalan saat terminal ditutup
- Memverifikasi miner **aktif di metagraph** (field `Active: True`)
:::

:::note Prasyarat
- ✅ [Unit 4](./register-subnet-testnet) selesai — punya UID di subnet testnet
- ✅ venv aktif: `source ~/bittensor-env-v10/bin/activate`
- ✅ Git terinstall: `git --version`
:::

---

## ⚠️ Kenapa Bukan Template Resmi `opentensor`?

Template resmi `opentensor/bittensor-subnet-template` ditulis untuk **SDK 9.x** dan **error di SDK 10.x** (yang sekarang jadi versi default `pip install bittensor`). SDK 10 menghapus semua alias huruf kecil (`bt.subtensor`, `bt.metagraph`, `bt.wallet`, `bt.axon`, ...) dan menggantinya dengan PascalCase (`bt.Subtensor`, `bt.Metagraph`, ...). Template lama masih memakai nama lama di ~18 tempat, jadi langsung error saat dijalankan:

```
AttributeError: module 'bittensor' has no attribute 'metagraph'
```

Karena itu kita memakai **fork yang sudah di-port ke SDK 10.x**:

👉 **https://github.com/Ethereum-Jakarta/bittensor-subnet-template-v10**

Daftar lengkap perubahannya ada di file `PORTING.md` di repo tersebut. Fork ini sudah diverifikasi jalan di testnet untuk **miner maupun validator**.

---

## 📦 Step 1 — Clone Subnet Template (versi SDK 10.x)

```bash
# Masuk ke home directory
cd ~

# Clone fork yang sudah kompatibel SDK 10.x
git clone https://github.com/Ethereum-Jakarta/bittensor-subnet-template-v10.git

# Masuk ke folder
cd bittensor-subnet-template-v10
```

Lihat struktur repo:

```bash
ls -la
# Kamu akan melihat: neurons/, template/, requirements.txt, PORTING.md, README.md, dst.
```

---

## 🔧 Step 2 — Install Dependencies Subnet Template

Pastikan venv masih aktif (ada `(bittensor-env-v10)` di prompt).

Install PyTorch versi **CPU-only** dulu (jauh lebih kecil ~200 MB vs ~2 GB versi CUDA):

```bash
pip install torch --index-url https://download.pytorch.org/whl/cpu
```

Lalu install template. Perintah ini otomatis menarik `bittensor` 10.x (sudah di-pin di `requirements.txt` fork):

```bash
pip install -e .
```

Flag `-e` (editable mode) = package terinstall tapi source tetap di folder aslinya, jadi kalau kamu edit file di `template/`, perubahan langsung berlaku tanpa reinstall.

:::danger Jangan Lewati `pip install -e .` — dan jalankan SETELAH torch
Dua jebakan paling umum di step ini:

1. **Lewati `pip install -e .`** → nanti `python neurons/miner.py` gagal dengan `ModuleNotFoundError: No module named 'template'`. Tanpa `-e`, folder `template/` cuma "kebetulan kelihatan" saat kamu di root repo, tapi `miner.py` dijalankan dari `neurons/` sehingga tidak menemukannya.
2. **Install torch SETELAH `pip install -e .`** → torch butuh `setuptools<82` dan akan menurunkannya ke 70.2.0, padahal bittensor butuh `setuptools>=78.1.1` (muncul warning konflik). **Urutan benar: torch dulu, baru `pip install -e .`** — `-e` akan menaikkan setuptools kembali ke 81.x (cocok untuk torch & bittensor).

Kalau kamu terlanjur lihat warning `bittensor ... requires setuptools>=78.1.1, but you have setuptools 70.2.0`, cukup jalankan ulang `pip install -e .` (atau `pip install 'setuptools>=78.1.1,<82'`).
:::

:::note Tidak perlu patch `setup.py` lagi
Versi lama panduan ini menyuruh menjalankan `sed` untuk menghapus baris `pkg_resources` di `setup.py`. **Fork ini sudah memperbaikinya**, jadi langkah itu tidak diperlukan lagi.
:::

Verifikasi — jalankan dari folder **lain** (`/tmp`) supaya benar-benar menguji editable install, bukan ketipu folder kerja:

```bash
(cd /tmp && python -c "import template; print('Template OK')")
# Output: Template OK
```

:::tip Kenapa dari `/tmp`?
Kalau kamu cek `python -c "import template"` dari dalam folder repo, ia bisa lulus **walau `pip install -e .` belum jalan** (Python menemukan folder `template/` di cwd). Mengetes dari `/tmp` memastikan `template` benar-benar terinstall — sama seperti cara `neurons/miner.py` mengimpornya. Cek juga: `pip show bittensor_subnet_template` harus menampilkan path repo kamu.
:::

---

## 🚀 Step 3 — Jalankan Miner (Foreground Dulu)

Pertama, jalankan di foreground untuk verifikasi log normal. Jangan langsung ke background.

:::tip Sesuaikan netuid
Ganti `--netuid 1` dengan **netuid subnet tempat kamu register di Unit 4**. Kalau kamu register di subnet lain (karena netuid 1 penuh), pakai netuid itu.
:::

<Tabs>
<TabItem value="linux-wsl" label="🐧 Linux / WSL2" default>

```bash
cd ~/bittensor-subnet-template-v10

python neurons/miner.py \
  --netuid 1 \
  --wallet.name mywallet \
  --wallet.hotkey miner1 \
  --subtensor.network test \
  --logging.debug
```

</TabItem>
<TabItem value="macos" label="🍎 macOS">

Gunakan `caffeinate` untuk mencegah Mac tidur dan membunuh miner:

```bash
cd ~/bittensor-subnet-template-v10

caffeinate -i python3 neurons/miner.py \
  --netuid 1 \
  --wallet.name mywallet \
  --wallet.hotkey miner1 \
  --subtensor.network test \
  --logging.debug
```

:::note Kenapa caffeinate?
macOS agresif mematikan proses saat layar mati atau mode tidur. `caffeinate -i` mencegah Mac tidur selama miner berjalan.
:::

</TabItem>
</Tabs>

### Log yang Sehat

Kalau hotkey kamu **belum teregister** di subnet, miner akan langsung berhenti dengan pesan yang jelas (ini benar, bukan bug):

```text
... | ERROR | Wallet (Name: 'mywallet', Hotkey: 'miner1', ...) is not registered on netuid 1.
       Please register the hotkey using `btcli subnets register` before trying again
```

Kalau sudah teregister, log sehat terlihat seperti ini:

```text
... | INFO | Wallet: Wallet (Name: 'mywallet', Hotkey: 'miner1', ...)
... | INFO | Subtensor: <Subtensor ... network: test>
... | INFO | Metagraph: metagraph(netuid:1, ...)
... | INFO | Running neuron on subnet: 1 with uid 42 using network: ...
... | INFO | Serving axon on 0.0.0.0:8091
... | INFO | Miner starting at block: ...
```

:::warning Log Error yang Normal
Kamu mungkin melihat pesan seperti `No validators found` atau `Connection refused to validator X` — ini **normal** di awal. Validator testnet tidak selalu aktif. Yang penting tidak ada `ImportError` atau `AttributeError` saat startup.
:::

**Tekan Ctrl+C** untuk stop setelah verifikasi log startup bersih.

---

## 🔄 Step 4 — Jalankan Miner di Background

Agar miner tetap jalan saat kamu tutup terminal, gunakan `screen` atau `tmux`.

<Tabs>
<TabItem value="screen" label="📺 Screen (Mudah)" default>

### Install screen

```bash
# Ubuntu/WSL2/Debian
sudo apt install -y screen

# macOS (via Homebrew)
brew install screen
```

### Buat session baru

```bash
screen -S bittensor-miner
```

Terminal baru terbuka. Di dalam screen, jalankan miner:

<Tabs>
<TabItem value="screen-linux" label="Linux/WSL2">

```bash
source ~/bittensor-env-v10/bin/activate
cd ~/bittensor-subnet-template-v10

python neurons/miner.py \
  --netuid 1 \
  --wallet.name mywallet \
  --wallet.hotkey miner1 \
  --subtensor.network test \
  --logging.debug
```

</TabItem>
<TabItem value="screen-macos" label="macOS">

```bash
source ~/bittensor-env-v10/bin/activate
cd ~/bittensor-subnet-template-v10

caffeinate -i python3 neurons/miner.py \
  --netuid 1 \
  --wallet.name mywallet \
  --wallet.hotkey miner1 \
  --subtensor.network test \
  --logging.debug
```

</TabItem>
</Tabs>

### Detach dari screen (miner tetap jalan)

Tekan **Ctrl+A**, lalu tekan **D** (detach).

Terminal normal kembali, tapi miner masih jalan di background.

### Kembali ke session miner

```bash
screen -r bittensor-miner
```

### Perintah screen penting

```bash
screen -ls                    # list semua session aktif
screen -r bittensor-miner     # re-attach ke session
screen -X -S bittensor-miner quit  # kill session (stop miner)
```

</TabItem>
<TabItem value="tmux" label="🖥️ Tmux (Advanced)">

### Install tmux

```bash
# Ubuntu/WSL2
sudo apt install -y tmux

# macOS
brew install tmux
```

### Buat session baru

```bash
tmux new -s bittensor-miner
```

Jalankan miner di dalam tmux:

```bash
source ~/bittensor-env-v10/bin/activate
cd ~/bittensor-subnet-template-v10

# Linux/WSL2
python neurons/miner.py --netuid 1 --wallet.name mywallet --wallet.hotkey miner1 --subtensor.network test --logging.debug

# macOS
caffeinate -i python3 neurons/miner.py --netuid 1 --wallet.name mywallet --wallet.hotkey miner1 --subtensor.network test --logging.debug
```

### Detach (miner tetap jalan)

Tekan **Ctrl+B**, lalu tekan **D**.

### Re-attach

```bash
tmux attach -t bittensor-miner
```

### Perintah tmux penting

```bash
tmux ls                           # list sessions
tmux attach -t bittensor-miner    # re-attach
tmux kill-session -t bittensor-miner  # kill/stop
```

</TabItem>
</Tabs>

---

## ✅ Step 5 — Verifikasi Miner Aktif

Setelah miner berjalan beberapa menit, buka terminal baru dan verifikasi:

:::warning Testnet: `metagraph` btcli juga kena — pakai script SDK
Per Juni 2026 `btcli subnets metagraph --network test` gagal (`Swap.AlphaSqrtPrice not found`). Untuk cek status miner di **testnet**, pakai `metagraph.py` dari repo ini — ia menampilkan kolom **AXON** (`ip:port` kalau miner kamu sudah serving) dan **ACT**, persis yang kamu butuhkan di step ini:
```bash
# Aktifkan venv di terminal baru, lalu masuk ke folder repo
source ~/bittensor-env-v10/bin/activate
cd ~/bittensor-subnet-template-v10

# Tabel metagraph, baris kamu ditandai '<-- you'
python scripts/metagraph.py --netuid 1 --wallet.name mywallet --wallet.hotkey miner1
```
Untuk **mainnet** `btcli subnets metagraph --netuid 1` tetap berlaku.
:::

Cari baris kamu (ditandai `<-- you`). Kolom **AXON** harus berisi `ip:port` kamu (bukan `—`):

```text
 UID        STAKE  TRUST  INCENT   DIVID  EMISSION VP ACT    UPD  AXON                  HOTKEY
------------------------------------------------------------------------------------------------
  87       0.0000  0.000  0.0000  0.0000  0.000000  ·   Y      3  174.61.251.162:8091   5GNaMz7WkB…  <-- you
```

:::note Axon serving vs `—`
**AXON = `ip:port`** = miner kamu sudah serving axon dan validator bisa menemukannya.  
**AXON = `—`** = miner belum serving / port tidak accessible (firewall, CGNAT). Lihat Unit 6.
:::

---

## 🗂️ Struktur Direktori Miner

Setelah setup, direktori lokal kamu:

```
~/
├── bittensor-env-v10/                   # Python venv (btcli + SDK 10.x)
│   └── bin/
│       ├── activate
│       ├── btcli
│       └── python
├── bittensor-subnet-template-v10/   # Repo miner (fork SDK 10.x)
│   ├── neurons/
│   │   └── miner.py                 # Entry point
│   ├── template/                    # Logic subnet
│   ├── PORTING.md                   # Catatan port ke SDK 10.x
│   └── requirements.txt
└── .bittensor/
    └── wallets/
        └── mywallet/
            ├── coldkey
            ├── coldkeypub.txt
            └── hotkeys/
                └── miner1
```

---

## 🐛 Troubleshooting Menjalankan Miner

| Error | Penyebab | Solusi |
|-------|----------|--------|
| `AttributeError: module 'bittensor' has no attribute 'metagraph'` | Kamu memakai template **resmi** (SDK 9.x) di atas SDK 10.x | Pakai fork ini: `git clone https://github.com/Ethereum-Jakarta/bittensor-subnet-template-v10.git` |
| `ModuleNotFoundError: No module named 'template'` | `pip install -e .` belum dilakukan | `cd ~/bittensor-subnet-template-v10 && pip install -e .` |
| `... is not registered on netuid N` | Hotkey belum teregister di subnet itu | Register dulu (Unit 4): `btcli subnet register --netuid N --wallet-name mywallet --hotkey miner1 --network test` |
| `Wallet not found` | Nama wallet/hotkey salah | Cek: `btcli wallet list` |
| `Connection refused` saat startup | Testnet subtensor offline sementara | Tunggu 5–10 menit, coba lagi |
| `Port 8091 already in use` | Ada proses lain pakai port 8091 | `lsof -i :8091` → kill PID tersebut; atau ganti port: `--axon.port 8092` |
| macOS: miner mati saat layar mati | caffeinate tidak dipakai | Tambah `caffeinate -i` sebelum `python3` |
| WSL2: koneksi ke subtensor gagal | WSL2 network bridging issue | Coba: `wsl --shutdown` di PowerShell, restart WSL2 |

---

## 🎯 Rangkuman

- Template resmi `opentensor` **error di SDK 10.x** → kita pakai **fork `Ethereum-Jakarta/bittensor-subnet-template-v10`**
- Install: **CPU torch** dulu, lalu `pip install -e .` (otomatis menarik `bittensor` 10.x) — **tanpa patch `sed`**
- Jalankan foreground dulu untuk verifikasi log startup bersih
- **screen** atau **tmux** = cara miner tetap jalan saat terminal ditutup
- **macOS**: wajib pakai `caffeinate -i` untuk mencegah sleep
- Verifikasi (testnet): `python scripts/metagraph.py --netuid 1 --wallet.name mywallet --wallet.hotkey miner1` → kolom **AXON** baris kamu berisi `ip:port`

### ✅ Quick Check

1. Kenapa kita pakai fork `bittensor-subnet-template-v10`, bukan template resmi `opentensor`?
2. Kenapa kita install subnet template dengan `pip install -e .` bukan `pip install .`?
3. Apa yang terjadi pada miner kalau terminal ditutup tanpa screen/tmux?
4. Bedanya `Active: True` vs `Active: False` di metagraph?

<details>
<summary>💡 Jawaban</summary>

1. Template resmi memakai API SDK 9.x (alias huruf kecil seperti `bt.metagraph`) yang **dihapus di SDK 10.x**, jadi langsung `AttributeError`. Fork sudah di-port ke API PascalCase SDK 10.x.
2. `-e` (editable mode) = package terinstall tapi source masih di folder aslinya. Kalau kamu edit file di `template/`, perubahan langsung berlaku tanpa reinstall. Cocok untuk development.
3. Miner akan mati ketika terminal ditutup karena prosesnya adalah child process dari shell session tersebut. Screen/tmux memisahkan proses dari sesi terminal.
4. `Active: True` = validator bisa reach axon endpoint miner. `Active: False` = endpoint tidak accessible (biasanya firewall atau CGNAT).

</details>

---

**Next:** [Unit 6 — Koneksi, Port & Ngrok untuk CGNAT →](./koneksi-dan-port)

*Miner kamu hidup! Sekarang pastikan validator bisa menemukannya. 🌐*
