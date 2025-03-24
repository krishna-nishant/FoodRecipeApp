import express from 'express';
import User from '../models/User.js';
import { generateToken } from '../utils/jwtUtils.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Register user
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ $or: [{ email }, { username }] });
        if (userExists) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Create user
        const user = await User.create({
            username,
            email,
            password
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                token: generateToken(user._id)
            });
        } else {
            res.status(400).json({ error: 'Invalid user data' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Login user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });

        // Check if user exists and password matches
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ error: 'Invalid email or password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get current user profile
router.get('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        
        if (user) {
            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                savedRecipes: user.savedRecipes
            });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Save a recipe to user's collection
router.post('/save-recipe/:id', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const recipeId = req.params.id;

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if recipe is already saved
        if (user.savedRecipes.includes(recipeId)) {
            return res.status(400).json({ error: 'Recipe already saved' });
        }

        // Add recipe to savedRecipes
        user.savedRecipes.push(recipeId);
        await user.save();

        res.json({ message: 'Recipe saved to collection', savedRecipes: user.savedRecipes });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Remove a recipe from user's collection
router.delete('/remove-recipe/:id', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const recipeId = req.params.id;

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if recipe is in the collection
        if (!user.savedRecipes.includes(recipeId)) {
            return res.status(400).json({ error: 'Recipe not in collection' });
        }

        // Remove recipe from savedRecipes
        user.savedRecipes = user.savedRecipes.filter(id => id.toString() !== recipeId);
        await user.save();

        res.json({ message: 'Recipe removed from collection', savedRecipes: user.savedRecipes });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get user's saved recipes
router.get('/saved-recipes', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('savedRecipes');
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.json(user.savedRecipes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get user's recipes (recipes created by the user)
router.get('/recipes', protect, async (req, res) => {
    try {
        // Import the CommunityRecipe model
        const CommunityRecipe = await import('../models/CommunityRecipe.js').then(m => m.default);
        
        // Find recipes where user is the creator
        const recipes = await CommunityRecipe.find({ user: req.user._id });
        
        res.json(recipes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get user stats
router.get('/stats', protect, async (req, res) => {
    try {
        // Import the CommunityRecipe model
        const CommunityRecipe = await import('../models/CommunityRecipe.js').then(m => m.default);
        
        // Find recipes where user is the creator
        const userRecipes = await CommunityRecipe.find({ user: req.user._id });
        
        // Count total recipes
        const totalRecipes = userRecipes.length;
        
        // Calculate average rating
        let totalRating = 0;
        let ratingCount = 0;
        
        userRecipes.forEach(recipe => {
            if (recipe.rating > 0) {
                totalRating += recipe.rating;
                ratingCount++;
            }
        });
        
        const averageRating = ratingCount > 0 ? (totalRating / ratingCount).toFixed(1) : 0;
        
        // Find most common tag
        const tagCounts = {};
        userRecipes.forEach(recipe => {
            if (recipe.tags && recipe.tags.length > 0) {
                recipe.tags.forEach(tag => {
                    tagCounts[tag] = (tagCounts[tag] || 0) + 1;
                });
            }
        });
        
        let favoriteTag = '';
        let maxCount = 0;
        
        Object.entries(tagCounts).forEach(([tag, count]) => {
            if (count > maxCount) {
                maxCount = count;
                favoriteTag = tag;
            }
        });
        
        // Count total reviews received
        let totalReviews = 0;
        userRecipes.forEach(recipe => {
            if (recipe.reviews && recipe.reviews.length > 0) {
                totalReviews += recipe.reviews.length;
            }
        });
        
        res.json({
            totalRecipes,
            totalReviews,
            averageRating,
            favoriteTag
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router; 