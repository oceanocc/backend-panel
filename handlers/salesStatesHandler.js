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
                SELECT
                    usuario
                    ,dn
                    ,status
                    ,DATE_FORMAT(fecha_encuesta, '%Y-%m-%d') fecha_encuesta
                    ,DATE_FORMAT(fecha_activacion, '%Y-%m-%d') fecha_activacion
                    ,DATE_FORMAT(fecha_alta, '%Y-%m-%d') fecha_alta
                    ,fecha_creacion
                    ,fecha_actualizacion
                FROM estado_de_ventas
            `, [userID]);
            return rows;
        }
        else
        {
            const [rows] = await pool.query
            (
                `SELECT
                    usuario
                    ,dn
                    ,status
                    ,DATE_FORMAT(fecha_encuesta, '%Y-%m-%d') fecha_encuesta
                    ,DATE_FORMAT(fecha_activacion, '%Y-%m-%d') fecha_activacion
                    ,DATE_FORMAT(fecha_alta, '%Y-%m-%d') fecha_alta
                    ,fecha_creacion
                    ,fecha_actualizacion
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