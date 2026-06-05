import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import ammAbi from "../contracts/AMM.json";
import tokenAbi from "../contracts/MyToken.json";
import { shortenAddress } from "../utils/address";

const AMM_ADDRESS = import.meta.env.VITE_AMM_ADDRESS;

export default function AMM({ provider, account, tokenAddress }) {
  const [amm, setAmm] = useState(null);
  const [token, setToken] = useState(null);

  const [reserveToken, setReserveToken] = useState("0");
  const [reserveETH, setReserveETH] = useState("0");

  const [amountIn, setAmountIn] = useState("");
  const [lpAmount, setLpAmount] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!provider || !account) return;

    (async () => {
      const signer = await provider.getSigner();

      const ammContract = new ethers.Contract(
        AMM_ADDRESS,
        ammAbi.abi,
        signer
      );

      const tokenContract = new ethers.Contract(
        tokenAddress,
        tokenAbi.abi,
        signer
      );

      setAmm(ammContract);
      setToken(tokenContract);
    })();
  }, [provider, account, tokenAddress]);

  const refresh = useCallback(async () => {
    if (!amm) return;

    const rToken = await amm.reserveToken();
    const rETH = await amm.reserveETH();

    setReserveToken(ethers.formatEther(rToken));
    setReserveETH(ethers.formatEther(rETH));
  }, [amm]);

  useEffect(() => {
    if (!amm) return;

    let cancelled = false;

    const load = async () => {
      const rToken = await amm.reserveToken();
      const rETH = await amm.reserveETH();

      if (!cancelled) {
        setReserveToken(ethers.formatEther(rToken));
        setReserveETH(ethers.formatEther(rETH));
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [amm]);

  const swap = async () => {
    if (!amm || !token || !amountIn) return;

    try {
      const wei = ethers.parseEther(amountIn);
      setStatus("Checking allowance...");

      const allowance = await token.allowance(account, AMM_ADDRESS);
      if (allowance < wei) {
        setStatus("Approving tokens...");
        const approveTx = await token.approve(AMM_ADDRESS, wei);
        await approveTx.wait();
      }

      setStatus("Swapping...");
      const tx = await amm.swapTokenForETH(wei, 0);
      await tx.wait();

      setAmountIn("");
      setStatus("Swap confirmed!");
      refresh();
    } catch (err) {
      console.error(err);
      setStatus("Swap failed");
    }
  };

  const removeLiquidity = async () => {
    if (!amm || !lpAmount) return;

    try {
      setStatus("Removing liquidity...");

      const wei = ethers.parseEther(lpAmount);
      const tx = await amm.removeLiquidity(wei);
      await tx.wait();

      setLpAmount("");
      setStatus("Liquidity removed!");
      refresh();
    } catch (err) {
      console.error(err);
      setStatus("Remove liquidity failed");
    }
  };

  return (
    <div className="p-6 bg-gray-700 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-white mb-4">AMM</h2>

      {!account && (
        <p className="text-white mb-4">Please connect your wallet</p>
      )}

      {status && <p className="text-blue-300 mb-4">{status}</p>}

      {account && amm && token && (
        <>
          <p className="text-gray-300 mb-2">
              Connected:{" "}
              <span className="font-mono text-white">
                  {shortenAddress(account)}
              </span>
          </p>

          <h3 className="text-xl font-semibold text-white mt-4 mb-2">
            Pool Reserves
          </h3>

          <p className="text-gray-200">Token: {reserveToken}</p>
          <p className="text-gray-200 mb-4">ETH: {reserveETH}</p>

          {/* Swap */}
          <h3 className="text-xl font-semibold text-white mt-6 mb-2">
            Swap Token → ETH
          </h3>

          <input
            type="text"
            placeholder="Amount In (MTK)"
            value={amountIn}
            onChange={(e) => setAmountIn(e.target.value)}
            className="w-full mb-3 p-2 rounded-md bg-gray-600 text-white"
          />

          <button
            onClick={swap}
            className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-md font-semibold mb-6"
          >
            Swap
          </button>

          {/* Remove Liquidity */}
          <h3 className="text-xl font-semibold text-white mb-2">
            Remove Liquidity
          </h3>

          <input
            type="text"
            placeholder="LP Amount"
            value={lpAmount}
            onChange={(e) => setLpAmount(e.target.value)}
            className="w-full mb-3 p-2 rounded-md bg-gray-600 text-white"
          />

          <button
            onClick={removeLiquidity}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-md font-semibold"
          >
            Remove
          </button>
        </>
      )}
    </div>
  );
}