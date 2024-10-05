import React from 'react';
import { View, Text, Button } from 'react-native';

export default function ManageSales({ navigation }) {
  return (
    <View>
      <Text>Manage Sales Personnel</Text>
      <Button
        title="View Salesperson Details"
        onPress={() => navigation.navigate('SalespersonDetails')}
      />
    </View>
  );
}
