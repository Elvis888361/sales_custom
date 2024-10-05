import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  Alert, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  Animated
} from 'react-native';
import { TextInput, Button, Card, Title, Paragraph, Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';

const EditCustomerScreen = ({ route, navigation }) => {
  const { customer } = route.params;
  const [name, setName] = useState(customer.name);
  const [email, setEmail] = useState(customer.email);
  const [phone, setPhone] = useState(customer.phone);
  const [address, setAddress] = useState(customer.address);

  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const handleUpdateCustomer = async () => {
    if (!name || !email || !phone || !address) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      const response = await axios.put(`YOUR_API/customers/${customer.id}`, {
        name,
        email,
        phone,
        address,
      });
      Alert.alert('Success', 'Customer updated successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Error updating customer:', error);
      Alert.alert('Error', 'Failed to update customer');
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          <Title style={styles.title}>Edit Customer</Title>
        </Animated.View>

        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          <Card style={styles.card}>
            <Card.Content>
              <TextInput
                label="Name"
                value={name}
                onChangeText={setName}
                style={styles.input}
                left={<TextInput.Icon name={() => <Icon name="account" size={24} color="#666" />} />}
              />
              <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                style={styles.input}
                left={<TextInput.Icon name={() => <Icon name="email" size={24} color="#666" />} />}
              />
              <TextInput
                label="Phone"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                style={styles.input}
                left={<TextInput.Icon name={() => <Icon name="phone" size={24} color="#666" />} />}
              />
              <TextInput
                label="Address"
                value={address}
                onChangeText={setAddress}
                style={[styles.input, styles.addressInput]}
                multiline
                left={<TextInput.Icon name={() => <Icon name="map-marker" size={24} color="#666" />} />}
              />
            </Card.Content>
          </Card>
        </Animated.View>

        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          <Button 
            mode="contained" 
            onPress={handleUpdateCustomer} 
            style={styles.updateButton}
            icon={() => <Icon name="check-circle" size={24} color="#fff" />}
          >
            Update Customer
          </Button>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  input: {
    marginBottom: 20,
  },
  addressInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  updateButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
});

export default EditCustomerScreen;