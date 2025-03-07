import express from 'express';
import pool from '../config/database.js';
import { isAuthenticated } from '../middleware/authMiddleware.js';

const handler = express.Router();

// /sales
handler.get('/salesStates/:from/:to', isAuthenticated, async (req, res) =>
{
    const { from, to } = req.params;

    const getSalesByDateRange = async (startDate, endDate) =>
    {
        if (!startDate || !endDate)
        {
            res.status(500).json({ message: 'La fecha de inicio o fin no pueden estar vacías' });
        }
        else
        {
            const [rows] = await pool.query
            (
                `SELECT
                    id
                    ,usuario
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

    res.json({ data: sales });
});

// /sales/add
handler.post('/salesStates/', isAuthenticated, async (req, res) =>
{
    let { usuario, dn, status, fecha_encuesta, fecha_activacion, fecha_alta } = req.body;
    if(fecha_activacion == '') fecha_activacion = null;
    if(fecha_alta == '') fecha_alta = null;

    try
    {
        const [result] = await pool.query(
        'INSERT INTO estado_de_ventas (usuario, dn, status, fecha_encuesta, fecha_activacion, fecha_alta) VALUES (?, ?, ?, ?, ?, ?)',
        [usuario, dn, status, fecha_encuesta, fecha_activacion, fecha_alta]
        );

        // Envía una respuesta de éxito
        res.status(201).json({ message: 'Estado de venta guardado correctamente', id: result.insertId });
    }
    catch (error)
    {
        // Maneja los errores
        console.error('Error al guardar el estado de venta:', error);
        res.status(500).json({ message: 'Error al guardar el estado de venta' });
    }
});
  

export default handler;