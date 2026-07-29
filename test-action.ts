import { fetchExplorerData } from "./src/app/explorer/actions.js";

async function test() {
  const result = await fetchExplorerData("AAPL");
  console.log(result.slice(0, 3));
}

test();
