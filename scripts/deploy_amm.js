require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
  const tokenAddress = process.env.MYTOKEN_ADDRESS;

  const AMM = await ethers.getContractFactory("AMM");
  const amm = await AMM.deploy(tokenAddress);
  await amm.deployed();

  console.log("AMM deployed to:", amm.address);
  console.log("LPToken deployed to:", await amm.lpToken());
}

main().catch(console.error);