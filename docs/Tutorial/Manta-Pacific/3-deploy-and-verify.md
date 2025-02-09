---
sidebar_position: 3
---

# 3. Hardhat Configuration and Deployment

This guide explains how to configure Hardhat, set up deployment, and verify your smart contract.

## Setting Up Hardhat Configuration

Create a file named `hardhat.config.ts` in the root directory and add the following configuration:

```ts
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import { vars } from "hardhat/config";

const PRIVATE_KEY = vars.get("PRIVATE_KEY");

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
    mantaPacificTestnet: {
      url: "https://pacific-rpc.sepolia-testnet.manta.network/http",
      accounts: [PRIVATE_KEY],
      chainId: 3441006,
    },
  },
  etherscan: {
    apiKey: {
      mantaPacificTestnet: "any",
    },
    customChains: [
      {
        network: "mantaPacificTestnet",
        chainId: 3441006,
        urls: {
          apiURL: "https://pacific-explorer.sepolia-testnet.manta.network/api",
          browserURL: "https://pacific-explorer.sepolia-testnet.manta.network",
        },
      },
    ],
  },
};

export default config;
```

## Setting Environment Variables

Run the following command to set your private key:
```sh
npx hardhat vars set PRIVATE_KEY
```
Enter your private key when prompted.

---

## Deploying the Smart Contract

Create a file `scripts/deploy.ts` and add the following script:

```ts
import { ethers } from "hardhat";

async function main() {
  console.log("Deploying TodoList contract...");
  
  const TodoList = await ethers.getContractFactory("TodoList");
  const todoList = await TodoList.deploy();

  console.log("Waiting for deployment transaction...");
  await todoList.waitForDeployment();
  
  const address = await todoList.getAddress();
  
  console.log(`TodoList deployed successfully to: ${address}`);
  console.log(`Verify contract with:`);
  console.log(`npx hardhat verify --network mantaPacificTestnet ${address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error deploying contract:", error);
    process.exit(1);
  });
```

### Running the Deployment

To deploy the contract, use:
```sh
npx hardhat run scripts/deploy.ts --network mantaPacificTestnet
```

### Verifying the Contract

Once deployed, verify the contract on the blockchain explorer:
```sh
npx hardhat verify --network mantaPacificTestnet <DEPLOYED_CONTRACT_ADDRESS>
```

Now your **Hardhat environment** is configured, the contract is deployed, and verification is completed! 🚀
