import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES } from "../constants";
import { StyledTextInput, ErrorMsg } from "../constants/styles";

const ResetPasswordSchema = Yup.object().shape({
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
});

const ResetPasswordScreen = ({ navigation }) => {
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
      navigation.navigate('Login');
    }, 1500);
  };

  return (
    <LinearGradient colors={[COLORS.primary, COLORS.secondary]} style={styles.container}>
      <Animated.View style={[styles.formContainer, { opacity: fadeAnim }]}>
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>Enter your new password</Text>
        <Formik
          initialValues={{ password: '', confirmPassword: '' }}
          validationSchema={ResetPasswordSchema}
          onSubmit={handleSubmit}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <View>
              <StyledTextInput
                placeholder="New Password"
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
                secureTextEntry
              />
              {errors.password && touched.password && (
                <ErrorMsg>{errors.password}</ErrorMsg>
              )}
              <StyledTextInput
                placeholder="Confirm New Password"
                onChangeText={handleChange('confirmPassword')}
                onBlur={handleBlur('confirmPassword')}
                value={values.confirmPassword}
                secureTextEntry
              />
              {errors.confirmPassword && touched.confirmPassword && (
                <ErrorMsg>{errors.confirmPassword}</ErrorMsg>
              )}
              <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
                <Text style={styles.buttonText}>{loading ? 'Resetting...' : 'Reset Password'}</Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
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
});

export default ResetPasswordScreen;
