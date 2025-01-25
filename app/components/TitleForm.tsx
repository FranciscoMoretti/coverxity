import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface TitleFormProps {
  onSubmit: (title: string) => void
}

export default function TitleForm({ onSubmit }: TitleFormProps) {
  const [title, setTitle] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(title)
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="flex gap-4">
        <Input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter article title"
          className="flex-grow"
        />
        <Button type="submit">Generate Images</Button>
      </div>
    </form>
  )
}

