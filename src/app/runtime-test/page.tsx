import { Server } from "lucide-react"

import { TestRunner } from "@/components/runtime-test/test-runner"
import { CodeSnippets } from "@/components/runtime-test/code-snippets"
import { ServerComponentTest } from "./server-component-test"

export default function RuntimeTestPage() {
  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3">
          <Server className="w-8 h-8 text-primary" />
          Runtime Compatibility Suite
        </h1>
        <p className="text-muted-foreground">
          Automatically verifies yfun-api execution across various JavaScript runtimes, module formats, and Next.js environments.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-muted-foreground uppercase tracking-wider text-sm">Automated Test Execution</h2>
          <ServerComponentTest />
          <TestRunner />
        </div>

        <CodeSnippets />
      </div>
    </div>
  )
}
