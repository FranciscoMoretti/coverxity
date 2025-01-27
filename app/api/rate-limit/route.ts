import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { MAX_REQUESTS_PER_DAY, remainingRequests } from "@/utils/rate-limiter";
import { shouldUseRateLimit } from "../../../utils/shouldUseRateLimit";

export async function GET() {
  if (shouldUseRateLimit()) {
    const forwardedFor = headers().get("x-forwarded-for");
    const ip = forwardedFor?.split(",")[0] || "127.0.0.1";
    const remaining = await remainingRequests(ip);

    return NextResponse.json(
      { limit: MAX_REQUESTS_PER_DAY, remaining, reset: 0 },
      {
        headers: {
          "X-RateLimit-Limit": MAX_REQUESTS_PER_DAY.toString(),
          "X-RateLimit-Remaining": remaining.toString(),
          "X-RateLimit-Reset": "0",
        },
      }
    );
  }

  return NextResponse.json({ limit: 0, remaining: 0, reset: 0 });
}
