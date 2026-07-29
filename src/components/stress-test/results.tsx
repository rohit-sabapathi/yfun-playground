"use client"

import { StressTestReport } from "@/app/stress-test/actions";
import { Download } from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';

const StatBox = ({ label, value, sub }: { label: string, value: string | number, sub?: string }) => (
  <div className="bg-card border border-white/5 p-4 rounded-xl flex flex-col justify-between">
    <div className="text-sm text-muted-foreground mb-1">{label}</div>
    <div className="text-2xl font-bold tracking-tight">{value}</div>
    {sub && <div className="text-xs text-muted-foreground mt-2">{sub}</div>}
  </div>
);

interface ResultsProps {
  report: StressTestReport;
}

export function StressTestResults({ report }: ResultsProps) {
  if (!report) return null;

  const exportReport = (format: 'json' | 'csv') => {
    let content = "";
    let type = "";
    
    if (format === 'json') {
      content = JSON.stringify(report, null, 2);
      type = "application/json";
    } else {
      const headers = Object.keys(report).filter(k => k !== 'memoryData' && k !== 'errorDistribution').join(',');
      const values = Object.keys(report).filter(k => k !== 'memoryData' && k !== 'errorDistribution').map(k => String((report as Record<string, unknown>)[k])).join(',');
      content = `${headers}\n${values}`;
      type = "text/csv";
    }

    const blob = new Blob([content], { type });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stress_test_${report.totalTickers}_${report.mode}.${format}`;
    a.click();
  };

  const successData = [
    { name: 'Success', value: report.successfulRequests },
    { name: 'Failed', value: report.failedRequests }
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Test Results</h2>
        <div className="flex space-x-2">
          <button onClick={() => exportReport('csv')} className="flex items-center space-x-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">
            <Download className="w-4 h-4" /> <span>CSV</span>
          </button>
          <button onClick={() => exportReport('json')} className="flex items-center space-x-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">
            <Download className="w-4 h-4" /> <span>JSON</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <StatBox label="Latency (Avg)" value={`${report.latencyAvg}ms`} sub={`Min: ${report.latencyMin}ms / Max: ${report.latencyMax}ms`} />
        <StatBox label="Requests / Sec" value={report.requestsPerSecond} sub={`Duration: ${report.durationMs}ms`} />
        <StatBox label="Success Rate" value={`${report.successRate}%`} sub={`${report.successfulRequests} / ${report.totalTickers}`} />
        <StatBox label="Network Retries" value={report.networkRetries} sub={`${report.networkFailures} total network failures`} />
        <StatBox label="Avg Response Size" value={`${(report.averageResponseSize / 1024).toFixed(2)} KB`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2 bg-card border border-white/5 rounded-xl p-4 h-[350px]">
          <h3 className="text-sm font-medium mb-4 text-muted-foreground">Memory Usage (Heap Used)</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={report.memoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
              <XAxis 
                dataKey="time" 
                tickFormatter={(val) => `${val}ms`}
                stroke="#666"
                tick={{fill: '#888', fontSize: 12}}
              />
              <YAxis 
                stroke="#666"
                tick={{fill: '#888', fontSize: 12}}
                tickFormatter={(val) => `${val}MB`}
                domain={['auto', 'auto']}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px' }}
                labelFormatter={(val) => `${val}ms from start`}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={(val: any) => [`${val || 0} MB`, 'Heap Used']}
              />
              <Line 
                type="monotone" 
                dataKey="heapUsed" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border border-white/5 rounded-xl p-4 h-[350px]">
          <h3 className="text-sm font-medium mb-4 text-muted-foreground">Request Outcomes</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={successData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
              <XAxis dataKey="name" stroke="#666" tick={{fill: '#888', fontSize: 12}} />
              <YAxis stroke="#666" tick={{fill: '#888', fontSize: 12}} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px' }}
                cursor={{fill: '#ffffff10'}}
              />
              <Bar dataKey="value">
                {successData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.name === 'Success' ? '#10b981' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {Object.keys(report.errorDistribution).length > 0 && (
        <div className="bg-card border border-white/5 rounded-xl overflow-hidden flex flex-col">
          <div className="bg-muted/50 px-4 py-3 border-b border-white/5 text-sm font-medium flex justify-between">
            <span className="text-red-400">Error Distribution</span>
          </div>
          <div className="p-4 text-mono text-sm text-muted-foreground overflow-auto max-h-48">
            <pre>{JSON.stringify(report.errorDistribution, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
