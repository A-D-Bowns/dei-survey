// Turn debug on/off from the URL once: ?debug=1 or ?debug=0
export function enableDebugFromQuery() {
  try {
    const qs = new URLSearchParams(window.location.search);
    if (qs.get("debug") === "1") localStorage.setItem("debug", "1");
    if (qs.get("debug") === "0") localStorage.removeItem("debug");
  } catch {}
}

// Only show debug UI in dev AND when the flag is set
export function isDebugOn() {
  return import.meta.env.DEV && localStorage.getItem("debug") === "1";
}
