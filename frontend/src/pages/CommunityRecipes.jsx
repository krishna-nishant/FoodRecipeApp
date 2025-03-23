"use client"

import { useEffect, useState } from "react"
import { ChefHat } from "lucide-react"

export default function CommunityRecipes() {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchRecipes() {
      try {
        const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
        const response = await fetch(`${API_URL}/recipes/community`)
        if (!response.ok) {
          throw new Error("Failed to fetch recipes")
        }
        const data = await response.json()
        setRecipes(data)
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchRecipes()
  }, [])

  return (
    <div className="py-8">
      <h1 className="page-heading">Community Recipes</h1>

      {loading && (
        <div className="flex justify-center items-center py-12">
          <ChefHat className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-4 text-lg font-medium text-gray-700 dark:text-gray-300">Loading community recipes...</p>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 mb-6">
          {error}
        </div>
      )}

      {recipes.length === 0 && !loading ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="bg-primary/10 p-6 rounded-full mb-6">
            <ChefHat className="h-12 w-12 text-primary" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-3 font-playfair">
            No Community Recipes Yet
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md">
            Be the first to share your culinary creation with our community!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100 dark:border-gray-700"
            >
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3 font-playfair">{recipe.title}</h3>

                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Ingredients:</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{recipe.ingredients}</p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Instructions:</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{recipe.instructions}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

