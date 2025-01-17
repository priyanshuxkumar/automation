import { createClient } from "redis";

const redisClient = createClient(); 
redisClient.on('error', (err:any) => console.log('Redis Client Error', err)); 

redisClient.connect()
  .then(() => console.log('Connected to Redis'))
  .catch((err:any) => console.log('Failed to connect to Redis', err));


export {redisClient}