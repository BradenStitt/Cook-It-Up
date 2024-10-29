import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  FlatList,
  View,
  Button,
  TouchableOpacity,
  DeviceEventEmitter,
  ActivityIndicator,
  Alert,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import {
  useNavigation,
  NavigationProp,
  ParamListBase,
} from "@react-navigation/native";
import OpenAI from "openai";

interface FoodItem {
  id: number;
  name: string;
  quantity: number;
}

interface Recipe {
  id: number;
  name: string;
  description: string;
  ingredients: {
    name: string;
    amount: string;
  }[];
  instructions: string[];
  cookingTime: string;
  difficulty: string;
}

declare global {
  var foodItems: FoodItem[];
}

const CreateScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const [foodItems, setFoodItems] = useState<FoodItem[]>(
    global.foodItems || []
  );
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  // Initialize OpenAI client
  const openai = new OpenAI({
    apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(
      "foodItemsUpdated",
      (updatedFoodItems: FoodItem[]) => {
        setFoodItems(updatedFoodItems);
      }
    );

    setFoodItems(global.foodItems || []);

    return () => {
      subscription.remove();
    };
  }, []);

  const getRecipeRecommendations = async (ingredients: string[]) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: `You are a creative chef that provides detailed recipe recommendations based on available ingredients. 
            Provide your response as a JSON object with the following structure:
            {
              "recipes": [
                {
                  "id": number,
                  "name": string,
                  "description": string,
                  "ingredients": [
                    {
                      "name": string,
                      "amount": string
                    }
                  ],
                  "instructions": string[],
                  "cookingTime": string,
                  "difficulty": string
                }
              ]
            }
            Generate 3 different recipes that use some or all of the provided ingredients.`,
          },
          {
            role: "user",
            content: `Based on these available ingredients: ${ingredients.join(
              ", "
            )}, generate 3 possible recipes in JSON format.`,
          },
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
      });

      const content = response.choices[0].message.content;
      if (content === null) {
        throw new Error("Received null content from OpenAI API");
      }

      const parsedResponse = JSON.parse(content);
      console.log(parsedResponse);

      if (!isValidRecipeResponse(parsedResponse)) {
        throw new Error("Invalid response format from API");
      }

      setRecipes(parsedResponse.recipes);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to generate recipes";
      setError(errorMessage);
      Alert.alert("Error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const isValidRecipeResponse = (
    response: any
  ): response is { recipes: Recipe[] } => {
    if (!response || !Array.isArray(response.recipes)) {
      return false;
    }

    return response.recipes.every(
      (recipe: any) =>
        typeof recipe.id === "number" &&
        typeof recipe.name === "string" &&
        typeof recipe.description === "string" &&
        Array.isArray(recipe.ingredients) &&
        Array.isArray(recipe.instructions) &&
        typeof recipe.cookingTime === "string" &&
        typeof recipe.difficulty === "string"
    );
  };

  const handleGenerateRecipes = async () => {
    if (selectedItems.length === -1) {
      Alert.alert("Error", "Please select at least one ingredient");
      return;
    }

    const selectedIngredients = foodItems
      .filter((item) => selectedItems.includes(item.id))
      .map((item) => item.name);

    await getRecipeRecommendations(selectedIngredients);
  };

  const toggleSelectItem = (id: number) => {
    if (selectedItems.includes(id)) {
      setSelectedItems((prev) => prev.filter((itemId) => itemId !== id));
    } else {
      setSelectedItems((prev) => [...prev, id]);
    }
  };

  const renderFoodItem = ({ item }: { item: FoodItem }) => {
    const isSelected = selectedItems.includes(item.id);
    return (
      <TouchableOpacity onPress={() => toggleSelectItem(item.id)}>
        <View style={[styles.itemContainer, isSelected && styles.selectedItem]}>
          <ThemedText style={styles.itemText}>
            {item.name} (x{item.quantity})
          </ThemedText>
        </View>
      </TouchableOpacity>
    );
  };

  const renderRecipe = ({ item }: { item: Recipe }) => (
    <View style={styles.recipeContainer}>
      <ThemedText style={styles.recipeName}>{item.name}</ThemedText>
      <ThemedText style={styles.recipeDescription}>
        {item.description}
      </ThemedText>
      <ThemedText style={styles.recipeSubtitle}>Ingredients:</ThemedText>
      {item.ingredients.map((ingredient, index) => (
        <ThemedText key={index} style={styles.ingredientText}>
          • {ingredient.amount} {ingredient.name}
        </ThemedText>
      ))}
      <ThemedText style={styles.recipeSubtitle}>Instructions:</ThemedText>
      {item.instructions.map((instruction, index) => (
        <ThemedText key={index} style={styles.instructionText}>
          {index + 1}. {instruction}
        </ThemedText>
      ))}
      <View style={styles.recipeMetaContainer}>
        <ThemedText style={styles.recipeMetaText}>
          Time: {item.cookingTime}
        </ThemedText>
        <ThemedText style={styles.recipeMetaText}>
          Difficulty: {item.difficulty}
        </ThemedText>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <ThemedView style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#007bff" />
        <ThemedText style={styles.loadingText}>
          Generating Recipe Recommendations...
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Create Recipe Plan
      </ThemedText>
      {error ? <ThemedText style={styles.errorText}>{error}</ThemedText> : null}

      <ThemedText style={styles.sectionTitle}>Select Ingredients:</ThemedText>
      <FlatList
        data={foodItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderFoodItem}
        style={styles.ingredientsList}
        horizontal={true}
      />

      <Button
        title="Generate Recipes"
        onPress={handleGenerateRecipes}
        color="#28a745"
        disabled={isLoading}
      />

      {recipes.length > 0 && (
        <>
          <ThemedText style={styles.sectionTitle}>
            Recipe Recommendations:
          </ThemedText>
          <FlatList
            data={recipes}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderRecipe}
            style={styles.recipesList}
          />
        </>
      )}

      <Button
        title="Back to Pantry"
        onPress={() => navigation.navigate("PantryScreen")}
        color="#007bff"
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f8f9fa",
    flex: 1,
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    marginBottom: 16,
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 8,
    color: "#444",
  },
  ingredientsList: {
    maxHeight: 100,
    marginBottom: 16,
  },
  recipesList: {
    flex: 1,
    marginTop: 16,
  },
  itemContainer: {
    padding: 8,
    marginRight: 8,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    elevation: 1,
  },
  selectedItem: {
    backgroundColor: "#cce5ff",
  },
  itemText: {
    fontSize: 16,
    color: "#333",
  },
  recipeContainer: {
    padding: 16,
    marginBottom: 16,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    elevation: 2,
  },
  recipeName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 8,
  },
  recipeDescription: {
    fontSize: 16,
    color: "#666",
    marginBottom: 16,
  },
  recipeSubtitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#444",
    marginTop: 12,
    marginBottom: 8,
  },
  ingredientText: {
    fontSize: 16,
    color: "#555",
    marginLeft: 8,
    marginBottom: 4,
  },
  instructionText: {
    fontSize: 16,
    color: "#555",
    marginLeft: 8,
    marginBottom: 8,
  },
  recipeMetaContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  recipeMetaText: {
    fontSize: 14,
    color: "#666",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  errorText: {
    color: "#dc3545",
    fontSize: 16,
    marginBottom: 16,
    textAlign: "center",
  },
});

export default CreateScreen;
