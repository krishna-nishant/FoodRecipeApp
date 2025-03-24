"use client"

import { useContext, useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { GlobalContext } from "../context"
import RecipeItem from "../components/RecipeItem"
import { Search, ChefHat, ArrowRight, Star, Clock, Users } from "lucide-react"

export default function Home() {
  const { 
    searchParam, 
    setSearchParam, 
    handleSubmit, 
    recipeList, 
    loading,
    fetchCommunityRecipes
  } = useContext(GlobalContext)
  
  const [communityRecipes, setCommunityRecipes] = useState([])
  const [loadingCommunity, setLoadingCommunity] = useState(true)
  const [initialLoaded, setInitialLoaded] = useState(false)
  
  // Fetch some community recipes for the homepage
  useEffect(() => {
    const loadCommunityRecipes = async () => {
      setLoadingCommunity(true);
      try {
        // Always fetch fresh data for community recipes
        const recipes = await fetchCommunityRecipes({ limit: 3, keepState: true });
        setCommunityRecipes(recipes || []);
      } catch (error) {
        console.error("Error fetching community recipes:", error);
        setCommunityRecipes([]);
      } finally {
        setLoadingCommunity(false);
        setInitialLoaded(true);
      }
    };
    
    loadCommunityRecipes();
  }, [fetchCommunityRecipes]);

  // Show loading state for initial load only, and only if we don't have recipes yet
  if ((loading && !recipeList.length) || (!initialLoaded && !communityRecipes.length)) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <ChefHat className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-4 text-lg font-medium text-gray-700 dark:text-gray-300">Preparing delicious recipes...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero section */}
      <section className="py-12 md:py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4 font-playfair">
            Discover <span className="text-primary">Delicious</span> Recipes
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Find and share amazing recipes from around the world - from quick weeknight dinners to impressive party dishes.
          </p>
        </div>
        
        {/* Large search box */}
        <div className="max-w-xl mx-auto mb-16">
          <form 
            onSubmit={handleSubmit}
            className="flex flex-col md:flex-row gap-2"
          >
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search for recipes..."
                className="w-full px-4 py-3 pr-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                value={searchParam}
                onChange={(e) => setSearchParam(e.target.value)}
              />
              <Search className="absolute right-3 top-3 text-gray-400 h-5 w-5" />
            </div>
            <button 
              type="submit"
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              Search
            </button>
          </form>
        </div>
        
        {/* Example searches */}
        <div className="flex flex-wrap justify-center gap-2 mb-16">
          <p className="text-gray-600 dark:text-gray-400 mr-2">Try:</p>
          {["Pasta", "Chicken", "Vegetarian", "Dessert", "Quick Meals"].map(term => (
            <button
              key={term}
              onClick={() => {
                setSearchParam(term);
                handleSubmit({ preventDefault: () => {} });
              }}
              className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              {term}
            </button>
          ))}
        </div>
      </section>
      
      {/* Search results section */}
      {recipeList.length > 0 && (
        <section className="mb-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white font-playfair">
              Search Results
            </h2>
            <button 
              onClick={() => setSearchParam("")}
              className="text-primary hover:text-primary/80 text-sm font-medium"
            >
              Clear results
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipeList.map((recipe) => (
              <RecipeItem key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </section>
      )}
      
      {/* Community recipes section */}
      <section className="mb-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white font-playfair">
            Community Recipes
          </h2>
          <Link 
            to="/community-recipes"
            className="flex items-center text-primary hover:text-primary/80 text-sm font-medium"
          >
            View all
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        
        {loadingCommunity && communityRecipes.length === 0 ? (
          <div className="flex justify-center items-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <ChefHat className="h-6 w-6 animate-spin text-primary" />
            <p className="ml-2 text-gray-600 dark:text-gray-400">Loading community recipes...</p>
          </div>
        ) : communityRecipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {communityRecipes.map((recipe) => (
              <RecipeItem key={recipe._id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">No community recipes found.</p>
            <Link
              to="/add-recipe"
              className="inline-block bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90"
            >
              Share Your Recipe
            </Link>
          </div>
        )}
      </section>
      
      {/* Call to action */}
      <section className="mb-16 bg-gradient-to-r from-primary/20 to-primary/5 dark:from-primary/10 dark:to-gray-800 rounded-2xl p-8 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-4 font-playfair">
          Share Your Culinary Creations
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-6">
          Got a recipe that everyone loves? Share it with our community and inspire others to try your delicious creations.
        </p>
        <Link
          to="/add-recipe"
          className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium"
        >
          Add Your Recipe
        </Link>
      </section>
    </div>
  );
}

