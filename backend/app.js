require('dotenv').config()
const app = require('express')();
const express = require('express')
const path = require("path")
require('dotenv').config()
const fs = require("fs")
app.use(express.static("public"));
app.use("/", express.static("public"));
const cors = require("cors")
const bodyParser = require("body-parser")
app.use(bodyParser.json({ limit: "1mb" }))
const { body, validationResult } = require('express-validator')

//setting express to use  the session
const allowedOrigins = (process.env.FRONTEND_ORIGINS || "http://localhost:3000,http://localhost:5173,https://zentrixx.cloud,https://www.zentrixx.cloud,https://zentrixx-admin.onrender.com")


  .split(",").map(origin => origin.trim()).filter(Boolean);
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Origin is not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "header", "Authorization"],
  maxAge: 86400
}));



const userRoutes = require("./routes/user")
const adminRoutes = require("./routes/admin")
//using the routes
app.use(adminRoutes.router)
app.use(userRoutes.router)

//error handler //express error middleware
app.use((err, req, res, next) => {
  console.error("Request error:", err.message);
  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json({
    response: statusCode >= 500 ? "An unexpected server error occurred." : err.message
  });
})

app.listen(process.env.PORT || 8080, (err) => {
  console.log("sucessfully running on port 8080")
})