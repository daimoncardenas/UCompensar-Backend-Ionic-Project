/** @format */

// api/index.js
const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

const SECRET = "dev-secret-just-for-class"; // .env en real

// Login dummy: email+password -> JWT 1h
app.post("/auth/login", (req, res) => {
  const { email, password } = req.body || {};
  if (email === "demo@demo.com" && password === "1234567") {
    const token = jwt.sign({ sub: "123", email }, SECRET, { expiresIn: "1h" });
    return res.json({ token });
  }
  return res.status(401).json({ message: "Invalid credentials" });
});

// Middleware de verificación
function auth(req, res, next) {
  const h = req.headers.authorization || "";
  const token = h.startsWith("Bearer ") ? h.slice(7) : null;
  if (!token) return res.status(401).json({ message: "Need Authorization header" });
  try {
    req.user = jwt.verify(token, SECRET);
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

// Endpoint protegido (tu “galería” mock)
app.get("/photos", auth, (req, res) => {
  res.json([{ id: 1, name: "First photo" }]);
});

app.listen(3001, () => console.log("API on http://localhost:3001"));
