export default async function DemoDDynamic() {
  const { Ticker } = await import("yfun-api");
  const ticker = new Ticker("AAPL");
  const info = await ticker.info();
  
  return (
    <div>
      <h1>Importing Dynamic</h1>
      <pre>{JSON.stringify(info, null, 2)}</pre>
    </div>
  )
}
