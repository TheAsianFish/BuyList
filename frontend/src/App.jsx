import { useMemo, useState } from "react";
import ChatPanel from "./components/ChatPanel";
import PlanPanel from "./components/PlanPanel";

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
  const [status, setStatus] = useState("idle"); // idle | loading | done | error
  const [plan, setPlan] = useState(null);

  const canSend = input.trim().length > 0 && status !== "loading";

  const statusLabel = useMemo(() => {
    if (status === "loading") return "Generating…";
    if (status === "done") return "Plan ready";
    if (status === "error") return "Error";
    return "Mock mode";
  }, [status]);

  async function handleSend() {
    const text = input.trim();
    if (!text || status === "loading") return;

    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setStatus("loading");

    try {
      await new Promise((r) => setTimeout(r, 550));
      const data = MOCK_PLAN;

      setPlan(data);
      setMessages((m) => [
        ...m,
        { role: "assistant", text: `Plan generated for “${data.dish}”. See the plan panel →` },
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
    <div className="min-h-screen w-full bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900">
      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/70 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-lg font-semibold tracking-tight">BuyList</h1>
            <p className="text-xs text-slate-600 mt-1">
              LLM decides ingredients once • backend picks stores deterministically
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={[
                "text-xs px-2.5 py-1 rounded-full border",
                status === "loading"
                  ? "border-indigo-300 bg-indigo-50 text-indigo-700"
                  : status === "done"
                    ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                    : status === "error"
                      ? "border-rose-300 bg-rose-50 text-rose-700"
                      : "border-slate-200 bg-slate-50 text-slate-600",
              ].join(" ")}
            >
              {statusLabel}
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Chat */}
        <section className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="p-4 border-b border-slate-100">
            <h2 className="text-sm font-semibold">Chat</h2>
            <p className="text-xs text-slate-600 mt-1">
              Type a dish request. We’ll mock the response for now.
            </p>
          </div>

          <div className="p-4">
            <ChatPanel messages={messages} />

            <div className="mt-4">
              <label className="block text-xs text-slate-600 mb-2">
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
                className="
                  w-full rounded-xl px-3 py-3 text-sm outline-none resize-none
                  bg-white border border-slate-200
                  focus:border-indigo-300 focus:ring-4 focus:ring-indigo-200/50
                "
                onKeyDown={(e) => {
                  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />

              <div className="mt-2 flex items-center justify-between">
                <p className="text-xs text-slate-500">Ctrl/⌘ + Enter to send</p>
                <button
                  onClick={handleSend}
                  disabled={!canSend}
                  className="
                    rounded-xl px-4 py-2 text-sm font-medium text-white
                    bg-indigo-600 hover:bg-indigo-700
                    disabled:opacity-50 disabled:cursor-not-allowed transition
                  "
                >
                  {status === "loading" ? "Generating…" : "Send"}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Plan */}
        <section className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="p-4 border-b border-slate-100">
            <h2 className="text-sm font-semibold">Plan Output</h2>
            <p className="text-xs text-slate-600 mt-1">
              Later: store cards, missing items, totals, export, and animations.
            </p>
          </div>

          <div className="p-4">
            <PlanPanel plan={plan} />
          </div>
        </section>
      </main>

      <footer className="mx-auto max-w-6xl px-4 pb-10 text-xs text-slate-500">
        Prototype UI • Light-only mode (no theme toggle).
      </footer>
    </div>
  );
}
