import { Routes, Route } from "react-router-dom";

import Dashboard from "../pages/Dashboard/Dashboard";
import Earn from "../pages/Earn/Earn";
import Trade from "../pages/Trade/Trade";
import History from "../pages/History/History";

export default function AppRoutes({
  account,
  contract,
  stakingContract,
  ammContract,

  signerContract,
  signerStakingContract,
  signerAmmContract,
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
            stakingContract={stakingContract}
            stakingWriteContract={signerStakingContract}
            tokenContract={signerContract}
          />
        }
      />

      <Route
        path="/trade"
        element={
          <Trade
            account={account}
            ammContract={ammContract}
            ammWriteContract={signerAmmContract}
            tokenContract={signerContract}
          />
        }
      />

      <Route path="/history" element={<History />} />

    </Routes>
  );
}