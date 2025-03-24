import express from "express";
import CommunityRecipe from "../models/CommunityRecipe.js";
import { protect } from "../middleware/authMiddleware.js";
import multer from "multer";
import path from "path";

const router = express.Router();

// Configure storage for recipe images
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, `recipe-${Date.now()}${path.extname(file.originalname)}`);
    }
});

// File filter
const fileFilter = (req, file, cb) => {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

// Upload middleware
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: fileFilter
});

// Get all recipes with filters
router.get("/community", async (req, res) => {
    try {
        let query = {};
        
        // Filter by tags if provided
        if (req.query.tags) {
            const tags = req.query.tags.split(',');
            query.tags = { $in: tags };
        }
        
        // Filter by difficulty if provided
        if (req.query.difficulty) {
            query.difficulty = req.query.difficulty;
        }
        
        // Filter by cooking time (less than or equal to)
        if (req.query.maxTime) {
            query.cookingTime = { $lte: parseInt(req.query.maxTime) };
        }
        
        // Filter by minimum rating
        if (req.query.minRating) {
            query.rating = { $gte: parseFloat(req.query.minRating) };
        }
        
        // Search by title
        if (req.query.search) {
            query.title = { $regex: req.query.search, $options: 'i' };
        }
        
        // Sort options
        let sort = {};
        if (req.query.sort) {
            if (req.query.sort === 'newest') {
                sort = { createdAt: -1 };
            } else if (req.query.sort === 'rating') {
                sort = { rating: -1 };
            }
        } else {
            // Default sort by newest
            sort = { createdAt: -1 };
        }
        
        const recipes = await CommunityRecipe.find(query).sort(sort);
        res.json(recipes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch recipes" });
    }
});

// Get recipe by ID
router.get("/community/:id", async (req, res) => {
    try {
        const recipe = await CommunityRecipe.findById(req.params.id);
        
        if (!recipe) {
            return res.status(404).json({ error: "Recipe not found" });
        }
        
        res.json(recipe);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch recipe" });
    }
});

// Add a new recipe with image upload
router.post("/community", protect, upload.single('image'), async (req, res) => {
    try {
        console.log('Received recipe submission:', req.body);
        
        // Log image file if exists
        if (req.file) {
            console.log('Image received:', req.file.filename);
        } else {
            console.log('No image file received');
        }
        
        const { title, ingredients, instructions, cookingTime, servings, difficulty, tags } = req.body;

        // Ensure title is provided
        if (!title) {
            console.log('Title is missing');
            return res.status(400).json({ error: "Title is required" });
        }

        // Convert ingredients and instructions from string to array if needed
        let ingredientsArray;
        try {
            ingredientsArray = typeof ingredients === 'string' 
                ? ingredients.startsWith('[') 
                    ? JSON.parse(ingredients) 
                    : ingredients.split(',').map(item => item.trim())
                : ingredients;
        } catch (e) {
            console.log('Error parsing ingredients:', e);
            return res.status(400).json({ error: "Invalid ingredients format" });
        }
            
        let instructionsArray;
        try {
            instructionsArray = typeof instructions === 'string'
                ? instructions.startsWith('[')
                    ? JSON.parse(instructions)
                    : instructions.split(',').map(item => item.trim())
                : instructions;
        } catch (e) {
            console.log('Error parsing instructions:', e);
            return res.status(400).json({ error: "Invalid instructions format" });
        }

        let tagsArray;
        try {
            tagsArray = tags 
                ? (typeof tags === 'string'
                    ? tags.startsWith('[')
                        ? JSON.parse(tags) 
                        : tags.split(',').map(tag => tag.trim())
                    : tags) 
                : [];
        } catch (e) {
            console.log('Error parsing tags:', e);
            return res.status(400).json({ error: "Invalid tags format" });
        }

        const newRecipe = new CommunityRecipe({
            title,
            ingredients: ingredientsArray,
            instructions: instructionsArray,
            cookingTime: parseInt(cookingTime) || 30,
            servings: parseInt(servings) || 4,
            difficulty: difficulty || "Medium",
            tags: tagsArray,
            image: req.file ? `/uploads/${req.file.filename}` : '',
            user: req.user._id // Add user reference
        });

        await newRecipe.save();
        res.status(201).json(newRecipe);
    } catch (error) {
        console.error('Recipe creation error:', error);
        res.status(500).json({ error: "Failed to submit recipe: " + error.message });
    }
});

// Update a recipe
router.put("/community/:id", protect, upload.single('image'), async (req, res) => {
    try {
        const recipe = await CommunityRecipe.findById(req.params.id);
        
        if (!recipe) {
            return res.status(404).json({ error: "Recipe not found" });
        }
        
        // Check if user is authorized to update this recipe
        if (recipe.user && recipe.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ error: "Not authorized to update this recipe" });
        }
        
        const { title, ingredients, instructions, cookingTime, servings, difficulty, tags } = req.body;

        // Convert ingredients and instructions from string to array if needed
        const ingredientsArray = typeof ingredients === 'string' 
            ? ingredients.split(',').map(item => item.trim()) 
            : ingredients;
            
        const instructionsArray = typeof instructions === 'string'
            ? instructions.split(',').map(item => item.trim())
            : instructions;

        const tagsArray = tags ? (typeof tags === 'string' 
            ? tags.split(',').map(tag => tag.trim())
            : tags) : recipe.tags;

        // Update recipe
        recipe.title = title || recipe.title;
        recipe.ingredients = ingredientsArray || recipe.ingredients;
        recipe.instructions = instructionsArray || recipe.instructions;
        recipe.cookingTime = parseInt(cookingTime) || recipe.cookingTime;
        recipe.servings = parseInt(servings) || recipe.servings;
        recipe.difficulty = difficulty || recipe.difficulty;
        recipe.tags = tagsArray;
        
        // Update image if provided
        if (req.file) {
            recipe.image = `/uploads/${req.file.filename}`;
        }
        
        const updatedRecipe = await recipe.save();
        res.json(updatedRecipe);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update recipe" });
    }
});

// Delete a recipe
router.delete("/community/:id", protect, async (req, res) => {
    try {
        const recipe = await CommunityRecipe.findById(req.params.id);
        
        if (!recipe) {
            return res.status(404).json({ error: "Recipe not found" });
        }
        
        // Check if user is authorized to delete this recipe
        if (recipe.user && recipe.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ error: "Not authorized to delete this recipe" });
        }
        
        await recipe.remove();
        res.json({ message: "Recipe removed" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete recipe" });
    }
});

// Add a review to a recipe
router.post("/community/:id/reviews", protect, async (req, res) => {
    try {
        console.log("Review submission received for recipe ID:", req.params.id);
        console.log("Review body:", req.body);
        console.log("User:", req.user?._id);
        
        const { rating, text } = req.body;
        
        if (!rating || isNaN(parseFloat(rating)) || parseFloat(rating) < 1 || parseFloat(rating) > 5) {
            return res.status(400).json({ error: "Rating is required and must be between 1 and 5" });
        }
        
        const recipe = await CommunityRecipe.findById(req.params.id);
        
        if (!recipe) {
            console.log("Recipe not found with ID:", req.params.id);
            return res.status(404).json({ error: "Recipe not found" });
        }
        
        // Check if user has already reviewed this recipe
        const existingReview = recipe.reviews.find(
            review => review.user && review.user.toString() === req.user._id.toString()
        );
        
        if (existingReview) {
            return res.status(400).json({ error: "You have already reviewed this recipe" });
        }
        
        // Add review with user reference
        const review = {
            text,
            rating: parseFloat(rating),
            createdAt: Date.now(),
            user: req.user._id,
            username: req.user.username
        };
        
        recipe.reviews.push(review);
        
        // Update average rating
        const totalRating = recipe.reviews.reduce((sum, item) => sum + item.rating, 0);
        recipe.rating = totalRating / recipe.reviews.length;
        
        await recipe.save();
        res.status(201).json({ message: "Review added", recipe });
    } catch (error) {
        console.error("Error adding review:", error);
        res.status(500).json({ error: "Failed to add review" });
    }
});

export default router;
