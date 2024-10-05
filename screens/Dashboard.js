import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  Animated,
  Modal,
  SafeAreaView,
  Platform
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import NetInfo from "@react-native-community/netinfo";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { StatusBar } from "expo-status-bar";
import { DrawerLayout } from "react-native-gesture-handler";

import { FONTS, COLORS } from '../constants'; 
import { getSales, getUsers, getDeliveries, getCustomers } from '../constants/api';
import DashboardDrawer from "./DashboardDrawer";

const { width, height } = Dimensions.get("window");

const DashboardScreen = ({ navigation }) => {
  const [isConnected, setIsConnected] = useState(true);
  const [isMapFullscreen, setIsMapFullscreen] = useState(false);
  const [locationName, setLocationName] = useState("Loading location...");
  const [location, setLocation] = useState(null);
  const [customers, setCustomers] = useState([]);
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.5);
  const mapRef = useRef(null);
  const drawer = useRef(null);

  const [totalSalesMonth, setTotalSalesMonth] = useState(0);
  const [totalDeliveriesMonth, setTotalDeliveriesMonth] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();

    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setLocationName("Permission to access location was denied");
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;

        setLocation({
          latitude,
          longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        });

        reverseGeocodeLocation(latitude, longitude);

        if (mapRef.current) {
          mapRef.current.animateToRegion(
            {
              latitude,
              longitude,
              latitudeDelta: 0.02,
              longitudeDelta: 0.02,
            },
            1000
          );
        }
      } catch (error) {
        console.error("Error fetching location:", error);
      }
    })();

    fetchKPIData();
    fetchCustomers();
    fetchUserLocations();

    return () => unsubscribe();
  }, []);

  const fetchUserLocations = async () => {
    try {
      const userData = await getUsers();
      setUserLocations(userData.filter(user => user.latitude && user.longitude));
    } catch (error) {
      console.error('Error fetching user locations:', error);
    }
  };

  const fetchCustomers = async () => {
    try {
      const customerData = await getCustomers();
      console.log('Fetched customers:', customerData);
      setCustomers(customerData.filter(customer => {
        const lat = parseFloat(customer.Latitude);
        const lng = parseFloat(customer.Longitude);
        return !isNaN(lat) && !isNaN(lng);
      }));
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const reverseGeocodeLocation = async (latitude, longitude) => {
    try {
      let geocode = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      if (geocode && geocode.length > 0) {
        let address = `${geocode[0].name}, ${geocode[0].city}`;
        setLocationName(address);
      }
    } catch (error) {
      console.error("Error fetching location name:", error);
      setLocationName("Location name not available");
    }
  };

  const toggleMapFullscreen = () => {
    setIsMapFullscreen(!isMapFullscreen);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning, Admin 👋";
    if (hour < 18) return "Good afternoon, Admin 👋";
    return "Good evening, Admin 👋";
  };

  const renderMap = (isFullscreen) => (
    <MapView
      ref={isFullscreen ? null : mapRef}
      style={isFullscreen ? styles.fullscreenMap : styles.map}
      provider={PROVIDER_GOOGLE}
      region={location}
      showsUserLocation={true}
      showsMyLocationButton={true}
      showsScale={true}
      showsBuildings={true}
      showsCompass={true}
      followsUserLocation={true}
      apiKey={process.env.EXPO_PUBLIC_GOOGLE_API_KEY}
    >
      {/* {customers.map((customer) => (
        <MapView.Marker
          key={customer.CustomerID}
          coordinate={{
            latitude: parseFloat(customer.Latitude),
            longitude: parseFloat(customer.Longitude),
          }}
          title={customer.CustomerName}
          description={customer.Location}
        >
          <View style={styles.customMarker}>
            <Text style={styles.markerText}>{customer.CustomerName}</Text>
          </View>
        </MapView.Marker>
      ))} */}
    </MapView>
  );

  const fetchKPIData = async () => {
    try {
      const response = await getSales();
      console.log('Raw response:', response);

      // Assuming response is a JSON string, parse it
      const salesResponse = JSON.parse(response);
      console.log('Parsed sales data:', salesResponse);

      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();

      const salesThisMonth = salesResponse.filter(sale => {
        const saleDate = new Date(sale.SaleDate);
        return saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear;
      });

      const totalSalesThisMonth = salesThisMonth.reduce((acc, sale) => acc + sale.TotalAmount, 0);
      setTotalSalesMonth(totalSalesThisMonth);

      const deliveriesResponse = await getDeliveries({ status: "Completed" });
      console.log('Deliveries response:', deliveriesResponse);

      const deliveriesThisMonth = deliveriesResponse.filter(delivery => {
        const deliveryDate = new Date(delivery.DeliveryDate);
        return deliveryDate.getMonth() === currentMonth && deliveryDate.getFullYear() === currentYear;
      });

      setTotalDeliveriesMonth(deliveriesThisMonth.length);

      const customersResponse = await getCustomers();
      console.log('Customers response:', customersResponse);
      setTotalCustomers(customersResponse.length);
    } catch (error) {
      console.error("Error fetching KPI data:", error);
    }
  };

  const renderDrawerContent = () => (
    <DashboardDrawer 
      navigation={navigation} 
      closeDrawer={() => drawer.current.closeDrawer()} 
    />
  );

  const renderKPI = (title, value, icon) => (
    <View style={styles.kpiCard}>
      <Icon name={icon} size={40} color={COLORS.primary} />
      <Text style={styles.kpiTitle}>{title}</Text>
      <Text style={styles.kpiValue}>{value}</Text>
    </View>
  );

  return (
    <DrawerLayout
      ref={drawer}
      drawerWidth={300}
      drawerPosition={DrawerLayout.positions.Left}
      renderNavigationView={() => <DashboardDrawer navigation={navigation} />}
    >
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.headerContainer}>
            <TouchableOpacity onPress={() => drawer.current.openDrawer()}>
              <Icon name="menu" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.greetingText}>{getGreeting()}</Text>
            <View style={styles.statusContainer}>
              <Icon
                name={isConnected ? "wifi" : "wifi-off"}
                size={18}
                color={isConnected ? "#4CAF50" : "#F44336"}
              />
              <Text
                style={[
                  styles.statusText,
                  { color: isConnected ? "#4CAF50" : "#F44336" },
                ]}
              >
                {isConnected ? "Online" : "Offline"}
              </Text>
            </View>
          </View>

          <Animated.View
            style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}
          >
            <Text style={styles.title}>{locationName}</Text>
          </Animated.View>

          <View style={styles.mapContainer}>
            {renderMap(false)}
            <TouchableOpacity
              style={styles.mapOverlay}
              onPress={toggleMapFullscreen}
            >
              <Icon name="fullscreen" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.kpiContainer}>
            {renderKPI("Sales this Month", `KES ${totalSalesMonth}`, "cash")}
            {renderKPI("Deliveries this Month", totalDeliveriesMonth, "truck-delivery")}
            {renderKPI("Total Customers", totalCustomers, "account-group")}
            {renderKPI("Growth Rate", "8%", "trending-up")}
          </View>
        </ScrollView>

        <Modal
          animationType="slide"
          transparent={false}
          visible={isMapFullscreen}
          onRequestClose={toggleMapFullscreen}
        >
          <View style={styles.fullscreenMapContainer}>
            {renderMap(true)}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={toggleMapFullscreen}
            >
              <Icon name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </Modal>
      </SafeAreaView>
    </DrawerLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingTop: 20,
  },
  scrollViewContent: {
    flexGrow: 1,
    padding: 20,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  greetingText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusText: {
    marginLeft: 8,
    fontSize: 14,
  },
  mapContainer: {
    height: height * 0.3,
    marginBottom: 20,
    borderRadius: 10,
    overflow: "hidden",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  mapOverlay: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 10,
    borderRadius: 20,
  },
  kpiContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    marginVertical: 20,
  },
  kpiCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    width: width * 0.42,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 20,
  },
  kpiTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 10,
    color: "#333",
  },
  kpiValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.primary,
    marginTop: 5,
  },
  fullscreenMap: {
    width: "100%",
    height: "100%",
  },
  fullscreenMapContainer: {
    flex: 1,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    left: 10, 
    zIndex: 1, 
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    padding: 5,
  },
  customMarker: {
    backgroundColor: 'rgba(255, 0, 0, 0.5)',
    padding: 5,
    borderRadius: 5,
  },
  markerText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default DashboardScreen;