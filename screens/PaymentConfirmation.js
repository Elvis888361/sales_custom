import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const PaymentConfirmation = ({ route, navigation }) => {
  const { paymentData } = route.params;

  return (
    <LinearGradient colors={['#4CAF50', '#2196F3']} style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Payment Confirmation</Text>
        <Text style={styles.message}>Your payment has been processed successfully!</Text>
        <Text style={styles.details}>Transaction ID: {paymentData.transactionId}</Text>
        <TouchableOpacity 
          style={styles.doneButton} 
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.doneButtonText}>Done</Text>
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
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  message: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  details: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 30,
  },
  doneButton: {
    backgroundColor: '#FF9800',
    borderRadius: 8,
    padding: 15,
    width: 200,
    alignItems: 'center',
  },
  doneButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default PaymentConfirmation;
