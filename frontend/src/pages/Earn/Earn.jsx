import { useEffect, useState, useCallback } from "react";
import { ethers } from "ethers";

export default function Earn({
  account,
  stakingContract,        // READ
  stakingWriteContract,   // WRITE
  tokenContract,
}) {
  const [amount, setAmount] = useState("");
  const [staked, setStaked] = useState("0");
  const [earned, setEarned] = useState("0");
  const [rewardRate, setRewardRate] = useState("0");
  const [totalStaked, setTotalStaked] = useState("0");
  const [status, setStatus] = useState("");

  // ========================
  // READデータ取得
  // ========================
  const fetchData = useCallback(async () => {
    if (!stakingContract || !account) return;

    try {
      const stakedValue = await stakingContract.balances(account);
      const earnedValue = await stakingContract.earned(account);
      const rateValue = await stakingContract.rewardRate();
      const totalValue = await stakingContract.totalSupply();

      setStaked(ethers.formatEther(stakedValue));
      setEarned(ethers.formatEther(earnedValue));
      setRewardRate(ethers.formatEther(rateValue));
      setTotalStaked(ethers.formatEther(totalValue));

    } catch (err) {
      console.error("fetch error:", err);
    }
  }, [stakingContract, account]);

  useEffect(() => {
    if (!stakingContract || !account) return;

    let alive = true;

    const load = async () => {
      try {
        const stakedValue = await stakingContract.balances(account);
        const earnedValue = await stakingContract.earned(account);
        const rateValue = await stakingContract.rewardRate();
        const totalValue = await stakingContract.totalSupply();

        if (!alive) return;

        setStaked(ethers.formatEther(stakedValue));
        setEarned(ethers.formatEther(earnedValue));
        setRewardRate(ethers.formatEther(rateValue));
        setTotalStaked(ethers.formatEther(totalValue));
      } catch (err) {
        console.error("fetch error:", err);
      }
    };

    // 初回ロード（OK）
    load();

  // interval
  const interval = setInterval(load, 5000);

  return () => {
    alive = false;
    clearInterval(interval);
  };
}, [stakingContract, account]);

  // ========================
  // STAKE
  // ========================
  const stake = async () => {
    try {
      console.log("stake clicked");

      if (!stakingWriteContract || !tokenContract || !amount) {
        console.log("missing deps", {
          stakingWriteContract,
          tokenContract,
          amount,
        });
        return;
      }

      const wei = ethers.parseEther(amount);

      console.log("allowance check");

      const allowance = await tokenContract.allowance(
        account,
        stakingWriteContract.target
      );

      console.log("allowance:", allowance.toString());

      if (allowance < wei) {
        console.log("approving...");
        const tx = await tokenContract.approve(
          stakingWriteContract.target,
          wei
        );
        await tx.wait();
      }

      console.log("staking...");

      const tx = await stakingWriteContract.deposit(wei);
      console.log("tx sent:", tx.hash);

      await tx.wait();

      console.log("stake done");
      setStatus("Success");

    } catch (e) {
      console.error("STAKE ERROR:", e);
      setStatus("Stake failed");
    }
  };

  // ========================
  // UNSTAKE
  // ========================
  const unstake = async () => {
    if (!stakingWriteContract || !amount) return;

    try {
      const wei = ethers.parseEther(amount);

      setStatus("Withdrawing...");

      const tx = await stakingWriteContract.withdraw(wei);
      await tx.wait();

      setStatus("Withdraw complete");
      setAmount("");
      fetchData();

    } catch (err) {
      console.error(err);
      setStatus("Unstake failed");
    }
  };

  // ========================
  // CLAIM
  // ========================
  const claim = async () => {
    if (!stakingWriteContract) return;

    try {
      setStatus("Claiming rewards...");

      const tx = await stakingWriteContract.claimReward();
      await tx.wait();

      setStatus("Rewards claimed");
      fetchData();

    } catch (err) {
      console.error(err);
      setStatus("Claim failed");
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
        <button onClick={stake} className="px-4 py-2 rounded-lg bg-green-500">
          Stake
        </button>

        <button onClick={unstake} className="px-4 py-2 rounded-lg bg-yellow-500">
          Unstake
        </button>

        <button onClick={claim} className="px-4 py-2 rounded-lg bg-blue-500">
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