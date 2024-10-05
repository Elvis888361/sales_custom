import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const SalesTargetHistory = ({ product }) => {
  // This would typically come from your data store
  const salesHistory = [
    { month: 'Jan', target: 1000, actual: 950 },
    { month: 'Feb', target: 1100, actual: 1150 },
    { month: 'Mar', target: 1200, actual: 1100 },
    { month: 'Apr', target: 1300, actual: 1400 },
    { month: 'May', target: 1400, actual: 1350 },
    { month: 'Jun', target: 1500, actual: 1600 },
  ];

  const getChartData = () => ({
    labels: salesHistory.map(item => item.month),
    datasets: [
      {
        data: salesHistory.map(item => item.target),
        color: (opacity = 1) => `rgba(71, 126, 232, ${opacity})`,
        strokeWidth: 2,
      },
      {
        data: salesHistory.map(item => item.actual),
        color: (opacity = 1) => `rgba(241, 90, 36, ${opacity})`,
        strokeWidth: 2,
      },
    ],
    legend: ['Target', 'Actual'],
  });

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Sales Target History for {product?.name}</Text>
      <BarChart
        data={getChartData()}
        width={width - 40}
        height={300}
        yAxisLabel="$"
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#ffffff',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          barPercentage: 0.5,
        }}
        style={styles.chart}
        showValuesOnTopOfBars
      />
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#477ee8' }]} />
          <Text style={styles.legendText}>Target</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#f15a24' }]} />
          <Text style={styles.legendText}>Actual</Text>
        </View>
      </View>
      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>Month</Text>
          <Text style={styles.tableHeaderText}>Target</Text>
          <Text style={styles.tableHeaderText}>Actual</Text>
          <Text style={styles.tableHeaderText}>Status</Text>
        </View>
        {salesHistory.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.tableCell}>{item.month}</Text>
            <Text style={styles.tableCell}>${item.target}</Text>
            <Text style={styles.tableCell}>${item.actual}</Text>
            <Text style={[styles.tableCell, { color: item.actual >= item.target ? 'green' : 'red' }]}>
              {item.actual >= item.target ? 'Met' : 'Not Met'}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  legendColor: {
    width: 20,
    height: 20,
    borderRadius: 5,
    marginRight: 5,
  },
  legendText: {
    fontSize: 14,
    color: '#333',
  },
  tableContainer: {
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f2f2f2',
    paddingVertical: 10,
  },
  tableHeaderText: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingVertical: 10,
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
  },
});

export default SalesTargetHistory;