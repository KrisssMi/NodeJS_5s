const nodemailer = require("nodemailer");

function SendMessageByMail(emailFrom, emailFromPassword, emailTo, message) {
    const transport = nodemailer.createTransport({
        service: "Yandex",
        auth: {
            user: emailFrom,
            pass: emailFromPassword
        },
    });

    const option = { 
        from: emailFrom,
        to: emailTo,
        subject: "06-02",
        text: message
    };

    transport.sendMail(option, (err, info) => {
        if (err) {
            console.log(err);
        } else {
            console.log(info);
        }
    });
}

module.exports = SendMessageByMail;