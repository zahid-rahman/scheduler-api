import nodemailer from "nodemailer";
import config from "../config/index.js";

async function sendEmail(data, callback) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: config.emailAddress,
      pass: config.emailPass,
    },
  });

  const mailOptions = {
    from: `"Scheduler.io" <rahmanzahid94@gmail.com>`,
    to: data.to,
    subject: data.subject,
    text: data.text,
    html: data.html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %", info.messageId);
  } catch (error) {
    console.error(error);
    callback("error: ", JSON.stringify(error));
  }
}

const emailHelper = { sendEmail };
export default emailHelper;
