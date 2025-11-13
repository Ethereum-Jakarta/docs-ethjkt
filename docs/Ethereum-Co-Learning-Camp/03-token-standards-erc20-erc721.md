---
id: token-standards-erc20-erc721
title: Token Standards - ERC20 & ERC721
sidebar_position: 3
---

# Token Standards - ERC20 & ERC721

Dalam tutorial ini, kita akan belajar membuat token dengan standar ERC20 (Fungible Token) dan ERC721 (Non-Fungible Token/NFT) dari nol hingga deployment.

---

## Apa itu Token Standards?

**Token Standards** adalah aturan/interface yang harus diikuti agar token dapat bekerja dengan aplikasi lain (wallet, exchange, marketplace).

### Mengapa Penting?

- ✅ **Interoperability** - Token bisa digunakan di semua dApp
- ✅ **Compatibility** - Wallet seperti MetaMask otomatis support
- ✅ **Security** - Standard yang sudah teruji dan aman
- ✅ **Community** - Banyak tools dan library tersedia

### Dua Token Standard Utama

| Standard | Jenis | Contoh | Use Case |
|----------|-------|--------|----------|
| **ERC20** | Fungible | USDT, LINK, UNI | Cryptocurrency, Payment |
| **ERC721** | Non-Fungible | CryptoKitties, Bored Ape | NFT, Gaming, Art |

**Fungible vs Non-Fungible:**
- **Fungible (ERC20)**: Setiap token identik dan bisa ditukar 1:1
  - Seperti uang: 1 dolar = 1 dolar (tidak ada perbedaan)
- **Non-Fungible (ERC721)**: Setiap token unik dan tidak bisa ditukar 1:1
  - Seperti kartu Pokemon: setiap kartu berbeda nilai dan kelangkaan

---

## Setup Awal

### Prerequisites

Pastikan Anda sudah:
- ✅ Menguasai Solidity Basic (Sesi 1)
- ✅ Install Hardhat (Sesi 2)
- ✅ Punya MetaMask dengan Sepolia testnet ETH

### Pilihan Development Environment

**Opsi 1: Remix (Untuk Belajar Cepat)**
- Buka [https://remix.ethereum.org](https://remix.ethereum.org)
- Tidak perlu setup, langsung coding!

**Opsi 2: Hardhat (Untuk Professional)**
- Sudah setup di Sesi 2
- Buat folder baru untuk project token

```bash
mkdir token-workshop
cd token-workshop
npm init -y
npm install --save-dev hardhat
npx hardhat init
```

:::tip Rekomendasi
Gunakan **Remix** untuk belajar konsep dengan cepat, lalu pindah ke **Hardhat** untuk project serius.
:::

---

## Part 1: ERC20 - Fungible Token

### Apa itu ERC20?

**ERC20** adalah standar untuk membuat token yang dapat dipertukarkan (fungible). Setiap token memiliki nilai yang sama.

**Contoh Real-World:**
- USDT (Tether) - Stablecoin
- LINK (Chainlink) - Oracle token
- UNI (Uniswap) - Governance token

### ERC20 Interface

Setiap ERC20 token HARUS punya fungsi-fungsi ini:

```solidity
interface IERC20 {
    // Total supply token
    function totalSupply() external view returns (uint256);

    // Balance dari address
    function balanceOf(address account) external view returns (uint256);

    // Transfer token
    function transfer(address to, uint256 amount) external returns (bool);

    // Approve spending
    function approve(address spender, uint256 amount) external returns (bool);

    // Check allowance
    function allowance(address owner, address spender) external view returns (uint256);

    // Transfer from (by approved spender)
    function transferFrom(address from, address to, uint256 amount) external returns (bool);

    // Events
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}
```

---

## 1.1 Build Your First ERC20 Token

Mari kita buat token ERC20 dari nol, step-by-step!

### Unit 1: Setup Contract

**Buat file `FungibleToken.sol`:**

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

/**
 * @title FungibleToken
 * @dev ERC20 Token implementation from scratch
 */
contract FungibleToken {
    // Token metadata
    string public name;
    string public symbol;
    uint8 public decimals;

    constructor() {
        name = "My First Token";
        symbol = "MFT";
        decimals = 18;
    }
}
```

**Penjelasan:**
- `name` - Nama lengkap token (contoh: "Ethereum", "Tether")
- `symbol` - Singkatan (contoh: "ETH", "USDT")
- `decimals` - Jumlah desimal (18 adalah standar untuk ERC20)
  - Dengan decimals=18, 1 token = 1,000,000,000,000,000,000 (10^18) unit terkecil
  - Seperti 1 ETH = 10^18 wei

**Test:**
1. Deploy di Remix
2. Klik `name` → Lihat "My First Token"
3. Klik `symbol` → Lihat "MFT"
4. Klik `decimals` → Lihat 18

---

### Unit 2: Define Key Variables

**Tambahkan state variables untuk tracking balances:**

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract FungibleToken {
    string public name;
    string public symbol;
    uint8 public decimals;

    // Total supply token yang ada
    uint256 public totalSupply;

    // Mapping address -> balance
    mapping(address => uint256) public balanceOf;

    // Mapping owner -> spender -> amount
    // Untuk approve mechanism
    mapping(address => mapping(address => uint256)) public allowance;

    constructor() {
        name = "My First Token";
        symbol = "MFT";
        decimals = 18;
    }
}
```

**Penjelasan:**
- `totalSupply` - Total semua token yang beredar
- `balanceOf[address]` - Saldo token dari address tertentu
- `allowance[owner][spender]` - Berapa banyak token yang diizinkan spender untuk digunakan

**Konsep Allowance:**
```
Alice punya 100 token
Alice approve Bob untuk spend 50 token
allowance[Alice][Bob] = 50
Bob sekarang bisa transferFrom Alice hingga 50 token
```

---

### Unit 3: Mint - Section 1 (Events & Basic Mint)

**Tambahkan events dan fungsi mint:**

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract FungibleToken {
    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    // Events (wajib untuk ERC20!)
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    constructor() {
        name = "My First Token";
        symbol = "MFT";
        decimals = 18;
    }

    /**
     * @dev Mint new tokens
     * @param _to Address yang menerima token
     * @param _amount Jumlah token (dalam wei)
     */
    function mint(address _to, uint256 _amount) public {
        // Validasi input
        require(_to != address(0), "Mint to zero address");
        require(_amount > 0, "Amount must be greater than 0");

        // Update state
        totalSupply += _amount;
        balanceOf[_to] += _amount;

        // Emit event
        emit Transfer(address(0), _to, _amount);
    }
}
```

**Penjelasan:**
- `event Transfer` - Wajib di-emit setiap ada transfer (termasuk mint)
- `event Approval` - Wajib di-emit setiap ada approval
- `indexed` - Membuat parameter searchable di blockchain
- `mint(address(0), _to, _amount)` - Mint = transfer dari address(0)
- `address(0)` = 0x0000...0000 (alamat nol, simbol "create from nothing")

**Test:**
1. Deploy contract
2. Ketik alamat Anda dan amount: 1000000000000000000 (= 1 token dengan 18 decimals)
3. Klik `mint`
4. Klik `totalSupply` → Lihat 1000000000000000000
5. Klik `balanceOf` dengan alamat Anda → Lihat 1000000000000000000

**Tips Decimals:**
- 1 token = 1 * 10^18 = 1,000,000,000,000,000,000
- 10 token = 10 * 10^18 = 10,000,000,000,000,000,000
- Gunakan calculator atau tool seperti [eth-converter.com](https://eth-converter.com)

---

### Unit 4: Mint - Section 2 (Access Control)

**Tambahkan access control agar hanya owner yang bisa mint:**

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract FungibleToken {
    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public totalSupply;

    address public owner;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    // Modifier untuk restrict ke owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }

    constructor() {
        name = "My First Token";
        symbol = "MFT";
        decimals = 18;
        owner = msg.sender;

        // Mint initial supply ke owner
        _mint(msg.sender, 1000000 * 10**decimals); // 1 juta token
    }

    /**
     * @dev Internal mint function
     */
    function _mint(address _to, uint256 _amount) internal {
        require(_to != address(0), "Mint to zero address");

        totalSupply += _amount;
        balanceOf[_to] += _amount;

        emit Transfer(address(0), _to, _amount);
    }

    /**
     * @dev Public mint (only owner)
     */
    function mint(address _to, uint256 _amount) public onlyOwner {
        require(_amount > 0, "Amount must be greater than 0");
        _mint(_to, _amount);
    }
}
```

**Penjelasan:**
- `owner` - Address yang deploy contract
- `onlyOwner` - Modifier yang restrict fungsi hanya untuk owner
- `_mint()` - Internal function (hanya bisa dipanggil dari dalam contract)
- `1000000 * 10**decimals` - Cara mudah hitung 1 juta token dengan decimals
- Constructor sekarang auto-mint 1 juta token ke owner saat deploy

**Test:**
1. Deploy → Auto mint 1 juta token ke Anda
2. Klik `totalSupply` → Lihat 1000000000000000000000000 (1 juta * 10^18)
3. Klik `balanceOf` dengan address Anda → Sama
4. Ganti account di MetaMask
5. Coba `mint` → GAGAL "Only owner can call this"
6. Kembali ke owner account → `mint` BERHASIL

---

### Unit 5: Implement balanceOf (Complete)

**balanceOf sudah jadi karena kita pakai public mapping!**

```solidity
mapping(address => uint256) public balanceOf;
```

Ketika mapping adalah `public`, Solidity otomatis membuat getter function:

```solidity
// Solidity auto-generate ini untuk kita:
function balanceOf(address account) public view returns (uint256) {
    return balanceOf[account];
}
```

**Untuk compliance penuh dengan ERC20, kita bisa explicit:**

```solidity
/**
 * @dev Returns the balance of account
 */
function balanceOf(address _account) public view returns (uint256) {
    return balanceOf[_account];
}
```

Tapi ini akan conflict dengan mapping yang sudah public. Solusinya:
- Biarkan mapping `public` seperti sekarang (ini sudah ERC20 compliant)
- Atau ubah mapping jadi `private` dan buat function sendiri

**Best Practice:**
- Untuk token ERC20, `public mapping` sudah cukup dan lebih gas-efficient

---

### Unit 6: Transfer - Section 1

**Implement fungsi transfer:**

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract FungibleToken {
    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public totalSupply;
    address public owner;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }

    constructor() {
        name = "My First Token";
        symbol = "MFT";
        decimals = 18;
        owner = msg.sender;

        _mint(msg.sender, 1000000 * 10**decimals);
    }

    function _mint(address _to, uint256 _amount) internal {
        require(_to != address(0), "Mint to zero address");
        totalSupply += _amount;
        balanceOf[_to] += _amount;
        emit Transfer(address(0), _to, _amount);
    }

    function mint(address _to, uint256 _amount) public onlyOwner {
        require(_amount > 0, "Amount must be greater than 0");
        _mint(_to, _amount);
    }

    /**
     * @dev Transfer tokens from sender to recipient
     * @param _to Recipient address
     * @param _amount Amount to transfer
     * @return success Boolean indicating success
     */
    function transfer(address _to, uint256 _amount) public returns (bool) {
        // Validasi
        require(_to != address(0), "Transfer to zero address");
        require(balanceOf[msg.sender] >= _amount, "Insufficient balance");

        // Update balances
        balanceOf[msg.sender] -= _amount;
        balanceOf[_to] += _amount;

        // Emit event
        emit Transfer(msg.sender, _to, _amount);

        return true;
    }
}
```

**Penjelasan:**
- `transfer(to, amount)` - Mengirim token dari caller ke recipient
- `msg.sender` - Address yang memanggil fungsi (pengirim)
- `require(balanceOf[msg.sender] >= _amount)` - Cek apakah sender punya cukup token
- `balanceOf[msg.sender] -= _amount` - Kurangi balance sender
- `balanceOf[_to] += _amount` - Tambah balance recipient
- `return true` - ERC20 standard require return boolean

**Test:**
1. Deploy (Anda dapat 1 juta token)
2. Copy address MetaMask account lain (Account 2)
3. Ketik address dan amount: 1000000000000000000 (= 1 token)
4. Klik `transfer`
5. Ganti ke Account 2 di MetaMask
6. Klik `balanceOf` dengan address Account 2 → Lihat 1 token!
7. Check balance account owner → Berkurang 1 token

---

### Unit 7: Transfer - Section 2 (Approve & TransferFrom)

**Implement approve dan transferFrom untuk delegated transfer:**

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract FungibleToken {
    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public totalSupply;
    address public owner;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }

    constructor() {
        name = "My First Token";
        symbol = "MFT";
        decimals = 18;
        owner = msg.sender;
        _mint(msg.sender, 1000000 * 10**decimals);
    }

    function _mint(address _to, uint256 _amount) internal {
        require(_to != address(0), "Mint to zero address");
        totalSupply += _amount;
        balanceOf[_to] += _amount;
        emit Transfer(address(0), _to, _amount);
    }

    function mint(address _to, uint256 _amount) public onlyOwner {
        require(_amount > 0, "Amount must be greater than 0");
        _mint(_to, _amount);
    }

    function transfer(address _to, uint256 _amount) public returns (bool) {
        require(_to != address(0), "Transfer to zero address");
        require(balanceOf[msg.sender] >= _amount, "Insufficient balance");

        balanceOf[msg.sender] -= _amount;
        balanceOf[_to] += _amount;

        emit Transfer(msg.sender, _to, _amount);
        return true;
    }

    /**
     * @dev Approve spender to use your tokens
     * @param _spender Address allowed to spend
     * @param _amount Amount allowed to spend
     * @return success Boolean indicating success
     */
    function approve(address _spender, uint256 _amount) public returns (bool) {
        require(_spender != address(0), "Approve to zero address");

        // Set allowance
        allowance[msg.sender][_spender] = _amount;

        // Emit event
        emit Approval(msg.sender, _spender, _amount);

        return true;
    }

    /**
     * @dev Transfer tokens on behalf of owner (if approved)
     * @param _from Owner address
     * @param _to Recipient address
     * @param _amount Amount to transfer
     * @return success Boolean indicating success
     */
    function transferFrom(address _from, address _to, uint256 _amount) public returns (bool) {
        require(_from != address(0), "Transfer from zero address");
        require(_to != address(0), "Transfer to zero address");
        require(balanceOf[_from] >= _amount, "Insufficient balance");
        require(allowance[_from][msg.sender] >= _amount, "Insufficient allowance");

        // Update balances
        balanceOf[_from] -= _amount;
        balanceOf[_to] += _amount;

        // Update allowance
        allowance[_from][msg.sender] -= _amount;

        // Emit event
        emit Transfer(_from, _to, _amount);

        return true;
    }
}
```

**Penjelasan Approve Mechanism:**

**Use Case:** DEX seperti Uniswap perlu transfer token Anda untuk swap.

**Flow:**
1. Alice punya 100 MFT token
2. Alice call `approve(UniswapContract, 50 * 10^18)`
3. Sekarang `allowance[Alice][Uniswap] = 50 * 10^18`
4. Uniswap bisa call `transferFrom(Alice, Bob, 30 * 10^18)`
5. Token Alice berkurang 30, Bob bertambah 30
6. Allowance tersisa: 20 token

**Test Approve & TransferFrom:**

**Setup (dengan 3 accounts):**
- Account A (Owner) - punya 1 juta token
- Account B (Spender) - akan di-approve
- Account C (Recipient) - akan menerima token

**Test Steps:**
1. Deploy dengan Account A
2. Ganti ke Account A → Copy address Account B
3. Ketik address B dan amount: 100000000000000000000 (= 100 token)
4. Klik `approve` → Account B sekarang bisa spend 100 token milik A
5. Check `allowance` dengan address A dan address B → Lihat 100 token
6. Ganti ke Account B
7. Copy address Account C
8. Ketik address A (from), address C (to), 50000000000000000000 (50 token)
9. Klik `transferFrom` → Account B transfer 50 token dari A ke C
10. Check:
    - `balanceOf[A]` → Berkurang 50
    - `balanceOf[C]` → Bertambah 50
    - `allowance[A][B]` → Tersisa 50 token

**Kenapa Approve Diperlukan?**
- Smart contract tidak bisa langsung ambil token Anda
- Anda harus explicit approve dulu (security!)
- Ini standard pattern untuk DEX, lending, staking, dll

---

### 🎉 ERC20 Complete!

**Contract FungibleToken sekarang punya:**
- ✅ name, symbol, decimals
- ✅ totalSupply
- ✅ balanceOf
- ✅ transfer
- ✅ approve
- ✅ allowance
- ✅ transferFrom
- ✅ Events (Transfer, Approval)
- ✅ Access control (onlyOwner)

**Ini adalah ERC20 token yang full compliant!** 🚀

---

## Part 2: ERC721 - Non-Fungible Token (NFT)

### Apa itu ERC721?

**ERC721** adalah standar untuk membuat token yang UNIK (non-fungible). Setiap token berbeda dan punya ID sendiri.

**Contoh Real-World:**
- CryptoKitties - Koleksi kucing digital
- Bored Ape Yacht Club - Gambar monyet
- ENS Domains - Nama domain .eth

### ERC721 vs ERC20

| Aspek | ERC20 | ERC721 |
|-------|-------|--------|
| Fungibility | Fungible (sama semua) | Non-fungible (unik) |
| ID | Tidak ada | Setiap token punya tokenId |
| Balance | uint256 (amount) | Daftar tokenId yang dimiliki |
| Transfer | transfer(to, amount) | transferFrom(from, to, tokenId) |
| Use Case | Currency, points | Art, collectibles, gaming |

### ERC721 Interface

```solidity
interface IERC721 {
    // Balance = jumlah NFT yang dimiliki
    function balanceOf(address owner) external view returns (uint256);

    // Siapa owner dari tokenId ini?
    function ownerOf(uint256 tokenId) external view returns (address);

    // Transfer NFT
    function transferFrom(address from, address to, uint256 tokenId) external;

    // Approve specific token
    function approve(address to, uint256 tokenId) external;

    // Approve all tokens
    function setApprovalForAll(address operator, bool approved) external;

    // Check approval
    function getApproved(uint256 tokenId) external view returns (address);
    function isApprovedForAll(address owner, address operator) external view returns (bool);

    // Events
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);
    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);
}
```

---

## 2.1 Build CryptoKitty NFT

Mari kita buat NFT CryptoKitty dengan breeding mechanism!

### Unit 1: Define the Contract

**Buat file `CryptoKitty.sol`:**

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

/**
 * @title CryptoKitty
 * @dev ERC721 NFT dengan breeding mechanism
 */
contract CryptoKitty {
    // Token metadata
    string public name;
    string public symbol;

    // Struct untuk Kitty
    struct Kitty {
        uint256 genes;        // DNA kucing (unique identifier)
        uint64 birthTime;     // Kapan lahir
        uint32 momId;         // ID ibu (0 jika gen-0)
        uint32 dadId;         // ID ayah (0 jika gen-0)
        uint16 generation;    // Generasi ke berapa
    }

    // Array semua kitties
    Kitty[] public kitties;

    // Owner
    address public owner;

    // Mapping tokenId => owner
    mapping(uint256 => address) public kittyToOwner;

    // Mapping owner => jumlah kitty
    mapping(address => uint256) public ownerKittyCount;

    constructor() {
        name = "CryptoKitty";
        symbol = "CK";
        owner = msg.sender;
    }
}
```

**Penjelasan:**
- `struct Kitty` - Data struktur untuk setiap kucing
- `genes` - DNA/genetik kucing (number besar yang unique)
- `birthTime` - Timestamp lahir (untuk age tracking)
- `momId` & `dadId` - Parent IDs (untuk breeding history)
- `generation` - Gen-0 (lahir dari contract), Gen-1 (hasil breeding gen-0), dst
- `kitties[]` - Array semua kucing yang pernah dibuat
- `kittyToOwner` - Map tokenId ke pemiliknya
- `ownerKittyCount` - Jumlah kucing yang dimiliki address

**Perbedaan dengan ERC20:**
- ERC20: `mapping(address => uint256) balanceOf` (hanya simpan amount)
- ERC721: `mapping(uint256 => address) tokenToOwner` (simpan siapa owner dari token ID)

---

### Unit 2: Minting a Kitty - Section 1

**Implement fungsi create kitty:**

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract CryptoKitty {
    string public name;
    string public symbol;
    address public owner;

    struct Kitty {
        uint256 genes;
        uint64 birthTime;
        uint32 momId;
        uint32 dadId;
        uint16 generation;
    }

    Kitty[] public kitties;

    mapping(uint256 => address) public kittyToOwner;
    mapping(address => uint256) public ownerKittyCount;

    // Events
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event Birth(address owner, uint256 kittyId, uint256 momId, uint256 dadId, uint256 genes);

    constructor() {
        name = "CryptoKitty";
        symbol = "CK";
        owner = msg.sender;
    }

    /**
     * @dev Internal function to create kitty
     */
    function _createKitty(
        uint256 _momId,
        uint256 _dadId,
        uint256 _generation,
        uint256 _genes,
        address _owner
    ) internal returns (uint256) {
        require(_owner != address(0), "Owner cannot be zero address");

        // Create new kitty
        Kitty memory newKitty = Kitty({
            genes: _genes,
            birthTime: uint64(block.timestamp),
            momId: uint32(_momId),
            dadId: uint32(_dadId),
            generation: uint16(_generation)
        });

        // Push to array
        kitties.push(newKitty);

        // Get tokenId (index in array)
        uint256 newKittyId = kitties.length - 1;

        // Assign ownership
        kittyToOwner[newKittyId] = _owner;
        ownerKittyCount[_owner]++;

        // Emit events
        emit Birth(_owner, newKittyId, _momId, _dadId, _genes);
        emit Transfer(address(0), _owner, newKittyId);

        return newKittyId;
    }
}
```

**Penjelasan:**
- `_createKitty()` - Internal function untuk create kitty
- `Kitty memory newKitty` - Create struct di memory (temporary)
- `kitties.push(newKitty)` - Simpan ke array permanent
- `kitties.length - 1` - Index terakhir = tokenId
- `kittyToOwner[newKittyId] = _owner` - Set ownership
- `ownerKittyCount[_owner]++` - Increment jumlah NFT owner
- `emit Birth(...)` - Event khusus untuk lahir kucing
- `emit Transfer(address(0), _owner, tokenId)` - Standard ERC721 event untuk mint

**Token ID di ERC721:**
- Token ID = index di array
- Kitty pertama = tokenId 0
- Kitty kedua = tokenId 1
- Dst...

---

### Unit 3: Minting a Kitty - Section 2

**Implement random genes generator:**

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract CryptoKitty {
    string public name;
    string public symbol;
    address public owner;

    struct Kitty {
        uint256 genes;
        uint64 birthTime;
        uint32 momId;
        uint32 dadId;
        uint16 generation;
    }

    Kitty[] public kitties;

    mapping(uint256 => address) public kittyToOwner;
    mapping(address => uint256) public ownerKittyCount;

    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event Birth(address owner, uint256 kittyId, uint256 momId, uint256 dadId, uint256 genes);

    constructor() {
        name = "CryptoKitty";
        symbol = "CK";
        owner = msg.sender;
    }

    function _createKitty(
        uint256 _momId,
        uint256 _dadId,
        uint256 _generation,
        uint256 _genes,
        address _owner
    ) internal returns (uint256) {
        require(_owner != address(0), "Owner cannot be zero address");

        Kitty memory newKitty = Kitty({
            genes: _genes,
            birthTime: uint64(block.timestamp),
            momId: uint32(_momId),
            dadId: uint32(_dadId),
            generation: uint16(_generation)
        });

        kitties.push(newKitty);
        uint256 newKittyId = kitties.length - 1;

        kittyToOwner[newKittyId] = _owner;
        ownerKittyCount[_owner]++;

        emit Birth(_owner, newKittyId, _momId, _dadId, _genes);
        emit Transfer(address(0), _owner, newKittyId);

        return newKittyId;
    }

    /**
     * @dev Generate random genes
     * WARNING: Ini tidak truly random! Hanya untuk demo.
     * Production harus pakai Chainlink VRF atau oracle lain.
     */
    function _generateRandomGenes() internal view returns (uint256) {
        // Combine multiple sources untuk "randomness"
        uint256 randomHash = uint256(
            keccak256(
                abi.encodePacked(
                    block.timestamp,
                    block.prevrandao,  // Hardhat 3 compatible (dulu: block.difficulty)
                    msg.sender,
                    kitties.length
                )
            )
        );

        return randomHash;
    }
}
```

**Penjelasan Random Generation:**
- `keccak256()` - Hash function (SHA3)
- `abi.encodePacked()` - Gabungkan multiple values jadi bytes
- `block.timestamp` - Waktu block
- `block.prevrandao` - Pseudo-random dari validator (Hardhat 3 compatible)
- `msg.sender` - Address caller
- `kitties.length` - Jumlah kucing

**⚠️ WARNING - Randomness di Blockchain:**
```
Ini BUKAN truly random!
- Miner/validator bisa manipulasi
- Predictable jika tau input
- JANGAN pakai untuk production yang high-value

Solusi Production:
- Chainlink VRF (Verifiable Random Function)
- Oracle services
- Commit-reveal schemes
```

**Untuk belajar dan testing, ini cukup!**

---

### Unit 4: Create Gen-0 CryptoKitties

**Implement public function untuk mint gen-0:**

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract CryptoKitty {
    string public name;
    string public symbol;
    address public owner;

    struct Kitty {
        uint256 genes;
        uint64 birthTime;
        uint32 momId;
        uint32 dadId;
        uint16 generation;
    }

    Kitty[] public kitties;

    mapping(uint256 => address) public kittyToOwner;
    mapping(address => uint256) public ownerKittyCount;

    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event Birth(address owner, uint256 kittyId, uint256 momId, uint256 dadId, uint256 genes);

    // Limit gen-0 kitties
    uint256 public constant GEN0_LIMIT = 1000;
    uint256 public gen0Counter;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    constructor() {
        name = "CryptoKitty";
        symbol = "CK";
        owner = msg.sender;
    }

    function _createKitty(
        uint256 _momId,
        uint256 _dadId,
        uint256 _generation,
        uint256 _genes,
        address _owner
    ) internal returns (uint256) {
        require(_owner != address(0), "Owner cannot be zero address");

        Kitty memory newKitty = Kitty({
            genes: _genes,
            birthTime: uint64(block.timestamp),
            momId: uint32(_momId),
            dadId: uint32(_dadId),
            generation: uint16(_generation)
        });

        kitties.push(newKitty);
        uint256 newKittyId = kitties.length - 1;

        kittyToOwner[newKittyId] = _owner;
        ownerKittyCount[_owner]++;

        emit Birth(_owner, newKittyId, _momId, _dadId, _genes);
        emit Transfer(address(0), _owner, newKittyId);

        return newKittyId;
    }

    function _generateRandomGenes() internal view returns (uint256) {
        uint256 randomHash = uint256(
            keccak256(
                abi.encodePacked(
                    block.timestamp,
                    block.prevrandao,
                    msg.sender,
                    kitties.length
                )
            )
        );
        return randomHash;
    }

    /**
     * @dev Create gen-0 kitty (only owner)
     */
    function createGen0Kitty() public onlyOwner returns (uint256) {
        require(gen0Counter < GEN0_LIMIT, "Gen-0 limit reached");

        gen0Counter++;
        uint256 genes = _generateRandomGenes();

        return _createKitty(0, 0, 0, genes, msg.sender);
    }

    /**
     * @dev Get total kitties
     */
    function getTotalKitties() public view returns (uint256) {
        return kitties.length;
    }

    /**
     * @dev Get kitty by ID
     */
    function getKitty(uint256 _id) public view returns (
        uint256 genes,
        uint64 birthTime,
        uint32 momId,
        uint32 dadId,
        uint16 generation
    ) {
        require(_id < kitties.length, "Kitty does not exist");

        Kitty memory kitty = kitties[_id];

        return (
            kitty.genes,
            kitty.birthTime,
            kitty.momId,
            kitty.dadId,
            kitty.generation
        );
    }
}
```

**Penjelasan:**
- `GEN0_LIMIT = 1000` - Hanya 1000 gen-0 yang bisa dibuat (scarcity!)
- `gen0Counter` - Track berapa banyak gen-0 yang sudah dibuat
- `createGen0Kitty()` - Only owner bisa create gen-0
- Gen-0 parameters:
  - `momId = 0` (tidak ada ibu)
  - `dadId = 0` (tidak ada ayah)
  - `generation = 0` (generasi pertama)
- `getTotalKitties()` - Helper untuk get total
- `getKitty()` - Get kitty data by ID

**Test:**
1. Deploy contract
2. Klik `createGen0Kitty` → Mint kitty pertama (tokenId = 0)
3. Klik `gen0Counter` → Lihat 1
4. Klik `getTotalKitties` → Lihat 1
5. Ketik 0 di `getKitty` → Lihat data kitty:
   - genes: angka besar random
   - birthTime: timestamp sekarang
   - momId: 0
   - dadId: 0
   - generation: 0
6. Klik `ownerKittyCount` dengan address Anda → Lihat 1
7. Ketik 0 di `kittyToOwner` → Lihat address Anda

---

### Unit 5: Breeding - Section 1

**Implement breeding logic:**

```solidity
// (... kode sebelumnya sama ...)

contract CryptoKitty {
    // ... (semua state variables dan functions sebelumnya)

    /**
     * @dev Mix genes dari mom dan dad
     */
    function _mixGenes(uint256 _momGenes, uint256 _dadGenes) internal view returns (uint256) {
        // Simplified gene mixing
        // Real CryptoKitties punya algorithm kompleks!

        uint256 firstHalf = _momGenes / 2;
        uint256 secondHalf = _dadGenes / 2;
        uint256 randomFactor = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender)));

        return firstHalf + secondHalf + (randomFactor % 100000);
    }

    /**
     * @dev Breed two kitties
     */
    function breed(uint256 _momId, uint256 _dadId) public returns (uint256) {
        // Validasi
        require(_momId < kitties.length, "Mom does not exist");
        require(_dadId < kitties.length, "Dad does not exist");
        require(_momId != _dadId, "Cannot breed with itself");
        require(kittyToOwner[_momId] == msg.sender, "You don't own the mom");
        require(kittyToOwner[_dadId] == msg.sender, "You don't own the dad");

        // Get parents
        Kitty memory mom = kitties[_momId];
        Kitty memory dad = kitties[_dadId];

        // Calculate new generation
        uint256 newGeneration = (mom.generation > dad.generation ? mom.generation : dad.generation) + 1;

        // Mix genes
        uint256 newGenes = _mixGenes(mom.genes, dad.genes);

        // Create baby
        return _createKitty(_momId, _dadId, newGeneration, newGenes, msg.sender);
    }
}
```

**Penjelasan Breeding:**
- `breed(momId, dadId)` - Kawinkan 2 kucing
- Validasi:
  - Kedua parent harus exist
  - Tidak boleh breed dengan diri sendiri
  - Caller harus owner kedua parent
- `_mixGenes()` - Combine DNA dari mom dan dad
- `newGeneration` - Ambil generation tertinggi + 1
  - Gen-0 + Gen-0 = Gen-1
  - Gen-1 + Gen-2 = Gen-3
- Baby lahir dengan:
  - `momId` & `dadId` = parent IDs
  - `genes` = mixed dari parents
  - `generation` = max(parent.generation) + 1
  - `owner` = caller

**Gene Mixing Simplified:**
```
Mom genes: 123456789
Dad genes: 987654321

firstHalf = 123456789 / 2 = 61728394
secondHalf = 987654321 / 2 = 493827160
randomFactor = (random % 100000)

newGenes = 61728394 + 493827160 + randomFactor
```

Real CryptoKitties punya algorithm yang lebih kompleks dengan dominant/recessive genes!

---

### Unit 6: Breeding - Section 2 (Complete ERC721)

**Tambahkan ERC721 standard functions:**

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract CryptoKitty {
    string public name;
    string public symbol;
    address public owner;

    struct Kitty {
        uint256 genes;
        uint64 birthTime;
        uint32 momId;
        uint32 dadId;
        uint16 generation;
    }

    Kitty[] public kitties;

    mapping(uint256 => address) public kittyToOwner;
    mapping(address => uint256) public ownerKittyCount;
    mapping(uint256 => address) public kittyApprovals;

    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);
    event Birth(address owner, uint256 kittyId, uint256 momId, uint256 dadId, uint256 genes);

    uint256 public constant GEN0_LIMIT = 1000;
    uint256 public gen0Counter;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    constructor() {
        name = "CryptoKitty";
        symbol = "CK";
        owner = msg.sender;
    }

    // ===== INTERNAL FUNCTIONS =====

    function _createKitty(
        uint256 _momId,
        uint256 _dadId,
        uint256 _generation,
        uint256 _genes,
        address _owner
    ) internal returns (uint256) {
        require(_owner != address(0), "Owner cannot be zero address");

        Kitty memory newKitty = Kitty({
            genes: _genes,
            birthTime: uint64(block.timestamp),
            momId: uint32(_momId),
            dadId: uint32(_dadId),
            generation: uint16(_generation)
        });

        kitties.push(newKitty);
        uint256 newKittyId = kitties.length - 1;

        kittyToOwner[newKittyId] = _owner;
        ownerKittyCount[_owner]++;

        emit Birth(_owner, newKittyId, _momId, _dadId, _genes);
        emit Transfer(address(0), _owner, newKittyId);

        return newKittyId;
    }

    function _generateRandomGenes() internal view returns (uint256) {
        return uint256(
            keccak256(
                abi.encodePacked(
                    block.timestamp,
                    block.prevrandao,
                    msg.sender,
                    kitties.length
                )
            )
        );
    }

    function _mixGenes(uint256 _momGenes, uint256 _dadGenes) internal view returns (uint256) {
        uint256 firstHalf = _momGenes / 2;
        uint256 secondHalf = _dadGenes / 2;
        uint256 randomFactor = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender)));

        return firstHalf + secondHalf + (randomFactor % 100000);
    }

    // ===== GEN-0 FUNCTIONS =====

    function createGen0Kitty() public onlyOwner returns (uint256) {
        require(gen0Counter < GEN0_LIMIT, "Gen-0 limit reached");

        gen0Counter++;
        uint256 genes = _generateRandomGenes();

        return _createKitty(0, 0, 0, genes, msg.sender);
    }

    // ===== BREEDING FUNCTIONS =====

    function breed(uint256 _momId, uint256 _dadId) public returns (uint256) {
        require(_momId < kitties.length, "Mom does not exist");
        require(_dadId < kitties.length, "Dad does not exist");
        require(_momId != _dadId, "Cannot breed with itself");
        require(kittyToOwner[_momId] == msg.sender, "You don't own the mom");
        require(kittyToOwner[_dadId] == msg.sender, "You don't own the dad");

        Kitty memory mom = kitties[_momId];
        Kitty memory dad = kitties[_dadId];

        uint256 newGeneration = (mom.generation > dad.generation ? mom.generation : dad.generation) + 1;
        uint256 newGenes = _mixGenes(mom.genes, dad.genes);

        return _createKitty(_momId, _dadId, newGeneration, newGenes, msg.sender);
    }

    // ===== ERC721 STANDARD FUNCTIONS =====

    /**
     * @dev Returns balance (jumlah NFT yang dimiliki)
     */
    function balanceOf(address _owner) public view returns (uint256) {
        require(_owner != address(0), "Balance query for zero address");
        return ownerKittyCount[_owner];
    }

    /**
     * @dev Returns owner dari tokenId
     */
    function ownerOf(uint256 _tokenId) public view returns (address) {
        require(_tokenId < kitties.length, "Token does not exist");
        address tokenOwner = kittyToOwner[_tokenId];
        require(tokenOwner != address(0), "Token has no owner");
        return tokenOwner;
    }

    /**
     * @dev Approve address untuk transfer specific token
     */
    function approve(address _to, uint256 _tokenId) public {
        require(kittyToOwner[_tokenId] == msg.sender, "Not token owner");

        kittyApprovals[_tokenId] = _to;
        emit Approval(msg.sender, _to, _tokenId);
    }

    /**
     * @dev Get approved address untuk tokenId
     */
    function getApproved(uint256 _tokenId) public view returns (address) {
        require(_tokenId < kitties.length, "Token does not exist");
        return kittyApprovals[_tokenId];
    }

    /**
     * @dev Transfer NFT
     */
    function transferFrom(address _from, address _to, uint256 _tokenId) public {
        require(_tokenId < kitties.length, "Token does not exist");
        require(_to != address(0), "Transfer to zero address");
        require(kittyToOwner[_tokenId] == _from, "From address is not owner");

        // Check authorization
        require(
            msg.sender == _from ||
            msg.sender == kittyApprovals[_tokenId],
            "Not authorized to transfer"
        );

        // Clear approval
        if (kittyApprovals[_tokenId] != address(0)) {
            delete kittyApprovals[_tokenId];
        }

        // Transfer ownership
        ownerKittyCount[_from]--;
        ownerKittyCount[_to]++;
        kittyToOwner[_tokenId] = _to;

        emit Transfer(_from, _to, _tokenId);
    }

    // ===== VIEW FUNCTIONS =====

    function getTotalKitties() public view returns (uint256) {
        return kitties.length;
    }

    function getKitty(uint256 _id) public view returns (
        uint256 genes,
        uint64 birthTime,
        uint32 momId,
        uint32 dadId,
        uint16 generation
    ) {
        require(_id < kitties.length, "Kitty does not exist");

        Kitty memory kitty = kitties[_id];

        return (
            kitty.genes,
            kitty.birthTime,
            kitty.momId,
            kitty.dadId,
            kitty.generation
        );
    }

    /**
     * @dev Get all kitty IDs owned by address
     */
    function getKittiesByOwner(address _owner) public view returns (uint256[] memory) {
        uint256[] memory result = new uint256[](ownerKittyCount[_owner]);
        uint256 counter = 0;

        for (uint256 i = 0; i < kitties.length; i++) {
            if (kittyToOwner[i] == _owner) {
                result[counter] = i;
                counter++;
            }
        }

        return result;
    }
}
```

**Penjelasan ERC721 Functions:**

**1. balanceOf(address)**
- Return jumlah NFT yang dimiliki address
- Beda dengan ERC20 (amount), ini hanya count

**2. ownerOf(tokenId)**
- Return siapa owner dari NFT dengan ID tertentu
- Tidak ada di ERC20!

**3. approve(to, tokenId)**
- Approve specific NFT untuk di-transfer orang lain
- Beda dengan ERC20 (approve amount), ini per tokenId

**4. transferFrom(from, to, tokenId)**
- Transfer specific NFT
- Harus owner atau approved
- Clear approval setelah transfer

**5. getKittiesByOwner(address)**
- Helper function untuk get semua kitty IDs milik address
- Loop through array dan filter by owner
- Return array of tokenIds

---

### 🎉 ERC721 Complete!

**Contract CryptoKitty sekarang punya:**
- ✅ Unique tokens dengan tokenId
- ✅ Gene system (DNA)
- ✅ Generation tracking
- ✅ Parent tracking (momId, dadId)
- ✅ Gen-0 creation (limited supply)
- ✅ Breeding mechanism
- ✅ ERC721 standard functions
- ✅ Events (Transfer, Approval, Birth)

**Ini adalah NFT collection dengan breeding!** 🐱

---

## Deploy & Testing

### Deploy ke Sepolia Testnet

**Menggunakan Hardhat:**

**1. Setup deployment module untuk ERC20:**

```typescript
// ignition/modules/FungibleToken.ts
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const FungibleTokenModule = buildModule("FungibleTokenModule", (m) => {
  const token = m.contract("FungibleToken");
  return { token };
});

export default FungibleTokenModule;
```

**2. Setup deployment module untuk ERC721:**

```typescript
// ignition/modules/CryptoKitty.ts
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const CryptoKittyModule = buildModule("CryptoKittyModule", (m) => {
  const cryptoKitty = m.contract("CryptoKitty");
  return { cryptoKitty };
});

export default CryptoKittyModule;
```

**3. Deploy ERC20:**

```bash
npx hardhat ignition deploy ignition/modules/FungibleToken.ts --network sepolia
```

**4. Deploy ERC721:**

```bash
npx hardhat ignition deploy ignition/modules/CryptoKitty.ts --network sepolia
```

**5. Verify contracts:**

```bash
# Verify ERC20
npx hardhat verify --network sepolia <FungibleToken_Address>

# Verify ERC721
npx hardhat verify --network sepolia <CryptoKitty_Address>
```

---

### Testing di Remix

**Test ERC20 (FungibleToken):**

1. **Deploy**
   - Deploy contract
   - Auto mint 1 juta token ke deployer

2. **Check Initial State**
   - `name` → "My First Token"
   - `symbol` → "MFT"
   - `totalSupply` → 1,000,000 * 10^18
   - `balanceOf[yourAddress]` → 1,000,000 * 10^18

3. **Test Transfer**
   - Copy address lain (Account 2)
   - `transfer(account2, 100 * 10^18)` → Kirim 100 token
   - Check `balanceOf[account2]` → 100 * 10^18

4. **Test Approve & TransferFrom**
   - `approve(account2, 50 * 10^18)` → Approve 50 token
   - Ganti ke Account 2
   - `transferFrom(yourAddress, account3, 30 * 10^18)`
   - Check allowance tersisa 20 token

5. **Test Mint (Only Owner)**
   - Kembali ke owner account
   - `mint(account2, 1000 * 10^18)` → Mint 1000 token baru
   - Ganti ke non-owner → `mint` GAGAL

**Test ERC721 (CryptoKitty):**

1. **Create Gen-0 Kitties**
   - `createGen0Kitty()` → Create kitty #0
   - `createGen0Kitty()` → Create kitty #1
   - `getTotalKitties()` → Lihat 2

2. **Check Kitty Data**
   - `getKitty(0)` → Lihat genes, generation=0, mom=0, dad=0
   - `ownerOf(0)` → Your address
   - `balanceOf(yourAddress)` → 2

3. **Test Breeding**
   - `breed(0, 1)` → Breed kitty #0 dan #1
   - Baby lahir dengan tokenId = 2
   - `getKitty(2)` → generation=1, momId=0, dadId=1
   - `balanceOf(yourAddress)` → 3 (punya 3 kitties)

4. **Test Transfer**
   - Copy address Account 2
   - `transferFrom(yourAddress, account2, 2)` → Transfer baby
   - `ownerOf(2)` → Account 2
   - `balanceOf(yourAddress)` → 2
   - `balanceOf(account2)` → 1

5. **Test Approve**
   - `approve(account2, 0)` → Approve kitty #0
   - Ganti ke Account 2
   - `transferFrom(yourAddress, account2, 0)` → Take kitty!
   - `ownerOf(0)` → Account 2

6. **Get Kitties By Owner**
   - `getKittiesByOwner(yourAddress)` → Array tokenIds milik Anda
   - `getKittiesByOwner(account2)` → Array tokenIds milik Account 2

---

## Menambahkan Token ke MetaMask

### Add ERC20 Token

**1. Deploy dan dapatkan contract address**

**2. Di MetaMask:**
- Klik "Assets" tab
- Scroll ke bawah → Klik "Import tokens"
- Paste contract address
- Token symbol dan decimals auto-populate
- Klik "Import"

**3. Token muncul di MetaMask!**
- Anda bisa lihat balance
- Bisa send ke address lain
- Bisa add ke exchange (jika listed)

### Add ERC721 NFT

**1. Deploy CryptoKitty dan mint beberapa**

**2. Di MetaMask:**
- Klik "NFTs" tab
- Klik "Import NFT"
- Paste contract address
- Masukkan tokenId (misal: 0)
- Klik "Import"

**3. NFT muncul di MetaMask!**
- Tapi tidak ada gambar (kita belum implement tokenURI)

**Untuk show gambar NFT, perlu:**
- Implement `tokenURI()` function
- Return URL ke metadata JSON
- Metadata JSON punya image URL
- (Di luar scope tutorial ini, akan dibahas di session lanjutan)

---

## OpenZeppelin - Production-Ready Contracts

Untuk production, JANGAN tulis dari nol! Gunakan **OpenZeppelin Contracts** - library standard yang sudah diaudit.

### Install OpenZeppelin

```bash
npm install @openzeppelin/contracts
```

### ERC20 dengan OpenZeppelin

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyToken is ERC20, Ownable {
    constructor() ERC20("My Token", "MTK") Ownable(msg.sender) {
        _mint(msg.sender, 1000000 * 10**decimals());
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}
```

**Keuntungan:**
- ✅ Sudah diaudit security
- ✅ Gas-optimized
- ✅ Battle-tested (dipakai ribuan projects)
- ✅ Include extensions (Burnable, Pausable, Snapshot, dll)
- ✅ Full ERC compliance

### ERC721 dengan OpenZeppelin

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract MyNFT is ERC721, Ownable {
    using Strings for uint256;

    uint256 private _tokenIdCounter;
    string private _baseTokenURI;

    constructor(string memory baseURI)
        ERC721("My NFT", "MNFT")
        Ownable(msg.sender)
    {
        _baseTokenURI = baseURI;
    }

    function mint(address to) public onlyOwner {
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        _safeMint(to, tokenId);
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(ownerOf(tokenId) != address(0), "Token does not exist");

        string memory baseURI = _baseURI();
        return bytes(baseURI).length > 0
            ? string(abi.encodePacked(baseURI, tokenId.toString(), ".json"))
            : "";
    }
}
```

**Fitur Tambahan:**
- ✅ `_safeMint` - Check recipient bisa receive NFT
- ✅ `tokenURI` - Metadata untuk NFT (image, attributes)
- ✅ Enumerable extension - Loop through tokens
- ✅ Royalty support (ERC2981)

---

## Best Practices & Security

### ERC20 Security

**1. Integer Overflow/Underflow**
```solidity
// ❌ BAD (Solidity < 0.8)
balance = balance + amount;

// ✅ GOOD (Solidity >= 0.8 auto checks)
balance += amount;  // Auto revert on overflow
```

**2. Reentrancy Protection**
```solidity
// ❌ BAD
function withdraw() public {
    uint256 amount = balances[msg.sender];
    (bool success, ) = msg.sender.call{value: amount}("");
    balances[msg.sender] = 0;  // State update AFTER external call!
}

// ✅ GOOD
function withdraw() public {
    uint256 amount = balances[msg.sender];
    balances[msg.sender] = 0;  // State update FIRST
    (bool success, ) = msg.sender.call{value: amount}("");
    require(success, "Transfer failed");
}
```

**3. Approval Race Condition**
```solidity
// Issue: Change allowance from 100 to 50
// Attacker bisa spend 100 dulu, lalu spend 50 lagi = 150 total!

// ✅ SOLUTION: Increase/Decrease instead of Set
function increaseAllowance(address spender, uint256 addedValue) public returns (bool) {
    allowance[msg.sender][spender] += addedValue;
    emit Approval(msg.sender, spender, allowance[msg.sender][spender]);
    return true;
}

function decreaseAllowance(address spender, uint256 subtractedValue) public returns (bool) {
    require(allowance[msg.sender][spender] >= subtractedValue, "Decreased below zero");
    allowance[msg.sender][spender] -= subtractedValue;
    emit Approval(msg.sender, spender, allowance[msg.sender][spender]);
    return true;
}
```

### ERC721 Security

**1. Check Receiver Can Handle NFT**
```solidity
// ❌ BAD
function transferFrom(address from, address to, uint256 tokenId) public {
    // Transfer tanpa check
    // Jika `to` adalah contract yang tidak bisa handle NFT → NFT stuck forever!
}

// ✅ GOOD
function safeTransferFrom(address from, address to, uint256 tokenId) public {
    transferFrom(from, to, tokenId);
    require(_checkOnERC721Received(from, to, tokenId), "Receiver cannot handle NFT");
}
```

**2. Prevent Duplicate Token IDs**
```solidity
// ✅ GOOD - Use counter
uint256 private _tokenIdCounter;

function mint(address to) public {
    uint256 newTokenId = _tokenIdCounter;
    _tokenIdCounter++;
    _safeMint(to, newTokenId);
}
```

**3. Validate Token Exists**
```solidity
// ✅ Always check token exists before operations
function transferFrom(address from, address to, uint256 tokenId) public {
    require(_exists(tokenId), "Token does not exist");
    // ... rest of logic
}
```

### General Best Practices

**1. Use Latest Solidity Version**
```solidity
// ✅ Use ^0.8.0+ for automatic overflow checks
pragma solidity ^0.8.30;
```

**2. Emit Events**
```solidity
// ✅ Always emit events for important state changes
function transfer(address to, uint256 amount) public returns (bool) {
    // ... logic
    emit Transfer(msg.sender, to, amount);  // Required!
    return true;
}
```

**3. Follow Checks-Effects-Interactions Pattern**
```solidity
function withdraw() public {
    // 1. CHECKS
    require(balance[msg.sender] > 0, "No balance");

    // 2. EFFECTS (update state)
    uint256 amount = balance[msg.sender];
    balance[msg.sender] = 0;

    // 3. INTERACTIONS (external calls)
    (bool success, ) = msg.sender.call{value: amount}("");
    require(success, "Transfer failed");
}
```

**4. Use Access Control**
```solidity
// ✅ Restrict sensitive functions
function mint(address to, uint256 amount) public onlyOwner {
    _mint(to, amount);
}
```

**5. Test Everything!**
- Write unit tests
- Test edge cases
- Test with different accounts
- Test failure scenarios
- Audit before mainnet

---

## Resources & Next Steps

### Documentation

- [ERC20 Standard](https://eips.ethereum.org/EIPS/eip-20)
- [ERC721 Standard](https://eips.ethereum.org/EIPS/eip-721)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
- [Solidity Docs](https://docs.soliditylang.org/)

### Tools

- [OpenZeppelin Wizard](https://wizard.openzeppelin.com/) - Generate contracts
- [Etherscan Token Tracker](https://etherscan.io/tokens) - Lihat token real
- [OpenSea](https://opensea.io/) - NFT marketplace
- [Remix IDE](https://remix.ethereum.org/) - Online IDE

### Next Steps

1. **Add Metadata (tokenURI)**
   - Upload images ke IPFS
   - Create metadata JSON
   - Implement tokenURI function

2. **Add Advanced Features**
   - Burnable tokens
   - Pausable contracts
   - Royalty system (ERC2981)
   - Whitelist/Presale

3. **Build Frontend**
   - Web3.js atau Ethers.js
   - Connect wallet
   - Display tokens
   - Mint interface

4. **Launch Project**
   - Audit code
   - Deploy to mainnet
   - List on exchanges/marketplaces
   - Build community

---

## Latihan & Challenge

### Challenge 1: Custom ERC20

Buat token ERC20 dengan fitur:
- ✅ Fixed supply (tidak bisa mint lagi)
- ✅ Burn mechanism (holder bisa burn token sendiri)
- ✅ Transfer fee 1% (ke treasury address)
- ✅ Whitelist untuk fee-free transfers

### Challenge 2: Advanced NFT

Buat NFT collection dengan:
- ✅ Max supply limit
- ✅ Public mint dengan harga (payable)
- ✅ Whitelist untuk early mint
- ✅ Reveal mechanism (hide metadata dulu)
- ✅ Royalty system

### Challenge 3: GameFi Token

Buat game token system dengan:
- ✅ ERC20 untuk in-game currency
- ✅ ERC721 untuk character NFT
- ✅ Staking NFT untuk earn tokens
- ✅ Level up system (burn tokens untuk upgrade NFT)

---

## Kesimpulan

Selamat! Anda sudah belajar:

**ERC20 (Fungible Token):**
- ✅ Implement dari nol
- ✅ Transfer, approve, transferFrom
- ✅ Mint dengan access control
- ✅ Events dan standard compliance

**ERC721 (Non-Fungible Token):**
- ✅ Unique tokens dengan tokenId
- ✅ Ownership tracking
- ✅ Breeding mechanism
- ✅ Gene mixing algorithm
- ✅ Generation tracking

**Production:**
- ✅ OpenZeppelin contracts
- ✅ Security best practices
- ✅ Gas optimization
- ✅ Testing strategies

**Next:** Deploy your own token dan mulai build!

:::tip Join Community
Diskusi di [Discord ETHJKT](https://discord.gg/p5b6RFEnnk) untuk share project dan tanya-tanya!
:::

---

Happy Building! 🚀
