import { search, Ticker } from "yfun-api";

export default async function DemoEMultiple() {
  const results = await search("AAPL");
  const ticker = new Ticker("AAPL");
  const info = await ticker.info();
  
  return (
    <div>
      <h1>Importing Multiple</h1>
      <pre>{JSON.stringify({ search: results, info }, null, 2)}</pre>
    </div>
  )
}
