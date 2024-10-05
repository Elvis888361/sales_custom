import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { addInventoryItem } from '../constants/api';

const AddProductScreen = ({ navigation }) => {
  const [itemName, setItemName] = useState('');
  const [cost, setCost] = useState('');
  const [unitName, setUnitName] = useState('');
  const [category, setCategory] = useState('');

  const handleAddProduct = async () => {
    if (!itemName || !cost || !unitName || !category) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const itemData = {
      itemName,
      cost: parseFloat(cost),
      unitName,
      category,
    };

    try {
      await addInventoryItem(itemData); 
      Alert.alert('Success', 'Product added successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Error adding product:', error);
      Alert.alert('Error', 'Failed to add product');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Add New Product</Text>
      <TextInput
        style={styles.input}
        placeholder="Item Name"
        value={itemName}
        onChangeText={setItemName}
      />
      <TextInput
        style={styles.input}
        placeholder="Cost"
        value={cost}
        onChangeText={setCost}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Unit Name"
        value={unitName}
        onChangeText={setUnitName}
      />
      <TextInput
        style={styles.input}
        placeholder="Category"
        value={category}
        onChangeText={setCategory}
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAddProduct}>
        <Text style={styles.addButtonText}>Add Product</Text>
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
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddProductScreen;
