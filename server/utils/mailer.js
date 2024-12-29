const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail", // Use your email provider
    auth: {
        user: "saksham.jain21b@iiitg.ac.in", // Replace with your email
        pass: "ybesgevwtdjqqpmk", // Replace with your email password or app-specific password
    },
});

const sendMail = async (to, subject, text, html) => {
    try {
        const info = await transporter.sendMail({
            from: '"Task Management System" <saksham.jain21b@iiitg.ac.in>', // Sender's address
            to: to, // Recipient's address
            subject: subject, // Subject line
            text: text, // Plain text body
            html: html, // HTML body
        });
        console.log("Email sent: %s", info.messageId);
    } catch (error) {
        console.error("Error sending email: ", error);
    }
};

module.exports = sendMail;