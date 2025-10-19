import express from 'express';
import pool from '../config/database.js';

const handler = express.Router();

// /salesStates
handler.post('/salesStates', async (req, res) =>
{
    try
    {
        const { user, password, from, to } = req.body;

        const salesStates = async (usuario, clave, fecha_inicio, fecha_fin) =>
        {
            const [rows] = await pool.query
            (
                `
                    SELECT s.*
                    FROM (
                        SELECT
                            u.usuario AS 'usuario'
                            ,v.dn AS 'dn'
                            ,IFNULL(ev.status, 'SIN ESTATUS') AS 'status'
                            ,DATE_FORMAT(v.fecha_venta, '%Y-%m-%d') AS 'fecha_venta'
                            ,DATE_FORMAT(ev.fecha_activacion, '%Y-%m-%d') AS 'fecha_activacion'
                            ,DATE_FORMAT(ev.fecha_alta, '%Y-%m-%d') AS 'fecha_alta'
                            ,ev.fecha_actualizacion AS 'fecha_actualizacion'
                        FROM ventas v
                        JOIN usuarios u ON u.id = v.id_usuario AND u.usuario = ? AND u.clave = ?
                        LEFT JOIN estado_de_ventas ev ON ev.dn = v.dn
                    ) s
                    WHERE s.fecha_venta BETWEEN ? AND ?
                `
                ,[usuario, clave, fecha_inicio, fecha_fin]
            );
            return rows;
        }
        const results = await salesStates(user, password, from, to);

        res.json({ data: results });
    }
    catch (error)
    {
        console.error('Error fetching sales states:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

export default handler;