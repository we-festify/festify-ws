const bes = {
  type: "bes",
  name: "BES",
  fullName: "Basic Email Service",
  summary: "A basic email service that allows you to send emails.",
  description:
    "A basic email service that allows you to send emails. It is a simple service that can be used to send emails to a single recipient or multiple recipients. It is easy to use and can be integrated with any application that requires email functionality.",
  baseUrl: "http://localhost:5000/api/d/services/bes",
  methods: [
    {
      name: "sendEmail",
      description: "Send an email to a recipient.",
      path: "/send",
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
          name: "subject",
          type: "string",
          description: "Subject of the email.",
          required: true,
        },
        {
          name: "body",
          type: "string",
          description: "Body of the email.",
          required: true,
        },
      ],
      responses: [
        {
          status: 200,
          description: "Email sent successfully.",
        },
        {
          status: 400,
          description: "Bad request. Missing required parameters.",
        },
        {
          status: 401,
          description: "Unauthorized. Invalid API key.",
        },
        {
          status: 500,
          description: "Internal server error.",
        },
      ],
    },
  ],
};

module.exports = bes;
