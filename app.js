import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

import salesStatesHandler from './handlers/salesStatesHandler.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rutas
app.use(salesStatesHandler);

app.listen(process.env.PORT, () =>
{
    console.log(`oceanocc-panel ${process.env.PORT}`);
});