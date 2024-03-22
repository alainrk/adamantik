import { FastifyInstance } from "fastify";

// TODO: Implement healthcheck routes
export default async function healthcheck(app: FastifyInstance) {
  app.get("/status", async (req, res) => {
    return { status: "OK", env: app.config.env };
  });

  app.get("/status/db", async (req, res) => {
    // TODO: Implement better dummy call to check DB connection
    const user = await app.prisma.user.findFirst();
    console.log(user);
    if (user) {
      return { db_status: "OK" };
    }
    res.code(500).send({ db_status: "ERROR" });
  });

  app.get("/ready", async (req, res) => {
    return { status: "OK" };
  });
}
