import React, { useEffect, useState } from "react";

export default function CommunityRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchRecipes() {
      try {
        const response = await fetch("http://localhost:5000/api/recipes/community");
        if (!response.ok) {
          throw new Error("Failed to fetch recipes");
        }
        const data = await response.json();
        setRecipes(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchRecipes();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
        Community Recipes
      </h2>

      {loading && (
        <p className="text-gray-700 dark:text-white">Loading recipes...</p>
      )}
      {error && <p className="text-red-500">{error}</p>}

      {recipes.length === 0 && !loading ? (
        <p className="text-gray-700 dark:text-white">
          No recipes submitted yet. Be the first to add a recipe!
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recipes.map((recipe, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg"
            >
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                {recipe.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Ingredients: {recipe.ingredients}
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Instructions: {recipe.instructions}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
