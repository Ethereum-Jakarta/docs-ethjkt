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
- Punya **virtual environment** `~/bittensor-env` yang terisolasi
- **`btcli`** dan **Bittensor SDK** (`bittensor<10.0.0`) terinstall di venv
- Bisa menjalankan `btcli --help` tanpa error
:::

:::note Prasyarat
- ✅ [Unit 1](./intro-dan-hardware-check) selesai — WSL2 aktif (Windows) atau terminal siap
- ✅ Koneksi internet untuk download packages
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
python3 -m venv ~/bittensor-env

# Aktifkan venv
source ~/bittensor-env/bin/activate

# Prompt kamu akan berubah jadi:
# (bittensor-env) ubuntu@hostname:~$
```

Tambah alias supaya tidak perlu ketik panjang tiap kali:

```bash
echo 'alias btenv="source ~/bittensor-env/bin/activate"' >> ~/.bashrc
source ~/.bashrc
```

Sekarang cukup ketik `btenv` untuk aktifkan venv.

</TabItem>
<TabItem value="macos" label="🍎 macOS">

```bash
# Buat venv
python3.10 -m venv ~/bittensor-env

# Aktifkan venv
source ~/bittensor-env/bin/activate

# Prompt kamu berubah jadi:
# (bittensor-env) username@hostname ~ %
```

Tambah alias:

```bash
echo 'alias btenv="source ~/bittensor-env/bin/activate"' >> ~/.zprofile
source ~/.zprofile
```

</TabItem>
<TabItem value="linux" label="🐧 Linux">

```bash
# Buat venv
python3 -m venv ~/bittensor-env

# Aktifkan
source ~/bittensor-env/bin/activate

# Alias untuk kemudahan
echo 'alias btenv="source ~/bittensor-env/bin/activate"' >> ~/.bashrc
source ~/.bashrc
```

</TabItem>
</Tabs>

:::warning Jangan Lupa Aktifkan venv
Setiap kali buka terminal baru, kamu harus aktifkan venv lagi: `source ~/bittensor-env/bin/activate` (atau `btenv` kalau sudah setup alias). Kalau lupa, `btcli` tidak akan ditemukan.
:::

---

## 🔧 Step 3 — Install btcli & Bittensor SDK

Pastikan venv **aktif** (ada `(bittensor-env)` di prompt) sebelum lanjut.

```bash
# Upgrade pip dulu
pip install --upgrade pip

# Install Bittensor CLI (command line tool)
pip install bittensor-cli

# Install Bittensor SDK — PENTING: pin ke versi < 10.0.0
# Banyak subnet template belum kompatibel dengan SDK v10+
pip install "bittensor<10.0.0"
```

:::danger Kenapa `bittensor<10.0.0`?
SDK Bittensor versi 10.0.0 memperkenalkan breaking changes pada API internal. Sebagian besar subnet template publik (termasuk `opentensor/bittensor-subnet-template`) masih menggunakan struktur SDK lama. Kalau kamu install versi terbaru, bisa muncul error `ImportError` atau `AttributeError` saat jalankan miner.

Kalau nanti subnet spesifik yang kamu pakai sudah support SDK v10+, kamu bisa upgrade.
:::

---

## ✅ Step 4 — Verifikasi Instalasi

```bash
# Verifikasi btcli
btcli --help
# Harus muncul help text dengan daftar commands

# Verifikasi btcli version
btcli --version
# Output: btcli/x.x.x ...

# Verifikasi SDK
python -c "import bittensor; print('bittensor version:', bittensor.__version__)"
# Output: bittensor version: 7.x.x atau 8.x.x (harus < 10)
```

Output `btcli --help` yang normal:

```text
usage: btcli <command> <command args>

bittensor cli v8.x.x

positional arguments:
  {wallet,subnets,stake,root,info,...}
    wallet              Commands for managing and viewing wallets.
    subnets             Commands for interacting with subnets.
    ...
```

:::tip Kalau `btcli: command not found`
venv belum aktif. Jalankan:
```bash
source ~/bittensor-env/bin/activate
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
| `btcli: command not found` | venv tidak aktif | `source ~/bittensor-env/bin/activate` |
| `ModuleNotFoundError: 'bittensor'` | SDK belum install atau venv salah | Pastikan venv aktif, lalu `pip install "bittensor<10.0.0"` |
| `ERROR: Could not find a version that satisfies the requirement bittensor` | Network issue / pypi timeout | `pip install "bittensor<10.0.0" --retries 5` |
| `ImportError: cannot import name 'X' from 'bittensor'` | SDK v10+ incompatible | `pip uninstall bittensor && pip install "bittensor<10.0.0"` |

---

## 📋 Quick Reference — Perintah Harian

```bash
# Aktifkan venv (wajib tiap session baru)
source ~/bittensor-env/bin/activate   # atau: btenv

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
- **venv** terisolasi di `~/bittensor-env` — aktifkan setiap sesi baru
- Install **`bittensor-cli`** (btcli) dan **`bittensor<10.0.0`** (SDK) terpisah
- Alias `btenv` memudahkan aktivasi

---

**Next:** [Unit 3 — Wallet Setup (Coldkey & Hotkey) →](./wallet-setup)

*Environment yang bersih = debugging yang mudah. 🧪*
