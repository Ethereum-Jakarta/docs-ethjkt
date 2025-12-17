---
id: hands-on-0g-inference
title: "Hands-on: 0G Inference"
sidebar_position: 5
---

# Hands-on: 0G Inference Integration

Tutorial untuk mengintegrasikan INFT dengan 0G Compute Network untuk AI inference.

## Overview

Setelah INFT di-mint dan authorization di-setup, langkah selanjutnya adalah menghubungkan dengan 0G inference untuk memberikan "kecerdasan" pada NFT.

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│    User      │────►│   Executor   │────►│  0G Compute  │
│   Request    │     │   Service    │     │  (AI Model)  │
└──────────────┘     └──────┬───────┘     └──────────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │  AgentNFT    │
                    │  Contract    │
                    │ (Auth Check) │
                    └──────────────┘
```

## Prerequisites

- [ ] AgentNFT contract sudah deployed (dari [Part 4: Hands-on Mint & Authorize](./04-hands-on-mint-authorize.md))
- [ ] Sudah mint minimal 1 INFT
- [ ] Node.js environment ready
- [ ] Test OG tokens available

## Part 1: Setup Executor Service

### Step 1.1: Initialize Project

```bash
# Buat folder executor
mkdir executor-service
cd executor-service

# Initialize
npm init -y

# Install dependencies
npm install express ethers dotenv cors
npm install --save-dev nodemon
```

### Step 1.2: Project Structure

```
executor-service/
├── src/
│   ├── index.js          # Main server
│   ├── auth.js           # Authorization checker
│   ├── inference.js      # 0G inference client
│   └── config.js         # Configuration
├── .env
└── package.json
```

### Step 1.3: Environment Setup

Buat file `.env`:

```env
# Server
PORT=3001

# 0G Network
OG_RPC_URL=https://evmrpc-testnet.0g.ai

# AgentNFT Contract (dari hasil deploy sebelumnya)
AGENT_NFT_ADDRESS=your_deployed_agentnft_address

# 0G Compute (jika menggunakan API)
OG_COMPUTE_API_KEY=your_api_key
OG_COMPUTE_URL=https://api.0g.ai/v1

# Private key untuk signing (opsional)
EXECUTOR_PRIVATE_KEY=your_private_key
```

### Step 1.4: Configuration

Buat file `src/config.js`:

```javascript
require('dotenv').config();

module.exports = {
    port: process.env.PORT || 3001,
    ogRpcUrl: process.env.OG_RPC_URL || 'https://evmrpc-testnet.0g.ai',
    contractAddress: process.env.AGENT_NFT_ADDRESS,
    ogComputeUrl: process.env.OG_COMPUTE_URL,
    ogApiKey: process.env.OG_COMPUTE_API_KEY,

    // Contract ABI (AgentNFT - official functions)
    contractABI: [
        "function ownerOf(uint256 tokenId) view returns (address)",
        "function authorizedUsersOf(uint256 tokenId) view returns (address[])",
        "function intelligentDatasOf(uint256 tokenId) view returns (tuple(string dataDescription, bytes32 dataHash)[])"
    ]
};
```

## Part 2: Authorization Module

### Step 2.1: Auth Checker

Buat file `src/auth.js`:

```javascript
const { ethers } = require('ethers');
const config = require('./config');

// Setup provider dan contract
const provider = new ethers.JsonRpcProvider(config.ogRpcUrl);
const contract = new ethers.Contract(
    config.contractAddress,
    config.contractABI,
    provider
);

/**
 * Verify user signature
 */
function verifySignature(message, signature, expectedAddress) {
    try {
        const recoveredAddress = ethers.verifyMessage(message, signature);
        return recoveredAddress.toLowerCase() === expectedAddress.toLowerCase();
    } catch (error) {
        console.error('Signature verification failed:', error);
        return false;
    }
}

/**
 * Check on-chain authorization using AgentNFT contract
 * User is authorized if they are owner OR in authorizedUsers list
 */
async function checkAuthorization(tokenId, userAddress) {
    try {
        // Check if user is owner
        const owner = await contract.ownerOf(tokenId);
        if (owner.toLowerCase() === userAddress.toLowerCase()) {
            return true;
        }

        // Check if user is in authorized users list
        const authorizedUsers = await contract.authorizedUsersOf(tokenId);
        return authorizedUsers.some(
            (u) => u.toLowerCase() === userAddress.toLowerCase()
        );
    } catch (error) {
        console.error('Authorization check failed:', error);
        return false;
    }
}

/**
 * Get intelligent data from token
 */
async function getIntelligentData(tokenId) {
    try {
        const iDatas = await contract.intelligentDatasOf(tokenId);
        return iDatas.map(data => ({
            dataDescription: data.dataDescription,
            dataHash: data.dataHash
        }));
    } catch (error) {
        console.error('Failed to get intelligent data:', error);
        return null;
    }
}

/**
 * Get token owner
 */
async function getTokenOwner(tokenId) {
    try {
        return await contract.ownerOf(tokenId);
    } catch (error) {
        console.error('Failed to get owner:', error);
        return null;
    }
}

/**
 * Get authorized users list
 */
async function getAuthorizedUsers(tokenId) {
    try {
        return await contract.authorizedUsersOf(tokenId);
    } catch (error) {
        console.error('Failed to get authorized users:', error);
        return [];
    }
}

module.exports = {
    verifySignature,
    checkAuthorization,
    getIntelligentData,
    getTokenOwner,
    getAuthorizedUsers
};
```

## Part 3: Inference Module

### Step 3.1: 0G Inference Client

Buat file `src/inference.js`:

```javascript
const config = require('./config');

// Agent configurations (in production, decrypt from storage)
const agentConfigs = {
    default: {
        model: 'gpt-3.5-turbo',
        systemPrompt: 'You are a helpful AI assistant.',
        temperature: 0.7,
        maxTokens: 500
    },
    web3Expert: {
        model: 'gpt-4',
        systemPrompt: `You are a Web3 expert assistant. You help developers understand:
- Smart contract development
- DeFi protocols
- NFT standards
- Blockchain architecture
Always provide clear, technical explanations with code examples when relevant.`,
        temperature: 0.5,
        maxTokens: 1000
    },
    creativAssistant: {
        model: 'gpt-4',
        systemPrompt: `You are a creative AI assistant that helps with:
- Content creation
- Storytelling
- Marketing copy
- Creative brainstorming
Be imaginative and engaging in your responses.`,
        temperature: 0.9,
        maxTokens: 800
    }
};

/**
 * Run inference with 0G Compute
 */
async function runInference(params) {
    const { agentType = 'default', prompt, context = [] } = params;

    // Get agent config
    const agentConfig = agentConfigs[agentType] || agentConfigs.default;

    // Build messages
    const messages = [
        { role: 'system', content: agentConfig.systemPrompt },
        ...context,
        { role: 'user', content: prompt }
    ];

    // In production: Call 0G Compute API
    // For demo: Using mock or alternative API

    try {
        // Option 1: 0G Compute API (when available)
        if (config.ogApiKey && config.ogComputeUrl) {
            const response = await fetch(`${config.ogComputeUrl}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${config.ogApiKey}`
                },
                body: JSON.stringify({
                    model: agentConfig.model,
                    messages: messages,
                    temperature: agentConfig.temperature,
                    max_tokens: agentConfig.maxTokens
                })
            });

            const data = await response.json();
            return {
                success: true,
                response: data.choices[0].message.content,
                model: agentConfig.model,
                usage: data.usage
            };
        }

        // Option 2: Mock response for demo
        return {
            success: true,
            response: generateMockResponse(agentType, prompt),
            model: agentConfig.model,
            mock: true
        };

    } catch (error) {
        console.error('Inference failed:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Generate mock response for demo
 */
function generateMockResponse(agentType, prompt) {
    const responses = {
        default: `I received your question: "${prompt.substring(0, 50)}..."

This is a demo response from the INFT executor service. In production, this would be powered by 0G Compute with real AI inference.

Key points about INFT:
1. Your authorization was verified on-chain
2. The agent configuration was loaded
3. AI inference was processed
4. Response delivered securely`,

        web3Expert: `[Web3 Expert Agent]

Regarding your question about "${prompt.substring(0, 30)}...":

Here's a technical explanation:

1. **Smart Contract Perspective**:
   The INFT system uses ERC-7857 standard which extends ERC-721 with encrypted metadata capabilities.

2. **Security Model**:
   - On-chain authorization verification
   - Encrypted AI configurations
   - Secure re-encryption on transfer

3. **Code Example**:
\`\`\`solidity
function isAuthorized(uint256 tokenId, address user)
    public view returns (bool) {
    return ownerOf(tokenId) == user ||
           usageAuths[tokenId][user].isActive;
}
\`\`\`

This is a demo response. Real inference powered by 0G Compute coming soon!`,

        creativAssistant: `✨ [Creative Assistant Agent]

Your prompt sparked some creative thoughts about "${prompt.substring(0, 30)}...":

🎨 **Creative Concept:**
Imagine a world where NFTs aren't just static images, but living, breathing AI companions that grow and evolve with their owners.

📝 **Story Hook:**
"The moment I transferred the INFT, I felt a strange connection break. My AI companion of three years now belonged to someone else..."

💡 **Marketing Angle:**
"Own more than art. Own intelligence. INFT - Where AI meets NFT."

This is a demo response showcasing the creative agent's personality!`
    };

    return responses[agentType] || responses.default;
}

/**
 * Get available agent types
 */
function getAgentTypes() {
    return Object.keys(agentConfigs).map(key => ({
        id: key,
        name: agentConfigs[key].model,
        description: agentConfigs[key].systemPrompt.substring(0, 100) + '...'
    }));
}

module.exports = {
    runInference,
    getAgentTypes
};
```

## Part 4: Main Server

### Step 4.1: Express Server

Buat file `src/index.js`:

```javascript
const express = require('express');
const cors = require('cors');
const config = require('./config');
const auth = require('./auth');
const inference = require('./inference');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        contract: config.contractAddress
    });
});

/**
 * Get available agent types
 */
app.get('/api/agents', (req, res) => {
    const agents = inference.getAgentTypes();
    res.json({ agents });
});

/**
 * Check authorization status
 */
app.get('/api/auth/:tokenId/:address', async (req, res) => {
    try {
        const { tokenId, address } = req.params;

        const isAuthorized = await auth.checkAuthorization(
            parseInt(tokenId),
            address
        );

        const owner = await auth.getTokenOwner(parseInt(tokenId));

        res.json({
            tokenId: parseInt(tokenId),
            address,
            isAuthorized,
            isOwner: owner?.toLowerCase() === address.toLowerCase()
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Main inference endpoint
 */
app.post('/api/inference', async (req, res) => {
    try {
        const {
            tokenId,
            userAddress,
            signature,
            message,
            prompt,
            agentType = 'default',
            context = []
        } = req.body;

        // Validate required fields
        if (!tokenId === undefined || !userAddress || !signature || !message || !prompt) {
            return res.status(400).json({
                error: 'Missing required fields',
                required: ['tokenId', 'userAddress', 'signature', 'message', 'prompt']
            });
        }

        console.log(`\n${'='.repeat(50)}`);
        console.log('Inference Request');
        console.log(`${'='.repeat(50)}`);
        console.log('Token ID:', tokenId);
        console.log('User:', userAddress);
        console.log('Agent Type:', agentType);

        // Step 1: Verify signature
        console.log('\n[1] Verifying signature...');
        const isValidSignature = auth.verifySignature(message, signature, userAddress);

        if (!isValidSignature) {
            console.log('❌ Invalid signature');
            return res.status(401).json({ error: 'Invalid signature' });
        }
        console.log('✅ Signature valid');

        // Step 2: Check on-chain authorization
        console.log('\n[2] Checking on-chain authorization...');
        const isAuthorized = await auth.checkAuthorization(tokenId, userAddress);

        if (!isAuthorized) {
            console.log('❌ Not authorized');
            return res.status(403).json({
                error: 'Not authorized to use this INFT',
                tokenId,
                userAddress
            });
        }
        console.log('✅ User is authorized');

        // Step 3: Get intelligent data
        console.log('\n[3] Loading intelligent data...');
        const intelligentData = await auth.getIntelligentData(tokenId);

        if (!intelligentData || intelligentData.length === 0) {
            console.log('❌ No intelligent data found');
            return res.status(400).json({ error: 'No intelligent data found for this token' });
        }
        console.log('✅ Intelligent data loaded');
        console.log('   Description:', intelligentData[0].dataDescription);
        console.log('   Data Hash:', intelligentData[0].dataHash);

        // Step 4: Run inference
        console.log('\n[4] Running inference...');
        const result = await inference.runInference({
            agentType,
            prompt,
            context
        });

        if (!result.success) {
            console.log('❌ Inference failed:', result.error);
            return res.status(500).json({ error: 'Inference failed', details: result.error });
        }
        console.log('✅ Inference complete');

        // Return response
        res.json({
            success: true,
            tokenId,
            response: result.response,
            model: result.model,
            mock: result.mock || false,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * Get token info
 */
app.get('/api/token/:tokenId', async (req, res) => {
    try {
        const tokenId = parseInt(req.params.tokenId);

        const owner = await auth.getTokenOwner(tokenId);
        const intelligentData = await auth.getIntelligentData(tokenId);
        const authorizedUsers = await auth.getAuthorizedUsers(tokenId);

        if (!owner) {
            return res.status(404).json({ error: 'Token not found' });
        }

        res.json({
            tokenId,
            owner,
            authorizedUsers,
            intelligentData: intelligentData || []
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(config.port, () => {
    console.log(`\n${'='.repeat(50)}`);
    console.log('INFT Executor Service');
    console.log(`${'='.repeat(50)}`);
    console.log(`Server running on port ${config.port}`);
    console.log(`Contract: ${config.contractAddress}`);
    console.log(`Network: ${config.ogRpcUrl}`);
    console.log(`\nEndpoints:`);
    console.log(`  GET  /health`);
    console.log(`  GET  /api/agents`);
    console.log(`  GET  /api/auth/:tokenId/:address`);
    console.log(`  GET  /api/token/:tokenId`);
    console.log(`  POST /api/inference`);
    console.log(`${'='.repeat(50)}\n`);
});
```

### Step 4.2: Update package.json

```json
{
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js"
  }
}
```

### Step 4.3: Run Server

```bash
npm run dev
```

Output:
```
==================================================
INFT Executor Service
==================================================
Server running on port 3001
Contract: 0x1234...
Network: https://evmrpc-testnet.0g.ai

Endpoints:
  GET  /health
  GET  /api/agents
  GET  /api/auth/:tokenId/:address
  GET  /api/token/:tokenId
  POST /api/inference
==================================================
```

## Part 5: Testing the Integration

### Step 5.1: Test Script

Buat file `test-inference.js` di root folder:

```javascript
const { ethers } = require('ethers');
require('dotenv').config();

const EXECUTOR_URL = 'http://localhost:3001';
const TOKEN_ID = 0;

async function main() {
    console.log('='.repeat(50));
    console.log('Testing INFT Inference');
    console.log('='.repeat(50));

    // Setup wallet
    const provider = new ethers.JsonRpcProvider(process.env.OG_RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    console.log('\nWallet:', wallet.address);

    // Step 1: Check health
    console.log('\n[1] Checking executor health...');
    const healthRes = await fetch(`${EXECUTOR_URL}/health`);
    const health = await healthRes.json();
    console.log('Status:', health.status);

    // Step 2: Check authorization
    console.log('\n[2] Checking authorization...');
    const authRes = await fetch(
        `${EXECUTOR_URL}/api/auth/${TOKEN_ID}/${wallet.address}`
    );
    const authData = await authRes.json();
    console.log('Is Authorized:', authData.isAuthorized);
    console.log('Is Owner:', authData.isOwner);

    if (!authData.isAuthorized) {
        console.log('\n❌ Not authorized. Please ensure you own or have usage rights.');
        return;
    }

    // Step 3: Create signature
    console.log('\n[3] Creating signature...');
    const message = `Authorize inference for token ${TOKEN_ID} at ${Date.now()}`;
    const signature = await wallet.signMessage(message);
    console.log('Message:', message);
    console.log('Signature:', signature.substring(0, 20) + '...');

    // Step 4: Call inference
    console.log('\n[4] Calling inference...');
    const inferenceRes = await fetch(`${EXECUTOR_URL}/api/inference`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            tokenId: TOKEN_ID,
            userAddress: wallet.address,
            signature,
            message,
            prompt: 'Explain what makes INFT different from regular NFTs in 3 sentences.',
            agentType: 'web3Expert'
        })
    });

    const result = await inferenceRes.json();

    if (result.success) {
        console.log('\n✅ Inference Successful!');
        console.log('\n' + '-'.repeat(50));
        console.log('Response:');
        console.log('-'.repeat(50));
        console.log(result.response);
        console.log('-'.repeat(50));
        console.log('\nModel:', result.model);
        console.log('Mock:', result.mock);
    } else {
        console.log('\n❌ Inference Failed:', result.error);
    }
}

main().catch(console.error);
```

### Step 5.2: Run Test

```bash
# Terminal 1: Run executor
npm run dev

# Terminal 2: Run test
node test-inference.js
```

## Part 6: Frontend Integration (Bonus)

### Simple React Component

```jsx
// components/INFTChat.jsx
import { useState } from 'react';
import { useAccount, useSignMessage } from 'wagmi';

export function INFTChat({ tokenId }) {
    const { address } = useAccount();
    const { signMessageAsync } = useSignMessage();

    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        if (!prompt.trim()) return;

        setLoading(true);
        try {
            // Create and sign message
            const message = `Authorize inference for token ${tokenId} at ${Date.now()}`;
            const signature = await signMessageAsync({ message });

            // Call inference API
            const res = await fetch('/api/inference', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tokenId,
                    userAddress: address,
                    signature,
                    message,
                    prompt,
                    agentType: 'default'
                })
            });

            const data = await res.json();

            if (data.success) {
                setResponse(data.response);
            } else {
                setResponse(`Error: ${data.error}`);
            }
        } catch (error) {
            setResponse(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="inft-chat">
            <h3>Chat with INFT #{tokenId}</h3>

            <form onSubmit={handleSubmit}>
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Ask something..."
                    rows={3}
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Thinking...' : 'Send'}
                </button>
            </form>

            {response && (
                <div className="response">
                    <h4>Response:</h4>
                    <p>{response}</p>
                </div>
            )}
        </div>
    );
}
```

## Checkpoint Summary

Setelah menyelesaikan part ini:

- [x] Executor service berjalan
- [x] Authorization checking works
- [x] Signature verification works
- [x] Inference endpoint functional
- [x] End-to-end flow tested

## Next Steps

1. **Production Deployment**
   - Deploy executor ke cloud (Vercel, Railway, dll)
   - Setup proper API keys
   - Implement rate limiting

2. **Real 0G Integration**
   - Connect ke 0G Compute API
   - Store configs di 0G Storage
   - Implement proper encryption

3. **Enhanced Features**
   - Chat history persistence
   - Multiple agent types
   - Usage metering

---

:::tip Workshop Complete!
Selamat! Kamu sudah menyelesaikan workshop INFT. Lanjut ke [Homework & Submission](./06-homework-submission.md) untuk submit hasil kerja kamu!
:::
