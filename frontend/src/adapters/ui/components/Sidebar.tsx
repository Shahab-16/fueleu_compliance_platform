// src/adapters/ui/components/Sidebar.tsx
import React from "react";
import { Link, useLocation } from "react-router-dom";

const NavItem = ({ to, label }: { to: string; label: string }) => {
  const loc = useLocation();
  const active = loc.pathname === to;
  return (
    <Link to={to} className={`flex items-center gap-3 px-4 py-3 rounded-r-lg ${active ? "bg-blue-50 text-blue-700 font-semibold" : "text-gray-700 hover:bg-gray-50"}`}>
      <span>{label}</span>
    </Link>
  );
};

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r min-h-screen">
      <div className="p-6 border-b">
        <div className="text-xl font-bold text-blue-600">FuelEU</div>
      </div>

      <nav className="p-4 space-y-1">
        <NavItem to="/" label="Dashboard" />
        <div className="mt-4 border-t pt-4">
          <div className="text-xs text-gray-400 px-4 pb-2">Compliance</div>
          <NavItem to="/routes" label="Routes" />
          <NavItem to="/compare" label="Compare" />
          <NavItem to="/banking" label="Banking" />
          <NavItem to="/pooling" label="Pooling" />
        </div>
      </nav>
    </aside>
  );
}
