const { SESClient } = require("@aws-sdk/client-ses");

const client = new SESClient({
    region: "ap-south-1",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey:process.env.AWS_SECRET_KEY,
    },
  });

  module.exports={client}