// src/pages/post/PostRace.jsx
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSurvey } from "../../store/surveyStore.jsx";
import ProgressBar from "../../components/ProgressBar.jsx";

const OPTIONS = [
  "White or Caucasian",
  "Black or African American",
  "American Indian/Native American or Alaska Native",
  "Asian",
  "Native Hawaiian or Other Pacific Islander",
  "Other",
  "Prefer not to say",
];

export default function PostRace() {
  const nav = useNavigate();
  const { answers, setAnswer } = useSurvey();

  // restore prior selections if user navigates back
  const initialChecked = useMemo(
    () => new Set(answers.post_race ?? []),
    [answers.post_race]
  );
  const [checked, setChecked] = useState(initialChecked);
  const [otherText, setOtherText] = useState(answers.post_race_other ?? "");

  const isOther = checked.has("Other");
  const isPnts = checked.has("Prefer not to say");

  const toggle = (label) => {
    const next = new Set(checked);
    if (next.has(label)) next.delete(label);
    else next.add(label);

    // If user selects "Prefer not to say", clear all others
    if (label === "Prefer not to say" && !checked.has("Prefer not to say")) {
      next.clear();
      next.add("Prefer not to say");
    }
    // If any other is selected while PNTS is active, remove PNTS
    if (label !== "Prefer not to say" && checked.has("Prefer not to say")) {
      next.delete("Prefer not to say");
    }
    setChecked(next);
  };

  const onNext = () => {
    const list = Array.from(checked);
    setAnswer("post_race", list);
    setAnswer("post_race_other", isOther ? otherText.trim() : "");
    nav("/post/education");
  };

  const disabled =
    checked.size === 0 ||
    (isOther && otherText.trim().length === 0 && !isPnts);

  return (
    <div className="min-h-screen bg-neutral-100/70">
      <div className="mx-auto max-w-3xl px-4 pb-16 pt-10 md:px-6">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
            About You
          </h1>
          <p className="text-sm text-gray-500">
            Choose one or more races that you consider yourself to be.
          </p>
        </header>

        <ProgressBar stepIndex={3} total={10} />

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
          <h2 className="text-xl font-semibold text-gray-900 md:text-2xl mb-4">
            Race / Ethnicity
          </h2>

          <div className="space-y-3">
            {OPTIONS.map((label) => (
              <label
                key={label}
                className={`flex items-start gap-3 rounded-xl border bg-white px-4 py-3 shadow-sm transition hover:bg-gray-50 ${
                  checked.has(label)
                    ? "border-blue-600 ring-2 ring-blue-200"
                    : "border-gray-200"
                }`}
              >
                <input
                  type="checkbox"
                  className="mt-1 h-5 w-5 accent-blue-600"
                  checked={checked.has(label)}
                  onChange={() => toggle(label)}
                />
                <span className="text-gray-800">{label}</span>
              </label>
            ))}

            {isOther && (
              <div className="ml-9">
                <input
                  type="text"
                  placeholder="Please specify"
                  value={otherText}
                  onChange={(e) => setOtherText(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
            )}
          </div>

          <div className="mt-8 flex items-center justify-between">
            <button
              onClick={() => nav(-1)}
              className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-sm transition hover:bg-gray-50"
            >
              Back
            </button>
            <button
              onClick={onNext}
              disabled={disabled}
              className="rounded-xl bg-blue-600 px-5 py-2.5 font-medium text-white shadow-md transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Continue
            </button>
          </div>

          {disabled && (
            <div className="mt-3 text-sm text-red-600">
              Please select at least one option. If you choose “Other”, enter a
              description.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
