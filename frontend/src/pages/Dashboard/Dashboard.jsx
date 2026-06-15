import { useEffect, useState } from "react";
import { ethers } from "ethers";

export default function Dashboard({
  account,
  tokenContract,
  stakingContract,
  lpTokenContract,
}) {
  const [balance, setBalance] = useState("0");
  const [staked, setStaked] = useState("0");
  const [rewards, setRewards] = useState("0");
  const [lpPosition, setLpPosition] = useState("0");
  const [totalPortfolio, setTotalPortfolio] = useState("0");

  useEffect(() => {
    if (
      !account ||
      !tokenContract ||
      !stakingContract ||
      !lpTokenContract
    ) {
      return;
    }

    let alive = true;

    const loadData = async () => {
      try {
        // Wallet
        const wallet = await tokenContract.balanceOf(account);

        // Stake
        const stakedAmount =
          await stakingContract.balances(account);

        // Reward
        const reward =
          await stakingContract.earned(account);

        // LP Balance
        const lp =
          await lpTokenContract.balanceOf(account);

        if (!alive) return;

        const walletNum = Number(
          ethers.formatEther(wallet)
        );

        const stakedNum = Number(
          ethers.formatEther(stakedAmount)
        );

        const rewardNum = Number(
          ethers.formatEther(reward)
        );

        setBalance(walletNum.toFixed(2));

        setStaked(stakedNum.toFixed(2));

        setRewards(rewardNum.toFixed(2));

        setLpPosition(
          Number(
            ethers.formatEther(lp)
          ).toFixed(2)
        );

        // Total Portfolio (MTK only)
        setTotalPortfolio(
          (walletNum + stakedNum + rewardNum).toFixed(2)
        );

      } catch (err) {
        console.error("Dashboard load error:", err);
      }
    };

    loadData();

    const id = setInterval(loadData, 5000);

    return () => {
      alive = false;
      clearInterval(id);
    };
  }, [
    account,
    tokenContract,
    stakingContract,
    lpTokenContract,
  ]);

  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-bold">
        Dashboard
      </h1>

      {/* Portfolio */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600">
        <p className="text-sm text-white/80">
          Total Portfolio Value
        </p>

        <p className="text-3xl font-bold">
          {totalPortfolio} MTK
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4">

        {[
          ["Wallet Balance", `${balance} MTK`],
          ["Staked Amount", `${staked} MTK`],
          ["Pending Rewards", `${rewards} MTK`],
          ["LP Position", `${lpPosition} LP`],
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