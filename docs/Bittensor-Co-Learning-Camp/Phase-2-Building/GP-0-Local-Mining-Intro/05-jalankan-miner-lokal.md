---
sidebar_position: 5
title: ⛏️ Unit 5 — Jalankan Miner Lokal
description: Clone subnet-template resmi Bittensor, install dependencies, dan jalankan miner di komputer lokal (Windows WSL2, macOS, Linux) dengan screen/tmux supaya tetap berjalan di background.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# ⛏️ Unit 5 — Jalankan Miner Lokal

:::info Goal Unit Ini
Di akhir unit ini kamu akan:
- **Clone dan install** `opentensor/bittensor-subnet-template` — template miner generik resmi
- **Menjalankan miner** di lokal untuk pertama kali dan lihat log koneksi ke testnet
- **Menggunakan screen atau tmux** supaya miner tetap jalan saat terminal ditutup
- Memverifikasi miner **aktif di metagraph** (field `Active: True`)
:::

:::note Prasyarat
- ✅ [Unit 4](./register-subnet-testnet) selesai — punya UID di NetUID 1 testnet
- ✅ venv aktif: `source ~/bittensor-env/bin/activate`
- ✅ Git terinstall: `git --version`
:::

---

## 📦 Step 1 — Clone Subnet Template

Bittensor menyediakan template miner generik yang bisa langsung dijalankan di testnet:

```bash
# Masuk ke home directory
cd ~

# Clone repo resmi
git clone https://github.com/opentensor/bittensor-subnet-template.git

# Masuk ke folder
cd bittensor-subnet-template
```

Lihat struktur repo:

```bash
ls -la
# Kamu akan melihat: neurons/, template/, requirements.txt, README.md, dst.
```

---

## 🔧 Step 2 — Install Dependencies Subnet Template

Pastikan venv masih aktif, lalu:

Sebelum install, patch satu baris di `setup.py` yang menyebabkan error di Python 3.12+ — ini adalah dead import yang tidak dipakai tapi menyebabkan konflik:

```bash
# Hapus import pkg_resources yang tidak dipakai dari setup.py
sed -i '/from pkg_resources import parse_requirements/d' setup.py
```

Install PyTorch versi **CPU-only** dulu (jauh lebih kecil ~200 MB vs ~2 GB versi CUDA):

```bash
pip install torch --index-url https://download.pytorch.org/whl/cpu
```

Lalu install subnet template tanpa re-download torch:

```bash
pip install -e . --no-deps
pip install starlette pydantic rich pytest numpy "setuptools>=68"
```

Flag `--no-deps` = install package tanpa ikut-install semua dependencies (karena torch sudah kita install manual di atas).

Verifikasi:

```bash
python -c "import template; print('Template OK')"
# Output: Template OK
```

:::note Kenapa Pisah Install torch?
`requirements.txt` subnet template hanya menulis `torch>=2` tanpa qualifier — pip akan download versi CUDA terbaru (~2 GB + NVIDIA libraries). Untuk learning tanpa GPU, kita install PyTorch CPU-only (~200 MB) yang sudah cukup untuk menjalankan miner di testnet.

Kalau kamu sudah terlanjur download versi CUDA (torch 2.x CUDA), itu juga bisa dipakai — miner tetap jalan, hanya mubazir storage.
:::

---

## 🚀 Step 3 — Jalankan Miner (Foreground Dulu)

Pertama, jalankan di foreground untuk verifikasi log normal. Jangan langsung ke background.

<Tabs>
<TabItem value="linux-wsl" label="🐧 Linux / WSL2" default>

```bash
cd ~/bittensor-subnet-template

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
cd ~/bittensor-subnet-template

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

Kalau miner berhasil start, kamu akan lihat log seperti:

```text
2026-04-21 10:30:12 | INFO     | Loading wallet mywallet/miner1
2026-04-21 10:30:13 | INFO     | Connected to subtensor test
2026-04-21 10:30:14 | INFO     | Syncing metagraph for netuid 1...
2026-04-21 10:30:15 | INFO     | Found UID 42 on netuid 1
2026-04-21 10:30:15 | INFO     | Axon serving on 0.0.0.0:8091
2026-04-21 10:30:16 | INFO     | Miner ready. Waiting for validator queries...
```

:::warning Log Error yang Normal
Kamu mungkin melihat pesan seperti `No validators found` atau `Connection refused to validator X` — ini **normal** di awal. Validator testnet tidak selalu aktif. Yang penting tidak ada `ImportError` atau exception saat startup.
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
source ~/bittensor-env/bin/activate
cd ~/bittensor-subnet-template

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
source ~/bittensor-env/bin/activate
cd ~/bittensor-subnet-template

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
source ~/bittensor-env/bin/activate
cd ~/bittensor-subnet-template

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

```bash
# Aktifkan venv di terminal baru
source ~/bittensor-env/bin/activate

# Cek metagraph
btcli subnets metagraph --netuid 1 --network test
```

Cari UID kamu di tabel. Field `Active` harus `True`:

```text
│ UID │ Hotkey          │ Active │ Stake  │ Trust  │
│ 42  │ 5Gx1...miner1   │ True   │ τ 0.00 │ 0.0000 │
```

:::note Active vs Inactive
**Active: True** = miner kamu terdeteksi oleh subnet (axon endpoint respond).  
**Active: False** = port tidak accessible (firewall, CGNAT). Lihat Unit 6.
:::

---

## 🗂️ Struktur Direktori Miner

Setelah setup, direktori lokal kamu:

```
~/
├── bittensor-env/              # Python venv
│   └── bin/
│       ├── activate
│       ├── btcli
│       └── python
├── bittensor-subnet-template/  # Repo miner
│   ├── neurons/
│   │   └── miner.py           # Entry point
│   ├── template/              # Logic subnet
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
| `No module named 'pkg_resources'` saat `pip install -e .` | Dead import di `setup.py` line 27 tidak kompatibel dengan setuptools 82+ | `sed -i '/from pkg_resources import parse_requirements/d' setup.py` lalu `pip install -e .` |
| `ModuleNotFoundError: No module named 'template'` | pip install -e . belum dilakukan | `cd ~/bittensor-subnet-template && pip install -e . --no-build-isolation` |
| `Wallet not found` | Nama wallet/hotkey salah | Cek: `btcli wallet list` |
| `Connection refused` saat startup | Testnet subtensor offline sementara | Tunggu 5–10 menit, coba lagi |
| `Port 8091 already in use` | Ada proses lain pakai port 8091 | `lsof -i :8091` → kill PID tersebut; atau ganti port: `--axon.port 8092` |
| Miner exit langsung tanpa error | Mungkin ada warning yang jadi fatal | Jalankan tanpa `--logging.debug`, lihat output awal |
| `UID not found in metagraph` | Registrasi belum confirmed di chain | Tunggu 2–3 menit, chain butuh beberapa block |
| macOS: miner mati saat layar mati | caffeinate tidak dipakai | Tambah `caffeinate -i` sebelum `python3` |
| WSL2: koneksi ke subtensor gagal | WSL2 network bridging issue | Coba: `wsl --shutdown` di PowerShell, restart WSL2 |

---

## 🎯 Rangkuman

- **bittensor-subnet-template** = template miner generik untuk testnet, tidak butuh GPU
- Jalankan foreground dulu untuk verifikasi log startup bersih
- **screen** atau **tmux** = cara miner tetap jalan saat terminal ditutup
- **macOS**: wajib pakai `caffeinate -i` untuk mencegah sleep
- Verifikasi: `btcli subnets metagraph --netuid 1 --network test` → `Active: True`

### ✅ Quick Check

1. Kenapa kita install subnet template dengan `pip install -e .` bukan `pip install .`?
2. Apa yang terjadi pada miner kalau terminal ditutup tanpa screen/tmux?
3. Kenapa macOS memerlukan `caffeinate`?
4. Bedanya `Active: True` vs `Active: False` di metagraph?

<details>
<summary>💡 Jawaban</summary>

1. `-e` (editable mode) = package terinstall tapi source masih di folder aslinya. Kalau kamu edit file di `template/`, perubahan langsung berlaku tanpa reinstall. Cocok untuk development.
2. Miner akan mati ketika terminal ditutup karena prosesnya adalah child process dari shell session tersebut. Screen/tmux memisahkan proses dari sesi terminal.
3. macOS otomatis masuk sleep mode saat layar mati → semua proses non-essential dibekukan atau dimatikan. `caffeinate -i` meminta macOS tetap terjaga selama miner berjalan.
4. `Active: True` = validator bisa reach axon endpoint miner. `Active: False` = endpoint tidak accessible (biasanya firewall atau CGNAT).

</details>

---

**Next:** [Unit 6 — Koneksi, Port & Ngrok untuk CGNAT →](./koneksi-dan-port)

*Miner kamu hidup! Sekarang pastikan validator bisa menemukannya. 🌐*
