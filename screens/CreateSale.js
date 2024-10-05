import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import axios from "axios";

const CreateSaleScreen = ({ navigation }) => {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [location, setLocation] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("mpesa");

  useEffect(() => {
    fetchCustomers();
    fetchProducts();
    getCurrentLocation();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get("YOUR_API/customers");
      setCustomers(response.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get("YOUR_API/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => setLocation(position.coords),
      (error) => console.log(error),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  };

  const addProductToSale = (product) => {
    setSelectedProducts([...selectedProducts, { ...product, quantity: 1 }]);
  };

  const updateProductQuantity = (productId, quantity) => {
    setSelectedProducts(
      selectedProducts.map((p) =>
        p.id === productId ? { ...p, quantity: parseInt(quantity) } : p
      )
    );
  };

  const calculateTotal = () => {
    return selectedProducts.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    );
  };

  const handleCreateSale = async () => {
    if (!selectedCustomer) {
      Alert.alert("Error", "Please select a customer");
      return;
    }

    if (selectedProducts.length === 0) {
      Alert.alert("Error", "Please add at least one product");
      return;
    }

    try {
      const total = calculateTotal();
      const saleData = {
        customerId: selectedCustomer.id,
        products: selectedProducts,
        total,
        location,
        paymentMethod,
      };

      // Send sale data to your backend
      const response = await axios.post("YOUR_API/sales", saleData);

      if (response.data.paymentRequired) {
        // If payment is required, initiate M-Pesa payment through your backend
        const paymentResponse = await axios.post(
          "YOUR_API/initiate-mpesa-payment",
          {
            phoneNumber: selectedCustomer.phoneNumber,
            amount: total,
            saleId: response.data.saleId,
          }
        );

        // Handle the payment response
        if (paymentResponse.data.success) {
          Alert.alert(
            "Success",
            "Sale created and payment initiated successfully"
          );
        } else {
          Alert.alert("Payment Error", paymentResponse.data.message);
        }
      } else {
        Alert.alert("Success", "Sale created successfully");
      }

      navigation.navigate("SalesHistory");
    } catch (error) {
      console.error("Error creating sale:", error);
      Alert.alert("Error", "Failed to create sale. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Sale</Text>

      <Text style={styles.label}>Select Customer:</Text>
      <Picker
        selectedValue={selectedCustomer}
        onValueChange={(itemValue) => setSelectedCustomer(itemValue)}
      >
        <Picker.Item label="Select a customer" value="" />
        {customers.map((customer) => (
          <Picker.Item
            key={customer.id}
            label={customer.name}
            value={customer}
          />
        ))}
      </Picker>

      <Text style={styles.label}>Add Products:</Text>
      <FlatList
        data={products}
        renderItem={({ item }) => (
          <View style={styles.productItem}>
            <Text>
              {item.name} - ${item.price}
            </Text>
            <Button title="Add" onPress={() => addProductToSale(item)} />
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />

      <Text style={styles.subtitle}>Selected Products:</Text>
      {selectedProducts.map((product) => (
        <View key={product.id} style={styles.selectedProduct}>
          <Text>{product.name}</Text>
          <TextInput
            value={product.quantity.toString()}
            onChangeText={(text) => updateProductQuantity(product.id, text)}
            keyboardType="numeric"
            style={styles.quantityInput}
          />
        </View>
      ))}

      <Text style={styles.total}>Total: KES {calculateTotal().toFixed(2)}</Text>

      <Text style={styles.label}>Payment Method:</Text>
      <Picker
        selectedValue={paymentMethod}
        onValueChange={(itemValue) => setPaymentMethod(itemValue)}
      >
        <Picker.Item label="M-Pesa" value="mpesa" />
        <Picker.Item label="Cash" value="cash" />
        <Picker.Item label="Credit Card" value="credit_card" />
      </Picker>

      <Button title="Create Sale" onPress={handleCreateSale} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
  },
  productItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  selectedProduct: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  quantityInput: {
    width: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 5,
  },
  total: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 20,
  },
});

export default CreateSaleScreen;
