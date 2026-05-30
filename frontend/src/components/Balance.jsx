import { useEffect, useState } from "react";
import { ethers } from "ethers";

export default function Balance({ contract, account, darkMode }) {
  const [balance, setBalance] = useState("loading");

  useEffect(() => {
    let mounted = true;
    async function load() {
      const b = await contract.balanceOf(account);
      if (!mounted) return;
      setBalance(ethers.formatUnits(b, 18));
    }
    load();
    return () => { mounted = false; };
  }, [contract, account]);

  return (
    <div
      className={`mt-6 p-6 rounded-2xl shadow-sm border ${
        darkMode
          ? "bg-gray-700 border-gray-600 text-gray-100"
          : "bg-white border-gray-200 text-gray-800"
      }`}
    >
      <h2 className="text-lg font-semibold mb-2">
        Your Balance
      </h2>

      <div className="text-2xl font-bold text-blue-500">
        {balance}
        <span className={`ml-1 text-lg ${darkMode ? "text-gray-300" : "text-gray-600"}`}>MTK</span>
      </div>
    
    </div>
  );
}