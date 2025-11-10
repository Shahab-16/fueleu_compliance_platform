// src/pages/BankingPage.tsx
import React, { useEffect, useState } from "react";
import { fetchJson } from "../../../adapters/infrastructure/fetchHelpers";

type ShipCB = {
  shipId: string;
  cb_before: number;
  cb_after: number;
};

type BankingRecordsResp = { shipId: string; year: number; bankedGrams: number };

const API_BASE = (import.meta.env as any).VITE_API_BASE ?? "http://localhost:4000";
const DEFAULT_YEAR = 2025;

const BankingPage: React.FC = () => {
  const [year] = useState<number>(DEFAULT_YEAR);
  const [ships, setShips] = useState<ShipCB[]>([]);
  const [selectedShip, setSelectedShip] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [bankedTotal, setBankedTotal] = useState<number>(0);
  const [bankAmount, setBankAmount] = useState<number>(0);
  const [applyAmount, setApplyAmount] = useState<number>(0);

  async function loadData() {
    try {
      setLoading(true);
      setError(null);
      const url = `${API_BASE.replace(/\/$/, "")}/compliance/adjusted-cb?year=${year}`;
      const resp = await fetchJson(url);
      // resp expected as array of { shipId, cb_before, cb_after }
      setShips(resp);
      if (resp && resp.length > 0) setSelectedShip(resp[0].shipId);
    } catch (err: any) {
      setError(err.message ?? "Failed to fetch CB data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [year]);

  useEffect(() => {
    async function loadBanked() {
      if (!selectedShip) {
        setBankedTotal(0);
        return;
      }
      try {
        const url = `${API_BASE.replace(/\/$/, "")}/banking/records?shipId=${encodeURIComponent(
          selectedShip
        )}&year=${year}`;
        const resp: BankingRecordsResp = await fetchJson(url);
        setBankedTotal(resp.bankedGrams ?? 0);
      } catch (err) {
        setBankedTotal(0);
      }
    }
    loadBanked();
  }, [selectedShip, year]);

  const selectedShipObj = ships.find((s) => s.shipId === selectedShip);

  const handleBank = async () => {
    if (!selectedShip) return alert("Select a ship to bank from");
    if (!bankAmount || bankAmount <= 0) return alert("Enter a positive amount to bank (grams)");
    try {
      const url = `${API_BASE.replace(/\/$/, "")}/banking/bank`;
      const resp = await fetchJson(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shipId: selectedShip, year, amountGrams: bankAmount }),
      });
      alert("Banked successfully");
      // refresh data
      await loadData();
      const recUrl = `${API_BASE.replace(/\/$/, "")}/banking/records?shipId=${encodeURIComponent(
        selectedShip
      )}&year=${year}`;
      const rec = await fetchJson(recUrl);
      setBankedTotal(rec.bankedGrams ?? 0);
    } catch (err: any) {
      alert("Bank failed: " + err.message);
    }
  };

  const handleApply = async () => {
    if (!selectedShip) return alert("Select a ship to apply to");
    if (!applyAmount || applyAmount <= 0) return alert("Enter a positive amount to apply (grams)");
    try {
      const url = `${API_BASE.replace(/\/$/, "")}/banking/apply`;
      const resp = await fetchJson(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shipId: selectedShip, year, amountGrams: applyAmount }),
      });
      alert("Applied banked amount successfully");
      // refresh
      await loadData();
      const recUrl = `${API_BASE.replace(/\/$/, "")}/banking/records?shipId=${encodeURIComponent(
        selectedShip
      )}&year=${year}`;
      const rec = await fetchJson(recUrl);
      setBankedTotal(rec.bankedGrams ?? 0);
    } catch (err: any) {
      alert("Apply failed: " + err.message);
    }
  };

  if (loading) {
    return <div className="p-6">Loading banking data...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold">Banking Compliance Balance</h1>
      <p className="text-gray-600 mb-6">Manage surplus and deficit balances according to Article 20 – Banking.</p>

      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="mb-4">Year: <strong>{year}</strong></div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-1">
            <label className="block text-sm text-gray-600 mb-2">Select ship</label>
            <select
              value={selectedShip ?? ""}
              onChange={(e) => setSelectedShip(e.target.value || null)}
              className="w-full border rounded p-2"
            >
              {ships.map((s) => (
                <option key={s.shipId} value={s.shipId}>
                  {s.shipId} (CB: {Number(s.cb_before).toLocaleString()} g)
                </option>
              ))}
            </select>

            <div className="mt-4 p-4 border rounded bg-blue-50">
              <div className="text-sm text-gray-600">CB Before</div>
              <div className="text-2xl font-semibold text-blue-700">
                {selectedShipObj ? Number(selectedShipObj.cb_before).toLocaleString() : "—"}
              </div>
            </div>
          </div>

          <div className="col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 border rounded">
                <div className="text-sm text-gray-600">Banked (available)</div>
                <div className="text-2xl font-semibold">{Number(bankedTotal).toLocaleString()} g</div>
              </div>

              <div className="p-4 border rounded">
                <div className="text-sm text-gray-600">Bank Surplus (grams)</div>
                <input
                  type="number"
                  value={bankAmount}
                  onChange={(e) => setBankAmount(Number(e.target.value))}
                  className="w-full p-2 border rounded"
                  placeholder="amount in grams"
                />
                <button
                  onClick={handleBank}
                  className="mt-3 px-4 py-2 bg-blue-600 text-white rounded"
                  disabled={!selectedShip || !selectedShipObj || selectedShipObj.cb_before <= 0}
                >
                  Bank Surplus
                </button>
              </div>

              <div className="p-4 border rounded">
                <div className="text-sm text-gray-600">Apply Banked (grams)</div>
                <input
                  type="number"
                  value={applyAmount}
                  onChange={(e) => setApplyAmount(Number(e.target.value))}
                  className="w-full p-2 border rounded"
                  placeholder="amount in grams"
                />
                <button
                  onClick={handleApply}
                  className="mt-3 px-4 py-2 bg-green-600 text-white rounded"
                  disabled={!selectedShip || bankedTotal <= 0}
                >
                  Apply Banked
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankingPage;
