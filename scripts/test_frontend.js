require("dotenv").config();
const { ethers } = require("hardhat");

// デプロイ済みのコントラクトアドレス
const tokenAddress = process.env.MYTOKEN_ADDRESS;
// 送金先アドレス
const recipient = process.env.RECIPIENT_ADDRESS;

async function main() {
    // Hardhat のプロバイダーに接続
    const provider = new ethers.providers.JsonRpcProvider(process.env.SEPOLIA_URL);

    // ウォレット作成
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    // コントラクトインスタンス作成
    const abi = [
        "function balanceOf(address) view returns (uint256)",
        "function transfer(address to, uint amount) returns (bool)"
    ];
    const token = new ethers.Contract(tokenAddress, abi, wallet);

    // 自分の残高確認
    const myBalance = await token.balanceOf(wallet.address);
    console.log("自分の残高:", ethers.utils.formatUnits(myBalance, 18));

    // 送金テスト（例: 0.01 トークン送る）
    const tx = await token.transfer(recipient, ethers.utils.parseUnits("0.01", 18));
    console.log("トランザクション送信:", tx.hash);

    // 送金完了を待つ
    await tx.wait();
    console.log("送金完了！");
}

main().catch((err) => {
    console.error(err);
});