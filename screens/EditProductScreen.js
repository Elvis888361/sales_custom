import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import axios from 'axios';

const EditProductScreen = ({ route, navigation }) => {
  const { product } = route.params;
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description);
  const [price, setPrice] = useState(product.price.toString());
  const [imageUrl, setImageUrl] = useState(product.image);

  const handleUpdateProduct = async () => {
    if (!name || !description || !price || !imageUrl) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      const response = await axios.put(`YOUR_API/products/${product.id}`, {
        name,
        description,
        price: parseFloat(price),
        image: imageUrl,
      });
      Alert.alert('Success', 'Product updated successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Error updating product:', error);
      Alert.alert('Error', 'Failed to update product');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Edit Product</Text>
      <TextInput
        style={styles.input}
        placeholder="Product Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={[styles.input, styles.multilineInput]}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <TextInput
        style={styles.input}
        placeholder="Price"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Image URL"
        value={imageUrl}
        onChangeText={setImageUrl}
      />
      <TouchableOpacity style={styles.updateButton} onPress={handleUpdateProduct}>
        <Text style={styles.updateButtonText}>Update Product</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  updateButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default EditProductScreen;
