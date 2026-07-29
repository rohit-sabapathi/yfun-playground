/* eslint-disable @typescript-eslint/no-explicit-any */
import { HistoryOptions } from "@/app/historical/actions"

interface ControlsProps {
  options: HistoryOptions
  setOptions: (options: HistoryOptions) => void
  compareBenchmark: boolean
  setCompareBenchmark: (val: boolean) => void
}

interface NbCheckboxProps {
  id: string
  checked: boolean
  onChange: (val: boolean) => void
  label: string
}

function NbCheckbox({ id, checked, onChange, label }: NbCheckboxProps) {
  return (
    <label
      htmlFor={id}
      className="flex items-center gap-2 cursor-pointer"
      style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", fontWeight: 700, userSelect: "none" }}
    >
      <div
        id={id}
        onClick={() => onChange(!checked)}
        className="w-5 h-5 flex items-center justify-center flex-shrink-0"
        style={{
          border: "2px solid var(--border-color)",
          backgroundColor: checked ? "var(--accent)" : "var(--card)",
          boxShadow: checked ? "2px 2px 0 var(--border-color)" : "none",
          cursor: "pointer",
          transition: "background-color 75ms ease",
        }}
      >
        {checked && (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M1.5 5L4 7.5L8.5 2.5" stroke="#0a0a0a" strokeWidth="2" strokeLinecap="square" />
          </svg>
        )}
      </div>
      <span className="uppercase tracking-wide" style={{ color: "var(--foreground)" }}>
        {label}
      </span>
    </label>
  )
}

export function HistoricalControls({ options, setOptions, compareBenchmark, setCompareBenchmark }: ControlsProps) {
  const periods = ["1d", "5d", "1mo", "3mo", "6mo", "1y", "2y", "5y", "10y", "ytd", "max"]
  const intervals = ["1m", "2m", "5m", "15m", "30m", "60m", "90m", "1h", "1d", "5d", "1wk", "1mo", "3mo"]

  const updateOption = (key: keyof HistoryOptions, value: any) => {
    setOptions({ ...options, [key]: value })
  }

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4"
      style={{
        backgroundColor: "var(--card)",
        border: "2px solid var(--border-color)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      {/* Period select */}
      <div className="space-y-2">
        <label
          className="block text-[10px] font-black uppercase tracking-widest"
          style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-mono)" }}
        >
          Period
        </label>
        <select
          id="period-select"
          className="nb-select"
          value={options.period || "1mo"}
          onChange={(e) => updateOption("period", e.target.value)}
        >
          {periods.map((p) => (
            <option key={p} value={p}>
              {p.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      {/* Interval select */}
      <div className="space-y-2">
        <label
          className="block text-[10px] font-black uppercase tracking-widest"
          style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-mono)" }}
        >
          Interval
        </label>
        <select
          id="interval-select"
          className="nb-select"
          value={options.interval || "1d"}
          onChange={(e) => updateOption("interval", e.target.value)}
        >
          {intervals.map((i) => (
            <option key={i} value={i}>
              {i}
            </option>
          ))}
        </select>
      </div>

      {/* Checkboxes col 1 */}
      <div className="flex flex-col justify-center gap-3">
        <NbCheckbox
          id="prepost-check"
          checked={options.prepost || false}
          onChange={(val) => updateOption("prepost", val)}
          label="Pre/Post Market"
        />
        <NbCheckbox
          id="autoadjust-check"
          checked={options.autoAdjust !== false}
          onChange={(val) => updateOption("autoAdjust", val)}
          label="Auto Adjust"
        />
      </div>

      {/* Checkboxes col 2 */}
      <div className="flex flex-col justify-center gap-3">
        <NbCheckbox
          id="backadjust-check"
          checked={options.backAdjust || false}
          onChange={(val) => updateOption("backAdjust", val)}
          label="Back Adjust"
        />
        <NbCheckbox
          id="benchmark-check"
          checked={compareBenchmark}
          onChange={(val) => setCompareBenchmark(val)}
          label="Compare S&P 500"
        />
      </div>
    </div>
  )
}
