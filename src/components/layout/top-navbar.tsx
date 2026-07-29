"use client"

import { Search, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { usePlayground } from "@/context/PlaygroundContext"
import { useEffect, useState } from "react"

export function TopNavbar() {
  const { theme, setTheme } = useTheme()
  const { selectedTicker, setSelectedTicker } = usePlayground()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  return (
    <header
      className="h-16 flex items-center justify-between px-4 sticky top-0 z-10 flex-shrink-0"
      style={{
        backgroundColor: "var(--card)",
        borderBottom: "2px solid var(--border-color)",
      }}
    >
      {/* Search bar */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
            style={{ color: "var(--muted-foreground)" }}
          />
          <input
            id="ticker-search"
            type="text"
            placeholder="Search tickers, commands..."
            className="nb-input h-10 uppercase text-sm font-mono w-full"
            style={{
              fontFamily: "var(--font-mono)",
              paddingLeft: "2.5rem",
              paddingRight: "5rem",
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const target = e.target as HTMLInputElement
                if (target.value.trim()) {
                  setSelectedTicker(target.value.trim().toUpperCase())
                  target.value = ""
                }
              }
            }}
          />
          <kbd
            className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-bold uppercase"
            style={{
              fontFamily: "var(--font-mono)",
              border: "1.5px solid var(--border-color)",
              backgroundColor: "var(--muted)",
              color: "var(--muted-foreground)",
            }}
          >
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3 ml-4">
        {selectedTicker && (
          <div
            className="hidden md:flex items-center gap-2 px-3 py-1.5"
            style={{
              border: "2px solid var(--border-color)",
              backgroundColor: "var(--accent)",
              boxShadow: "2px 2px 0px var(--border-color)",
            }}
          >
            <span
              className="text-[10px] font-bold uppercase tracking-widest"
              style={{ color: "#0a0a0a", fontFamily: "var(--font-mono)" }}
            >
              Active:
            </span>
            <span
              className="text-sm font-black tracking-wider"
              style={{ color: "#0a0a0a", fontFamily: "var(--font-mono)" }}
            >
              {selectedTicker}
            </span>
          </div>
        )}

        <button
          id="theme-toggle"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Toggle theme"
          className="w-10 h-10 flex items-center justify-center transition-all duration-75"
          style={{
            border: "2px solid var(--border-color)",
            backgroundColor: "var(--card)",
            boxShadow: "2px 2px 0px var(--border-color)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translate(-1px, -1px)"
            e.currentTarget.style.boxShadow = "3px 3px 0px var(--border-color)"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translate(0, 0)"
            e.currentTarget.style.boxShadow = "2px 2px 0px var(--border-color)"
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = "translate(2px, 2px)"
            e.currentTarget.style.boxShadow = "none"
          }}
        >
          {mounted && theme === "dark" ? (
            <Sun className="w-4 h-4" style={{ color: "var(--foreground)" }} />
          ) : (
            <Moon className="w-4 h-4" style={{ color: "var(--foreground)" }} />
          )}
        </button>
      </div>
    </header>
  )
}