"use client"
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
} from "recharts"
import { format } from "date-fns"

interface HistoricalChartProps {
  data: any[]
  benchmarkData: any[]
}

export function HistoricalChart({ data, benchmarkData }: HistoricalChartProps) {
  if (!data || data.length === 0)
    return (
      <div
        className="p-8 text-center"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.85rem",
          color: "var(--muted-foreground)",
          border: "2px solid var(--border-color)",
          backgroundColor: "var(--card)",
        }}
      >
        No chart data available
      </div>
    )

  const chartData = data.map((d, i) => {
    const item: any = {
      date: new Date(d.date),
      price: d.close,
      volume: d.volume,
    }
    if (
      benchmarkData &&
      benchmarkData[i] &&
      benchmarkData[i].date &&
      new Date(benchmarkData[i].date).getTime() === item.date.getTime()
    ) {
      item.benchmark = benchmarkData[i].close
    }
    return item
  })

  const formatDate = (date: Date) => format(date, "MMM dd, yyyy HH:mm")

  const tooltipStyle = {
    backgroundColor: "var(--card)",
    border: "2px solid var(--border-color)",
    borderRadius: 0,
    fontFamily: "var(--font-mono)",
    fontSize: "0.78rem",
  }

  return (
    <div className="space-y-4">
      {/* Price chart */}
      <div
        className="p-4"
        style={{
          backgroundColor: "var(--card)",
          border: "2px solid var(--border-color)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <div className="nb-section-header mb-4" style={{ margin: "0 -1rem 1rem -1rem", padding: "0.5rem 1rem" }}>
          Price History
        </div>
        <div style={{ height: "360px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} syncId="historical-charts">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} opacity={0.4} />
              <XAxis
                dataKey="date"
                tickFormatter={(val) => format(val, "MMM dd")}
                stroke="var(--border-color)"
                tick={{ fill: "var(--muted-foreground)", fontSize: 11, fontFamily: "var(--font-mono)" }}
                minTickGap={30}
              />
              <YAxis
                yAxisId="left"
                domain={["auto", "auto"]}
                stroke="var(--border-color)"
                tick={{ fill: "var(--muted-foreground)", fontSize: 11, fontFamily: "var(--font-mono)" }}
                tickFormatter={(val) => `$${val.toFixed(0)}`}
              />
              {benchmarkData.length > 0 && (
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  domain={["auto", "auto"]}
                  stroke="var(--border-color)"
                  tick={{ fill: "var(--muted-foreground)", fontSize: 11, fontFamily: "var(--font-mono)" }}
                  tickFormatter={(val) => `$${val.toFixed(0)}`}
                />
              )}
              <Tooltip
                contentStyle={tooltipStyle}
                labelStyle={{ color: "var(--foreground)", fontWeight: 700 }}
                labelFormatter={(val: any) => formatDate(new Date(val))}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="price"
                name="Price"
                stroke="#00c853"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: "#00c853", stroke: "var(--border-color)", strokeWidth: 2 }}
              />
              {benchmarkData.length > 0 && (
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="benchmark"
                  name="S&P 500"
                  stroke="#007aff"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: "#007aff", stroke: "var(--border-color)", strokeWidth: 2 }}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Volume chart */}
      <div
        className="p-4"
        style={{
          backgroundColor: "var(--card)",
          border: "2px solid var(--border-color)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <div className="nb-section-header mb-4" style={{ margin: "0 -1rem 1rem -1rem", padding: "0.5rem 1rem" }}>
          Volume
        </div>
        <div style={{ height: "180px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} syncId="historical-charts">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} opacity={0.4} />
              <XAxis
                dataKey="date"
                tickFormatter={(val) => format(val, "MMM dd")}
                stroke="var(--border-color)"
                tick={{ fill: "var(--muted-foreground)", fontSize: 11, fontFamily: "var(--font-mono)" }}
                minTickGap={30}
              />
              <YAxis
                stroke="var(--border-color)"
                tick={{ fill: "var(--muted-foreground)", fontSize: 11, fontFamily: "var(--font-mono)" }}
                tickFormatter={(val) => {
                  if (val >= 1e6) return `${(val / 1e6).toFixed(1)}M`
                  if (val >= 1e3) return `${(val / 1e3).toFixed(1)}K`
                  return val
                }}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                labelStyle={{ color: "var(--foreground)", fontWeight: 700 }}
                labelFormatter={(val: any) => formatDate(new Date(val))}
                formatter={(val: any) => [val ? val.toLocaleString() : "0", "Volume"]}
              />
              <Bar dataKey="volume" fill="#ffde00" stroke="var(--border-color)" strokeWidth={1} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
