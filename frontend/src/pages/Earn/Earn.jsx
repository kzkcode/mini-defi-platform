export default function Earn() {
  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-bold">Earn (Staking)</h1>

      {/* Overview */}
      <div className="p-5 rounded-xl bg-white/5 border border-white/10 space-y-2">
        <p className="text-sm text-gray-400">Staking Overview</p>

        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>APR: 12.45%</div>
          <div>Total Staked: 1,234,567 DFI</div>
          <div>Reward Rate: 0.028 DFI/sec</div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        {["Stake", "Unstake", "Claim"].map((t) => (
          <button
            key={t}
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20"
          >
            {t}
          </button>
        ))}
      </div>

      {/* Stake Panel */}
      <div className="p-5 rounded-xl bg-white/5 border border-white/10 space-y-4">

        <input
          className="w-full p-3 rounded-lg bg-black/40 border border-white/10"
          placeholder="Amount"
        />

        <div className="flex gap-2">
          {["25%", "50%", "75%", "Max"].map((p) => (
            <button
              key={p}
              className="px-3 py-1 rounded bg-white/10 text-sm"
            >
              {p}
            </button>
          ))}
        </div>

        <button className="w-full py-3 rounded-lg bg-green-500 font-bold">
          Stake DFI
        </button>
      </div>

      {/* Info */}
      <div className="p-5 rounded-xl bg-white/5 border border-white/10 space-y-2">
        <h2 className="font-semibold">Your Staking Info</h2>
        <p>Staked: 300 DFI</p>
        <p>Rewards: 12.34 DFI</p>
        <p>Total Earned: 45.67 DFI</p>
      </div>

    </div>
  );
}