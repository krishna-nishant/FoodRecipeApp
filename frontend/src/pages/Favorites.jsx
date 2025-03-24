"use client"

import { useEffect, useState, useContext } from "react"
import { Link } from "react-router-dom"
import RecipeItem from "../components/RecipeItem"
import { GlobalContext } from "../context"
import { ChefHat } from "lucide-react"

export default function Favorites() {
  const { favoritesList, user, fetchSavedRecipes } = useContext(GlobalContext)
  const [savedRecipes, setSavedRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [combinedFavorites, setCombinedFavorites] = useState([])

  // Fetch saved recipes from API when user is logged in
  useEffect(() => {
    const loadSavedRecipes = async () => {
      setLoading(true)
      if (user) {
        try {
          const data = await fetchSavedRecipes()
          setSavedRecipes(data || [])
        } catch (error) {
          console.error("Error fetching saved recipes:", error)
          setSavedRecipes([])
        }
      }
      setLoading(false)
    }

    loadSavedRecipes()
  }, [user, fetchSavedRecipes])

  // Combine user's saved recipes with favorites list
  useEffect(() => {
    const combined = [...favoritesList]
    
    // Add saved recipes that are not already in favorites
    if (savedRecipes && savedRecipes.length > 0) {
      savedRecipes.forEach(recipe => {
        const existsInFavorites = combined.some(item => 
          (item._id && recipe._id && item._id === recipe._id) || 
          (item.id && recipe.id && item.id === recipe.id)
        )
        
        if (!existsInFavorites) {
          combined.push(recipe)
        }
      })
    }
    
    setCombinedFavorites(combined)
  }, [favoritesList, savedRecipes])

  if (loading && !combinedFavorites.length) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <ChefHat className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-4 text-lg font-medium text-gray-700 dark:text-gray-300">Loading favorites...</p>
      </div>
    )
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8 text-center font-playfair">
        My Favorites
      </h1>
      
      {combinedFavorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {combinedFavorites.map((recipe) => (
            <RecipeItem key={recipe._id || recipe.id} recipe={recipe} showActions={true} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-600 dark:text-gray-400 mb-4">You haven't saved any recipes yet.</p>
          <div className="flex justify-center gap-4">
            <Link
              to="/"
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
            >
              Explore Recipes
            </Link>
            <Link
              to="/community-recipes"
              className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
            >
              Community Recipes
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

