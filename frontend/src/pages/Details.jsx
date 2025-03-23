"use client"

import { useContext, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { GlobalContext } from "../context"
import { ArrowLeft, Heart, Clock, User, ChefHat, ExternalLink } from "lucide-react"

export default function Details() {
  const { id } = useParams()
  const { recipeDetailsData, setRecipeDetailsData, favoritesList, handleAddToFavorite } = useContext(GlobalContext)

  const navigate = useNavigate()

  useEffect(() => {
    async function getRecipeDetails() {
      const response = await fetch(`https://forkify-api.herokuapp.com/api/v2/recipes/${id}`)
      const data = await response.json()
      if (data?.data) {
        setRecipeDetailsData(data?.data)
      }
    }
    getRecipeDetails()
  }, [id, setRecipeDetailsData])

  const isFavorite = favoritesList?.some((item) => item.id === recipeDetailsData?.recipe?.id)

  if (!recipeDetailsData?.recipe) {
    return (
      <div className="flex justify-center items-center mt-20">
        <div className="loading-spinner"></div>
        <p className="ml-4 text-lg font-medium text-gray-700 dark:text-gray-300">Loading recipe details...</p>
      </div>
    )
  }

  const { recipe } = recipeDetailsData

  return (
    <div className="py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-8 inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-200 transition-all duration-200 font-medium"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="relative h-80 sm:h-96 md:h-[450px] w-full overflow-hidden">
          <img src={recipe.image_url || "/placeholder.svg"} className="w-full h-full object-cover" alt={recipe.title} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="flex items-center gap-2 mb-2">
              <ChefHat className="h-5 w-5" />
              <span className="font-medium">{recipe.publisher}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 font-playfair">{recipe.title}</h1>

            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-full">
                <Clock className="h-4 w-4" />
                <span>{recipe.cooking_time} mins</span>
              </div>
              <div className="flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-full">
                <User className="h-4 w-4" />
                <span>{recipe.servings} servings</span>
              </div>
              {recipe.source_url && (
                <a
                  href={recipe.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-full hover:bg-black/50 transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Source</span>
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8">
          {/* Favorite Button */}
          <button
            onClick={() => handleAddToFavorite(recipe)}
            className={`mb-8 inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-medium shadow-md transition-all duration-200 ${
              isFavorite ? "bg-gray-700 hover:bg-gray-800" : "bg-primary hover:bg-primary/90"
            }`}
          >
            <Heart className={`h-5 w-5 ${isFavorite ? "fill-white" : ""}`} />
            {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
          </button>

          {/* Ingredients */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 font-playfair">Ingredients</h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-start gap-3 bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                  <div className="h-6 w-6 rounded-full bg-primary/20 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <div>
                    {ingredient.quantity && (
                      <span className="font-medium">
                        {ingredient.quantity} {ingredient.unit}{" "}
                      </span>
                    )}
                    {ingredient.description}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Cooking Instructions */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 font-playfair">How to Cook</h2>
            <p className="text-gray-700 dark:text-gray-300">
              This recipe was carefully designed and tested by {recipe.publisher}. Please check out directions at their
              website.
            </p>

            {recipe.source_url && (
              <a
                href={recipe.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-gray-800 dark:text-white transition-all duration-200 font-medium"
              >
                <ExternalLink className="h-4 w-4" />
                View Full Instructions
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

