import test from "node:test";
import assert from "node:assert";
import { getServer } from "../helper";
import { version } from "../../package.json";

test("version decorator", async (t) => {
  const server = await getServer(t);

  assert.strictEqual(server.version, version);
});
