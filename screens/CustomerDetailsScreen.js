import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { Card, Title, Paragraph, Avatar, Button, Text } from 'react-native-paper';

const CustomerDetailsScreen = ({ route, navigation }) => {
  const { customerId, customers } = route.params;
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const findCustomer = () => {
      const customerData = customers.find(cust => cust.CustomerID === customerId);
      setCustomer(customerData);
      console.log(customerData)
      setLoading(false);
    };

    findCustomer();
  }, [customerId, customers]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!customer) {
    return (
      <View style={styles.errorContainer}>
        <Text>No customer data available</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Card.Title
          title={customer.CustomerName}
          subtitle={customer.Location}
          left={(props) => <Avatar.Icon {...props} icon="account" />}
        />
        <Card.Content>
          <Title>Contact Information</Title>
          <Paragraph>Phone: {customer.Phone}</Paragraph>
          <Paragraph>Email: {customer.Email}</Paragraph>
        </Card.Content>
        <Card.Actions>
          {/* <Button onPress={() => navigation.navigate('EditCustomer', { customer })}>Edit</Button> */}
        </Card.Actions>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Address</Title>
          <Paragraph>{customer.Location}</Paragraph>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Additional Information</Title>
          <Paragraph>Customer ID: {customer.CustomerID}</Paragraph>
          <Paragraph>Longitude: {customer.Longitude}</Paragraph>
          <Paragraph>Latitude: {customer.Latitude}</Paragraph>
          {/* Add more fields as necessary */}
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    marginBottom: 20,
    borderRadius: 10,
    elevation: 3,
  },
  customerName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  customerPhone: {
    fontSize: 18,
    marginTop: 10,
  },
  customerLocation: {
    fontSize: 18,
    marginTop: 10,
  },
});

export default CustomerDetailsScreen;




