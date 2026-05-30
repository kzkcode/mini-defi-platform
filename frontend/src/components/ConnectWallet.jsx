import { useState } from "react";

export default function ConnectWallet({ onConnect, darkMode }) {
  const [addr, setAddr] = useState(null);

  async function connect() {
    if (!window.ethereum) return alert("MetaMask が必要です");

    await window.ethereum.request({ method: "eth_requestAccounts" });
    const accounts = await window.ethereum.request({ method: "eth_accounts" });

    setAddr(accounts[0]);
    onConnect(accounts[0]);
  }

  function shortenAddress(address) {
      if (!address) return "";
      const len = 10;
      return `${address.slice(0, len)}...${address.slice(-len)}`;
  }

  return (
    <div className="w-full flex flex-col items-start gap-2">
      {/* Connect MetaMask ボタン */}
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

      {/* Connected アドレス */}
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