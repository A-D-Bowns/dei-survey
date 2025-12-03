import { useNavigate } from "react-router-dom";
import { useSurvey } from "../../store/surveyStore.jsx";
import Likert5 from "../../components/Likert5.jsx";
import ProgressBar from "../../components/ProgressBar.jsx";

const COMMENTS = [
  { id: "c1", text: "DEI initiatives help create fair opportunities for underrepresented groups at work." },   // pro
  { id: "c2", text: "DEI programs sometimes prioritize optics over actual competence and results." },           // anti
  { id: "c3", text: "Mentorship and outreach are more effective than quotas for long-term inclusion." },        // neutral/nuanced
  { id: "c4", text: "Diverse teams can bring better ideas but also require stronger conflict resolution." },    // neutral/nuanced
  { id: "c5", text: "Mandatory trainings don’t change attitudes; voluntary communities of practice are better."},// neutral/nuanced
  { id: "c6", text: "DEI creates a more welcoming culture that retains talented employees." },                  // pro
  { id: "c7", text: "DEI efforts reduce hidden biases and help ensure hiring processes are fair." },
  { id: "c8", text: "Organizations with strong DEI values tend to have higher employee satisfaction." },
  { id: "c9", text: "DEI training helps people understand perspectives they may never encounter otherwise." },
  { id: "c10", text: "Supporting DEI shows a company’s commitment to treating people with dignity and respect." },
  { id: "c11", text: "DEI helps break down structural barriers that have historically limited equal access." },
  { id: "c12", text: "DEI programs can create resentment by implying some groups need extra help to succeed." },
  { id: "c13", text: "Focusing heavily on identity can distract from merit-based evaluation and skills." },
  { id: "c14", text: "DEI initiatives sometimes pressure employees to conform ideologically." },
  { id: "c15", text: "Some DEI roles and programs expand bureaucracy without improving performance." },
  { id: "c16", text: "DEI hiring targets may unintentionally sideline qualified candidates." },
  { id: "c17", text: "DEI matters, but most people interpret it differently depending on their experiences." },
  { id: "c18", text: "I support fairness for everyone, but I’m unsure whether current DEI programs achieve that goal." },
  { id: "c19", text: "The biggest issue isn’t DEI itself, but how inconsistently organizations choose to implement it." },

];

export default function ControlComments() {
  const nav = useNavigate();
  const { answers, setAnswer } = useSurvey();

  // Load existing or init
  const current = Array.isArray(answers.ctrl_comments) ? answers.ctrl_comments : [];
  const getRating = (id) => current.find((x) => x.id === id)?.rating ?? null;

  const setRating = (id, rating) => {
    const next = [...current];
    const i = next.findIndex((x) => x.id === id);
    if (i >= 0) next[i] = { ...next[i], rating };
    else next.push({ id, text: COMMENTS.find(c => c.id === id)?.text || "", rating });
    setAnswer("ctrl_comments", next);
  };

  const allRated = COMMENTS.every((c) => getRating(c.id) !== null);

  return (
    <div className="min-h-screen bg-neutral-100/70">
      <div className="mx-auto max-w-3xl px-4 pb-16 pt-10 md:px-6">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Brief Reflection (Control)</h1>
          <p className="text-sm text-gray-500">Step 2 of 3</p>
        </header>

        <ProgressBar stepIndex={1} total={3} />

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8 space-y-6">
          {COMMENTS.map((c, idx) => (
            <div key={c.id} className="border-b border-gray-100 pb-4">
              <div className="mb-2 text-gray-900 font-medium">
                {idx + 1}. {c.text}
              </div>
              <Likert5
                name={`likert_${c.id}`}
                value={getRating(c.id)}
                onChange={(v) => setRating(c.id, v)}
              />
            </div>
          ))}

          <div className="mt-4 flex justify-end">
            <button
              onClick={() => nav("/control/likert-post")}
              disabled={!allRated}
              className="rounded-xl bg-blue-600 px-5 py-2.5 font-medium text-white shadow-md hover:bg-blue-700 disabled:opacity-50"
            >
              Continue
            </button>
          </div>

          {!allRated && (
            <div className="mt-3 text-sm text-red-600">
              Please rate each comment before continuing.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
