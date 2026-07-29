"use client"

import { useState, useEffect } from "react"
import { getDebugLogs, clearDebugLogs, RequestLog } from "@/app/debug/actions"
import { Activity, Clock, Database, Globe, Search, RefreshCw, Trash2, Copy, Check } from "lucide-react"

export function DebugUI() {
  const [logs, setLogs] = useState<RequestLog[]>([]);
  const [selectedLogId, setSelectedLogId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchLogs = async () => {
    const data = await getDebugLogs();
    setLogs(data);
  };

  useEffect(() => {
    fetchLogs();
    
    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(fetchLogs, 2000);
    }
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const handleClear = async () => {
    await clearDebugLogs();
    setLogs([]);
    setSelectedLogId(null);
  };

  const handleCopyAll = (log: RequestLog) => {
    navigator.clipboard.writeText(JSON.stringify(log, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredLogs = logs.filter(log => 
    log.url.toLowerCase().includes(search.toLowerCase()) || 
    log.status.toString().includes(search)
  );

  const selectedLog = logs.find(l => l.id === selectedLogId);

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-card border border-white/5 rounded-xl overflow-hidden mt-6">
      {/* Sidebar List */}
      <div className="w-1/3 border-r border-white/5 flex flex-col bg-muted/10">
        <div className="p-4 border-b border-white/5 flex flex-col gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
            <input 
              type="text"
              placeholder="Filter by URL or Status..."
              className="w-full bg-background border border-white/10 rounded-md pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="flex justify-between items-center">
            <button 
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`text-xs flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors ${autoRefresh ? 'bg-primary/20 text-primary' : 'hover:bg-white/5'}`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${autoRefresh ? 'animate-spin' : ''}`} />
              Auto Refresh
            </button>
            <button 
              onClick={handleClear}
              className="text-xs flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-red-500/10 text-red-400 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear All
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {filteredLogs.length === 0 ? (
            <div className="text-center p-8 text-muted-foreground text-sm">No requests intercepted yet.</div>
          ) : (
            filteredLogs.map(log => (
              <button
                key={log.id}
                onClick={() => setSelectedLogId(log.id)}
                className={`w-full text-left p-4 border-b border-white/5 transition-colors ${
                  selectedLogId === log.id ? "bg-primary/10 border-l-2 border-l-primary" : "hover:bg-white/[0.02]"
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                    log.status === 200 ? "bg-green-500/20 text-green-400" :
                    log.status === 0 ? "bg-yellow-500/20 text-yellow-400" :
                    "bg-red-500/20 text-red-400"
                  }`}>
                    {log.status === 0 ? "PENDING" : log.status}
                  </span>
                  <span className="text-xs text-muted-foreground font-mono">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="font-mono text-xs truncate text-gray-300">
                  {log.method} {new URL(log.url).pathname}
                </div>
                <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {log.executionTime.toFixed(0)}ms</span>
                  {log.cacheHit && <span className="flex items-center gap-1 text-blue-400"><Database className="w-3 h-3" /> CACHE HIT</span>}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Detail View */}
      <div className="w-2/3 flex flex-col bg-background overflow-hidden">
        {selectedLog ? (
          <>
            <div className="p-4 border-b border-white/5 flex justify-between items-start bg-muted/5">
              <div className="flex-1 min-w-0 pr-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-bold text-sm bg-white/10 px-2 py-1 rounded">{selectedLog.method}</span>
                  <span className="font-mono text-sm truncate text-gray-300 break-all">{selectedLog.url}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>Size: {(selectedLog.responseSize / 1024).toFixed(2)} KB</span>
                  <span>Retries: {selectedLog.retries}</span>
                  <span>Crumb: {selectedLog.crumb ? 'Yes' : 'No'}</span>
                </div>
              </div>
              <button 
                onClick={() => handleCopyAll(selectedLog)}
                className="flex items-center gap-2 px-3 py-1.5 bg-primary/20 text-primary hover:bg-primary/30 rounded-md text-sm transition-colors shrink-0"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied" : "Copy Raw JSON"}
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              
              {/* Timeline */}
              {selectedLog.retryTimeline.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold mb-2 flex items-center gap-2 border-b border-white/10 pb-2">
                    <Activity className="w-4 h-4" /> Retry Timeline
                  </h3>
                  <div className="space-y-2">
                    {selectedLog.retryTimeline.map((t, i) => (
                      <div key={i} className="text-sm flex gap-4 bg-red-500/5 p-2 rounded border border-red-500/10">
                        <span className="text-red-400 font-mono">Attempt {t.attempt}</span>
                        <span className="text-muted-foreground">Delayed {t.delay}ms</span>
                        <span className="text-gray-400 truncate">{t.error}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Request Headers */}
              <div>
                <h3 className="text-sm font-semibold mb-2 border-b border-white/10 pb-2">Request Headers & Cookies</h3>
                <pre className="bg-[#0d1117] p-3 rounded-md text-xs font-mono text-green-400 overflow-x-auto border border-white/5">
                  {JSON.stringify({ 
                    headers: selectedLog.requestHeaders, 
                    cookie: selectedLog.cookie 
                  }, null, 2)}
                </pre>
              </div>

              {/* Response Headers */}
              <div>
                <h3 className="text-sm font-semibold mb-2 border-b border-white/10 pb-2">Response Headers</h3>
                <pre className="bg-[#0d1117] p-3 rounded-md text-xs font-mono text-blue-400 overflow-x-auto border border-white/5">
                  {JSON.stringify(selectedLog.responseHeaders, null, 2)}
                </pre>
              </div>

              {/* Payload (if any) */}
              {selectedLog.payload && (
                <div>
                  <h3 className="text-sm font-semibold mb-2 border-b border-white/10 pb-2">Request Payload</h3>
                  <pre className="bg-[#0d1117] p-3 rounded-md text-xs font-mono text-yellow-300 overflow-x-auto border border-white/5">
                    {JSON.stringify(selectedLog.payload, null, 2)}
                  </pre>
                </div>
              )}

              {/* Response Body */}
              <div>
                <h3 className="text-sm font-semibold mb-2 border-b border-white/10 pb-2">Response Body</h3>
                <pre className="bg-[#0d1117] p-3 rounded-md text-xs font-mono text-gray-300 overflow-x-auto border border-white/5 max-h-96 overflow-y-auto">
                  {JSON.stringify(selectedLog.response, null, 2)}
                </pre>
              </div>
              
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
            <Globe className="w-16 h-16 mb-4 opacity-20" />
            <p>Select a request from the sidebar to inspect</p>
          </div>
        )}
      </div>
    </div>
  )
}
