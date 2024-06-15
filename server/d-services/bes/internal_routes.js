const express = require("express");
const router = express.Router();
const cors = require("cors");

// controllers
const EmailTemplatesController = require("./controllers/email_templates");

// middlewares
const { requireAuth } = require("../../middlewares/auth");

// cors
router.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS.split(","), // ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  })
);

router.use(requireAuth);

router.get(
  "/:instanceId/templates",
  EmailTemplatesController.getTemplatesByInstanceId
);
router.post("/:instanceId/templates", EmailTemplatesController.createTemplate);
router.put(
  "/:instanceId/templates/:templateId",
  EmailTemplatesController.updateTemplate
);
router.delete(
  "/:instanceId/templates/:templateId",
  EmailTemplatesController.deleteTemplate
);

module.exports = router;
