import * as React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { SendIcon, Search } from "lucide-react";

interface ChatTextAreaProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  isLoading?: boolean;
  className?: string;
}

export function ChatTextArea({ 
  className, 
  value, 
  onChange, 
  onSubmit,
  isLoading,
  ...props 
}: ChatTextAreaProps) {
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
          <div className="flex w-full cursor-text flex-col rounded-3xl border px-3 py-1 shadow-[0_9px_9px_0px_rgba(0,0,0,0.01),_0_2px_5px_0px_rgba(0,0,0,0.06)] transition-colors dark:border-none dark:shadow-none dark:bg-[#303030]">
            <div className="flex min-h-[44px] items-start pl-1">
              <Textarea
                value={value}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  onChange(e.target.value)
                }
                placeholder="Your article title"
                className="min-h-[40px] w-full resize-none border-0 bg-transparent p-2 focus-visible:ring-0 shadow-none outline-none overflow-auto"
                style={{
                  WebkitBoxShadow: 'none',
                  MozBoxShadow: 'none',
                  boxShadow: 'none'
                }}
              />
            </div>

            <div className="mb-2 mt-1 flex items-center justify-end">
              <Button
                size="icon"
                className="h-9 w-9 rounded-full bg-black dark:bg-white dark:text-black disabled:bg-[#D7D7D7]"
                disabled={!value || isLoading}
                onClick={onSubmit}
              >
                {isLoading ? (
                  "..."
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
