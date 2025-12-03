// src/pages/pre/Traits-In.jsx
import { useNavigate } from "react-router-dom";
import { useSurvey } from "../../store/surveyStore.jsx";
import ProgressBar from "../../components/ProgressBar.jsx";

const OPTIONS = [
  "Intelligent",
  "Open-minded",
  "Honest",
  "Selfish",
  "Hypocritical",
  "Closed-minded",
  "None of the above",
];

export default function TraitsIn() {
  const nav = useNavigate();
  const { answers, setAnswer } = useSurvey();
  const value = Array.isArray(answers.traits_in) ? answers.traits_in : [];

  const toggle = (opt) => {
    // “None of the above” is exclusive
    if (opt === "None of the above") {
      if (value.includes(opt)) {
        setAnswer("traits_in", []); // unselect it
      } else {
        setAnswer("traits_in", ["None of the above"]); // only this
      }
      return;
    }

    // For any other option, remove “None of the above” if present
    const base = value.filter((v) => v !== "None of the above");

    if (base.includes(opt)) {
      setAnswer("traits_in", base.filter((v) => v !== opt));
    } else {
      setAnswer("traits_in", [...base, opt]);
    }
  };

  const canContinue = value.length > 0;

  const onNext = () => {
    if (!canContinue) return;
    nav("/pre/warm-out"); // P9 next
  };

  return (
    <div className="min-h-screen bg-neutral-100/70">
      <div className="mx-auto max-w-3xl px-4 pb-16 pt-10 md:px-6">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
            DEI Study — Pre Survey
          </h1>
          <p className="text-sm text-gray-500">
            P8 of 10 • Traits you’d assign to someone with the <b>same</b> view
          </p>
        </header>

        {/* This is P8 of 10 → index = 7 */}
        <ProgressBar stepIndex={7} total={10} />

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8 space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 md:text-2xl">
            Which of the following traits would you apply to someone who{" "}
            <span className="font-semibold">shares your position</span> on workplace DEI?
          </h2>
          <p className="text-sm text-gray-600">
            Select <span className="font-semibold">all that apply</span>.
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {OPTIONS.map((opt) => {
              const active = value.includes(opt);
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => toggle(opt)}
                  className={
                    "flex items-center justify-between rounded-xl border px-4 py-3 text-left text-sm shadow-sm transition " +
                    (active
                      ? "border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-200"
                      : "border-gray-200 bg-white text-gray-800 hover:bg-gray-50")
                  }
                >
                  <span>{opt}</span>
                  <span className="ml-3 text-xs uppercase tracking-wide">
                    {active ? "Selected" : "Tap to select"}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-8 flex items-center justify-between">
            <button
              onClick={() => nav("/pre/warm-in")} // back to P7
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
              Please select at least one option to continue.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
