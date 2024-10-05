import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  SafeAreaView,
  Animated,
  Modal,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import NetInfo from "@react-native-community/netinfo";
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { StatusBar } from "expo-status-bar";
import { DrawerLayout } from "react-native-gesture-handler";
import DistributorDrawer from "./DistributorDrawer";
import DashboardCard from "./DashboardCard";
import { useNavigation, useRoute } from "@react-navigation/native";
import { getDeliveries, updateUserLocation, getCustomers } from "../constants/api"; // Ensure getCustomers is imported

const { width, height } = Dimensions.get("window");

const DistributorDashboard = () => {
  const route = useRoute();
  const { userId, fullname } = route.params;
  const navigation = useNavigation();

  const [isConnected, setIsConnected] = useState(true);
  const [isMapFullscreen, setIsMapFullscreen] = useState(false);
  const [locationName, setLocationName] = useState("Loading location...");
  const [location, setLocation] = useState(null);
  const [deliveries, setDeliveries] = useState([]);
  const [customers, setCustomers] = useState([]); // State for customers
  const [totalQuantity, setTotalQuantity] = useState(0); // Initialize totalQuantity
  const [totalSales, setTotalSales] = useState(0); // Initialize totalSales if needed
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.5);
  const mapRef = useRef(null);
  const drawer = useRef(null);

  const INITIAL_REGION = {
    latitude: -1.28333,
    longitude: 36.81667,
    latitudeDelta: 2,
    longitudeDelta: 2,
  };

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

    const fetchLocation = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.log("Permission to access location was denied");
          return;
        }

        let location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Highest,
          maximumAge: 10000,
          timeout: 15000,
        });
        const { latitude, longitude } = location.coords;

        let reverseGeocode = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });
        let address = reverseGeocode[0]
          ? `${
              reverseGeocode[0].name ||
              reverseGeocode[0].street ||
              reverseGeocode[0].district ||
              reverseGeocode[0].city
            }, ${reverseGeocode[0].region}, ${reverseGeocode[0].country}`
          : "";

        setLocation({
          latitude,
          longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        });
        setLocationName(address);

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
        setLocationName("Location name not available");
      }
    };

    fetchLocation();
    fetchCustomers(); // Fetch customers

    return () => unsubscribe();
  }, []);

  const fetchCustomers = async () => {
    try {
      const customerData = await getCustomers();
      const validCustomers = customerData.filter(customer =>
        customer.Latitude && customer.Longitude &&
        !isNaN(parseFloat(customer.Latitude)) && !isNaN(parseFloat(customer.Longitude))
      );
      setCustomers(validCustomers);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const userDeliveries = await getDeliveries();
        setDeliveries(userDeliveries);
        // Example logic to calculate totalQuantity
        const quantity = userDeliveries.reduce((acc, delivery) => acc + delivery.quantity, 0);
        setTotalQuantity(quantity);
      } catch (error) {
        console.error("Error fetching deliveries:", error);
      }
    };

    fetchDeliveries();
  }, [userId]);

  useEffect(() => {
    const updateLocationInterval = setInterval(async () => {
      if (location) {
        try {
          await updateUserLocation(
            userId,
            location.latitude,
            location.longitude
          );
          console.log("User location updated successfully");
        } catch (error) {
          console.error("Error updating user location:", error);
        }
      }
    }, 30 * 1000);

    return () => clearInterval(updateLocationInterval);
  }, [location, userId]);

  const toggleMapFullscreen = () => {
    setIsMapFullscreen(!isMapFullscreen);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    const greeting =
      hour < 12
        ? "Good morning"
        : hour < 18
        ? "Good afternoon"
        : "Good evening";
    return `${greeting}, ${fullname} 👋`;
  };

  const renderDrawerContent = () => (
    <DistributorDrawer
      navigation={navigation}
      closeDrawer={() => drawer.current.closeDrawer()}
    />
  );

  const renderMap = (isFullscreen) => (
    <MapView
      ref={isFullscreen ? null : mapRef}
      style={isFullscreen ? styles.fullscreenMap : styles.map}
      provider={PROVIDER_GOOGLE}
      region={location || INITIAL_REGION}
      showsUserLocation={true}
      showsMyLocationButton={true}
      showsScale={true}
      showsBuildings={true}
      showsCompass={true}
      followsUserLocation={true}
    >
      {/* {customers.map((customer) => {
        const latitude = parseFloat(customer.Latitude);
        const longitude = parseFloat(customer.Longitude);

        if (!isNaN(latitude) && !isNaN(longitude)) {
          return (
            <Marker
              key={customer.CustomerID}
              coordinate={{ latitude, longitude }}
              title={customer.CustomerName}
              // Use a custom image for the marker
              image={require('../assets/green-image.png')} // Ensure this path is correct
            >
              <Callout>
                <View style={styles.callout}>
                  <Text style={styles.calloutTitle}>
                    {customer.CustomerName}
                  </Text>
                  <Text>{customer.Phone}</Text>
                  <Text>{customer.Location}</Text>
                </View>
              </Callout>
            </Marker>
          );
        }
        return null;
      })} */}
    </MapView>
  );

  return (
    <DrawerLayout
      ref={drawer}
      drawerWidth={250}
      drawerPosition="left"
      drawerType="front"
      edgeWidth={width}
      drawerBackgroundColor="#fff"
      renderNavigationView={renderDrawerContent}
    >
      <StatusBar style="dark" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => drawer.current.openDrawer()}>
            <Icon name="menu" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.greetingText}>{getGreeting()}</Text>
          <View style={styles.statusBar}>
            <Icon
              name={isConnected ? "wifi" : "wifi-off"}
              size={20}
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
          <TouchableOpacity
            onPress={() => navigation.navigate("Profile", { userId })}
          >
            <Icon name="account-circle" size={30} color="#4a4a4a" />
          </TouchableOpacity>
        </View>
        <View style={styles.cardContainer}>
          <DashboardCard
            title="Total Quantity"
            value={totalQuantity.toString()}
            icon="format-list-numbered"
          />
          <DashboardCard
            title="Total Sales"
            value={` ${totalSales}`}
            icon="cash-plus"
          />
        </View>
        <View style={styles.mapContainer}>
          {renderMap(false)}
          <TouchableOpacity
            style={styles.mapOverlay}
            onPress={toggleMapFullscreen}
          >
            <Icon
              name={isMapFullscreen ? "fullscreen-exit" : "fullscreen"}
              size={24}
              color="#fff"
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.makeSaleButton}
          onPress={() => navigation.navigate("MakeSale", { userId })}
        >
          <Text style={styles.makeSaleButtonText}>Make Sale</Text>
        </TouchableOpacity>
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
    </DrawerLayout>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  cardScrollContainer: {
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    marginTop: 25,
  },
  greetingText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4a4a4a",
  },
  statusBar: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },
  statusText: {
    marginLeft: 5,
    fontSize: 14,
  },
  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 20,
  },
  mapContainer: {
    height: height * 0.5,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  fullscreenMap: {
    ...StyleSheet.absoluteFillObject,
  },
  fullscreenMapContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  mapOverlay: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "#00000099",
    padding: 10,
    borderRadius: 5,
  },
  closeButton: {
    position: "absolute",
    top: 40,
    left: 20,
    backgroundColor: "#00000099",
    padding: 10,
    borderRadius: 5,
  },
  makeSaleButton: {
    backgroundColor: "#4CAF50", // Green color
    padding: 20, // Increase padding for a bigger button
    borderRadius: 10, // Rounded corners
    alignItems: "center", // Center the text
    margin: 20, // Add margin for spacing
  },
  makeSaleButtonText: {
    color: "#fff", // White text color
    fontSize: 18, // Increase font size
    fontWeight: "bold", // Bold text
  },
});

export default DistributorDashboard;