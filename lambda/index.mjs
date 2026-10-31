import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const ses = new SESClient({ region: 'us-east-1' });

export const handler = async (event) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: '',
    };
  }

  try {
    // Parse form data
    const body = JSON.parse(event.body);
    const { first_name, last_name, email, message } = body;

    // Validate required fields
    if (!first_name || !last_name || !email || !message) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    // Compose email
    const emailParams = {
      Source: 'Gary Jiang Photography <noreply@gjphotos.com>', // Verified sender
      ReplyToAddresses: ['bowengary@hotmail.com'], // Replies go to personal email
      Destination: {
        ToAddresses: ['bowengary@hotmail.com'],
      },
      Message: {
        Subject: {
          Data: `New Contact Form Submission from ${first_name} ${last_name}`,
        },
        Body: {
          Text: {
            Data: `
Contact Form Submission
=======================

From: ${first_name} ${last_name}
Email: ${email}

Message:
${message}

---
Sent from gjphotos.com contact form
            `.trim(),
          },
          Html: {
            Data: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #5c4033; color: white; padding: 20px; text-align: center; }
    .content { background: #f4f4f4; padding: 20px; margin-top: 20px; }
    .field { margin-bottom: 15px; }
    .label { font-weight: bold; color: #5c4033; }
    .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>New Contact Form Submission</h2>
    </div>
    <div class="content">
      <div class="field">
        <span class="label">From:</span> ${first_name} ${last_name}
      </div>
      <div class="field">
        <span class="label">Email:</span> <a href="mailto:${email}">${email}</a>
      </div>
      <div class="field">
        <span class="label">Message:</span>
        <p>${message.replace(/\n/g, '<br>')}</p>
      </div>
    </div>
    <div class="footer">
      Sent from gjphotos.com contact form
    </div>
  </div>
</body>
</html>
            `.trim(),
          },
        },
      },
    };

    // Send email
    const command = new SendEmailCommand(emailParams);
    await ses.send(command);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        message: 'Email sent successfully',
      }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'Failed to send email',
        details: error.message,
      }),
    };
  }
};
