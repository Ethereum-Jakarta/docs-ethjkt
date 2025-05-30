# TokenFactory ERC20 dengan Foundry dan Template Monad

Dokumentasi lengkap untuk membuat TokenFactory smart contract yang dapat menciptakan token ERC20 custom menggunakan Foundry dengan template Monad oficial. Tutorial ini akan mengajarkan cara membangun factory pattern untuk token creation, testing comprehensive, dan deployment ke Monad Testnet.

## Daftar Isi

1. [Overview TokenFactory](#1-overview-tokenfactory)
2. [Setup Proyek dengan Template Monad](#2-setup-proyek-dengan-template-monad)
3. [Membuat Smart Contract Token ERC20](#3-membuat-smart-contract-token-erc20)
4. [Membuat Smart Contract TokenFactory](#4-membuat-smart-contract-tokenfactory)
5. [Testing Comprehensive](#5-testing-comprehensive)
6. [Script Deployment](#6-script-deployment)
7. [Script Interaksi](#7-script-interaksi)
8. [Deployment ke Monad Testnet](#8-deployment-ke-monad-testnet)
9. [Verifikasi dan Interaksi](#9-verifikasi-dan-interaksi)
10. [Advanced Features](#10-advanced-features)

---

## 1. Overview TokenFactory

TokenFactory adalah smart contract yang mengimplementasikan Factory Pattern untuk menciptakan token ERC20 custom. Sistem ini memungkinkan pengguna untuk dengan mudah membuat token mereka sendiri tanpa perlu deploy contract secara manual.

### 🎯 Fitur Utama

- **Token Creation**: Buat token ERC20 custom dengan nama, simbol, dan supply yang ditentukan
- **Ownership Management**: Setiap token memiliki owner yang dapat melakukan burn operations
- **Factory Tracking**: Mencatat semua token yang dibuat melalui factory
- **Event Emission**: Komprehensif event logging untuk transparency
- **OpenZeppelin Integration**: Menggunakan standard library yang secure dan tested

### 🏗️ Arsitektur

```
TokenFactory
├── Token Creation Function
├── Token Tracking System
├── Event Management
└── Query Functions

Token (ERC20)
├── Standard ERC20 Functions
├── Ownable Access Control
├── Burn Functionality
└── Custom Parameters
```

---

## 2. Setup Proyek dengan Template Monad

### Membuat Proyek Baru

```bash
# Buat proyek baru dengan template Monad
forge init --template monad-developers/foundry-monad token-factory

# Masuk ke direktori proyek
cd token-factory
```

### Install OpenZeppelin Contracts

```bash
# Install OpenZeppelin sebagai dependency
forge install OpenZeppelin/openzeppelin-contracts

# Remap untuk import paths
echo 'remappings = ["@openzeppelin/=lib/openzeppelin-contracts/"]' >> foundry.toml
```

### Update foundry.toml

Edit file `foundry.toml` untuk menambahkan remapping dan konfigurasi:

```toml
[profile.default]
src = "src"
out = "out"
libs = ["lib"]
solc = "0.8.28"
optimizer = true
optimizer_runs = 200
metadata = true
metadata_hash = "none"  # disable ipfs
use_literal_content = true # use source code

[rpc_endpoints]
monad_testnet = "https://testnet-rpc.monad.xyz/"

# Fuzz testing configuration
[fuzz]
runs = 1000

[invariant]
runs = 256
depth = 15
fail_on_revert = false

# Monad Configuration
eth-rpc-url="https://testnet-rpc.monad.xyz"
chain_id = 10143

# See more config options https://github.com/foundry-rs/foundry/blob/master/crates/config/README.md#all-options
remappings = ["@openzeppelin/=lib/openzeppelin-contracts/"]
```

---

## 3. Membuat Smart Contract Token ERC20

Buat file `src/Token.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC20} from "lib/openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "lib/openzeppelin-contracts/contracts/access/Ownable.sol";
/**
 * @title Token
 * @dev Contract untuk token ERC20 yang dapat dibuat oleh TokenFactory
 * @author Your Name
 */
contract Token is ERC20, Ownable {
    // Events untuk tracking operations
    event TokensBurned(address indexed burner, uint256 amount);
    event TokensCreated(address indexed creator, uint256 initialSupply);

    // Custom errors untuk gas efficiency
    error InsufficientBalance(uint256 available, uint256 required);
    error InvalidBurnAmount();

    /**
     * @dev Constructor untuk membuat token baru dengan parameter yang ditentukan
     * @param initialOwner Alamat pemilik awal token
     * @param initialSupply Jumlah awal token yang akan dicetak (dalam satuan token utuh)
     * @param tokenName Nama token yang akan dibuat
     * @param tokenSymbol Simbol token yang akan dibuat
     */
    constructor(
        address initialOwner, 
        uint256 initialSupply, 
        string memory tokenName, 
        string memory tokenSymbol
    ) 
        ERC20(tokenName, tokenSymbol)
        Ownable(initialOwner)
    {
        // Validasi input
        require(initialOwner != address(0), "Owner cannot be zero address");
        require(initialSupply > 0, "Initial supply must be greater than 0");
        require(bytes(tokenName).length > 0, "Token name cannot be empty");
        require(bytes(tokenSymbol).length > 0, "Token symbol cannot be empty");

        // Mencetak token awal dengan menyesuaikan jumlah desimal
        // Contoh: 1000 token dengan 18 desimal menjadi 1000 * 10^18
        uint256 totalSupply = initialSupply * 10 ** decimals();
        _mint(initialOwner, totalSupply);

        emit TokensCreated(initialOwner, totalSupply);
    }

    /**
     * @dev Fungsi untuk membakar (burn) token
     * @param burnAmount Jumlah token yang akan dibakar (dalam satuan token utuh)
     */
    function burnToken(uint256 burnAmount) public onlyOwner {
        if (burnAmount == 0) {
            revert InvalidBurnAmount();
        }

        uint256 burnAmountWithDecimals = burnAmount * 10 ** decimals();
        uint256 ownerBalance = balanceOf(msg.sender);

        if (ownerBalance < burnAmountWithDecimals) {
            revert InsufficientBalance(ownerBalance, burnAmountWithDecimals);
        }

        // Bakar token dari pemilik sesuai jumlah yang ditentukan
        _burn(msg.sender, burnAmountWithDecimals);

        emit TokensBurned(msg.sender, burnAmountWithDecimals);
    }

    /**
     * @dev Fungsi untuk membakar token dengan jumlah dalam wei (termasuk decimals)
     * @param burnAmountWithDecimals Jumlah token yang akan dibakar dalam wei
     */
    function burnTokenWei(uint256 burnAmountWithDecimals) public onlyOwner {
        if (burnAmountWithDecimals == 0) {
            revert InvalidBurnAmount();
        }

        uint256 ownerBalance = balanceOf(msg.sender);

        if (ownerBalance < burnAmountWithDecimals) {
            revert InsufficientBalance(ownerBalance, burnAmountWithDecimals);
        }

        _burn(msg.sender, burnAmountWithDecimals);

        emit TokensBurned(msg.sender, burnAmountWithDecimals);
    }

    /**
     * @dev Fungsi untuk mendapatkan informasi lengkap token
     * @return tokenName Nama token
     * @return tokenSymbol Simbol token
     * @return tokenDecimals Jumlah desimal
     * @return tokenTotalSupply Total supply token
     * @return tokenOwner Alamat owner
     */
    function getTokenInfo() public view returns (
        string memory tokenName,
        string memory tokenSymbol,
        uint8 tokenDecimals,
        uint256 tokenTotalSupply,
        address tokenOwner
    ) {
        return (
            name(),
            symbol(),
            decimals(),
            totalSupply(),
            owner()
        );
    }

    /**
     * @dev Fungsi untuk mengecek apakah address adalah owner
     * @param account Address yang akan dicek
     * @return bool True jika address adalah owner
     */
    function isOwner(address account) public view returns (bool) {
        return account == owner();
    }
}
```

---

## 4. Membuat Smart Contract TokenFactory

Buat file `src/TokenFactory.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Token.sol";

/**
 * @title TokenFactory
 * @dev Contract factory untuk membuat token ERC20 baru
 * @author Your Name
 */
contract TokenFactory {
    // Struct untuk menyimpan informasi token
    struct TokenInfo {
        address tokenAddress;
        address owner;
        string name;
        string symbol;
        uint256 initialSupply;
        uint256 createdAt;
    }

    // Array untuk menyimpan alamat semua token yang telah dibuat
    address[] public createdTokens;
    
    // Mapping untuk menyimpan informasi detail token
    mapping(address => TokenInfo) public tokenInfos;
    
    // Mapping untuk menyimpan token yang dibuat oleh address tertentu
    mapping(address => address[]) public tokensByOwner;
    
    // Counter untuk tracking
    uint256 public totalTokensCreated;
    
    // Events
    event TokenCreated(
        address indexed owner, 
        address indexed tokenAddress, 
        string name,
        string symbol,
        uint256 initialSupply,
        uint256 timestamp
    );

    event FactoryStatsUpdated(uint256 totalTokens);

    // Custom errors
    error InvalidOwnerAddress();
    error InvalidSupplyAmount();
    error EmptyTokenName();
    error EmptyTokenSymbol();

    /**
     * @dev Fungsi untuk membuat token ERC20 baru
     * @param initialOwner Alamat pemilik awal token
     * @param initialSupply Jumlah awal token yang akan dicetak
     * @param tokenName Nama token yang akan dibuat
     * @param tokenSymbol Simbol token yang akan dibuat
     * @return newTokenAddress Alamat contract token baru
     */
    function createToken(
        address initialOwner, 
        uint256 initialSupply, 
        string memory tokenName, 
        string memory tokenSymbol
    ) public returns (address newTokenAddress) {
        // Validasi input
        if (initialOwner == address(0)) {
            revert InvalidOwnerAddress();
        }
        if (initialSupply == 0) {
            revert InvalidSupplyAmount();
        }
        if (bytes(tokenName).length == 0) {
            revert EmptyTokenName();
        }
        if (bytes(tokenSymbol).length == 0) {
            revert EmptyTokenSymbol();
        }

        // Buat instance token baru
        Token newToken = new Token(
            initialOwner, 
            initialSupply, 
            tokenName, 
            tokenSymbol
        );
        
        newTokenAddress = address(newToken);
        
        // Simpan informasi token
        TokenInfo memory tokenInfo = TokenInfo({
            tokenAddress: newTokenAddress,
            owner: initialOwner,
            name: tokenName,
            symbol: tokenSymbol,
            initialSupply: initialSupply,
            createdAt: block.timestamp
        });

        // Update storage
        createdTokens.push(newTokenAddress);
        tokenInfos[newTokenAddress] = tokenInfo;
        tokensByOwner[initialOwner].push(newTokenAddress);
        totalTokensCreated++;
        
        // Emit events
        emit TokenCreated(
            initialOwner, 
            newTokenAddress, 
            tokenName, 
            tokenSymbol, 
            initialSupply,
            block.timestamp
        );

        emit FactoryStatsUpdated(totalTokensCreated);
        
        return newTokenAddress;
    }

    /**
     * @dev Fungsi untuk mendapatkan daftar semua token yang telah dibuat
     * @return Array alamat semua token
     */
    function getAllTokens() public view returns(address[] memory) {
        return createdTokens;
    }

    /**
     * @dev Fungsi untuk mendapatkan jumlah token yang telah dibuat
     * @return Jumlah token
     */
    function getTokensCount() public view returns(uint256) {
        return createdTokens.length;
    }

    /**
     * @dev Fungsi untuk mendapatkan token yang dibuat oleh owner tertentu
     * @param owner Alamat owner
     * @return Array alamat token yang dibuat oleh owner
     */
    function getTokensByOwner(address owner) public view returns(address[] memory) {
        return tokensByOwner[owner];
    }

    /**
     * @dev Fungsi untuk mendapatkan informasi lengkap token
     * @param tokenAddress Alamat token
     * @return TokenInfo Informasi lengkap token
     */
    function getTokenInfo(address tokenAddress) public view returns(TokenInfo memory) {
        return tokenInfos[tokenAddress];
    }

    /**
     * @dev Fungsi untuk mendapatkan multiple token info sekaligus
     * @param tokenAddresses Array alamat token
     * @return Array TokenInfo
     */
    function getMultipleTokenInfo(address[] memory tokenAddresses) 
        public 
        view 
        returns(TokenInfo[] memory) 
    {
        TokenInfo[] memory results = new TokenInfo[](tokenAddresses.length);
        
        for (uint256 i = 0; i < tokenAddresses.length; i++) {
            results[i] = tokenInfos[tokenAddresses[i]];
        }
        
        return results;
    }

    /**
     * @dev Fungsi untuk mendapatkan statistik factory
     * @return totalTokens Total token yang dibuat
     * @return totalUniqueOwners Total unique owners
     */
    function getFactoryStats() public view returns(
        uint256 totalTokens,
        uint256 totalUniqueOwners
    ) {
        totalTokens = totalTokensCreated;
        
        // Hitung unique owners (cara sederhana - bisa dioptimasi)
        address[] memory uniqueOwners = new address[](totalTokensCreated);
        uint256 uniqueCount = 0;
        
        for (uint256 i = 0; i < createdTokens.length; i++) {
            address tokenOwner = tokenInfos[createdTokens[i]].owner;
            bool isUnique = true;
            
            for (uint256 j = 0; j < uniqueCount; j++) {
                if (uniqueOwners[j] == tokenOwner) {
                    isUnique = false;
                    break;
                }
            }
            
            if (isUnique) {
                uniqueOwners[uniqueCount] = tokenOwner;
                uniqueCount++;
            }
        }
        
        totalUniqueOwners = uniqueCount;
        
        return (totalTokens, totalUniqueOwners);
    }

    /**
     * @dev Fungsi untuk cek apakah address adalah token yang dibuat oleh factory ini
     * @param tokenAddress Alamat yang akan dicek
     * @return bool True jika token dibuat oleh factory ini
     */
    function isTokenCreatedByFactory(address tokenAddress) public view returns(bool) {
        return tokenInfos[tokenAddress].tokenAddress != address(0);
    }
}
```

---

## 5. Testing Comprehensive

Buat file `test/TokenFactory.t.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "lib/forge-std/src/Test.sol";
import "../src/TokenFactory.sol";
import "../src/Token.sol";

contract TokenFactoryTest is Test {
    TokenFactory public tokenFactory;
    address public owner;
    address public user1;
    address public user2;
    
    // Konstanta untuk test
    string constant TOKEN_NAME = "Test Token";
    string constant TOKEN_SYMBOL = "TST";
    uint256 constant INITIAL_SUPPLY = 1000000; // 1 juta token
    
    // Events untuk testing
    event TokenCreated(
        address indexed owner, 
        address indexed tokenAddress, 
        string name,
        string symbol,
        uint256 initialSupply,
        uint256 timestamp
    );

    event FactoryStatsUpdated(uint256 totalTokens);

    // Setup sebelum setiap test case
    function setUp() public {
        // Setup test addresses
        owner = address(this);
        user1 = makeAddr("user1");
        user2 = makeAddr("user2");

        // Deploy TokenFactory
        tokenFactory = new TokenFactory();
    }

    // ============ DEPLOYMENT TESTS ============
    
    function test_ShouldDeployWithCorrectInitialState() public view {
        assertEq(tokenFactory.getTokensCount(), 0);
        assertEq(tokenFactory.totalTokensCreated(), 0);
        
        address[] memory allTokens = tokenFactory.getAllTokens();
        assertEq(allTokens.length, 0);
    }

    // ============ TOKEN CREATION TESTS ============
    
    function test_ShouldCreateTokenSuccessfully() public {
        // Buat token baru
        address newTokenAddress = tokenFactory.createToken(
            owner,
            INITIAL_SUPPLY,
            TOKEN_NAME,
            TOKEN_SYMBOL
        );

        // Verifikasi bahwa token telah dibuat
        assertTrue(newTokenAddress != address(0));
        assertEq(tokenFactory.getTokensCount(), 1);
        assertEq(tokenFactory.totalTokensCreated(), 1);

        // Verifikasi array
        address[] memory allTokens = tokenFactory.getAllTokens();
        assertEq(allTokens.length, 1);
        assertEq(allTokens[0], newTokenAddress);

        // Test token yang dibuat
        Token newToken = Token(newTokenAddress);
        assertEq(newToken.name(), TOKEN_NAME);
        assertEq(newToken.symbol(), TOKEN_SYMBOL);
        assertEq(newToken.decimals(), 18);
        assertEq(newToken.owner(), owner);

        // Verifikasi supply dan balance
        uint256 expectedSupply = INITIAL_SUPPLY * 10 ** 18;
        assertEq(newToken.totalSupply(), expectedSupply);
        assertEq(newToken.balanceOf(owner), expectedSupply);
    }

    function test_ShouldAllowMultipleUsersToCreateTokens() public {
        // User1 membuat token
        vm.prank(user1);
        address token1 = tokenFactory.createToken(
            user1,
            INITIAL_SUPPLY,
            "User1 Token",
            "UT1"
        );

        // User2 membuat token
        vm.prank(user2);
        address token2 = tokenFactory.createToken(
            user2,
            INITIAL_SUPPLY * 2,
            "User2 Token",
            "UT2"
        );

        // Verifikasi jumlah token
        assertEq(tokenFactory.getTokensCount(), 2);
        assertEq(tokenFactory.totalTokensCreated(), 2);

        // Test properties token
        Token userToken1 = Token(token1);
        Token userToken2 = Token(token2);

        assertEq(userToken1.name(), "User1 Token");
        assertEq(userToken2.name(), "User2 Token");
        assertEq(userToken1.owner(), user1);
        assertEq(userToken2.owner(), user2);

        // Verifikasi supply yang berbeda
        uint256 expectedSupply1 = INITIAL_SUPPLY * 10 ** 18;
        uint256 expectedSupply2 = (INITIAL_SUPPLY * 2) * 10 ** 18;

        assertEq(userToken1.totalSupply(), expectedSupply1);
        assertEq(userToken2.totalSupply(), expectedSupply2);
    }

    function test_ShouldTrackTokensByOwner() public {
        // User1 membuat 2 token
        vm.startPrank(user1);
        address token1 = tokenFactory.createToken(user1, 1000, "Token1", "TK1");
        address token2 = tokenFactory.createToken(user1, 2000, "Token2", "TK2");
        vm.stopPrank();

        // User2 membuat 1 token
        vm.prank(user2);
        address token3 = tokenFactory.createToken(user2, 3000, "Token3", "TK3");

        // Verifikasi tokens by owner
        address[] memory user1Tokens = tokenFactory.getTokensByOwner(user1);
        address[] memory user2Tokens = tokenFactory.getTokensByOwner(user2);

        assertEq(user1Tokens.length, 2);
        assertEq(user2Tokens.length, 1);

        assertEq(user1Tokens[0], token1);
        assertEq(user1Tokens[1], token2);
        assertEq(user2Tokens[0], token3);
    }

    // ============ VALIDATION TESTS ============
    
    function test_ShouldRevertWithZeroOwnerAddress() public {
        vm.expectRevert(TokenFactory.InvalidOwnerAddress.selector);
        tokenFactory.createToken(address(0), INITIAL_SUPPLY, TOKEN_NAME, TOKEN_SYMBOL);
    }

    function test_ShouldRevertWithZeroSupply() public {
        vm.expectRevert(TokenFactory.InvalidSupplyAmount.selector);
        tokenFactory.createToken(owner, 0, TOKEN_NAME, TOKEN_SYMBOL);
    }

    function test_ShouldRevertWithEmptyTokenName() public {
        vm.expectRevert(TokenFactory.EmptyTokenName.selector);
        tokenFactory.createToken(owner, INITIAL_SUPPLY, "", TOKEN_SYMBOL);
    }

    function test_ShouldRevertWithEmptyTokenSymbol() public {
        vm.expectRevert(TokenFactory.EmptyTokenSymbol.selector);
        tokenFactory.createToken(owner, INITIAL_SUPPLY, TOKEN_NAME, "");
    }

    // ============ TOKEN FUNCTIONALITY TESTS ============
    
    function test_ShouldBurnTokenSuccessfully() public {
        // Buat token
        address newTokenAddress = tokenFactory.createToken(
            owner,
            INITIAL_SUPPLY,
            TOKEN_NAME,
            TOKEN_SYMBOL
        );

        Token newToken = Token(newTokenAddress);
        
        // Cek balance awal
        uint256 initialBalance = newToken.balanceOf(owner);
        uint256 initialSupply = newToken.totalSupply();

        // Bakar token
        uint256 burnAmount = 1000;
        newToken.burnToken(burnAmount);

        // Verifikasi hasil
        uint256 burnAmountWei = burnAmount * 10 ** 18;
        assertEq(newToken.balanceOf(owner), initialBalance - burnAmountWei);
        assertEq(newToken.totalSupply(), initialSupply - burnAmountWei);
    }

    function test_ShouldRevertBurnFromNonOwner() public {
        // Buat token
        address newTokenAddress = tokenFactory.createToken(
            owner,
            INITIAL_SUPPLY,
            TOKEN_NAME,
            TOKEN_SYMBOL
        );

        Token newToken = Token(newTokenAddress);

        // User1 mencoba membakar token (seharusnya gagal)
        vm.prank(user1);
        vm.expectRevert();
        newToken.burnToken(1000);
    }

    function test_ShouldRevertBurnInsufficientBalance() public {
        // Buat token dengan supply kecil
        address newTokenAddress = tokenFactory.createToken(
            owner,
            100, // Hanya 100 token
            TOKEN_NAME,
            TOKEN_SYMBOL
        );

        Token newToken = Token(newTokenAddress);

        // Mencoba membakar lebih dari balance
        vm.expectRevert();
        newToken.burnToken(1000); // Lebih dari 100
    }

    // ============ QUERY FUNCTION TESTS ============
    
    function test_ShouldGetTokenInfoCorrectly() public {
        address newTokenAddress = tokenFactory.createToken(
            owner,
            INITIAL_SUPPLY,
            TOKEN_NAME,
            TOKEN_SYMBOL
        );

        TokenFactory.TokenInfo memory info = tokenFactory.getTokenInfo(newTokenAddress);
        
        assertEq(info.tokenAddress, newTokenAddress);
        assertEq(info.owner, owner);
        assertEq(info.name, TOKEN_NAME);
        assertEq(info.symbol, TOKEN_SYMBOL);
        assertEq(info.initialSupply, INITIAL_SUPPLY);
        assertEq(info.createdAt, block.timestamp);
    }

    function test_ShouldGetFactoryStatsCorrectly() public {
        // Buat beberapa token dengan owners berbeda
        tokenFactory.createToken(owner, 1000, "Token1", "TK1");
        
        vm.prank(user1);
        tokenFactory.createToken(user1, 2000, "Token2", "TK2");
        
        vm.prank(user2);
        tokenFactory.createToken(user2, 3000, "Token3", "TK3");

        (uint256 totalTokens, uint256 totalUniqueOwners) = tokenFactory.getFactoryStats();
        
        assertEq(totalTokens, 3);
        assertEq(totalUniqueOwners, 3);
    }

    function test_ShouldCheckTokenCreatedByFactory() public {
        address newTokenAddress = tokenFactory.createToken(
            owner,
            INITIAL_SUPPLY,
            TOKEN_NAME,
            TOKEN_SYMBOL
        );

        assertTrue(tokenFactory.isTokenCreatedByFactory(newTokenAddress));
        assertFalse(tokenFactory.isTokenCreatedByFactory(address(0x123)));
    }

    // ============ TOKEN INFO FUNCTIONS TESTS ============
    
    function test_ShouldGetTokenInfoFromToken() public {
        address newTokenAddress = tokenFactory.createToken(
            owner,
            INITIAL_SUPPLY,
            TOKEN_NAME,
            TOKEN_SYMBOL
        );

        Token newToken = Token(newTokenAddress);
        (
            string memory name,
            string memory symbol,
            uint8 decimals,
            uint256 totalSupply,
            address tokenOwner
        ) = newToken.getTokenInfo();

        assertEq(name, TOKEN_NAME);
        assertEq(symbol, TOKEN_SYMBOL);
        assertEq(decimals, 18);
        assertEq(totalSupply, INITIAL_SUPPLY * 10 ** 18);
        assertEq(tokenOwner, owner);
    }

    function test_ShouldCheckIsOwner() public {
        address newTokenAddress = tokenFactory.createToken(
            owner,
            INITIAL_SUPPLY,
            TOKEN_NAME,
            TOKEN_SYMBOL
        );

        Token newToken = Token(newTokenAddress);
        
        assertTrue(newToken.isOwner(owner));
        assertFalse(newToken.isOwner(user1));
        assertFalse(newToken.isOwner(user2));
    }

    // ============ FUZZ TESTS ============
    
    function testFuzz_CreateTokenWithDifferentSupplies(uint256 supply) public {
        vm.assume(supply > 0 && supply <= 1e12); // Reasonable range
        
        address newTokenAddress = tokenFactory.createToken(
            owner,
            supply,
            TOKEN_NAME,
            TOKEN_SYMBOL
        );

        Token newToken = Token(newTokenAddress);
        uint256 expectedSupply = supply * 10 ** 18;
        
        assertEq(newToken.totalSupply(), expectedSupply);
        assertEq(newToken.balanceOf(owner), expectedSupply);
    }

    function testFuzz_BurnTokenWithDifferentAmounts(uint256 burnAmount) public {
        // Setup
        address newTokenAddress = tokenFactory.createToken(
            owner,
            INITIAL_SUPPLY,
            TOKEN_NAME,
            TOKEN_SYMBOL
        );

        Token newToken = Token(newTokenAddress);
        
        // Bound burn amount to reasonable range
        burnAmount = bound(burnAmount, 1, INITIAL_SUPPLY);
        
        uint256 initialBalance = newToken.balanceOf(owner);
        uint256 initialSupply = newToken.totalSupply();
        
        // Burn tokens
        newToken.burnToken(burnAmount);
        
        uint256 burnAmountWei = burnAmount * 10 ** 18;
        assertEq(newToken.balanceOf(owner), initialBalance - burnAmountWei);
        assertEq(newToken.totalSupply(), initialSupply - burnAmountWei);
    }

    // ============ GAS TESTS ============
    
    function test_CreateTokenGasUsage() public {
        uint256 gasBefore = gasleft();
        
        tokenFactory.createToken(
            owner,
            INITIAL_SUPPLY,
            TOKEN_NAME,
            TOKEN_SYMBOL
        );
        
        uint256 gasUsed = gasBefore - gasleft();
        
        console.log("Gas used for createToken:", gasUsed);
        
        // Token creation should be reasonably efficient
        assertLt(gasUsed, 3000000); // Less than 3M gas
    }

    function test_BurnTokenGasUsage() public {
        address newTokenAddress = tokenFactory.createToken(
            owner,
            INITIAL_SUPPLY,
            TOKEN_NAME,
            TOKEN_SYMBOL
        );

        Token newToken = Token(newTokenAddress);
        
        uint256 gasBefore = gasleft();
        newToken.burnToken(1000);
        uint256 gasUsed = gasBefore - gasleft();
        
        console.log("Gas used for burnToken:", gasUsed);
        
        // Burn should be efficient
        assertLt(gasUsed, 100000); // Less than 100k gas
    }

    // ============ INTEGRATION TESTS ============
    
    function test_CompleteTokenLifecycle() public {
        // 1. Create token
        address tokenAddr = tokenFactory.createToken(
            owner,
            INITIAL_SUPPLY,
            TOKEN_NAME,
            TOKEN_SYMBOL
        );

        Token token = Token(tokenAddr);
        
        // 2. Verify initial state
        assertEq(token.totalSupply(), INITIAL_SUPPLY * 10 ** 18);
        assertEq(token.balanceOf(owner), INITIAL_SUPPLY * 10 ** 18);
        
        // 3. Burn some tokens
        uint256 burnAmount = 100000;
        token.burnToken(burnAmount);
        
        // 4. Verify final state
        uint256 expectedFinalSupply = (INITIAL_SUPPLY - burnAmount) * 10 ** 18;
        assertEq(token.totalSupply(), expectedFinalSupply);
        assertEq(token.balanceOf(owner), expectedFinalSupply);
        
        // 5. Verify factory tracking
        assertTrue(tokenFactory.isTokenCreatedByFactory(tokenAddr));
        assertEq(tokenFactory.getTokensCount(), 1);
    }

    function test_MultipleTokensManagement() public {
        address[] memory tokens = new address[](5);
        
        // Create multiple tokens
        for (uint256 i = 0; i < 5; i++) {
            tokens[i] = tokenFactory.createToken(
                owner,
                1000 * (i + 1),
                string(abi.encodePacked("Token", vm.toString(i))),
                string(abi.encodePacked("TK", vm.toString(i)))
            );
        }
        
        // Verify all tokens are tracked
        assertEq(tokenFactory.getTokensCount(), 5);
        address[] memory allTokens = tokenFactory.getAllTokens();
        
        for (uint256 i = 0; i < 5; i++) {
            assertEq(allTokens[i], tokens[i]);
            
            Token token = Token(tokens[i]);
            assertEq(token.totalSupply(), 1000 * (i + 1) * 10 ** 18);
        }
    }
}
```

---

## 6. Script Deployment

### Script untuk Deploy TokenFactory

Buat file `script/DeployTokenFactory.s.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "lib/forge-std/src/Script.sol";
import {TokenFactory} from "../src/TokenFactory.sol";

contract DeployTokenFactory is Script {
    TokenFactory public tokenFactory;

    function setUp() public {}

    function run() public returns (TokenFactory, address) {
        console.log("Starting TokenFactory deployment to Monad Testnet...\n");

        // Get deployer account from private key
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        console.log("Deployment Details:");
        console.log("Deployer address:", deployer);
        
        // Check balance
        uint256 balance = deployer.balance;
        console.log("Deployer balance:", balance / 1e18, "MON");
        
        if (balance < 0.05 ether) {
            console.log("Warning: Low balance. TokenFactory deployment requires more gas than simple contracts.");
        }

        // Get network info
        console.log("Network: Monad Testnet");
        console.log("Chain ID: 10143");
        console.log("RPC URL: https://testnet-rpc.monad.xyz/\n");

        // Start broadcasting transactions
        vm.startBroadcast(deployerPrivateKey);

        console.log("Deploying TokenFactory contract...");
        
        // Deploy TokenFactory
        tokenFactory = new TokenFactory();
        address contractAddress = address(tokenFactory);

        vm.stopBroadcast();

        console.log("TokenFactory deployed successfully!");
        console.log("Contract address:", contractAddress);
        console.log("Block explorer:", string.concat("https://testnet.monadexplorer.com/address/", _addressToString(contractAddress)));

        // Verify initial state
        console.log("Verifying initial contract state...");
        uint256 tokenCount = tokenFactory.getTokensCount();
        uint256 totalCreated = tokenFactory.totalTokensCreated();

        console.log("Initial token count:", tokenCount);
        console.log("Total tokens created:", totalCreated);
        
        // Get factory stats
        (uint256 totalTokens, uint256 totalUniqueOwners) = tokenFactory.getFactoryStats();
        console.log("Factory total tokens:", totalTokens);
        console.log("Factory unique owners:", totalUniqueOwners);

        // Provide next steps
        console.log("Next Steps:");
        console.log("1. Save the TokenFactory address for creating tokens");
        console.log("2. Verify the contract on block explorer");
        console.log("3. Create your first token using the factory");
        console.log("4. Test token functionality");

        // Save deployment info
        _saveDeploymentInfo(contractAddress, deployer);

        return (tokenFactory, contractAddress);
    }

    function _saveDeploymentInfo(address contractAddress, address deployer) internal {
        string memory deploymentInfo = string.concat(
            "{\n",
            '  "contractName": "TokenFactory",\n',
            '  "contractAddress": "', _addressToString(contractAddress), '",\n',
            '  "deployerAddress": "', _addressToString(deployer), '",\n',
            '  "network": "Monad Testnet",\n',
            '  "chainId": "10143",\n',
            '  "blockExplorer": "https://testnet.monadexplorer.com/address/', _addressToString(contractAddress), '",\n',
            '  "timestamp": "', _getTimestamp(), '",\n',
            '  "version": "1.0.0"\n',
            "}"
        );

        // Create deployments directory and write file
        string[] memory mkdirCmd = new string[](3);
        mkdirCmd[0] = "mkdir";
        mkdirCmd[1] = "-p";
        mkdirCmd[2] = "./deployments";
        vm.ffi(mkdirCmd);

        // Write deployment info to file
        vm.writeFile("./deployments/tokenfactory-monad-testnet.json", deploymentInfo);
        console.log("Deployment info saved to: deployments/tokenfactory-monad-testnet.json");
    }

    function _addressToString(address _addr) internal pure returns (string memory) {
        bytes32 value = bytes32(uint256(uint160(_addr)));
        bytes memory alphabet = "0123456789abcdef";
        bytes memory str = new bytes(42);
        str[0] = "0";
        str[1] = "x";
        for (uint256 i = 0; i < 20; i++) {
            str[2 + i * 2] = alphabet[uint8(value[i + 12] >> 4)];
            str[3 + i * 2] = alphabet[uint8(value[i + 12] & 0x0f)];
        }
        return string(str);
    }

    function _getTimestamp() internal view returns (string memory) {
        return vm.toString(block.number);
    }
}
```

### Script untuk Create Token

Buat file `script/CreateToken.s.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "lib/forge-std/src/Script.sol";
import {TokenFactory} from "../src/TokenFactory.sol";
import {Token} from "../src/Token.sol";

contract CreateToken is Script {
    // Configuration - Update these values
    address constant FACTORY_ADDRESS = 0x7BF619A8Ad20B0f44ce4Bdf601f56A64679fFD28; // Update with your deployed factory
    string constant TOKEN_NAME = "REVO Token";
    string constant TOKEN_SYMBOL = "RVO";
    uint256 constant INITIAL_SUPPLY = 1000000; // 1 million tokens

    function setUp() public {}

    function run() public returns (address) {
        console.log("Creating new token via TokenFactory...\n");

        // Get deployer account
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        console.log("Token Creation Details:");
        console.log("Owner address:", deployer);
        console.log("Token name:", TOKEN_NAME);
        console.log("Token symbol:", TOKEN_SYMBOL);
        console.log("Initial supply:", INITIAL_SUPPLY, "tokens\n");

        // Connect to factory
        TokenFactory factory = TokenFactory(FACTORY_ADDRESS);

        // Start broadcasting
        vm.startBroadcast(deployerPrivateKey);

        console.log("Creating token...");
        address newTokenAddress = factory.createToken(
            deployer,
            INITIAL_SUPPLY,
            TOKEN_NAME,
            TOKEN_SYMBOL
        );

        vm.stopBroadcast();

        console.log("Token created successfully!");
        console.log("Token address:", newTokenAddress);
        console.log("Block explorer:", string.concat("https://testnet.monadexplorer.com/address/", _addressToString(newTokenAddress)));

        // Verify token properties
        console.log("Verifying token properties...");
        Token newToken = Token(newTokenAddress);
        
        (
            string memory name,
            string memory symbol,
            uint8 decimals,
            uint256 totalSupply,
            address owner
        ) = newToken.getTokenInfo();

        console.log("Name:", name);
        console.log("Symbol:", symbol);
        console.log("Decimals:", decimals);
        console.log("Total Supply:", totalSupply / 10**decimals, symbol);
        console.log("Owner:", owner);

        // Get factory stats
        console.log("Factory Statistics:");
        uint256 tokenCount = factory.getTokensCount();
        (uint256 totalTokens, uint256 uniqueOwners) = factory.getFactoryStats();
        
        console.log("Total tokens in factory:", tokenCount);
        console.log("Factory total tokens:", totalTokens);
        console.log("Unique token owners:", uniqueOwners);

        // Save token info
        _saveTokenInfo(newTokenAddress, deployer);

        return newTokenAddress;
    }

    function _saveTokenInfo(address tokenAddress, address deployer) internal {
        string memory tokenInfo = string.concat(
            "{\n",
            '  "tokenName": "', TOKEN_NAME, '",\n',
            '  "tokenSymbol": "', TOKEN_SYMBOL, '",\n',
            '  "tokenAddress": "', _addressToString(tokenAddress), '",\n',
            '  "ownerAddress": "', _addressToString(deployer), '",\n',
            '  "factoryAddress": "', _addressToString(FACTORY_ADDRESS), '",\n',
            '  "initialSupply": "', vm.toString(INITIAL_SUPPLY), '",\n',
            '  "network": "Monad Testnet",\n',
            '  "chainId": "10143",\n',
            '  "blockExplorer": "https://testnet.monadexplorer.com/address/', _addressToString(tokenAddress), '",\n',
            '  "timestamp": "', _getTimestamp(), '"\n',
            "}"
        );

        // Write token info to file
        string memory filename = string.concat("./deployments/token-", TOKEN_SYMBOL, "-monad-testnet.json");
        vm.writeFile(filename, tokenInfo);
        console.log(string.concat("Token info saved to: deployments/token-", TOKEN_SYMBOL, "-monad-testnet.json"));
    }

    function _addressToString(address _addr) internal pure returns (string memory) {
        bytes32 value = bytes32(uint256(uint160(_addr)));
        bytes memory alphabet = "0123456789abcdef";
        bytes memory str = new bytes(42);
        str[0] = "0";
        str[1] = "x";
        for (uint256 i = 0; i < 20; i++) {
            str[2 + i * 2] = alphabet[uint8(value[i + 12] >> 4)];
            str[3 + i * 2] = alphabet[uint8(value[i + 12] & 0x0f)];
        }
        return string(str);
    }

    function _getTimestamp() internal view returns (string memory) {
        return vm.toString(block.number);
    }
}
```

---

## 7. Script Interaksi

### Script untuk Interact dengan Token

Buat file `script/InteractToken.s.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "lib/forge-std/src/Script.sol";
import {Token} from "../src/Token.sol";

contract InteractToken is Script {
    // Update with your token address
    address constant TOKEN_ADDRESS = 0x58D07200a634D8927ab6DB17981e354fC90275e0;

    function setUp() public {}

    function run() public {
        console.log("Interacting with Token contract...\n");

        // Get deployer account
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        console.log("Interaction Details:");
        console.log("Token address:", TOKEN_ADDRESS);
        console.log("User address:", deployer);

        // Connect to token
        Token token = Token(TOKEN_ADDRESS);

        // Get token info
        console.log("Token Information:");
        (
            string memory name,
            string memory symbol,
            uint8 decimals,
            uint256 totalSupply,
            address owner
        ) = token.getTokenInfo();

        console.log("Name:", name);
        console.log("Symbol:", symbol);
        console.log("Decimals:", decimals);
        console.log("Total Supply:", totalSupply / 10**decimals, symbol);
        console.log("Owner:", owner);
        console.log("Is deployer owner:", token.isOwner(deployer));

        // Check balance
        uint256 balance = token.balanceOf(deployer);
        console.log("Balance Information:");
        console.log("Raw balance (wei):", balance);
        console.log("Formatted balance:", balance / 10**decimals, symbol);

        // Perform burn operation if owner
        if (token.isOwner(deployer) && balance > 0) {
            uint256 burnAmount = 500; // Burn 500 tokens
            uint256 burnAmountWei = burnAmount * 10**decimals;

            if (balance >= burnAmountWei) {
                console.log("Burning tokens...");
                console.log("Burn amount:", burnAmount, symbol);

                vm.startBroadcast(deployerPrivateKey);
                token.burnToken(burnAmount);
                vm.stopBroadcast();

                console.log("Tokens burned successfully!");

                // Check updated balances
                uint256 newBalance = token.balanceOf(deployer);
                uint256 newTotalSupply = token.totalSupply();

                console.log("Updated Information:");
                console.log("New balance:", newBalance / 10**decimals, symbol);
                console.log("New total supply:", newTotalSupply / 10**decimals, symbol);
                console.log("Tokens burned:", (balance - newBalance) / 10**decimals, symbol);
            } else {
                console.log("Insufficient balance for burning");
            }
        } else if (!token.isOwner(deployer)) {
            console.log("You are not the owner of this token");
        } else {
            console.log("No balance to burn");
        }
    }
}
```

### Script untuk Factory Management

Buat file `script/ManageFactory.s.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "lib/forge-std/src/Script.sol";
import {TokenFactory} from "../src/TokenFactory.sol";
import {Token} from "../src/Token.sol";

contract ManageFactory is Script {
    // Update with your factory address
    address constant FACTORY_ADDRESS = 0x7BF619A8Ad20B0f44ce4Bdf601f56A64679fFD28;

    function setUp() public {}

    function run() public {
        console.log("Managing TokenFactory...\n");

        // Get deployer account
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        console.log("Factory Management:");
        console.log("Factory address:", FACTORY_ADDRESS);
        console.log("Manager address:", deployer);

        // Connect to factory
        TokenFactory factory = TokenFactory(FACTORY_ADDRESS);

        // Get factory statistics
        console.log("Factory Statistics:");
        uint256 tokenCount = factory.getTokensCount();
        uint256 totalCreated = factory.totalTokensCreated();
        (uint256 totalTokens, uint256 uniqueOwners) = factory.getFactoryStats();

        console.log("Token count:", tokenCount);
        console.log("Total created:", totalCreated);
        console.log("Factory total tokens:", totalTokens);
        console.log("Unique owners:", uniqueOwners);

        // Get all tokens
        address[] memory allTokens = factory.getAllTokens();
        console.log("All Tokens Created:");
        
        for (uint256 i = 0; i < allTokens.length; i++) {
            console.log(string.concat("Token ", vm.toString(i + 1), ":"));
            
            TokenFactory.TokenInfo memory info = factory.getTokenInfo(allTokens[i]);
            console.log(string.concat("Address: ", _addressToString(info.tokenAddress)));
            console.log(string.concat("Name: ", info.name));
            console.log(string.concat("Symbol: ", info.symbol));
            console.log(string.concat("Owner: ", _addressToString(info.owner)));
            console.log(string.concat("Initial Supply: ", vm.toString(info.initialSupply)));
            console.log(string.concat("Created At: ", vm.toString(info.createdAt)));
            
            // Get current token state
            Token token = Token(info.tokenAddress);
            uint256 currentSupply = token.totalSupply();
            console.log(string.concat("Current Supply: ", vm.toString(currentSupply / 10**18), " ", info.symbol));
        }

        // Get tokens by current user
        address[] memory userTokens = factory.getTokensByOwner(deployer);
        console.log(string.concat("Your Tokens (", vm.toString(userTokens.length), " total):"));
        
        for (uint256 i = 0; i < userTokens.length; i++) {
            TokenFactory.TokenInfo memory info = factory.getTokenInfo(userTokens[i]);
            console.log(string.concat("", info.name, " (", info.symbol, ")"));
            console.log(string.concat("Address: ", _addressToString(userTokens[i])));
        }

        // Demonstrate batch token info query
        if (allTokens.length > 0) {
            console.log("Batch Token Info Query:");
            TokenFactory.TokenInfo[] memory batchInfo = factory.getMultipleTokenInfo(allTokens);
            
            for (uint256 i = 0; i < batchInfo.length; i++) {
                console.log(string.concat("", batchInfo[i].name, " - Supply: ", vm.toString(batchInfo[i].initialSupply)));
            }
        }

        console.log("Factory management completed!");
    }

    function _addressToString(address _addr) internal pure returns (string memory) {
        bytes32 value = bytes32(uint256(uint160(_addr)));
        bytes memory alphabet = "0123456789abcdef";
        bytes memory str = new bytes(42);
        str[0] = "0";
        str[1] = "x";
        for (uint256 i = 0; i < 20; i++) {
            str[2 + i * 2] = alphabet[uint8(value[i + 12] >> 4)];
            str[3 + i * 2] = alphabet[uint8(value[i + 12] & 0x0f)];
        }
        return string(str);
    }
}
```

---

## 8. Deployment ke Monad Testnet

### Setup Wallet dan Environment

```bash
# Setup wallet
cast wallet import monad-deployer --private-key $(cast wallet new | grep 'Private key:' | awk '{print $3}')

# Check balance
cast balance $(cast wallet address --account monad-deployer) --rpc-url https://testnet-rpc.monad.xyz/

# Get MON from faucet if needed
# Visit: https://faucet.testnet.monad.xyz/
```

### Build dan Test

```bash
# Install dependencies
forge install

# Build contracts
forge build

# Run tests
forge test

# Run tests with gas report
forge test --gas-report

# Run specific test
forge test --match-test test_ShouldCreateTokenSuccessfully -vvv
```

### Deploy TokenFactory

```bash
# Method 1: Simple deployment
forge create src/TokenFactory.sol:TokenFactory \
  --account monad-deployer \
  --rpc-url https://testnet-rpc.monad.xyz/ \
  --broadcast

# Method 2: Script deployment (Recommended)
export PRIVATE_KEY=$(cast wallet private-key --account monad-deployer)

forge script script/DeployTokenFactory.s.sol \
  --rpc-url https://testnet-rpc.monad.xyz/ \
  --broadcast \
  --account monad-deployer
```

### Create Token via Factory

```bash
# Update FACTORY_ADDRESS in CreateToken.s.sol with deployed address

forge script script/CreateToken.s.sol \
  --rpc-url https://testnet-rpc.monad.xyz/ \
  --broadcast \
  --account monad-deployer
```

---

## 9. Verifikasi dan Interaksi

### Verifikasi Contracts

```bash
# Verify TokenFactory
forge verify-contract \
  <FACTORY_ADDRESS> \
  src/TokenFactory.sol:TokenFactory \
  --chain 10143 \
  --verifier sourcify \
  --verifier-url https://sourcify-api-monad.blockvision.org

# Verify Token (created by factory)
forge verify-contract \
  <TOKEN_ADDRESS> \
  src/Token.sol:Token \
  --chain 10143 \
  --verifier sourcify \
  --verifier-url https://sourcify-api-monad.blockvision.org \
  --constructor-args $(cast abi-encode "constructor(address,uint256,string,string)" <OWNER> <SUPPLY> "<NAME>" "<SYMBOL>")
```

### Interaksi dengan Cast

```bash
# Set addresses
export FACTORY_ADDRESS=0xYourFactoryAddress
export TOKEN_ADDRESS=0xYourTokenAddress
export RPC_URL="https://testnet-rpc.monad.xyz/"

# Factory interactions
cast call $FACTORY_ADDRESS "getTokensCount()" --rpc-url $RPC_URL | cast to-dec
cast call $FACTORY_ADDRESS "totalTokensCreated()" --rpc-url $RPC_URL | cast to-dec
cast call $FACTORY_ADDRESS "getAllTokens()" --rpc-url $RPC_URL

# Create new token
cast send $FACTORY_ADDRESS "createToken(address,uint256,string,string)" \
  $(cast wallet address --account monad-deployer) \
  500000 \
  "My Token" \
  "MTK" \
  --account monad-deployer \
  --rpc-url $RPC_URL

# Token interactions
cast call $TOKEN_ADDRESS "name()" --rpc-url $RPC_URL | cast parse-bytes32-string
cast call $TOKEN_ADDRESS "symbol()" --rpc-url $RPC_URL | cast parse-bytes32-string
cast call $TOKEN_ADDRESS "totalSupply()" --rpc-url $RPC_URL | cast to-dec
cast call $TOKEN_ADDRESS "balanceOf(address)" $(cast wallet address --account monad-deployer) --rpc-url $RPC_URL | cast to-dec

# Burn tokens (owner only)
cast send $TOKEN_ADDRESS "burnToken(uint256)" 1000 \
  --account monad-deployer \
  --rpc-url $RPC_URL

# Get token info
cast call $TOKEN_ADDRESS "getTokenInfo()" --rpc-url $RPC_URL
```

### Script Interactions

```bash
# Interact with token
forge script script/InteractToken.s.sol \
  --rpc-url https://testnet-rpc.monad.xyz/ \
  --broadcast \
  --account monad-deployer

# Manage factory
forge script script/ManageFactory.s.sol \
  --rpc-url https://testnet-rpc.monad.xyz/ \
  --account monad-deployer
```

---

## 10. Advanced Features

### Factory Upgrade Pattern

Untuk production use, pertimbangkan implementasi upgrade pattern:

```solidity
// src/TokenFactoryV2.sol
contract TokenFactoryV2 is TokenFactory {
    // New features
    mapping(address => bool) public isTokenPaused;
    
    event TokenPaused(address indexed token, bool paused);
    
    function pauseToken(address tokenAddress, bool pause) external {
        require(isTokenCreatedByFactory(tokenAddress), "Token not from factory");
        // Add pause logic
        isTokenPaused[tokenAddress] = pause;
        emit TokenPaused(tokenAddress, pause);
    }
}
```

### Fee Collection System

```solidity
// Add to TokenFactory.sol
uint256 public creationFee = 0.001 ether;
address public feeCollector;

modifier paysFee() {
    require(msg.value >= creationFee, "Insufficient fee");
    _;
}

function createToken(...) public payable paysFee returns (address) {
    // Send fee to collector
    if (creationFee > 0) {
        (bool success, ) = feeCollector.call{value: creationFee}("");
        require(success, "Fee transfer failed");
    }
    
    // Rest of function...
}
```

### Token Templates

```solidity
// src/templates/
contract DeflatinaryToken is Token {
    uint256 public burnRate = 100; // 1% per transaction
    
    function _transfer(address from, address to, uint256 amount) internal override {
        uint256 burnAmount = (amount * burnRate) / 10000;
        super._transfer(from, to, amount - burnAmount);
        _burn(from, burnAmount);
    }
}
```

### Analytics dan Monitoring

```bash
# Create monitoring script
# script/Analytics.s.sol

function getFactoryAnalytics() public view returns (
    uint256 totalTokens,
    uint256 totalSupply,
    address mostActiveCreator,
    uint256 averageTokenSize
) {
    // Implementation for analytics
}
```

---

## Kesimpulan

Selamat! Anda telah berhasil membangun sistem TokenFactory ERC20 yang comprehensive menggunakan Foundry. Tutorial ini mencakup:

### ✅ Yang Telah Dipelajari

1. **Factory Pattern Implementation** - Membuat factory untuk token creation yang scalable
2. **OpenZeppelin Integration** - Menggunakan battle-tested libraries untuk security
3. **Comprehensive Testing** - Testing dengan Solidity native, fuzz tests, dan integration tests
4. **Professional Scripts** - Deployment dan interaction scripts yang robust
5. **Gas Optimization** - Custom errors dan efficient storage patterns
6. **Event Management** - Comprehensive event logging untuk transparency
7. **Advanced Querying** - Batch operations dan analytics functions

### 🚀 Keunggulan sistem ini:

- **Scalable**: Factory pattern memungkinkan creation token tanpa batas
- **Secure**: Menggunakan OpenZeppelin dan comprehensive validation
- **Efficient**: Custom errors dan optimized storage layout
- **Trackable**: Complete tracking dan analytics untuk semua tokens
- **Flexible**: Support untuk berbagai token configurations
- **Professional**: Production-ready dengan proper testing dan documentation

### 🎯 Use Cases:

1. **Launchpad Platform** - Platform untuk project launching tokens
2. **DAO Governance** - Creation tokens untuk voting systems
3. **Gaming Economics** - In-game token creation systems
4. **DeFi Protocols** - Dynamic token creation untuk liquidity pools
5. **NFT Projects** - Utility tokens untuk NFT ecosystems

TokenFactory system ini provides foundation yang solid untuk building advanced token economies di Monad ecosystem! 🌟