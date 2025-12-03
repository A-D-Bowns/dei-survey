// src/pages/post/PostOpenness.jsx
import { useNavigate } from "react-router-dom";
import { useSurvey } from "../../store/surveyStore.jsx";
import ProgressBar from "../../components/ProgressBar.jsx";
import RadioList from "../../components/RadioList.jsx";

const SCALE = [
  "Strongly disagree",
  "Somewhat disagree",
  "Neither agree nor disagree",
  "Somewhat agree",
  "Strongly agree",
];

const ITEMS = [
  {
    key: "post_open_opp_view",
    label: "I am willing to consider viewpoints about DEI that differ from my own.",
  },
  {
    key: "post_open_reasonable",
    label: "People who disagree with me about DEI usually have reasonable reasons for their views.",
  },
  {
    key: "post_open_conversation",
    label: "I feel comfortable engaging in conversations with people who hold opposing DEI views.",
  },
];

export default function PostOpenness() {
  const nav = useNavigate();
  const { answers, setAnswer } = useSurvey();

  const handleChange = (key, value) => {
    setAnswer(key, value);
  };

  const canContinue = ITEMS.every((item) => !!answers[item.key]);

  return (
    <div className="min-h-screen bg-neutral-100/70">
      <div className="mx-auto max-w-3xl px-4 pb-16 pt-10 md:px-6">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
            Views About Opposing Perspectives
          </h1>
          <p className="text-sm text-gray-500">
            Please tell us how you feel about the following statements related to DEI and differing viewpoints.
          </p>
        </header>

        {/* 🔧 Adjust stepIndex / total to match your final post-survey flow */}
        <ProgressBar stepIndex={1} total={10} />

        <div className="space-y-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
          {ITEMS.map((item) => (
            <div key={item.key} className="space-y-3">
              <h2 className="text-base font-medium text-gray-900">{item.label}</h2>
              <RadioList
                name={item.key}
                options={SCALE}
                value={answers[item.key] ?? ""}
                onChange={(v) => handleChange(item.key, v)}
              />
            </div>
          ))}

          <div className="mt-8 flex items-center justify-between">
            {/* Back goes to satisfaction page */}
            <button
              onClick={() => nav("/post/satisfaction")}
              className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-sm transition hover:bg-gray-50"
            >
              Back
            </button>

            {/* Continue goes to DEI stance page */}
            <button
              onClick={() => canContinue && nav("/post/dei-stance")}
              disabled={!canContinue}
              className="rounded-xl bg-blue-600 px-5 py-2.5 font-medium text-white shadow-md transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Continue
            </button>
          </div>

          {!canContinue && (
            <div className="mt-3 text-sm text-red-600">
              Please answer all three questions before continuing.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
