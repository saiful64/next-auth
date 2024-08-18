import User from "@/models/userModel";
import nodemailer from "nodemailer";
import bcryptjs from "bcryptjs";

export const sendEmail = async ({ email, emailType, userId }: any) => {
  try {
    // Generate a hashed token
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);

    // Save the hashed token in the database
    // If the email type is VERIFY, save the token in the verifyToken field
    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        $set: {
          verifyToken: hashedToken,
          verifyTokenExpiry: Date.now() + 3600000,
        },
      });
      // If the email type is RESET, save the token in the forgotPasswordToken field
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        $set: {
          forgotPasswordToken: hashedToken,
          forgotPasswordTokenExpire: Date.now() + 3600000,
        },
      });
    }

    // Create a transport object
    var transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "163bbeb3836c8f",
        pass: "f9df0472a43ba0",
      },
    });

    // Create an email object
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: emailType === "VERIFY" ? "Email Verification" : "Password Reset",
      html: `<p>Click <a href="${
        process.env.DOMAIN
      }/verifyemail?token${hashedToken}">here</a> to ${
        emailType === "VERIFY" ? "verify your email" : "reset your password"
      } or copy and paste the link below in your browser. <br>
     ${process.env.DOMAIN}/verifyemail?token=${hashedToken} 
      </p>`,
    };

    // Send the email
    const mailResponse = await transport.sendMail(mailOptions);
    return mailResponse;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
