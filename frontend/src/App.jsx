// src/App.jsx
import { useMemo, useState } from "react";
import ChatPanel from "./components/ChatPanel";
import PlanPanel from "./components/PlanPanel";

/**
 * Simple hackathon-ready prototype shell.
 * - Left: Chat input + message history (mock)
 * - Right: Plan preview (mock)
 *
 * Later you can:
 * - Replace mockPlan with backend /plan response
 * - Add animations (framer-motion) inside panels
 * - Add store cards, filters, copy/export, etc.
 */

const MOCK_PLAN = {
  dish: "Chocolate chip cookies",
  servings: "24 cookies",
  summary: {
    storesUsed: 2,
    estimatedTotal: 18.47,
    currency: "USD",
    missingCount: 1,
  },
  stores: [
    {
      name: "Walmart",
      distanceMiles: 1.2,
      items: [
        { ingredient: "All-purpose flour", qty: "2 1/4 cups", price: 3.49 },
        { ingredient: "Sugar", qty: "3/4 cup", price: 2.29 },
        { ingredient: "Eggs", qty: "2", price: 3.29 },
      ],
    },
    {
      name: "Target",
      distanceMiles: 2.0,
      items: [
        { ingredient: "Chocolate chips", qty: "2 cups", price: 3.99 },
        { ingredient: "Vanilla extract", qty: "2 tsp", price: 2.19 },
      ],
    },
  ],
  missing: [{ ingredient: "Baking soda", qty: "1 tsp" }],
  disclaimer:
    "Demo note: prices/availability are best-effort signals (not real-time shelf inventory).",
};

export default function App() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text:
        "Tell me what you want to cook or bake. I’ll generate an ingredient list, then split items across stores if needed.",
    },
  ]);

  const [input, setInput] = useState("");
  const [status, setStatus] = useState("idle"); // 'idle' | 'loading' | 'done' | 'error'
  const [plan, setPlan] = useState(null);

  const canSend = input.trim().length > 0 && status !== "loading";

  const headerSubtitle = useMemo(() => {
    if (status === "loading") return "Generating plan…";
    if (status === "done") return "Plan ready";
    if (status === "error") return "Something went wrong";
    return "Mock mode";
  }, [status]);

  async function handleSend() {
    const text = input.trim();
    if (!text || status === "loading") return;

    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setStatus("loading");

    try {
      // TODO (later): replace with real backend call
      // const res = await fetch("http://localhost:8000/plan", { method:"POST", headers:{...}, body: JSON.stringify({ text }) })
      // const data = await res.json()

      await new Promise((r) => setTimeout(r, 600));
      const data = MOCK_PLAN;

      setPlan(data);
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          text: `Got it. Here’s a shopping plan for “${data.dish}”.`,
        },
      ]);
      setStatus("done");
    } catch (e) {
      console.error(e);
      setStatus("error");
      setMessages((m) => [
        ...m,
        { role: "assistant", text: "Failed to generate a plan. Try again." },
      ]);
    }
  }

  return (
    <div className="min-h-screen w-full bg-slate-950 text-white">
      {/* Top bar */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-lg font-semibold tracking-tight">BuyList</h1>
            <p className="text-xs text-white/60 mt-1">
              LLM generates ingredients once • backend decides stores deterministically •{" "}
              <span className="text-white/70">{headerSubtitle}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={[
                "text-xs px-2 py-1 rounded-full border",
                status === "loading"
                  ? "border-indigo-400/30 bg-indigo-500/10 text-indigo-100"
                  : status === "done"
                    ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-100"
                    : status === "error"
                      ? "border-rose-400/30 bg-rose-500/10 text-rose-100"
                      : "border-white/10 bg-white/5 text-white/70",
              ].join(" ")}
            >
              {status}
            </span>
          </div>
        </div>
      </header>

      {/* Main layout */}
      <main className="mx-auto max-w-6xl px-4 py-6 grid grid-cols-1 lg:grid-cols-12 gap-5">
        <section className="lg:col-span-5 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <h2 className="text-sm font-semibold">Chat</h2>
              <p className="text-xs text-white/60 mt-1">
                Type a dish request. We’ll mock the response for now.
              </p>
            </div>
          </div>

          <ChatPanel messages={messages} />

          <div className="mt-4">
            <label className="block text-xs text-white/60 mb-2">
              Request (chatbot input)
            </label>

            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={3}
              placeholder={`Examples:
- "I want to bake a cake"
- "Make tacos for 4"
- "High-protein smoothie"`}
              className="w-full rounded-xl bg-black/30 border border-white/10 px-3 py-3 text-sm outline-none focus:border-indigo-400/60 focus:ring-4 focus:ring-indigo-500/10 resize-none"
              onKeyDown={(e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />

            <div className="mt-2 flex items-center justify-between">
              <p className="text-xs text-white/50">
                Ctrl/⌘ + Enter to send
              </p>
              <button
                onClick={handleSend}
                disabled={!canSend}
                className="rounded-xl px-4 py-2 text-sm font-medium bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {status === "loading" ? "Generating…" : "Send"}
              </button>
            </div>
          </div>
        </section>

        <section className="lg:col-span-7 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <h2 className="text-sm font-semibold">Plan Output</h2>
              <p className="text-xs text-white/60 mt-1">
                This panel will later show store cards, missing items, totals, and export actions.
              </p>
            </div>
          </div>

          <PlanPanel plan={plan} />
        </section>
      </main>

      <footer className="mx-auto max-w-6xl px-4 pb-8 text-xs text-white/40">
        Prototype UI • Tailwind enabled • Safe foundation for animations and richer components later.
      </footer>
    </div>
  );
}
