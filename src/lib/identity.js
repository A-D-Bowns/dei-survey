export function getOrCreatePID() {
  const KEY = "participant_id";
  let v = localStorage.getItem(KEY);
  if (!v) {
    v = "P-" + Math.random().toString(36).slice(2, 10);
    localStorage.setItem(KEY, v);
  }
  return v;
}
