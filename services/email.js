const sgMail = require("@sendgrid/mail");
const tokenService = require("../services/tokenService");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const verifyUrl = process.env.VERIFY_URL;

async function sendVerficationEmail(inviteId, name, email) {
  const token = tokenService.generateToken({ id: inviteId });

  const msg = {
    to: email,
    from: "hello@flextogether.com",
    subject: "Thanks for signing up!",
    html: `Hi ${name}, <br /> 
<br/>
Thanks for signing up! Can you please verify your email to finish the process <br />

<a href="${verifyUrl}/${token}"> <strong>${verifyUrl}/${token}</strong></a>`
  };

  await sgMail.send(msg);
}

module.exports = { sendVerficationEmail };
