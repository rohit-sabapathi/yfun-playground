"use client"

import { useState, useEffect } from "react"
import { CheckCircle, XCircle, AlertTriangle, Loader2, Play } from "lucide-react"
import { testServerAction, testDynamicImport, testCommonJS } from "@/app/runtime-test/actions"

type TestResult = {
  name: string
  description: string
  status: "pending" | "running" | "pass" | "fail" | "warn"
  duration?: number
  error?: string
  run: () => Promise<{ success: boolean; duration: number; error?: string }>
}

export function TestRunner() {
  const [tests, setTests] = useState<TestResult[]>([
    {
      name: "ESM Imports",
      description: "Standard ECMAScript module imports",
      status: "pending",
      run: async () => testServerAction(),
    },
    {
      name: "CommonJS (CJS)",
      description: "Using require('yfun-api')",
      status: "pending",
      run: async () => testCommonJS(),
    },
    {
      name: "Dynamic Imports",
      description: "Using await import('yfun-api')",
      status: "pending",
      run: async () => testDynamicImport(),
    },
    {
      name: "Server Actions",
      description: "Next.js 'use server' actions",
      status: "pending",
      run: async () => testServerAction(),
    },
    {
      name: "Route Handlers (Node)",
      description: "app/api/... with export const runtime = 'nodejs'",
      status: "pending",
      run: async () => {
        const start = performance.now()
        const res = await fetch("/api/runtime/node")
        const data = await res.json()
        return {
          success: res.ok && data.success,
          duration: data.duration || performance.now() - start,
          error: data.error,
        }
      },
    },
    {
      name: "Edge Compatibility",
      description: "app/api/... with export const runtime = 'edge'",
      status: "pending",
      run: async () => {
        const start = performance.now()
        const res = await fetch("/api/runtime/edge")
        const data = await res.json()
        return {
          success: res.ok && data.success,
          duration: data.duration || performance.now() - start,
          error: data.error,
        }
      },
    },
  ])

  const [isRunning, setIsRunning] = useState(false)

  const runAllTests = async () => {
    setIsRunning(true)
    setTests((prev) => prev.map((t) => ({ ...t, status: "pending", duration: undefined, error: undefined })))

    for (let i = 0; i < tests.length; i++) {
      setTests((prev) => {
        const next = [...prev]
        next[i].status = "running"
        return next
      })

      try {
        const result = await tests[i].run()
        setTests((prev) => {
          const next = [...prev]
          next[i].status = result.success ? "pass" : "fail"
          next[i].duration = result.duration
          next[i].error = result.error
          return next
        })
      } catch (err: unknown) {
        setTests((prev) => {
          const next = [...prev]
          next[i].status = "fail"
          next[i].error = err instanceof Error ? err.message : String(err)
          return next
        })
      }
    }

    setIsRunning(false)
  }

  useEffect(() => {
    runAllTests()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const StatusIcon = ({ status }: { status: string }) => {
    switch (status) {
      case "pass":
        return <CheckCircle className="w-5 h-5" style={{ color: "var(--accent-green)" }} />
      case "fail":
        return <XCircle className="w-5 h-5" style={{ color: "var(--accent-red)" }} />
      case "warn":
        return <AlertTriangle className="w-5 h-5" style={{ color: "var(--accent)" }} />
      case "running":
        return <Loader2 className="w-5 h-5 animate-spin" style={{ color: "var(--accent-blue)" }} />
      default:
        return (
          <div
            className="w-5 h-5"
            style={{ border: "2px solid var(--border-color)", backgroundColor: "var(--muted)" }}
          />
        )
    }
  }

  const statusStyles: Record<string, React.CSSProperties> = {
    pass: { backgroundColor: "var(--accent-green)", color: "#0a0a0a" },
    fail: { backgroundColor: "var(--accent-red)", color: "#ffffff" },
    warn: { backgroundColor: "var(--accent)", color: "#0a0a0a" },
    running: { backgroundColor: "var(--accent-blue)", color: "#ffffff" },
    pending: { backgroundColor: "var(--muted)", color: "var(--muted-foreground)" },
  }

  const StatusBadge = ({ status }: { status: string }) => (
    <span
      className="px-3 py-1 text-[10px] font-black uppercase tracking-widest"
      style={{
        ...(statusStyles[status] || statusStyles.pending),
        border: "1.5px solid var(--border-color)",
        fontFamily: "var(--font-mono)",
        display: "inline-block",
      }}
    >
      {status.toUpperCase()}
    </span>
  )

  const passCount = tests.filter((t) => t.status === "pass").length
  const failCount = tests.filter((t) => t.status === "fail").length

  return (
    <div
      style={{
        backgroundColor: "var(--card)",
        border: "2px solid var(--border-color)",
        boxShadow: "var(--shadow)",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        className="px-6 py-4 flex justify-between items-center"
        style={{ borderBottom: "2px solid var(--border-color)", backgroundColor: "var(--muted)" }}
      >
        <div className="flex items-center gap-4">
          <h2
            className="font-black text-lg uppercase tracking-wide"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Runtime Tests
          </h2>
          <div className="flex items-center gap-2">
            {passCount > 0 && (
              <span
                className="px-2 py-0.5 text-[10px] font-black uppercase"
                style={{
                  backgroundColor: "var(--accent-green)",
                  color: "#0a0a0a",
                  border: "1.5px solid var(--border-color)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {passCount} PASS
              </span>
            )}
            {failCount > 0 && (
              <span
                className="px-2 py-0.5 text-[10px] font-black uppercase"
                style={{
                  backgroundColor: "var(--accent-red)",
                  color: "#fff",
                  border: "1.5px solid var(--border-color)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {failCount} FAIL
              </span>
            )}
          </div>
        </div>
        <button
          id="run-tests-btn"
          onClick={runAllTests}
          disabled={isRunning}
          className="nb-btn"
          style={{ minWidth: "140px" }}
        >
          {isRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
          {isRunning ? "Running..." : "Run Tests"}
        </button>
      </div>

      {/* Test rows */}
      <div className="flex flex-col">
        {tests.map((test, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between px-6 py-4"
            style={{
              borderBottom:
                idx < tests.length - 1 ? "2px solid var(--border-color)" : "none",
              backgroundColor:
                test.status === "running"
                  ? "var(--muted)"
                  : "transparent",
              transition: "background-color 100ms ease",
            }}
          >
            <div className="flex items-center gap-4">
              <StatusIcon status={test.status} />
              <div className="flex flex-col">
                <span
                  className="font-black uppercase tracking-wide"
                  style={{ fontFamily: "var(--font-sans)", fontSize: "0.85rem" }}
                >
                  {test.name}
                </span>
                <span
                  className="text-xs mt-0.5"
                  style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-mono)" }}
                >
                  {test.description}
                </span>
                {test.error && (
                  <span
                    className="text-xs mt-1.5 px-2 py-1 max-w-lg truncate"
                    style={{
                      color: "var(--accent-red)",
                      fontFamily: "var(--font-mono)",
                      backgroundColor: "var(--muted)",
                      border: "1.5px solid var(--accent-red)",
                    }}
                  >
                    {test.error}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-6">
              <span
                className="font-black"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.85rem",
                  color: test.duration !== undefined ? "var(--accent-green)" : "var(--muted-foreground)",
                  minWidth: "80px",
                  textAlign: "right",
                }}
              >
                {test.duration !== undefined ? `${test.duration.toFixed(2)}ms` : "—"}
              </span>
              <div style={{ minWidth: "80px", display: "flex", justifyContent: "flex-end" }}>
                <StatusBadge status={test.status} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
