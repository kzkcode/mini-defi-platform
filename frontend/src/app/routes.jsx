import { Routes, Route } from "react-router-dom";

import Dashboard from "../pages/Dashboard/Dashboard";
import Earn from "../pages/Earn/Earn";
import Trade from "../pages/Trade/Trade";
import History from "../pages/History/History";

export default function AppRoutes({
  account,
  contract,
  stakingContract,
  signerContract,
  provider,
}) {
  return (
    <Routes>

      <Route
        path="/"
        element={
          <Dashboard
            account={account}
            contract={contract}
            stakingContract={stakingContract}
          />
        }
      />

      <Route
        path="/earn"
        element={
          <Earn
            account={account}
            contract={contract}
            stakingContract={stakingContract}
            signerContract={signerContract}
          />
        }
      />

      <Route
        path="/trade"
        element={
          <Trade
            account={account}
            provider={provider}
          />
        }
      />

      <Route path="/history" element={<History />} />

    </Routes>
  );
}