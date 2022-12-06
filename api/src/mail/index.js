import nodemailer from 'nodemailer';

let mail;

export async function mailInit() {
  const testAccount = await nodemailer.createTestAccount();
  mail = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });
}

export async function sendEmail({
  from = 'beef@beef.com',
  to = 'beef@beef.com',
  subject,
  html,
}) {
  try {
    const info = await mail.sendMail({
      from,
      to,
      subject,
      html,
    });
    console.log('info', info);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error(error);
  }
}
