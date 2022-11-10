
const dotenv = require('dotenv')
dotenv.config({path: '/.env'})



console.log(process.env.authToken);

const smsVerify = (phone) =>{
    const client = require('twilio')(process.env.accountSid, process.env.authToken);

client.verify.v2.services(process.env.sessionSID)
                .verifications
                .create({to: `+91${phone}`, channel: 'sms'})
                .then(verification => console.log(verification.sid));
}
const smsVerified =(phone ,otp) =>{
    const client = require('twilio')(process.env.accountSid, process.env.authToken);

    client.verify.v2.services(process.env.sessionSID)
          .verificationChecks
          .create({to: `+91${phone}`, code: otp})
          .then(verification_check => console.log(verification_check.status));
}
const phone = 9207895626;
// smsVerify(phone)
const otp =341476

// smsVerified(phone,otp)