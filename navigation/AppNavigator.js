import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import Toast from "react-native-toast-message";

import LoginScreen from "../screens/Login";
import DashboardScreen from "../screens/Dashboard";
import CustomersScreen from "../screens/Customers";
import ProductsScreen from "../screens/Products";
import CreateSaleScreen from "../screens/CreateSale";
import SalesHistoryScreen from "../screens/SalesHistory";
import PerformanceMetricsScreen from "../screens/Performance";
import CustomerDetailsScreen from "../screens/CustomerDetailsScreen";
import AddCustomerScreen from "../screens/AddCustomerScreen";
import EditCustomerScreen from "../screens/EditCustomerScreen";
import AddProductScreen from "../screens/AddProductScreen";
import EditProductScreen from "../screens/EditProductScreen";
import ProductDetailsScreen from "../screens/ProductDetailsScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import VerificationScreen from "../screens/VerificationScreen";
import ResetPasswordScreen from "../screens/ResetPasswordScreen";
import WelcomeScreen from "../screens/Welcome";
import DistributorLogin from "../screens/DistributorLogin";
import DistributorDashboard from "../screens/DistributorDashboard";
import Inventory from "../screens/Inventory";
import SalesSummary from "../screens/SalesSummary";
import MakeSale from "../screens/MakeSale";
import ProductDetail from "../screens/ProductDetail";
import Payment from "../screens/Payment";
import PaymentConfirmation from "../screens/PaymentConfirmation";
import Profile from "../screens/Profile";
import ProductManagement from "../screens/ProductManagement";
import SalesTargetForm from "../screens/SalesTargetForm";
import PricingStrategy from "../screens/PricingStrategy";
import ProductForm from "../screens/ProductForm";
import DistributorAssignmentForm from "../screens/DistributorAssignmentForm";
import DistributorAllocationList from "../screens/DistributorAllocationList";
import DistributorAllocationScreen from "../screens/DistributorAllocationScreen";
import DistributorAllocationView from "../screens/DistributorAllocationView";
import DistributorAllocationForm from "../screens/DistributorAllocationForm";
import SalesTargetHistory from "../screens/SalesTargetHistory";
import SalesTeam from "../screens/SalesTeam";
import AddSupplier from "../screens/AddSupplier";
import POPage from "../screens/PurchaseOrder";
import AddPOPage from "../screens/AddPurchaseOrder";
import UsersDashboard from "../screens/UsersDashboard";
import SalesPersonDetails from "../screens/SalesPersonDetails";
import RegisterUser from "../screens/RegisterUser";
import UpdateUser from "../screens/UpdateUser";
import ViewAllUsers from "../screens/ViewAllUsers";
import AddSalesPerson from "../screens/AddSalesPerson";
import SalesInvoice from "../screens/SalesInvoice";
import ProductDetails from "../screens/Products";

import MethodOfPayment from "../screens/payment_method";



const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="DistributorLogin"
          component={DistributorLogin}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{ title: "Dashboard", headerShown: false }}
        />
        <Stack.Screen
          name="MethodOfPayment"
          component={MethodOfPayment}
          options={{ title: "Payment Method" }}
        />
        <Stack.Screen
          name="Customers"
          component={CustomersScreen}
          options={{ title: "Customer Management" }}
        />
        <Stack.Screen
          name="Products"
          component={ProductsScreen}
          options={{ title: "Products" }}
        />
        <Stack.Screen
          name="CreateSale"
          component={CreateSaleScreen}
          options={{ title: "Create Sale" }}
        />
        <Stack.Screen
          name="SalesHistory"
          component={SalesHistoryScreen}
          options={{ title: "Sales History" }}
        />
        <Stack.Screen
          name="Performance"
          component={PerformanceMetricsScreen}
          options={{ title: "Performance Metrics" }}
        />
        <Stack.Screen
          name="CustomerDetails"
          component={CustomerDetailsScreen}
          options={{ title: "Customer Details" }}
        />
        <Stack.Screen
          name="AddCustomer"
          component={AddCustomerScreen}
          options={{ title: "Add Customer" }}
        />
        <Stack.Screen
          name="EditCustomer"
          component={EditCustomerScreen}
          options={{ title: "Edit Customer" }}
        />
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{ title: "Welcome" }}
        />
        <Stack.Screen
          name="Product"
          component={ProductDetailsScreen}
          options={{ title: "Product Details" }}
        />
        <Stack.Screen
          name="DistributorDashboard"
          component={DistributorDashboard}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Inventory"
          component={Inventory}
          options={{ title: "Inventory" }}
        />
        <Stack.Screen
          name="DistributorAllocationForm"
          component={DistributorAllocationForm}
          options={{ title: "Delivery Allocation Form" }}
        />
        <Stack.Screen
          name="MakeSale"
          component={MakeSale}
          options={{ title: "Make Sale" }}
        />
        <Stack.Screen
          name="SalesSummary"
          component={SalesSummary}
          options={{ title: "Sales Summary" }}
        />
        <Stack.Screen
          name="ProductManagement"
          component={ProductManagement}
          options={{ title: "Product Management" }}
        />
        <Stack.Screen
          name="SalesTargetForm"
          component={SalesTargetForm}
          options={{ title: "Sales Target Form" }}
        />
        <Stack.Screen
          name="PricingStrategy"
          component={PricingStrategy}
          options={{ title: "Pricing Strategy" }}
        />
        <Stack.Screen
          name="ProductForm"
          component={ProductForm}
          options={{ title: "Product Form" }}
        />
        <Stack.Screen
          name="DistributorAllocationList"
          component={DistributorAllocationList}
          options={{ title: "Distributor Allocation List" }}
        />
        <Stack.Screen
          name="DistributorAllocationScreen"
          component={DistributorAllocationScreen}
          options={{ title: "Distributor Allocation Screen" }}
        />
        <Stack.Screen
          name="DistributorAllocationView"
          component={DistributorAllocationView}
          options={{ title: "Deliveries" }}
        />
        <Stack.Screen
          name="SalesTargetHistory"
          component={SalesTargetHistory}
          options={{ title: "Sales Target History" }}
        />
        <Stack.Screen
          name="Payment"
          component={Payment}
          options={{ title: "Payment" }}
        />
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{ title: "Profile" }}
        />
        <Stack.Screen
          name="DistributorAssignmentForm"
          component={DistributorAssignmentForm}
          options={{ title: "Distributor Assignment Form" }}
        />
        <Stack.Screen
          name="PaymentConfirmation"
          component={PaymentConfirmation}
          options={{ title: "Payment Confirmation" }}
        />
        <Stack.Screen
          name="ProductDetail"
          component={ProductDetail}
          options={{ title: "Product Detail" }}
        />
        <Stack.Screen
          name="SalesTeam"
          component={SalesTeam}
          options={{ title: "Sales Team Management" }}
        />
        <Stack.Screen
          name="AddSupplier"
          component={AddSupplier}
          options={{ title: "Supplier Form" }}
        />
        <Stack.Screen
          name="POPage"
          component={POPage}
          options={{ title: "Purchase Order Management" }}
        />
        <Stack.Screen
          name="AddPOPage"
          component={AddPOPage}
          options={{ title: "Purchase Order Form" }}
        />
        <Stack.Screen
          name="SalesPersonDetails"
          component={SalesPersonDetails}
          options={{ title: "Sales Person Details" }}
        />
        <Stack.Screen
          name="UsersDashboard"
          component={UsersDashboard}
          options={{ title: "Users Dashboard" }}
        />
        <Stack.Screen
          name="AddSalesPerson"
          component={AddSalesPerson}
          options={{ title: "Add Sales Person" }}
        />
        <Stack.Screen
          name="SalesInvoice"
          component={SalesInvoice}
          options={{ title: "Sales Invoice" }}
        />

        <Stack.Screen
          name="AddProduct"
          component={AddProductScreen}
          options={{ title: "Add Product" }}
        />
        <Stack.Screen
          name="EditProduct"
          component={EditProductScreen}
          options={{ title: "Edit Product" }}
        />
        <Stack.Screen
          name="ProductDetails"
          component={ProductDetailsScreen}
          options={{ title: "Product Details" }}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPasswordScreen}
          options={{ title: "Forgot Password" }}
        />
        <Stack.Screen
          name="Verification"
          component={VerificationScreen}
          options={{ title: "Verification" }}
        />
        <Stack.Screen
          name="ResetPassword"
          component={ResetPasswordScreen}
          options={{ title: "Reset Password" }}
        />
        <Stack.Screen
          name="RegisterUser"
          component={RegisterUser}
          options={{ title: "Register User" }}
        />
        <Stack.Screen
          name="UpdateUser"
          component={UpdateUser}
          options={{ title: "Update User" }}
        />
        <Stack.Screen
          name="ViewAllUsers"
          component={ViewAllUsers}
          options={{ title: "View All Users" }}
        />
      </Stack.Navigator>
      <Toast />
    </NavigationContainer>
  );
};

export default AppNavigator;
