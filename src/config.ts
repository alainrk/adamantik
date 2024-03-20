export interface Config {
  env: string;
  port: number;
  logLevel: string;
  auth: {
    google: {
      clientId: string;
      clientSecret: string;
    };
  };
}

export const getConfig = (): Config => {
  return {
    env: process.env.ENVIRONMENT || "development",
    port: parseInt(process.env.PORT || "3000", 10),
    logLevel: process.env.LOG_LEVEL || "trace",
    auth: {
      google: {
        clientId: process.env.GOOGLE_AUTH_CLIENT_ID || "",
        clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET || "",
      },
    },
  };
};
