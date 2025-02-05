import * as React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { PlusIcon, SearchIcon, LightbulbIcon, SendIcon } from "lucide-react";

interface ChatInputProps extends React.ComponentPropsWithoutRef<"div"> {
  onSend?: (message: string) => void;
}

export function ChatInputDemo({ className, onSend, ...props }: ChatInputProps) {
  const [message, setMessage] = React.useState("");

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
                value={message}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setMessage(e.target.value)
                }
                placeholder="The Future of Artificial Intelligence"
                className="min-h-[40px] w-full resize-none border-0 bg-transparent p-2 focus-visible:ring-0"
              />
            </div>

            <div className="mb-2 mt-1 flex items-center justify-between">
              <div className="flex gap-1.5">
                <Button
                  size="icon"
                  variant="outline"
                  className="h-9 w-9 rounded-full opacity-30"
                  disabled
                >
                  <PlusIcon className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-9 w-9 rounded-full opacity-30"
                  disabled
                >
                  <SearchIcon className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-9 w-9 rounded-full"
                >
                  <LightbulbIcon className="h-4 w-4" />
                </Button>
              </div>

              <Button
                size="icon"
                className="h-9 w-9 rounded-full bg-black dark:bg-white dark:text-black disabled:bg-[#D7D7D7]"
                disabled={!message}
                onClick={() => {
                  if (message && onSend) {
                    onSend(message);
                    setMessage("");
                  }
                }}
              >
                <SendIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
