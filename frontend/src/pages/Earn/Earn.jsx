import { useEffect, useState } from "react";
import { ethers } from "ethers";

export default function Earn({
  account,
  stakingContract,
  tokenContract,
}) {
  const [amount, setAmount] = useState("");
  const [staked, setStaked] = useState("0");
  const [earned, setEarned] = useState("0");
  const [rewardRate, setRewardRate] = useState("0");
  const [totalStaked, setTotalStaked] = useState("0");
  const [status, setStatus] = useState("");

  // ========================
  // データ取得（effect内で完結）
  // ========================
  useEffect(() => {
    if (!stakingContract || !account) return;

    let isMounted = true;

    const fetchData = async () => {
      try {
        const stakedValue = await stakingContract.balances(account);
        const earnedValue = await stakingContract.earned(account);
        const rateValue = await stakingContract.rewardRate();
        const totalValue = await stakingContract.totalSupply();

        if (!isMounted) return;

        setStaked(ethers.formatEther(stakedValue));
        setEarned(ethers.formatEther(earnedValue));
        setRewardRate(ethers.formatEther(rateValue));
        setTotalStaked(ethers.formatEther(totalValue));
      } catch (err) {
        console.error("fetch error:", err);
      }
    };

    // 初回ロード
    fetchData();

    // 定期更新
    const interval = setInterval(() => {
      fetchData();
    }, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [stakingContract, account]);

  // ========================
  // stake
  // ========================
  const stake = async () => {
    if (!stakingContract || !tokenContract || !amount) return;

    try {
      const wei = ethers.parseEther(amount);

      setStatus("Checking allowance...");

      const allowance = await tokenContract.allowance(
        account,
        stakingContract.target
      );

      if (allowance < wei) {
        setStatus("Approving token...");
        const tx = await tokenContract.approve(
          stakingContract.target,
          wei
        );
        await tx.wait();
      }

      setStatus("Staking...");

      const tx = await stakingContract.deposit(wei);
      await tx.wait();

      setStatus("Staked successfully");

      setAmount("");
    } catch (err) {
      console.error(err);
      setStatus("Error occurred");
    }
  };

  // ========================
  // unstake
  // ========================
  const unstake = async () => {
    if (!stakingContract || !amount) return;

    try {
      const wei = ethers.parseEther(amount);

      setStatus("Withdrawing...");

      const tx = await stakingContract.withdraw(wei);
      await tx.wait();

      setStatus("Withdraw complete");

      setAmount("");
    } catch (err) {
      console.error(err);
      setStatus("Error occurred");
    }
  };

  // ========================
  // claim
  // ========================
  const claim = async () => {
    if (!stakingContract) return;

    try {
      setStatus("Claiming rewards...");

      const tx = await stakingContract.claimReward();
      await tx.wait();

      setStatus("Rewards claimed");
    } catch (err) {
      console.error(err);
      setStatus("Error occurred");
    }
  };

  // ========================
  // UI
  // ========================
  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-bold">Earn (Staking)</h1>

      {!account && (
        <p className="text-gray-400">Please connect wallet</p>
      )}

      {status && (
        <div className="text-blue-300 text-sm">{status}</div>
      )}

      {/* Overview */}
      <div className="p-5 rounded-xl bg-white/5 border border-white/10 space-y-2">
        <p className="text-sm text-gray-400">Staking Overview</p>

        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>APR: --</div>
          <div>Total Staked: {totalStaked} MTK</div>
          <div>Reward Rate: {rewardRate} / sec</div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={stake}
          className="px-4 py-2 rounded-lg bg-green-500"
        >
          Stake
        </button>

        <button
          onClick={unstake}
          className="px-4 py-2 rounded-lg bg-yellow-500"
        >
          Unstake
        </button>

        <button
          onClick={claim}
          className="px-4 py-2 rounded-lg bg-blue-500"
        >
          Claim
        </button>
      </div>

      {/* Input */}
      <div className="p-5 rounded-xl bg-white/5 border border-white/10 space-y-4">

        <input
          className="w-full p-3 rounded-lg bg-black/40 border border-white/10"
          placeholder="Amount (MTK)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <button
          onClick={stake}
          className="w-full py-3 rounded-lg bg-green-500 font-bold"
        >
          Stake MTK
        </button>
      </div>

      {/* Info */}
      <div className="p-5 rounded-xl bg-white/5 border border-white/10 space-y-2">
        <h2 className="font-semibold">Your Staking Info</h2>

        <p>Staked: {staked} MTK</p>
        <p>Rewards: {earned} MTK</p>
        <p>Total Pool: {totalStaked} MTK</p>
      </div>
    </div>
  );
}