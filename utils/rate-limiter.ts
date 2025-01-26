import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.KV_REST_API_URL || "",
  token: process.env.KV_REST_API_TOKEN || "",
});

export const rateLimiter = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(5, "1 d"),
  analytics: true,
  prefix: "ratelimit:coverxity:search",
});

export const getRateLimitInfo = async (identifier: string) => {
  const { success, limit, remaining, reset } = await rateLimiter.limit(
    identifier
  );
  return { success, limit, remaining, reset };
};
