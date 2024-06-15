const express = require("express");
const router = express.Router();
const cors = require("cors");

// controllers
const EmailController = require("./controllers/email");

// middlewares
const { requireAuthByAPIKey } = require("../../middlewares/auth");
const { trackApiRequest } = require("../../middlewares/analytics");

// dynamic cors origin
router.use(cors());

router.use(requireAuthByAPIKey);
router.use(trackApiRequest);

router.post("/send-one", EmailController.externalSendToOne);

module.exports = router;
