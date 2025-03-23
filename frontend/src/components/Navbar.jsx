import { useContext, useState, useEffect } from "react"
import { NavLink, useLocation } from "react-router-dom"
import { GlobalContext } from "../context"
import { Search, Sun, Moon, Menu, X, ChefHat } from "lucide-react"
import { useTheme } from "next-themes"

export default function Navbar() {
  const { searchParam, setSearchParam, handleSubmit } = useContext(GlobalContext)

  const { theme, setTheme } = useTheme()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const location = useLocation()

  // After mounting, we can safely show the UI that depends on the theme
  useEffect(() => {
    setMounted(true)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false)
  }, [location])

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/favorites", label: "Favorites" },
    { path: "/submit-recipe", label: "Submit" },
    { path: "/community-recipes", label: "Community" },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-50 border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2 font-playfair">
            <NavLink to="/" className="flex items-center gap-2">
              <ChefHat className="h-6 w-6 text-primary" />
              <span>CulinaryDelight</span>
            </NavLink>
          </h2>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search Bar */}
            <form onSubmit={handleSubmit} className="relative">
              <input
                type="text"
                name="search"
                value={searchParam}
                onChange={(e) => setSearchParam(e.target.value)}
                placeholder="Search recipes..."
                className="w-64 px-4 py-2 pr-10 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
              >
                <Search className="h-4 w-4" />
              </button>
            </form>

            {/* Nav Links */}
            <ul className="flex space-x-1">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <NavLink to={link.path} className={({ isActive }) => `nav-link ${isActive ? "nav-link-active" : ""}`}>
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>

            {/* Theme Toggle */}
            {mounted && (
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5 text-yellow-500" />
                ) : (
                  <Moon className="h-5 w-5 text-gray-700" />
                )}
              </button>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="flex items-center md:hidden space-x-4">
            {/* Mobile Search */}
            <form onSubmit={handleSubmit} className="relative">
              <input
                type="text"
                name="search"
                value={searchParam}
                onChange={(e) => setSearchParam(e.target.value)}
                placeholder="Search..."
                className="w-36 px-3 py-1.5 pr-8 text-sm rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
              >
                <Search className="h-3.5 w-3.5" />
              </button>
            </form>

            {/* Mobile Theme Toggle */}
            {mounted && (
              <button
                onClick={toggleTheme}
                className="p-1.5 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4 text-yellow-500" />
                ) : (
                  <Moon className="h-4 w-4 text-gray-700" />
                )}
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              className="p-1.5 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-lg transition-all duration-300">
          <ul className="flex flex-col py-3">
            {navLinks.map((link) => (
              <li key={link.path}>
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    `block px-6 py-3 ${isActive ? "text-primary font-medium" : "text-gray-700 dark:text-gray-200"}`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  )
}

