import { Routes, Route } from "react-router-dom";

import Dashboard from "../pages/Dashboard/Dashboard";
import Earn from "../pages/Earn/Earn";
import Trade from "../pages/Trade/Trade";
import History from "../pages/History/History";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/earn" element={<Earn />} />
      <Route path="/trade" element={<Trade />} />
      <Route path="/history" element={<History />} />
    </Routes>
  );
}