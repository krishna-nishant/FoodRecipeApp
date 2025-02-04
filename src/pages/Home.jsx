import { useContext } from "react";
import { GlobalContext } from "../context";
import RecipeItem from "../components/RecipeItem";

export default function Home() {
  const { recipeList, loading, searchParam } = useContext(GlobalContext);

  if (loading)
    return (
      <div className="flex justify-center items-center mt-20">
        <div className="loading-spinner"></div>
        <p className="text-2xl font-semibold text-gray-700 dark:text-gray-300 ml-3">
          Loading... Please wait!
        </p>
      </div>
    );

  return (
    <div className="text-center py-10 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 p-4 rounded-lg shadow-md">
      {recipeList && recipeList.length > 0 ? (
        <div className="flex flex-wrap justify-center gap-10">
          {recipeList.map((item) => (
            <RecipeItem item={item} key={item.id} />
          ))}
        </div>
      ) : (
        <div className="mt-20">
          <h2 className="text-4xl font-semibold text-gray-800 dark:text-gray-200">
            {searchParam ? "No Recipes Found" : "Discover Delicious Recipes!"}
          </h2>
          <p className="text-lg mt-3 text-gray-600 dark:text-gray-400">
            {searchParam
              ? "Try searching with different keywords."
              : "Explore our collection by searching for a recipe above!"}
          </p>
          <img
            src="/img.jpg"
            alt="Empty search illustration"
            className="w-96 mx-auto mt-8"
          />
        </div>
      )}
    </div>
  );
}