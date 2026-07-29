/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-require-imports */
"use server"

export async function testServerAction() {
  const start = performance.now();
  try {
    const { Ticker } = await import("yfun-api");
    const ticker = new Ticker("AAPL");
    await ticker.info();
    const end = performance.now();
    return { success: true, duration: end - start };
  } catch (e: any) {
    const end = performance.now();
    return { success: false, error: e.message, duration: end - start };
  }
}

export async function testDynamicImport() {
  const start = performance.now();
  try {
    const yfunApi = await import("yfun-api");
    const ticker = new yfunApi.Ticker("AAPL");
    await ticker.info();
    const end = performance.now();
    return { success: true, duration: end - start };
  } catch (e: any) {
    const end = performance.now();
    return { success: false, error: e.message, duration: end - start };
  }
}

export async function testCommonJS() {
  const start = performance.now();
  try {
    // In Next.js App router (which uses webpack/turbopack), require may be polyfilled or aliased,
    // but it still executes the CJS export path if configured correctly.
    const yfunApi = require("yfun-api");
    const ticker = new yfunApi.Ticker("AAPL");
    await ticker.info();
    const end = performance.now();
    return { success: true, duration: end - start };
  } catch (e: any) {
    const end = performance.now();
    return { success: false, error: e.message, duration: end - start };
  }
}
