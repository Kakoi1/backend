export const emailForm = (userName, userEmail, phone, subject, message) => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Template</title>
  </head>
  <body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #f4f4f4;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f4f4f4; padding: 20px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <tr>
              <td style="background-color: #4a90e2; padding: 20px; text-align: center;">
                <h1 style="margin: 0; color: #ffffff; font-size: 24px;">${subject}</h1>
              </td>
            </tr>
            <tr>
              <td style="padding: 20px;">
                <p style="margin: 0 0 16px; font-size: 16px; color: #333333;">
                  Hello,
                </p>
                <p style="margin: 0 0 16px; font-size: 16px; color: #333333;">
                  You have received a new message from ${userName || 'a customer'}:
                </p>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="padding: 8px 0; font-size: 16px; color: #333333;">
                      <strong>Name:</strong> ${userName || 'Not provided'}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-size: 16px; color: #333333;">
                      <strong>Email:</strong> <a href="mailto:${userEmail}" style="color: #4a90e2; text-decoration: none;">${userEmail}</a>
                    </td>
                  </tr>
                  ${phone ? `
                  <tr>
                    <td style="padding: 8px 0; font-size: 16px; color: #333333;">
                      <strong>Phone:</strong> ${phone}
                    </td>
                  </tr>
                  ` : ''}
                  <tr>
                    <td style="padding: 8px 0; font-size: 16px; color: #333333;">
                      <strong>Message:</strong>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-size: 16px; color: #333333; line-height: 1.5;">
                      ${message}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="background-color: #f4f4f4; padding: 16px; text-align: center; font-size: 14px; color: #666666;">
                <p style="margin: 0;">This email was sent from your website's contact form.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
`;
export default emailForm;