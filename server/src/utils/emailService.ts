import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'mail.privateemail.com',
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: 'novalcapital@novalcapital.org',
    pass: 'admin#',
  },
});

export const sendNotificationEmail = async (subject: string, html: string) => {
  try {
    const info = await transporter.sendMail({
      from: '"Noval Capital System" <novalcapital@novalcapital.org>',
      to: 'novalcapital@novalcapital.org',
      subject: subject,
      html: html,
    });
    console.log('Notification email sent: %s', info.messageId);
  } catch (error) {
    console.error('Error sending notification email:', error);
  }
};
