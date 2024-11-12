import { useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { GlobalContext } from "../../context";
import { FaArrowLeft, FaHeart, FaHeartBroken } from "react-icons/fa";
import "./index.css"; // Import the custom styles

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
      <button onClick={() => navigate(-1)} className="back-button">
        <FaArrowLeft /> Back
      </button>
      <div className="container mx-auto py-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Recipe Image */}
        <div className="order-2 lg:order-none flex justify-center items-center">
          <div className="recipe-image-container">
            <img
              src={recipeDetailsData?.recipe?.image_url}
              className="recipe-image"
              alt="Recipe"
            />
          </div>
        </div>

        {/* Recipe Details */}
        <div className="recipe-details">
          <span className="text-base font-semibold text-cyan-700 uppercase">
            {recipeDetailsData?.recipe?.publisher}
          </span>
          <h3 className="text-3xl font-extrabold text-gray-800">
            {recipeDetailsData?.recipe?.title}
          </h3>

          {/* Add to Favorites Button */}
          <button
            onClick={() => handleAddToFavorite(recipeDetailsData?.recipe)}
            className="fav-button"
          >
            {favoritesList &&
            favoritesList.length > 0 &&
            favoritesList.findIndex(
              (item) => item.id === recipeDetailsData?.recipe?.id
            ) !== -1 ? (
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
            <h4 className="text-2xl font-semibold text-gray-800 mb-3 dark:text-white">
              Ingredients
            </h4>
            <ul className="ingredients-list">
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
          <div className="mt-6 flex flex-col gap-1">
            <span className="text-sm font-medium text-gray-700 dark:text-white">
              Servings: {recipeDetailsData?.recipe?.servings}
            </span>
            <span className="text-sm font-medium text-gray-700 dark:text-white">
              Cooking Time: {recipeDetailsData?.recipe?.cooking_time} mins
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
