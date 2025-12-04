import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSurvey } from "../../store/surveyStore.jsx";

const CONDITIONS = ["control", "socratic", "perspective"];

export default function Welcome() {
  const nav = useNavigate();
  const { answers, setAnswer } = useSurvey();

  // one-time setup: participant_id + randomized condition (if missing)
  useEffect(() => {
    // participant id
    let pid = localStorage.getItem("participant_id");
    if (!pid) {
      pid = crypto.randomUUID?.() || String(Date.now());
      localStorage.setItem("participant_id", pid);
    }

    // condition
    if (!answers.condition) {
      const rand = CONDITIONS[Math.floor(Math.random() * CONDITIONS.length)];
      setAnswer("condition", rand);
      localStorage.setItem("condition", rand);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-neutral-100/70">
      <div className="mx-auto max-w-3xl px-4 pb-16 pt-12 md:px-6">
        {/* Header / Title */}
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
            Welcome to the DEI Dialogue Study
          </h1>
          <p className="mt-2 text-sm text-gray-500">Approx. 8–10 minutes • anonymous • voluntary</p>
        </header>

        {/* Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
          {/* DEI definition */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900">What do we mean by “DEI”?</h2>
            <p className="mt-3 text-gray-700 leading-relaxed">
              In this study, <span className="font-medium">Diversity, Equity, and Inclusion (DEI)</span> refers to
              workplace policies and practices intended to recruit, support, and advance people from
              different backgrounds; reduce unfair barriers; and foster a sense of belonging
              across teams.
            </p>
          </section>

          {/* What you'll do */}
          <section className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900">What you’ll do</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-gray-700">
              <li>Answer a short pre-survey about your views and knowledge.</li>
              <li>Complete a brief chat-based activity (your experience may vary).</li>
              <li>Answer a short post-survey about your perceptions.</li>
            </ul>
          </section>

          {/* Randomization notice */}
          <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-900">
            For research purposes, participants are assigned to different interaction types at random.
          </div>

          {/* Begin button */}
          <div className="mt-8 flex items-center justify-between">
            <Link
              to="https://desu.edu"  // placeholder; optional footer link
              className="text-xs text-gray-400 hover:text-gray-500"
              target="_blank" rel="noreferrer"
            >
              Delaware State University
            </Link>

            <button
              onClick={() => nav("/consent")}
              className="rounded-xl bg-blue-600 px-5 py-2.5 font-medium text-white shadow-md transition hover:bg-blue-700"
            >
              Next
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-gray-400">
          Questions? Contact <span className="font-medium text-gray-500">tsmolinski@desu.edu</span>
        </div>
      </div>
    </div>
  );
}
