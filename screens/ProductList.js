import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { getInventoryItems } from '../constants/api';

const ProductList = ({ onSelectProduct }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [maxPrice, setMaxPrice] = useState(1); 

  useEffect(() => {
    fetchInventoryItems();
  }, []);

  const fetchInventoryItems = async () => {
    try {
      const response = await getInventoryItems();
      const formattedItems = response.map(item => ({
        id: item.ItemID,
        name: item.ItemName,
        price: item.Cost,
      }));
      setProducts(formattedItems);
      const maxPriceValue = Math.max(...formattedItems.map(item => item.price)); 
      setMaxPrice(maxPriceValue || 1);
      setLoading(false);
    } catch (error) {
      setError('Failed to load products');
      setLoading(false);
    }
  };

  const getBarWidth = (price) => {
    return (price / maxPrice) * 100;
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => onSelectProduct(item)} style={styles.item}>
      <View style={styles.itemRow}>
        <Text style={styles.itemText}>{item.name}</Text>
        <Text style={styles.itemPrice}>{item.price}</Text>
      </View>
      <View style={styles.barContainer}>
        <View style={[styles.priceBar, { width: `${getBarWidth(item.price)}%` }]} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View>
      <Text style={styles.sectionTitle}>Finished Product and Available Quantity</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#4CAF50" />
      ) : error ? (
        <Text style={{ color: 'red' }}>{error}</Text>
      ) : (
        <FlatList
          data={products}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  item: {
    padding: 10,
    marginBottom: 5,
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemText: {
    fontSize: 16,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  barContainer: {
    marginTop: 5,
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  priceBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
});

export default ProductList;
