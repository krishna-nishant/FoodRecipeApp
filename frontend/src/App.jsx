import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Favorites from "./pages/Favorites";
import Details from "./pages/Details";
import RecipeForm from "./pages/RecipeForm";
import CommunityRecipes from "./pages/CommunityRecipes";

function App() {
  return (
    <div className="min-h-screen max-w-[1200px] mx-auto">
      <Navbar />

      <div className="pt-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/recipe-item/:id" element={<Details />} />
          <Route path="/submit-recipe" element={<RecipeForm />} />{" "}
          <Route path="/community-recipes" element={<CommunityRecipes />} />{" "}
        </Routes>
      </div>
    </div>
  );
}

export default App;
