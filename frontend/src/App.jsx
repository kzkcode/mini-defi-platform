import { useState } from "react";
import { ethers } from "ethers";
import ConnectWallet from "./components/ConnectWallet";
import Balance from "./components/Balance";
import TransferForm from "./components/ApproveTransferForm";
import tokenAbi from "./contracts/MyToken.json";

const MYTOKEN_ADDRESS = import.meta.env.VITE_MYTOKEN_ADDRESS;
console.log("MYTOKEN_ADDRESS:", MYTOKEN_ADDRESS);
console.log(tokenAbi);
console.log(tokenAbi.abi);

function App() {
  // provider は初期化時に一度だけ作る
  const [provider] = useState(() => {
    return window.ethereum ? new ethers.BrowserProvider(window.ethereum) : null;
  });

  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);

  // MetaMask 接続後に呼ばれる
  async function handleConnect(addr) {
    if (!provider) return alert("MetaMask が必要です");

    const signer = await provider.getSigner(); // v6では非同期
    setAccount(addr);

    const c = new ethers.Contract(MYTOKEN_ADDRESS, tokenAbi.abi, signer);
    setContract(c);
  }

  return (
    <div className="min-h-screen bg-gray-900 flex justify-center items-start py-16">
      <div className="w-full max-w-2xl bg-gray-800 shadow-xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-white">
          MyToken DApp
        </h1>

        <div className="mb-6">
          <ConnectWallet onConnect={handleConnect} darkMode />
        </div>

        {contract && account && (
          <div className="space-y-8">
            <Balance contract={contract} account={account} darkMode />

            <div className="border-t border-gray-700 pt-6">
              <TransferForm contract={contract} account={account} darkMode />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;