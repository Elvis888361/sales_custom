import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const MethodOfPayment = ({ route, navigation }) => {
  const { total, selectedCustomer, saleItems ,userId} = route.params;

  const handleMpesaSelection = () => {
    navigation.navigate('Payment', { total, selectedCustomer, saleItems, userId });
  };

  const handleCashSelection = () => {
    // Navigate to a cash payment confirmation or processing screen
    navigation.navigate('PaymentConfirmation', { total, selectedCustomer, saleItems, });
  };

  return (
    <LinearGradient colors={['#4CAF50', '#2196F3']} style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Select Payment Method</Text>
        
        <TouchableOpacity 
          style={styles.methodButton} 
          onPress={handleMpesaSelection}
        >
          <Text style={styles.methodButtonText}>Pay with M-Pesa</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.methodButton} 
          onPress={handleCashSelection}
        >
          <Text style={styles.methodButtonText}>Pay with Cash</Text>
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
  methodButton: {
    backgroundColor: '#FF9800',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  methodButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default MethodOfPayment;
