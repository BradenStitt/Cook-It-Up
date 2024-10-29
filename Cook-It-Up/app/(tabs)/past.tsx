import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, FlatList } from 'react-native';

interface Recipe {
  id: string;
  name: string;
}

const PastRecipes: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([
    { id: '1', name: 'Sample Recipe 1' },
    { id: '2', name: 'Sample Recipe 2' },
  ]);

  const editRecipe = (id: string) => {
    const recipe = recipes.find(r => r.id === id);
    if (recipe) {
      Alert.prompt(
        'Edit Recipe',
        'Enter new recipe name:',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Save',
            onPress: (newName) => {
              if (newName) {
                setRecipes((prevRecipes) =>
                  prevRecipes.map((r) => (r.id === id ? { ...r, name: newName } : r))
                );
              }
            },
          },
        ],
        'plain-text',
        recipe.name
      );
    }
  };

  const deleteRecipe = (id: string) => {
    Alert.alert(
      'Delete Recipe',
      'Are you sure you want to delete this recipe?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setRecipes((prevRecipes) => prevRecipes.filter((recipe) => recipe.id !== id));
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Past Recipes</Text>
      <FlatList
        data={recipes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.recipeItem}>
            <Text style={styles.recipeName}>{item.name}</Text>
            <View style={styles.recipeButtons}>
              <TouchableOpacity style={styles.editButton} onPress={() => editRecipe(item.id)}>
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton} onPress={() => deleteRecipe(item.id)}>
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  recipeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    backgroundColor: '#f1f1f1',
    width: '100%',
  },
  recipeName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  recipeButtons: {
    flexDirection: 'row',
  },
  editButton: {
    backgroundColor: '#4CAF50',
    padding: 5,
    borderRadius: 5,
    marginRight: 5,
  },
  deleteButton: {
    backgroundColor: '#f44336',
    padding: 5,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
  },
});

export default PastRecipes;