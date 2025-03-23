"use client"

import { useContext } from "react"
import { GlobalContext } from "../context"
import RecipeItem from "../components/RecipeItem"
import { Search, ChefHat } from "lucide-react"

export default function Home() {
  const { recipeList, loading, searchParam } = useContext(GlobalContext)

  if (loading) {
    return (
      <div className="flex justify-center items-center mt-20">
        <div className="loading-spinner"></div>
        <p className="ml-4 text-lg font-medium text-gray-700 dark:text-gray-300">Preparing your recipes...</p>
      </div>
    )
  }

  return (
    <div className="py-8">
      {recipeList && recipeList.length > 0 ? (
        <>
          <h1 className="page-heading">Discover Delicious Recipes</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recipeList.map((item) => (
              <RecipeItem item={item} key={item.id} />
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="bg-primary/10 p-6 rounded-full mb-6">
            {searchParam ? (
              <Search className="h-12 w-12 text-primary" />
            ) : (
              <ChefHat className="h-12 w-12 text-primary" />
            )}
          </div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-3 font-playfair">
            {searchParam ? "No Recipes Found" : "Find Your Next Culinary Adventure"}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md">
            {searchParam
              ? "Try searching with different keywords or ingredients."
              : "Search for recipes by name, ingredient, or cuisine to get started."}
          </p>
          <img src="/img.jpg" alt="Food illustration" className="w-64 mt-10 rounded-lg shadow-lg" />
        </div>
      )}
    </div>
  )
}

