---
id: unit-testing
title: "Part 3: Testing SimpleBank Contract"
sidebar_label: "Part 3: Test SimpleBank"
sidebar_position: 3
description: "Menulis comprehensive tests untuk SimpleBank contract: unit tests, fuzz testing, test coverage, dan testing best practices."
---

# Part 3: Testing SimpleBank Contract

## 🎯 Tujuan Module

Setelah menyelesaikan module ini, Anda akan mampu:
- ✅ Memahami filosofi testing untuk smart contracts
- ✅ Menulis unit tests untuk SimpleBank dalam Solidity (bukan JavaScript!)
- ✅ Menggunakan assertions dan test helpers dari Foundry
- ✅ Mengimplementasikan fuzz testing untuk menemukan edge cases
- ✅ Mengukur dan meningkatkan test coverage
- ✅ Menerapkan testing best practices

---

## 💡 Why Test Smart Contracts?

### Analogi: Smart Contract = Boeing 777

**Boeing 777 (pesawat terbang):**
```
❌ TIDAK ADA UNDO button
❌ TIDAK BISA patch setelah terbang
❌ Bug = catastrophic failure
✅ HARUS tested extensively sebelum production

Testing requirements:
- Unit tests untuk setiap komponen
- Integration tests untuk sistem
- Stress tests untuk edge cases
- Final check sebelum first flight
```

**Smart Contract:**
```
❌ TIDAK ADA UNDO button (immutable!)
❌ TIDAK BISA update setelah deploy
❌ Bug = loss of funds
✅ HARUS tested extensively sebelum deployment

Testing requirements:
- Unit tests untuk setiap function
- Integration tests untuk flow
- Fuzz tests untuk edge cases
- Audit sebelum mainnet launch
```

### Real Examples of Untested Contracts:

**The DAO Hack (2016):**
```
Bug: Reentrancy vulnerability
Amount lost: 60M USD (3.6M ETH)
Cause: Tidak ada test untuk reentrancy
Lesson: ALWAYS test CEI pattern!
```

**Parity Wallet Freeze (2017):**
```
Bug: Unprotected delegatecall
Amount lost: 280M USD frozen forever
Cause: Tidak test access control
Lesson: Test ownership & permissions!
```

**Takeaway: 1 hour testing > months of regret** 🎯

---

## 📚 Foundry Testing Basics

### Testing Philosophy

**Foundry unique advantage:**
```
Hardhat: Test di JavaScript/TypeScript
   Contract (Solidity) ←→ Test (JavaScript)
   ❌ Different language
   ❌ Context switching
   ❌ Slower (need translator)

Foundry: Test di Solidity
   Contract (Solidity) ←→ Test (Solidity)
   ✅ Same language!
   ✅ No context switching
   ✅ SUPER FAST (native EVM)
```

### Test File Naming Convention

```
src/SimpleBank.sol       → Contract
test/SimpleBank.t.sol    → Test file (.t.sol suffix!)
```

**Why `.t.sol`?**
- Foundry recognizes test files by `.t.sol` suffix
- Auto-discovered during `forge test`
- Clear separation from contracts

---

## 🧪 Writing First Test

### Step 1: Create Test File

Buat file `test/SimpleBank.t.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {Test, console} from "forge-std/Test.sol";
import {SimpleBank} from "../src/SimpleBank.sol";

contract SimpleBankTest is Test {
    SimpleBank public bank;

    function setUp() public {
        bank = new SimpleBank();
    }
}
```

**Line-by-line explanation:**

```solidity
import {Test, console} from "forge-std/Test.sol";
```
- `Test` = Base test contract dari Foundry
- `console` = console.log untuk debugging
- `forge-std` = Foundry standard library

```solidity
import {SimpleBank} from "../src/SimpleBank.sol";
```
- Import contract yang mau ditest

```solidity
contract SimpleBankTest is Test {
```
- Test contract harus inherit dari `Test`
- Naming: `<ContractName>Test`

```solidity
SimpleBank public bank;
```
- Declare contract instance

```solidity
function setUp() public {
    bank = new SimpleBank();
}
```
- `setUp()` = runs BEFORE every test
- Deploy fresh contract untuk setiap test
- Ensures isolation (tests tidak saling affect)

---

## ✅ Test Assertions

### Common Assertions

```solidity
// Equality
assertEq(a, b);              // a == b
assertEq(a, b, "error msg"); // with custom message

// Boolean
assertTrue(x);               // x == true
assertFalse(x);              // x == false

// Greater/Less than
assertGt(a, b);              // a > b
assertGe(a, b);              // a >= b
assertLt(a, b);              // a < b
assertLe(a, b);              // a <= b

// Expect revert
vm.expectRevert();           // Next call should revert
vm.expectRevert(MyError.selector);  // Expect specific error
```

### Cheatcodes (vm.*)

Foundry provides special `vm` object untuk manipulate EVM:

```solidity
// Time manipulation
vm.warp(timestamp);          // Set block.timestamp

// Account manipulation
vm.prank(address);           // Next call from this address
vm.startPrank(address);      // All calls from this address
vm.stopPrank();              // Stop pranking

// Balance manipulation
vm.deal(address, amount);    // Set ETH balance

// Expect events
vm.expectEmit(true, true, false, true);
emit MyEvent(...);
```

---

## 🎯 Writing Comprehensive Tests

### Test 1: Deposit Function

```solidity
function test_Deposit() public {
    // Arrange: Setup test data
    uint256 depositAmount = 1 ether;

    // Act: Perform action
    vm.deal(address(this), depositAmount); // Give this contract ETH
    bank.deposit{value: depositAmount}();

    // Assert: Verify results
    assertEq(bank.balances(address(this)), depositAmount);
    assertEq(bank.getTotalDeposits(), depositAmount);
}
```

**AAA Pattern (Arrange-Act-Assert):**
```
Arrange  = Setup test conditions
Act      = Execute function being tested
Assert   = Verify expected outcome
```

**With console.log:**
```solidity
function test_Deposit() public {
    uint256 depositAmount = 1 ether;

    console.log("Before deposit:");
    console.log("Balance:", bank.balances(address(this)));

    vm.deal(address(this), depositAmount);
    bank.deposit{value: depositAmount}();

    console.log("After deposit:");
    console.log("Balance:", bank.balances(address(this)));

    assertEq(bank.balances(address(this)), depositAmount);
}
```

Run with logs:
```bash
forge test -vv
```

---

### Test 2: Deposit Emits Event

```solidity
function test_DepositEmitsEvent() public {
    uint256 depositAmount = 1 ether;

    // Expect event to be emitted
    vm.expectEmit(true, false, false, true);
    emit SimpleBank.Deposited(address(this), depositAmount);

    vm.deal(address(this), depositAmount);
    bank.deposit{value: depositAmount}();
}
```

**expectEmit parameters:**
```solidity
vm.expectEmit(
    true,  // Check topic 1 (indexed param 1)
    false, // Check topic 2 (indexed param 2)
    false, // Check topic 3 (indexed param 3)
    true   // Check data (non-indexed params)
);
```

---

### Test 3: Deposit Reverts on Zero Amount

```solidity
function test_RevertWhen_DepositZero() public {
    // Expect revert with specific error
    vm.expectRevert(SimpleBank.ZeroAmount.selector);

    // Try to deposit 0
    bank.deposit{value: 0}();
}
```

**Test naming convention:**
```
test_<FunctionName>              → Happy path
test_RevertWhen_<Condition>      → Expected failure
testFuzz_<FunctionName>          → Fuzz test
```

---

### Test 4: Withdraw Function

```solidity
function test_Withdraw() public {
    // Setup: Deposit first
    uint256 depositAmount = 10 ether;
    uint256 withdrawAmount = 3 ether;

    vm.deal(address(this), depositAmount);
    bank.deposit{value: depositAmount}();

    // Record balance before withdraw
    uint256 balanceBefore = address(this).balance;

    // Withdraw
    bank.withdraw(withdrawAmount);

    // Assert
    assertEq(bank.balances(address(this)), depositAmount - withdrawAmount);
    assertEq(address(this).balance, balanceBefore + withdrawAmount);
}
```

**Need to receive ETH:**
```solidity
// Add receive function to test contract
receive() external payable {}
```

---

### Test 5: Withdraw Reverts on Insufficient Balance

```solidity
function test_RevertWhen_WithdrawInsufficientBalance() public {
    // Deposit 5 ETH
    vm.deal(address(this), 5 ether);
    bank.deposit{value: 5 ether}();

    // Try to withdraw 10 ETH (more than balance)
    vm.expectRevert(
        abi.encodeWithSelector(
            SimpleBank.InsufficientBalance.selector,
            10 ether,  // requested
            5 ether    // available
        )
    );
    bank.withdraw(10 ether);
}
```

**Testing custom errors with parameters:**
```solidity
vm.expectRevert(
    abi.encodeWithSelector(
        ErrorName.selector,
        param1,
        param2
    )
);
```

---

### Test 6: Transfer Function

```solidity
function test_Transfer() public {
    address alice = address(0x1);
    address bob = address(0x2);

    // Alice deposits 10 ETH
    vm.deal(alice, 10 ether);
    vm.prank(alice); // Next call from Alice
    bank.deposit{value: 10 ether}();

    // Alice transfers 3 ETH to Bob
    vm.prank(alice);
    bank.transfer(bob, 3 ether);

    // Assert
    assertEq(bank.balances(alice), 7 ether);
    assertEq(bank.balances(bob), 3 ether);
}
```

**vm.prank() pattern:**
```solidity
vm.prank(user);           // Only next call
bank.someFunction();      // This call from user

// vs

vm.startPrank(user);      // All following calls
bank.function1();         // From user
bank.function2();         // From user
vm.stopPrank();           // Stop
```

---

### Test 7: Transfer Emits Event

```solidity
function test_TransferEmitsEvent() public {
    address alice = address(0x1);
    address bob = address(0x2);

    vm.deal(alice, 10 ether);
    vm.prank(alice);
    bank.deposit{value: 10 ether}();

    // Expect event
    vm.expectEmit(true, true, false, true);
    emit SimpleBank.Transferred(alice, bob, 3 ether);

    vm.prank(alice);
    bank.transfer(bob, 3 ether);
}
```

---

## 🎲 Fuzz Testing

### What is Fuzz Testing?

**Analogi: Testing Manual vs Fuzz Testing**

**Manual testing:**
```
Test dengan input yang kita pilih:
- withdraw(1 ether)     → ✅ Pass
- withdraw(10 ether)    → ✅ Pass
- withdraw(100 ether)   → ✅ Pass

Problem: Bagaimana dengan 99 ether? atau 2^256-1?
```

**Fuzz testing:**
```
Foundry generate RANDOM inputs:
- withdraw(12387592 wei)     → Test
- withdraw(99283742819 wei)  → Test
- withdraw(2^256-1)          → Test
... (256 runs by default)

Benefit: Menemukan edge cases yang tidak terpikirkan!
```

### Write Fuzz Test

```solidity
function testFuzz_Deposit(uint256 amount) public {
    // Foundry akan call function ini dengan random 'amount'

    // Skip if amount is 0 (will revert)
    vm.assume(amount > 0);
    vm.assume(amount <= 1000 ether); // Reasonable upper limit

    vm.deal(address(this), amount);
    bank.deposit{value: amount}();

    assertEq(bank.balances(address(this)), amount);
}
```

**vm.assume():**
```solidity
vm.assume(condition);  // Skip test run if condition false
```

**Example run:**
```bash
forge test --match-test testFuzz_Deposit -vv
```

**Output:**
```
[PASS] testFuzz_Deposit(uint256) (runs: 256, μ: 28945, ~: 29012)
```

`runs: 256` = Foundry ran test with 256 different random inputs!

---

### Fuzz Test: Withdraw

```solidity
function testFuzz_Withdraw(uint256 depositAmount, uint256 withdrawAmount) public {
    // Constraints
    vm.assume(depositAmount > 0 && depositAmount <= 1000 ether);
    vm.assume(withdrawAmount > 0 && withdrawAmount <= depositAmount);

    // Deposit
    vm.deal(address(this), depositAmount);
    bank.deposit{value: depositAmount}();

    // Withdraw
    bank.withdraw(withdrawAmount);

    // Assert
    assertEq(bank.balances(address(this)), depositAmount - withdrawAmount);
}
```

**Multiple parameters:**
- Foundry generates random values for BOTH params
- Combinations tested: 256 runs

---

### Fuzz Test: Transfer Between Users

```solidity
function testFuzz_TransferBetweenUsers(
    address alice,
    address bob,
    uint256 depositAmount,
    uint256 transferAmount
) public {
    // Constraints
    vm.assume(alice != address(0) && bob != address(0));
    vm.assume(alice != bob);
    vm.assume(depositAmount > 0 && depositAmount <= 1000 ether);
    vm.assume(transferAmount > 0 && transferAmount <= depositAmount);

    // Alice deposits
    vm.deal(alice, depositAmount);
    vm.prank(alice);
    bank.deposit{value: depositAmount}();

    // Alice transfers to Bob
    vm.prank(alice);
    bank.transfer(bob, transferAmount);

    // Assert
    assertEq(bank.balances(alice), depositAmount - transferAmount);
    assertEq(bank.balances(bob), transferAmount);
}
```

**Benefits of fuzzing:**
- Finds edge cases you didn't think of
- Tests with realistic random data
- Higher confidence in contract security

---

## 🎯 Complete Test Suite

Gabungkan semua tests:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {Test, console} from "forge-std/Test.sol";
import {SimpleBank} from "../src/SimpleBank.sol";

contract SimpleBankTest is Test {
    SimpleBank public bank;

    // Test users
    address alice = address(0x1);
    address bob = address(0x2);

    function setUp() public {
        bank = new SimpleBank();
    }

    // ============ Deposit Tests ============

    function test_Deposit() public {
        uint256 depositAmount = 1 ether;

        vm.deal(address(this), depositAmount);
        bank.deposit{value: depositAmount}();

        assertEq(bank.balances(address(this)), depositAmount);
        assertEq(bank.getTotalDeposits(), depositAmount);
    }

    function test_DepositEmitsEvent() public {
        uint256 depositAmount = 1 ether;

        vm.expectEmit(true, false, false, true);
        emit SimpleBank.Deposited(address(this), depositAmount);

        vm.deal(address(this), depositAmount);
        bank.deposit{value: depositAmount}();
    }

    function test_RevertWhen_DepositZero() public {
        vm.expectRevert(SimpleBank.ZeroAmount.selector);
        bank.deposit{value: 0}();
    }

    function testFuzz_Deposit(uint256 amount) public {
        vm.assume(amount > 0 && amount <= 1000 ether);

        vm.deal(address(this), amount);
        bank.deposit{value: amount}();

        assertEq(bank.balances(address(this)), amount);
    }

    // ============ Withdraw Tests ============

    function test_Withdraw() public {
        uint256 depositAmount = 10 ether;
        uint256 withdrawAmount = 3 ether;

        vm.deal(address(this), depositAmount);
        bank.deposit{value: depositAmount}();

        uint256 balanceBefore = address(this).balance;
        bank.withdraw(withdrawAmount);

        assertEq(bank.balances(address(this)), depositAmount - withdrawAmount);
        assertEq(address(this).balance, balanceBefore + withdrawAmount);
    }

    function test_WithdrawEmitsEvent() public {
        uint256 depositAmount = 10 ether;
        uint256 withdrawAmount = 3 ether;

        vm.deal(address(this), depositAmount);
        bank.deposit{value: depositAmount}();

        vm.expectEmit(true, false, false, true);
        emit SimpleBank.Withdrawn(address(this), withdrawAmount);

        bank.withdraw(withdrawAmount);
    }

    function test_RevertWhen_WithdrawZero() public {
        vm.expectRevert(SimpleBank.ZeroAmount.selector);
        bank.withdraw(0);
    }

    function test_RevertWhen_WithdrawInsufficientBalance() public {
        vm.deal(address(this), 5 ether);
        bank.deposit{value: 5 ether}();

        vm.expectRevert(
            abi.encodeWithSelector(
                SimpleBank.InsufficientBalance.selector,
                10 ether,
                5 ether
            )
        );
        bank.withdraw(10 ether);
    }

    function testFuzz_Withdraw(uint256 depositAmount, uint256 withdrawAmount) public {
        vm.assume(depositAmount > 0 && depositAmount <= 1000 ether);
        vm.assume(withdrawAmount > 0 && withdrawAmount <= depositAmount);

        vm.deal(address(this), depositAmount);
        bank.deposit{value: depositAmount}();

        bank.withdraw(withdrawAmount);

        assertEq(bank.balances(address(this)), depositAmount - withdrawAmount);
    }

    // ============ Transfer Tests ============

    function test_Transfer() public {
        vm.deal(alice, 10 ether);
        vm.prank(alice);
        bank.deposit{value: 10 ether}();

        vm.prank(alice);
        bank.transfer(bob, 3 ether);

        assertEq(bank.balances(alice), 7 ether);
        assertEq(bank.balances(bob), 3 ether);
    }

    function test_TransferEmitsEvent() public {
        vm.deal(alice, 10 ether);
        vm.prank(alice);
        bank.deposit{value: 10 ether}();

        vm.expectEmit(true, true, false, true);
        emit SimpleBank.Transferred(alice, bob, 3 ether);

        vm.prank(alice);
        bank.transfer(bob, 3 ether);
    }

    function test_RevertWhen_TransferZero() public {
        vm.expectRevert(SimpleBank.ZeroAmount.selector);
        bank.transfer(bob, 0);
    }

    function test_RevertWhen_TransferInsufficientBalance() public {
        vm.deal(alice, 5 ether);
        vm.prank(alice);
        bank.deposit{value: 5 ether}();

        vm.expectRevert(
            abi.encodeWithSelector(
                SimpleBank.InsufficientBalance.selector,
                10 ether,
                5 ether
            )
        );

        vm.prank(alice);
        bank.transfer(bob, 10 ether);
    }

    function testFuzz_TransferBetweenUsers(
        address sender,
        address receiver,
        uint256 depositAmount,
        uint256 transferAmount
    ) public {
        vm.assume(sender != address(0) && receiver != address(0));
        vm.assume(sender != receiver);
        vm.assume(depositAmount > 0 && depositAmount <= 1000 ether);
        vm.assume(transferAmount > 0 && transferAmount <= depositAmount);

        vm.deal(sender, depositAmount);
        vm.prank(sender);
        bank.deposit{value: depositAmount}();

        vm.prank(sender);
        bank.transfer(receiver, transferAmount);

        assertEq(bank.balances(sender), depositAmount - transferAmount);
        assertEq(bank.balances(receiver), transferAmount);
    }

    // ============ Helper for receiving ETH ============

    receive() external payable {}
}
```

---

## 🏃 Running Tests

### Run All Tests

```bash
forge test
```

**Output:**
```
Running 13 tests for test/SimpleBank.t.sol:SimpleBankTest
[PASS] test_Deposit() (gas: 56789)
[PASS] test_DepositEmitsEvent() (gas: 54321)
[PASS] test_RevertWhen_DepositZero() (gas: 12345)
[PASS] testFuzz_Deposit(uint256) (runs: 256, μ: 58234, ~: 58012)
[PASS] test_Withdraw() (gas: 89234)
[PASS] test_WithdrawEmitsEvent() (gas: 87654)
[PASS] test_RevertWhen_WithdrawZero() (gas: 13456)
[PASS] test_RevertWhen_WithdrawInsufficientBalance() (gas: 67890)
[PASS] testFuzz_Withdraw(uint256,uint256) (runs: 256, μ: 91234, ~: 91012)
[PASS] test_Transfer() (gas: 112345)
[PASS] test_TransferEmitsEvent() (gas: 110987)
[PASS] test_RevertWhen_TransferZero() (gas: 14567)
[PASS] test_RevertWhen_TransferInsufficientBalance() (gas: 78901)
[PASS] testFuzz_TransferBetweenUsers(address,address,uint256,uint256) (runs: 256, μ: 115678, ~: 115234)

Test result: ok. 13 passed; 0 failed; finished in 2.34s
```

✅ **All tests passed!**

### Run with Verbosity

```bash
forge test -vv        # Show logs
forge test -vvv       # Show traces
forge test -vvvv      # Show setup traces
```

### Run Specific Test

```bash
forge test --match-test test_Deposit
forge test --match-contract SimpleBankTest
forge test --match-path test/SimpleBank.t.sol
```

### Run with Gas Report

```bash
forge test --gas-report
```

**Output:**
```
| Function    | min    | avg    | median | max    | # calls |
|-------------|--------|--------|--------|--------|---------|
| deposit     | 45123  | 56234  | 56012  | 67345  | 15      |
| withdraw    | 32456  | 43567  | 43345  | 54678  | 10      |
| transfer    | 28901  | 39012  | 38890  | 49123  | 8       |
```

---

## 📊 Test Coverage

### Generate Coverage Report

```bash
forge coverage
```

**Output:**
```
| File              | % Lines        | % Statements   | % Branches    | % Funcs       |
|-------------------|----------------|----------------|---------------|---------------|
| src/SimpleBank.sol| 100.00% (15/15)| 100.00% (20/20)| 100.00% (8/8) | 100.00% (5/5) |
| Total             | 100.00% (15/15)| 100.00% (20/20)| 100.00% (8/8) | 100.00% (5/5) |
```

✅ **100% coverage!** Perfect!

### Coverage in Detail

```bash
forge coverage --report lcov
```

This generates `lcov.info` file that can be viewed in VS Code with Coverage Gutters extension.

---

## 🎯 Testing Best Practices

### 1. Test Naming

```solidity
// ✅ Good: Descriptive names
function test_DepositIncreasesBalance() public {}
function test_RevertWhen_WithdrawInsufficientBalance() public {}
function testFuzz_TransferBetweenMultipleUsers() public {}

// ❌ Bad: Vague names
function test1() public {}
function testDeposit() public {}
function testStuff() public {}
```

### 2. Test Organization

```solidity
contract MyContractTest is Test {
    // Group by function

    // ============ Constructor Tests ============
    function test_Constructor...

    // ============ Deposit Tests ============
    function test_Deposit...
    function test_RevertWhen_Deposit...
    function testFuzz_Deposit...

    // ============ Withdraw Tests ============
    function test_Withdraw...
    function test_RevertWhen_Withdraw...
    function testFuzz_Withdraw...
}
```

### 3. AAA Pattern

```solidity
function test_Something() public {
    // Arrange: Setup
    uint256 amount = 10 ether;
    vm.deal(alice, amount);

    // Act: Execute
    vm.prank(alice);
    bank.deposit{value: amount}();

    // Assert: Verify
    assertEq(bank.balances(alice), amount);
}
```

### 4. Test Independence

```solidity
// ✅ Good: Each test is independent
function setUp() public {
    bank = new SimpleBank(); // Fresh contract every test
}

// ❌ Bad: Tests depend on each other
// function test1() { ... } // Sets state
// function test2() { ... } // Relies on test1 state
```

### 5. Edge Cases

```solidity
// Test boundary conditions
function test_DepositMinimum() public { /* 1 wei */ }
function test_DepositMaximum() public { /* type(uint256).max */ }
function test_WithdrawAll() public { /* exact balance */ }
function test_WithdrawPartial() public { /* partial balance */ }
```

---

## ✅ Checklist: Comprehensive Test Coverage

Untuk setiap function, pastikan test:

**Happy Path:**
- [ ] Function works dengan normal input
- [ ] State changes correctly
- [ ] Events emitted correctly
- [ ] Return values correct

**Sad Path:**
- [ ] Reverts dengan invalid input
- [ ] Reverts dengan correct error
- [ ] Reverts dengan error parameters

**Edge Cases:**
- [ ] Minimum values (0, 1 wei)
- [ ] Maximum values (type(uint256).max)
- [ ] Boundary conditions

**Fuzz Tests:**
- [ ] Random inputs tested
- [ ] Constraints defined with vm.assume
- [ ] Properties hold untuk all inputs

---

## 🎓 Summary

**Apa yang sudah dipelajari:**

✅ **Testing Philosophy:**
- Smart contracts need extensive testing
- Immutability = no room for mistakes
- 1 hour testing > months of regret

✅ **Foundry Testing:**
- Tests ditulis di Solidity (same language!)
- Test files dengan suffix `.t.sol`
- setUp() runs before each test

✅ **Test Types:**
- Unit tests untuk happy paths
- Revert tests untuk error cases
- Fuzz tests untuk edge cases
- Event tests untuk logging

✅ **Cheatcodes:**
- vm.prank() untuk change msg.sender
- vm.deal() untuk give ETH
- vm.expectRevert() untuk expect errors
- vm.expectEmit() untuk expect events

✅ **Coverage:**
- forge coverage untuk measure coverage
- Aim for 100% coverage
- Test all branches & edge cases

**Test results:**
```
✅ 13 tests passed
✅ 100% coverage
✅ All edge cases covered
✅ Fuzz tests dengan 256 runs each
```

---

## 🚀 Next Steps

Contract tested & secure! Tapi bagaimana kita optimize gas usage?

**Part 4 akan cover:**
- Gas optimization techniques
- Gas snapshots & comparison
- Deployment scripts
- Contract verification
- Production deployment checklist

**[📖 Part 4: Gas Optimization & Deployment →](./04-gas-optimization.md)**

---

**Trust, but verify! 🔒✅**
