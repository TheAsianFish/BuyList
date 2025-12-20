// src/components/ChatPanel.jsx
/**
 * Simple chat transcript panel.
 * Later: add typing indicator, streaming tokens, timestamps, avatars, animations, etc.
 */
export default function ChatPanel({ messages }) {
    return (
        <div className="h-[360px] overflow-y-auto rounded-xl border border-white/10 bg-black/20 p-3 space-y-2">
            {messages.map((m, idx) => {
                const isUser = m.role === "user";
                return (
                    <div key={idx} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                        <div
                            className={[
                                "max-w-[85%] rounded-2xl px-3 py-2 text-sm border",
                                isUser
                                    ? "bg-indigo-500/90 border-indigo-300/20 text-white"
                                    : "bg-white/5 border-white/10 text-white/90",
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
