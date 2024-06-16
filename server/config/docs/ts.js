require("dotenv").config();

const ts = (config) => ({
  type: "ts",
  name: "TS",
  fullName: "Telegram Service",
  summary: "A service that allows you to send messages to Telegram.",
  description:
    "Service that allows you to send messages to Telegram. It is a simple service that can be used to send messages to a single recipient or multiple recipients. It is easy to use and can be integrated with any application that requires Telegram messaging functionality.",
  baseUrl: config.BASE_URL,
});

module.exports = ts;
