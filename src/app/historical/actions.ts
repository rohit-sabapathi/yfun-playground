/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import { Ticker } from "yfun-api"

export type HistoricalDataResult = {
  tickerData: any[];
  benchmarkData: any[];
  executionTime: number;
  error: string | null;
}

export type HistoryOptions = Parameters<Ticker['history']>[0] & {
  backAdjust?: boolean; // added locally in case it's not typed from old dist
};

export async function fetchHistoricalData(
  symbol: string,
  options: HistoryOptions,
  compareBenchmark: boolean
): Promise<HistoricalDataResult> {
  if (!symbol) {
    return { tickerData: [], benchmarkData: [], executionTime: 0, error: "No symbol provided" };
  }

  process.env.YFINANCE_DEBUG = "true";

  const ticker = new Ticker(symbol);
  const benchmark = new Ticker("^GSPC"); // S&P 500

  const start = performance.now();
  try {
    const promises = [ticker.history(options)];
    
    if (compareBenchmark) {
      promises.push(benchmark.history(options));
    }

    const results = await Promise.all(promises);
    const end = performance.now();

    return {
      tickerData: results[0] || [],
      benchmarkData: compareBenchmark ? (results[1] || []) : [],
      executionTime: Number((end - start).toFixed(2)),
      error: null
    };
  } catch (e: any) {
    const end = performance.now();
    return {
      tickerData: [],
      benchmarkData: [],
      executionTime: Number((end - start).toFixed(2)),
      error: e.message
    };
  }
}
