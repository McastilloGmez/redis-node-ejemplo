require('dotenv').config();
const redis = require('redis');

const client = redis.createClient({
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    }
});

client.connect();

const setRedis = async (key, value) => {
    let responseRedis = await client.set(key, value);
    return responseRedis
}

const getRedis = async (key) => {
    let responseRedis = await client.get(key);
    return responseRedis;
}

const hashSetRedis = async (key, newObject) => {
    let responseRedis = await client.hSet(key, newObject);
    return responseRedis;
}
