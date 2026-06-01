import { useState } from "react";
import { ethers } from "ethers";
import { Routes, Route, NavLink } from "react-router-dom";

import ConnectWallet from "./components/ConnectWallet";
import Balance from "./components/Balance";
import TransferForm from "./components/ApproveTransferForm";
import Staking from "./components/Staking";
import AMM from "./components/AMM";
import tokenAbi from "./contracts/MyToken.json";
import { shortenAddress } from "./utils/address";


const TOKEN_ADDRESS = import.meta.env.VITE_MYTOKEN_ADDRESS;

function App() {
  const [provider] = useState(
    () => (window.ethereum ? new ethers.BrowserProvider(window.ethereum) : null)
  );
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);

  // Connect wallet and initialize contract
  async function handleConnect(addr) {
    if (!provider) return alert("MetaMask is required");

    const signer = await provider.getSigner();
    setAccount(addr);

    const c = new ethers.Contract(TOKEN_ADDRESS, tokenAbi.abi, signer);
    setContract(c);
  }

  // CSS classes for active/inactive nav links
  const activeClass = "text-white font-bold border-b-2 border-white";
  const inactiveClass = "text-gray-400 hover:text-white";

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center py-8">
      <div className="w-full max-w-2xl bg-gray-800 shadow-xl rounded-2xl p-8">

        <h1 className="text-3xl font-bold text-center mb-8 text-white">
          MyToken DApp
        </h1>

        {/* Wallet Connection */}
        {!account || !contract ? (
          <div className="flex flex-col items-center justify-center">
            <ConnectWallet onConnect={handleConnect} darkMode />
          </div>
        ) : (
          <>
            {/* Display connected address on top */}
            <p className="text-gray-200 mb-6 text-center">
              Connected : {shortenAddress(account)}
            </p>

            {/* Navigation Tabs */}
            <nav className="flex justify-around mb-6 border-b border-gray-700 pb-2">
              <NavLink
                to="/token"
                className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
              >
                Token
              </NavLink>
              <NavLink
                to="/staking"
                className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
              >
                Staking
              </NavLink>
              <NavLink
                to="/amm"
                className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
              >
                AMM
              </NavLink>
            </nav>

            {/* Page Content */}
            <div className="space-y-8">
              <Routes>
                {/* Home route: connected but no tab selected */}
                <Route
                  path="/"
                  element={
                    <div className="text-center text-gray-200">
                      Welcome! Select a tab above to interact with your tokens.
                    </div>
                  }
                />

                {/* Token page */}
                <Route
                  path="/token"
                  element={
                    <>
                      <Balance contract={contract} account={account} darkMode />
                      <div className="border-t border-gray-700 pt-6">
                        <TransferForm contract={contract} account={account} darkMode />
                      </div>
                    </>
                  }
                />

                {/* Staking page */}
                <Route
                  path="/staking"
                  element={
                    <Staking
                      provider={provider}
                      account={account}
                      tokenAddress={TOKEN_ADDRESS}
                    />
                  }
                />

                {/* AMM page */}
                <Route
                  path="/amm"
                  element={
                    <AMM
                      provider={provider}
                      account={account}
                      tokenAddress={TOKEN_ADDRESS}
                    />
                  }
                />
              </Routes>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;