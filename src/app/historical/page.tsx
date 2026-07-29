"use client"

import { useState } from "react"
import { usePlayground } from "@/context/PlaygroundContext"
import { useQuery } from "@tanstack/react-query"
import { fetchHistoricalData } from "./actions"
import { Search, Loader2, AlertTriangle, Download } from "lucide-react"
import { HistoryOptions } from "./actions"

import { HistoricalControls } from "@/components/historical/controls"
import { HistoricalChart } from "@/components/historical/chart"
import { HistoricalStatistics } from "@/components/historical/statistics"
import { HistoricalDataTable } from "@/components/historical/data-table"

export default function HistoricalPage() {
  const { selectedTicker } = usePlayground()

  const [options, setOptions] = useState<HistoryOptions>({
    period: "1mo",
    interval: "1d",
    autoAdjust: true,
    backAdjust: false,
    prepost: false,
  })
  const [compareBenchmark, setCompareBenchmark] = useState(false)

  const { data, isLoading, error } = useQuery({
    queryKey: ["historical", selectedTicker, options, compareBenchmark],
    queryFn: () => fetchHistoricalData(selectedTicker!, options, compareBenchmark),
    enabled: !!selectedTicker,
    refetchOnWindowFocus: false,
  })

  const exportCSV = () => {
    if (!data?.tickerData) return
    const header = "Date,Open,High,Low,Close,Volume\n"
    const rows = data.tickerData
      .map((d) => `${new Date(d.date).toISOString()},${d.open},${d.high},${d.low},${d.close},${d.volume}`)
      .join("\n")
    const blob = new Blob([header + rows], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${selectedTicker}_history.csv`
    a.click()
  }

  const exportJSON = () => {
    if (!data?.tickerData) return
    const blob = new Blob([JSON.stringify(data.tickerData, null, 2)], { type: "application/json" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${selectedTicker}_history.json`
    a.click()
  }

  if (!selectedTicker) {
    return (
      <div className="p-8 h-full flex flex-col items-center justify-center text-center">
        <div
          className="w-16 h-16 flex items-center justify-center mb-5"
          style={{
            backgroundColor: "var(--accent)",
            border: "2px solid var(--border-color)",
            boxShadow: "var(--shadow)",
          }}
        >
          <Search className="w-8 h-8" style={{ color: "#0a0a0a" }} />
        </div>
        <h2 className="text-2xl font-black mb-2" style={{ fontFamily: "var(--font-sans)" }}>
          No Ticker Selected
        </h2>
        <p style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-mono)", fontSize: "0.85rem" }}>
          Use the search bar in the top navigation to select a ticker and explore its historical data.
        </p>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Page header */}
      <div className="flex items-end justify-between">
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
            Historical Data
          </div>
          <h1 className="text-4xl font-black tracking-tight mb-2" style={{ fontFamily: "var(--font-sans)" }}>
            <span style={{ color: "var(--accent-blue)" }}>{selectedTicker}</span> History
          </h1>
          <p style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-mono)", fontSize: "0.85rem" }}>
            Analyze historical price data fetched via yfun-api
          </p>
        </div>

        {/* Export buttons */}
        <div className="flex gap-2">
          <button
            id="export-csv-btn"
            onClick={exportCSV}
            disabled={!data?.tickerData || data.tickerData.length === 0}
            className="nb-btn"
            style={{ backgroundColor: "var(--card)", color: "var(--foreground)" }}
          >
            <Download className="w-4 h-4" />
            CSV
          </button>
          <button
            id="export-json-btn"
            onClick={exportJSON}
            disabled={!data?.tickerData || data.tickerData.length === 0}
            className="nb-btn"
            style={{ backgroundColor: "var(--card)", color: "var(--foreground)" }}
          >
            <Download className="w-4 h-4" />
            JSON
          </button>
        </div>
      </div>

      {/* Controls */}
      <HistoricalControls
        options={options}
        setOptions={setOptions}
        compareBenchmark={compareBenchmark}
        setCompareBenchmark={setCompareBenchmark}
      />

      {/* Loading */}
      {isLoading && (
        <div className="py-12 flex flex-col items-center justify-center">
          <div
            className="w-14 h-14 flex items-center justify-center mb-4"
            style={{
              backgroundColor: "var(--accent-blue)",
              border: "2px solid var(--border-color)",
              boxShadow: "var(--shadow)",
            }}
          >
            <Loader2 className="w-7 h-7 text-white animate-spin" />
          </div>
          <p
            className="font-bold uppercase tracking-wide"
            style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--muted-foreground)" }}
          >
            Fetching historical data for {selectedTicker}...
          </p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div
          className="p-6 flex flex-col items-center justify-center"
          style={{
            border: "2px solid var(--accent-red)",
            backgroundColor: "var(--card)",
            boxShadow: "4px 4px 0px var(--accent-red)",
          }}
        >
          <AlertTriangle className="w-8 h-8 mb-3" style={{ color: "var(--accent-red)" }} />
          <h2 className="text-lg font-black mb-1" style={{ color: "var(--accent-red)", fontFamily: "var(--font-sans)" }}>
            Error Fetching Data
          </h2>
          <p style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-mono)", fontSize: "0.85rem" }}>
            {(error as Error).message}
          </p>
        </div>
      )}

      {/* Data */}
      {!isLoading && !error && data && data.tickerData.length > 0 && (
        <div className="space-y-6">
          <HistoricalStatistics data={data.tickerData} benchmarkData={data.benchmarkData} />
          <HistoricalChart data={data.tickerData} benchmarkData={data.benchmarkData} />
          <HistoricalDataTable data={data.tickerData} />

          {/* Meta info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div style={{ border: "2px solid var(--border-color)", backgroundColor: "var(--card)", boxShadow: "var(--shadow-sm)" }}>
              <div className="nb-section-header">Execution Time</div>
              <div
                className="p-4 text-xl font-black"
                style={{ fontFamily: "var(--font-mono)", color: "var(--accent-green)" }}
              >
                {data.executionTime}ms
              </div>
            </div>
            <div style={{ border: "2px solid var(--border-color)", backgroundColor: "var(--card)", boxShadow: "var(--shadow-sm)" }}>
              <div className="nb-section-header">Request Options</div>
              <div className="p-4 overflow-auto max-h-48 nb-scroll">
                <pre
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.78rem",
                    color: "var(--muted-foreground)",
                  }}
                >
                  {JSON.stringify(options, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* No data */}
      {!isLoading && !error && data && data.tickerData.length === 0 && (
        <div
          className="p-8 flex flex-col items-center justify-center text-center"
          style={{ border: "2px solid var(--border-color)", backgroundColor: "var(--card)", boxShadow: "var(--shadow)" }}
        >
          <h2 className="text-xl font-black mb-2" style={{ fontFamily: "var(--font-sans)" }}>
            No Data Available
          </h2>
          <p style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-mono)", fontSize: "0.85rem" }}>
            The selected options returned no data. Try changing the period or interval.
          </p>
        </div>
      )}
    </div>
  )
}
