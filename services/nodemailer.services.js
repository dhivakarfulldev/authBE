import nodemailer from "nodemailer";
import dotenv from "dotenv"

dotenv.config();

const transport = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.User,
        pass:process.env.Pass
    }
});

export const sendWelcomeEmail = (name , email) => {
   const mailDetails = {
        from:process.env.User,
        to:email,
        subject: "Welcome to Donation Application",
        html:`
        <h2>Welcome <span style={color:"red"}>${name}</span> 👋</h2>

        <p>Your account has been created successfully.</p>

        <p>we are excited to have you on our application</p>

        <p>Happy wishes</p>

        <br>

        <p>Regards,</p>
        <h3 style={color:"red"}>Dhiva</h3>
        `

   };

   transport.sendMail(mailDetails , (error) => {
       if(error){
        console.log(error);
        
       }else{
        console.log("Welcome email sent successfully");
        
       }
   });
}

export const sendForgotPasswordEmail = (email , token) => {
    const resetlink = `http://localhost:5173/reset-password/${token}`

    const mailmessage = {
        from:process.env.User,
        to:email,
        subject:"Password Reset",
        html:`
        <h2>Welcome to password reset </h2>
        <p> this link is valid for 10 minutes</p>
        <a href="${resetlink}">click here to reset password</a>
        <p>regards</p>
        <h3>Dhiva</h3>
        `
    }

    transport.sendMail(mailmessage , (error) => {
         if(error){
            console.log(error);
            
         }
         else{
            console.log("reset link sent successfully");
            
         }
    })

}