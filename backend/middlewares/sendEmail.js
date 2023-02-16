const nodeMailer = require("nodemailer");

exports.sendEmail= async(options)=>{
    var transporter = nodeMailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "7b9a78df292397",
          pass: "dc2bfb88f65988"
        }
      });

    const mailOptions ={
        from:process.env.SMTP_MAIL,
        to:options.email,
        subject: options.subject,
        text: options.message,
    }
    await transporter.sendMail(mailOptions);
}