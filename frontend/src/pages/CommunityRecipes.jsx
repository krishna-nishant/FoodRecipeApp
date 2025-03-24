"use client"

import { useEffect, useState, useContext } from "react"
import { useNavigate, Link } from "react-router-dom"
import { ChefHat, Filter, Search, Star, Clock, Users, ChefHat as ChefIcon } from "lucide-react"
import { GlobalContext } from "../context"
import { notificationSystem } from "../components/Notification"

export default function CommunityRecipes() {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredRecipes, setFilteredRecipes] = useState([])
  const [filters, setFilters] = useState({
    difficulty: "",
    cookingTime: "",
    tags: [],
    minRating: ""
  })
  const [showFilters, setShowFilters] = useState(false)
  const [availableTags, setAvailableTags] = useState([])
  
  const { user, saveRecipe } = useContext(GlobalContext)
  const navigate = useNavigate()
  
  // Extract unique tags from recipes
  useEffect(() => {
    if (recipes.length > 0) {
      const allTags = recipes
        .filter(recipe => recipe.tags && recipe.tags.length > 0)
        .flatMap(recipe => 
          typeof recipe.tags === 'string' 
            ? recipe.tags.split(',').map(tag => tag.trim()) 
            : recipe.tags
        )
      
      const uniqueTags = [...new Set(allTags)]
      setAvailableTags(uniqueTags)
    }
  }, [recipes])
  
  // Apply filters and search
  useEffect(() => {
    let result = [...recipes]
    
    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(recipe => 
        recipe.title.toLowerCase().includes(term) || 
        recipe.description?.toLowerCase().includes(term) || 
        recipe.ingredients.toLowerCase().includes(term) ||
        recipe.instructions.toLowerCase().includes(term)
      )
    }
    
    // Apply difficulty filter
    if (filters.difficulty) {
      result = result.filter(recipe => recipe.difficulty === filters.difficulty)
    }
    
    // Apply cooking time filter
    if (filters.cookingTime) {
      const timeRange = filters.cookingTime
      
      if (timeRange === 'under30') {
        result = result.filter(recipe => recipe.cookingTime && recipe.cookingTime < 30)
      } else if (timeRange === '30to60') {
        result = result.filter(recipe => recipe.cookingTime && recipe.cookingTime >= 30 && recipe.cookingTime <= 60)
      } else if (timeRange === 'over60') {
        result = result.filter(recipe => recipe.cookingTime && recipe.cookingTime > 60)
      }
    }
    
    // Apply minimum rating filter
    if (filters.minRating) {
      const minRating = parseInt(filters.minRating, 10)
      result = result.filter(recipe => recipe.rating && recipe.rating >= minRating)
    }
    
    // Apply tags filter
    if (filters.tags.length > 0) {
      result = result.filter(recipe => {
        if (!recipe.tags) return false
        
        const recipeTags = typeof recipe.tags === 'string' 
          ? recipe.tags.split(',').map(tag => tag.trim().toLowerCase())
          : recipe.tags.map(tag => tag.toLowerCase())
          
        return filters.tags.some(tag => recipeTags.includes(tag.toLowerCase()))
      })
    }
    
    setFilteredRecipes(result)
  }, [recipes, searchTerm, filters])

  useEffect(() => {
    async function fetchRecipes() {
      try {
        const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
        const response = await fetch(`${API_URL}/recipes/community`)
        if (!response.ok) {
          throw new Error("Failed to fetch recipes")
        }
        const data = await response.json()
        
        // Mark all recipes as community recipes
        const communityRecipes = data.map(recipe => ({
          ...recipe,
          isCommunity: true
        }));
        
        setRecipes(communityRecipes)
        setFilteredRecipes(communityRecipes)
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchRecipes()
  }, [])
  
  const toggleTagFilter = (tag) => {
    setFilters(prev => {
      const currentTags = [...prev.tags]
      if (currentTags.includes(tag)) {
        return { ...prev, tags: currentTags.filter(t => t !== tag) }
      } else {
        return { ...prev, tags: [...currentTags, tag] }
      }
    })
  }
  
  const resetFilters = () => {
    setFilters({
      difficulty: "",
      cookingTime: "",
      tags: [],
      minRating: ""
    })
    setSearchTerm("")
  }
  
  const handleSaveRecipe = async (recipeId) => {
    if (!user) {
      navigate("/login")
      return
    }
    
    try {
      const result = await saveRecipe(recipeId);
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      // Show success message
      notificationSystem.show('Recipe saved successfully!', 'success');
    } catch (error) {
      console.error(error)
      notificationSystem.show('Failed to save recipe: ' + error.message, 'error');
    }
  }

  return (
    <div className="py-8">
      <h1 className="page-heading">Community Recipes</h1>
      
      {/* Search and filters bar */}
      <div className="max-w-5xl mx-auto mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-500 dark:text-gray-400" />
              <input
                type="text"
                placeholder="Search recipes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input pl-10 w-full"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 px-4 py-2 rounded-md text-gray-700 dark:text-gray-300 transition-colors"
            >
              <Filter className="h-5 w-5" />
              Filters
            </button>
          </div>
          
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Difficulty
                  </label>
                  <select
                    value={filters.difficulty}
                    onChange={(e) => setFilters({...filters, difficulty: e.target.value})}
                    className="form-select w-full"
                  >
                    <option value="">Any difficulty</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Cooking Time
                  </label>
                  <select
                    value={filters.cookingTime}
                    onChange={(e) => setFilters({...filters, cookingTime: e.target.value})}
                    className="form-select w-full"
                  >
                    <option value="">Any time</option>
                    <option value="under30">Under 30 minutes</option>
                    <option value="30to60">30-60 minutes</option>
                    <option value="over60">Over 60 minutes</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Minimum Rating
                  </label>
                  <select
                    value={filters.minRating}
                    onChange={(e) => setFilters({...filters, minRating: e.target.value})}
                    className="form-select w-full"
                  >
                    <option value="">Any rating</option>
                    <option value="1">1+ Stars</option>
                    <option value="2">2+ Stars</option>
                    <option value="3">3+ Stars</option>
                    <option value="4">4+ Stars</option>
                    <option value="5">5 Stars</option>
                  </select>
                </div>
              </div>
              
              {availableTags.length > 0 && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {availableTags.map(tag => (
                      <button
                        key={tag}
                        onClick={() => toggleTagFilter(tag)}
                        className={`px-3 py-1 text-sm rounded-full ${
                          filters.tags.includes(tag)
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        } transition-colors`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex justify-end">
                <button
                  onClick={resetFilters}
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-sm font-medium"
                >
                  Reset filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

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

      {filteredRecipes.length === 0 && !loading ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="bg-primary/10 p-6 rounded-full mb-6">
            <ChefHat className="h-12 w-12 text-primary" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-3 font-playfair">
            {recipes.length === 0 ? "No Community Recipes Yet" : "No Recipes Match Your Filters"}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md">
            {recipes.length === 0 
              ? "Be the first to share your culinary creation with our community!"
              : "Try adjusting your filters or search terms to find more recipes."}
          </p>
          {recipes.length > 0 && (
            <button
              onClick={resetFilters}
              className="mt-4 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md transition-colors"
            >
              Reset All Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe) => (
            <div key={recipe._id} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md border border-gray-100 dark:border-gray-700">
              <Link to={`/recipe/community_${recipe._id}`} className="block">
                <div className="relative">
                  <img
                    src={recipe.image ? `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${recipe.image}` : '/images/recipe-placeholder.svg'}
                    alt={recipe.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/images/recipe-placeholder.svg';
                    }}
                  />
                  {recipe.rating > 0 && (
                    <div className="absolute bottom-2 right-2 bg-white dark:bg-gray-800 rounded-full px-2 py-1 flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                      <span className="text-sm font-medium">{recipe.rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>
              </Link>
              
              <div className="p-6">
                <Link to={`/recipe/community_${recipe._id}`} className="block hover:text-primary">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2 font-playfair">
                    {recipe.title}
                  </h3>
                </Link>
                
                {recipe.description && (
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    {recipe.description}
                  </p>
                )}
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {recipe.difficulty && (
                    <span className="inline-flex items-center text-xs px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                      <ChefIcon className="h-3 w-3 mr-1" />
                      {recipe.difficulty.charAt(0).toUpperCase() + recipe.difficulty.slice(1)}
                    </span>
                  )}
                  
                  {recipe.cookingTime && (
                    <span className="inline-flex items-center text-xs px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300">
                      <Clock className="h-3 w-3 mr-1" />
                      {recipe.cookingTime} min
                    </span>
                  )}
                  
                  {recipe.servings && (
                    <span className="inline-flex items-center text-xs px-2.5 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                      <Users className="h-3 w-3 mr-1" />
                      {recipe.servings} servings
                    </span>
                  )}
                </div>
                
                {recipe.tags && typeof recipe.tags === 'string' && recipe.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {recipe.tags.split(',').map((tag, idx) => (
                      <span 
                        key={idx} 
                        className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Ingredients:</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{recipe.ingredients}</p>
                </div>

                <div className="mb-4">
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

