import { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ChefHat, ArrowLeft, Clock, Users, Star } from "lucide-react";
import { GlobalContext } from "../context";

export default function RecipeItem() {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const { handleAddToFavorite, favoritesList } = useContext(GlobalContext);
  
  useEffect(() => {
    async function fetchRecipeDetails() {
      try {
        setLoading(true);
        
        // Check if it's a community recipe or external recipe
        if (id.startsWith('community_')) {
          const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
          const communityId = id.replace('community_', '');
          const response = await fetch(`${API_URL}/recipes/community/${communityId}`);
          
          if (!response.ok) {
            throw new Error('Recipe not found');
          }
          
          const data = await response.json();
          setRecipe(data);
        } else {
          // Use the Forkify API to fetch recipe details
          const response = await fetch(
            `https://forkify-api.herokuapp.com/api/v2/recipes/${id}`
          );
          
          if (!response.ok) {
            throw new Error('Recipe not found');
          }
          
          const data = await response.json();
          
          if (!data.data || !data.data.recipe) {
            throw new Error('Invalid recipe data');
          }
          
          setRecipe(data.data.recipe);
        }
      } catch (error) {
        console.error("Error fetching recipe:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchRecipeDetails();
  }, [id]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <ChefHat className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-4 text-lg font-medium text-gray-700 dark:text-gray-300">Loading recipe...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="max-w-3xl mx-auto py-8">
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 mb-6">
          {error}
        </div>
        <Link to="/" className="flex items-center text-primary hover:text-primary/80">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Go Back to Recipes
        </Link>
      </div>
    );
  }
  
  if (!recipe) return null;
  
  // Format ingredients from the Forkify API format
  const ingredients = recipe.ingredients?.map(ingObj => {
    let ingText = '';
    if (ingObj.quantity) ingText += ingObj.quantity + ' ';
    if (ingObj.unit) ingText += ingObj.unit + ' ';
    if (ingObj.description) ingText += ingObj.description;
    return ingText.trim();
  }) || [];
  
  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <Link to="/" className="flex items-center text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to recipes
        </Link>
        
        <button 
          onClick={() => handleAddToFavorite(recipe)}
          className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1.5 rounded-md hover:bg-primary/20 transition-colors"
        >
          <Star className={`h-4 w-4 ${favoritesList?.some(item => 
            (item.id === recipe.id || item.recipe_id === recipe.id)) ? "fill-primary" : ""}`} /> 
          {favoritesList?.some(item => 
            (item.id === recipe.id || item.recipe_id === recipe.id)) 
            ? "Remove from Favorites" 
            : "Save Recipe"}
        </button>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md border border-gray-100 dark:border-gray-700">
        {recipe.image_url && (
          <div className="h-72 sm:h-96 overflow-hidden">
            <img 
              src={recipe.image_url}
              alt={recipe.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/images/recipe-placeholder.svg';
              }}
            />
          </div>
        )}
        
        <div className="p-6 sm:p-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4 font-playfair">{recipe.title}</h1>
          
          <div className="flex flex-wrap gap-3 mb-6">
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <Clock className="h-4 w-4 mr-1" />
              <span>{recipe.cooking_time} minutes</span>
            </div>
            
            {recipe.servings && (
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Users className="h-4 w-4 mr-1" />
                <span>{recipe.servings} servings</span>
              </div>
            )}
            
            <div className="flex items-center text-amber-600 dark:text-amber-400">
              <Star className="h-4 w-4 mr-1 fill-current" />
              <span>By {recipe.publisher}</span>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Ingredients</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-700 dark:text-gray-300">
              {ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-start">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 mr-2"></div>
                  <span>{ingredient}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">How to Cook</h3>
            <p className="text-gray-700 dark:text-gray-300">
              This recipe was carefully designed and tested by {recipe.publisher}. Please check out 
              directions at their website.
            </p>
            
            <a 
              href={recipe.source_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block mt-4 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md transition-colors"
            >
              View Directions
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 