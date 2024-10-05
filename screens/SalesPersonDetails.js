import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getSales, getDeliveries } from '../constants/api'; // Assuming getDeliveries is imported

const SalesPersonDetails = ({ route }) => {
  const { salesPersonId } = route.params;
  const [salesData, setSalesData] = useState(null);
  const [deliveriesData, setDeliveriesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSalesPersonData();
  }, []);

  const fetchSalesPersonData = async () => {
    setLoading(true);
    try {
      // Fetch both sales and deliveries
      const [sales, deliveries] = await Promise.all([getSales(), getDeliveries()]);
      
      // Filter sales by salesperson
      const filteredSales = sales.filter(sale => sale.SalesPerson === salesPersonId);

      // Filter deliveries by salesperson
      const filteredDeliveries = deliveries.filter(delivery => delivery.SalesPerson === salesPersonId);

      setSalesData(filteredSales);
      setDeliveriesData(filteredDeliveries);
      setLoading(false);
    } catch (error) {
      setError('Failed to load salesperson data');
      setLoading(false);
    }
  };

  const calculateTotals = () => {
    if (!salesData) return { totalSales: 0, salesCount: 0, todaySales: [] };

    const today = new Date().toISOString().split('T')[0]; // Get today's date in yyyy-mm-dd format
    const todaySales = salesData.filter(sale => sale.SaleDate.startsWith(today));

    const totalSales = salesData.reduce((sum, sale) => sum + sale.TotalAmount, 0);
    const salesCount = salesData.length;

    return { totalSales, salesCount, todaySales };
  };

  const { totalSales, salesCount, todaySales } = calculateTotals();

  const chartData = {
    labels: salesData?.map(sale => sale.SaleDate.split('T')[0]).slice(0, 7), // Labels with dates (last 7 days)
    datasets: [{
      data: salesData?.map(sale => sale.TotalAmount).slice(0, 7), // Sales amounts for chart (last 7 days)
    }]
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#4CAF50" />;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.name}>{salesPersonId}</Text>
      
      {/* Sales Metrics */}
      <View style={styles.metricsContainer}>
        <MetricCard
          title="Total Sales"
          value={`$${totalSales}`}
          icon="cash-multiple"
        />
        <MetricCard
          title="Sales Count"
          value={salesCount}
          icon="receipt"
        />
      </View>

      {/* Sales Performance LineChart */}
      {chartData.labels.length > 0 && (
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Sales Performance (Last 7 Days)</Text>
          <LineChart
            data={chartData}
            width={350}
            height={220}
            yAxisLabel="$"
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16
              },
              propsForDots: {
                r: '6',
                strokeWidth: '2',
                stroke: '#4CAF50'
              }
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16
            }}
          />
        </View>
      )}

      {/* Today's Sales */}
      <View style={styles.salesList}>
        <Text style={styles.salesListTitle}>Today's Sales</Text>
        {todaySales.length > 0 ? todaySales.map((sale, index) => (
          <View key={index} style={styles.saleItem}>
            <Text style={styles.saleItemProduct}>Invoice No: {sale.InvoiceNo}</Text>
            <Text style={styles.saleItemAmount}>${sale.TotalAmount}</Text>
          </View>
        )) : <Text>No Sales for Today</Text>}
      </View>

      {/* Deliveries Section */}
      <View style={styles.salesList}>
        <Text style={styles.salesListTitle}>Recent Deliveries</Text>
        {deliveriesData.length > 0 ? deliveriesData.map((delivery, index) => (
          <View key={index} style={styles.saleItem}>
            <Text style={styles.saleItemProduct}>Delivery No: {delivery.DeliveryNo} - Vehicle: {delivery.VehicleNo}</Text>
            {delivery.details.map((detail, i) => (
              <Text key={i} style={styles.saleItemAmount}>
                {detail.Quantity} {detail.UnitName} of {detail.ItemName}
              </Text>
            ))}
          </View>
        )) : <Text>No Deliveries for Today</Text>}
      </View>

    </ScrollView>
  );
};

const MetricCard = ({ title, value, icon }) => (
  <View style={styles.metricCard}>
    <Icon name={icon} size={32} color="#4CAF50" />
    <Text style={styles.metricValue}>{value}</Text>
    <Text style={styles.metricTitle}>{title}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  metricCard: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    width: '45%',
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 5,
  },
  metricTitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  chartContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  salesList: {
    marginTop: 20,
  },
  salesListTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  saleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  saleItemProduct: {
    flex: 1,
  },
  saleItemAmount: {
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default SalesPersonDetails;