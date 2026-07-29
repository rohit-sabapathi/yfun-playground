/* eslint-disable @typescript-eslint/no-explicit-any */
import { format } from "date-fns";

interface DataTableProps {
  data: any[];
}

export function HistoricalDataTable({ data }: DataTableProps) {
  if (!data || data.length === 0) return null;

  return (
    <div className="rounded-xl border border-white/5 bg-card overflow-hidden">
      <div className="max-h-[500px] overflow-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase bg-muted/50 text-muted-foreground sticky top-0 backdrop-blur-md">
            <tr>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium text-right">Open</th>
              <th className="px-4 py-3 font-medium text-right">High</th>
              <th className="px-4 py-3 font-medium text-right">Low</th>
              <th className="px-4 py-3 font-medium text-right">Close</th>
              <th className="px-4 py-3 font-medium text-right">Volume</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {data.map((row, idx) => (
              <tr key={idx} className="hover:bg-muted/50 transition-colors">
                <td className="px-4 py-2 font-mono">{format(new Date(row.date), 'yyyy-MM-dd HH:mm')}</td>
                <td className="px-4 py-2 text-right">{row.open?.toFixed(4) ?? "-"}</td>
                <td className="px-4 py-2 text-right">{row.high?.toFixed(4) ?? "-"}</td>
                <td className="px-4 py-2 text-right">{row.low?.toFixed(4) ?? "-"}</td>
                <td className="px-4 py-2 text-right font-medium text-primary">{row.close?.toFixed(4) ?? "-"}</td>
                <td className="px-4 py-2 text-right text-muted-foreground">{row.volume?.toLocaleString() ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
