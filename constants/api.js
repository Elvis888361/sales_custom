import AsyncStorage from "@react-native-async-storage/async-storage";

let API_URL;

const setApiUrl = async () => {
  try {
    API_URL = "https://panelmillers.lqadmin.com/api/";
  } catch (error) {
    console.error("Error reading urlValue:", error);
  }
};

const getCommonHeaders = async () => {
  const token = await AsyncStorage.getItem("userToken");
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// Sales Login
export const SalesLogin = async (username, password) => {
  await setApiUrl();
  const url = `${API_URL}Account/SalesLogin`; 
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "*/*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userName: username, password: password }),
  });

  const responseData = await response.text(); 
  try {
    const data = JSON.parse(responseData);
    if (response.ok) {
      return data; 
    } else {
      throw new Error(data.LoginError || 'Login failed');
    }
  } catch (error) {
    throw new Error(error.message || 'Something went wrong');
  }
};

// Admin Login
export const AdminLogin = async (username, password) => {
  await setApiUrl();
  const url = `${API_URL}Account/AdminLogin`; 
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "*/*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userName: username, password: password }),
  });

  const responseData = await response.text(); 
  try {
    const data = JSON.parse(responseData);
    if (response.ok) {
      return data; 
    } else {
      throw new Error(data.LoginError || 'Login failed');
    }
  } catch (error) {
    throw new Error(error.message || 'Something went wrong');
  }
};

// Reset Password
export const resetPassword = async (resetData) => {
  await setApiUrl();
  const response = await fetch(`${API_URL}Account/ResetPassword`, {
    method: "POST",
    headers: await getCommonHeaders(),
    body: JSON.stringify(resetData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to reset password");
  }

  const data = await response.json();
  return data;
};

// Send Reset Email
export const sendResetEmail = async (email) => {
  await setApiUrl();
  const response = await fetch(`${API_URL}Account/SendResetEmail/${email}`, {
    method: "POST",
    headers: await getCommonHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to send reset email");
  }

  const data = await response.json();
  return data;
};

// Get Inventory Items
export const getInventoryItems = async () => {
  await setApiUrl();
  const response = await fetch(`${API_URL}Common/GetInventoryItems`, {
    method: "GET",
    headers: await getCommonHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch inventory items");
  }

  const data = await response.json();
  return data;
};

// Add Inventory Item
export const addInventoryItem = async (itemData) => {
  await setApiUrl();
  const response = await fetch(`${API_URL}Common/PostInventoryItem`, {
    method: "POST",
    headers: await getCommonHeaders(),
    body: JSON.stringify(itemData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to add inventory item");
  }

  const data = await response.json();
  return data;
};



// Add Customer
export const addCustomer = async (customerData) => {
  await setApiUrl();
  const response = await fetch(`${API_URL}Common/PostCustomer`, {
    method: "POST",
    headers: await getCommonHeaders(),
    body: JSON.stringify(customerData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to add customer");
  }

  const data = await response.json();
  return data;
};

// Get Suppliers
export const getSuppliers = async () => {
  await setApiUrl();
  const response = await fetch(`${API_URL}Common/GetSuppliers`, {
    method: "GET",
    headers: await getCommonHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch suppliers");
  }

  const data = await response.json();
  return data;
};

// Add Supplier
export const addSupplier = async (supplierData) => {
  await setApiUrl();
  const response = await fetch(`${API_URL}Common/PostSupplier`, {
    method: "POST",
    headers: await getCommonHeaders(),
    body: JSON.stringify(supplierData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to add supplier");
  }

  const data = await response.json();
  return data;
};

// Post Purchase Order
export const postPurchaseOrder = async (orderData) => {
  await setApiUrl();
  const response = await fetch(`${API_URL}Production/PostPurchaseOrder`, {
    method: "POST",
    headers: await getCommonHeaders(),
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to post purchase order");
  }

  const data = await response.json();
  return data;
};

// Get Purchase Orders
export const getPurchaseOrders = async (status) => {
  await setApiUrl();
  const commonHeaders = await getCommonHeaders();
  const headers = { ...commonHeaders, status };

  const response = await fetch(`${API_URL}Production/GetPurchaseOrders`, {
    method: "GET",
    headers: headers,
  });
  const text = await response.text();
  if (!response.ok) {
    const errorData = text
      ? JSON.parse(text)
      : { message: "Failed to fetch purchase orders" };
    throw new Error(errorData.message);
  }
  const data = text ? JSON.parse(text) : [];
  return data;
};

// Receive Purchase Order
export const receivePurchaseOrder = async (receiveOrderData) => {
  await setApiUrl();
  const response = await fetch(`${API_URL}Production/ReceivePurchaseOrder`, {
    method: "POST",
    headers: await getCommonHeaders(),
    body: JSON.stringify(receiveOrderData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to receive purchase order");
  }

  const data = await response.json();
  return data;
};

// Get Production
export const getProduction = async () => {
  await setApiUrl();
  const response = await fetch(`${API_URL}Production/GetProduction`, {
    method: "GET",
    headers: await getCommonHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch production");
  }

  const data = await response.json();
  return data;
};

// Post Production
export const postProduction = async (productionData) => {
  await setApiUrl();
  const response = await fetch(`${API_URL}Production/PostProduction`, {
    method: "POST",
    headers: await getCommonHeaders(),
    body: JSON.stringify(productionData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to post production");
  }

  const data = await response.json();
  return data;
};

// Get Deliveries
export const getDeliveries = async () => {
  await setApiUrl();
  const response = await fetch(`${API_URL}Sale/GetDeliveries`, {
    method: "GET",
    headers: await getCommonHeaders(),
  });

  const responseText = await response.text(); // Get the raw response text

  try {
    if (!response.ok) {
      const errorData = responseText ? JSON.parse(responseText) : { message: "Failed to fetch deliveries" };
      throw new Error(errorData.message);
    }

    const data = responseText ? JSON.parse(responseText) : [];
    return data;
  } catch (error) {
    console.error("Error parsing JSON:", error);
    console.error("Raw response text:", responseText); // Log the raw response text
    throw new Error("Failed to parse response as JSON");
  }
};
// Get Customers
export const getCustomers = async () => {
  await setApiUrl();
  const response = await fetch(`${API_URL}Common/GetCustomers`, {
    method: "GET",
    headers: await getCommonHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch customers");
  }

  const data = await response.json();
  return data;
};
export const getUser = async (userid) => {
  await setApiUrl();
  const response = await fetch(`${API_URL}Settings/GetUserProfile/${userid}`, {
    method: "GET",
    headers: await getCommonHeaders(),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch user profile");
  }

  const data = await response.json();
  return data;
};
// Get Deliveries
export const getUserDeliveries = async (userId) => {
  await setApiUrl();
  const headers = await getCommonHeaders();
  headers['Id'] = userId; // Add the custom Id header

  console.log("Request URL:", `${API_URL}Sale/GetDeliveriesPerUser`);
  console.log("Request Headers:", headers);

  const response = await fetch(`${API_URL}Sale/GetDeliveriesPerUser`, {
    method: "GET",
    headers: headers,
  });

  const responseText = await response.text();
  console.log("Raw response text:", responseText);

  try {
    if (!response.ok) {
      if (responseText.startsWith("<!DOCTYPE html>")) {
        throw new Error("Received HTML response instead of JSON. Check the API endpoint and authentication.");
      }
      const errorData = JSON.parse(responseText);
      throw new Error(errorData.message || "Failed to fetch deliveries");
    }

    const data = JSON.parse(responseText);
    console.log("Data:", data);
    return data;
  } catch (error) {
    console.error("Error parsing JSON:", error);
    throw new Error("Failed to parse response as JSON");
  }
};




// Post Delivery
export const postDelivery = async (deliveryData) => {
  await setApiUrl();
  const response = await fetch(`${API_URL}Sale/PostDelivery`, {
    method: "POST",
    headers: await getCommonHeaders(),
    body: JSON.stringify(deliveryData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to post delivery");
  }

  const data = await response.json();
  return data;
};

// Get Sales
export const getSales = async () => {
  await setApiUrl();
  const response = await fetch(`${API_URL}Sale/GetSales`, {
    method: "GET",
    headers: await getCommonHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch sales");
  }

  const data = await response.json();
  return data;
};

// Post Sale
export const postSale = async (saleData) => {
  await setApiUrl();
  const response = await fetch(`${API_URL}Sale/PostSale`, {
    method: "POST",
    headers: await getCommonHeaders(),
    body: JSON.stringify(saleData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to post sale");
  }

  const data = await response.json();
  return data;
};

// Add User
export const addUser = async (userData) => {
  await setApiUrl();
  const response = await fetch(`${API_URL}Settings/RegisterUser`, {
    method: "POST",
    headers: await getCommonHeaders(),
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to add user");
  }

  const data = await response.json();
  return data;
};

// Get Users
export const getUsers = async () => {
  await setApiUrl();
  const response = await fetch(`${API_URL}Settings/GetUsers`, {
    method: "GET",
    headers: await getCommonHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch users");
  }

  const data = await response.json();
  return data;
};



// Update User
export const updateUser = async (userId, userData) => {
  await setApiUrl();
  const response = await fetch(`${API_URL}Settings/UpdateUser/${userId}`, {
    method: "PUT",
    headers: await getCommonHeaders(),
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update user");
  }

  const data = await response.json();
  return data;
};

// Get Rights
export const getRights = async () => {
  await setApiUrl();
  const response = await fetch(`${API_URL}Settings/GetRights`, {
    method: "GET",
    headers: await getCommonHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch rights");
  }

  const data = await response.json();
  return data;
};

// Update User Rights
export const updateUserRights = async (userRightsData) => {
  await setApiUrl();
  const response = await fetch(`${API_URL}Settings/UpdateUserRights`, {
    method: "PUT",
    headers: await getCommonHeaders(),
    body: JSON.stringify(userRightsData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update user rights");
  }

  const data = await response.json();
  return data;
};

// Mpesa Payment
export const mpesaPayment = async (paymentData) => {
  await setApiUrl();
  const response = await fetch(`${API_URL}Mpesa/MpesaPayment`, {
    method: "POST",
    headers: await getCommonHeaders(),
    body: JSON.stringify(paymentData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to process Mpesa payment");
  }

  const data = await response.json();
  return data;
};

// Mpesa STK Push Callback
export const mpesaStkPushCallback = async (requestId, callbackData) => {
  await setApiUrl();
  const response = await fetch(`${API_URL}Mpesa/${requestId}/StkPushCallback`, {
    method: "POST",
    headers: await getCommonHeaders(),
    body: JSON.stringify(callbackData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || "Failed to process Mpesa STK push callback"
    );
  }

  const data = await response.json();
  return data;
};

export const updateUserLocation = async (userId, latitude, longitude) => {
  await setApiUrl();
  const url = `${API_URL}Settings/UpdateUserLocation/${userId}`;
  const commonHeaders = await getCommonHeaders();

  const headers = {
    ...commonHeaders,
    latitude: latitude.toString(),
    longitude: longitude.toString(),
  };

  // console.log("Sending request to:", url);
  // console.log("Headers:", headers);

  const response = await fetch(url, {
    method: "PUT",
    headers: headers,
  });

  const responseText = await response.text();
  // console.log("Response status:", response.status);
  // console.log("Response text:", responseText);

  if (!response.ok) {
    const errorData = responseText ? JSON.parse(responseText) : { message: "Failed to update user location" };
    throw new Error(errorData.message);
  }

  const data = responseText ? JSON.parse(responseText) : {};
  return data;
};