import express from "express";
import { ENV } from "./config/env.js";
import { db } from "./config/db.js";
import { eq, and } from "drizzle-orm";
import { favoritesTable } from "./db/schema.js";
import job from "./config/corn.js";

const app = express();
const PORT = ENV.PORT || 5001;

if(ENV.NODE_ENV === "production") job.start();

app.use(express.json());

app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
    });
});

app.post("/api/favorites", async (req, res) => {
    try {
        const { userId, recipeId, title, image, cookTime, servings } = req.body;
        console.log(req.body);
        if (!userId | !recipeId | !title) {
            res.status(400).json({
                error: "Missing required fields",
            });
        }
        const newFavorite = await db
            .insert(favoritesTable)
            .values({
                userId,
                recipeId,
                title,
                image,
                cookTime,
                servings,
            })
            .returning();
        res.status(201).json({
            success: true,
            data: newFavorite[0],
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: true,
            message: "Something went wrong",
        });
    }
});

app.get("/api/favorites/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        const result = await db
            .select()
            .from(favoritesTable)
            .where(eq(favoritesTable.userId, userId));

        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: true,
            message: "Something went wrong",
        });
    }
});

app.delete("/api/favorite/:userId/:recipeId", async (req, res) => {
    try {
        const { userId, recipeId } = req.params;
        if (!userId || !recipeId) {
            res.status(400).json({
                error: "Missing required fields",
            });
        }

        const result = await db
            .delete(favoritesTable)
            .where(
                and(
                    eq(favoritesTable.userId, userId),
                    eq(favoritesTable.recipeId, parseInt(recipeId))
                )
            )
            .returning();

        if (result.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Favorite not found",
            });
        }
        res.status(200).json({
            success: true,
            message: `Recipe with id ${recipeId} deleted successfully`,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: true,
            message: "Something went wrong",
        });
    }
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
