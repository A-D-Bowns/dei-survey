// src/pages/pre/Stance.jsx
import { useNavigate } from "react-router-dom";
import { useSurvey } from "../../store/surveyStore.jsx";

const OPTIONS = ["A good thing", "A bad thing", "Unsure"];

export default function Stance() {
  const nav = useNavigate();
  const { answers, setAnswer } = useSurvey();
  const value = answers.stance ?? "";

  const onNext = () => {
    if (value) nav("/pre/stance-text");
  };

  return (
    <div className="min-h-screen bg-neutral-100/70">
      <div className="mx-auto max-w-3xl px-4 pb-16 pt-10">
        <h1 className="text-2xl font-semibold text-gray-900">Your general view</h1>
        <p className="mt-2 text-gray-700">Focusing on DEI at work is mainly…</p>

        <div className="mt-6 space-y-3">
          {OPTIONS.map((opt) => {
            const active = value === opt;
            return (
              <label
                key={opt}
                className={`flex items-center gap-3 rounded-xl border bg-white px-4 py-3 shadow-sm hover:bg-gray-50 ${
                  active ? "border-blue-600 ring-2 ring-blue-200" : "border-gray-200"
                }`}
              >
                <input
                  type="radio"
                  className="h-5 w-5 accent-blue-600"
                  name="stance"
                  checked={active}
                  onChange={() => setAnswer("stance", opt)}
                />
                <span className="text-gray-800">{opt}</span>
              </label>
            );
          })}
        </div>

        <div className="mt-8 flex justify-between">
          <button
            onClick={() => nav(-1)}
            className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50"
          >
            Back
          </button>
          <button
            onClick={onNext}
            disabled={!value}
            className="rounded-xl bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
