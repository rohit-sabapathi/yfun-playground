/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import { Ticker, globalCache, requestManager } from "yfun-api";

export type StressTestReport = {
  totalTickers: number;
  mode: string;
  durationMs: number;
  requestsPerSecond: number;
  successRate: number;
  successfulRequests: number;
  failedRequests: number;
  networkRetries: number;
  networkFailures: number;
  averageResponseSize: number;
  latencyAvg: number;
  latencyMin: number;
  latencyMax: number;
  memoryData: { time: number; heapUsed: number }[];
  errorDistribution: Record<string, number>;
}

// Generate an array of symbols to test. 
// We use a small subset of real tickers and pad with random strings that will likely 404 to test error handling under load.
function generateTickers(count: number): string[] {
  const realTickers = ["AAPL", "MSFT", "TSLA", "NVDA", "AMZN", "GOOGL", "META", "BRK-B", "JNJ", "V", "WMT", "JPM", "PG", "MA", "UNH", "HD", "BAC", "XOM", "DIS", "CSCO"];
  const tickers: string[] = [];
  
  for (let i = 0; i < count; i++) {
    if (i < realTickers.length) {
      tickers.push(realTickers[i]);
    } else {
      // Generate some dummy tickers to test failure rate handling
      tickers.push(`DUMMY${i}`);
    }
  }
  return tickers;
}

export async function runStressTest(count: number, mode: "sequential" | "parallel"): Promise<StressTestReport> {
  const tickers = generateTickers(count);
  
  // Clear the yfun-api memory cache and reset network metrics
  globalCache.clear();
  requestManager.resetMetrics();
  
  const memoryData: { time: number; heapUsed: number }[] = [];
  
  // Start memory sampling every 50ms during the test
  const memoryInterval = setInterval(() => {
    memoryData.push({ time: Date.now(), heapUsed: process.memoryUsage().heapUsed / 1024 / 1024 });
  }, 50);

  const start = performance.now();
  let successfulRequests = 0;
  let localFailedRequests = 0;
  let totalResponseSize = 0;
  let latencySum = 0;
  let latencyMin = Infinity;
  let latencyMax = 0;
  
  const errorDistribution: Record<string, number> = {};

  const processTicker = async (symbol: string) => {
    const tStart = performance.now();
    try {
      const ticker = new Ticker(symbol);
      // We will fetch quote summary which hits multiple modules
      const data = await ticker.info();
      const tEnd = performance.now();
      const latency = tEnd - tStart;
      
      successfulRequests++;
      latencySum += latency;
      latencyMin = Math.min(latencyMin, latency);
      latencyMax = Math.max(latencyMax, latency);
      
      const size = JSON.stringify(data).length;
      totalResponseSize += size;
    } catch (e: any) {
      localFailedRequests++;
      const msg = e.message || "Unknown error";
      errorDistribution[msg] = (errorDistribution[msg] || 0) + 1;
    }
  };

  if (mode === "sequential") {
    for (const symbol of tickers) {
      await processTicker(symbol);
    }
  } else {
    // Parallel mode with batching (batch size 50 to avoid OS EMFILE / Socket Exhaustion immediately)
    const BATCH_SIZE = 50;
    for (let i = 0; i < tickers.length; i += BATCH_SIZE) {
      const batch = tickers.slice(i, i + BATCH_SIZE);
      await Promise.all(batch.map(processTicker));
    }
  }

  const end = performance.now();
  clearInterval(memoryInterval);
  
  // Ensure we have at least a final memory snapshot
  memoryData.push({ time: Date.now(), heapUsed: process.memoryUsage().heapUsed / 1024 / 1024 });
  
  // Normalize memory data time relative to start (0ms)
  const startTime = memoryData[0]?.time || Date.now();
  const normalizedMemoryData = memoryData.map(m => ({
    time: m.time - startTime,
    heapUsed: Number(m.heapUsed.toFixed(2))
  }));

  const durationMs = end - start;
  const requestsPerSecond = (count / durationMs) * 1000;
  
  return {
    totalTickers: count,
    mode,
    durationMs: Number(durationMs.toFixed(2)),
    requestsPerSecond: Number(requestsPerSecond.toFixed(2)),
    successRate: Number(((successfulRequests / count) * 100).toFixed(2)),
    successfulRequests,
    failedRequests: localFailedRequests,
    networkRetries: requestManager.metrics.retries,
    networkFailures: requestManager.metrics.failedRequests,
    averageResponseSize: successfulRequests > 0 ? Number((totalResponseSize / successfulRequests).toFixed(2)) : 0,
    latencyAvg: successfulRequests > 0 ? Number((latencySum / successfulRequests).toFixed(2)) : 0,
    latencyMin: latencyMin === Infinity ? 0 : Number(latencyMin.toFixed(2)),
    latencyMax: Number(latencyMax.toFixed(2)),
    memoryData: normalizedMemoryData,
    errorDistribution
  };
}
