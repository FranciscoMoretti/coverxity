import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type QueryResponse = {
  queries: string[];
};

export async function generateImageQueries(title: string): Promise<string[]> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
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
        content: `You are an expert at generating search terms for finding article cover images. Return a response with 5 search terms that would make good cover images for the article title. 

        The query is to search images on Pexels.com. Pexels documentation explains: query could be something broad like Nature, Tigers, People. Or it could be something specific like Group of people working.
        
        Guidelines:
        1. Understand the article title and brainstorm related concepts.
        2. Return 5 search terms that would lead to images that are relevant to the article.
        3. Some search terms should be specific and not too broad.
        4. The search terms should be broad enough to find relevant images.

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
