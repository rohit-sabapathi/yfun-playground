/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import { Ticker } from "yfun-api"

export type ExplorerDataResult = {
  methodName: string;
  data: any;
  executionTime: number;
  error: string | null;
}

export async function fetchExplorerData(symbol: string): Promise<ExplorerDataResult[]> {
  if (!symbol) return [];
  process.env.YFINANCE_DEBUG = "true";

  const ticker = new Ticker(symbol);

  const callMethod = async (name: string, fn: () => Promise<any>): Promise<ExplorerDataResult> => {
    const start = performance.now();
    try {
      const data = await fn();
      const end = performance.now();
      return { methodName: name, data, executionTime: Number((end - start).toFixed(2)), error: null };
    } catch (e: any) {
      const end = performance.now();
      return { methodName: name, data: null, executionTime: Number((end - start).toFixed(2)), error: e.message };
    }
  }

  // We are calling ALL methods as requested by the user
  const results = await Promise.all([
    callMethod('info', () => ticker.info()),
    callMethod('financials (yearly)', () => ticker.financials('yearly')),
    callMethod('financials (quarterly)', () => ticker.financials('quarterly')),
    callMethod('balanceSheet (yearly)', () => ticker.balanceSheet('yearly')),
    callMethod('balanceSheet (quarterly)', () => ticker.balanceSheet('quarterly')),
    callMethod('cashflow (yearly)', () => ticker.cashflow('yearly')),
    callMethod('cashflow (quarterly)', () => ticker.cashflow('quarterly')),
    callMethod('earnings (yearly)', () => ticker.earnings('yearly')),
    callMethod('earnings (quarterly)', () => ticker.earnings('quarterly')),
    callMethod('options', () => ticker.options()),
    callMethod('majorHolders', () => ticker.majorHolders()),
    callMethod('institutionalHolders', () => ticker.institutionalHolders()),
    callMethod('fundHolders', () => ticker.fundHolders()),
    callMethod('insiderTransactions', () => ticker.insiderTransactions()),
    callMethod('insiderHolders', () => ticker.insiderHolders()),
    callMethod('recommendations', () => ticker.recommendations()),
    callMethod('upgradesDowngrades', () => ticker.upgradesDowngrades()),
    callMethod('earningsEstimate', () => ticker.earningsEstimate()),
    callMethod('revenueEstimate', () => ticker.revenueEstimate()),
  ]);

  return results;
}
