import { useState } from "react";
import { ethers } from "ethers";

export default function TransferForm({ contract, darkMode }) {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");

  const handleTransfer = async (e) => {
    e.preventDefault();

    if (!contract) {
      setStatus("Contract not loaded.");
      return;
    }

    try {
      setStatus("送金中...");

      const decimals = await contract.decimals();
      const amountParsed = ethers.parseUnits(amount, decimals);

      const tx = await contract.transfer(recipient, amountParsed);
      await tx.wait();

      setStatus("送金完了！");
      setAmount("");
      setRecipient("");
    } catch (err) {
      console.error(err);
      setStatus("送金失敗: " + err.message);
    }
  };

  return (
    <form
      onSubmit={handleTransfer}
      className={`mt-6 p-6 rounded-2xl shadow-sm border w-full ${
        darkMode
          ? "bg-gray-700 border-gray-600 text-gray-100"
          : "bg-white border-gray-200 text-gray-800"
      }`}
    >
      <h2 className="text-lg font-semibold mb-4">
        Send MTK Tokens
      </h2>

      <label className="block mb-3">
        <span className="text-sm">{darkMode ? "Recipient Address" : "Recipient Address"}</span>
        <input
          type="text"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          placeholder="0x1234..."
          className={`mt-1 w-full px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 ${
            darkMode
              ? "bg-gray-800 border-gray-600 text-white focus:ring-indigo-500"
              : "bg-gray-50 border-gray-300 text-gray-700 focus:ring-indigo-500"
          }`}
        />
      </label>

      <label className="block mb-4">
        <span className="text-sm">{darkMode ? "Amount (MTK)" : "Amount (MTK)"}</span>
        <input
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="10"
          className={`mt-1 w-full px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 ${
            darkMode
              ? "bg-gray-800 border-gray-600 text-white focus:ring-indigo-500"
              : "bg-gray-50 border-gray-300 text-gray-700 focus:ring-indigo-500"
          }`}
        />
      </label>

      <button
        type="submit"
        className="w-full py-2 bg-blue-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition"
      >
        Send Tokens
      </button>

      {status && (
        <p className="mt-3 text-sm break-words">
          {darkMode ? "text-gray-300" : "text-gray-600"}
          {status}
        </p>
      )}
    </form>
  );
}