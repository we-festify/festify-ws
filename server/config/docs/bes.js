const bes = (config) => ({
  type: "bes",
  name: "BES",
  fullName: "Basic Email Service",
  summary: "A basic email service that allows you to send emails.",
  description:
    "Basic email service allows you to send emails. It is a simple service that can be used to send emails to a single recipient or multiple recipients. It is easy to use and can be integrated with any application that requires email functionality.",
  baseUrl: config.BASE_URL,
  methods: [
    {
      name: "Send One",
      description:
        "Send an email to a recipient using a template with variables.",
      path: "/send-one",
      method: "POST",
      headers: [
        {
          name: "Authorization",
          format: "Bearer <API_KEY>",
          description: "API key for authentication.",
          required: true,
        },
      ],
      params: [
        {
          name: "to",
          type: "string",
          description: "Email address of the recipient.",
          required: true,
        },
        {
          name: "templateId",
          type: "string",
          description: "Template ID for the email.",
          required: true,
          ref: "_id",
        },
        {
          name: "data",
          type: "object",
          description:
            "Data (with variables) to be used in the email template.",
          required: true,
          ref: "variables",
        },
      ],
      responses: [
        {
          status: 200,
          description: "Email sent successfully.",
        },
        {
          status: 400,
          description:
            "Bad request. Missing required parameters or invalid email address.",
        },
        {
          status: 401,
          description: "Unauthorized. Invalid API key or origin not allowed.",
        },
        {
          status: 404,
          description: "Not found. Invalid template ID.",
        },
        {
          status: 500,
          description: "Internal server error.",
        },
      ],
    },
    {
      name: "Send Many",
      description:
        "Send an email to multiple recipients using a template with variables. The same email will be sent to every recipient and every recipient can see all other recipients. If any of the email addresses are invalid, the email will not be sent to that recipient. ",
      path: "/send-many",
      method: "POST",
      headers: [
        {
          name: "Authorization",
          format: "Bearer <API_KEY>",
          description: "API key for authentication.",
          required: true,
        },
      ],
      params: [
        {
          name: "to",
          type: "array",
          description: "Array of email addresses of the recipients.",
          required: true,
        },
        {
          name: "templateId",
          type: "string",
          description: "Template ID for the email.",
          required: true,
          ref: "_id",
        },
        {
          name: "data",
          type: "object",
          description:
            "Data (with variables) to be used in the email template.",
          required: true,
          ref: "variables",
        },
      ],
      responses: [
        {
          status: 200,
          description: "Email sent successfully.",
        },
        {
          status: 400,
          description:
            "Bad request. Missing required parameters or invalid email address(es).",
        },
        {
          status: 401,
          description: "Unauthorized. Invalid API key or origin not allowed.",
        },
        {
          status: 404,
          description: "Not found. Invalid template ID.",
        },
        {
          status: 500,
          description: "Internal server error.",
        },
      ],
    },
  ],
});

module.exports = bes;
