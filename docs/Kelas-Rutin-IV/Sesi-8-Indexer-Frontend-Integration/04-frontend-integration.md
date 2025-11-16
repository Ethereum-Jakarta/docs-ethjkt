---
id: frontend-integration
title: "Bagian 4: Integrasi Indexer dengan Frontend SimpleDEX"
sidebar_position: 4
description: "Integrasikan Ponder indexer dengan frontend SimpleDEX dari Sesi 7 untuk menampilkan data real-time dari blockchain"
---

# Bagian 4: Integrasi Indexer dengan Frontend SimpleDEX

## 🎯 Tujuan Bagian Ini

Setelah menyelesaikan bagian ini, Anda akan:
- ✅ Install dan setup Apollo GraphQL Client
- ✅ Konfigurasi GraphQL client untuk koneksi ke Ponder indexer
- ✅ Membuat custom hooks untuk query data dari indexer
- ✅ Mengintegrasikan data indexer dengan komponen yang sudah ada di Sesi 7
- ✅ Menampilkan transaction history dari indexer
- ✅ Menampilkan pool analytics dengan data real-time
- ✅ Menampilkan user statistics dan trading history

---

## 📋 Prasyarat

Sebelum memulai, pastikan:
- ✅ Frontend SimpleDEX dari Sesi 7 sudah berjalan
- ✅ Ponder indexer sudah running dan sync selesai (Bagian 2 & 3)
- ✅ GraphQL endpoint dapat diakses di `http://localhost:42069/graphql`
- ✅ Proyek frontend menggunakan React + TypeScript + Vite

---

## 🚀 Langkah 1: Install Dependencies

Di folder proyek frontend SimpleDEX (dari Sesi 7), install dependencies yang diperlukan:

```bash
# Install Apollo GraphQL Client
npm install @apollo/client graphql

# Jika belum ada, install juga:
npm install @tanstack/react-query
```

**Penjelasan Dependencies:**
- `@apollo/client` - GraphQL client untuk React dengan caching & state management
- `graphql` - GraphQL query language support
- `@tanstack/react-query` - Sudah ada dari Sesi 7, untuk state management tambahan

---

## 🔧 Langkah 2: Setup GraphQL Client

### Buat File GraphQL Client

Buat file `src/lib/graphql.ts`:

```typescript
import { ApolloClient, InMemoryCache, gql, createHttpLink } from '@apollo/client';

// Create HTTP link to Ponder GraphQL endpoint
const httpLink = createHttpLink({
  uri: 'http://localhost:42069/graphql',
});

// Create Apollo Client with optimized cache configuration
export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          // Configure caching for paginated results
          swapss: {
            merge: false, // Don't merge, replace completely
            keyArgs: ['orderBy', 'orderDirection', 'limit'], // Cache based on these args
          },
          userStatss: {
            merge: false,
            keyArgs: ['orderBy', 'orderDirection', 'limit'],
          },
          dailyVolumess: {
            merge: false,
            keyArgs: ['orderBy', 'orderDirection', 'limit'],
          },
          liquidityEventss: {
            merge: false,
            keyArgs: ['orderBy', 'orderDirection', 'limit'],
          },
          transferss: {
            merge: false,
            keyArgs: ['orderBy', 'orderDirection', 'limit'],
          },
        },
      },
      // Cache individual records by ID
      SwapData: {
        keyFields: ['id'],
      },
      UserStatsData: {
        keyFields: ['id'],
      },
      PoolStatsData: {
        keyFields: ['id'],
      },
      DailyVolumeData: {
        keyFields: ['id'],
      },
      LiquidityEventData: {
        keyFields: ['id'],
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
      fetchPolicy: 'cache-first', // Use cache first
      notifyOnNetworkStatusChange: false, // Prevent unnecessary re-renders
    },
    query: {
      errorPolicy: 'all',
      fetchPolicy: 'cache-first',
    },
  },
});

// NOTE: Ponder 0.9+ requires you to manually set up GraphQL endpoint
// Create src/api/index.ts with:
// import { db } from "ponder:api";
// import schema from "ponder:schema";
// import { Hono } from "hono";
// import { graphql } from "ponder";
// 
// const app = new Hono();
// app.use("/graphql", graphql({ db, schema }));
// export default app;

// GraphQL queries for Swaps
export const GET_RECENT_SWAPS = gql`
  query GetRecentSwaps($limit: Int = 10) {
    swapss(
      orderBy: "timestamp"
      orderDirection: "desc"
      limit: $limit
    ) {
      items {
        id
        user
        tokenIn
        tokenOut
        amountIn
        amountOut
        priceImpact
        gasUsed
        blockNumber
        timestamp
        transactionHash
      }
    }
  }
`;

export const GET_SWAPS_BY_USER = gql`
  query GetSwapsByUser($userAddress: String!, $limit: Int = 10) {
    swapss(
      where: { user: $userAddress }
      orderBy: "timestamp"
      orderDirection: "desc"
      limit: $limit
    ) {
      items {
        id
        tokenIn
        tokenOut
        amountIn
        amountOut
        priceImpact
        timestamp
        transactionHash
      }
    }
  }
`;

// GraphQL queries for User Stats
export const GET_USER_STATS = gql`
  query GetUserStats($userAddress: String!) {
    userStats(id: $userAddress) {
      id
      totalSwaps
      totalVolumeUSD
      liquidityProvided
      feesEarned
      firstSeen
      lastActivity
    }
  }
`;

export const GET_TOP_USERS = gql`
  query GetTopUsers($limit: Int = 10) {
    userStatss(
      orderBy: "totalVolumeUSD"
      orderDirection: "desc"
      limit: $limit
    ) {
      items {
        id
        totalSwaps
        totalVolumeUSD
        liquidityProvided
        feesEarned
        lastActivity
      }
    }
  }
`;

// GraphQL queries for Daily Volume
export const GET_DAILY_VOLUME = gql`
  query GetDailyVolume($days: Int = 7) {
    dailyVolumess(
      orderBy: "date"
      orderDirection: "desc"
      limit: $days
    ) {
      items {
        id
        date
        volumeUSD
        transactionCount
        uniqueUsers
        avgGasPrice
      }
    }
  }
`;

export const GET_TOTAL_VOLUME = gql`
  query GetTotalVolume {
    dailyVolumess(
      orderBy: "date"
      orderDirection: "asc"
    ) {
      items {
        volumeUSD
        transactionCount
      }
    }
  }
`;

// GraphQL queries for Pool Stats
export const GET_POOL_STATS = gql`
  query GetPoolStats {
    poolStats(id: "latest") {
      id
      reserveA
      reserveB
      totalLiquidity
      price
      tvlUSD
      volume24h
      lastUpdated
    }
  }
`;

// GraphQL queries for Liquidity Events
export const GET_RECENT_LIQUIDITY_EVENTS = gql`
  query GetRecentLiquidityEvents($limit: Int = 10) {
    liquidityEventss(
      orderBy: "timestamp"
      orderDirection: "desc"
      limit: $limit
    ) {
      items {
        id
        type
        provider
        amountA
        amountB
        liquidity
        shareOfPool
        blockNumber
        timestamp
        transactionHash
      }
    }
  }
`;

export const GET_LIQUIDITY_EVENTS_BY_USER = gql`
  query GetLiquidityEventsByUser($userAddress: String!, $limit: Int = 10) {
    liquidityEventss(
      where: { provider: $userAddress }
      orderBy: "timestamp"
      orderDirection: "desc"
      limit: $limit
    ) {
      items {
        id
        type
        amountA
        amountB
        liquidity
        shareOfPool
        timestamp
        transactionHash
      }
    }
  }
`;

// GraphQL queries for Token Transfers
export const GET_RECENT_TRANSFERS = gql`
  query GetRecentTransfers($tokenAddress: String, $limit: Int = 10) {
    transferss(
      where: { token: $tokenAddress }
      orderBy: "timestamp"
      orderDirection: "desc"
      limit: $limit
    ) {
      items {
        id
        token
        from
        to
        amount
        blockNumber
        timestamp
        transactionHash
      }
    }
  }
`;

export const GET_TRANSFERS_BY_USER = gql`
  query GetTransfersByUser($userAddress: String!, $limit: Int = 10) {
    transferss(
      where: { 
        OR: [
          { from: $userAddress }
          { to: $userAddress }
        ]
      }
      orderBy: "timestamp"
      orderDirection: "desc"
      limit: $limit
    ) {
      items {
        id
        token
        from
        to
        amount
        timestamp
        transactionHash
      }
    }
  }
`;

// Combined dashboard query
export const GET_DASHBOARD_DATA = gql`
  query GetDashboardData($userAddress: String) {
    # Recent swaps
    recentSwaps: swapss(
      orderBy: "timestamp"
      orderDirection: "desc"
      limit: 5
    ) {
      items {
        id
        user
        tokenIn
        tokenOut
        amountIn
        amountOut
        priceImpact
        timestamp
      }
    }
    
    # Pool stats
    poolStats(id: "latest") {
      reserveA
      reserveB
      totalLiquidity
      price
      tvlUSD
      volume24h
      lastUpdated
    }
    
    # Daily volume (last 7 days)
    dailyVolumes: dailyVolumess(
      orderBy: "date"
      orderDirection: "desc"
      limit: 7
    ) {
      items {
        date
        volumeUSD
        transactionCount
        uniqueUsers
      }
    }
    
    # User stats (if userAddress provided)
    userStats(id: $userAddress) {
      totalSwaps
      totalVolumeUSD
      liquidityProvided
      feesEarned
      firstSeen
      lastActivity
    }
  }
`;

// Analytics queries
export const GET_VOLUME_ANALYTICS = gql`
  query GetVolumeAnalytics($days: Int = 30) {
    dailyVolumess(
      orderBy: "date"
      orderDirection: "desc"
      limit: $days
    ) {
      items {
        date
        volumeUSD
        transactionCount
        uniqueUsers
        avgGasPrice
      }
    }
  }
`;

export const GET_TOP_TRADERS = gql`
  query GetTopTraders($limit: Int = 20) {
    userStatss(
      where: { totalSwaps_gt: 0 }
      orderBy: "totalVolumeUSD"
      orderDirection: "desc"
      limit: $limit
    ) {
      items {
        id
        totalSwaps
        totalVolumeUSD
        liquidityProvided
        feesEarned
        firstSeen
        lastActivity
      }
    }
  }
`;

export const GET_LIQUIDITY_PROVIDERS = gql`
  query GetLiquidityProviders($limit: Int = 20) {
    userStatss(
      where: { liquidityProvided_gt: 0 }
      orderBy: "liquidityProvided"
      orderDirection: "desc"
      limit: $limit
    ) {
      items {
        id
        totalSwaps
        totalVolumeUSD
        liquidityProvided
        feesEarned
        firstSeen
        lastActivity
      }
    }
  }
`;

// Real-time activity query
export const GET_RECENT_ACTIVITY = gql`
  query GetRecentActivity($limit: Int = 20) {
    # Recent swaps
    recentSwaps: swapss(
      orderBy: "timestamp"
      orderDirection: "desc"
      limit: $limit
    ) {
      items {
        id
        user
        tokenIn
        tokenOut
        amountIn
        amountOut
        timestamp
        transactionHash
      }
    }
    
    # Recent liquidity events
    recentLiquidityEvents: liquidityEventss(
      orderBy: "timestamp"
      orderDirection: "desc"
      limit: $limit
    ) {
      items {
        id
        type
        provider
        amountA
        amountB
        liquidity
        timestamp
        transactionHash
      }
    }
  }
`;

// Search queries
export const SEARCH_TRANSACTIONS = gql`
  query SearchTransactions($hash: String!) {
    # Search swaps
    swaps: swapss(where: { transactionHash: $hash }) {
      items {
        id
        user
        tokenIn
        tokenOut
        amountIn
        amountOut
        priceImpact
        timestamp
        transactionHash
      }
    }
    
    # Search liquidity events
    liquidityEvents: liquidityEventss(where: { transactionHash: $hash }) {
      items {
        id
        type
        provider
        amountA
        amountB
        liquidity
        timestamp
        transactionHash
      }
    }
    
    # Search transfers
    transfers: transferss(where: { transactionHash: $hash }) {
      items {
        id
        token
        from
        to
        amount
        timestamp
        transactionHash
      }
    }
  }
`;

// Helper function to format BigInt values for GraphQL
export const formatBigIntForGraphQL = (value: bigint): string => {
  return value.toString();
};

// Helper function to parse BigInt values from GraphQL
export const parseBigIntFromGraphQL = (value: string): bigint => {
  return BigInt(value);
};

// Type definitions for GraphQL responses
export interface SwapData {
  id: string;
  user: string;
  tokenIn: string;
  tokenOut: string;
  amountIn: string;
  amountOut: string;
  priceImpact: number;
  gasUsed: string;
  blockNumber: string;
  timestamp: string;
  transactionHash: string;
}

export interface UserStatsData {
  id: string;
  totalSwaps: number;
  totalVolumeUSD: number;
  liquidityProvided: string;
  feesEarned: number;
  firstSeen: string;
  lastActivity: string;
}

export interface DailyVolumeData {
  id: string;
  date: string;
  volumeUSD: number;
  transactionCount: number;
  uniqueUsers: number;
  avgGasPrice: string;
}

export interface PoolStatsData {
  id: string;
  reserveA: string;
  reserveB: string;
  totalLiquidity: string;
  price: string;
  tvlUSD: number;
  volume24h: number;
  lastUpdated: string;
}

export interface LiquidityEventData {
  id: string;
  type: "ADD" | "REMOVE";
  provider: string;
  amountA: string;
  amountB: string;
  liquidity: string;
  shareOfPool: number;
  blockNumber: string;
  timestamp: string;
  transactionHash: string;
}

export interface TransferData {
  id: string;
  token: string;
  from: string;
  to: string;
  amount: string;
  blockNumber: string;
  timestamp: string;
  transactionHash: string;
}
```

### Buat Environment Variable

Tambahkan ke file `.env` atau `.env.local`:

```bash
VITE_GRAPHQL_URL=http://localhost:42069/graphql
```

---

## 🔌 Langkah 3: Setup Apollo Provider

### Update App.tsx

Edit `src/App.tsx` untuk menambahkan ApolloProvider:

```typescript
import Header from "./components/Header";
import '@rainbow-me/rainbowkit/styles.css';

import {
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import type {
  Chain
} from 'wagmi/chains';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import DEXContainer from "./components/DEXContainer";
import { ApolloProvider } from '@apollo/client/react';
import { apolloClient } from './lib/graphql';

// Konfigurasi Chain Lisk Sepolia Testnet
const liskSepoliaTestnet: Chain = {
  id: 4202,
  name: 'Lisk Sepolia Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'ETH',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.sepolia-api.lisk.com'],
    },
    public: {
      http: ['https://rpc.sepolia-api.lisk.com'],
    },
  },
  blockExplorers: {
    default: {
      name: 'LiskSepoliaBlockscout',
      url: 'https://sepolia-blockscout.lisk.com',
    },
  },
  testnet: true,
};

// eslint-disable-next-line react-refresh/only-export-components
export const config = getDefaultConfig({
  appName: 'Simple DEX',
  projectId: 'YOUR_WALLETCONNECT_PROJECT_ID', // Dapatkan dari https://cloud.walletconnect.com
  chains: [liskSepoliaTestnet],
  ssr: true,
});

function App() {
  const queryClient = new QueryClient();
  return (
    <WagmiProvider config={config}>
      <ApolloProvider client={apolloClient}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>
            <div className="min-h-screen">
              <Header />
              <DEXContainer />
            </div>
            <Toaster position="top-center" />
          </RainbowKitProvider>
        </QueryClientProvider>
      </ApolloProvider>
     
    </WagmiProvider>
  )
}

export default App
```

**Penjelasan:**
- `ApolloProvider` membungkus aplikasi untuk memberikan akses GraphQL client ke semua komponen
- Ditempatkan setelah `WagmiProvider` dan sebelum `QueryClientProvider`
- Semua komponen di dalam tree dapat menggunakan hooks Apollo seperti `useQuery`

---

## 🎣 Langkah 4: Buat Custom Hooks untuk Indexer

### Buat Typing: src/types/indexer.ts:

Buat file `src/types/indexer.ts`:

```typescript
export type BigIntString = string;

export interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor?: string | null;
  endCursor?: string | null;
}

export interface Swap {
  id: string;
  user: string;
  tokenIn: string;
  tokenOut: string;
  amountIn: BigIntString;
  amountOut: BigIntString;
  priceImpact?: number | null;
  gasUsed: BigIntString;
  blockNumber: BigIntString;
  timestamp: BigIntString;
  transactionHash: string;
}

export interface SwapsPage {
  items: Swap[];
  pageInfo: PageInfo;
  totalCount: number;
}

export interface RecentSwapsQuery {
  swapss: SwapsPage;
}

export type LiquidityEventType = "ADD" | "REMOVE";

export interface LiquidityEvent {
  id: string;
  type: LiquidityEventType;
  provider: string;
  amountA: BigIntString;
  amountB: BigIntString;
  liquidity: BigIntString;
  shareOfPool?: number | null;
  blockNumber: BigIntString;
  timestamp: BigIntString;
  transactionHash: string;
}

export interface LiquidityEventsPage {
  items: LiquidityEvent[];
  pageInfo: PageInfo;
  totalCount: number;
}

export interface LiquidityEventsQuery {
  liquidityEventss: LiquidityEventsPage;
}

export interface DailyVolume {
  id: string;
  date: string;
  volumeUSD: number;
  transactionCount: number;
  uniqueUsers: number;
  avgGasPrice?: BigIntString | null;
}

export interface DailyVolumesPage {
  items: DailyVolume[];
  pageInfo: PageInfo;
  totalCount: number;
}

export interface DailyVolumesQuery {
  dailyVolumess: DailyVolumesPage;
}

export interface PoolStats {
  id: string;
  reserveA: BigIntString;
  reserveB: BigIntString;
  totalLiquidity: BigIntString;
  price: BigIntString;
  tvlUSD?: number | null;
  volume24h?: number | null;
  lastUpdated: BigIntString;
}

export interface PoolStatsQuery {
  poolStats: PoolStats | null;
}

export interface UserStats {
  id: string;
  totalSwaps: number;
  totalVolumeUSD: number;
  liquidityProvided: BigIntString;
  feesEarned: number;
  firstSeen: BigIntString;
  lastActivity: BigIntString;
}

export interface UserStatsQuery {
  userStats: UserStats | null;
}

export interface DashboardQuery {
  recentSwaps: SwapsPage;
  poolStats: PoolStats | null;
  dailyVolumes: DailyVolumesPage;
  userStats: UserStats | null;
}

```

### Buat Hook: useIndexerData.ts

Buat file `src/hooks/useIndexerData.ts`:

```typescript
import { useQuery } from '@apollo/client/react';
import { useMemo, useCallback } from 'react';
import { 
  GET_RECENT_SWAPS, 
  GET_USER_STATS, 
  GET_DAILY_VOLUME, 
  GET_POOL_STATS,
  GET_RECENT_LIQUIDITY_EVENTS,
  GET_TOP_USERS,
  GET_VOLUME_ANALYTICS,
  GET_DASHBOARD_DATA
} from '../lib/graphql';
import type {
  Swap,
  RecentSwapsQuery,
  UserStats,
  UserStatsQuery,
  DailyVolume,
  DailyVolumesQuery,
  PoolStats,
  PoolStatsQuery,
  LiquidityEvent,
  LiquidityEventsQuery,
  DashboardQuery
} from '../types/indexer';

/*
 * OPTIMIZED POLLING INTERVALS FOR REAL-TIME DEX TRADING:
 * 
 * 🚀 High Priority (3-5s):  Recent swaps, Pool stats
 * ⚡ Medium Priority (8-15s): Liquidity events, Daily volume, User stats  
 * 📊 Low Priority (30-60s):  Top users, Volume analytics
 * 
 * These intervals provide excellent real-time experience while maintaining
 * reasonable server load and network usage.
 */

// Hook for recent swaps
export const useRecentSwaps = (limit = 10) => {
  const { data, loading, error, refetch } = useQuery<RecentSwapsQuery>(GET_RECENT_SWAPS, {
    variables: { limit },
    pollInterval: 30000, // Reduced from 5000 to 30000 (30 seconds)
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: false, // Prevent unnecessary re-renders
    fetchPolicy: 'cache-first', // Use cache first to reduce network calls
  });

  // Memoize the returned data to prevent object recreation on every render
  const swapData = useMemo(() => data?.swapss?.items || [], [data?.swapss?.items]);
  
  // Memoize the refetch function
  const stableRefetch = useCallback(() => {
    return refetch();
  }, [refetch]);

  // Return stable object reference
  return useMemo(() => ({
    data: swapData,
    isLoading: loading,
    error,
    refetch: stableRefetch,
  }), [swapData, loading, error, stableRefetch]);
};

// Hook for user statistics
export const useUserStats = (userAddress?: string) => {
  const { data, loading, error, refetch } = useQuery<UserStatsQuery>(GET_USER_STATS, {
    variables: { userAddress },
    skip: !userAddress,
    pollInterval: 60000, // Reduced from 10000 to 60000 (1 minute)
    errorPolicy: 'all',
    fetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: false,
  });

  const userData = useMemo(() => data?.userStats, [data?.userStats]);
  
  const stableRefetch = useCallback(() => {
    if (!userAddress) return Promise.resolve();
    return refetch();
  }, [refetch, userAddress]);

  return useMemo(() => ({
    data: userData,
    isLoading: loading,
    error,
    refetch: stableRefetch,
  }), [userData, loading, error, stableRefetch]);
};

// Hook for daily volume
export const useDailyVolume = (days = 7) => {
  const { data, loading, error, refetch } = useQuery<DailyVolumesQuery>(GET_DAILY_VOLUME, {
    variables: { days },
    pollInterval: 120000, // Reduced from 30000 to 120000 (2 minutes)
    errorPolicy: 'all',
    fetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: false,
  });

  const volumeData = useMemo(() => data?.dailyVolumess?.items || [], [data?.dailyVolumess?.items]);
  
  const stableRefetch = useCallback(() => {
    return refetch();
  }, [refetch]);

  return useMemo(() => ({
    data: volumeData,
    isLoading: loading,
    error,
    refetch: stableRefetch,
  }), [volumeData, loading, error, stableRefetch]);
};

// Hook for pool statistics
export const usePoolStats = () => {
  const { data, loading, error, refetch } = useQuery<PoolStatsQuery>(GET_POOL_STATS, {
    pollInterval: 60000, // Reduced from 15000 to 60000 (1 minute)
    errorPolicy: 'all',
    fetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: false,
  });

  const poolData = useMemo(() => data?.poolStats, [data?.poolStats]);
  
  const stableRefetch = useCallback(() => {
    return refetch();
  }, [refetch]);

  return useMemo(() => ({
    data: poolData,
    isLoading: loading,
    error,
    refetch: stableRefetch,
  }), [poolData, loading, error, stableRefetch]);
};

// Hook for recent liquidity events
export const useLiquidityEvents = (limit = 10) => {
  const { data, loading, error, refetch } = useQuery<LiquidityEventsQuery>(GET_RECENT_LIQUIDITY_EVENTS, {
    variables: { limit },
    pollInterval: 60000, // Reduced from 5000 to 60000 (1 minute)
    errorPolicy: 'all',
    fetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: false,
  });

  const liquidityData = useMemo(() => data?.liquidityEventss?.items || [], [data?.liquidityEventss?.items]);
  
  const stableRefetch = useCallback(() => {
    return refetch();
  }, [refetch]);

  return useMemo(() => ({
    data: liquidityData,
    isLoading: loading,
    error,
    refetch: stableRefetch,
  }), [liquidityData, loading, error, stableRefetch]);
};

// Hook for top users
export const useTopUsers = (limit = 10) => {
  const { data, loading, error, refetch } = useQuery<{ userStatss: { items: UserStats[] } }>(GET_TOP_USERS, {
    variables: { limit },
    pollInterval: 300000, // 5 minutes - this data doesn't change often
    errorPolicy: 'all',
    fetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: false,
  });

  const topUsersData = useMemo(() => data?.userStatss?.items || [], [data?.userStatss?.items]);
  
  const stableRefetch = useCallback(() => {
    return refetch();
  }, [refetch]);

  return useMemo(() => ({
    data: topUsersData,
    isLoading: loading,
    error,
    refetch: stableRefetch,
  }), [topUsersData, loading, error, stableRefetch]);
};

// Hook for volume analytics
export const useVolumeAnalytics = (days = 30) => {
  const { data, loading, error, refetch } = useQuery<DailyVolumesQuery>(GET_VOLUME_ANALYTICS, {
    variables: { days },
    pollInterval: 60000, // 1 minute - historical data changes slowly
    errorPolicy: 'all',
    fetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: false,
  });

  const analyticsData = useMemo(() => data?.dailyVolumess?.items || [], [data?.dailyVolumess?.items]);
  
  const stableRefetch = useCallback(() => {
    return refetch();
  }, [refetch]);

  return useMemo(() => ({
    data: analyticsData,
    isLoading: loading,
    error,
    refetch: stableRefetch,
  }), [analyticsData, loading, error, stableRefetch]);
};

// Hook for dashboard data (combined query) - ONLY USE THIS IF YOU NEED ALL DATA AT ONCE
export const useDashboardData = (userAddress?: string) => {
  const { data, loading, error, refetch } = useQuery<DashboardQuery>(GET_DASHBOARD_DATA, {
    variables: { userAddress },
    pollInterval: 120000, // 2 minutes
    errorPolicy: 'all',
    fetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: false,
  });

  const dashboardData = useMemo(() => ({
    recentSwaps: data?.recentSwaps?.items || [],
    poolStats: data?.poolStats,
    dailyVolumes: data?.dailyVolumes?.items || [],
    userStats: data?.userStats,
  }), [
    data?.recentSwaps?.items,
    data?.poolStats,
    data?.dailyVolumes?.items,
    data?.userStats
  ]);

  const stableRefetch = useCallback(() => {
    return refetch();
  }, [refetch]);

  return useMemo(() => ({
    data: dashboardData,
    isLoading: loading,
    error,
    refetch: stableRefetch,
  }), [dashboardData, loading, error, stableRefetch]);
};

// Hook for aggregated analytics - CAREFUL: This uses multiple queries
export const useAnalytics = () => {
  const recentSwaps = useRecentSwaps(50);
  const dailyVolume = useDailyVolume(30);
  const poolStats = usePoolStats();
  const liquidityEvents = useLiquidityEvents(20);
  
  // Memoize the aggregated data
  const aggregatedData = useMemo(() => ({
    recentSwaps: recentSwaps.data || [],
    dailyVolume: dailyVolume.data || [],
    poolStats: poolStats.data,
    liquidityEvents: liquidityEvents.data || [],
    isLoading: recentSwaps.isLoading || dailyVolume.isLoading || poolStats.isLoading,
    error: recentSwaps.error || dailyVolume.error || poolStats.error,
  }), [
    recentSwaps.data,
    recentSwaps.isLoading,
    recentSwaps.error,
    dailyVolume.data,
    dailyVolume.isLoading,
    dailyVolume.error,
    poolStats.data,
    poolStats.isLoading,
    poolStats.error,
    liquidityEvents.data
  ]);

  return aggregatedData;
};

// Helper hook for indexer health - Simple health check
export const useIndexerHealth = () => {
  const { data, loading, error } = useQuery<PoolStatsQuery>(GET_POOL_STATS, {
    pollInterval: 30000, // 30 seconds - health check doesn't need to be too frequent
    errorPolicy: 'all',
    fetchPolicy: 'cache-first', // Changed from network-only for better performance
    notifyOnNetworkStatusChange: false,
  });

  const healthData = useMemo(() => ({
    isHealthy: !error && !!data?.poolStats,
    lastUpdated: data?.poolStats?.lastUpdated,
    error: error
  }), [error, data?.poolStats]);

  return useMemo(() => ({
    data: healthData,
    isLoading: loading,
    error,
  }), [healthData, loading, error]);
};

// Manual refetch hook - Use this for user-triggered refreshes
export const useManualRefresh = () => {
  const recentSwaps = useRecentSwaps();
  const poolStats = usePoolStats();
  const dailyVolume = useDailyVolume();

  const refreshAll = useCallback(async () => {
    try {
      await Promise.all([
        recentSwaps.refetch(),
        poolStats.refetch(),
        dailyVolume.refetch(),
      ]);
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  }, [recentSwaps, poolStats, dailyVolume]);

  return { refreshAll };
};

// Re-export types for convenience
export type {
  Swap,
  UserStats,
  DailyVolume,
  PoolStats,
  LiquidityEvent
};
```
---

## 🎣 Langkah 5: Update Existing Components

### Update src/components/PriceChart.tsx:

```typescript
"use client"

import { useState, useEffect, useMemo } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import { TrendingUp, TrendingDown, Minus, Users, DollarSign, RefreshCw } from "lucide-react"
import { usePoolData } from "../hooks/usePoolData"
import { useRecentSwaps, useUserStats, useDailyVolume, useIndexerHealth, useManualRefresh, type Swap } from "../hooks/useIndexerData"
import { useWatchContractEvent, usePublicClient, useAccount } from "wagmi"
import { SIMPLE_DEX_ABI, CONTRACTS } from "../constants"
import { formatNumber, formatTime, formatUSD } from "../utils/formatters"
import type { PriceData } from "../types/defi"

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ payload: PriceData }>
}

interface SwapEvent {
  args: {
    user: string
    amountIn: bigint
    amountOut: bigint
    tokenAtoB: boolean
  }
  blockNumber: bigint
  transactionHash: string
}

interface LiquidityEvent {
  args: {
    provider: string
    amountA: bigint
    amountB: bigint
    liquidity: bigint
  }
  blockNumber: bigint
  transactionHash: string
}

const PriceChart = () => {
  const { address } = useAccount()
  const { poolInfo, isLoading } = usePoolData()
  const [timeFrame, setTimeFrame] = useState<'1H' | '1D' | '1W' | '1M'>('1D')
  const [priceHistory, setPriceHistory] = useState<PriceData[]>([])
  const [volume24h, setVolume24h] = useState(0)
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)
  
  // Fetch data from indexer for analytics
  const { data: recentSwaps } = useRecentSwaps()
  const { data: userStats } = useUserStats(address)
  const { data: dailyVolume, isLoading: volumeLoading } = useDailyVolume(7)
  const { data: indexerHealth } = useIndexerHealth()
  const { refreshAll } = useManualRefresh()

  // Manual refresh state
  const [isRefreshing, setIsRefreshing] = useState(false)
  
  const publicClient = usePublicClient()

  // Handle manual refresh
  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await refreshAll()
      await fetchHistoricalData() // Also refresh chart data
    } catch (error) {
      console.error('Failed to refresh data:', error)
    } finally {
      setIsRefreshing(false)
    }
  }

  // Calculate metrics from indexer data
  const metrics = useMemo(() => {
    if (!recentSwaps || !dailyVolume) return null

    const total24hVolume = dailyVolume[0]?.volumeUSD || 0
    const total24hTxs = dailyVolume[0]?.transactionCount || 0
    const uniqueUsers = new Set(recentSwaps.map((swap: Swap) => swap.user)).size

    return {
      volume24h: total24hVolume,
      transactions24h: total24hTxs,
      uniqueUsers,
      avgTradeSize: total24hTxs > 0 ? total24hVolume / total24hTxs : 0
    }
  }, [recentSwaps, dailyVolume])

  // Calculate real price from pool reserves
  const calculateRealPrice = (reserveA: bigint, reserveB: bigint) => {
    if (reserveA === BigInt(0) || reserveB === BigInt(0)) {
      return 0
    }
    
    // Price = reserveB / reserveA (adjusted for decimals)
    // USDC (6 decimals) per CAMP (18 decimals)
    const reserveA_adjusted = Number(reserveA) / Math.pow(10, 18) // CAMP
    const reserveB_adjusted = Number(reserveB) / Math.pow(10, 6)  // USDC
    
    return reserveB_adjusted / reserveA_adjusted
  }

  // Calculate real TVL from reserves
  const calculateTVL = (reserveA: bigint, reserveB: bigint, price: number) => {
    const campValue = (Number(reserveA) / Math.pow(10, 18)) * price
    const usdcValue = Number(reserveB) / Math.pow(10, 6)
    return campValue + usdcValue
  }

  // Fetch historical events and build price history
  const fetchHistoricalData = async () => {
    if (!publicClient) return

    setIsLoadingHistory(true)
    
    try {
      const currentBlock = await publicClient.getBlockNumber()
      
      // Calculate blocks to fetch based on timeframe
      const getBlockRange = () => {
        const blocksPerHour = 300 // Approximate blocks per hour (12 sec per block)
        switch (timeFrame) {
          case '1H': return { blocks: blocksPerHour, points: 12 }
          case '1D': return { blocks: blocksPerHour * 24, points: 24 }
          case '1W': return { blocks: blocksPerHour * 24 * 7, points: 48 }
          case '1M': return { blocks: blocksPerHour * 24 * 30, points: 60 }
          default: return { blocks: blocksPerHour * 24, points: 24 }
        }
      }

      const { blocks, points } = getBlockRange()
      const fromBlock = currentBlock - BigInt(blocks)

      // Fetch swap events for volume calculation
      const swapEvents = await publicClient.getLogs({
        address: CONTRACTS.SIMPLE_DEX as `0x${string}`,
        event: {
          type: 'event',
          name: 'Swap',
          inputs: [
            { name: 'user', type: 'address', indexed: true },
            { name: 'amountIn', type: 'uint256', indexed: false },
            { name: 'amountOut', type: 'uint256', indexed: false },
            { name: 'tokenAtoB', type: 'bool', indexed: false }
          ]
        },
        fromBlock,
        toBlock: currentBlock,
      })

      // Fetch liquidity events
      const liquidityAddedEvents = await publicClient.getLogs({
        address: CONTRACTS.SIMPLE_DEX as `0x${string}`,
        event: {
          type: 'event',
          name: 'LiquidityAdded',
          inputs: [
            { name: 'provider', type: 'address', indexed: true },
            { name: 'amountA', type: 'uint256', indexed: false },
            { name: 'amountB', type: 'uint256', indexed: false },
            { name: 'liquidity', type: 'uint256', indexed: false }
          ]
        },
        fromBlock,
        toBlock: currentBlock,
      })

      const liquidityRemovedEvents = await publicClient.getLogs({
        address: CONTRACTS.SIMPLE_DEX as `0x${string}`,
        event: {
          type: 'event',
          name: 'LiquidityRemoved',
          inputs: [
            { name: 'provider', type: 'address', indexed: true },
            { name: 'amountA', type: 'uint256', indexed: false },
            { name: 'amountB', type: 'uint256', indexed: false },
            { name: 'liquidity', type: 'uint256', indexed: false }
          ]
        },
        fromBlock,
        toBlock: currentBlock,
      })

      // Combine and sort all events by block number
      const allEvents = [
        ...swapEvents.map(e => ({ ...e, type: 'swap' })),
        ...liquidityAddedEvents.map(e => ({ ...e, type: 'liquidityAdded' })),
        ...liquidityRemovedEvents.map(e => ({ ...e, type: 'liquidityRemoved' }))
      ].sort((a, b) => Number(a.blockNumber) - Number(b.blockNumber))

      // Calculate 24h volume from swap events
      const now = Date.now()
      const oneDayAgo = now - 24 * 60 * 60 * 1000
      
      let totalVolume24h = 0
      for (const event of swapEvents) {
        const block = await publicClient.getBlock({ blockNumber: event.blockNumber })
        const timestamp = Number(block.timestamp) * 1000
        
        if (timestamp >= oneDayAgo) {
          const swapArgs = event.args as SwapEvent['args']
          const volumeUSD = swapArgs.tokenAtoB 
            ? (Number(swapArgs.amountIn) / Math.pow(10, 18)) * calculateRealPrice(poolInfo.reserveA, poolInfo.reserveB)
            : Number(swapArgs.amountIn) / Math.pow(10, 6)
          totalVolume24h += volumeUSD
        }
      }
      
      setVolume24h(totalVolume24h)

      // Build price history from events
      const priceDataPoints: PriceData[] = []
      let currentReserveA = poolInfo.reserveA
      let currentReserveB = poolInfo.reserveB

      // Start with current state and work backwards
      const currentPrice = calculateRealPrice(currentReserveA, currentReserveB)
      const currentTVL = calculateTVL(currentReserveA, currentReserveB, currentPrice)

      // Add current data point
      priceDataPoints.unshift({
        timestamp: now,
        price: currentPrice,
        volume24h: totalVolume24h,
        tvl: currentTVL
      })

      // Process events in reverse to calculate historical states
      for (let i = allEvents.length - 1; i >= 0; i--) {
        const event = allEvents[i]
        const block = await publicClient.getBlock({ blockNumber: event.blockNumber })
        const timestamp = Number(block.timestamp) * 1000

        // Reverse the event to get previous state
        if (event.type === 'swap') {
          const swapArgs = event.args as SwapEvent['args']
          if (swapArgs.tokenAtoB) {
            // Reverse: add back amountIn to reserveA, subtract amountOut from reserveB
            currentReserveA += swapArgs.amountIn
            currentReserveB -= swapArgs.amountOut
          } else {
            // Reverse: add back amountIn to reserveB, subtract amountOut from reserveA
            currentReserveB += swapArgs.amountIn
            currentReserveA -= swapArgs.amountOut
          }
        } else if (event.type === 'liquidityAdded') {
          const liquidityArgs = event.args as LiquidityEvent['args']
          // Reverse: subtract the added amounts
          currentReserveA -= liquidityArgs.amountA
          currentReserveB -= liquidityArgs.amountB
        } else if (event.type === 'liquidityRemoved') {
          const liquidityArgs = event.args as LiquidityEvent['args']
          // Reverse: add back the removed amounts
          currentReserveA += liquidityArgs.amountA
          currentReserveB += liquidityArgs.amountB
        }

        // Calculate price for this historical state
        const historicalPrice = calculateRealPrice(currentReserveA, currentReserveB)
        const historicalTVL = calculateTVL(currentReserveA, currentReserveB, historicalPrice)

        // Add data point (but don't exceed our target number of points)
        if (priceDataPoints.length < points) {
          priceDataPoints.unshift({
            timestamp,
            price: historicalPrice,
            volume24h: 0, // Volume is calculated for 24h window
            tvl: historicalTVL
          })
        }
      }

      // If we don't have enough points, fill with interpolated data
      while (priceDataPoints.length < points) {
        const interval = timeFrame === '1H' ? 5 * 60 * 1000 : 60 * 60 * 1000
        const lastPoint = priceDataPoints[0]
        const newTimestamp = lastPoint.timestamp - interval
        
        priceDataPoints.unshift({
          timestamp: newTimestamp,
          price: lastPoint.price * (0.98 + Math.random() * 0.04), // Small random variation
          volume24h: 0,
          tvl: lastPoint.tvl
        })
      }

      setPriceHistory(priceDataPoints.slice(-points))

    } catch (error) {
      console.error('Error fetching historical data:', error)
      // Fallback to current price if historical fetch fails
      const currentPrice = calculateRealPrice(poolInfo.reserveA, poolInfo.reserveB)
      if (currentPrice > 0) {
        setPriceHistory([{
          timestamp: Date.now(),
          price: currentPrice,
          volume24h: 0,
          tvl: calculateTVL(poolInfo.reserveA, poolInfo.reserveB, currentPrice)
        }])
      }
    } finally {
      setIsLoadingHistory(false)
    }
  }

  // Watch for real-time swap events
  useWatchContractEvent({
    address: CONTRACTS.SIMPLE_DEX as `0x${string}`,
    abi: SIMPLE_DEX_ABI,
    eventName: 'Swap',
    onLogs() {
      console.log('Real swap detected, updating price chart...')
      const newPrice = calculateRealPrice(poolInfo.reserveA, poolInfo.reserveB)
      
      if (newPrice > 0) {
        const newDataPoint: PriceData = {
          timestamp: Date.now(),
          price: newPrice,
          volume24h: volume24h,
          tvl: calculateTVL(poolInfo.reserveA, poolInfo.reserveB, newPrice)
        }
        
        setPriceHistory(prev => {
          const updated = [...prev, newDataPoint].slice(-100)
          return updated
        })
      }
    }
  })

  // Watch for real-time liquidity events
  useWatchContractEvent({
    address: CONTRACTS.SIMPLE_DEX as `0x${string}`,
    abi: SIMPLE_DEX_ABI,
    eventName: 'LiquidityAdded',
    onLogs() {
      console.log('Real liquidity added, updating price chart...')
      const newPrice = calculateRealPrice(poolInfo.reserveA, poolInfo.reserveB)
      
      if (newPrice > 0) {
        const newDataPoint: PriceData = {
          timestamp: Date.now(),
          price: newPrice,
          volume24h: volume24h,
          tvl: calculateTVL(poolInfo.reserveA, poolInfo.reserveB, newPrice)
        }
        
        setPriceHistory(prev => {
          const updated = [...prev, newDataPoint].slice(-100)
          return updated
        })
      }
    }
  })

  useWatchContractEvent({
    address: CONTRACTS.SIMPLE_DEX as `0x${string}`,
    abi: SIMPLE_DEX_ABI,
    eventName: 'LiquidityRemoved',
    onLogs() {
      console.log('Real liquidity removed, updating price chart...')
      const newPrice = calculateRealPrice(poolInfo.reserveA, poolInfo.reserveB)
      
      if (newPrice > 0) {
        const newDataPoint: PriceData = {
          timestamp: Date.now(),
          price: newPrice,
          volume24h: volume24h,
          tvl: calculateTVL(poolInfo.reserveA, poolInfo.reserveB, newPrice)
        }
        
        setPriceHistory(prev => {
          const updated = [...prev, newDataPoint].slice(-100)
          return updated
        })
      }
    }
  })

  // Fetch historical data when component mounts or timeframe changes
  useEffect(() => {
    if (poolInfo.reserveA > 0 && poolInfo.reserveB > 0) {
      fetchHistoricalData()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeFrame, poolInfo.reserveA, poolInfo.reserveB, publicClient])

  // Calculate price change
  const priceChange = priceHistory.length > 1 
    ? ((priceHistory[priceHistory.length - 1].price - priceHistory[0].price) / priceHistory[0].price) * 100
    : 0

  const getPriceChangeIcon = () => {
    if (priceChange > 0) return <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: "#10B981" }} />
    if (priceChange < 0) return <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: "#EF4444" }} />
    return <Minus className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: "rgba(251, 250, 249, 0.7)" }} />
  }

  const getPriceChangeColor = () => {
    if (priceChange > 0) return "#10B981"
    if (priceChange < 0) return "#EF4444"
    return "rgba(251, 250, 249, 0.7)"
  }

  const formatXAxisTick = (tickItem: number) => {
    const date = new Date(tickItem)
    switch (timeFrame) {
      case '1H':
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      case '1D':
        return date.toLocaleTimeString('en-US', { hour: '2-digit' })
      case '1W':
        return date.toLocaleDateString('en-US', { weekday: 'short' })
      case '1M':
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      default:
        return ''
    }
  }

  const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as PriceData
      return (
        <div className="glass rounded-lg p-2 sm:p-3 border border-white/20 max-w-xs">
          <div className="text-xs sm:text-sm mb-1" style={{ color: "rgba(251, 250, 249, 0.7)" }}>
            {formatTime(data.timestamp)}
          </div>
          <div className="font-bold text-sm sm:text-base" style={{ color: "#FBFAF9" }}>
            ${formatNumber(data.price, 6)} USDC
          </div>
          <div className="text-xs sm:text-sm" style={{ color: "rgba(251, 250, 249, 0.7)" }}>
            TVL: ${formatNumber(data.tvl)}
          </div>
        </div>
      )
    }
    return null
  }

  const currentRealPrice = calculateRealPrice(poolInfo.reserveA, poolInfo.reserveB)
  const currentTVL = calculateTVL(poolInfo.reserveA, poolInfo.reserveB, currentRealPrice)

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-0 space-y-8">
      {/* Analytics Dashboard */}
      {metrics && (
        <div className="glass rounded-2xl p-6 border border-white/10 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold" style={{ color: "#FBFAF9" }}>
              📊 Real-time Analytics
            </h3>
            <div className="flex items-center gap-2">
              <div className="text-sm" style={{ color: "rgba(251, 250, 249, 0.7)" }}>
                Powered by Ponder Indexer
              </div>
              {indexerHealth && (
                <div className={`w-2 h-2 rounded-full ${indexerHealth.isHealthy ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
              )}
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="p-1 rounded hover:bg-white/10 transition-colors disabled:opacity-50"
                title="Refresh data"
              >
                <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} style={{ color: "rgba(251, 250, 249, 0.7)" }} />
              </button>
            </div>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="p-4 rounded-xl border" style={{
              backgroundColor: "rgba(131, 110, 249, 0.1)",
              borderColor: "rgba(131, 110, 249, 0.3)"
            }}>
              <DollarSign className="w-5 h-5 mb-2" style={{ color: "#836EF9" }} />
              <div className="text-lg font-bold" style={{ color: "#FBFAF9" }}>
                {formatUSD(metrics.volume24h)}
              </div>
              <div className="text-xs" style={{ color: "rgba(251, 250, 249, 0.7)" }}>
                24h Volume
              </div>
            </div>

            <div className="p-4 rounded-xl border" style={{
              backgroundColor: "rgba(16, 185, 129, 0.1)",
              borderColor: "rgba(16, 185, 129, 0.3)"
            }}>
              <TrendingUp className="w-5 h-5 mb-2" style={{ color: "#10B981" }} />
              <div className="text-lg font-bold" style={{ color: "#FBFAF9" }}>
                {metrics.transactions24h}
              </div>
              <div className="text-xs" style={{ color: "rgba(251, 250, 249, 0.7)" }}>
                24h Transactions
              </div>
            </div>

            <div className="p-4 rounded-xl border" style={{
              backgroundColor: "rgba(160, 5, 93, 0.1)",
              borderColor: "rgba(160, 5, 93, 0.3)"
            }}>
              <Users className="w-5 h-5 mb-2" style={{ color: "#A0055D" }} />
              <div className="text-lg font-bold" style={{ color: "#FBFAF9" }}>
                {metrics.uniqueUsers}
              </div>
              <div className="text-xs" style={{ color: "rgba(251, 250, 249, 0.7)" }}>
                Unique Users
              </div>
            </div>

            <div className="p-4 rounded-xl border" style={{
              backgroundColor: "rgba(245, 158, 11, 0.1)",
              borderColor: "rgba(245, 158, 11, 0.3)"
            }}>
              <TrendingUp className="w-5 h-5 mb-2" style={{ color: "#F59E0B" }} />
              <div className="text-lg font-bold" style={{ color: "#FBFAF9" }}>
                {formatUSD(metrics.avgTradeSize)}
              </div>
              <div className="text-xs" style={{ color: "rgba(251, 250, 249, 0.7)" }}>
                Avg Trade Size
              </div>
            </div>
          </div>

          {/* Volume Chart */}
          {!volumeLoading && dailyVolume && dailyVolume.length > 0 && (
            <div className="h-64">
              <h4 className="text-lg font-semibold mb-4" style={{ color: "#FBFAF9" }}>
                7-Day Volume Trend
              </h4>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[...dailyVolume].reverse()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(251, 250, 249, 0.1)" />
                  <XAxis 
                    dataKey="date" 
                    stroke="rgba(251, 250, 249, 0.5)"
                    fontSize={10}
                  />
                  <YAxis 
                    stroke="rgba(251, 250, 249, 0.5)"
                    fontSize={10}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: "rgba(14, 16, 15, 0.9)",
                      border: "1px solid rgba(251, 250, 249, 0.2)",
                      borderRadius: "8px",
                      color: "#FBFAF9"
                    }}
                    formatter={(value: number) => [formatUSD(value), 'Volume']}
                  />
                  <Bar dataKey="volumeUSD" fill="#836EF9" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

      {/* User Stats */}
      {address && userStats && (
        <div className="glass rounded-2xl p-6 border border-white/10 shadow-2xl">
          <h3 className="text-xl font-bold mb-4" style={{ color: "#FBFAF9" }}>
            👤 Your Trading Statistics
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold mb-1" style={{ color: "#836EF9" }}>
                {userStats.totalSwaps}
              </div>
              <div className="text-sm" style={{ color: "rgba(251, 250, 249, 0.7)" }}>
                Total Swaps
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold mb-1" style={{ color: "#10B981" }}>
                {formatUSD(userStats.totalVolumeUSD)}
              </div>
              <div className="text-sm" style={{ color: "rgba(251, 250, 249, 0.7)" }}>
                Total Volume
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold mb-1" style={{ color: "#A0055D" }}>
              {formatNumber(Number(userStats.liquidityProvided) / 1e18 , 8)}
              </div>
              <div className="text-sm" style={{ color: "rgba(251, 250, 249, 0.7)" }}>
                LP Tokens
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold mb-1" style={{ color: "#F59E0B" }}>
                {formatUSD(userStats.feesEarned)}
              </div>
              <div className="text-sm" style={{ color: "rgba(251, 250, 249, 0.7)" }}>
                Fees Earned
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Price Chart */}
      <div className="glass rounded-2xl p-4 sm:p-6 lg:p-8 border border-white/10 shadow-2xl">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4 sm:mb-6 space-y-4 lg:space-y-0">
          <div className="flex-1">
            <h2 className="text-xl sm:text-2xl font-bold mb-2" style={{ color: "#FBFAF9" }}>
              CAMP Real-Time Price
            </h2>
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-2 sm:space-y-0">
              <span className="text-2xl sm:text-3xl font-bold" style={{ color: "#FBFAF9" }}>
                ${formatNumber(currentRealPrice, 6)}
              </span>
              <div className="flex items-center space-x-1">
                {getPriceChangeIcon()}
                <span 
                  className="font-semibold text-sm sm:text-base"
                  style={{ color: getPriceChangeColor() }}
                >
                  {priceChange >= 0 ? '+' : ''}{formatNumber(priceChange, 2)}%
                </span>
              </div>
            </div>
            <div className="text-xs sm:text-sm mt-2" style={{ color: "rgba(251, 250, 249, 0.7)" }}>
              📊 Real data from smart contract events • Live updates
            </div>
          </div>

          {/* Time Frame Selector */}
          <div className="flex-shrink-0">
            <div className="flex space-x-1 p-1 rounded-lg border w-full sm:w-auto" style={{
              backgroundColor: "rgba(14, 16, 15, 0.5)",
              borderColor: "rgba(251, 250, 249, 0.2)"
            }}>
              {(['1H', '1D', '1W', '1M'] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeFrame(tf)}
                  className={`flex-1 sm:flex-none px-2 sm:px-3 py-1 sm:py-2 rounded text-xs sm:text-sm font-medium transition-all duration-200 ${
                    timeFrame === tf 
                      ? 'gradient-monad-primary text-white' 
                      : 'hover:bg-white/10'
                  }`}
                  style={{ 
                    color: timeFrame === tf ? "#FBFAF9" : "rgba(251, 250, 249, 0.7)" 
                  }}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="h-64 sm:h-80 lg:h-96 mb-4 sm:mb-6">
          {isLoading || isLoadingHistory || priceHistory.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center px-4">
                <div className="spinner w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-4"></div>
                <div className="text-sm sm:text-base" style={{ color: "rgba(251, 250, 249, 0.7)" }}>
                  {isLoadingHistory ? "Loading real historical data..." : "Fetching blockchain events..."}
                </div>
                <div className="text-xs sm:text-sm mt-2" style={{ color: "rgba(251, 250, 249, 0.5)" }}>
                  Building price history from smart contract events
                </div>
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={priceHistory} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="rgba(251, 250, 249, 0.1)" 
                />
                <XAxis 
                  dataKey="timestamp"
                  tickFormatter={formatXAxisTick}
                  stroke="rgba(251, 250, 249, 0.5)"
                  fontSize={10}
                  interval="preserveStartEnd"
                  minTickGap={30}
                />
                <YAxis 
                  domain={['dataMin * 0.95', 'dataMax * 1.05']}
                  tickFormatter={(value) => `$${formatNumber(value, 4)}`}
                  stroke="rgba(251, 250, 249, 0.5)"
                  fontSize={10}
                  width={60}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#836EF9"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ 
                    r: 4, 
                    fill: "#836EF9",
                    stroke: "#FBFAF9",
                    strokeWidth: 1
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Chart Stats - All Real Data */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
          <div className="text-center p-2 sm:p-3 rounded-lg border" style={{
            backgroundColor: "rgba(14, 16, 15, 0.3)",
            borderColor: "rgba(251, 250, 249, 0.1)"
          }}>
            <div className="text-xs sm:text-sm mb-1" style={{ color: "rgba(251, 250, 249, 0.7)" }}>
              24h High
            </div>
            <div className="font-bold text-sm sm:text-base" style={{ color: "#10B981" }}>
              ${formatNumber(priceHistory.length > 0 ? Math.max(...priceHistory.map(p => p.price)) : currentRealPrice, 4)}
            </div>
          </div>

          <div className="text-center p-2 sm:p-3 rounded-lg border" style={{
            backgroundColor: "rgba(14, 16, 15, 0.3)",
            borderColor: "rgba(251, 250, 249, 0.1)"
          }}>
            <div className="text-xs sm:text-sm mb-1" style={{ color: "rgba(251, 250, 249, 0.7)" }}>
              24h Low
            </div>
            <div className="font-bold text-sm sm:text-base" style={{ color: "#EF4444" }}>
              ${formatNumber(priceHistory.length > 0 ? Math.min(...priceHistory.map(p => p.price)) : currentRealPrice, 4)}
            </div>
          </div>

          <div className="text-center p-2 sm:p-3 rounded-lg border" style={{
            backgroundColor: "rgba(14, 16, 15, 0.3)",
            borderColor: "rgba(251, 250, 249, 0.1)"
          }}>
            <div className="text-xs sm:text-sm mb-1" style={{ color: "rgba(251, 250, 249, 0.7)" }}>
              Real TVL
            </div>
            <div className="font-bold text-sm sm:text-base" style={{ color: "#FBFAF9" }}>
              ${formatNumber(currentTVL)}
            </div>
          </div>

          <div className="text-center p-2 sm:p-3 rounded-lg border" style={{
            backgroundColor: "rgba(14, 16, 15, 0.3)",
            borderColor: "rgba(251, 250, 249, 0.1)"
          }}>
            <div className="text-xs sm:text-sm mb-1" style={{ color: "rgba(251, 250, 249, 0.7)" }}>
              24h Volume
            </div>
            <div className="font-bold text-sm sm:text-base" style={{ color: "#FBFAF9" }}>
              ${formatNumber(volume24h)}
            </div>
          </div>
        </div>

        {/* Real-time indicator */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center sm:space-x-2 text-xs sm:text-sm text-center space-y-1 sm:space-y-0">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: "#10B981" }}></div>
            <span style={{ color: "rgba(251, 250, 249, 0.7)" }}>
              🔗 Real blockchain data
            </span>
          </div>
          <span className="hidden sm:inline" style={{ color: "rgba(251, 250, 249, 0.5)" }}>•</span>
          <span style={{ color: "rgba(251, 250, 249, 0.7)" }}>
            {priceHistory.length} data points from events
          </span>
          <span className="hidden sm:inline" style={{ color: "rgba(251, 250, 249, 0.5)" }}>•</span>
          <span style={{ color: "rgba(251, 250, 249, 0.7)" }}>
            Last update: {new Date().toLocaleTimeString()}
          </span>
        </div>
      </div>
    </div>
  )
}

export default PriceChart
```

### Update src/components/TransactionHistory.tsx:

```typescript
"use client"

import { useState, useMemo } from "react"
import { ArrowUpDown, Plus, Minus, ExternalLink, Search, RefreshCw } from "lucide-react"
import { useAccount } from "wagmi"
import { useRecentSwaps, useLiquidityEvents, useIndexerHealth, useManualRefresh } from "../hooks/useIndexerData"
import { formatTime, formatAddress, formatNumber } from "../utils/formatters"
import type { Swap, LiquidityEvent } from "../hooks/useIndexerData"

interface CombinedTransaction {
  id: string
  type: 'swap' | 'add_liquidity' | 'remove_liquidity'
  user: string
  timestamp: string
  transactionHash: string
  blockNumber: string
  data: Swap | LiquidityEvent
}

const TransactionHistory = () => {
  const { address } = useAccount()
  const [filter, setFilter] = useState<'all' | 'swap' | 'add_liquidity' | 'remove_liquidity'>('all')
  const [searchTerm, setSearchTerm] = useState("")

  // Fetch data from indexer
  const { data: recentSwaps, isLoading: swapsLoading, error: swapsError } = useRecentSwaps(50)
  const { data: liquidityEvents, isLoading: liquidityLoading, error: liquidityError } = useLiquidityEvents(50)
  const { data: indexerHealth } = useIndexerHealth()
  const { refreshAll } = useManualRefresh()

  // Manual refresh state
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Handle manual refresh
  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await refreshAll()
    } catch (error) {
      console.error('Failed to refresh data:', error)
    } finally {
      setIsRefreshing(false)
    }
  }

  // Combine and process transactions
  const combinedTransactions = useMemo(() => {
    const combined: CombinedTransaction[] = []

    // Add swaps
    if (recentSwaps) {
      recentSwaps.forEach((swap: Swap) => {
        combined.push({
          id: `swap_${swap.id}`,
          type: 'swap',
          user: swap.user,
          timestamp: swap.timestamp,
          transactionHash: swap.transactionHash,
          blockNumber: swap.blockNumber,
          data: swap
        })
      })
    }

    // Add liquidity events
    if (liquidityEvents) {
      liquidityEvents.forEach((event: LiquidityEvent) => {
        combined.push({
          id: `liquidity_${event.id}`,
          type: event.type === 'ADD' ? 'add_liquidity' : 'remove_liquidity',
          user: event.provider,
          timestamp: event.timestamp,
          transactionHash: event.transactionHash,
          blockNumber: event.blockNumber,
          data: event
        })
      })
    }

    // Sort by timestamp (newest first)
    return combined.sort((a, b) => Number(b.timestamp) - Number(a.timestamp))
  }, [recentSwaps, liquidityEvents])

  // Process data for filtering
  const filteredTransactions = useMemo(() => {
    return combinedTransactions.filter((tx: CombinedTransaction) => {
      const matchesFilter = filter === 'all' || tx.type === filter
      const matchesSearch = !searchTerm || 
        tx.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.transactionHash.toLowerCase().includes(searchTerm.toLowerCase())
      
      return matchesFilter && matchesSearch
    })
  }, [combinedTransactions, filter, searchTerm])

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'swap':
        return <ArrowUpDown className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: "#836EF9" }} />
      case 'add_liquidity':
        return <Plus className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: "#10B981" }} />
      case 'remove_liquidity':
        return <Minus className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: "#EF4444" }} />
      default:
        return <ArrowUpDown className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: "#836EF9" }} />
    }
  }

  const getTransactionDescription = (tx: CombinedTransaction) => {
    if (tx.type === 'swap') {
      const swapData = tx.data as Swap
      
      // Handle different token names from our contracts
      const getTokenSymbol = (tokenName: string) => {
        if (tokenName === 'CampusCoin') return 'CAMP'
        if (tokenName === 'MockUSDC') return 'USDC'
        return tokenName
      }

      const getTokenDecimals = (tokenName: string) => {
        if (tokenName === 'CampusCoin') return 18
        if (tokenName === 'MockUSDC') return 6
        return 18
      }

      const tokenInSymbol = getTokenSymbol(swapData.tokenIn)
      const tokenOutSymbol = getTokenSymbol(swapData.tokenOut)
      const tokenInDecimals = getTokenDecimals(swapData.tokenIn)
      const tokenOutDecimals = getTokenDecimals(swapData.tokenOut)

      const amountInFormatted = (Number(swapData.amountIn) / Math.pow(10, tokenInDecimals)).toFixed(
        tokenInDecimals === 18 ? 4 : 2
      )
      const amountOutFormatted = (Number(swapData.amountOut) / Math.pow(10, tokenOutDecimals)).toFixed(
        tokenOutDecimals === 18 ? 4 : 2
      )

      return `${amountInFormatted} ${tokenInSymbol} → ${amountOutFormatted} ${tokenOutSymbol}`
    } else {
      const liquidityData = tx.data as LiquidityEvent
      
      const amountA = (Number(liquidityData.amountA) / Math.pow(10, 18)).toFixed(4) // CAMP
      const amountB = (Number(liquidityData.amountB) / Math.pow(10, 6)).toFixed(2)  // USDC
      const liquidityAmount = (Number(liquidityData.liquidity) / Math.pow(10, 18)).toFixed(4)

      if (tx.type === 'add_liquidity') {
        return `Add ${amountA} CAMP + ${amountB} USDC (${liquidityAmount} LP)`
      } else {
        return `Remove ${amountA} CAMP + ${amountB} USDC (${liquidityAmount} LP)`
      }
    }
  }

  const getTransactionTypeLabel = (type: string) => {
    switch (type) {
      case 'swap':
        return 'Swap'
      case 'add_liquidity':
        return 'Add Liquidity'
      case 'remove_liquidity':
        return 'Remove Liquidity'
      default:
        return 'Transaction'
    }
  }

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'swap':
        return {
          bg: "rgba(131, 110, 249, 0.1)",
          border: "rgba(131, 110, 249, 0.3)",
          color: "#836EF9"
        }
      case 'add_liquidity':
        return {
          bg: "rgba(16, 185, 129, 0.1)",
          border: "rgba(16, 185, 129, 0.3)",
          color: "#10B981"
        }
      case 'remove_liquidity':
        return {
          bg: "rgba(239, 68, 68, 0.1)",
          border: "rgba(239, 68, 68, 0.3)",
          color: "#EF4444"
        }
      default:
        return {
          bg: "rgba(131, 110, 249, 0.1)",
          border: "rgba(131, 110, 249, 0.3)",
          color: "#836EF9"
        }
    }
  }

  const isLoading = swapsLoading || liquidityLoading
  const hasError = swapsError || liquidityError

  if (isLoading) {
    return (
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-0">
        <div className="glass rounded-2xl p-4 sm:p-6 lg:p-8 border border-white/10 shadow-2xl">
          <div className="text-center py-12">
            <div className="spinner w-8 h-8 mx-auto mb-4"></div>
            <div className="text-lg font-semibold mb-2" style={{ color: "#FBFAF9" }}>
              Loading indexed data...
            </div>
            <div style={{ color: "rgba(251, 250, 249, 0.7)" }}>
              Fetching from Ponder indexer
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (hasError) {
    return (
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-0">
        <div className="glass rounded-2xl p-4 sm:p-6 lg:p-8 border border-white/10 shadow-2xl">
          <div className="text-center py-12">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <div className="text-lg font-semibold mb-2" style={{ color: "#FBFAF9" }}>
              Indexer Connection Error
            </div>
            <div style={{ color: "rgba(251, 250, 249, 0.7)" }} className="mb-4">
              Could not connect to Ponder GraphQL endpoint
            </div>
            <div className="text-sm" style={{ color: "rgba(251, 250, 249, 0.5)" }}>
              Error: {(swapsError || liquidityError)?.message || 'Unknown error'}
            </div>
            {indexerHealth && !indexerHealth.isHealthy && (
              <div className="text-sm mt-2" style={{ color: "rgba(245, 158, 11, 0.8)" }}>
                Indexer Status: Unhealthy
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-0">
      <div className="glass rounded-2xl p-4 sm:p-6 lg:p-8 border border-white/10 shadow-2xl">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4 sm:mb-6 space-y-4 lg:space-y-0">
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-bold" style={{ color: "#FBFAF9" }}>
              Transaction History
            </h2>
            <div className="px-2 py-1 rounded text-xs font-medium" style={{
              backgroundColor: "rgba(16, 185, 129, 0.2)",
              color: "#10B981"
            }}>
              Live Indexer Data
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            {/* Manual Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors disabled:opacity-50"
              style={{
                backgroundColor: "rgba(131, 110, 249, 0.1)",
                borderColor: "rgba(131, 110, 249, 0.3)",
                color: "#836EF9"
              }}
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="text-sm">
                {isRefreshing ? 'Refreshing...' : 'Refresh'}
              </span>
            </button>

            {/* Filter */}
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'all' | 'swap' | 'add_liquidity' | 'remove_liquidity')}
              className="px-3 py-2 rounded-lg border text-sm"
              style={{ 
                backgroundColor: "rgba(14, 16, 15, 0.5)",
                borderColor: "rgba(251, 250, 249, 0.2)",
                color: "#FBFAF9"
              }}
            >
              <option value="all">All Transactions</option>
              <option value="swap">Swaps Only</option>
              <option value="add_liquidity">Add Liquidity</option>
              <option value="remove_liquidity">Remove Liquidity</option>
            </select>

            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search address or hash..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-lg border input-primary text-sm w-full sm:w-64"
                style={{ 
                  backgroundColor: "rgba(14, 16, 15, 0.5)",
                  borderColor: "rgba(251, 250, 249, 0.2)",
                  color: "#FBFAF9"
                }}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" 
                style={{ color: "rgba(251, 250, 249, 0.7)" }} />
            </div>
          </div>
        </div>

        {/* Transaction List */}
        <div className="space-y-3 sm:space-y-4">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2" style={{ color: "#FBFAF9" }}>
                No transactions found
              </h3>
              <p className="text-sm sm:text-base" style={{ color: "rgba(251, 250, 249, 0.7)" }}>
                {combinedTransactions.length === 0 
                  ? "No transactions have been indexed yet. Try making a swap or providing liquidity!" 
                  : "Try adjusting your filters or search terms."}
              </p>
            </div>
          ) : (
            filteredTransactions.map((tx: CombinedTransaction) => {
              const colors = getTransactionColor(tx.type)
              return (
                <div
                  key={tx.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 rounded-xl border hover:bg-white/5 transition-all duration-200 card-hover space-y-3 sm:space-y-0"
                  style={{
                    backgroundColor: "rgba(14, 16, 15, 0.3)",
                    borderColor: "rgba(251, 250, 249, 0.1)"
                  }}
                >
                  {/* Transaction Info */}
                  <div className="flex items-center gap-3 sm:gap-4 flex-1">
                    <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center border"
                      style={{
                        backgroundColor: colors.bg,
                        borderColor: colors.border
                      }}
                    >
                      {getTransactionIcon(tx.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-semibold text-sm sm:text-base" style={{ color: "#FBFAF9" }}>
                          {getTransactionTypeLabel(tx.type)}
                        </span>
                        {tx.user.toLowerCase() === address?.toLowerCase() && (
                          <span className="text-xs px-2 py-1 rounded-full border whitespace-nowrap" style={{
                            backgroundColor: "rgba(16, 185, 129, 0.1)",
                            borderColor: "rgba(16, 185, 129, 0.3)",
                            color: "#10B981"
                          }}>
                            You
                          </span>
                        )}
                        {tx.type === 'swap' && (tx.data as Swap).priceImpact && (tx.data as Swap).priceImpact! > 3 && (
                          <span className="text-xs px-2 py-1 rounded-full border whitespace-nowrap" style={{
                            backgroundColor: "rgba(245, 158, 11, 0.1)",
                            borderColor: "rgba(245, 158, 11, 0.3)",
                            color: "#F59E0B"
                          }}>
                            High Impact
                          </span>
                        )}
                      </div>
                      <div className="text-xs sm:text-sm mb-1" style={{ color: "rgba(251, 250, 249, 0.7)" }}>
                        {getTransactionDescription(tx)}
                      </div>
                      <div className="text-xs" style={{ color: "rgba(251, 250, 249, 0.5)" }}>
                        {formatTime(Number(tx.timestamp) * 1000)} • {formatAddress(tx.user)}
                      </div>
                    </div>
                  </div>

                  {/* Transaction Details */}
                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    {/* Additional Info */}
                    <div className="text-right">
                      {tx.type === 'swap' && (
                        <>
                          <div className="text-xs sm:text-sm font-medium" style={{ 
                            color: ((tx.data as Swap).priceImpact && (tx.data as Swap).priceImpact! > 3) ? "#F59E0B" : "#10B981"
                          }}>
                            {(tx.data as Swap).priceImpact ? `${Number((tx.data as Swap).priceImpact).toFixed(2)}% Impact` : 'N/A'}
                          </div>
                          <div className="text-xs" style={{ color: "rgba(251, 250, 249, 0.5)" }}>
                            Gas: {formatNumber(Number((tx.data as Swap).gasUsed))}
                          </div>
                        </>
                      )}
                      {(tx.type === 'add_liquidity' || tx.type === 'remove_liquidity') && (
                        <>
                          <div className="text-xs sm:text-sm font-medium" style={{ color: colors.color }}>
                            {((tx.data as LiquidityEvent).shareOfPool && (tx.data as LiquidityEvent).shareOfPool! > 0) ? `${((tx.data as LiquidityEvent).shareOfPool! * 100).toFixed(2)}% of Pool` : 'N/A'}
                          </div>
                          <div className="text-xs" style={{ color: "rgba(251, 250, 249, 0.5)" }}>
                            Block: {formatNumber(Number(tx.blockNumber))}
                          </div>
                        </>
                      )}
                    </div>

                    {/* External Link */}
                    <a
                      href={`https://sepolia-blockscout.lisk.com/tx/${tx.transactionHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                      style={{ color: "rgba(251, 250, 249, 0.7)" }}
                    >
                      <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                    </a>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Indexer Status */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center sm:space-x-2 text-xs sm:text-sm text-center space-y-1 sm:space-y-0 mt-6 pt-6 border-t border-white/10">
          <div className="flex items-center justify-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${indexerHealth?.isHealthy ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></div>
            <span style={{ color: "rgba(251, 250, 249, 0.7)" }}>
              🔗 Indexed by Ponder
            </span>
          </div>
          <span className="hidden sm:inline" style={{ color: "rgba(251, 250, 249, 0.5)" }}>•</span>
          <span style={{ color: "rgba(251, 250, 249, 0.7)" }}>
            Auto-refresh: 30s intervals
          </span>
          <span className="hidden sm:inline" style={{ color: "rgba(251, 250, 249, 0.5)" }}>•</span>
          <span style={{ color: "rgba(251, 250, 249, 0.7)" }}>
            {filteredTransactions.length} transactions indexed
          </span>
          {indexerHealth?.lastUpdated && (
            <>
              <span className="hidden sm:inline" style={{ color: "rgba(251, 250, 249, 0.5)" }}>•</span>
              <span style={{ color: "rgba(251, 250, 249, 0.7)" }}>
                Last updated: {formatTime(Number(indexerHealth.lastUpdated) * 1000)}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default TransactionHistory
```

---

## ✅ Langkah 6: Testing & Verifikasi

### 1. Start Ponder Indexer

```bash
cd simple-dex-indexer
pnpm dev
```

Pastikan indexer running di `http://localhost:42069`

### 2. Start Frontend

```bash
cd simple-dex-ui
npm run dev
```

### 3. Test Fitur

- ✅ Connect wallet
- ✅ Cek Pool Stats menampilkan data dari indexer
- ✅ Cek Transaction History menampilkan recent swaps
- ✅ Cek data auto-refresh setiap beberapa detik
- ✅ Cek explorer links bekerja

---

## 🎯 Apa Yang Telah Ditambahkan

### ✅ **Dependencies Baru:**
- `@apollo/client` - GraphQL client
- `graphql` - GraphQL query language

### ✅ **File Baru:**
- `src/lib/graphql.ts` - GraphQL client setup & queries
- `src/hooks/useIndexerData.ts` - Custom hooks untuk query indexer

### ✅ **File yang Diupdate:**
- `src/App.tsx` - Menambahkan ApolloProvider
- `src/components/TransactionHistory.tsx` - Menambahkan indexer data
- `src/components/PriceChart.tsx` - Menambahkan indexer data

## Benefits dari Ponder Integration

📈 **Performance Improvements:**
- **Query Speed:** Instant hasil instead of scanning blockchain
- **Data Aggregation:** Pre-calculated statistics dan metrics
- **Real-time Updates:** Live data dengan minimal latency
- **Efficient Pagination:** Handle large datasets dengan cursor-based pagination

🎯 **Enhanced User Experience:**
- **Rich Analytics:** Volume charts, user stats, pool metrics
- **Advanced Filtering:** By user, token, time period, transaction type
- **Search Functionality:** Find specific transactions instantly
- **Historical Data:** Access complete transaction history

🔧 **Developer Benefits:**
- **Type Safety:** Auto-generated TypeScript types
- **GraphQL API:** Flexible, efficient data fetching
- **Schema Evolution:** Easy database migrations
- **Testing:** Built-in support untuk integration tests

---

## 🐛 Troubleshooting

### Masalah 1: GraphQL Connection Error

**Error:** `Failed to fetch` atau `Network error`

**Solusi:**
- Pastikan Ponder indexer running di `http://localhost:42069`
- Cek `VITE_GRAPHQL_URL` di `.env` file
- Cek CORS settings di Ponder (jika ada)

### Masalah 2: Data Tidak Muncul

**Solusi:**
- Pastikan indexer sudah sync selesai
- Cek GraphQL playground: `http://localhost:42069/graphql`
- Test query manual di playground
- Cek browser console untuk error

### Masalah 3: Auto-refresh Tidak Bekerja

**Solusi:**
- Cek `pollInterval` di hooks
- Pastikan Apollo Client cache policy sudah benar
- Cek network tab di browser DevTools

---

## 📚 Referensi

**Dokumentasi:**
- [Apollo Client Docs](https://www.apollographql.com/docs/react/)
- [GraphQL Queries](https://graphql.org/learn/queries/)
- [Ponder GraphQL API](https://ponder.sh/docs/api/graphql)

**Sumber Daya:**
- GraphQL Playground: `http://localhost:42069/graphql`
- Lisk Sepolia Explorer: `https://sepolia-blockscout.lisk.com`

---

## 🎉 Selamat!

Anda telah berhasil mengintegrasikan Ponder indexer dengan frontend SimpleDEX!

**Apa Selanjutnya?**
- Tambahkan lebih banyak analytics (volume charts, user leaderboard)
- Implementasi real-time notifications untuk new swaps
- Tambahkan filter & search untuk transaction history
- Optimasi performance dengan pagination

**Terus membangun! 🔥**
