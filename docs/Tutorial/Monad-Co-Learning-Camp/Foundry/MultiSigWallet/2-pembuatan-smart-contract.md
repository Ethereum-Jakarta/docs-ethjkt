---
sidebar_position: 2
title: 2. MultiSigWallet - Pembuatan Smart Contract
description: Implementasi Smart Contract MultiSigWallet dengan Foundry dan Monad
---

# MultiSigWallet - Pembuatan Smart Contract

Dokumentasi lengkap untuk implementasi smart contract **MultiSigWallet** dengan sistem weighted voting menggunakan Solidity 0.8.26. Tutorial ini akan memandu Anda membangun sistem wallet multi-signature yang sophisticated.

## Daftar Isi

1. [Arsitektur Smart Contract](#1-arsitektur-smart-contract)
2. [Implementasi WalletGovToken](#2-implementasi-walletgovtoken)
3. [Implementasi WeightedMultiSigWallet](#3-implementasi-weightedmultisigwallet)
4. [Security Features](#4-security-features)
5. [Gas Optimization](#5-gas-optimization)
6. [Kompilasi dan Validasi](#6-kompilasi-dan-validasi)

---

## 1. Arsitektur Smart Contract

### Overview Sistem

MultiSigWallet menggunakan sistem **dual-contract architecture** yang terdiri dari:

1. **WalletGovToken**: ERC20 governance token yang menentukan voting weight
2. **WeightedMultiSigWallet**: Core wallet contract dengan weighted voting system

### Flow Interaksi

```
User Action → Signature Collection → Weight Validation → Transaction Execution
     ↓              ↓                      ↓                    ↓
  Propose      Sign with Private      Check Token         Execute if 
 Transaction      Key + Message       Balance ≥ Quorum    Validation Pass
```

### Konsep Voting Weight

**Voting Weight** ditentukan oleh jumlah governance token yang dimiliki:
- 1 token = 1 voting weight
- Total supply: 1,000,000 tokens
- Quorum: Minimum voting weight yang diperlukan (contoh: 600,000 = 60%)

### Security Model

```
Security Layer 1: Executor Validation (hanya executor yang bisa execute)
Security Layer 2: Signature Verification (ECDSA signature validation)
Security Layer 3: Weight Calculation (token-based voting weight)
Security Layer 4: Quorum Check (minimum threshold validation)
Security Layer 5: Reentrancy Protection (ReentrancyGuard)
```

---

## 2. Implementasi WalletGovToken

### Tujuan dan Fungsi

**WalletGovToken** adalah ERC20 token yang berfungsi sebagai:
- **Voting Rights Representation**: Menentukan voting power setiap address
- **Access Control**: Hanya pemilik token yang bisa participate dalam voting
- **Transparency**: Token balance dapat diaudit secara public
- **Protection**: Mencegah token transfer yang tidak diinginkan

### Membuat File WalletGovToken.sol

Buat file `src/WalletGovToken.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title WalletGovToken
 * @dev ERC20 Governance Token untuk MultiSig Wallet dengan Weighted Voting
 * 
 * Token ini digunakan untuk menentukan voting weight dalam multi-signature wallet.
 * Setiap token mewakili 1 unit voting power.
 * 
 * Fitur Khusus:
 * - Proteksi transfer ke wallet contract (mencegah token "hilang")
 * - Proteksi transfer ke zero address
 * - Event tracking untuk semua transfers
 * - Helper functions untuk voting calculations
 * 
 * @author MultiSigWallet Team
 * @notice Token ini HANYA untuk governance, bukan untuk trading
 */
contract WalletGovToken is ERC20 {
    
    // ==================== STATE VARIABLES ====================
    
    /**
     * @dev Address dari wallet contract yang memiliki token ini
     * Menggunakan immutable karena tidak akan berubah setelah deployment
     */
    address public immutable walletContract;
    
    // ==================== EVENTS ====================
    
    /**
     * @dev Event ketika tokens berhasil ditransfer
     * @param from Address pengirim
     * @param to Address penerima  
     * @param amount Jumlah tokens yang ditransfer
     */
    event TokensTransferred(
        address indexed from, 
        address indexed to, 
        uint256 amount
    );
    
    /**
     * @dev Event ketika wallet contract address di-set
     * @param wallet Address wallet contract
     */
    event WalletContractSet(address indexed wallet);
    
    // ==================== CUSTOM ERRORS ====================
    
    /**
     * @dev Error ketika mencoba transfer ke wallet contract
     * Gas-efficient alternative untuk require statements
     */
    error CannotTransferToWallet();
    
    /**
     * @dev Error ketika mencoba transfer ke zero address
     */
    error CannotTransferToZero();
    
    // ==================== MODIFIERS ====================
    
    /**
     * @dev Modifier untuk memastikan transfer tidak ke wallet contract
     * @param to Address tujuan transfer
     * 
     * Mencegah token "hilang" karena di-transfer ke wallet contract
     */
    modifier notToWallet(address to) {
        if (to == walletContract) revert CannotTransferToWallet();
        _;
    }
    
    /**
     * @dev Modifier untuk memastikan transfer tidak ke zero address
     * @param to Address tujuan transfer
     */
    modifier notToZero(address to) {
        if (to == address(0)) revert CannotTransferToZero();
        _;
    }

    // ==================== CONSTRUCTOR ====================

    /**
     * @dev Constructor untuk deploy governance token
     * @param _totalSupply Total supply token yang akan di-mint
     * @param toMint Address yang akan menerima initial tokens (biasanya deployer)
     * 
     * Proses:
     * 1. Set nama token "WalletGovToken" dan symbol "WGT"
     * 2. Set msg.sender (wallet contract) sebagai walletContract
     * 3. Mint semua tokens ke toMint address
     * 4. Emit event untuk tracking
     */
    constructor(
        uint256 _totalSupply,
        address toMint
    ) ERC20("WalletGovToken", "WGT") {
        // Set wallet contract address (msg.sender adalah wallet yang deploy token ini)
        walletContract = msg.sender;
        
        // Mint semua tokens ke address yang ditentukan
        _mint(toMint, _totalSupply);
        
        // Emit event untuk tracking deployment
        emit WalletContractSet(msg.sender);
    }

    // ==================== OVERRIDE FUNCTIONS ====================

    /**
     * @dev Override transfer function untuk menambah proteksi
     * @param to Address tujuan transfer
     * @param amount Jumlah token yang akan ditransfer
     * @return bool Status success transfer
     * 
     * Proteksi yang ditambahkan:
     * - Tidak bisa transfer ke wallet contract (mencegah token hilang)
     * - Tidak bisa transfer ke zero address
     * - Emit custom event untuk tracking
     */
    function transfer(
        address to,
        uint256 amount
    ) public virtual override notToWallet(to) notToZero(to) returns (bool) {
        // Panggil parent transfer function
        bool success = super.transfer(to, amount);
        
        // Jika transfer berhasil, emit custom event
        if (success) {
            emit TokensTransferred(msg.sender, to, amount);
        }
        
        return success;
    }

    /**
     * @dev Override transferFrom function dengan proteksi yang sama
     * @param from Address pengirim
     * @param to Address tujuan
     * @param amount Jumlah token
     * @return bool Status success
     * 
     * Digunakan untuk approved transfers (allowance mechanism)
     */
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) public virtual override notToWallet(to) notToZero(to) returns (bool) {
        // Panggil parent transferFrom function
        bool success = super.transferFrom(from, to, amount);
        
        // Emit custom event jika berhasil
        if (success) {
            emit TokensTransferred(from, to, amount);
        }
        
        return success;
    }
    
    // ==================== VOTING HELPER FUNCTIONS ====================
    
    /**
     * @dev Get voting weight dari sebuah address
     * @param account Address yang akan dicek voting weight-nya
     * @return uint256 Voting weight (sama dengan token balance)
     * 
     * Helper function untuk memudahkan frontend dan contract lain
     * mendapatkan voting weight tanpa perlu call balanceOf
     */
    function getVotingWeight(address account) external view returns (uint256) {
        return balanceOf(account);
    }
    
    /**
     * @dev Get total voting weight dalam sistem (total supply)
     * @return uint256 Total voting weight
     * 
     * Berguna untuk menghitung percentage voting power:
     * percentage = (userBalance / totalSupply) * 100
     */
    function getTotalVotingWeight() external view returns (uint256) {
        return totalSupply();
    }
    
    /**
     * @dev Check apakah address memiliki voting rights
     * @param account Address yang akan dicek
     * @return bool True jika memiliki voting rights (balance > 0)
     * 
     * Simple check untuk validation di frontend atau contract lain
     */
    function hasVotingRights(address account) external view returns (bool) {
        return balanceOf(account) > 0;
    }

    /**
     * @dev Get percentage voting power dari sebuah address
     * @param account Address yang akan dicek
     * @return uint256 Percentage dalam basis points (10000 = 100.00%)
     * 
     * Contoh output:
     * - 2500 = 25.00%
     * - 10000 = 100.00%
     * - 0 = 0.00%
     */
    function getVotingPercentage(address account) external view returns (uint256) {
        uint256 total = totalSupply();
        if (total == 0) return 0;
        
        uint256 balance = balanceOf(account);
        // Menggunakan basis points untuk precision (10000 = 100%)
        return (balance * 10000) / total;
    }

    /**
     * @dev Bulk check voting weights untuk multiple addresses
     * @param accounts Array of addresses to check
     * @return weights Array of voting weights corresponding to accounts
     * 
     * Gas-efficient way untuk get multiple voting weights dalam single call
     */
    function getVotingWeights(address[] calldata accounts) 
        external 
        view 
        returns (uint256[] memory weights) 
    {
        weights = new uint256[](accounts.length);
        for (uint256 i = 0; i < accounts.length; i++) {
            weights[i] = balanceOf(accounts[i]);
        }
    }

    /**
     * @dev Calculate total voting weight dari array of addresses
     * @param accounts Array of addresses
     * @return totalWeight Sum of voting weights from all accounts
     * 
     * Berguna untuk calculate apakah sekelompok addresses
     * memiliki cukup voting weight untuk meet quorum
     */
    function calculateTotalWeight(address[] calldata accounts) 
        external 
        view 
        returns (uint256 totalWeight) 
    {
        for (uint256 i = 0; i < accounts.length; i++) {
            totalWeight += balanceOf(accounts[i]);
        }
    }

    // ==================== INFORMATION FUNCTIONS ====================

    /**
     * @dev Get comprehensive token information
     * @return tokenName Name of the token
     * @return tokenSymbol Symbol of the token
     * @return tokenDecimals Decimals of the token
     * @return tokenTotalSupply Total supply of the token
     * @return walletAddr Address of the wallet contract
     */
    function getTokenInfo() external view returns (
        string memory tokenName,
        string memory tokenSymbol,
        uint8 tokenDecimals,
        uint256 tokenTotalSupply,
        address walletAddr
    ) {
        return (
            name(),
            symbol(),
            decimals(),
            totalSupply(),
            walletContract
        );
    }

    /**
     * @dev Get user-specific token information
     * @param user Address of the user
     * @return balance User's token balance
     * @return votingWeight User's voting weight (same as balance)
     * @return votingPercentage User's voting percentage in basis points
     * @return hasRights Whether user has voting rights
     */
    function getUserInfo(address user) external view returns (
        uint256 balance,
        uint256 votingWeight,
        uint256 votingPercentage,
        bool hasRights
    ) {
        balance = balanceOf(user);
        votingWeight = balance;
        votingPercentage = totalSupply() > 0 ? (balance * 10000) / totalSupply() : 0;
        hasRights = balance > 0;
    }
}
```

### Penjelasan Key Features

#### 1. Transfer Protection
```solidity
modifier notToWallet(address to) {
    if (to == walletContract) revert CannotTransferToWallet();
    _;
}
```
**Tujuan**: Mencegah token di-transfer ke wallet contract itu sendiri, yang akan membuat token "hilang" dan tidak bisa digunakan untuk voting.

#### 2. Custom Events
```solidity
event TokensTransferred(address indexed from, address indexed to, uint256 amount);
```
**Tujuan**: Memberikan tracking tambahan untuk semua token transfers, memudahkan monitoring dan analytics.

#### 3. Voting Helper Functions
```solidity
function getVotingWeight(address account) external view returns (uint256)
function getVotingPercentage(address account) external view returns (uint256)
```
**Tujuan**: Menyediakan interface yang clean untuk voting weight calculations tanpa perlu understand ERC20 internals.

---

## 3. Implementasi WeightedMultiSigWallet

### Tujuan dan Fungsi

**WeightedMultiSigWallet** adalah core contract yang:
- **Menyimpan Dana**: Dapat menerima dan menyimpan ETH dan tokens
- **Multi-Signature Security**: Memerlukan multiple signatures untuk transaksi
- **Weighted Voting**: Voting power berdasarkan governance token ownership
- **Access Control**: Sistem executor dan governance yang sophisticated
- **Transaction Management**: Nonce system dan replay protection

### Membuat File WeightedMultiSigWallet.sol

Buat file `src/WeightedMultiSigWallet.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./WalletGovToken.sol";

/**
 * @title WeightedMultiSigWallet
 * @dev Multi-signature wallet dengan weighted voting system berbasis governance token
 * 
 * Wallet ini memungkinkan multiple owners untuk mengontrol dana dengan sistem
 * voting berdasarkan governance token ownership. Semakin banyak token yang dimiliki,
 * semakin besar voting power dalam decision making.
 * 
 * Key Features:
 * - Weighted voting berdasarkan governance token balance
 * - Configurable quorum requirements
 * - Multiple executors dengan role separation
 * - ECDSA signature verification
 * - Replay attack protection dengan nonce system
 * - Emergency controls melalui governance
 * 
 * @author MultiSigWallet Team
 * @notice Contract ini untuk production treasury management
 */
contract WeightedMultiSigWallet is ReentrancyGuard {
    using ECDSA for bytes32;

    // ==================== EVENTS ====================
    
    /**
     * @dev Event ketika status executor berubah
     * @param executor Address yang status executornya berubah
     * @param status True jika ditambahkan, false jika dihapus
     */
    event Executor(address indexed executor, bool status);
    
    /**
     * @dev Event ketika transaksi berhasil dieksekusi
     * @param executor Address executor yang menjalankan transaksi
     * @param to Address tujuan transaksi
     * @param value Amount ETH yang dikirim
     * @param data Transaction data
     * @param nonce Nonce transaksi untuk prevent replay
     * @param hash Hash transaksi yang di-sign
     * @param result Return data dari transaction call
     */
    event ExecuteTransaction(
        address indexed executor,
        address payable indexed to,
        uint256 value,
        bytes data,
        uint256 nonce,
        bytes32 hash,
        bytes result
    );
    
    /**
     * @dev Event ketika quorum requirement diupdate
     * @param oldQuorum Quorum lama
     * @param newQuorum Quorum baru
     */
    event QuorumUpdated(uint256 oldQuorum, uint256 newQuorum);
    
    /**
     * @dev Event ketika wallet menerima ETH
     * @param sender Address yang mengirim ETH
     * @param amount Amount ETH yang diterima
     * @param balance Balance total wallet setelah deposit
     */
    event Deposit(address indexed sender, uint256 amount, uint256 balance);
    
    /**
     * @dev Event ketika governance tokens didistribusikan
     * @param to Address penerima tokens
     * @param amount Amount tokens yang didistribusikan
     */
    event TokensDistributed(address indexed to, uint256 amount);

    // ==================== STATE VARIABLES ====================
    
    /**
     * @dev Minimum voting weight yang diperlukan untuk approve transaksi
     * Dalam satuan per million untuk precision (600000 = 60%)
     */
    uint256 public quorumPerMillion;
    
    /**
     * @dev Nonce untuk mencegah replay attacks
     * Increment setiap kali transaksi berhasil dieksekusi
     */
    uint256 public nonce;
    
    /**
     * @dev Chain ID untuk signature verification
     * Mencegah cross-chain replay attacks
     */
    uint256 public chainId;

    /**
     * @dev Mapping untuk track executor addresses
     * Executor adalah address yang bisa mengeksekusi transaksi
     * (tapi tetap memerlukan signatures dari token holders)
     */
    mapping(address => bool) public executors;
    
    /**
     * @dev Jumlah total executors
     * Digunakan untuk validation dan access control
     */
    uint256 public executorCount;

    /**
     * @dev Governance token contract
     * Immutable karena tidak akan berubah setelah deployment
     */
    WalletGovToken public immutable govToken;
    
    // ==================== CONSTANTS ====================
    
    /**
     * @dev Total supply governance token (1 million)
     */
    uint256 public constant GOV_TOKEN_SUPPLY = 1_000_000;
    
    /**
     * @dev Base unit untuk percentage calculations (1 million = 100%)
     */
    uint256 public constant MILLION = 1_000_000;

    // ==================== CUSTOM ERRORS ====================
    
    error NotSelf();                    // Hanya wallet sendiri yang bisa call
    error NotExecutor();                // Hanya executor yang bisa call
    error InsufficientWeight();         // Caller tidak punya voting weight
    error InvalidQuorum();              // Quorum tidak valid (0 atau >100%)
    error InvalidSignatures();          // Signatures tidak valid
    error DuplicateSignature();         // Signature duplikat atau tidak terurut
    error InsufficientSignatures();     // Tidak cukup signatures untuk quorum
    error TransactionFailed();          // Transaction execution gagal
    error CannotRemoveLastExecutor();   // Tidak bisa hapus executor terakhir
    error ExecutorAlreadyExists();      // Executor sudah ada
    error ExecutorNotFound();           // Executor tidak ditemukan
    error InvalidAddress();             // Address tidak valid (zero address)

    // ==================== MODIFIERS ====================
    
    /**
     * @dev Hanya contract itu sendiri yang bisa call function ini
     * Digunakan untuk governance functions yang harus melalui voting process
     */
    modifier onlySelf() {
        if (msg.sender != address(this)) revert NotSelf();
        _;
    }

    /**
     * @dev Hanya executors yang bisa call function ini
     * Executors adalah addresses yang diberi wewenang untuk execute transactions
     */
    modifier onlyExecutors() {
        if (!executors[msg.sender]) revert NotExecutor();
        _;
    }

    /**
     * @dev Caller harus memiliki voting weight (token balance > 0)
     * Mencegah addresses tanpa tokens melakukan operations
     */
    modifier hasVotingWeight() {
        if (!hasWeight(msg.sender)) revert InsufficientWeight();
        _;
    }

    // ==================== CONSTRUCTOR ====================

    /**
     * @dev Constructor untuk deploy weighted multi-signature wallet
     * @param _chainId Chain ID untuk signature verification (10143 untuk Monad Testnet)
     * @param _quorumPerMillion Quorum requirement dalam per million (600000 = 60%)
     * 
     * Proses deployment:
     * 1. Validate quorum parameter
     * 2. Set chain ID dan quorum
     * 3. Deploy governance token contract
     * 4. Mint semua tokens ke deployer
     * 5. Set deployer sebagai executor pertama
     * 6. Emit events untuk tracking
     */
    constructor(uint256 _chainId, uint256 _quorumPerMillion) {
        // Validate quorum (harus 0 < quorum <= 100%)
        if (_quorumPerMillion == 0 || _quorumPerMillion > MILLION) {
            revert InvalidQuorum();
        }
        
        // Set basic parameters
        quorumPerMillion = _quorumPerMillion;
        chainId = _chainId;
        
        // Deploy governance token dan mint ke deployer
        // msg.sender akan menjadi initial token holder
        govToken = new WalletGovToken(GOV_TOKEN_SUPPLY, msg.sender);
        
        // Set deployer sebagai executor pertama
        executors[msg.sender] = true;
        executorCount = 1;
        
        // Emit events untuk tracking
        emit Executor(msg.sender, true);
        emit QuorumUpdated(0, _quorumPerMillion);
    }

    // ==================== RECEIVE/FALLBACK FUNCTIONS ====================

    /**
     * @dev Receive function untuk terima ETH
     * Automatically called ketika contract menerima ETH transfer
     */
    receive() external payable {
        emit Deposit(msg.sender, msg.value, address(this).balance);
    }

    /**
     * @dev Fallback function untuk terima ETH dengan data
     * Called ketika function call tidak match dengan existing functions
     */
    fallback() external payable {
        emit Deposit(msg.sender, msg.value, address(this).balance);
    }

    // ==================== CORE TRANSACTION FUNCTIONS ====================

    /**
     * @dev Execute transaksi dengan multiple signatures
     * @param _receiver Address tujuan transaksi
     * @param _value Jumlah ETH yang akan dikirim (dalam wei)
     * @param _calldata Data transaksi (untuk contract calls)
     * @param signatures Array signatures dari token holders
     * @return bytes Result dari transaction execution
     * 
     * Process Flow:
     * 1. Validate executor dan voting weight
     * 2. Generate transaction hash dengan current nonce
     * 3. Increment nonce untuk prevent replay attacks
     * 4. Validate semua signatures dan check quorum
     * 5. Execute transaction
     * 6. Emit event dan return result
     */
    function executeTransaction(
        address payable _receiver,
        uint256 _value,
        bytes memory _calldata,
        bytes[] memory signatures
    ) external onlyExecutors hasVotingWeight nonReentrant returns (bytes memory) {
        // Generate hash untuk transaksi ini dengan current nonce
        bytes32 _hash = getTransactionHash(nonce, _receiver, _value, _calldata);
        
        // Increment nonce untuk prevent replay attacks
        nonce++;
        
        // Validate signatures dan check quorum
        _validateSignatures(_hash, signatures);

        // Execute transaction
        (bool success, bytes memory result) = _receiver.call{value: _value}(_calldata);
        if (!success) revert TransactionFailed();

        // Emit event untuk tracking
        emit ExecuteTransaction(
            msg.sender,
            _receiver,
            _value,
            _calldata,
            nonce - 1,  // nonce yang digunakan untuk transaction ini
            _hash,
            result
        );
        
        return result;
    }

    /**
     * @dev Internal function untuk validate signatures dan check quorum
     * @param _hash Transaction hash yang di-sign oleh token holders
     * @param signatures Array signatures untuk divalidasi
     * 
     * Validation Process:
     * 1. Check minimal ada 1 signature
     * 2. Loop semua signatures
     * 3. Recover signer address dari setiap signature
     * 4. Check signatures terurut untuk prevent duplicates
     * 5. Accumulate voting weight dari setiap signer
     * 6. Early exit jika sudah mencapai quorum
     * 7. Final check apakah total weight >= quorum
     */
    function _validateSignatures(bytes32 _hash, bytes[] memory signatures) internal view {
        if (signatures.length == 0) revert InsufficientSignatures();
        
        uint256 totalWeight;
        address lastSigner = address(0);
        
        for (uint256 i = 0; i < signatures.length; i++) {
            // Recover signer address dari signature
            address recovered = recover(_hash, signatures[i]);
            
            // Signatures harus terurut untuk prevent duplikasi
            // recovered > lastSigner memastikan tidak ada duplicate dan urutan ascending
            if (recovered <= lastSigner) revert DuplicateSignature();
            lastSigner = recovered;

            // Ambil voting weight dari governance token
            uint256 weight = govToken.balanceOf(recovered);
            totalWeight += weight;
            
            // Early exit untuk save gas jika sudah cukup quorum
            if (totalWeight >= quorumPerMillion) break;
        }

        // Final check apakah total weight cukup untuk quorum
        if (totalWeight < quorumPerMillion) revert InsufficientSignatures();
    }

    /**
     * @dev Generate hash untuk transaction yang akan di-sign
     * @param _nonce Transaction nonce
     * @param to Address tujuan
     * @param value Jumlah ETH
     * @param _calldata Transaction data
     * @return bytes32 Transaction hash
     * 
     * Hash ini yang akan di-sign oleh token holders menggunakan private key mereka.
     * Include semua parameter penting untuk prevent manipulation:
     * - Contract address (this) - prevent cross-contract attacks
     * - Chain ID - prevent cross-chain replay attacks
     * - Nonce - prevent replay attacks
     * - Transaction parameters - prevent parameter manipulation
     */
    function getTransactionHash(
        uint256 _nonce,
        address to,
        uint256 value,
        bytes memory _calldata
    ) public view returns (bytes32) {
        return keccak256(
            abi.encodePacked(
                address(this),  // Wallet contract address
                chainId,        // Chain ID untuk prevent cross-chain attacks
                _nonce,         // Nonce untuk prevent replay attacks
                to,             // Transaction recipient
                value,          // ETH amount
                _calldata       // Transaction data
            )
        );
    }

    /**
     * @dev Recover signer address dari signature
     * @param _hash Message hash yang di-sign
     * @param _signature Signature bytes
     * @return address Recovered signer address
     * 
     * Menggunakan Ethereum signed message format untuk keamanan:
     * "\x19Ethereum Signed Message:\n32" + hash
     * 
     * Format ini standard untuk wallet signatures dan mencegah
     * signature yang dibuat untuk message lain digunakan di sini
     */
    function recover(
        bytes32 _hash,
        bytes memory _signature
    ) public pure returns (address) {
        return keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", _hash)
        ).recover(_signature);
    }

    /**
     * @dev Check apakah address memiliki voting weight
     * @param account Address yang akan dicek
     * @return bool True jika memiliki voting weight (token balance > 0)
     */
    function hasWeight(address account) public view returns (bool) {
        return govToken.balanceOf(account) > 0;
    }

    // ==================== GOVERNANCE FUNCTIONS ====================

    /**
     * @dev Update quorum requirement (hanya bisa dipanggil oleh wallet sendiri)
     * @param newQuorumPerMillion New quorum dalam per million format
     * 
     * Function ini hanya bisa dipanggil melalui executeTransaction,
     * yang berarti butuh voting dari token holders untuk mengubah quorum.
     * 
     * Use case: Adjust quorum berdasarkan perubahan governance needs
     */
    function updateQuorumPerMillion(uint256 newQuorumPerMillion) external onlySelf {
        if (newQuorumPerMillion == 0 || newQuorumPerMillion > MILLION) {
            revert InvalidQuorum();
        }
        
        uint256 oldQuorum = quorumPerMillion;
        quorumPerMillion = newQuorumPerMillion;
        
        emit QuorumUpdated(oldQuorum, newQuorumPerMillion);
    }

    /**
     * @dev Tambah executor baru (hanya bisa dipanggil oleh wallet sendiri)
     * @param newExecutor Address yang akan dijadikan executor
     * 
     * Executor adalah address yang bisa mengeksekusi transaksi yang sudah
     * mendapat signatures. Memisahkan role "execution" dari "approval".
     * 
     * Use case: Add team members yang bisa execute transactions
     */
    function addExecutor(address newExecutor) external onlySelf {
        if (newExecutor == address(0)) revert InvalidAddress();
        if (executors[newExecutor]) revert ExecutorAlreadyExists();
        
        executors[newExecutor] = true;
        executorCount++;
        
        emit Executor(newExecutor, true);
    }

    /**
     * @dev Remove executor (hanya bisa dipanggil oleh wallet sendiri)
     * @param oldExecutor Address executor yang akan dihapus
     * 
     * Tidak bisa remove executor terakhir untuk mencegah wallet "mati".
     * Minimal harus ada 1 executor yang bisa mengeksekusi transaksi.
     */
    function removeExecutor(address oldExecutor) external onlySelf {
        if (executorCount <= 1) revert CannotRemoveLastExecutor();
        if (!executors[oldExecutor]) revert ExecutorNotFound();
        
        executors[oldExecutor] = false;
        executorCount--;
        
        emit Executor(oldExecutor, false);
    }

    /**
     * @dev Distribute governance tokens (hanya bisa dipanggil oleh wallet sendiri)
     * @param to Address tujuan distribusi
     * @param amount Jumlah token yang akan didistribusikan
     * 
     * Wallet contract bisa distribute tokens yang dimilikinya untuk
     * mengubah voting power distribution dalam sistem governance.
     * 
     * Use case:
     * - Initial distribution ke team members
     * - Reward untuk contributors
     * - Rebalancing voting power
     */
    function distributeTokens(address to, uint256 amount) external onlySelf {
        if (to == address(0)) revert InvalidAddress();
        
        bool success = govToken.transfer(to, amount);
        if (!success) revert TransactionFailed();
        
        emit TokensDistributed(to, amount);
    }

    // ==================== VIEW FUNCTIONS ====================

    /**
     * @dev Get informasi wallet secara keseluruhan
     * @return balance ETH balance wallet
     * @return tokenBalance Governance token balance wallet
     * @return currentNonce Nonce saat ini
     * @return currentQuorum Quorum requirement saat ini
     * @return executorCnt Jumlah executors
     * 
     * One-stop function untuk get semua informasi penting wallet
     */
    function getWalletInfo() external view returns (
        uint256 balance,
        uint256 tokenBalance,
        uint256 currentNonce,
        uint256 currentQuorum,
        uint256 executorCnt
    ) {
        return (
            address(this).balance,
            govToken.balanceOf(address(this)),
            nonce,
            quorumPerMillion,
            executorCount
        );
    }

    /**
     * @dev Get informasi governance token
     * @return tokenAddress Address governance token contract
     * @return totalSupply Total supply governance token
     * @return symbol Token symbol (WGT)
     * @return name Token name (WalletGovToken)
     */
    function getTokenInfo() external view returns (
        address tokenAddress,
        uint256 totalSupply,
        string memory symbol,
        string memory name
    ) {
        return (
            address(govToken),
            govToken.totalSupply(),
            govToken.symbol(),
            govToken.name()
        );
    }

    /**
     * @dev Get informasi voting untuk user tertentu
     * @param user Address user yang akan dicek
     * @return votingWeight Voting weight user (token balance)
     * @return votingPercentage Persentase voting power user
     * @return isExecutor Apakah user adalah executor
     * @return hasVotingRights Apakah user memiliki voting rights
     */
    function getUserVotingInfo(address user) external view returns (
        uint256 votingWeight,
        uint256 votingPercentage,
        bool isExecutor,
        bool hasVotingRights
    ) {
        uint256 weight = govToken.balanceOf(user);
        uint256 totalSupply = govToken.totalSupply();
        
        return (
            weight,
            totalSupply > 0 ? (weight * 100) / totalSupply : 0,
            executors[user],
            weight > 0
        );
    }

    /**
     * @dev Kalkulasi apakah signatures akan memenuhi quorum
     * @param signers Array address yang akan sign
     * @return meetsQuorum True jika signers akan memenuhi quorum
     * @return totalWeight Total weight dari signers
     * 
     * Helper function untuk frontend memvalidasi sebelum submit transaction
     */
    function calculateQuorum(address[] memory signers) external view returns (bool meetsQuorum, uint256 totalWeight) {
        totalWeight = 0;
        
        for (uint256 i = 0; i < signers.length; i++) {
            totalWeight += govToken.balanceOf(signers[i]);
        }
        
        meetsQuorum = totalWeight >= quorumPerMillion;
    }

    /**
     * @dev Get required weight untuk memenuhi quorum
     * @return uint256 Required weight
     */
    function getRequiredWeight() external view returns (uint256) {
        return quorumPerMillion;
    }

    /**
     * @dev Validasi apakah transaksi akan berhasil
     * @param _receiver Address tujuan transaksi
     * @param _value Jumlah ETH
     * @param _calldata Transaction data
     * @param signatures Proposed signatures
     * @return bool True jika transaksi akan berhasil
     * 
     * Comprehensive validation termasuk:
     * - Signature validation
     * - Quorum check
     * - Balance sufficiency
     * - Signature ordering
     */
    function validateTransaction(
        address payable _receiver,
        uint256 _value,
        bytes memory _calldata,
        bytes[] memory signatures
    ) external view returns (bool) {
        // Basic validation
        if (signatures.length == 0) return false;
        if (_value > address(this).balance) return false;
        
        // Generate transaction hash
        bytes32 _hash = getTransactionHash(nonce, _receiver, _value, _calldata);
        
        // Validate signatures dan calculate weight
        uint256 totalWeight = 0;
        address lastSigner = address(0);
        
        for (uint256 i = 0; i < signatures.length; i++) {
            address recovered = recover(_hash, signatures[i]);
            
            // Check signature ordering
            if (recovered <= lastSigner) return false;
            lastSigner = recovered;
            
            totalWeight += govToken.balanceOf(recovered);
            
            // Early exit jika sudah cukup quorum
            if (totalWeight >= quorumPerMillion) return true;
        }
        
        return false;
    }

    /**
     * @dev Get daftar addresses dengan voting power tinggi
     * @param minWeight Minimum voting weight untuk diinclude
     * @return highWeightHolders Array addresses dengan voting weight >= minWeight
     * @return weights Array voting weights corresponding ke addresses
     * 
     * Note: Function ini tidak gas-efficient untuk on-chain calls
     * karena perlu iterate semua possible addresses.
     * Hanya untuk off-chain queries dan analytics.
     */
    function getHighWeightHolders(uint256 minWeight) external view returns (
        address[] memory highWeightHolders,
        uint256[] memory weights
    ) {
        // Simplified implementation - return empty arrays
        // Dalam production, implementation ini perlu off-chain indexing
        // atau event-based tracking untuk efficiency
        return (new address[](0), new uint256[](0));
    }

    /**
     * @dev Emergency function untuk check contract health
     * @return isHealthy True jika contract dalam kondisi sehat
     * @return healthReport String description kondisi contract
     */
    function checkHealth() external view returns (bool isHealthy, string memory healthReport) {
        // Check various health indicators
        bool hasExecutors = executorCount > 0;
        bool validQuorum = quorumPerMillion > 0 && quorumPerMillion <= MILLION;
        bool tokenExists = address(govToken) != address(0);
        bool tokenSupplyValid = govToken.totalSupply() == GOV_TOKEN_SUPPLY;
        
        isHealthy = hasExecutors && validQuorum && tokenExists && tokenSupplyValid;
        
        if (!isHealthy) {
            if (!hasExecutors) return (false, "No executors available");
            if (!validQuorum) return (false, "Invalid quorum configuration");
            if (!tokenExists) return (false, "Governance token not found");
            if (!tokenSupplyValid) return (false, "Invalid token supply");
        }
        
        healthReport = "Contract is healthy";
    }

    // ==================== EMERGENCY FUNCTIONS ====================

    /**
     * @dev Emergency pause function (hanya melalui governance)
     * Function ini bisa ditambahkan untuk emergency situations
     * 
     * Note: Tidak diimplement dalam versi basic ini,
     * tapi bisa ditambahkan sebagai extension
     */
    
    /**
     * @dev Get contract version
     * @return version String version identifier
     */
    function getVersion() external pure returns (string memory version) {
        return "WeightedMultiSigWallet-v1.0.0";
    }
}
```

### Penjelasan Key Features

#### 1. Weighted Voting System
```solidity
function _validateSignatures(bytes32 _hash, bytes[] memory signatures) internal view {
    uint256 totalWeight;
    for (uint256 i = 0; i < signatures.length; i++) {
        address recovered = recover(_hash, signatures[i]);
        uint256 weight = govToken.balanceOf(recovered);
        totalWeight += weight;
    }
    require(totalWeight >= quorumPerMillion);
}
```
**Tujuan**: Setiap signature memiliki weight berdasarkan token balance. Total weight harus mencapai quorum untuk approve transaksi.

#### 2. Signature Ordering Protection
```solidity
if (recovered <= lastSigner) revert DuplicateSignature();
lastSigner = recovered;
```
**Tujuan**: Mencegah duplicate signatures dan memastikan signatures dalam urutan ascending untuk security.

#### 3. Replay Attack Protection
```solidity
bytes32 _hash = getTransactionHash(nonce, _receiver, _value, _calldata);
nonce++;
```
**Tujuan**: Setiap transaksi menggunakan nonce yang unique, mencegah replay attacks.

#### 4. Cross-Chain Protection
```solidity
return keccak256(abi.encodePacked(address(this), chainId, _nonce, to, value, _calldata));
```
**Tujuan**: Include chain ID dalam hash untuk mencegah signatures digunakan di chain lain.

---

## 4. Security Features

### Comprehensive Security Model

#### 1. Access Control Layers
```solidity
// Layer 1: Executor validation
modifier onlyExecutors() {
    if (!executors[msg.sender]) revert NotExecutor();
    _;
}

// Layer 2: Voting weight validation  
modifier hasVotingWeight() {
    if (!hasWeight(msg.sender)) revert InsufficientWeight();
    _;
}

// Layer 3: Self-call validation untuk governance
modifier onlySelf() {
    if (msg.sender != address(this)) revert NotSelf();
    _;
}
```

#### 2. Reentrancy Protection
```solidity
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract WeightedMultiSigWallet is ReentrancyGuard {
    function executeTransaction(...) external nonReentrant {
        // Protected from reentrancy attacks
    }
}
```

#### 3. Signature Security
```solidity
function recover(bytes32 _hash, bytes memory _signature) public pure returns (address) {
    return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", _hash)).recover(_signature);
}
```
**Features**:
- Ethereum signed message format
- ECDSA signature verification
- Address recovery dari signatures

#### 4. Input Validation
```solidity
// Validate quorum range
if (_quorumPerMillion == 0 || _quorumPerMillion > MILLION) {
    revert InvalidQuorum();
}

// Validate addresses
if (newExecutor == address(0)) revert InvalidAddress();

// Validate array lengths
if (signatures.length == 0) revert InsufficientSignatures();
```

### Security Best Practices

#### 1. Custom Errors untuk Gas Efficiency
```solidity
error NotExecutor();
error InsufficientWeight(); 
error DuplicateSignature();
```
**Benefits**:
- More gas-efficient than require strings
- Clear error identification
- Better debugging experience

#### 2. Immutable Variables
```solidity
WalletGovToken public immutable govToken;
address public immutable walletContract;
```
**Benefits**:
- Gas savings (no SLOAD operations)
- Security guarantee (cannot be changed)
- Clear contract design

#### 3. Event Emission untuk Transparency
```solidity
event ExecuteTransaction(address indexed executor, address payable indexed to, uint256 value, bytes data, uint256 nonce, bytes32 hash, bytes result);
```
**Benefits**:
- Complete audit trail
- Off-chain monitoring capabilities
- Transparency untuk stakeholders

---

## 5. Gas Optimization

### Optimization Techniques

#### 1. Packed Structs (untuk future extensions)
```solidity
struct PackedTransactionData {
    uint128 value;      // 16 bytes - enough untuk most ETH amounts
    uint64 nonce;       // 8 bytes - enough untuk many transactions
    uint32 timestamp;   // 4 bytes - enough untuk timestamps
    uint32 gasLimit;    // 4 bytes - enough untuk gas limits
    // Total: 32 bytes = 1 storage slot
}
```

#### 2. Efficient Looping
```solidity
// Early exit untuk save gas
for (uint256 i = 0; i < signatures.length; i++) {
    totalWeight += govToken.balanceOf(recovered);
    if (totalWeight >= quorumPerMillion) break; // Early exit
}
```

#### 3. Batch Operations
```solidity
function getVotingWeights(address[] calldata accounts) external view returns (uint256[] memory weights) {
    weights = new uint256[](accounts.length);
    for (uint256 i = 0; i < accounts.length; i++) {
        weights[i] = govToken.balanceOf(accounts[i]);
    }
}
```

#### 4. Memory vs Storage Optimization
```solidity
// Use memory untuk temporary data
bytes[] memory signatures = ...;

// Use storage untuk persistent data
mapping(address => bool) public executors;
```

### Gas Usage Analysis

#### Expected Gas Costs
```
Contract Deployment: ~2,500,000 gas
Token Distribution: ~50,000 gas
Add Executor: ~45,000 gas
Execute Transaction (2 signatures): ~120,000 gas
Execute Transaction (5 signatures): ~180,000 gas
```

---

## 6. Kompilasi dan Validasi

### Compile Contracts

```bash
# Compile semua contracts
forge build

# Compile dengan optimization
forge build --optimize --optimizer-runs 1000

# Output yang diharapkan:
# [⠒] Compiling...
# [⠢] Compiling 3 files with 0.8.26
# [⠆] Solc 0.8.26 finished in 2.34s
# Compiler run successful!
```

### Check Compilation Output

```bash
# Check compiled contracts
ls out/

# Expected output:
# WalletGovToken.sol/
# WeightedMultiSigWallet.sol/

# Check specific contract artifacts
ls out/WeightedMultiSigWallet.sol/
# WeightedMultiSigWallet.json

# Check contract size
forge build --sizes
```

### Validate Contract Interfaces

Buat file `src/interfaces/IWeightedMultiSigWallet.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

interface IWeightedMultiSigWallet {
    // Core functions
    function executeTransaction(
        address payable _receiver,
        uint256 _value,
        bytes memory _calldata,
        bytes[] memory signatures
    ) external returns (bytes memory);
    
    function getTransactionHash(
        uint256 _nonce,
        address to,
        uint256 value,
        bytes memory _calldata
    ) external view returns (bytes32);
    
    function recover(bytes32 _hash, bytes memory _signature) external pure returns (address);
    
    // View functions
    function getWalletInfo() external view returns (uint256, uint256, uint256, uint256, uint256);
    function getUserVotingInfo(address user) external view returns (uint256, uint256, bool, bool);
    function calculateQuorum(address[] memory signers) external view returns (bool, uint256);
    
    // Governance functions
    function updateQuorumPerMillion(uint256 newQuorumPerMillion) external;
    function addExecutor(address newExecutor) external;
    function removeExecutor(address oldExecutor) external;
    function distributeTokens(address to, uint256 amount) external;
}
```

### Create Deployment Helper

Buat file `src/utils/DeploymentHelper.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "../WeightedMultiSigWallet.sol";
import "../WalletGovToken.sol";

/**
 * @title DeploymentHelper
 * @dev Helper contract untuk validate deployment dan setup
 */
contract DeploymentHelper {
    
    /**
     * @dev Validate wallet deployment
     * @param wallet Address wallet yang akan divalidate
     * @return isValid True jika deployment valid
     * @return report Error report jika ada issues
     */
    function validateWalletDeployment(address wallet) external view returns (bool isValid, string memory report) {
        if (wallet == address(0)) {
            return (false, "Wallet address is zero");
        }
        
        try WeightedMultiSigWallet(payable(wallet)).getWalletInfo() returns (uint256, uint256, uint256, uint256, uint256) {
            return (true, "Wallet deployment valid");
        } catch {
            return (false, "Wallet contract not responsive");
        }
    }
    
    /**
     * @dev Calculate optimal quorum untuk given token distribution
     * @param tokenBalances Array of token balances
     * @return optimalQuorum Recommended quorum value
     */
    function calculateOptimalQuorum(uint256[] memory tokenBalances) external pure returns (uint256 optimalQuorum) {
        uint256 totalSupply = 0;
        for (uint256 i = 0; i < tokenBalances.length; i++) {
            totalSupply += tokenBalances[i];
        }
        
        // Recommend 60% untuk most cases
        optimalQuorum = (totalSupply * 60) / 100;
    }
}
```

### Final Validation Script

Buat file `scripts/validate-contracts.sh`:

```bash
#!/bin/bash

echo "=== Contract Validation ==="
echo ""

# Check compilation
echo "1. Checking compilation..."
forge build > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✓ Contracts compile successfully"
else
    echo "✗ Compilation failed"
    exit 1
fi

# Check contract sizes
echo ""
echo "2. Checking contract sizes..."
forge build --sizes | grep -E "(WeightedMultiSigWallet|WalletGovToken)"

# Check for common issues
echo ""
echo "3. Checking for common issues..."

# Check untuk floating pragma
if grep -r "pragma solidity \^" src/; then
    echo "⚠ Warning: Floating pragma found. Consider using fixed version."
fi

# Check untuk missing SPDX
if ! grep -r "SPDX-License-Identifier" src/; then
    echo "✗ Error: Missing SPDX license identifier"
fi

# Check untuk proper imports
if grep -r "import \"" src/; then
    echo "✓ Imports using proper syntax"
fi

echo ""
echo "=== Validation Complete ==="
```

### Contract Documentation

Tambahkan comprehensive NatSpec documentation:

```solidity
/**
 * @title WeightedMultiSigWallet
 * @author MultiSigWallet Team
 * @notice Multi-signature wallet dengan weighted voting untuk treasury management
 * @dev Implements EIP-191 signatures dengan governance token-based weighting
 * 
 * @custom:security-contact security@multisigwallet.com
 * @custom:version 1.0.0
 * @custom:audit-status Pending
 */
```

Contracts sudah siap! Selanjutnya kita akan membuat comprehensive testing dan deployment procedures.