import { useContext } from "react";
import RecipeItem from "../components/RecipeItem";
import { GlobalContext } from "../context";

export default function Favorites() {
  const { favoritesList } = useContext(GlobalContext);

  return (
    <div className="py-12 container mx-auto flex flex-wrap justify-center gap-10 ">
      {favoritesList && favoritesList.length > 0 ? (
        favoritesList.map((item) => (
          <RecipeItem key={item.id} item={item} />
        ))
      ) : (
        <div className="flex flex-col items-center">
          <p className="lg:text-4xl text-2xl text-center text-gray-700 font-extrabold">
            Nothing is added in favorites.
          </p>
          <p className="mt-2 text-gray-500 lg:text-lg text-sm text-center">
            Start exploring and add your favorite recipes!
          </p>
        </div>
      )}
    </div>
  );
}
