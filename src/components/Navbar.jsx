import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { GlobalContext } from "../context";

export default function Navbar() {
  const {
    searchParam,
    setSearchParam,
    handleSubmit,
    isDarkMode,
    setIsDarkMode,
  } = useContext(GlobalContext);

  return (
    <nav className="bg-white dark:bg-gray-800 fixed max-w-[1200px] mx-auto">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <h2 className="text-3xl font-bold text-gray-700 dark:text-white">
          <NavLink to="/">FoodRecipe</NavLink>
        </h2>

        {/* Search Form */}
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <input
            type="text"
            name="search"
            value={searchParam}
            onChange={(e) => setSearchParam(e.target.value)}
            placeholder="Search recipes..."
            className="px-5 py-2 w-80 rounded-full border-2 border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-doubled focus:border-red-400 shadow-sm transition duration-300 ease-in-out"
          />
          <button
            type="submit"
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-5 rounded-full transition duration-300"
          >
            Search
          </button>
        </form>

        {/* Navbar Links */}
        <ul className="flex space-x-5 font-medium text-gray-700 dark:text-white">
          <li>
            <NavLink
              to="/"
              className="hover:text-red-500 transition"
              activeClassName="text-red-500"
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/favorites"
              className="hover:text-red-500 transition"
              activeClassName="text-red-500"
            >
              Favorites
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/submit-recipe"
              className="hover:text-red-500 transition"
              activeClassName="text-red-500"
            >
              Submit Recipe
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/community-recipes"
              className="hover:text-red-500 transition"
              activeClassName="text-red-500"
            >
              Community Recipes
            </NavLink>
          </li>
        </ul>

        {/* Dark Mode Toggle Button */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-2 rounded bg-gray-200 dark:bg-gray-700"
        >
          {isDarkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>
    </nav>
  );
}
