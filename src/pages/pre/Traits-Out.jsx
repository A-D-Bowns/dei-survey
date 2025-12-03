// src/pages/pre/Traits-Out.jsx
import { useNavigate } from "react-router-dom";
import { useSurvey } from "../../store/surveyStore.jsx";
import ProgressBar from "../../components/ProgressBar.jsx";

const TRAITS = [
  "Intelligent",
  "Open-minded",
  "Honest",
  "Selfish",
  "Hypocritical",
  "Closed-minded",
  "None of the above",
];

export default function TraitsOut() {
  const nav = useNavigate();
  const { answers, setAnswer } = useSurvey();

  const value = Array.isArray(answers.traits_out) ? answers.traits_out : [];

  const toggleTrait = (trait) => {
    setAnswer(
      "traits_out",
      value.includes(trait)
        ? value.filter((t) => t !== trait)
        : [...value, trait]
    );
  };

  const canContinue = value.length > 0;

  const onNext = () => {
    if (!canContinue) return;
    // 👇 THIS is the path we route to
    nav("/pre/deliberation-intro");
  };

  return (
    <div className="min-h-screen bg-neutral-100/70">
      <div className="mx-auto max-w-3xl px-4 pb-16 pt-10 md:px-6">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
            DEI Study — Pre Survey
          </h1>
          <p className="text-sm text-gray-500">
            P10 of 10 • Traits you’d assign to someone with a <b>different</b> view
          </p>
        </header>

        <ProgressBar stepIndex={9} total={10} />

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8 space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 md:text-2xl">
            Which of the following traits would you apply to someone who holds a{" "}
            <span className="font-semibold">different</span> view than you on DEI at work?
          </h2>
          <p className="text-sm text-gray-600">
            Select <span className="font-semibold">all that apply</span>.
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {TRAITS.map((trait) => {
              const active = value.includes(trait);
              return (
                <button
                  key={trait}
                  type="button"
                  onClick={() => toggleTrait(trait)}
                  className={
                    "flex items-center justify-between rounded-xl border px-4 py-3 text-left text-sm shadow-sm transition " +
                    (active
                      ? "border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-200"
                      : "border-gray-200 bg-white text-gray-800 hover:bg-gray-50")
                  }
                >
                  <span>{trait}</span>
                  <span className="ml-3 text-xs uppercase tracking-wide">
                    {active ? "Selected" : "Tap to select"}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-8 flex items-center justify-between">
            <button
              onClick={() => nav("/pre/traits-in")}
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
              Please select at least one trait to continue.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
