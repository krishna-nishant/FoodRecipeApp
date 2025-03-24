"use client";

import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Send, Upload } from "lucide-react";
import { GlobalContext } from "../context";

export default function RecipeForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [cookingTime, setCookingTime] = useState("");
  const [servings, setServings] = useState("");
  const [difficulty, setDifficulty] = useState("Medium");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  const { user, submitCommunityRecipe } = useContext(GlobalContext);
  
  useEffect(() => {
    // Redirect if not logged in
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);
  
  // Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!user) {
        throw new Error("You must be logged in to create a recipe");
      }
      
      // Validate required fields
      if (!title.trim()) {
        throw new Error("Title is required");
      }
      
      if (!ingredients.trim()) {
        throw new Error("Ingredients are required");
      }
      
      if (!instructions.trim()) {
        throw new Error("Instructions are required");
      }
      
      if (!cookingTime || isNaN(parseInt(cookingTime)) || parseInt(cookingTime) <= 0) {
        throw new Error("Valid cooking time is required (must be a positive number)");
      }
      
      if (!servings || isNaN(parseInt(servings)) || parseInt(servings) <= 0) {
        throw new Error("Valid number of servings is required (must be a positive number)");
      }
      
      // Format ingredients and instructions as arrays
      const ingredientsArray = ingredients
        .split('\n')
        .map(item => item.trim())
        .filter(item => item !== '');
        
      if (ingredientsArray.length === 0) {
        throw new Error("At least one ingredient is required");
      }
        
      const instructionsArray = instructions
        .split('\n')
        .map(item => item.trim())
        .filter(item => item !== '');
        
      if (instructionsArray.length === 0) {
        throw new Error("At least one instruction step is required");
      }
        
      const tagsArray = tags
        ? tags
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag !== '')
        : [];
      
      const recipeData = {
        title,
        description: description.trim() || undefined,
        ingredients: ingredientsArray,
        instructions: instructionsArray,
        cookingTime: parseInt(cookingTime),
        servings: parseInt(servings),
        difficulty,
        tags: tagsArray.length > 0 ? tagsArray : undefined,
        image: image || undefined
      };
      
      const result = await submitCommunityRecipe(recipeData);
      
      if (result.error) {
        throw new Error(result.error);
      }

      // Reset the form fields
      setTitle("");
      setDescription("");
      setIngredients("");
      setInstructions("");
      setImage(null);
      setImagePreview(null);
      setCookingTime("");
      setServings("");
      setDifficulty("Medium");
      setTags("");

      navigate("/community-recipes"); // Redirect to the community page
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="py-8">
      <h1 className="page-heading">Share Your Recipe</h1>

      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 md:p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="form-label">
                Recipe Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a descriptive title"
                className="form-input"
                required
              />
            </div>
            
            <div>
              <label htmlFor="description" className="form-label">
                Short Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of your recipe"
                className="form-textarea"
                rows={2}
                required
              />
            </div>

            <div>
              <label htmlFor="ingredients" className="form-label">
                Ingredients
              </label>
              <textarea
                id="ingredients"
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                placeholder="List your ingredients (one per line)"
                className="form-textarea"
                required
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Example: 2 cups flour, 1 tsp salt, etc.
              </p>
            </div>

            <div>
              <label htmlFor="instructions" className="form-label">
                Instructions
              </label>
              <textarea
                id="instructions"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Describe how to prepare the recipe"
                className="form-textarea"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="cookingTime" className="form-label">
                  Cooking Time (minutes)
                </label>
                <input
                  type="number"
                  id="cookingTime"
                  value={cookingTime}
                  onChange={(e) => setCookingTime(e.target.value)}
                  placeholder="e.g. 30"
                  className="form-input"
                  min="1"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="servings" className="form-label">
                  Servings
                </label>
                <input
                  type="number"
                  id="servings"
                  value={servings}
                  onChange={(e) => setServings(e.target.value)}
                  placeholder="e.g. 4"
                  className="form-input"
                  min="1"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="difficulty" className="form-label">
                Difficulty Level
              </label>
              <select
                id="difficulty"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="form-select"
                required
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="tags" className="form-label">
                Tags (comma separated)
              </label>
              <input
                type="text"
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g. vegan, dessert, quick"
                className="form-input"
              />
            </div>
            
            <div>
              <label htmlFor="image" className="form-label">
                Recipe Image
              </label>
              <div className="mt-2">
                {imagePreview && (
                  <div className="mb-3">
                    <img 
                      src={imagePreview} 
                      alt="Recipe preview" 
                      className="w-full h-40 object-cover rounded-lg"
                    />
                  </div>
                )}
                <label className="flex items-center justify-center gap-2 w-full h-12 px-4 transition bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
                  <Upload className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Choose an image file</span>
                  <input
                    type="file"
                    id="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <button type="submit" className="form-button" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  Submit Recipe
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
