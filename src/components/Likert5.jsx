const SCALE = [
  { key: 1, label: "Strongly disagree" },
  { key: 2, label: "Disagree" },
  { key: 3, label: "Neither" },
  { key: 4, label: "Agree" },
  { key: 5, label: "Strongly agree" },
];

export default function Likert5({ name, value, onChange }) {
  return (
    <div className="mt-3 grid grid-cols-1 sm:grid-cols-5 gap-2">
      {SCALE.map(({ key, label }) => (
        <label
          key={key}
          className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm
            ${value === key ? "border-blue-600 ring-2 ring-blue-200" : "border-gray-200"}
          `}
          title={label}
        >
          <input
            type="radio"
            name={name}
            className="h-4 w-4 accent-blue-600"
            checked={value === key}
            onChange={() => onChange(key)}
          />
          <span className="hidden sm:inline">{label}</span>
          <span className="sm:hidden">{key}</span>
        </label>
      ))}
    </div>
  );
}
