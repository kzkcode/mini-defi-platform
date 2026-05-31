import { useState } from "react";
import { ethers } from "ethers";
import ConnectWallet from "./components/ConnectWallet";
import Balance from "./components/Balance";
import TransferForm from "./components/ApproveTransferForm";
import Staking from "./components/Staking";
import tokenAbi from "./contracts/MyToken.json";

const MYTOKEN_ADDRESS = import.meta.env.VITE_MYTOKEN_ADDRESS;
console.log("MYTOKEN_ADDRESS:", MYTOKEN_ADDRESS);
console.log(tokenAbi);
console.log(tokenAbi.abi);

function App() {
  const [provider] = useState(() =>
    window.ethereum ? new ethers.BrowserProvider(window.ethereum) : null
  );

  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);

  // Connect to ERC-20 token contract
  async function handleConnect(addr) {
    if (!provider) return alert("MetaMask is required");

    const signer = await provider.getSigner();
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

        {/* Wallet Connection */}
        <div className="mb-6">
          <ConnectWallet onConnect={handleConnect} darkMode />
        </div>

        {/* ERC-20 Token UI */}
        {contract && account && (
          <div className="space-y-8">

            {/* Display user balance */}
            <Balance contract={contract} account={account} darkMode />

            {/* Transfer / Approve form */}
            <div className="border-t border-gray-700 pt-6">
              <TransferForm contract={contract} account={account} darkMode />
            </div>

            {/* Staking UI */}
            <div className="border-t border-gray-700 pt-6">
              <Staking 
                provider={provider} 
                account={account} 
                tokenAddress={MYTOKEN_ADDRESS} 
                darkMode 
              />
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

export default App;