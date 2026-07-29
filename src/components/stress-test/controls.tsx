"use client"

interface ControlsProps {
  count: number;
  setCount: (c: number) => void;
  mode: "sequential" | "parallel";
  setMode: (m: "sequential" | "parallel") => void;
  isLoading: boolean;
  onRunTest: () => void;
}

export function StressTestControls({ count, setCount, mode, setMode, isLoading, onRunTest }: ControlsProps) {
  const counts = [1, 100, 500, 1000];

  return (
    <div className="flex flex-col md:flex-row items-end gap-4 p-6 border border-white/5 rounded-xl bg-card">
      <div className="space-y-2 w-full md:w-auto flex-1">
        <label className="text-sm font-medium text-muted-foreground">Ticker Count</label>
        <select 
          disabled={isLoading}
          className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
          value={count.toString()}
          onChange={(e) => setCount(Number(e.target.value))}
        >
          {counts.map(c => <option key={c} value={c}>{c} Tickers</option>)}
        </select>
      </div>

      <div className="space-y-2 w-full md:w-auto flex-1">
        <label className="text-sm font-medium text-muted-foreground">Execution Mode</label>
        <select 
          disabled={isLoading}
          className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
          value={mode}
          onChange={(e) => setMode(e.target.value as "sequential" | "parallel")}
        >
          <option value="sequential">Sequential</option>
          <option value="parallel">Parallel (Batched)</option>
        </select>
      </div>

      <button
        onClick={onRunTest}
        disabled={isLoading}
        className="w-full md:w-auto bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2 rounded-md font-medium transition-colors disabled:opacity-50 h-10 flex items-center justify-center"
      >
        {isLoading ? "Running Test..." : "Run Stress Test"}
      </button>
    </div>
  )
}
