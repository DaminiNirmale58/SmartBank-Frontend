const API_URL = "https://smartbank-backend-a26c.onrender.com/api/beneficiaries";

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

// Handle API response
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

// 1. Add beneficiary
export const addBeneficiary = async (accountNumber, nickname) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ accountNumber, nickname }),
  });

  return readResponse(response);
};

// 2. Get all beneficiaries
export const getBeneficiaries = async () => {
  const response = await fetch(API_URL, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  return readResponse(response);
};

// 3. Get beneficiary by ID
export const getBeneficiaryById = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  return readResponse(response);
};

// 4. Update beneficiary nickname
export const updateBeneficiary = async (id, nickname) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ nickname }),
  });

  return readResponse(response);
};

// 5. Delete beneficiary
export const deleteBeneficiary = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  return readResponse(response);
};
