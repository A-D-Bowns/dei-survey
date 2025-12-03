import { isDebugOn } from "../lib/debug";

export default function DebugBadge({ pid, condition }) {
  if (!isDebugOn()) return null;
  return (
    <div className="fixed bottom-3 right-3 rounded-lg bg-black/80 text-white text-xs px-3 py-2 shadow-lg z-50">
      <div>PID: <span className="font-mono">{pid || "—"}</span></div>
      <div>Cond: <span className="font-mono">{condition || "—"}</span></div>
    </div>
  );
}
