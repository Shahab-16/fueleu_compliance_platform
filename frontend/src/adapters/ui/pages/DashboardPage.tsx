// src/adapters/ui/pages/DashboardPage.tsx
import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import { getRoutes } from "../../infrastructure/apiClient";
import { computeCBForRoute } from "../../../core/application/usecases/compute";

export default function DashboardPage() {
  const [routes, setRoutes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const body = await getRoutes();
        const data = Array.isArray(body) ? body : body.data ?? body.routes ?? [];
        if (alive) setRoutes(data);
      } catch (e) {
        console.error(e);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const totalRoutes = routes.length;
  const totalCBGrams = routes.reduce((acc, r) => {
    const cb = computeCBForRoute(r as any).cbGrams;
    return acc + cb;
  }, 0);
  const totalCBTonnes = (totalCBGrams / 1_000_000).toFixed(2);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-blue-700">Dashboard</h1>
      <p className="text-gray-600 mb-6">Overview of your fleet compliance</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
        <Card title="Total routes" value={totalRoutes} color="bg-white" />
        <Card title="Net CB (tCO₂e)" value={`${totalCBTonnes} t`} />
        <Card title="Target intensity" value="89.3368 gCO₂e/MJ" />
        <Card title="Year" value={new Date().getFullYear()} />
      </div>

      <div className="bg-blue-600 text-white rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold">Low Stock / Alerts</h2>
        <ul className="list-disc ml-6 mt-3">
          <li>Example alert: Route R003 has high emissions</li>
          <li>Example alert: Year 2025 requires pooling</li>
        </ul>
      </div>
    </div>
  );
}
