import React, { useState, useEffect } from "react";
import {
  View,
  SafeAreaView,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Text, Card ,FAB } from "react-native-paper";
import * as Animatable from "react-native-animatable";
import { getCustomers } from "../constants/api";

const CustomersScreen = ({ navigation }) => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const customerData = await getCustomers();
        setCustomers(customerData);
        setFilteredCustomers(customerData);
      } catch (error) {
        console.error("Error fetching customers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      const filteredData = customers.filter((customer) =>
        customer.CustomerName.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredCustomers(filteredData);
    } else {
      setFilteredCustomers(customers);
    }
  };

  const renderCustomerItem = ({ item }) => (
    <Animatable.View animation="fadeInUp" duration={1000} style={styles.cardContainer}>
      <TouchableOpacity onPress={() => navigation.navigate("CustomerDetails", { customerId: item.CustomerID, customers })}>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.customerName}>{item.CustomerName}</Text>
            <Text style={styles.customerPhone}>{item.Phone}</Text>
            <Text style={styles.customerLocation}>{item.Location}</Text>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    </Animatable.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Animatable.View animation="fadeInDown" duration={1000} style={styles.headerContainer}>
        <Text style={styles.title}>View All Customers</Text>
      </Animatable.View>
      <TextInput
        style={styles.searchInput}
        placeholder="Search Customers"
        value={searchQuery}
        onChangeText={handleSearch}
      />
      {loading ? (
        <ActivityIndicator animating={true} color="#6200ee" size="large" />
      ) : (
        <FlatList
          data={filteredCustomers}
          keyExtractor={(item) => item.CustomerID.toString()}
          renderItem={renderCustomerItem}
          contentContainerStyle={styles.listContent}
        />
      )}
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('AddCustomer')}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  headerContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#6200ee",
    textAlign: "center",
  },
  listContent: {
    padding: 16,
  },
  cardContainer: {
    marginBottom: 16,
  },
  card: {
    borderRadius: 10,
    elevation: 3,
  },
  customerName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  customerPhone: {
    fontSize: 14,
    color: "#666",
  },
  customerLocation: {
    fontSize: 14,
    color: "#999",
  },
  editButton: {
    backgroundColor: "#2196F3",
  },
  deleteButton: {
    backgroundColor: "#F44336",
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#4CAF50",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
    container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  metricsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  metricCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    width: "30%",
    elevation: 3,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginTop: 5,
  },
  metricTitle: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
    textAlign: "center",
  },
  chartContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  listTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  list: {
    flex: 1,
    backgroundColor: "#f5f5f5", // Added background color for contrast
  },
  customerItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff", // Changed to a more visible color
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 4, // Increased elevation for better shadow effect
  },
  customerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  avatarText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 16,
    color: "#333",
  },
  customerEmail: {
    fontSize: 14,
    color: "#666",
  },
  customerLocation: {
    fontSize: 12,
    color: "#999",
  },
  rightActions: {
    flexDirection: "row",
  },
  actionButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 60,
    height: "100%",
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#6200ee',
  },
});

export default CustomersScreen;