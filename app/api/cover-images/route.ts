import { generateImageQueries } from "@/utils/queries";
import { searchImages } from "@/utils/pexels";
import { rerank } from "@/utils/reranker";
import { NextResponse } from "next/server";
import { Photo } from "pexels";
import { z } from "zod";
import { headers } from "next/headers";
import { getRateLimitInfo } from "@/utils/rate-limiter";

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
    // Get IP for rate limiting
    const forwardedFor = headers().get("x-forwarded-for");
    const ip = forwardedFor?.split(",")[0] || "127.0.0.1";

    // Check rate limit
    const { success, limit, remaining, reset } = await getRateLimitInfo(ip);

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

    const { title } = await request.json();

    // Generate search queries
    const queries = await generateImageQueries(title);
    console.log("Queries: ", queries);

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

    return NextResponse.json({
      queries: sortedQueries,
      results,
    });
  } catch (error) {
    console.error("Error generating cover images:", error);
    return NextResponse.json(
      { error: "Failed to generate cover images" },
      { status: 500 }
    );
  }
}
