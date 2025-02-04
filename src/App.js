import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Favorites from "./pages/Favorites";
import Details from "./pages/Details";
import RecipeForm from "./pages/RecipeForm";  // Import the RecipeForm page
import CommunityRecipes from "./pages/CommunityRecipes";  // Import CommunityRecipes

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check for the user's theme preference in localStorage
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    console.log("Stored theme from localStorage:", storedTheme);  // Log this line
    if (storedTheme) {
      setIsDarkMode(storedTheme === "dark");
    }
  }, []);

  // Toggle theme and save preference to localStorage
  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem("theme", newMode ? "dark" : "light");
      return newMode;
    });
  };

  // Apply the theme to the body tag based on the user's preference
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <div className={`min-h-screen ${isDarkMode ? "dark" : ""}`}>
      {/* Dark Mode Toggle Button */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={toggleDarkMode}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md"
        >
          {isDarkMode ? "Light Mode" : "Dark Mode"} {/* Update text based on isDarkMode */}
        </button>
      </div>

      {/* Navbar */}
      <Navbar />

      {/* Routes */}
      <div className="pt-28 container mx-auto">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/recipe-item/:id" element={<Details />} />
          <Route path="/submit-recipe" element={<RecipeForm />} />  {/* Route for Recipe Form */}
          <Route path="/community-recipes" element={<CommunityRecipes />} />  {/* Route for Community Recipes */}
        </Routes>
      </div>
    </div>
  );
}

export default App;
