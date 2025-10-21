import express from 'express';
import pool from '../config/database.js';
import { validateApiKey } from '../middleware/authMiddleware.js';

const handler = express.Router();

// /panelSales
handler.post('/panelSales', validateApiKey, async (req, res) =>
{
    try
    {
        const { usuario, telefono, fecha_venta } = req.body;
        // Empty verification
        if (!usuario || !telefono || !operadora || !fecha_venta)
        {
            return res.status(400).json({ error: 'Faltan datos obligatorios.' });
        }
    
        await pool.query
        (
            `
                INSERT INTO ventas (id_usuario, dn, fecha_venta)
                SELECT  u.id, vp.dn, vp.fecha_venta
                FROM ventas_pre vp
                JOIN usuarios u ON u.usuario = v2.usuario
            `
            ,[usuario, telefono, fecha_venta]
        );
    
        res.json({ message: 'Ok.' });
    }
    catch (error)
    {
        console.error('Error inserting new panel sales:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

export default handler;