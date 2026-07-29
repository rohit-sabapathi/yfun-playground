# yfun-api Test Playground

A comprehensive Next.js application designed to test, validate, and demonstrate the capabilities of the **[`yfun-api`](https://www.npmjs.com/package/yfun-api)** package.

`yfun-api` is a robust, native TypeScript implementation of the popular Python `yfinance` library, requiring zero Python dependencies and fully supporting modern JavaScript runtimes (Node, Edge, Next.js, Cloudflare Workers, Deno, Bun). This repository serves as both a playground and an extensive automated test suite for the library.

## 🚀 Features

This application includes a suite of tools to interact with Yahoo Finance data using `yfun-api`:

- **📈 Explorer:** Browse comprehensive financial data, including market caps, current pricing, and key statistics for any ticker.
- **📊 Historical Data:** Interactive charts rendering historical price movements, supporting various periods (1d, 1mo, 1y, max) and intervals (1m, 1d, 1wk).
- **📋 Financials & Options:** View detailed income statements, balance sheets, cash flows, and full options chains (Calls & Puts).
- **🐞 Advanced Debug UI:** An interactive interceptor that monitors every HTTP request made by `yfun-api`, displaying headers, cookies, crumbs, cache hits, and execution times.
- **⚡ Stress Testing:** Perform bulk data fetching to validate network resilience, automatic rate-limit (429) backoffs, and concurrent connection handling.
- **🔄 Regression Suite:** A CI-ready regression testing page that compares live API responses against historical JSON snapshots. It automatically highlights schema changes, new fields, or missing data from Yahoo Finance.
- **🛠 Runtime Compatibility:** Validates the library's compatibility across both Next.js Node.js and Edge runtimes, testing server actions, dynamic imports, and static generation.

## 🛠 Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Components:** React Hook Form, Lucide React, Recharts
- **Core Library:** `yfun-api`

## 📦 Installation

Clone the repository and install the dependencies using your preferred package manager:

```bash
# Clone the repository
git clone https://github.com/rohit-sabapathi/yfun-playground.git
cd yfun-playground

# Install dependencies
npm install
```

## 🏃‍♂️ Running Locally

Start the Next.js development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## 🧪 Testing

Run the regression suite to ensure API schema parity with Yahoo Finance:

```bash
npm run test:regression
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
