const KEY = "survey_condition";
const ARMS = ["control", "socratic", "perspective"];
export function getOrAssignCondition() {
  const existing = localStorage.getItem(KEY);
  if (ARMS.includes(existing)) return existing;
  const chosen = ARMS[Math.floor(Math.random() * ARMS.length)];
  localStorage.setItem(KEY, chosen);
  return chosen;
}
