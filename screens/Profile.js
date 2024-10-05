import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useRoute } from "@react-navigation/native";
import { getUser, getUsers } from "../constants/api";

const DistributorProfile = ({ navigation }) => {
  const route = useRoute();
  const { userId } = route.params; // Get userId from route params
  const [distributor, setDistributor] = useState(null);

  useEffect(() => {
    const fetchDistributorData = async () => {
      console.log("Fetching distributor data for user ID:", userId);
      try {
        const users = await getUser(userId);
        const user = users.find((u) => u.Id === userId);
        if (user) {
          setDistributor(user);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDistributorData();
  }, [userId]); // Add userId as a dependency

  if (!distributor) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={["#4CAF50", "#2196F3"]} style={styles.header}>
        <Image source={{ uri: distributor.avatar }} style={styles.avatar} />
        <Text style={styles.name}>{distributor.name}</Text>
        <Text style={styles.email}>{distributor.email}</Text>
      </LinearGradient>

      <View style={styles.infoContainer}>
        <InfoItem icon="user" label="FullName" value={distributor.FullName} />
        <InfoItem icon="email" label="Email" value={distributor.Email} />
        <InfoItem icon="role" label="UserRole" value={distributor.UserRole} />
        <InfoItem icon="phone" label="Phone" value={distributor.PhoneNumber} />
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>Performance Stats</Text>
        <View style={styles.statsGrid}>
          <StatItem
            label="Total Sales"
            // value={`KES ${distributor.stats.totalSales.toLocaleString()}`}
          />
          <StatItem
            label="Monthly Average"
            // value={`KES ${distributor.stats.monthlyAverage.toLocaleString()}`}
          />
          {/* <StatItem label="Top Product" value={distributor.stats.topProduct} /> */}
          {/* <StatItem label="Customers" value={distributor.stats.customerCount} /> */}
        </View>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate("EditProfile")}
        >
          <Icon name="account-edit" size={24} color="#fff" />
          <Text style={styles.actionButtonText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate("SalesHistory")}
        >
          <Icon name="history" size={24} color="#fff" />
          <Text style={styles.actionButtonText}>Sales History</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const InfoItem = ({ icon, label, value }) => (
  <View style={styles.infoItem}>
    <Icon name={icon} size={24} color="#4CAF50" style={styles.infoIcon} />
    <View>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </View>
);

const StatItem = ({ label, value }) => (
  <View style={styles.statItem}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    alignItems: "center",
    padding: 20,
    paddingTop: 40,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: "#fff",
  },
  infoContainer: {
    backgroundColor: "#fff",
    padding: 20,
    marginTop: 20,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  infoIcon: {
    marginRight: 15,
  },
  infoLabel: {
    fontSize: 14,
    color: "#666",
  },
  infoValue: {
    fontSize: 16,
    color: "#333",
  },
  statsContainer: {
    backgroundColor: "#fff",
    padding: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statItem: {
    width: "48%",
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
  },
  actionButton: {
    backgroundColor: "#2196F3",
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
    width: "48%",
  },
  actionButtonText: {
    color: "#fff",
    marginLeft: 10,
    fontSize: 16,
  },
});

export default DistributorProfile;
