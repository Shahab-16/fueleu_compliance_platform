// frontend/src/adapters/infrastructure/fetchHelpers.ts
export async function fetchJson(url: string, opts?: RequestInit) {
  const res = await fetch(url, opts);
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const j = await res.json();
      msg = j.error ?? j.message ?? JSON.stringify(j);
    } catch {}
    throw new Error(`${res.status} ${res.statusText}: ${msg}`);
  }
  // try parse json
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
