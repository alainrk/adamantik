// Import node test runner
import { beforeEach, it, describe, afterEach } from "node:test";
import { strictEqual, deepStrictEqual } from "node:assert";
import fastify, { FastifyInstance } from "fastify";
import dotenv from "dotenv";
import buildServer from "./server";
import { Config, getConfig } from "./config";

dotenv.config({
  path: ".env.test",
});

describe("Server initialization", () => {
  let app: FastifyInstance;

  beforeEach(async () => {
    app = await buildServer(getConfig());
  });
  afterEach(async () => {
    app.close();
  });

  it("should start the server", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/status",
    });

    strictEqual(response.statusCode, 200);
    deepStrictEqual(response.json(), { status: "OK", env: app.config.env });
  });
});
