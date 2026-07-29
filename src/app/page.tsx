"use client"

import { usePlayground } from "@/context/PlaygroundContext"
import { PlayCircle, CheckCircle2, Box, Cpu } from "lucide-react"

const statCards = [
  {
    icon: Box,
    label: "Package Status",
    value: (
      <span className="flex items-center gap-2">
        <CheckCircle2 className="w-5 h-5" style={{ color: "var(--accent-green)" }} />
        Ready
      </span>
    ),
    accentColor: "var(--accent-green)",
  },
  {
    icon: Box,
    label: "Package Version",
    value: "0.1.0-alpha",
    accentColor: "var(--accent-blue)",
  },
  {
    icon: Cpu,
    label: "Node Version",
    value: "v20.x",
    accentColor: "var(--accent)",
  },
]

export default function DashboardPage() {
  const { selectedTicker } = usePlayground()

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      {/* Page header */}
      <div>
        <div
          className="inline-block px-3 py-1 mb-3"
          style={{
            backgroundColor: "var(--accent)",
            border: "2px solid var(--border-color)",
            fontFamily: "var(--font-mono)",
            fontSize: "0.7rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: "#0a0a0a",
          }}
        >
          Overview
        </div>
        <h1
          className="text-4xl font-black tracking-tight mb-2"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          Dashboard
        </h1>
        <p style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-mono)", fontSize: "0.85rem" }}>
          Welcome to the yfun-api testing playground.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <div
              key={card.label}
              className="p-5 flex flex-col gap-3"
              style={{
                backgroundColor: "var(--card)",
                border: "2px solid var(--border-color)",
                boxShadow: "var(--shadow)",
              }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-7 h-7 flex items-center justify-center"
                  style={{
                    backgroundColor: card.accentColor,
                    border: "1.5px solid var(--border-color)",
                  }}
                >
                  <Icon className="w-4 h-4" style={{ color: "#0a0a0a" }} />
                </div>
                <span
                  className="text-[10px] font-bold uppercase tracking-widest"
                  style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-mono)" }}
                >
                  {card.label}
                </span>
              </div>
              <p
                className="text-2xl font-black tracking-tight"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                {card.value}
              </p>
            </div>
          )
        })}

        {/* Active ticker card */}
        <div
          className="p-5 flex flex-col gap-3"
          style={{
            backgroundColor: selectedTicker ? "var(--accent)" : "var(--card)",
            border: "2px solid var(--border-color)",
            boxShadow: "var(--shadow)",
          }}
        >
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 flex items-center justify-center"
              style={{
                backgroundColor: "var(--card)",
                border: "1.5px solid var(--border-color)",
              }}
            >
              <PlayCircle className="w-4 h-4" style={{ color: "#0a0a0a" }} />
            </div>
            <span
              className="text-[10px] font-bold uppercase tracking-widest"
              style={{
                color: selectedTicker ? "#0a0a0a" : "var(--muted-foreground)",
                fontFamily: "var(--font-mono)",
              }}
            >
              Active Ticker
            </span>
          </div>
          <p
            className="text-2xl font-black tracking-tight"
            style={{
              fontFamily: "var(--font-mono)",
              color: selectedTicker ? "#0a0a0a" : "var(--foreground)",
            }}
          >
            {selectedTicker || "None"}
          </p>
        </div>
      </div>

      {/* CTA hero section */}
      <div
        className="p-10 flex flex-col items-center justify-center min-h-[260px] text-center"
        style={{
          backgroundColor: "var(--card)",
          border: "2px solid var(--border-color)",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        <div
          className="w-16 h-16 flex items-center justify-center mb-5"
          style={{
            backgroundColor: "var(--accent)",
            border: "2px solid var(--border-color)",
            boxShadow: "var(--shadow)",
          }}
        >
          <Box className="w-8 h-8" style={{ color: "#0a0a0a" }} />
        </div>
        <h2
          className="text-2xl font-black mb-3"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          Ready for Testing
        </h2>
        <p
          className="max-w-md"
          style={{
            color: "var(--muted-foreground)",
            fontFamily: "var(--font-mono)",
            fontSize: "0.85rem",
            lineHeight: 1.7,
          }}
        >
          Select a module from the sidebar to begin testing the yfun-api package features.
          Data will be fetched live via the yfun-api instance.
        </p>
        <div
          className="mt-6 px-4 py-1.5"
          style={{
            border: "2px solid var(--border-color)",
            backgroundColor: "var(--muted)",
            fontFamily: "var(--font-mono)",
            fontSize: "0.7rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "var(--muted-foreground)",
          }}
        >
          Use search bar to enter a ticker symbol
        </div>
      </div>
    </div>
  )
}
