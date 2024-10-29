import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  FlatList,
  View,
  Button,
  TouchableOpacity,
  DeviceEventEmitter,
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

interface FoodItem {
  id: number;
  name: string;
  totalQuantity: number;
  weightPerItem: number;
  unit: string;
  type: string;
  expirationDate?: string;
}

// Extend the global object to include foodItems
declare global {
  var foodItems: FoodItem[];
}

export default function CreateScreen({ navigation }: any) {
  const [foodItems, setFoodItems] = useState<FoodItem[]>(global.foodItems || []);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  useEffect(() => {
    // Subscribe to the event
    const subscription = DeviceEventEmitter.addListener(
      'foodItemsUpdated',
      (updatedFoodItems: FoodItem[]) => {
        setFoodItems(updatedFoodItems);
      },
    );

    // Initial load
    setFoodItems(global.foodItems || []);

    return () => {
      // Clean up the subscription
      subscription.remove();
    };
  }, []);

  const toggleSelectItem = (id: number) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(prev => prev.filter(itemId => itemId !== id));
    } else {
      setSelectedItems(prev => [...prev, id]);
    }
  };

  const renderItem = ({ item }: { item: FoodItem }) => {
    const isSelected = selectedItems.includes(item.id);
    return (
      <TouchableOpacity onPress={() => toggleSelectItem(item.id)}>
        <View style={[styles.itemContainer, isSelected && styles.selectedItem]}>
          <ThemedText style={styles.itemText}>
            {item.name} (x{item.totalQuantity}, {item.weightPerItem}{' '}
            {item.unit} each) - {item.type}{' '}
            {item.expirationDate ? `- Exp: ${item.expirationDate}` : ''}
          </ThemedText>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Create Meal Plan
      </ThemedText>
      <FlatList
        data={foodItems}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        style={styles.list}
      />
      <Button
        title="Generate"
        onPress={() => {
          // Future functionality
        }}
        color="#28a745"
      />
      <Button
        title="Back to Pantry"
        onPress={() => navigation.navigate('Pantry')}
        color="#007bff"
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f8f9fa',
    flex: 1,
  },
  title: {
    marginBottom: 16,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  list: {
    marginTop: 10,
    flex: 1,
  },
  itemContainer: {
    padding: 8,
    marginBottom: 8,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    elevation: 1,
  },
  selectedItem: {
    backgroundColor: '#cce5ff',
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
});
