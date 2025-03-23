import { createContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

export const GlobalContext = createContext(null)

export default function GlobalState({ children }) {
  const [searchParam, setSearchParam] = useState("")
  const [loading, setLoading] = useState(false)
  const [recipeList, setRecipeList] = useState([])
  const [recipeDetailsData, setRecipeDetailsData] = useState(null)
  const [favoritesList, setFavoritesList] = useState([]) // State for favorites
  const [communityRecipes, setCommunityRecipes] = useState([]) // State for community recipes
  const navigate = useNavigate()

  // Load favorites and community recipes from local storage on mount
  useEffect(() => {
    const storedFavorites = localStorage.getItem("favoritesList")
    if (storedFavorites) {
      setFavoritesList(JSON.parse(storedFavorites))
    }

    const storedCommunityRecipes = localStorage.getItem("communityRecipes")
    if (storedCommunityRecipes) {
      setCommunityRecipes(JSON.parse(storedCommunityRecipes))
    }
  }, [])

  // Save favorites to local storage whenever favoritesList changes
  useEffect(() => {
    if (favoritesList.length > 0) {
      localStorage.setItem("favoritesList", JSON.stringify(favoritesList))
    }
  }, [favoritesList])

  // Save community recipes to local storage whenever communityRecipes changes
  useEffect(() => {
    if (communityRecipes.length > 0) {
      localStorage.setItem("communityRecipes", JSON.stringify(communityRecipes))
    }
  }, [communityRecipes])

  // Handle recipe search submit
  async function handleSubmit(event) {
    event.preventDefault()
    if (!searchParam.trim()) return

    try {
      setLoading(true)
      const res = await fetch(`https://forkify-api.herokuapp.com/api/v2/recipes?search=${searchParam}`)
      const data = await res.json()
      if (data?.data?.recipes) {
        setRecipeList(data?.data?.recipes)
        setLoading(false)
        setSearchParam("")
        navigate("/")
      }
    } catch (e) {
      console.log(e)
      setLoading(false)
      setSearchParam("")
    }
  }

  // Add or remove recipe from favorites
  function handleAddToFavorite(getCurrentItem) {
    const updatedFavorites = [...favoritesList]
    const index = updatedFavorites.findIndex((item) => item.id === getCurrentItem.id)

    if (index === -1) {
      updatedFavorites.push(getCurrentItem) // Add to favorites
    } else {
      updatedFavorites.splice(index, 1) // Remove from favorites
    }

    setFavoritesList(updatedFavorites)
  }

  // Add a recipe to the community list
  function addRecipe(newRecipe) {
    setCommunityRecipes((prevRecipes) => [...prevRecipes, newRecipe])
  }

  return (
    <GlobalContext.Provider
      value={{
        searchParam,
        loading,
        recipeList,
        setSearchParam,
        handleSubmit,
        recipeDetailsData,
        setRecipeDetailsData,
        handleAddToFavorite,
        favoritesList,
        communityRecipes,
        addRecipe,
      }}
    >
      {children}
    </GlobalContext.Provider>
  )
}

