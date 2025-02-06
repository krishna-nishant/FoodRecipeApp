import express from "express";
import CommunityRecipe from "../models/CommunityRecipe.js";

const router = express.Router();

// Get all recipes
router.get("/community", async (req, res) => {
    try {
        const recipes = await CommunityRecipe.find();
        res.json(recipes);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch recipes" });
    }
});

// Add a new recipe
router.post("/community", async (req, res) => {
    try {
        const { title, ingredients, instructions } = req.body;

        const newRecipe = new CommunityRecipe({
            title,
            ingredients, // Expecting an array
            instructions, // Expecting an array
        });

        await newRecipe.save();
        res.status(201).json(newRecipe);
    } catch (error) {
        res.status(500).json({ error: "Failed to submit recipe" });
    }
});

export default router;
