import { Link } from "react-router-dom"
import { Clock, User } from "lucide-react"

export default function RecipeItem({ item }) {
  return (
    <div className="recipe-card">
      <div className="aspect-square overflow-hidden">
        <img src={item?.image_url || "/placeholder.svg"} alt={item?.title || "Recipe"} className="recipe-image" />
      </div>
      <div className="recipe-card-content">
        <span className="recipe-publisher">{item?.publisher}</span>
        <h3 className="recipe-title">{item?.title}</h3>

        <div className="flex items-center gap-4 mt-1 text-sm text-gray-600 dark:text-gray-400">
          {item?.cooking_time && (
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>{item.cooking_time} mins</span>
            </div>
          )}
          {item?.servings && (
            <div className="flex items-center gap-1">
              <User className="h-3.5 w-3.5" />
              <span>{item.servings} servings</span>
            </div>
          )}
        </div>

        <Link to={`/recipe-item/${item?.id}`} className="recipe-button">
          View Recipe
        </Link>
      </div>
    </div>
  )
}

