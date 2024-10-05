import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { addInventoryItem } from '../constants/api';

const ProductForm = ({ product }) => {
  const [itemName, setItemName] = useState('');
  const [cost, setCost] = useState('');
  const [unitName, setUnitName] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    if (product) {
      setItemName(product.itemName);
      setCost(product.cost.toString());
      setUnitName(product.unitName);
      setCategory(product.category);
    }
  }, [product]);

  const handleSubmit = async () => {
    const newProduct = {
      itemName,
      cost: parseFloat(cost), 
      unitName,
      category
    };

    try {
      await addInventoryItem(newProduct); 
      Alert.alert('Success', 'Product added successfully');
      setItemName('');
      setCost('');
      setUnitName('');
      setCategory('');
    } catch (error) {
      Alert.alert('Error', 'Failed to add product');
      console.error('Error adding product:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>
        {product ? 'Edit Product' : 'Add New Product'}
      </Text>
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
      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit}
      >
        <Text style={styles.buttonText}>{product ? 'Update Product' : 'Add Product'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#4CAF50', 
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff', 
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProductForm;
