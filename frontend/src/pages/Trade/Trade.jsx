import { useEffect, useState, useMemo } from "react";
import { ethers } from "ethers";

export default function Trade({
  account,
  ammContract,
  ammWriteContract,
  tokenWriteContract,
}) {
  const [tab, setTab] = useState("Swap");

  const [amountIn, setAmountIn] = useState("");
  const [reserveToken, setReserveToken] = useState("0");
  const [reserveETH, setReserveETH] = useState("0");
  const [liquidityToken, setLiquidityToken] = useState("");
  const [lpAmount, setLpAmount] = useState("");
  const [reserveTokenWei, setReserveTokenWei] = useState(0n);
  const [reserveETHWei, setReserveETHWei] = useState(0n);

  const [status, setStatus] = useState("");

  // =========================
  // DEBUG
  // =========================
  useEffect(() => {
    console.log("=== TRADE DEBUG ===");
    console.log("account:", account);
    console.log("ammContract:", ammContract);
    console.log("ammWriteContract:", ammWriteContract);
    console.log("tokenWriteContract:", tokenWriteContract);
  }, [account, ammContract, ammWriteContract, tokenWriteContract]);

  // =========================
  // POOL READ
  // =========================
  useEffect(() => {
    if (!ammContract) return;

    let alive = true;

    const load = async () => {
      try {
        const rToken = await ammContract.reserveToken();
        const rETH = await ammContract.reserveETH();

        if (!alive) return;

        setReserveTokenWei(rToken);
        setReserveETHWei(rETH);

        setReserveToken(ethers.formatEther(rToken));
        setReserveETH(ethers.formatEther(rETH));
      } catch (e) {
        console.error("POOL ERROR:", e);
      }
    };

    load();
    const id = setInterval(load, 5000);

    return () => {
      alive = false;
      clearInterval(id);
    };
  }, [ammContract]);

  // =========================
  // 見積もり
  // =========================
  const estimatedOut = useMemo(() => {
    if (!amountIn || !reserveToken || !reserveETH) return "";

    try {
      const x = Number(reserveToken);
      const y = Number(reserveETH);
      const dx = Number(amountIn);

      if (x <= 0 || y <= 0 || dx <= 0) return "";

      // constant product AMM
      const dy = (dx * y) / (x + dx);

      return dy.toFixed(6);
    } catch (e) {
      console.error(e);
      return "";
    }
  }, [amountIn, reserveToken, reserveETH]);

  // =========================
  // Price Impact
  // =========================
  const priceImpact = useMemo(() => {
    if (!amountIn || !estimatedOut) return "";

    try {
      const x = Number(reserveToken);
      const y = Number(reserveETH);
      const dx = Number(amountIn);
      const dy = Number(estimatedOut);

      if (x <= 0 || y <= 0 || dx <= 0 || dy <= 0) return "";

      const marketPrice = y / x;
      const executionPrice = dy / dx;

      const impact =
        ((marketPrice - executionPrice) / marketPrice) * 100;

      return impact.toFixed(2);
    } catch (e) {
      console.error(e);
      return "";
    }
  }, [amountIn, estimatedOut, reserveToken, reserveETH]);

  // =========================
  // Min Received
  // =========================
  const minReceived = useMemo(() => {
    if (!estimatedOut) return "";

    // 現状はスリッページ0%前提
    return Number(estimatedOut).toFixed(6);

    // 将来 0.5% にするなら
    // return (Number(estimatedOut) * 0.995).toFixed(6);
  }, [estimatedOut]);

  // =========================
  // Liquidity ETH estimate
  // =========================
  const estimatedLiquidityETH = useMemo(() => {
    if (!liquidityToken) return "";

    try {
      const tokenWei = ethers.parseEther(liquidityToken);

      const ethWei =
        reserveETHWei * tokenWei / reserveTokenWei;

      return ethers.formatEther(ethWei);

    } catch {
      return "";
    }
  }, [liquidityToken, reserveTokenWei, reserveETHWei]);

  // =========================
  // SWAP
  // =========================
  const swap = async () => {
    try {
      if (!ammWriteContract || !tokenWriteContract || !amountIn || !account)
        return;

      const wei = ethers.parseEther(amountIn);

      const allowance = await tokenWriteContract.allowance(
        account,
        ammWriteContract.target
      );

      if (allowance < wei) {
        const tx = await tokenWriteContract.approve(
          ammWriteContract.target,
          wei
        );
        await tx.wait();
      }

      const tx2 = await ammWriteContract.swapTokenForETH(
        wei,
        0
      );

      await tx2.wait();

      setStatus("Swap success");
      setAmountIn("");
    } catch (e) {
      console.error("SWAP ERROR:", e);
      setStatus("Swap failed");
    }
  };

  const addLiquidity = async () => {
    try {
      if (
        !ammWriteContract ||
        !tokenWriteContract ||
        !account ||
        !liquidityToken ||
        !estimatedLiquidityETH
      ) {
        return;
      }

      const tokenWei = ethers.parseEther(liquidityToken);
      const ethWei = ethers.parseEther(estimatedLiquidityETH);

      const allowance = await tokenWriteContract.allowance(
        account,
        ammWriteContract.target
      );

      if (allowance < tokenWei) {
        const tx = await tokenWriteContract.approve(
          ammWriteContract.target,
          tokenWei
        );

        await tx.wait();
      }

      const tx = await ammWriteContract.addLiquidity(
        tokenWei,
        {
          value: ethWei,
        }
      );

      await tx.wait();

      setStatus("Liquidity added");

      setLiquidityToken("");
    } catch (e) {
      console.error("ADD LIQUIDITY ERROR:", e);

      setStatus("Add liquidity failed");
    }
  };

  const removeLiquidity = async () => {
    try {
      if (!ammWriteContract || !lpAmount) return;

      const lpWei = ethers.parseEther(lpAmount);

      setStatus("Removing liquidity...");

      const tx = await ammWriteContract.removeLiquidity(
        lpWei
      );

      await tx.wait();

      setStatus("Liquidity removed");

      setLpAmount("");

    } catch (e) {
      console.error("REMOVE ERROR:", e);
      setStatus("Remove liquidity failed");
    }
  };

  // =========================
  // UI
  // =========================
  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-bold">Trade (AMM)</h1>

      {status && (
        <div className="text-blue-300 text-sm">
          {status}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2">
        {["Swap", "Liquidity", "Remove"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg ${
              tab === t ? "bg-white/20" : "bg-white/10"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Swap */}
      {tab === "Swap" && (
        <div className="p-5 rounded-xl bg-white/5 border border-white/10 space-y-4">

          <div>
            <p className="text-sm text-gray-400">From</p>

            <input
              className="w-full p-3 bg-black/40 border border-white/10 rounded-lg"
              value={amountIn}
              onChange={(e) => setAmountIn(e.target.value)}
              placeholder="0.0 MTK"
            />
          </div>

          <div>
            <p className="text-sm text-gray-400">
              To (estimated)
            </p>

            <input
              className="w-full p-3 bg-black/40 border border-white/10 rounded-lg"
              value={estimatedOut}
              disabled
              placeholder="0.0 ETH"
            />
          </div>

          <div className="text-sm text-gray-400 space-y-1">
            <p>
              Price Impact:{" "}
              {priceImpact ? `${priceImpact}%` : "--"}
            </p>

            <p>
              Min Received:{" "}
              {minReceived
                ? `${minReceived} ETH`
                : "--"}
            </p>
          </div>

          <button
            onClick={swap}
            className="w-full py-3 rounded-lg bg-purple-600 font-bold"
          >
            Swap
          </button>
        </div>
      )}
      {tab === "Liquidity" && (
        <div className="p-5 rounded-xl bg-white/5 border border-white/10 space-y-4">

          <div>
            <p className="text-sm text-gray-400">
              Token Amount
            </p>

            <input
              className="w-full p-3 bg-black/40 border border-white/10 rounded-lg"
              value={liquidityToken}
              onChange={(e) =>
                setLiquidityToken(e.target.value)
              }
              placeholder="0.0 MTK"
            />
          </div>

          <div>
            <p className="text-sm text-gray-400">
              ETH Amount
            </p>

            <input
              className="w-full p-3 bg-black/40 border border-white/10 rounded-lg"
              value={estimatedLiquidityETH}
              disabled
              placeholder="0.0 ETH"
            />
          </div>

          <button
            onClick={addLiquidity}
            className="w-full py-3 rounded-lg bg-green-600 font-bold"
          >
            Add Liquidity
          </button>

        </div>
      )}

      {tab === "Remove" && (
        <div className="p-5 rounded-xl bg-white/5 border border-white/10 space-y-4">

          <div>
            <p className="text-sm text-gray-400">
              LP Amount
            </p>

            <input
              className="w-full p-3 bg-black/40 border border-white/10 rounded-lg"
              value={lpAmount}
              onChange={(e) =>
                setLpAmount(e.target.value)
              }
              placeholder="0.0 LP"
            />
          </div>

          <button
            onClick={removeLiquidity}
            className="w-full py-3 rounded-lg bg-red-600 font-bold"
          >
            Remove Liquidity
          </button>

        </div>
      )}

      {/* Pool */}
      <div className="p-5 rounded-xl bg-white/5 border border-white/10">
        <h2 className="font-semibold mb-2">
          Pool Reserves
        </h2>

        <p>Token: {reserveToken}</p>
        <p>ETH: {reserveETH}</p>
      </div>

    </div>
  );
}