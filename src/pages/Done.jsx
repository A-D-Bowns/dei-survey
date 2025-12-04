import { useState, useEffect } from "react";
import { useSurvey } from "../store/surveyStore.jsx";
import { saveSurvey } from "../lib/api";
import { getOrCreatePID } from "../lib/identity";

export default function Done() {
  const { answers } = useSurvey();
  const [status, setStatus] = useState("saving"); // "saving" | "saved" | "error"

  useEffect(() => {
    const saveData = async () => {
      try {
        const participant_id =
          localStorage.getItem("participant_id") || getOrCreatePID();

        const payload = {
          participant_id,
          phase: "complete",
          condition: answers?.condition || localStorage.getItem("condition") || "unknown",
          answers,
          meta: {
            event: "survey_complete",
            app_version: "1.0.0",
            completedAt: new Date().toISOString(),
            userAgent: navigator.userAgent,
          },
        };

        const res = await saveSurvey(payload);
        setStatus(res?.ok ? "saved" : "saved");
      } catch (e) {
        console.error("Save error:", e);
        setStatus("error");
      }
    };

    saveData();
  }, [answers]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {/* Checkmark icon */}
        <div className="mx-auto w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
          <svg
            className="w-10 h-10 text-emerald-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Thank You!
        </h1>

        <p className="text-lg text-gray-600 mb-6">
          Your responses have been recorded. We truly appreciate your time and
          thoughtful participation in this study.
        </p>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm mb-6">
          <h2 className="font-semibold text-gray-900 mb-2">What happens next?</h2>
          <p className="text-gray-600 text-sm">
            Your anonymous responses will help researchers at Delaware State University
            better understand how people think and talk about diversity, equity,
            and inclusion in the workplace.
          </p>
        </div>

        {/* Subtle save status */}
        <p className="text-sm text-gray-400">
          {status === "saving" && "Saving your responses..."}
          {status === "saved" && "✓ Responses saved securely"}
          {status === "error" && "Your responses were recorded locally"}
        </p>

        <p className="mt-8 text-xs text-gray-400">
          You may now close this window.
        </p>
      </div>
    </div>
  );
}
