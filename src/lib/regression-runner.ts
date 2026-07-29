import { search, marketSummary, Ticker, download } from "yfun-api";
import { compareSchemas, DiffResult } from "./schema-diff";

export interface RegressionReport {
  methodName: string;
  durationMs: number;
  diffs: DiffResult[];
  status: "PASS" | "FAIL" | "WARN" | "ERROR";
  errorMessage?: string;
}

export interface RegressionSuiteResult {
  timestamp: string;
  totalDurationMs: number;
  reports: RegressionReport[];
  status: "PASS" | "FAIL";
}

const TEST_SYMBOL = "AAPL";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function executeMethod(methodName: string): Promise<any> {
  switch (methodName) {
    case "search":
      return search(TEST_SYMBOL);
    case "marketSummary":
      return marketSummary();
    case "Ticker.info":
      return new Ticker(TEST_SYMBOL).info();
    case "Ticker.history":
      return new Ticker(TEST_SYMBOL).history({ period: "1mo", interval: "1d" });
    case "download":
      return download(TEST_SYMBOL, { period: "1mo", interval: "1d" });
    default:
      throw new Error(`Unknown method: ${methodName}`);
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function runRegressionSuite(snapshots: Record<string, any>): Promise<{ result: RegressionSuiteResult, newSnapshots: Record<string, any> }> {
  const methods = ["search", "marketSummary", "Ticker.info", "Ticker.history", "download"];
  const reports: RegressionReport[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const newSnapshots: Record<string, any> = {};
  
  const suiteStart = performance.now();
  let suitePass = true;

  for (const method of methods) {
    const start = performance.now();
    try {
      const liveData = await executeMethod(method);
      const durationMs = performance.now() - start;
      newSnapshots[method] = liveData;

      if (!snapshots[method]) {
        reports.push({
          methodName: method,
          durationMs,
          diffs: [],
          status: "WARN",
          errorMessage: "No baseline snapshot found for comparison. Snapshot created."
        });
        continue;
      }

      const diffs = compareSchemas(snapshots[method], liveData);
      
      const hasErrors = diffs.some(d => d.type === "REMOVED_FIELD" || d.type === "TYPE_MISMATCH");
      const hasWarnings = diffs.some(d => d.type === "NULL_VALUE" || d.type === "NEW_FIELD");
      
      let status: "PASS" | "FAIL" | "WARN" = "PASS";
      if (hasErrors) {
        status = "FAIL";
        suitePass = false;
      } else if (hasWarnings) {
        status = "WARN";
      }

      reports.push({
        methodName: method,
        durationMs,
        diffs,
        status
      });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      reports.push({
        methodName: method,
        durationMs: performance.now() - start,
        diffs: [],
        status: "ERROR",
        errorMessage: e.message
      });
      suitePass = false;
    }
  }

  const suiteResult: RegressionSuiteResult = {
    timestamp: new Date().toISOString(),
    totalDurationMs: performance.now() - suiteStart,
    reports,
    status: suitePass ? "PASS" : "FAIL"
  };

  return { result: suiteResult, newSnapshots };
}

export function generateMarkdownReport(result: RegressionSuiteResult): string {
  let md = `# yfun-api API Regression Report\n\n`;
  md += `**Timestamp:** ${result.timestamp}\n`;
  md += `**Status:** ${result.status === "PASS" ? "✅ PASS" : "❌ FAIL"}\n`;
  md += `**Duration:** ${result.totalDurationMs.toFixed(0)}ms\n\n`;

  for (const report of result.reports) {
    const icon = report.status === "PASS" ? "✅" : report.status === "WARN" ? "⚠️" : "❌";
    md += `## ${icon} ${report.methodName} (${report.durationMs.toFixed(0)}ms)\n\n`;
    
    if (report.errorMessage) {
      md += `**Error:** ${report.errorMessage}\n\n`;
      continue;
    }

    if (report.diffs.length === 0) {
      if (report.status === "WARN") {
        md += `*No diffs. Warning state.*\n\n`;
      } else {
        md += `*No schema drift detected.*\n\n`;
      }
      continue;
    }

    md += `| Path | Type | Message |\n`;
    md += `|---|---|---|\n`;
    for (const d of report.diffs) {
      md += `| \`${d.path}\` | ${d.type} | ${d.message} |\n`;
    }
    md += `\n`;
  }

  return md;
}

export function generateHtmlReport(result: RegressionSuiteResult): string {
  // Simple HTML structure
  let html = `<html><head><title>Regression Report</title><style>body { font-family: sans-serif; } .PASS { color: green; } .FAIL { color: red; } .WARN { color: orange; } table { border-collapse: collapse; width: 100%; } th, td { border: 1px solid #ddd; padding: 8px; }</style></head><body>`;
  html += `<h1>yfun-api API Regression Report</h1>`;
  html += `<p><strong>Status:</strong> <span class="${result.status}">${result.status}</span></p>`;
  html += `<p><strong>Date:</strong> ${result.timestamp}</p>`;

  for (const report of result.reports) {
    html += `<h2><span class="${report.status}">[${report.status}]</span> ${report.methodName}</h2>`;
    if (report.errorMessage) html += `<p>${report.errorMessage}</p>`;
    
    if (report.diffs.length > 0) {
      html += `<table><tr><th>Path</th><th>Type</th><th>Message</th></tr>`;
      for (const d of report.diffs) {
        html += `<tr><td>${d.path}</td><td>${d.type}</td><td>${d.message}</td></tr>`;
      }
      html += `</table>`;
    } else {
      html += `<p>No schema drift detected.</p>`;
    }
  }
  html += `</body></html>`;
  return html;
}
