
const API_BASE_URL = "http://localhost:5000/api";

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  // FormData ke liye Content-Type manually set nahi karna hai.
  // Browser multipart/form-data ka boundary khud set karega.
  if (options.body instanceof FormData) {
    delete headers["Content-Type"];
    delete headers["content-type"];
  } else if (options.body && !headers["Content-Type"] && !headers["content-type"]) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const result = await response.json().catch(() => ({
    success: false,
    message: "Invalid response from server",
  }));

  if (!response.ok || result.success === false) {
    throw new Error(result.message || "Something went wrong");
  }

  return result;
}
