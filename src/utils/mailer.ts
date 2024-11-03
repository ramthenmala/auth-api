import nodemailer, { SendMailOptions } from "nodemailer";
import logStatus from "./logStatus";

// async function createTestCreds() {
//     const creds = await nodemailer.createTestAccount();
//     console.log({ creds });
// }

// createTestCreds();

const smtp = {
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
        user: "maddison53@ethereal.email",
        pass: "jn7jnAPss4f63QBp6D",
    },
}

// const smtp: SMTPTransport.Options = {
//     host: process.env.NODE_MAILER_HOST,
//     port: parseInt(process.env.NODE_MAILER_PORT || "587", 10),
//     secure: process.env.NODE_MAILER_SECURE === "false",
//     auth: {
//         user: process.env.NODE_MAILER_USER,
//         pass: process.env.NODE_MAILER_PASS,
//     }
// };

const transporter = nodemailer.createTransport(smtp);

async function sendEmail(payload: SendMailOptions) {
    transporter.sendMail(payload, (err, info) => {
        if (err) {
            logStatus.error(err, "Error sending email");
            return;
        }

        logStatus.info(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    });
}

export default sendEmail;
