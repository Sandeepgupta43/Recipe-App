const BASE_URL = "https://www.themealdb.com/api/json/v1/1";

export const MealApi = {
    searchMealByName: async (query) => {
        try {
            const response = await fetch(
                `${BASE_URL}/search.php?s=${encodeURIComponent(query)}`
            );

            // Check if response is OK and is JSON
            const contentType = response.headers.get("content-type");
            if (!response.ok || !contentType.includes("application/json")) {
                throw new Error(
                    `Invalid response from API: ${response.status}`
                );
            }

            const data = await response.json();

            // Return array instead of single meal for consistency
            return data.meals || [];
        } catch (error) {
            console.error("Error searching meals by name:", error);
            return [];
        }
    },

    searchMealById: async (id) => {
        try {
            const response = await fetch(
                `${BASE_URL}/lookup.php?i=${encodeURIComponent(id)}`
            );
            const data = await response.json();
            return data.meals?.[0] || [];
        } catch (error) {
            console.error("Error searching meals by name:", error);
            return [];
        }
    },

    getRandomMeal: async () => {
        try {
            const response = await fetch(`${BASE_URL}/random.php`);
            const data = await response.json();
            return data.meals?.[0] || [];
        } catch (error) {
            console.error("Error searching meals by name:", error);
            return [];
        }
    },
    getRandomMeals: async (count = 6) => {
        try {
            const promises = Array(count)
                .fill()
                .map(() => MealApi.getRandomMeal());

            const meals = await Promise.all(promises);
            return meals.filter((meal) => meal !== null);
        } catch (error) {
            console.error("Error searching meals by name:", error);
            return [];
        }
    },
    getCategories: async () => {
        try {
            const response = await fetch(`${BASE_URL}/categories.php`);
            const data = await response.json();
            return data.categories || [];
        } catch (error) {
            console.error("Error searching meals by name:", error);
            return [];
        }
    },
    filterByIngratient: async (ingradient) => {
        try {
            const response = await fetch(
                `${BASE_URL}/filter.php?i=${encodeURIComponent(ingradient)}`
            );
            const data = await response.json();
            return data.meals || [];
        } catch (error) {
            console.error("Error searching meals by name:", error);
            return [];
        }
    },
    filterByCategory: async (category) => {
        try {
            const response = await fetch(
                `${BASE_URL}/filter.php?i=${encodeURIComponent(category)}`
            );
            const data = await response.json();
            return data.meals || [];
        } catch (error) {
            console.error("Error searching meals by name:", error);
            return [];
        }
    },
    transformMealData: (meal) => {
        if (!meal) return null;

        // extract ingredients from the meal object
        const ingredients = [];
        for (let i = 1; i <= 20; i++) {
            const ingredient = meal[`strIngredient${i}`];
            const measure = meal[`strMeasure${i}`];
            if (ingredient && ingredient.trim()) {
                const measureText =
                    measure && measure.trim() ? `${measure.trim()} ` : "";
                ingredients.push(`${measureText}${ingredient.trim()}`);
            }
        }

        // extract instructions
        const instructions = meal.strInstructions
            ? meal.strInstructions.split(/\r?\n/).filter((step) => step.trim())
            : [];
        return {
            id: meal.idMeal,
            title: meal.strMeal,
            description: meal.strInstructions
                ? meal.strInstructions.substring(0, 120) + "..."
                : "Delicious meal from TheMealDB",
            image: meal.strMealThumb,
            cookTime: "30 minutes",
            servings: 4,
            category: meal.strCategory || "Main Course",
            area: meal.strArea,
            ingredients,
            instructions,
            originalData: meal,
        };
    },
};
