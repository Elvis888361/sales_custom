import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const PricingStrategy = ({ product }) => {
  const [discount, setDiscount] = useState('');

  const handleApplyDiscount = () => {
    // Implement logic to apply discount to the product
    console.log('Applying discount:', discount, 'to product:', product?.name);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Pricing Strategy</Text>
      {product ? (
        <>
          <Text>Current Price: ${product.price}</Text>
          <TextInput
            style={styles.input}
            placeholder="Discount Percentage"
            value={discount}
            onChangeText={setDiscount}
            keyboardType="numeric"
          />
          <Button title="Apply Discount" onPress={handleApplyDiscount} />
        </>
      ) : (
        <Text>Select a product to adjust pricing</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 10,
  },
});

export default PricingStrategy;
