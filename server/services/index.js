// import logo from '../assets';

require('dotenv').config();

export const resetPasswordMessage = (user, url) => `
  <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="ie=edge" />
        <link href="https://fonts.googleapis.com/css?family=Montserrat:200,500,700" rel="stylesheet">
        <style>
          * {font-family: 'Montserrat'; font-weight: 200;}
           strong {font-family: 'Montserrat'; font-weight:500;}
          .heading {border: none; border-bottom: 1px solid #d0d0d0;}
          .container {width: 80%;margin: 0 auto; box-shadow: 0px 2px 10px 0px #d0d0d0; background: #ffffff;padding: 30px;}
          .name {font-size: 1.2rem;}
          .message{font-size: 1.2rem;}
          .link-btn{
            text-decoration: none;
            font-family: Red Hat Display;
            font-style: normal;
            font-weight: bold;
            font-size: 13px;
            line-height: 17px;
            color: rgba(255, 255, 255, 0.92);
          }
          .btn { width: 200px;
            height: 53.37px;
            box-shadow: 4px 4px 20px rgba(0, 0, 0, 0.25);
            background: #1A6AC9;
            border-radius: 50px;
            }
            .logo {width: 165px; padding-bottom: 20px;}
        </style>
      </head>
      <body>
        <div class="container">
          <div class="heading">
           <h1>Paxinfy</h1>
          </div>
          <p class="message">
            Hello <strong>${user.dataValues.firstName}</strong> <strong>${user.dataValues.lastName}</strong>,
            <br>
            Please click on the reset button to reset your password. 
            <br> <br>
            Warm Regards,<br>
            Paxinfy Team.
          </p>
          <button class="btn" >  <a class="link-btn" href=${url}>
          Reset
        </a></button>         
        </div>
      </body>
    </html>  
  `;

export const activationMessage = (user, url) => {
//   const url = `${process.env.APP_URL}/verify?activate=${token}`;
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="ie=edge" />
        <link href="https://fonts.googleapis.com/css?family=Montserrat:200,500,700" rel="stylesheet">
        <style>
          * {font-family: 'Montserrat'; font-weight: 200;}
           strong {font-family: 'Montserrat'; font-weight:500;}
          .heading {border: none; border-bottom: 1px solid #d0d0d0;}
          .container {width: 80%;margin: 0 auto; box-shadow: 0px 2px 10px 0px #d0d0d0; background: #ffffff;padding: 30px;}
          .name {font-size: 1.2rem;}
          .message{font-size: 1.2rem;}
          .link-btn{
            text-decoration: none;
            font-family: Red Hat Display;
            font-style: normal;
            font-weight: bold;
            font-size: 13px;
            line-height: 17px;
            color: rgba(255, 255, 255, 0.92);
          }
          .btn { width: 200px;
            height: 53.37px;
            box-shadow: 4px 4px 20px rgba(0, 0, 0, 0.25);
            background: #1A6AC9;
            border-radius: 50px;
            }
          .logo {width: 165px; padding-bottom: 20px;}
        </style>
      </head>
      <body>
        <div class="container">
          <div class="heading">
             <h1>Paxinfy</h1>
          </div>
          <p class="message">
            Hello <strong>${user.dataValues.firstName}</strong> <strong>${user.dataValues.lastName}</strong>,
            <br>
            Welcome to Author's Haven!
            <br>
            Please click on the verify button to verify your Paxinfy account. 
            <br> <br>
            Regards,<br>
            AH-Support Team.
          </p>
          <button class="btn" >  <a class="link-btn" href=${url}>
          Reset
        </a></button> 
        </div>
      </body>
    </html>  
    `;
};
