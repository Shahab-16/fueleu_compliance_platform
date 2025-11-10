// src/adapters/infrastructure/apiClient.ts
const API_BASE = (import.meta.env as any).VITE_API_BASE ?? "http://localhost:4000";

function url(path: string) {
  return API_BASE.replace(/\/$/, "") + (path.startsWith("/") ? path : "/" + path);
}

/** Routes */
export async function getRoutes() {
  const res = await fetch(url("/routes"));
  if (!res.ok) throw new Error(`GET /routes ${res.status}`);
  return res.json();
}
export async function setBaseline(routeId: string) {
  const res = await fetch(url(`/routes/${routeId}/baseline`), { method: "POST" });
  if (!res.ok) throw new Error(`POST /routes/${routeId}/baseline ${res.status}`);
  return res.json();
}
export async function getRoutesComparison() {
  const res = await fetch(url("/routes/comparison"));
  if (!res.ok) throw new Error(`GET /routes/comparison ${res.status}`);
  return res.json();
}

/** Compliance / Banking */
export async function getComplianceCB(year: number) {
  const res = await fetch(url(`/compliance/cb?year=${year}`));
  if (!res.ok) throw new Error(`GET /compliance/cb ${res.status}`);
  return res.json();
}
export async function getAdjustedCB(year: number) {
  const res = await fetch(url(`/compliance/adjusted-cb?year=${year}`));
  if (!res.ok) throw new Error(`GET /compliance/adjusted-cb ${res.status}`);
  return res.json();
}

export async function postBankingBank(body: { shipId: string; year: number; amountGrams: number }) {
  const res = await fetch(url("/banking/bank"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`POST /banking/bank ${res.status}`);
  return res.json();
}
export async function postBankingApply(body: { shipId: string; year: number; amountGrams: number }) {
  const res = await fetch(url("/banking/apply"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`POST /banking/apply ${res.status}`);
  return res.json();
}

/** Pools */
export async function createPool(body: { year: number; members: string[] }) {
  const res = await fetch(url("/pools"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`POST /pools ${res.status}`);
  return res.json();
}
