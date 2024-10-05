import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES } from "../constants";
import { StyledTextInput, ErrorMsg } from "../constants/styles";

const VerificationScreen = ({ navigation, route }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(30);
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    const interval = setInterval(() => {
      setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (code.length === 6) {
      handleVerify();
    }
  }, [code]);

  const handleVerify = () => {
    // Simulate verification
    setTimeout(() => {
      navigation.navigate('ResetPassword');
    }, 500);
  };

  const handleResend = () => {
    setTimer(30);
    setCode('');
    // Implement resend logic here
  };

  return (
    <LinearGradient colors={[COLORS.primary, COLORS.secondary]} style={styles.container}>
      <Animated.View style={[styles.formContainer, { opacity: fadeAnim }]}>
        <Text style={styles.title}>Verification</Text>
        <Text style={styles.subtitle}>Enter the 6-digit code sent to {route.params.phoneNumber}</Text>
        <StyledTextInput
          placeholder="Enter code"
          value={code}
          onChangeText={setCode}
          keyboardType="number-pad"
          maxLength={6}
        />
        {error ? <ErrorMsg>{error}</ErrorMsg> : null}
        {timer > 0 ? (
          <Text style={styles.timerText}>Resend code in {timer}s</Text>
        ) : (
          <TouchableOpacity onPress={handleResend}>
            <Text style={styles.resendText}>Resend Code</Text>
          </TouchableOpacity>
        )}
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    width: '90%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.gray,
    marginBottom: 20,
    textAlign: 'center',
  },
  timerText: {
    marginTop: 20,
    color: COLORS.gray,
  },
  resendText: {
    marginTop: 20,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
});

export default VerificationScreen;
