import nodemailer from "nodemailer";

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.NODE_CODE_SENDING_EMAIL_ADDRESS,
      pass: process.env.NODE_CODE_SENDING_EMAIL_PASSWORD,
    },
  });

  // Define email options (from, to, subject and text)
  const mailOpts = {
    from: `Blog app <abdobakry823@gmail.com>`,
    to: options.email,
    subject: options.subject,
    html: options.message,
  };

  // Send main
  await transporter.sendMail(mailOpts);
};

export default sendEmail;
