# Mini DeFi Platform

A full-stack Web3 application that demonstrates a unified DeFi experience through asset management, staking, trading, and liquidity provision.

Built with **Solidity, Hardhat, React, Vite, Tailwind CSS, and Ethers.js**, the application integrates multiple smart contracts into a single product-oriented interface deployed on the Sepolia testnet.

# Screenshots

## Dashboard

<img src="./screenshots/dashboard.png" width="400">

## Earn

<img src="./screenshots/earn.png" width="400">

## Trade

<img src="./screenshots/trade.png" width="400">

# Concept

Rather than presenting independent smart contract examples, this project is designed as a **mini DeFi platform** where users can:

- Hold digital assets
- Earn staking rewards
- Trade through an AMM
- Provide liquidity
- Monitor portfolio status

The goal is to recreate the core workflow of a decentralized finance application within a unified user experience.

# Features

## Dashboard

The Dashboard serves as the central overview of the user's portfolio.

It displays:

- Wallet MTK balance
- Staked MTK amount
- Pending staking rewards
- LP token position
- On-chain asset summary

Changes made in other sections are reflected here in real time.

## Earn

The Earn section allows users to generate yield from idle assets.

Features include:

- Stake MTK
- Withdraw staked MTK
- Claim accumulated rewards
- Real-time reward calculation
- APY-based staking model

This demonstrates time-based reward accounting implemented entirely on-chain.

## Trade

The Trade page implements a simplified decentralized exchange using an Automated Market Maker.

Current functionality includes:

- MTK → ETH swap
- Liquidity provision
- Liquidity removal
- LP token minting and burning
- Pool reserve visualization
- Estimated output preview

The pricing mechanism follows the constant product formula (x × y = k).

## History

The History page provides the foundation for transaction tracking.

Current version:

- History UI implemented
- Ready for smart contract event integration

Planned improvements:

- Event-based transaction history
- Automatic timeline generation
- On-chain activity indexing

# Smart Contracts

## MyToken (ERC-20)

- OpenZeppelin ERC-20 implementation
- Transfer
- Approve
- TransferFrom

## Staking

- Deposit
- Withdraw
- Claim rewards
- Time-based reward distribution
- rewardPerToken accounting model

## Automated Market Maker

- Token ↔ ETH swaps
- Liquidity provision
- Liquidity removal
- LP token issuance
- Constant product pricing model

# Tech Stack

## Blockchain

- Solidity
- Hardhat
- OpenZeppelin

## Frontend

- React
- Vite
- Tailwind CSS
- Ethers.js
- MetaMask

## Network

- Sepolia Testnet

# Learning Outcomes

Through this project, I explored:

- ERC-20 token implementation
- Smart contract interaction with Ethers.js
- MetaMask integration
- Reward distribution algorithms
- Automated Market Maker mechanics
- Liquidity pool management
- LP token economics
- React state management for Web3 applications
- Integration of multiple smart contracts into a unified product

# Future Improvements

- Event-based transaction history
- Slippage tolerance settings
- Bidirectional token swapping (MTK ↔ ETH)
- Portfolio valuation in USD
- Price impact calculation refinement
- Responsive mobile optimization
- Comprehensive Hardhat test suite