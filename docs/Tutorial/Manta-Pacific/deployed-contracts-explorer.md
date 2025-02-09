---
sidebar_position: 4
---

# Understanding Deployed Contracts on Manta Explorer

This guide explains the importance of verifying smart contracts, what **Read Contract** and **Write Contract** tabs mean, and how to interact with your deployed contracts on the **Manta Pacific Sepolia Testnet Explorer**.

## Why Verify a Contract?

When you deploy a smart contract, its bytecode (machine-readable format) is added to the blockchain. However, to ensure transparency and trust, developers should verify the contract source code. Here's why verification is important:

1. **Transparency**: Verification allows anyone to see the human-readable Solidity code that corresponds to the deployed contract. This ensures there are no hidden or malicious functionalities.

2. **Trust Building**: Users interacting with your contract can be confident that it behaves as advertised.

3. **Debugging**: Verified contracts are easier to debug and interact with on explorers like BlockScout.

### How to Verify

To verify a contract, you submit the source code, compiler version, and optimization settings to the explorer. Once verified, users can view the contract's code and its functions in a readable format.

### View the Verified Contract
Access the verified contract details here: [Verified Contract on Manta Explorer](https://pacific-explorer.sepolia-testnet.manta.network/address/0x95597662d6306b6591f33b966A1a6D2843638288?tab=contract)

---

## What is the **Read Contract** Tab?

The **Read Contract** tab allows you to interact with the contract's **view** and **pure** functions. These are functions that do not modify the blockchain's state and are free to execute.

### Example Functions:
1. **`getTasks()`**: Retrieves all tasks for the connected wallet.
2. **`getTask(uint32 id)`**: Retrieves a specific task by its ID.

### Why Use the Read Contract Tab?
- **Free to Use**: Since these functions don’t change the blockchain state, they don’t require gas fees.
- **View Data**: Useful for checking contract state or retrieving stored information, like task lists.

---

## What is the **Write Contract** Tab?

The **Write Contract** tab allows you to execute **state-changing** functions of your contract. These functions require you to sign transactions with your wallet and pay gas fees.

### Example Functions:
1. **`createTask(string task)`**: Adds a new task to the list.
2. **`updateTask(uint32 id, string task)`**: Updates the description of an existing task.
3. **`completeTask(uint32 id)`**: Marks a task as completed.
4. **`removeTask(uint32 id)`**: Deletes a task.

### Why Use the Write Contract Tab?
- **Modify State**: Needed for interactions that change data on the blockchain.
- **Real Transactions**: These interactions are recorded on the blockchain, ensuring immutability and transparency.

---

## Steps to Interact with the Contract

### Step 1: Connect Your Wallet
- Navigate to the **Write Contract** or **Read Contract** tab.
- Click the **Connect** button and choose your wallet (e.g., MetaMask).

### Step 2: Execute Functions
- For **Read Contract**, simply click a function like `getTasks` and view the output.
- For **Write Contract**, input the required parameters (e.g., task description for `createTask`) and confirm the transaction in your wallet.

### Step 3: Verify Changes
- After using a **Write Contract** function, go to the **Read Contract** tab to check the updated state.

---

## Summary

- **Verification**: Ensures transparency, builds trust, and allows users to inspect your contract code.
- **Read Contract**: Lets you view contract state and data for free.
- **Write Contract**: Enables you to modify the blockchain state with signed transactions.

Understanding these concepts is crucial for developers and users interacting with decentralized applications. By verifying your contracts and knowing how to use the explorer, you can build trust and improve the user experience. 🚀
