export default function Trade() {
  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-bold">Trade (AMM)</h1>

      {/* Tabs */}
      <div className="flex gap-2">
        {["Swap", "Liquidity", "Remove"].map((t) => (
          <button
            key={t}
            className="px-4 py-2 rounded-lg bg-white/10"
          >
            {t}
          </button>
        ))}
      </div>

      {/* Swap Box */}
      <div className="p-5 rounded-xl bg-white/5 border border-white/10 space-y-4">

        <div>
          <p className="text-sm text-gray-400">From</p>
          <input className="w-full p-3 bg-black/40 border border-white/10 rounded-lg" defaultValue="500" />
        </div>

        <div>
          <p className="text-sm text-gray-400">To (estimated)</p>
          <input className="w-full p-3 bg-black/40 border border-white/10 rounded-lg" defaultValue="0.02045" />
        </div>

        <div className="text-sm text-gray-400 space-y-1">
          <p>Price Impact: 0.32%</p>
          <p>Min Received: 0.02038 ETH</p>
        </div>

        <button className="w-full py-3 rounded-lg bg-purple-600 font-bold">
          Swap
        </button>
      </div>

      {/* Pool */}
      <div className="p-5 rounded-xl bg-white/5 border border-white/10">
        <h2 className="font-semibold mb-2">Pool Reserves</h2>
        <p>DFI: 102,218.30</p>
        <p>ETH: 4.2225</p>
      </div>

    </div>
  );
}