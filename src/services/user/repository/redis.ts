import {createClient} from 'redis';
import {logger} from "../../../app/logger";

const AuthLoginAttemptsCntKeyPrefix = "auth:login:attempts-cnt:"

const client = createClient({
    url: process.env.REDIS_HOST || "localhost:6379",
});

(async () => {
    await client.on('error', (err) => {
        logger.error(err);
    }).on('connect', () => {
        logger.info('Redis connected');
    }).connect();
})();

export const increaseLoginFailedCount = async (username: string) => {
    const key = AuthLoginAttemptsCntKeyPrefix + username
    await client.incr(key)
    await client.expire(key, 5 * 60)
};

export const getLoginFailedCount = async (username: string) => {
    const str = await client.get(AuthLoginAttemptsCntKeyPrefix + username)
    return str ? parseInt(str) : 0
};

export const resetLoginFailedCount = async (username: string) => {
    await client.del(AuthLoginAttemptsCntKeyPrefix + username)
};

export default {
    increaseLoginFailedCount,
    getLoginFailedCount
}
