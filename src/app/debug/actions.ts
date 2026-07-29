/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import { requestManager } from "yfun-api";
export interface RequestLog {
  id: string;
  url: string;
  method: string;
  status: number;
  requestHeaders: Record<string, string>;
  responseHeaders: Record<string, string>;
  cookie: string | null;
  crumb: string | null;
  retries: number;
  retryTimeline: { attempt: number; delay: number; error: string }[];
  cacheHit: boolean;
  payload: any;
  response: any;
  responseSize: number;
  executionTime: number;
  timestamp: string;
}

export async function getDebugLogs(): Promise<RequestLog[]> {
  // Return a cloned version to avoid client mutation issues
  return JSON.parse(JSON.stringify(requestManager.requestLogs));
}

export async function clearDebugLogs(): Promise<void> {
  requestManager.clearLogs();
}
