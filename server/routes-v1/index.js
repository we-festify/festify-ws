const express = require("express");
const router = express.Router();
const cors = require("cors");

const AuthRoutes = require("./auth");
const ServicesRoutes = require("./services");
const InstancesRoutes = require("./instances");

// cors
router.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS.split(","), // ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  })
);

router.use("/auth", AuthRoutes);
router.use("/services", ServicesRoutes);
router.use("/instances", InstancesRoutes);

module.exports = router;
