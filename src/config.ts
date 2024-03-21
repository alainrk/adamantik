export interface Config {
  env: string;
  port: number;
  host: string;
  logLevel: string;
  auth?: {
    provider: string;
    clientId: string;
    clientSecret: string;
  };
}

export const getConfig = (): Config => {
  const config: Config = {
    env: process.env.ENVIRONMENT || "development",
    port: parseInt(process.env.PORT || "3000", 10),
    host: process.env.HOST || "localhost",
    logLevel: process.env.LOG_LEVEL || "trace",
  };

  const provider = process.env.AUTH_PROVIDER || "google";
  if (provider === "google") {
    config.auth = {
      provider,
      clientId: process.env.GOOGLE_AUTH_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET || "",
    };
  }
  return config;
};
