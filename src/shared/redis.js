/* eslint-disable no-console */
import { createClient } from 'redis';
import config from '../config/index.js';

const redisClient = createClient({
  url: config.redis_uri,
});
const redisPubClient = createClient({
  url: config.redis_uri,
});
const redisSubClient = createClient({
  url: config.redis_uri,
});

redisClient.on('error', error => console.log('Redis error: ', error));

redisClient.on('connect', () => console.log('Redis successfully connected'));

const connect = async () => {
  await redisClient.connect();
  await redisPubClient.connect();
  await redisSubClient.connect();
};

export const RedisClient = {
  connect,
  redisClient,
  publish: redisPubClient.publish.bind(redisPubClient),
  subscribe: redisSubClient.subscribe.bind(redisSubClient),
};
