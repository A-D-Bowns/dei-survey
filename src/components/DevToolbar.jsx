import { useLocation, useNavigate } from "react-router-dom";
import { useSurvey } from "../store/surveyStore.jsx";

export default function DevToolbar() {
  const { resetAll, answers } = useSurvey();
  const nav = useNavigate();
  const { search } = useLocation();

  // Only render when ?debug=1 is in the URL
  const debug = new URLSearchParams(search).get("debug") === "1";
  if (!debug) return null;

  const setCond = (c) => {
    localStorage.setItem("condition", c);

    // Also mirror condition in survey_answers for components that read from store
    try {
      const raw = localStorage.getItem("survey_answers");
      const obj = raw ? JSON.parse(raw) : {};
      obj.condition = c;
      localStorage.setItem("survey_answers", JSON.stringify(obj));
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn("DevToolbar: couldn't update survey_answers", e);
    }

    // Hard refresh so any memoized reads re-pick it up
    window.location.reload();
  };

  const go = (path) => {
    const q = search || "";
    nav(path + q);
  };

  const handleReset = () => {
    resetAll(); // clears local store + localStorage key we manage
    localStorage.removeItem("participant_id"); // optional
    go("/"); // preserve ?debug=1
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 rounded-xl border border-gray-300 bg-white/90 backdrop-blur px-3 py-2 shadow">
      <div className="text-[11px] text-gray-500 font-medium mb-1">🧪 Dev Toolbar</div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleReset}
          className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
          title="Clear local answers and return to Welcome"
        >
          Reset survey
        </button>

        <button
          onClick={() => console.log("answers ▶", answers)}
          className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50"
          title="Log current answers in console"
        >
          Log answers
        </button>

        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-500 mr-1">Condition:</span>
          {["control", "socratic", "perspective"].map((c) => (
            <button
              key={c}
              onClick={() => setCond(c)}
              className="rounded-md border px-2 py-1 text-xs hover:bg-gray-50"
              title={`Set condition = ${c}`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-500 mr-1">Jump:</span>
          <button onClick={() => go("/")} className="rounded-md border px-2 py-1 text-xs hover:bg-gray-50">Welcome</button>
          <button onClick={() => go("/consent")} className="rounded-md border px-2 py-1 text-xs hover:bg-gray-50">Consent</button>
          <button onClick={() => go("/stance")} className="rounded-md border px-2 py-1 text-xs hover:bg-gray-50">Pre Stance</button>
          <button onClick={() => go("/chat")} className="rounded-md border px-2 py-1 text-xs hover:bg-gray-50">Chat</button>
          <button onClick={() => go("/control/likert-pre")} className="rounded-md border px-2 py-1 text-xs hover:bg-gray-50">Control 1</button>
          <button onClick={() => go("/post/stance")} className="rounded-md border px-2 py-1 text-xs hover:bg-gray-50">Post Stance</button>
          <button onClick={() => go("/done")} className="rounded-md border px-2 py-1 text-xs hover:bg-gray-50">Done</button>
        </div>
      </div>
    </div>
  );
}
