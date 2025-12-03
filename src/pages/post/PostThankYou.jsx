import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSurvey } from "../../store/surveyStore.jsx";
import { saveSurvey } from "../../lib/api";

export default function PostThankYou() {
  const nav = useNavigate();
  const { answers } = useSurvey();

  const participant_id = useMemo(
    () => answers.participant_id || localStorage.getItem("participant_id") || "",
    [answers.participant_id]
  );
  const condition = useMemo(
    () =>
      answers.condition ||
      localStorage.getItem("survey_condition") ||
      localStorage.getItem("condition") ||
      "",
    [answers.condition]
  );

  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");

  const handleSubmit = async () => {
    if (submitting) return;
    setErr("");
    setSubmitting(true);
    try {
      await saveSurvey({
        participant_id,
        phase: "post",
        condition,
        answers, // saves ALL post answers + anything else already in the store
        meta: {
          client_ts: new Date().toISOString(),
          page: "post/thanks",
          app_version: "v1",
        },
      });
      nav("/done");
    } catch (e) {
      setErr(e?.message || "Failed to submit. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100/70">
      <div className="mx-auto max-w-2xl px-4 pb-16 pt-16">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold mb-3">Thanks for completing the survey!</h2>
          <p className="text-gray-700 mb-6">
            When you click <span className="font-medium">Save &amp; Submit</span>, your responses
            will be recorded. You’ll then see a confirmation screen.
          </p>

          {/* Optional mini review: show last few post fields (hide if you prefer) */}
          <details className="mb-6">
            <summary className="cursor-pointer text-sm text-gray-600">Review a summary (optional)</summary>
            <pre className="mt-3 rounded-lg bg-gray-900 p-4 text-xs text-gray-100 overflow-auto max-h-64">
{JSON.stringify(
  {
    demo_device: answers.demo_device ?? null,
    demo_browser: answers.demo_browser ?? null,
    demo_household_income: answers.demo_household_income ?? null,
    demo_zipcode: answers.demo_zipcode ?? null,
  },
  null,
  2
)}
            </pre>
          </details>

          {err && <div className="mb-4 text-sm text-red-600">{err}</div>}

          <div className="flex items-center justify-between">
            <button
              onClick={() => nav(-1)}
              disabled={submitting}
              className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-sm transition hover:bg-gray-50"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="rounded-xl bg-blue-600 px-5 py-2.5 font-medium text-white shadow-md transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Saving…" : "Save & Submit"}
            </button>
          </div>

          <p className="mt-3 text-xs text-gray-400">
            Participant: {participant_id || "unknown"} · Condition: {condition || "unknown"}
          </p>
        </div>
      </div>
    </div>
  );
}
