// src/components/PlanPanel.jsx
const fallbackText =
    "No plan yet. Send a request on the left to generate a mock multi-store plan.";

function currency(n, ccy = "USD") {
    try {
        return new Intl.NumberFormat(undefined, { style: "currency", currency: ccy }).format(n);
    } catch {
        return `$${Number(n || 0).toFixed(2)}`;
    }
}

/**
 * Minimal plan renderer.
 * Later: split into StoreCard, MissingItems, SummaryBar, Filters, Copy/Export buttons, animations.
 */
export default function PlanPanel({ plan }) {
    if (!plan) {
        return (
            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                <div className="text-sm font-medium text-white/90">Waiting for input</div>
                <div className="text-xs text-white/60 mt-2">{fallbackText}</div>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <Hint text='“Bake a cake”' />
                    <Hint text='“Tacos for 4”' />
                    <Hint text='“Meal prep chicken + rice”' />
                    <Hint text='“High-protein smoothie”' />
                </div>
            </div>
        );
    }

    const ccy = plan?.summary?.currency || "USD";

    return (
        <div className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                <div className="text-sm font-semibold">{plan.dish}</div>
                <div className="text-xs text-white/60 mt-1">
                    {plan.servings ? `${plan.servings} • ` : ""}
                    {plan.summary?.storesUsed ?? 0} store(s) • Est. total{" "}
                    <span className="text-white/80 font-medium">
                        {currency(plan.summary?.estimatedTotal ?? 0, ccy)}
                    </span>
                </div>
            </div>

            <div className="space-y-3">
                {(plan.stores || []).map((s) => (
                    <div key={s.name} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <div className="text-sm font-semibold">{s.name}</div>
                                <div className="text-xs text-white/60 mt-1">{s.distanceMiles} mi • {s.items?.length || 0} items</div>
                            </div>
                        </div>

                        <div className="mt-3 space-y-2">
                            {(s.items || []).map((it, idx) => (
                                <div
                                    key={idx}
                                    className="rounded-xl border border-white/10 bg-white/5 p-3 flex items-start justify-between gap-3"
                                >
                                    <div className="min-w-0">
                                        <div className="text-sm font-medium truncate">{it.ingredient}</div>
                                        <div className="text-xs text-white/60 mt-1 truncate">{it.qty}</div>
                                    </div>
                                    <div className="text-sm font-semibold shrink-0">{currency(it.price || 0, ccy)}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {plan.missing?.length > 0 && (
                <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 p-4">
                    <div className="text-sm font-semibold text-rose-100">Missing</div>
                    <div className="mt-2 space-y-2">
                        {plan.missing.map((m, idx) => (
                            <div key={idx} className="rounded-xl border border-rose-400/20 bg-black/20 p-3">
                                <div className="text-sm font-medium text-rose-50">{m.ingredient}</div>
                                <div className="text-xs text-rose-100/70 mt-1">{m.qty}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="rounded-xl border border-white/10 bg-black/20 p-3 text-xs text-white/60">
                {plan.disclaimer || "Demo disclaimer goes here."}
            </div>
        </div>
    );
}

function Hint({ text }) {
    return (
        <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70">
            {text}
        </div>
    );
}
