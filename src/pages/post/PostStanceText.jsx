import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSurvey } from "../../store/surveyStore.jsx";
import { saveSurvey } from "../../lib/api";
import { getOrCreatePID } from "../../lib/identity";

export default function PostStanceText() {
  const nav = useNavigate();
  const { answers, setAnswer } = useSurvey();
  const pid = getOrCreatePID();
  const [text, setText] = useState(answers.stance_text_post ?? "");
  const chars = text.trim().length;
  const min = 30;

  const onContinue = async () => {
    setAnswer("stance_text_post", text);
    try {
      await saveSurvey({
        participant_id: pid,
        phase: "post_text",
        condition: answers.condition || "",
        answers: { stance_text_post: text },
        meta: { chars, from: "post-stance-text" },
      });
    } catch (e) {
      console.error("save post_text failed", e);
    }
    // after this, we proceed with your post survey flow (stance → info → strength → complexity)
    nav("/post/stance");
  };

  return (
    <div className="min-h-screen bg-neutral-100/70">
      <div className="mx-auto max-w-3xl px-4 pb-16 pt-10 md:px-6">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
            Post Survey — Re-state Your Stance
          </h1>
          <p className="text-sm text-gray-500">
            After the previous section, how would you now describe your view on workplace DEI?
          </p>
        </header>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={8}
            className="w-full rounded-xl border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="Write your stance here…"
          />
          <div className="mt-2 text-xs text-gray-500">{chars} characters</div>

          <div className="mt-6 flex items-center justify-between">
            <button
              onClick={() => nav(-1)}
              className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-sm transition hover:bg-gray-50"
            >
              Back
            </button>
            <button
              onClick={onContinue}
              disabled={chars < min}
              className="rounded-xl bg-blue-600 px-5 py-2.5 font-medium text-white shadow-md transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Continue
            </button>
          </div>

          {chars < min && (
            <div className="mt-3 text-sm text-red-600">
              Please write at least {min} characters to continue.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
