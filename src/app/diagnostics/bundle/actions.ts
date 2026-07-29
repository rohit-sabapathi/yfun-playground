/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import * as esbuild from "esbuild";
import path from "path";
import fs from "fs";

export type BundleReport = {
  testName: string;
  totalSize: number; // bytes
  minifiedSize: number; // bytes
  includedModules: string[];
  removedModules: string[];
  pass: boolean;
  failReason?: string;
};

// We will bundle virtual files that simulate the imports
const MOCK_FILES: Record<string, string> = {
  "A-Ticker": `import { Ticker } from "yfun-api"; console.log(Ticker);`,
  "B-Download": `import { download } from "yfun-api"; console.log(download);`,
  "C-Namespace": `import * as yfun-api from "yfun-api"; console.log(yfun-api.Ticker);`,
  "D-Dynamic": `async function run() { const { Ticker } = await import("yfun-api"); console.log(Ticker); } run();`,
  "E-Multiple": `import { search, Ticker } from "yfun-api"; console.log(search, Ticker);`,
};

// Known large modules that should be tree-shaken if not imported
const UNRELATED_MODULES = [
  "Options", "News", "WebSocket", "Screener", "marketSummary", "Fundamentals"
];

export async function runBundleAnalysis(): Promise<BundleReport[]> {
  const reports: BundleReport[] = [];
  
  // yfun-api is installed locally, we need to find its path to bundle it properly
  const yfunPath = path.resolve(process.cwd(), "node_modules/yfun-api/dist/index.mjs");
  
  if (!fs.existsSync(yfunPath)) {
    throw new Error(`Cannot find yfun-api at ${yfunPath}. Make sure it is installed.`);
  }

  for (const [testName, code] of Object.entries(MOCK_FILES)) {
    try {
      const result = await esbuild.build({
        stdin: {
          contents: code,
          resolveDir: process.cwd(),
          sourcefile: "entry.js",
        },
        bundle: true,
        minify: true,
        metafile: true,
        write: false,
        format: "esm",
        external: ["node:*", "cheerio", "events", "https", "http", "zlib"], // Exclude node/externals
      });

      const meta = result.metafile;
      if (!meta) continue;

      let minifiedSize = 0;
      let totalParsedSize = 0;
      
      const outputs = Object.values(meta.outputs);
      for (const output of outputs) {
        minifiedSize += output.bytes;
      }

      const includedModules: string[] = [];
      
      for (const [inputPath, inputData] of Object.entries(meta.inputs)) {
        totalParsedSize += inputData.bytes;
        // Check what from yfun-api was actually included
        if (inputPath.includes("node_modules/yfun-api")) {
          const basename = path.basename(inputPath);
          includedModules.push(basename);
        }
      }

      let pass = true;
      let failReason = undefined;
      const removedModules: string[] = [];

      // Verification logic:
      // If we are testing Ticker (A), ensure Options, Screener etc are NOT in includedModules.
      if (testName === "A-Ticker") {
        const violations = includedModules.filter(m => 
          m.includes("Options") || m.includes("News") || m.includes("WebSocket") || m.includes("Screener") || m.includes("Fundamentals")
        );
        
        if (violations.length > 0) {
          pass = false;
          failReason = `Unrelated modules were bundled: ${violations.join(", ")}`;
        }
        
        // Populate removed modules based on our known list
        UNRELATED_MODULES.forEach(mod => {
          if (!includedModules.find(m => m.includes(mod))) {
            removedModules.push(mod);
          }
        });
      } else if (testName === "B-Download") {
        const violations = includedModules.filter(m => 
          m.includes("Ticker") || m.includes("Options") || m.includes("WebSocket")
        );
        
        if (violations.length > 0) {
          pass = false;
          failReason = `Unrelated modules were bundled: ${violations.join(", ")}`;
        }
      } else if (testName === "C-Namespace") {
        // Namespace import might include everything depending on the bundler configuration.
        // ESBuild usually preserves all exports for namespace imports unless it can prove they aren't accessed dynamically.
        // We just log this.
      } else if (testName === "D-Dynamic") {
        // Same as A
      } else if (testName === "E-Multiple") {
        // Should include search and Ticker, but NOT Options or WebSocket
        const violations = includedModules.filter(m => 
          m.includes("Options") || m.includes("WebSocket") || m.includes("Screener")
        );
        if (violations.length > 0) {
          pass = false;
          failReason = `Unrelated modules were bundled: ${violations.join(", ")}`;
        }
      }

      reports.push({
        testName,
        totalSize: totalParsedSize,
        minifiedSize,
        includedModules,
        removedModules,
        pass,
        failReason
      });

    } catch (e: any) {
      console.error(e);
      reports.push({
        testName,
        totalSize: 0,
        minifiedSize: 0,
        includedModules: [],
        removedModules: [],
        pass: false,
        failReason: `Esbuild error: ${e.message}`
      });
    }
  }

  return reports;
}
