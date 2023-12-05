// import OpenAI from "openai";
import express from 'express';
// import axios from "axios";
import router from './routes/index.js';
import bodyParser from 'body-parser';
import 'dotenv/config';
import cors from 'cors';
// import * as cheerio from 'cheerio';

const app = express();
app.use(bodyParser.json());
app.use(express.json());
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );
  next();
});

app.use(router);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}.`);
});

export default app;
