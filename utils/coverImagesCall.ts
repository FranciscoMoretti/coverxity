import { ReturnSchema } from "@/app/api/cover-images/route";

export async function getCoverImages(title: string): Promise<ReturnSchema> {
  const response = await fetch("/api/cover-images", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title }),
  });

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error("Rate limit exceeded. Please try again tomorrow.");
    }
    throw new Error("Failed to fetch cover images");
  }

  return response.json();
}
