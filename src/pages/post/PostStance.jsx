import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSurvey } from "../../store/surveyStore.jsx";
import RadioList from "../../components/RadioList.jsx";
import ProgressBar from "../../components/ProgressBar.jsx";

const OPTIONS = ["A good thing", "A bad thing", "Unsure"];

export default function PostStance() {
  const nav = useNavigate();
  const { answers, setAnswer } = useSurvey();
  const value = answers.stance_post ?? "";

  // Mark phase = post on entering the post flow
  useEffect(() => {
    if (answers.phase !== "post") setAnswer("phase", "post");
  }, [answers.phase, setAnswer]);

  const onNext = () => { if (value) nav("/post/info-support"); };

  return (
    <div className="min-h-screen bg-neutral-100/70">
      <div className="mx-auto max-w-3xl px-4 pb-16 pt-10 md:px-6">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">DEI Study — Post Survey</h1>
        </header>

        {/* Post flow steps: Stance(1), Info(2), Strength(3), Complexity(4) */}
        <ProgressBar stepIndex={1} total={4} />

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
          <h2 className="text-xl font-semibold text-gray-900 md:text-2xl">
            Focusing on increasing diversity, equity, and inclusion (DEI) at work is mainly…
          </h2>

          <RadioList
            name="stance_post"
            options={OPTIONS}
            value={value}
            onChange={(v) => setAnswer("stance_post", v)}
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

          {!value && <div className="mt-3 text-sm text-red-600">Please select an option to continue.</div>}
        </div>
      </div>
    </div>
  );
}
