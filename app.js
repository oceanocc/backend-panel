import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import https from 'https';
import fs from 'fs';
import cors from 'cors';

import salesStatesHandler from './handlers/salesStatesHandler.js';

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
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
    origin: 'https://oceanocc.ddns.net' // Permite solicitudes desde este dominio
}));

// Rutas
app.use(salesStatesHandler);

httpsServer.listen(process.env.PORT, () =>
{
    console.log(`oceanocc-panel ${process.env.PORT}`);
});