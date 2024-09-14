/* eslint-disable no-console */
import { Server } from "http";
import mongoose from "mongoose";
import app from "./app.js";
import { errorlogger, logger } from "./shared/logger.js";
import { RedisClient } from "./shared/redis.js";
import config from "./config/index.js";
process.on("uncaughtException", (error) => {
  errorlogger.error(error);
  process.exit(1);
});

let server;

async function bootstrap() {
  try {
    await RedisClient.connect();
    await mongoose.connect(config.database_url);
    logger.info(`🛢 Database is connected successfully`);

    server = app.listen(config.port, () => {
      logger.info(`Application  listening on port ${config.port}`);
    });
  } catch (err) {
    errorlogger.error("Failed to connect database", err);
  }

  process.on("unhandledRejection", (error) => {
    if (server) {
      server.close(() => {
        errorlogger.error(error);
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  });
}

bootstrap();

// RedisClient.redisClient.on('connect', () => {
//   client.psubscribe('events.*', (err, pattern, channels) => {
//     if (err) {
//       console.error('Error getting channels:', err);
//       return;
//     }

//     console.log('Channels:', channels);
//   });
// });

process.on("SIGTERM", () => {
  logger.info("SIGTERM is received");
  if (server) {
    server.close();
  }
});
