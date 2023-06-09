# CryptoPortfolioREST_API

This project provides a RESTful API for managing your crypto portfolio (only crypto tokens for now). 

This app mainly base on https://defillama.com/docs/api.

Created only for learning and trenning purposes. To present basic features in REST API. 

In application you can create your account and store information about your crypto assets.

# Table of contents
* [Feature History](#Feature-History)
* [Technologies](#Technologies)
* [Getting Started](#Getting-Started)
* [Config file](#Config-file)
* [Endpoints](#Endpoints)
- [POST /signup](#post-signup)
- [POST /signin](#post-signup)
- [POST /logout](#post-logout)
- [POST /changepassword](#post-changepassword)
- [POST /asset](#post-asset)
- [DELETE /asset](#delete-asset)
- [GET /getasset](#get-getasset)
- [WS /socket](#ws-socket)

# Feature History
Below are all added feature in chronogical order with detailed description:
 - User can creat account, **log in, log out, change email and password**, all data are stored in MongoDb database, used mongoose in order to easily manipulate datas.
    To **authentication is used JWT**. To logout is used blacklist for JWT also stored in MongoDB.
 - When User has account then he can store his assets in application. Main feature of application is present to User all avaliable data about his assets. User only has to     insert two things: **nameTag of assets, and quantity**. All additional data about user's token are fetched from https://defillama.com/docs/api. User can **add,update,delete,fetch** data about his assets. All functionality inlcuding asset's data transfer based on **REST API**. This application is only **backend part of all project**. In future probbably will be created front-end part of project.
 - **Multithread** functionality was added to application. Now Main thread create **cluster.fork** for all CPU cores and manage them. This opertaion provide better performance for handling a lot of request and isolate encountered errors from crashing all aplication.
 -  **Websocket** feature was added to provide still connection between users and apllication. In this way application can continously inform user about accessibility to defillama's informations which are crucial for utility this application. In future i will use Socket.io instead of raw websocket protocol.
 - **Helmet.js** was added to increase security.
 - **Morgan**  to logging 
 - Changed uncrypted transimission to encrypted using **HTTPS and WSS**. The key and certificate are Intentionally included.
 - i have to remove encryption transmission because with selfsigned certificate are problems to testing this backend application with its front-end part using webbrowser
# Technologies
Projest is created with:
* nodejs version: 19.8.1
* express version: 2.33
* bcrypt version: 5.1.0
* jsonwebtoken: 9.0.0
* moongose: 1.0.0
* helmet: 6.0.1
* morgan: 1.10.0


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


Additionaly remember to generate private key and certificate using openssl. This is manadatory because transmission now is only by https and wss.
```
openssl genrsa -out privatekey.pem 2048
openssl req -new -x509 -key privatekey.pem -out certificate.pem -days 365
```
Put files in main folder.

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

## POST /signup

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

## POST /changepassword

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
## POST /changeemail

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

## POST /asset

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

## DELETE /asset

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

## GET /asset

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
## WS /socket

This endpoint allow you establish websocket connection.

The request should contain following header:
```
Authorization : JWT 
```

- check validation of JWT
- if exist websocket connection for current user, terminate previous connection and establish current.
- every fixed period of time application send to user information about accessibility of data on https://defillama.com/docs/api

The example of response body:
```
{
 "online": "true"
}
```

