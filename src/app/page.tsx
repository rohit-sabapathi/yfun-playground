"use client"

import { usePlayground } from "@/context/PlaygroundContext"
import { PlayCircle, CheckCircle2, Box, Cpu } from "lucide-react"

export default function DashboardPage() {
  const { selectedTicker } = usePlayground()

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to the yfun-api testing playground.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-2 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <Box className="w-5 h-5 text-primary" />
          <h3 className="text-sm font-medium text-muted-foreground">Package Status</h3>
          <p className="text-2xl font-bold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-500" /> Ready
          </p>
        </div>

        <div className="p-6 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-2 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <Box className="w-5 h-5 text-primary" />
          <h3 className="text-sm font-medium text-muted-foreground">Package Version</h3>
          <p className="text-2xl font-bold">0.1.0-alpha</p>
        </div>

        <div className="p-6 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-2 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <Cpu className="w-5 h-5 text-primary" />
          <h3 className="text-sm font-medium text-muted-foreground">Node Version</h3>
          <p className="text-2xl font-bold">v20.x</p>
        </div>

        <div className="p-6 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-2 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <PlayCircle className="w-5 h-5 text-primary" />
          <h3 className="text-sm font-medium text-muted-foreground">Active Ticker</h3>
          <p className="text-2xl font-bold">{selectedTicker || "None"}</p>
        </div>
      </div>

      <div className="p-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center min-h-[300px]">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
            <Box className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-xl font-semibold">Ready for Testing</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Select a module from the sidebar to begin testing the yfun-api package features. Data will be fetched live via the yfun-api instance.
          </p>
        </div>
      </div>
    </div>
  )
}
