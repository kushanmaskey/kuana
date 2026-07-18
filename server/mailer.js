const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

async function sendContactNotification({ name, email, subject, message }) {
  await transporter.sendMail({
    from: `"KUANA Website" <${process.env.GMAIL_USER}>`,
    to: 'info@kuana.org',
    replyTo: email,
    subject: `[KUANA Contact] ${subject || 'New Message'} — from ${name}`,
    text: `New message from the KUANA website contact form.\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject || '(none)'}\n\nMessage:\n${message}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #0e1b4d; padding: 24px; border-radius: 8px 8px 0 0;">
          <img src="https://kuana.org/assets/img/KUANA.png" alt="KUANA" style="height: 48px;" />
        </div>
        <div style="background: #f9fafb; padding: 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
          <h2 style="color: #0e1b4d; margin-top: 0;">New Contact Form Message</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr><td style="padding: 8px 0; color: #6b7280; width: 80px;">Name</td><td style="padding: 8px 0; font-weight: bold; color: #111827;">${name}</td></tr>
            <tr><td style="padding: 8px 0; color: #6b7280;">Email</td><td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #0e1b4d;">${email}</a></td></tr>
            <tr><td style="padding: 8px 0; color: #6b7280;">Subject</td><td style="padding: 8px 0; color: #111827;">${subject || '(none)'}</td></tr>
          </table>
          <div style="background: white; border: 1px solid #e5e7eb; border-radius: 6px; padding: 16px;">
            <p style="color: #6b7280; font-size: 12px; margin-top: 0;">MESSAGE</p>
            <p style="color: #111827; white-space: pre-wrap; margin-bottom: 0;">${message}</p>
          </div>
          <p style="color: #9ca3af; font-size: 12px; margin-top: 20px;">
            Reply directly to this email to respond to ${name}.<br/>
            Sent from kuana.org contact form.
          </p>
        </div>
      </div>
    `,
  });
}

module.exports = { sendContactNotification };
