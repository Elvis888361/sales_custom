import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Animated, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { BarChart } from 'react-native-chart-kit';
import { getDeliveries } from '../constants/api'; // Assuming this is the correct import path

const { width } = Dimensions.get('window');

const Inventory = ({ userId }) => {
  const [inventory, setInventory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.9);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const deliveries = await getDeliveries(userId); // Fetch deliveries for the user
        const parsedInventory = deliveries.flatMap(delivery =>
          delivery.DeliveryDetails.map(detail => ({
            id: detail.DeliveryDetailID,
            name: detail.ItemName,
            stock: detail.Quantity, // Total quantity
            outStock: detail.Sales, // Sold quantity
            inStock: detail.Balance, // Remaining stock (Balance)
          }))
        );
        setInventory(parsedInventory);

        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 4,
            useNativeDriver: true,
          }),
        ]).start();
      } catch (error) {
        console.error('Error fetching inventory:', error);
      }
    };

    fetchInventory();
  }, [userId]);

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item }) => {
    return (
      <Animated.View
        style={[
          styles.itemContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <LinearGradient
          colors={['#f0f0f0', '#e0e0e0']}
          style={styles.itemGradient}
        >
          <View style={styles.itemContent}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemStock}>In Stock: {item.inStock}</Text>
            <Text style={styles.itemStock}>Out Stock: {item.outStock}</Text>
          </View>
        </LinearGradient>
      </Animated.View>
    );
  };

  const chartData = {
    labels: ['In Stock', 'Out of Stock'],
    datasets: [
      {
        data: [
          inventory.reduce((sum, item) => sum + item.inStock, 0),
          inventory.reduce((sum, item) => sum + item.outStock, 0),
        ],
      },
    ],
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inventory</Text>
      <View style={styles.searchContainer}>
        <Icon name="magnify" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search inventory..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>In Stock vs Out of Stock</Text>
        <BarChart
          data={chartData}
          width={width - 40}
          height={220}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            barPercentage: 0.5,
            useShadowColorFromDataset: false,
          }}
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
      </View>
      <View style={styles.listHeader}>
        <Text style={styles.listHeaderText}>Product</Text>
        <Text style={styles.listHeaderText}>In Stock</Text>
        <Text style={styles.listHeaderText}>Out Stock</Text>
      </View>
      <FlatList
        data={filteredInventory}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginVertical: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginHorizontal: 20,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  chartContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#007AFF',
  },
  listHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  listContainer: {
    paddingHorizontal: 20,
  },
  itemContainer: {
    marginBottom: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  itemGradient: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  itemContent: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  itemStock: {
    fontSize: 14,
    color: '#666',
  },
});

export default Inventory;
