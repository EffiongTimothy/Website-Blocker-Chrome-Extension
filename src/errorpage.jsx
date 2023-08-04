import React from "react";
// import './errorpage.css'

  const generateHTML404 =()=>{
    return(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>BIME.</title>
        <link rel="stylesheet" href="styles.css">
    </head>
    <body>
        <div class="error-container">
            <h1>Oops! This website is BLOCKED by BIME.</h1>
            <p>We apologize for the inconvenience, but it seems there was an error processing your request.</p>
            <p>Please try again later or contact BIME.(inc) for assistance.</p>
            <p>www.bimeExtension.com</p>
        </div>
    </body>
    </html>
    
       
    `)
  }

 const generateStyles = () => {
    return (`
    <style>
    
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background-color: #00000;
  }
  
  .error-container {
      text-align: center;
      background-color: #00000;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      padding: 30px;
      border-radius: 5px;
      max-width: 400px;
  }
  
  h1 {
      color: #f44336;
      font-size: 28px;
      margin-bottom: 10px;
  }
  
  p {
      font-size: 16px;
      line-height: 1.6;
      margin-bottom: 15px;
  }
  
  .back-btn {
      background-color: #4CAF50;
      color: #fff;
      border: none;
      padding: 10px 20px;
      font-size: 16px;
      border-radius: 5px;
      cursor: pointer;
  }
  
  .back-btn:hover {
      background-color: #45a049;
  }
  
    </style>`
    )

  };  

export  {generateHTML404,generateStyles};