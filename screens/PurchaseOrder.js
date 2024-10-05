import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getPurchaseOrders, getInventoryItems } from '../constants/api';
import { FONTS, COLORS, SIZES } from '../constants';
import { AntDesign } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

const MetricCard = ({ title, value, icon }) => (
  <View style={styles.metricCard}>
    <Icon name={icon} size={32} color="#4CAF50" />
    <Text style={styles.metricValue}>{value}</Text>
    <Text style={styles.metricTitle}>{title}</Text>
  </View>
);

const POPage = () => {
  const navigation = useNavigation();
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [expandedPO, setExpandedPO] = useState(null);
  const [status, setStatus] = useState('Open');
  const [showStatusOptions, setShowStatusOptions] = useState(false); 
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [totalValue, setTotalValue] = useState(0);
  const [totalPOs, setTotalPOs] = useState(0);
  const [openPO, setOpenPO] = useState(0);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [orderDate, setOrderDate] = useState(new Date());
  const [showFilters, setShowFilters] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    fetchPurchaseOrders();
  }, [status, orderDate]);

  const fetchPurchaseOrders = async () => {
    setLoading(true);
    setRefreshing(true);
    try {
      const dateStr = orderDate.toISOString().split('T')[0];
      const data = await getPurchaseOrders(status, dateStr);
      setPurchaseOrders(data);
      setTotalPOs(data.length);
      setOpenPO(data.filter(po => po.Status === 'Open').length);
    } catch (error) {
      console.error("Error fetching POs:", error.message);
      setPurchaseOrders([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const fetchInventoryItems = async () => {
      try {
        const response = await getInventoryItems();
        const formattedItems = response.map(item => ({
          id: item.ItemID,
          name: item.ItemName,
          price: item.Cost,
        }));
        setInventoryItems(formattedItems);

        const total = purchaseOrders.reduce((acc, po) => {
          const poTotal = po.details.reduce((sum, item) => {
            const inventoryItem = formattedItems.find(i => i.id === item.ItemID);
            return sum + (inventoryItem ? inventoryItem.price * item.Quantity : 0);
          }, 0);
          return acc + poTotal;
        }, 0);

        setTotalValue(total);
      } catch (error) {
        console.error("Error fetching inventory items:", error.message);
      }
    };

    fetchInventoryItems();
  }, [purchaseOrders]);

  const toggleExpand = (poID) => {
    setExpandedPO(expandedPO === poID ? null : poID);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open':
        return COLORS.green;
      case 'Closed':
        return COLORS.red;
      default:
        return COLORS.lightgray;
    }
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleStatusSelect = (newStatus) => {
    setStatus(newStatus);
    setShowStatusOptions(false);
    setShowFilters(false);
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <View style={styles.metricsContainer}>
        <MetricCard title="Total POs" value={totalPOs} icon="sack" />
        <MetricCard title="Total Value (KES)" value={`${totalValue.toFixed(1)}`} icon="cash-multiple" />
        <MetricCard title="Open" value={openPO} icon="sticker-check-outline" />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchPurchaseOrders} />
        }
      >
        {loading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={{ marginTop: 10, ...FONTS.body4 }}>Loading Purchase Orders...</Text>
          </View>
        ) : (
          purchaseOrders.length > 0 ? (
            purchaseOrders.map((po) => {
              const poTotalValue = po.details.reduce((sum, item) => {
                const inventoryItem = inventoryItems.find(i => i.id === item.ItemID);
                return sum + (inventoryItem ? inventoryItem.price * item.Quantity : 0);
              }, 0);

              return (
                <View key={po.PurchaseOrderID} style={styles.poContainer}>
                  <TouchableOpacity onPress={() => toggleExpand(po.PurchaseOrderID)} style={styles.poHeader}>
                    <View>
                      <Text style={{ ...FONTS.h4, color: COLORS.primary }}>#{po.PurchaseOrderID} - {po.SupplierName}</Text>
                      <Text style={{ ...FONTS.body5, color: COLORS.gray }}>Order Date: {new Date(po.OrderDate).toLocaleDateString()}</Text>
                      <Text style={{ ...FONTS.body5, color: COLORS.black }}>Status: <Text style={{ color: getStatusColor(po.Status) }}>{po.Status}</Text></Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={{ ...FONTS.h4, color: COLORS.primary, marginBottom: 10 }}>KES {poTotalValue.toFixed(2)}</Text>
                      <AntDesign
                        name={expandedPO === po.PurchaseOrderID ? "up" : "down"}
                        size={20}
                        color={COLORS.primary}
                      />
                    </View>
                  </TouchableOpacity>

                  {expandedPO === po.PurchaseOrderID && (
                    <View style={styles.poDetails}>
                      {po.details.map((item, index) => (
                        <View key={index} style={{ marginBottom: 10 }}>
                          <Text style={{ ...FONTS.body4, color: COLORS.black }}>Item: {item.ItemName}</Text>
                          <Text style={{ ...FONTS.body5, color: COLORS.gray }}>Quantity: {item.Quantity} bags, Bag: {item.BagQty} KG</Text>
                          <Text style={{ ...FONTS.body5, color: COLORS.gray }}>Total: {item.TotalQty} KG</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              );
            })
          ) : (
            <Text style={{ ...FONTS.body4, textAlign: 'center', color: COLORS.gray }}>No Purchase Orders found for the selected status.</Text>
          )
        )}
      </ScrollView>

      <View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={toggleFilters}
        >
          <Icon name="plus" size={24} color="#fff" />
        </TouchableOpacity>

        {showFilters && (
          <View style={styles.filterContainer}>

            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => setShowStatusOptions(!showStatusOptions)}
            >
              <Text style={styles.filterButtonText}>‣ Status: {status}</Text>
            </TouchableOpacity>

            {showStatusOptions && (
              <View style={styles.statusOptions}>
                {['• Open', '• Closed', '• Pending'].map(option => (
                  <TouchableOpacity
                    key={option}
                    onPress={() => handleStatusSelect(option)}
                    style={styles.statusOption}
                  >
                    <Text style={{ color: '#fff', ...FONTS.body4 }}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <TouchableOpacity
                style={styles.filterButton}
                onPress={() => {
                    setShowFilters(false);
                    setShowDatePicker(true);
                }}
                >
                <Text style={styles.filterButtonText}>◘ Order Date: {orderDate.toLocaleDateString()}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => {
                setShowFilters(false);
                navigation.navigate('AddPOPage');
              }}
            >
              <Text style={styles.filterButtonText}>+ Create Purchase Order</Text>
            </TouchableOpacity>
          </View>
        )}

        {showDatePicker && (
          <DateTimePicker
            value={orderDate}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              const currentDate = selectedDate || orderDate;
              setShowDatePicker(false);
              setOrderDate(currentDate);
            }}
          />
        )}
      </View>
    </View>
  );
};

const styles = {
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  metricCard: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    padding: 10,
    width: "30%",
    borderRadius: 10,
    shadowColor: COLORS.gray,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  metricValue: {
    ...FONTS.h2,
    color: COLORS.black,
  },
  metricTitle: {
    ...FONTS.body4,
    color: COLORS.gray,
  },
  poContainer: {
    backgroundColor: COLORS.white,
    marginBottom: 10,
    padding: 15,
    borderRadius: 10,
    shadowColor: COLORS.gray,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  poHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  poDetails: {
    marginTop: 10,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 30,
    padding: 10,
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  filterContainer: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 10,
  },
  filterButton: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: COLORS.primaryDark,
    borderRadius: 5,
  },
  filterButtonText: {
    color: '#fff',
    ...FONTS.body4,
  },
  statusOptions: {
    backgroundColor: COLORS.primaryDark,
    padding: 5,
    borderRadius: 5,
  },
  statusOption: {
    padding: 10,
  },
};

export default POPage;