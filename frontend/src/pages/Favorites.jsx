"use client"

import { useContext } from "react"
import RecipeItem from "../components/RecipeItem"
import { GlobalContext } from "../context"
import { Heart } from "lucide-react"

export default function Favorites() {
  const { favoritesList } = useContext(GlobalContext)

  return (
    <div className="py-8">
      <h1 className="page-heading">Your Favorite Recipes</h1>

      {favoritesList && favoritesList.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favoritesList.map((item) => (
            <RecipeItem key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="bg-primary/10 p-6 rounded-full mb-6">
            <Heart className="h-12 w-12 text-primary" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-3 font-playfair">
            Your Favorites Collection is Empty
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md">
            Start exploring recipes and save your favorites to build your personal collection.
          </p>
        </div>
      )}
    </div>
  )
}

