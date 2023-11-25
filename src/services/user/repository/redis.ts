import { createClient } from 'redis';

const AuthLoginAttemptsCntKeyPrefix = "auth:login:attempts-cnt:"

const client = createClient();

(async () => {
  await client.on('error', (err) => {
    console.error(err);
  }).on('connect', () => {
    console.log('Redis connected');
  }).connect();
})();

export const increaseLoginFailedCount = async (username: string) => {
  const key = AuthLoginAttemptsCntKeyPrefix + username
  var setExpire = false
  if (!await client.exists(key)) {
    setExpire = true
  }
  await client.incr(AuthLoginAttemptsCntKeyPrefix + username)
  if (setExpire) {
    await client.expire(AuthLoginAttemptsCntKeyPrefix + username, 5 * 60)
  }
};

export const getLoginFailedCount = async (username: string) => {
  const str = await client.get(AuthLoginAttemptsCntKeyPrefix + username)
  return str? parseInt(str) : 0
};

export default {
  increaseLoginFailedCount,
  getLoginFailedCount
}
