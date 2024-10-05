import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, Image, StyleSheet, Dimensions, Animated, KeyboardAvoidingView, Platform } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

import { SalesLogin } from '../constants/api';
import { COLORS } from "../constants";
import { StyledTextInput, ErrorMsg } from "../constants/styles";

const { width, height } = Dimensions.get('window');

const LoginSchema = Yup.object().shape({
    username: Yup.string().required("Username is required!"),
    password: Yup.string().required("Password is required!"),
});

const DistributorLogin = () => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(height)).current;
    const scaleAnim = useRef(new Animated.Value(0.5)).current;

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
                tension: 20,
                friction: 7,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const handleLogin = async (values, { resetForm, setSubmitting }) => {
        setLoading(true);
        try {
            const response = await SalesLogin(values.username, values.password);
            const { token, userid, fullname } = response;
            await AsyncStorage.setItem("userToken", token);
            await AsyncStorage.setItem("userId", userid);
            await AsyncStorage.setItem("fullname", fullname);
            navigation.navigate("DistributorDashboard", { userId: userid, fullname: fullname,});
            
            showToast('Success', 'Login successful', 'success');
            resetForm();
        } catch (error) {

        } finally {
            setLoading(false);
            setSubmitting(false);
        }
    };

    return (
        <>
        <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <StatusBar style="light" />
            <LinearGradient
                colors={[COLORS.primary, COLORS.secondary]}
                style={styles.gradient}
            >
                <Animated.View style={[styles.logoContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
                    
                </Animated.View>

                <Animated.View 
                    style={[
                        styles.formContainer, 
                        { 
                            transform: [{ translateY: slideAnim }],
                            opacity: fadeAnim,
                        }
                    ]}
                >
                    <Image
                        source={require('../assets/images/panel_millers.jpg')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                    <Text style={styles.title}>Welcome Back Sales!</Text>
                    <Formik
                        initialValues={{ username: '', password: '' }}
                        validationSchema={LoginSchema}
                        onSubmit={handleLogin}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
                            <View style={styles.form}>
                                <View style={styles.inputContainer}>
                                    <StyledTextInput
                                        placeholder="Username"
                                        placeholderTextColor={COLORS.gray}
                                        onChangeText={handleChange('username')}
                                        onBlur={handleBlur('username')}
                                        value={values.username}
                                        style={styles.input}
                                    />
                                    <Text style={styles.inputIcon}><FontAwesomeIcon icon={faUser} /></Text>
                                </View>
                                {errors.username && touched.username && (
                                    <ErrorMsg>{errors.username}</ErrorMsg>
                                )}

                                <View style={styles.inputContainer}>
                                    <StyledTextInput
                                        placeholder="Password"
                                        placeholderTextColor={COLORS.gray}
                                        onChangeText={handleChange('password')}
                                        onBlur={handleBlur('password')}
                                        value={values.password}
                                        secureTextEntry={!isPasswordVisible}
                                        style={styles.input}
                                    />
                                    <TouchableOpacity 
                                        onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                                        style={styles.eyeIcon}
                                    >
                                        <Text>{isPasswordVisible ? '👁️' : '👁️‍🗨️'}</Text>
                                    </TouchableOpacity>
                                </View>
                                {errors.password && touched.password && (
                                    <ErrorMsg>{errors.password}</ErrorMsg>
                                )}

                                <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                                    <Text style={styles.forgotPassword}>
                                        Forgot Password?
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity 
                                    style={styles.loginButton} 
                                    onPress={handleSubmit}
                                    disabled={loading || isSubmitting}
                                >
                                    {loading || isSubmitting ? (
                                        <ActivityIndicator size="small" color={COLORS.white} />
                                    ) : (
                                        <Text style={styles.loginButtonText}>
                                            Login
                                        </Text>
                                    )}
                                </TouchableOpacity>
                            </View>
                        )}
                    </Formik>
                </Animated.View>
            </LinearGradient>
        </KeyboardAvoidingView>
        <Toast />
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logo: {
        width: width * 0.7,
        height: height * 0.15,
    },
    formContainer: {
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.black,
        marginBottom: 20,
    },
    form: {
        width: '100%',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    input: {
        flex: 1,
        backgroundColor: COLORS.lightGray,
        borderRadius: 10,
        padding: 15,
        fontSize: 16,
    },
    inputIcon: {
        position: 'absolute',
        right: 15,
        fontSize: 20,
    },
    eyeIcon: {
        position: 'absolute',
        right: 15,
    },
    forgotPassword: {
        color: COLORS.primary,
        marginVertical: 15,
        textAlign: 'right',
        fontSize: 16,
    },
    loginButton: {
        backgroundColor: COLORS.primary,
        borderRadius: 10,
        paddingVertical: 15,
        marginTop: 20,
    },
    loginButtonText: {
        color: COLORS.white,
        fontSize: 18,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default DistributorLogin;