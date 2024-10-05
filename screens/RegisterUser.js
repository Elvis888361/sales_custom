import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Text, Card, ActivityIndicator } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import { registerUser } from '../constants/api';

const RegisterUser = ({ navigation }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    phoneNumber: '',
    userRole: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await registerUser(formData);
      Alert.alert('Success', 'User registered successfully');
      setFormData({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        phoneNumber: '',
        userRole: '',
        password: '',
      });
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.message);
      console.error('Error details:', error); // Log the error details
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Animatable.View animation="fadeInDown" duration={1000} style={styles.headerContainer}>
          <Text style={styles.title}>Register User</Text>
        </Animatable.View>
        <Animatable.View animation="fadeInUp" duration={1000} style={styles.formContainer}>
          <Card style={styles.card}>
            <Card.Content>
              {Object.keys(formData).map((key) => (
                <TextInput
                  key={key}
                  label={key.charAt(0).toUpperCase() + key.slice(1)}
                  mode="outlined"
                  style={styles.input}
                  value={formData[key]}
                  onChangeText={(value) => handleChange(key, value)}
                />
              ))}
              {loading ? (
                <ActivityIndicator animating={true} color="#6200ee" />
              ) : (
                <Button mode="contained" onPress={handleSubmit} style={styles.button}>
                  Register
                </Button>
              )}
            </Card.Content>
          </Card>
        </Animatable.View>
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

export default RegisterUser;
