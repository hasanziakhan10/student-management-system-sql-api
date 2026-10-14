require("dotenv").config();

const express = require("express");
const sequelize = require("./config/db");

require("./models");

const studentRoutes = require("./routes/studentRoutes");
const courseRoutes = require("./routes/courseRoutes");

const requestLogger = require("./middleware/requestLogger");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(express.json());
app.use(requestLogger);

// Home route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Student Management SQL API is running"
  });
});

// API routes
app.use("/api/students", studentRoutes);
app.use("/api/courses", courseRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

// Centralized error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully");

    await sequelize.sync();
    console.log("Database tables synchronized");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Startup failed:", error.message);
    process.exit(1);
  }
}

startServer();
