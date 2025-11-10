// frontend/src/adapters/ui/AppRouter.tsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import DashboardPage from "./pages/DashboardPage";
import RoutesPage from "./pages/RoutesPage";
import ComparePage from "./pages/ComparePage";
import BankingPage from "./pages/BankingPage";
import PoolingPage from "./pages/PoolingPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 min-h-screen bg-gray-50">
          <Topbar />
          <main>
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/routes" element={<RoutesPage />} />
              <Route path="/compare" element={<ComparePage />} />
              <Route path="/banking" element={<BankingPage />} />
              <Route path="/pooling" element={<PoolingPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}
