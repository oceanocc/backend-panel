import express from 'express';
import pool from '../config/database.js';
import { validateApiKey } from '../middleware/authMiddleware.js';

const handler = express.Router();

// /panelSales
handler.post('/panelSales', validateApiKey, async (req, res) =>
{
    try
    {
        const ventas = req.body;

        // Blank ventas_pre
        await pool.query(`TRUNCATE TABLE ventas_pre`);

        // Save ventas
        for(const venta of ventas)
        {
            const { usuario, telefono, fecha_venta } = venta;
            // Empty verification
            if (!usuario || !telefono || !fecha_venta)
            {
                return res.status(400).json({ error: 'Faltan datos obligatorios.' });
            }
        
            await pool.query
            (
                `INSERT INTO ventas_pre (usuario, dn, fecha_venta) VALUES (?, ?, ?)`
                ,[usuario, telefono, fecha_venta]
            );    
        }
        res.json({ message: 'Ok.' });
    }
    catch (error)
    {
        console.error('Error inserting new panel sales:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

export default handler;