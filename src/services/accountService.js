const API_URL = "https://smartbank-backend-a26c.onrender.com/api/accounts";

export const getMyAccounts = async () => {
  const token = sessionStorage.getItem("token");

  if (!token) {
    throw new Error("Session expired. Please login again.");
  }

  const response = await fetch(`${API_URL}/my`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || data.error || "Unable to fetch your accounts.",
    );
  }

  return data;
};

export const createAccount = async (accountType) => {
  const token = sessionStorage.getItem("token");

  if (!token) {
    throw new Error("Session expired. Please login again.");
  }

  const response = await fetch(`${API_URL}/create`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      accountType: accountType,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || data.error || "Unable to create account.");
  }

  return data;
};
