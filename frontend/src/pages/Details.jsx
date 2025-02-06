import { useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { GlobalContext } from "../context";
import { FaArrowLeft, FaHeart, FaHeartBroken } from "react-icons/fa";

export default function Details() {
  const { id } = useParams();
  const {
    recipeDetailsData,
    setRecipeDetailsData,
    favoritesList,
    handleAddToFavorite,
  } = useContext(GlobalContext);

  const navigate = useNavigate();

  useEffect(() => {
    async function getRecipeDetails() {
      const response = await fetch(
        `https://forkify-api.herokuapp.com/api/v2/recipes/${id}`
      );
      const data = await response.json();
      if (data?.data) {
        setRecipeDetailsData(data?.data);
      }
    }
    getRecipeDetails();
  }, [id, setRecipeDetailsData]);

  return (
    <>
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 px-4 py-2 bg-blue-400 hover:bg-blue-600 rounded-md text-white transition-transform transform hover:scale-105 mb-5"
      >
        <FaArrowLeft /> Back
      </button>

      <div className="container mx-auto py-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Recipe Image */}
        <div className="order-2 lg:order-none flex justify-center items-center">
          <div className="w-full h-full overflow-hidden rounded-md">
            <img
              src={recipeDetailsData?.recipe?.image_url}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              alt="Recipe"
            />
          </div>
        </div>

        {/* Recipe Details */}
        <div className="flex flex-col gap-4 px-5">
          <span className="text-base font-semibold text-cyan-700 uppercase">
            {recipeDetailsData?.recipe?.publisher}
          </span>
          <h3 className="text-3xl font-extrabold text-gray-800 dark:text-white">
            {recipeDetailsData?.recipe?.title}
          </h3>

          {/* Add to Favorites Button */}
          <button
            onClick={() => handleAddToFavorite(recipeDetailsData?.recipe)}
            className="flex items-center gap-2 px-6 py-3 rounded-lg text-white font-semibold uppercase bg-gradient-to-r from-indigo-500 to-purple-500 shadow-md transition-transform transform hover:scale-105"
          >
            {favoritesList?.some(
              (item) => item.id === recipeDetailsData?.recipe?.id
            ) ? (
              <>
                <FaHeartBroken className="text-xl" />
                Remove from Favorites
              </>
            ) : (
              <>
                <FaHeart className="text-xl" />
                Add to Favorites
              </>
            )}
          </button>

          {/* Ingredients */}
          <div>
            <h4 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3">
              Ingredients
            </h4>
            <ul className="pl-5 list-disc text-lg text-gray-700 dark:text-white">
              {recipeDetailsData?.recipe?.ingredients.map(
                (ingredient, index) => (
                  <li key={index}>
                    <span className="font-semibold">
                      {ingredient.quantity} {ingredient.unit}{" "}
                    </span>
                    {ingredient.description}
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Additional Info */}
          <div className="mt-6 flex flex-col gap-1 text-gray-700 dark:text-white">
            <span className="text-sm font-medium">
              Servings: {recipeDetailsData?.recipe?.servings}
            </span>
            <span className="text-sm font-medium">
              Cooking Time: {recipeDetailsData?.recipe?.cooking_time} mins
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
