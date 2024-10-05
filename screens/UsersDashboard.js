import React, { useEffect, useState } from 'react';
import { View, StyleSheet, SafeAreaView, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Text, Card, TextInput, FAB } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import { getUsers } from '../constants/api';

const UsersDashboard = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data);
        setFilteredUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      const filtered = users.filter((user) =>
        user.UserName.toLowerCase().includes(query.toLowerCase()) ||
        user.Email.toLowerCase().includes(query.toLowerCase()) ||
        user.FirstName.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  };

  const renderItem = ({ item }) => (
    <Animatable.View animation="fadeInUp" duration={1000} style={styles.cardContainer}>
      <TouchableOpacity onPress={() => navigation.navigate('UpdateUser', { userId: item.Id })}>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.username}>Username: {item.UserName}</Text>
            <Text style={styles.firstName}>First Name: {item.FirstName}</Text>
            <Text style={styles.email}>Email: {item.Email}</Text>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    </Animatable.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Animatable.View animation="fadeInDown" duration={1000} style={styles.headerContainer}>
        <Text style={styles.title}>Users Dashboard</Text>
        <TextInput
          label="Search"
          value={searchQuery}
          onChangeText={handleSearch}
          mode="outlined"
          style={styles.searchInput}
        />
      </Animatable.View>
      {loading ? (
        <ActivityIndicator animating={true} color="#6200ee" size="large" />
      ) : (
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item.Id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      )}
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('RegisterUser')}
      />
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
  searchInput: {
    width: '90%',
    marginTop: 10,
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
    color: '#000', // Darker color for better visibility
  },
  firstName: {
    fontSize: 16,
    color: '#333',
  },
  email: {
    fontSize: 14,
    color: '#666',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#6200ee',
  },
});

export default UsersDashboard;