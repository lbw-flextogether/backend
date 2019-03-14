const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const verifyUrl = process.env.VERIFY_URL;
const invitationUrl = process.env.INVITATION_URL;

// to verify
async function sendVerfication(name, email, token) {
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

// to invite
async function sendInvitation(user1Name, user2Name, user2Email, token) {
  const msg = {
    to: user2Email,
    from: "hello@flextogether.com",
    subject: `${user1Name} Wants to Workout Together`,
    html: `Hi ${user2Name}, <br /> 
<br />
${user1Name} would like you to complete the FlexTogether beta with them. They've chosen some times that work for them. Please click the link below to enter times you are available to participte. <br />
<br />

<a href="${invitationUrl}/${token}"> <strong>${invitationUrl}/${token}</strong></a>`
  };

  await sgMail.send(msg);
}

// to confirm
async function sendConfirmation(name, email, buddyName, day, time) {
  const msg = {
    to: email,
    from: "hello@flextogether.com",
    subject: `Confirmation on FlexTogether `,
    html: `Hi ${name}, <br /> 
<br />
You are scheduled to workout with ${buddyName} on ${day} at ${time} for next 4 weeks. Enjoy staying active with FlexTogether!`
  };

  await sgMail.send(msg);
}

module.exports = { sendVerfication, sendInvitation, sendConfirmation };
