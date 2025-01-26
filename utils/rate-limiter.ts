import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";

export const rateLimiter = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(5, "1 d"),
  analytics: true,
  prefix: "@upstash/ratelimit-coverxity",
});

export const getRateLimitInfo = async (identifier: string) => {
  const { success, limit, remaining, reset } = await rateLimiter.limit(
    identifier
  );
  return { success, limit, remaining, reset };
};
