import mongoose from "mongoose";

const CommunityRecipeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    ingredients: { type: [String], required: true }, // Expecting an array of strings
    instructions: { type: [String], required: true }, // Expecting an array of strings
});

export default mongoose.model("CommunityRecipe", CommunityRecipeSchema);
