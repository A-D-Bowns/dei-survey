const BASE_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"; // fallback for local dev

export async function saveSurvey(payload) {
  const res = await fetch(`${BASE_URL}/save`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("save failed");
  return res.json();
}

export async function chatTurn(payload) {
  const res = await fetch(`${BASE_URL}/chat/llm`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("chat failed");
  return res.json();
}