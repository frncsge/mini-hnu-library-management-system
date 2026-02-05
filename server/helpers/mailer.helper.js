import transporter from "../config/mailer.config.js";

const sendOTPbyEmail = async (receiverEmail, otp) => {
  await transporter.sendMail({
    from: `"Mini HNU Library Management System" <${process.env.EMAIL_USER}>`,
    to: receiverEmail,
    subject: "Login OTP",
    text: `
    Your One-Time-Password (OTP) is:

    ${otp}

    This OTP is valid for 2 minutes. Please do not share it with anyone.
    If you did not request this, please ignore this email.

    Thank you,
    Mini HNU Library Management System
    `,
  });
};

export default sendOTPbyEmail;
