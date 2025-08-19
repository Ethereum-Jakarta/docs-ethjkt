---
id: 0g-da
title: 0G DA
sidebar_position: 6
---

# 0G DA: Data Availability yang Infinitely Scalable dan Programmable

## Munculnya Data Availability Layers

Data availability (DA) merujuk pada pembuktian bahwa data mudah diakses, dapat diverifikasi, dan dapat diambil. Contohnya, Layer 2 rollups seperti Arbitrum atau Base mengurangi beban di Ethereum dengan menangani transaksi off-chain dan kemudian mempublikasikan data kembali ke Ethereum, sehingga membebaskan throughput L1 dan mengurangi biaya gas. Data transaksi, bagaimanapun, masih perlu disediakan agar siapa pun dapat memvalidasi atau menantang transaksi melalui fraud proofs selama periode challenge.

Dengan demikian, DA sangat penting untuk blockchain karena memungkinkan validasi penuh riwayat blockchain dan state saat ini oleh setiap peserta, sehingga mempertahankan sifat terdesentralisasi dan trustless dari jaringan. Tanpa ini, validator tidak akan dapat secara independen memverifikasi legitimasi transaksi dan blok, yang mengarah pada potensi masalah seperti fraud atau censorship.

Hal ini menyebabkan munculnya Data Availability Layers (DALs), yang menyediakan cara yang jauh lebih efisien untuk menyimpan dan memverifikasi data daripada publishing langsung ke Ethereum. DAL sangat penting karena beberapa alasan:

- **Scalability**: DAL memungkinkan jaringan memproses lebih banyak transaksi dan dataset yang lebih besar tanpa membebani sistem, mengurangi beban pada node jaringan dan secara signifikan meningkatkan skalabilitas jaringan.
- **Efisiensi Meningkat**: DAL mengoptimalkan bagaimana dan di mana data disimpan dan disediakan, meningkatkan throughput data dan mengurangi latensi sambil juga meminimalkan biaya terkait.
- **Interoperabilitas & Inovasi**: DAL yang dapat berinteraksi dengan beberapa ekosistem memungkinkan interoperabilitas yang cepat dan sangat aman untuk data dan aset.

Namun, perlu dicatat bahwa tidak semua DAL dibangun sama.

## Tantangan Hari Ini

DAL yang ada cenderung mengharuskan data dikirim secara bersamaan ke semua node jaringan mereka, mencegah horizontal scalability dan membatasi kecepatan jaringan ke node yang paling lambat. Mereka juga tidak memiliki sistem storage built-in, memerlukan konektivitas ke sistem eksternal yang mempengaruhi throughput, latensi, dan biaya.

Selain itu, 0G mewarisi keamanan Ethereum, sementara sistem lain bergantung pada mekanisme keamanan mereka sendiri yang kurang memadai. Ini signifikan karena jaringan Ethereum diamankan oleh lebih dari 34 juta ETH yang di-stake, mewakili sekitar $80 miliar dalam cryptoeconomic security pada saat penulisan. Sebaliknya, kompetitor bergantung pada mekanisme keamanan yang, paling banter, hanya mewakili sebagian kecil dari total keamanan Ethereum. Ini memberikan 0G keunggulan yang berbeda, karena memanfaatkan insentif ekonomi yang besar dan desentralisasi sistem staking Ethereum, memberikan tingkat perlindungan yang tidak dapat ditandingi kompetitor.

Masalah lain juga ada, termasuk kurangnya randomization EigenDA atas komite datanya. Karena komite data adalah inti dari integritas sistem DA, kurangnya randomization berarti bahwa kolusi secara teoretis mungkin bagi node jahat untuk memprediksi kapan mereka mungkin berada dalam komite bersama.

**Diferensiasi inti 0G adalah throughput massive dan scalability.**

Ini dimungkinkan melalui desain unik 0G yang mencakup sistem storage built-in dan desain consensus yang horizontally scalable, bersama dengan mekanisme desain cerdas lainnya yang akan kita bahas di bawah.

Hasilnya adalah 0G berfungsi sebagai foundational layer untuk aplikasi AI terdesentralisasi, menghidupkan on-chain AI dan lainnya.

## Mengapa 0G

Ada 4 diferensiator 0G yang patut disorot:

### 1. DA yang Infinitely Scalable
DAL 0G yang infinitely scalable dapat dengan cepat melakukan query atau mengonfirmasi data sebagai valid, apakah data disimpan oleh 0G Storage, atau database Web2 atau Web3 eksternal. Infinite scalability berasal dari kemampuan untuk terus menambahkan jaringan consensus baru, mendukung workload yang jauh melampaui kapasitas sistem yang ada.

### 2. Arsitektur Modular dan Berlayer
Desain 0G memisahkan storage, data availability, dan consensus, memungkinkan setiap komponen dioptimalkan untuk fungsi spesifiknya. Data availability dipastikan melalui redundancy, dengan data didistribusikan di seluruh Storage Nodes yang terdesentralisasi. Cryptographic proofs (seperti Merkle trees dan zk-proofs) memverifikasi integritas data pada interval reguler, secara otomatis mengganti node yang gagal menghasilkan valid proofs. Dan dikombinasikan dengan kemampuan 0G untuk terus menambahkan jaringan consensus baru yang scale dengan demand, 0G dapat scale secara efisien dan ideal untuk workflow AI yang kompleks dan pemrosesan data skala besar.

### 3. Decentralized AI Operating System & High Throughput
0G adalah sistem operasi AI terdesentralisasi pertama (deAIOS) yang dirancang untuk memberikan kontrol kepada pengguna atas data mereka, sambil menyediakan infrastruktur yang diperlukan untuk menangani permintaan throughput massive aplikasi AI. Di luar arsitektur modular dan infinite consensus layers, 0G mencapai throughput tinggi melalui parallel data processing, dimungkinkan oleh erasure coding, horizontally scalable consensus networks, dan lainnya. Dengan throughput yang terbukti 50 Gbps pada Galileo Testnet, 0G dengan mulus mendukung workload AI dan kebutuhan high-performance lainnya, termasuk training large language models dan mengelola jaringan AI agent.

Diferensiator ini membuat 0G secara unik diposisikan untuk mengatasi tantangan scaling AI pada platform terdesentralisasi, yang sangat penting untuk masa depan Web3 dan decentralized intelligence.

## Bagaimana Ini Bekerja?

Seperti yang dibahas dalam [0G Storage](./5-0g-storage.md), data dalam ekosistem 0G pertama-tama di-erasure-code dan dibagi menjadi "data chunks", yang kemudian didistribusikan di berbagai Storage Nodes dalam jaringan 0G Storage.

Untuk memastikan data availability, 0G menggunakan **Data Availability Nodes** yang dipilih secara acak menggunakan Verifiable Random Function (VRF). VRF menghasilkan nilai acak dengan cara yang tidak dapat diprediksi namun dapat diverifikasi oleh orang lain, yang penting karena mencegah node yang berpotensi jahat dari kolusi.

Node DA ini bekerja sama dalam grup kecil, disebut quorums, untuk memeriksa dan memverifikasi data yang disimpan. Sistem mengasumsikan bahwa sebagian besar node dalam setiap grup akan bertindak jujur, yang dikenal sebagai asumsi "honest majority".

Mekanisme consensus yang digunakan oleh 0G cepat dan efisien karena pendekatan berbasis sampling. Daripada memverifikasi semua data, node DA melakukan sampling bagian dari data, secara drastis mengurangi data yang perlu mereka tangani. Setelah cukup node setuju bahwa data yang di-sampling tersedia dan benar, mereka mengirimkan availability proofs ke jaringan 0G Consensus. Pendekatan lightweight dan sample-driven ini memungkinkan verifikasi yang lebih cepat sambil mempertahankan keamanan yang kuat.

<div style={{textAlign: 'center'}}>
  <img src="/img/Validators in the 0G Consensus network.png" alt="Validator di jaringan 0G Consensus" style={{maxWidth: '100%'}} />
  <p><em>Validator di jaringan 0G Consensus memverifikasi dan menyelesaikan DA proofs</em></p>
</div>

Validator di jaringan 0G Consensus, yang terpisah dari node DA, memverifikasi dan menyelesaikan proof ini. Meskipun node DA memastikan data availability, mereka tidak berpartisipasi langsung dalam proses consensus akhir, yang merupakan tanggung jawab validator 0G. Validator menggunakan mekanisme shared staking di mana mereka men-stake token 0G pada jaringan utama (kemungkinan Ethereum). Setiap slashable event di seluruh jaringan yang terhubung mengarah pada slashing di jaringan utama, mengamankan skalabilitas sistem sambil mempertahankan keamanan yang kuat.

Ini adalah mekanisme kunci yang memungkinkan sistem untuk scale secara infinit sambil mempertahankan data availability. Sebagai imbalan, validator yang terlibat dalam shared staking menerima token 0G di jaringan manapun yang dikelola, yang kemudian dapat dibakar sebagai imbalan untuk token 0G di mainnet.

<div style={{textAlign: 'center'}}>
  <img src="/img/consensus process.png" alt="Proses Consensus 0G DA" style={{maxWidth: '100%'}} />
  <p><em>Pendekatan consensus lightweight dan sample-driven</em></p>
</div>

## Analogi Sederhana untuk Memahami DA

### Seperti Sistem Perpustakaan Digital Nasional

**Masalah Tradisional:**
- Setiap perpustakaan harus menyimpan semua buku (seperti DAL lama)
- Jika satu perpustakaan penuh, seluruh sistem lambat
- Verifikasi buku harus dilakukan satu per satu

**Solusi 0G DA:**
- **Infinite Libraries**: Bisa terus menambah cabang perpustakaan baru
- **Smart Sampling**: Tidak perlu cek semua buku, cukup sampling random
- **VRF Selection**: Sistem secara acak pilih perpustakaan mana yang bertugas
- **Shared Security**: Semua perpustakaan dijaga sistem keamanan yang sama

## Use Cases

0G DA menawarkan solusi DA yang infinitely scalable dan high-performance untuk berbagai aplikasi di Web3, AI, dan lainnya.

### L1s / L2s

Layer 1 dan Layer 2 chains dapat menggunakan 0G DA untuk menangani persyaratan data availability dan storage untuk model AI terdesentralisasi, dataset besar, dan aplikasi on-chain. Partner yang ada termasuk jaringan seperti **Polygon, Optimism, Arbitrum, Fuel, Manta Network**, **dan tak terhitung lainnya**, yang memanfaatkan infrastruktur scalable 0G untuk menyimpan data lebih efisien dan mendukung retrieval cepat.

### Decentralized Shared Sequencers

Decentralized Shared Sequencers membantu mengurutkan transaksi L2 sebelum settlement akhir di Ethereum. Dengan mengintegrasikan 0G DA, shared sequencers dapat mengoptimalkan data di beberapa jaringan secara terdesentralisasi, tidak seperti sequencer yang ada yang sering terpusat. Ini juga berarti transfer data yang cepat dan aman antara L2.

### Bridges

Cross-chain bridges mendapat manfaat dari fitur scalable storage dan data availability 0G DA. Jaringan dapat menyimpan dan mengambil state data menggunakan 0G DA, membuat migrasi state antara jaringan lebih cepat dan lebih aman. Misalnya, jaringan dapat mengonfirmasi aset pengguna dan mentransfernya dengan aman ke chain lain menggunakan verifikasi data yang sangat efisien dari 0G.

### Rollups-as-a-Service (RaaS)

0G DA dapat berfungsi sebagai solusi DA yang andal untuk penyedia RaaS seperti **Caldera dan AltLayer**, memungkinkan konfigurasi dan deployment rollups yang seamless. Dengan infrastruktur yang sangat scalable dari 0G DA, penyedia RaaS dapat memastikan availability data yang aman di beberapa rollups tanpa mengorbankan performance.

### DeFi

Infrastruktur DA 0G sangat cocok untuk aplikasi DeFi yang memerlukan settlement cepat dan high-frequency trading. Misalnya, dengan menyimpan data order book di 0G, proyek DeFi dapat mencapai throughput transaksi yang lebih cepat dan scalability yang ditingkatkan di L2 dan L3.

### On-Chain Gaming

Platform gaming on-chain bergantung pada cryptographic proofs dan metadata yang berkaitan dengan aset, tindakan, dan skor pemain. Kemampuan 0G DA untuk menangani volume data besar secara aman dan efisien membuatnya menjadi solusi optimal untuk aplikasi gaming yang memerlukan penyimpanan data yang andal dan retrieval cepat.

### Data Markets

Web3 data markets dapat mengambil manfaat dari 0G DA dengan menyimpan dataset on-chain. Kemampuan penyimpanan dan retrieval terdesentralisasi dari 0G memungkinkan update real-time dan querying data, menyediakan solusi andal untuk platform data market.

### AI & Machine Learning

0G DA secara khusus fokus pada mendukung AI terdesentralisasi, memungkinkan model AI penuh dan dataset yang luas untuk disimpan dan diakses on-chain. Infrastruktur ini sangat penting untuk aplikasi AI canggih yang menuntut throughput data tinggi dan availability, seperti training large language models (LLM) dan mengelola seluruh jaringan AI agent.

## Use Cases untuk Ekosistem Indonesia

### 1. **Government Digital Services**
- **e-Government Data**: Storage dan availability untuk data citizen
- **Inter-agency Data Sharing**: Secure dan efficient data transfer
- **Digital Identity**: Decentralized identity management

### 2. **Financial Technology**
- **Central Bank Digital Currency (CBDC)**: DA layer untuk digital rupiah
- **Cross-border Payments**: Efficient settlement antara bank
- **Microfinance**: Data availability untuk rural banking

### 3. **Supply Chain & Trade**
- **Export-Import Documentation**: Immutable trade records
- **Halal Certification**: Transparent supply chain tracking
- **Commodity Trading**: Real-time data untuk palm oil, coal, dll

### 4. **Smart Cities Initiative**
- **IoT Data Management**: Sensor data dari traffic, pollution, dll
- **Energy Grid**: Data untuk smart grid management
- **Public Transportation**: Real-time data untuk TransJakarta, dll

## Perbandingan dengan Solusi Lain

| Fitur | EigenDA | Celestia | Avail | 0G DA |
|-------|---------|----------|-------|-------|
| **Throughput** | ~10 Mbps | ~7 Mbps | ~2 Mbps | **50+ Gbps** |
| **Scalability** | Limited | Limited | Limited | **Infinite** |
| **Security** | Own token | Own token | Own token | **Ethereum staking** |
| **Built-in Storage** | ❌ | ❌ | ❌ | **✅** |
| **Randomization** | ❌ | ✅ | ✅ | **✅** |
| **AI-Optimized** | ❌ | ❌ | ❌ | **✅** |

## Technical Deep Dive

<details>
<summary><b>Bagaimana VRF bekerja dalam pemilihan node?</b></summary>

Verifiable Random Function (VRF):
1. Menghasilkan nilai random yang unpredictable
2. Nilai dapat diverifikasi oleh semua participant
3. Mencegah kolusi karena tidak ada yang tahu siapa yang akan dipilih
4. Ensures fair distribution dari workload

</details>

<details>
<summary><b>Apa itu Shared Staking mechanism?</b></summary>

Shared staking memungkinkan:
- Validator stake di mainnet (Ethereum)
- Secure multiple consensus networks sekaligus
- Slashing di satu network affects stake di mainnet
- Economic security yang shared across all networks
- Scale infinite tanpa menurunkan keamanan

</details>

<details>
<summary><b>Bagaimana sampling-based verification bekerja?</b></summary>

Sampling approach:
1. Node DA tidak verify semua data
2. Random sampling dari data chunks
3. Jika sample valid, assume seluruh data valid
4. Drastis reduce computational overhead
5. Maintain security melalui redundancy

</details>

## Mulai Menggunakan

Siap mengintegrasikan 0G DA ke proyek Anda?

- **[Jalankan DA Node](https://docs.0g.ai/run-a-node/da-node)**: Panduan operator node
- **[Integration Guide](https://docs.0g.ai/developer-hub/building-on-0g/da-integration)**: Dokumentasi developer
- **[Technical Deep Dive](https://docs.0g.ai/developer-hub/building-on-0g/da-deep-dive)**: Detail arsitektur DA

## Community Resources Indonesia

- [Workshop ETHJKT](https://ethjkt.com) - Monthly hands-on DA workshops
- [Discord ETHJKT](https://discord.gg/p5b6RFEnnk) - Indonesian developer community
- [Telegram](https://t.me/ethjkt_dev) - Daily technical discussions
- [GitHub Examples](https://github.com/ethereumjakarta) - Implementation examples

:::tip Pro Tip untuk Developer Indonesia
Mulai dengan testnet integration untuk understand workflow, lalu implement di staging sebelum production. 0G DA sangat suitable untuk high-throughput applications!
:::

## Langkah Selanjutnya

Ready untuk deep dive lebih jauh?
- [AI Alignment Nodes](./7-ai-alignment-nodes.md) - Pelajari tentang AI safety monitoring
- [Getting Started Tutorial](./9-getting-started.md) - Build aplikasi pertama dengan full 0G stack
- [Testnet Setup](./10-testnet-overview.md) - Setup development environment

---

*0G DA: Membawa infinite scalability ke decentralized data availability.*