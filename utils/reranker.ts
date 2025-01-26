import { OpenAI } from "openai";
import { Photo } from "pexels";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function rerank(images: Photo[], title: string): Promise<Photo[]> {
  // Prepare data for scoring
  const imageData = images.map((img) => ({
    id: img.id,
    alt: img.alt || "",
    // likes: img.liked || 0,
  }));

  // Get scores from OpenAI
  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content:
          "You are a photo curator choosing an article cover image. Score each image's relevance to the given title from 0-100. Return the scores in an array in the same order as the images array.",
      },
      {
        role: "user",
        content: `Title: "${title}"\nImages: ${JSON.stringify(
          imageData,
          null,
          2
        )}`,
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "scores",
        strict: true,
        schema: {
          type: "object",
          properties: {
            scores: {
              type: "array",
              items: { type: "integer" },
              description: "Array of scores for each image from 0-100",
            },
          },
          additionalProperties: false,
          required: ["scores"],
        },
      },
    },
  });

  const content = completion.choices[0].message.content;
  if (!content) throw new Error("No response from OpenAI");

  const response = JSON.parse(content) as { scores: number[] };
  const scores = response.scores;

  // Create a map of id to score for easy lookup
  const scoreMap = new Map(scores.map((s, i) => [images[i].id, s]));

  // Sort images by score and likes
  return images.sort((a, b) => {
    const scoreA = (scoreMap.get(a.id) || 0) * 0.7;
    const scoreB = (scoreMap.get(b.id) || 0) * 0.7;
    const likesA = ((a as any).liked || 0) * 0.3;
    const likesB = ((b as any).liked || 0) * 0.3;

    const finalScoreA = scoreA + likesA;
    const finalScoreB = scoreB + likesB;

    return finalScoreB - finalScoreA;
  });
}
