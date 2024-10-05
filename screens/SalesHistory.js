import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  TextInput, 
  Dimensions,
  ActivityIndicator,
  Alert
} from 'react-native';
import axios from 'axios';
import { LineChart, PieChart } from 'react-native-chart-kit';
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

// Mock data
const mockSales = [
  { id: 1, customerName: 'John Doe', productName: 'Product A', date: '2023-05-01', totalAmount: 100 },
  { id: 2, customerName: 'Jane Smith', productName: 'Product B', date: '2023-05-02', totalAmount: 150 },
  { id: 3, customerName: 'Bob Johnson', productName: 'Product C', date: '2023-05-03', totalAmount: 200 },
  { id: 4, customerName: 'Alice Brown', productName: 'Product D', date: '2023-05-04', totalAmount: 120 },
  { id: 5, customerName: 'Charlie Davis', productName: 'Product E', date: '2023-05-05', totalAmount: 180 },
];

const mockDistributors = [
  { label: 'Distributor A', value: 1 },
  { label: 'Distributor B', value: 2 },
  { label: 'Distributor C', value: 3 },
];

const SalesHistoryScreen = ({ navigation }) => {
  const [sales, setSales] = useState(mockSales);
  const [filteredSales, setFilteredSales] = useState(mockSales);
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState(new Date(new Date().setMonth(new Date().getMonth() - 1)));
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [viewMode, setViewMode] = useState('general');
  const [openDropdown, setOpenDropdown] = useState(false);
  const [distributors, setDistributors] = useState(mockDistributors);
  const [selectedDistributor, setSelectedDistributor] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    filterSales();
  }, [sales, searchQuery, startDate, endDate, viewMode, selectedDistributor]);

  const filterSales = () => {
    let filtered = sales.filter(sale => 
      new Date(sale.date) >= startDate && 
      new Date(sale.date) <= endDate &&
      (sale.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
       sale.productName.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (viewMode === 'distributor' && selectedDistributor) {
      // In a real scenario, you'd filter by distributor here
      filtered = filtered.slice(0, 3); // Just show fewer items for distributor view
    }

    setFilteredSales(filtered);
  };

  const renderSaleItem = useCallback(({ item }) => (
    <TouchableOpacity 
      style={styles.saleItem}
      onPress={() => navigation.navigate('SaleDetails', { saleId: item.id })}
    >
      <Text style={styles.customerName}>{item.customerName}</Text>
      <Text style={styles.productName}>{item.productName}</Text>
      <Text style={styles.saleDate}>{new Date(item.date).toLocaleDateString()}</Text>
      <Text style={styles.saleAmount}>${item.totalAmount.toFixed(2)}</Text>
    </TouchableOpacity>
  ), [navigation]);

  const getChartData = () => {
    const labels = filteredSales.map(sale => new Date(sale.date).toLocaleDateString());
    const data = filteredSales.map(sale => sale.totalAmount);
    return { 
      labels: labels.slice(0, 6), // Show only 6 labels for better readability
      datasets: [{ data }] 
    };
  };

  const getDistributorData = () => {
    // Mock distributor data
    return [
      { name: 'Distributor A', amount: 300, color: '#FF6384', legendFontColor: '#7F7F7F', legendFontSize: 15 },
      { name: 'Distributor B', amount: 250, color: '#36A2EB', legendFontColor: '#7F7F7F', legendFontSize: 15 },
      { name: 'Distributor C', amount: 200, color: '#FFCE56', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    ];
  };

  return (
    <View style={styles.container}>
      <FlatList
        ListHeaderComponent={
          <>
            
            <TextInput
              style={styles.searchInput}
              placeholder="Search by customer or product"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />

            <View style={styles.dateContainer}>
              <TouchableOpacity onPress={() => setShowStartDatePicker(true)} style={styles.dateButton}>
                <Text>Start: {startDate.toLocaleDateString()}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowEndDatePicker(true)} style={styles.dateButton}>
                <Text>End: {endDate.toLocaleDateString()}</Text>
              </TouchableOpacity>
            </View>

            {showStartDatePicker && (
              <DateTimePicker
                value={startDate}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowStartDatePicker(false);
                  if (selectedDate) setStartDate(selectedDate);
                }}
              />
            )}

            {showEndDatePicker && (
              <DateTimePicker
                value={endDate}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowEndDatePicker(false);
                  if (selectedDate) setEndDate(selectedDate);
                }}
              />
            )}

            <View style={styles.viewModeContainer}>
              <TouchableOpacity 
                style={[styles.viewModeButton, viewMode === 'general' && styles.activeViewMode]} 
                onPress={() => setViewMode('general')}
              >
                <Text>General</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.viewModeButton, viewMode === 'distributor' && styles.activeViewMode]} 
                onPress={() => setViewMode('distributor')}
              >
                <Text>By Distributor</Text>
              </TouchableOpacity>
            </View>

            {viewMode === 'distributor' && (
              <DropDownPicker
                open={openDropdown}
                value={selectedDistributor}
                items={distributors}
                setOpen={setOpenDropdown}
                setValue={setSelectedDistributor}
                setItems={setDistributors}
                placeholder="Select a distributor"
                containerStyle={styles.dropdownContainer}
              />
            )}

            <Text style={styles.chartTitle}>Sales Over Time</Text>
            <LineChart
              data={getChartData()}
              width={width - 40}
              height={220}
              chartConfig={{
                backgroundColor: "#e26a00",
                backgroundGradientFrom: "#fb8c00",
                backgroundGradientTo: "#ffa726",
                decimalPlaces: 2,
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 16
                },
                propsForDots: {
                  r: "6",
                  strokeWidth: "2",
                  stroke: "#ffa726"
                }
              }}
              bezier
              style={styles.chart}
            />

            {viewMode === 'distributor' && (
              <>
                <Text style={styles.chartTitle}>Sales by Distributor</Text>
                <PieChart
                  data={getDistributorData()}
                  width={width - 40}
                  height={220}
                  chartConfig={{
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  }}
                  accessor="amount"
                  backgroundColor="transparent"
                  paddingLeft="15"
                  style={styles.chart}
                />
              </>
            )}

            <Text style={styles.listTitle}>Recent Sales</Text>
          </>
        }
        data={filteredSales}
        renderItem={renderSaleItem}
        keyExtractor={item => item.id.toString()}
        style={styles.list}
      />
    </View>
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
  },
  searchInput: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  dateButton: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
  },
  viewModeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  viewModeButton: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
  },
  activeViewMode: {
    backgroundColor: '#4CAF50',
  },
  dropdownContainer: {
    marginBottom: 10,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  list: {
    marginBottom: 20,
  },
  saleItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
  },
  customerName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  productName: {
    fontSize: 16,
    color: '#666',
  },
  saleDate: {
    fontSize: 14,
    color: '#666',
  },
  saleAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 5,
  },
});

export default SalesHistoryScreen;
