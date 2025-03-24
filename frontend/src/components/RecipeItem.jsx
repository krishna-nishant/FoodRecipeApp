import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Star, Check, ChefHat, Clock, Users } from "lucide-react";
import { GlobalContext } from "../context";

export default function RecipeItem({ recipe, showActions = false }) {
  const { saveRecipe, removeRecipe, user, handleAddToFavorite, isRecipeInFavorites } = useContext(GlobalContext);
  const navigate = useNavigate();
  
  const isSaved = user?.savedRecipes?.some(
    savedRecipe => savedRecipe._id === recipe._id || savedRecipe === recipe._id
  ) || isRecipeInFavorites(recipe._id || recipe.id || recipe.recipe_id);
  
  const handleSaveRecipe = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      // Redirect to login if not logged in
      navigate('/login');
      return;
    }
    
    // Use the handleAddToFavorite method which directly manipulates the favorites list
    handleAddToFavorite(recipe);
  };
  
  // Determine the correct ID for the recipe link
  let recipeId = recipe._id || recipe.id || recipe.recipe_id;
  
  // Determine if this is a community recipe
  let isCommunityRecipe = false;
  
  if (recipe.isCommunity) {
    isCommunityRecipe = true;
  } else if (recipe._id && !(recipe.source_url || recipe.publisher)) {
    isCommunityRecipe = true;
  } else if (recipe.hasOwnProperty('cookingTime')) {
    isCommunityRecipe = true;
  }
  
  // Make sure recipeId doesn't already include community_ prefix
  if (typeof recipeId === 'string' && recipeId.startsWith('community_')) {
    recipeId = recipeId.replace('community_', '');
    isCommunityRecipe = true;
  }
  
  // Construct the proper route
  const routePath = isCommunityRecipe 
    ? `/recipe/community_${recipeId}` 
    : `/recipe/${recipeId}`;
  
  return (
    <Link 
      to={routePath}
      className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100 dark:border-gray-700 animate-fade-in"
    >
      {recipe.image || recipe.image_url ? (
        <div className="h-48 overflow-hidden">
          <img 
            src={isCommunityRecipe && recipe.image
              ? `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${recipe.image.startsWith('/') ? '' : '/'}${recipe.image}`
              : recipe.image_url || recipe.image || '/images/recipe-placeholder.svg'
            }
            alt={recipe.title || 'Recipe'}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/images/recipe-placeholder.svg';
            }}
          />
        </div>
      ) : (
        <div className="h-48 overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
          <img 
            src="/images/recipe-placeholder.svg"
            alt="Recipe placeholder"
            className="w-24 h-24 opacity-50"
          />
        </div>
      )}
      
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2 line-clamp-2">
          {recipe.title}
        </h3>
        
        {recipe.description && (
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
            {recipe.description}
          </p>
        )}
        
        <div className="flex flex-wrap gap-2 mb-3">
          {recipe.difficulty && (
            <span className="inline-flex items-center text-xs px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
              <ChefHat className="h-3 w-3 mr-1" />
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
        
        {recipe.rating > 0 && (
          <div className="flex items-center mb-3">
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            <span className="ml-1 text-sm text-gray-700 dark:text-gray-300">
              {recipe.rating.toFixed(1)}
            </span>
            {recipe.reviews && (
              <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">
                ({recipe.reviews.length} reviews)
              </span>
            )}
          </div>
        )}
        
        {user && showActions && (
          <div className="flex justify-end">
            <button
              onClick={handleSaveRecipe}
              className={`inline-flex items-center gap-1 text-sm font-medium rounded-md px-2 py-1 ${
                isSaved
                  ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              {isSaved ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Remove from Favorites
                </>
              ) : (
                <>
                  <Star className="h-4 w-4" />
                  Add to Favorites
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </Link>
  );
}

