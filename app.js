import express from "express";

const app = express();

app.use('/',( req, res, next) => {
  console.log('hello world');
});

app.listen(3000);