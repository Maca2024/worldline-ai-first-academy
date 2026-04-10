/**
 * In-memory sliding window rate limiter.
 *
 * Suitable for single-instance deployments (Vercel serverless functions
 * reset state per cold start, so this is best-effort protection).
 * For multi-instance production: replace with Upstash Redis.
 */

interface RateLimitRecord {
  timestamps: number[];
}

const store = new Map<string, RateLimitRecord>();

export interface RateLimitOptions {
  /** Max allowed requests within the window */
  limit: number;
  /** Window duration in milliseconds */
  windowMs: number;
}

export interface RateLimitResult {
  success: boolean;
  /** Remaining requests in current window */
  remaining: number;
  /** Seconds until window resets */
  retryAfterSeconds: number;
}

export function rateLimit(key: string, options: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  const windowStart = now - options.windowMs;

  let record = store.get(key);

  if (!record) {
    record = { timestamps: [] };
    store.set(key, record);
  }

  // Prune timestamps outside the window
  record.timestamps = record.timestamps.filter((t) => t > windowStart);

  if (record.timestamps.length >= options.limit) {
    const oldestInWindow = record.timestamps[0];
    const retryAfterMs = oldestInWindow + options.windowMs - now;

    return {
      success: false,
      remaining: 0,
      retryAfterSeconds: Math.ceil(retryAfterMs / 1000),
    };
  }

  record.timestamps.push(now);

  return {
    success: true,
    remaining: options.limit - record.timestamps.length,
    retryAfterSeconds: 0,
  };
}

/** Extract a rate limit key from a Request (IP + optional userId). */
export function getRateLimitKey(request: Request, suffix = ''): string {
  const ip =
    request.headers.get('x-real-ip') ??
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    'unknown';

  return suffix ? `${ip}:${suffix}` : ip;
}
