import { useNavigate } from "react-router-dom";
import { useSurvey } from "../../store/surveyStore.jsx";
import ProgressBar from "../../components/ProgressBar.jsx";

const DEVICES = ["Desktop", "Laptop", "Tablet", "Phone", "Prefer not to say"];
const BROWSERS = ["Chrome", "Safari", "Firefox", "Edge", "Other / Unsure"];

export default function PostDeviceBrowser() {
  const nav = useNavigate();
  const { answers, setAnswer } = useSurvey();

  const device = answers.demo_device ?? "";
  const browser = answers.demo_browser ?? "";
  const browserOther = answers.demo_browser_other ?? "";

  const needsOther = browser === "Other / Unsure";
  const canContinue = Boolean(device && browser && (!needsOther || browserOther.trim().length));

  return (
    <div className="min-h-screen bg-neutral-100/70">
      <div className="mx-auto max-w-3xl px-4 pb-16 pt-10 md:px-6">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Final Questions</h1>
          <p className="text-sm text-gray-500">These help us understand your setup.</p>
        </header>

        {/* Last step of 6 → zero-based index = 5 */}
        <ProgressBar stepIndex={5} total={6} />

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8 space-y-8">
          {/* Device */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900">What device are you using?</h2>
            <div className="mt-4 space-y-3">
              {DEVICES.map((opt) => {
                const active = device === opt;
                return (
                  <label
                    key={opt}
                    className={`flex items-center gap-3 rounded-xl border bg-white px-4 py-3 shadow-sm transition hover:bg-gray-50 ${
                      active ? "border-blue-600 ring-2 ring-blue-200" : "border-gray-200"
                    }`}
                  >
                    <input
                      type="radio"
                      className="h-5 w-5 accent-blue-600"
                      name="demo_device"
                      checked={active}
                      onChange={() => setAnswer("demo_device", opt)}
                    />
                    <span className="text-gray-800">{opt}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Browser */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Which browser are you using?</h2>
            <div className="mt-4 space-y-3">
              {BROWSERS.map((opt) => {
                const active = browser === opt;
                return (
                  <label
                    key={opt}
                    className={`flex items-center gap-3 rounded-xl border bg-white px-4 py-3 shadow-sm transition hover:bg-gray-50 ${
                      active ? "border-blue-600 ring-2 ring-blue-200" : "border-gray-200"
                    }`}
                  >
                    <input
                      type="radio"
                      className="h-5 w-5 accent-blue-600"
                      name="demo_browser"
                      checked={active}
                      onChange={() => setAnswer("demo_browser", opt)}
                    />
                    <span className="text-gray-800">{opt}</span>
                  </label>
                );
              })}
            </div>

            {needsOther && (
              <div className="mt-4">
                <label className="block text-sm text-gray-700 mb-1">
                  If other, please specify
                </label>
                <input
                  type="text"
                  value={browserOther}
                  onChange={(e) => setAnswer("demo_browser_other", e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="e.g., Brave, Opera, Unsure"
                />
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => nav("/post/zip")}
              className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-sm transition hover:bg-gray-50"
            >
              Back
            </button>
            <button
              onClick={() => nav("/done")}
              disabled={!canContinue}
              className="rounded-xl bg-blue-600 px-5 py-2.5 font-medium text-white shadow-md transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Finish
            </button>
          </div>

          {!canContinue && (
            <div className="text-sm text-red-600">Please select a device and a browser.</div>
          )}
        </div>
      </div>
    </div>
  );
}
