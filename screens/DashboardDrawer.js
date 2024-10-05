import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../constants';

const DashboardDrawer = () => {
  const navigation = useNavigation(); // Use the hook to get the navigation object
  const [isEnabled, setIsEnabled] = useState(false);

  const closeDrawer = () => {
    if (navigation.closeDrawer) {
      navigation.closeDrawer();
    } else {
      console.warn('closeDrawer is not available');
    }
  };

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
      <View style={styles.drawerItemBorder} />
    </TouchableOpacity>
  );

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
      closeDrawer();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  return (
    <View style={styles.drawerContent}>
      <Image
        source={require('../assets/images/panel_millers.jpg')}
        style={styles.logo}
        resizeMode="contain"
      />
      {renderDrawerItem("corn", "Products", "ProductManagement")}
      {renderDrawerItem("truck-delivery", "Deliveries", "DistributorAllocationView")}
      {renderDrawerItem("file-document", "Sales Invoice", "SalesInvoice")}
      {renderDrawerItem("chart-bar", "Sales History", "SalesHistory")}
      {renderDrawerItem("account-group", "Sales Team", "SalesTeam")}
      {renderDrawerItem("account-star-outline", "Customers", "Customers")}
      {renderDrawerItem("sack", "Purchase Orders", "POPage")}
      {renderDrawerItem("chart-bar", "Performance Metrics", "Performance")}
      {renderDrawerItem("account", "Users", "UsersDashboard")}
      
      <TouchableOpacity 
        style={styles.drawerItem} 
        onPress={handleLogout}
      >
        <Icon name="logout" size={24} color={COLORS.primary} />
        <Text style={styles.drawerItemText}>Logout</Text>
        <View style={styles.drawerItemBorder} />
      </TouchableOpacity>

      <View style={styles.themeSwitch}>
        <Text style={styles.themeSwitchText}>Dark Mode</Text>
        <Switch
          trackColor={{ false: "#767577", true: COLORS.primary }}
          thumbColor={isEnabled ? COLORS.secondary : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </View>
    </View>
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
    position: "relative",
  },
  drawerItemBorder: {
    position: "absolute",
    bottom: 0,
    height: 1, 
    width: "70%", 
    backgroundColor: COLORS.lightsecondary,
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
    borderTopWidth: 1,
    borderTopColor: COLORS.lightsecondary,
  },
  themeSwitchText: {
    fontSize: 16,
    color: "#333",
  },
});

export default DashboardDrawer;