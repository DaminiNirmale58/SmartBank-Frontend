const API_URL = "https://smartbank-backend-a26c.onrender.com/api/users";

export const getMyProfile = async () => {
  const token = sessionStorage.getItem("token");

  if (!token) {
    throw new Error("Session expired. Please sign in again.");
  }

  const response = await fetch(`${API_URL}/profile`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(data?.message || data?.error || "Unable to fetch profile.");
  }

  return data;
};
