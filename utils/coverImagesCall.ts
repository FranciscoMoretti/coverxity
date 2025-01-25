import { ReturnSchema } from "@/app/api/cover-images/route";

export async function getCoverImages(title: string): Promise<ReturnSchema> {
  const response = await fetch('/api/cover-images', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title })
  });
  
  if (!response.ok) {
    throw new Error('Failed to generate queries');
  }
  
  const data = await response.json();
  return data;
}

