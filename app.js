import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import https from 'https';
import fs from 'fs';
import cors from 'cors';
import session from 'express-session';
import cookieParser from 'cookie-parser';

import authHandler from './handlers/authHandler.js';
import salesStatesHandler from './handlers/salesStatesHandler.js';
import landingEntries from './handlers/landingEntries.js';

dotenv.config();

// Lee los archivos de certificado y clave
const privateKey = fs.readFileSync(process.env.KEY, 'utf8');
const certificate = fs.readFileSync(process.env.CERT, 'utf8');

const credentials = {
  key: privateKey,
  cert: certificate,
};

const app = express();
const httpsServer = https.createServer(credentials, app);
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true }
}));
app.use(cors({
    origin: ['https://oceanocc.com', 'https://oceanocc.ddns.net']
}));

// Routes
app.use(authHandler);
app.use(salesStatesHandler);
app.use(landingEntries);

httpsServer.listen(process.env.PORT, () =>
{
    console.log(`oceanocc-backend-panel ${process.env.PORT}`);
});