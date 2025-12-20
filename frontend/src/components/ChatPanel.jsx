export default function ChatPanel({ messages }) {
    return (
        <div
            className="
        h-[360px] overflow-y-auto rounded-xl border p-3 space-y-2
        border-slate-200 bg-slate-50
        dark:border-white/10 dark:bg-black/20
      "
        >
            {messages.map((m, idx) => {
                const isUser = m.role === "user";

                return (
                    <div
                        key={idx}
                        className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                    >
                        <div
                            className={[
                                "max-w-[85%] rounded-2xl px-3 py-2 text-sm border",
                                "shadow-[0_1px_0_rgba(0,0,0,0.02)]",
                                isUser
                                    ? // User bubble
                                    "bg-indigo-600 border-indigo-600 text-white"
                                    : // Assistant bubble
                                    "bg-white border-slate-200 text-slate-900" +
                                    " dark:bg-white/5 dark:border-white/10 dark:text-white/90",
                            ].join(" ")}
                        >
                            {m.text}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
