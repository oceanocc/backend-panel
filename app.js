import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import authHandler from './handlers/authHandler.js';
import salesStatesHandler from './handlers/salesStatesHandler.js';
import usersHandler from './handlers/usersHandler.js';

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true }
}));

// Rutas
app.use(express.static(path.join(__dirname, 'frontend')));
app.use(authHandler);
app.use(salesStatesHandler);
app.use(usersHandler);

app.listen(process.env.PORT, () =>
{
    console.log(`byp-estado-de-ventas ${process.env.PORT}`);
});