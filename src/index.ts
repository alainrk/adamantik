import { Prisma, PrismaClient } from "@prisma/client";
import fastify from "fastify";

const prisma = new PrismaClient();
const app = fastify({ logger: true });

app.get("/ping", async (req, res) => {
  return { ping: "pong" };
});

app.listen({ port: 3000 }, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`🚀 Server ready at: http://localhost:3000`);
});
