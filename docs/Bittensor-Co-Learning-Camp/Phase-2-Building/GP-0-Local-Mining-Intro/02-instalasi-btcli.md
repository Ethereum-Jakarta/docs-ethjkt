---
sidebar_position: 2
title: 🐍 Unit 2 — Instalasi Python, venv & btcli
description: Install Python 3.10+, buat virtual environment terisolasi, install bittensor-cli dan Bittensor SDK, lalu verifikasi semua berjalan di Windows WSL2, macOS, dan Linux.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 🐍 Unit 2 — Instalasi Python, venv & btcli

:::info Goal Unit Ini
Di akhir unit ini kamu akan:
- Punya **Python 3.10+** terinstall dan verified
- Punya **virtual environment** `~/bittensor-env-v10` yang terisolasi
- **`btcli`** (`bittensor-cli`) dan **Bittensor SDK** (`bittensor` 10.x) terinstall di venv
- Bisa menjalankan `btcli --help` tanpa error
:::

:::note Prasyarat
- ✅ [Unit 1](./intro-dan-hardware-check) selesai — WSL2 aktif (Windows) atau terminal siap
- ✅ Koneksi internet untuk download packages
:::

:::danger Sudah Coba Versi Lama Kemarin & Gagal?
Panduan ini sudah **diperbarui untuk Bittensor SDK 10.x**. Kalau kemarin kamu mengikuti versi lama dan venv-nya rusak (`ImportError`, `ScaleObj`, dll), **jangan pakai venv lama itu lagi**. Kita sengaja memakai nama venv **baru** di bawah ini — `~/bittensor-env-v10` — supaya kamu mulai dari nol yang bersih.

Opsional, bersihkan sisa instalasi lama yang rusak:
```bash
# Hapus venv lama yang rusak
rm -rf ~/bittensor-env

# Hapus juga baris 'alias btenv=...' lama dari ~/.bashrc (kalau ada),
# supaya tidak bentrok dengan alias baru btenv10
```
:::

---

## 🐍 Step 1 — Install Python 3.10+

<Tabs>
<TabItem value="windows" label="🪟 Windows (WSL2)" default>

Buka terminal **Ubuntu** (bukan PowerShell/CMD).

Ubuntu 22.04 sudah include Python 3.10 secara default. Verifikasi:

```bash
python3 --version
# Output: Python 3.10.12 (atau lebih baru)
```

Jika Python belum ada atau versinya lama:

```bash
# Tambah PPA deadsnakes (kalau Ubuntu 20.04)
sudo add-apt-repository ppa:deadsnakes/ppa
sudo apt update
sudo apt install -y python3.10 python3.10-venv python3.10-distutils

# Install pip untuk Python 3.10
curl -sS https://bootstrap.pypa.io/get-pip.py | python3.10
```

Install build dependencies:

```bash
sudo apt install -y build-essential git curl wget libssl-dev pkg-config python3-pip
```

</TabItem>
<TabItem value="macos" label="🍎 macOS">

macOS bawaan punya Python 3.x tapi versi bisa berbeda. Install versi spesifik via Homebrew:

```bash
brew install python@3.10
```

Tambah ke PATH:

```bash
# Apple Silicon (M1/M2/M3)
echo 'export PATH="/opt/homebrew/opt/python@3.10/bin:$PATH"' >> ~/.zprofile
source ~/.zprofile

# Intel Mac
echo 'export PATH="/usr/local/opt/python@3.10/bin:$PATH"' >> ~/.zprofile
source ~/.zprofile
```

Verifikasi:

```bash
python3.10 --version
# Output: Python 3.10.x
```

</TabItem>
<TabItem value="linux" label="🐧 Linux">

**Ubuntu 22.04** (sudah ada Python 3.10):
```bash
python3 --version
sudo apt install -y python3-pip python3-venv build-essential git curl
```

**Ubuntu 20.04** (perlu update):
```bash
sudo add-apt-repository ppa:deadsnakes/ppa
sudo apt update
sudo apt install -y python3.10 python3.10-venv python3.10-distutils
```

**Fedora:**
```bash
sudo dnf install python3.10 python3-pip git curl
```

</TabItem>
</Tabs>

---

## 📦 Step 2 — Buat Virtual Environment

Virtual environment (venv) = sandbox terisolasi untuk dependencies Python. Penting supaya btcli tidak konflik dengan package sistem.

<Tabs>
<TabItem value="windows" label="🪟 Windows (WSL2)" default>

```bash
# Buat venv di home directory
python3 -m venv ~/bittensor-env-v10

# Aktifkan venv
source ~/bittensor-env-v10/bin/activate

# Prompt kamu akan berubah jadi:
# (bittensor-env-v10) ubuntu@hostname:~$
```

Tambah alias supaya tidak perlu ketik panjang tiap kali:

```bash
echo 'alias btenv10="source ~/bittensor-env-v10/bin/activate"' >> ~/.bashrc
source ~/.bashrc
```

Sekarang cukup ketik `btenv10` untuk aktifkan venv.

</TabItem>
<TabItem value="macos" label="🍎 macOS">

```bash
# Buat venv
python3.10 -m venv ~/bittensor-env-v10

# Aktifkan venv
source ~/bittensor-env-v10/bin/activate

# Prompt kamu berubah jadi:
# (bittensor-env-v10) username@hostname ~ %
```

Tambah alias:

```bash
echo 'alias btenv10="source ~/bittensor-env-v10/bin/activate"' >> ~/.zprofile
source ~/.zprofile
```

</TabItem>
<TabItem value="linux" label="🐧 Linux">

```bash
# Buat venv
python3 -m venv ~/bittensor-env-v10

# Aktifkan
source ~/bittensor-env-v10/bin/activate

# Alias untuk kemudahan
echo 'alias btenv10="source ~/bittensor-env-v10/bin/activate"' >> ~/.bashrc
source ~/.bashrc
```

</TabItem>
</Tabs>

:::warning Jangan Lupa Aktifkan venv
Setiap kali buka terminal baru, kamu harus aktifkan venv lagi: `source ~/bittensor-env-v10/bin/activate` (atau `btenv10` kalau sudah setup alias). Kalau lupa, `btcli` tidak akan ditemukan.
:::

---

## 🔧 Step 3 — Install btcli & Bittensor SDK

Pastikan venv **aktif** (ada `(bittensor-env-v10)` di prompt) sebelum lanjut.

```bash
# Upgrade pip dulu
pip install --upgrade pip

# Install Bittensor CLI (btcli) + Bittensor SDK (versi terbaru, 10.x)
pip install bittensor-cli bittensor
```

:::danger Jangan pin `bittensor<10.0.0` lagi!
Versi lama panduan ini menyuruh `pip install "bittensor<10.0.0"`. **Sekarang itu justru bikin error.** Per 2026, `btcli` (`bittensor-cli` 9.x) butuh `async-substrate-interface` versi **2.x**, sedangkan SDK `bittensor` **9.x** butuh API **1.x** — jadi keduanya **bentrok di satu venv** dan muncul:

```
ImportError: cannot import name 'ScaleObj' from 'async_substrate_interface.types'
```

Solusinya: **install `bittensor` 10.x** (tanpa pin sama sekali). SDK 10.x dan btcli 9.x **kompatibel** karena sama-sama memakai async-substrate 2.x — `pip check` bersih, tanpa konflik.
:::

:::note btcli & SDK beda nomor versi — itu normal sekarang
`btcli` (`bittensor-cli`, ~9.22.x) dan SDK (`bittensor`, ~10.4.x) sekarang ada di **major version yang berbeda**. Itu disengaja — keduanya sudah jadi package terpisah. Jangan kaget kalau nomornya tidak sama.
:::

---

## ✅ Step 4 — Verifikasi Instalasi

```bash
# Verifikasi btcli
btcli --help
# Harus muncul help text dengan daftar commands

# Verifikasi btcli version
btcli --version
# Output: BTCLI version: 9.22.3 (atau lebih baru)

# Verifikasi SDK
python -c "import bittensor; print('bittensor version:', bittensor.__version__)"
# Output: bittensor version: 10.4.1 (harus >= 10)
```

Output `btcli --help` yang normal:

```text
 Usage: btcli [OPTIONS] COMMAND [ARGS]...

 Command line interface (CLI) for Bittensor.

╭─ Commands ──────────────────────────────────────────────╮
│ config     Config commands, aliases: `c`, `conf`        │
│ wallet     Wallet commands, aliases: `wallets`, `w`     │
│ stake      Stake commands, alias: `st`                  │
│ subnets    Subnets commands, alias: `s`, `subnet`       │
│ sudo       Sudo commands, alias: `su`                   │
│ ...                                                     │
╰─────────────────────────────────────────────────────────╯
```

:::note Format btcli v9 berbeda
btcli v9 memakai tampilan tabel (rich/typer), bukan `argparse` gaya lama. Perhatikan `subnets` punya alias `subnet` dan `s` — keduanya bisa dipakai.
:::

:::tip Kalau `btcli: command not found`
venv belum aktif. Jalankan:
```bash
source ~/bittensor-env-v10/bin/activate
```
Lalu coba lagi.
:::

---

## 🔐 Step 4b — Fix SSL (Jika Ada Error)

Beberapa setup mengalami error SSL saat btcli coba konek ke chain. Kalau ada error `SSL: CERTIFICATE_VERIFY_FAILED`:

```bash
python -m bittensor certifi
```

---

## 🐛 Troubleshooting Instalasi

| Error | Penyebab | Solusi |
|-------|----------|--------|
| `error: Microsoft Visual C++ 14.0 required` | Kamu di Windows tanpa WSL2 | Pindah ke terminal Ubuntu WSL2 |
| `failed building wheel for cryptography` | Dev headers kurang | `sudo apt install libssl-dev libffi-dev python3-dev` |
| `pip: command not found` | pip tidak ada di PATH venv | `python3 -m ensurepip --upgrade` |
| `btcli: command not found` | venv tidak aktif | `source ~/bittensor-env-v10/bin/activate` |
| `ModuleNotFoundError: 'bittensor'` | SDK belum install atau venv salah | Pastikan venv aktif, lalu `pip install bittensor` |
| `ERROR: Could not find a version that satisfies the requirement bittensor` | Network issue / pypi timeout | `pip install bittensor --retries 5` |
| `ImportError: cannot import name 'ScaleObj' from 'async_substrate_interface...'` | SDK `bittensor` 9.x terpasang bareng btcli → bentrok async-substrate | `pip install -U bittensor` (pakai **10.x**, jangan pin `<10`) |

---

## 📋 Quick Reference — Perintah Harian

```bash
# Aktifkan venv (wajib tiap session baru)
source ~/bittensor-env-v10/bin/activate   # atau: btenv10

# Deaktifkan venv
deactivate

# Cek package terinstall
pip list | grep -E "bittensor|btcli"

# Update btcli saja (tanpa upgrade SDK)
pip install --upgrade bittensor-cli
```

---

## 🎯 Rangkuman

- **Python 3.10+** adalah syarat minimum — Ubuntu 22.04 sudah include
- **venv** terisolasi di `~/bittensor-env-v10` — aktifkan setiap sesi baru
- Install **`bittensor-cli`** (btcli) dan **`bittensor`** (SDK 10.x) — **jangan** pin `<10`
- Alias `btenv10` memudahkan aktivasi

---

**Next:** [Unit 3 — Wallet Setup (Coldkey & Hotkey) →](./wallet-setup)

*Environment yang bersih = debugging yang mudah. 🧪*
