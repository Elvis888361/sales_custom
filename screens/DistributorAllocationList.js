import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

const DistributorAllocationList = ({ allocations }) => {
  const data = {
    labels: Object.keys(allocations),
    datasets: [
      {
        data: Object.values(allocations),
      },
    ],
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Distributor Allocations</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <BarChart
          data={data}
          width={Math.max(Dimensions.get('window').width - 40, Object.keys(allocations).length * 60)}
          height={220}
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
              fontSize: 10,
              rotation: 45,
              translateY: 10,
            },
          }}
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
          verticalLabelRotation={45}
        />
      </ScrollView>
      <View style={styles.listContainer}>
        {Object.entries(allocations).map(([distributor, quantity]) => (
          <View key={distributor} style={styles.item}>
            <Text style={styles.distributor}>{distributor}</Text>
            <Text style={styles.quantity}>{quantity}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    padding: 20,
  },
  listContainer: {
    padding: 20,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  distributor: {
    fontSize: 16,
    color: '#4a4a4a',
  },
  quantity: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
});

export default DistributorAllocationList;
