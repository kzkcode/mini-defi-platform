# MyToken DApp — A Web3 Project with ERC-20, Staking, and AMM

MyToken DApp is a full-stack Web3 learning project built with Solidity, Hardhat,
React, and Ethers.js, deployed on the Sepolia testnet.

## Project Overview

This full-stack Web3 learning DApp implements:

- An original ERC-20 token (MyToken / MTK)
- A staking smart contract that allows users to stake MTK and earn rewards over time
- An AMM (Automated Market Maker) smart contract for token ↔ ETH swaps and liquidity provision
- A React frontend connected to MetaMask for all interactions

## Implemented Features

### 1. Smart Contracts (Solidity / Hardhat)

#### ERC-20 Token (MyToken / MTK)
- Standard ERC-20 implementation using OpenZeppelin
- Token transfer, approve, transferFrom
- Deployed to Sepolia testnet

#### Staking Contract
- Stake and withdraw MTK tokens
- Claim time-based rewards with real-time earned display
- Reward rate and APR(Annual Percentage Rate) calculation
- Total staked amount tracking

#### AMM Contract
- Swap MTK ↔ ETH at a constant product (x * y = k) formula
- Add and remove liquidity
- Track pool reserves for token and ETH
- Users receive LP tokens representing their share of the pool

### 2. Frontend (React + Ethers.js)

- MetaMask wallet connection
- Token balance display
- Token transfer / approve / transferFrom UI
- Staking UI (deposit, withdraw, claim)
- Real-time earned reward display
- Reward rate and APR(Annual Percentage Rate) display
- Automatic UI refresh after transactions
- AMM UI for swapping, removing liquidity, and viewing pool reserves

## Tech Stack

### Smart Contract
- Solidity
- Hardhat
- OpenZeppelin

### Frontend
- React
- Vite
- TailwindCSS
- Ethers.js
- MetaMask

## How to Run

1. Smart Contract Setup
```bash
npm install
# Deploy ERC-20 token first
npx hardhat run scripts/deploy_token.js --network sepolia
# Deploy staking contract with token address
npx hardhat run scripts/deploy_staking.js --network sepolia
# Deploy AMM contract with token address
npx hardhat run scripts/deploy_amm.js --network sepolia
# Add initial liquidity to AMM pool (required for swap/removeLiquidity)
npx hardhat run scripts/add_liquidity.js --network sepolia
```

2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Learning Outcomes

- Interaction between smart contracts and frontend
- Implementing Web3 UI connected to MetaMask
- Using Ethers.js to fetch balances and send tokens
- Deploying smart contracts on a testnet using Hardhat
- Implementing staking logic and reward distribution
- Handling time-based rewards and on-chain state updates
- Understanding and implementing AMM (constant product formula)
- Managing liquidity, LP tokens, and swap logic
- Integrating multiple smart contracts in a single DApp