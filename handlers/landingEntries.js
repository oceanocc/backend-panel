import express from 'express';
import pool from '../config/database.js';
import { validateApiKey } from '../middleware/authMiddleware.js';

const handler = express.Router();

// /landingEntries/movistar-prepago
handler.post('/landingEntries/movistar-prepago', validateApiKey, async (req, res) =>
{
    try
    {
        const { nombre_completo, telefono, operadora, servicio } = req.body;
        // Empty verification
        if (!nombre_completo || !telefono || !operadora || !servicio)
        {
            return res.status(400).json({ error: 'Faltan datos obligatorios.' });
        }
    
        const results = async (nombre_completo, telefono, operadora, servicio) =>
        {
            const [rows] = await pool.query
            (
                `INSERT INTO landing_entradas (nombre_completo, telefono, operadora, servicio) VALUES (?, ?, ?, ?)`
                ,[nombre_completo, telefono, operadora, servicio]
            );
            return rows;
        }
    
        res.json({ data: await results(nombre_completo, telefono, operadora, servicio) });
    }
    catch (error)
    {
        console.error('Error inserting landing entry:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

export default handler;