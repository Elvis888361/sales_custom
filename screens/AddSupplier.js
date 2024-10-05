import React, { useState } from 'react';
import { Text, View, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import Toast from 'react-native-toast-message'; 
import { StyledButton, StyledTextInput } from '../constants/styles'; 
import { FONTS, COLORS } from '../constants'; 
import { addSupplier } from '../constants/api'; 

const AddSupplier = () => {
  const navigation = useNavigation();
  const [supplier, setSupplier] = useState({
    supplierName: '',
    phone: '',
    address: '',
    balance: ''
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [recordClicked, setRecordClicked] = useState(false);

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

  const handleAddSupplier = async () => {
    if (!supplier.supplierName || !supplier.phone || !supplier.address) {
      setErrorMsg('Please fill in all required fields.');
      setRecordClicked(true);
      return;
    }

    const supplierData = {
      ...supplier,
    };

    try {
      const response = await addSupplier(supplierData);
      showToast('Success', 'Supplier added successfully!', 'success');
      setErrorMsg('');
      setSupplier({ supplierName: '', phone: '', address: '', balance: '' });
      navigation.navigate('SalesTeam');
    } catch (error) {
      setErrorMsg(error.message || 'Failed to add supplier.');
      showToast('Error', 'Failed to add supplier.', 'error');
    }
  };

  return (
    <ScrollView>
      <View style={{ padding: 20 }}>
        <LabelTextInput
          label="Supplier Name"
          required
          onChangeText={(text) => setSupplier({ ...supplier, supplierName: text })}
          recordClicked={recordClicked}
          value={supplier.supplierName}
        />
        <LabelTextInput
          label="Phone Number"
          required
          keyboardType="numeric" 
          onChangeText={(text) => setSupplier({ ...supplier, phone: text })}
          recordClicked={recordClicked}
          value={supplier.phone}
        />
        <LabelTextInput
          label="Address"
          required
          onChangeText={(text) => setSupplier({ ...supplier, address: text })}
          recordClicked={recordClicked}
          value={supplier.address}
        />
        <LabelTextInput
          label="Balance"
          required
          keyboardType="numeric" 
          onChangeText={(text) => setSupplier({ ...supplier, balance: parseFloat(text) || '' })} 
          recordClicked={recordClicked}
          value={supplier.balance.toString()} 
        />

        {errorMsg !== '' && (
          <Text style={{ ...FONTS.body4, color: COLORS.red, textAlign: 'center' }}>
            {errorMsg}
          </Text>
        )}

        <StyledButton onPress={handleAddSupplier}>
          <Text style={{ ...FONTS.h3, color: COLORS.white }}>Add Supplier</Text>
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

export default AddSupplier;