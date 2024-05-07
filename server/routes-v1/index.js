const express = require("express");
const router = express.Router();

const AuthRoutes = require("./auth");
const ServicesRoutes = require("./services");
const InstancesRoutes = require("./instances");

router.use("/auth", AuthRoutes);
router.use("/services", ServicesRoutes);
router.use("/instances", InstancesRoutes);

module.exports = router;
