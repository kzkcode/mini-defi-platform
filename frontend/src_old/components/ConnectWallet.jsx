import { useState } from "react";
import { shortenAddress } from "../utils/address";

export default function ConnectWallet({ onConnect, darkMode }) {
  const [addr, setAddr] = useState(null);

  async function connect() {
    if (!window.ethereum) return alert("MetaMask is required");

    // Request account access
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const accounts = await window.ethereum.request({ method: "eth_accounts" });

    setAddr(accounts[0]);
    onConnect(accounts[0]);
  }

  return (
    <div className="w-full flex flex-col items-start gap-2">
      {/* Connect MetaMask button */}
      <button
        onClick={connect}
        className={`font-semibold px-4 py-2 rounded-xl shadow-md whitespace-nowrap transition ${
          darkMode
            ? "bg-blue-600 text-white hover:bg-blue-500"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        Connect MetaMask
      </button>

      {/* Display connected address */}
      {addr && (
        <div
          className={`px-3 py-2 rounded-xl border inline-flex items-center whitespace-nowrap ${
            darkMode
              ? "bg-gray-700 border-gray-600 text-gray-100"
              : "bg-gray-100 border-gray-300 text-gray-700"
          }`}
        >
          <span className="font-medium mr-1">Connected:</span>
          <span className="font-mono">{shortenAddress(addr)}</span>
        </div>
      )}
    </div>
  );
}