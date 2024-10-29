import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  TextInput,
  Button,
  FlatList,
  View,
  Modal,
  Alert,
  DeviceEventEmitter,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { supabase } from "../lib/supabase"; // Adjust the path as needed
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";

interface FoodItem {
  id: number;
  name: string;
  quantity: number;
  User: number;
}

export default function PantryScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<{ params: { userId: number } }, "params">>();
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentItemId, setCurrentItemId] = useState<number | null>(null);
  const [newItem, setNewItem] = useState<string>("");
  const [quantity, setQuantity] = useState<number | "">("");

  // Get userId from route params
  const userId = route.params?.userId;

  useEffect(() => {
    if (!userId) {
      Alert.alert("Error", "User ID not found");
      navigation.goBack();
      return;
    }

    // Load user's food items
    loadUserFoodItems();
  }, [userId]);

  const loadUserFoodItems = async () => {
    try {
      const { data, error } = await supabase
        .from("Food")
        .select("*")
        .eq("User", userId);

      if (error) {
        throw error;
      }

      setFoodItems(data);

    } catch (error) {
      Alert.alert("Error", "Failed to load food items.");
    }
  };

  const addFoodItem = async () => {
    if (!userId) {
      Alert.alert("Error", "User ID not found");
      return;
    }

    if (newItem.trim() && quantity !== "") {
      const itemData: FoodItem = {
        id: Date.now(),
        name: newItem.trim(),
        quantity: Number(quantity),
        User: userId,
      };

      try {
        const { data, error } = await supabase.from("Food").insert([itemData]);

        setFoodItems([...foodItems, itemData]);
        resetInputs();
        setModalVisible(false);
      } catch (error) {}
    } else {
      Alert.alert("Error", "Please fill in all fields.");
    }
  };

  const editFoodItem = async () => {
    if (currentItemId !== null && newItem.trim() && quantity !== "") {
      const updatedItems = foodItems.map((item) => {
        if (item.id === currentItemId) {
          return {
            ...item,
            name: newItem.trim(),
            quantity: Number(quantity),
          };
        }
        return item;
      });

      // Update the item in the database
      const { data, error } = await supabase
        .from("Food")
        .update({ name: newItem.trim(), quantity: Number(quantity) })
        .eq("id", currentItemId);

      if (error) {
        Alert.alert("Error", "Failed to update food item.");
        return;
      }

      setFoodItems(updatedItems);
      resetInputs();
      setModalVisible(false);
    } else {
      Alert.alert("Error", "Please fill in all fields.");
    }
  };

  const resetInputs = () => {
    setNewItem("");
    setQuantity("");
    setCurrentItemId(null);
    setIsEditing(false);
  };

  const confirmDelete = (id: number) => {
    Alert.alert("Delete Item", "Are you sure you want to delete this item?", [
      { text: "Cancel", style: "cancel" },
      { text: "OK", onPress: () => deleteItem(id) },
    ]);
  };

  const deleteItem = async (id: number) => {
    // Delete the item from the database
    const { data, error } = await supabase.from("Food").delete().eq("id", id);

    if (error) {
      Alert.alert("Error", "Failed to delete food item.");
      return;
    }

    setFoodItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const renderItem = ({ item }: { item: FoodItem }) => (
    <View style={styles.itemContainer}>
      <ThemedText style={styles.itemText}>
        {item.name} (x{item.quantity})
      </ThemedText>
      <View style={styles.buttonContainer}>
        <Button
          title="Edit"
          onPress={() => openEditModal(item)}
          color="#007bff"
        />
        <Button
          title="Remove"
          onPress={() => confirmDelete(item.id)}
          color="red"
        />
      </View>
    </View>
  );

  const openEditModal = async (item: FoodItem) => {
    setNewItem(item.name);
    setQuantity(item.quantity);
    setCurrentItemId(item.id);
    setIsEditing(true);
    setModalVisible(true);

    // update the item in the database
    const { data, error } = await supabase
      .from("Food")
      .update({ name: item.name, quantity: item.quantity });
  };

  const handleQuantityChange = (text: string) => {
    if (text === "") {
      setQuantity("");
    } else {
      const numericValue = parseFloat(text);
      setQuantity(isNaN(numericValue) ? "" : numericValue);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        My Food Items
      </ThemedText>

      <TextInput
        style={styles.input}
        value={searchTerm}
        onChangeText={setSearchTerm}
        placeholder="Search items"
      />

      <FlatList
        data={foodItems.filter((item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
        )}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        style={styles.list}
      />

      <Button
        title="Add Item"
        onPress={() => {
          setModalVisible(true);
          setIsEditing(false);
        }}
        color="#28a745"
      />

      <Modal transparent={true} visible={modalVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <ThemedText type="title" style={styles.modalTitle}>
              {isEditing ? "Edit Item" : "Add Item"}
            </ThemedText>
            <TextInput
              style={styles.modalInput}
              value={newItem}
              onChangeText={setNewItem}
              placeholder="Food item name"
            />
            <TextInput
              style={styles.modalInput}
              value={quantity === "" ? "" : String(quantity)}
              onChangeText={handleQuantityChange}
              placeholder="Quantity"
              keyboardType="numeric"
            />
            <Button
              title={isEditing ? "Update" : "Add"}
              onPress={isEditing ? editFoodItem : addFoodItem}
              color="#007bff"
            />
            <Button
              title="Cancel"
              onPress={() => {
                setModalVisible(false);
                resetInputs();
              }}
              color="gray"
            />
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f8f9fa",
    flex: 1,
  },
  title: {
    marginBottom: 16,
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 8,
    marginBottom: 16,
    borderRadius: 4,
  },
  list: {
    marginTop: 10,
    flex: 1,
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 8,
    marginBottom: 8,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    elevation: 1,
  },
  itemText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
    marginRight: 8,
  },
  buttonContainer: {
    flexDirection: "row",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  modalInput: {
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 4,
  },
});
