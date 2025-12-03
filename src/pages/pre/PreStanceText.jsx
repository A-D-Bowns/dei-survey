import { useNavigate } from "react-router-dom";
import { useSurvey } from "../../store/surveyStore.jsx";

export default function PreStanceText() {
  const nav = useNavigate();
  const { answers, setAnswer } = useSurvey();
  const text = answers.pre_stance_text ?? "";

  return (
    <div className="min-h-screen bg-neutral-100/70">
      <div className="mx-auto max-w-3xl px-4 pb-16 pt-10 md:px-6">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">In your own words</h1>
          <p className="text-sm text-gray-500">Briefly explain your position on workplace DEI.</p>
        </header>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
          <textarea
            className="w-full min-h-[160px] rounded-xl border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="Type your thoughts here…"
            value={text}
            onChange={(e) => setAnswer("pre_stance_text", e.target.value)}
          />

          <div className="mt-8 flex items-center justify-between">
            <button
              type="button"
              onClick={() => nav(-1)}
              className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-sm transition hover:bg-gray-50"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => nav("/pre/Dei-Stance")}
              disabled={!text.trim()}
              className="rounded-2xl bg-blue-600 px-5 py-2.5 font-medium text-white shadow-md transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Continue
            </button>
          </div>

          {!text.trim() && (
            <div className="mt-3 text-sm text-red-600">Please enter a brief explanation to continue.</div>
          )}
        </div>
      </div>
    </div>
  );
}
