import {
    View,
    Text,
    ScrollView,
    RefreshControl,
    TouchableOpacity,
    FlatList,
} from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { MealApi } from "../../services/mealApi";
import { homeStyles } from "../../assets/styles/home.styles";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";
import CategoryFilter from "../../components/CategoryFilter";
import RecipeCard from "../../components/RecipeCard";
import LoadingSpinner from "../../components/LoadingSpinner";

const HomeScreen = () => {
    const router = useRouter();
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [recipe, setRecipe] = useState([]);
    const [categories, setCategories] = useState([]);
    const [featuredRecipe, setFeaturedRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefershing] = useState(false);

    const loadData = async () => {
        try {
            setLoading(true);
            const [apiCategories, randomMeals, featuredMeal] =
                await Promise.all([
                    MealApi.getCategories(),
                    MealApi.getRandomMeals(12),
                    MealApi.getRandomMeal(),
                ]);
            const transformCategories = apiCategories.map((cat, index) => ({
                id: index + 1,
                name: cat.strCategory,
                image: cat.strCategoryThumb,
                description: cat.strCategoryDescription,
            }));
            setCategories(transformCategories);

            if (!selectedCategory) setSelectedCategory(transformCategories[0].name);

            const transformMeals = randomMeals
                .map((meal) => MealApi.transformMealData(meal))
                .filter((meal) => meal !== null);
            setRecipe(transformMeals);

            const transformedFeatured = MealApi.transformMealData(featuredMeal);
            setFeaturedRecipe(transformedFeatured);
        } catch (error) {
            console.error("Error ", error);
        } finally {
            setLoading(false);
        }
    };

    const loadCategoryData = async (category) => {
        try {
            const meals = await MealApi.filterByCategory(category);
            const transformedMeals = meals
                .map((meal) => MealApi.transformMealData(meal))
                .filter((meal) => meal !== null);
            setRecipe(transformedMeals);
        } catch (error) {
            console.error(error);
            console.log("Error while loading category data");
            setRecipe([]);
        }
    };
    const handleCategorySelect = async (category) => {
        setSelectedCategory(category);
        await loadCategoryData(category);
    };

    useEffect(() => {
        loadData();
    }, []);

    if(loading && refreshing) return <LoadingSpinner message="Loading your recipe..."/>

    return (
        <View style={homeStyles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={async () => {
                            setRefershing(true);
                            await loadData();
                            setRefershing(false);
                        }}
                        tintColor={COLORS.primary}
                    />
                }
                contentContainerStyle={homeStyles.scrollContent}
            >
                {/* Animal Icons */}
                <View style={homeStyles.welcomeSection}>
                    <Image
                        source={require("../../assets/images/lamb.png")}
                        style={{
                            height: 100,
                            width: 100,
                        }}
                    />
                    <Image
                        source={require("../../assets/images/chicken.png")}
                        style={{
                            height: 100,
                            width: 100,
                        }}
                    />
                    <Image
                        source={require("../../assets/images/pork.png")}
                        style={{
                            height: 100,
                            width: 100,
                        }}
                    />
                </View>

                {featuredRecipe && (
                    <View style={homeStyles.featuredSection}>
                        <TouchableOpacity
                            style={homeStyles.featuredCard}
                            activeOpacity={0.9}
                            onPress={() =>
                                router.push(`/recipe/${featuredRecipe.id}`)
                            }
                        >
                            <View style={homeStyles.featuredImageContainer}>
                                <Image
                                    source={{ uri: featuredRecipe.image }}
                                    style={homeStyles.featuredImage}
                                    contentFit="cover"
                                    transition={500}
                                />
                                <View style={homeStyles.featuredOverlay}>
                                    <View style={homeStyles.featuredBadge}>
                                        <Text
                                            style={homeStyles.featuredBadgeText}
                                        >
                                            Featured
                                        </Text>

                                        <View style={homeStyles.featuredMeta}>
                                            <View style={homeStyles.metaItem}>
                                                <Ionicons
                                                    name="time-outline"
                                                    size={16}
                                                    color={COLORS.white}
                                                />
                                                <Text
                                                    style={homeStyles.metaText}
                                                >
                                                    {featuredRecipe.cookTime}
                                                </Text>
                                            </View>
                                            <View style={homeStyles.metaItem}>
                                                <Ionicons
                                                    name="people-outline"
                                                    size={16}
                                                    color={COLORS.white}
                                                />
                                                <Text
                                                    style={homeStyles.metaText}
                                                >
                                                    {featuredRecipe.servings}
                                                </Text>
                                            </View>
                                            {featuredRecipe.area && (
                                                <View
                                                    style={homeStyles.metaItem}
                                                >
                                                    <Ionicons
                                                        name="location-outline"
                                                        size={16}
                                                        color={COLORS.white}
                                                    />
                                                    <Text
                                                        style={
                                                            homeStyles.metaText
                                                        }
                                                    >
                                                        {featuredRecipe.area}
                                                    </Text>
                                                </View>
                                            )}
                                        </View>
                                    </View>
                                    <View style={homeStyles.featuredContent}>
                                        <Text
                                            style={homeStyles.featuredTitle}
                                            numberOfLines={2}
                                        >
                                            {featuredRecipe.title}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                )}
                {categories.length > 0 && (
                    <CategoryFilter
                        categories={categories}
                        selectedCategory={selectedCategory}
                        onSelectCategory={handleCategorySelect}
                    />
                )}
                <View style={homeStyles.recipesSection}>
                    <View style={homeStyles.sectionHeader}>
                        <Text style={homeStyles.sectionTitle}>
                            {selectedCategory}
                        </Text>
                    </View>
                    {recipe.length > 0 ? (
                        <FlatList
                            data={recipe}
                            renderItem={({ item }) => (
                                <RecipeCard recipe={item} />
                            )}
                            keyExtractor={(item) => item.id.toString()}
                            numColumns={2}
                            columnWrapperStyle={homeStyles.row}
                            contentContainerStyle={homeStyles.recipesGrid}
                            scrollEnabled={false}
                            // ListEmptyComponent={}
                        />
                    ) : (
                        <View style={homeStyles.emptyState}>
                            <Ionicons
                                name="restaurant-outline"
                                size={64}
                                color={COLORS.textLight}
                            />
                            <Text style={homeStyles.emptyTitle}>
                                No recipes found
                            </Text>
                            <Text style={homeStyles.emptyDescription}>
                                Try a different category
                            </Text>
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    );
};

export default HomeScreen;
