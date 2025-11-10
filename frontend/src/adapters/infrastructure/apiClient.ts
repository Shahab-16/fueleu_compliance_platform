// frontend/src/adapters/infrastructure/apiClient.ts
import { fetchJson } from "./fetchHelpers";

const API_BASE = (import.meta.env as any).VITE_API_BASE ?? "http://localhost:4000";
const base = API_BASE.replace(/\/$/, "");

export async function getRoutes() {
  const res = await fetchJson(`${base}/routes`);
  // backend returns { data: [...] } or just [...]
  return res?.data ?? res;
}

export async function setBaseline(routeId: string) {
  return await fetchJson(`${base}/routes/${encodeURIComponent(routeId)}/baseline`, { method: "POST" });
}

export async function getRoutesComparison() {
  const res = await fetchJson(`${base}/routes/comparison`);
  return res;
}

export async function getAdjustedCB(year: number) {
  const res = await fetchJson(`${base}/compliance/adjusted-cb?year=${year}`);
  return res;
}
