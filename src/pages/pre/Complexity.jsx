// src/pages/Complexity.jsx
import { useNavigate } from "react-router-dom";
import { useSurvey } from "../../store/surveyStore.jsx";
import RadioList from "../../components/RadioList.jsx";
import ProgressBar from "../../components/ProgressBar.jsx";

const OPTIONS = [
  "Very complicated",
  "Complicated",
  "Neither complicated nor uncomplicated",
  "Uncomplicated",
  "Very uncomplicated",
];

export default function Complexity() {
  const nav = useNavigate();
  const { answers, setAnswer } = useSurvey();
  const value = answers.complexity ?? "";

  const onNext = () => {
    if (!value) return;
    nav("/pre/warm-in");
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

        {/* Example progress: adjust total/stepIndex if you change page count */}
        <ProgressBar stepIndex={5} total={10} />

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
          <h2 className="text-xl font-semibold text-gray-900 md:text-2xl">
            How complicated or uncomplicated do you find this issue?
          </h2>

          <RadioList
            name="complexity"
            options={OPTIONS}
            value={value}
            onChange={(v) => setAnswer("complexity", v)}
          />

          <div className="mt-8 flex items-center justify-between">
            <button
              onClick={() => nav(-1)}
              className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-sm transition hover:bg-gray-50"
            >
              Back
            </button>
            <button
              onClick={onNext}
              disabled={!value}
              className="rounded-xl bg-blue-600 px-5 py-2.5 font-medium text-white shadow-md transition hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
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
