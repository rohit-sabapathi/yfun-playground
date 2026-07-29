import { download } from "yfun-api";

export default async function DemoBDownload() {
  const data = await download("AAPL");
  
  return (
    <div>
      <h1>Importing Download Only</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}
