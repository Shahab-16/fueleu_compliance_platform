// frontend/src/adapters/ui/components/Topbar.tsx
import React from "react";
import logo from "../../../assets/logo.png";

export default function Topbar() {
  return (
    <div className="w-full border-b bg-white px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <img src={logo} alt="FuelEU" className="h-10 w-auto" />
        <div>
          <div className="text-lg font-bold text-sky-700">FuelEU Compliance</div>
          <div className="text-xs text-slate-500">Operator dashboard</div>
        </div>
      </div>
      <div className="text-lg text-gray-600">Welcome — <strong>Sir</strong></div>
    </div>
  );
}
