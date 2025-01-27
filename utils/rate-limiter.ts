import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.KV_REST_API_URL || "",
  token: process.env.KV_REST_API_TOKEN || "",
});

export const MAX_REQUESTS_PER_DAY = 5;

export const rateLimiter = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(MAX_REQUESTS_PER_DAY, "1 d"),
  analytics: true,
  prefix: "ratelimit:coverxity:search",
});

export const rateLimit = async (identifier: string) => {
  const { success, limit, remaining, reset } = await rateLimiter.limit(
    identifier
  );
  return { success, limit, remaining, reset };
};

export async function remainingRequests(identifier: string) {
  const { remaining } = await rateLimiter.getRemaining(identifier);
  return remaining;
}
