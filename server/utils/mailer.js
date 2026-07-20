const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

async function sendContactEmail({ name, email, subject, message }) {
  await transporter.sendMail({
    from: `"KUANA Website" <${process.env.MAIL_USER}>`,
    to: process.env.MAIL_TO,
    replyTo: email,
    subject: subject ? `[KUANA Contact] ${subject}` : `[KUANA Contact] Message from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <div style="background:#0e1b4d;padding:20px 24px;border-radius:8px 8px 0 0">
          <img src="https://kuana.org/assets/img/KUANA.png" alt="KUANA" height="40" style="object-fit:contain"/>
        </div>
        <div style="background:#f9fafb;padding:24px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px">
          <h2 style="margin:0 0 16px;color:#111827">New message from the website</h2>
          <table style="width:100%;border-collapse:collapse;margin-bottom:16px">
            <tr><td style="padding:8px 0;color:#6b7280;width:80px">Name</td><td style="padding:8px 0;font-weight:600;color:#111827">${name}</td></tr>
            <tr><td style="padding:8px 0;color:#6b7280">Email</td><td style="padding:8px 0"><a href="mailto:${email}" style="color:#dc143c">${email}</a></td></tr>
            ${subject ? `<tr><td style="padding:8px 0;color:#6b7280">Subject</td><td style="padding:8px 0;color:#111827">${subject}</td></tr>` : ''}
          </table>
          <div style="background:#fff;border:1px solid #e5e7eb;border-radius:6px;padding:16px;white-space:pre-wrap;color:#374151">${message}</div>
          <p style="margin:16px 0 0;font-size:12px;color:#9ca3af">Sent via kuana.org contact form · Reply-To is set to the sender's email</p>
        </div>
      </div>
    `,
  });
}

module.exports = { sendContactEmail };
