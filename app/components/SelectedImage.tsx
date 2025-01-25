import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface SelectedImageProps {
  imageUrl: string
}

export default function SelectedImage({ imageUrl }: SelectedImageProps) {
  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Selected Image</CardTitle>
      </CardHeader>
      <CardContent>
        <img
          src={imageUrl || "/placeholder.svg"}
          alt="Selected cover image"
          className="w-full max-h-96 object-contain"
        />
      </CardContent>
    </Card>
  )
}

