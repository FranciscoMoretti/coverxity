import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles } from "lucide-react";

interface TitleFormProps {
  onSubmit: (title: string) => void;
}

export default function TitleForm({ onSubmit }: TitleFormProps) {
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await onSubmit(title);
    setIsLoading(false);
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 md:py-24">
      <div className="text-center space-y-4 mb-8">
        <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 text-transparent bg-clip-text">
          Find the Perfect Cover Image
        </h2>
        <p className="text-muted-foreground">
          Enter a title and AI will find matching visuals
        </p>
      </div>
      <form onSubmit={handleSubmit} className="relative">
        <Input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="The Future of Artificial Intelligence"
          className="w-full pl-4 pr-32 h-12 text-base"
        />
        <Button
          type="submit"
          className="absolute right-1 top-1 h-10"
          disabled={!title.trim() || isLoading}
        >
          {isLoading ? (
            "Searching..."
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Find Images
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
