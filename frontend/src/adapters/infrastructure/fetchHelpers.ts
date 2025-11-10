// src/adapters/infrastructure/fetchHelpers.ts
export async function fetchJson(url: string, opts?: RequestInit) {
  const res = await fetch(url, opts);
  const text = await res.text();
  let json: any = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = text;
  }
  if (!res.ok) {
    const msg =
      (json && (json.error || json.message || json.detail)) ||
      (typeof json === "string" ? json : `HTTP ${res.status}`);
    throw new Error(msg);
  }
  return json;
}
