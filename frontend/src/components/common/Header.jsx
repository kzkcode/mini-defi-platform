import { Link } from "react-router-dom";
import WalletConnector from "./WalletConnector";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0B0F17]/70 backdrop-blur">

      <div className="max-w-md mx-auto px-4 py-3">

        {/* 上段 */}
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-white">
            MyDeFi
          </h1>

          <WalletConnector />
        </div>

        {/* 下段 */}
        <nav className="mt-3 flex justify-between text-sm text-gray-400">
          <Link to="/" className="hover:text-white">
            Dashboard
          </Link>

          <Link to="/earn" className="hover:text-white">
            Earn
          </Link>

          <Link to="/trade" className="hover:text-white">
            Trade
          </Link>

          <Link to="/history" className="hover:text-white">
            History
          </Link>
        </nav>

      </div>

    </header>
  );
}