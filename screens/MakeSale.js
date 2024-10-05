import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Animated,
} from "react-native";
import SearchableDropdown from "react-native-searchable-dropdown";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import ProductCard from "./ProductCard";
import { getCustomers, getUserDeliveries } from "../constants/api";

const MakeSale = ({ navigation }) => {
  const route = useRoute();
  const { userId } = route.params; // Access userId from route.params
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedCustomerName, setSelectedCustomerName] = useState(""); // New state to hold the selected customer's name
  const [saleItems, setSaleItems] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]); // State to hold products
  const [deliveries, setDeliveries] = useState([]);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await getCustomers();
        setCustomers(data);
      } catch (error) {
        console.error("Failed to fetch customers:", error);
      }
    };

    const fetchUserDeliveries = async () => {
      try {
        console.log(userId);
        const deliveries = await getUserDeliveries(userId);
        console.log(deliveries);
        setProducts(deliveries); // Use deliveries as products
        setDeliveries(deliveries); // Store the data in state
      } catch (error) {
        console.error("Failed to fetch user deliveries:", error);
      }
    };

    fetchCustomers();
    fetchUserDeliveries();
  }, [userId]);

  useEffect(() => {
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
  }, []);

  const handleProductPress = (product) => {
    console.log(product);
    navigation.navigate("ProductDetail", {
      product,
      selectedCustomer,
      onAddToSale: addItemToSale,
      customerName: selectedCustomerName || "No customer selected",
    });
  };

  const addItemToSale = (item) => {
    setSaleItems([...saleItems, item]);
  };

  const removeItemFromSale = (id) => {
    setSaleItems(saleItems.filter((item) => item.id !== id));
  };

  const renderSaleItem = ({ item }) => (
    <Animated.View
      style={[
        styles.saleItem,
        { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
      ]}
    >
      <Text style={styles.saleItemText}>
        {item.product} - Qty: {item.quantity}
      </Text>
      <Text style={styles.saleItemText}>{item.total.toFixed(2)}</Text>
      <TouchableOpacity onPress={() => removeItemFromSale(item.id)}>
        <Icon name="close-circle" size={24} color="#FF6B6B" />
      </TouchableOpacity>
    </Animated.View>
  );

  const handleCompleteSale = () => {
    const total = saleItems.reduce((sum, item) => sum + item.total, 0);
    navigation.navigate("MethodOfPayment", {
      total,
      selectedCustomer,
      saleItems,
      userId, // Pass userId to the next screen if needed
    });
  };

  // Example function to map API data to card data
  const mapToCardData = (deliveries) => {
    return deliveries.map((delivery) => ({
      ItemName: delivery.ItemName,
      UnitName: delivery.UnitName,
      productName: delivery.DeliveryNo, // Adjust based on your data
      quantity: delivery.DeliveryDetails[0]?.Quantity || 0, // Ensure safe access
      Balance: delivery.DeliveryDetails[0]?.Balance || 0, // Ensure safe access
    }));
  };

  // Usage in your component
  const cardData = deliveries.map((delivery) => ({
    itemName: delivery.DeliveryDetails[0]?.ItemName || "N/A",
    unitName: delivery.DeliveryDetails[0]?.UnitName || "N/A",
    productName: delivery.DeliveryNo,
    quantity: delivery.DeliveryDetails[0]?.Quantity || 0,
    price: delivery.DeliveryDetails[0]?.Balance || 0,
    image: delivery.DeliveryDetails[0]?.Image || null, // Add image if available
  }));

  return (
    <LinearGradient colors={["#4CAF50", "#2196F3"]} style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
        ]}
      >
        <Text style={styles.title}>Make a Sale</Text>

        <SearchableDropdown
          onItemSelect={(item) => {
            setSelectedCustomer(item.id);
            setSelectedCustomerName(item.name); // Set the selected customer's name
          }}
          containerStyle={styles.dropdownContainer}
          itemStyle={styles.dropdownItem}
          itemTextStyle={styles.dropdownItemText}
          itemsContainerStyle={styles.itemsContainer}
          items={customers.map((customer) => ({
            id: customer.CustomerID,
            name: customer.CustomerName,
          }))}
          defaultIndex={0}
          resetValue={false} // Do not reset the value after selection
          textInputProps={{
            placeholder: selectedCustomerName || "Select a customer", // Display selected customer name
            underlineColorAndroid: "transparent",
            style: styles.dropdownTextInput,
          }}
          listProps={{
            nestedScrollEnabled: true,
          }}
        />

        <FlatList
          data={cardData}
          renderItem={({ item }) => (
            <ProductCard
              productName={item.productName}
              quantity={item.quantity}
              price={item.price}
              image={item.image}
              itemName={item.itemName}
              unitName={item.unitName}
              onPress={() => handleProductPress(item)}
            />
          )}
          keyExtractor={(item) => item.productName}
        />

        <FlatList
          data={saleItems}
          renderItem={renderSaleItem}
          keyExtractor={(item) => item.id}
          style={styles.saleList}
        />

        <Animated.View
          style={[styles.totalContainer, { transform: [{ scale: scaleAnim }] }]}
        >
          <Text style={styles.totalText}>
            Total Quantity : 
            {saleItems.reduce((sum, item) => sum + item.total, 0).toFixed(2)}
          </Text>
        </Animated.View>

        <TouchableOpacity
          style={styles.completeButton}
          onPress={handleCompleteSale}
        >
          <Text style={styles.completeButtonText}>Complete Sale</Text>
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
  dropdownContainer: {
    padding: 5,
    marginBottom: 20, // Add margin to separate from other elements
  },
  dropdownItem: {
    padding: 10,
    marginTop: 2,
    backgroundColor: "#FAF9F8",
    borderColor: "#bbb",
    borderWidth: 1,
    borderRadius: 5,
  },
  dropdownItemText: {
    color: "#222",
  },
  itemsContainer: {
    maxHeight: 140,
  },
  dropdownTextInput: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#fff", // Ensure the input is visible
  },
  picker: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 10,
  },
  saleList: {
    marginTop: 20,
  },
  saleItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  saleItemText: {
    fontSize: 16,
    color: "#333",
  },
  totalContainer: {
    backgroundColor: "#FF9800",
    borderRadius: 8,
    padding: 10,
    marginTop: 20,
    alignItems: "center",
  },
  totalText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  completeButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    marginTop: 20,
  },
  completeButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    backgroundColor: "#4CAF50",
  },
  productList: {
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
});

export default MakeSale;