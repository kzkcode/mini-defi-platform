require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
  const tokenAddress = process.env.MYTOKEN_ADDRESS;

  const Staking = await ethers.getContractFactory("Staking");
  const staking = await Staking.deploy(tokenAddress);
  await staking.deployed();

  console.log("Staking deployed to:", staking.address);

  const token = await ethers.getContractAt("MyToken", tokenAddress);
  await token.transfer(
    staking.address,
    ethers.utils.parseUnits("500000", 18)
  );

  console.log("Reward tokens funded.");
}

main().catch(console.error);