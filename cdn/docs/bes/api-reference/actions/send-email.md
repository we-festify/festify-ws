# SendEmail

Sends an email to a specified recipient, using a verified instance of Festify BES.

## Request Syntax

```json
POST /v1/d/bes/execute/SendEmail HTTP/1.1
Content-Type: application/json

{
    "resource": "frn:bes::instance:instance-id",
    "data": {
        "toAddresses": [ "email" ],
        "ccAddresses": [ "email" ],
        "bccAddresses": [ "email" ],
        "subject": "string",
        "html": "string",
        "text": "string"
    }
}

```

## URI Parameters

The request does not use any URI parameters.

## Request Body

The request accepts the following data in JSON format.

| Name     | Type   | Required | Description                                                                         |
| -------- | ------ | -------- | ----------------------------------------------------------------------------------- |
| resource | string | Yes      | The resource ID of the Festify BES instance that you want to use to send the email. |
| data     | object | Yes      | The data for the email message.                                                     |

The `data` object contains the following fields:

| Name         | Type   | Required | Description                                             |
| ------------ | ------ | -------- | ------------------------------------------------------- |
| toAddresses  | array  | Yes      | The email addresses of the recipients of the email.     |
| ccAddresses  | array  | No       | The email addresses of the CC recipients of the email.  |
| bccAddresses | array  | No       | The email addresses of the BCC recipients of the email. |
| subject      | string | Yes      | The subject of the email.                               |
| html         | string | No       | The HTML body of the email.                             |
| text         | string | No       | The text body of the email.                             |

## Response Syntax

```json
HTTP/1.1 200 OK
Content-Type: application/json

{
    "messageId": "string"
}
```

## Response Elements

If the action is successful, the service sends back an HTTP 200 response.

The response data contains the following fields:

| Name      | Type   | Description                            |
| --------- | ------ | -------------------------------------- |
| messageId | string | The unique identifier for the message. |

## Errors

For information about the errors that are common to all actions, see [Common Errors](/docs/bes/api-reference/errors.md).

The following table describes the errors that this action can return.

| HTTP Status Code | Error Code | Description                      |
| ---------------- | ---------- | -------------------------------- |
| 400              | BadRequest | The input provided is not valid. |
| 200              | OK         | The request was successful.      |

## Using SDKs

You can use the Festify BES SDK to send emails programmatically. The SDK provides APIs that you can use to send emails using Festify BES.

For more information about the Festify BES SDK, see the [Festify BES SDK documentation](/docs/sdk).
