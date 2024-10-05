import React, { useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Animated, Dimensions, Easing } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const Welcome = () => {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(width)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 6000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ),
    ]).start();
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <LinearGradient
      colors={['#006400', '#008000', '#228B22']}
      style={styles.container}
    >
      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <Image
          source={require('../assets/images/panel_millers.jpg')}
          style={styles.logo}
          resizeMode="contain"
        />
        
        <Text style={styles.title}>Welcome to Panel Millers Limited</Text>
        
        <Text style={styles.info}>
          Panel Millers Limited is a leading manufacturer of high-quality panels for various industries.
          We pride ourselves on innovation, sustainability, and customer satisfaction.
        </Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>50+</Text>
            <Text style={styles.statLabel}>Years of Experience</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>1000+</Text>
            <Text style={styles.statLabel}>Happy Clients</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>30+</Text>
            <Text style={styles.statLabel}>Countries Served</Text>
          </View>
        </View>

        <Animated.View style={[styles.animatedCircle, { transform: [{ rotate: spin }] }]} />
      </Animated.View>

      <Animated.View style={[styles.cardContainer, { transform: [{ translateX: slideAnim }] }]}>
        <TouchableOpacity 
          style={styles.card} 
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.cardText}>Admin Panel</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.card} 
          onPress={() => navigation.navigate('DistributorLogin')}
        >
          <Text style={styles.cardText}>Distributors Panel</Text>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View style={[styles.floatingLeaf, { transform: [{ translateY: Animated.multiply(rotateAnim, height * 0.7) }] }]} />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 200,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#ffffff',
  },
  info: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#e0e0e0',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  statLabel: {
    fontSize: 12,
    color: '#e0e0e0',
  },
  animatedCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 10,
    borderColor: '#ffffff',
    borderStyle: 'dotted',
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 15,
    borderRadius: 10,
    width: '45%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  cardText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  floatingLeaf: {
    position: 'absolute',
    width: 30,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 15,
    left: 20,
  },
});

export default Welcome;
