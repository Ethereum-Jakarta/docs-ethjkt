---
sidebar_position: 8
---

# 8. Challenge: Extend the Smart Contract and Integrate with the UI

This challenge will test your ability to modify the `TodoList` smart contract and integrate changes into the user interface. You will add a new parameter to the smart contract and reflect this change in the frontend application.

---

## Challenge Overview

### Objective:
1. Add a **`priority`** parameter to the `TodoList` smart contract to assign a priority level to each task (e.g., `Low`, `Medium`, `High`).
2. Update the frontend to:
   - Allow users to assign a priority when creating a task.
   - Display the priority of each task in the task list.

### Skills You'll Practice:
- Smart contract development with Solidity.
- Frontend integration using React and Wagmi.
- State management and contract interaction.

---

## Part 1: Modify the Smart Contract

### Steps:
1. Open the `TodoList.sol` contract.
2. Add a new parameter `priority` to the `Task` struct:
   ```solidity
   struct Task {
       uint32 id;
       string task;
       bool completed;
       string priority; // New parameter
   }
   ```
3. Update the `createTask` function to accept the `priority` parameter:
   ```solidity
   function createTask(string memory _task, string memory _priority) external {
       UserTasks storage userTaskList = userTasks[msg.sender];
       userTaskList.tasks[userTaskList.taskCount] = Task({
           id: userTaskList.taskCount,
           task: _task,
           completed: false,
           priority: _priority
       });
       userTaskList.taskCount++;
       emit TaskCreated(msg.sender, userTaskList.taskCount, _task, false, _priority);
   }
   ```
4. Emit the new `priority` parameter in the `TaskCreated` event:
   ```solidity
   event TaskCreated(address user, uint32 id, string task, bool completed, string priority);
   ```
5. Deploy the updated contract to the testnet.

---

## Part 2: Update the Frontend

### Steps:
1. **Update the Task Form**:
   - Modify the `src/app/page.tsx` file to include an input field for `priority`.
   - Example:
     ```tsx
     <MDBInput
       label="Enter priority (Low, Medium, High)"
       id="formPriority"
       type="text"
       style={{ backgroundColor: "#2B2F36", color: "#fff", fontSize: "1rem" }}
       value={priority}
       onChange={(e) => setPriority(e.target.value)}
     />
     ```
   - Add a new state variable `priority`:
     ```tsx
     const [priority, setPriority] = useState("");
     ```

2. **Update the `handleAddTask` Function**:
   - Modify the `createTask` call to include the `priority` parameter:
     ```tsx
     const result = await writeContractAsync({
       ...todolistContract,
       functionName: "createTask",
       args: [task, priority],
       account: address as `0x${string}`,
     });
     ```

3. **Display Priority in the Task List**:
   - Update the task list table to display the `priority` field:
     ```tsx
     <td>{todo.priority}</td>
     ```
   - Add a new table header:
     ```tsx
     <th scope="col">Priority</th>
     ```

---

## Part 3: Test Your Changes

1. Run the application locally:
   ```sh
   npm run dev
   ```
2. Create new tasks with priorities and verify they appear in the task list.
3. Ensure all existing functionality (e.g., completing and deleting tasks) still works.

---

## Bonus Challenge

1. **Add Priority Sorting**:
   - Implement a feature to sort tasks by priority (e.g., High > Medium > Low).
   - Hint: Use the JavaScript `sort()` method to reorder the task array before rendering.

2. **Style by Priority**:
   - Apply different colors or styles to tasks based on their priority level (e.g., red for High, yellow for Medium, green for Low).

---

## Submission
Once you've completed the challenge, submit the following:
- The updated `TodoList.sol` file.
- A link to your updated repository.
- A brief description of the changes you made.

Good luck! 🚀
