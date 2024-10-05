import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES } from "../constants";
import { StyledTextInput, ErrorMsg } from "../constants/styles";

const { width } = Dimensions.get('window');

const ForgotPasswordSchema = Yup.object().shape({
  phoneNumber: Yup.string().required("Phone number is required"),
});

const ForgotPasswordScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const fadeAnim = new Animated.Value(0);

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleSubmit = async (values) => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      navigation.navigate('Verification', { phoneNumber: values.phoneNumber });
    }, 1500);
  };

  return (
    <LinearGradient colors={[COLORS.primary, COLORS.secondary]} style={styles.container}>
      <Animated.View style={[styles.formContainer, { opacity: fadeAnim }]}>
        <Text style={styles.title}>Forgot Password</Text>
        <Text style={styles.subtitle}>Enter your phone number to receive a verification code</Text>
        <Formik
          initialValues={{ phoneNumber: '' }}
          validationSchema={ForgotPasswordSchema}
          onSubmit={handleSubmit}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <View>
              <StyledTextInput
                placeholder="Phone Number"
                onChangeText={handleChange('phoneNumber')}
                onBlur={handleBlur('phoneNumber')}
                value={values.phoneNumber}
                keyboardType="phone-pad"
              />
              {errors.phoneNumber && touched.phoneNumber && (
                <ErrorMsg>{errors.phoneNumber}</ErrorMsg>
              )}
              <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
                <Text style={styles.buttonText}>{loading ? 'Sending...' : 'Send Code'}</Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>Back to Login</Text>
        </TouchableOpacity>
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
    width: width * 0.9,
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
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 25,
    paddingVertical: 12,
    marginTop: 20,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: SIZES.font,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  backButton: {
    marginTop: 20,
    color: COLORS.primary,
    fontSize: 16,
  },
});

export default ForgotPasswordScreen;
