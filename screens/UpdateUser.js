import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Text, Card, ActivityIndicator } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import { updateUser, getUsers } from '../constants/api';

const UpdateUser = ({ route, navigation }) => {
  const { userId } = route.params;
  const [formData, setFormData] = useState({
    FirstName: '',
    LastName: '',
    UserName: '',
    Email: '',
    PhoneNumber: '',
    UserRole: '',
    Password: '',
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const users = await getUsers();
        const user = users.find((u) => u.Id === userId);
        if (user) {
          setFormData(user);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    setUpdating(true);
    try {
      await updateUser(userId, formData);
      Alert.alert('Success', 'User updated successfully');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Animatable.View animation="fadeInDown" duration={1000} style={styles.headerContainer}>
          <Text style={styles.title}>Update User</Text>
        </Animatable.View>
        {loading ? (
          <ActivityIndicator animating={true} color="#6200ee" size="large" />
        ) : (
          <Animatable.View animation="fadeInUp" duration={1000} style={styles.formContainer}>
            <Card style={styles.card}>
              <Card.Content>
                <TextInput
                  label="First Name"
                  mode="outlined"
                  style={styles.input}
                  value={formData.FirstName}
                  onChangeText={(value) => handleChange('FirstName', value)}
                />
                <TextInput
                  label="Last Name"
                  mode="outlined"
                  style={styles.input}
                  value={formData.LastName}
                  onChangeText={(value) => handleChange('LastName', value)}
                />
                <TextInput
                  label="Username"
                  mode="outlined"
                  style={styles.input}
                  value={formData.UserName}
                  onChangeText={(value) => handleChange('UserName', value)}
                />
                <TextInput
                  label="Email"
                  mode="outlined"
                  style={styles.input}
                  value={formData.Email}
                  onChangeText={(value) => handleChange('Email', value)}
                />
                <TextInput
                  label="Phone Number"
                  mode="outlined"
                  style={styles.input}
                  value={formData.PhoneNumber}
                  onChangeText={(value) => handleChange('PhoneNumber', value)}
                />
                <TextInput
                  label="User Role"
                  mode="outlined"
                  style={styles.input}
                  value={formData.UserRole}
                  onChangeText={(value) => handleChange('UserRole', value)}
                />
                <TextInput
                  label="Password"
                  mode="outlined"
                  style={styles.input}
                  value={formData.Password}
                  onChangeText={(value) => handleChange('Password', value)}
                />
                {updating ? (
                  <ActivityIndicator animating={true} color="#6200ee" />
                ) : (
                  <Button mode="contained" onPress={handleSubmit} style={styles.button}>
                    Update
                  </Button>
                )}
              </Card.Content>
            </Card>
          </Animatable.View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollViewContent: {
    padding: 16,
    alignItems: 'center',
  },
  headerContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6200ee',
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
  },
  card: {
    borderRadius: 10,
    elevation: 3,
  },
  input: {
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
  },
});

export default UpdateUser;
