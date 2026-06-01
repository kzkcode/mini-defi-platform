const { ethers } = require("hardhat");

async function main() {
  const MyToken = await ethers.getContractFactory("MyToken");
  const token = await MyToken.deploy(
    ethers.utils.parseUnits("1000000", 18)
  );
  await token.deployed();

  console.log("MYTOKEN_ADDRESS=", token.address);
}

main().catch(console.error);