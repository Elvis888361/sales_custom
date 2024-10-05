import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import Toast from 'react-native-toast-message'; 
import * as Location from 'expo-location';

import { StyledButton, StyledTextInput } from '../constants/styles'; 
import { FONTS, COLORS } from '../constants'; 
import { addCustomer } from '../constants/api'; // Ensure this is the correct import

const AddCustomer = () => {
  const navigation = useNavigation();
  const [customer, setCustomer] = useState({
    customerID: 0,
    customerName: '',
    phone: '',
    location: '',
    balance: 0,
    latitude: '',
    longitude: '',
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [recordClicked, setRecordClicked] = useState(false);

  useEffect(() => {
    const requestLocationPermission = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
        maximumAge: 10000,
        timeout: 15000,
      });
      const { latitude, longitude } = location.coords;

      // Reverse geocode to get the detailed address
      let reverseGeocode = await Location.reverseGeocodeAsync({ latitude, longitude });
      let address = reverseGeocode[0] ? `${reverseGeocode[0].name || reverseGeocode[0].street || reverseGeocode[0].district || reverseGeocode[0].city}, ${reverseGeocode[0].region}, ${reverseGeocode[0].country}` : '';

      setCustomer((prevCustomer) => ({
        ...prevCustomer,
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        location: address,
      }));
    };

    requestLocationPermission();
  }, []);

  const showToast = (message1, message2, type) => {
    Toast.show({
      type: type,
      position: 'top',
      text1: message1,
      text2: message2,
      visibilityTime: 4000,
      autoHide: true,
    });
  };

  const handleAddCustomer = async () => {
    if (!customer.customerName || !customer.phone) {
      setErrorMsg('Please fill in all required fields.');
      setRecordClicked(true);
      return;
    }

    try {
      const response = await addCustomer(customer);
      console.log(customer)
      console.log(response)
      showToast('Success', 'Customer added successfully!', 'success');
      Alert.alert('Success', 'Customer added successfully!', [{ text: 'OK', onPress: () => navigation.navigate('Customers') }]);
      setErrorMsg('');
      setCustomer({
        customerID: 0,
        customerName: '',
        phone: '',
        location: '',
        balance: 0,
        latitude: '',
        longitude: '',
      });
    } catch (error) {
      setErrorMsg(error.message || 'Failed to add customer.');
      showToast('Error', 'Failed to add customer.', 'error');
      Alert.alert('Error', 'Failed to add customer.', [{ text: 'OK' }]);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.form}>
        <LabelTextInput
          label="Customer Name"
          required
          onChangeText={(text) => setCustomer({ ...customer, customerName: text })}
          recordClicked={recordClicked}
          value={customer.customerName}
        />
        <LabelTextInput
          label="Phone"
          required
          keyboardType="numeric" 
          onChangeText={(text) => setCustomer({ ...customer, phone: text })}
          recordClicked={recordClicked}
          value={customer.phone}
        />

        {errorMsg !== '' && (
          <Text style={styles.errorText}>
            {errorMsg}
          </Text>
        )}

        <StyledButton onPress={handleAddCustomer} style={styles.button}>
          <Text style={styles.buttonText}>Add Customer</Text>
        </StyledButton>

        <Toast />
      </View>
    </ScrollView>
  );
};

const LabelTextInput = ({ label, required, onChangeText, recordClicked, ...rest }) => (
  <View style={styles.inputContainer}>
    <Text style={[styles.label, (required && !rest.value && recordClicked) ? styles.labelError : styles.labelNormal]}>
      {label}
      {required && !rest.value && recordClicked && ' *'}
    </Text>
    <StyledTextInput
      onChangeText={onChangeText}
      {...rest}
      style={[styles.textInput, (required && !rest.value && recordClicked) ? styles.textInputError : styles.textInputNormal]}
    />
  </View>
);

const styles = {
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    ...FONTS.body5,
  },
  labelNormal: {
    color: COLORS.black,
  },
  labelError: {
    color: COLORS.red,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
  },
  textInputNormal: {
    borderColor: COLORS.lightsecondary,
  },
  textInputError: {
    borderColor: COLORS.red,
  },
  errorText: {
    ...FONTS.body4,
    color: COLORS.red,
    textAlign: 'center',
    marginBottom: 10,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 5,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    ...FONTS.h3,
    color: COLORS.white,
  },
};

export default AddCustomer;