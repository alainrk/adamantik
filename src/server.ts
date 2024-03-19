import fastify from "fastify";

import prisma from "./plugins/prisma";
import users from "./routes/users";

const envToLogger = {
  development: {
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname",
      },
    },
  },
  production: true,
  test: false,
};

const app = fastify({
  // TODO: Config setup including env
  logger: envToLogger["development"],
});

app.register(prisma);
app.register(users);

app.get("/status", async (req, res) => {
  return { status: "OK" };
});

app.listen({ port: 3000 }, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`🚀 Server ready at: http://localhost:3000`);
});
