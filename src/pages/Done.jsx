import { useState } from "react";
import { useSurvey } from "../store/surveyStore.jsx";
import { saveSurvey } from "../lib/api";
import { getOrCreatePID } from "../lib/identity";
import DebugBadge from "../components/DebugBadge";

export default function Done() {
  const { answers } = useSurvey();
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  const handleSave = async () => {
    setSaving(true);
    setMsg(null);
    try {
      const participant_id =
        localStorage.getItem("participant_id") || getOrCreatePID();

      const payload = {
        participant_id,
        phase: answers?.phase || "pre", // "pre" until post flow sets "post"
        condition: answers?.condition || localStorage.getItem("condition") || "unknown",
        answers,
        meta: {
          event: "manual_save_done",
          app_version: "0.2.0",
          survey_version: "pre-post-v1",
          userAgent: navigator.userAgent,
        },
      };

      const res = await saveSurvey(payload);
      setMsg(res?.ok ? "Saved!" : "Save completed (no OK flag).");
    } catch (e) {
      console.error(e);
      setMsg(`Save failed: ${String(e?.message || e)}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100/70">
      <div className="mx-auto max-w-2xl px-4 pb-16 pt-16">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold mb-3">Thanks!</h2>
          <p className="text-gray-700 mb-6">Here’s what we captured (dev preview):</p>

          <pre className="rounded-lg bg-gray-900 p-4 text-sm text-gray-100 overflow-auto mb-6">
{JSON.stringify(answers, null, 2)}
          </pre>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-xl bg-blue-600 px-5 py-2.5 font-medium text-white shadow-md transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save to Backend"}
            </button>
            {msg && <span className="text-sm text-gray-600">{msg}</span>}
          </div>
        </div>
      </div>

      {/* Dev-only debug badge (shows only with ?debug=1 and in dev) */}
      <DebugBadge
        pid={localStorage.getItem("participant_id")}
        condition={localStorage.getItem("condition") || "unset"}
      />
    </div>
  );
}
