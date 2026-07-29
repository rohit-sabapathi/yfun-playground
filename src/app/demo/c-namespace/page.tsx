import * as yfun-api from "yfun-api";

export default async function DemoCNamespace() {
  const ticker = new yfun-api.Ticker("AAPL");
  const info = await ticker.info();
  
  return (
    <div>
      <h1>Importing Namespace (yfun-api.*)</h1>
      <pre>{JSON.stringify(info, null, 2)}</pre>
    </div>
  )
}
