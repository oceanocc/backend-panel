import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import https from 'https';
import fs from 'fs';
import cors from 'cors';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

import authHandler from './handlers/authHandler.js';
import salesStatesHandler from './handlers/salesStatesHandler.js';
import reportsHandler from './handlers/reportsHandler.js';

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    origin: 'https://oceanocc.com'
}));

// Routes
app.use(express.static(path.join(__dirname, 'frontend')));
app.use(authHandler);
app.use(salesStatesHandler);
app.use(reportsHandler);

httpsServer.listen(process.env.PORT, () =>
{
    console.log(`oceanocc-backend ${process.env.PORT}`);
});