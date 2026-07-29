/* eslint-disable @typescript-eslint/no-explicit-any */
import { HistoryOptions } from "@/app/historical/actions"

interface ControlsProps {
  options: HistoryOptions;
  setOptions: (options: HistoryOptions) => void;
  compareBenchmark: boolean;
  setCompareBenchmark: (val: boolean) => void;
}

export function HistoricalControls({ options, setOptions, compareBenchmark, setCompareBenchmark }: ControlsProps) {
  const periods = ["1d", "5d", "1mo", "3mo", "6mo", "1y", "2y", "5y", "10y", "ytd", "max"];
  const intervals = ["1m", "2m", "5m", "15m", "30m", "60m", "90m", "1h", "1d", "5d", "1wk", "1mo", "3mo"];

  const updateOption = (key: keyof HistoryOptions, value: any) => {
    setOptions({ ...options, [key]: value });
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 border border-white/5 rounded-xl bg-card">
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">Period</label>
        <select 
          className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          value={options.period || "1mo"}
          onChange={(e) => updateOption("period", e.target.value)}
        >
          {periods.map(p => <option key={p} value={p}>{p.toUpperCase()}</option>)}
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">Interval</label>
        <select 
          className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          value={options.interval || "1d"}
          onChange={(e) => updateOption("interval", e.target.value)}
        >
          {intervals.map(i => <option key={i} value={i}>{i}</option>)}
        </select>
      </div>

      <div className="flex flex-col justify-center space-y-3">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input type="checkbox" className="rounded border-border text-primary focus:ring-primary" 
                 checked={options.prepost || false} 
                 onChange={(e) => updateOption("prepost", e.target.checked)} />
          <span className="text-sm font-medium">Pre/Post Market</span>
        </label>
        
        <label className="flex items-center space-x-2 cursor-pointer">
          <input type="checkbox" className="rounded border-border text-primary focus:ring-primary" 
                 checked={options.autoAdjust !== false} 
                 onChange={(e) => updateOption("autoAdjust", e.target.checked)} />
          <span className="text-sm font-medium">Auto Adjust</span>
        </label>
      </div>

      <div className="flex flex-col justify-center space-y-3">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input type="checkbox" className="rounded border-border text-primary focus:ring-primary" 
                 checked={options.backAdjust || false} 
                 onChange={(e) => updateOption("backAdjust", e.target.checked)} />
          <span className="text-sm font-medium">Back Adjust (Splits & Divs)</span>
        </label>
        
        <label className="flex items-center space-x-2 cursor-pointer">
          <input type="checkbox" className="rounded border-border text-primary focus:ring-primary" 
                 checked={compareBenchmark} 
                 onChange={(e) => setCompareBenchmark(e.target.checked)} />
          <span className="text-sm font-medium">Compare with S&P 500</span>
        </label>
      </div>
    </div>
  )
}
