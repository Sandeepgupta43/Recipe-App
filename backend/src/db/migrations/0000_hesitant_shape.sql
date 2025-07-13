CREATE TABLE "favorite" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"recipe_id" integer NOT NULL,
	"title" text NOT NULL,
	"cook_time" text,
	"image" text,
	"servings" text,
	"created_at" timestamp DEFAULT now()
);
