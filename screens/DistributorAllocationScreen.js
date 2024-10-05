import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ScrollView } from 'react-native';
import DistributorAllocationForm from './DistributorAllocationForm';
import DistributorAllocationView from './DistributorAllocationView';

const DistributorAllocationScreen = () => {
  const [allocations, setAllocations] = useState({
    'Distributor A': 150,
    'Distributor B': 200,
    'Distributor C': 100,
  });
  const [showForm, setShowForm] = useState(true);

  const handleAddAllocation = (distributor, quantity) => {
    setAllocations(prev => ({
      ...prev,
      [distributor]: (prev[distributor] || 0) + quantity
    }));
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={() => setShowForm(!showForm)}
      >
        <Text style={styles.toggleButtonText}>
          {showForm ? 'View Allocations' : 'Add Allocation'}
        </Text>
      </TouchableOpacity>

      <ScrollView style={{ flex: 1 }}>
        {showForm ? (
          <DistributorAllocationForm onAddAllocation={handleAddAllocation} />
        ) : (
          <DistributorAllocationView allocations={allocations} />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  toggleButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    margin: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  toggleButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DistributorAllocationScreen;
