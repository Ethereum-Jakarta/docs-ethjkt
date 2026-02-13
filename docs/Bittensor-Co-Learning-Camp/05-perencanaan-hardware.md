---
sidebar_position: 5
title: 5. Perencanaan Hardware & Infrastruktur
sidebar_label: 5. Hardware & Infrastruktur
description: Panduan pemilihan hardware, perbandingan cloud vs on-premises, cloud providers, dan estimasi biaya untuk mining Bittensor
keywords: [bittensor, hardware, GPU, cloud mining, infrastructure, vast.ai, runpod]
---

# 🖥️ Perencanaan Hardware & Infrastruktur

## 3 Tier Hardware

Pemilihan hardware tergantung pada budget, subnet yang ditargetkan, dan tingkat kompetisi yang diinginkan.

### Tier 1: Beginner / Hobby

| Komponen | Spesifikasi | Estimasi Harga |
|----------|-------------|----------------|
| **GPU** | NVIDIA RTX 3060 (12GB VRAM) | Rp 4.000.000-6.000.000 |
| **CPU** | Intel i5 / Ryzen 5 | Rp 2.500.000-3.500.000 |
| **RAM** | 16GB DDR4 | Rp 500.000-800.000 |
| **Storage** | 512GB NVMe SSD | Rp 600.000-900.000 |
| **PSU** | 550W 80+ Bronze | Rp 600.000-800.000 |
| **Internet** | 50 Mbps upload minimum | Rp 500.000/bulan |
| **Total Awal** | — | **Rp 9.000.000-12.000.000** |

**Cocok untuk:** Subnet yang tidak memerlukan GPU berat (data scraping, simple inference), testing, dan belajar.

### Tier 2: Standard / Competitive

| Komponen | Spesifikasi | Estimasi Harga |
|----------|-------------|----------------|
| **GPU** | NVIDIA RTX 4090 (24GB VRAM) | Rp 28.000.000-35.000.000 |
| **CPU** | Intel i7 / Ryzen 7 | Rp 4.000.000-6.000.000 |
| **RAM** | 32GB DDR5 | Rp 1.500.000-2.500.000 |
| **Storage** | 1TB NVMe SSD | Rp 1.000.000-1.500.000 |
| **PSU** | 850W 80+ Gold | Rp 1.200.000-1.800.000 |
| **Internet** | 100 Mbps upload minimum | Rp 800.000-1.500.000/bulan |
| **Total Awal** | — | **Rp 36.000.000-47.000.000** |

**Cocok untuk:** Sebagian besar subnet inference (SN1, SN4, SN23), mining serius.

### Tier 3: Professional / Competitive

| Komponen | Spesifikasi | Estimasi Harga |
|----------|-------------|----------------|
| **GPU** | NVIDIA A100 80GB atau H100 | Rp 150.000.000-300.000.000+ |
| **CPU** | Xeon / EPYC (server-grade) | Rp 15.000.000-30.000.000 |
| **RAM** | 128GB+ ECC DDR5 | Rp 8.000.000-15.000.000 |
| **Storage** | 2TB+ NVMe SSD RAID | Rp 5.000.000-10.000.000 |
| **PSU** | 1600W+ Redundant | Rp 5.000.000-8.000.000 |
| **Internet** | Dedicated line 1Gbps | Rp 5.000.000-15.000.000/bulan |
| **Total Awal** | — | **Rp 190.000.000-380.000.000+** |

**Cocok untuk:** Subnet training (SN9), competitive mining di subnet utama, validator operations.

:::tip Mulai dari Tier 1
Jangan langsung beli hardware mahal. Mulai dari Tier 1 atau cloud untuk belajar dan validasi profitabilitas sebelum investasi besar.
:::

---

## ☁️ Cloud vs On-Premises

| Kriteria | Cloud | On-Premises |
|----------|-------|-------------|
| **Biaya Awal** | Rendah (bayar per jam) | Tinggi (beli hardware) |
| **Biaya Jangka Panjang** | Tinggi (akumulatif) | Rendah (setelah break-even) |
| **Fleksibilitas** | Tinggi (scale up/down) | Rendah (fixed hardware) |
| **Latency** | Rendah (datacenter tier) | Tergantung ISP |
| **Uptime** | 99.9%+ (SLA) | Tergantung PLN & ISP |
| **Maintenance** | Minimal | Tanggung jawab sendiri |
| **IP & Network** | Statis, clean | Dynamic, bisa CGNAT |
| **Break-Even** | N/A | Biasanya 4-8 bulan |
| **Cocok untuk** | Testing, scaling cepat, subnet baru | Mining jangka panjang, budget terbatas |

### Kapan Pilih Cloud?

- Baru mulai dan ingin testing tanpa investasi besar
- Perlu GPU level A100/H100 yang sangat mahal
- Ingin fleksibilitas untuk pindah subnet
- ISP lokal tidak reliable untuk mining

### Kapan Pilih On-Premises?

- Sudah validasi profitabilitas subnet
- Berencana mining jangka panjang (>6 bulan)
- Memiliki akses listrik stabil dan murah
- Budget cukup untuk investasi awal

---

## ☁️ Cloud Providers untuk Bittensor Mining

### Vast.ai

| Aspek | Detail |
|-------|--------|
| **Tipe** | Marketplace GPU (peer-to-peer) |
| **Harga** | Mulai $0.20/jam (RTX 3090) hingga $2+/jam (A100) |
| **Kelebihan** | Harga paling murah, banyak pilihan GPU |
| **Kekurangan** | Kualitas bervariasi, bisa unreliable |
| **Cocok untuk** | Testing, mining budget rendah |

```bash
# Contoh: Sewa GPU via Vast.ai CLI
pip install vastai
vastai search offers 'gpu_name=RTX_4090 num_gpus=1'
vastai create instance <offer_id> --image pytorch/pytorch:latest
```

### RunPod

| Aspek | Detail |
|-------|--------|
| **Tipe** | Cloud GPU (managed) |
| **Harga** | Mulai $0.44/jam (RTX 4090) hingga $3.89/jam (H100) |
| **Kelebihan** | Stabil, managed, Docker support |
| **Kekurangan** | Lebih mahal dari Vast.ai |
| **Cocok untuk** | Production mining, reliability penting |

### Lambda Cloud

| Aspek | Detail |
|-------|--------|
| **Tipe** | Cloud GPU (enterprise) |
| **Harga** | Mulai $1.10/jam (A10) hingga $2.49/jam (A100) |
| **Kelebihan** | Enterprise-grade, support baik |
| **Kekurangan** | Harga premium, availability terbatas |
| **Cocok untuk** | Enterprise/team mining |

### Perbandingan Harga GPU Cloud

| GPU | Vast.ai | RunPod | Lambda |
|-----|---------|--------|--------|
| **RTX 4090** | ~$0.35/jam | ~$0.44/jam | N/A |
| **A100 40GB** | ~$0.80/jam | ~$1.64/jam | ~$1.10/jam |
| **A100 80GB** | ~$1.20/jam | ~$2.19/jam | ~$2.49/jam |
| **H100** | ~$2.50/jam | ~$3.89/jam | N/A |

:::info Harga Fluktuatif
Harga cloud GPU berubah sesuai supply & demand. Cek website masing-masing provider untuk harga terbaru.
:::

---

## 📊 Model Profitabilitas Lengkap

### Template Kalkulasi

```
=== MONTHLY PROFITABILITY MODEL ===

Revenue:
  TAO earned/month:     _____ TAO
  TAO price (USD):      $_____
  Gross Revenue:        $_____ /bulan

Expenses (Cloud):
  GPU rental:           $_____ /bulan (jam × harga × 720)
  Storage:              $_____ /bulan
  VPS relay (optional): $_____ /bulan
  Total Expenses:       $_____ /bulan

Expenses (On-Premises):
  Listrik:              Rp _____ /bulan (Watt × 24 × 30 × tarif/kWh)
  Internet:             Rp _____ /bulan
  Maintenance:          Rp _____ /bulan (estimasi 2% hardware/bulan)
  Total Expenses:       Rp _____ /bulan

Net Profit:             Revenue - Expenses
ROI (On-Premises):      Net Profit / Total Investment × 100%
Break-Even:             Total Investment / Net Profit (bulan)
```

### Contoh Kalkulasi: Cloud Mining (RTX 4090 di RunPod)

| Item | Nilai |
|------|-------|
| GPU rental | $0.44/jam × 720 jam = $316.80/bulan |
| Estimasi reward | 0.3 TAO/bulan |
| Harga TAO (asumsi) | $300/TAO |
| Revenue | $90/bulan |
| **Profit/Loss** | **-$226.80/bulan (RUGI)** |

:::danger Perhatian
Contoh di atas menunjukkan bahwa **tidak semua mining profitable**. Profitabilitas sangat tergantung pada subnet, ranking, dan harga TAO. Selalu hitung dulu sebelum mulai!
:::

### Contoh Kalkulasi: On-Premises (RTX 4090, Subnet Ringan)

| Item | Nilai |
|------|-------|
| Investasi awal | Rp 40.000.000 |
| Listrik (350W × 24 × 30) | ~252 kWh × Rp 1.500 = Rp 378.000/bulan |
| Internet | Rp 800.000/bulan |
| Total biaya bulanan | Rp 1.178.000/bulan |
| Estimasi reward | 1.0 TAO/bulan (subnet ringan, top performer) |
| Harga TAO (asumsi) | $300 = Rp 4.800.000 |
| Revenue | Rp 4.800.000/bulan |
| Profit | Rp 3.622.000/bulan |
| **Break-even** | **~11 bulan** |

---

## 🇮🇩 Rekomendasi Spesifik Indonesia

### Tempat Beli Hardware

| Toko | Lokasi | Catatan |
|------|--------|---------|
| **Tokopedia/Shopee** | Online | Bandingkan harga, cek review |
| **Mangga Dua** | Jakarta | Bisa nego, cek garansi |
| **Hitech Mall** | Surabaya | Toko fisik, harga kompetitif |
| **Enterkomputer** | Online/Jakarta | Official distributor banyak brand |
| **Bhinneka** | Online | Produk enterprise tersedia |

### Estimasi Biaya Listrik

Tarif listrik PLN untuk rumah tangga:

| Golongan | Tarif per kWh | Cocok untuk |
|----------|---------------|-------------|
| **R-1/900VA** | Rp 1.352 | Tier 1 only (daya terbatas) |
| **R-1/1300VA** | Rp 1.444 | Tier 1 |
| **R-1/2200VA** | Rp 1.444 | Tier 1-2 |
| **R-2/3500-5500VA** | Rp 1.699 | Tier 2 |
| **R-3/6600VA+** | Rp 1.699 | Tier 2-3 |

:::warning Daya Listrik
Pastikan daya listrik rumah Anda cukup. Satu GPU RTX 4090 bisa menarik 350-450W. Dengan sistem lengkap (CPU, monitor, dll), total bisa mencapai 600-800W. Upgrade daya PLN jika perlu.
:::

### Estimasi Biaya Bulanan per Tier

| Komponen | Tier 1 | Tier 2 | Tier 3 |
|----------|--------|--------|--------|
| Listrik | Rp 200.000 | Rp 500.000 | Rp 2.000.000+ |
| Internet | Rp 500.000 | Rp 800.000 | Rp 5.000.000+ |
| VPS relay | Rp 80.000 | Rp 80.000 | - (dedicated line) |
| UPS replacement | Rp 50.000 | Rp 80.000 | Rp 150.000 |
| **Total/bulan** | **Rp 830.000** | **Rp 1.460.000** | **Rp 7.150.000+** |

---

## Rangkuman

| Topik | Poin Kunci |
|-------|------------|
| **Tier Hardware** | Beginner (Rp 9-12jt), Standard (Rp 36-47jt), Professional (Rp 190jt+) |
| **Cloud vs On-Premises** | Cloud untuk testing/flexibility, on-premises untuk jangka panjang |
| **Cloud Providers** | Vast.ai (murah), RunPod (stabil), Lambda (enterprise) |
| **Profitabilitas** | Hitung dulu! Tidak semua setup profitable |
| **Indonesia** | Perhatikan daya PLN, ISP, dan biaya listrik per golongan |

**Selanjutnya:** [Wallet & Keamanan →](./06-wallet-dan-keamanan.md)
