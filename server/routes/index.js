const express = require("express");
const router = express.Router();

const AuthRoutes = require("./auth");

router.use("/auth", AuthRoutes);

module.exports = router;
