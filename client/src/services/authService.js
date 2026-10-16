import { apiRequest } from "./api";

export async function registerUser(formData) {
  return apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify(formData),
  });
}

export async function loginUser(credentials) {
  const result = await apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });

  if (result.token) {
    localStorage.setItem("token", result.token);
  }

  if (result.user) {
    localStorage.setItem("user", JSON.stringify(result.user));
  }

  return result;
}

export async function getCurrentUser() {
  return apiRequest("/auth/me");
}

export function logoutUser() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}