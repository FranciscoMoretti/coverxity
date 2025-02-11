import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { ChatTextArea } from "./ChatTextArea";
import { ChatInput } from "./ChatInput";

interface TitleFormProps {
  onSubmit: (title: string) => void;
}

export default function TitleForm({ onSubmit }: TitleFormProps) {
  const searchParams = useSearchParams();
  const [title, setTitle] = useState(searchParams.get("q") || "");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
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
      <ChatInput 
        value={title}
        onChange={setTitle}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}
