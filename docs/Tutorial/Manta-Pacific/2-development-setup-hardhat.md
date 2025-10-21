---
sidebar_position: 2
---

# 2. Development Setup for Hardhat on Visual Studio Code

This guide will help you set up **Microsoft Visual Studio Code** for **Hardhat**, a popular development framework for Ethereum smart contracts.

## Prerequisites
Before you start, make sure you have the following installed:
- [Node.js](https://nodejs.org/en/download/) (v18+ recommended)
- [Visual Studio Code](https://code.visualstudio.com/)
- [MetaMask](https://metamask.io/) browser extension
- [Git](https://git-scm.com/downloads) (optional but recommended)

---

## Setting Up Your Hardhat Project

### Step 1: Initialize a New Hardhat Project
1. Open **VS Code** and open a new terminal.
2. Run the following command to create a new project:
   ```sh
   mkdir hardhat-todo && cd hardhat-todo
   npm init -y
   npm install --save-dev hardhat
   ```
3. Initialize Hardhat:
   ```sh
   npx hardhat
   ```
4. Select **Create a Typescript project** and follow the instructions.

---

## Writing a Smart Contract (TodoList.sol)

Below is an explanation of the **TodoList** smart contract and its components.

### **1. Contract Structure**
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract TodoList {
```
- `pragma solidity ^0.8.24;` → Ensures compatibility with Solidity compiler version 0.8.24 or later.
- `contract TodoList {` → Defines the contract named `TodoList`.

### **2. Task Structure**
```solidity
    struct Task {
        uint32 id;
        string task;
        bool completed;
    }
```
- `Task` struct represents a to-do item with an ID, description, and completion status.

### **3. User Task Management**
```solidity
    struct UserTasks {
        uint32 taskCount;
        mapping(uint32 => Task) tasks;
    }

    mapping(address => UserTasks) private userTasks;
```
- `UserTasks` struct stores all tasks for each user.
- `mapping(address => UserTasks) private userTasks;` → Maps user addresses to their task lists.

### **4. Events**
```solidity
    event TaskCreated(address user, uint32 id, string task, bool completed);
    event TaskCompleted(address user, uint32 id, bool completed);
    event TaskUpdated(address user, uint32 id, string task);
    event TaskRemoved(address user, uint32 id);
```
- These events help log contract activity for front-end applications.

### **5. Retrieve Tasks**
```solidity
    function getTasks() external view returns (Task[] memory) {
        UserTasks storage userTaskList = userTasks[msg.sender];
        Task[] memory taskList = new Task[](userTaskList.taskCount);
        for (uint32 i = 0; i < userTaskList.taskCount; i++) {
            taskList[i] = userTaskList.tasks[i];
        }
        return taskList;
    }
```
- Returns an array of tasks for the caller’s address.

### **6. Creating a Task**
```solidity
    function createTask(string memory _task) external {
        UserTasks storage userTaskList = userTasks[msg.sender];
        userTaskList.tasks[userTaskList.taskCount] = Task({
            id: userTaskList.taskCount,
            task: _task,
            completed: false
        });
        userTaskList.taskCount++;
        emit TaskCreated(msg.sender, userTaskList.taskCount, _task, false);
    }
```
- Creates a new task for the user and emits the `TaskCreated` event.

### **7. Updating a Task**
```solidity
    function updateTask(uint32 _id, string memory _task) external {
        UserTasks storage userTaskList = userTasks[msg.sender];
        require(_id <= userTaskList.taskCount, "Task does not exist");
        userTaskList.tasks[_id].task = _task;
        emit TaskUpdated(msg.sender, _id, _task);
    }
```
- Updates the task description based on the provided ID.

### **8. Completing a Task**
```solidity
    function completeTask(uint32 _id) external {
        UserTasks storage userTaskList = userTasks[msg.sender];
        require(_id <= userTaskList.taskCount, "Task does not exist");
        userTaskList.tasks[_id].completed = true;
        emit TaskCompleted(msg.sender, _id, true);
    }
```
- Marks a task as completed.

### **9. Removing a Task**
```solidity
    function removeTask(uint32 _id) external {
        UserTasks storage userTaskList = userTasks[msg.sender];
        require(_id < userTaskList.taskCount, "Task does not exist");
        if (_id != userTaskList.taskCount - 1) {
            userTaskList.tasks[_id] = userTaskList.tasks[userTaskList.taskCount - 1];
            userTaskList.tasks[_id].id = _id;
        }
        delete userTaskList.tasks[userTaskList.taskCount - 1];
        userTaskList.taskCount--;
        emit TaskRemoved(msg.sender, _id);
    }
```
- Deletes a task and maintains mapping integrity.

### **10. Full Smart Contract Code**
```solidity
    // SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

contract TodoList {
    struct Task {
        uint32 id;
        string task;
        bool completed;
    }

    struct UserTasks {
        uint32 taskCount;
        mapping(uint32 => Task) tasks;
    }

    mapping(address => UserTasks) private userTasks;

    event TaskCreated(address user, uint32 id, string task, bool completed);
    event TaskCompleted(address user, uint32 id, bool completed);
    event TaskUpdated(address user, uint32 id, string task);
    event TaskRemoved(address user, uint32 id);

    function getTasks() external view returns (Task[] memory) {
        UserTasks storage userTaskList = userTasks[msg.sender];
        Task[] memory taskList = new Task[](userTaskList.taskCount);
        for (uint32 i = 0; i < userTaskList.taskCount; i++) {
            taskList[i] = userTaskList.tasks[i];
        }
        return taskList;
    }

    function getTask(uint32 _id) external view returns (Task memory) {
        return userTasks[msg.sender].tasks[_id];
    }

    function createTask(string memory _task) external {
        UserTasks storage userTaskList = userTasks[msg.sender];
        userTaskList.tasks[userTaskList.taskCount] = Task({
            id: userTaskList.taskCount,
            task: _task,
            completed: false
        });
        userTaskList.taskCount++;
        emit TaskCreated(msg.sender, userTaskList.taskCount, _task, false);
    }

    function updateTask(uint32 _id, string memory _task) external {
        UserTasks storage userTaskList = userTasks[msg.sender];
        require(_id <= userTaskList.taskCount, "Task does not exist");
        userTaskList.tasks[_id].task = _task;
        emit TaskUpdated(msg.sender, _id, _task);
    }

    function removeTask(uint32 _id) external {
        UserTasks storage userTaskList = userTasks[msg.sender];
        require(_id < userTaskList.taskCount, "Task does not exist");
        if (_id != userTaskList.taskCount - 1) {
            // Move the last task to the position of the task to be deleted
            userTaskList.tasks[_id] = userTaskList.tasks[userTaskList.taskCount - 1];
            userTaskList.tasks[_id].id = _id; // Update the id of the moved task
        }
        delete userTaskList.tasks[userTaskList.taskCount - 1];
        userTaskList.taskCount--;
        emit TaskRemoved(msg.sender, _id);
    }

    function completeTask(uint32 _id) external {
        UserTasks storage userTaskList = userTasks[msg.sender];
        require(_id <= userTaskList.taskCount, "Task does not exist");
        userTaskList.tasks[_id].completed = true;
        emit TaskCompleted(msg.sender, _id, true);
    }
}
```
Now, your **TodoList Smart Contract** is ready to deploy! 🚀
