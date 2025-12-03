// src/lib/api.js
export const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

async function postJSON(url, payload) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json();
}

export function saveSurvey(payload) {
  return postJSON(`${API_URL}/save`, payload);
}

export function chatLLM(payload) {
  return postJSON(`${API_URL}/chat/llm`, payload);
}
