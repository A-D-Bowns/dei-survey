import { useNavigate } from "react-router-dom";
import { useSurvey } from "../../store/surveyStore.jsx";
import ProgressBar from "../../components/ProgressBar.jsx";

export default function PostZipCode() {
  const nav = useNavigate();
  const { answers, setAnswer } = useSurvey();

  const zipcode = answers.demo_zipcode ?? "";
  const canContinue = true; // ZIP is optional

  const onChangeZip = (v) => {
    // keep as raw string; backend will store as its own field in answers JSON → separate CSV column on your side if you parse it out
    setAnswer("demo_zipcode", v);
  };

  return (
    <div className="min-h-screen bg-neutral-100/70">
      <div className="mx-auto max-w-3xl px-4 pb-16 pt-10 md:px-6">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">ZIP Code (Optional)</h1>
          <p className="text-sm text-gray-500">
            This helps analyze geographic patterns. You may leave it blank.
          </p>
        </header>

        {/* Now step 5 of 6 after splitting ZIP */}
        <ProgressBar stepIndex={8} total={10} />

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
          <label className="block text-gray-800 font-medium">ZIP</label>
          <input
            type="text"
            inputMode="numeric"
            maxLength={10}
            placeholder="e.g., 19716"
            value={zipcode}
            onChange={(e) => onChangeZip(e.target.value)}
            className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          <p className="mt-1 text-xs text-gray-400">5-digit ZIP or ZIP+4 is fine. Leave blank if you prefer.</p>

          <div className="mt-8 flex items-center justify-between">
            <button
              onClick={() => nav("/post/income")}
              className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-sm transition hover:bg-gray-50"
            >
              Back
            </button>
            <button
              onClick={() => nav("/post/device-browser")}
              disabled={!canContinue}
              className="rounded-xl bg-blue-600 px-5 py-2.5 font-medium text-white shadow-md transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
