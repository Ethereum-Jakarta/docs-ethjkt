---
sidebar_position: 6
title: 🌐 Unit 6 — Koneksi, Port & Ngrok untuk CGNAT
description: Setup firewall port 8091 per OS, deteksi apakah ISP kamu pakai CGNAT, dan gunakan Ngrok atau Cloudflare Tunnel supaya validator bisa reach miner kamu dari internet.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 🌐 Unit 6 — Koneksi, Port & Ngrok untuk CGNAT

:::info Goal Unit Ini
Di akhir unit ini kamu akan:
- Paham mengapa **port 8091 terbuka** itu penting untuk miner
- Bisa **cek apakah ISP kamu CGNAT** atau punya public IP
- Setup **firewall per OS** (Windows, macOS, Linux)
- Menggunakan **Ngrok TCP tunnel** sebagai solusi CGNAT — miner lokal tetap bisa di-reach validator
:::

:::note Prasyarat
- ✅ [Unit 5](./jalankan-miner-lokal) selesai — miner sudah bisa start
- ✅ Tau UID miner kamu di testnet
:::

---

## 🔌 Kenapa Port Harus Terbuka?

Ketika miner berjalan, ia membuka **axon endpoint** — sebuah server HTTP di port 8091 (default). Validator perlu bisa **reach endpoint ini dari internet** untuk:
1. Mengirim query ke miner kamu
2. Memeriksa apakah miner masih aktif (health check)
3. Men-score response miner dan set weights

Kalau port 8091 tidak accessible dari internet → validator tidak bisa reach → `Active: False` di metagraph → **skor 0, tidak dapat reward**.

---

## 🔍 Step 1 — Cek Tipe Koneksi Internet Kamu

### Deteksi Public IP

```bash
# Cek IP publik yang terlihat dari internet
curl -s ifconfig.me
```

### Deteksi CGNAT

```bash
# Cek IP lokal kamu
ip addr show    # Linux/WSL2
ifconfig        # macOS
```

**Bandingkan dua output di atas:**

| Kondisi | Artinya |
|---------|---------|
| `curl ifconfig.me` = IP publik, `ip addr` = `192.168.x.x` | Home NAT biasa — bisa forward port di router |
| `curl ifconfig.me` = IP publik, tapi `ip addr` = `10.x.x.x` atau `100.64.x.x–100.127.x.x` | **CGNAT** — tidak bisa port forward! |
| `curl ifconfig.me` gagal / timeout | Koneksi bermasalah |

:::warning ISP Indonesia & CGNAT
ISP residensial Indonesia populer dan status CGNAT-nya:

| ISP | Tipe IP | CGNAT? | Solusi |
|-----|---------|--------|--------|
| Indihome (residensial) | Dynamic private | ✅ CGNAT | Ngrok / Cloudflare Tunnel |
| MyRepublic | Dynamic private | ✅ CGNAT | Ngrok / Cloudflare Tunnel |
| First Media | Dynamic private | ✅ CGNAT | Ngrok / Cloudflare Tunnel |
| Indihome Bisnis | Static public | ❌ Tidak | Port forward di router |
| Biznet | Static public | ❌ Tidak | Port forward di router |
| Iconnet Bisnis | Static public | ❌ Tidak | Port forward di router |

Kalau ISP kamu pakai CGNAT → **langsung ke Step 3 (Ngrok)**.
:::

---

## 🔥 Step 2 — Buka Port 8091 di Firewall

Kalau kamu **tidak CGNAT** (punya public IP statis atau bisa port forward di router), setup firewall dulu.

<Tabs>
<TabItem value="linux-wsl" label="🐧 Linux / WSL2" default>

```bash
# Buka port 8091 dengan UFW
sudo ufw allow 8091/tcp
sudo ufw status

# Output:
# Status: active
# 8091/tcp          ALLOW Anywhere
```

:::note WSL2 dan Windows Firewall
WSL2 juga harus dikonfigurasi di **Windows Firewall**. Buka PowerShell sebagai Admin:

```powershell
New-NetFirewallRule -DisplayName "Bittensor Miner 8091" -Direction Inbound -LocalPort 8091 -Protocol TCP -Action Allow
```

Dan port forward dari Windows ke WSL2:
```powershell
# Ganti <WSL2_IP> dengan IP WSL2 kamu (cek dengan: wsl hostname -I)
netsh interface portproxy add v4tov4 listenaddress=0.0.0.0 listenport=8091 connectaddress=<WSL2_IP> connectport=8091
```
:::

</TabItem>
<TabItem value="macos" label="🍎 macOS">

macOS menggunakan Application Firewall (bukan port-based). Python biasanya otomatis minta izin saat pertama kali buka port.

Kalau muncul dialog "Do you want the application 'Python' to accept incoming network connections?" → klik **Allow**.

Kalau tidak muncul, aktifkan via System Settings:

1. System Settings → Network → Firewall
2. Klik Firewall Options
3. Tambah Python (`/usr/local/bin/python3.10` atau sesuai path) → Allow Incoming Connections

Verifikasi port terbuka:

```bash
lsof -i :8091
# Output harus menampilkan python3 listening di port 8091
```

</TabItem>
<TabItem value="linux" label="🐧 Linux (Non-WSL)">

```bash
# UFW (Ubuntu/Debian)
sudo ufw allow 8091/tcp
sudo ufw enable
sudo ufw status

# firewalld (Fedora/RHEL)
sudo firewall-cmd --permanent --add-port=8091/tcp
sudo firewall-cmd --reload
```

Kalau pakai iptables langsung:

```bash
sudo iptables -A INPUT -p tcp --dport 8091 -j ACCEPT
```

</TabItem>
</Tabs>

### Test Koneksi dari Luar

Setelah miner running dan port terbuka, test dengan tool online:

1. Buka **portchecker.co** atau **canyouseeme.org**
2. Masukkan IP publik kamu + port 8091
3. Klik "Check"

Kalau hasilnya "Open" → validator bisa reach kamu tanpa tunnel.

---

## 🚇 Step 3 — Ngrok TCP Tunnel (Solusi CGNAT)

Ngrok membuat tunnel dari internet ke localhost kamu — validator tidak perlu tahu IP asli kamu, cukup tahu alamat ngrok tunnel.

### Install Ngrok

<Tabs>
<TabItem value="linux-wsl-ngrok" label="🐧 Linux / WSL2" default>

```bash
# Tambah repo ngrok
curl -s https://ngrok-agent.s3.amazonaws.com/ngrok.asc \
  | sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null

echo "deb https://ngrok-agent.s3.amazonaws.com buster main" \
  | sudo tee /etc/apt/sources.list.d/ngrok.list

sudo apt update && sudo apt install ngrok
```

</TabItem>
<TabItem value="macos-ngrok" label="🍎 macOS">

```bash
brew install ngrok/ngrok/ngrok
```

</TabItem>
</Tabs>

### Buat Akun & Auth Token Ngrok

1. Buka **ngrok.com** → Sign Up (gratis)
2. Setelah login, pergi ke **Dashboard → Your Authtoken**
3. Salin authtoken kamu

Setup authtoken di terminal:

```bash
ngrok config add-authtoken <TOKEN_KAMU>
```

### Buka Tunnel ke Port 8091

```bash
ngrok tcp 8091
```

Output ngrok:

```text
ngrok

Session Status: online
Account: kamu@email.com (Plan: Free)
Version: 3.x.x
Region: Asia Pacific (ap)
Latency: 45ms

Forwarding tcp://0.tcp.ap.ngrok.io:XXXXX -> localhost:8091
```

Catat alamat forwarding, contoh: `0.tcp.ap.ngrok.io:12345`

### Jalankan Miner dengan External IP Ngrok

Restart miner dengan parameter ngrok sebagai external IP:

```bash
python neurons/miner.py \
  --netuid 1 \
  --wallet.name mywallet \
  --wallet.hotkey miner1 \
  --subtensor.network test \
  --axon.port 8091 \
  --axon.external_ip 0.tcp.ap.ngrok.io \
  --axon.external_port 12345 \
  --logging.debug
```

Ganti `0.tcp.ap.ngrok.io` dan `12345` dengan nilai dari output ngrok kamu.

:::warning Ngrok Free Plan — Batasan
- Free plan: **1 TCP tunnel sekaligus**, alamat ngrok berubah tiap kali restart
- Tiap restart ngrok → alamat berubah → harus update flag `--axon.external_ip` dan `--axon.external_port`
- Untuk production mining yang stabil, upgrade ke Ngrok Pro (alamat statis) atau pakai VPS

Di testnet GP-0, free plan sudah cukup untuk belajar flow-nya.
:::

---

## ☁️ Alternatif: Cloudflare Tunnel

Cloudflare Tunnel lebih stabil untuk production (alamat tidak berubah), tapi setup lebih kompleks.

```bash
# Install cloudflared
curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb -o cloudflared.deb
sudo dpkg -i cloudflared.deb

# Login (buka browser)
cloudflared tunnel login

# Buat tunnel
cloudflared tunnel create bittensor-miner

# Buat config
mkdir -p ~/.cloudflared
cat > ~/.cloudflared/config.yml << EOF
tunnel: bittensor-miner
credentials-file: ~/.cloudflared/<TUNNEL_ID>.json

ingress:
  - hostname: miner.yourdomain.com
    service: tcp://localhost:8091
  - service: http_status:404
EOF

# Jalankan tunnel
cloudflared tunnel run bittensor-miner
```

:::note Cloudflare Tunnel Butuh Domain
Cloudflare Tunnel memerlukan domain yang terdaftar di Cloudflare. Kalau tidak punya domain, Ngrok lebih praktis untuk learning.
:::

---

## 📊 Perbandingan Solusi Koneksi

| Solusi | Cocok Untuk | Setup | Stabilitas | Biaya |
|--------|-------------|-------|-----------|-------|
| **Port forward router** | Public IP tanpa CGNAT | Mudah | Tinggi | Gratis |
| **Ngrok Free** | CGNAT, learning/testnet | Mudah | Sedang (alamat berubah) | Gratis |
| **Ngrok Pro** | CGNAT, semi-production | Mudah | Tinggi | ~$10/bulan |
| **Cloudflare Tunnel** | CGNAT, production | Sedang | Sangat tinggi | Gratis (butuh domain) |
| **VPS Singapore** | Production serious | Sedang | Sangat tinggi | ~$40/bulan |

---

## 🐛 Troubleshooting Koneksi

| Gejala | Kemungkinan Penyebab | Solusi |
|--------|----------------------|--------|
| `Active: False` di metagraph | Port tidak accessible | Cek firewall, gunakan Ngrok |
| Ngrok "ERR_NGROK_108" | Limit tunnel gratis tercapai | Logout semua session: `ngrok authtoken <token>` ulang |
| Ngrok tunnel connect tapi miner tidak respond | Port miner berbeda dari tunnel | Pastikan miner pakai port 8091, ngrok juga `ngrok tcp 8091` |
| `axon.external_ip` terlalu cepat obsolete | Ngrok restart ganti alamat | Restart miner dengan alamat ngrok baru |
| macOS firewall block Python | Dialog tidak muncul | System Settings → Network → Firewall → Firewall Options → Add Python |
| WSL2 port tidak accessible dari Windows | Port proxy belum di-setup | Jalankan `netsh interface portproxy` di PowerShell Admin |

---

## 🎯 Rangkuman

- **Port 8091** harus accessible dari internet agar validator bisa query miner
- **CGNAT** = ISP residensial berbagi satu IP → tidak bisa port forward → butuh tunnel
- ISP Indonesia residensial (Indihome, MyRepublic, First Media) hampir pasti CGNAT
- **Ngrok TCP** = solusi tercepat untuk CGNAT (free plan cukup untuk testnet)
- **Flag miner**: tambah `--axon.external_ip` dan `--axon.external_port` dengan nilai dari ngrok

### ✅ Quick Check

1. Bagaimana cara deteksi apakah ISP kamu pakai CGNAT?
2. Apa yang terjadi pada scoring miner kalau port tidak accessible?
3. Kenapa alamat ngrok free plan bisa berubah?
4. Kapan VPS lebih baik dari ngrok untuk mining?

<details>
<summary>💡 Jawaban</summary>

1. Bandingkan `curl ifconfig.me` (IP dari internet) dengan `ip addr` (IP lokal). Kalau lokal `10.x.x.x` atau `100.64-127.x.x` = CGNAT.
2. `Active: False` di metagraph → validator tidak bisa query → **skor 0** → tidak dapat reward TAO.
3. Ngrok free plan tidak memberikan alamat statis — setiap kali ngrok restart, server assign alamat baru secara random. Ngrok Pro/Teams punya reserved domains/IPs.
4. VPS lebih baik kalau: (1) butuh uptime 24/7 tanpa restart; (2) internet rumah tidak stabil; (3) mining production mainnet serius. Ngrok OK untuk testnet + learning.

</details>

---

**Next:** [Unit 7 — Debugging & Troubleshooting Lokal →](./debugging-lokal)

*Koneksi terbuka = miner bisa di-score. 🔓*
