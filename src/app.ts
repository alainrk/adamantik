import buildServer from "./server";
import { getConfig } from "./config";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  const config = getConfig();
  const app = await buildServer(config);

  app.listen({ port: 3000 }, (err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`🚀 Server ready at: http://localhost:3000`);
  });
}

main();