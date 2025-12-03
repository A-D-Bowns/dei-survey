from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Any, Dict, Optional, List, Literal
from datetime import datetime
import os
import json
import csv

# --- Optional: OpenAI client (only used if key is set) ---
try:
    from openai import OpenAI
except Exception:
    OpenAI = None

app = FastAPI()

# --- CORS: allow local frontend ---
ORIGINS = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Data directory / CSV setup ---
DATA_DIR = "data"
CSV_PATH = os.path.join(DATA_DIR, "responses.csv")
os.makedirs(DATA_DIR, exist_ok=True)


# ---------- Base survey submission ----------

class Submission(BaseModel):
    participant_id: Optional[str] = None
    ts: datetime = Field(default_factory=datetime.utcnow)
    phase: str                      # "pre", "post", "chat", etc.
    condition: Optional[str] = None # "control" | "socratic" | "perspective"
    answers: Dict[str, Any]
    meta: Optional[Dict[str, Any]] = None


@app.get("/")
def root():
    return {"ok": True, "msg": "survey backend running"}


@app.post("/save")
def save(sub: Submission):
    """Append one row into data/responses.csv."""
    header = [
        "participant_id",
        "ts_iso",
        "phase",
        "condition",
        "answers_json",
        "meta_json",
    ]

    row = {
        "participant_id": sub.participant_id or "",
        "ts_iso": sub.ts.isoformat(),
        "phase": sub.phase,
        "condition": sub.condition or "",
        "answers_json": json.dumps(sub.answers, ensure_ascii=False),
        "meta_json": json.dumps(sub.meta or {}, ensure_ascii=False),
    }

    write_header = not os.path.exists(CSV_PATH)
    with open(CSV_PATH, "a", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=header)
        if write_header:
            w.writeheader()
        w.writerow(row)

    return {"ok": True, "saved": True}


# ---------- Chat / LLM models (aligned with frontend) ----------

Role = Literal["user", "assistant", "system"]
Condition = Literal["control", "socratic", "perspective"]


class ChatMessage(BaseModel):
    role: Role
    content: str


class ChatRequest(BaseModel):
    condition: Condition
    messages: List[ChatMessage]


class ChatResponse(BaseModel):
    reply: str


# ---------- Chat helpers ----------

def heuristic_reply(mode: str, user_text: str) -> str:
    """Safe fallback reply when no API key or on error."""
    if mode == "socratic":
        return (
            "What makes you feel that way? "
            "Can you walk through your reasoning and consider any counter-examples?"
        )
    if mode == "perspective":
        return (
            "Try to state the strongest reasonable version of the opposite view. "
            "How might someone with different experiences see this issue?"
        )
    # control or anything else
    return "Thanks for sharing. Feel free to add more detail."


def generate_reply(mode: str, messages: List[ChatMessage]) -> str:
    """
    Take full message history from frontend and generate the next reply.
    Uses OpenAI if OPENAI_API_KEY is set; otherwise uses a heuristic.
    """
    api_key = os.getenv("OPENAI_API_KEY", "").strip()

    # Last user message (if any)
    last_user = next(
        (m.content for m in reversed(messages) if m.role == "user"),
        "",
    ).strip()

    if not last_user:
        return "Could you share a bit more about how you see this issue?"

    use_openai = bool(api_key and OpenAI is not None)
    print(f"DEBUG use_openai={use_openai} mode={mode} last_user_snippet={last_user[:80]!r}")

    if use_openai:
        try:
            client = OpenAI(api_key=api_key)

            # Choose a cost-effective, current model
            model_name = "gpt-4.1-mini"

            sys_prompt = (
                "You are a neutral, respectful facilitator discussing DEI in the workplace.\n"
                "- If mode='socratic': ask short, probing questions that help the user examine "
                "their assumptions, evidence, and alternative views.\n"
                "- If mode='perspective': encourage the user to steel-man and explore the strongest "
                "reasonable opposing perspective.\n"
                "- If mode='control': respond briefly and neutrally without guided questioning.\n"
                "Do NOT lecture or tell them what to think. Keep replies to 1-3 sentences."
            )

            history = [{"role": "system", "content": sys_prompt}]
            for m in messages[-12:]:
                # Map our roles directly; FastAPI schema restricts them already
                history.append({"role": m.role, "content": m.content})

            completion = client.chat.completions.create(
                model=model_name,
                messages=history,
                temperature=0.7,
                max_completion_tokens=220,
            )

            out = (completion.choices[0].message.content or "").strip()
            if out:
                return out

        except Exception as e:
            print("DEBUG openai_error:", repr(e))

    # Heuristic if no key or any error
    return heuristic_reply(mode, last_user)


# ---------- Chat route (called by frontend) ----------

@app.post("/chat/llm", response_model=ChatResponse)
def chat_llm(req: ChatRequest):
    """
    Expects:
    {
      "condition": "socratic" | "perspective" | "control",
      "messages": [{ "role": "...", "content": "..." }, ...]
    }
    """
    reply = generate_reply(req.condition, req.messages or [])
    return ChatResponse(reply=reply)
