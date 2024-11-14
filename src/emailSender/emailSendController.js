import nodemailer from "nodemailer";

// Create a reusable mailer function
const sendMail = async (email) => {
  try {
    // Step 1: Create the transporter
    let transporter = nodemailer.createTransport({
      service: "gmail", // You can use other email services like 'yahoo', 'outlook', etc.
      auth: {
        user: "k.yogesh@machinemaze.com", // Your email
        pass: "bgkm uxmm lfui vcdl", // Your email password or app-specific password (app-specific if using Gmail with 2-factor authentication)
      },
    });

    // Step 2: Set up the email options
    let mailOptions = {
      from: "k.yogesh@machinemaze.com", // Sender address
      to: "yogeshkannasj@gmail.com", // List of recipients
      subject: '[Machinemaze PM Portal] Please reset your password', // Subject line
      text: 'We heard that you lost your Machinemaze password. Sorry about that!', // Plain text body
      html: `${email}
        <p>We heard that you lost your Machinemaze password. Sorry about that!</p>
        <p>But don’t worry! You can use the following button to reset your password:</p>
        <a href="http://localhost:3000/reset_password?token=unique-reset-token" 
           style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset your password</a>
        <p>If you don’t use this link within 3 hours, it will expire. To get a new password reset link, visit: 
        <a href="http://localhost:3000/reset_password">http://localhost:3000/reset_password</a></p>
        <p>Thanks,<br>The Machinemaze Team</p>
      `,
    };

    // Step 3: Send the email
    let info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.response);
    return info.response; // Optionally return the response
  } catch (error) {
    console.error("Error sending email:", error);
    throw error; // Optionally throw error to handle in the calling function
  }
}; 

// Export the function as a module
export default sendMail;
