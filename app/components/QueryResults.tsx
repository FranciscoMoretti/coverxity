import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

interface QueryResultsProps {
  queries: string[]
  searchResults: Record<string, string[]>
  onImageSelect: (imageUrl: string) => void
}

export default function QueryResults({ queries, searchResults, onImageSelect }: QueryResultsProps) {
  const { toast } = useToast()

  const handleImageClick = (imageUrl: string) => {
    onImageSelect(imageUrl)
    navigator.clipboard
      .writeText(imageUrl)
      .then(() => {
        toast({
          title: "URL Copied",
          description: "The image URL has been copied to your clipboard.",
        })
      })
      .catch((err) => {
        console.error("Failed to copy: ", err)
        toast({
          title: "Copy Failed",
          description: "Failed to copy the URL. Please try again.",
          variant: "destructive",
        })
      })
  }

  return (
    <div className="space-y-8">
      {queries.map((query) => (
        <Card key={query}>
          <CardContent className="p-4">
            <h2 className="text-xl font-semibold mb-4">{query}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {searchResults[query]?.map((image, index) => (
                <img
                  key={index}
                  src={image || "/placeholder.svg"}
                  alt={image}
                  className="w-full h-48 object-cover cursor-pointer rounded-md hover:opacity-80 transition-opacity"
                  onClick={() => handleImageClick(image)}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

