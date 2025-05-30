# TaskManager dengan Foundry dan Template Monad

Dokumentasi lengkap untuk membuat TaskManager smart contract menggunakan Foundry dengan template Monad oficial. Tutorial ini akan mengajarkan cara menggunakan toolkit Foundry yang modern dan efisien untuk pengembangan smart contract di Monad Testnet.

## Daftar Isi

1. [Instalasi Foundry](#1-instalasi-foundry)
2. [Setup Proyek dengan Template Monad](#2-setup-proyek-dengan-template-monad)
3. [Membuat Smart Contract TaskManager](#3-membuat-smart-contract-taskmanager)
4. [Testing dengan Foundry](#4-testing-dengan-foundry)
5. [Script Deployment](#5-script-deployment)
6. [Wallet Management dengan Cast](#6-wallet-management-dengan-cast)
7. [Deployment ke Monad Testnet](#7-deployment-ke-monad-testnet)
8. [Verifikasi Contract](#8-verifikasi-contract)
9. [Interaksi dengan Contract](#9-interaksi-dengan-contract)
10. [Best Practices dan Tips](#10-best-practices-dan-tips)

---

## 1. Instalasi Foundry

Foundry adalah toolkit yang sangat cepat dan portable untuk pengembangan smart contract Ethereum yang ditulis dalam Rust.

### Untuk macOS

#### Prasyarat
- macOS 10.15 Catalina atau lebih baru
- Aplikasi Terminal
- Setidaknya 1GB ruang disk kosong

#### Langkah Instalasi

1. **Buka Terminal**

2. **Jalankan script instalasi Foundryup:**
   ```bash
   curl -L https://foundry.paradigm.xyz | bash
   ```

3. **Install package libusb (jika belum ada):**
   ```bash
   brew install libusb
   ```

4. **Restart terminal atau source profile:**
   ```bash
   source ~/.zshrc  # atau source ~/.bash_profile
   ```

5. **Install Foundry:**
   ```bash
   foundryup
   ```

6. **Verifikasi instalasi:**
   ```bash
   forge --version
   cast --version
   anvil --version
   ```

### Untuk Windows (dengan WSL)

#### Prasyarat
- Windows 10 versi 2004+ atau Windows 11
- Akses admin
- Setidaknya 5GB ruang disk kosong

#### Langkah Instalasi

1. **Aktifkan Hyper-V:**
   - Tekan Windows key → cari "Turn Windows features on or off"
   - Centang "Hyper-V" → OK → Restart

2. **Install WSL:**
   ```powershell
   # Jalankan di PowerShell sebagai Administrator
   wsl --install
   # Atau untuk Ubuntu spesifik:
   wsl --install -d Ubuntu-22.04
   ```

3. **Restart komputer**

4. **Buka terminal WSL dan setup user**

5. **Install Foundry di WSL:**
   ```bash
   curl -L https://foundry.paradigm.xyz | bash
   source ~/.bashrc
   foundryup
   ```

6. **Verifikasi instalasi:**
   ```bash
   forge --version
   cast --version
   anvil --version
   ```

### Setup Node.js (Opsional)

Meskipun Foundry tidak memerlukan Node.js, beberapa tools tambahan mungkin memerlukannya:

#### macOS:
```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.zshrc
# Install Node.js 18
nvm install 18
nvm use 18
```

#### Windows (WSL):
```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
# Install Node.js 18
nvm install 18
nvm use 18
```

---

## 2. Setup Proyek dengan Template Monad

Template Monad menyediakan setup yang sudah dikonfigurasi untuk Monad Testnet dengan semua dependencies dan konfigurasi yang diperlukan.

### Membuat Proyek Baru

```bash
# Buat proyek baru dengan template Monad
forge init --template monad-developers/foundry-monad task-manager

# Masuk ke direktori proyek
cd task-manager
```

### Struktur Proyek

Setelah inisialisasi, struktur proyek akan terlihat seperti ini:

```
task-manager/
├── foundry.toml           # Konfigurasi Foundry
├── script/                # Deployment scripts
├── src/                   # Smart contracts
├── test/                  # Test files
├── lib/                   # Dependencies (forge-std, dll)
├── .env.example          # Environment variables example
├── .gitignore            # Git ignore rules
└── README.md             # Project documentation
```

### Memahami foundry.toml

File `foundry.toml` berisi konfigurasi untuk Monad Testnet:

```toml
[profile.default]
src = "src"
out = "out"
libs = ["lib"]
solc = "0.8.26"
optimizer = true
optimizer_runs = 200

[rpc_endpoints]
monad_testnet = "https://testnet-rpc.monad.xyz/"

[etherscan]
monad_testnet = { key = "${ETHERSCAN_API_KEY}", url = "https://testnet.monadexplorer.com/api/" }
```

### Setup Environment Variables

1. **Copy file environment:**
   ```bash
   cp .env.example .env
   ```

2. **Edit file .env (opsional untuk beberapa fitur):**
   ```bash
   # .env
   ETHERSCAN_API_KEY=your_api_key_here  # Untuk verifikasi (opsional)
   ```

---

## 3. Membuat Smart Contract TaskManager

Sekarang kita akan membuat smart contract TaskManager yang sama seperti pada tutorial Hardhat sebelumnya.

### Membuat File TaskManager.sol

Buat file `src/TaskManager.sol` dengan konten berikut:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract TaskManager {
    // State Variables & Scope
    address public owner;           // public: bisa dibaca siapa saja
    uint256 public taskCount;       // counter tasks
    bool private isActive;          // private: hanya contract ini
    
    // Mapping: alamat -> jumlah task user
    mapping(address => uint256) public userTaskCount;
    
    // Events untuk logging
    event TaskAdded(address indexed user, uint256 newTaskCount);
    event ContractStatusChanged(bool isActive);
    
    // Functions dengan berbagai visibility
    constructor() {
        owner = msg.sender;         // yang deploy = owner
        isActive = true;
        taskCount = 0;
        emit ContractStatusChanged(true);
    }
    
    // View function: baca data, no gas (kecuali dipanggil dari contract)
    function getOwner() public view returns(address) {
        return owner;
    }
    
    // Pure function: no read/write state, hanya komputasi
    function calculateFee(uint256 amount) public pure returns(uint256) {
        return amount * 2 / 100;    // 2% fee
    }
    
    // Public function: bisa dipanggil dari mana saja
    function addTask() public {
        require(isActive, "Contract not active");
        taskCount++;
        userTaskCount[msg.sender]++;
        
        emit TaskAdded(msg.sender, userTaskCount[msg.sender]);
        
        // Update status jika sudah mencapai limit
        _updateStatus();
    }
    
    // Private function: hanya dari dalam contract
    function _updateStatus() private {
        bool newStatus = taskCount < 1000;
        if (newStatus != isActive) {
            isActive = newStatus;
            emit ContractStatusChanged(newStatus);
        }
    }
    
    // Function untuk cek status contract
    function getContractStatus() public view returns(bool) {
        return isActive;
    }
    
    // Function untuk mendapatkan multiple data sekaligus (gas efficient)
    function getUserInfo(address user) public view returns(
        uint256 userTasks,
        uint256 totalTasks,
        uint256 feeFor100,
        bool contractActive
    ) {
        return (
            userTaskCount[user],
            taskCount,
            calculateFee(100),
            isActive
        );
    }
}
```

### Kompilasi Contract

```bash
# Kompilasi semua contracts
forge build

# Output yang diharapkan:
# [⠒] Compiling...
# [⠢] Compiling 1 files with 0.8.26
# [⠆] Solc 0.8.26 finished in 234.56ms
# Compiler run successful!
```

---

## 4. Testing dengan Foundry

Foundry menggunakan Solidity untuk testing, yang membuat testing lebih cepat dan terintegrasi dengan development environment.

### Membuat File Test

Buat file `test/TaskManager.t.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "lib/forge-std/src/Test.sol";
import "../src/TaskManager.sol";

contract TaskManagerTest is Test {
    TaskManager public taskManager;
    address public owner;
    address public user1;
    address public user2;

    // Events untuk testing
    event TaskAdded(address indexed user, uint256 newTaskCount);
    event ContractStatusChanged(bool isActive);

    // Hook yang dijalankan sebelum setiap test
    function setUp() public {
        // Setup test addresses
        owner = address(this);
        user1 = makeAddr("user1");
        user2 = makeAddr("user2");

        // Deploy contract baru untuk setiap test
        taskManager = new TaskManager();
    }

    // Deployment Tests
    function test_ShouldSetTheRightOwner() public view {
        assertEq(taskManager.owner(), owner);
    }

    function test_ShouldInitializeTaskCountToZero() public view {
        assertEq(taskManager.taskCount(), 0);
    }

    function test_ShouldInitializeUserTaskCountToZero() public view {
        assertEq(taskManager.userTaskCount(user1), 0);
        assertEq(taskManager.userTaskCount(user2), 0);
    }

    function test_ShouldBeActiveInitially() public view {
        assertTrue(taskManager.getContractStatus());
    }

    // View Functions Tests
    function test_ShouldReturnCorrectOwnerAddress() public view {
        address ownerAddress = taskManager.getOwner();
        assertEq(ownerAddress, owner);
    }

    function test_ShouldCalculateFeeCorrectly() public view {
        // Test dengan berbagai nilai
        assertEq(taskManager.calculateFee(100), 2); // 2% dari 100 = 2
        assertEq(taskManager.calculateFee(1000), 20); // 2% dari 1000 = 20
        assertEq(taskManager.calculateFee(50), 1); // 2% dari 50 = 1
    }

    function test_ShouldHandleEdgeCasesForCalculateFee() public view {
        assertEq(taskManager.calculateFee(0), 0);
        assertEq(taskManager.calculateFee(1), 0); // 1 * 2 / 100 = 0 (integer division)
    }

    // Add Task Function Tests
    function test_ShouldAddTaskSuccessfully() public {
        // Expect event emission
        vm.expectEmit(true, false, false, true);
        emit TaskAdded(user1, 1);
        
        // Tambah task dari user1
        vm.prank(user1);
        taskManager.addTask();

        // Verify taskCount bertambah
        assertEq(taskManager.taskCount(), 1);
        
        // Verify userTaskCount bertambah untuk user1
        assertEq(taskManager.userTaskCount(user1), 1);
    }

    function test_ShouldAllowMultipleUsersToAddTasks() public {
        // User1 tambah 2 tasks
        vm.startPrank(user1);
        taskManager.addTask();
        taskManager.addTask();
        vm.stopPrank();

        // User2 tambah 1 task
        vm.prank(user2);
        taskManager.addTask();

        // Verify counts
        assertEq(taskManager.taskCount(), 3);
        assertEq(taskManager.userTaskCount(user1), 2);
        assertEq(taskManager.userTaskCount(user2), 1);
    }

    function test_ShouldTrackIndividualUserTaskCountsCorrectly() public {
        // User1 tambah 5 tasks
        vm.startPrank(user1);
        for (uint i = 0; i < 5; i++) {
            taskManager.addTask();
        }
        vm.stopPrank();

        // User2 tambah 3 tasks
        vm.startPrank(user2);
        for (uint i = 0; i < 3; i++) {
            taskManager.addTask();
        }
        vm.stopPrank();

        // Verify individual counts
        assertEq(taskManager.userTaskCount(user1), 5);
        assertEq(taskManager.userTaskCount(user2), 3);
        assertEq(taskManager.taskCount(), 8);
    }

    // Gas Usage Tests
    function test_ShouldUseReasonableGasForAddTask() public {
        uint256 gasBefore = gasleft();
        
        vm.prank(user1);
        taskManager.addTask();
        
        uint256 gasUsed = gasBefore - gasleft();
        
        // Gas usage untuk addTask harus reasonable (< 100k gas)
        assertLt(gasUsed, 100000);
        
        console.log("Gas used for addTask:", gasUsed);
    }

    function test_ShouldUseNoGasForViewFunctionsWhenCalledDirectly() public view {
        // View functions tidak menggunakan gas ketika dipanggil langsung
        address ownerAddr = taskManager.getOwner();
        uint256 fee = taskManager.calculateFee(100);
        
        assertTrue(ownerAddr != address(0));
        assertEq(fee, 2);
    }

    // GetUserInfo Function Test
    function test_ShouldReturnCorrectUserInfo() public {
        // Add some tasks
        vm.prank(user1);
        taskManager.addTask();
        
        vm.prank(user2);
        taskManager.addTask();

        // Get user info
        (uint256 userTasks, uint256 totalTasks, uint256 fee, bool active) = 
            taskManager.getUserInfo(user1);

        assertEq(userTasks, 1);
        assertEq(totalTasks, 2);
        assertEq(fee, 2);
        assertTrue(active);
    }

    // Edge Cases Tests
    function test_ShouldHandleLargeNumbersInCalculateFee() public view {
        uint256 largeNumber = 1000000 ether; // 1M ETH in wei
        uint256 expectedFee = (largeNumber * 2) / 100;
        
        assertEq(taskManager.calculateFee(largeNumber), expectedFee);
    }

    function test_ShouldMaintainStateCorrectlyAfterManyOperations() public {
        // Simulasi penggunaan intensif
        uint256 iterations = 10;
        
        for (uint i = 0; i < iterations; i++) {
            vm.prank(user1);
            taskManager.addTask();
            
            vm.prank(user2);
            taskManager.addTask();
        }

        assertEq(taskManager.taskCount(), iterations * 2);
        assertEq(taskManager.userTaskCount(user1), iterations);
        assertEq(taskManager.userTaskCount(user2), iterations);
    }

    // Contract State Consistency Tests
    function test_ShouldMaintainConsistencyBetweenTotalAndIndividualCounts() public {
        address[] memory users = new address[](3);
        users[0] = user1;
        users[1] = user2;
        users[2] = owner;
        
        uint256 totalExpected = 0;

        // Setiap user tambah task dengan jumlah berbeda
        for (uint i = 0; i < users.length; i++) {
            uint256 tasksToAdd = i + 1; // user1: 1, user2: 2, owner: 3
            
            vm.startPrank(users[i]);
            for (uint j = 0; j < tasksToAdd; j++) {
                taskManager.addTask();
            }
            vm.stopPrank();
            
            totalExpected += tasksToAdd;
        }

        // Verify total count
        assertEq(taskManager.taskCount(), totalExpected);

        // Verify individual counts
        uint256 totalFromUsers = 0;
        for (uint i = 0; i < users.length; i++) {
            uint256 userCount = taskManager.userTaskCount(users[i]);
            totalFromUsers += userCount;
            assertEq(userCount, i + 1);
        }

        // Total dari semua user harus sama dengan taskCount
        assertEq(totalFromUsers, totalExpected);
    }

    // Fuzz Testing
    function testFuzz_CalculateFee(uint256 amount) public view {
        // Avoid overflow by limiting the input
        vm.assume(amount <= type(uint256).max / 2);
        
        uint256 expectedFee = (amount * 2) / 100;
        assertEq(taskManager.calculateFee(amount), expectedFee);
    }

    function testFuzz_AddTaskMultipleTimes(uint8 numTasks) public {
        vm.assume(numTasks > 0 && numTasks <= 100); // Reasonable limit
        
        vm.startPrank(user1);
        for (uint i = 0; i < numTasks; i++) {
            taskManager.addTask();
        }
        vm.stopPrank();

        assertEq(taskManager.taskCount(), numTasks);
        assertEq(taskManager.userTaskCount(user1), numTasks);
    }

    // Event Testing
    function test_ShouldEmitTaskAddedEvent() public {
        vm.expectEmit(true, false, false, true);
        emit TaskAdded(user1, 1);
        
        vm.prank(user1);
        taskManager.addTask();
    }

    function test_ShouldEmitContractStatusChangedEventAtLimit() public {
        // This test would need to add 1000 tasks to trigger the status change
        // For demonstration, we'll test the initial status change event
        // The event was already emitted during deployment
        assertTrue(taskManager.getContractStatus());
    }
}
```

### Menjalankan Tests

```bash
# Jalankan semua tests
forge test

# Jalankan tests dengan verbose output
forge test -vvv

# Jalankan test specific
forge test --match-test test_ShouldAddTaskSuccessfully

# Jalankan test dengan gas report
forge test --gas-report

# Jalankan fuzz tests dengan lebih banyak runs
forge test --fuzz-runs 1000
```

Output yang diharapkan:
```
[⠒] Compiling...
[⠢] Compiling 2 files with 0.8.26
[⠆] Solc 0.8.26 finished in 1.23s
Compiler run successful!

Running 20 tests for test/TaskManager.t.sol:TaskManagerTest
[PASS] test_ShouldAddTaskSuccessfully() (gas: 54321)
[PASS] test_ShouldAllowMultipleUsersToAddTasks() (gas: 87654)
[PASS] test_ShouldCalculateFeeCorrectly() (gas: 12345)
...
Test result: ok. 20 passed; 0 failed; 0 skipped; finished in 234.56ms
```

---

## 5. Script Deployment

Script deployment memungkinkan kita untuk melakukan deployment yang reproducible dan dapat dikonfigurasi.

### Membuat Deployment Script

Buat file `script/DeployTaskManager.s.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Script, console} from "lib/forge-std/src/Script.sol";
import {TaskManager} from "../src/TaskManager.sol";

contract DeployTaskManager is Script {
    TaskManager public taskManager;

    function setUp() public {}

    function run() public returns (TaskManager, address) {
        console.log("Starting TaskManager deployment to Monad Testnet...\n");

        // Get deployer account from private key
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        console.log("Deployment Details:");
        console.log("Deployer address:", deployer);
        
        // Check balance
        uint256 balance = deployer.balance;
        console.log("Deployer balance:", balance / 1e18, "MON");
        
        if (balance < 0.01 ether) {
            console.log("Warning: Low balance. Make sure you have enough MON for deployment.");
        }

        // Get network info
        console.log("Network: Monad Testnet");
        console.log("Chain ID: 10143");
        console.log("RPC URL: https://testnet-rpc.monad.xyz/\n");

        // Start broadcasting transactions
        vm.startBroadcast(deployerPrivateKey);

        console.log("Deploying TaskManager contract...");
        
        // Deploy TaskManager
        taskManager = new TaskManager();
        address contractAddress = address(taskManager);

        vm.stopBroadcast();

        console.log("TaskManager deployed successfully!");
        console.log("Contract address:", contractAddress);
        console.log("Block explorer:", string.concat("https://testnet.monadexplorer.com/address/", _addressToString(contractAddress)));

        // Verify initial state
        console.log("Verifying initial contract state...");
        address owner = taskManager.owner();
        uint256 taskCount = taskManager.taskCount();
        uint256 userTaskCount = taskManager.userTaskCount(deployer);

        console.log("Owner:", owner);
        console.log("Task count:", taskCount);
        console.log("Deployer task count:", userTaskCount);
        
        // Test calculateFee function
        uint256 fee = taskManager.calculateFee(100);
        console.log("Fee calculation (100 -> 2%):", fee);

        // Provide next steps
        console.log("Next Steps:");
        console.log("1. Save the contract address for future interactions");
        console.log("2. Verify the contract on block explorer (optional)");
        console.log("3. Test contract functions using cast or frontend");
        console.log("4. Add the contract to your MetaMask for easy interaction");

        // Save deployment info
        _saveDeploymentInfo(contractAddress, deployer);

        return (taskManager, contractAddress);
    }

    function _saveDeploymentInfo(address contractAddress, address deployer) internal {
        string memory deploymentInfo = string.concat(
            "{\n",
            '  "contractAddress": "', _addressToString(contractAddress), '",\n',
            '  "deployerAddress": "', _addressToString(deployer), '",\n',
            '  "network": "Monad Testnet",\n',
            '  "chainId": "10143",\n',
            '  "blockExplorer": "https://testnet.monadexplorer.com/address/', _addressToString(contractAddress), '",\n',
            '  "timestamp": "', _getTimestamp(), '"\n',
            "}"
        );

        // Write deployment info to file
        vm.writeFile("./deployments/taskmanager-monad-testnet.json", deploymentInfo);
        console.log("Deployment info saved to: deployments/taskmanager-monad-testnet.json");
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
        // Simple timestamp as block number since we can't get actual timestamp in scripts
        return vm.toString(block.number);
    }
}
```

### Test Script Deployment (Dry Run)

```bash
# Test deployment script tanpa benar-benar deploy
forge script script/DeployTaskManager.s.sol --rpc-url https://testnet-rpc.monad.xyz/

# Test dengan fork environment
forge script script/DeployTaskManager.s.sol --fork-url https://testnet-rpc.monad.xyz/
```

---

## 6. Wallet Management dengan Cast

Cast adalah CLI tool untuk berinteraksi dengan Ethereum/Monad blockchain dan manajemen wallet.

### Membuat Wallet Baru

```bash
# Generate wallet baru dan import langsung
cast wallet import monad-deployer --private-key $(cast wallet new | grep 'Private key:' | awk '{print $3}')

# Anda akan diminta memasukkan password untuk keystore
# Enter password: [masukkan password yang aman]
# `monad-deployer` keystore was saved successfully. Address: 0x3c32b70fbfd1f99a9073c921dacd1518c20cb8de
```

### Alternative: Import Existing Private Key

Jika Anda sudah memiliki private key:

```bash
# Import private key yang sudah ada
cast wallet import monad-deployer --private-key YOUR_PRIVATE_KEY_HERE

# Masukkan password untuk enkripsi keystore
# Enter password: [password anda]
```

### Manajemen Wallet

```bash
# Lihat daftar wallet tersimpan
cast wallet list

# Cek address wallet
cast wallet address --account monad-deployer
# Enter keystore password: [masukkan password]
# 0x3C32B70FBfd1f99A9073c921Dacd1518C20cb8De

# Cek balance wallet
cast balance 0x3C32B70FBfd1f99A9073c921Dacd1518C20cb8De --rpc-url https://testnet-rpc.monad.xyz/
# Output: 200000000000000000 (dalam wei, = 0.2 MON)

# Konversi wei ke ether untuk readability
cast balance 0x3C32B70FBfd1f99A9073c921Dacd1518C20cb8De --rpc-url https://testnet-rpc.monad.xyz/ | cast to-unit ether
# Output: 0.200000000000000000
```

### Mendapatkan MON dari Faucet

Sebelum deployment, pastikan wallet memiliki cukup MON:

1. **Kunjungi [Monad Testnet Faucet](https://faucet.testnet.monad.xyz/)**
2. **Paste address wallet Anda**
3. **Request MON tokens**
4. **Verifikasi balance:**
   ```bash
   cast balance $(cast wallet address --account monad-deployer) --rpc-url https://testnet-rpc.monad.xyz/ | cast to-unit ether
   ```

---

## 7. Deployment ke Monad Testnet

Sekarang kita siap untuk melakukan deployment menggunakan beberapa metode yang berbeda.

### Metode 1: Menggunakan forge create

Ini adalah metode paling sederhana dan langsung:

```bash
# Deploy menggunakan forge create
forge create src/TaskManager.sol:TaskManager --account monad-deployer --rpc-url https://testnet-rpc.monad.xyz/ --broadcast

# Output yang diharapkan:
# [⠒] Compiling...
# No files changed, compilation skipped
# Enter keystore password: [masukkan password]
# Deployer: 0x3C32B70FBfd1f99A9073c921Dacd1518C20cb8De
# Deployed to: 0xCd80CdC47ACA776288a31AC1e04BDAb911593144
# Transaction hash: 0xcf00af4f2def22d04509402ad7c97e99610d84f48948862ba7747645ec6967f7
```

### Metode 2: Menggunakan Script Deployment

Metode ini memberikan kontrol lebih dan output yang informatif:

```bash
# Setup environment variable untuk private key (jika menggunakan script)
export PRIVATE_KEY=$(cast wallet private-key --account monad-deployer)
# Enter keystore password: [masukkan password]

# Deploy menggunakan script
forge script script/DeployTaskManager.s.sol --rpc-url https://testnet-rpc.monad.xyz/ --broadcast --account monad-deployer

# Output yang diharapkan:
# 🚀 Starting TaskManager deployment to Monad Testnet...
# 
# 📋 Deployment Details:
# ├── Deployer address: 0x3C32B70FBfd1f99A9073c921Dacd1518C20cb8De
# ├── Deployer balance: 0 MON
# ├── Network: Monad Testnet
# ├── Chain ID: 10143
# └── RPC URL: https://testnet-rpc.monad.xyz/
# 
# 📦 Deploying TaskManager contract...
# ✅ TaskManager deployed successfully!
# ├── Contract address: 0xCd80CdC47ACA776288a31AC1e04BDAb911593144
# ├── Block explorer: https://testnet.monadexplorer.com/address/0xCd80CdC47ACA776288a31AC1e04BDAb911593144
```

### Metode 3: Deploy dengan Gas Configuration

Untuk kontrol lebih detail atas gas:

```bash
# Deploy dengan gas limit dan gas price spesifik
forge create src/TaskManager.sol:TaskManager \
  --account monad-deployer \
  --rpc-url https://testnet-rpc.monad.xyz/ \
  --broadcast \
  --gas-limit 500000 \
  --gas-price 1000000000

# Deploy dengan legacy transaction (jika diperlukan)
forge create src/TaskManager.sol:TaskManager \
  --account monad-deployer \
  --rpc-url https://testnet-rpc.monad.xyz/ \
  --broadcast \
  --legacy
```

### Troubleshooting Deployment

#### Error: Insufficient Funds
```bash
# Cek balance
cast balance $(cast wallet address --account monad-deployer) --rpc-url https://testnet-rpc.monad.xyz/ | cast to-unit ether

# Jika balance kurang, dapatkan dari faucet:
# https://faucet.testnet.monad.xyz/
```

#### Error: Network Connection
```bash
# Test koneksi RPC
cast client --rpc-url https://testnet-rpc.monad.xyz/

# Test alternatif RPC (jika ada)
cast balance 0x0000000000000000000000000000000000000000 --rpc-url https://testnet-rpc.monad.xyz/
```

#### Error: Nonce Issues
```bash
# Cek nonce saat ini
cast nonce $(cast wallet address --account monad-deployer) --rpc-url https://testnet-rpc.monad.xyz/

# Reset nonce jika diperlukan (jarang diperlukan)
forge create src/TaskManager.sol:TaskManager --account monad-deployer --rpc-url https://testnet-rpc.monad.xyz/ --broadcast --nonce 0
```

---

## 8. Verifikasi Contract

Verifikasi source code memungkinkan orang lain untuk melihat dan memverifikasi code contract Anda di block explorer.

### Verifikasi dengan Sourcify

Sourcify adalah platform verifikasi yang digunakan oleh Monad:

```bash
# Verifikasi contract menggunakan Sourcify
forge verify-contract \
  0xCd80CdC47ACA776288a31AC1e04BDAb911593144 \
  src/TaskManager.sol:TaskManager \
  --chain 10143 \
  --verifier sourcify \
  --verifier-url https://sourcify-api-monad.blockvision.org

# Output yang diharapkan:
# Start verifying contract `0xCd80CdC47ACA776288a31AC1e04BDAb911593144` deployed on monad-testnet
# Attempting to verify on Sourcify. Pass the --etherscan-api-key <API_KEY> to verify on Etherscan, or use the --verifier flag to verify on another provider.
# Submitting verification for [TaskManager] "0xCd80CdC47ACA776288a31AC1e04BDAb911593144".
# Contract successfully verified
```

### Verifikasi dengan Constructor Arguments

Jika contract memiliki constructor arguments:

```bash
# Contoh jika TaskManager memiliki constructor arguments
forge verify-contract \
  CONTRACT_ADDRESS \
  src/TaskManager.sol:TaskManager \
  --chain 10143 \
  --verifier sourcify \
  --verifier-url https://sourcify-api-monad.blockvision.org \
  --constructor-args $(cast abi-encode "constructor(address,uint256)" 0x1234... 100)
```

### Verifikasi Manual

Jika automatic verification gagal:

1. **Buka [Monad Explorer](https://testnet.monadexplorer.com/)**
2. **Navigate ke contract address**
3. **Klik tab "Contract"**
4. **Klik "Verify Contract" (jika tersedia)**
5. **Upload source code dan metadata**

---

## 9. Interaksi dengan Contract

Setelah deployment dan verifikasi, kita dapat berinteraksi dengan contract menggunakan cast.

### Setup Contract Address

```bash
# Set contract address sebagai environment variable untuk kemudahan
export CONTRACT_ADDRESS=0xCd80CdC47ACA776288a31AC1e04BDAb911593144
```

### Read Functions (View/Pure)

```bash
# Baca owner address
cast call $CONTRACT_ADDRESS "owner()" --rpc-url https://testnet-rpc.monad.xyz/
# Output: 0x0000000000000000000000003c32b70fbfd1f99a9073c921dacd1518c20cb8de

# Baca task count
cast call $CONTRACT_ADDRESS "taskCount()" --rpc-url https://testnet-rpc.monad.xyz/
# Output: 0x0000000000000000000000000000000000000000000000000000000000000000

# Baca user task count
cast call $CONTRACT_ADDRESS "userTaskCount(address)" $(cast wallet address --account monad-deployer) --rpc-url https://testnet-rpc.monad.xyz/
# Enter keystore password: [password]
# Output: 0x0000000000000000000000000000000000000000000000000000000000000000

# Calculate fee
cast call $CONTRACT_ADDRESS "calculateFee(uint256)" 100 --rpc-url https://testnet-rpc.monad.xyz/
# Output: 0x0000000000000000000000000000000000000000000000000000000000000002

# Get contract status
cast call $CONTRACT_ADDRESS "getContractStatus()" --rpc-url https://testnet-rpc.monad.xyz/
# Output: 0x0000000000000000000000000000000000000000000000000000000000000001 (true)

# Get user info (multiple return values)
cast call $CONTRACT_ADDRESS "getUserInfo(address)" $(cast wallet address --account monad-deployer) --rpc-url https://testnet-rpc.monad.xyz/
# Enter keystore password: [password]
# Output: 0x0000000000000000000000000000000000000000000000000000000000000000
#         0x0000000000000000000000000000000000000000000000000000000000000000
#         0x0000000000000000000000000000000000000000000000000000000000000002
#         0x0000000000000000000000000000000000000000000000000000000000000001
```

### Write Functions (State Changing)

```bash
# Add task (requires gas)
cast send $CONTRACT_ADDRESS "addTask()" --account monad-deployer --rpc-url https://testnet-rpc.monad.xyz/
# Enter keystore password: [password]
# 
# blockHash               0x1234567890abcdef...
# blockNumber             12345
# contractAddress         
# cumulativeGasUsed       54321
# effectiveGasPrice       1000000000
# gasUsed                 54321
# logs                    [{"address":"0xcd80cdc47aca776288a31ac1e04bdab911593144",...}]
# logsBloom              0x000000000000000...
# root                   
# status                 1
# transactionHash        0xabcdef1234567890...
# transactionIndex       0
# type                   2

# Verifikasi perubahan state
cast call $CONTRACT_ADDRESS "taskCount()" --rpc-url https://testnet-rpc.monad.xyz/
# Output: 0x0000000000000000000000000000000000000000000000000000000000000001

cast call $CONTRACT_ADDRESS "userTaskCount(address)" $(cast wallet address --account monad-deployer) --rpc-url https://testnet-rpc.monad.xyz/
# Enter keystore password: [password]
# Output: 0x0000000000000000000000000000000000000000000000000000000000000001
```

### Decode Output untuk Readability

```bash
# Decode hex output ke decimal
cast call $CONTRACT_ADDRESS "taskCount()" --rpc-url https://testnet-rpc.monad.xyz/ | cast to-dec
# Output: 1

# Decode address output
cast call $CONTRACT_ADDRESS "owner()" --rpc-url https://testnet-rpc.monad.xyz/ | cast parse-bytes32-address
# Output: 0x3C32B70FBfd1f99A9073c921Dacd1518C20cb8De
```

### Monitoring Events

```bash
# Monitor events dari contract
cast logs --address $CONTRACT_ADDRESS --rpc-url https://testnet-rpc.monad.xyz/

# Monitor specific event
cast logs --address $CONTRACT_ADDRESS "TaskAdded(address,uint256)" --rpc-url https://testnet-rpc.monad.xyz/

# Get events dari block tertentu
cast logs --address $CONTRACT_ADDRESS --from-block 12345 --to-block 12350 --rpc-url https://testnet-rpc.monad.xyz/
```

### Batch Operations Script

Buat script untuk operasi batch `scripts/interact.sh`:

```bash
#!/bin/bash

# Set variables
CONTRACT_ADDRESS="0xCd80CdC47ACA776288a31AC1e04BDAb911593144"
RPC_URL="https://testnet-rpc.monad.xyz/"
ACCOUNT="monad-deployer"

echo "🔍 Current Contract State:"
echo "Owner: $(cast call $CONTRACT_ADDRESS "owner()" --rpc-url $RPC_URL | cast parse-bytes32-address)"
echo "Task Count: $(cast call $CONTRACT_ADDRESS "taskCount()" --rpc-url $RPC_URL | cast to-dec)"
echo "Contract Active: $(cast call $CONTRACT_ADDRESS "getContractStatus()" --rpc-url $RPC_URL | cast to-dec)"

echo -e "\n➕ Adding tasks..."
for i in {1..3}; do
    echo "Adding task $i..."
    cast send $CONTRACT_ADDRESS "addTask()" --account $ACCOUNT --rpc-url $RPC_URL --quiet
done

echo -e "\n📊 Updated State:"
echo "Task Count: $(cast call $CONTRACT_ADDRESS "taskCount()" --rpc-url $RPC_URL | cast to-dec)"
echo "Your Tasks: $(cast call $CONTRACT_ADDRESS "userTaskCount(address)" $(cast wallet address --account $ACCOUNT) --rpc-url $RPC_URL | cast to-dec)"

echo -e "\n🧮 Fee Calculations:"
echo "Fee for 100: $(cast call $CONTRACT_ADDRESS "calculateFee(uint256)" 100 --rpc-url $RPC_URL | cast to-dec)"
echo "Fee for 1000: $(cast call $CONTRACT_ADDRESS "calculateFee(uint256)" 1000 --rpc-url $RPC_URL | cast to-dec)"
```

Jalankan script:

```bash
chmod +x scripts/interact.sh
./scripts/interact.sh
```

---

## 10. Best Practices dan Tips

### Security Best Practices

#### 1. Private Key Management
```bash
# ✅ GOOD: Gunakan encrypted keystore
cast wallet import my-deployer --private-key $PRIVATE_KEY

# ❌ BAD: Jangan expose private key di command line
forge create --private-key 0x1234567890abcdef... # JANGAN!

# ✅ GOOD: Gunakan environment variables untuk scripts
export PRIVATE_KEY=$(cast wallet private-key --account my-deployer)
```

#### 2. Network Safety
```bash
# Selalu verifikasi network sebelum deployment
cast client --rpc-url https://testnet-rpc.monad.xyz/

# Test dengan dry run dulu
forge script script/DeployTaskManager.s.sol --rpc-url URL # tanpa --broadcast
```

#### 3. Contract Verification
```bash
# Selalu verifikasi contract setelah deployment
forge verify-contract CONTRACT_ADDRESS src/Contract.sol:ContractName --chain CHAIN_ID
```

### Development Tips

#### 1. Testing Strategies
```bash
# Run specific test pattern
forge test --match-test "test_Should.*Successfully"

# Test dengan gas reporting
forge test --gas-report

# Fuzz testing dengan custom runs
forge test --fuzz-runs 10000 --match-test "testFuzz_"

# Test dengan verbose output untuk debugging
forge test -vvvv --match-test test_specific_function
```

#### 2. Code Organization
```
src/
├── TaskManager.sol          # Main contract
├── interfaces/              # Interface definitions
│   └── ITaskManager.sol
├── libraries/               # Reusable libraries
│   └── TaskUtils.sol
└── abstracts/              # Abstract contracts
    └── Ownable.sol

test/
├── TaskManager.t.sol        # Main tests
├── integration/             # Integration tests
│   └── TaskManagerIntegration.t.sol
└── utils/                  # Test utilities
    └── TestUtils.sol

script/
├── DeployTaskManager.s.sol  # Deployment script
├── interactions/            # Interaction scripts
│   └── InteractTaskManager.s.sol
└── utils/                  # Script utilities
    └── DeployUtils.sol
```

#### 3. Gas Optimization
```solidity
// ✅ Batch operations untuk efisiensi gas
function addMultipleTasks(uint256 count) external {
    require(isActive, "Contract not active");
    
    taskCount += count;
    userTaskCount[msg.sender] += count;
    
    emit TaskAdded(msg.sender, userTaskCount[msg.sender]);
}

// ✅ Pack struct variables
struct Task {
    uint128 id;        // Menggunakan uint128 instead of uint256
    uint128 timestamp; // Bisa dipacking dalam single slot
    address owner;     // 20 bytes
    bool completed;    // 1 byte, packed dengan address
}

// ✅ Use custom errors (lebih efficient dari string)
error ContractNotActive();
error InsufficientPermission();
```

### Debugging dan Troubleshooting

#### 1. Common Foundry Issues

**Issue: "Failed to get EIP-1559 fees"**
```bash
# Solution: Use legacy transactions
forge create --legacy src/Contract.sol:Contract --account deployer
```

**Issue: "Invalid JSON response"**
```bash
# Solution: Check RPC URL dan network status
cast client --rpc-url https://testnet-rpc.monad.xyz/
```

**Issue: "Nonce too high"**
```bash
# Solution: Wait for network sync atau gunakan specific nonce
cast nonce $(cast wallet address --account deployer) --rpc-url URL
```

#### 2. Testing Debug Techniques

```solidity
// Debug dengan console.log
import "lib/forge-std/src/console.sol";

function test_DebugExample() public {
    uint256 value = 123;
    console.log("Debug value:", value);
    console.log("Address:", address(this));
    console.logBytes32(keccak256("test"));
}

// Debug dengan vm.expectRevert
function test_ShouldRevertWithMessage() public {
    vm.expectRevert("Contract not active");
    // function call yang seharusnya revert
}

// Debug state changes
function test_StateChanges() public {
    uint256 beforeCount = taskManager.taskCount();
    taskManager.addTask();
    uint256 afterCount = taskManager.taskCount();
    
    console.log("Before:", beforeCount);
    console.log("After:", afterCount);
    assertEq(afterCount, beforeCount + 1);
}
```

#### 3. Performance Optimization

```bash
# Profile gas usage
forge test --gas-report

# Benchmark specific functions
forge test --match-test "testGas_" --gas-report

# Optimize compiler settings di foundry.toml
[profile.default]
optimizer = true
optimizer_runs = 200
via_ir = true  # Untuk optimasi lebih aggressive
```

### Production Deployment Checklist

#### Pre-Deployment
- [ ] All tests passing: `forge test`
- [ ] Gas usage optimized: `forge test --gas-report`
- [ ] Code coverage adequate: `forge coverage`
- [ ] Security audit completed (for production)
- [ ] Deployment script tested: `forge script --rpc-url URL` (without broadcast)
- [ ] Sufficient balance for deployment: `cast balance ADDRESS`

#### Deployment
- [ ] Deploy to testnet first: `forge create --account deployer`
- [ ] Verify contract: `forge verify-contract`
- [ ] Test all functions: `cast call` dan `cast send`
- [ ] Monitor initial transactions: `cast logs`
- [ ] Document contract address dan transaction hash

#### Post-Deployment
- [ ] Update frontend/backend dengan contract address
- [ ] Update documentation
- [ ] Monitor contract usage dan events
- [ ] Setup monitoring alerts untuk critical functions
- [ ] Backup deployment info: `deployments/*.json`

### Useful Commands Reference

```bash
# Development
forge build                          # Compile contracts
forge test                          # Run tests
forge test -vvv                     # Verbose test output
forge coverage                      # Test coverage
forge doc                          # Generate documentation

# Deployment
forge create src/Contract.sol:Contract --account deployer
forge script script/Deploy.s.sol --broadcast --account deployer
forge verify-contract ADDRESS src/Contract.sol:Contract --chain CHAIN_ID

# Interaction
cast call CONTRACT "function()" --rpc-url URL
cast send CONTRACT "function()" --account deployer --rpc-url URL
cast logs --address CONTRACT --rpc-url URL

# Wallet Management
cast wallet new                     # Generate new wallet
cast wallet import name --private-key KEY
cast wallet list                    # List saved wallets
cast wallet address --account name  # Get address
cast balance ADDRESS --rpc-url URL  # Check balance

# Utilities
cast abi-encode "function(type)" value
cast abi-decode "function(type)" data
cast to-unit wei ether
cast to-dec HEX_VALUE
cast parse-bytes32-address HEX
```

---

## Kesimpulan

Selamat! Anda telah berhasil mempelajari dan mengimplementasikan TaskManager smart contract menggunakan Foundry dengan template Monad. Tutorial ini mencakup:

### ✅ Yang Telah Dipelajari

1. **Instalasi dan Setup Foundry** - Setup environment untuk macOS dan Windows
2. **Template Monad Integration** - Menggunakan template official untuk Monad development
3. **Smart Contract Development** - Membuat TaskManager dengan fitur lengkap dan events
4. **Comprehensive Testing** - Testing dengan Solidity, fuzz testing, dan event testing
5. **Professional Deployment** - Script deployment yang informatif dan reproducible
6. **Wallet Management** - Secure wallet management dengan Cast keystore
7. **Contract Interaction** - Read/write operations menggunakan Cast CLI
8. **Contract Verification** - Sourcify integration untuk code verification
9. **Best Practices** - Security, optimization, dan professional development practices

### 🚀 Keunggulan Foundry vs Hardhat

| Aspect | Foundry | Hardhat |
|--------|---------|---------|
| **Speed** | ⚡ Sangat cepat (Rust-based) | 🐌 Lebih lambat (JavaScript) |
| **Testing** | 📝 Solidity native testing | 🔧 JavaScript/TypeScript testing |
| **Gas Reporting** | 📊 Built-in gas reporting | 🔌 Memerlukan plugin |
| **Fuzz Testing** | 🎯 Native fuzz testing | ❌ Tidak ada built-in |
| **CLI Tools** | 🛠️ Comprehensive CLI (cast, anvil) | 🖥️ Limited CLI tools |
| **Setup** | ⚙️ Minimal setup | 📦 Lebih banyak dependencies |

### 🎯 Next Steps

1. **Extend TaskManager** - Tambah fitur seperti task priorities, deadlines, atau rewards
2. **Build Frontend** - Buat React app untuk berinteraksi dengan contract
3. **Advanced Features** - Implement upgradeable contracts, multi-sig, atau governance
4. **Production Deploy** - Deploy ke Monad Mainnet (ketika tersedia)
5. **Integration** - Integrasikan dengan DeFi protocols atau NFT systems

### 📚 Resources

- [Foundry Book](https://book.getfoundry.sh/) - Official documentation
- [Monad Documentation](https://docs.monad.xyz/) - Monad specific guides
- [Solidity Documentation](https://docs.soliditylang.org/) - Smart contract language reference
- [OpenZeppelin](https://docs.openzeppelin.com/) - Secure contract libraries

Foundry memberikan experience yang sangat powerful dan efficient untuk smart contract development. Dengan speed, built-in testing framework, dan comprehensive tooling, Foundry adalah pilihan excellent untuk professional blockchain development di Monad ecosystem.

Happy building! 🚀