# AI Prompt: Build IndonesiaPropertyToken - RWA Real Estate Tokenization Platform

## Overview

Build a complete Real World Asset (RWA) tokenization platform (dApp) on the Mantle Sepolia Testnet. The application allows verified investors to trade fractional ownership of Indonesian real estate properties with full KYC/AML compliance through blockchain technology.

---

## Project Requirements

### Tech Stack

| Category | Technology | Version |
|----------|------------|---------|
| Frontend Framework | React | 19.x |
| Language | TypeScript | 5.x |
| Build Tool | Vite | 6.x |
| Styling | Tailwind CSS | 4.x |
| Web3 Integration | Wagmi | 2.x |
| Blockchain Utils | Viem | 2.x |
| Wallet Connection | RainbowKit | 2.x |
| State Management | TanStack React Query | 5.x |
| Routing | React Router DOM | 7.x |
| Icons | Lucide React | latest |
| Notifications | React Hot Toast | 2.x |

### Initialize Project

```bash
npm create vite@latest property-token-ui -- --template react-ts
cd property-token-ui
npm install
```

### Install Dependencies

```bash
# Web3 dependencies
npm install wagmi viem @rainbow-me/rainbowkit @tanstack/react-query

# UI and routing
npm install react-router-dom lucide-react react-hot-toast

# Tailwind CSS v4
npm install tailwindcss @tailwindcss/vite
```

---

## Smart Contract Specification

### Network Details

- **Network**: Mantle Sepolia Testnet
- **Chain ID**: 5003
- **RPC URL**: https://rpc.sepolia.mantle.xyz
- **Block Explorer**: https://sepolia.mantlescan.xyz
- **Native Currency**: MNT (18 decimals)

### Deployed Contracts

| Contract | Address |
|----------|---------|
| KYCRegistry | `0xF84796da575F3aCB1b563951fF0C22CB039d607B` |
| IndonesiaPropertyToken | `0x9D4eA7e7Eb182C628bb202a1521Aa053868Cbeb6` |

### Property Token Parameters

| Parameter | Value |
|-----------|-------|
| Token Name | Sudirman Tower Token |
| Token Symbol | SDMN |
| Property Name | Apartemen Sudirman Tower |
| Location | Jakarta Selatan |
| Total Value (IDR) | 1,000,000,000 |
| Total Tokens | 1,000,000,000 |
| Decimals | 18 |
| Min Investment | 1 token |
| Max Investment | 1,000 tokens |

### KYC Level Enum

```solidity
enum KYCLevel {
    NONE,           // 0 - Belum KYC (blocked)
    BASIC,          // 1 - KYC dasar (KTP only)
    VERIFIED,       // 2 - KYC lengkap (KTP + NPWP)
    ACCREDITED      // 3 - Investor terakreditasi
}
```

### Investor Struct

```solidity
struct Investor {
    KYCLevel level;
    uint256 expiryDate;
    uint16 countryCode;     // 360 = Indonesia
    bool isActive;
}
```

### PropertyInfo Struct

```solidity
struct PropertyInfo {
    string propertyName;
    string location;
    uint256 totalValue;
    uint256 totalTokens;
    string legalDocument;   // IPFS hash
    bool isActive;
}
```

---

## Contract ABI Functions

### KYCRegistry - Read Functions

| Function | Parameters | Returns | Description |
|----------|------------|---------|-------------|
| `admin` | none | `address` | Get admin address |
| `totalInvestors` | none | `uint256` | Get total registered investors |
| `investors` | `address` | `Investor` | Get investor data |
| `isVerified` | `address` | `bool` | Check if investor is verified and active |
| `meetsLevel` | `address, KYCLevel` | `bool` | Check if investor meets minimum level |
| `getInvestor` | `address` | `(KYCLevel, uint256, uint16, bool)` | Get full investor details |

### KYCRegistry - Write Functions (Admin Only)

| Function | Parameters | Description |
|----------|------------|-------------|
| `registerInvestor` | `address, KYCLevel, uint16, uint256` | Register new investor with KYC level |
| `updateInvestor` | `address, KYCLevel` | Update investor KYC level |
| `revokeInvestor` | `address` | Revoke/blacklist investor |

### IndonesiaPropertyToken - Read Functions

| Function | Parameters | Returns | Description |
|----------|------------|---------|-------------|
| `name` | none | `string` | Token name |
| `symbol` | none | `string` | Token symbol |
| `decimals` | none | `uint8` | Token decimals (18) |
| `totalSupply` | none | `uint256` | Total token supply |
| `balanceOf` | `address` | `uint256` | Get token balance |
| `allowance` | `address, address` | `uint256` | Get spending allowance |
| `admin` | none | `address` | Get admin address |
| `kycRegistry` | none | `address` | Get KYC registry address |
| `property` | none | `PropertyInfo` | Get property information |
| `frozen` | `address` | `bool` | Check if account is frozen |
| `minInvestment` | none | `uint256` | Minimum investment limit |
| `maxInvestment` | none | `uint256` | Maximum investment limit |
| `getOwnershipPercent` | `address` | `uint256` | Get ownership percentage (basis points) |
| `getTokenValueIDR` | none | `uint256` | Get value per token in IDR |
| `canTransfer` | `address, address, uint256` | `(bool, string)` | Check if transfer is allowed |

### IndonesiaPropertyToken - Write Functions

| Function | Parameters | Admin Only | Description |
|----------|------------|------------|-------------|
| `transfer` | `address, uint256` | No | Transfer tokens (compliance checked) |
| `approve` | `address, uint256` | No | Approve spending allowance |
| `transferFrom` | `address, address, uint256` | No | Transfer from allowance |
| `freezeAccount` | `address, string` | Yes | Freeze account with reason |
| `unfreezeAccount` | `address` | Yes | Unfreeze account |
| `forceTransfer` | `address, address, uint256` | Yes | Force transfer (legal compliance) |
| `setLegalDocument` | `string` | Yes | Update IPFS document hash |
| `setInvestmentLimits` | `uint256, uint256` | Yes | Update min/max limits |

---

## Project Structure

Create the following folder structure:

```
src/
├── pages/
│   ├── Home.tsx
│   ├── Property.tsx
│   ├── Portfolio.tsx
│   ├── Transfer.tsx
│   ├── KYCStatus.tsx
│   └── Admin.tsx
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Layout.tsx
│   │
│   ├── property/
│   │   ├── PropertyCard.tsx
│   │   ├── PropertyDetails.tsx
│   │   ├── PropertyStats.tsx
│   │   └── OwnershipCard.tsx
│   │
│   ├── kyc/
│   │   ├── KYCBadge.tsx
│   │   ├── KYCStatusCard.tsx
│   │   └── InvestorList.tsx
│   │
│   ├── transfer/
│   │   ├── TransferForm.tsx
│   │   ├── TransferPreview.tsx
│   │   └── TransferHistory.tsx
│   │
│   ├── stats/
│   │   └── StatsCard.tsx
│   │
│   └── ui/
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Card.tsx
│       ├── Badge.tsx
│       ├── Spinner.tsx
│       ├── Modal.tsx
│       └── Alert.tsx
│
├── hooks/
│   ├── usePropertyToken.ts
│   ├── usePropertyTokenWrite.ts
│   ├── useKYCRegistry.ts
│   ├── useKYCRegistryWrite.ts
│   └── useAdmin.ts
│
├── config/
│   ├── chains.ts
│   ├── contracts.ts
│   └── wagmi.ts
│
├── lib/
│   ├── format.ts
│   └── utils.ts
│
├── types/
│   └── index.ts
│
├── App.tsx
├── main.tsx
└── index.css
```

---

## Implementation Details

### 1. Types (`src/types/index.ts`)

```typescript
export enum KYCLevel {
  NONE = 0,
  BASIC = 1,
  VERIFIED = 2,
  ACCREDITED = 3,
}

export const KYC_LEVEL_LABELS: Record<KYCLevel, string> = {
  [KYCLevel.NONE]: "Not Verified",
  [KYCLevel.BASIC]: "Basic (KTP)",
  [KYCLevel.VERIFIED]: "Verified (KTP + NPWP)",
  [KYCLevel.ACCREDITED]: "Accredited Investor",
};

export const KYC_LEVEL_COLORS: Record<KYCLevel, string> = {
  [KYCLevel.NONE]: "red",
  [KYCLevel.BASIC]: "yellow",
  [KYCLevel.VERIFIED]: "blue",
  [KYCLevel.ACCREDITED]: "green",
};

export interface Investor {
  level: KYCLevel;
  expiryDate: bigint;
  countryCode: number;
  isActive: boolean;
}

export interface PropertyInfo {
  propertyName: string;
  location: string;
  totalValue: bigint;
  totalTokens: bigint;
  legalDocument: string;
  isActive: boolean;
}

export interface TransferCheck {
  allowed: boolean;
  reason: string;
}
```

### 2. Chain Configuration (`src/config/chains.ts`)

Define Mantle Sepolia testnet with:
- Chain ID: 5003
- Name: "Mantle Sepolia Testnet"
- Native currency: MNT (18 decimals)
- RPC URL: https://rpc.sepolia.mantle.xyz
- Block explorer: https://sepolia.mantlescan.xyz

### 3. Contract Configuration (`src/config/contracts.ts`)

Export:
- `KYC_REGISTRY_ADDRESS`: `0xF84796da575F3aCB1b563951fF0C22CB039d607B`
- `PROPERTY_TOKEN_ADDRESS`: `0x9D4eA7e7Eb182C628bb202a1521Aa053868Cbeb6`
- `KYC_REGISTRY_ABI`: Full ABI array
- `PROPERTY_TOKEN_ABI`: Full ABI array

### 4. Wagmi Configuration (`src/config/wagmi.ts`)

Configure:
- RainbowKit with Mantle Sepolia chain
- WalletConnect projectId (user needs to provide)
- HTTP transport for RPC
- Query client for TanStack

### 5. Custom Hooks

#### `usePropertyToken.ts` - Token Read Hooks

| Hook | Purpose |
|------|---------|
| `useTokenName()` | Get token name |
| `useTokenSymbol()` | Get token symbol |
| `useTotalSupply()` | Get total supply |
| `useBalance(address)` | Get token balance |
| `usePropertyInfo()` | Get property details |
| `useOwnershipPercent(address)` | Get ownership % |
| `useTokenValueIDR()` | Get value per token |
| `useIsFrozen(address)` | Check if frozen |
| `useCanTransfer(from, to, amount)` | Pre-check transfer |
| `useInvestmentLimits()` | Get min/max limits |
| `useTokenAdmin()` | Get admin address |

#### `usePropertyTokenWrite.ts` - Token Write Hooks

| Hook | Purpose |
|------|---------|
| `useTransfer()` | Transfer tokens |
| `useApprove()` | Approve spender |
| `useTransferFrom()` | Transfer from allowance |
| `useFreezeAccount()` | Admin: freeze account |
| `useUnfreezeAccount()` | Admin: unfreeze |
| `useForceTransfer()` | Admin: force transfer |
| `useSetLegalDocument()` | Admin: update docs |
| `useSetInvestmentLimits()` | Admin: update limits |

#### `useKYCRegistry.ts` - KYC Read Hooks

| Hook | Purpose |
|------|---------|
| `useTotalInvestors()` | Get investor count |
| `useIsVerified(address)` | Check verification |
| `useInvestorData(address)` | Get investor details |
| `useMeetsLevel(address, level)` | Check KYC level |
| `useKYCAdmin()` | Get admin address |

#### `useKYCRegistryWrite.ts` - KYC Write Hooks

| Hook | Purpose |
|------|---------|
| `useRegisterInvestor()` | Register new investor |
| `useUpdateInvestor()` | Update KYC level |
| `useRevokeInvestor()` | Revoke investor |

#### `useAdmin.ts` - Admin Check

```typescript
export function useAdmin() {
  const { address } = useAccount();
  const { data: tokenAdmin } = useTokenAdmin();
  const { data: kycAdmin } = useKYCAdmin();

  const isTokenAdmin = address && tokenAdmin
    ? address.toLowerCase() === tokenAdmin.toLowerCase()
    : false;

  const isKYCAdmin = address && kycAdmin
    ? address.toLowerCase() === kycAdmin.toLowerCase()
    : false;

  const isAdmin = isTokenAdmin || isKYCAdmin;

  return { isAdmin, isTokenAdmin, isKYCAdmin };
}
```

### 6. Utility Functions (`src/lib/format.ts`)

| Function | Purpose |
|----------|---------|
| `formatTokens(value)` | Format bigint to "X.XX SDMN" |
| `formatIDR(value)` | Format to "Rp X.XXX.XXX" |
| `formatPercent(basisPoints)` | Format 10000 to "100%" |
| `formatDate(timestamp)` | Format Unix timestamp |
| `shortenAddress(address)` | "0x1234...5678" format |
| `getKYCLevelLabel(level)` | Get human-readable KYC level |
| `getKYCLevelColor(level)` | Get color for KYC badge |
| `isKYCExpired(expiryDate)` | Check if KYC expired |
| `daysUntilExpiry(expiryDate)` | Calculate remaining days |

### 7. UI Components

#### Button Component
- Variants: `primary`, `secondary`, `danger`, `ghost`
- Sizes: `sm`, `md`, `lg`
- Props: `isLoading`, `disabled`, `children`
- Primary gradient: pink to purple (#F2A9DD to #C8B2F5)

#### Input Component
- Standard input with label
- Address input with validation
- Number input with min/max
- Error state styling
- Helper text support

#### Card Component
- Container with rounded corners
- Shadow and border
- Header/body sections
- Hover effect option

#### Badge Component
- KYC Level colors:
  - NONE: Red
  - BASIC: Yellow
  - VERIFIED: Blue
  - ACCREDITED: Green
- Frozen status: Red with snowflake icon

#### Modal Component
- Overlay background
- Centered content
- Close button
- Animation on open/close

#### Alert Component
- Variants: `info`, `success`, `warning`, `error`
- Icon based on variant
- Dismissible option

### 8. Property Components

#### PropertyCard
- Property image/placeholder
- Name and location
- Total value in IDR
- Token supply info
- Link to details

#### PropertyDetails
- Full property information
- Legal document link (IPFS)
- Investment limits
- Token metrics
- Active status

#### PropertyStats
- Token price in IDR
- Total market cap
- Number of token holders
- Your ownership percentage

#### OwnershipCard
- Your token balance
- Ownership percentage
- Value in IDR
- Transfer button

### 9. KYC Components

#### KYCBadge
- Small badge showing KYC level
- Color coded by level
- Icon for each level

#### KYCStatusCard
- Full KYC status display
- Expiry date
- Country code
- Active/inactive status
- Days until expiry warning

#### InvestorList (Admin)
- Table of all investors
- Search by address
- Filter by KYC level
- Actions: Update, Revoke

### 10. Transfer Components

#### TransferForm
- Recipient address input
- Amount input
- Pre-check transfer validity
- Show reason if blocked
- Submit button

#### TransferPreview
- From/To addresses
- Amount to transfer
- New balances after transfer
- Ownership % change
- Confirmation button

#### TransferHistory
- List of past transfers (from events)
- From, To, Amount, Date
- Transaction hash link

### 11. Layout Components

#### Header
- Logo "PropertyToken" or "SDMN"
- Navigation: Home, Property, Portfolio, Transfer
- Admin link (only if admin)
- KYC Status badge
- RainbowKit ConnectButton
- Mobile hamburger menu

#### Footer
- Copyright text
- Built on Mantle badge
- Links: Docs, Explorer, GitHub

#### Layout
- Wrap all pages
- Include Header and Footer
- Main content with padding
- KYC warning banner if not verified

### 12. Pages

#### Home Page (`/`)
- Hero section with property image
- "Invest in Indonesian Real Estate" headline
- Property highlights
- Key statistics:
  - Property Value
  - Token Price
  - Total Investors
  - Your Ownership
- How tokenization works section
- CTA: View Property, Start Investing

#### Property Page (`/property`)
- PropertyDetails component
- PropertyStats component
- Legal documents section
- Investment calculator:
  - Input token amount
  - Show IDR value
  - Show ownership %
- Buy/Transfer CTA

#### Portfolio Page (`/portfolio`)
- OwnershipCard showing your holdings
- Portfolio value in IDR
- Ownership percentage visualization
- Transaction history
- Quick actions: Transfer, View Property

#### Transfer Page (`/transfer`)
- KYC verification check
- TransferForm component
- Pre-transfer validation
- TransferPreview on submit
- Success/Error feedback
- Recent transfers list

#### KYC Status Page (`/kyc`)
- KYCStatusCard for connected wallet
- If not verified: Contact admin message
- If verified: Show all details
- Expiry warning if < 30 days
- For admin: Link to admin panel

#### Admin Page (`/admin`)
- Access check (redirect if not admin)
- Dashboard sections:

**Statistics Row:**
- Total Token Supply
- Total Investors
- Frozen Accounts
- Property Value

**KYC Management Tab:**
- Register new investor form:
  - Address input
  - KYC Level dropdown
  - Country code input (default 360)
  - Valid days input (default 365)
- Investor list with search
- Update/Revoke actions

**Token Management Tab:**
- Investment limits form
- Freeze account form (address + reason)
- Unfreeze account form
- Force transfer form
- Legal document update

**Frozen Accounts Tab:**
- List of frozen addresses
- Freeze reason
- Unfreeze button

### 13. Routing (`App.tsx`)

```tsx
<Routes>
  <Route path="/" element={<Layout><Home /></Layout>} />
  <Route path="/property" element={<Layout><Property /></Layout>} />
  <Route path="/portfolio" element={<Layout><Portfolio /></Layout>} />
  <Route path="/transfer" element={<Layout><Transfer /></Layout>} />
  <Route path="/kyc" element={<Layout><KYCStatus /></Layout>} />
  <Route path="/admin" element={<Layout><Admin /></Layout>} />
</Routes>
```

### 14. Main Entry (`main.tsx`)

Wrap app with:
1. `WagmiProvider` with config
2. `QueryClientProvider` for TanStack
3. `RainbowKitProvider` for wallet UI
4. `BrowserRouter` for routing
5. `Toaster` for notifications

---

## Styling Guidelines

### Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Primary Pink | #F2A9DD | Buttons, highlights |
| Primary Purple | #C8B2F5 | Gradients, accents |
| Light Cream | #F7FAE4 | Background accents |
| Success Green | #22C55E | Success states, Accredited |
| Warning Orange | #F97316 | Warning states, Basic KYC |
| Danger Red | #EF4444 | Error states, Frozen, No KYC |
| Info Blue | #3B82F6 | Verified KYC, Info |
| Gray 50-900 | Tailwind defaults | Text, borders |

### Primary Gradient

```css
background: linear-gradient(135deg, #F2A9DD 0%, #C8B2F5 50%, #F7FAE4 100%);
```

### Design Principles

1. **Mobile-first**: Design for mobile, scale up
2. **Clean and minimal**: Avoid clutter
3. **Consistent spacing**: Use Tailwind spacing scale
4. **Rounded corners**: Use `rounded-lg` or `rounded-xl`
5. **Subtle shadows**: `shadow-sm` to `shadow-md`
6. **Clear hierarchy**: Size and weight for importance
7. **Trust indicators**: Show verification status prominently
8. **Indonesian context**: Use IDR formatting, Indonesian labels

---

## User Flows

### Investor: View Portfolio

1. Connect wallet via RainbowKit
2. System checks KYC status
3. If not verified: Show "Contact Admin" message
4. If verified: Navigate to Portfolio
5. View token balance and ownership %
6. See portfolio value in IDR
7. View transaction history

### Investor: Transfer Tokens

1. Navigate to Transfer page
2. System checks: Is sender KYC verified?
3. Enter recipient address
4. System checks: Is recipient KYC verified?
5. Enter amount to transfer
6. Click "Check Transfer"
7. System calls `canTransfer()` for pre-validation
8. If blocked: Show reason (frozen, not KYC, etc.)
9. If allowed: Show TransferPreview
10. Confirm transfer
11. Sign transaction in wallet
12. Wait for confirmation
13. See success toast
14. Balances updated

### Admin: Register New Investor

1. Connect admin wallet
2. Navigate to Admin dashboard
3. Go to KYC Management tab
4. Fill registration form:
   - Enter investor wallet address
   - Select KYC level (Basic/Verified/Accredited)
   - Enter country code (360 for Indonesia)
   - Enter valid days (e.g., 365)
5. Click "Register Investor"
6. Confirm transaction
7. Investor added to whitelist
8. Investor can now receive/send tokens

### Admin: Freeze Account (AML)

1. Go to Admin > Token Management
2. Enter address to freeze
3. Enter reason (e.g., "AML investigation")
4. Click "Freeze Account"
5. Confirm transaction
6. Account is frozen
7. Frozen account cannot send or receive tokens

### Admin: Force Transfer (Legal Compliance)

1. Go to Admin > Token Management
2. Enter From address
3. Enter To address
4. Enter amount
5. Click "Force Transfer"
6. Confirm transaction
7. Tokens transferred regardless of KYC/frozen status
8. Used for: court orders, estate settlement, recovery

---

## Compliance Features Display

### KYC Warning Banner

Show at top of page if user is not verified:
```
⚠️ Your wallet is not KYC verified. Contact admin to complete verification before trading.
```

### Transfer Blocked Messages

Display clear reasons when transfer is blocked:

| Reason | Message |
|--------|---------|
| Sender frozen | "Your account is frozen. Contact admin." |
| Receiver frozen | "Recipient account is frozen." |
| Sender not KYC | "You need to complete KYC verification." |
| Receiver not KYC | "Recipient is not KYC verified." |
| Exceeds max | "Transfer would exceed maximum investment limit." |
| Insufficient balance | "Insufficient token balance." |

### Frozen Account Indicator

Show prominently on frozen accounts:
- Red badge with snowflake icon
- "Account Frozen" text
- Disable all transfer buttons

---

## Error Handling

### Transaction Errors
- Show toast with error message
- Keep form data on failure
- Allow retry
- Log error for debugging

### Validation Errors
- Inline error messages
- Disable submit until valid
- Real-time validation feedback
- Address format validation

### KYC Errors
- Clear message if not verified
- Link to contact admin
- Expiry warning messages

### Network Errors
- Show "Wrong Network" if not on Mantle Sepolia
- Network switch button
- Retry connection option

---

## Deployment

### Vercel Configuration

Create `vercel.json`:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

### Environment Variables

Required:
- `VITE_WALLETCONNECT_PROJECT_ID`: WalletConnect Project ID

### Build Command

```bash
npm run build
```

---

## Testing Checklist

### Wallet Connection
- [ ] Connect wallet works
- [ ] Disconnect works
- [ ] Network switching works
- [ ] Address displays correctly

### KYC Verification
- [ ] KYC status displays correctly
- [ ] Different levels show different badges
- [ ] Expiry date calculated correctly
- [ ] Not verified message shows

### Property Display
- [ ] Property info loads
- [ ] Value in IDR formatted correctly
- [ ] Token price calculated
- [ ] Legal document link works

### Portfolio
- [ ] Balance displays correctly
- [ ] Ownership % calculated
- [ ] IDR value shown
- [ ] Empty state for 0 balance

### Token Transfer
- [ ] Form validation works
- [ ] Pre-check shows result
- [ ] Blocked transfers show reason
- [ ] Successful transfer updates balance
- [ ] Toast notifications appear

### Admin: KYC Management
- [ ] Register investor works
- [ ] Update investor works
- [ ] Revoke investor works
- [ ] Investor list displays

### Admin: Token Management
- [ ] Freeze account works
- [ ] Unfreeze account works
- [ ] Force transfer works
- [ ] Investment limits update works

### UI/UX
- [ ] Mobile responsive
- [ ] Loading states show
- [ ] Error messages display
- [ ] Navigation works
- [ ] KYC banner shows/hides correctly

---

## Notes for AI

1. **Start with configuration**: Set up chains, contracts, and wagmi config first
2. **Build hooks before components**: Data layer before UI
3. **Use TypeScript strictly**: No `any` types
4. **Handle all states**: Loading, error, empty, success
5. **KYC is critical**: Always check KYC status before operations
6. **Format IDR correctly**: Use Indonesian number formatting
7. **Keep components small**: Single responsibility
8. **Use consistent naming**: camelCase for functions, PascalCase for components
9. **Show compliance status**: Make KYC/frozen status visible
10. **Test on testnet**: Use Mantle Sepolia faucet for test MNT

---

## Smart Contract Solidity Code (Reference)

### KYCRegistry.sol

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract KYCRegistry {
    address public admin;

    enum KYCLevel {
        NONE,           // 0 - Belum KYC
        BASIC,          // 1 - KYC dasar (KTP)
        VERIFIED,       // 2 - KYC lengkap (KTP + NPWP)
        ACCREDITED      // 3 - Investor terakreditasi
    }

    struct Investor {
        KYCLevel level;
        uint256 expiryDate;
        uint16 countryCode;
        bool isActive;
    }

    mapping(address => Investor) public investors;
    uint256 public totalInvestors;

    event InvestorRegistered(address indexed investor, KYCLevel level);
    event InvestorUpdated(address indexed investor, KYCLevel newLevel);
    event InvestorRevoked(address indexed investor);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function registerInvestor(
        address _investor,
        KYCLevel _level,
        uint16 _countryCode,
        uint256 _validDays
    ) external onlyAdmin {
        require(_investor != address(0), "Invalid address");
        require(_level != KYCLevel.NONE, "Invalid KYC level");
        require(!investors[_investor].isActive, "Already registered");

        investors[_investor] = Investor({
            level: _level,
            expiryDate: block.timestamp + (_validDays * 1 days),
            countryCode: _countryCode,
            isActive: true
        });

        totalInvestors++;
        emit InvestorRegistered(_investor, _level);
    }

    function updateInvestor(
        address _investor,
        KYCLevel _newLevel
    ) external onlyAdmin {
        require(investors[_investor].isActive, "Not registered");
        investors[_investor].level = _newLevel;
        emit InvestorUpdated(_investor, _newLevel);
    }

    function revokeInvestor(address _investor) external onlyAdmin {
        require(investors[_investor].isActive, "Not registered");
        investors[_investor].isActive = false;
        totalInvestors--;
        emit InvestorRevoked(_investor);
    }

    function isVerified(address _investor) public view returns (bool) {
        Investor memory inv = investors[_investor];
        if (!inv.isActive) return false;
        if (inv.level == KYCLevel.NONE) return false;
        if (block.timestamp > inv.expiryDate) return false;
        return true;
    }

    function meetsLevel(
        address _investor,
        KYCLevel _requiredLevel
    ) public view returns (bool) {
        if (!isVerified(_investor)) return false;
        return uint8(investors[_investor].level) >= uint8(_requiredLevel);
    }

    function getInvestor(address _investor) external view returns (
        KYCLevel level,
        uint256 expiryDate,
        uint16 countryCode,
        bool isActive
    ) {
        Investor memory inv = investors[_investor];
        return (inv.level, inv.expiryDate, inv.countryCode, inv.isActive);
    }
}
```

### IndonesiaPropertyToken.sol

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract IndonesiaPropertyToken {
    string public name;
    string public symbol;
    uint8 public constant decimals = 18;
    uint256 public totalSupply;

    struct PropertyInfo {
        string propertyName;
        string location;
        uint256 totalValue;
        uint256 totalTokens;
        string legalDocument;
        bool isActive;
    }

    PropertyInfo public property;

    address public admin;
    address public kycRegistry;

    mapping(address => bool) public frozen;
    mapping(address => uint256) public balances;
    mapping(address => mapping(address => uint256)) public allowances;

    uint256 public minInvestment = 1 ether;
    uint256 public maxInvestment = 1000 ether;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event AccountFrozen(address indexed account, string reason);
    event AccountUnfrozen(address indexed account);
    event PropertyUpdated(string propertyName, uint256 totalValue);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }

    modifier notFrozen(address _account) {
        require(!frozen[_account], "Account is frozen");
        _;
    }

    modifier onlyVerified(address _account) {
        require(_isVerified(_account), "Not KYC verified");
        _;
    }

    constructor(
        string memory _name,
        string memory _symbol,
        address _kycRegistry,
        string memory _propertyName,
        string memory _location,
        uint256 _totalValue,
        uint256 _totalTokens
    ) {
        require(_kycRegistry != address(0), "Invalid KYC registry");

        name = _name;
        symbol = _symbol;
        admin = msg.sender;
        kycRegistry = _kycRegistry;

        property = PropertyInfo({
            propertyName: _propertyName,
            location: _location,
            totalValue: _totalValue,
            totalTokens: _totalTokens,
            legalDocument: "",
            isActive: true
        });

        totalSupply = _totalTokens;
        balances[msg.sender] = _totalTokens;
        emit Transfer(address(0), msg.sender, _totalTokens);
    }

    function balanceOf(address _owner) public view returns (uint256) {
        return balances[_owner];
    }

    function transfer(
        address _to,
        uint256 _value
    )
        public
        notFrozen(msg.sender)
        notFrozen(_to)
        onlyVerified(msg.sender)
        onlyVerified(_to)
        returns (bool)
    {
        require(_to != address(0), "Invalid recipient");
        require(balances[msg.sender] >= _value, "Insufficient balance");

        uint256 newBalance = balances[_to] + _value;
        require(newBalance <= maxInvestment, "Exceeds max investment");

        balances[msg.sender] -= _value;
        balances[_to] += _value;

        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function approve(address _spender, uint256 _value) public returns (bool) {
        allowances[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function allowance(address _owner, address _spender) public view returns (uint256) {
        return allowances[_owner][_spender];
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    )
        public
        notFrozen(_from)
        notFrozen(_to)
        onlyVerified(_from)
        onlyVerified(_to)
        returns (bool)
    {
        require(_to != address(0), "Invalid recipient");
        require(balances[_from] >= _value, "Insufficient balance");
        require(allowances[_from][msg.sender] >= _value, "Insufficient allowance");

        uint256 newBalance = balances[_to] + _value;
        require(newBalance <= maxInvestment, "Exceeds max investment");

        balances[_from] -= _value;
        balances[_to] += _value;
        allowances[_from][msg.sender] -= _value;

        emit Transfer(_from, _to, _value);
        return true;
    }

    function freezeAccount(
        address _account,
        string calldata _reason
    ) external onlyAdmin {
        frozen[_account] = true;
        emit AccountFrozen(_account, _reason);
    }

    function unfreezeAccount(address _account) external onlyAdmin {
        frozen[_account] = false;
        emit AccountUnfrozen(_account);
    }

    function forceTransfer(
        address _from,
        address _to,
        uint256 _value
    ) external onlyAdmin {
        require(balances[_from] >= _value, "Insufficient balance");

        balances[_from] -= _value;
        balances[_to] += _value;

        emit Transfer(_from, _to, _value);
    }

    function setLegalDocument(string calldata _ipfsHash) external onlyAdmin {
        property.legalDocument = _ipfsHash;
    }

    function setInvestmentLimits(
        uint256 _min,
        uint256 _max
    ) external onlyAdmin {
        require(_min < _max, "Invalid limits");
        minInvestment = _min;
        maxInvestment = _max;
    }

    function getOwnershipPercent(address _owner) public view returns (uint256) {
        if (totalSupply == 0) return 0;
        return (balances[_owner] * 10000) / totalSupply;
    }

    function getTokenValueIDR() public view returns (uint256) {
        if (property.totalTokens == 0) return 0;
        return property.totalValue / property.totalTokens;
    }

    function canTransfer(
        address _from,
        address _to,
        uint256 _value
    ) public view returns (bool, string memory) {
        if (frozen[_from]) return (false, "Sender is frozen");
        if (frozen[_to]) return (false, "Receiver is frozen");
        if (!_isVerified(_from)) return (false, "Sender not KYC verified");
        if (!_isVerified(_to)) return (false, "Receiver not KYC verified");
        if (balances[_from] < _value) return (false, "Insufficient balance");
        if (balances[_to] + _value > maxInvestment) return (false, "Exceeds max investment");

        return (true, "Transfer allowed");
    }

    function _isVerified(address _account) internal view returns (bool) {
        if (_account == admin) return true;

        (bool success, bytes memory data) = kycRegistry.staticcall(
            abi.encodeWithSignature("isVerified(address)", _account)
        );

        if (!success) return false;
        return abi.decode(data, (bool));
    }
}
```

---

## Summary

Build a complete IndonesiaPropertyToken dApp with:
- React 19 + TypeScript + Vite frontend
- Wagmi + RainbowKit for Web3 integration
- Tailwind CSS for styling
- 6 pages: Home, Property, Portfolio, Transfer, KYC Status, Admin
- Custom hooks for PropertyToken and KYCRegistry contracts
- Reusable UI component library
- Full admin dashboard for KYC and token management
- Compliance-first design with KYC checks
- Mobile-responsive design
- Toast notifications for user feedback
- Mantle Sepolia testnet deployment

The end result should be a production-ready RWA tokenization platform with full compliance features for Indonesian real estate investment.
