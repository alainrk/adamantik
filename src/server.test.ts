// Import node test runner
import { beforeEach, it, describe, afterEach, expect, vi } from "vitest";
import { FastifyInstance } from "fastify";
import dotenv from "dotenv";
import buildServer from "./server";
import { getConfig } from "./config";
import prisma from "./libs/__mocks__/prisma";

dotenv.config({
  path: ".env.test",
});

vi.mock("./libs/prisma");

describe("Server", () => {
  let app: FastifyInstance;

  beforeEach(async () => {
    prisma.user.findFirst.mockResolvedValueOnce({
      id: 1,
      name: "Test",
      email: "asd@qwerty.com",
      provider: "google",
      providerIdToken: "123",
      createdAt: new Date(),
      providerAccessToken: "123",
    });
    app = await buildServer(getConfig(), prisma);
  });
  afterEach(async () => {
    app.close();
  });

  it("should check correct status server", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/status",
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ status: "OK", env: app.config.env });
  });

  it("should return correct status DB", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/status/db",
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ status_db: "OK" });
  });

  // it("should fail for not authenticated user", async () => {
  //   const response = await app.inject({
  //     method: "GET",
  //     url: "/users",
  //   });

  //   expect(response.statusCode).toBe(401);
  // });
});
