const express = require("express");
const router = express.Router();
const cors = require("cors");

// cors
router.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS.split(","), // ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  })
);

router.get("/", async (req, res) => {
  res.json({ message: "Welcome to the TS Internal" });
});

module.exports = router;
