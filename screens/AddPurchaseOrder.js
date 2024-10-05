import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { postPurchaseOrder, getInventoryItems, getSuppliers } from '../constants/api';

const AddPOPage = ({ navigation }) => {
  const [orderDate, setOrderDate] = useState(new Date().toISOString());
  const [orderNo, setOrderNo] = useState('1');
  const [supplierID, setSupplierID] = useState(null);
  const [addedBy, setAddedBy] = useState('admin');
  const [items, setItems] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedItemID, setSelectedItemID] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [bagQty, setBagQty] = useState('');
  const [details, setDetails] = useState([]);

  useEffect(() => {
    const fetchItemsAndSuppliers = async () => {
      try {
        const itemsResponse = await getInventoryItems();
        const suppliersResponse = await getSuppliers();
        const formattedSuppliers = suppliersResponse.map(item => ({
            id: item.SupplierID, 
            name: item.SupplierName
          }));
        setInventoryItems(itemsResponse);
        setSuppliers(formattedSuppliers);
      } catch (error) {
        console.error('Error fetching items or suppliers:', error);
      }
    };
    fetchItemsAndSuppliers();
  }, []);

  const handleAddDetail = () => {
    if (!selectedItemID || !quantity || !bagQty) {
      Alert.alert('Error', 'Please fill in all item details');
      return;
    }

    const newDetail = {
      itemID: selectedItemID,
      quantity: parseInt(quantity),
      bagQty: parseInt(bagQty),
    };
    setDetails([...details, newDetail]);
    setSelectedItemID(null);
    setQuantity('');
    setBagQty('');
  };

  const handleAddPO = async () => {
    if (!orderNo || !supplierID || details.length === 0) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const poData = {
      orderDate,
      orderNo,
      supplierID,
      addedBy,
      details,
    };

    try {
      await postPurchaseOrder(poData);
      Alert.alert('Success', 'Purchase Order created successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Error adding Purchase Order:', error);
      Alert.alert('Error', 'Failed to add Purchase Order');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Picker
        selectedValue={supplierID}
        style={styles.input}
        onValueChange={(itemValue) => setSupplierID(itemValue)}
      >
        <Picker.Item label="Select Supplier" value={null} />
        {suppliers.map((supplier) => (
          <Picker.Item key={supplier.id} label={supplier.name} value={supplier.id} />
        ))}
      </Picker>

      {/* Item selection */}
      <Picker
        selectedValue={selectedItemID}
        style={styles.input}
        onValueChange={(itemValue) => setSelectedItemID(itemValue)}
      >
        <Picker.Item label="Select Item" value={null} />
        {inventoryItems.map((item) => (
          <Picker.Item key={item.ItemID} label={item.ItemName} value={item.ItemID} />
        ))}
      </Picker>
      <TextInput
        style={styles.input}
        placeholder="Quantity (bags)"
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Bag Quantity (kg)"
        value={bagQty}
        onChangeText={setBagQty}
        keyboardType="numeric"
      />
      
      {/* Add Item Button */}
      <TouchableOpacity style={styles.addButton} onPress={handleAddDetail}>
        <Text style={styles.addButtonText}>Add Item {details.length + 1}</Text>
      </TouchableOpacity>

      <Text style={styles.detailTitle}>Added Items:</Text>
      {details.map((detail, index) => (
        <Text key={index} style={styles.detailText}>
          Item ID: {detail.itemID}, Quantity: {detail.quantity}, Bag Qty: {detail.bagQty}
        </Text>
      ))}

      {/* Add Purchase Order Button */}
      <TouchableOpacity 
        style={[styles.addButton, { backgroundColor: details.length === 0 ? '#ccc' : '#4CAF50' }]}
        onPress={handleAddPO}
        disabled={details.length === 0}
      >
        <Text style={styles.addButtonText}>Add Purchase Order</Text>
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
    marginBottom: 15,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  detailTitle: {
    fontSize: 18,
    marginVertical: 10,
    color: '#333',
  },
  detailText: {
    fontSize: 16,
    color: '#555',
  },
});

export default AddPOPage;