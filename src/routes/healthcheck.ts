import { FastifyInstance } from "fastify";

// TODO: Implement healthcheck routes
export default async function healthcheck(app: FastifyInstance) {
  app.get("/status", async (req, res) => {
    return { status: "OK", env: app.config.env };
  });

  app.get("/ready", async (req, res) => {
    return { status: "OK" };
  });
}
