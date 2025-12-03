// src/pages/chat/ChatShell.jsx
import { useState } from "react";
import { useSurvey } from "../../store/surveyStore.jsx";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export default function ChatShell({ condition, onDone }) {
  const { setAnswer } = useSurvey();

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        condition === "socratic"
          ? "To start, how do you currently feel about DEI efforts in the workplace?"
          : condition === "perspective"
          ? "To start, how would you describe your view on DEI efforts—and how do you think people who disagree might see it?"
          : "How do you currently feel about DEI efforts in the workplace?",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [turns, setTurns] = useState(0);

  const canSend = input.trim().length > 0 && !loading;

  async function handleSend(e) {
    e.preventDefault();
    if (!canSend) return;

    const userText = input.trim();
    const nextMessages = [
      ...messages,
      { role: "user", content: userText },
    ];

    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/chat/llm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          condition,
          messages: nextMessages, // 👈 matches backend schema
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();

      const reply = data.reply || "Thanks for sharing. Could you say more?";
      const updated = [
        ...nextMessages,
        { role: "assistant", content: reply },
      ];

      setMessages(updated);
      setTurns((t) => t + 1);

      // Optionally stash transcript in survey state (for saving on /done)
      setAnswer("chat_transcript", updated);
      setAnswer("chat_condition", condition);

      // After a few turns, show the "Continue" button
      // (we don't auto-navigate; let user click)
    } catch (err) {
      console.error("chat error", err);
      const updated = [
        ...nextMessages,
        {
          role: "assistant",
          content:
            "I'm having trouble reaching the server right now, but I appreciate what you've shared.",
        },
      ];
      setMessages(updated);
    } finally {
      setLoading(false);
    }
  }

  const showContinue = turns >= 3; // tweak: how long they must chat

  return (
    <div className="min-h-screen bg-neutral-100/70">
      <div className="mx-auto max-w-3xl px-4 pb-16 pt-10 md:px-6">
        <header className="mb-4">
          <h1 className="text-2xl font-semibold text-gray-900">
            DEI Conversation
          </h1>
          <p className="text-sm text-gray-500">
            Condition: <span className="font-medium">{condition}</span>
          </p>
        </header>

        <div className="mb-4 h-80 overflow-y-auto rounded-2xl border border-gray-200 bg-white p-4 shadow-sm space-y-3">
          {messages.map((m, i) => (
            <div
              key={i}
              className={
                m.role === "assistant"
                  ? "max-w-[80%] rounded-2xl bg-blue-50 px-3 py-2 text-sm text-gray-900"
                  : "ml-auto max-w-[80%] rounded-2xl bg-gray-900 px-3 py-2 text-sm text-white"
              }
            >
              {m.content}
            </div>
          ))}
        </div>

        <form onSubmit={handleSend} className="flex gap-2">
          <input
            className="flex-1 rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="Type your response..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="submit"
            disabled={!canSend}
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-md transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "..." : "Send"}
          </button>
        </form>

        {showContinue && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={onDone}
              className="rounded-xl bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-md transition hover:bg-green-700"
            >
              Continue to post-survey
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
