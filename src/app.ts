import dotenv from "dotenv";

import buildServer from "./server";
import { getConfig } from "./config";
import prisma from "./libs/prisma";

dotenv.config();

async function main() {
  const config = getConfig();
  const app = await buildServer(config, prisma);

  app.listen({ host: config.host, port: config.port }, (err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`🚀 Server ready at: http://${config.host}:${config.port}`);
  });
}

main();
