import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import Toast from 'react-native-toast-message'; 
import { StyledButton, StyledTextInput } from '../constants/styles'; 
import { FONTS, COLORS } from '../constants'; 
import { addUser } from '../constants/api'; 

const AddSalesPerson = () => {
  const navigation = useNavigation();
  const [salesperson, setSalesPerson] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    username: '',
    password: 'Welcome01',
    userRole: 'Sales'
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [recordClicked, setRecordClicked] = useState(false);

  useEffect(() => {
    if (salesperson.firstName && salesperson.lastName) {
      const username = `${salesperson.firstName.charAt(0).toLowerCase()}${salesperson.lastName.toLowerCase()}`;
      setSalesPerson(prevState => ({ ...prevState, username }));
    }
  }, [salesperson.firstName, salesperson.lastName]);

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

  const handleAddSalesPerson = async () => {
    if (!salesperson.firstName || !salesperson.lastName || !salesperson.email || !salesperson.phoneNumber) {
      setErrorMsg('Please fill in all required fields.');
      setRecordClicked(true);
      return;
    }

    const salespersonData = {
      ...salesperson,
    };

    try {
      const response = await addUser(salespersonData);
      showToast('Success', 'SalesPerson added successfully!', 'success');
      setErrorMsg('');
      setSalesPerson({ firstName: '', lastName: '', email: '', phoneNumber: '', username: '', password: 'Welcome01', userRole: '2' });
      navigation.navigate('SalesTeam');
    } catch (error) {
      setErrorMsg(error.message || 'Failed to add salesperson.');
      showToast('Error', 'Failed to add salesperson.', 'error');
    }
  };

  return (
    <ScrollView>
      <View style={{ padding: 20 }}>
        <LabelTextInput
          label="First Name"
          required
          onChangeText={(text) => setSalesPerson({ ...salesperson, firstName: text })}
          recordClicked={recordClicked}
          value={salesperson.firstName}
        />
        <LabelTextInput
          label="Last Name"
          required
          onChangeText={(text) => setSalesPerson({ ...salesperson, lastName: text })}
          recordClicked={recordClicked}
          value={salesperson.lastName}
        />
        <LabelTextInput
          label="Phone Number"
          required
          keyboardType="numeric" 
          onChangeText={(text) => setSalesPerson({ ...salesperson, phoneNumber: text })}
          recordClicked={recordClicked}
          value={salesperson.phoneNumber}
        />
        <LabelTextInput
          label="Email"
          required
          keyboardType="email-address"
          onChangeText={(text) => setSalesPerson({ ...salesperson, email: text })}
          recordClicked={recordClicked}
          value={salesperson.email}
        />

        {errorMsg !== '' && (
          <Text style={{ ...FONTS.body4, color: COLORS.red, textAlign: 'center' }}>
            {errorMsg}
          </Text>
        )}

        <StyledButton onPress={handleAddSalesPerson}>
          <Text style={{ ...FONTS.h3, color: COLORS.white }}>Add Sales Person</Text>
        </StyledButton>

        <Toast />
      </View>
    </ScrollView>
  );
};

const LabelTextInput = ({ label, required, onChangeText, recordClicked, ...rest }) => (
  <View style={{ marginBottom: 10 }}>
    <Text style={{ ...FONTS.body5, color: (required && !rest.value && recordClicked) ? COLORS.red : COLORS.black }}>
      {label}
      {required && !rest.value && recordClicked && ' *'}
    </Text>
    <StyledTextInput
      onChangeText={onChangeText}
      {...rest}
      style={{
        borderWidth: 1,
        borderColor: (required && !rest.value && recordClicked) ? COLORS.red : COLORS.lightsecondary,
      }}
    />
  </View>
);

export default AddSalesPerson;