import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  ScrollView,
  Dimensions,
} from "react-native";
import { LineChart, PieChart } from "react-native-chart-kit";

const { width } = Dimensions.get("window");

const SalesSummary = () => {
  const [salesData, setSalesData] = useState({
    monthlySales: [
      12000, 19000, 3000, 5000, 2000, 3000, 25000, 10000, 15000, 22000, 30000,
      28000,
    ],
    productSales: [
      { name: "Product A", sales: 300, color: "#FF6384" },
      { name: "Product B", sales: 500, color: "#36A2EB" },
      { name: "Product C", sales: 200, color: "#FFCE56" },
      { name: "Product D", sales: 450, color: "#4BC0C0" },
    ],
  });

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const spinAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
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
      Animated.loop(
        Animated.timing(spinAnim, {
          toValue: 1,
          duration: 3000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ),
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ),
    ]).start();
  }, []);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const AnimatedNumber = ({ value }) => {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
      Animated.timing(new Animated.Value(0), {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false,
      }).start(() => {
        setDisplayValue(value);
      });
    }, [value]);

    return (
      <Text style={styles.animatedNumber}>
        KES {displayValue.toLocaleString()}
      </Text>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Animated.View
        style={[
          styles.header,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
        ]}
      >
        <Text style={styles.title}>Sales Summary</Text>
        <AnimatedNumber
          value={salesData.monthlySales.reduce((a, b) => a + b, 0)}
        />
      </Animated.View>

      <Animated.View
        style={[styles.chartContainer, { transform: [{ scale: scaleAnim }] }]}
      >
        <Text style={styles.chartTitle}>Monthly Sales</Text>
        <LineChart
          data={{
            labels: [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ],
            datasets: [{ data: salesData.monthlySales }],
          }}
          width={width - 40}
          height={220}
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: { borderRadius: 16 },
          }}
          bezier
          style={{ marginVertical: 8, borderRadius: 16 }}
        />
      </Animated.View>

      <Animated.View
        style={[styles.chartContainer, { transform: [{ scale: pulseAnim }] }]}
      >
        <Text style={styles.chartTitle}>Product Sales Distribution</Text>
        <PieChart
          data={salesData.productSales.map((product) => ({
            name: product.name,
            population: product.sales,
            color: product.color,
            legendFontColor: "#7F7F7F",
            legendFontSize: 12,
          }))}
          width={width - 40}
          height={220}
          chartConfig={{
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
        />
      </Animated.View>

      {/* <Animated.View
        style={[styles.animatedCircle, { transform: [{ scale: pulseAnim }] }]}
      /> */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    alignItems: "center",
    marginVertical: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  animatedNumber: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  chartContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  animatedCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#4CAF50",
    alignSelf: "center",
    marginBottom: 20,
  },
});

export default SalesSummary;
