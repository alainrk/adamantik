import test from "node:test";
import assert from "node:assert";
import { getServer } from "../helper";
import { version } from "../../package.json";

test("root", async (t) => {
  const server = await getServer(t);
  const res = await server.inject({
    method: "GET",
    url: "/healthcheck",
  });

  assert.strictEqual(res.statusCode, 200);
  assert.deepStrictEqual(res.json(), {
    version: version,
  });
});
