export function Footer() {
  return (
    <footer
      className="h-10 flex items-center justify-between px-4 flex-shrink-0"
      style={{
        backgroundColor: "var(--muted)",
        borderTop: "2px solid var(--border-color)",
        fontFamily: "var(--font-mono)",
        fontSize: "0.65rem",
      }}
    >
      <div className="flex items-center gap-3">
        <span
          className="font-bold uppercase tracking-widest px-2 py-0.5"
          style={{ border: "1.5px solid var(--border-color)", backgroundColor: "var(--card)" }}
        >
          yfun-playground
        </span>
        <span
          className="uppercase tracking-wider font-bold"
          style={{ color: "var(--muted-foreground)" }}
        >
          ENV: {process.env.NODE_ENV || "development"}
        </span>
      </div>
      <div
        className="uppercase tracking-widest font-bold"
        style={{ color: "var(--muted-foreground)" }}
      >
        Powered by yfun-api
      </div>
    </footer>
  )
}
