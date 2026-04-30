import Redis from 'ioredis'
import 'dotenv/config'

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: 3,
  lazyConnect: false,
  enableReadyCheck: true,
})

redis.on('connect', () => {
  if (process.env.NODE_ENV !== 'production') {
    console.log('✅ Redis connected')
  }
})

redis.on('error', (err) => {
  console.error('❌ Redis error:', err.message)
})

/**
 * Blacklist a JWT (used on logout / token rotation).
 * TTL should match the token's remaining lifetime in seconds.
 */
export const blacklistToken = (jti, ttlSeconds) =>
  redis.set(`bl:${jti}`, '1', 'EX', ttlSeconds)

export const isBlacklisted = async (jti) => {
  const val = await redis.get(`bl:${jti}`)
  return val === '1'
}

/**
 * Generic cache helpers.
 */
export const cacheSet = (key, value, ttlSeconds) =>
  redis.set(key, JSON.stringify(value), 'EX', ttlSeconds)

export const cacheGet = async (key) => {
  const raw = await redis.get(key)
  return raw ? JSON.parse(raw) : null
}

export const cacheDel = (key) => redis.del(key)

export default redis
