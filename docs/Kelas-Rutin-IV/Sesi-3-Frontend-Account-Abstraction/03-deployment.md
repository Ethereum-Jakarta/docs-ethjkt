---
id: part-3-deployment
title: "Part 3: Deployment & Production"
sidebar_label: "Part 3: Deployment"
---

# Part 3: Deployment & Production

**Final Module (16:45 - 17:00)** | Deployment Demo

---

## 📋 Overview

Di part terakhir ini, kita akan:
- ✅ Build production-ready application
- ✅ Setup environment variables untuk production
- ✅ Deploy ke Vercel
- ✅ Testing production deployment

---

## Step 1: Build untuk Production

Test build aplikasi locally:

```bash
yarn build
```

Pastikan build berhasil tanpa error. Check output untuk:
- ✅ No TypeScript errors
- ✅ No missing dependencies
- ✅ All pages compiled successfully

**Test production build locally:**
```bash
yarn start
```

Buka http://localhost:3000 dan test semua features:
- Connect wallet
- Plant seed
- Water plant
- Harvest plant

---

## Step 2: Setup Git Repository

Initialize git dan push ke GitHub:

```bash
# Initialize git (kalau belum)
git init

# Add semua files
git add .

# Commit
git commit -m "Initial commit: LiskGarden DApp

- Next.js 15 + React 19
- Panna SDK integration (gasless transactions)
- Thirdweb contract interaction
- Complete garden game UI

#BuildOnLisk #EthereumJakarta"

# Create repo di GitHub, lalu:
git remote add origin https://github.com/yourusername/lisk-garden-dapp.git
git branch -M main
git push -u origin main
```

---

## Step 3: Deploy ke Vercel

### Option A: Via Vercel Dashboard (Recommended)

1. **Login ke Vercel**: Buka [vercel.com](https://vercel.com)

2. **Import Project**:
   - Click "Add New" → "Project"
   - Import GitHub repository Anda

3. **Configure Build**:
   - Framework: Next.js (auto-detected)
   - Build Command: `yarn build`
   - Output Directory: `.next`
   - Install Command: `yarn install`

4. **Add Environment Variables**:
   ```
   NEXT_PUBLIC_PANNA_CLIENT_ID=your_client_id
   NEXT_PUBLIC_PANNA_PARTNER_ID=your_partner_id
   NEXT_PUBLIC_CHAIN_ID=4202
   NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourContractAddress
   ```

5. **Deploy**: Click "Deploy"

6. **Wait**: Deployment biasanya 2-3 menit

### Option B: Via Vercel CLI

```bash
# Install Vercel CLI (global)
yarn global add vercel

# Atau menggunakan npm (untuk global packages)
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Production deployment
vercel --prod
```

---

## Step 4: Verify Production Deployment

**Test deployed app:**

1. Visit Vercel URL (e.g., `your-app.vercel.app`)
2. Test wallet connection
3. Plant seed (test payable transaction)
4. Water plant (test free transaction)
5. Check gasless transactions working
6. Test mobile responsiveness
7. Test dark/light mode

**Common Issues:**

**Issue 1: "Network Error"**
```
Solution:
- Check CONTRACT_ADDRESS di environment variables
- Verify RPC URL accessible dari browser
```

**Issue 2: "Wallet Connection Failed"**
```
Solution:
- Check Panna credentials correct
- Verify PANNA_CLIENT_ID dan PANNA_PARTNER_ID
```

**Issue 3: "Transaction Failed"**
```
Solution:
- Ensure contract has enough ETH untuk harvest rewards
- Check wallet has Lisk Sepolia ETH
```

---

## Step 5: Custom Domain (Optional)

Setup custom domain di Vercel:

1. Go to Project Settings → Domains
2. Add your domain (e.g., `liskgarden.com`)
3. Update DNS records (Vercel akan provide instructions)
4. Wait untuk DNS propagation (15-30 menit)

---

## 🎯 Production Checklist

**Before launching:**
- [ ] All features tested dan working
- [ ] Contract address correct
- [ ] Panna credentials valid
- [ ] Mobile responsive
- [ ] Dark/light mode working
- [ ] Error handling proper
- [ ] Loading states smooth
- [ ] Auto-refresh working
- [ ] Gasless transactions confirmed

---

## 📊 Monitor & Analytics

### Vercel Analytics (Built-in)

Analytics sudah auto-enabled via `@vercel/analytics`:

```typescript
// Already included in app/layout.tsx
import { Analytics } from "@vercel/analytics/next"

// ...

<Analytics />
```

Dashboard available di Vercel project → Analytics tab.

**Metrics tracked:**
- Page views
- Unique visitors
- Top pages
- Referrers
- Geographic distribution

---

## 🔧 Performance Optimization Tips

### 1. Image Optimization

Next.js auto-optimizes images. Use `next/image`:

```typescript
import Image from 'next/image'

<Image
  src="/plant-icon.png"
  alt="Plant"
  width={100}
  height={100}
  priority // untuk above-the-fold images
/>
```

### 2. Code Splitting

Next.js auto code-splits. Untuk additional optimization:

```typescript
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>,
})
```

### 3. Caching Strategy

Set proper cache headers di `next.config.js`:

```javascript
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}
```

---

## 🎓 Next Steps & Learning Path

### 1. **Improve DApp Features**

**Ideas:**
- Add leaderboard (top harvesters)
- Plant breeding system
- Achievement badges
- Social features (share garden)
- Referral system

### 2. **Learn Advanced Web3**

**Topics:**
- Account Abstraction deep dive
- Cross-chain applications
- IPFS untuk decentralized storage
- The Graph untuk indexing
- ENS integration

### 3. **Build Portfolio**

**Projects:**
- NFT marketplace
- DeFi protocol (staking, yield farming)
- DAO governance platform
- Gaming DApp
- Social network on blockchain

### 4. **Apply for Grants**

**Programs:**
- **Lisk EMpower Fund** - Up to $10,000
- **Ethereum Foundation Grants**
- **Protocol Labs Grants**
- **Gitcoin Grants**

**Lisk EMpower Application:**
1. Visit: [lisk.com/empower](https://lisk.com/empower)
2. Prepare pitch deck
3. Show working prototype
4. Apply!

### 5. **Join Hackathons**

**Upcoming Hackathons:**
- ETHGlobal (online & regional)
- Lisk Hackathons
- Ethereum Jakarta events
- DevConnect events

---

## 📚 Resources & Documentation

### Official Docs:
- **Lisk**: [docs.lisk.com](https://docs.lisk.com)
- **Panna SDK**: [docs.panna.network](https://docs.panna.network)
- **Thirdweb**: [portal.thirdweb.com](https://portal.thirdweb.com)
- **Next.js**: [nextjs.org/docs](https://nextjs.org/docs)
- **Vercel**: [vercel.com/docs](https://vercel.com/docs)

### Community:
- **Telegram**: Kelas Rutin Batch IV
- **Discord**: Ethereum Jakarta
- **Twitter**: @EthereumJakarta, @LiskHQ
- **GitHub**: Share your code & contribute!

### Learning Resources:
- [Web3 University](https://www.web3.university/)
- [Buildspace](https://buildspace.so/)
- [LearnWeb3](https://learnweb3.io/)
- [CryptoZombies](https://cryptozombies.io/)

---

## 🎉 Congratulations!

Anda sudah berhasil:
- ✅ Build full-stack DApp dengan Next.js 15 & React 19
- ✅ Integrate Panna SDK untuk gasless transactions
- ✅ Implement real-time blockchain interactions
- ✅ Deploy production-ready application
- ✅ Master modern Web3 development stack

**You're now a Web3 Developer! 🚀**

---

## 📸 Share Your Work!

Post di social media:

**Template:**
```
🌱 Just built my first gasless DApp dengan @LiskHQ!

LiskGarden - Blockchain garden game dengan:
✅ Gasless transactions (Panna SDK)
✅ Next.js 15 + React 19
✅ Real-time updates
✅ Production-ready

Live demo: [your-vercel-url]

Thanks @EthereumJakarta untuk amazing workshop! 🙏

#BuildOnLisk #Web3 #EthereumJakarta #LiskGarden
```

**Tag:**
- @EthereumJakarta
- @LiskHQ
- @Panna_Network
- Instruktur workshop Anda

---

## 🙏 Thank You!

Terima kasih sudah participate di **Kelas Rutin Batch IV - Sesi 3**!

**Special Thanks:**
- **Lisk Foundation** - Support & resources
- **BINUS University** - Venue & facilities
- **Panna Network** - Gasless transaction technology
- **Instruktur Team** - Knowledge sharing
- **YOU** - For being amazing learners! 🎉

---

## 💬 Stay Connected

**Questions?**
- Telegram: Kelas Rutin Batch IV group
- Email: [workshop contact]
- Office hours: [schedule]

**Keep Learning:**
- Follow updates untuk next sessions
- Join weekly code reviews
- Participate di open source projects

---

**Keep building, keep learning!**

**The future of Web3 is in your hands! 🌟**

---

**[← Back: Part 2B - Building UI](./02-building-ui-part-b.md)** | **[Back to Main Index](./sesi-3-kelas-rutin-batch-4.md)**

---

**#BuildOnLisk** | **#EthereumJakarta** | **#Web3Indonesia**
