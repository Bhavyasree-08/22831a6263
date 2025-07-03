const axios = require("axios");

const AUTH_URL = "http://localhost:3001/getAccessToken"; // Mock token route
const LOG_API_URL = "http://localhost:3001/logs"; // Local logs endpoint

async function fetchAccessToken() {
  try {
    const response = await axios.post(AUTH_URL, {
      email: "bhavyasree2504@gmail.com",
      name: "bhavya sree",
      rollNo: "22831a6263",
      accessCode: "PbmVAT",
      clientID: "495bd560-b173-4df7-b859-9a22e1aeefe9",
      clientSecret: "EvusxYtYGwjcxJxN",
    });

    return response.data.access_token;
  } catch (err) {
    console.error("Error fetching token:", err.response?.data || err.message);
    return null;
  }
}

async function Log(stack, level, packageName, message) {
  try {
    const accessToken = await fetchAccessToken();
    if (!accessToken) throw new Error("No access token");

    const response = await axios.post(
      LOG_API_URL,
      {
        stack,
        level,
        package: packageName,
        message,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log("Log sent:", response.data.message);
  } catch (error) {
    console.error("Logging failed:", error.response?.data || error.message);
  }
}

module.exports = Log;
