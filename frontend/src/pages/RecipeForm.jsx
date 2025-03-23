"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Send } from "lucide-react";

export default function RecipeForm() {
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const newRecipe = { title, ingredients, instructions };

    try {
      const API_URL =
        process.env.REACT_APP_API_URL || "http://localhost:5000/api";
      const response = await fetch(`${API_URL}/recipes/community`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newRecipe),
      });

      if (!response.ok) {
        throw new Error("Failed to submit recipe");
      }

      // Reset the form fields
      setTitle("");
      setIngredients("");
      setInstructions("");

      navigate("/community-recipes"); // Redirect to the community page
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

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
