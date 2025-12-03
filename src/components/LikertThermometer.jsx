export default function LikertThermometer({ value, onChange }) {
  const options = Array.from({ length: 11 }, (_, i) => i); // 0..10
  return (
    <div className="mt-4">
      <div className="flex flex-wrap gap-2">
        {options.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={`w-10 h-10 rounded-lg border text-sm font-medium
              ${value === n ? "bg-blue-600 text-white border-blue-700" : "bg-white text-gray-800 border-gray-300 hover:bg-gray-50"}`}
            aria-label={`Select ${n}`}
          >
            {n}
          </button>
        ))}
      </div>
      <div className="mt-2 text-xs text-gray-500">
        0 = colder / less favorable · 10 = warmer / more favorable
      </div>
    </div>
  );
}
