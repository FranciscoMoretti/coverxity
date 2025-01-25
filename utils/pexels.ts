import { createClient, Photo, ErrorResponse } from 'pexels';

const client = createClient(process.env.PEXELS_API_KEY!);

export async function searchImages(query: string): Promise<Photo[]> {
  const response = await client.photos.search({ 
    query,
    per_page: 5,
    orientation: 'landscape'
  });

  // Handle error case
  if (typeof response === 'object' && 'error' in response) {
    console.error('Pexels API error:', response.error);
    throw new Error('Failed to fetch images from Pexels');
  }
  
  return response.photos;
} 