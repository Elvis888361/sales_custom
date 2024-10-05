import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const Payment = ({ route, navigation }) => {
  const { total, selectedCustomer, saleItems } = route.params;
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const makePayment = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://luqman-api.lqadmin.com/api/Payment/MpesaPayment",
        {
          method: "POST",
          body: JSON.stringify({
            purchaseId: 1, // You might want to generate this dynamically
            phoneNumber: phoneNumber,
            amount: total,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log("Payment initiated:", data);
        // Navigate to a confirmation screen or show a success message
        navigation.navigate('PaymentConfirmation', { paymentData: data });
      } else {
        console.error("Payment initiation failed:", data);
        // Show an error message to the user
        alert('Payment initiation failed. Please try again.');
      }
    } catch (error) {
      console.error("Payment failed:", error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#4CAF50', '#2196F3']} style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Complete Payment</Text>
        <Text style={styles.totalText}>Total Quantity: {total.toFixed(2)}</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Amount"
          value={amount}
          onChangeText={setAmount}
          keyboardType="phone-pad"
        />
        <TextInput
          style={styles.input}
          placeholder="Enter M-Pesa Phone Number (254)"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
        />

        <TouchableOpacity 
          style={styles.payButton} 
          onPress={makePayment}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.payButtonText}>Pay with M-Pesa</Text>
          )}
        </TouchableOpacity>
      </View>
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
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  totalText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
  },
  payButton: {
    backgroundColor: '#FF9800',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  payButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default Payment;
