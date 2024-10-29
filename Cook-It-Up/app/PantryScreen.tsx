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
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from "@react-navigation/native";

interface FoodItem {
  id: number;
  name: string;
  totalQuantity: number;
  weightPerItem: number;
  unit: string;
  type: string;
  expirationDate?: string; // Optional expiration date
}

// Extend the global object to include foodItems
declare global {
  var foodItems: FoodItem[];
}

// Declare foodTypes and units before using them
const foodTypes = ["Dairy", "Fruits", "Vegetables", "Protein", "Grains"];
const units = ["oz", "g", "lbs", "kg"];

export default function PantryScreen() {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();

  const [foodItems, setFoodItems] = useState<FoodItem[]>(
    global.foodItems || []
  );
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("All");
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentItemId, setCurrentItemId] = useState<number | null>(null);
  const [newItem, setNewItem] = useState<string>("");
  const [totalQuantity, setTotalQuantity] = useState<number | "">("");
  const [weightPerItem, setWeightPerItem] = useState<number | "">("");
  const [selectedUnit, setSelectedUnit] = useState<string>(units[0]);
  const [foodType, setFoodType] = useState<string>(foodTypes[0]);
  const [addExpiration, setAddExpiration] = useState<boolean>(false);
  const [expirationDate, setExpirationDate] = useState<string>("");

  useEffect(() => {
    // Update global foodItems and emit event whenever foodItems change
    global.foodItems = foodItems;
    DeviceEventEmitter.emit("foodItemsUpdated", foodItems);
  }, [foodItems]);

  const addFoodItem = () => {
    if (newItem.trim() && totalQuantity !== "" && weightPerItem !== "") {
      const itemData: FoodItem = {
        id: Date.now(), // Use timestamp for unique ID
        name: newItem.trim(),
        totalQuantity: Number(totalQuantity),
        weightPerItem: Number(weightPerItem),
        unit: selectedUnit,
        type: foodType,
        ...(addExpiration ? { expirationDate } : {}),
      };
      setFoodItems([...foodItems, itemData]);
      resetInputs();
      setModalVisible(false);
    } else {
      Alert.alert("Error", "Please fill in all fields.");
    }
  };

  const editFoodItem = () => {
    if (
      currentItemId !== null &&
      newItem.trim() &&
      totalQuantity !== "" &&
      weightPerItem !== ""
    ) {
      const updatedItems = foodItems.map((item) => {
        if (item.id === currentItemId) {
          return {
            ...item,
            name: newItem.trim(),
            totalQuantity: Number(totalQuantity),
            weightPerItem: Number(weightPerItem),
            unit: selectedUnit,
            type: foodType,
            ...(addExpiration ? { expirationDate } : {}),
          };
        }
        return item;
      });
      setFoodItems(updatedItems);
      resetInputs();
      setModalVisible(false);
    } else {
      Alert.alert("Error", "Please fill in all fields.");
    }
  };

  const resetInputs = () => {
    setNewItem("");
    setTotalQuantity("");
    setWeightPerItem("");
    setSelectedUnit(units[0]);
    setFoodType(foodTypes[0]);
    setAddExpiration(false);
    setExpirationDate("");
    setCurrentItemId(null);
    setIsEditing(false);
  };

  const confirmDelete = (id: number) => {
    Alert.alert("Delete Item", "Are you sure you want to delete this item?", [
      { text: "Cancel", style: "cancel" },
      { text: "OK", onPress: () => deleteItem(id) },
    ]);
  };

  const deleteItem = (id: number) => {
    setFoodItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const renderItem = ({ item }: { item: FoodItem }) => {
    return (
      <View style={styles.itemContainer}>
        <ThemedText style={styles.itemText}>
          {item.name} (x{item.totalQuantity}, {item.weightPerItem} {item.unit}{" "}
          each) - {item.type}{" "}
          {item.expirationDate ? `- Exp: ${item.expirationDate}` : ""}
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
  };

  const openEditModal = (item: FoodItem) => {
    setNewItem(item.name);
    setTotalQuantity(item.totalQuantity);
    setWeightPerItem(item.weightPerItem);
    setSelectedUnit(item.unit);
    setFoodType(item.type);
    setExpirationDate(item.expirationDate || "");
    setAddExpiration(!!item.expirationDate);
    setCurrentItemId(item.id);
    setIsEditing(true);
    setModalVisible(true);
  };

  const handleTotalQuantityChange = (text: string) => {
    if (text === "") {
      setTotalQuantity("");
    } else {
      const numericValue = parseFloat(text);
      setTotalQuantity(isNaN(numericValue) ? "" : numericValue);
    }
  };

  const handleWeightPerItemChange = (text: string) => {
    if (text === "") {
      setWeightPerItem("");
    } else {
      const numericValue = parseFloat(text);
      setWeightPerItem(isNaN(numericValue) ? "" : numericValue);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ThemedText type="title" style={styles.title}>
          Pantry
        </ThemedText>
        <TextInput
          style={styles.input}
          value={searchTerm}
          onChangeText={setSearchTerm}
          placeholder="Search items"
        />
        <Picker
          selectedValue={selectedType}
          style={styles.picker}
          onValueChange={(itemValue: string) => setSelectedType(itemValue)}
        >
          <Picker.Item label="All" value="All" />
          {foodTypes.map((type) => (
            <Picker.Item key={type} label={type} value={type} />
          ))}
        </Picker>
        <FlatList
          data={foodItems.filter(
            (item) =>
              item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
              (selectedType === "All" || item.type === selectedType)
          )}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          style={styles.list}
        />
      </View>
      <View style={styles.footer}>
        <Button
          title="Add Item"
          onPress={() => {
            setModalVisible(true);
            setIsEditing(false);
          }}
          color="#28a745"
        />
        <Button
          title="Go to Create"
          onPress={() => navigation.navigate("CreateScreen")}
          color="#007bff"
        />
      </View>
      <Modal transparent={true} visible={modalVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <ScrollView contentContainerStyle={styles.modalContent}>
              <ThemedText type="title" style={styles.modalTitle}>
                {isEditing ? "Edit Item" : "Add Item"}
              </ThemedText>
              <TextInput
                style={styles.modalInput}
                value={newItem}
                onChangeText={setNewItem}
                placeholder="Food item name"
              />
              <Picker
                selectedValue={foodType}
                style={styles.modalPicker}
                onValueChange={(itemValue: string) => setFoodType(itemValue)}
              >
                {foodTypes.map((type) => (
                  <Picker.Item key={type} label={type} value={type} />
                ))}
              </Picker>
              <TextInput
                style={styles.modalInput}
                value={totalQuantity === "" ? "" : String(totalQuantity)}
                onChangeText={handleTotalQuantityChange}
                placeholder="Total Quantity"
                keyboardType="numeric"
              />
              <TextInput
                style={styles.modalInput}
                value={weightPerItem === "" ? "" : String(weightPerItem)}
                onChangeText={handleWeightPerItemChange}
                placeholder="Weight per Item"
                keyboardType="numeric"
              />
              <Picker
                selectedValue={selectedUnit}
                style={styles.modalPicker}
                onValueChange={(itemValue: string) =>
                  setSelectedUnit(itemValue)
                }
              >
                {units.map((unit) => (
                  <Picker.Item key={unit} label={unit} value={unit} />
                ))}
              </Picker>
              <ThemedText style={styles.modalText}>
                Do you want to add an expiration date?
              </ThemedText>
              <Picker
                selectedValue={addExpiration ? "Yes" : "No"}
                style={styles.modalPicker}
                onValueChange={(value: string) =>
                  setAddExpiration(value === "Yes")
                }
              >
                <Picker.Item label="Yes" value="Yes" />
                <Picker.Item label="No" value="No" />
              </Picker>
              {addExpiration && (
                <TextInput
                  style={styles.modalInput}
                  value={expirationDate}
                  onChangeText={setExpirationDate}
                  placeholder="Expiration Date (YYYY-MM-DD)"
                />
              )}
              <View style={styles.modalButtonContainer}>
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
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Ensure the container takes up the full screen
    padding: 16,
    backgroundColor: "#f8f9fa",
  },
  content: {
    flex: 1, // Allow content to expand and fill available space
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
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
    backgroundColor: "#fff",
  },
  picker: {
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  list: {
    flex: 1, // Allow the list to expand and fill available space
    marginTop: 10,
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
    width: "90%", // Increased width for better mobile view
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 20,
    elevation: 5,
    maxHeight: "80%", // Ensure the modal doesn't exceed screen height
  },
  modalContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },
  modalInput: {
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 4,
    backgroundColor: "#fff",
  },
  modalPicker: {
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  modalText: {
    marginBottom: 10,
    fontSize: 16,
    color: "#333",
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
});
