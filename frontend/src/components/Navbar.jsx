import { useContext, useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { GlobalContext } from "../context";
import { Search, Sun, Moon, Menu, X, ChefHat, User, Heart } from "lucide-react";
import { useTheme } from "next-themes";

export default function Navbar() {
  const { searchParam, setSearchParam, handleSubmit, user, logoutUser } =
    useContext(GlobalContext);

  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const location = useLocation();

  // After mounting, we can safely show the UI that depends on the theme
  useEffect(() => {
    setMounted(true);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [location]);
  
  // Close user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (isUserMenuOpen && !event.target.closest('.user-menu-container')) {
        setIsUserMenuOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Only show the theme toggle button when mounted
  const renderThemeToggle = () => {
    if (!mounted) return null;

    return (
      <button
        onClick={toggleTheme}
        className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-full"
        aria-label="Toggle theme"
      >
        {theme === "dark" ? (
          <Sun className="h-5 w-5" />
        ) : (
          <Moon className="h-5 w-5" />
        )}
      </button>
    );
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  const toggleUserMenu = (e) => {
    e.stopPropagation();
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <ChefHat className="h-8 w-8 text-primary" />
            <span className="ml-2 text-xl font-bold text-gray-800 dark:text-white">
              CulinaryDelight
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                location.pathname === "/"
                  ? "bg-primary/10 text-primary"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              Home
            </Link>

            <Link
              to="/community-recipes"
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                location.pathname === "/community-recipes"
                  ? "bg-primary/10 text-primary"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              Community Recipes
            </Link>

            <Link
              to="/add-recipe"
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                location.pathname === "/add-recipe"
                  ? "bg-primary/10 text-primary"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              Add Recipe
            </Link>

            {user && (
              <Link
                to="/favorites"
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  location.pathname === "/favorites"
                    ? "bg-primary/10 text-primary"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                My Favorites
              </Link>
            )}
          </nav>

          {/* Right section: Auth, Theme, Search */}
          <div className="flex items-center space-x-4">
            {/* Theme toggle */}
            {renderThemeToggle()}

            {/* User section */}
            {user ? (
              <div className="relative user-menu-container">
                <button 
                  onClick={toggleUserMenu}
                  className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-2 rounded-md"
                >
                  <User className="h-5 w-5" />
                  <span className="hidden sm:block">{user.username}</span>
                  {/* Add a dropdown indicator */}
                  <svg 
                    className={`h-4 w-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 py-2 bg-white dark:bg-gray-800 rounded-md shadow-xl z-10">
                    <Link
                      to="/favorites"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Heart className="h-4 w-4 mr-2" />
                      My Favorites
                    </Link>
                    <hr className="my-1 border-gray-200 dark:border-gray-700" />
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        logoutUser();
                      }}
                      className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-2 rounded-md"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-medium bg-primary text-white px-3 py-2 rounded-md hover:bg-primary/90"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              className="md:hidden text-gray-700 dark:text-gray-300 p-2"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="space-y-1">
              <Link
                to="/"
                className={`block px-3 py-2 rounded-md ${
                  location.pathname === "/"
                    ? "bg-primary/10 text-primary"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                Home
              </Link>
              <Link
                to="/community-recipes"
                className={`block px-3 py-2 rounded-md ${
                  location.pathname === "/community-recipes"
                    ? "bg-primary/10 text-primary"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                Community Recipes
              </Link>
              <Link
                to="/add-recipe"
                className={`block px-3 py-2 rounded-md ${
                  location.pathname === "/add-recipe"
                    ? "bg-primary/10 text-primary"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                Add Recipe
              </Link>
              {user && (
                <Link
                  to="/favorites"
                  className={`block px-3 py-2 rounded-md ${
                    location.pathname === "/favorites"
                      ? "bg-primary/10 text-primary"
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  My Favorites
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
