import { Photo } from "pexels";
import QueryCard from "./QueryCard";

export default function QueryResults({
  queries,
  searchResults,
}: {
  queries: string[];
  searchResults: Record<string, Photo[]>;
}) {
  return (
    <div className="space-y-8">
      {queries.map((query) => (
        <QueryCard key={query} query={query} images={searchResults[query]} />
      ))}
    </div>
  );
}
