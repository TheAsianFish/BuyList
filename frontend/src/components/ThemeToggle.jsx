export default function ThemeToggle({ theme, onToggle }) {
    const isDark = theme === "dark";

    return (
        <button
            type="button"
            onClick={onToggle}
            className={[
                "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm border transition",
                "border-slate-200 bg-white hover:bg-slate-50",
                "dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10",
            ].join(" ")}
            aria-label="Toggle theme"
            title="Toggle light/dark mode"
        >
            <span className="text-slate-700 dark:text-white/80">
                {isDark ? "Dark" : "Light"}
            </span>

            {/* Switch track */}
            <span
                className={[
                    "relative inline-flex h-5 w-10 items-center rounded-full transition-colors px-0.5",
                    isDark ? "bg-indigo-500" : "bg-slate-300",
                ].join(" ")}
            >
                {/* Switch thumb */}
                <span
                    className={[
                        "inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm",
                        isDark ? "translate-x-5" : "translate-x-0",
                    ].join(" ")}
                />
            </span>
        </button>
    );
}
