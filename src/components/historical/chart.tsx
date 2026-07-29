"use client"
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ComposedChart
} from 'recharts';
import { format } from 'date-fns';

interface HistoricalChartProps {
  data: any[];
  benchmarkData: any[];
}

export function HistoricalChart({ data, benchmarkData }: HistoricalChartProps) {
  if (!data || data.length === 0) return <div className="p-8 text-center text-muted-foreground">No chart data available</div>;

  // Format data for chart
  const chartData = data.map((d, i) => {
    const item: any = {
      date: new Date(d.date),
      price: d.close,
      volume: d.volume,
    };
    if (benchmarkData && benchmarkData[i] && benchmarkData[i].date && new Date(benchmarkData[i].date).getTime() === item.date.getTime()) {
       // Only add benchmark if dates align exactly
       // (A robust solution would merge on dates, but this is a simple approximation for matched intervals)
       item.benchmark = benchmarkData[i].close;
    }
    return item;
  });

  const formatDate = (date: Date) => {
    return format(date, 'MMM dd, yyyy HH:mm');
  };

  return (
    <div className="space-y-4">
      <div className="h-[400px] w-full bg-card border border-white/5 rounded-xl p-4">
        <h3 className="text-sm font-medium mb-4 text-muted-foreground">Price History</h3>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} syncId="historical-charts">
            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
            <XAxis 
              dataKey="date" 
              tickFormatter={(val) => format(val, 'MMM dd')}
              stroke="#666"
              tick={{fill: '#888', fontSize: 12}}
              minTickGap={30}
            />
            <YAxis 
              yAxisId="left"
              domain={['auto', 'auto']}
              stroke="#666"
              tick={{fill: '#888', fontSize: 12}}
              tickFormatter={(val) => `$${val.toFixed(2)}`}
            />
            {benchmarkData.length > 0 && (
              <YAxis 
                yAxisId="right"
                orientation="right"
                domain={['auto', 'auto']}
                stroke="#666"
                tick={{fill: '#888', fontSize: 12}}
                tickFormatter={(val) => `$${val.toFixed(2)}`}
              />
            )}
            <Tooltip 
              contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px' }}
              labelFormatter={(val: any) => formatDate(new Date(val))}
            />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="price" 
              name="Price"
              stroke="#10b981" 
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
            {benchmarkData.length > 0 && (
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="benchmark" 
                name="S&P 500"
                stroke="#6366f1" 
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="h-[200px] w-full bg-card border border-white/5 rounded-xl p-4">
        <h3 className="text-sm font-medium mb-4 text-muted-foreground">Volume</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} syncId="historical-charts">
            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
            <XAxis 
              dataKey="date" 
              tickFormatter={(val) => format(val, 'MMM dd')}
              stroke="#666"
              tick={{fill: '#888', fontSize: 12}}
              minTickGap={30}
            />
            <YAxis 
              stroke="#666"
              tick={{fill: '#888', fontSize: 12}}
              tickFormatter={(val) => {
                if (val >= 1e6) return `${(val / 1e6).toFixed(1)}M`;
                if (val >= 1e3) return `${(val / 1e3).toFixed(1)}K`;
                return val;
              }}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px' }}
              labelFormatter={(val: any) => formatDate(new Date(val))}
              formatter={(val: any) => [val ? val.toLocaleString() : '0', 'Volume']}
            />
            <Bar dataKey="volume" fill="#3b82f6" opacity={0.8} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
