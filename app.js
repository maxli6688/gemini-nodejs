// express demo
// import express from 'express';
// import bodyParser from 'body-parser';

const express = require('express');
const bodyParser = require('body-parser');
const { generateContent } = require('./controller/gemini');
// import { MongoClient } from 'mongodb';

const app = express();

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.get('/test', (req, res) => {
  res.status(200).send({
    status: 1,
    message: "ok31"
  });
})

app.post("/generate", generateContent);
app.post('/hello', (req, res) => {
  res.send(`Hello ${req.body.name}!`);
})

app.listen(3000, () => {
  console.log('App listening on port 3000');
})