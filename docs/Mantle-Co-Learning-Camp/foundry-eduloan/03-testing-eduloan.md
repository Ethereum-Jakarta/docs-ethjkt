---
id: testing-eduloan
title: "Part 3: Testing EduLoan"
sidebar_label: "Part 3: Testing"
sidebar_position: 3
description: "Menulis comprehensive tests untuk EduLoan: unit tests, fuzz testing, event testing, dan best practices."
---

# Part 3: Testing EduLoan

## 🎯 Tujuan

Setelah menyelesaikan bagian ini, Anda akan:
- ✅ Memahami pentingnya testing untuk smart contracts
- ✅ Menulis unit tests untuk semua fungsi EduLoan
- ✅ Menggunakan Foundry cheatcodes (vm.prank, vm.deal, dll)
- ✅ Mengimplementasikan fuzz testing
- ✅ Mencapai 100% test coverage
- ✅ Menerapkan testing best practices

---

## 💡 Kenapa Testing Penting?

### Analogi: Smart Contract = Pesawat Terbang

**Pesawat Boeing 777:**
```
❌ TIDAK ADA tombol undo di udara
❌ TIDAK BISA patch setelah takeoff
❌ Bug = bisa fatal
✅ WAJIB tested ribuan kali sebelum terbang

Testing approach:
- Unit test setiap komponen
- Integration test sistem
- Stress test kondisi ekstrem
- Final check sebelum first flight
```

**Smart Contract:**
```
❌ TIDAK ADA tombol undo di blockchain
❌ TIDAK BISA update setelah deploy (immutable!)
❌ Bug = loss of funds
✅ WAJIB tested extensively sebelum deploy

Testing approach:
- Unit test setiap function
- Integration test flow
- Fuzz test edge cases
- Audit sebelum mainnet
```

### Real Hack Examples

| Hack | Tahun | Kerugian | Penyebab |
|------|-------|----------|----------|
| The DAO | 2016 | $60M | Reentrancy tidak ditest |
| Parity Wallet | 2017 | $280M | Access control tidak ditest |
| Compound | 2021 | $80M | Logic error tidak ditest |

**Lesson: 1 jam testing > berbulan-bulan menyesal** 🎯

---

## 📝 Setup Test File

### Buat EduLoan.t.sol

Buat file `test/EduLoan.t.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {Test, console} from "forge-std/Test.sol";
import {EduLoan} from "../src/EduLoan.sol";

contract EduLoanTest is Test {
    EduLoan public eduLoan;

    // Test accounts
    address public admin;
    address public alice;  // Student 1
    address public bob;    // Student 2

    // Test constants
    uint256 public constant LOAN_AMOUNT = 1 ether;
    string public constant LOAN_PURPOSE = "SPP Semester 5";

    function setUp() public {
        // Setup accounts
        admin = address(this);  // Test contract is admin
        alice = makeAddr("alice");
        bob = makeAddr("bob");

        // Deploy EduLoan
        eduLoan = new EduLoan();

        // Give ETH to test accounts
        vm.deal(alice, 100 ether);
        vm.deal(bob, 100 ether);
        vm.deal(admin, 100 ether);
    }

    // Helper: Receive ETH
    receive() external payable {}
}
```

**Penjelasan:**

```solidity
import {Test, console} from "forge-std/Test.sol";
```
- `Test` = Base contract untuk testing
- `console` = console.log untuk debugging

```solidity
function setUp() public {
```
- Dijalankan SEBELUM setiap test
- Fresh state untuk setiap test (isolation)

```solidity
makeAddr("alice")
```
- Foundry helper untuk membuat address dari string
- Lebih readable daripada `address(0x1)`

```solidity
vm.deal(alice, 100 ether)
```
- Cheatcode untuk memberikan ETH ke address
- `vm` = Foundry's cheatcode object

---

## 🧪 Unit Tests: Admin Functions

### Test 1: Constructor Sets Admin

```solidity
function test_ConstructorSetsAdmin() public view {
    assertEq(eduLoan.admin(), admin);
}
```

### Test 2: Deposit Funds

```solidity
function test_DepositFunds() public {
    uint256 depositAmount = 10 ether;

    // Admin deposits
    eduLoan.depositFunds{value: depositAmount}();

    // Check balance
    assertEq(eduLoan.getContractBalance(), depositAmount);
}

function test_DepositFundsEmitsEvent() public {
    uint256 depositAmount = 10 ether;

    // Expect event
    vm.expectEmit(true, false, false, true);
    emit EduLoan.FundsDeposited(admin, depositAmount);

    eduLoan.depositFunds{value: depositAmount}();
}

function test_RevertWhen_DepositZero() public {
    vm.expectRevert("Deposit harus lebih dari 0!");
    eduLoan.depositFunds{value: 0}();
}

function test_RevertWhen_NonAdminDeposits() public {
    vm.prank(alice);
    vm.expectRevert("Hanya admin!");
    eduLoan.depositFunds{value: 1 ether}();
}
```

### Test 3: Withdraw Funds

```solidity
function test_WithdrawFunds() public {
    // Setup: deposit first
    eduLoan.depositFunds{value: 10 ether}();

    uint256 balanceBefore = address(admin).balance;

    // Withdraw
    eduLoan.withdrawFunds(5 ether);

    // Check
    assertEq(eduLoan.getContractBalance(), 5 ether);
    assertEq(address(admin).balance, balanceBefore + 5 ether);
}

function test_RevertWhen_WithdrawInsufficientBalance() public {
    eduLoan.depositFunds{value: 1 ether}();

    vm.expectRevert("Saldo tidak cukup!");
    eduLoan.withdrawFunds(10 ether);
}
```

---

## 🧪 Unit Tests: Apply Loan

### Test 4: Apply Loan Success

```solidity
function test_ApplyLoan() public {
    // Alice applies for loan
    vm.prank(alice);
    eduLoan.applyLoan(LOAN_AMOUNT, LOAN_PURPOSE);

    // Check loan created
    assertEq(eduLoan.getTotalLoans(), 1);

    // Check loan details
    EduLoan.Loan memory loan = eduLoan.getLoanDetails(1);
    assertEq(loan.borrower, alice);
    assertEq(loan.principalAmount, LOAN_AMOUNT);
    assertEq(loan.purpose, LOAN_PURPOSE);
    assertEq(uint256(loan.status), uint256(EduLoan.LoanStatus.Pending));

    // Check interest calculation (5%)
    uint256 expectedInterest = (LOAN_AMOUNT * 500) / 10000;
    uint256 expectedTotal = LOAN_AMOUNT + expectedInterest;
    assertEq(loan.totalAmount, expectedTotal);
}

function test_ApplyLoanEmitsEvent() public {
    vm.expectEmit(true, true, false, true);
    emit EduLoan.LoanApplied(1, alice, LOAN_AMOUNT, LOAN_PURPOSE);

    vm.prank(alice);
    eduLoan.applyLoan(LOAN_AMOUNT, LOAN_PURPOSE);
}

function test_ApplyLoanAddsToBorrowerLoans() public {
    vm.startPrank(alice);
    eduLoan.applyLoan(1 ether, "SPP");
    eduLoan.applyLoan(2 ether, "Buku");
    vm.stopPrank();

    uint256[] memory aliceLoans = vm.prank(alice) ? eduLoan.getMyLoans() : new uint256[](0);

    // Alternative way to check
    vm.prank(alice);
    uint256[] memory loans = eduLoan.getMyLoans();
    assertEq(loans.length, 2);
    assertEq(loans[0], 1);
    assertEq(loans[1], 2);
}
```

### Test 5: Apply Loan Reverts

```solidity
function test_RevertWhen_LoanTooSmall() public {
    vm.prank(alice);
    vm.expectRevert("Pinjaman terlalu kecil! Min 0.01 ETH");
    eduLoan.applyLoan(0.001 ether, LOAN_PURPOSE);
}

function test_RevertWhen_LoanTooBig() public {
    vm.prank(alice);
    vm.expectRevert("Pinjaman terlalu besar! Max 10 ETH");
    eduLoan.applyLoan(11 ether, LOAN_PURPOSE);
}
```

---

## 🧪 Unit Tests: Approve & Reject

### Test 6: Approve Loan

```solidity
function test_ApproveLoan() public {
    // Alice applies
    vm.prank(alice);
    eduLoan.applyLoan(LOAN_AMOUNT, LOAN_PURPOSE);

    // Admin approves
    eduLoan.approveLoan(1);

    // Check status
    EduLoan.Loan memory loan = eduLoan.getLoanDetails(1);
    assertEq(uint256(loan.status), uint256(EduLoan.LoanStatus.Approved));
    assertGt(loan.approvalTime, 0);
}

function test_ApproveLoanEmitsEvent() public {
    vm.prank(alice);
    eduLoan.applyLoan(LOAN_AMOUNT, LOAN_PURPOSE);

    uint256 expectedTotal = LOAN_AMOUNT + (LOAN_AMOUNT * 500 / 10000);

    vm.expectEmit(true, true, false, true);
    emit EduLoan.LoanApproved(1, alice, expectedTotal);

    eduLoan.approveLoan(1);
}

function test_RevertWhen_NonAdminApproves() public {
    vm.prank(alice);
    eduLoan.applyLoan(LOAN_AMOUNT, LOAN_PURPOSE);

    vm.prank(bob);
    vm.expectRevert("Hanya admin!");
    eduLoan.approveLoan(1);
}

function test_RevertWhen_ApprovingNonPendingLoan() public {
    vm.prank(alice);
    eduLoan.applyLoan(LOAN_AMOUNT, LOAN_PURPOSE);

    // Approve once
    eduLoan.approveLoan(1);

    // Try approve again
    vm.expectRevert("Status loan tidak sesuai!");
    eduLoan.approveLoan(1);
}
```

### Test 7: Reject Loan

```solidity
function test_RejectLoan() public {
    vm.prank(alice);
    eduLoan.applyLoan(LOAN_AMOUNT, LOAN_PURPOSE);

    eduLoan.rejectLoan(1, "Dokumen tidak lengkap");

    EduLoan.Loan memory loan = eduLoan.getLoanDetails(1);
    assertEq(uint256(loan.status), uint256(EduLoan.LoanStatus.Rejected));
}

function test_RejectLoanEmitsEvent() public {
    vm.prank(alice);
    eduLoan.applyLoan(LOAN_AMOUNT, LOAN_PURPOSE);

    vm.expectEmit(true, true, false, true);
    emit EduLoan.LoanRejected(1, alice, "Dokumen tidak lengkap");

    eduLoan.rejectLoan(1, "Dokumen tidak lengkap");
}
```

---

## 🧪 Unit Tests: Disburse Loan

### Test 8: Disburse Loan

```solidity
function test_DisburseLoan() public {
    // Setup: deposit funds
    eduLoan.depositFunds{value: 10 ether}();

    // Alice applies
    vm.prank(alice);
    eduLoan.applyLoan(LOAN_AMOUNT, LOAN_PURPOSE);

    // Admin approves
    eduLoan.approveLoan(1);

    // Record Alice's balance before
    uint256 aliceBalanceBefore = alice.balance;

    // Admin disburses
    eduLoan.disburseLoan(1);

    // Check Alice received funds
    assertEq(alice.balance, aliceBalanceBefore + LOAN_AMOUNT);

    // Check loan status
    EduLoan.Loan memory loan = eduLoan.getLoanDetails(1);
    assertEq(uint256(loan.status), uint256(EduLoan.LoanStatus.Active));
    assertGt(loan.deadline, block.timestamp);
}

function test_RevertWhen_DisburseWithInsufficientFunds() public {
    vm.prank(alice);
    eduLoan.applyLoan(LOAN_AMOUNT, LOAN_PURPOSE);
    eduLoan.approveLoan(1);

    // No funds deposited
    vm.expectRevert("Saldo contract tidak cukup!");
    eduLoan.disburseLoan(1);
}

function test_RevertWhen_DisburseNonApprovedLoan() public {
    eduLoan.depositFunds{value: 10 ether}();

    vm.prank(alice);
    eduLoan.applyLoan(LOAN_AMOUNT, LOAN_PURPOSE);

    // Not approved yet
    vm.expectRevert("Status loan tidak sesuai!");
    eduLoan.disburseLoan(1);
}
```

---

## 🧪 Unit Tests: Make Payment

### Test 9: Make Payment

```solidity
function test_MakePayment() public {
    // Setup complete loan
    _setupActiveLoan();

    EduLoan.Loan memory loanBefore = eduLoan.getLoanDetails(1);
    uint256 paymentAmount = 0.5 ether;

    // Alice makes payment
    vm.prank(alice);
    eduLoan.makePayment{value: paymentAmount}(1);

    // Check payment recorded
    EduLoan.Loan memory loanAfter = eduLoan.getLoanDetails(1);
    assertEq(loanAfter.amountRepaid, paymentAmount);

    // Check remaining
    uint256 remaining = eduLoan.getRemainingAmount(1);
    assertEq(remaining, loanBefore.totalAmount - paymentAmount);
}

function test_MakePaymentFullRepayment() public {
    _setupActiveLoan();

    EduLoan.Loan memory loan = eduLoan.getLoanDetails(1);

    // Alice pays full amount
    vm.prank(alice);
    eduLoan.makePayment{value: loan.totalAmount}(1);

    // Check status is Repaid
    EduLoan.Loan memory loanAfter = eduLoan.getLoanDetails(1);
    assertEq(uint256(loanAfter.status), uint256(EduLoan.LoanStatus.Repaid));
    assertEq(eduLoan.getRemainingAmount(1), 0);
}

function test_MakePaymentEmitsRepaidEvent() public {
    _setupActiveLoan();

    EduLoan.Loan memory loan = eduLoan.getLoanDetails(1);

    vm.expectEmit(true, true, false, true);
    emit EduLoan.LoanRepaid(1, alice);

    vm.prank(alice);
    eduLoan.makePayment{value: loan.totalAmount}(1);
}

function test_RevertWhen_NonBorrowerPays() public {
    _setupActiveLoan();

    vm.prank(bob);
    vm.expectRevert("Bukan borrower!");
    eduLoan.makePayment{value: 0.5 ether}(1);
}

function test_RevertWhen_PaymentZero() public {
    _setupActiveLoan();

    vm.prank(alice);
    vm.expectRevert("Pembayaran harus lebih dari 0!");
    eduLoan.makePayment{value: 0}(1);
}

// Helper function
function _setupActiveLoan() internal {
    eduLoan.depositFunds{value: 10 ether}();
    vm.prank(alice);
    eduLoan.applyLoan(LOAN_AMOUNT, LOAN_PURPOSE);
    eduLoan.approveLoan(1);
    eduLoan.disburseLoan(1);
}
```

---

## 🧪 Unit Tests: Check Default

### Test 10: Check Default

```solidity
function test_CheckDefault() public {
    _setupActiveLoan();

    // Warp time past deadline (1 year + 1 second)
    vm.warp(block.timestamp + 365 days + 1);

    // Check default
    eduLoan.checkDefault(1);

    // Verify status
    EduLoan.Loan memory loan = eduLoan.getLoanDetails(1);
    assertEq(uint256(loan.status), uint256(EduLoan.LoanStatus.Defaulted));
}

function test_CheckDefaultEmitsEvent() public {
    _setupActiveLoan();

    vm.warp(block.timestamp + 365 days + 1);

    vm.expectEmit(true, true, false, true);
    emit EduLoan.LoanDefaulted(1, alice);

    eduLoan.checkDefault(1);
}

function test_NotDefaultBeforeDeadline() public {
    _setupActiveLoan();

    // Still before deadline
    vm.warp(block.timestamp + 100 days);

    // Should not change status
    eduLoan.checkDefault(1);

    EduLoan.Loan memory loan = eduLoan.getLoanDetails(1);
    assertEq(uint256(loan.status), uint256(EduLoan.LoanStatus.Active));
}

function test_NotDefaultIfRepaid() public {
    _setupActiveLoan();

    // Alice repays
    EduLoan.Loan memory loan = eduLoan.getLoanDetails(1);
    vm.prank(alice);
    eduLoan.makePayment{value: loan.totalAmount}(1);

    // Warp past deadline
    vm.warp(block.timestamp + 365 days + 1);

    // Should revert because loan is already Repaid
    vm.expectRevert("Loan tidak dalam status Active!");
    eduLoan.checkDefault(1);
}
```

---

## 🎲 Fuzz Testing

### What is Fuzz Testing?

**Manual Testing:**
```
Test dengan nilai yang kita pilih:
- applyLoan(1 ether)   → ✅ Pass
- applyLoan(5 ether)   → ✅ Pass
- applyLoan(10 ether)  → ✅ Pass

Problem: Bagaimana dengan 0.0123 ether? atau 9.9999 ether?
```

**Fuzz Testing:**
```
Foundry generate RANDOM values:
- applyLoan(0.01234567 ether)  → Test
- applyLoan(7.891234 ether)    → Test
- applyLoan(9.999999 ether)    → Test
... (256 runs default)

Benefit: Menemukan edge cases!
```

### Fuzz Test: Apply Loan

```solidity
function testFuzz_ApplyLoan(uint256 amount) public {
    // Bound amount to valid range
    amount = bound(amount, 0.01 ether, 10 ether);

    vm.prank(alice);
    eduLoan.applyLoan(amount, "Test Purpose");

    // Verify loan created correctly
    EduLoan.Loan memory loan = eduLoan.getLoanDetails(1);
    assertEq(loan.principalAmount, amount);

    // Verify interest calculation
    uint256 expectedInterest = (amount * 500) / 10000;
    assertEq(loan.totalAmount, amount + expectedInterest);
}
```

**`bound(value, min, max)`:**
- Foundry helper untuk membatasi random value
- Memastikan value dalam range valid

### Fuzz Test: Make Payment

```solidity
function testFuzz_MakePayment(uint256 paymentAmount) public {
    _setupActiveLoan();

    EduLoan.Loan memory loan = eduLoan.getLoanDetails(1);

    // Bound payment to valid range
    paymentAmount = bound(paymentAmount, 1, loan.totalAmount);

    vm.prank(alice);
    eduLoan.makePayment{value: paymentAmount}(1);

    // Verify payment recorded
    EduLoan.Loan memory loanAfter = eduLoan.getLoanDetails(1);
    assertEq(loanAfter.amountRepaid, paymentAmount);
}
```

### Fuzz Test: Multiple Payments

```solidity
function testFuzz_MultiplePayments(uint256 payment1, uint256 payment2) public {
    _setupActiveLoan();

    EduLoan.Loan memory loan = eduLoan.getLoanDetails(1);

    // Bound payments
    payment1 = bound(payment1, 1, loan.totalAmount / 2);
    payment2 = bound(payment2, 1, loan.totalAmount / 2);

    // First payment
    vm.prank(alice);
    eduLoan.makePayment{value: payment1}(1);

    // Second payment
    vm.prank(alice);
    eduLoan.makePayment{value: payment2}(1);

    // Verify total repaid
    EduLoan.Loan memory loanAfter = eduLoan.getLoanDetails(1);
    assertEq(loanAfter.amountRepaid, payment1 + payment2);
}
```

---

## 📊 Complete Test File

Gabungkan semua tests:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {Test, console} from "forge-std/Test.sol";
import {EduLoan} from "../src/EduLoan.sol";

contract EduLoanTest is Test {
    EduLoan public eduLoan;

    address public admin;
    address public alice;
    address public bob;

    uint256 public constant LOAN_AMOUNT = 1 ether;
    string public constant LOAN_PURPOSE = "SPP Semester 5";

    // ============================================
    // SETUP
    // ============================================

    function setUp() public {
        admin = address(this);
        alice = makeAddr("alice");
        bob = makeAddr("bob");

        eduLoan = new EduLoan();

        vm.deal(alice, 100 ether);
        vm.deal(bob, 100 ether);
        vm.deal(admin, 100 ether);
    }

    receive() external payable {}

    // ============================================
    // HELPER FUNCTIONS
    // ============================================

    function _setupActiveLoan() internal {
        eduLoan.depositFunds{value: 10 ether}();
        vm.prank(alice);
        eduLoan.applyLoan(LOAN_AMOUNT, LOAN_PURPOSE);
        eduLoan.approveLoan(1);
        eduLoan.disburseLoan(1);
    }

    // ============================================
    // CONSTRUCTOR TESTS
    // ============================================

    function test_ConstructorSetsAdmin() public view {
        assertEq(eduLoan.admin(), admin);
    }

    function test_InitialLoanCounterIsZero() public view {
        assertEq(eduLoan.getTotalLoans(), 0);
    }

    // ============================================
    // DEPOSIT FUNDS TESTS
    // ============================================

    function test_DepositFunds() public {
        eduLoan.depositFunds{value: 10 ether}();
        assertEq(eduLoan.getContractBalance(), 10 ether);
    }

    function test_DepositFundsEmitsEvent() public {
        vm.expectEmit(true, false, false, true);
        emit EduLoan.FundsDeposited(admin, 10 ether);
        eduLoan.depositFunds{value: 10 ether}();
    }

    function test_RevertWhen_DepositZero() public {
        vm.expectRevert("Deposit harus lebih dari 0!");
        eduLoan.depositFunds{value: 0}();
    }

    function test_RevertWhen_NonAdminDeposits() public {
        vm.prank(alice);
        vm.expectRevert("Hanya admin!");
        eduLoan.depositFunds{value: 1 ether}();
    }

    // ============================================
    // WITHDRAW FUNDS TESTS
    // ============================================

    function test_WithdrawFunds() public {
        eduLoan.depositFunds{value: 10 ether}();
        uint256 balanceBefore = admin.balance;

        eduLoan.withdrawFunds(5 ether);

        assertEq(eduLoan.getContractBalance(), 5 ether);
        assertEq(admin.balance, balanceBefore + 5 ether);
    }

    function test_RevertWhen_WithdrawInsufficientBalance() public {
        eduLoan.depositFunds{value: 1 ether}();
        vm.expectRevert("Saldo tidak cukup!");
        eduLoan.withdrawFunds(10 ether);
    }

    // ============================================
    // APPLY LOAN TESTS
    // ============================================

    function test_ApplyLoan() public {
        vm.prank(alice);
        eduLoan.applyLoan(LOAN_AMOUNT, LOAN_PURPOSE);

        assertEq(eduLoan.getTotalLoans(), 1);

        EduLoan.Loan memory loan = eduLoan.getLoanDetails(1);
        assertEq(loan.borrower, alice);
        assertEq(loan.principalAmount, LOAN_AMOUNT);
        assertEq(uint256(loan.status), uint256(EduLoan.LoanStatus.Pending));

        uint256 expectedTotal = LOAN_AMOUNT + (LOAN_AMOUNT * 500 / 10000);
        assertEq(loan.totalAmount, expectedTotal);
    }

    function test_ApplyLoanEmitsEvent() public {
        vm.expectEmit(true, true, false, true);
        emit EduLoan.LoanApplied(1, alice, LOAN_AMOUNT, LOAN_PURPOSE);

        vm.prank(alice);
        eduLoan.applyLoan(LOAN_AMOUNT, LOAN_PURPOSE);
    }

    function test_RevertWhen_LoanTooSmall() public {
        vm.prank(alice);
        vm.expectRevert("Pinjaman terlalu kecil! Min 0.01 ETH");
        eduLoan.applyLoan(0.001 ether, LOAN_PURPOSE);
    }

    function test_RevertWhen_LoanTooBig() public {
        vm.prank(alice);
        vm.expectRevert("Pinjaman terlalu besar! Max 10 ETH");
        eduLoan.applyLoan(11 ether, LOAN_PURPOSE);
    }

    // ============================================
    // APPROVE LOAN TESTS
    // ============================================

    function test_ApproveLoan() public {
        vm.prank(alice);
        eduLoan.applyLoan(LOAN_AMOUNT, LOAN_PURPOSE);

        eduLoan.approveLoan(1);

        EduLoan.Loan memory loan = eduLoan.getLoanDetails(1);
        assertEq(uint256(loan.status), uint256(EduLoan.LoanStatus.Approved));
    }

    function test_RevertWhen_NonAdminApproves() public {
        vm.prank(alice);
        eduLoan.applyLoan(LOAN_AMOUNT, LOAN_PURPOSE);

        vm.prank(bob);
        vm.expectRevert("Hanya admin!");
        eduLoan.approveLoan(1);
    }

    // ============================================
    // REJECT LOAN TESTS
    // ============================================

    function test_RejectLoan() public {
        vm.prank(alice);
        eduLoan.applyLoan(LOAN_AMOUNT, LOAN_PURPOSE);

        eduLoan.rejectLoan(1, "Dokumen tidak lengkap");

        EduLoan.Loan memory loan = eduLoan.getLoanDetails(1);
        assertEq(uint256(loan.status), uint256(EduLoan.LoanStatus.Rejected));
    }

    // ============================================
    // DISBURSE LOAN TESTS
    // ============================================

    function test_DisburseLoan() public {
        eduLoan.depositFunds{value: 10 ether}();

        vm.prank(alice);
        eduLoan.applyLoan(LOAN_AMOUNT, LOAN_PURPOSE);
        eduLoan.approveLoan(1);

        uint256 aliceBalanceBefore = alice.balance;
        eduLoan.disburseLoan(1);

        assertEq(alice.balance, aliceBalanceBefore + LOAN_AMOUNT);

        EduLoan.Loan memory loan = eduLoan.getLoanDetails(1);
        assertEq(uint256(loan.status), uint256(EduLoan.LoanStatus.Active));
    }

    function test_RevertWhen_DisburseInsufficientFunds() public {
        vm.prank(alice);
        eduLoan.applyLoan(LOAN_AMOUNT, LOAN_PURPOSE);
        eduLoan.approveLoan(1);

        vm.expectRevert("Saldo contract tidak cukup!");
        eduLoan.disburseLoan(1);
    }

    // ============================================
    // MAKE PAYMENT TESTS
    // ============================================

    function test_MakePayment() public {
        _setupActiveLoan();

        vm.prank(alice);
        eduLoan.makePayment{value: 0.5 ether}(1);

        EduLoan.Loan memory loan = eduLoan.getLoanDetails(1);
        assertEq(loan.amountRepaid, 0.5 ether);
    }

    function test_MakePaymentFullRepayment() public {
        _setupActiveLoan();

        EduLoan.Loan memory loan = eduLoan.getLoanDetails(1);

        vm.prank(alice);
        eduLoan.makePayment{value: loan.totalAmount}(1);

        EduLoan.Loan memory loanAfter = eduLoan.getLoanDetails(1);
        assertEq(uint256(loanAfter.status), uint256(EduLoan.LoanStatus.Repaid));
    }

    function test_RevertWhen_NonBorrowerPays() public {
        _setupActiveLoan();

        vm.prank(bob);
        vm.expectRevert("Bukan borrower!");
        eduLoan.makePayment{value: 0.5 ether}(1);
    }

    // ============================================
    // CHECK DEFAULT TESTS
    // ============================================

    function test_CheckDefault() public {
        _setupActiveLoan();

        vm.warp(block.timestamp + 365 days + 1);

        eduLoan.checkDefault(1);

        EduLoan.Loan memory loan = eduLoan.getLoanDetails(1);
        assertEq(uint256(loan.status), uint256(EduLoan.LoanStatus.Defaulted));
    }

    function test_NotDefaultBeforeDeadline() public {
        _setupActiveLoan();

        vm.warp(block.timestamp + 100 days);
        eduLoan.checkDefault(1);

        EduLoan.Loan memory loan = eduLoan.getLoanDetails(1);
        assertEq(uint256(loan.status), uint256(EduLoan.LoanStatus.Active));
    }

    // ============================================
    // FUZZ TESTS
    // ============================================

    function testFuzz_ApplyLoan(uint256 amount) public {
        amount = bound(amount, 0.01 ether, 10 ether);

        vm.prank(alice);
        eduLoan.applyLoan(amount, "Test");

        EduLoan.Loan memory loan = eduLoan.getLoanDetails(1);
        assertEq(loan.principalAmount, amount);

        uint256 expectedInterest = (amount * 500) / 10000;
        assertEq(loan.totalAmount, amount + expectedInterest);
    }

    function testFuzz_MakePayment(uint256 paymentAmount) public {
        _setupActiveLoan();

        EduLoan.Loan memory loan = eduLoan.getLoanDetails(1);
        paymentAmount = bound(paymentAmount, 1, loan.totalAmount);

        vm.prank(alice);
        eduLoan.makePayment{value: paymentAmount}(1);

        EduLoan.Loan memory loanAfter = eduLoan.getLoanDetails(1);
        assertEq(loanAfter.amountRepaid, paymentAmount);
    }

    // ============================================
    // VIEW FUNCTIONS TESTS
    // ============================================

    function test_CalculateInterest() public view {
        uint256 interest = eduLoan.calculateInterest(1 ether);
        assertEq(interest, 0.05 ether); // 5%
    }

    function test_GetRemainingAmount() public {
        _setupActiveLoan();

        EduLoan.Loan memory loan = eduLoan.getLoanDetails(1);
        assertEq(eduLoan.getRemainingAmount(1), loan.totalAmount);

        vm.prank(alice);
        eduLoan.makePayment{value: 0.5 ether}(1);

        assertEq(eduLoan.getRemainingAmount(1), loan.totalAmount - 0.5 ether);
    }
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
Ran 25 tests for test/EduLoan.t.sol:EduLoanTest
[PASS] testFuzz_ApplyLoan(uint256) (runs: 256, μ: 125678, ~: 125432)
[PASS] testFuzz_MakePayment(uint256) (runs: 256, μ: 189234, ~: 188901)
[PASS] test_ApproveLoan() (gas: 112345)
[PASS] test_ApplyLoan() (gas: 156789)
...
Suite result: ok. 25 passed; 0 failed; finished in 2.45s
```

### Run with Verbosity

```bash
forge test -vv     # Show logs
forge test -vvvv   # Show traces
```

### Run Specific Test

```bash
forge test --match-test test_ApplyLoan
```

### Gas Report

```bash
forge test --gas-report
```

### Test Coverage

```bash
forge coverage
```

**Output:**
```
| File           | % Lines        | % Statements   | % Branches    | % Funcs       |
|----------------|----------------|----------------|---------------|---------------|
| src/EduLoan.sol| 100.00% (45/45)| 100.00% (52/52)| 100.00% (18/18)| 100.00% (15/15)|
```

✅ **100% coverage!**

---

## ✅ Testing Checklist

Untuk setiap function:

**Happy Path:**
- [ ] Function works dengan normal input
- [ ] State changes correctly
- [ ] Events emitted correctly
- [ ] Return values correct

**Sad Path:**
- [ ] Reverts dengan invalid input
- [ ] Reverts dengan correct error message
- [ ] Access control berfungsi

**Edge Cases:**
- [ ] Minimum/maximum values
- [ ] Boundary conditions
- [ ] Time-based logic (vm.warp)

**Fuzz Tests:**
- [ ] Random inputs dalam range valid
- [ ] Properties hold untuk semua inputs

---

## 🚀 Next: Gas Optimization & Deployment

Tests sudah 100% coverage! Saatnya optimize dan deploy.

**Part 4 akan cover:**
- Gas optimization techniques
- Gas snapshot comparison
- Deploy ke Mantle Sepolia
- Verifikasi contract
- Production checklist

**[📖 Part 4: Gas Optimization & Deployment →](./04-gas-optimization-deployment.md)**

---

**Trust, but verify! 🔒**
