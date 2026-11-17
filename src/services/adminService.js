const API_URL = "https://smartbank-backend-a26c.onrender.com/api/admin";

// JWT authentication headers
const getAuthHeaders = () => {
  const token = sessionStorage.getItem("token");

  if (!token) {
    throw new Error("Session expired. Please sign in again.");
  }

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

// Common API response handler
const readResponse = async (response) => {
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(
      data?.message || data?.error || `Request failed (${response.status})`,
    );
  }

  return data;
};

// 1. Get all customers
export const getAllCustomers = async () => {
  const response = await fetch(`${API_URL}/customers`, {
    headers: getAuthHeaders(),
  });

  return readResponse(response);
};

// 2. Get customer by ID
export const getCustomerById = async (userId) => {
  const response = await fetch(`${API_URL}/customers/${userId}`, {
    headers: getAuthHeaders(),
  });

  return readResponse(response);
};

// 3. Get all bank accounts
export const getAllAccounts = async () => {
  const response = await fetch(`${API_URL}/accounts`, {
    headers: getAuthHeaders(),
  });

  return readResponse(response);
};

// 4. Get pending accounts
export const getPendingAccounts = async () => {
  const response = await fetch(`${API_URL}/accounts/pending`, {
    headers: getAuthHeaders(),
  });

  return readResponse(response);
};

// 5. Approve account
export const approveAccount = async (accountId) => {
  const response = await fetch(`${API_URL}/accounts/${accountId}/approve`, {
    method: "PUT",
    headers: getAuthHeaders(),
  });

  return readResponse(response);
};

// 6. Deactivate account
export const deactivateAccount = async (accountId) => {
  const response = await fetch(`${API_URL}/accounts/${accountId}/deactivate`, {
    method: "PUT",
    headers: getAuthHeaders(),
  });

  return readResponse(response);
};

// 7. Reactivate account
export const reactivateAccount = async (accountId) => {
  const response = await fetch(`${API_URL}/accounts/${accountId}/reactivate`, {
    method: "PUT",
    headers: getAuthHeaders(),
  });

  return readResponse(response);
};

// 8. Get all transactions
export const getAllTransactions = async (page = 0, size = 10) => {
  const params = new URLSearchParams({ page, size });

  const response = await fetch(`${API_URL}/transactions?${params}`, {
    headers: getAuthHeaders(),
  });

  return readResponse(response);
};

// 9. Filter all transactions
export const filterAllTransactions = async (filters = {}) => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      params.append(key, value);
    }
  });

  const response = await fetch(`${API_URL}/transactions/filter?${params}`, {
    headers: getAuthHeaders(),
  });

  return readResponse(response);
};
