import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const ProductListItem = ({ product, onEdit, onDelete }) => {
  return (
    <View style={styles.container}>
      <Image source={{ uri: product.image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {product.name}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {product.description}
        </Text>
        <Text style={styles.price}>KES{product.price.toFixed(2)}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity onPress={onEdit} style={styles.actionButton}>
          <Icon name="pencil" size={24} color="#2196F3" />
        </TouchableOpacity>
        <TouchableOpacity onPress={onDelete} style={styles.actionButton}>
          <Icon name="delete" size={24} color="#F44336" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: 80,
    height: 80,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  info: {
    flex: 1,
    padding: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  actions: {
    flexDirection: "column",
    justifyContent: "space-around",
    padding: 10,
  },
  actionButton: {
    padding: 5,
  },
});

export default ProductListItem;
