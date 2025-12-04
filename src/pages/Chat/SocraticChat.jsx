// src/pages/chat/SocraticChat.jsx
import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSurvey } from "../../store/surveyStore.jsx";
import { saveSurvey, chatTurn } from "../../lib/api";
import { getOrCreatePID } from "../../lib/identity";
import { getOrAssignCondition } from "../../lib/condition";
import DebugBadge from "../../components/DebugBadge.jsx";

function buildIntroFromPre(answers) {
  const stance = answers.stance;
  const stanceText = answers.pre_stance_text;
  const warmIn = answers.warm_in;
  const warmOut = answers.warm_out;

  const bits = [];

  if (stance) {
    bits.push(`you said DEI at work is "${stance}".`);
  }
  if (stanceText) {
    bits.push(`you explained your view as: "${stanceText}".`);
  }
  if (typeof warmIn === "number") {
    bits.push(`you rated people who share your views at ${warmIn} on the feeling scale.`);
  }
  if (typeof warmOut === "number") {
    bits.push(`you rated people who *disagree* with you at ${warmOut} on the feeling scale.`);
  }

  if (!bits.length) {
    return (
      "Let's talk a bit more about how you see DEI in the workplace. " +
      "Feel free to restate your view in your own words."
    );
  }

  return (
    "Earlier in the survey, " +
    bits.join(" ") +
    " I'd like to explore that with you using short, reflective questions."
  );
}

export default function SocraticChat() {
  const nav = useNavigate();
  const { answers, setAnswer } = useSurvey();

  const pid = useMemo(() => getOrCreatePID(), []);
  const condition = useMemo(() => getOrAssignCondition("socratic"), []);

  const introText = useMemo(() => buildIntroFromPre(answers), [answers]);

  const [messages, setMessages] = useState(() => [
    { id: 1, role: "assistant", content: introText },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [continuing, setContinuing] = useState(false);

  useEffect(() => {
    setAnswer("participant_id", pid);
    setAnswer("condition", condition);
  }, [pid, condition, setAnswer]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const newUserMsg = {
      id: Date.now(),
      role: "user",
      content: trimmed,
    };
    const nextMessages = [...messages, newUserMsg];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const payload = {
        condition: "socratic",
        messages: nextMessages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      };

      const data = await chatTurn(payload);
      const replyText =
        data && data.reply
          ? data.reply
          : "Something went wrong reaching the chatbot. You can still type more if you like.";

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: replyText,
        },
      ]);
    } catch (e) {
      console.error("chat error", e);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          content:
            "I'm having trouble reaching the chat service. You can still reflect in your own words here.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    if (continuing) return;
    setContinuing(true);
    
    // Store transcript in survey state for final save
    setAnswer("chat_transcript", messages);
    setAnswer("chat_mode", "socratic");
    
    // Save in background (don't wait)
    saveSurvey({
      participant_id: pid,
      phase: "chat",
      condition,
      answers: { chat_transcript: messages },
      meta: { mode: "socratic" },
    }).catch((e) => console.error("background save error", e));
    
    // Navigate immediately
    nav("/chat/satisfaction");
  };

  return (
    <div className="min-h-screen bg-neutral-100/70 flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-3xl rounded-2xl border border-gray-200 bg-white shadow-sm flex flex-col">
        <header className="border-b border-gray-100 px-6 py-4">
          <h1 className="text-xl font-semibold text-gray-900">
            Conversation about DEI (Socratic)
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            The chatbot will ask short, reflective questions based on what you shared earlier.
          </p>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
          {messages.map((m) => (
            <div
              key={m.id}
              className={
                m.role === "assistant"
                  ? "flex justify-start"
                  : "flex justify-end"
              }
            >
              <div
                className={
                  m.role === "assistant"
                    ? "max-w-[75%] rounded-2xl bg-gray-100 px-4 py-2 text-sm text-gray-900"
                    : "max-w-[75%] rounded-2xl bg-blue-600 px-4 py-2 text-sm text-white"
                }
              >
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="rounded-2xl bg-gray-100 px-4 py-2 text-sm text-gray-500">
                Thinking…
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-gray-100 px-6 py-4 space-y-3">
          <div className="flex gap-2">
            <input
              className="flex-1 rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="Type your response here…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-md transition hover:bg-blue-700 disabled:opacity-50"
            >
              Send
            </button>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-dashed border-gray-200">
            <p className="text-xs text-gray-500">
              You can move on whenever you feel done with the conversation.
            </p>
            <button
              onClick={handleContinue}
              disabled={continuing}
              className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50"
            >
              {continuing ? "Loading..." : "Continue to next questions"}
            </button>
          </div>
        </div>
      </div>

      <DebugBadge pid={pid} condition={condition} />
    </div>
  );
}