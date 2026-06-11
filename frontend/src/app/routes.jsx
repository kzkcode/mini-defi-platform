import { Routes, Route } from "react-router-dom";

import Dashboard from "../pages/Dashboard/Dashboard";
import Earn from "../pages/Earn/Earn";
import Trade from "../pages/Trade/Trade";
import History from "../pages/History/History";

export default function AppRoutes({
  account,

  // READ
  tokenContract,
  stakingContract,
  ammContract,
  lpTokenContract,

  // WRITE
  tokenWriteContract,
  stakingWriteContract,
  ammWriteContract,
}) {
  return (
    <Routes>

      {/* Dashboard */}
      <Route
        path="/"
        element={
          <Dashboard
            account={account}
            tokenContract={tokenContract}
            stakingContract={stakingContract}
            ammContract={ammContract}
            lpTokenContract={lpTokenContract}
          />
        }
      />

      {/* Earn */}
      <Route
        path="/earn"
        element={
          <Earn
            account={account}
            stakingContract={stakingContract}
            stakingWriteContract={stakingWriteContract}
            tokenWriteContract={tokenWriteContract}
          />
        }
      />

      {/* Trade */}
      <Route
        path="/trade"
        element={
          <Trade
            account={account}
            ammContract={ammContract}
            ammWriteContract={ammWriteContract}
            tokenWriteContract={tokenWriteContract}
          />
        }
      />

      {/* History */}
      <Route
        path="/history"
        element={
          <History
            account={account}
            tokenContract={tokenContract}
            stakingContract={stakingContract}
            ammContract={ammContract}
            lpTokenContract={lpTokenContract}
          />
        }
      />

    </Routes>
  );
}