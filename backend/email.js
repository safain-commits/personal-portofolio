const nodemailer = require('nodemailer');

const parseBoolean = (value, fallback = false) => {
  if (value === undefined || value === null || value === '') return fallback;
  return ['1', 'true', 'yes', 'on'].includes(String(value).toLowerCase());
};

const getMailConfig = () => {
  const host = process.env.SMTP_HOST || '';
  const port = Number(process.env.SMTP_PORT || 587);
  const secure = parseBoolean(process.env.SMTP_SECURE, port === 465);
  const user = process.env.SMTP_USER || '';
  const pass = process.env.SMTP_PASS || '';
  const to = process.env.MAIL_TO || process.env.ADMIN_EMAIL || user;
  const from = process.env.MAIL_FROM || process.env.SMTP_FROM || process.env.SMTP_FROM_EMAIL || user;

  return {
    host,
    port,
    secure,
    user,
    pass,
    to,
    from,
  };
};

const hasMailConfig = () => {
  const { host, port, user, pass, to, from } = getMailConfig();
  return Boolean(host && port && user && pass && to && from);
};

const createTransporter = () => {
  const config = getMailConfig();

  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });
};

const escapeHtml = (value = '') => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

const formatPlainTextMessage = (value = '') => String(value).replace(/\r\n/g, '\n');

const formatSubmittedAt = (value) => new Intl.DateTimeFormat('en-GB', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: 'Asia/Jakarta',
}).format(value);

async function sendContactNotification({ contactId, name, email, message }) {
  if (!hasMailConfig()) {
    return {
      configured: false,
      sent: false,
    };
  }

  const config = getMailConfig();
  const transporter = createTransporter();
  const submittedAt = new Date();
  const submittedAtLabel = formatSubmittedAt(submittedAt);
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br>');
  const plainMessage = formatPlainTextMessage(message);
  const replyMailto = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(`Re: your message to LinearSAF`)}`;
  const subject = `New inquiry from ${name} via LinearSAF`;

  const info = await transporter.sendMail({
    from: config.from,
    to: config.to,
    replyTo: email,
    subject,
    text: [
      'LINEARSAF CONTACT INQUIRY',
      '',
      `Subject: ${subject}`,
      `Contact ID: ${contactId}`,
      `Submitted: ${submittedAtLabel}`,
      `Name: ${name}`,
      `Email: ${email}`,
      '',
      'Message:',
      plainMessage,
      '',
      `Reply: ${email}`,
    ].join('\n'),
    html: `
      <!DOCTYPE html>
      <html lang="en">
        <body style="margin:0;padding:0;background-color:#f4f4f4;color:#0a0a0a;font-family:Inter,Arial,sans-serif;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#f4f4f4;">
            <tr>
              <td align="center" style="padding:32px 16px;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:720px;background-color:#ffffff;border:1px solid #e5e5e5;">
                  <tr>
                    <td style="padding:28px 32px 22px;border-bottom:1px solid #e5e5e5;">
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                        <tr>
                          <td style="font-size:12px;letter-spacing:0.28em;text-transform:uppercase;color:#737373;font-weight:700;">
                            LinearSAF
                          </td>
                          <td align="right" style="font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#737373;">
                            Contact Intake
                          </td>
                        </tr>
                      </table>
                      <div style="height:18px;line-height:18px;">&nbsp;</div>
                      <h1 style="margin:0;font-size:32px;line-height:1.05;font-weight:800;letter-spacing:-0.04em;color:#0a0a0a;">
                        New inquiry received
                      </h1>
                      <p style="margin:16px 0 0;font-size:16px;line-height:1.7;color:#525252;max-width:560px;">
                        A new message has been submitted through the portfolio contact page. The layout below mirrors the clean, technical tone of the LinearSAF app so the notification feels like part of the same system.
                      </p>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding:0 32px;">
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-bottom:1px solid #e5e5e5;">
                        <tr>
                          <td width="50%" style="padding:22px 0;border-right:1px solid #e5e5e5;vertical-align:top;">
                            <div style="font-size:11px;letter-spacing:0.24em;text-transform:uppercase;color:#737373;font-weight:700;margin-bottom:10px;">
                              Sender
                            </div>
                            <div style="font-size:24px;line-height:1.2;font-weight:700;letter-spacing:-0.03em;color:#0a0a0a;">
                              ${safeName}
                            </div>
                            <div style="margin-top:8px;font-size:15px;line-height:1.6;color:#404040;">
                              <a href="mailto:${safeEmail}" style="color:#0a0a0a;text-decoration:none;border-bottom:1px solid #d4d4d4;">${safeEmail}</a>
                            </div>
                          </td>
                          <td width="50%" style="padding:22px 0 22px 24px;vertical-align:top;">
                            <div style="font-size:11px;letter-spacing:0.24em;text-transform:uppercase;color:#737373;font-weight:700;margin-bottom:10px;">
                              Submission
                            </div>
                            <div style="font-size:15px;line-height:1.8;color:#404040;">
                              <strong style="color:#0a0a0a;">ID:</strong> #${contactId}<br>
                              <strong style="color:#0a0a0a;">Time:</strong> ${escapeHtml(submittedAtLabel)}<br>
                              <strong style="color:#0a0a0a;">Source:</strong> linearsaf.com/contact
                            </div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding:28px 32px 8px;">
                      <div style="font-size:11px;letter-spacing:0.24em;text-transform:uppercase;color:#737373;font-weight:700;margin-bottom:14px;">
                        Message
                      </div>
                      <div style="border:1px solid #e5e5e5;background-color:#fafafa;padding:22px 24px;font-size:16px;line-height:1.8;color:#171717;">
                        ${safeMessage}
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding:20px 32px 10px;">
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td style="background-color:#0a0a0a;">
                            <a href="${replyMailto}" style="display:inline-block;padding:14px 22px;font-size:12px;line-height:1;text-transform:uppercase;letter-spacing:0.2em;font-weight:700;color:#ffffff;text-decoration:none;">
                              Reply to ${safeName}
                            </a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding:18px 32px 28px;">
                      <p style="margin:0;font-size:13px;line-height:1.7;color:#737373;">
                        This notification was generated automatically by the LinearSAF portfolio contact flow and delivered through the configured SMTP transport.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  });

  return {
    configured: true,
    sent: true,
    messageId: info.messageId,
  };
}

module.exports = {
  hasMailConfig,
  sendContactNotification,
};
