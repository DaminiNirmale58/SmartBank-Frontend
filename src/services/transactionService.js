const API_URL = "https://smartbank-backend-a26c.onrender.com/api";

// Get JWT token and authorization headers
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

// Common response handler
const readResponse = async (response) => {
  const text = await response.text();

  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!response.ok) {
    throw new Error(
      data?.message || data?.error || `Request failed (${response.status})`,
    );
  }

  return data;
};

// Get logged-in user's accounts
export const getMyAccounts = async () => {
  const response = await fetch(`${API_URL}/accounts/my`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  return readResponse(response);
};

// Deposit money
export const depositMoney = async (accountId, amount) => {
  const response = await fetch(`${API_URL}/transactions/${accountId}/deposit`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ amount: Number(amount) }),
  });

  return readResponse(response);
};

// Withdraw money
export const withdrawMoney = async (accountId, amount) => {
  const response = await fetch(
    `${API_URL}/transactions/${accountId}/withdraw`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ amount: Number(amount) }),
    },
  );

  return readResponse(response);
};

// Get complete transaction history
export const getTransactionHistory = async (accountId) => {
  const response = await fetch(`${API_URL}/transactions/${accountId}/history`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  return readResponse(response);
};

// Get mini statement (latest 5 transactions)
export const getMiniStatement = async (accountId) => {
  const response = await fetch(
    `${API_URL}/transactions/${accountId}/mini-statement`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    },
  );

  return readResponse(response);
};

// Filter transactions with pagination
export const filterTransactions = async (accountId, filters = {}) => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      params.append(key, value);
    }
  });

  const response = await fetch(
    `${API_URL}/transactions/${accountId}/filter?${params.toString()}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    },
  );

  return readResponse(response);
};

export const transferMoney = async (
  senderAccountId,
  receiverAccountId,
  amount,
) => {
  const response = await fetch(
    `${API_URL}/transactions/${senderAccountId}/transfer`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        receiverAccountId: Number(receiverAccountId),
        amount: Number(amount),
      }),
    },
  );

  return readResponse(response);
};
