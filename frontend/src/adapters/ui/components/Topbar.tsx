// src/adapters/ui/components/Topbar.tsx
import React from "react";

export default function Topbar() {
  return (
    <div className="w-full border-b bg-white px-6 py-3 flex items-center justify-between">
      <div className="text-2xl font-bold text-blue-600">FuelEU Compliance</div>
      <div className="text-sm text-gray-600">Welcome — <strong>Operator</strong></div>
    </div>
  );
}
