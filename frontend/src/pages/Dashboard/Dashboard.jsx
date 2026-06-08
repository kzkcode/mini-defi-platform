import { useEffect, useState } from "react";
import { ethers } from "ethers";

export default function Dashboard({
  account,
  contract,
}) {
  const [balance, setBalance] = useState("0");

  useEffect(() => {
    async function loadBalance() {
      if (!contract || !account) return;

      try {
        const b = await contract.balanceOf(account);
        
        setBalance(
          Number(
            ethers.formatUnits(b, 18)
          ).toFixed(2)
        );
      } catch (err) {
        console.error(err);
      }
    }

    loadBalance();
  }, [contract, account]);

  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-bold">
        Dashboard
      </h1>

      {/* Total Value */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600">
        <p className="text-sm text-white/80">
          Total Portfolio Value
        </p>
        <p className="text-3xl font-bold">
          $1,240.25
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4">

        {[
          ["Wallet Balance", `${balance} MTK`],
          ["Staked Amount", "300 MTK"],
          ["Pending Rewards", "12.34 MTK"],
          ["LP Position Value", "428.60 MTK"],
        ].map(([title, value]) => (
          <div
            key={title}
            className="p-5 rounded-xl bg-white/5 border border-white/10"
          >
            <p className="text-gray-400 text-sm">
              {title}
            </p>

            <p className="text-xl font-semibold mt-1">
              {value}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
}