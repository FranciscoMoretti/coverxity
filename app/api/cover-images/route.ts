import { generateImageQueries } from "@/utils/queries";
import { searchImages } from "@/utils/pexels";
import { rerank } from "@/utils/reranker";
import { NextResponse } from "next/server";
import { Photo } from "pexels";
import { z } from "zod";
import { headers } from "next/headers";
import { rateLimit } from "@/utils/rate-limiter";
import { shouldUseRateLimit } from "@/utils/shouldUseRateLimit";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.KV_REST_API_URL || "",
  token: process.env.KV_REST_API_TOKEN || "",
});

// Cache TTL in seconds (24 hours)
const CACHE_TTL = 24 * 60 * 60;

export const returnSchema = z.object({
  queries: z.array(z.string()).min(1),
  results: z.record(
    z.string(),
    z.array(z.any()).transform((val): Photo[] => val)
  ),
});

export type ReturnSchema = z.infer<typeof returnSchema>;

export async function POST(
  request: Request
): Promise<NextResponse<ReturnSchema | { error: string }>> {
  try {
    const { title } = await request.json();

    // Check cache first
    const cacheKey = `coverxity:results:${encodeURIComponent(
      title.toLowerCase()
    )}`;
    const cachedResults = await redis.get<ReturnSchema>(cacheKey);

    if (cachedResults) {
      return NextResponse.json(cachedResults);
    }

    if (shouldUseRateLimit()) {
      const forwardedFor = headers().get("x-forwarded-for");
      const ip = forwardedFor?.split(",")[0] || "127.0.0.1";

      const { success, limit, remaining, reset } = await rateLimit(ip);

      if (!success) {
        return NextResponse.json(
          {
            error: "Rate limit exceeded. Try again later.",
          },
          {
            status: 429,
            headers: {
              "X-RateLimit-Limit": limit.toString(),
              "X-RateLimit-Remaining": remaining.toString(),
              "X-RateLimit-Reset": reset.toString(),
            },
          }
        );
      }
    }

    // Generate search queries
    const queries = await generateImageQueries(title);
    console.log("Queries: ", queries);

    // To eval queries return here
    // return NextResponse.json({ queries, results: {} });

    // Get images for each query
    const imageResults = await Promise.all(
      queries.map(async (query) => ({
        query,
        images: await searchImages(query),
      }))
    );

    // Flatten all images for reranking
    const allImages = imageResults.flatMap((result) => result.images);
    const uniqueImages = Array.from(
      new Map(allImages.map((img) => [img.id, img])).values()
    );

    // Get scores for all images
    const rankedImages = await rerank(uniqueImages, title);

    // Create a map of image id to score
    const scoreMap = new Map(
      rankedImages.map((img, idx) => [img.id, rankedImages.length - idx])
    );

    // Sort queries by their best image score
    const sortedQueries = [...imageResults]
      .map((result) => ({
        query: result.query,
        maxScore: Math.max(
          ...result.images.map((img) => scoreMap.get(img.id) || 0)
        ),
      }))
      .sort((a, b) => b.maxScore - a.maxScore)
      .map((result) => result.query);

    // Create results object with images sorted by score within each query
    const results = Object.fromEntries(
      imageResults.map(({ query, images }) => [
        query,
        images.sort(
          (a, b) => (scoreMap.get(b.id) || 0) - (scoreMap.get(a.id) || 0)
        ),
      ])
    );

    const response = {
      queries: sortedQueries,
      results,
    };

    // Cache the results
    await redis.set(cacheKey, response, { ex: CACHE_TTL });

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error generating cover images:", error);
    return NextResponse.json(
      { error: "Failed to generate cover images" },
      { status: 500 }
    );
  }
}
