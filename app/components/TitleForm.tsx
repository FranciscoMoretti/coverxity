import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Sparkles } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { ChatInputDemo } from "./chatInput";

interface TitleFormProps {
  onSubmit: (title: string) => void;
}

export default function TitleForm({ onSubmit }: TitleFormProps) {
  const searchParams = useSearchParams();
  const [title, setTitle] = useState(searchParams.get("q") || "");
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
      <form onSubmit={handleSubmit} className="relative sm:relative static">
        <Textarea
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="The Future of Artificial Intelligence"
          className="w-full pl-4 pr-4 sm:pr-32 h-12 text-base"
        />
        <Button
          type="submit"
          className="sm:absolute static w-full sm:w-auto sm:right-1.5 sm:bottom-1.5 h-10 mt-2 sm:mt-0"
          disabled={!title.trim() || isLoading}
        >
          {isLoading ? (
            "Searching..."
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" />
              Find Images
            </>
          )}
        </Button>
      </form>
      <br />
      <ChatInputDemo />
    </div>
  );
}
