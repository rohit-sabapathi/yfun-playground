"use server"

import fs from "fs";
import path from "path";
import { runRegressionSuite, RegressionSuiteResult, generateMarkdownReport, generateHtmlReport } from "@/lib/regression-runner";

const SNAPSHOTS_FILE = path.join(process.cwd(), "snapshots", "yfun-api-baseline.json");

export async function runRegressionAction(): Promise<RegressionSuiteResult> {
  let snapshots = {};
  if (fs.existsSync(SNAPSHOTS_FILE)) {
    snapshots = JSON.parse(fs.readFileSync(SNAPSHOTS_FILE, "utf-8"));
  }

  const { result } = await runRegressionSuite(snapshots);
  return result;
}

export async function updateSnapshotsAction(): Promise<void> {
  // To update snapshots, we run the suite with an empty baseline, which forces it to fetch new data
  const { newSnapshots } = await runRegressionSuite({});
  
  if (!fs.existsSync(path.dirname(SNAPSHOTS_FILE))) {
    fs.mkdirSync(path.dirname(SNAPSHOTS_FILE), { recursive: true });
  }

  fs.writeFileSync(SNAPSHOTS_FILE, JSON.stringify(newSnapshots, null, 2), "utf-8");
}

export async function generateReportsAction(result: RegressionSuiteResult): Promise<{ md: string, html: string, json: string }> {
  return {
    md: generateMarkdownReport(result),
    html: generateHtmlReport(result),
    json: JSON.stringify(result, null, 2)
  };
}
