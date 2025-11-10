// frontend/src/adapters/ui/pages/RoutesPage.tsx
import React, { useEffect, useState } from "react";
import { getRoutes, setBaseline } from "../../infrastructure/apiClient";
import type { Route } from "../../../core/domain/Route";

const RoutesPage: React.FC = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ vesselType: "All", fuelType: "All", year: "All" });

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await getRoutes();
        if (alive) setRoutes(data ?? []);
      } catch (err: any) {
        console.error(err);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const applyBaseline = async (routeId: string) => {
    try {
      await setBaseline(routeId);
      const data = await getRoutes();
      setRoutes(data ?? []);
      alert(`Set ${routeId} as baseline`);
    } catch (e: any) {
      alert(`Failed: ${e.message}`);
    }
  };

  const vesselTypes = Array.from(new Set(routes.map(r => r.vesselType))).filter(Boolean);
  const fuelTypes = Array.from(new Set(routes.map(r => r.fuelType))).filter(Boolean);
  const years = Array.from(new Set(routes.map(r => String(r.year)))).filter(Boolean);

  const filtered = routes.filter(r => {
    if (filter.vesselType !== "All" && r.vesselType !== filter.vesselType) return false;
    if (filter.fuelType !== "All" && r.fuelType !== filter.fuelType) return false;
    if (filter.year !== "All" && String(r.year) !== filter.year) return false;
    return true;
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Routes</h1>
      <p className="text-gray-600 mb-4">List of routes and emissions</p>

      <div className="flex gap-3 mb-4">
        <select value={filter.vesselType} onChange={(e) => setFilter({...filter, vesselType: e.target.value})} className="p-2 border rounded">
          <option>All</option>
          {vesselTypes.map(v => <option key={v}>{v}</option>)}
        </select>
        <select value={filter.fuelType} onChange={(e) => setFilter({...filter, fuelType: e.target.value})} className="p-2 border rounded">
          <option>All</option>
          {fuelTypes.map(v => <option key={v}>{v}</option>)}
        </select>
        <select value={filter.year} onChange={(e) => setFilter({...filter, year: e.target.value})} className="p-2 border rounded">
          <option>All</option>
          {years.map(v => <option key={v}>{v}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-lg shadow overflow-auto">
        {loading ? (
          <div className="p-6">Loading...</div>
        ) : (
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2">Route</th>
                <th className="px-4 py-2">Vessel</th>
                <th className="px-4 py-2">Fuel</th>
                <th className="px-4 py-2">Year</th>
                <th className="px-4 py-2">GHG Intensity</th>
                <th className="px-4 py-2">Fuel (t)</th>
                <th className="px-4 py-2">Distance</th>
                <th className="px-4 py-2">Emissions (t)</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.routeId} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2 font-medium">{r.routeId}</td>
                  <td className="px-4 py-2">{r.vesselType}</td>
                  <td className="px-4 py-2">{r.fuelType}</td>
                  <td className="px-4 py-2">{r.year}</td>
                  <td className="px-4 py-2">{r.ghgIntensity}</td>
                  <td className="px-4 py-2">{r.fuelConsumption ?? r.fuelConsumptionT ?? "-"}</td>
                  <td className="px-4 py-2">{r.distance ?? r.distanceKm ?? "-"}</td>
                  <td className="px-4 py-2">{r.totalEmissions ?? r.totalEmissionsT ?? "-"}</td>
                  <td className="px-4 py-2">
                    <button onClick={() => applyBaseline(r.routeId)} className="text-sm px-3 py-1 bg-sky-600 text-white rounded">Set Baseline</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default RoutesPage;
