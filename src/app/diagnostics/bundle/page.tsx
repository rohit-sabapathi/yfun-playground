"use client"

import { useState, useEffect } from "react"
import { Activity, CheckCircle, XCircle, Package, Scissors, Download, Loader2 } from "lucide-react"
import { runBundleAnalysis, BundleReport } from "./actions"

export default function BundleAnalysisPage() {
  const [reports, setReports] = useState<BundleReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    runBundleAnalysis().then(res => {
      setReports(res);
      setLoading(false);
    });
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3">
          <Scissors className="w-8 h-8 text-primary" />
          Tree-Shaking Verification
        </h1>
        <p className="text-muted-foreground">
          Real-time static analysis of `yfun-api` using production bundler mechanics to prove dead-code elimination.
        </p>
      </div>

      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center border border-white/5 bg-card rounded-xl">
          <Loader2 className="w-12 h-12 text-primary animate-spin mb-6" />
          <h2 className="text-xl font-bold mb-2">Analyzing Bundles...</h2>
          <p className="text-muted-foreground">Generating virtual entry points and measuring module trees.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reports.map((report, idx) => (
            <div key={idx} className="bg-card border border-white/5 rounded-xl overflow-hidden">
              <div className="bg-muted/30 px-6 py-4 border-b border-white/5 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-muted-foreground" />
                  <h2 className="font-semibold text-lg">{report.testName}</h2>
                </div>
                
                {report.pass ? (
                  <span className="flex items-center gap-1.5 text-green-500 font-bold bg-green-500/10 px-3 py-1 rounded-full text-xs">
                    <CheckCircle className="w-4 h-4" /> PASS
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-red-500 font-bold bg-red-500/10 px-3 py-1 rounded-full text-xs">
                    <XCircle className="w-4 h-4" /> FAIL
                  </span>
                )}
              </div>
              
              <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Parsed Size</div>
                    <div className="text-2xl font-bold font-mono">{(report.totalSize / 1024).toFixed(2)} KB</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Minified Size (Bundle)</div>
                    <div className="text-2xl font-bold font-mono text-primary">{(report.minifiedSize / 1024).toFixed(2)} KB</div>
                  </div>
                  {!report.pass && report.failReason && (
                    <div className="p-3 bg-red-500/10 text-red-400 border border-red-500/20 rounded-md text-sm">
                      {report.failReason}
                    </div>
                  )}
                </div>

                <div className="col-span-2 grid grid-cols-2 gap-4">
                  <div className="bg-[#161b22] border border-white/5 rounded-lg p-4">
                    <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" /> Included yfun-api Modules
                    </h3>
                    <ul className="text-sm font-mono text-muted-foreground space-y-1 max-h-40 overflow-y-auto">
                      {report.includedModules.map((m, i) => (
                        <li key={i}>✓ {m}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-[#161b22] border border-white/5 rounded-lg p-4">
                    <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                      <Scissors className="w-4 h-4 text-muted-foreground" /> Dead-Code Eliminated
                    </h3>
                    <ul className="text-sm font-mono text-muted-foreground space-y-1 max-h-40 overflow-y-auto opacity-50">
                      {report.removedModules.length > 0 ? report.removedModules.map((m, i) => (
                        <li key={i}>✂ {m}</li>
                      )) : <li>No specific dead-code measured for this test</li>}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 text-center">
            <h3 className="text-lg font-bold mb-2">Next.js Webpack/Turbopack Visual Graph</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-2xl mx-auto">
              You can also generate a full, interactive HTML dependency graph for this entire Next.js application by running the analyzer build script in your terminal.
            </p>
            <div className="inline-flex bg-background border border-white/10 rounded-lg p-3 font-mono text-sm">
              npm run build:analyze
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
