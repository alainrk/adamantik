import test from "node:test";
import assert from "node:assert";
import { getServer } from "../helper";

test("status decorator", async (t) => {
  const server = await getServer(t);

  assert.strictEqual(server.status, "ok");
});
