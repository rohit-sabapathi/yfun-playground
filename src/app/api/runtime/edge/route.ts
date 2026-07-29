/* eslint-disable @typescript-eslint/no-explicit-any */
export const runtime = "edge";

import { Ticker } from "yfun-api";

export async function GET() {
  const start = performance.now();
  try {
    const ticker = new Ticker("AAPL");
    await ticker.info();
    const end = performance.now();
    return Response.json({ success: true, duration: end - start });
  } catch (e: any) {
    const end = performance.now();
    return Response.json({ success: false, error: e.message, duration: end - start }, { status: 500 });
  }
}
