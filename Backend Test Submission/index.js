const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const Log = require("../Logging Middleware/logging");

const app = express();
const port = 3001;
const SECRET = "mock_secret"; // used for signing/verifying JWT

// ✅ Middleware
app.use(cors()); // allow frontend requests
app.use(express.json()); // parse incoming JSON body

// ✅ Log receiving endpoint (protected)
app.post("/logs", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET);
    console.log("LOG RECEIVED ✅:", req.body);
    res.status(200).json({ message: "Log received successfully" });
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
});

// ✅ Token generation (mocked)
app.post("/getAccessToken", (req, res) => {
  const { email, name, rollNo, accessCode, clientID, clientSecret } = req.body;

  if (
    accessCode === "PbmVAT" &&
    clientID === "495bd560-b173-4df7-b859-9a22e1aeefe9" &&
    clientSecret === "EvusxYtYGwjcxJxN"
  ) {
    const token = jwt.sign({ email, name, rollNo, clientID }, SECRET, {
      expiresIn: "1h",
    });

    return res.status(200).json({
      token_type: "Bearer",
      access_token: token,
      expires_in: 3600,
    });
  } else {
    return res.status(401).json({ message: "Invalid credentials" });
  }
});

// ✅ Shorten URL endpoint
app.post("/shorturls", async (req, res) => {
  const { longUrl } = req.body;
  console.log("Received body:", req.body);

  if (!longUrl || typeof longUrl !== "string") {
    await Log("backend", "error", "shorturls", "Missing or invalid 'longUrl'");
    return res.status(400).json({ error: "Missing or invalid 'longUrl'" });
  }

  await Log("backend", "info", "shorturls", "Successfully shortened URL");

  return res.status(201).json({
    shortLink: "http://localhost:3001/abcd1",
    expiry: "2025-01-01T00:30:00Z",
  });
});

// ✅ Test endpoints
app.post("/register", async (req, res) => {
  await Log("backend", "info", "register", "New user registration started");
  res.status(200).json({ message: "User registered!" });
});

app.post("/login", async (req, res) => {
  await Log("backend", "info", "login", "User login attempt");
  res.status(200).json({ message: "Login successful!" });
});

// ✅ Start Server
app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});
