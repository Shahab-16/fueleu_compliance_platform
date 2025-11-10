// frontend/src/adapters/ui/pages/ComparePage.tsx
import React, { useEffect, useState } from "react";
import { getRoutesComparison } from "../../infrastructure/apiClient";
import { TARGET_INTENSITY } from "../../../shared/constants";

export default function ComparePage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const body = await getRoutesComparison();
        if (mounted) setData(body);
      } catch (e: any) {
        setError(e.message || "Failed");
      } finally { if (mounted) setLoading(false); }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Compare</h1>
      <p className="text-gray-600 mb-4">Baseline vs other routes</p>

      {loading ? <div>Loading...</div> : error ? <div className="text-red-600">{error}</div> :
      data ? (
        <div className="bg-white rounded shadow p-4">
          <div className="mb-4">
            <strong>Target:</strong> {data.target ?? TARGET_INTENSITY}
          </div>
          <table className="min-w-full text-left">
            <thead className="bg-gray-50"><tr>
              <th className="px-3 py-2">Route</th>
              <th className="px-3 py-2">Baseline (gCO₂e/MJ)</th>
              <th className="px-3 py-2">Comparison (gCO₂e/MJ)</th>
              <th className="px-3 py-2">% diff</th>
              <th className="px-3 py-2">Compliant</th>
            </tr></thead>
            <tbody>
              {data.comparisons?.map((c: any) => (
                <tr key={c.routeId} className="border-b">
                  <td className="px-3 py-2">{c.routeId}</td>
                  <td className="px-3 py-2">{data.baseline?.ghgIntensity}</td>
                  <td className="px-3 py-2">{c.ghgIntensity}</td>
                  <td className="px-3 py-2">{(c.percentDiff ?? ((c.ghgIntensity / data.baseline.ghgIntensity -1)*100)).toFixed(2)}%</td>
                  <td className="px-3 py-2">{ (c.compliant ?? (c.ghgIntensity <= (data.target ?? TARGET_INTENSITY))) ? "✅" : "❌" }</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-gray-600">No comparison data available</div>
      )}
    </div>
  );
}
