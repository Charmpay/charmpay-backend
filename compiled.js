let loginHTML = `<!DOCTYPE html>
<html lang="en">
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <head>
    <title>Login Alert - Charmpay</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f4f4f4;
      }
      .email-container {
        max-width: 600px;
        margin: 20px auto;
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        overflow: hidden;
      }
      .header {
        background-color: #1e3a8a;
        color: white;
        text-align: center;
        padding: 30px 20px;
      }
      .header h1 {
        margin: 0;
        font-size: 24px;
      }
      .content {
        padding: 20px;
      }
      .content h2,
      h3 {
        color: #333;
        margin-bottom: 10px;
      }
      .content p {
        font-size: 16px;
        color: #555;
        line-height: 1.6;
      }
      .button {
        display: inline-block;
        padding: 12px 20px;
        background-color: #1e3a8a;
        color: white;
        text-decoration: none;
        font-weight: bold;
        border-radius: 5px;
        margin-top: 20px;
      }
      .footer {
        background-color: #f9f9f9;
        color: #888;
        text-align: center;
        padding: 10px;
        font-size: 12px;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="header">
        <h1>Login Detected</h1>
      </div>
      <div class="content">
        <h2>Hello {{user.firstName}},</h2>
        <p>We noticed a new login to your <strong>Charmpay</strong> account:</p>

        <ul>
          <li>
            <strong>Location:</strong> {{city}}, {{regionName}}, {{country}}
          </li>
          <li><strong>IP Address:</strong> {{query}}</li>
          <li><strong>Date & Time:</strong> {{timestamp}}</li>
        </ul>

        <p>
          If this was <strong>you</strong>, no action is required. If this
          <strong>wasn’t you</strong>, please secure your account immediately.
        </p>

        <a href="{{secureAccountLink}}" class="button">Secure My Account</a>

        <p>
          If you have any questions, contact us at
          <a href="mailto:support@charmpay.com">support@charmpay.com</a>.
        </p>

        <p><strong>Best Regards,</strong><br />The Charmpay Team</p>
      </div>
      <div class="footer">
        © 2025 Charmpay Inc. | Secure Transactions, Trusted Payments.
      </div>
    </div>
  </body>
</html>
`