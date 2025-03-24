import { createContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { notificationSystem } from "../components/Notification"

export const GlobalContext = createContext(null)

export default function GlobalState({ children }) {
  const [searchParam, setSearchParam] = useState("")
  const [loading, setLoading] = useState(false)
  const [recipeList, setRecipeList] = useState([])
  const [recipeDetailsData, setRecipeDetailsData] = useState(null)
  const [favoritesList, setFavoritesList] = useState([]) // State for favorites
  const [communityRecipes, setCommunityRecipes] = useState([]) // State for community recipes
  const [user, setUser] = useState(null) // User state
  const [authLoading, setAuthLoading] = useState(false) // Auth loading state
  const [authError, setAuthError] = useState(null) // Auth error state
  const navigate = useNavigate()

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  // Check if user is already logged in
  useEffect(() => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'))
      if (userInfo) {
        setUser(userInfo)
      }
    } catch (error) {
      console.error('Error loading user from localStorage:', error)
      // Clear potentially corrupted data
      localStorage.removeItem('userInfo')
    }
  }, [])

  // Load favorites and community recipes from local storage on mount
  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem("favoritesList");
      if (storedFavorites) {
        setFavoritesList(JSON.parse(storedFavorites));
      }

      const storedCommunityRecipes = localStorage.getItem("communityRecipes");
      if (storedCommunityRecipes) {
        setCommunityRecipes(JSON.parse(storedCommunityRecipes));
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error)
      // Clear potentially corrupted data
      localStorage.removeItem("favoritesList")
      localStorage.removeItem("communityRecipes")
    }
  }, []);

  // Save favorites to local storage whenever favoritesList changes
  useEffect(() => {
    if (favoritesList.length > 0) {
      localStorage.setItem("favoritesList", JSON.stringify(favoritesList));
    }
  }, [favoritesList]);

  // Save community recipes to local storage whenever communityRecipes changes
  useEffect(() => {
    if (communityRecipes.length > 0) {
      localStorage.setItem("communityRecipes", JSON.stringify(communityRecipes));
    }
  }, [communityRecipes]);

  // Register user
  const registerUser = async (userData) => {
    setAuthLoading(true)
    setAuthError(null)
    
    try {
      const response = await fetch(`${API_URL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Registration failed')
      }
      
      localStorage.setItem('userInfo', JSON.stringify(data))
      setUser(data)
      notificationSystem.show('Registration successful! Welcome to CulinaryDelight.', 'success')
      navigate('/')
    } catch (error) {
      setAuthError(error.message)
      notificationSystem.show(error.message, 'error')
    } finally {
      setAuthLoading(false)
    }
  }
  
  // Login user
  const loginUser = async (userData) => {
    setAuthLoading(true)
    setAuthError(null)
    
    try {
      const response = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Login failed')
      }
      
      localStorage.setItem('userInfo', JSON.stringify(data))
      setUser(data)
      notificationSystem.show('Welcome back!', 'success')
      navigate('/')
    } catch (error) {
      setAuthError(error.message)
      notificationSystem.show(error.message, 'error')
    } finally {
      setAuthLoading(false)
    }
  }
  
  // Logout user
  const logoutUser = () => {
    localStorage.removeItem('userInfo')
    setUser(null)
    notificationSystem.show('You have been logged out successfully', 'info')
    navigate('/')
  }
  
  // Save recipe to user's favorites
  const saveRecipe = async (recipeId) => {
    if (!user) {
      navigate('/login');
      notificationSystem.show('Please log in to save recipes', 'info');
      return { error: 'Not authenticated' };
    }
    
    if (!recipeId) {
      notificationSystem.show('Invalid recipe ID', 'error');
      return { error: 'Invalid recipe ID' };
    }
    
    try {
      const response = await fetch(`${API_URL}/users/save-recipe/${recipeId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        // Don't show error for already saved recipes
        if (response.status === 400 && data.error === 'Recipe already saved') {
          notificationSystem.show('Recipe already in your favorites', 'info');
          return { savedRecipes: user.savedRecipes };
        }
        throw new Error(data.error || 'Failed to save recipe');
      }
      
      // Update user info in state
      const updatedUser = { ...user, savedRecipes: data.savedRecipes };
      setUser(updatedUser);
      localStorage.setItem('userInfo', JSON.stringify(updatedUser));
      
      notificationSystem.show('Recipe saved to your favorites', 'success');
      return data;
    } catch (error) {
      console.error('Error saving recipe:', error);
      notificationSystem.show(error.message, 'error');
      return { error: error.message };
    }
  };
  
  // Remove recipe from user's favorites
  const removeRecipe = async (recipeId) => {
    if (!user) {
      notificationSystem.show('Please log in to manage your favorites', 'info');
      return { error: 'Not authenticated' };
    }
    
    if (!recipeId) {
      notificationSystem.show('Invalid recipe ID', 'error');
      return { error: 'Invalid recipe ID' };
    }
    
    try {
      const response = await fetch(`${API_URL}/users/remove-recipe/${recipeId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        // Don't show error for recipes not in favorites
        if (response.status === 400 && data.error === 'Recipe not in collection') {
          notificationSystem.show('Recipe not in your favorites', 'info');
          return { savedRecipes: user.savedRecipes };
        }
        throw new Error(data.error || 'Failed to remove recipe');
      }
      
      // Update user info in state
      const updatedUser = { ...user, savedRecipes: data.savedRecipes };
      setUser(updatedUser);
      localStorage.setItem('userInfo', JSON.stringify(updatedUser));
      
      notificationSystem.show('Recipe removed from your favorites', 'info');
      return data;
    } catch (error) {
      console.error('Error removing recipe:', error);
      notificationSystem.show(error.message, 'error');
      return { error: error.message };
    }
  };
  
  // Get user's saved recipes
  const fetchSavedRecipes = async () => {
    if (!user) {
      return []
    }
    
    try {
      const response = await fetch(`${API_URL}/users/saved-recipes`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        },
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch saved recipes')
      }
      
      return data
    } catch (error) {
      console.error(error)
      return []
    }
  }

  // Handle recipe search submit
  async function handleSubmit(event) {
    if (event && event.preventDefault) {
      event.preventDefault();
    }
    
    if (!searchParam.trim()) {
      return;
    }
    
    try {
      setLoading(true);
      // Clear previous results to avoid UI jumps
      setRecipeList([]);
      
      const res = await fetch(
        `https://forkify-api.herokuapp.com/api/v2/recipes?search=${searchParam}`
      );
      const data = await res.json();
      
      if (data?.data?.recipes) {
        setRecipeList(data.data.recipes);
        navigate("/");
      } else {
        // Set empty array if no recipes found
        setRecipeList([]);
      }
    } catch (error) {
      console.error('Error searching recipes:', error);
      setRecipeList([]);
    } finally {
      setLoading(false);
      setSearchParam("");
    }
  }

  // Add or remove recipe from favorites
  function handleAddToFavorite(getCurrentItem) {
    let updatedFavorites = [...favoritesList];
    
    // Get all possible ID values from the recipe
    const itemId = getCurrentItem.id || getCurrentItem._id || getCurrentItem.recipe_id;
    
    // Find the item with any of the possible ID matches
    const index = updatedFavorites.findIndex(
      item => {
        // Compare with all possible ID forms
        return (item.id === itemId || 
                item._id === itemId || 
                item.recipe_id === itemId ||
                itemId === item.id ||
                itemId === item._id ||
                itemId === item.recipe_id);
      }
    );

    if (index === -1) {
      // Ensure the recipe has _id field for proper navigation from favorites
      const recipeWithProperIds = {
        ...getCurrentItem,
        // Add _id field if it doesn't exist (for consistency with community recipes)
        _id: getCurrentItem._id || getCurrentItem.id || getCurrentItem.recipe_id,
        isFavorited: true
      };
      updatedFavorites.push(recipeWithProperIds); // Add to favorites with proper ID fields
      notificationSystem.show('Recipe added to favorites!', 'success');
    } else {
      updatedFavorites.splice(index, 1); // Remove from favorites
      notificationSystem.show('Recipe removed from favorites', 'info');
    }

    setFavoritesList(updatedFavorites);
  }

  // Check if recipe is in favorites
  function isRecipeInFavorites(recipeId) {
    if (!recipeId) return false;
    
    return favoritesList.some(
      item => (item.id === recipeId || item._id === recipeId || item.recipe_id === recipeId)
    );
  }

  // Add a recipe to the community list
  function addRecipe(newRecipe) {
    setCommunityRecipes((prevRecipes) => [...prevRecipes, newRecipe]);
  }

  // Fetch community recipes with filters
  const fetchCommunityRecipes = async (filters = {}) => {
    // Community recipes should manage their own loading state
    try {
      // Build query string from filters
      const queryParams = new URLSearchParams();
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.tags) queryParams.append('tags', filters.tags);
      if (filters.difficulty) queryParams.append('difficulty', filters.difficulty);
      if (filters.maxTime) queryParams.append('maxTime', filters.maxTime);
      if (filters.minRating) queryParams.append('minRating', filters.minRating);
      if (filters.sort) queryParams.append('sort', filters.sort);

      const response = await fetch(`${API_URL}/recipes/community?${queryParams}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch recipes');
      }
      
      const data = await response.json();
      setCommunityRecipes(data);
      return data;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  // Submit a new community recipe
  const submitCommunityRecipe = async (recipeData) => {
    if (!user) {
      navigate('/login');
      notificationSystem.show('Please login to submit a recipe', 'info');
      return { error: 'Please login to submit a recipe' };
    }
    
    try {
      // Create FormData for file upload
      const formData = new FormData();
      
      Object.keys(recipeData).forEach(key => {
        if (key === 'image') {
          if (recipeData.image) {
            formData.append('image', recipeData.image);
          }
        } else if (Array.isArray(recipeData[key])) {
          formData.append(key, JSON.stringify(recipeData[key]));
        } else {
          formData.append(key, recipeData[key]);
        }
      });
      
      const response = await fetch(`${API_URL}/recipes/community`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`
        },
        body: formData,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit recipe');
      }
      
      // Add to community recipes
      setCommunityRecipes(prevRecipes => [...prevRecipes, data]);
      notificationSystem.show('Your recipe has been submitted successfully!', 'success');
      
      return data;
    } catch (error) {
      notificationSystem.show(error.message, 'error');
      return { error: error.message };
    }
  };

  return (
    <GlobalContext.Provider
      value={{
        searchParam,
        loading,
        recipeList,
        setSearchParam,
        handleSubmit,
        recipeDetailsData,
        setRecipeDetailsData,
        handleAddToFavorite,
        isRecipeInFavorites,
        favoritesList,
        communityRecipes,
        addRecipe,
        // Auth
        user,
        authLoading,
        authError,
        registerUser,
        loginUser,
        logoutUser,
        // User recipes
        saveRecipe,
        removeRecipe,
        fetchSavedRecipes,
        // Community recipes
        fetchCommunityRecipes,
        submitCommunityRecipe
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

