import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./pages/Home";
import RecipeItem from "./pages/RecipeItem";
import Navbar from "./components/Navbar";
import CommunityRecipes from "./pages/CommunityRecipes";
import RecipeForm from "./pages/RecipeForm";
import GlobalState from "./context";
import Favorites from "./pages/Favorites";
import { ThemeProvider } from "next-themes";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import RecipeDetail from "./pages/RecipeDetail";
import Notification, { notificationSystem } from "./components/Notification";
import { Navigate } from "react-router-dom";

function NotificationProvider() {
  const [currentNotification, setCurrentNotification] = useState(null);
  
  useEffect(() => {
    // Subscribe to notification system
    const unsubscribe = notificationSystem.subscribe(notification => {
      setCurrentNotification(notification);
    });
    
    return unsubscribe;
  }, []);
  
  const handleClose = () => {
    if (currentNotification) {
      notificationSystem.remove(currentNotification.id);
    }
  };
  
  if (!currentNotification) return null;
  
  return (
    <Notification
      type={currentNotification.type}
      message={currentNotification.message}
      show={true}
      duration={currentNotification.duration}
      onClose={handleClose}
    />
  );
}

export default function App() {
  return (
    <GlobalState>
      <ThemeProvider attribute="class" defaultTheme="light">
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
          <NotificationProvider />
          <Navbar />
          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/recipe/:id" element={<RecipeDetail />} />
              <Route path="/recipe-item/:id" element={<RecipeItem />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/community-recipes" element={<CommunityRecipes />} />
              <Route path="/add-recipe" element={<RecipeForm />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/profile" element={<Navigate to="/favorites" replace />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </GlobalState>
  );
}
