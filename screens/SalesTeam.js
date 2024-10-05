import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { getUsers, getSales } from '../constants/api'; 
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { format } from 'date-fns';

const SalesTeam = ({ navigation }) => {
  const [salespersons, setSalesPersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalSalesPersons, setTotalSalesPersons] = useState(0);
  const [salesTotalToday, setSalesTotalToday] = useState(0);
  const [totalSalesThisMonth, setTotalSalesThisMonth] = useState(0);
  const [salesData, setSalesData] = useState([]); 
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchSalesPersons();
    fetchSalesData();
  }, []);

  const fetchSalesPersons = async () => {
    setLoading(true);
    try {
      const response = await getUsers();
      const formattedSalesPersons = response
        .filter(item => item.UserRole === 'Sales')
        .map(item => ({
          id: item.Id,
          name: item.FullName,
          phone: item.PhoneNumber,
          email: item.Email,
          dateAdded: item.DateAdded,
          formattedDateAdded: format(new Date(item.DateAdded), 'MMMM dd, yyyy'),
        }));

      setSalesPersons(formattedSalesPersons);
      setTotalSalesPersons(formattedSalesPersons.length);
      setLoading(false);
    } catch (error) {
      setError('Failed to load sales team');
      setLoading(false);
    }
  };

  const fetchSalesData = async () => {
    try {
      const salesResponse = await getSales(); 
      setSalesData(salesResponse);
      calculateTotalSalesToday(salesResponse);
      calculateTotalSalesThisMonth(salesResponse);
    } catch (error) {
      setError('Failed to load sales data');
    }
  };

  const calculateTotalSalesToday = (salesData) => {
    const today = new Date().toISOString().slice(0, 10); 
    const todaySales = salesData.filter(sale => sale.SaleDate.slice(0, 10) === today);
    const totalSales = todaySales.reduce((sum, sale) => sum + sale.TotalAmount, 0);
    setSalesTotalToday(totalSales);
  };

  const calculateTotalSalesThisMonth = (salesData) => {
    const currentMonth = new Date().getMonth(); 
    const currentYear = new Date().getFullYear(); 
    const monthlySales = salesData.filter(sale => {
      const saleDate = new Date(sale.SaleDate);
      return saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear;
    });
  
    const totalSalesThisMonth = monthlySales.reduce((sum, sale) => sum + sale.TotalAmount, 0);
    setTotalSalesThisMonth(totalSalesThisMonth);
  };

  const getTotalSalesForPerson = (salespersonName) => {
    const salespersonSales = salesData.filter(sale => sale.SalesPerson === salespersonName);
    const totalSales = salespersonSales.reduce((sum, sale) => sum + sale.TotalAmount, 0);
    return totalSales;
  };

  const getBarWidth = (totalSales) => {
    const maxSales = Math.max(...salesData.map(sale => sale.TotalAmount));
    return maxSales > 0 ? (totalSales / maxSales) * 100 : 0; 
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchSalesPersons();
    await fetchSalesData();
    setRefreshing(false);
  };

  const renderSalesPersonItem = ({ item }) => {
    const totalSales = getTotalSalesForPerson(item.name);
    return (
      <TouchableOpacity 
        style={styles.salespersonCard} 
        onPress={() => navigation.navigate('SalesPersonDetails', { salesPersonId: item.name })}
      >
        <View style={styles.salespersonInfo}>
          <View style={styles.salespersonDetails}>
            <Text style={styles.salespersonName}>{item.name}</Text>
            <Text>Phone: {item.phone}</Text>
            <Text style={styles.dateAdded}>Joined: {item.formattedDateAdded}</Text>
          </View>
          <Text style={styles.balance}>Sales: KES {totalSales.toLocaleString()}</Text>
        </View>
        <View style={styles.priceBarContainer}>
          <View style={[styles.priceBar, { width: `${getBarWidth(totalSales)}%` }]} />
        </View>
      </TouchableOpacity>
    );
  };

  const MetricCard = ({ title, value, icon }) => (
    <View style={styles.metricCard}>
      <Icon name={icon} size={32} color="#4CAF50" />
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricTitle}>{title}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.metricsContainer}>
        <MetricCard
          title="Sales Team"
          value={totalSalesPersons}
          icon="account-group"
        />
        <MetricCard
          title="Sales Today"
          value={`KES ${salesTotalToday.toLocaleString()}`}
          icon="calendar-today"
        />
        <MetricCard
          title="Sales This Month"
          value={`KES ${totalSalesThisMonth.toLocaleString()}`}
          icon="calendar-month"
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#4CAF50" />
      ) : error ? (
        <Text style={{ color: 'red' }}>{error}</Text>
      ) : (
        <FlatList
          data={salespersons}
          renderItem={renderSalesPersonItem}
          keyExtractor={(item) => item.id.toString()}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("AddSalesPerson")}
      >
        <Icon name="plus" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
    backgroundColor: '#fff',
  },
  metricsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  metricCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    width: "30%",
    elevation: 3,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginTop: 5,
  },
  metricTitle: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
    textAlign: "center",
  },
  salespersonCard: {
    padding: 10,
    marginBottom: 5,
    borderRadius: 5,
    backgroundColor: '#e9e9e9',
  },
  salespersonInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  salespersonDetails: {
    flex: 1,
  },
  salespersonName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  balance: {
    fontSize: 16,
    fontWeight: 'bold',
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
    bottom: 30,
    right: 30,
    backgroundColor: '#4CAF50',
    borderRadius: 50,
    padding: 15,
    elevation: 5,
  },
  dateAdded: {
    fontSize: 12,
    color: '#666', 
  },
});

export default SalesTeam;