/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { Activity, ShieldAlert, CheckCircle, AlertTriangle, Download, RefreshCw, Save } from "lucide-react"
import { runRegressionAction, updateSnapshotsAction, generateReportsAction } from "./actions"
import { RegressionSuiteResult } from "@/lib/regression-runner"

export default function RegressionPage() {
  const [result, setResult] = useState<RegressionSuiteResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  const runTests = async () => {
    setLoading(true);
    try {
      const res = await runRegressionAction();
      setResult(res);
    } catch (e: any) {
      alert("Test failed to run: " + e.message);
    }
    setLoading(false);
  };

  const updateSnapshots = async () => {
    if (!confirm("Are you sure you want to overwrite golden snapshots with live data?")) return;
    setUpdating(true);
    try {
      await updateSnapshotsAction();
      alert("Snapshots updated successfully!");
      setResult(null); // Clear previous results since baseline changed
    } catch (e: any) {
      alert("Failed to update snapshots: " + e.message);
    }
    setUpdating(false);
  };

  const downloadReport = async (format: "md" | "html" | "json") => {
    if (!result) return;
    const reports = await generateReportsAction(result);
    
    let content = "";
    let mime = "text/plain";
    if (format === "md") {
      content = reports.md;
      mime = "text/markdown";
    } else if (format === "html") {
      content = reports.html;
      mime = "text/html";
    } else if (format === "json") {
      content = reports.json;
      mime = "application/json";
    }

    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `regression-report.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3">
            <ShieldAlert className="w-8 h-8 text-primary" />
            API Regression Suite
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Automatically detects schema drift, missing values, and data type changes from upstream Yahoo Finance endpoints.
          </p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={updateSnapshots}
            disabled={updating || loading}
            className="flex items-center gap-2 px-4 py-2 bg-muted text-muted-foreground hover:bg-muted/80 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
          >
            {updating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Update Snapshots
          </button>
          <button 
            onClick={runTests}
            disabled={loading || updating}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? "Running Tests..." : "Run Regression"}
          </button>
        </div>
      </div>

      {!result && !loading && (
        <div className="py-24 text-center border border-white/5 rounded-xl bg-card">
          <ShieldAlert className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h2 className="text-lg font-medium">Ready to run regression suite</h2>
          <p className="text-muted-foreground mt-1">Click &quot;Run Regression&quot; to compare live API responses against local golden snapshots.</p>
        </div>
      )}

      {loading && (
        <div className="py-24 text-center border border-white/5 rounded-xl bg-card">
          <RefreshCw className="w-12 h-12 text-primary mx-auto mb-4 animate-spin" />
          <h2 className="text-lg font-medium">Running Full API Coverage...</h2>
          <p className="text-muted-foreground mt-1">Downloading data and analyzing schema trees...</p>
        </div>
      )}

      {result && (
        <div className="space-y-6">
          <div className={`p-6 rounded-xl border flex justify-between items-center ${result.status === 'PASS' ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
            <div>
              <h2 className="text-2xl font-bold mb-1 flex items-center gap-2">
                {result.status === "PASS" ? <CheckCircle className="w-6 h-6 text-green-500" /> : <ShieldAlert className="w-6 h-6 text-red-500" />}
                {result.status === "PASS" ? "Regression Passed" : "Regression Failed"}
              </h2>
              <p className={`text-sm ${result.status === 'PASS' ? 'text-green-400' : 'text-red-400'}`}>
                Completed in {result.totalDurationMs.toFixed(0)}ms
              </p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => downloadReport("md")} className="px-3 py-1.5 bg-background border border-white/10 hover:bg-white/5 rounded text-sm flex items-center gap-2 transition-colors"><Download className="w-4 h-4" /> Markdown</button>
              <button onClick={() => downloadReport("html")} className="px-3 py-1.5 bg-background border border-white/10 hover:bg-white/5 rounded text-sm flex items-center gap-2 transition-colors"><Download className="w-4 h-4" /> HTML</button>
              <button onClick={() => downloadReport("json")} className="px-3 py-1.5 bg-background border border-white/10 hover:bg-white/5 rounded text-sm flex items-center gap-2 transition-colors"><Download className="w-4 h-4" /> JSON</button>
            </div>
          </div>

          <div className="space-y-4">
            {result.reports.map((report, idx) => (
              <div key={idx} className="border border-white/5 bg-card rounded-xl overflow-hidden">
                <div className="p-4 bg-muted/20 border-b border-white/5 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    {report.status === "PASS" && <CheckCircle className="w-5 h-5 text-green-500" />}
                    {report.status === "WARN" && <AlertTriangle className="w-5 h-5 text-yellow-500" />}
                    {report.status === "FAIL" && <ShieldAlert className="w-5 h-5 text-red-500" />}
                    {report.status === "ERROR" && <ShieldAlert className="w-5 h-5 text-red-500" />}
                    <h3 className="font-semibold">{report.methodName}</h3>
                  </div>
                  <span className="text-sm font-mono text-muted-foreground">{report.durationMs.toFixed(0)}ms</span>
                </div>
                
                <div className="p-4">
                  {report.errorMessage ? (
                    <div className="text-red-400 font-mono text-sm bg-red-500/10 p-3 rounded">Error: {report.errorMessage}</div>
                  ) : report.diffs.length === 0 ? (
                    <div className="text-muted-foreground text-sm flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" /> No schema drift detected.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left">
                        <thead className="text-xs uppercase bg-muted/50 text-muted-foreground">
                          <tr>
                            <th className="px-4 py-2 rounded-tl-lg">Path</th>
                            <th className="px-4 py-2">Type</th>
                            <th className="px-4 py-2">Message</th>
                            <th className="px-4 py-2 rounded-tr-lg">Live Value</th>
                          </tr>
                        </thead>
                        <tbody>
                          {report.diffs.map((diff, i) => (
                            <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                              <td className="px-4 py-3 font-mono text-xs">{diff.path}</td>
                              <td className="px-4 py-3">
                                <span className={`px-2 py-1 rounded text-xs font-bold ${
                                  diff.type === 'REMOVED_FIELD' ? 'bg-red-500/20 text-red-400' :
                                  diff.type === 'NEW_FIELD' ? 'bg-blue-500/20 text-blue-400' :
                                  diff.type === 'TYPE_MISMATCH' ? 'bg-purple-500/20 text-purple-400' :
                                  'bg-yellow-500/20 text-yellow-400'
                                }`}>
                                  {diff.type.replace('_', ' ')}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-muted-foreground">{diff.message}</td>
                              <td className="px-4 py-3 font-mono text-xs text-primary">{String(diff.liveValue || 'N/A')}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
