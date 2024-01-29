const nodemailer = require('nodemailer');
const {google} = require('googleapis')
const Oauth2 = google.auth.OAuth2;

const createTransporter = async () => {
  try {
    const oauth2Client = new Oauth2(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      "https://developers.google.com/oauthplayground"
    );

    oauth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN  });

    const accessToken = await new Promise((resolve, reject) => {
      oauth2Client.getAccessToken((err, token) => {
        if (err) {
          console.error("Failed to fetch the access token:", err.response.data);
          console.log('OAuth2 Config:', oauth2Client._options);
          reject(err);
        }
        resolve(token);
      });
    });

    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.EMAIL,
        accessToken,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
      },
    });
  } 
  catch (error) 
  {
    console.error("Error creating transporter:", error);
    throw error; // Re-throw the error to indicate failure
  }
}

exports.sendEmail = async (to, subject, text) =>{
  try 
  {
    const options = {
      from: process.env.EMAIL,
      to: to,
      subject: subject,
      text: text
    }
    const transporter = await createTransporter();
    await transporter.sendMail(options);
  } 
  catch (error) 
  {
    console.log("Error in sendEmail",error);
  }
}
