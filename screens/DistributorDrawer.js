import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet,Image, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { COLORS } from '../constants';

const DistributorDrawer = ({ navigation, closeDrawer }) => {
  const renderDrawerItem = (iconName, text, screenName) => (
    <TouchableOpacity 
      style={styles.drawerItem} 
      onPress={() => { 
        navigation.navigate(screenName); 
        closeDrawer();
      }}
    >
      <Icon name={iconName} size={24} color={COLORS.primary} />
      <Text style={styles.drawerItemText}>{text}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.drawerContent}>
      <Image
        source={require('../assets/images/panel_millers.jpg')}
        style={styles.logo}
        resizeMode="contain"
      />
      {renderDrawerItem("account-group", "Customers", "Customers")}
      {renderDrawerItem("cash", "Sales", "SalesSummary")}
      {/* {renderDrawerItem("truck-delivery", "MakeSale", "MakeSale")} */}
      {renderDrawerItem("sack", "Inventory", "Inventory")}
      {renderDrawerItem("chart-bar", "Performance Metrics", "Performance")}
      
      <View style={styles.themeSwitch}>
        <Text style={styles.themeSwitchText}>Dark Mode</Text>
        <Switch
          trackColor={{ false: "#767577", true: COLORS.primary }}
          thumbColor="#f4f3f4"
          ios_backgroundColor="#3e3e3e"
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  logo: {
    width: "100%",
    height: "15%"
  },
  drawerItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  drawerItemText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
  },
  themeSwitch: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingVertical: 10,
  },
  themeSwitchText: {
    fontSize: 16,
    color: "#333",
  },
});

export default DistributorDrawer;
