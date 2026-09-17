import axios from "axios";

const API_BASE_URL = "https://swiftly-ground-dingbat.ngrok-free.dev/api";


const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true", // bypasses the free-tier interstitial for API calls
  },
  withCredentials: true,
});

async function request(config) {
  try {
    const res = await apiClient.request(config);
    return res.data.data; // axios wraps the response in .data; our backend wraps ITS payload in .data too
  } catch (err) {
    // Our backend's ApiError shape arrives as err.response.data
    const message = err.response?.data?.message || err.message || "Request failed";
    throw new Error(message);
  }
}

export { apiClient, request };