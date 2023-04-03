# CryptoPortfolioREST_API

This project provides a RESTful API for managing your crypto portfolio (only crypto tokens for now). 

This app mainly base on https://defillama.com/docs/api.

Created only for learning and trenning purposes. To present basic features in REST API. 

In application you can create your account and store information about your crypto assets.

# Table of contents
* [Getting Started](#Getting-Started)
* [Config file](#Config-file)
* [Endpoints](#Endpoints)
* [POST/signup](#POST/signup)

# Getting Started
To get started with this API, you will need to clone this repository and install the required dependencies.
```
git clone https://github.com/MatL3w/CryptoPortfolioREST_API.git
cd CryptoPortfolioREST_API.git
npm install
```
Once you have the dependencies installed, you can start the server by running:
```
npm start
```
The API will be available at http://localhost:3000.

# Config file

To make application operable, you have to create config file (config.js) in main folder and insert there, this following data:

```
export const PORT = 3000; // port 
export const MONGODB_CONNECTION = "mongodb+srv://.........."; //URL to mongoDb database
export const MONGODB_DATABASE_NAME = "Name"; // database name
export const JWT_SECRET = "randomCharactersasdasdadsadsads"; // secret phrase to your JWT cipher
export const JWT_EXPIRES_TIME = '8h'; // how long JWT will be valid
```

This application cooperate with mongoDb database


# Endpoints

The API provides the following endpoints:

## POST/signup

This endpoint allow you to create your new account.

The request body should contain email,password,name.

Example request body:
```
{
    "email": "testUser@test.pl",
    "password": "strongPassword",
    "name":"userName"
}
```

- contain Validation of input data
- hash password using bcrypt

The example of response body:
```
{
    "message":"User created!",
    "userId:": "64245b3721900e5d85faf0e0",
}
```

## POST /signin

This endpoint allow you to log in.

The request body should contain email and password.

Example request body:
```
{
    "email": "testUser@test.pl",
    "password": "strongPassword",
}
```
- contain Validation of input data
- check user existance in database
- comparing password with hashed password
- generate and send back JWT

The example of response body:
```
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RVc2VyQHRlc3QucGwiLCJ1c2VySWQiOiI2NDI0NWIzNzIxOTAwZTVkODVmYWYwZTAiLCJpYXQiOjE2ODA1NDQ1ODAsImV4cCI6MTY4MDU3MzM4MH0.XqqMqyef-Y5BAxLhm7LKUSttnCYT7eXXDtQl3JJ-3Ac",
    "userId:": "64245b3721900e5d85faf0e0"
}
```

## POST /logout

This endpoint allow you to log out.

The request should contain following header:
```
Authorization : JWT 
```

- contain Validation of input data
- check validation of JWT
- store JWT on blackList

The example of response body:
```
{
  "message":"User Logout"
}
```

## POST /changePassword

This endpoint allow you to change password.

The request should contain following header:
```
Authorization : JWT 
```

The request body should contain oldPassword and newPassword.

Example request body:
```
{
    "oldPassword": "oldPassword",
    "newPassword": "newPassword",
}
```


- contain Validation of input data
- check validation of JWT
- compare old password with hashed Password
- hash new password and replace oldhashed

The example of response body:
```
{
  "message":"Password changed"
  "userId:": "64245b3721900e5d85faf0e0"
}
```
## POST /changeEmail

This endpoint allow you to change email.

The request should contain following header:
```
Authorization : JWT 
```

The request body should contain password and newEmail.

Example request body:
```
{
    "password": "password",
    "newEmail": "newEmail@test.com",
}
```


- contain Validation of input data
- check validation of JWT
- compare password with hashed Password
- replace old email with new email

The example of response body:
```
{
  "message":"Email changed"
  "userId:": "64245b3721900e5d85faf0e0"
}
```

## POST /upsertasset

This endpoint allow you to insert or update asset.

The request should contain following header:
```
Authorization : JWT 
```

The request body should contain assetNameTag and assetQuantity.

Example request body:
```
{
    "assetNameTag": "QiDao",
    "assetQuantity": 12555.5,
}
```


- contain Validation of input data
- check validation of JWT
- check for existence of token
- update existing field or create the new one

The example of response body:
```
{
  "message":"Asset added"
  "userId:": "64245b3721900e5d85faf0e0"
}
```

## DELETE /deleteasset

This endpoint allow you to delete asset.

The request should contain following header:
```
Authorization : JWT 
```

The request body should contain assetNameTag.

Example request body:
```
{
    "assetNameTag": "QiDao",
}
```


- contain Validation of input data
- check validation of JWT
- check for existence of token
- delete token from user account

The example of response body:
```
{
  "message":"Asset deleted"
  "userId:": "64245b3721900e5d85faf0e0"
}
```

## GET /getassets

This endpoint allow you to fetch all user assets.

The request should contain following header:
```
Authorization : JWT 
```

- check validation of JWT

The example of response body:
```
{
    "assets": [
        {
            "nameTag": "gmx",
            "quantity": 2.123123,
            "address": "arbitrum:0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a",
            "name": "GMX",
            "tvl": 621647652.843328,
            "category": "Derivatives",
            "symbol": "GMX",
            "logo": "https://icons.llama.fi/gmx.png",
            "url": "https://gmx.io/",
            "mcap": 624169882.3720345,
            "price": 73.59,
            "totalValue": 156.24062157
        },
        {
            "nameTag": "curve",
            "quantity": 2.123123,
            "address": "ethereum:0xD533a949740bb3306d119CC777fa900bA034cd52",
            "name": "Curve",
            "tvl": 4620563887.392376,
            "category": "Dexes",
            "symbol": "CRV",
            "logo": "https://icons.llama.fi/curve.png",
            "url": "https://curve.fi",
            "mcap": 708891230.55511,
            "price": 0.931636,
            "totalValue": 1.9779778192280002
        },
     ],
     "userId": "64245b3721900e5d85faf0e0"
}
```

## GET /getasset

This endpoint allow you to fetch only one asset.

The request should contain following header:
```
Authorization : JWT 
```

The request body should contain assetNameTag.

Example request body:
```
{
    "assetNameTag": "QiDao",
}
```


- contain Validation of input data
- check validation of JWT
- check for existence of token

The example of response body:
```
{
    "asset": {
        "nameTag": "qidao",
        "quantity": 2.123123,
        "address": "polygon:0x580a84c73811e1839f75d86d75d88cca0c241ff4",
        "name": "QiDao",
        "tvl": 60040531.19524268,
        "category": "CDP",
        "symbol": "QI",
        "logo": "https://icons.llama.fi/qidao.jpg",
        "url": "https://app.mai.finance",
        "mcap": 6262533.986094965,
        "price": 0.075719,
        "totalValue": 0.160760750437
    },
    "userId": "64245b3721900e5d85faf0e0"
}
```

