// src/pages/post/PostEmployment.jsx
import { useNavigate } from "react-router-dom";
import { useSurvey } from "../../store/surveyStore.jsx";
import ProgressBar from "../../components/ProgressBar.jsx";

const EMPLOYMENT_OPTIONS = [
  "Employed full-time",
  "Employed part-time",
  "Self-employed",
  "Unemployed, looking for work",
  "Unemployed, not looking for work",
  "Student",
  "Retired",
  "Homemaker / Caregiver",
  "Unable to work",
  "Prefer not to say",
];

export default function PostEmployment() {
  const nav = useNavigate();
  const { answers, setAnswer } = useSurvey();

  const value = answers.demo_employment ?? "";
  const canContinue = Boolean(value);

  const goNext = () => {
    if (!canContinue) return;
    nav("/post/income");
  };

  return (
    <div className="min-h-screen bg-neutral-100/70">
      <div className="mx-auto max-w-3xl px-4 pb-16 pt-10 md:px-6">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
            Final Questions
          </h1>
          <p className="text-sm text-gray-500">
            These questions help us understand respondents’ backgrounds.
          </p>
        </header>

        {/* Post block is 6 pages total: Education(1) → Employment(2) → Income(3) → Race(4) → Zip(5) → Device/Browser(6) */}
        <ProgressBar stepIndex={6} total={10} />

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
          <h2 className="text-xl font-semibold text-gray-900">
            What is your current employment status?
          </h2>

          <div className="mt-5 space-y-3">
            {EMPLOYMENT_OPTIONS.map((opt) => {
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
                    name="demo_employment"
                    checked={active}
                    onChange={() => setAnswer("demo_employment", opt)}
                  />
                  <span className="text-gray-800">{opt}</span>
                </label>
              );
            })}
          </div>

          <div className="mt-8 flex items-center justify-between">
            <button
              onClick={() => nav("/post/education")}
              className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-sm transition hover:bg-gray-50"
            >
              Back
            </button>
            <button
              onClick={goNext}
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
