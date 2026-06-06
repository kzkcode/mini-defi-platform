import { useEffect, useState } from "react";
import { shortenAddress } from "../../utils/address";

export default function WalletConnector({ onConnect }) {
  const [addr, setAddr] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function check() {
      if (!window.ethereum) return;

      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      if (accounts.length > 0) {
        setAddr(accounts[0]);
        onConnect?.(accounts[0]);
      }
    }

    check();
  }, [onConnect]);

  async function connect() {
    if (!window.ethereum) {
      alert("MetaMask is required");
      return;
    }

    try {
      setLoading(true);

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const account = accounts?.[0];
      if (!account) return;

      setAddr(account);
      onConnect?.(account);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="shrink-0">

      {/* 未接続 */}
      {!addr ? (
        <button
          onClick={connect}
          disabled={loading}
          className="
            px-3 py-1.5 text-sm rounded-lg
            bg-blue-600/80 hover:bg-blue-500
            text-white transition
            disabled:opacity-50
          "
        >
          {loading ? "Connecting..." : "Connect MetaMask"}
        </button>
      ) : (
        /* 接続済 */
        <button
          onClick={connect}
          className="
            px-3 py-1.5 text-xs rounded-lg
            bg-white/5 border border-white/10
            text-gray-300 font-mono
            hover:bg-white/10 transition
          "
        >
          {shortenAddress(addr)} ▼
        </button>
      )}

    </div>
  );
}