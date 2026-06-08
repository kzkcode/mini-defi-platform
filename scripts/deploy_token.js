const { ethers } = require("hardhat");

async function main() {
  const MyToken = await ethers.getContractFactory("MyToken");

  const initialSupply = 1_000_000;

  const token = await MyToken.deploy(initialSupply);

  await token.deployed();

  console.log("MYTOKEN_ADDRESS =", token.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});