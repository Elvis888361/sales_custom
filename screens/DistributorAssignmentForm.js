import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DistributorAllocationList from './DistributorAllocationList';

const staticAllocations = {
  'Distributor A': 150,
  'Distributor B': 200,
  'Distributor C': 100,
  'Distributor D': 175,
  'Distributor E': 125,
  'Distributor F': 225,
  'Distributor G': 80,
  'Distributor H': 190,
  'Distributor I': 140,
  'Distributor J': 160,
};

const DistributorAssignmentForm = ({ product }) => {
  const [distributor, setDistributor] = useState('');
  const [quantity, setQuantity] = useState('');

  const handleAssign = () => {
    console.log(`Assigned ${quantity} units to ${distributor}`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Assign Product to Distributor</Text>
          <Text style={styles.productName}>{product ? product.name : 'Select a product'}</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={distributor}
              onValueChange={(itemValue) => setDistributor(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Select a distributor" value="" />
              {Object.keys(staticAllocations).map((dist) => (
                <Picker.Item key={dist} label={dist} value={dist} />
              ))}
            </Picker>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Quantity"
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
          />
          <TouchableOpacity style={styles.button} onPress={handleAssign}>
            <Text style={styles.buttonText}>Assign</Text>
          </TouchableOpacity>
        </View>
        
        <DistributorAllocationList allocations={staticAllocations} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
  },
  formContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  productName: {
    fontSize: 18,
    marginBottom: 15,
    color: '#4a4a4a',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 15,
  },
  picker: {
    height: 50,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default DistributorAssignmentForm;
