// Import node test runner
import { beforeEach, it, describe, afterEach, expect } from "vitest";
import { FastifyInstance } from "fastify";
import dotenv from "dotenv";
import buildServer from "./server";
import { getConfig } from "./config";

dotenv.config({
  path: ".env.test",
});

describe("Server", () => {
  let app: FastifyInstance;

  beforeEach(async () => {
    app = await buildServer(getConfig());
  });
  afterEach(async () => {
    app.close();
  });

  it("should return correct status", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/status",
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ status: "OK", env: app.config.env });
  });

  it("should fail for not authenticated user", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/users",
    });

    expect(response.statusCode).toBe(401);
  });
});
