import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { SendIcon } from "lucide-react";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  isLoading?: boolean;
  className?: string;
  inputClassName?: string;
}

export function ChatInput({ 
  className, 
  inputClassName,
  value, 
  onChange, 
  onSubmit,
  isLoading,
  ...props 
}: ChatInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && onSubmit && value && !isLoading) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div
      className={cn(
        "relative flex h-full max-w-full flex-1 flex-col",
        className
      )}
      {...props}
    >
      <div className="group relative flex w-full items-center">
        <div className="w-full">
          <div className="flex w-full cursor-text flex-col rounded-3xl border p-1 sm:p-1.5 shadow-[0_9px_9px_0px_rgba(0,0,0,0.01),_0_2px_5px_0px_rgba(0,0,0,0.06)] transition-colors dark:border-none dark:shadow-none dark:bg-[#303030]">
            <div className="flex items-center pl-1">
              <Input
                value={value}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  onChange(e.target.value)
                }
                onKeyDown={handleKeyDown}
                placeholder="Your Article Title..."
                className={cn(
                    "w-full border-0 bg-transparent p-1 sm:p-2 focus-visible:ring-0 shadow-none outline-none",
                  inputClassName
                )}
                style={{
                  WebkitBoxShadow: 'none',
                  MozBoxShadow: 'none',
                  boxShadow: 'none'
                }}
              />
              <div className="flex items-center">
                <Button
                  size="icon"
                  className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-black dark:bg-white dark:text-black disabled:bg-[#D7D7D7]"
                  disabled={!value || isLoading}
                  onClick={onSubmit}
                >
                  {isLoading ? (
                    "..."
                  ) : (
                    <SendIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 