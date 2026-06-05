export default function History() {
  const history = [
    { type: "Stake", amount: "+100 DFI", date: "2024/05/20" },
    { type: "Claim Reward", amount: "+5.23 DFI", date: "2024/05/19" },
    { type: "Swap", amount: "-50 DFI", date: "2024/05/18" },
    { type: "Add Liquidity", amount: "+10 LP", date: "2024/05/17" },
  ];

  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-bold">History</h1>

      <div className="space-y-3">

        {history.map((item, i) => (
          <div
            key={i}
            className="p-4 rounded-xl bg-white/5 border border-white/10 flex justify-between"
          >
            <div>
              <p className="font-semibold">{item.type}</p>
              <p className="text-sm text-gray-400">{item.date}</p>
            </div>

            <div className="font-semibold">
              {item.amount}
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}