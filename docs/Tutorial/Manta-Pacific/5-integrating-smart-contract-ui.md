---
sidebar_position: 5
---

# 5. Integrating the Smart Contract into a User Interface

This guide walks you through the process of integrating the `TodoList` smart contract into a user interface. The user interface repository is hosted at [practice-todo-ui](https://github.com/Ethereum-Jakarta/practice-todo-ui).

## Prerequisites

Before starting, make sure you have:
- The `TodoList` smart contract deployed and verified.
- Node.js installed (v18+ recommended).
- A registered account on [Reown Cloud](https://cloud.reown.com/) to obtain a project ID.

---

## Steps to Set Up the User Interface

### 1. Clone the Repository
Start by cloning the user interface project repository:
```sh
git clone https://github.com/Ethereum-Jakarta/practice-todo-ui.git
cd practice-todo-ui
```

### 2. Install Dependencies
Install the required packages using `npm`:
```sh
npm install
```

### 3. Add Environment Variables
Create a `.env` file in the root directory and add the following key:
```
NEXT_PUBLIC_PROJECT_ID=<your_project_id>
```

- Replace `<your_project_id>` with the Project ID you receive after registering on [Reown Cloud](https://cloud.reown.com/).

### 4. Run the Development Server
Start the development server:
```sh
npm run dev
```

The application will be accessible at `http://localhost:3000`.

---

## Next Steps

We will now explain the crucial parts of the codebase and how the `TodoList` smart contract is integrated into the user interface. These include:

1. **Connecting to the Blockchain**: How to use `ethers.js` or `web3.js` to interact with the deployed contract.
2. **Reading Data**: Fetching tasks using `getTasks()`.
3. **Writing Data**: Creating, updating, completing, and removing tasks through contract functions.
4. **React Components**: Handling user interactions in the UI.

Stay tuned for the next section where we’ll dive into the code implementation! 🚀
