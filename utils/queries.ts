import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type QueryResponse = {
  queries: string[];
};

export async function generateImageQueries(title: string): Promise<string[]> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "image_queries",
        strict: true,
        schema: {
          type: "object",
          properties: {
            queries: {
              type: "array",
              items: { type: "string" },
              description:
                "Array of 5 search terms for finding article cover images",
            },
          },
          required: ["queries"],
          additionalProperties: false,
        },
      },
    },
    messages: [
      {
        role: "system",
        content: `You are a professional stock photographer specializing in Pexels image search. Generate 5 search terms that will find high-quality stock photos on Pexels.com for this article title.

        Guidelines:
        - Include both literal and metaphorical terms
        - Use words from the title to form most search terms
        - Prioritize terms that match Pexels' strengths.
        - Avoid:
          * Abstract concepts
          * Technical jargon
          * Overly niche terms that will throw no results
          * Very generic terms that will apply to anything
        `,
      },
      {
        role: "user",
        content: `Generate image search terms for article titled: "${title}"`,
      },
    ],
    functions: [
      {
        name: "get_image_queries",
        parameters: {
          type: "object",
          properties: {
            queries: {
              type: "array",
              items: { type: "string" },
              description:
                "Array of 5 search terms for finding article cover images",
            },
          },
          required: ["queries"],
        },
      },
    ],
    function_call: { name: "get_image_queries" },
  });

  const queryResponse = JSON.parse(
    response.choices[0].message.function_call?.arguments || "{}"
  ) as QueryResponse;
  return queryResponse.queries;
}
