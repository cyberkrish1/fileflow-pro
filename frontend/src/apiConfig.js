// This is your new, centralized API configuration file.

// 1. PASTE YOUR LIVE RENDER URL HERE
// (Keep the "https://" and remove any trailing slash)
const liveUrl = "https://fileflow-pro-backend.onrender.com"; // <-- PASTE YOUR URL HERE

// 2. This checks if you are in development (localhost) or in production
const isDevelopment = window.location.hostname === "localhost";

// 3. This exports the correct URL for your environment
export const API_URL = isDevelopment ? "http://localhost:5000" : liveUrl;