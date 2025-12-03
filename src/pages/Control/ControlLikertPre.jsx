import { useNavigate } from "react-router-dom";
import { useSurvey } from "../../store/surveyStore.jsx";
import LikertThermometer from "../../components/LikertThermometer.jsx";
import ProgressBar from "../../components/ProgressBar.jsx";
import { getOrAssignCondition } from "../../lib/condition";

export default function ControlLikertPre() {
  const nav = useNavigate();
  const { answers, setAnswer } = useSurvey();
  // Ensure condition is set to control if not already
  const cond = (answers?.condition || localStorage.getItem("condition") || getOrAssignCondition()).toLowerCase();
  if (cond !== "control") {
    localStorage.setItem("condition", "control");
  }

  const value = typeof answers.ctrl_feel_pre === "number" ? answers.ctrl_feel_pre : null;

  const onNext = () => {
    if (value === null) return;
    setAnswer("condition", "control");
    nav("/control/comments");
  };

  return (
    <div className="min-h-screen bg-neutral-100/70">
      <div className="mx-auto max-w-3xl px-4 pb-16 pt-10 md:px-6">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Brief Reflection (Control)</h1>
          <p className="text-sm text-gray-500">Step 1 of 3</p>
        </header>

        <ProgressBar stepIndex={0} total={3} />

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
          <h2 className="text-xl font-semibold text-gray-900 md:text-2xl">
            Before reading comments: how do you feel about DEI in the workplace?
          </h2>
          <p className="text-gray-600 mt-2 text-sm">
            Please use the 0–10 feeling thermometer.
          </p>

          <LikertThermometer
            value={value}
            onChange={(n) => setAnswer("ctrl_feel_pre", n)}
          />

          <div className="mt-8 flex justify-end">
            <button
              onClick={onNext}
              disabled={value === null}
              className="rounded-xl bg-blue-600 px-5 py-2.5 font-medium text-white shadow-md hover:bg-blue-700 disabled:opacity-50"
            >
              Continue
            </button>
          </div>

          {value === null && (
            <div className="mt-3 text-sm text-red-600">Please select a number from 0 to 10.</div>
          )}
        </div>
      </div>
    </div>
  );
}
