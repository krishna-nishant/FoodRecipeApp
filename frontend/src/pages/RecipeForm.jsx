import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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
      const response = await fetch("http://localhost:5000/api/recipes/community", {
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
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
        Add Your Recipe
      </h2>

      {error && <p className="text-red-500">{error}</p>}

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
      >
        <div className="mb-4">
          <label
            htmlFor="title"
            className="block text-gray-700 dark:text-white mb-2"
          >
            Recipe Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter recipe title"
            className="w-full px-4 py-2 border rounded-md text-gray-700 dark:text-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-red-400"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="ingredients"
            className="block text-gray-700 dark:text-white mb-2"
          >
            Ingredients
          </label>
          <textarea
            id="ingredients"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            placeholder="Enter ingredients"
            className="w-full px-4 py-2 border rounded-md text-gray-700 dark:text-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-red-400"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="instructions"
            className="block text-gray-700 dark:text-white mb-2"
          >
            Instructions
          </label>
          <textarea
            id="instructions"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="Enter instructions"
            className="w-full px-4 py-2 border rounded-md text-gray-700 dark:text-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-red-400"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-red-500 hover:bg-red-600 text-white rounded-md mt-4"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Recipe"}
        </button>
      </form>
    </div>
  );
}
