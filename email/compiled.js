export const loginHTML = `<!DOCTYPE html>
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
`;
export const welcomeHTML = `<!DOCTYPE html>
<html lang="en">
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <head>
    <title>Welcome to Charmpay</title>
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
        font-size: 28px;
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
        <h1>Welcome to Charmpay!</h1>
      </div>
      <div class="content">
        <h2>Hello {{user.firstName}},</h2>
        <p><strong>Account Verification Successful</strong></p>
        <p>
          Welcome to <strong>Charmpay</strong>! We're excited to have you on
          board. Charmpay is designed to provide a secure and seamless escrow
          payment experience, ensuring trust in every transaction.
        </p>

        <h3>What You Can Do with Charmpay</h3>
        <p>
          ✅ <strong>Send and receive payments</strong> securely through our
          escrow system.
        </p>
        <p>
          ✅ <strong>Protect your transactions</strong> by ensuring funds are
          only released when conditions are met.
        </p>
        <p>
          ✅ <strong>Manage multiple transactions</strong> effortlessly from
          your dashboard.
        </p>
        <p>
          ✅ <strong>Connect with trusted buyers & sellers</strong> in a safe
          financial environment.
        </p>

        <h3>Getting Started is Easy</h3>
        <p>
          <strong>1️⃣ Set up your profile</strong> – Secure your account and add
          your payment details.
        </p>
        <p>
          <strong>2️⃣ Start a transaction</strong> – Create an escrow transaction
          for a service or product.
        </p>
        <p>
          <strong>3️⃣ Enjoy peace of mind</strong> – Funds are held securely
          until both parties are satisfied.
        </p>
        <p>
          💡 <strong>Tip:</strong> Invite your friends and business partners to
          use Charmpay for secure payments!
        </p>

        <h3>Our Commitment to You</h3>
        <p>
          At Charmpay, we prioritize
          <strong>security, transparency, and reliability</strong> to create a
          trustworthy payment platform for individuals and businesses. Our
          support team is available whenever you need assistance.
        </p>
        <p>
          📩 <strong>Need Help?</strong> Contact us at
          <a href="mailto:charmpayinc@gmail.com">charmpayinc@gmail.com</a>.
        </p>
        <p>
          <strong>Best Regards,</strong><br />
          The Charmpay Team
        </p>
      </div>
      <div class="footer">
        © 2025 Charmpay Inc. | Secure Transactions, Trusted Payments.
      </div>
    </div>
  </body>
</html>
`;
export const otpHTML = `<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>OTP Verification</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f9f9f9;
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
        font-size: 22px;
      }
      .content {
        padding: 20px;
      }
      .content p {
        font-size: 16px;
        color: #333;
        line-height: 1.5;
      }
      .otp-box {
        text-align: center;
        background-color: #f4f4f9;
        border: 1px dashed #1e3a8a;
        margin: 20px 0;
        padding: 15px;
        border-radius: 8px;
        font-size: 24px;
        color: #1e3a8a;
        font-weight: bold;
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
        <h1>Charmpay | OTP Code</h1>
      </div>
      <div class="content">
        <h2>Hello {{user.firstName}},</h2>
        <br />
        <p>
          You recently requested to verify your account. Use the code below to
          complete the verification process.
        </p>
        <div class="otp-box">{{otp.code}}</div>
        <p>
          This OTP is valid for the next <strong>10 minutes</strong>. If you
          didn't request this code, you can safely ignore this email.
          <br />
          <strong>Don't share your this code with anyone.</strong>
        </p>
        <p>Thank you,</p>
      </div>
      <div class="footer">© 2025 Charmpay Inc.</div>
    </div>
  </body>
</html>
`;
export const newTask = `<!DOCTYPE html>
<html lang="en">
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <head>
    <title>New Task Assigned - Charmpay</title>
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
        background-color: #4c56af;
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
        <h1>📌 New Task Assigned</h1>
      </div>
      <div class="content">
        <h2>Hello {{user.firstName}},</h2>
        <p>
          A new task has been assigned to you on <strong>Charmpay</strong>.
          Please review the details below:
        </p>

        <ul>
          <li><strong>Task Title:</strong> {{task.title}}</li>
          <li><strong>Description:</strong> {{task.description}}</li>
          <li><strong>Assigned By:</strong> {{assigner.firstName}}</li>
          <li><strong>Status:</strong> {{task.status}}</li>
          <li><strong>Amount Paid:</strong> {{transaction.amount}}</li>
          <li><strong>This task was created at</strong> {{timestamp}}</li>
        </ul>

        <p>Check out your <strong>Charmpay App</strong> for more details.</p>
        <p>
          Please make sure to complete the task on time. If you have any
          questions, feel free to reach out to {{assignerName}} or contact
          support.
        </p>

        <a href="{{taskLink}}" class="button">View Task</a>

        <p>
          Need assistance? Contact our support team at
          <a href="mailto:charmpayinc@gmail.com">charmpayinc@gmail.com</a>.
        </p>

        <p>
          <strong>Best Regards,</strong><br />
          The Charmpay Team
        </p>
      </div>
      <div class="footer">
        © 2025 Charmpay Inc. | Secure Payments, Trusted Transactions.
      </div>
    </div>
  </body>
</html>
`;
