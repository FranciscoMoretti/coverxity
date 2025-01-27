import { Photo } from "pexels";
import QueryCard from "./QueryCard";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

function QuerySkeleton() {
  return (
    <Card className="">
      <CardContent className="p-4">
        <div className="h-7 w-48 bg-gray-200 dark:bg-gray-800 rounded mb-4 animate-pulse" />
        <div className="relative">
          <Carousel>
            <CarouselContent className="-ml-1">
              {[...Array(4)].map((_, index) => (
                <CarouselItem
                  key={index}
                  className="pl-1 basis-1/1 md:basis-1/3 lg:basis-1/4"
                >
                  <div className="w-full h-48 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </CardContent>
    </Card>
  );
}

export default function QueryResults({
  queries,
  searchResults,
  isLoading,
}: {
  queries: string[];
  searchResults: Record<string, Photo[]>;
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <div className="space-y-8">
        {[...Array(5)].map((_, index) => (
          <QuerySkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {queries.map((query) => (
        <QueryCard key={query} query={query} images={searchResults[query]} />
      ))}
    </div>
  );
}
