import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

const ProductCard = ({ productName, quantity, price, image, itemName, unitName, onPress }) => {
  const defaultImage = 'https://via.placeholder.com/500x200';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.productName}> Delivery Number: {productName || "No Name"}</Text>
      <Image
        source={{ uri: image || defaultImage }}
        style={styles.image}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.itemName}> Item Name: {itemName || "N/A"}</Text>
        <Text style={styles.unitName}> Unit Name: {unitName || "N/A"}</Text>
        
        <Text style={styles.quantity}>Quantity Available: {quantity || 0}</Text>
        {/* <Text style={styles.price}>Price: KES {price ? price.toFixed(2) : "0.00"}</Text> */}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    margin: 10,
    width: 180,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 120,
  },
  infoContainer: {
    padding: 10,
  },
  itemName: {
    fontSize: 14,
    color: "#555",
  },
  unitName: {
    fontSize: 14,
    color: "#555",
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginVertical: 5,
  },
  quantity: {
    fontSize: 14,
    color: "#777",
  },
  price: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2196F3",
    marginTop: 5,
  },
});

export default ProductCard;
