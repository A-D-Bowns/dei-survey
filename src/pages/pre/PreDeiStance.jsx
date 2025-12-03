// src/pages/pre/PreDEIStance.jsx
import { useNavigate } from "react-router-dom";
import { useSurvey } from "../../store/surveyStore.jsx";
import RadioList from "../../components/RadioList.jsx";
import ProgressBar from "../../components/ProgressBar.jsx";

const OPTIONS = [
  "Strongly oppose focusing on DEI at work",
  "Somewhat oppose focusing on DEI at work",
  "Neither support nor oppose focusing on DEI at work",
  "Somewhat support focusing on DEI at work",
  "Strongly support focusing on DEI at work",
];

export default function PreDeiStance() {
  const nav = useNavigate();
  const { answers, setAnswer } = useSurvey();

  // new, clean key for the 5-point pre DEI stance
  const value = answers.pre_dei_stance ?? "";

  const onNext = () => {
    if (!value) return;
    // after this page, go into the rest of the pre battery
    nav("/pre/info-support");
  };

  return (
    <div className="min-h-screen bg-neutral-100/70">
      <div className="mx-auto max-w-3xl px-4 pb-16 pt-10 md:px-6">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
            DEI Study — Pre Survey
          </h1>
          <p className="text-sm text-gray-500">
            Now we’d like a clearer sense of your stance.
          </p>
        </header>

        {/* Progress: you can tweak stepIndex/total later */}
        <ProgressBar stepIndex={0} total={10} />

        {/* Card */}
        <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
          <h2 className="text-xl font-semibold text-gray-900 md:text-2xl">
            With respect to diversity, equity, and inclusion (DEI) in the workplace,
            how would you describe your current overall stance?
          </h2>

          <p className="mt-3 text-sm text-gray-600">
            Please select the option that best reflects your view right now.
          </p>

          <RadioList
            name="pre_dei_stance"
            options={OPTIONS}
            value={value}
            onChange={(v) => setAnswer("pre_dei_stance", v)}
          />

          <div className="mt-8 flex items-center justify-between">
            <button
              type="button"
              onClick={() => nav("/pre/stance-text")}
              className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-sm transition hover:bg-gray-50"
            >
              Back
            </button>
            <button
              type="button"
              onClick={onNext}
              disabled={!value}
              className="rounded-xl bg-blue-600 px-5 py-2.5 font-medium text-white shadow-md transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Continue
            </button>
          </div>

          {!value && (
            <div className="mt-3 text-sm text-red-600">
              Please select an option to continue.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
