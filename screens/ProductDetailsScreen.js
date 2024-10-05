import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import axios from "axios";

const ProductDetailsScreen = ({ route, navigation }) => {
  const { product } = route.params;

  const handleEditProduct = () => {
    navigation.navigate("EditProduct", { product });
  };

  const handleDeleteProduct = async () => {
    Alert.alert(
      "Delete Product",
      "Are you sure you want to delete this product?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await axios.delete(`YOUR_API/products/${product.id}`);
              Alert.alert("Success", "Product deleted successfully");
              navigation.goBack();
            } catch (error) {
              console.error("Error deleting product:", error);
              Alert.alert("Error", "Failed to delete product");
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: product.image }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.price}>KES{product.price.toFixed(2)}</Text>
        <Text style={styles.description}>{product.description}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.editButton} onPress={handleEditProduct}>
          <Icon name="pencil" size={24} color="#fff" />
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDeleteProduct}
        >
          <Icon name="delete" size={24} color="#fff" />
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  image: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
  },
  infoContainer: {
    padding: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    marginBottom: 30,
  },
  editButton: {
    backgroundColor: "#2196F3",
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: "#F44336",
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ProductDetailsScreen;
