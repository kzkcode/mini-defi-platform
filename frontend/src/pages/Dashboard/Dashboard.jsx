import { useEffect, useState } from "react";
import { ethers } from "ethers";

export default function Dashboard({
  account,
  contract,
  stakingContract,
}) {
  const [balance, setBalance] = useState("0");
  const [staked, setStaked] = useState("0");
  const [rewards, setRewards] = useState("0");

  useEffect(() => {
    async function loadData() {
      if (!contract || !stakingContract || !account) return;

      try {
        // ======================
        // Wallet Balance (ERC20)
        // ======================
        const b = await contract.balanceOf(account);

        setBalance(
          Number(ethers.formatUnits(b, 18)).toFixed(2)
        );

        // ======================
        // Staked Amount
        // ======================
        const s = await stakingContract.balances(account);

        setStaked(
          Number(ethers.formatUnits(s, 18)).toFixed(2)
        );

        // ======================
        // Pending Rewards
        // ======================
        const r = await stakingContract.earned(account);

        setRewards(
          Number(ethers.formatUnits(r, 18)).toFixed(2)
        );

      } catch (err) {
        console.error(err);
      }
    }

    loadData();
  }, [contract, stakingContract, account]);

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
          ["Staked Amount", `${staked} MTK`],
          ["Pending Rewards", `${rewards} MTK`],
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