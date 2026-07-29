/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/purity */
import { Ticker } from "yfun-api";
import { CheckCircle, XCircle } from "lucide-react";

export async function ServerComponentTest() {
  const start = performance.now();
  let success = false;
  let errorMsg = "";
  
  try {
    const ticker = new Ticker("AAPL");
    await ticker.info();
    success = true;
  } catch (e: any) {
    errorMsg = e.message;
  }
  const end = performance.now();
  const duration = (end - start).toFixed(2);

  return (
    <div className="flex items-center justify-between p-4 border-b border-white/5 bg-card">
      <div className="flex flex-col">
        <span className="font-medium text-lg">Server Components</span>
        <span className="text-xs text-muted-foreground mt-1">Rendered on the server during SSR</span>
      </div>
      
      <div className="flex items-center gap-6 text-sm">
        <span className="font-mono text-muted-foreground">{duration}ms</span>
        {success ? (
          <span className="flex items-center gap-1.5 text-green-500 font-bold bg-green-500/10 px-3 py-1 rounded-full">
            <CheckCircle className="w-4 h-4" /> PASS
          </span>
        ) : (
          <div className="flex items-center gap-4">
            <span className="text-red-400 text-xs max-w-xs truncate">{errorMsg}</span>
            <span className="flex items-center gap-1.5 text-red-500 font-bold bg-red-500/10 px-3 py-1 rounded-full">
              <XCircle className="w-4 h-4" /> FAIL
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
