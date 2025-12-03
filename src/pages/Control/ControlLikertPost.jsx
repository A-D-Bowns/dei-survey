import { useNavigate } from "react-router-dom";
import { useSurvey } from "../../store/surveyStore.jsx";
import LikertThermometer from "../../components/LikertThermometer.jsx";
import ProgressBar from "../../components/ProgressBar.jsx";
import { saveSurvey } from "../../lib/api";
import { getOrCreatePID } from "../../lib/identity";

export default function ControlLikertPost() {
  const nav = useNavigate();
  const { answers, setAnswer } = useSurvey();
  const value = typeof answers.ctrl_feel_post === "number" ? answers.ctrl_feel_post : null;

  const onFinish = async () => {
    if (value === null) return;
    const pid = getOrCreatePID();

    try {
      await saveSurvey({
        participant_id: pid,
        phase: "mid",
        condition: "control",
        answers,
        meta: {
          event: "control_mid_save",
          app_version: "0.3.0",
          userAgent: navigator.userAgent,
        },
      });
    } catch (e) {
      console.warn("control mid save failed:", e);
      // don't block navigation
    }

    nav("/control/satisfaction");
  };

  return (
    <div className="min-h-screen bg-neutral-100/70">
      <div className="mx-auto max-w-3xl px-4 pb-16 pt-10 md:px-6">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Brief Reflection (Control)</h1>
          <p className="text-sm text-gray-500">Step 3 of 3</p>
        </header>

        <ProgressBar stepIndex={2} total={3} />

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
          <h2 className="text-xl font-semibold text-gray-900 md:text-2xl">
            After reading those comments, where are you now on the feeling thermometer?
          </h2>
          <LikertThermometer
            value={value}
            onChange={(n) => setAnswer("ctrl_feel_post", n)}
          />

          <div className="mt-8 flex justify-end">
            <button
              onClick={onFinish}
              disabled={value === null}
              className="rounded-xl bg-emerald-600 px-5 py-2.5 font-medium text-white shadow-md hover:bg-emerald-700 disabled:opacity-50"
            >
              Continue to Post-Survey
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
