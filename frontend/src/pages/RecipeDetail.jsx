import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { GlobalContext } from '../context';
import { ChefHat, Clock, Users, Star, StarOff, ArrowLeft } from 'lucide-react';
import RecipeItem from '../components/RecipeItem';

export default function RecipeDetail() {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState(null);
  const [relatedRecipes, setRelatedRecipes] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(false);
  
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, saveRecipe, isRecipeInFavorites, handleAddToFavorite } = useContext(GlobalContext);
  
  // Check if recipe is in saved recipes or favorites
  const isSaved = user?.savedRecipes?.some(savedId => 
    savedId === id || savedId._id === id
  ) || isRecipeInFavorites(recipe?._id || id);
  
  useEffect(() => {
    async function fetchRecipe() {
      try {
        setLoading(true);
        setError(null);
        const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
        
        // Check if it's a community recipe or external recipe
        if (id.startsWith('community_')) {
          const communityId = id.replace('community_', '');
          
          try {
            const response = await fetch(`${API_URL}/recipes/community/${communityId}`);
            
            if (!response.ok) {
              throw new Error('Recipe not found');
            }
            
            const data = await response.json();
            
            // Ensure the community recipe has the correct structure and isCommunity flag
            const standardizedRecipe = {
              ...data,
              _id: data._id,
              isCommunity: true,
              image: data.image,
              cooking_time: data.cookingTime || data.cooking_time || 30,
              difficulty: data.difficulty || 'Medium',
              tags: Array.isArray(data.tags) ? data.tags : [],
              reviews: Array.isArray(data.reviews) ? data.reviews : [],
              ingredients: Array.isArray(data.ingredients) ? data.ingredients : [],
              instructions: Array.isArray(data.instructions) ? data.instructions : []
            };
            
            setRecipe(standardizedRecipe);
          } catch (err) {
            console.error('Error fetching community recipe:', err);
            throw new Error('Failed to load community recipe. Please try again later.');
          }
        } else {
          // Use the Forkify API to fetch recipe details
          try {
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
            
            // Standardize the API recipe data structure
            const apiRecipe = data.data.recipe;
            const standardizedRecipe = {
              ...apiRecipe,
              _id: apiRecipe.id, // Use API id as _id for consistency
              isCommunity: false,
              image: apiRecipe.image_url,
              cooking_time: apiRecipe.cooking_time,
              difficulty: apiRecipe.difficulty || 'Medium',
              tags: apiRecipe.tags || [],
              reviews: apiRecipe.reviews || [],
              ingredients: apiRecipe.ingredients.map(ing => ({
                quantity: ing.quantity,
                unit: ing.unit,
                description: ing.description
              }))
            };
            
            setRecipe(standardizedRecipe);
          } catch (err) {
            console.error('Error fetching Forkify recipe:', err);
            throw new Error('Failed to load recipe. Please try again later.');
          }
        }
        
        // After fetching recipe, get related recipes
        if (recipe) {
          fetchRelatedRecipes(recipe);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchRecipe();
  }, [id]);
  
  // Fetch related recipes based on tags or categories
  const fetchRelatedRecipes = async (currentRecipe) => {
    if (!currentRecipe) return;
    
    try {
      setLoadingRelated(true);
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      
      // Only fetch related recipes for community recipes
      if (currentRecipe._id) {
        // Extract tags from the current recipe
        const recipeTags = currentRecipe.tags && typeof currentRecipe.tags === 'string' 
          ? currentRecipe.tags.split(',').map(tag => tag.trim())
          : currentRecipe.tags || [];
          
        // If no tags, use difficulty as fallback
        const queryParams = new URLSearchParams();
        
        if (recipeTags.length > 0) {
          queryParams.append('tags', recipeTags[0]); // Use first tag for related
        } else if (currentRecipe.difficulty) {
          queryParams.append('difficulty', currentRecipe.difficulty);
        }
        
        const response = await fetch(`${API_URL}/recipes/community?${queryParams}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch related recipes');
        }
        
        const data = await response.json();
        
        // Filter out the current recipe and limit to 3 related recipes
        const filtered = data
          .filter(item => item._id !== currentRecipe._id)
          .slice(0, 3);
          
        setRelatedRecipes(filtered);
      } else {
        // For external recipes, fetch from Forkify API
        const response = await fetch(
          `https://forkify-api.herokuapp.com/api/v2/recipes?search=${currentRecipe.title}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch related recipes');
        }
        
        const data = await response.json();
        
        // Filter out the current recipe and limit to 3 related recipes
        const filtered = data.data.recipes
          .filter(item => item.id !== currentRecipe.id)
          .slice(0, 3);
          
        setRelatedRecipes(filtered);
      }
    } catch (error) {
      console.error('Error fetching related recipes:', error);
    } finally {
      setLoadingRelated(false);
    }
  };
  
  // Check if user has already reviewed this recipe
  const hasReviewed = user && recipe?.reviews?.some(
    review => review.user === user._id
  );
  
  // Find user's review if exists
  const userReview = user && recipe?.reviews?.find(
    review => review.user === user._id
  );
  
  const handleSaveRecipe = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    try {
      if (recipe.source_url || recipe.publisher) {
        // For external recipes, use favorites
        handleAddToFavorite(recipe);
      } else {
        // For community recipes, use API
        const result = await saveRecipe(id);
        
        if (result.error) {
          throw new Error(result.error);
        }
      }
      
      // Success notification is now handled in the saveRecipe function in context
    } catch (error) {
      console.error(error);
      // Error notification is now handled in the saveRecipe function in context
    }
  };
  
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (rating === 0) {
      setReviewError('Please select a rating');
      return;
    }
    
    // Check if this is an external recipe (has source_url or publisher)
    if (recipe.source_url || recipe.publisher) {
      setReviewError("Reviews can only be submitted for community recipes, not external recipes.");
      return;
    }
    
    try {
      setIsSubmittingReview(true);
      setReviewError(null);
      
      // Use the recipe ID directly from the recipe object instead of the URL parameter
      const recipeId = recipe._id;
      
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      const reviewUrl = `${API_URL}/recipes/community/${recipeId}/reviews`;
      
      const response = await fetch(reviewUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          rating,
          text: reviewText
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to submit review');
      }
      
      const updatedRecipe = await response.json();
      setRecipe(updatedRecipe.recipe);
      setReviewText('');
      setRating(0);
      
    } catch (error) {
      setReviewError(error.message);
    } finally {
      setIsSubmittingReview(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <ChefHat className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-4 text-lg font-medium text-gray-700 dark:text-gray-300">Loading recipe details...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="max-w-3xl mx-auto py-8 min-h-[60vh]">
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 mb-6">
          {error}
        </div>
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-primary hover:text-primary/80"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Go Back
        </button>
      </div>
    );
  }
  
  if (!recipe) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <p className="text-gray-700 dark:text-gray-300">Recipe not found. Please try another one.</p>
    </div>
  );
  
  return (
    <div className="max-w-4xl mx-auto py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary mb-6"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back to recipes
      </button>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md border border-gray-100 dark:border-gray-700">
        {recipe.image && (
          <div className="h-72 sm:h-96 overflow-hidden">
            <img 
              src={recipe.isCommunity
                ? `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${recipe.image.startsWith('/') ? '' : '/'}${recipe.image}`
                : recipe.image_url || recipe.image || '/images/recipe-placeholder.svg'
              }
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
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4 font-playfair">
            {recipe.title}
          </h1>
          
          {recipe.description && (
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {recipe.description}
            </p>
          )}
          
          {/* Add save button */}
          {user && (
            <button
              onClick={handleSaveRecipe}
              className={`mb-6 flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
                isSaved 
                  ? "bg-primary/10 text-primary" 
                  : "bg-primary text-white hover:bg-primary/90"
              }`}
            >
              {isSaved ? (
                <>
                  <Star className="h-5 w-5 fill-primary" />
                  Saved to Favorites
                </>
              ) : (
                <>
                  <StarOff className="h-5 w-5" />
                  Save Recipe
                </>
              )}
            </button>
          )}
          
          <div className="flex flex-wrap gap-3 mb-6">
            {recipe.difficulty && (
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <ChefHat className="h-4 w-4 mr-1" />
                <span>{recipe.difficulty}</span>
              </div>
            )}
            
            {recipe.cooking_time && (
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Clock className="h-4 w-4 mr-1" />
                <span>{recipe.cooking_time} minutes</span>
              </div>
            )}
            
            {recipe.servings && (
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Users className="h-4 w-4 mr-1" />
                <span>{recipe.servings} servings</span>
              </div>
            )}
          </div>
          
          {recipe.tags && recipe.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {recipe.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">Ingredients</h2>
            <ul className="space-y-2">
              {recipe.ingredients?.map((ingredient, index) => {
                // Format ingredient based on whether it's an object or string
                const ingredientText = typeof ingredient === 'object' && ingredient !== null
                  ? `${ingredient.quantity || ''} ${ingredient.unit || ''} ${ingredient.description || ''}`.trim()
                  : ingredient;
                
                return (
                  <li key={index} className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span className="text-gray-600 dark:text-gray-400">{ingredientText}</span>
                  </li>
                );
              })}
            </ul>
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">Instructions</h2>
            <ol className="space-y-4">
              {recipe.instructions?.map((instruction, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-primary mr-2">{index + 1}.</span>
                  <span className="text-gray-600 dark:text-gray-400">{instruction}</span>
                </li>
              ))}
            </ol>
          </div>
          
          {/* Source information for external recipes */}
          {(recipe.source_url || recipe.publisher) && (
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-gray-700 dark:text-gray-300 mb-2">
                Source: {recipe.publisher || "External recipe"}
              </p>
              {recipe.source_url && (
                <a 
                  href={recipe.source_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-primary hover:text-primary/80"
                >
                  View original recipe
                  <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                  </svg>
                </a>
              )}
            </div>
          )}
          
          {/* Reviews section - only for community recipes */}
          {!recipe.source_url && !recipe.publisher && recipe._id && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Reviews</h2>
              
              {user && !hasReviewed && (
                <form onSubmit={handleReviewSubmit} className="mb-6">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Rating
                    </label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          className="focus:outline-none"
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setRating(star)}
                        >
                          <Star
                            className={`h-6 w-6 ${
                              star <= (hoverRating || rating)
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-300 dark:text-gray-600'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Review
                    </label>
                    <textarea
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                      rows="4"
                      placeholder="Share your thoughts about this recipe..."
                    />
                  </div>
                  
                  {reviewError && (
                    <p className="text-red-500 text-sm mb-4">{reviewError}</p>
                  )}
                  
                  <button
                    type="submit"
                    disabled={isSubmittingReview}
                    className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              )}
              {user && hasReviewed && (
                <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <p className="text-green-700 dark:text-green-300">You've already reviewed this recipe. Thank you for your feedback!</p>
                </div>
              )}
              {!user && (
                <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <p className="text-blue-700 dark:text-blue-300 mb-2">Please login to leave a review.</p>
                  <Link to="/login" className="inline-block bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90">
                    Login
                  </Link>
                </div>
              )}
              
              {recipe.reviews && recipe.reviews.length > 0 ? (
                <div className="space-y-4">
                  {recipe.reviews.map((review, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg"
                    >
                      <div className="flex items-center mb-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-gray-300 dark:text-gray-600'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">{review.text}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No reviews yet.</p>
              )}
            </div>
          )}
          
          {/* Display notice for external recipes */}
          {(recipe.source_url || recipe.publisher) && (
            <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p className="text-gray-700 dark:text-gray-300">
                Reviews are only available for community recipes. This is an external recipe from {recipe.publisher || "an external source"}.
              </p>
            </div>
          )}
          
          {/* Related recipes section */}
          {relatedRecipes.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Related Recipes</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedRecipes.map((relatedRecipe) => (
                  <RecipeItem 
                    key={relatedRecipe._id || relatedRecipe.id} 
                    recipe={relatedRecipe} 
                    showActions={false} 
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 