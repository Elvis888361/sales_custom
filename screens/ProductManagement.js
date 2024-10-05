import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ProductList from './ProductList';
import ProductForm from './ProductForm';
import DistributorAllocationForm from './DistributorAllocationForm';
import SalesTargetForm from './SalesTargetForm';
import PricingStrategy from './PricingStrategy';

const ProductManagement = () => {
  const [activeTab, setActiveTab] = useState('list');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);

  const handleAddProduct = (newProduct) => {
    setProducts([...products, newProduct]);
  };

  const renderItem = ({ item }) => {
    switch (item.key) {
      case 'list':
        return activeTab === 'list' ? <ProductList products={products} onSelectProduct={setSelectedProduct} /> : null;
      case 'form':
        return activeTab === 'form' ? <ProductForm onAddProduct={handleAddProduct} /> : null;
      case 'pricing':
        return activeTab === 'pricing' ? <DistributorAllocationForm product={selectedProduct} /> : null;
      case 'target':
        return activeTab === 'target' ? <SalesTargetForm product={selectedProduct} /> : null;
      case 'assign':
        return activeTab === 'assign' ? <PricingStrategy product={selectedProduct} /> : null;
      default:
        return null;
    }
  };

  const data = [
    { key: 'list' },
    { key: 'form' },
    { key: 'pricing' },
    { key: 'target' },
    { key: 'assign' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity style={styles.tab} onPress={() => setActiveTab('list')}>
          <Icon name="format-list-bulleted" size={24} color={activeTab === 'list' ? '#4CAF50' : '#757575'} />
          <Text style={styles.tabText}>List</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab} onPress={() => setActiveTab('target')}>
          <Icon name="target" size={24} color={activeTab === 'target' ? '#4CAF50' : '#757575'} />
          <Text style={styles.tabText}>Target</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab} onPress={() => setActiveTab('assign')}>
          <Icon name="trending-up" size={24} color={activeTab === 'assign' ? '#4CAF50' : '#757575'} />
          <Text style={styles.tabText}>Charts</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab} onPress={() => setActiveTab('form')}>
          <Icon name="plus-circle-outline" size={24} color={activeTab === 'form' ? '#4CAF50' : '#757575'} />
          <Text style={styles.tabText}>Add</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.key}
        scrollEnabled={false}
      />
    </View>
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
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  tab: {
    alignItems: 'center',
  },
  tabText: {
    fontSize: 12,
    marginTop: 5,
  },
});

export default ProductManagement;