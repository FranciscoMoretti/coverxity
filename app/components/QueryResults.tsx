import { Card, CardContent } from "@/components/ui/card"
import { Photo } from "pexels"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Check, Copy } from "lucide-react"
import { DialogTitle } from "@radix-ui/react-dialog"

export default function QueryResults({
  queries,
  searchResults,
}: {
  queries: string[]
  searchResults: Record<string, Photo[]>
}) {
  const [hoveredImage, setHoveredImage] = useState<string | null>(null)
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({})

  const handleCopyClick = (e: React.MouseEvent, imageUrl: string, id: string) => {
    e.stopPropagation()
    navigator.clipboard
      .writeText(imageUrl)
      .then(() => {
        setCopiedStates((prev) => ({ ...prev, [id]: true }))
        setTimeout(() => {
          setCopiedStates((prev) => ({ ...prev, [id]: false }))
        }, 3000)
      })
      .catch((err) => {
        console.error("Failed to copy: ", err)
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
                <Dialog key={index}>
                  <DialogTrigger asChild>
                    <div
                      className="relative group cursor-pointer"
                      onMouseEnter={() => setHoveredImage(`${query}-${index}`)}
                      onMouseLeave={() => setHoveredImage(null)}
                    >
                      <img
                        src={image.src.medium || "/placeholder.svg"}
                        alt={image.alt || "Image"}
                        className="w-full h-48 object-cover cursor-pointer rounded-md"
                        />
                      {hoveredImage === `${query}-${index}` && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-between p-2 rounded-md">
                          <Button
                            variant="secondary"
                            className="self-end h-8"
                            onClick={(e) => handleCopyClick(e, image.src.original, `${query}-${index}`)}
                            >
                            {copiedStates[`${query}-${index}`] ? (
                              <div className="flex items-center justify-center w-full space-x-1.5">
                                <span className="text-xs">URL Copied</span>
                                <Check className="h-4 w-4" />
                              </div>
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                          <p className="text-white text-sm">{image.photographer || "Unknown author"}</p>
                        </div>
                      )}
                    </div>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <DialogTitle>{image.alt || "Image"}</DialogTitle>
                    <img
                      src={image.src.original || "/placeholder.svg"}
                      alt={image.alt || "Image"}
                      className="w-full h-auto object-contain"
                    />
                    <div className="mt-4">
                      <p className="font-semibold">Author: {image.photographer || "Unknown"}</p>
                      <Button
                        onClick={(e) => handleCopyClick(e, image.src.original, `dialog-${query}-${index}`)}
                        className="mt-2"
                      >
                        {copiedStates[`dialog-${query}-${index}`] ? (
                          <div className="flex items-center space-x-2">
                            <span>URL Copied</span>
                            <Check className="h-4 w-4" />
                          </div>
                        ) : (
                          "Copy Image URL"
                        )}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
