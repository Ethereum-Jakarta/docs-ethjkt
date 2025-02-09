---
sidebar_position: 6
---

# 6. Smart Contract Integration - Application Context

This document explains the configuration and context setup required for integrating the `TodoList` smart contract into the user interface.

---

## 1. **Context Configuration (`src/context/index.tsx`)**

The **context file** initializes and provides the required environment to connect the `TodoList` smart contract to the user interface. Here's an explanation of its main components:

### Key Features:

#### **Web3Modal Provider Setup**
The `Web3ModalProvider` is responsible for managing the wallet connection and interaction with the blockchain.

```tsx
'use client';
import React, { ReactNode, useEffect, useState } from 'react';
import { config, projectId } from '@/config';
import { createWeb3Modal } from '@web3modal/wagmi/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { State, WagmiProvider } from 'wagmi';

const queryClient = new QueryClient();

if (!projectId) throw new Error('Project ID is not defined');

createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: true,
  enableOnramp: true
});

export default function Web3ModalProvider({ children, initialState }: { children: ReactNode; initialState?: State }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <WagmiProvider config={config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        {mounted && children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
```

#### Key Functions:
1. **`createWeb3Modal`**: Initializes the Web3Modal for wallet connection.
2. **`QueryClientProvider`**: Enables caching and management of blockchain-related queries.
3. **`WagmiProvider`**: Provides the configuration for blockchain interactions.
4. **Error Handling**: Throws an error if `NEXT_PUBLIC_PROJECT_ID` is not defined.

### Usage:
Wrap the entire application with the `Web3ModalProvider` in `layout.tsx` to enable wallet connections.

---

## 2. **Constants Setup (`src/constants/index.tsx`)**

This file contains the constants required for interacting with the smart contract.

### Key Elements:

```tsx
import TodoListAbi from '../contracts/TodoList.json';

export const PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID;
export const TODOLIST_ABI = TodoListAbi;
export const TODOLIST_ADDRESS = '0xdf6f19AA5987fE944AD6d7FC49B0ab5fD5978717';
```

#### Explanation:
- **`PROJECT_ID`**: The project ID required to connect to the blockchain via Web3Modal.
- **`TODOLIST_ABI`**: The ABI (Application Binary Interface) of the `TodoList` smart contract.
- **`TODOLIST_ADDRESS`**: The deployed contract address for interacting with blockchain functions.

---

## 3. **Config Setup (`src/config/index.tsx`)**

This file defines the blockchain configuration used by the application.

### Key Configuration:

```tsx
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';
import { cookieStorage, createStorage } from 'wagmi';
import { mantaSepoliaTestnet } from 'wagmi/chains';

export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

if (!projectId) throw new Error('Project ID is not defined');

const metadata = {
  name: 'SC Connect TodoList UI',
  description: 'UI for connecting to SC Connect',
  url: 'https://sc-connect-todolist-ui.netlify.app',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
};

const chains = [mantaSepoliaTestnet] as const;
export const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage
  }),
  enableWalletConnect: true,
  enableInjected: true,
  enableEIP6963: true,
});
```

#### Explanation:
- **`projectId`**: Validates the presence of the Project ID.
- **`metadata`**: Metadata for the dApp, displayed in wallets and explorers.
- **`chains`**: Specifies the blockchain network (e.g., Manta Pacific Testnet).
- **`defaultWagmiConfig`**: Configures the wagmi client for blockchain interactions.

---

By setting up the context, constants, and configuration files, your application is prepared to connect and interact with the blockchain. For UI-specific functionality, refer to the next document.
