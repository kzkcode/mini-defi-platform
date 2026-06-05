import { Link } from "react-router-dom";
import WalletConnector from "./WalletConnector";

export default function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0B0F17]/80 backdrop-blur">
      
      <div className="flex items-center gap-6">
        <div className="text-xl font-bold">
          MyDeFi
        </div>

        <nav className="flex gap-4 text-sm text-gray-300">
          <Link className="hover:text-white" to="/">Dashboard</Link>
          <Link className="hover:text-white" to="/earn">Earn</Link>
          <Link className="hover:text-white" to="/trade">Trade</Link>
          <Link className="hover:text-white" to="/history">History</Link>
        </nav>
      </div>

      <WalletConnector />
    </header>
  );
}