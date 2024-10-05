import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const SalesTargetForm = ({ product, onSetTarget }) => {
  const [target, setTarget] = useState('');
  const [currentSales, setCurrentSales] = useState(0);
  const animatedValue = new Animated.Value(0);
  const navigation = useNavigation();

  useEffect(() => {
    // Simulating fetching current sales data
    setCurrentSales(Math.floor(Math.random() * 1000));
  }, [product]);

  const handleSetTarget = () => {
    if (target && !isNaN(target)) {
      onSetTarget(product.id, parseInt(target));
      animateChart();
    }
  };

  const animateChart = () => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  const getChartData = () => ({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [
          currentSales,
          currentSales * 1.1,
          currentSales * 1.2,
          currentSales * 1.3,
          currentSales * 1.4,
          parseInt(target) || currentSales * 1.5,
        ],
      },
    ],
  });

  const chartOpacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const handleViewSalesHistory = () => {
    navigation.navigate('SalesTargetHistory', { product });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Sales Target for {product?.name}</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Current Sales: {currentSales}</Text>
        <Text style={styles.infoText}>Previous Target: {product?.previousTarget || 'N/A'}</Text>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Set New Sales Target"
        value={target}
        onChangeText={setTarget}
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.button} onPress={handleSetTarget}>
        <Text style={styles.buttonText}>Set Sales Target</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.historyButton} onPress={handleViewSalesHistory}>
        <Text style={styles.historyButtonText}>View Sales History</Text>
      </TouchableOpacity>
      <Animated.View style={[styles.chartContainer, { opacity: chartOpacity }]}>
        <LineChart
          data={getChartData()}
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
              borderRadius: 16,
            },
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: '#ffa726',
            },
          }}
          bezier
          style={styles.chart}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    padding: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  infoText: {
    fontSize: 16,
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  historyButton: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  historyButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  chartContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  chart: {
    borderRadius: 16,
  },
});

export default SalesTargetForm;
