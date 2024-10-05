import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

const mockData = {
  monthlySales: [
    { month: 'Jan', amount: 5000 },
    { month: 'Feb', amount: 6000 },
    { month: 'Mar', amount: 7500 },
    { month: 'Apr', amount: 8000 },
    { month: 'May', amount: 9000 },
    { month: 'Jun', amount: 10000 },
  ],
  topProducts: [
    { name: 'Product A', salesCount: 150 },
    { name: 'Product B', salesCount: 120 },
    { name: 'Product C', salesCount: 100 },
    { name: 'Product D', salesCount: 80 },
    { name: 'Product E', salesCount: 60 },
  ],
  conversionRate: 0.68,
  customerSegmentation: [
    { name: 'New', percentage: 30 },
    { name: 'Returning', percentage: 45 },
    { name: 'Loyal', percentage: 25 },
  ],
};

const PerformanceMetricsScreen = () => {
  const [metrics] = useState(mockData);
  const [activeMetric, setActiveMetric] = useState('sales');

  const renderMetric = () => {
    switch (activeMetric) {
      case 'sales':
        return (
          <>
            <Text style={styles.subtitle}>Monthly Sales</Text>
            <LineChart
              data={{
                labels: metrics.monthlySales.map(sale => sale.month),
                datasets: [{
                  data: metrics.monthlySales.map(sale => sale.amount)
                }]
              }}
              width={width - 40}
              height={220}
              chartConfig={{
                backgroundColor: '#e26a00',
                backgroundGradientFrom: '#fb8c00',
                backgroundGradientTo: '#ffa726',
                decimalPlaces: 0,
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
          </>
        );
      case 'products':
        return (
          <>
            <Text style={styles.subtitle}>Top Products</Text>
            <BarChart
              data={{
                labels: metrics.topProducts.map(product => product.name),
                datasets: [{
                  data: metrics.topProducts.map(product => product.salesCount)
                }]
              }}
              width={width - 40}
              height={220}
              chartConfig={{
                backgroundColor: '#307ecc',
                backgroundGradientFrom: '#4287f5',
                backgroundGradientTo: '#79a6f6',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              }}
              style={styles.chart}
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Performance Metrics</Text>
      
      {renderMetric()}

      <View style={styles.metricsContainer}>
        <View style={styles.metricBox}>
          <Text style={styles.metricTitle}>Conversion Rate</Text>
          <Text style={styles.conversionRate}>{(metrics.conversionRate * 100).toFixed(2)}%</Text>
        </View>

        <View style={styles.metricBox}>
          <Text style={styles.metricTitle}>Customer Segmentation</Text>
          <PieChart
            data={metrics.customerSegmentation.map(segment => ({
              name: segment.name,
              population: segment.percentage,
              color: `#${Math.floor(Math.random()*16777215).toString(16)}`,
              legendFontColor: '#7F7F7F',
              legendFontSize: 12
            }))}
            width={width - 40}
            height={180}
            chartConfig={{
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        </View>
      </View>

      <TouchableOpacity 
        style={styles.switchButton} 
        onPress={() => setActiveMetric(activeMetric === 'sales' ? 'products' : 'sales')}
      >
        <Icon name="swap-vertical" size={24} color="#fff" />
        <Text style={styles.switchButtonText}>Switch View</Text>
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
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#444',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  metricsContainer: {
    marginTop: 20,
  },
  metricBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  metricTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#555',
  },
  conversionRate: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
    marginTop: 10,
  },
  switchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 20,
    marginTop: 20,
    marginBottom: 30,
  },
  switchButtonText: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PerformanceMetricsScreen;
