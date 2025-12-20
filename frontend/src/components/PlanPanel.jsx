function currency(n, ccy = "USD") {
    try {
        return new Intl.NumberFormat(undefined, { style: "currency", currency: ccy }).format(n);
    } catch {
        return `$${Number(n || 0).toFixed(2)}`;
    }
}

export default function PlanPanel({ plan }) {
    if (!plan) {
        return (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="text-sm font-medium text-slate-900">Waiting for input</div>
                <div className="text-xs text-slate-600 mt-2">
                    Send a request on the left to generate a mock multi-store plan.
                </div>

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
            {/* Summary */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="text-sm font-semibold">{plan.dish}</div>
                <div className="text-xs text-slate-600 mt-1">
                    {plan.servings ? `${plan.servings} • ` : ""}
                    {plan.summary?.storesUsed ?? 0} store(s) • Est. total{" "}
                    <span className="text-slate-900 font-semibold">
                        {currency(plan.summary?.estimatedTotal ?? 0, ccy)}
                    </span>
                </div>
            </div>

            {/* Stores */}
            <div className="space-y-3">
                {(plan.stores || []).map((s) => (
                    <div key={s.name} className="rounded-2xl border border-slate-200 bg-white p-4">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <div className="text-sm font-semibold">{s.name}</div>
                                <div className="text-xs text-slate-600 mt-1">
                                    {s.distanceMiles} mi • {s.items?.length || 0} items
                                </div>
                            </div>
                        </div>

                        <div className="mt-3 space-y-2">
                            {(s.items || []).map((it, idx) => (
                                <div
                                    key={idx}
                                    className="rounded-xl border border-slate-200 bg-slate-50 p-3 flex items-start justify-between gap-3"
                                >
                                    <div className="min-w-0">
                                        <div className="text-sm font-medium truncate">{it.ingredient}</div>
                                        <div className="text-xs text-slate-600 mt-1 truncate">{it.qty}</div>
                                    </div>
                                    <div className="text-sm font-semibold shrink-0">
                                        {currency(it.price || 0, ccy)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Missing */}
            {plan.missing?.length > 0 && (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4">
                    <div className="text-sm font-semibold text-rose-800">Missing</div>
                    <div className="mt-2 space-y-2">
                        {plan.missing.map((m, idx) => (
                            <div key={idx} className="rounded-xl border border-rose-200 bg-white p-3">
                                <div className="text-sm font-medium text-rose-900">{m.ingredient}</div>
                                <div className="text-xs text-rose-700 mt-1">{m.qty}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Disclaimer */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
                {plan.disclaimer || "Demo disclaimer goes here."}
            </div>
        </div>
    );
}

function Hint({ text }) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700">
            {text}
        </div>
    );
}
