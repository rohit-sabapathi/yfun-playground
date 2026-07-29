import { Activity } from "lucide-react"
import { DebugUI } from "@/components/debug/DebugUI"

export default function DebugPage() {
  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      <div className="mb-2">
        <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3">
          <Activity className="w-8 h-8 text-primary" />
          Network Interceptor
        </h1>
        <p className="text-muted-foreground max-w-3xl">
          Advanced debugging dashboard for `yfun-api`. Every HTTP request made under the hood is automatically intercepted and logged here in real-time. Supports full payload inspection, cache hit tracing, and retry timelines.
        </p>
      </div>

      <DebugUI />
    </div>
  )
}
