require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  const amm = await ethers.getContractAt(
    "AMM",
    process.env.AMM_ADDRESS
  );

  const token = await ethers.getContractAt(
    "MyToken",
    process.env.MYTOKEN_ADDRESS
  );

  const tokenAmount = ethers.utils.parseEther("1000");
  const ethAmount   = ethers.utils.parseEther("0.05");

  await token.approve(amm.address, tokenAmount);

  await amm.addLiquidity(
    tokenAmount,
    { value: ethAmount }
  );

  console.log("Liquidity added");
}

main().catch(console.error);