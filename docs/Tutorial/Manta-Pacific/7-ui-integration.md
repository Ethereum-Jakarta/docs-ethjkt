---
sidebar_position: 7
---

# 7. Smart Contract Integration - UI Interaction

This document explains how the `TodoList` smart contract is connected to the user interface and the key UI components for interacting with it.

---

## 1. **Connect Wallet Button (`src/components/ConnectWalletButton.tsx`)**

The `ConnectWalletButton` component provides an interface for users to connect their wallet to the dApp.

### Key Features:

```tsx
import { useAccount } from 'wagmi';

export default function ConnectButton() {
  const { isConnected } = useAccount();
  
  return (
    <w3m-button 
      balance="show"
      label={isConnected ? undefined : "Connect Your Wallet"}
    />
  );
}
```

### Explanation:
- **`useAccount`**: Hooks into the wallet connection state.
- **Dynamic Label**: Displays "Connect Your Wallet" when the wallet is disconnected, otherwise hides the label.
- **`w3m-button`**: Provides a styled button for wallet connection.

---

## 2. **Main Page (`src/app/page.tsx`)**

The main page is the core UI for managing and interacting with the `TodoList` smart contract.

### Key Components:

#### **State Management**

```tsx
const [task, setTask] = useState("");
const { isConnected, address } = useAccount();
```
- **`task`**: Stores the new task input.
- **`isConnected` and `address`**: Determine wallet connection status and retrieve the user’s wallet address.

#### **Reading Tasks**

```tsx
const { data, refetch } = useReadContract({
  ...todolistContract,
  functionName: "getTasks",
  account: address as `0x${string}`,
  query: {
    enabled: isConnected,
  },
});
```
- Fetches the list of tasks from the smart contract.
- **`refetch`**: Refreshes the task list.

#### **Adding Tasks**

```tsx
async function handleAddTask() {
  const result = await writeContractAsync({
    ...todolistContract,
    functionName: "createTask",
    args: [task],
    account: address as `0x${string}`,
  });
  await waitForTransactionReceipt(config, {
    hash: result as `0x${string}`,
  });
  await refetch();
  setTask("");
}
```
- Creates a new task by calling the `createTask` function on the smart contract.
- Waits for the transaction to be mined and refreshes the task list.

#### **Completing Tasks**

```tsx
async function handleFinishTask(id: number) {
  const result = await writeContractAsync({
    ...todolistContract,
    functionName: "completeTask",
    args: [id],
    account: address as `0x${string}`,
  });
  await waitForTransactionReceipt(config, {
    hash: result as `0x${string}`,
  });
  await refetch();
}
```
- Marks a task as completed.

#### **Deleting Tasks**

```tsx
async function handleDeleteTask(id: number) {
  const result = await writeContractAsync({
    ...todolistContract,
    functionName: "removeTask",
    args: [id],
    account: address as `0x${string}`,
  });
  await waitForTransactionReceipt(config, {
    hash: result as `0x${string}`,
  });
  await refetch();
}
```
- Deletes a task by calling the `removeTask` function.

#### **Task Display**

```tsx
<MDBTable>
  <MDBTableHead>
    <tr>
      <th>No.</th>
      <th>Todo Item</th>
      <th>Status</th>
      <th>Actions</th>
    </tr>
  </MDBTableHead>
  <MDBTableBody>
    {todos.map((todo, index) => (
      <tr key={index}>
        <td>{index + 1}</td>
        <td>{todo.task}</td>
        <td>{todo.completed ? "Completed" : "In progress"}</td>
        <td>
          <MDBBtn onClick={() => handleDeleteTask(todo.id)}>Delete</MDBBtn>
          {!todo.completed && <MDBBtn onClick={() => handleFinishTask(todo.id)}>Complete</MDBBtn>}
        </td>
      </tr>
    ))}
  </MDBTableBody>
</MDBTable>
```
- Displays tasks with options to delete or mark them as complete.

---

By integrating these components, the UI provides seamless interaction with the `TodoList` smart contract, enabling task management directly on the blockchain.
