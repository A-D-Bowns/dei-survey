import { useNavigate } from "react-router-dom";
import { useSurvey } from "../../store/surveyStore.jsx";
import ProgressBar from "../../components/ProgressBar.jsx";

const INCOME_BANDS = [
  "Under $20,000",
  "$20,000–$39,999",
  "$40,000–$59,999",
  "$60,000–$79,999",
  "$80,000–$99,999",
  "$100,000–$149,999",
  "$150,000–$199,999",
  "$200,000 or more",
  "Prefer not to say",
];

export default function PostIncome() {
  const nav = useNavigate();
  const { answers, setAnswer } = useSurvey();
  const income = answers.demo_household_income ?? "";
  const canContinue = Boolean(income);

  return (
    <div className="min-h-screen bg-neutral-100/70">
      <div className="mx-auto max-w-3xl px-4 pb-16 pt-10 md:px-6">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Household Income</h1>
          <p className="text-sm text-gray-500">Select a band or “Prefer not to say.”</p>
        </header>

        {/* Post flow: AboutYou(1) → AgeGender(2) → Employment(3) → Income(4) → Zip(5) → Device/Browser(6) */}
        <ProgressBar stepIndex={7} total={10} />

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
          <div className="mt-1 space-y-3">
            {INCOME_BANDS.map((band) => {
              const active = income === band;
              return (
                <label
                  key={band}
                  className={`flex items-center gap-3 rounded-xl border bg-white px-4 py-3 shadow-sm transition hover:bg-gray-50 ${
                    active ? "border-blue-600 ring-2 ring-blue-200" : "border-gray-200"
                  }`}
                >
                  <input
                    type="radio"
                    className="h-5 w-5 accent-blue-600"
                    name="demo_household_income"
                    checked={active}
                    onChange={() => setAnswer("demo_household_income", band)}
                  />
                  <span className="text-gray-800">{band}</span>
                </label>
              );
            })}
          </div>

          <div className="mt-8 flex items-center justify-between">
            <button
              onClick={() => nav("/post/employment")}
              className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-sm transition hover:bg-gray-50"
            >
              Back
            </button>
            <button
              onClick={() => nav("/post/zip")}
              disabled={!canContinue}
              className="rounded-xl bg-blue-600 px-5 py-2.5 font-medium text-white shadow-md transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Continue
            </button>
          </div>

          {!canContinue && (
            <div className="mt-3 text-sm text-red-600">Please select a household income band.</div>
          )}
        </div>
      </div>
    </div>
  );
}
