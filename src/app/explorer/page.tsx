"use client"

import { usePlayground } from "@/context/PlaygroundContext"
import { useQuery } from "@tanstack/react-query"
import { fetchExplorerData } from "./actions"
import { DataSection } from "@/components/explorer/data-section"
import { Search, Loader2, AlertTriangle } from "lucide-react"

export default function ExplorerPage() {
  const { selectedTicker } = usePlayground()

  const { data, isLoading, error } = useQuery({
    queryKey: ['explorer', selectedTicker],
    queryFn: () => fetchExplorerData(selectedTicker!),
    enabled: !!selectedTicker,
  })

  if (!selectedTicker) {
    return (
      <div className="p-8 h-full flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
          <Search className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-2">No Ticker Selected</h2>
        <p className="text-muted-foreground max-w-md">
          Use the search bar in the top navigation to select a ticker and explore its data.
        </p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="p-8 h-full flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground animate-pulse">Fetching complete data suite for {selectedTicker}...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 h-full flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold mb-2 text-red-500">Error Fetching Data</h2>
        <p className="text-muted-foreground max-w-md text-center">
          {(error as Error).message}
        </p>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3">
          <span className="text-primary">{selectedTicker}</span> Explorer
        </h1>
        <p className="text-muted-foreground">
          Comprehensive data overview fetched via yfun-api
        </p>
      </div>

      <div className="space-y-4">
        {data?.map((result, idx) => {
          // If the method returned an error internally, we show a simplified error section
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

          // Special handling for 'info' which returns a massive nested object
          // We break its root keys into their own sections for better readability
          if (result.methodName === 'info' && result.data && typeof result.data === 'object' && !Array.isArray(result.data)) {
            return (
              <div key={`info-group-${idx}`} className="space-y-4">
                {Object.entries(result.data).map(([key, value]) => (
                  <DataSection
                    key={key}
                    title={key.charAt(0).toUpperCase() + key.slice(1)} // e.g., 'assetProfile' -> 'AssetProfile'
                    sourceMethod={`info().${key}`}
                    executionTime={result.executionTime} // Note: execution time represents the whole info() call
                    data={value}
                    defaultOpen={key === 'assetProfile' || key === 'quoteType'}
                  />
                ))}
              </div>
            )
          }

          // Default rendering for other methods
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
