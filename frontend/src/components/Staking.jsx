import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import stakingAbi from "../contracts/Staking.json";
import tokenAbi from "../contracts/MyToken.json";

const STAKING_ADDRESS = import.meta.env.VITE_STAKING_ADDRESS;

export default function Staking({ provider, account, tokenAddress }) {
  const [staking, setStaking] = useState(null);
  const [token, setToken] = useState(null);
  const [staked, setStaked] = useState("0");
  const [earned, setEarned] = useState("0");
  const [rewardRate, setRewardRate] = useState("0");
  const [apr, setApr] = useState("0");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");

  // Initialize contracts
  useEffect(() => {
    if (!provider || !account) return;

    (async () => {
      const signer = await provider.getSigner();
      const stakingContract = new ethers.Contract(
        STAKING_ADDRESS,
        stakingAbi.abi,
        signer
      );
      const tokenContract = new ethers.Contract(
        tokenAddress,
        tokenAbi.abi,
        signer
      );

      setStaking(stakingContract);
      setToken(tokenContract);
    })();
  }, [provider, account, tokenAddress]);

  // Refresh staking info
  const refresh = useCallback(async () => {
    if (!staking || !account) return;

    const stakedValue = await staking.balances(account);
    const earnedValue = await staking.earned(account);
    const rateValue = await staking.rewardRate();
    const totalStakedValue = await staking.totalSupply(); // ← 修正

    setStaked(ethers.formatEther(stakedValue));
    setEarned(ethers.formatEther(earnedValue));
    setRewardRate(ethers.formatEther(rateValue));

    // APR calculation
    const aprCalc =
    totalStakedValue > 0n
        ? (rateValue * 365n * 24n * 60n * 60n * 100n) / totalStakedValue
        : 0n;

    setApr(Number(aprCalc));
    }, [staking, account]);

  // Auto-update earned() every few seconds
  useEffect(() => {
    if (!staking || !account) return;

    const interval = setInterval(() => {
      refresh();
    }, 4000);

    return () => clearInterval(interval);
  }, [staking, account, refresh]);

  // Deposit tokens
  const deposit = async () => {
    if (!staking || !token || !amount) return;

    const wei = ethers.parseEther(amount);
    setStatus("Checking allowance...");

    const allowance = await token.allowance(account, STAKING_ADDRESS);

    if (allowance < wei) {
      setStatus("Approving tokens...");
      const approveTx = await token.approve(STAKING_ADDRESS, wei);
      await approveTx.wait();
    }

    setStatus("Depositing...");

    // Optimistic update
    setStaked((prev) => (Number(prev) + Number(amount)).toString());
    setAmount("");

    const tx = await staking.deposit(wei);
    await tx.wait();

    setStatus("Deposit confirmed!");
    refresh();
  };

  // Withdraw tokens
  const withdraw = async () => {
    if (!staking || !amount) return;

    const wei = ethers.parseEther(amount);
    setStatus("Withdrawing...");

    // Optimistic update
    setStaked((prev) => (Number(prev) - Number(amount)).toString());
    setAmount("");

    const tx = await staking.withdraw(wei);
    await tx.wait();

    setStatus("Withdraw confirmed!");
    refresh();
  };

  // Claim reward
  const claim = async () => {
    if (!staking) return;

    setStatus("Claiming rewards...");

    const tx = await staking.claimReward();
    await tx.wait();

    setStatus("Rewards claimed!");
    refresh();
  };

  return (
    <div className="p-6 bg-gray-700 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-white mb-4">Staking DApp</h2>

      {!account && <p className="text-white mb-4">Please connect your wallet</p>}

      {status && <p className="text-blue-300 mb-4">{status}</p>}

      {account && staking && token && (
        <>
          <p className="text-gray-300 mb-2">Connected: {account}</p>

          <h3 className="text-xl font-semibold text-white mt-4 mb-2">
            Your Staking Info
          </h3>
          <p className="text-gray-200">Staked: {staked} MTK</p>
          <p className="text-gray-200">Earned: {earned} MTK</p>

          <h3 className="text-xl font-semibold text-white mt-6 mb-2">
            Staking Metrics
          </h3>
          <p className="text-gray-300">Reward Rate: {rewardRate} MTK / sec</p>
          <p className="text-gray-300 mb-4">APR: {apr}%</p>

          <input
            type="text"
            placeholder="Amount (MTK)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full mb-4 p-2 rounded-md bg-gray-600 text-white placeholder-gray-300"
          />

          <div className="flex space-x-2">
            <button
              onClick={deposit}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md font-semibold"
            >
              Deposit
            </button>
            <button
              onClick={withdraw}
              className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-md font-semibold"
            >
              Withdraw
            </button>
            <button
              onClick={claim}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-md font-semibold"
            >
              Claim Reward
            </button>
          </div>
        </>
      )}
    </div>
  );
}