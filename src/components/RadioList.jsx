export default function RadioList({ name, options, value, onChange }) {
  return (
    <div className="mt-4 space-y-3">
      {options.map(opt => (
        <label
          key={opt}
          className={`flex items-center gap-3 rounded-xl border bg-white px-4 py-3 shadow-sm transition hover:bg-gray-50 ${
            value === opt ? "border-blue-600 ring-2 ring-blue-200" : "border-gray-200"
          }`}
        >
          <input
            type="radio"
            name={name}
            className="h-5 w-5 accent-blue-600"
            checked={value === opt}
            onChange={() => onChange(opt)}
          />
          <span className="text-gray-800">{opt}</span>
        </label>
      ))}
    </div>
  );
}
