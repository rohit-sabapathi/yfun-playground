"use client"

import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { runStressTest, StressTestReport } from "./actions"
import { Activity } from "lucide-react"

import { StressTestControls } from "@/components/stress-test/controls"
import { StressTestResults } from "@/components/stress-test/results"

export default function StressTestPage() {
  const [count, setCount] = useState<number>(100);
  const [mode, setMode] = useState<"sequential" | "parallel">("parallel");

  const mutation = useMutation({
    mutationFn: () => runStressTest(count, mode),
  })

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3">
          <Activity className="w-8 h-8 text-primary" />
          System Stress Test
        </h1>
        <p className="text-muted-foreground">
          Simulate high-load environments to measure latency, success rates, memory, and CPU usage via yfun-api.
        </p>
      </div>

      <StressTestControls 
        count={count}
        setCount={setCount}
        mode={mode}
        setMode={setMode}
        isLoading={mutation.isPending}
        onRunTest={() => mutation.mutate()}
      />

      {mutation.isPending && (
        <div className="py-24 flex flex-col items-center justify-center border border-white/5 bg-card rounded-xl">
          <Activity className="w-12 h-12 text-primary animate-pulse mb-6" />
          <h2 className="text-xl font-bold mb-2">Executing Stress Test...</h2>
          <p className="text-muted-foreground">
            This may take a moment depending on the ticker count.
          </p>
        </div>
      )}

      {mutation.isError && (
        <div className="p-8 border border-red-500/20 bg-red-500/5 rounded-xl text-center">
          <h2 className="text-xl font-bold mb-2 text-red-500">Execution Failed</h2>
          <p className="text-muted-foreground">
            {(mutation.error as Error).message}
          </p>
        </div>
      )}

      {!mutation.isPending && mutation.isSuccess && mutation.data && (
        <StressTestResults report={mutation.data as StressTestReport} />
      )}
    </div>
  )
}
