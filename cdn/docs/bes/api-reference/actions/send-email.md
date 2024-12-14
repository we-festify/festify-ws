# SendEmail

Sends an email to a specified recipient, using a verified instance of Festify BES.

## Request Syntax

```json
POST /v1/d/bes/execute/SendEmail HTTP/1.1
Content-Type: application/json

{
    "resource": "frn:bes::instance:instance-id",
    "data": {
        "destination": {
            "to": ["string"],
            "cc": ["string"],
            "bcc": ["string"]
        },
        "subject": "string",
        "content": {
            "html": "string",
            "text": "string"
        }
    }
}

```

## URI Parameters

The request does not use any URI parameters.

## Request Body

The request accepts the following data in JSON format.

**resource** - The FRN of the Festify BES instance that you want to use to send the email.

- type: string
- required: Yes

**data** - The data for the email message.

- type: object
- required: Yes

The `data` object contains the following fields:

**destination** - The destination of the email.

- type: object
- required: Yes

The `destination` object contains the following fields:

**to** - The email addresses of the recipients.

- type: array
- required: Yes

**cc** - The email addresses of the CC recipients.

- type: array
- required: No

**bcc** - The email addresses of the BCC recipients.

- type: array
- required: No

**subject** - The subject of the email.

- type: string
- required: Yes

**content** - The content of the email.

- type: object
- required: Yes

The `content` object contains the following fields:

**html** - The HTML content of the email.

- type: string
- required: No

**text** - The text content of the email.

- type: string
- required: No

## Response Syntax

```json
HTTP/1.1 200 OK
Content-Type: application/json

{
    "jobId": "string"
}
```

## Response Elements

If the action is successful, the service sends back an HTTP 200 response.

The response data contains the following fields:

**jobId** - The ID of the job that was created to send the email.

- type: string

## Errors

For information about the errors that are common to all actions, see [Common Errors](/docs/bes/api-reference/errors).

The following table describes the errors that this action can return.

**400 Bad Request** - The input provided is not valid.

**200 OK** - The request was successful.

## Using SDKs

You can use the Festify BES SDK to send emails programmatically. The SDK provides APIs that you can use to send emails using Festify BES.

For more information about the Festify BES SDK, see the [Festify BES SDK documentation](/docs/sdk).
