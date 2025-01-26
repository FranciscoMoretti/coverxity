"use client"

import { useState } from "react"
import TitleForm from "./components/TitleForm"
import QueryResults from "./components/QueryResults"
import { getCoverImages } from "@/utils/coverImagesCall"

export default function Home() {
  const [title, setTitle] = useState("")
  const [queries, setQueries] = useState<string[]>([])
  const [searchResults, setSearchResults] = useState<Record<string, any[]>>({})

  const handleTitleSubmit = async (submittedTitle: string) => {
    const coverImages = await getCoverImages(submittedTitle)
    setQueries(coverImages.queries)

    const results = coverImages.results
    setSearchResults(results)
  }

  return (
    <>
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <div className="container mx-auto">
        <TitleForm onSubmit={handleTitleSubmit} />
        {queries.length > 0 && <QueryResults queries={queries} searchResults={searchResults} />}
      </div>
    </div>
  </>
  )
}

