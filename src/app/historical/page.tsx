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
    prepost: false
  });
  const [compareBenchmark, setCompareBenchmark] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['historical', selectedTicker, options, compareBenchmark],
    queryFn: () => fetchHistoricalData(selectedTicker!, options, compareBenchmark),
    enabled: !!selectedTicker,
    refetchOnWindowFocus: false,
  })

  const exportCSV = () => {
    if (!data?.tickerData) return;
    const header = "Date,Open,High,Low,Close,Volume\n";
    const rows = data.tickerData.map(d => `${new Date(d.date).toISOString()},${d.open},${d.high},${d.low},${d.close},${d.volume}`).join("\n");
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedTicker}_history.csv`;
    a.click();
  };

  const exportJSON = () => {
    if (!data?.tickerData) return;
    const blob = new Blob([JSON.stringify(data.tickerData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedTicker}_history.json`;
    a.click();
  };

  if (!selectedTicker) {
    return (
      <div className="p-8 h-full flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
          <Search className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-2">No Ticker Selected</h2>
        <p className="text-muted-foreground max-w-md">
          Use the search bar in the top navigation to select a ticker and explore its historical data.
        </p>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3">
            <span className="text-primary">{selectedTicker}</span> Historical Data
          </h1>
          <p className="text-muted-foreground">
            Analyze historical price data with advanced options fetched via yfun-api
          </p>
        </div>
        
        <div className="flex space-x-3">
          <button 
            onClick={exportCSV}
            disabled={!data?.tickerData || data.tickerData.length === 0}
            className="flex items-center space-x-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>CSV</span>
          </button>
          <button 
            onClick={exportJSON}
            disabled={!data?.tickerData || data.tickerData.length === 0}
            className="flex items-center space-x-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>JSON</span>
          </button>
        </div>
      </div>

      <HistoricalControls 
        options={options} 
        setOptions={setOptions} 
        compareBenchmark={compareBenchmark} 
        setCompareBenchmark={setCompareBenchmark} 
      />

      {isLoading && (
        <div className="py-12 flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
          <p className="text-muted-foreground animate-pulse">Fetching historical data for {selectedTicker}...</p>
        </div>
      )}

      {error && (
        <div className="p-8 flex flex-col items-center justify-center border border-red-500/20 bg-red-500/5 rounded-xl">
          <AlertTriangle className="w-8 h-8 text-red-500 mb-4" />
          <h2 className="text-xl font-bold mb-2 text-red-500">Error Fetching Data</h2>
          <p className="text-muted-foreground text-center">
            {(error as Error).message}
          </p>
        </div>
      )}

      {!isLoading && !error && data && data.tickerData.length > 0 && (
        <div className="space-y-6">
          <HistoricalStatistics data={data.tickerData} benchmarkData={data.benchmarkData} />
          
          <HistoricalChart data={data.tickerData} benchmarkData={data.benchmarkData} />
          
          <HistoricalDataTable data={data.tickerData} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-card border border-white/5 rounded-xl overflow-hidden flex flex-col">
              <div className="bg-muted/50 px-4 py-3 border-b border-white/5 text-sm font-medium flex justify-between">
                <span>Execution Time</span>
              </div>
              <div className="p-4 text-mono text-sm text-green-400">
                {data.executionTime}ms
              </div>
            </div>
            
            <div className="bg-card border border-white/5 rounded-xl overflow-hidden flex flex-col">
              <div className="bg-muted/50 px-4 py-3 border-b border-white/5 text-sm font-medium flex justify-between">
                <span>Request Options</span>
              </div>
              <div className="p-4 text-mono text-sm text-muted-foreground overflow-auto max-h-48">
                <pre>{JSON.stringify(options, null, 2)}</pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {!isLoading && !error && data && data.tickerData.length === 0 && (
         <div className="p-8 flex flex-col items-center justify-center border border-white/5 rounded-xl text-center">
         <h2 className="text-xl font-bold mb-2">No Data Available</h2>
         <p className="text-muted-foreground">
           The selected options returned no data. Try changing the period or interval.
         </p>
       </div>
      )}
    </div>
  )
}
