const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { client } = require("./sesClient");

const sendEmail=async(fromAddress,ToAddresses,subject,body,)=> {
    const params = {
      Source: fromAddress, // your verified domain
      Destination: {
        ToAddresses: [ToAddresses], // must be verified in sandbox
      },
      Message: {
        Subject: {
          Data: subject,
        },
        Body: {
          Text: {
            Data: body,
          },
        },
      },
    };
  
    try {
      const command = new SendEmailCommand(params);
      const response = await client.send(command);
    } catch (err) {
      console.error("Error sending email:", err);
    }
  }
  
//   sendEmail('mail@devzin.xyz',"m.razin600@gmail.com");
module.exports={sendEmail}