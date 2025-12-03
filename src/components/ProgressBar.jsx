export default function ProgressBar({ stepIndex, total }) {
  const pct = Math.round(((stepIndex + 1) / total) * 100);
  return (
    <div className="mb-6">
      <div className="flex justify-between text-xs text-gray-500">
        <span>Progress</span>
        <span>{pct}%</span>
      </div>
      <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
        <div className="h-2 rounded-full bg-blue-600 transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
