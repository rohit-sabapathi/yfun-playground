/* eslint-disable @typescript-eslint/no-explicit-any */
import { format } from "date-fns"

interface DataTableProps {
  data: any[]
}

export function HistoricalDataTable({ data }: DataTableProps) {
  if (!data || data.length === 0) return null

  return (
    <div
      style={{
        border: "2px solid var(--border-color)",
        backgroundColor: "var(--card)",
        boxShadow: "var(--shadow-sm)",
        overflow: "hidden",
      }}
    >
      <div className="nb-section-header">Price History Table</div>
      <div className="max-h-[500px] overflow-auto nb-scroll">
        <table className="w-full text-sm text-left" style={{ borderCollapse: "collapse" }}>
          <thead
            style={{
              position: "sticky",
              top: 0,
              backgroundColor: "var(--muted)",
              zIndex: 1,
            }}
          >
            <tr>
              {["Date", "Open", "High", "Low", "Close", "Volume"].map((col, i) => (
                <th
                  key={col}
                  className="px-4 py-3"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.65rem",
                    fontWeight: 900,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: "var(--muted-foreground)",
                    borderBottom: "2px solid var(--border-color)",
                    textAlign: i > 0 ? "right" : "left",
                  }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr
                key={idx}
                style={{
                  borderBottom: "1.5px solid var(--border-color)",
                  backgroundColor: idx % 2 === 0 ? "var(--card)" : "var(--muted)",
                  transition: "background-color 60ms ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--accent)")}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = idx % 2 === 0 ? "var(--card)" : "var(--muted)")
                }
              >
                <td
                  className="px-4 py-2"
                  style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--foreground)" }}
                >
                  {format(new Date(row.date), "yyyy-MM-dd HH:mm")}
                </td>
                <td
                  className="px-4 py-2 text-right"
                  style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--foreground)" }}
                >
                  {row.open?.toFixed(4) ?? "-"}
                </td>
                <td
                  className="px-4 py-2 text-right"
                  style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--accent-green)" }}
                >
                  {row.high?.toFixed(4) ?? "-"}
                </td>
                <td
                  className="px-4 py-2 text-right"
                  style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--accent-red)" }}
                >
                  {row.low?.toFixed(4) ?? "-"}
                </td>
                <td
                  className="px-4 py-2 text-right font-black"
                  style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--accent-blue)" }}
                >
                  {row.close?.toFixed(4) ?? "-"}
                </td>
                <td
                  className="px-4 py-2 text-right"
                  style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--muted-foreground)" }}
                >
                  {row.volume?.toLocaleString() ?? "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
