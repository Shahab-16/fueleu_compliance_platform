// frontend/src/adapters/ui/pages/PoolingPage.tsx
import React, { useEffect, useState } from "react";
import { fetchJson } from "../../infrastructure/fetchHelpers";

type Member = { shipId: string; cb_before: number; cb_after?: number; };

const API_BASE = (import.meta.env as any).VITE_API_BASE ?? "http://localhost:4000";
const YEAR = 2025;

const PoolingPage: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const url = `${API_BASE.replace(/\/$/, "")}/compliance/adjusted-cb?year=${YEAR}`;
        const resp = await fetchJson(url);
        setMembers(resp ?? []);
        const initSel: Record<string, boolean> = {};
        (resp ?? []).forEach((m: any) => (initSel[m.shipId] = false));
        setSelected(initSel);
      } catch (err: any) {
        alert("Failed to load pool members: " + err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const toggle = (id: string) => setSelected(s => ({ ...s, [id]: !s[id] }));
  const selectedList = members.filter(m => selected[m.shipId]);
  const sumBefore = selectedList.reduce((acc, m) => acc + Number(m.cb_before || 0), 0);

  const createPool = async () => {
    if (sumBefore < 0) return alert("Pool invalid: sum of selected CB is negative.");
    try {
      const url = `${API_BASE.replace(/\/$/, "")}/pools`;
      const resp = await fetchJson(url, {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({ year: YEAR, members: selectedList.map(m => m.shipId) })
      });
      alert("Pool created: " + JSON.stringify(resp?.data ?? resp));
      // refresh
      const refresh = `${API_BASE.replace(/\/$/, "")}/compliance/adjusted-cb?year=${YEAR}`;
      const r = await fetchJson(refresh);
      setMembers(r ?? []);
      const initSel: Record<string, boolean> = {};
      (r ?? []).forEach((m: any) => (initSel[m.shipId] = false));
      setSelected(initSel);
    } catch (err: any) {
      alert("Pool failed: " + err.message);
    }
  };

  if (loading) return <div className="p-6">Loading pool members…</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold">Pooling</h1>
      <p className="text-gray-600 mb-4">Create pool for year {YEAR}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow-sm">
          <h2 className="font-semibold mb-3">Available members</h2>
          <div className="space-y-3">
            {members.map(m => (
              <div key={m.shipId} className="flex items-center justify-between border-b pb-2">
                <label className="flex items-center gap-3">
                  <input type="checkbox" checked={!!selected[m.shipId]} onChange={() => toggle(m.shipId)} />
                  <div>
                    <div className="font-medium">{m.shipId}</div>
                    <div className="text-sm text-gray-500">CB: {Number(m.cb_before).toLocaleString()}</div>
                  </div>
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow-sm">
          <h2 className="font-semibold mb-3">Pool summary</h2>
          <div className={`p-3 rounded ${sumBefore < 0 ? "bg-red-100 text-red-800" : "bg-green-50 text-green-800"}`}>
            Sum before: {sumBefore.toLocaleString()} grams ({(sumBefore / 1_000_000).toFixed(2)} t)
          </div>

          <div className="mt-4">
            <button disabled={sumBefore < 0 || selectedList.length === 0} onClick={createPool}
              className={`px-4 py-2 rounded text-white ${sumBefore < 0 || selectedList.length === 0 ? "bg-gray-400" : "bg-sky-600"}`}>
              Create Pool
            </button>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold mb-2">Selected members</h3>
            {selectedList.length === 0 ? <div className="text-gray-500">No members selected</div> :
              <ul className="list-disc pl-5">
                {selectedList.map(m => <li key={m.shipId}>{m.shipId} — before: {Number(m.cb_before).toLocaleString()} g</li>)}
              </ul>
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoolingPage;
