import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  Animated, 
  Dimensions,
  Switch,
  Image
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LineChart } from 'react-native-chart-kit';
import { getInventoryItems } from '../constants/api';

const { width } = Dimensions.get('window');

const ProductCard = ({ product, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <Image source={{ uri: product.image }} style={styles.productImage} />
    <Text style={styles.productName}>{product.name}</Text>
    <Text style={styles.productPrice}>KES {product.price}</Text>
  </TouchableOpacity>
);

const ProductListItem = ({ product, onPress }) => (
  <TouchableOpacity style={styles.listItem} onPress={onPress}>
    <Image source={{ uri: product.image }} style={styles.listItemImage} />
    <View style={styles.listItemInfo}>
      <Text style={styles.listItemName}>{product.name}</Text>
      <Text style={styles.listItemPrice}>KES {product.price}</Text>
    </View>
  </TouchableOpacity>
);

const ProductCatalogScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [isGridView, setIsGridView] = useState(true);
  const isFocused = useIsFocused();
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const inventoryItems = await getInventoryItems();
        const formattedItems = inventoryItems.map(item => ({
          id: item.ItemID,
          name: item.ItemName,
          price: item.Cost,
          image: 'https://via.placeholder.com/150', 
        }));
        setProducts(formattedItems);
      } catch (error) {
        console.error(error);
      }
    };

    if (isFocused) {
      fetchInventory();
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        })
      ]).start();
    }
  }, [isFocused]);

  const handleAddProduct = () => {
    navigation.navigate('AddProduct');
  };

  const handleProductPress = (product) => {
    navigation.navigate('ProductDetails', { product });
  };

  const toggleView = () => {
    setIsGridView(!isGridView);
  };

  const renderProductItem = ({ item }) => {
    if (isGridView) {
      return <ProductCard product={item} onPress={() => handleProductPress(item)} />;
    } else {
      return <ProductListItem product={item} onPress={() => handleProductPress(item)} />;
    }
  };

  // Example sales data
  const salesData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [{
      data: [20, 45, 28, 80, 99, 43, 50],
      color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // Custom color
      strokeWidth: 2 // Optional: Set stroke width
    }],
    legend: ["Sales"] // Optional: Legend
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.graphContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <Text style={styles.graphTitle}>Sales Overview</Text>
        <LineChart
          data={salesData}
          width={width - 40}
          height={220}
          chartConfig={{
            backgroundColor: "#e26a00",
            backgroundGradientFrom: "#fb8c00",
            backgroundGradientTo: "#ffa726",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16
            },
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: "#ffa726"
            }
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16
          }}
        />
      </Animated.View>

      <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.viewToggle}>
          <Text>List</Text>
          <Switch
            value={isGridView}
            onValueChange={toggleView}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isGridView ? "#f5dd4b" : "#f4f3f4"}
          />
          <Text>Grid</Text>
        </View>
      </Animated.View>

      <Animated.View style={{ flex: 1, opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
        <FlatList
          data={products}
          renderItem={renderProductItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={isGridView ? 2 : 1}
          key={isGridView ? 'grid' : 'list'}
          columnWrapperStyle={isGridView ? styles.row : null}
        />
      </Animated.View>

      <TouchableOpacity style={styles.addButton} onPress={handleAddProduct}>
        <Icon name="plus" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  viewToggle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  graphContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  graphTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  row: {
    flex: 1,
    justifyContent: 'space-around',
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#4CAF50',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    margin: 8,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  productImage: {
    width: 100,
    height: 100,
    marginBottom: 8,
    borderRadius: 8,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    color: '#4CAF50',
  },
  listItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  listItemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  listItemInfo: {
    flex: 1,
  },
  listItemName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  listItemPrice: {
    fontSize: 16,
    color: '#4CAF50',
  },
});

export default ProductCatalogScreen;
