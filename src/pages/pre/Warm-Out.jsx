import { useNavigate } from "react-router-dom";
import { useSurvey } from "../../store/surveyStore.jsx";
import ProgressBar from "../../components/ProgressBar.jsx";
import { useMemo } from "react";

export default function WarmOut() {
  const nav = useNavigate();
  const { answers, setAnswer } = useSurvey();

  const value = answers.warm_out;
  const canContinue = typeof value === "number" && value >= 0 && value <= 10;

  const handleChange = (e) => {
    const num = Number(e.target.value);
    if (!Number.isNaN(num)) setAnswer("warm_out", num);
  };

  const display = useMemo(() => (canContinue ? value : "—"), [canContinue, value]);

  const onNext = () => {
    if (!canContinue) return;
    nav("/pre/traits-out"); // P10 next
  };

  return (
    <div className="min-h-screen bg-neutral-100/70">
      <div className="mx-auto max-w-3xl px-4 pb-16 pt-10 md:px-6">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
            DEI Study — Pre Survey
          </h1>
          <p className="text-sm text-gray-500">Single-question pages</p>
        </header>

        {/* Pre has 10 steps (P1–P10). This is P9 → index = 8 */}
        <ProgressBar stepIndex={8} total={10} />

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
          <h2 className="text-xl font-semibold text-gray-900 md:text-2xl">
            Feeling Thermometer — Out-Group
          </h2>
          <p className="mt-3 text-gray-700">
            On a scale from <span className="font-medium">0 (very cold or unfavorable)</span> to{" "}
            <span className="font-medium">10 (very warm or favorable)</span>, how do you feel about a
            person who <span className="font-medium">does not share your position</span> on workplace DEI?
          </p>

          <div className="mt-8">
            <input
              type="range"
              min={0}
              max={10}
              step={1}
              value={typeof value === "number" ? value : 5}
              onChange={handleChange}
              className="w-full accent-blue-600"
              aria-label="Warmth toward out-group (0 to 10)"
            />

            <div className="mt-2 flex justify-between text-xs text-gray-500">
              {Array.from({ length: 11 }).map((_, i) => (
                <span key={i} className="tabular-nums">{i}</span>
              ))}
            </div>

            <div className="mt-4 text-sm text-gray-700">
              Selected: <span className="font-semibold">{display}</span>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between">
            <button
              onClick={() => nav("/pre/traits-in")} // back to P8
              className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-sm transition hover:bg-gray-50"
            >
              Back
            </button>
            <button
              onClick={onNext}
              disabled={!canContinue}
              className="rounded-xl bg-blue-600 px-5 py-2.5 font-medium text-white shadow-md transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Continue
            </button>
          </div>

          {!canContinue && (
            <div className="mt-3 text-sm text-red-600">
              Please move the slider to select a value from 0 to 10.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
