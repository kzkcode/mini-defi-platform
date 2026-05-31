const { ethers } = require("hardhat");

async function main() {
  const Token = await ethers.getContractFactory("MyToken");
  const token = await Token.deploy(
    ethers.utils.parseEther("1000000")
  );
  await token.deployed();

  console.log("Token deployed to:", token.address);

  const Staking = await ethers.getContractFactory("Staking");
  const staking = await Staking.deploy(token.address);
  await staking.deployed();

  console.log("Staking deployed to:", staking.address);

  await token.transfer(
    staking.address,
    ethers.utils.parseEther("500000")
  );
  console.log("Reward tokens funded.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});