import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Dimensions, Platform } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { getUsers, getInventoryItems, postDelivery } from '../constants/api'; 
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import Toast from 'react-native-toast-message';

const { width } = Dimensions.get('window');

const DistributorAllocationForm = ({ onAddAllocation, allocations = {}, navigation }) => {
  const [distributor, setDistributor] = useState('');
  const [quantity, setQuantity] = useState('');
  const [salesPersons, setSalesPersons] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState('');
  const [vehicleNo, setVehicleNo] = useState('');
  const [deliveryDate, setDeliveryDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSalesPersons();
    fetchInventoryItems();
  }, []);

  const fetchSalesPersons = async () => {
    setLoading(true);
    try {
      const response = await getUsers();
      const filteredSalesPersons = response.filter(user => user.UserRole === 'Sales');
      setSalesPersons(filteredSalesPersons);
      setLoading(false);
    } catch (error) {
      setError('Failed to load sales persons');
      setLoading(false);
    }
  };

  const fetchInventoryItems = async () => {
    setLoading(true);
    try {
      const response = await getInventoryItems();
      setInventoryItems(response);
      setLoading(false);
    } catch (error) {
      setError('Failed to load inventory items');
      setLoading(false);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || deliveryDate;
    setShowDatePicker(Platform.OS === 'ios');
    setDeliveryDate(currentDate);
  };

  const showToast = (message1, message2, type) => {
    Toast.show({
      type: type,
      position: 'top', 
      text1: message1,
      text2: message2,
      visibilityTime: 4000,
      autoHide: true,
    });
  };

  const handleSubmit = async () => {
    if (distributor && quantity && selectedItem && vehicleNo && deliveryDate) {
      const selectedSalesPerson = salesPersons.find(person => person.FullName === distributor);
      const deliveryData = {
        deliveryDate: deliveryDate.toISOString(),
        salesPerson: selectedSalesPerson.Id,
        vehicleNo,
        addedBy: 'admin',
        details: [
          {
            itemID: selectedItem,
            quantity: parseInt(quantity),
          },
        ],
      };

      try {
        await postDelivery(deliveryData);
        onAddAllocation(distributor, parseInt(quantity));
        setDistributor('');
        setQuantity('');
        setSelectedItem('');
        setVehicleNo('');
        setDeliveryDate(new Date());
        
        showToast('Success', 'Delivery added successfully', 'success');
        
        setTimeout(() => {
          navigation.navigate('DistributorAllocationView');
        }, 2000);
      } catch (error) {
        setError('Failed to post delivery');
        showToast('Error', 'Failed to add delivery', 'error');
      }
    } else {
      showToast('Error', 'Please fill all fields', 'error');
    }
  };

  const chartData = {
    labels: Object.keys(allocations),
    datasets: [{ data: Object.values(allocations) }],
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Alocate New Delivery</Text>
      <View style={styles.formContainer}>
        <Text style={styles.label}>Sales Person</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={distributor}
            onValueChange={(itemValue) => setDistributor(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select a sales person" value="" />
            {salesPersons.map((person) => (
              <Picker.Item key={person.Id} label={person.FullName} value={person.FullName} />
            ))}
          </Picker>
        </View>
        <Text style={styles.label}>Vehicle Number</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={vehicleNo}
            onValueChange={(itemValue) => setVehicleNo(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select a vehicle" value="" />
            <Picker.Item label="KDD409X" value="KDD409X" />
            <Picker.Item label="KDR404R" value="KDR404R" />
            <Picker.Item label="KBJ001L" value="KBJ001L" />
          </Picker>
        </View>
        <Text style={styles.label}>Inventory Item</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedItem}
            onValueChange={(itemValue) => setSelectedItem(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select an item" value="" />
            {inventoryItems.map((item) => (
              <Picker.Item key={item.ItemID} label={item.ItemName} value={item.ItemID} />
            ))}
          </Picker>
        </View>
        <Text style={styles.label}>Quantity</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter quantity"
          value={quantity}
          onChangeText={setQuantity}
          keyboardType="numeric"
        />
        <Text style={styles.label}>Delivery Date</Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateInput}>
          <Text>{deliveryDate.toISOString().split('T')[0]}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={deliveryDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Add Allocation</Text>
        </TouchableOpacity>
      </View>

      {Object.keys(allocations).length > 0 && (
        <>
          <Text style={styles.subtitle}>Current Allocations</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <BarChart
              data={chartData}
              width={Math.max(width - 40, Object.keys(allocations).length * 100)}
              height={300}
              yAxisLabel=""
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForLabels: {
                  fontSize: 12,
                  rotation: 45,
                  translateY: 20,
                },
              }}
              style={styles.chart}
              verticalLabelRotation={45}
            />
          </ScrollView>

          <View style={styles.listContainer}>
            <Text style={styles.listTitle}>Allocation List</Text>
            {Object.entries(allocations).map(([dist, qty]) => (
              <View key={dist} style={styles.listItem}>
                <Text style={styles.listItemText}>{dist}</Text>
                <Text style={styles.listItemQuantity}>{qty}</Text>
              </View>
            ))}
          </View>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 10,
    color: '#333',
  },
  formContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
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
    width: '100%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    justifyContent: 'center',
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
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  listContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    marginTop: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  listItemText: {
    fontSize: 16,
    color: '#4a4a4a',
  },
  listItemQuantity: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
});

export default DistributorAllocationForm;