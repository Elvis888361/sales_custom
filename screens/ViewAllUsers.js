import React, { useEffect, useState } from 'react';
import { View, StyleSheet, SafeAreaView, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Text, Card } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import { getUsers } from '../constants/api';

const ViewAllUsers = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const renderItem = ({ item }) => (
    <Animatable.View animation="fadeInUp" duration={1000} style={styles.cardContainer}>
      <TouchableOpacity onPress={() => navigation.navigate('UpdateUser', { userId: item.id })}>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.username}>{item.username}</Text>
            <Text style={styles.email}>{item.email}</Text>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    </Animatable.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Animatable.View animation="fadeInDown" duration={1000} style={styles.headerContainer}>
        <Text style={styles.title}>View All Users</Text>
      </Animatable.View>
      {loading ? (
        <ActivityIndicator animating={true} color="#6200ee" size="large" />
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6200ee',
    textAlign: 'center',
  },
  listContent: {
    padding: 16,
  },
  cardContainer: {
    marginBottom: 16,
  },
  card: {
    borderRadius: 10,
    elevation: 3,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  email: {
    fontSize: 14,
    color: '#666',
  },
});

export default ViewAllUsers;
