---
id: sesi-2
title: "Sesi 2: Smart Contract Modular Architecture"
sidebar_label: "Sesi 2: Smart Contract Modular Architecture"
description: "Pendalaman standar ERC, proxy pattern, dan pengembangan sistem berbasis role untuk smart contract modular."
---

# Sesi 2: Smart Contract Modular Architecture

Selamat datang di sesi kedua Bootcamp **Web3 Hacker House**! Pada sesi ini, kita akan membahas arsitektur modular untuk smart contract, termasuk standar ERC (Ethereum Request for Comments), pola proxy untuk kontrak yang dapat di-upgrade, serta sistem kontrol akses berbasis peran. Di akhir sesi, kita akan melakukan hands-on dengan membuat token ERC-20 dan mengimplementasikan sistem Role-Based Access Control.

---

## Pengenalan Standar ERC (Ethereum Request for Comments)

Standar ERC adalah spesifikasi yang dibuat komunitas Ethereum untuk menstandarisasi fungsionalitas kontrak cerdas. Standar ini memungkinkan interoperabilitas antar aplikasi dan memastikan bahwa token dan kontrak dapat berinteraksi secara konsisten di seluruh ekosistem Ethereum.

### Mengapa Standar Penting?

- **Interoperabilitas**: Kontrak yang mengikuti standar yang sama dapat berinteraksi satu sama lain
- **Keamanan**: Standar telah diuji secara menyeluruh dan banyak memiliki implementasi referensi yang aman
- **Kompatibilitas**: Dompet, bursa, dan dApps dapat dengan mudah mendukung token atau kontrak yang mengikuti standar umum
- **Adopsi**: Memudahkan pengguna dan developer untuk memahami fungsionalitas yang diharapkan

### Proses Standardisasi

Standar ERC melalui proses pengembangan pada Ethereum Improvement Proposals (EIPs):

1. **Draft**: Proposal awal yang menjelaskan standar
2. **Review**: Diskusi dan umpan balik dari komunitas
3. **Last Call**: Periode terakhir untuk feedback sebelum finalisasi
4. **Final**: Standar telah diterima dan diimplementasikan
5. **Stagnant/Withdrawn**: Standar yang tidak aktif/ditinggalkan

---

## ERC-20: Token Fungible Standard

ERC-20 adalah standar untuk token fungible (dapat dipertukarkan) di Ethereum. Standar ini menjadi dasar bagi sebagian besar token di ekosistem Ethereum.

### Spesifikasi ERC-20

Interface dasar ERC-20 terdiri dari fungsi-fungsi berikut:

```solidity
interface IERC20 {
    // Events
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    
    // View Functions
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function allowance(address owner, address spender) external view returns (uint256);
    
    // State-Changing Functions
    function transfer(address to, uint256 amount) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}
```

### Fungsi Inti ERC-20

- **totalSupply()**: Mengembalikan jumlah total token yang ada
- **balanceOf(address)**: Mengembalikan saldo token untuk alamat tertentu
- **transfer(address, uint256)**: Mentransfer token dari sender ke alamat tujuan
- **transferFrom(address, address, uint256)**: Mentransfer token dari satu alamat ke alamat lain (digunakan setelah approval)
- **approve(address, uint256)**: Mengizinkan alamat lain memindahkan token atas nama pemilik
- **allowance(address, address)**: Mengembalikan jumlah token yang diizinkan untuk dipindahkan oleh alamat lain

### Fungsi Opsional ERC-20

Beberapa fungsi tambahan yang sering diimplementasikan:

```solidity
function name() external view returns (string memory);
function symbol() external view returns (string memory);
function decimals() external view returns (uint8);
```

### Use Cases ERC-20

- **Utility Tokens**: Token yang memberikan akses ke produk atau layanan
- **Governance Tokens**: Token yang memberikan hak suara dalam DAO
- **Stablecoins**: Token yang dipatok ke nilai aset lain (seperti USD)
- **Security Tokens**: Token yang merepresentasikan aset finansial
- **Liquidity Provider (LP) Tokens**: Token yang merepresentasikan kontribusi ke liquidity pool

### Contoh Implementasi ERC-20 Dasar

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("MyToken", "MTK") {
        _mint(msg.sender, initialSupply);
    }
}
```

### Keterbatasan ERC-20

- Tidak memiliki mekanisme untuk menangani pengiriman ke kontrak yang tidak mendukung token
- Tidak mendukung metadata
- Tidak memiliki metode standar untuk melakukan batch transfer
- Tidak membedakan antara address EOA dan kontrak

---

## ERC-721: Non-Fungible Token Standard

ERC-721 adalah standar untuk token non-fungible (NFT) - token unik yang tidak dapat dipertukarkan satu sama lain.

### Spesifikasi ERC-721

Interface dasar ERC-721:

```solidity
interface IERC721 {
    // Events
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);
    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);
    
    // View Functions
    function balanceOf(address owner) external view returns (uint256 balance);
    function ownerOf(uint256 tokenId) external view returns (address owner);
    function getApproved(uint256 tokenId) external view returns (address operator);
    function isApprovedForAll(address owner, address operator) external view returns (bool);
    
    // State-Changing Functions
    function approve(address to, uint256 tokenId) external;
    function setApprovalForAll(address operator, bool _approved) external;
    function transferFrom(address from, address to, uint256 tokenId) external;
    function safeTransferFrom(address from, address to, uint256 tokenId) external;
    function safeTransferFrom(address from, address to, uint256 tokenId, bytes calldata data) external;
}

interface IERC721Metadata {
    function name() external view returns (string memory);
    function symbol() external view returns (string memory);
    function tokenURI(uint256 tokenId) external view returns (string memory);
}
```

### Fungsi Inti ERC-721

- **balanceOf(address)**: Mengembalikan jumlah NFT yang dimiliki oleh alamat
- **ownerOf(uint256)**: Mengembalikan pemilik token ID tertentu
- **transferFrom(address, address, uint256)**: Mentransfer token dengan ID tertentu
- **safeTransferFrom(...)**: Mentransfer token dengan pengecekan keamanan tambahan
- **approve(address, uint256)**: Memberikan izin kepada alamat untuk memindahkan token tertentu
- **setApprovalForAll(address, bool)**: Memberikan izin kepada alamat untuk memindahkan semua token
- **tokenURI(uint256)**: Mengembalikan URI metadata untuk token tertentu

### Metadata dalam ERC-721

ERC-721 memiliki mekanisme standar untuk metadata melalui `tokenURI` yang mengembalikan URI ke JSON dengan format:

```json
{
    "name": "Asset Name",
    "description": "Description of the asset",
    "image": "https://myserver.com/images/123.png",
    "attributes": [
        {
            "trait_type": "Color",
            "value": "Blue"
        },
        {
            "trait_type": "Rarity",
            "value": "Uncommon"
        }
    ]
}
```

### Use Cases ERC-721

- **Digital Art**: Karya seni digital dengan provenance terverifikasi
- **Collectibles**: Item koleksi digital (seperti kartu trading)
- **Gaming Assets**: Item dan karakter dalam game
- **Virtual Real Estate**: Tanah dan properti di metaverse
- **Identity & Certification**: Kredensi dan sertifikat digital
- **Physical Asset Tokenization**: Representasi aset fisik di blockchain

### Contoh Implementasi ERC-721 Dasar

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MyNFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("MyNFT", "MNFT") {}

    function mintNFT(address recipient, string memory tokenURI)
        public
        returns (uint256)
    {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);
        return newItemId;
    }
}
```

---

## ERC-1155: Multi-Token Standard

ERC-1155 adalah standar yang menggabungkan fungsi ERC-20 dan ERC-721, memungkinkan kontrak tunggal mengelola berbagai tipe token (fungible dan non-fungible) secara efisien.

### Spesifikasi ERC-1155

Interface dasar ERC-1155:

```solidity
interface IERC1155 {
    // Events
    event TransferSingle(address indexed operator, address indexed from, address indexed to, uint256 id, uint256 value);
    event TransferBatch(address indexed operator, address indexed from, address indexed to, uint256[] ids, uint256[] values);
    event ApprovalForAll(address indexed account, address indexed operator, bool approved);
    event URI(string value, uint256 indexed id);
    
    // View Functions
    function balanceOf(address account, uint256 id) external view returns (uint256);
    function balanceOfBatch(address[] calldata accounts, uint256[] calldata ids) external view returns (uint256[] memory);
    function isApprovedForAll(address account, address operator) external view returns (bool);
    
    // State-Changing Functions
    function setApprovalForAll(address operator, bool approved) external;
    function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes calldata data) external;
    function safeBatchTransferFrom(address from, address to, uint256[] calldata ids, uint256[] calldata amounts, bytes calldata data) external;
}
```

### Keunggulan ERC-1155

1. **Efisiensi Gas**: Dapat mengelola banyak token dalam satu kontrak, mengurangi biaya deploy dan storage
2. **Batch Operations**: Mendukung transfer dan query batch untuk beberapa token sekaligus
3. **Semi-Fungible Tokens**: Dapat merepresentasikan token yang memiliki karakteristik fungible dan non-fungible
4. **Optimasi Storage**: Penggunaan mapping ganda untuk menghemat storage

### Use Cases ERC-1155

- **Gaming**: Game dengan berbagai item, mata uang, dan koleksi
- **Market & Exchanges**: Platform yang menangani berbagai jenis token
- **Hybrid Assets**: Asset yang bisa berganti sifat antara fungible dan non-fungible
- **Batch Operations**: Aplikasi yang memerlukan banyak transfer token sekaligus

### Contoh Implementasi ERC-1155 Dasar

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;   // Gunakan 0.8.20+ agar cocok dengan OZ v5

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyMultiToken is ERC1155, Ownable {
    uint256 public constant GOLD         = 0;
    uint256 public constant SILVER       = 1;
    uint256 public constant THORS_HAMMER = 2;
    uint256 public constant SWORD        = 3;
    uint256 public constant SHIELD       = 4;

    // ➜ terima pemilik awal sebagai argumen, boleh juga hard-code msg.sender
    constructor(address initialOwner)
        ERC1155("https://game.example/api/item/{id}.json")
        Ownable(initialOwner)              // <-- kirim ke Ownable
    {
        _mint(initialOwner, GOLD,         10 ** 18, "");
        _mint(initialOwner, SILVER,       10 ** 27, "");
        _mint(initialOwner, THORS_HAMMER, 1,         "");
        _mint(initialOwner, SWORD,        10 ** 3,  "");
        _mint(initialOwner, SHIELD,       10 ** 3,  "");
    }

    function mint(
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) external onlyOwner {
        _mint(to, id, amount, data);
    }

    function mintBatch(
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) external onlyOwner {
        _mintBatch(to, ids, amounts, data);
    }
}
```

### Perbandingan ERC-20 vs ERC-721 vs ERC-1155

| Fitur | ERC-20 | ERC-721 | ERC-1155 |
|-------|--------|---------|----------|
| **Fungibilitas** | Fungible | Non-Fungible | Keduanya |
| **ID Token** | Tidak ada ID individual | Setiap token memiliki ID unik | Token diidentifikasi dengan ID dan amount |
| **Batch Operations** | Tidak | Tidak | Ya |
| **Efisiensi Gas** | Moderat | Rendah | Tinggi |
| **Metadata** | Tidak terstandarisasi | Terstandarisasi via tokenURI | Terstandarisasi via URI |
| **Kompleksitas** | Rendah | Moderat | Tinggi |
| **Use Case Utama** | Mata uang, utility token | Koleksi, seni digital | Game, marketplace multi-aset |

---

## OpenZeppelin Proxy & Upgradeable Contracts

Salah satu tantangan utama dalam pengembangan smart contract adalah sifat immutable-nya. Sekali di-deploy, kode smart contract tidak dapat diubah. Pattern proxy memungkinkan logika kontrak diperbarui sambil mempertahankan state dan alamat yang sama.

### Mengapa Kontrak Perlu Di-upgrade?

- **Bug Fixes**: Memperbaiki kerentanan atau bug
- **Feature Additions**: Menambahkan fitur baru
- **Optimasi**: Meningkatkan efisiensi gas
- **Adaptasi**: Menyesuaikan dengan perubahan ekosistem atau regulasi

### Arsitektur Kontrak Upgradeable

Pola proxy terdiri dari dua kontrak utama:

1. **Proxy Contract**: Menyimpan state dan meneruskan panggilan ke implementation contract
2. **Implementation Contract**: Berisi logika bisnis tetapi tidak menyimpan state

Ketika fungsi dipanggil pada proxy, ia menggunakan `delegatecall` untuk menjalankan kode dari implementation contract tetapi dengan konteks (storage, msg.sender, dll) dari proxy.

![Proxy Pattern Architecture](https://docs.openzeppelin.com/assets/img/proxy-pattern.5c780cae.png)

### Storage Collisions dan Storage Layout

Tantangan utama dalam kontrak upgradeable adalah memastikan tidak ada collision storage antara versi implementation yang berbeda.

OpenZeppelin menggunakan pola **Unstructured Storage** di mana variabel proxy disimpan pada slot storage yang telah ditentukan sebelumnya dan jauh dari slot yang digunakan oleh implementation contract.

### Jenis Pola Proxy

#### 1. Transparent Proxy Pattern

- Admin dapat mengupgrade proxy dan mengubah implementasi
- Pengguna biasa hanya dapat mengakses fungsi implementasi
- Menghindari **function selector clashing** antara proxy dan implementation
- Lebih mahal untuk pengguna reguler karena pemeriksaan tambahan

```solidity
// TransparentUpgradeableProxy dari OpenZeppelin
contract TransparentUpgradeableProxy is ERC1967Proxy {
    constructor(address _logic, address admin_, bytes memory _data) ERC1967Proxy(_logic, _data) {
        _changeAdmin(admin_);
    }
    
    // Admin functions
    function upgradeTo(address newImplementation) external ifAdmin {
        _upgradeToAndCall(newImplementation, bytes(""), false);
    }
    
    // ... other admin functions
    
    modifier ifAdmin() {
        if (msg.sender == _getAdmin()) {
            _;
        } else {
            _fallback();
        }
    }
}
```

#### 2. Universal Upgradeable Proxy Standard (UUPS)

- Logika upgrade terletak dalam implementation contract, bukan proxy
- Tidak memerlukan pemeriksaan khusus untuk admin vs pengguna
- Lebih hemat gas untuk transaksi normal
- Perlu hati-hati untuk memastikan fungsi upgrade selalu tersedia di kontrak implementation

```solidity
// Implementation kontrak dengan UUPS
contract MyTokenUpgradeable is Initializable, ERC20Upgradeable, UUPSUpgradeable, OwnableUpgradeable {
    function initialize(string memory name, string memory symbol) public initializer {
        __ERC20_init(name, symbol);
        __Ownable_init();
        __UUPSUpgradeable_init();
    }
    
    // Logika upgrade berada di kontrak implementasi
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {
        // Validasi opsional untuk implementasi baru bisa ditambahkan di sini
    }
}
```

### Perbandingan UUPS vs Transparent Proxy

| Aspek | Transparent Proxy | UUPS Proxy |
|-------|-------------------|------------|
| **Lokasi logika upgrade** | Di proxy | Di kontrak implementasi |
| **Gas usage** | Lebih tinggi untuk panggilan normal | Lebih rendah untuk panggilan normal |
| **Biaya deployment** | Lebih tinggi | Lebih rendah |
| **Risiko** | Lebih rendah (kontrol admin selalu di proxy) | Lebih tinggi (harus memastikan implementasi baru mendukung upgrade) |
| **Function selector clashing** | Diatasi secara otomatis | Perlu dikelola secara manual |

### Initializers vs Constructors

Dalam kontrak upgradeable, constructor tidak dapat digunakan untuk inisialisasi karena constructor dijalankan saat deployment implementation, bukan saat digunakan oleh proxy.

Sebagai gantinya, kita menggunakan pola initializer:

```solidity
// Pola inisialisasi untuk kontrak upgradeable
contract MyUpgradeableToken is Initializable, ERC20Upgradeable {
    function initialize(string memory name, string memory symbol, uint256 initialSupply) public initializer {
        __ERC20_init(name, symbol);
        _mint(msg.sender, initialSupply);
    }
}
```

Modifier `initializer` memastikan fungsi hanya dapat dipanggil sekali.

### Praktik Terbaik untuk Kontrak Upgradeable

1. **Perencanaan Storage**: Hindari mengubah struktur storage antar versi
2. **Gunakan Library OpenZeppelin**: Banyak vulnerabilitas yang telah diselesaikan
3. **Timelock & Governance**: Terapkan mekanisme timelock untuk upgrade penting
4. **Pengujian Menyeluruh**: Uji upgrade dengan skenario nyata
5. **Backup Data**: Pastikan data state dapat dipulihkan jika upgrade gagal
6. **Dokumentasi**: Dokumentasikan perubahan antar versi dengan jelas

---

## Role-Based Access Control (RBAC)

Role-Based Access Control (RBAC) adalah pendekatan untuk membatasi akses sistem berdasarkan peran pengguna. Dalam kontrak cerdas, ini sangat penting untuk membatasi tindakan tertentu hanya kepada alamat atau akun dengan peran yang sesuai.

### Prinsip RBAC

1. **Role Assignment**: Pengguna diberi satu atau lebih peran
2. **Role Authorization**: Peran memiliki izin untuk melakukan tindakan tertentu
3. **Permission Checks**: Sistem memeriksa peran pengguna sebelum mengizinkan tindakan

### Implementasi RBAC dengan OpenZeppelin

OpenZeppelin menyediakan library `AccessControl` yang memudahkan implementasi RBAC:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract MyContract is AccessControl {
    // Create role identifiers
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");
    
    constructor() {
        // Grant the contract deployer the admin role
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
    }
    
    // Functions accessible only by specific roles
    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        // mint logic
    }
    
    function burn(address from, uint256 amount) public onlyRole(BURNER_ROLE) {
        // burn logic
    }
    
    // Admin can grant roles to other addresses
    function grantMinterRole(address account) public onlyRole(ADMIN_ROLE) {
        grantRole(MINTER_ROLE, account);
    }
    
    function revokeMinterRole(address account) public onlyRole(ADMIN_ROLE) {
        revokeRole(MINTER_ROLE, account);
    }
}
```

### Peran Hierarkis

AccessControl mendukung hierarki peran melalui peran admin. Setiap peran memiliki peran admin terkait, yang dapat memberikan dan mencabut peran tersebut.

```solidity
// Membuat peran hierarkis
function setupRoleHierarchy() internal {
    // Admin dapat mengelola Minter
    _setRoleAdmin(MINTER_ROLE, ADMIN_ROLE);
    
    // Admin dapat mengelola Burner
    _setRoleAdmin(BURNER_ROLE, ADMIN_ROLE);
    
    // DEFAULT_ADMIN_ROLE dapat mengelola Admin
    _setRoleAdmin(ADMIN_ROLE, DEFAULT_ADMIN_ROLE);
}
```

### Praktik Terbaik RBAC

1. **Prinsip Hak Istimewa Terkecil**: Berikan akses hanya yang diperlukan
2. **Pemisahan Tugas**: Pisahkan peran yang sensitif (mis., minter dan burner)
3. **Validasi Input**: Selalu validasi input bahkan dengan RBAC
4. **Implementasi Timelock**: Untuk tindakan sensitif, pertimbangkan penundaan eksekusi
5. **Audit Events**: Emit events untuk perubahan peran untuk transparansi

---

## Hands-on: Buat Token ERC20 dan Sistem Role-Based Access Control

Sekarang mari kita terapkan konsep-konsep di atas dengan membuat token ERC-20 yang dapat di-upgrade dengan sistem Role-Based Access Control.

### Langkah 1: Setup Proyek

```bash
# Buat direktori proyek baru
mkdir modular-token
cd modular-token

# Inisialisasi proyek Hardhat
npm init -y
npm install --save-dev hardhat @openzeppelin/contracts @openzeppelin/contracts-upgradeable @openzeppelin/hardhat-upgrades ethers

# Inisialisasi Hardhat
npx hardhat
```

Pilih "Create an empty hardhat.config.js" saat diminta.

### Langkah 2: Konfigurasi Hardhat untuk Upgradeable Contracts

Edit file `hardhat.config.js`:

```javascript
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("@openzeppelin/hardhat-upgrades");
require("dotenv").config();

module.exports = {
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    hardhat: {},
    goerli: {
      url: process.env.ALCHEMY_GOERLI_URL || "",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    }
  }
};
```

Buat file `.env` untuk menyimpan variabel environment:

```
ALCHEMY_GOERLI_URL=https://eth-goerli.g.alchemy.com/v2/YOUR_API_KEY
PRIVATE_KEY=your_private_key_here
```

### Langkah 3: Implementasi Token ERC-20 dengan RBAC

Buat file `contracts/ModularToken.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract ModularToken is 
    Initializable, 
    ERC20Upgradeable, 
    AccessControlUpgradeable, 
    UUPSUpgradeable 
{
    // Role definitions
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");
    
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }
    
    function initialize(
        string memory name, 
        string memory symbol,
        address admin
    ) public initializer {
        __ERC20_init(name, symbol);
        __AccessControl_init();
        __UUPSUpgradeable_init();
        
        // Setup roles
        _setupRole(DEFAULT_ADMIN_ROLE, admin);
        _setupRole(MINTER_ROLE, admin);
        _setupRole(BURNER_ROLE, admin);
        _setupRole(UPGRADER_ROLE, admin);
        
        // Set role hierarchy
        _setRoleAdmin(MINTER_ROLE, DEFAULT_ADMIN_ROLE);
        _setRoleAdmin(BURNER_ROLE, DEFAULT_ADMIN_ROLE);
        _setRoleAdmin(UPGRADER_ROLE, DEFAULT_ADMIN_ROLE);
    }
    
    // Mint new tokens - only callable by MINTER_ROLE
    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        _mint(to, amount);
        
        emit TokensMinted(to, amount, msg.sender);
    }
    
    // Burn tokens - only callable by BURNER_ROLE or token owner
    function burn(address from, uint256 amount) public {
        require(
            hasRole(BURNER_ROLE, msg.sender) || from == msg.sender,
            "ModularToken: must have burner role or be token owner"
        );
        
        // If caller is not the token owner, check allowance
        if (from != msg.sender) {
            uint256 currentAllowance = allowance(from, msg.sender);
            require(currentAllowance >= amount, "ERC20: burn amount exceeds allowance");
            _approve(from, msg.sender, currentAllowance - amount);
        }
        
        _burn(from, amount);
        
        emit TokensBurned(from, amount, msg.sender);
    }
    
    // Allow contract upgrade - only callable by UPGRADER_ROLE
    function _authorizeUpgrade(address newImplementation) internal override onlyRole(UPGRADER_ROLE) {
        emit ContractUpgraded(newImplementation, msg.sender);
    }
    
    // Enforce RBAC when transferring role administration
    function setRoleAdmin(bytes32 role, bytes32 adminRole) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _setRoleAdmin(role, adminRole);
        
        emit RoleAdminChanged(role, getRoleAdmin(role), adminRole);
    }
    
    // Custom events for better traceability
    event TokensMinted(address indexed to, uint256 amount, address indexed minter);
    event TokensBurned(address indexed from, uint256 amount, address indexed burner);
    event ContractUpgraded(address indexed newImplementation, address indexed upgrader);
    
    // Pausable functionality could be added in a future upgrade
    
    // Override all the required interface functions
    function supportsInterface(bytes4 interfaceId) public view override(AccessControlUpgradeable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
```

### Langkah 4: Script Deployment untuk UUPS Proxy

Buat file `scripts/deploy.js`:

```javascript
const { ethers, upgrades } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  
  // Deploy ModularToken dengan UUPS proxy
  const ModularToken = await ethers.getContractFactory("ModularToken");
  console.log("Deploying ModularToken...");
  
  const proxy = await upgrades.deployProxy(
    ModularToken, 
    ["Modular Token", "MTK", deployer.address], 
    { kind: "uups" }
  );
  
  await proxy.deployed();
  console.log("ModularToken deployed to:", proxy.address);
  
  // Verification info
  console.log("Implementation address:", await upgrades.erc1967.getImplementationAddress(proxy.address));
  console.log("Admin address:", await upgrades.erc1967.getAdminAddress(proxy.address));
  
  // Initial minting
  console.log("Minting initial supply...");
  const mintTx = await proxy.mint(deployer.address, ethers.utils.parseEther("1000000"));
  await mintTx.wait();
  console.log("Minted 1,000,000 tokens to:", deployer.address);
  
  // Assign roles to another account (for demo purposes)
  const demoAccount = "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199"; // Replace with your demo account
  
  console.log(`Granting MINTER_ROLE to: ${demoAccount}`);
  const minterRole = await proxy.MINTER_ROLE();
  const grantMinterTx = await proxy.grantRole(minterRole, demoAccount);
  await grantMinterTx.wait();
  
  console.log("Deployment and initial setup complete!");
}

// Run the deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error saat deploy:", error);
    process.exit(1);
  });
```

### Langkah 5: Buat Script untuk Upgrade Kontrak

Sekarang kita akan membuat script untuk upgrade kontrak ke versi baru dengan fitur tambahan.

Pertama, buat versi baru dari kontrak `ModularTokenV2.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./ModularToken.sol";

contract ModularTokenV2 is ModularToken {
    // Tambahan fitur baru: Freeze akun
    bytes32 public constant FREEZER_ROLE = keccak256("FREEZER_ROLE");
    
    // Mapping untuk menyimpan status freeze akun
    mapping(address => bool) private _frozen;
    
    // Menambahkan event
    event AccountFrozen(address indexed account, bool frozen);
    
    // Function untuk menginisialisasi versi V2
    function initializeV2() public reinitializer(2) {
        // Setup role tambahan
        _setupRole(FREEZER_ROLE, msg.sender);
        _setRoleAdmin(FREEZER_ROLE, DEFAULT_ADMIN_ROLE);
    }
    
    // Function untuk freeze/unfreeze akun
    function setAccountFrozen(address account, bool frozen) public onlyRole(FREEZER_ROLE) {
        _frozen[account] = frozen;
        emit AccountFrozen(account, frozen);
    }
    
    // Cek apakah akun di-freeze
    function isFrozen(address account) public view returns (bool) {
        return _frozen[account];
    }
    
    // Override transfer untuk menambahkan pengecekan status freeze
    function transfer(address to, uint256 amount) public override returns (bool) {
        require(!_frozen[msg.sender], "ModularToken: sender account is frozen");
        require(!_frozen[to], "ModularToken: recipient account is frozen");
        return super.transfer(to, amount);
    }
    
    // Override transferFrom untuk menambahkan pengecekan status freeze
    function transferFrom(address from, address to, uint256 amount) public override returns (bool) {
        require(!_frozen[from], "ModularToken: sender account is frozen");
        require(!_frozen[to], "ModularToken: recipient account is frozen");
        return super.transferFrom(from, to, amount);
    }
    
    // Tambahkan versi contract untuk audit
    function getVersion() public pure returns (string memory) {
        return "v2.0.0";
    }
}
```

Kemudian, buat script untuk mengupgrade kontrak `scripts/upgrade.js`:

```javascript
const { ethers, upgrades } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Upgrading contract with the account:", deployer.address);
  
  // Alamat proxy dari deployment sebelumnya
  const proxyAddress = "PROXY_ADDRESS"; // Ganti dengan alamat proxy kontrak yang sudah di-deploy
  
  // Deploy implementasi baru
  const ModularTokenV2 = await ethers.getContractFactory("ModularTokenV2");
  console.log("Upgrading ModularToken to V2...");
  
  // Perform upgrade
  const upgraded = await upgrades.upgradeProxy(proxyAddress, ModularTokenV2);
  
  console.log("Proxy upgraded successfully to V2!");
  console.log("New implementation address:", await upgrades.erc1967.getImplementationAddress(upgraded.address));
  
  // Initialize V2 functionality
  console.log("Initializing V2 features...");
  const initTx = await upgraded.initializeV2();
  await initTx.wait();
  
  // Test new functionality
  console.log("Testing new freezing functionality...");
  const testAccount = "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199"; // Replace with test account
  
  // Freeze test account
  const freezeTx = await upgraded.setAccountFrozen(testAccount, true);
  await freezeTx.wait();
  
  // Check if account is frozen
  const isFrozen = await upgraded.isFrozen(testAccount);
  console.log(`Account ${testAccount} frozen status: ${isFrozen}`);
  
  // Get contract version
  const version = await upgraded.getVersion();
  console.log("Contract version:", version);
  
  console.log("Upgrade complete!");
}

// Run the upgrade
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error upgrading contract:", error);
    process.exit(1);
  });
```

### Langkah 6: Test Suite untuk ModularToken

Buat file test `test/ModularToken.test.js` dengan test untuk fungsionalitas kontrak:

```javascript
const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("ModularToken", function () {
  let ModularToken;
  let modularToken;
  let owner, minter, burner, upgrader, user1, user2;
  let MINTER_ROLE, BURNER_ROLE, UPGRADER_ROLE, DEFAULT_ADMIN_ROLE;
  
  const initialSupply = ethers.utils.parseEther("1000000");
  
  beforeEach(async function () {
    // Get signers
    [owner, minter, burner, upgrader, user1, user2] = await ethers.getSigners();
    
    // Deploy token
    ModularToken = await ethers.getContractFactory("ModularToken");
    modularToken = await upgrades.deployProxy(
      ModularToken,
      ["Modular Token", "MTK", owner.address],
      { kind: "uups" }
    );
    await modularToken.deployed();
    
    // Get role identifiers
    MINTER_ROLE = await modularToken.MINTER_ROLE();
    BURNER_ROLE = await modularToken.BURNER_ROLE();
    UPGRADER_ROLE = await modularToken.UPGRADER_ROLE();
    DEFAULT_ADMIN_ROLE = await modularToken.DEFAULT_ADMIN_ROLE();
    
    // Setup roles
    await modularToken.grantRole(MINTER_ROLE, minter.address);
    await modularToken.grantRole(BURNER_ROLE, burner.address);
    await modularToken.grantRole(UPGRADER_ROLE, upgrader.address);
    
    // Mint initial tokens
    await modularToken.connect(minter).mint(owner.address, initialSupply);
  });
  
  describe("Basic Token Functionality", function () {
    it("Should have the correct name and symbol", async function () {
      expect(await modularToken.name()).to.equal("Modular Token");
      expect(await modularToken.symbol()).to.equal("MTK");
    });
    
    it("Should assign initial supply to owner", async function () {
      expect(await modularToken.balanceOf(owner.address)).to.equal(initialSupply);
    });
    
    it("Should allow transfers between accounts", async function () {
      const transferAmount = ethers.utils.parseEther("1000");
      await modularToken.transfer(user1.address, transferAmount);
      expect(await modularToken.balanceOf(user1.address)).to.equal(transferAmount);
    });
  });
  
  describe("Role-Based Access Control", function () {
    it("Should allow minter to mint tokens", async function () {
      const mintAmount = ethers.utils.parseEther("5000");
      await modularToken.connect(minter).mint(user1.address, mintAmount);
      expect(await modularToken.balanceOf(user1.address)).to.equal(mintAmount);
    });
    
    it("Should not allow non-minter to mint tokens", async function () {
      const mintAmount = ethers.utils.parseEther("5000");
      await expect(
        modularToken.connect(user1).mint(user1.address, mintAmount)
      ).to.be.revertedWith(/AccessControl/);
    });
    
    it("Should allow burner to burn tokens", async function () {
      // First transfer some tokens
      const transferAmount = ethers.utils.parseEther("10000");
      await modularToken.transfer(user1.address, transferAmount);
      
      // Then burn
      const burnAmount = ethers.utils.parseEther("5000");
      await modularToken.connect(burner).burn(user1.address, burnAmount);
      expect(await modularToken.balanceOf(user1.address)).to.equal(transferAmount.sub(burnAmount));
    });
    
    it("Should allow users to burn their own tokens", async function () {
      // First transfer some tokens
      const transferAmount = ethers.utils.parseEther("10000");
      await modularToken.transfer(user1.address, transferAmount);
      
      // User burns their own tokens
      const burnAmount = ethers.utils.parseEther("5000");
      await modularToken.connect(user1).burn(user1.address, burnAmount);
      expect(await modularToken.balanceOf(user1.address)).to.equal(transferAmount.sub(burnAmount));
    });
  });
  
  describe("Role Administration", function () {
    it("Should allow admin to grant roles", async function () {
      await modularToken.grantRole(MINTER_ROLE, user2.address);
      expect(await modularToken.hasRole(MINTER_ROLE, user2.address)).to.equal(true);
    });
    
    it("Should allow admin to revoke roles", async function () {
      await modularToken.revokeRole(MINTER_ROLE, minter.address);
      expect(await modularToken.hasRole(MINTER_ROLE, minter.address)).to.equal(false);
    });
    
    it("Should not allow non-admin to grant roles", async function () {
      await expect(
        modularToken.connect(user1).grantRole(MINTER_ROLE, user2.address)
      ).to.be.revertedWith(/AccessControl/);
    });
  });
  
  describe("Upgradeability", function () {
    it("Should not allow non-upgrader to upgrade contract", async function () {
      const ModularTokenV2 = await ethers.getContractFactory("ModularToken");
      await expect(
        upgrades.upgradeProxy(modularToken.address, ModularTokenV2.connect(user1))
      ).to.be.revertedWith(/AccessControl/);
    });
  });
});
```

### Langkah 7: Deploy dan Test ModularTokenV2

Untuk menguji upgrade kontrak, kita dapat menambahkan test khusus untuk ModularTokenV2:

```javascript
describe("ModularTokenV2", function () {
  let ModularToken, ModularTokenV2;
  let modularToken, upgradedToken;
  let owner, minter, burner, upgrader, freezer, user1, user2;
  let MINTER_ROLE, BURNER_ROLE, UPGRADER_ROLE, FREEZER_ROLE;
  
  const initialSupply = ethers.utils.parseEther("1000000");
  
  beforeEach(async function () {
    // Get signers
    [owner, minter, burner, upgrader, freezer, user1, user2] = await ethers.getSigners();
    
    // Deploy original token
    ModularToken = await ethers.getContractFactory("ModularToken");
    modularToken = await upgrades.deployProxy(
      ModularToken,
      ["Modular Token", "MTK", owner.address],
      { kind: "uups" }
    );
    await modularToken.deployed();
    
    // Setup roles
    MINTER_ROLE = await modularToken.MINTER_ROLE();
    BURNER_ROLE = await modularToken.BURNER_ROLE();
    UPGRADER_ROLE = await modularToken.UPGRADER_ROLE();
    
    await modularToken.grantRole(MINTER_ROLE, minter.address);
    await modularToken.grantRole(BURNER_ROLE, burner.address);
    await modularToken.grantRole(UPGRADER_ROLE, upgrader.address);
    
    // Mint initial tokens
    await modularToken.connect(minter).mint(owner.address, initialSupply);
    
    // Upgrade to V2
    ModularTokenV2 = await ethers.getContractFactory("ModularTokenV2");
    upgradedToken = await upgrades.upgradeProxy(modularToken.address, ModularTokenV2.connect(upgrader));
    
    // Initialize V2
    await upgradedToken.connect(owner).initializeV2();
    
    // Get new role
    FREEZER_ROLE = await upgradedToken.FREEZER_ROLE();
    
    // Set freezer role
    await upgradedToken.connect(owner).grantRole(FREEZER_ROLE, freezer.address);
  });
  
  it("Should maintain state after upgrade", async function () {
    expect(await upgradedToken.balanceOf(owner.address)).to.equal(initialSupply);
    expect(await upgradedToken.hasRole(MINTER_ROLE, minter.address)).to.equal(true);
  });
  
  it("Should have new freeze functionality", async function () {
    // Freeze user1
    await upgradedToken.connect(freezer).setAccountFrozen(user1.address, true);
    expect(await upgradedToken.isFrozen(user1.address)).to.equal(true);
    
    // Transfer some tokens to user2
    const transferAmount = ethers.utils.parseEther("1000");
    await upgradedToken.transfer(user2.address, transferAmount);
    
    // User2 should not be able to transfer to frozen user1
    await expect(
      upgradedToken.connect(user2).transfer(user1.address, transferAmount)
    ).to.be.revertedWith("ModularToken: recipient account is frozen");
    
    // Unfreeze user1
    await upgradedToken.connect(freezer).setAccountFrozen(user1.address, false);
    
    // Now transfer should succeed
    await upgradedToken.connect(user2).transfer(user1.address, transferAmount);
    expect(await upgradedToken.balanceOf(user1.address)).to.equal(transferAmount);
  });
  
  it("Should expose version information", async function () {
    expect(await upgradedToken.getVersion()).to.equal("v2.0.0");
  });
});
```

### Langkah 8: Membuat Frontend Sederhana untuk Interaksi dengan Token

Untuk membuat pengalaman pengguna yang lengkap, kita dapat membuat frontend sederhana menggunakan React dan ethers.js:

```bash
# Buat direktori frontend
mkdir frontend
cd frontend

# Inisialisasi proyek React
npx create-react-app .

# Install dependencies
npm install ethers @openzeppelin/contracts
```

Buat file `src/config.js` untuk konfigurasi kontrak:

```javascript
export const CONTRACT_ADDRESS = "YOUR_DEPLOYED_CONTRACT_ADDRESS";
export const CONTRACT_ABI = [
  // Isi dengan ABI dari ModularToken
  // Anda bisa mendapatkannya dari artifacts/contracts/ModularToken.sol/ModularToken.json setelah kompilasi
];
```

Kemudian buat komponen utama di `src/App.js`:

```jsx
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from './config';
import './App.css';

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState(0);
  const [roles, setRoles] = useState({
    isMinter: false,
    isBurner: false,
    isAdmin: false,
    isUpgrader: false
  });
  const [recipients, setRecipients] = useState([]);
  const [mintAmount, setMintAmount] = useState('');
  const [mintRecipient, setMintRecipient] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferRecipient, setTransferRecipient] = useState('');
  const [loading, setLoading] = useState(false);

  // Connect to MetaMask and contract
  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        try {
          // Connect to provider
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          setProvider(provider);
          
          // Request accounts access
          const accounts = await provider.send("eth_requestAccounts", []);
          const account = accounts[0];
          setAccount(account);
          
          // Get signer
          const signer = provider.getSigner();
          setSigner(signer);
          
          // Connect to contract
          const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
          setContract(contract);
          
          // Get balance
          updateBalance(contract, account);
          
          // Check roles
          await checkRoles(contract, account);
          
          // Register event listeners
          contract.on("Transfer", (from, to) => {
            updateBalance(contract, account);
            // Track unique recipients
            if (from.toLowerCase() === account.toLowerCase() && 
                !recipients.includes(to.toLowerCase())) {
              setRecipients([...recipients, to.toLowerCase()]);
            }
          });
          
          // Listen for account changes
          window.ethereum.on('accountsChanged', (accounts) => {
            setAccount(accounts[0]);
            updateBalance(contract, accounts[0]);
            checkRoles(contract, accounts[0]);
          });
        } catch (error) {
          console.error("Error initializing:", error);
        }
      } else {
        alert("Please install MetaMask to use this dApp");
      }
    };
    
    init();
    
    return () => {
      // Clean up event listeners
      if (contract) {
        contract.removeAllListeners();
      }
    };
  }, []);
  
  // Update user balance
  const updateBalance = async (contract, account) => {
    if (contract && account) {
      const balance = await contract.balanceOf(account);
      setBalance(ethers.utils.formatEther(balance));
    }
  };
  
  // Check user roles
  const checkRoles = async (contract, account) => {
    try {
      const MINTER_ROLE = await contract.MINTER_ROLE();
      const BURNER_ROLE = await contract.BURNER_ROLE();
      const UPGRADER_ROLE = await contract.UPGRADER_ROLE();
      const ADMIN_ROLE = await contract.DEFAULT_ADMIN_ROLE();
      
      const isMinter = await contract.hasRole(MINTER_ROLE, account);
      const isBurner = await contract.hasRole(BURNER_ROLE, account);
      const isUpgrader = await contract.hasRole(UPGRADER_ROLE, account);
      const isAdmin = await contract.hasRole(ADMIN_ROLE, account);
      
      setRoles({ isMinter, isBurner, isAdmin, isUpgrader });
    } catch (error) {
      console.error("Error checking roles:", error);
    }
  };
  
  // Mint tokens
  const mintTokens = async () => {
    if (!roles.isMinter) {
      alert("You don't have minter role");
      return;
    }
    
    if (!ethers.utils.isAddress(mintRecipient)) {
      alert("Invalid recipient address");
      return;
    }
    
    try {
      setLoading(true);
      const tx = await contract.mint(
        mintRecipient, 
        ethers.utils.parseEther(mintAmount)
      );
      await tx.wait();
      alert(`Successfully minted ${mintAmount} tokens to ${mintRecipient}`);
      setMintAmount('');
      setMintRecipient('');
      updateBalance(contract, account);
    } catch (error) {
      console.error("Error minting tokens:", error);
      alert(`Error minting tokens: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Transfer tokens
  const transferTokens = async () => {
    if (!ethers.utils.isAddress(transferRecipient)) {
      alert("Invalid recipient address");
      return;
    }
    
    try {
      setLoading(true);
      const tx = await contract.transfer(
        transferRecipient,
        ethers.utils.parseEther(transferAmount)
      );
      await tx.wait();
      alert(`Successfully transferred ${transferAmount} tokens to ${transferRecipient}`);
      setTransferAmount('');
      setTransferRecipient('');
      updateBalance(contract, account);
      
      // Add to recipients list if not already there
      if (!recipients.includes(transferRecipient.toLowerCase())) {
        setRecipients([...recipients, transferRecipient.toLowerCase()]);
      }
    } catch (error) {
      console.error("Error transferring tokens:", error);
      alert(`Error transferring tokens: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="App">
      <header className="App-header">
        <h1>Modular Token Dashboard</h1>
        <p>Connected Account: {account ? `${account.substring(0, 6)}...${account.substring(account.length - 4)}` : 'Not connected'}</p>
        <p>Balance: {balance} MTK</p>
        
        <div className="role-badges">
          {roles.isAdmin && <span className="role admin">Admin</span>}
          {roles.isMinter && <span className="role minter">Minter</span>}
          {roles.isBurner && <span className="role burner">Burner</span>}
          {roles.isUpgrader && <span className="role upgrader">Upgrader</span>}
        </div>
      </header>
      
      <main>
        <div className="card">
          <h2>Transfer Tokens</h2>
          <div className="form-group">
            <label>Recipient:</label>
            <input 
              type="text" 
              value={transferRecipient} 
              onChange={(e) => setTransferRecipient(e.target.value)}
              placeholder="0x..."
            />
          </div>
          <div className="form-group">
            <label>Amount:</label>
            <input 
              type="number" 
              value={transferAmount} 
              onChange={(e) => setTransferAmount(e.target.value)}
              placeholder="Amount in MTK"
              min="0"
              step="0.01"
            />
          </div>
          <button 
            onClick={transferTokens} 
            disabled={loading || !transferAmount || !transferRecipient}
          >
            {loading ? 'Processing...' : 'Transfer'}
          </button>
        </div>
        
        {roles.isMinter && (
          <div className="card">
            <h2>Mint Tokens</h2>
            <div className="form-group">
              <label>Recipient:</label>
              <input 
                type="text" 
                value={mintRecipient} 
                onChange={(e) => setMintRecipient(e.target.value)}
                placeholder="0x..."
              />
            </div>
            <div className="form-group">
              <label>Amount:</label>
              <input 
                type="number" 
                value={mintAmount} 
                onChange={(e) => setMintAmount(e.target.value)}
                placeholder="Amount in MTK"
                min="0"
                step="0.01"
              />
            </div>
            <button 
              onClick={mintTokens} 
              disabled={loading || !mintAmount || !mintRecipient}
            >
              {loading ? 'Processing...' : 'Mint'}
            </button>
          </div>
        )}
        
        {recipients.length > 0 && (
          <div className="card">
            <h2>Recent Recipients</h2>
            <ul className="recipients-list">
              {recipients.map((recipient, index) => (
                <li key={index}>
                  {recipient.substring(0, 6)}...{recipient.substring(recipient.length - 4)}
                  <button 
                    className="reuse-address" 
                    onClick={() => setTransferRecipient(recipient)}
                  >
                    Use
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
```

Tambahkan styling dasar di `src/App.css`:

```css
.App {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: sans-serif;
}

.App-header {
  text-align: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.role-badges {
  margin-top: 10px;
}

.role {
  display: inline-block;
  padding: 5px 10px;
  margin: 0 5px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: bold;
}

.admin {
  background-color: #ff5722;
  color: white;
}

.minter {
  background-color: #4caf50;
  color: white;
}

.burner {
  background-color: #f44336;
  color: white;
}

.upgrader {
  background-color: #2196f3;
  color: white;
}

.card {
  background-color: #f8f8f8;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  background-color: #2196f3;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.recipients-list {
  list-style: none;
  padding: 0;
}

.recipients-list li {
  padding: 8px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
}

.reuse-address {
  font-size: 12px;
  padding: 4px 8px;
  background-color: #4caf50;
}
```

## Praktik Terbaik dan Pertimbangan Keamanan

Saat bekerja dengan kontrak ERC dan pola proxy, ada beberapa pertimbangan keamanan penting:

### 1. Keamanan Token ERC-20

- **Reentrancy**: Token ERC-20 standar tidak rentan terhadap serangan reentrancy, tetapi berhati-hatilah saat menambahkan fungsionalitas kustom.
- **Overflow/Underflow**: Gunakan Solidity 0.8.0+ yang sudah termasuk perlindungan overflow/underflow secara otomatis.
- **Front-Running**: Pertimbangkan mekanisme untuk mencegah front-running pada operasi seperti approve/transferFrom.
- **Unlimited Approvals**: Pengguna sering memberi dApp unlimited approval; pastikan dApp Anda tidak menyalahgunakan ini.

### 2. Proxy Pattern Security

- **Storage Collision**: Hindari collision storage antara implementasi proxy dan kontrak.
- **Function Selector Clashing**: UUPS vs Transparent Proxy memiliki pendekatan berbeda untuk menangani hal ini.
- **Initializer vs Constructor**: Jangan lupakan bahwa initializer harus secara eksplisit dipanggil dan tidak otomatis seperti constructor.
- **Upgradeability Risks**: Jika kunci privat admin dikompromikan, kontrak dapat diganti dengan implementasi berbahaya; pertimbangkan timelock dan multi-sig.
- **Impermanent Storage**: Kontrak implementasi tidak boleh menggunakan penyimpanan pada slotnya sendiri karena penyimpanan terjadi pada proxy.

### 3. Role-Based Access Control (RBAC)

- **Single Admin Risk**: Jangan hanya mengandalkan satu alamat admin; gunakan solusi multi-signature.
- **Role Granularity**: Desain peran dengan prinsip hak istimewa paling rendah (least privilege).
- **Timelock**: Tambahkan timelock untuk operasi sensitif seperti memberikan/mencabut peran admin.
- **Role Hierarchy**: Buat hirarki peran yang jelas dengan tanggung jawab yang didefinisikan dengan baik.
- **Monitoring & Alerts**: Bangun sistem untuk memantau perubahan peran dan izin.

## Studi Kasus: Insiden Keamanan dan Pelajaran

### 1. Parity Multi-Sig Wallet (2017)

**Masalah**: Library kontrak yang digunakan oleh dompet Parity multi-sig dihapus oleh pengguna yang tidak sengaja.

**Pelajaran**:
- Hindari delegating logic ke kontrak eksternal
- Uji secara menyeluruh semua skenario edge case
- Pertimbangkan immutability sebagai keamanan

### 2. dForce Lending Protocol (2020)

**Masalah**: Protocol ini tidak menangani token non-standar ERC-20 dengan benar, menyebabkan exploit reentrancy melalui token imBTC.

**Pelajaran**:
- Verifikasi kepatuhan token terhadap standar
- Gunakan pattern Checks-Effects-Interactions
- Uji dengan token yang diketahui tidak standar

### 3. Wormhole Bridge (2022)

**Masalah**: Signature verification bypass karena versi yang tidak diinisialisasi dengan benar.

**Pelajaran**:
- Perhatikan secara khusus pada inicializer pattern
- Uji secara menyeluruh fungsi yang berhubungan dengan update
- Double-check validasi tanda tangan dan keamanan

## Pola Modular Lanjutan

### 1. Diamond Pattern (ERC-2535)

Diamond Pattern adalah pendekatan untuk membangun kontrak modular dengan beberapa facet (kontrak implementasi).

**Keunggulan**:
- Mengatasi batas ukuran kontrak (24KB)
- Memungkinkan upgrade selektif (hanya bagian tertentu)
- Organisasi kode yang lebih baik

**Implementasi Dasar**:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/introspection/IERC165.sol";

// Diamond Facet Interface
interface IDiamondCut {
    enum FacetCutAction {Add, Replace, Remove}
    
    struct FacetCut {
        address facetAddress;
        FacetCutAction action;
        bytes4[] functionSelectors;
    }
    
    function diamondCut(FacetCut[] calldata _diamondCut, address _init, bytes calldata _calldata) external;
}

// Main Diamond Contract
contract Diamond {
    // Maps function selectors to the facets that execute the functions
    mapping(bytes4 => address) internal selectorToFacetAndPosition;
    
    // Array of facet addresses
    address[] internal facetAddresses;
    
    // Constructor with initial facets
    constructor(address _diamondCutFacet) {
        // Add DiamondCut facet
        IDiamondCut.FacetCut[] memory cut = new IDiamondCut.FacetCut[](1);
        bytes4[] memory selectors = new bytes4[](1);
        selectors[0] = IDiamondCut.diamondCut.selector;
        cut[0] = IDiamondCut.FacetCut({
            facetAddress: _diamondCutFacet,
            action: IDiamondCut.FacetCutAction.Add,
            functionSelectors: selectors
        });
        
        // Initialize
        IDiamondCut(_diamondCutFacet).diamondCut(cut, address(0), "");
    }
    
    // Fallback function to delegate calls to facets
    fallback() external payable {
        address facet = selectorToFacetAndPosition[msg.sig];
        require(facet != address(0), "Diamond: Function does not exist");
        
        assembly {
            calldatacopy(0, 0, calldatasize())
            let result := delegatecall(gas(), facet, 0, calldatasize(), 0, 0)
            returndatacopy(0, 0, returndatasize())
            switch result
            case 0 { revert(0, returndatasize()) }
            default { return(0, returndatasize()) }
        }
    }
    
    receive() external payable {}
}
```

### 2. Plugin Architecture

Plugin Architecture memungkinkan penambahan fungsionalitas melalui kontrak plugin yang terpisah.

**Implementasi Dasar**:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Plugin Interface
interface IPlugin {
    function execute(bytes calldata _data) external returns (bytes memory);
}

// Plugin Registry
contract PluginRegistry {
    mapping(bytes4 => address) public plugins;
    address public owner;
    
    constructor() {
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    // Register a plugin for a specific function selector
    function registerPlugin(bytes4 _selector, address _plugin) external onlyOwner {
        plugins[_selector] = _plugin;
    }
    
    // Remove a plugin
    function removePlugin(bytes4 _selector) external onlyOwner {
        delete plugins[_selector];
    }
    
    // Execute plugin functionality
    function executePlugin(bytes4 _selector, bytes calldata _data) external returns (bytes memory) {
        address plugin = plugins[_selector];
        require(plugin != address(0), "Plugin not found");
        
        return IPlugin(plugin).execute(_data);
    }
}
```

### 3. Composable Standard Extensions

Gunakan interface standar untuk mengextend kontrak dasar. Ini adalah pendekatan OpenZeppelin:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20SnapshotUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract ComposableToken is 
    Initializable, 
    ERC20Upgradeable, 
    ERC20BurnableUpgradeable,
    ERC20SnapshotUpgradeable,
    AccessControlUpgradeable 
{
    bytes32 public constant SNAPSHOT_ROLE = keccak256("SNAPSHOT_ROLE");
    
    function initialize(string memory name, string memory symbol) public initializer {
        __ERC20_init(name, symbol);
        __ERC20Burnable_init();
        __ERC20Snapshot_init();
        __AccessControl_init();
        
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(SNAPSHOT_ROLE, msg.sender);
    }
    
    function snapshot() public {
        require(hasRole(SNAPSHOT_ROLE, msg.sender), "Must have snapshot role");
        _snapshot();
    }
    
    // Override required functions to resolve inheritance conflicts
    function _beforeTokenTransfer(address from, address to, uint256 amount) internal override(
        ERC20Upgradeable, 
        ERC20SnapshotUpgradeable
    ) {
        super._beforeTokenTransfer(from, to, amount);
    }
}
```

## Advanced Topics

### 1. EIP-2771: Meta Transactions & Gas Abstraction

Meta Transactions memungkinkan transaksi tanpa gas melalui relayer.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/metatx/ERC2771Context.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MetaToken is ERC2771Context, ERC20 {
    constructor(address trustedForwarder) 
        ERC2771Context(trustedForwarder) 
        ERC20("MetaToken", "MTK") 
    {
        _mint(msg.sender, 1000000 * 10**18);
    }
    
    function transfer(address recipient, uint256 amount) public override returns (bool) {
        _transfer(_msgSender(), recipient, amount);
        return true;
    }
    
    function _msgSender() internal view override(Context, ERC2771Context) returns (address) {
        return ERC2771Context._msgSender();
    }
    
    function _msgData() internal view override(Context, ERC2771Context) returns (bytes calldata) {
        return ERC2771Context._msgData();
    }
}
```

### 2. Integrasi ERC-1820: Registry & Interoperabilitas

ERC-1820 memungkinkan discovery feature kontrak:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/introspection/IERC1820Registry.sol";
import "@openzeppelin/contracts/token/ERC777/IERC777Recipient.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract TokenReceiver is IERC777Recipient {
    // ERC1820 Registry
    IERC1820Registry private constant _ERC1820_REGISTRY = 
        IERC1820Registry(0x1820a4B7618BdE71Dce8cdc73aAB6C95905faD24);
        
    // Token Handler interface hash
    bytes32 constant private TOKEN_RECIPIENT_INTERFACE_HASH = 
        keccak256("ERC777TokensRecipient");
    
    constructor() {
        // Register implementer
        _ERC1820_REGISTRY.setInterfaceImplementer(
            address(this), 
            TOKEN_RECIPIENT_INTERFACE_HASH, 
            address(this)
        );
    }
    
    function tokensReceived(
        address operator,
        address from,
        address to,
        uint256 amount,
        bytes calldata userData,
        bytes calldata operatorData
    ) external override {
        // Custom logic when tokens are received
        // ...
    }
}
```

## Kesimpulan

Pada sesi kedua ini, Anda telah:

1. Mempelajari standar token ERC (ERC-20, ERC-721, ERC-1155) dan perbedaan utamanya
2. Memahami pola proxy (UUPS dan Transparent) untuk membuat kontrak yang dapat di-upgrade
3. Menerapkan Role-Based Access Control untuk manajemen izin yang aman
4. Membangun token ERC-20 yang dapat di-upgrade dengan fitur RBAC
5. Mempelajari praktik terbaik keamanan untuk kontrak modular

Konsep modularitas dalam smart contract sangat penting untuk pengembangan yang fleksibel, aman, dan berkelanjutan. Dengan menggunakan standar yang tepat dan pola desain yang terbukti, Anda dapat membuat aplikasi terdesentralisasi yang tangguh dan dapat diperluas.

**Proyek Lanjutan untuk Dikerjakan**:

1. Implementasikan kontrak ERC-1155 yang dapat di-upgrade dengan dukungan metadata
2. Buat sistem distribusi token yang menggunakan meta-transaksi untuk biaya gas nol
3. Implementasikan token ERC-20 dengan fitur pausable, capped, dan voting
4. Bangun kontrak with time-locked governance untuk mengatur upgrade
5. Desain sistem plugin untuk memperluas fungsi token dengan capability baru

**Sumber Daya Tambahan**:

1. [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
2. [EIP-2535 Diamond Standard](https://eips.ethereum.org/EIPS/eip-2535)
3. [UUPS vs Transparent Proxy Pattern](https://docs.openzeppelin.com/upgrades-plugins/1.x/proxies)
4. [ERC Standards](https://eips.ethereum.org/erc)
5. [Solidity Patterns](https://github.com/fravoll/solidity-patterns)

Sekarang Anda memiliki pemahaman yang kuat tentang arsitektur kontrak modular dan standar token, Anda dapat mulai membangun aplikasi Web3 yang lebih kompleks dan fleksibel.