const API_URL = "https://smartbank-backend-a26c.onrender.com/api/auth";

export const loginUser = async (email, password) => {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        data.error ||
        "Login failed. Please check your credentials.",
    );
  }

  // Keep the JWT for this browser tab's session.
  sessionStorage.setItem("token", data.token);
  sessionStorage.setItem(
    "user",
    JSON.stringify({
      userId: data.userId,
      fullName: data.fullName,
      email: data.email,
      role: data.role,
    }),
  );

  return data;
};
