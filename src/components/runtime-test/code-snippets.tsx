"use client"

import { useState } from "react"
import { Code2 } from "lucide-react"

export function CodeSnippets() {
  const [activeTab, setActiveTab] = useState<"esm" | "cjs" | "dynamic" | "tree">("esm");

  const tabs = [
    { id: "esm", label: "ESM (Import)" },
    { id: "cjs", label: "CommonJS (Require)" },
    { id: "dynamic", label: "Dynamic Import" },
    { id: "tree", label: "Tree Shaking" }
  ];

  const snippets = {
    esm: `// ✅ Standard ESM Import (Recommended for Next.js)
import { Ticker } from 'yfun-api';

async function fetchAppleData() {
  const aapl = new Ticker('AAPL');
  const info = await aapl.info();
  console.log(info.longName);
}`,
    cjs: `// ✅ CommonJS Require (For older Node.js scripts)
const { Ticker } = require('yfun-api');

async function fetchAppleData() {
  const aapl = new Ticker('AAPL');
  const info = await aapl.info();
  console.log(info.longName);
}`,
    dynamic: `// ✅ Dynamic Import (For client-side lazy loading)
async function fetchAppleData() {
  const { Ticker } = await import('yfun-api');
  const aapl = new Ticker('AAPL');
  const info = await aapl.info();
  console.log(info.longName);
}`,
    tree: `// 🌳 Tree Shaking Best Practices
// yfun-api exports all modules at the top level.
// Modern bundlers (Webpack, Turbopack, Rollup) will automatically 
// eliminate unused modules when you import specific named exports.

import { search, Ticker } from 'yfun-api';

// In this file, only 'search' and 'Ticker' are bundled.
// 'Tickers', 'screener', 'marketSummary', etc. are tree-shaken away.`
  };

  return (
    <div className="bg-[#0d1117] border border-white/5 rounded-xl overflow-hidden flex flex-col mt-8">
      <div className="bg-[#161b22] px-6 py-4 border-b border-white/5 flex items-center gap-3">
        <Code2 className="w-5 h-5 text-primary" />
        <h2 className="font-semibold text-lg">Code Snippets & Usage</h2>
      </div>
      
      <div className="flex border-b border-white/5 px-2 pt-2 bg-[#161b22]/50">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as "esm" | "cjs" | "dynamic" | "tree")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id 
                ? "border-primary text-primary" 
                : "border-transparent text-muted-foreground hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      <div className="p-6 overflow-x-auto text-sm text-mono">
        <pre className="text-gray-300 font-mono leading-relaxed">
          <code dangerouslySetInnerHTML={{
            __html: snippets[activeTab]
              .replace(/\/\/.*/g, match => `<span class="text-green-400 opacity-80">${match}</span>`)
              .replace(/import|from|const|require|async|await|function|new/g, match => `<span class="text-blue-400">${match}</span>`)
              .replace(/['"`](.*?)['"`]/g, match => `<span class="text-yellow-300">${match}</span>`)
          }} />
        </pre>
      </div>
    </div>
  )
}
