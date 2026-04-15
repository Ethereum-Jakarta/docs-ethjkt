---
sidebar_position: 5
title: 🚀 Miner Init & Metadata Registration
description: Jalankan miner process 24/7 dengan PM2/systemd, register metadata sports coverage ke subnet, dan monitor log validator query untuk pastikan miner hidup.
---

# 🚀 Miner Initialization and Metadata Registration

:::info Goal Unit Ini
Setelah unit ini kamu akan:
- Konfigurasi `.env` file dengan semua secret (API keys, wallet paths)
- **Register metadata** (sports & leagues yang kamu cover) ke subnet
- **Launch miner process** untuk pertama kali dan lihat log validator query masuk
- Setup **PM2** atau **systemd** supaya miner running 24/7 dan auto-restart
- Tahu cara **monitor health** & log rotation
:::

:::note Prasyarat
- ✅ [Unit 4 — Almanac Registration](./04-almanac-registration) selesai — binding sukses
- ✅ Sportstensor repo sudah cloned di `~/bittensor/sportstensor`
- ✅ `config.yaml` valid
- ✅ Port 8091 (atau sesuai config) accessible dari internet
- ✅ (Opsional tapi recommended) API key dari sports data provider — The Odds API free tier gratis, Sportradar trial berbayar
:::

---

## 🗂️ Step 1 — Setup File `.env`

Secret dan config runtime sebaiknya **tidak** di `config.yaml`. Pakai `.env` supaya tidak ter-commit.

```bash
cd ~/bittensor/sportstensor
cp .env.example .env   # kalau ada; kalau tidak buat manual
nano .env
```

Contoh isi:

```bash
# === Wallet (optional, override config.yaml) ===
BT_WALLET_NAME=sn41_miner
BT_WALLET_HOTKEY=miner_01
BT_WALLET_PATH=/home/ubuntu/.bittensor/wallets

# === Subnet ===
BT_NETUID=41
BT_NETWORK=finney             # finney = mainnet; 'test' = testnet

# === Endpoint (miner listens here) ===
MINER_HOST=0.0.0.0
MINER_PORT=8091
MINER_EXTERNAL_IP=203.0.113.42
MINER_EXTERNAL_PORT=8091

# === Sports Data APIs ===
ODDS_API_KEY=your_odds_api_key_here
SPORTRADAR_API_KEY=your_sportradar_key_here   # optional

# === Logging ===
LOG_LEVEL=debug
LOG_DIR=./logs
```

:::danger .env = rahasia
Pastikan `.env` ada di `.gitignore`. API key bocor = billing kamu jebol.

```bash
echo ".env" >> .gitignore
```
:::

### Checkpoint

```bash
set -a; source .env; set +a
echo "Netuid: $BT_NETUID — Hotkey: $BT_WALLET_HOTKEY"
```

---

## 🏷️ Step 2 — Register Metadata (Sports Coverage)

Subnet butuh tahu sport apa yang kamu predict supaya validator route query yang relevan saja.

### Jalankan metadata registration

Command exact bervariasi per repo — umum:

```bash
python scripts/register_metadata.py \
  --wallet.name sn41_miner \
  --wallet.hotkey miner_01 \
  --sports "mlb,nba,nfl,soccer" \
  --netuid 41
```

Atau via CLI package:

```bash
sportstensor-miner metadata \
  --sports mlb,nba,nfl,soccer
```

### Apa yang terjadi

1. Script build payload: `{hotkey, sports: [...], model_version: "x.y.z"}`
2. Sign dengan hotkey
3. Submit ke metadata endpoint (bisa on-chain commitment atau almanac)
4. Dapat konfirmasi

### Output sukses

```text
[metadata] Registering sports: ['mlb', 'nba', 'nfl', 'soccer']
[metadata] Model version: sportstensor-miner 2.1.0
[metadata] ✅ Metadata commit successful
  tx_hash / commit_ref: 0x9f3e...abcd
```

:::tip Start narrow, ekspansi nanti
Kalau baru belajar, **pick satu sport** dulu (misal `mlb` saja). Fokus optimasi satu domain > jadi jack-of-all-trades-prediksi-jelek. Tambah sport setelah CLV positif.
:::

---

## 🏁 Step 3 — Launch Miner Process (Foreground Dulu)

**Jalankan di foreground dulu untuk verify semua berjalan**:

```bash
cd ~/bittensor/sportstensor
source ~/bittensor/venv/bin/activate

python neurons/miner.py \
  --netuid 41 \
  --wallet.name sn41_miner \
  --wallet.hotkey miner_01 \
  --axon.port 8091 \
  --axon.external_ip 203.0.113.42 \
  --logging.debug
```

### Log yang sehat (contoh awal)

```text
2026-04-14 10:30:12 | INFO     | Loading wallet sn41_miner/miner_01
2026-04-14 10:30:13 | INFO     | Connected to subtensor finney (netuid 41)
2026-04-14 10:30:14 | INFO     | Metagraph synced. UID=142. N_miners=256
2026-04-14 10:30:14 | INFO     | Axon listening on 0.0.0.0:8091 (external: 203.0.113.42:8091)
2026-04-14 10:30:15 | INFO     | Miner ready. Waiting for validator queries...
```

### Query pertama masuk (bisa beberapa menit sampai jam)

```text
2026-04-14 10:47:02 | DEBUG    | [validator 5Gh...abc UID=7] Query received
  event_id=mlb_2026_04_14_NYY_BOS sport=mlb kickoff=2026-04-14T19:05:00Z
2026-04-14 10:47:03 | DEBUG    | Prediction generated: home_win=0.58 confidence=0.72
2026-04-14 10:47:03 | INFO     | Response sent to validator 5Gh...abc in 247ms
```

:::tip Tidak ada query dalam 1 jam?
Normal di awal — validator kadang query dalam batch. Tunggu **hingga 4 jam**. Kalau tetap sepi:
- Verify almanac binding aktif
- Cek `metagraph` — pastikan UID kamu masih terdaftar
- Cek port reachable dari internet
:::

### Stop (Ctrl+C) setelah yakin log sehat.

---

## 🔄 Step 4 — Jalankan 24/7 dengan PM2

PM2 = process manager Node.js yang juga jalan untuk Python. Auto-restart kalau crash, log rotation built-in.

### Install PM2

```bash
# butuh Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2
```

### Start miner via PM2

```bash
cd ~/bittensor/sportstensor
pm2 start neurons/miner.py \
  --name sn41-miner \
  --interpreter ~/bittensor/venv/bin/python \
  -- \
  --netuid 41 \
  --wallet.name sn41_miner \
  --wallet.hotkey miner_01 \
  --axon.port 8091 \
  --axon.external_ip 203.0.113.42 \
  --logging.debug
```

:::tip Perhatikan `--` double dash
Flag sebelum `--` untuk PM2. Flag sesudah `--` diteruskan ke script Python.
:::

### Kontrol PM2

```bash
pm2 status              # list semua process
pm2 logs sn41-miner     # tail log realtime
pm2 logs sn41-miner --lines 100  # last 100 lines
pm2 restart sn41-miner  # restart
pm2 stop sn41-miner     # stop (tidak delete)
pm2 delete sn41-miner   # hapus dari PM2
```

### Persist across reboot

```bash
pm2 save
pm2 startup
# ikuti instruksi output (copy-paste command `sudo env PATH=... pm2 ...`)
```

Setelah ini, miner auto-start tiap server reboot.

### Checkpoint

```bash
pm2 status
```

Expected:

```text
┌─────┬──────────────┬─────────┬─────────┬──────────┬────────┬──────┐
│ id  │ name         │ mode    │ status  │ cpu      │ memory │ ↺    │
├─────┼──────────────┼─────────┼─────────┼──────────┼────────┼──────┤
│ 0   │ sn41-miner   │ fork    │ online  │ 1.2%     │ 215mb  │ 0    │
└─────┴──────────────┴─────────┴─────────┴──────────┴────────┴──────┘
```

`status: online` + restart count `0` = sehat.

---

## 🛠️ Step 4b (Alternatif) — systemd

Kalau prefer native systemd:

```bash
sudo nano /etc/systemd/system/sn41-miner.service
```

Isi:

```ini
[Unit]
Description=Sportstensor SN41 Miner
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/bittensor/sportstensor
Environment="PATH=/home/ubuntu/bittensor/venv/bin:/usr/bin:/bin"
EnvironmentFile=/home/ubuntu/bittensor/sportstensor/.env
ExecStart=/home/ubuntu/bittensor/venv/bin/python neurons/miner.py \
  --netuid 41 \
  --wallet.name sn41_miner \
  --wallet.hotkey miner_01 \
  --axon.port 8091 \
  --axon.external_ip 203.0.113.42 \
  --logging.debug
Restart=always
RestartSec=10
StandardOutput=append:/var/log/sn41-miner.log
StandardError=append:/var/log/sn41-miner.err.log

[Install]
WantedBy=multi-user.target
```

Aktifkan:

```bash
sudo systemctl daemon-reload
sudo systemctl enable sn41-miner
sudo systemctl start sn41-miner
sudo systemctl status sn41-miner
sudo journalctl -u sn41-miner -f   # tail log
```

---

## 👀 Step 5 — Monitoring & Health Checks

### A. Tail log realtime

```bash
pm2 logs sn41-miner --lines 50
# atau
tail -f ~/bittensor/sportstensor/logs/miner.log
```

### B. Simple watcher script

Buat `scripts/watch.sh`:

```bash
#!/bin/bash
while true; do
  echo "=== $(date) ==="
  echo "Process:"
  pm2 jlist | python3 -c "import sys,json; d=json.load(sys.stdin); m=[x for x in d if x['name']=='sn41-miner']; print('status:', m[0]['pm2_env']['status'] if m else 'NOT FOUND')"
  echo "Metagraph (emission & trust):"
  btcli subnet metagraph --netuid 41 2>/dev/null | grep "<hotkey_prefix>"
  echo
  sleep 300
done
```

### C. Query counter

Grep log untuk hitung query per jam:

```bash
grep "Query received" logs/miner.log | wc -l
```

### D. Dashboard (opsional advanced)

- **Grafana + Prometheus** — kalau miner expose `/metrics` endpoint
- **Sportstensor public leaderboard** — cek rank miner kamu (URL lihat dokumentasi resmi)

---

## 🧪 Checkpoint Validation Komprehensif

Setelah 2–6 jam running, verifikasi:

| Check | Command | Expected |
|---|---|---|
| Process alive | `pm2 status` | `online` + restart `0` |
| Ada query masuk | `grep "Query received" logs/miner.log \| tail` | Minimal 1 entry |
| Response berhasil | `grep "Response sent" logs/miner.log \| wc -l` | > 0 |
| Tidak ada error cascade | `grep -i "error\|exception" logs/miner.log` | Rare / none |
| Trust/Rank mulai non-zero (setelah 24–48 jam) | `btcli subnet metagraph --netuid 41` | Trust > 0 |

:::tip Screenshot untuk graduation
Simpan:
1. Output `pm2 status`
2. 20–30 line log yang menunjukkan `Query received` + `Response sent`
3. `btcli subnet metagraph --netuid 41` dengan UID kamu terlihat
:::

---

## 🗃️ Log Rotation & Disk Hygiene

Log debug bisa tumbuh cepat. PM2 built-in rotation:

```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 50M
pm2 set pm2-logrotate:retain 14
pm2 set pm2-logrotate:compress true
```

Atau manual via `logrotate`:

```bash
sudo nano /etc/logrotate.d/sn41-miner
```

```text
/home/ubuntu/bittensor/sportstensor/logs/*.log {
    daily
    rotate 14
    compress
    missingok
    notifempty
    copytruncate
}
```

---

## 🐛 Error Umum & Solusi

| Error log | Arti | Fix |
|---|---|---|
| `Axon port already in use` | Port 8091 dipakai proses lain | `lsof -i :8091` → kill atau ganti port |
| `Wallet not found` | Path wallet salah | Cek `BT_WALLET_PATH`; default `~/.bittensor/wallets` |
| `UID not in metagraph` | Belum ter-register / deregistered | Balik ke Unit 3 |
| `Connection refused to subtensor` | Endpoint chain down | Coba fallback: `--subtensor.chain_endpoint wss://entrypoint-finney.opentensor.ai:443` |
| `Timeout waiting for query` | Normal kalau masih baru | Tunggu sampai 4 jam; verify almanac |
| `OOM killed` | RAM kurang | Upgrade VPS atau tune model batch size |
| Validator ping 404 di `/health` | Endpoint belum implement health check | Bukan blocker; tapi implement helps debugging |

---

## 🎯 Rangkuman

- ✅ Setup `.env` dengan secret (API keys, paths)
- ✅ Register metadata sports coverage ke subnet
- ✅ Launch miner di foreground, verify log sehat
- ✅ Migrasi ke PM2/systemd untuk 24/7 operation
- ✅ Monitor log + setup log rotation
- ✅ Paham health check & common error remediation

### ✅ Quick Check

1. Kenapa `.env` terpisah dari `config.yaml`?
2. Apa gunanya metadata registration selain almanac binding?
3. PM2 vs systemd — kapan pilih mana?
4. Kenapa log rotation penting untuk miner production?
5. Setelah 6 jam run, angka apa di metagraph yang menandakan miner kamu sudah mulai di-score?

### 🐛 Troubleshooting

| Gejala | Solusi |
|---|---|
| PM2 tidak restart setelah reboot | Jalankan ulang `pm2 save && pm2 startup` |
| Log tidak ke-rotate | Install `pm2-logrotate` plugin |
| Disk penuh mendadak | Check `du -sh logs/` — biasanya log debug yang biang kerok |
| Query masuk tapi response timeout | Handler kamu terlalu lama — tune di Unit 6 |
| Validator beda-beda kirim versi query berbeda | Update repo ke versi terbaru (`git pull`) |

:::danger Monitor, jangan pasrah
Miner yang di-"set and forget" sering underperform karena validator update protokol dan kamu ketinggalan. Minimal **cek log 1× per hari** minggu pertama.
:::

---

**Next:** [Unit 6 — Programmatic Trade Execution →](./06-programmatic-trade-execution)
