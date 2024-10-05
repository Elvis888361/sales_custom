import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const ProductDetails = ({ route, navigation }) => {
  const { product, selectedCustomer, onAddToSale, customerName } = route.params || {};

  if (!product) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Product details are not available.</Text>
      </View>
    );
  }

  const [quantity, setQuantity] = useState("1");

  const handleAddToSale = () => {
    const newItem = {
      id: Date.now().toString(),
      product: product.name,
      quantity: parseInt(quantity),
      price: product.price,
      total: parseInt(quantity),
    };
    onAddToSale(newItem);
    navigation.goBack();
  };

  return (
    <LinearGradient colors={["#4CAF50", "#2196F3"]} style={styles.container}>
      <View style={styles.content}>
        <Image source={{ uri: product.image }} style={styles.image} />
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.price}>Quantity Available: {product.price.toFixed(2)}</Text>

        <View style={styles.customerInfo}>
          <Text style={styles.customerLabel}>Selected Customer:</Text>
          <Text style={styles.customerName}>{customerName}</Text>
        </View>

        <View style={styles.quantityContainer}>
          <Text style={styles.quantityLabel}>Quantity Needed:</Text>
          <TextInput
            style={styles.quantityInput}
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
          />
        </View>

        <TouchableOpacity style={styles.addButton} onPress={handleAddToSale}>
          <Text style={styles.addButtonText}>Add to Sale</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: "center",
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  price: {
    fontSize: 20,
    color: "#fff",
    marginBottom: 20,
  },
  customerInfo: {
    alignItems: "center",
    marginBottom: 20,
  },
  customerLabel: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 5,
  },
  customerName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  quantityLabel: {
    fontSize: 18,
    color: "#fff",
    marginRight: 10,
  },
  quantityInput: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    width: 60,
    fontSize: 18,
  },
  addButton: {
    backgroundColor: "#FF9800",
    borderRadius: 8,
    padding: 15,
    width: "100%",
    alignItems: "center",
  },
  addButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    color: "red",
  },
});

export default ProductDetails;
