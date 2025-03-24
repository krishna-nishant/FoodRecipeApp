import mongoose from "mongoose";

const CommunityRecipeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    ingredients: { type: [String], required: true }, // Expecting an array of strings
    instructions: { type: [String], required: true }, // Expecting an array of strings
    image: { type: String, default: "" },
    cookingTime: { type: Number, default: 30 }, // In minutes
    servings: { type: Number, default: 4 },
    difficulty: { 
        type: String, 
        enum: ["Easy", "Medium", "Hard"],
        default: "Medium"
    },
    tags: { type: [String], default: [] },
    rating: { 
        type: Number, 
        default: 0,
        min: 0,
        max: 5
    },
    reviews: [{ 
        text: String, 
        rating: Number,
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true // Adds createdAt and updatedAt
});

// Add index for text search
CommunityRecipeSchema.index({ 
    title: 'text', 
    tags: 'text',
    ingredients: 'text'
});

export default mongoose.model("CommunityRecipe", CommunityRecipeSchema);
