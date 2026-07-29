import { Ticker } from "yfun-api";

export default async function DemoATicker() {
  const ticker = new Ticker("AAPL");
  const info = await ticker.info();
  
  return (
    <div>
      <h1>Importing Ticker Only</h1>
      <pre>{JSON.stringify(info, null, 2)}</pre>
    </div>
  )
}
