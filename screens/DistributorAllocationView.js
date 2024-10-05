import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { getDeliveries } from '../constants/api'; 
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from '@react-navigation/native'; 

const DistributorAllocationView = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('Ongoing'); 
  const navigation = useNavigation();

  useEffect(() => {
    fetchDeliveries();
  }, [status]);

  const fetchDeliveries = async () => {
    setLoading(true);
    try {
      const response = await getDeliveries(status);
      setDeliveries(Array.isArray(response) ? response : []); // Ensure deliveries is an array
      setLoading(false);
    } catch (error) {
      setError('Failed to load deliveries');
      setDeliveries([]); // Set deliveries to an empty array on error
      setLoading(false);
    }
  };

  const getBarWidth = (balance, quantity) => {
    return (balance / quantity) * 100;
  };

  return (
    <View style={styles.container}> 
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={status}
          onValueChange={(itemValue) => setStatus(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Ongoing" value="Ongoing" />
          <Picker.Item label="Dispatched" value="Dispatched" />
          <Picker.Item label="Completed" value="Completed" />
        </Picker>
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContainer}> 
        {Array.isArray(deliveries) && deliveries.map((delivery) => (
          <View key={delivery.DeliveryID} style={styles.deliveryCard}>
            <Text style={styles.deliveryTitle}>{delivery.DeliveryNo}</Text>
            <Text>Sales Person: {delivery.SalesPerson}</Text>
            <Text>Vehicle No: {delivery.VehicleNo}</Text>
            <Text>Delivery Date: {new Date(delivery.DeliveryDate).toLocaleDateString()}</Text>
            
            {/* Add a check to ensure delivery.details exists and is an array */}
            {Array.isArray(delivery.details) && delivery.details.map((detail) => (
              <View key={detail.DeliveryDetailID} style={styles.detailContainer}>
                <Text>{detail.ItemName} ({detail.UnitName})</Text>
                <View style={styles.priceBarContainer}>
                  <View style={[styles.priceBar, { width: `${getBarWidth(detail.Balance, detail.Quantity)}%` }]} />
                </View>
                <Text>Quantity: {detail.Quantity}</Text>
                <Text>Balance: {detail.Balance}</Text>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('DistributorAllocationForm')} 
      >
        <Icon name="plus" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10, 
  },
  scrollContainer: {
    paddingBottom: 20, 
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 15,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  deliveryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  deliveryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  detailContainer: {
    marginTop: 10,
  },
  priceBarContainer: {
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    overflow: 'hidden',
    marginTop: 5,
  },
  priceBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#4CAF50',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});

export default DistributorAllocationView;
