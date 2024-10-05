import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const DashboardCard = ({ title, value, icon }) => {
  return (
    <View style={styles.card}>
      <Icon name={icon} size={40} color="#4CAF50" />
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardValue}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 15,
    width: "48%",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardTitle: {
    fontSize: 14,
    color: "#4a4a4a",
    marginTop: 5,
  },
  cardValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4a4a4a",
    marginTop: 5,
  },
});

export default DashboardCard;
