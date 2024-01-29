const twilio = require('twilio');

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN,
);

async function sendSMS(to, body) {
  const toNumber = `+91${to}`;
  const fromNumber = '(325) 326-3268';

  try {
    await twilioClient.messages.create({
      body,
      from: fromNumber,
      to: toNumber,
    });
    console.log(`SMS sent to ${to} successfully.`);
  } catch (error) {
    console.error(`Error sending SMS to ${to}:`, error.message);
  }
}

module.exports = { sendSMS };
