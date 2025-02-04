import { Link } from "react-router-dom";

export default function RecipeItem({ item }) {
  return (
    <div className="flex flex-col w-80 overflow-hidden p-6 bg-white shadow-lg gap-5 border border-gray-200 rounded-2xl transform transition duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-gray-300 card dark:bg-gray-800 text-black dark:text-white">
      <div className="h-44 flex justify-center overflow-hidden items-center rounded-xl bg-gray-100">
        <img
          src={item?.image_url}
          alt="recipe item"
          className="w-full h-full object-cover transition-transform duration-500 ease-in-out transform hover:scale-110"
        />
      </div>
      <div>
        <span className="text-sm text-red-500 font-semibold">
          {item?.publisher}
        </span>
        <h3 className="font-bold text-xl truncate text-gray-800 dark:bg-gray-800 dark:text-white mt-2">
          {item?.title}
        </h3>
        <Link
          to={`/recipe-item/${item?.id}`}
          className="text-sm py-2 px-6 rounded-lg uppercase font-semibold tracking-wider inline-block mt-4 shadow-md bg-red-500 text-white hover:bg-red-600 transition-colors duration-300"
        >
          Recipe Details
        </Link>
      </div>
    </div>
  );
}
