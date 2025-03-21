const nodemailer = require('nodemailer')
const dotenv= require('dotenv')
dotenv.config()

const mailSender = async(email,title, body)=>{
    try {
        //create a transporter to send emails
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth:{
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        })

        //SEND EMAIL TO USERS
        let info = await transporter.sendMail({
            from: `"CERAMICA" <${process.env.MAIL_USER}>`,
            to: email,
            subject: title,
            html: body
        });
        console.log(`Email sent to ${email}: ${info.messageId}`);
        return info
    } catch (error) {
        console.log(error.message);
        throw error;
    }
}

module.exports = mailSender