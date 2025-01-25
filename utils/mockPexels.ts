interface MockImage {
  src: {
    medium: string
    original: string
  }
  alt: string
}

export async function searchPexels(query: string): Promise<MockImage[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Generate mock image results
  const mockImages: MockImage[] = Array.from({ length: 8 }, (_, i) => ({
    src: {
      medium: `https://picsum.photos/seed/${query}-${i}/300/200`,
      original: `https://picsum.photos/seed/${query}-${i}/1200/800`,
    },
    alt: `Mock image for "${query}"`,
  }))

  return mockImages
}

