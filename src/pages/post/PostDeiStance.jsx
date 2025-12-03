// src/pages/post/PostDeiStance.jsx
import { useNavigate } from "react-router-dom";
import { useSurvey } from "../../store/surveyStore.jsx";
import ProgressBar from "../../components/ProgressBar.jsx";

const OPTIONS = [
  "Strongly oppose DEI",
  "Somewhat oppose DEI",
  "Neutral or mixed",
  "Somewhat support DEI",
  "Strongly support DEI",
];

export default function PostDeiStance() {
  const nav = useNavigate();
  const { answers, setAnswer } = useSurvey();

  const value = answers.post_dei_stance ?? "";
  const canContinue = Boolean(value);

  return (
    <div className="min-h-screen bg-neutral-100/70">
      <div className="mx-auto max-w-3xl px-4 pb-16 pt-10 md:px-6">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
            Your current view on DEI
          </h1>
          <p className="text-sm text-gray-500">
            Thinking about DEI in the workplace right now, after the earlier questions
            and tasks, where would you place yourself?
          </p>
        </header>

        {/* Put this as step 1 of the post block, or adjust indices to fit your ProgressBar scheme */}
        <ProgressBar stepIndex={2} total={10} />

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
          <h2 className="text-xl font-semibold text-gray-900 md:text-2xl">
            With respect to DEI, what is your current stance?
          </h2>

          <div className="mt-4 space-y-3">
            {OPTIONS.map((opt) => {
              const active = value === opt;
              return (
                <label
                  key={opt}
                  className={`flex items-center gap-3 rounded-xl border bg-white px-4 py-3 shadow-sm transition hover:bg-gray-50 ${
                    active ? "border-blue-600 ring-2 ring-blue-200" : "border-gray-200"
                  }`}
                >
                  <input
                    type="radio"
                    className="h-5 w-5 accent-blue-600"
                    name="post_dei_stance"
                    checked={active}
                    onChange={() => setAnswer("post_dei_stance", opt)}
                  />
                  <span className="text-gray-800">{opt}</span>
                </label>
              );
            })}
          </div>

          <div className="mt-8 flex items-center justify-between">
            {/* Back will depend where you come from; for now assume from satisfaction page */}
            <button
              onClick={() => nav(-1)}
              className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-sm transition hover:bg-gray-50"
            >
              Back
            </button>
            <button
              onClick={() => nav("/post/race")}
              disabled={!canContinue}
              className="rounded-xl bg-blue-600 px-5 py-2.5 font-medium text-white shadow-md transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Continue
            </button>
          </div>

          {!canContinue && (
            <div className="mt-3 text-sm text-red-600">
              Please select an option to continue.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
