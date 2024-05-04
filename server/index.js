const express = require("express");
const cors = require("cors");
require("dotenv").config();
const cookies = require("cookie-parser");

const app = express();

// Cookies
app.use(cookies());

// Cors
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS.split(","), // ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  })
);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  res.json({ message: "Welcome to the application" });
});

// Database
require("./config/db");

// Routes
const routes = require("./routes");
app.use("/api", routes);

// errors
const { handleErrors } = require("./utils/errors");
app.use(handleErrors);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
