# TokenFactory dengan Foundry di 0G Network

Dokumentasi lengkap untuk membuat TokenFactory smart contract menggunakan Foundry di 0G Network Testnet. Tutorial ini akan mengajarkan cara menggunakan toolkit Foundry untuk pengembangan smart contract yang memungkinkan user membuat token ERC20 mereka sendiri di 0G Network.

## Daftar Isi

1. [Instalasi Foundry](#1-instalasi-foundry)
2. [Setup Proyek dengan 0G Network](#2-setup-proyek-dengan-0g-network)
3. [Membuat Smart Contract TokenFactory](#3-membuat-smart-contract-tokenfactory)
4. [Testing dengan Foundry](#4-testing-dengan-foundry)
5. [Script Deployment](#5-script-deployment)
6. [Wallet Management dengan Cast](#6-wallet-management-dengan-cast)
7. [Deployment ke 0G Network](#7-deployment-ke-0g-network)
8. [Interaksi dengan Contract](#8-interaksi-dengan-contract)

---

## 1. Instalasi Foundry

Foundry adalah toolkit yang sangat cepat dan portable untuk pengembangan smart contract Ethereum yang ditulis dalam Rust.

### Untuk macOS

1. **Jalankan script instalasi Foundryup:**
   ```bash
   curl -L https://foundry.paradigm.xyz | bash
   ```

2. **Install package libusb:**
   ```bash
   brew install libusb
   ```

3. **Restart terminal dan install Foundry:**
   ```bash
   source ~/.zshrc
   foundryup
   ```

4. **Verifikasi instalasi:**
   ```bash
   forge --version
   cast --version
   anvil --version
   ```

### Untuk Windows (dengan WSL)

1. **Install WSL:**
   ```powershell
   # Jalankan di PowerShell sebagai Administrator
   wsl --install -d Ubuntu-22.04
   ```

2. **Install Foundry di WSL:**
   ```bash
   curl -L https://foundry.paradigm.xyz | bash
   source ~/.bashrc
   foundryup
   ```

---

## 2. Setup Proyek dengan 0G Network

### Membuat Proyek Baru

```bash
# Buat proyek baru
forge init token-factory-0g

# Masuk ke direktori proyek
cd token-factory-0g
```

### Konfigurasi foundry.toml

Edit file `foundry.toml` untuk mengkonfigurasi 0G Network:

```toml
[profile.default]
src = "src"
out = "out"
libs = ["lib"]
solc = "0.8.26"
optimizer = true
optimizer_runs = 200

[rpc_endpoints]
og_galileo = "https://evmrpc-testnet.0g.ai"

[profile.production]
optimizer = true
optimizer_runs = 1000
```

---

## 3. Membuat Smart Contract TokenFactory

### Membuat Token ERC20 Contract

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

### Membuat TokenFactory Contract

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

### Install Dependencies

```bash
# Install OpenZeppelin contracts
forge install OpenZeppelin/openzeppelin-contracts
```

### Kompilasi Contracts

```bash
forge build
```

---

## 4. Testing dengan Foundry

### Membuat File Test

Buat file `test/TokenFactory.t.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "lib/forge-std/src/Test.sol";
import "../src/TokenFactory.sol";
import "../src/Token.sol";

contract TokenFactoryTest is Test {
    TokenFactory public factory;
    address public user1;
    address public user2;
    
    event TokenCreated(
        address indexed owner, 
        address indexed tokenAddress, 
        string name,
        string symbol,
        uint256 initialSupply,
        uint256 timestamp
    );
    
    function setUp() public {
        user1 = makeAddr("user1");
        user2 = makeAddr("user2");
        
        // Deploy factory
        factory = new TokenFactory();
    }
    
    function test_Deployment() public view {
        assertEq(factory.getTokensCount(), 0);
        assertEq(factory.totalTokensCreated(), 0);
    }
    
    function test_CreateTokenSuccess() public {
        address tokenAddr = factory.createToken(
            user1,
            1000000,
            "Test Token",
            "TEST"
        );
        
        // Verify token creation
        assertTrue(tokenAddr != address(0));
        assertTrue(factory.isTokenCreatedByFactory(tokenAddr));
        assertEq(factory.getTokensCount(), 1);
        assertEq(factory.totalTokensCreated(), 1);
        
        // Verify user tokens
        address[] memory userTokens = factory.getTokensByOwner(user1);
        assertEq(userTokens.length, 1);
        assertEq(userTokens[0], tokenAddr);
        
        // Verify token properties
        Token token = Token(tokenAddr);
        assertEq(token.name(), "Test Token");
        assertEq(token.symbol(), "TEST");
        assertEq(token.decimals(), 18);
        assertEq(token.totalSupply(), 1000000 * 10**18);
        assertEq(token.owner(), user1);
        assertEq(token.balanceOf(user1), 1000000 * 10**18);
    }
    
    function test_CreateTokenZeroAddress() public {
        vm.expectRevert(TokenFactory.InvalidOwnerAddress.selector);
        factory.createToken(
            address(0),
            1000000,
            "Test Token",
            "TEST"
        );
    }
    
    function test_CreateTokenInvalidParameters() public {
        // Empty name
        vm.expectRevert(TokenFactory.EmptyTokenName.selector);
        factory.createToken(
            user1,
            1000000,
            "",
            "TEST"
        );
        
        // Empty symbol
        vm.expectRevert(TokenFactory.EmptyTokenSymbol.selector);
        factory.createToken(
            user1,
            1000000,
            "Test Token",
            ""
        );
        
        // Zero supply
        vm.expectRevert(TokenFactory.InvalidSupplyAmount.selector);
        factory.createToken(
            user1,
            0,
            "Test Token",
            "TEST"
        );
    }
    
    function test_MultipleTokenCreation() public {
        // User1 creates 2 tokens
        address token1 = factory.createToken(
            user1,
            1000000,
            "Token One",
            "TOK1"
        );
        
        address token2 = factory.createToken(
            user1,
            500000,
            "Token Two",
            "TOK2"
        );
        
        // User2 creates 1 token
        address token3 = factory.createToken(
            user2,
            2000000,
            "Token Three",
            "TOK3"
        );
        
        // Verify counts
        assertEq(factory.getTokensCount(), 3);
        assertEq(factory.totalTokensCreated(), 3);
        
        // Verify user token lists
        address[] memory user1Tokens = factory.getTokensByOwner(user1);
        assertEq(user1Tokens.length, 2);
        assertEq(user1Tokens[0], token1);
        assertEq(user1Tokens[1], token2);
        
        address[] memory user2Tokens = factory.getTokensByOwner(user2);
        assertEq(user2Tokens.length, 1);
        assertEq(user2Tokens[0], token3);
    }
    
    function test_GetTokenInfo() public {
        address tokenAddr = factory.createToken(
            user1,
            750000,
            "Info Token",
            "INFO"
        );
        
        TokenFactory.TokenInfo memory tokenInfo = factory.getTokenInfo(tokenAddr);
        
        assertEq(tokenInfo.name, "Info Token");
        assertEq(tokenInfo.symbol, "INFO");
        assertEq(tokenInfo.initialSupply, 750000);
        assertEq(tokenInfo.owner, user1);
        assertEq(tokenInfo.tokenAddress, tokenAddr);
    }
    
    function test_GetFactoryStats() public {
        // Create some tokens
        factory.createToken(user1, 1000000, "Token1", "TOK1");
        factory.createToken(user2, 500000, "Token2", "TOK2");
        factory.createToken(user1, 2000000, "Token3", "TOK3");
        
        (uint256 totalTokens, uint256 totalUniqueOwners) = factory.getFactoryStats();
        
        assertEq(totalTokens, 3);
        assertEq(totalUniqueOwners, 2);
    }
    
    function testFuzz_CreateToken(
        uint256 totalSupply
    ) public {
        vm.assume(totalSupply > 0 && totalSupply <= 1e9);
        
        address tokenAddr = factory.createToken(
            user1,
            totalSupply,
            "Fuzz Token",
            "FUZZ"
        );
        
        Token token = Token(tokenAddr);
        assertEq(token.decimals(), 18);
        assertEq(token.totalSupply(), totalSupply * 10**18);
        assertEq(token.balanceOf(user1), totalSupply * 10**18);
    }
}
```

### Menjalankan Tests

```bash
# Jalankan semua tests
forge test

# Jalankan tests dengan verbose output
forge test -vvv

# Jalankan specific test
forge test --match-test test_CreateTokenSuccess

# Jalankan tests dengan gas report
forge test --gas-report
```

---

## 5. Script Deployment

### Membuat Deployment Script

Buat file `script/DeployTokenFactory.s.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Script, console} from "forge-std/Script.sol";
import {TokenFactory} from "../src/TokenFactory.sol";

contract DeployTokenFactory is Script {
    TokenFactory public tokenFactory;
    
    // No creation fee in this version
    
    function run() public returns (TokenFactory, address) {
        console.log("Starting TokenFactory deployment to 0G Network...\n");
        
        // Get deployer info
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        console.log("Deployment Details:");
        console.log("Deployer address:", deployer);
        console.log("Network: 0G Galileo Testnet");
        console.log("Chain ID: 16601");
        
        // Check balance
        uint256 balance = deployer.balance;
        console.log("Deployer balance:", balance / 1e18, "OG");
        
        if (balance < 0.01 ether) {
            console.log("Warning: Low balance. Make sure you have enough OG for deployment.");
        }
        
        // Start deployment
        vm.startBroadcast(deployerPrivateKey);
        
        console.log("Deploying TokenFactory contract...");
        tokenFactory = new TokenFactory();
        address contractAddress = address(tokenFactory);
        
        vm.stopBroadcast();
        
        console.log("TokenFactory deployed successfully!");
        console.log("Contract address:", contractAddress);
        console.log("Total tokens created:", tokenFactory.totalTokensCreated());
        console.log("Block explorer:", string.concat("https://chainscan-galileo.0g.ai/address/", _addressToString(contractAddress)));
        
        console.log("\nTesting deployment...");
        _testDeployment();
        
        console.log("\nNext Steps:");
        console.log("1. Save the contract address for future interactions");
        console.log("2. Test token creation using the createToken function");
        console.log("3. Integrate with your frontend application");
        console.log("4. Monitor token creation events");
        
        // Save deployment info
        _saveDeploymentInfo(contractAddress, deployer);
        
        return (tokenFactory, contractAddress);
    }
    
    function _testDeployment() internal view {
        console.log("Testing basic functions...");
        
        // Test view functions
        uint256 tokenCount = tokenFactory.getTokensCount();
        uint256 totalCreated = tokenFactory.totalTokensCreated();
        (uint256 totalTokens, uint256 uniqueOwners) = tokenFactory.getFactoryStats();
        
        console.log("Token count:", tokenCount);
        console.log("Total created:", totalCreated);
        console.log("Factory total tokens:", totalTokens);
        console.log("Unique owners:", uniqueOwners);
        
        require(tokenCount == 0, "Initial token count should be 0");
        require(totalCreated == 0, "Initial total created should be 0");
        
        console.log("All basic functions working correctly");
    }
    
    function _saveDeploymentInfo(address contractAddress, address deployer) internal {
        string memory deploymentInfo = string.concat(
            "{\n",
            '  "contractAddress": "', _addressToString(contractAddress), '",\n',
            '  "deployerAddress": "', _addressToString(deployer), '",\n',
            '  "network": "0G Galileo Testnet",\n',
            '  "chainId": "16601",\n',
            '  "blockExplorer": "https://chainscan-galileo.0g.ai/address/', _addressToString(contractAddress), '",\n',
            '  "timestamp": "', _getTimestamp(), '"\n',
            "}"
        );
        
        vm.writeFile("./deployments/tokenfactory-0g-galileo.json", deploymentInfo);
        console.log("Deployment info saved to: deployments/tokenfactory-0g-galileo.json");
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

## 6. Wallet Management dengan Cast

### Membuat Wallet untuk 0G Network

```bash
# Generate wallet baru
cast wallet new

# Import private key
cast wallet import 0g-deployer --private-key YOUR_PRIVATE_KEY_HERE

# Cek address wallet
cast wallet address --account 0g-deployer

# Cek balance di 0G Network
cast balance $(cast wallet address --account 0g-deployer) --rpc-url https://evmrpc-testnet.0g.ai
```

### Mendapatkan OG Token dari Faucet

1. **Kunjungi [0G Faucet](https://faucet.0g.ai/)**
2. **Paste address wallet Anda**
3. **Request OG tokens (0.1 OG per hari)**
4. **Verifikasi balance:**
   ```bash
   cast balance $(cast wallet address --account 0g-deployer) --rpc-url https://evmrpc-testnet.0g.ai | cast to-unit ether
   ```

---

## 7. Deployment ke 0G Network

### Deployment dengan forge create

```bash
# Deploy TokenFactory (no constructor args needed)
forge create src/TokenFactory.sol:TokenFactory \
  --account 0g-deployer \
  --rpc-url https://evmrpc-testnet.0g.ai \
  --broadcast
```

### Deployment dengan Script

```bash
# Setup environment variable
export PRIVATE_KEY=$(cast wallet private-key --account 0g-deployer)

# Deploy menggunakan script
forge script script/DeployTokenFactory.s.sol \
  --rpc-url https://evmrpc-testnet.0g.ai \
  --broadcast \
  --account 0g-deployer
```

Output yang diharapkan:
```
Starting TokenFactory deployment to 0G Network...

Deployment Details:
Deployer address: 0x1234567890123456789012345678901234567890
Network: 0G Galileo Testnet
Chain ID: 16601
Creation Fee: 0.001 OG

Deployer balance: 0.1 OG

Deploying TokenFactory contract...
TokenFactory deployed successfully!
Contract address: 0xabcdef1234567890abcdef1234567890abcdef12
Owner: 0x1234567890123456789012345678901234567890
Creation fee: 0.001 OG
Block explorer: https://chainscan-galileo.0g.ai/address/0xabcdef...
```

---

## 8. Interaksi dengan Contract

### Setup Contract Address

```bash
export CONTRACT_ADDRESS=0xYOUR_DEPLOYED_CONTRACT_ADDRESS
export RPC_URL=https://evmrpc-testnet.0g.ai
```

### Read Functions

```bash
# Cek total tokens created
cast call $CONTRACT_ADDRESS "totalTokensCreated()" --rpc-url $RPC_URL | cast to-dec

# Cek token count
cast call $CONTRACT_ADDRESS "getTokensCount()" --rpc-url $RPC_URL | cast to-dec

# Cek factory stats
cast call $CONTRACT_ADDRESS "getFactoryStats()" --rpc-url $RPC_URL

# Cek user tokens
cast call $CONTRACT_ADDRESS "getTokensByOwner(address)" $(cast wallet address --account 0g-deployer) --rpc-url $RPC_URL
```

### Write Functions

```bash
# Create token (no fee required)
cast send $CONTRACT_ADDRESS \
  "createToken(address,uint256,string,string)" \
  $(cast wallet address --account 0g-deployer) \
  1000000 \
  "My Token" \
  "MTK" \
  --account 0g-deployer \
  --rpc-url $RPC_URL
```

### Create Token Script

Buat script untuk kemudahan: `scripts/create-token.sh`

```bash
#!/bin/bash

CONTRACT_ADDRESS="0xYOUR_CONTRACT_ADDRESS"
RPC_URL="https://evmrpc-testnet.0g.ai"
ACCOUNT="0g-deployer"

echo "Creating new token on 0G Network..."

read -p "Token Name: " TOKEN_NAME
read -p "Token Symbol: " TOKEN_SYMBOL
read -p "Decimals (default 18): " DECIMALS
read -p "Total Supply: " TOTAL_SUPPLY

DECIMALS=${DECIMALS:-18}

echo "Creating token with:"
echo "- Name: $TOKEN_NAME"
echo "- Symbol: $TOKEN_SYMBOL"
echo "- Decimals: $DECIMALS"
echo "- Supply: $TOTAL_SUPPLY"

# Get deployer address
DEPLOYER=$(cast wallet address --account $ACCOUNT)

# Create token
RESULT=$(cast send $CONTRACT_ADDRESS \
  "createToken(address,uint256,string,string)" \
  $DEPLOYER \
  $TOTAL_SUPPLY \
  "$TOKEN_NAME" \
  "$TOKEN_SYMBOL" \
  --account $ACCOUNT \
  --rpc-url $RPC_URL \
  --json)

echo "Token created successfully!"
echo "Transaction: $(echo $RESULT | jq -r .transactionHash)"

# Get latest token address
TOKEN_COUNT=$(cast call $CONTRACT_ADDRESS "getTokensCount()" --rpc-url $RPC_URL | cast to-dec)
LATEST_ID=$((TOKEN_COUNT - 1))
TOKEN_ADDRESS=$(cast call $CONTRACT_ADDRESS "createdTokens(uint256)" $LATEST_ID --rpc-url $RPC_URL | cast parse-bytes32-address)

echo "Token Address: $TOKEN_ADDRESS"
echo "Block Explorer: https://chainscan-galileo.0g.ai/address/$TOKEN_ADDRESS"
```

### Token Interaction

```bash
# Setelah token dibuat, berinteraksi dengan token
TOKEN_ADDRESS="0xYOUR_TOKEN_ADDRESS"

# Cek balance
cast call $TOKEN_ADDRESS "balanceOf(address)" $(cast wallet address --account 0g-deployer) --rpc-url $RPC_URL | cast to-unit ether

# Transfer token
cast send $TOKEN_ADDRESS \
  "transfer(address,uint256)" \
  "0xRECIPIENT_ADDRESS" \
  "1000000000000000000" \
  --account 0g-deployer \
  --rpc-url $RPC_URL

# Burn token (owner only)  
cast send $TOKEN_ADDRESS \
  "burnToken(uint256)" \
  1000 \
  --account 0g-deployer \
  --rpc-url $RPC_URL

# Get token info
cast call $TOKEN_ADDRESS "getTokenInfo()" --rpc-url $RPC_URL
```

## 9. Script untuk Membuat Token

### Create Token Script

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
    string constant TOKEN_NAME = "0G Token";
    string constant TOKEN_SYMBOL = "0GT";
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
        console.log("Block explorer:", string.concat("https://chainscan-galileo.0g.ai/address/", _addressToString(newTokenAddress)));

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
            '  "network": "0G Galileo Testnet",\n',
            '  "chainId": "16601",\n',
            '  "blockExplorer": "https://chainscan-galileo.0g.ai/address/', _addressToString(tokenAddress), '",\n',
            '  "timestamp": "', _getTimestamp(), '"\n',
            "}"
        );

        // Write token info to file
        string memory filename = string.concat("./deployments/token-", TOKEN_SYMBOL, "-0g-galileo.json");
        vm.writeFile(filename, tokenInfo);
        console.log(string.concat("Token info saved to: deployments/token-", TOKEN_SYMBOL, "-0g-galileo.json"));
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

### Menjalankan Create Token Script

```bash
# Update FACTORY_ADDRESS di script dengan alamat yang sudah di-deploy
# Jalankan script untuk membuat token
forge script script/CreateToken.s.sol \
  --rpc-url https://evmrpc-testnet.0g.ai \
  --broadcast \
  --account 0g-deployer
```

### Wallet Management Commands

```bash
# Setup wallet
cast wallet import 0g-deployer --private-key $(cast wallet new | grep 'Private key:' | awk '{print $3}')

# Check balance
cast balance $(cast wallet address --account 0g-deployer) --rpc-url https://evmrpc-testnet.0g.ai

# Get OG from faucet if needed
# Visit: https://faucet.0g.ai/

# Check if wallet has enough balance
cast balance $(cast wallet address --account 0g-deployer) --rpc-url https://evmrpc-testnet.0g.ai | cast to-unit ether
```

---

## Kesimpulan

Anda telah berhasil membuat dan mendeploy TokenFactory di 0G Network! Tutorial ini mencakup:

### Yang Telah Dipelajari

1. **Setup Foundry untuk 0G Network** - Konfigurasi RPC dan chain ID
2. **Smart Contract Development** - TokenFactory dan SimpleToken contracts
3. **Comprehensive Testing** - Unit tests dengan Foundry
4. **Professional Deployment** - Script deployment yang informatif
5. **Contract Interaction** - Penggunaan Cast untuk interaksi blockchain

### Fitur TokenFactory

- Create ERC20 tokens with custom parameters
- Track user-created tokens
- Configurable creation fees
- Owner management functions
- Event logging untuk monitoring
- Gas-optimized dengan custom errors

### Next Steps

1. **Frontend Integration** - Buat React app untuk TokenFactory
2. **Advanced Features** - Add token burning, pausing, atau governance
3. **Multi-Network** - Deploy ke multiple 0G networks
4. **Token Standards** - Implement ERC721 atau ERC1155 factories

0G Network menyediakan infrastruktur yang powerful untuk AI + DeFi applications, dan TokenFactory adalah fondasi yang baik untuk memulai pengembangan ecosystem token di platform ini.

Happy building di 0G Network!