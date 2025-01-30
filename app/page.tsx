"use client";

import { useState, useEffect } from "react";
import TitleForm from "./components/TitleForm";
import QueryResults from "./components/QueryResults";
import { getCoverImages } from "@/utils/coverImagesCall";
import { Github } from "lucide-react";
import Icon from "@/public/icon.png";
import Image from "next/image";
import { useToast } from "@/components/ui/use-toast";
import { useRouter, useSearchParams } from "next/navigation";

export default function Home() {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [queries, setQueries] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<Record<string, any[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [rateLimit, setRateLimit] = useState<{
    remaining: number;
    limit: number;
  } | null>(null);

  // Load initial state from URL
  useEffect(() => {
    const query = searchParams.get("q");
    if (query && !queries.length) {
      handleTitleSubmit(query);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchRateLimit = async () => {
      const res = await fetch("/api/rate-limit");
      const data = await res.json();
      setRateLimit(data);
    };
    fetchRateLimit();
  }, [queries]);

  const handleTitleSubmit = async (submittedTitle: string) => {
    setIsLoading(true);
    // Update URL without reload
    router.push(`?q=${encodeURIComponent(submittedTitle)}`, { scroll: false });

    try {
      const coverImages = await getCoverImages(submittedTitle);
      setQueries(coverImages.queries);
      setSearchResults(coverImages.results);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error ? error.message : "Something went wrong",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 flex flex-col">
      <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center justify-between w-full px-4 md:px-8">
          <div className="flex items-center gap-2">
            <Image src={Icon} alt="Coverxity icon" width={24} height={24} />
            <span className="text-xl font-bold">Coverxity</span>
          </div>
          <div className="flex items-center gap-4">
            {rateLimit && (
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {rateLimit.remaining}/{rateLimit.limit} credits
              </span>
            )}
            <a
              href="https://github.com/FranciscoMoretti/coverxity"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-600 dark:hover:text-gray-300"
            >
              <Github className="h-6 w-6" />
            </a>
          </div>
        </div>
      </nav>
      <main className=" bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 flex flex-col grow justify-center">
        <div className="container mx-auto pb-16 transition-all">
          <TitleForm onSubmit={handleTitleSubmit} />
          {(queries.length > 0 || isLoading) && (
            <QueryResults
              queries={queries}
              searchResults={searchResults}
              isLoading={isLoading}
            />
          )}
        </div>
      </main>
      <footer className="w-full py-2 text-center text-sm text-gray-600 dark:text-gray-400 ">
        Photos provided by{" "}
        <a
          href="https://www.pexels.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-gray-800 dark:hover:text-gray-200"
        >
          Pexels
        </a>
      </footer>
    </div>
  );
}
