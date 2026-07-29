import fs from "fs";
import path from "path";
import { runRegressionSuite, generateMarkdownReport } from "../src/lib/regression-runner";

const SNAPSHOTS_FILE = path.join(process.cwd(), "snapshots", "yfun-api-baseline.json");

async function main() {
  console.log("🚀 Starting yfun-api API Regression Suite...");
  
  if (!fs.existsSync(SNAPSHOTS_FILE)) {
    console.warn("⚠️ No snapshot file found. The suite will run, but cannot compare schemas.");
    console.warn("Please run 'npm run dev', go to /regression, and click 'Update Snapshots'.");
  }

  let snapshots = {};
  if (fs.existsSync(SNAPSHOTS_FILE)) {
    snapshots = JSON.parse(fs.readFileSync(SNAPSHOTS_FILE, "utf-8"));
  }

  const { result } = await runRegressionSuite(snapshots);

  console.log(`\n==============================================`);
  console.log(`🏁 Regression Suite Finished in ${result.totalDurationMs.toFixed(0)}ms`);
  console.log(`Status: ${result.status}`);
  console.log(`==============================================\n`);

  for (const report of result.reports) {
    const icon = report.status === "PASS" ? "✅" : report.status === "WARN" ? "⚠️" : "❌";
    console.log(`${icon} ${report.methodName} (${report.durationMs.toFixed(0)}ms)`);
    
    if (report.errorMessage) {
      console.log(`   Error: ${report.errorMessage}`);
    } else if (report.diffs.length > 0) {
      report.diffs.forEach(d => {
        const color = d.type === "REMOVED_FIELD" || d.type === "TYPE_MISMATCH" ? "\x1b[31m" : "\x1b[33m"; // Red for errors, Yellow for warnings
        console.log(`   ${color}[${d.type}]\x1b[0m ${d.path}: ${d.message} (Live: ${d.liveValue})`);
      });
    } else {
      console.log(`   No schema drift detected.`);
    }
  }

  // Generate markdown report for CI artifact
  const mdReport = generateMarkdownReport(result);
  fs.writeFileSync("regression-report.md", mdReport);
  console.log("\n📄 Saved markdown report to regression-report.md");

  if (result.status === "FAIL") {
    console.error("\n❌ Regression suite FAILED. Breaking changes detected.");
    process.exit(1); // Fail CI
  } else {
    console.log("\n✅ Regression suite PASSED.");
    process.exit(0);
  }
}

main().catch(e => {
  console.error("Unhandled error running regression suite:", e);
  process.exit(1);
});
