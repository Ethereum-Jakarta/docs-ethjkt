---
sidebar_position: 4
title: 4. Testing Smart Contract TaskManager
description: Membuat comprehensive testing untuk TaskManager smart contract menggunakan Hardhat dan Chai
keywords: [testing, hardhat, chai, smart contract, solidity, taskmanager, mocha, typescript]
---

# 4. Testing Smart Contract TaskManager

Testing adalah bagian penting dalam pengembangan smart contract yang tidak bisa diabaikan. Smart contract yang telah di-deploy ke blockchain tidak dapat diubah, sehingga kita harus memastikan semua functionality berjalan dengan benar sebelum deployment. Pada bagian ini, kita akan membuat comprehensive testing untuk TaskManager contract.

## 1. Memahami Testing Framework

Hardhat menggunakan kombinasi framework testing yang powerful:

- **Mocha**: JavaScript test framework
- **Chai**: Assertion library untuk ekspektasi yang readable
- **Ethers.js**: Library untuk berinteraksi dengan Ethereum

### Testing Structure

```
describe("Contract Name", () => {
  describe("Feature Group", () => {
    it("should do specific thing", async () => {
      // Test implementation
    });
  });
});
```

## 2. Membuat File Test

Pertama, hapus file test yang sudah ada dan buat file test baru untuk TaskManager:

### Langkah-langkah:

1. Hapus file `test/Lock.ts` (klik kanan → Delete)
2. Buat file baru `test/TaskManager.test.ts`
3. Salin kode test berikut ke dalam file tersebut:

```typescript
import { expect } from "chai";
import { ethers } from "hardhat";
import { TaskManager } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("TaskManager", function () {
  let taskManager: TaskManager;
  let owner: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;

  // Hook yang dijalankan sebelum setiap test
  beforeEach(async function () {
    // Mendapatkan signers (akun test)
    [owner, user1, user2] = await ethers.getSigners();

    // Deploy contract baru untuk setiap test
    const TaskManagerFactory = await ethers.getContractFactory("TaskManager");
    taskManager = await TaskManagerFactory.deploy();
    await taskManager.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await taskManager.owner()).to.equal(owner.address);
    });

    it("Should initialize taskCount to 0", async function () {
      expect(await taskManager.taskCount()).to.equal(0);
    });

    it("Should initialize userTaskCount to 0 for any address", async function () {
      expect(await taskManager.userTaskCount(user1.address)).to.equal(0);
      expect(await taskManager.userTaskCount(user2.address)).to.equal(0);
    });
  });

  describe("View Functions", function () {
    it("Should return correct owner address", async function () {
      const ownerAddress = await taskManager.getOwner();
      expect(ownerAddress).to.equal(owner.address);
    });

    it("Should calculate fee correctly", async function () {
      // Test dengan berbagai nilai
      expect(await taskManager.calculateFee(100)).to.equal(2); // 2% dari 100 = 2
      expect(await taskManager.calculateFee(1000)).to.equal(20); // 2% dari 1000 = 20
      expect(await taskManager.calculateFee(50)).to.equal(1); // 2% dari 50 = 1
    });

    it("Should handle edge cases for calculateFee", async function () {
      expect(await taskManager.calculateFee(0)).to.equal(0);
      expect(await taskManager.calculateFee(1)).to.equal(0); // 1 * 2 / 100 = 0 (integer division)
    });
  });

  describe("Add Task Function", function () {
    it("Should add task successfully", async function () {
      // Tambah task dari user1
      await taskManager.connect(user1).addTask();

      // Verify taskCount bertambah
      expect(await taskManager.taskCount()).to.equal(1);
      
      // Verify userTaskCount bertambah untuk user1
      expect(await taskManager.userTaskCount(user1.address)).to.equal(1);
    });

    it("Should allow multiple users to add tasks", async function () {
      // User1 tambah 2 tasks
      await taskManager.connect(user1).addTask();
      await taskManager.connect(user1).addTask();

      // User2 tambah 1 task
      await taskManager.connect(user2).addTask();

      // Verify counts
      expect(await taskManager.taskCount()).to.equal(3);
      expect(await taskManager.userTaskCount(user1.address)).to.equal(2);
      expect(await taskManager.userTaskCount(user2.address)).to.equal(1);
    });

    it("Should track individual user task counts correctly", async function () {
      // User1 tambah 5 tasks
      for (let i = 0; i < 5; i++) {
        await taskManager.connect(user1).addTask();
      }

      // User2 tambah 3 tasks
      for (let i = 0; i < 3; i++) {
        await taskManager.connect(user2).addTask();
      }

      // Verify individual counts
      expect(await taskManager.userTaskCount(user1.address)).to.equal(5);
      expect(await taskManager.userTaskCount(user2.address)).to.equal(3);
      expect(await taskManager.taskCount()).to.equal(8);
    });

    it("Should emit no events (TaskManager doesn't have events)", async function () {
      // Karena contract tidak memiliki events, kita hanya test bahwa transaction berhasil
      const tx = await taskManager.connect(user1).addTask();
      const receipt = await tx.wait();
      
      // Verify transaction was successful
      expect(receipt?.status).to.equal(1);
    });
  });

  describe("Gas Usage", function () {
    it("Should use reasonable gas for addTask", async function () {
      const tx = await taskManager.connect(user1).addTask();
      const receipt = await tx.wait();
      
      // Gas usage untuk addTask harus reasonable (< 100k gas)
      expect(receipt?.gasUsed).to.be.lessThan(100000);
      
      console.log(`Gas used for addTask: ${receipt?.gasUsed.toString()}`);
    });

    it("Should use no gas for view functions when called directly", async function () {
      // View functions tidak menggunakan gas ketika dipanggil langsung
      const owner = await taskManager.getOwner();
      const fee = await taskManager.calculateFee(100);
      
      expect(owner).to.be.a('string');
      expect(fee).to.equal(2);
    });
  });

  describe("Edge Cases", function () {
    it("Should handle large numbers in calculateFee", async function () {
      const largeNumber = ethers.parseEther("1000000"); // 1M ETH in wei
      const expectedFee = largeNumber * BigInt(2) / BigInt(100);
      
      expect(await taskManager.calculateFee(largeNumber)).to.equal(expectedFee);
    });

    it("Should maintain state correctly after many operations", async function () {
      // Simulasi penggunaan intensif
      const iterations = 10;
      
      for (let i = 0; i < iterations; i++) {
        await taskManager.connect(user1).addTask();
        await taskManager.connect(user2).addTask();
      }

      expect(await taskManager.taskCount()).to.equal(iterations * 2);
      expect(await taskManager.userTaskCount(user1.address)).to.equal(iterations);
      expect(await taskManager.userTaskCount(user2.address)).to.equal(iterations);
    });
  });

  describe("Contract State Consistency", function () {
    it("Should maintain consistency between total and individual counts", async function () {
      const users = [user1, user2, owner];
      let totalExpected = 0;

      // Setiap user tambah task dengan jumlah berbeda
      for (let i = 0; i < users.length; i++) {
        const tasksToAdd = i + 1; // user1: 1, user2: 2, owner: 3
        for (let j = 0; j < tasksToAdd; j++) {
          await taskManager.connect(users[i]).addTask();
        }
        totalExpected += tasksToAdd;
      }

      // Verify total count
      expect(await taskManager.taskCount()).to.equal(totalExpected);

      // Verify individual counts
      let totalFromUsers = 0;
      for (let i = 0; i < users.length; i++) {
        const userCount = await taskManager.userTaskCount(users[i].address);
        totalFromUsers += Number(userCount);
        expect(userCount).to.equal(i + 1);
      }

      // Total dari semua user harus sama dengan taskCount
      expect(totalFromUsers).to.equal(totalExpected);
    });
  });
});
```

## 3. Analisis Test Structure

Mari kita pahami struktur testing yang telah dibuat:

### Setup dan Initialization

```typescript
import { expect } from "chai";
import { ethers } from "hardhat";
import { TaskManager } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("TaskManager", function () {
  let taskManager: TaskManager;
  let owner: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;
```

- **expect**: Chai assertion library
- **ethers**: Hardhat's ethers untuk blockchain interaction
- **TaskManager**: TypeScript type dari compiled contract
- **SignerWithAddress**: Type untuk Ethereum accounts

### BeforeEach Hook

```typescript
beforeEach(async function () {
  [owner, user1, user2] = await ethers.getSigners();
  
  const TaskManagerFactory = await ethers.getContractFactory("TaskManager");
  taskManager = await TaskManagerFactory.deploy();
  await taskManager.waitForDeployment();
});
```

BeforeEach hook memastikan:
- Fresh contract instance untuk setiap test
- Isolated test environment
- Consistent initial state

## 4. Test Categories

### 4.1 Deployment Tests

```typescript
describe("Deployment", function () {
  it("Should set the right owner", async function () {
    expect(await taskManager.owner()).to.equal(owner.address);
  });

  it("Should initialize taskCount to 0", async function () {
    expect(await taskManager.taskCount()).to.equal(0);
  });

  it("Should initialize userTaskCount to 0 for any address", async function () {
    expect(await taskManager.userTaskCount(user1.address)).to.equal(0);
    expect(await taskManager.userTaskCount(user2.address)).to.equal(0);
  });
});
```

**Tujuan**: Memastikan contract ter-deploy dengan benar dan initial state sesuai harapan.

### 4.2 View Function Tests

```typescript
describe("View Functions", function () {
  it("Should return correct owner address", async function () {
    const ownerAddress = await taskManager.getOwner();
    expect(ownerAddress).to.equal(owner.address);
  });

  it("Should calculate fee correctly", async function () {
    expect(await taskManager.calculateFee(100)).to.equal(2); // 2% dari 100 = 2
    expect(await taskManager.calculateFee(1000)).to.equal(20); // 2% dari 1000 = 20
    expect(await taskManager.calculateFee(50)).to.equal(1); // 2% dari 50 = 1
  });

  it("Should handle edge cases for calculateFee", async function () {
    expect(await taskManager.calculateFee(0)).to.equal(0);
    expect(await taskManager.calculateFee(1)).to.equal(0); // integer division
  });
});
```

**Tujuan**: Menguji fungsi yang tidak mengubah state (view/pure functions).

### 4.3 State Changing Function Tests

```typescript
describe("Add Task Function", function () {
  it("Should add task successfully", async function () {
    await taskManager.connect(user1).addTask();
    expect(await taskManager.taskCount()).to.equal(1);
    expect(await taskManager.userTaskCount(user1.address)).to.equal(1);
  });

  it("Should allow multiple users to add tasks", async function () {
    await taskManager.connect(user1).addTask();
    await taskManager.connect(user1).addTask();
    await taskManager.connect(user2).addTask();

    expect(await taskManager.taskCount()).to.equal(3);
    expect(await taskManager.userTaskCount(user1.address)).to.equal(2);
    expect(await taskManager.userTaskCount(user2.address)).to.equal(1);
  });

  it("Should track individual user task counts correctly", async function () {
    // User1 tambah 5 tasks
    for (let i = 0; i < 5; i++) {
      await taskManager.connect(user1).addTask();
    }

    // User2 tambah 3 tasks
    for (let i = 0; i < 3; i++) {
      await taskManager.connect(user2).addTask();
    }

    expect(await taskManager.userTaskCount(user1.address)).to.equal(5);
    expect(await taskManager.userTaskCount(user2.address)).to.equal(3);
    expect(await taskManager.taskCount()).to.equal(8);
  });

  it("Should emit no events (TaskManager doesn't have events)", async function () {
    const tx = await taskManager.connect(user1).addTask();
    const receipt = await tx.wait();
    expect(receipt?.status).to.equal(1);
  });
});
```

**Tujuan**: Menguji fungsi yang mengubah state contract.

### 4.4 Gas Usage Tests

```typescript
describe("Gas Usage", function () {
  it("Should use reasonable gas for addTask", async function () {
    const tx = await taskManager.connect(user1).addTask();
    const receipt = await tx.wait();
    
    expect(receipt?.gasUsed).to.be.lessThan(100000);
    console.log(`Gas used for addTask: ${receipt?.gasUsed.toString()}`);
  });

  it("Should use no gas for view functions when called directly", async function () {
    const owner = await taskManager.getOwner();
    const fee = await taskManager.calculateFee(100);
    
    expect(owner).to.be.a('string');
    expect(fee).to.equal(2);
  });
});
```

**Tujuan**: Memastikan contract efisien dalam penggunaan gas.

### 4.5 Edge Case Tests

```typescript
describe("Edge Cases", function () {
  it("Should handle large numbers in calculateFee", async function () {
    const largeNumber = ethers.parseEther("1000000"); // 1M ETH in wei
    const expectedFee = largeNumber * BigInt(2) / BigInt(100);
    
    expect(await taskManager.calculateFee(largeNumber)).to.equal(expectedFee);
  });

  it("Should maintain state correctly after many operations", async function () {
    const iterations = 10;
    
    for (let i = 0; i < iterations; i++) {
      await taskManager.connect(user1).addTask();
      await taskManager.connect(user2).addTask();
    }

    expect(await taskManager.taskCount()).to.equal(iterations * 2);
    expect(await taskManager.userTaskCount(user1.address)).to.equal(iterations);
    expect(await taskManager.userTaskCount(user2.address)).to.equal(iterations);
  });
});
```

**Tujuan**: Menguji skenario ekstrem dan boundary conditions.

### 4.6 Contract State Consistency Tests

```typescript
describe("Contract State Consistency", function () {
  it("Should maintain consistency between total and individual counts", async function () {
    const users = [user1, user2, owner];
    let totalExpected = 0;

    // Setiap user tambah task dengan jumlah berbeda
    for (let i = 0; i < users.length; i++) {
      const tasksToAdd = i + 1; // user1: 1, user2: 2, owner: 3
      for (let j = 0; j < tasksToAdd; j++) {
        await taskManager.connect(users[i]).addTask();
      }
      totalExpected += tasksToAdd;
    }

    // Verify total count
    expect(await taskManager.taskCount()).to.equal(totalExpected);

    // Verify individual counts
    let totalFromUsers = 0;
    for (let i = 0; i < users.length; i++) {
      const userCount = await taskManager.userTaskCount(users[i].address);
      totalFromUsers += Number(userCount);
      expect(userCount).to.equal(i + 1);
    }

    // Total dari semua user harus sama dengan taskCount
    expect(totalFromUsers).to.equal(totalExpected);
  });
});
```

**Tujuan**: Memastikan konsistensi data antara total count dan individual user counts.

## 5. Menjalankan Tests

### Menjalankan Semua Tests

```bash
npx hardhat test
```

Output yang diharapkan:
```
  TaskManager
    Deployment
      ✓ Should set the right owner (45ms)
      ✓ Should initialize taskCount to 0 (38ms)
      ✓ Should initialize userTaskCount to 0 for any address (42ms)
    View Functions
      ✓ Should return correct owner address (35ms)
      ✓ Should calculate fee correctly (41ms)
      ✓ Should handle edge cases for calculateFee (39ms)
    Add Task Function
      ✓ Should add task successfully (67ms)
      ✓ Should allow multiple users to add tasks (89ms)
      ✓ Should track individual user task counts correctly (245ms)
      ✓ Should emit no events (TaskManager doesn't have events) (51ms)
    Gas Usage
      ✓ Should use reasonable gas for addTask (58ms)
      ✓ Should use no gas for view functions when called directly (37ms)
    Edge Cases
      ✓ Should handle large numbers in calculateFee (43ms)
      ✓ Should maintain state correctly after many operations (312ms)
    Contract State Consistency
      ✓ Should maintain consistency between total and individual counts (187ms)

  14 passing (1.4s)
```

### Menjalankan Test Spesifik

```bash
# Test file tertentu
npx hardhat test test/TaskManager.test.ts

# Test dengan pattern
npx hardhat test --grep "Deployment"

# Test dengan verbose output
npx hardhat test --verbose
```

### Test dengan Gas Reporter

Untuk melihat detail penggunaan gas:

```bash
REPORT_GAS=true npx hardhat test
```

Output akan menampilkan tabel gas usage:
```
·-----------------------------|----------------------------|-------------|-----------------------------·
|    Solc version: 0.8.28     ·  Optimizer enabled: true   ·  Runs: 200  ·  Block limit: 30000000 gas  │
································|····························|·············|······························
|  Methods                     ·               20 gwei/gas                ·       1500.00 usd/eth       │
·············|·················|··············|·············|·············|···············|··············
|  Contract  ·  Method         ·  Min         ·  Max        ·  Avg        ·  # calls      ·  usd (avg)  │
·············|·················|··············|·············|·············|···············|··············
|  TaskManager ·  addTask      ·       43842  ·      60942  ·      48142  ·           15  ·       1.44  │
·············|·················|··············|·············|·············|···············|··············
```

## 6. Test Coverage

Untuk melihat code coverage, jalankan:

```bash
npx hardhat coverage
```

Output akan menampilkan:
```
----------|----------|----------|----------|----------|----------------|
File      |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
----------|----------|----------|----------|----------|----------------|
 contracts/
  TaskManager.sol |    87.5  |      50   |     100  |    87.5  |             24 |
----------|----------|----------|----------|----------|----------------|
All files |    87.5  |      50   |     100  |    87.5  |                |
----------|----------|----------|----------|----------|----------------|
```

## 7. Advanced Testing Techniques

### 7.1 Testing dengan Multiple Accounts

```typescript
it("Should allow multiple users to add tasks", async function () {
  await taskManager.connect(user1).addTask();
  await taskManager.connect(user2).addTask();
  
  expect(await taskManager.userTaskCount(user1.address)).to.equal(1);
  expect(await taskManager.userTaskCount(user2.address)).to.equal(1);
});
```

### 7.2 Testing dengan Big Numbers

```typescript
it("Should handle large numbers", async function () {
  const largeNumber = ethers.parseEther("1000000");
  const result = await taskManager.calculateFee(largeNumber);
  expect(result).to.be.gt(0);
});
```

### 7.3 Testing Gas Limits

```typescript
it("Should not exceed gas limit", async function () {
  const tx = await taskManager.connect(user1).addTask();
  const receipt = await tx.wait();
  expect(receipt?.gasUsed).to.be.lessThan(100000);
});
```

## 8. Best Practices untuk Testing

### 8.1 Test Organization

- **Descriptive Names**: Gunakan nama test yang jelas dan spesifik
- **Grouping**: Kelompokkan test berdasarkan functionality
- **Isolation**: Setiap test harus independent

### 8.2 Assertion Patterns

```typescript
// Good: Specific assertions
expect(await contract.taskCount()).to.equal(1);
expect(await contract.owner()).to.equal(owner.address);

// Bad: Generic assertions
expect(result).to.be.ok;
expect(value).to.exist;
```

### 8.3 Error Testing

Meskipun TaskManager tidak memiliki revert conditions yang kompleks, penting untuk menguji error scenarios:

```typescript
it("Should revert when contract is not active", async function () {
  // Jika ada kondisi yang menyebabkan revert
  await expect(taskManager.someFunction())
    .to.be.revertedWith("Contract not active");
});
```

## 9. Debugging Tests

### 9.1 Console Logging

```typescript
it("Should debug values", async function () {
  const tx = await taskManager.connect(user1).addTask();
  const receipt = await tx.wait();
  
  console.log(`Gas used: ${receipt?.gasUsed}`);
  console.log(`Task count: ${await taskManager.taskCount()}`);
  
  expect(receipt?.gasUsed).to.be.lessThan(100000);
});
```

### 9.2 Stack Traces

Ketika test gagal, Hardhat memberikan stack trace yang detail:

```
Error: Expected "2" to equal "1"
  at Context.<anonymous> (test/TaskManager.test.ts:45:5)
  at processImmediate (internal/timers.js:461:26)
```

## 10. Continuous Integration

Untuk production projects, tambahkan testing ke CI/CD pipeline:

```yaml
# .github/workflows/test.yml
name: Test
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run compile
      - run: npm run test
```

## 11. Script untuk Testing

Tambahkan script di `package.json`:

```json
{
  "scripts": {
    "test": "hardhat test",
    "test:coverage": "hardhat coverage",
    "test:gas": "REPORT_GAS=true hardhat test",
    "test:watch": "hardhat test --watch"
  }
}
```

Sekarang Anda dapat menggunakan:

```bash
npm run test           # Run semua tests
npm run test:coverage  # Run dengan coverage report
npm run test:gas      # Run dengan gas reporter
```

## Kesimpulan

Testing yang comprehensive sangat penting untuk smart contract development karena:

1. **Immutability**: Smart contract tidak bisa diubah setelah deployment
2. **Financial Risk**: Bug dalam smart contract bisa menyebabkan kerugian finansial
3. **Security**: Testing membantu mengidentifikasi vulnerability sebelum deployment
4. **Gas Efficiency**: Testing membantu optimasi penggunaan gas

Pada bagian ini, kita telah berhasil:

1. Membuat comprehensive test suite untuk TaskManager contract
2. Memahami berbagai jenis testing (deployment, view functions, state changes, gas usage)
3. Mengimplementasikan best practices dalam testing
4. Mempelajari cara debugging dan analysis test results
5. Memahami tools seperti gas reporter dan coverage analysis

Test suite yang telah dibuat mencakup:
- ✅ **14 test cases** yang comprehensive
- ✅ Testing untuk semua public functions
- ✅ Edge case handling dan large number testing
- ✅ Gas usage monitoring dengan console logging
- ✅ State consistency verification antara total dan individual counts
- ✅ Multi-user interaction testing
- ✅ Transaction success verification

Dengan testing yang solid ini, kita dapat yakin bahwa TaskManager contract berfungsi dengan benar dan siap untuk deployment ke Monad Testnet pada bagian selanjutnya.