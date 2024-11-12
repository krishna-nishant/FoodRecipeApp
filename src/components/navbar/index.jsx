import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { GlobalContext } from "../../context";

export default function Navbar() {
  const { searchParam, setSearchParam, handleSubmit } =
    useContext(GlobalContext);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white dark:bg-gray-800 shadow-md py-4">
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
            className="px-5 py-2 w-80 rounded-full border-2 border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:border-red-400 shadow-sm transition duration-300 ease-in-out"
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
          onClick={() => {
            // Toggle dark mode
            document.body.classList.toggle("dark");
            // Save dark mode preference to localStorage
            const currentTheme = document.body.classList.contains("dark")
              ? "dark"
              : "light";
            localStorage.setItem("theme", currentTheme);
          }}
          className="ml-5 px-4 py-2 bg-gray-800 text-white rounded-full dark:bg-gray-200 dark:text-gray-800"
        >
          {document.body.classList.contains("dark")
            ? "Light Mode"
            : "Dark Mode"}
        </button>
      </div>
    </nav>
  );
}
