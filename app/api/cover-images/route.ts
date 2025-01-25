import { generateImageQueries } from '@/utils/openai';
import { searchImages } from '@/utils/pexels';
import { NextResponse } from 'next/server';

import { z } from 'zod';

export const returnSchema = z.object({
  queries: z.array(z.string()).min(1),
  results: z.record(z.string(), z.array(z.string())),
})

export type ReturnSchema = z.infer<typeof returnSchema>;

export async function POST(request: Request) : Promise<NextResponse<ReturnSchema | { error: string }>> {
  try {
    const { title } = await request.json();
    
    // Generate search queries
    const queries = await generateImageQueries(title);
    
    // Search images for each query
    const imageResults = await Promise.all(
      queries.map(async (query) => ({
        query,
        images: await searchImages(query)   
      }))       
    );

    const returnData: ReturnSchema = {      
      queries,
      results: imageResults.reduce((acc, { query, images }) => {
        // TODO: Consider returning the whole image object
        acc[query] = images.map((image) => image.src.original);
        return acc;
      }, {} as Record<string, string[]>)
    };

    return NextResponse.json(returnData);

  } catch (error) {
    console.error('Error generating cover images:', error);
    return NextResponse.json(
      { error: 'Failed to generate cover images' },
      { status: 500 }
    );
  }
} 