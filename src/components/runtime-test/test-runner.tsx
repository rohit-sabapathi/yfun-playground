"use client"

import { useState, useEffect } from "react"
import { CheckCircle, XCircle, AlertTriangle, Loader2, Play } from "lucide-react"
import { testServerAction, testDynamicImport, testCommonJS } from "@/app/runtime-test/actions"

type TestResult = {
  name: string;
  description: string;
  status: "pending" | "running" | "pass" | "fail" | "warn";
  duration?: number;
  error?: string;
  run: () => Promise<{ success: boolean; duration: number; error?: string }>;
}

export function TestRunner() {
  const [tests, setTests] = useState<TestResult[]>([
    {
      name: "ESM Imports",
      description: "Standard ECMAScript module imports",
      status: "pending",
      run: async () => {
        // Technically ESM is tested via the Route Handlers and Server Components natively.
        // We will just run the server action which uses ESM import syntax.
        return testServerAction();
      }
    },
    {
      name: "CommonJS (CJS)",
      description: "Using require('yfun-api')",
      status: "pending",
      run: async () => testCommonJS()
    },
    {
      name: "Dynamic Imports",
      description: "Using await import('yfun-api')",
      status: "pending",
      run: async () => testDynamicImport()
    },
    {
      name: "Server Actions",
      description: "Next.js 'use server' actions",
      status: "pending",
      run: async () => testServerAction()
    },
    {
      name: "Route Handlers (Node)",
      description: "app/api/... with export const runtime = 'nodejs'",
      status: "pending",
      run: async () => {
        const start = performance.now();
        const res = await fetch('/api/runtime/node');
        const data = await res.json();
        return { 
          success: res.ok && data.success, 
          duration: data.duration || performance.now() - start,
          error: data.error
        };
      }
    },
    {
      name: "Edge Compatibility",
      description: "app/api/... with export const runtime = 'edge'",
      status: "pending",
      run: async () => {
        const start = performance.now();
        const res = await fetch('/api/runtime/edge');
        const data = await res.json();
        return { 
          success: res.ok && data.success, 
          duration: data.duration || performance.now() - start,
          error: data.error
        };
      }
    }
  ]);

  const [isRunning, setIsRunning] = useState(false);

  const runAllTests = async () => {
    setIsRunning(true);
    
    // Reset status
    setTests(prev => prev.map(t => ({ ...t, status: "pending", duration: undefined, error: undefined })));

    for (let i = 0; i < tests.length; i++) {
      setTests(prev => {
        const next = [...prev];
        next[i].status = "running";
        return next;
      });

      try {
        const result = await tests[i].run();
        setTests(prev => {
          const next = [...prev];
          next[i].status = result.success ? "pass" : "fail";
          next[i].duration = result.duration;
          next[i].error = result.error;
          return next;
        });
      } catch (err: unknown) {
        setTests(prev => {
          const next = [...prev];
          next[i].status = "fail";
          next[i].error = err instanceof Error ? err.message : String(err);
          return next;
        });
      }
    }
    
    setIsRunning(false);
  };

  useEffect(() => {
    // Auto run on mount
    runAllTests();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const StatusIcon = ({ status }: { status: string }) => {
    switch(status) {
      case "pass": return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "fail": return <XCircle className="w-5 h-5 text-red-500" />;
      case "warn": return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case "running": return <Loader2 className="w-5 h-5 text-primary animate-spin" />;
      default: return <div className="w-5 h-5 rounded-full border-2 border-muted" />;
    }
  }

  const StatusBadge = ({ status }: { status: string }) => {
    switch(status) {
      case "pass": return <span className="bg-green-500/10 text-green-500 font-bold px-3 py-1 rounded-full text-xs">PASS</span>;
      case "fail": return <span className="bg-red-500/10 text-red-500 font-bold px-3 py-1 rounded-full text-xs">FAIL</span>;
      case "warn": return <span className="bg-yellow-500/10 text-yellow-500 font-bold px-3 py-1 rounded-full text-xs">WARN</span>;
      case "running": return <span className="bg-primary/10 text-primary font-bold px-3 py-1 rounded-full text-xs animate-pulse">RUNNING</span>;
      default: return <span className="bg-muted text-muted-foreground font-bold px-3 py-1 rounded-full text-xs">PENDING</span>;
    }
  }

  return (
    <div className="bg-card border border-white/5 rounded-xl overflow-hidden flex flex-col">
      <div className="bg-muted/30 px-6 py-4 border-b border-white/5 flex justify-between items-center">
        <h2 className="font-semibold text-lg">Client & Runtime Executions</h2>
        <button 
          onClick={runAllTests} 
          disabled={isRunning}
          className="flex items-center space-x-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
        >
          {isRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
          <span>{isRunning ? "Running..." : "Run Tests Again"}</span>
        </button>
      </div>
      
      <div className="flex flex-col">
        {tests.map((test, idx) => (
          <div key={idx} className="flex items-center justify-between p-4 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
            <div className="flex items-center space-x-4">
              <StatusIcon status={test.status} />
              <div className="flex flex-col">
                <span className="font-medium">{test.name}</span>
                <span className="text-xs text-muted-foreground mt-1">{test.description}</span>
                {test.error && (
                  <span className="text-xs text-red-400 mt-2 max-w-lg font-mono truncate">{test.error}</span>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-6 text-sm">
              <span className="font-mono text-muted-foreground">
                {test.duration !== undefined ? `${test.duration.toFixed(2)}ms` : '-'}
              </span>
              <div className="w-20 flex justify-end">
                <StatusBadge status={test.status} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
