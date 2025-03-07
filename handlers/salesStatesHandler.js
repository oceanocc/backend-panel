import express from 'express';
import pool from '../config/database.js';
import { isAuthenticated } from '../middleware/authMiddleware.js';

const handler = express.Router();

// /sales
handler.get('/sales/:from/:to', isAuthenticated, async (req, res) =>
{
    const { from, to } = req.params;

    const getSalesByDateRange = async (startDate, endDate) =>
    {
        if (!startDate || !endDate)
        {
            const [rows] = await pool.query(`
                SELECT *
                FROM estado_de_ventas
            `, [userID]);
            return rows;
        }
        else
        {
            const [rows] = await pool.query
            (
                `SELECT *
                FROM estado_de_ventas
                WHERE fecha_encuesta BETWEEN ? AND ?`
                ,[startDate, endDate]
            );
            return rows;
        }
    }
    const sales = await getSalesByDateRange(from, to);

    res.json({ sales });
});

export default handler;