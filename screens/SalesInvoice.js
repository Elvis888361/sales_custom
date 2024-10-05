import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { getSales } from '../constants/api';

const SalesInvoice = () => {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await getSales();
        setSalesData(response);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
  }, []);

  const renderSaleItem = ({ item }) => (
    <View style={styles.saleItem}>
      <Text style={styles.invoiceNo}>Invoice No: {item.InvoiceNo}</Text>
      <Text>Date: {new Date(item.SaleDate).toLocaleString()}</Text>
      <Text>Customer: {item.CustomerName}</Text>
      <Text>Sales Person: {item.SalesPerson}</Text>
      <Text>Total Amount: KES {item.TotalAmount}</Text>
      <Text>Sale Details:</Text>
      {item.SaleDetails.map(detail => (
        <Text key={detail.SaleDetailID}>
          - Item ID: {detail.ItemID}, Quantity: {detail.Quantity}, Price: KES {detail.Price}
        </Text>
      ))}
    </View>
  );

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return (
    <FlatList
      data={salesData}
      renderItem={renderSaleItem}
      keyExtractor={item => item.SaleID.toString()}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  saleItem: {
    marginBottom: 16,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  invoiceNo: {
    fontWeight: 'bold',
  },
});

export default SalesInvoice;
