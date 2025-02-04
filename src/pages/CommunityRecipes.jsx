import React, { useContext } from "react";
import { GlobalContext } from "../context";

export default function CommunityRecipes() {
  const { communityRecipes } = useContext(GlobalContext); // Access community recipes from context

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
        Community Recipes
      </h2>

      {communityRecipes.length === 0 ? (
        <p className="text-gray-700 dark:text-white">
          No recipes submitted yet. Be the first to add a recipe!
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {communityRecipes.map((recipe, index) => (
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
