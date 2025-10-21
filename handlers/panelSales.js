import express from 'express';
import pool from '../config/database.js';
import { validateApiKey } from '../middleware/authMiddleware.js';

const handler = express.Router();

const panelSalesFunction = async function(req, res, save)
{
    try
    {
        const ventas = req.body;

        // Blank ventas_pre
        await pool.query(`TRUNCATE TABLE ventas_pre`);

        // Verify if array is not empty
        if (ventas.length === 0)
        {
            return res.status(400).json({ error: 'El array de ventas está vacío.' });
        }

        // Verify if the date has sales saved
        const [results] = await pool.query('SELECT * FROM ventas WHERE fecha_venta = ?', [ventas[0].fecha_venta]);
        if (results.length > 0)
        {
            res.status(401).json({ error: 'Esta fecha ya tiene ventas cargadas, carguelas manualmente' });
            return;
        }

        // Save ventas pre
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

        // Save to ventas official
        if (save)
        {
            await pool.query
            (`
                INSERT INTO ventas (id_usuario, dn, fecha_venta)
                SELECT  u.id, v2.dn, v2.fecha_venta
                FROM ventas_pre v2
                JOIN usuarios u ON u.usuario = v2.usuario
            `);    
        }

        res.json({ message: 'Ok.' });
    }
    catch (error)
    {
        console.error('Error inserting new panel sales:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

// /panelSales
handler.post('/panelSales', validateApiKey, async (req, res) =>
{
    await panelSalesFunction(req, res, true);
});

// /panelSalesN
handler.post('/panelSalesN', validateApiKey, async (req, res) =>
{
    await panelSalesFunction(req, res, false);
});

export default handler;