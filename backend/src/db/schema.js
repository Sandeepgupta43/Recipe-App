import { pgTable, serial, text, integer, timestamp } from 'drizzle-orm/pg-core';

export const favoritesTable = pgTable("favorite", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  recipeId: integer("recipe_id").notNull(), // fixed duplicate key
  title: text("title").notNull(),
  cookTime: text("cook_time"),
  image: text("image"),
  servings: text("servings"),
  createdAt: timestamp("created_at").defaultNow(),
});
