const express = require("express");
const router = express.Router();
const cors = require("cors");

const { requireAuthByAPIKey } = require("../../middlewares/auth");

// dynamic cors origin
router.use(
  cors({
    origin: "*", // allow all origins - will be checked in requireAuthByAPIKey
  })
);

router.use(requireAuthByAPIKey);

router.get("/", (req, res) => {
  res.json({
    message: "Welcome to the TS External",
  });
});

module.exports = router;
