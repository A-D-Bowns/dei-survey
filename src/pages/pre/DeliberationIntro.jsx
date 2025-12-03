// src/pages/pre/DeliberationIntro.jsx
import { useNavigate } from "react-router-dom";
import { useSurvey } from "../../store/surveyStore.jsx";
import { getOrAssignCondition } from "../../lib/condition.js";

export default function DeliberationIntro() {
  const nav = useNavigate();
  const { setAnswer } = useSurvey();

  const handleBegin = () => {
    const cond = getOrAssignCondition(); // "control" | "socratic" | "perspective"
    setAnswer("condition", cond);

    if (cond === "control") {
      nav("/control/likert-pre");
    } else if (cond === "socratic") {
      nav("/chat/socratic");
    } else if (cond === "perspective") {
      nav("/chat/perspective");
    } else {
      // fallback, should never happen
      nav("/chat");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100/70">
      <div className="mx-auto max-w-3xl px-4 pb-16 pt-10 md:px-6">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
            Deliberation Exercise
          </h1>
          <p className="text-sm text-gray-500">
            Next, you’ll complete a short deliberation exercise.
          </p>
        </header>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8 space-y-6">
          <p className="text-gray-700 leading-relaxed">
            Now, you will be asked to participate in a brief deliberation exercise.
            You’ll be asked to share your view about DEI at work and then complete
            a short task. Depending on the condition, you may interact with a chatbot
            or simply answer questions.
          </p>

          <p className="text-gray-700 leading-relaxed">
            Please take your time and answer as honestly as you can. After the deliberation
            exercise, you’ll return to a few final questions.
          </p>

          <div className="mt-6 flex justify-end">
            <button
              onClick={handleBegin}
              className="rounded-xl bg-blue-600 px-5 py-2.5 font-medium text-white shadow-md transition hover:bg-blue-700"
            >
              Begin Exercise
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
