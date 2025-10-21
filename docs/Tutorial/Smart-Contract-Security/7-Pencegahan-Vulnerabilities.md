# Pencegahan Vulnerabilities dalam Smart Contract

## 1. Penulisan Kode

- Gunakan Solidity versi terbaru (≥0.8.x) yang sudah ada pengecekan overflow.
- Pakai library terpercaya seperti OpenZeppelin.
- Hindari kode kompleks yang tidak perlu.

## 2. Unit Test

- Pastikan setiap fungsi diuji dengan input yang diketahui.
- Gunakan framework seperti Foundry, Hardhat, atau Truffle.

Contoh unit test (Foundry):

```solidity
contract MyContract {
    uint256 private _value;

    function setValue(uint256 newValue) external {
        _value = newValue;
    }

    function value() external view returns (uint256) {
        return _value;
    }
}

function testSetValue() public {
    c.setValue(123);
    assertEq(c.value(), 123);
}
```

## 3. Fuzz Test

- Uji fungsi dengan input random untuk menemukan edge case.
- Batasi input agar relevan dengan kondisi kontrak.

Contoh fuzz test (Foundry):

```solidity
function testFuzz_SetValue(uint256 x) public {
    vm.assume(x < 1000);
    c.setValue(x);
    assertEq(c.value(), x);
}
```

## 4. Static Analysis & Audit

- Pakai tools seperti Slither, Mythril untuk deteksi masalah umum.
- Lakukan audit internal dan eksternal sebelum deploy.
