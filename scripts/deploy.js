const { ethers } = require("hardhat");

async function main() {
  // コントラクトを取得
  const MyToken = await ethers.getContractFactory("MyToken");

  // トークンの初期供給量（例: 100万トークン）
  const initialSupply = ethers.utils.parseUnits("1000000", 18);

  // デプロイ（引数を渡す）
  const myToken = await MyToken.deploy(initialSupply);

  // デプロイ完了を待つ
  await myToken.deployed();

  console.log("MyToken deployed to:", myToken.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });