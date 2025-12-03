// src/pages/control/ControlTaskSatisfaction.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSurvey } from "../../store/surveyStore.jsx";
import { saveSurvey } from "../../lib/api";
import { getOrCreatePID } from "../../lib/identity";
import RadioList from "../../components/RadioList.jsx";
import ProgressBar from "../../components/ProgressBar.jsx";

const OPTIONS = [
  "Strongly agree",
  "Somewhat agree",
  "Neither agree nor disagree",
  "Somewhat disagree",
  "Strongly disagree",
];

export default function ControlTaskSatisfaction() {
  const nav = useNavigate();
  const { answers, setAnswer } = useSurvey();
  const pid = getOrCreatePID();

  // New key: did the comments change their mind?
  const [value, setValue] = useState(
    answers.control_comments_changed_mind ?? ""
  );

  const onNext = async () => {
    if (!value) return;

    // Store in local survey state
    setAnswer("control_comments_changed_mind", value);

    try {
      await saveSurvey({
        participant_id: pid,
        phase: "control_changed_mind",
        condition: answers.condition || "control",
        answers: { control_comments_changed_mind: value },
        meta: { from: "control-comments-changed-mind" },
      });
    } catch (e) {
      console.error("save(control_changed_mind) failed:", e);
      // continue anyway in pilot
    }

    // Then go to post DEI stance page
    nav("/post/openness");
  };

  return (
    <div className="min-h-screen bg-neutral-100/70">
      <div className="mx-auto max-w-3xl px-4 pb-16 pt-10 md:px-6">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
            Reactions to the Comments
          </h1>
          <p className="text-sm text-gray-500">
            Thinking about the comments you just read, please tell us how much
            you agree or disagree with the following statement:
          </p>
          <p className="mt-3 text-sm italic text-gray-700">
            “The comments I read changed my mind about DEI.”
          </p>
        </header>
        <ProgressBar stepIndex={0} total={10} />

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
          <RadioList
            name="control_comments_changed_mind"
            options={OPTIONS}
            value={value}
            onChange={setValue}
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
