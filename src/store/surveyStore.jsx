import { createContext, useContext, useState, useMemo, useEffect } from "react";

const KEY = "survey_answers";
const SurveyContext = createContext(null);

function safeParse(raw, fallback = {}) {
  try {
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function SurveyProvider({ children }) {
  // Hydrate from localStorage
  const [answers, setAnswers] = useState(() => {
    const cached = safeParse(localStorage.getItem(KEY), {});
    // If PID/condition were set earlier (identity/condition helpers), mirror them
    const pid = localStorage.getItem("participant_id");
    const cond = localStorage.getItem("condition");
    return {
      ...cached,
      ...(pid ? { participant_id: pid } : {}),
      ...(cond ? { condition: cond } : {}),
    };
  });

  // Persist to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(answers));
    } catch {
      // no-op
    }
  }, [answers]);

  // Set a single field
  const setAnswer = (key, value) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  // Set multiple fields at once
  const setMany = (obj) => {
    setAnswers(prev => ({ ...prev, ...obj }));
  };

  // Dev-only: clear everything
  const resetAll = () => {
    try { localStorage.removeItem(KEY); } catch {}
    setAnswers({});
  };

  const value = useMemo(() => ({ answers, setAnswer, setMany, resetAll }), [answers]);

  return (
    <SurveyContext.Provider value={value}>
      {children}
    </SurveyContext.Provider>
  );
}

export const useSurvey = () => {
  const ctx = useContext(SurveyContext);
  if (!ctx) throw new Error("useSurvey must be used inside <SurveyProvider>");
  return ctx;
};
