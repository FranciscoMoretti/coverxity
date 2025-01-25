"use client"

import { useState } from "react"
import TitleForm from "./components/TitleForm"
import QueryResults from "./components/QueryResults"
import SelectedImage from "./components/SelectedImage"
import { ToastProvider } from "./components/ToastProvider"
import { getCoverImages } from "../utils/coverImagesCall"
import { searchPexels } from "../utils/mockPexels"

export default function Home() {
  const [queries, setQueries] = useState<string[]>([])
  const [searchResults, setSearchResults] = useState<Record<string, any[]>>({})
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const handleTitleSubmit = async (submittedTitle: string) => {
    const coverImages = await getCoverImages(submittedTitle)
    setQueries(coverImages.queries)

    const results = coverImages.results
    setSearchResults(results)
  }

  console.log(searchResults)

  const handleImageSelect = (imageUrl: string) => {
    setSelectedImage(imageUrl)
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">AI Article Image Finder</h1>
        <TitleForm onSubmit={handleTitleSubmit} />
        {queries.length > 0 && (
          <QueryResults queries={queries} searchResults={searchResults} onImageSelect={handleImageSelect} />
        )}
        {selectedImage && <SelectedImage imageUrl={selectedImage} />}
      </div>
      <ToastProvider />
    </>
  )
}

