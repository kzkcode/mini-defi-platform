export default function Dashboard() {
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {[
          ["Wallet Balance", "500 DFI"],
          ["Staked Amount", "300 DFI"],
          ["Pending Rewards", "12.34 DFI"],
          ["LP Position Value", "428.60 DFI"],
        ].map(([title, value]) => (
          <div
            key={title}
            className="p-5 rounded-xl bg-white/5 border border-white/10"
          >
            <p className="text-gray-400 text-sm">{title}</p>
            <p className="text-xl font-semibold mt-1">{value}</p>
          </div>
        ))}
      </div>

    </div>
  );
}