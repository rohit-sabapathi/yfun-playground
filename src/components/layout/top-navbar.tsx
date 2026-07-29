"use client"

import { Search, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { usePlayground } from "@/context/PlaygroundContext"
import { useEffect, useState } from "react"

export function TopNavbar() {
  const { theme, setTheme } = useTheme()
  const { selectedTicker, setSelectedTicker } = usePlayground()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), [])

  return (
    <header className="h-16 border-b border-border/50 bg-background/80 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-10 flex-shrink-0">
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search tickers, commands, or data..."
            className="w-full h-10 bg-white/5 border border-white/10 rounded-md pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground uppercase"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const target = e.target as HTMLInputElement;
                if (target.value.trim()) {
                  setSelectedTicker(target.value.trim().toUpperCase());
                }
              }
            }}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 ml-4">
        {selectedTicker && (
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
            <span className="text-xs text-muted-foreground">Active Ticker:</span>
            <span className="text-sm font-bold text-primary">{selectedTicker}</span>
          </div>
        )}
        
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
          aria-label="Toggle theme"
        >
          {mounted && theme === "dark" ? (
            <Sun className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
          ) : (
            <Moon className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
          )}
        </button>
      </div>
    </header>
  )
}
