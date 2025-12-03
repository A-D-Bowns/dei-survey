// src/pages/Chat.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSurvey } from "../store/surveyStore.jsx";
import { getOrCreatePID } from "../lib/identity";
import { getOrAssignCondition } from "../lib/condition";

export default function Chat() {
  const nav = useNavigate();
  const { setAnswer } = useSurvey();
  const [ready, setReady] = useState(false);

  const pid = useMemo(() => getOrCreatePID(), []);
  const condition = useMemo(() => getOrAssignCondition(), []);

  useEffect(() => {
    try {
      setAnswer("participant_id", pid);
      setAnswer("condition", condition);
    } catch (e) {
      // never crash
      console.warn("Chat init setAnswer warning:", e);
    } finally {
      setReady(true);
    }
  }, [pid, condition, setAnswer]);

  useEffect(() => {
    if (!ready) return;
    if (condition === "socratic") nav("/chat/socratic", { replace: true });
    else if (condition === "perspective") nav("/chat/perspective", { replace: true });
    else nav("/control/likert-pre", { replace: true }); // control
  }, [ready, condition, nav]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100/70 px-4">
      <div className="max-w-md w-full rounded-2xl border border-gray-200 bg-white p-8 shadow-sm text-center">
        <h2 className="text-xl font-semibold text-gray-900">Loading the next step…</h2>
        <p className="text-gray-600 mt-2">
          Setting up your session. If this screen persists, refresh the page.
        </p>
      </div>
    </div>
  );
}
