const express = require("express");
const router = express.Router();

const besInternalRoutes = require("./bes/internal_routes");
const tsInternalRoutes = require("./ts/internal_routes");

const besExternalRoutes = require("./bes/external_routes");
const tsExternalRoutes = require("./ts/external_routes");

router.use("/in/bes", besInternalRoutes);
router.use("/in/ts", tsInternalRoutes);

router.use("/bes", besExternalRoutes);
router.use("/ts", tsExternalRoutes);

module.exports = router;
