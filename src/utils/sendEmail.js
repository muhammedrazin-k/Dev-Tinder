const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { client } = require("./sesClient");

const sendEmail=async(fromAddress,ToAddresses,fromuser,touser)=> {
    const params = {
      Source: fromAddress, // your verified domain
      Destination: {
        ToAddresses: [ToAddresses], // must be verified in sandbox
      },
      Message: {
        Subject: {
          Data: "Hello from AWS SES SDK!",
        },
        Body: {
          Text: {
            Data: `hai ${fromuser} sends connection to ${touser} , thankyou...!`,
          },
        },
      },
    };
  
    try {
      const command = new SendEmailCommand(params);
      const response = await client.send(command);
      console.log("Email sent successfully!", response);
    } catch (err) {
      console.error("Error sending email:", err);
    }
  }
  
//   sendEmail('mail@devzin.xyz',"m.razin600@gmail.com");
module.exports={sendEmail}