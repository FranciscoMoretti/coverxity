import { Card, CardContent } from "@/components/ui/card";
import { Photo } from "pexels";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Check, Copy, Download } from "lucide-react";
import ImageDialog from "./ImageDialog";

export default function QueryResults({
  queries,
  searchResults,
}: {
  queries: string[];
  searchResults: Record<string, Photo[]>;
}) {
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});

  const handleCopyClick = (
    e: React.MouseEvent,
    imageUrl: string,
    id: string
  ) => {
    e.stopPropagation();
    navigator.clipboard
      .writeText(imageUrl)
      .then(() => {
        setCopiedStates((prev) => ({ ...prev, [id]: true }));
        setTimeout(() => {
          setCopiedStates((prev) => ({ ...prev, [id]: false }));
        }, 3000);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  const handleDownload = async (
    e: React.MouseEvent,
    imageUrl: string,
    filename: string
  ) => {
    e.stopPropagation();
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${filename}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Failed to download: ", err);
    }
  };

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
                    <div className="relative group cursor-pointer">
                      <img
                        src={image.src.medium || "/placeholder.svg"}
                        alt={image.alt || "Image"}
                        className="w-full h-48 object-cover cursor-pointer rounded-md"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex-col justify-between p-2 rounded-md hidden group-hover:flex">
                        <div className="flex gap-2 self-end">
                          <Button
                            variant="secondary"
                            className="transition-all"
                            size="icon"
                            onClick={(e) =>
                              handleDownload(
                                e,
                                image.src.original,
                                image.alt || `image-${index}`
                              )
                            }
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="secondary"
                            className="self-end transition-all"
                            size={
                              copiedStates[`${query}-${index}`]
                                ? "default"
                                : "icon"
                            }
                            onClick={(e) =>
                              handleCopyClick(
                                e,
                                image.src.original,
                                `${query}-${index}`
                              )
                            }
                          >
                            {copiedStates[`${query}-${index}`] ? (
                              <div className="flex items-center justify-center w-full ">
                                <span className="text-xs">URL Copied</span>
                                <Check className="h-4 w-4" />
                              </div>
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        <p className="text-white text-sm">
                          {"Photo: " + image.photographer || "Unknown author"}
                        </p>
                      </div>
                    </div>
                  </DialogTrigger>
                  <ImageDialog image={image} query={query} index={index} />
                </Dialog>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
