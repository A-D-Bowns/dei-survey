// src/pages/pre/Consent.jsx
import { useNavigate } from "react-router-dom";
import { useSurvey } from "../../store/surveyStore.jsx";

export default function Consent() {
  const nav = useNavigate();
  const { setAnswer } = useSurvey();

  const handleAgree = () => {
    // Store consent in the survey store so it ends up in your CSV
    setAnswer("consent", "agree");
    nav("/pre/stance");
  };

  const handleDisagree = () => {
    setAnswer("consent", "disagree");
    // You can change this route if you want a special “decline” page
    nav("/done");
  };

  return (
    <div className="min-h-screen bg-neutral-100/70">
      <div className="mx-auto max-w-3xl px-4 pb-16 pt-10 md:px-6">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
            Consent to Participate in a Research Study
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Please read the information below before deciding whether to take part.
          </p>
        </header>

        {/* Body card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8 space-y-4">
          <p className="text-gray-700 leading-relaxed">
            You are being asked to take part in a research study about how people view
            issues related to diversity, equity, and inclusion (DEI) in the workplace.
            Please take a moment to read the following information.
          </p>

          <ul className="list-disc pl-5 space-y-1 text-gray-700">
            <li>Your participation is completely voluntary.</li>
            <li>You may stop participating at any time without penalty.</li>
            <li>Your responses will be anonymous and kept confidential.</li>
            <li>The survey will take approximately 5–10 minutes to complete.</li>
            <li>You must be at least 15 years old to participate.</li>
          </ul>

          <p className="text-gray-700 leading-relaxed">
            There are no known risks beyond those of everyday online activities. The
            main benefit of this study is to help researchers better understand how
            people think and talk about DEI.
          </p>

          <p className="text-gray-800 font-medium mt-4">
            By selecting <span className="italic">“I agree”</span> below, you confirm that:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-gray-700">
            <li>You have read and understood the information on this page.</li>
            <li>You are at least 15 years old.</li>
            <li>You voluntarily agree to participate in this study.</li>
          </ul>

          <p className="text-sm text-gray-500 mt-4">
            If you do not wish to participate, select “I do not agree” and you will
            exit the survey.
          </p>

          {/* Buttons */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleDisagree}
              className="w-full sm:w-auto rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
            >
              I do not agree
            </button>
            <button
              type="button"
              onClick={handleAgree}
              className="w-full sm:w-auto rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-md transition hover:bg-blue-700"
            >
              I agree — begin the survey
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}