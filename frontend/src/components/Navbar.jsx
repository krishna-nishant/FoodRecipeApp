import { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import { GlobalContext } from "../context";
import { FaSearch, FaSun, FaMoon, FaBars, FaTimes } from "react-icons/fa";

export default function Navbar() {
  const {
    searchParam,
    setSearchParam,
    handleSubmit,
    isDarkMode,
    setIsDarkMode,
  } = useContext(GlobalContext);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white dark:bg-gray-800 fixed top-0 left-0 right-0 shadow-md z-50">
      <div className="max-w-[1100px] mx-auto flex justify-between items-center py-3 px-4">
        {/* Logo */}
        <h2 className="text-2xl font-bold text-gray-700 dark:text-white">
          <NavLink to="/">FoodRecipe</NavLink>
        </h2>

        {/* Search Bar (Always Visible) */}
        <form onSubmit={handleSubmit} className="relative w-40 sm:w-56 md:w-64">
          <input
            type="text"
            name="search"
            value={searchParam}
            onChange={(e) => setSearchParam(e.target.value)}
            placeholder="Search..."
            className="w-full px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-red-400 pr-10 transition"
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
          >
            <FaSearch size={16} />
          </button>
        </form>

        {/* Navbar Links & Buttons */}
        <div className="flex items-center space-x-5">
          {/* Navbar Links (Hidden on Mobile) */}
          <ul className="hidden md:flex space-x-5 font-medium text-gray-700 dark:text-white">
            <li>
              <NavLink to="/" className="hover:text-red-500 transition">
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/favorites"
                className="hover:text-red-500 transition"
              >
                Favorites
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/submit-recipe"
                className="hover:text-red-500 transition"
              >
                Submit
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/community-recipes"
                className="hover:text-red-500 transition"
              >
                Community
              </NavLink>
            </li>
          </ul>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 transition"
          >
            {isDarkMode ? (
              <FaSun size={16} className="text-yellow-500" />
            ) : (
              <FaMoon size={16} />
            )}
          </button>

          {/* Hamburger Icon (Mobile Only) */}
          <button
            className="text-gray-700 dark:text-white text-2xl md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu (Only Visible When Hamburger is Open) */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-14 left-0 w-full bg-white dark:bg-gray-800 shadow-md">
          <ul className="flex flex-col items-center space-y-4 py-4 text-gray-700 dark:text-white">
            <li>
              <NavLink
                to="/"
                className="hover:text-red-500 transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/favorites"
                className="hover:text-red-500 transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Favorites
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/submit-recipe"
                className="hover:text-red-500 transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Submit
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/community-recipes"
                className="hover:text-red-500 transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Community
              </NavLink>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
