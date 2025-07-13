import {
    View,
    Text,
    Alert,
    ScrollView,
    TouchableOpacity,
    FlatList,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { useClerk, useUser } from "@clerk/clerk-expo";
import { API_URL } from "../../constants/api";
import { favoritesStyles } from "../../assets/styles/favorites.styles";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";
import RecipeCard from "../../components/RecipeCard";
import NoFavoritesFound from "../../components/NoFavoritesFound";
import LoadingSpinner from "../../components/LoadingSpinner";

const Favorites = () => {
    const { signOut } = useClerk();
    const { user } = useUser();
    const [loading, setLoading] = useState(true);
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        if (!user?.id) return;

        const loadFavorite = async () => {
            try {
                const response = await fetch(`${API_URL}/api/favorites/${user.id}`);
                if (!response.ok) throw new Error("Failed to fetch favorites");

                const result = await response.json();

                if (result.length > 0) {
                    const transformed = result.map((item) => ({
                        ...item,
                        id: item.recipeId, // required for FlatList key
                    }));
                    setFavorites(transformed);
                } else {
                    setFavorites([]); // ensure empty state displays
                }
            } catch (error) {
                console.log("Error loading favorites:", error);
                Alert.alert("Error", "Failed to load favorites");
            } finally {
                setLoading(false);
            }
        };

        loadFavorite();
    }, [user?.id]);

    const handleSignOut = useCallback(() => {
        signOut();
    }, []);

    if (loading) return <LoadingSpinner />;

    return (
        <View style={favoritesStyles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={favoritesStyles.header}>
                    <Text style={favoritesStyles.title}>Favorite</Text>
                    <TouchableOpacity
                        style={favoritesStyles.logoutButton}
                        onPress={handleSignOut}
                    >
                        <Ionicons
                            name="log-out-outline"
                            size={22}
                            color={COLORS.textLight}
                        />
                    </TouchableOpacity>
                </View>

                <View style={favoritesStyles.recipesSection}>
                    <FlatList
                        data={favorites}
                        renderItem={({ item }) => <RecipeCard recipe={item} />}
                        keyExtractor={(item) => item.id.toString()}
                        numColumns={2}
                        columnWrapperStyle={favoritesStyles.row}
                        contentContainerStyle={favoritesStyles.recipesGrid}
                        scrollEnabled={false}
                        ListEmptyComponent={<NoFavoritesFound />}
                    />
                </View>
            </ScrollView>
        </View>
    );
};

export default Favorites;
