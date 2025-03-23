import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Favorites from "./pages/Favorites";
import Details from "./pages/Details";
import RecipeForm from "./pages/RecipeForm";
import CommunityRecipes from "./pages/CommunityRecipes";

export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/recipe-item/:id" element={<Details />} />
          <Route path="/submit-recipe" element={<RecipeForm />} />
          <Route path="/community-recipes" element={<CommunityRecipes />} />
        </Routes>
      </div>
    </div>
  );
}
