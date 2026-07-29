"use client"

import { usePlayground } from "@/context/PlaygroundContext"
import { useQuery } from "@tanstack/react-query"
import { fetchExplorerData } from "./actions"
import { DataSection } from "@/components/explorer/data-section"
import { Search, Loader2, AlertTriangle } from "lucide-react"

function EmptyState({ icon: Icon, title, description, iconColor = "var(--accent)" }: {
  icon: React.ElementType
  title: string
  description: string
  iconColor?: string
}) {
  return (
    <div className="p-8 h-full flex flex-col items-center justify-center text-center">
      <div
        className="w-16 h-16 flex items-center justify-center mb-5"
        style={{
          backgroundColor: iconColor,
          border: "2px solid var(--border-color)",
          boxShadow: "var(--shadow)",
        }}
      >
        <Icon className="w-8 h-8" style={{ color: "#0a0a0a" }} />
      </div>
      <h2
        className="text-2xl font-black mb-2"
        style={{ fontFamily: "var(--font-sans)" }}
      >
        {title}
      </h2>
      <p
        className="max-w-md"
        style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-mono)", fontSize: "0.85rem" }}
      >
        {description}
      </p>
    </div>
  )
}

export default function ExplorerPage() {
  const { selectedTicker } = usePlayground()

  const { data, isLoading, error } = useQuery({
    queryKey: ["explorer", selectedTicker],
    queryFn: () => fetchExplorerData(selectedTicker!),
    enabled: !!selectedTicker,
  })

  if (!selectedTicker) {
    return (
      <EmptyState
        icon={Search}
        title="No Ticker Selected"
        description="Use the search bar in the top navigation to select a ticker and explore its data."
      />
    )
  }

  if (isLoading) {
    return (
      <div className="p-8 h-full flex flex-col items-center justify-center">
        <div
          className="w-16 h-16 flex items-center justify-center mb-5"
          style={{
            backgroundColor: "var(--accent-blue)",
            border: "2px solid var(--border-color)",
            boxShadow: "var(--shadow)",
          }}
        >
          <Loader2 className="w-8 h-8 text-white animate-spin" />
        </div>
        <p
          className="font-bold uppercase tracking-wide"
          style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--muted-foreground)" }}
        >
          Fetching data for {selectedTicker}...
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <EmptyState
        icon={AlertTriangle}
        title="Error Fetching Data"
        description={(error as Error).message}
        iconColor="var(--accent-red)"
      />
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
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
          Explorer
        </div>
        <h1
          className="text-4xl font-black tracking-tight mb-2"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          <span style={{ color: "var(--accent-blue)" }}>{selectedTicker}</span>{" "}
          Explorer
        </h1>
        <p style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-mono)", fontSize: "0.85rem" }}>
          Comprehensive data overview fetched via yfun-api
        </p>
      </div>

      {/* Data sections */}
      <div className="space-y-4">
        {data?.map((result, idx) => {
          if (result.error) {
            return (
              <DataSection
                key={`${result.methodName}-${idx}`}
                title={`Error: ${result.methodName}`}
                sourceMethod={result.methodName}
                executionTime={result.executionTime}
                data={result.error}
              />
            )
          }

          if (result.methodName === "info" && result.data && typeof result.data === "object" && !Array.isArray(result.data)) {
            return (
              <div key={`info-group-${idx}`} className="space-y-4">
                {Object.entries(result.data).map(([key, value]) => (
                  <DataSection
                    key={key}
                    title={key.charAt(0).toUpperCase() + key.slice(1)}
                    sourceMethod={`info().${key}`}
                    executionTime={result.executionTime}
                    data={value}
                    defaultOpen={key === "assetProfile" || key === "quoteType"}
                  />
                ))}
              </div>
            )
          }

          return (
            <DataSection
              key={`${result.methodName}-${idx}`}
              title={result.methodName.charAt(0).toUpperCase() + result.methodName.slice(1)}
              sourceMethod={result.methodName}
              executionTime={result.executionTime}
              data={result.data}
            />
          )
        })}
      </div>
    </div>
  )
}
