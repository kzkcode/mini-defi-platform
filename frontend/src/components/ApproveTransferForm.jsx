import { useState } from "react";
import { ethers } from "ethers";

export default function TokenForm({ contract, account, darkMode }) {
  const [recipient, setRecipient] = useState("");     
  const [transferAmount, setTransferAmount] = useState(""); 

  const [spender, setSpender] = useState("");         
  const [approveAmount, setApproveAmount] = useState("");   

  const [to, setTo] = useState("");                   
  const [transferFromAmount, setTransferFromAmount] = useState(""); 

  const [transferStatus, setTransferStatus] = useState("");
  const [approveStatus, setApproveStatus] = useState("");
  const [transferFromStatus, setTransferFromStatus] = useState("");

  // -------------------
  // Transfer
  const handleTransfer = async (e) => {
    e.preventDefault();
    if (!contract) return setTransferStatus("Error: Contract not loaded.");

    try {
      setTransferStatus("Processing transfer...");
      const decimals = await contract.decimals();
      const parsedAmount = ethers.parseUnits(transferAmount, decimals);

      const tx = await contract.transfer(recipient, parsedAmount);
      await tx.wait();

      setTransferStatus("Transfer completed!");
      setRecipient("");
      setTransferAmount("");
    } catch (err) {
      console.error(err);
      setTransferStatus("Error: Transfer failed: " + err.message);
    }
  };

  // -------------------
  // Approve
  const handleApprove = async (e) => {
    e.preventDefault();
    if (!contract) return setApproveStatus("Error: Contract not loaded.");

    try {
      setApproveStatus("Processing approval...");
      const decimals = await contract.decimals();
      const parsedAmount = ethers.parseUnits(approveAmount, decimals);

      const tx = await contract.approve(spender, parsedAmount);
      await tx.wait();

      setApproveStatus("Approval completed!");
      setApproveAmount("");
    } catch (err) {
      console.error(err);
      setApproveStatus("Error: Approval failed: " + err.message);
    }
  };

  // -------------------
  // TransferFrom
  const handleTransferFrom = async (e) => {
    e.preventDefault();
    if (!contract) return setTransferFromStatus("Error: Contract not loaded.");
    if (!account) return setTransferFromStatus("Error: No connected address detected.");
    if (!spender) return setTransferFromStatus("Error: Please enter spender address.");

    try {
      setTransferFromStatus("Checking allowance...");
      const decimals = await contract.decimals();
      const parsedAmount = ethers.parseUnits(transferFromAmount, decimals);

      // check allowance
      const allowance = await contract.allowance(account, spender); // BigInt
      if (allowance < parsedAmount) {
        setTransferFromStatus(
          "Error: Approval required. Please approve the spender for this amount first."
        );
        return;
      }

      setTransferFromStatus("Executing TransferFrom...");
      const tx = await contract.transferFrom(account, to, parsedAmount);
      await tx.wait();

      setTransferFromStatus("TransferFrom successful!");
      setTo("");
      setTransferFromAmount("");
      setSpender("");
    } catch (err) {
      console.error(err);
      setTransferFromStatus("Error: TransferFrom failed: " + err.message);
    }
  };

  // -------------------
  // Status message class
  const getStatusClass = (status) => {
    if (!status) return "";
    if (status.startsWith("Error") || status.includes("failed") || status.includes("Approval required")) return "text-red-600";
    if (status.includes("Processing") || status.includes("Executing") || status.includes("Checking")) return "text-blue-600";
    return "text-green-600";
  };

  return (
    <form className={`mt-6 p-6 rounded-2xl shadow-sm border w-full ${darkMode ? "bg-gray-700 border-gray-600 text-gray-100" : "bg-white border-gray-200 text-gray-800"}`}>
      {/* Send Tokens */}
      <h2 className="text-lg font-semibold mb-4">Send Tokens</h2>
      <label className="block mb-3">
        <span className="text-sm">Recipient</span>
        <input
          type="text"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          placeholder="0xRecipient..."
          className={`mt-1 w-full px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 ${darkMode ? "bg-gray-800 border-gray-600 text-white focus:ring-indigo-500" : "bg-gray-50 border-gray-300 text-gray-700 focus:ring-indigo-500"}`}
        />
      </label>
      <label className="block mb-3">
        <span className="text-sm">Amount (MTK)</span>
        <input
          type="text"
          value={transferAmount}
          onChange={(e) => setTransferAmount(e.target.value)}
          placeholder="10"
          className={`mt-1 w-full px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 ${darkMode ? "bg-gray-800 border-gray-600 text-white focus:ring-indigo-500" : "bg-gray-50 border-gray-300 text-gray-700 focus:ring-indigo-500"}`}
        />
      </label>
      <button onClick={handleTransfer} className="w-full py-2 bg-blue-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition mb-2">Send Tokens</button>
      {transferStatus && <p className={`mt-1 text-base break-words ${getStatusClass(transferStatus)}`}>{transferStatus}</p>}

      {/* Approve */}
      <h2 className="text-lg font-semibold mt-6 mb-4">Approve</h2>
      <label className="block mb-3">
        <span className="text-sm">Spender Address</span>
        <input
          type="text"
          value={spender}
          onChange={(e) => setSpender(e.target.value)}
          placeholder="0xSpender..."
          className={`mt-1 w-full px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 ${darkMode ? "bg-gray-800 border-gray-600 text-white focus:ring-indigo-500" : "bg-gray-50 border-gray-300 text-gray-700 focus:ring-indigo-500"}`}
        />
      </label>
      <label className="block mb-3">
        <span className="text-sm">Amount (MTK)</span>
        <input
          type="text"
          value={approveAmount}
          onChange={(e) => setApproveAmount(e.target.value)}
          placeholder="10"
          className={`mt-1 w-full px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 ${darkMode ? "bg-gray-800 border-gray-600 text-white focus:ring-indigo-500" : "bg-gray-50 border-gray-300 text-gray-700 focus:ring-indigo-500"}`}
        />
      </label>
      <button onClick={handleApprove} className="w-full py-2 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-xl transition mb-2">Approve</button>
      {approveStatus && <p className={`mt-1 text-base break-words ${getStatusClass(approveStatus)}`}>{approveStatus}</p>}

      {/* TransferFrom */}
      <h2 className="text-lg font-semibold mt-6 mb-4">TransferFrom</h2>
      <label className="block mb-3">
        <span className="text-sm">Sender Address (from)</span>
        <input type="text" value={account || ""} readOnly className={`mt-1 w-full px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 ${darkMode ? "bg-gray-800 text-gray-100 border-gray-600 focus:ring-indigo-500" : "bg-white text-gray-900 border-gray-300 focus:ring-indigo-500"}`} />
      </label>
      <label className="block mb-3">
        <span className="text-sm">Recipient Address (to)</span>
        <input type="text" value={to} onChange={(e) => setTo(e.target.value)} placeholder="0xTo..." className={`mt-1 w-full px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 ${darkMode ? "bg-gray-800 border-gray-600 text-white focus:ring-indigo-500" : "bg-gray-50 border-gray-300 text-gray-700 focus:ring-indigo-500"}`} />
      </label>
      <label className="block mb-3">
        <span className="text-sm">Amount (MTK)</span>
        <input type="text" value={transferFromAmount} onChange={(e) => setTransferFromAmount(e.target.value)} placeholder="10" className={`mt-1 w-full px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 ${darkMode ? "bg-gray-800 border-gray-600 text-white focus:ring-indigo-500" : "bg-gray-50 border-gray-300 text-gray-700 focus:ring-indigo-500"}`} />
      </label>
      <button onClick={handleTransferFrom} className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl transition mb-2">TransferFrom</button>
      {transferFromStatus && <p className={`mt-1 text-base break-words ${getStatusClass(transferFromStatus)}`}>{transferFromStatus}</p>}
    </form>
  );
}