import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import recipeRoutes from "./routes/recipeRoutes.js";
import dotenv from "dotenv"
dotenv.config()

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const dbUser = process.env.MONGO_DB_USER;
const dbPassword = process.env.MONGO_DB_PASSWORD;

try {
    mongoose.connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster0.nk87out.mongodb.net/recipesDB`);
    console.log("Connected to MongoDB");
} catch (error) {
    console.log("Failed to connect to MongoDB");
}

app.use("/api/recipes", recipeRoutes);


app.listen(5000, () => console.log("Server running on port 5000"));