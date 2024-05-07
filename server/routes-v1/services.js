const express = require("express");
const router = express.Router();

const ServiceController = require("../controllers/services");
const { requireAuth } = require("../middlewares/auth");

router.get("/mine", requireAuth, ServiceController.getMyServices);
router.get("/all", requireAuth, ServiceController.getAllAvailableServicesMeta);
router.get(
  "/:serviceType",
  requireAuth,
  ServiceController.getServiceMetaByType
);
router.post(
  "/:serviceType/enable",
  requireAuth,
  ServiceController.enableService
);

module.exports = router;
