import express from 'express';
import pool from '../config/database.js';

const handler = express.Router();

// /salesStates
handler.get('/salesStates', async (req, res) =>
{
    const { user, password, from, to } = req.query;

    const salesStates = async (usuario, clave, fecha_inicio, fecha_fin) =>
    {
        if (!startDate || !endDate)
        {
            res.status(500).json({ message: 'La fecha de inicio o fin no pueden estar vacías' });
        }
        else
        {
            const [rows] = await pool.query
            (
                `
                    SELECT s.*
                    FROM (
                        SELECT
                            u.usuario AS 'usuario'
                            ,v.dn AS 'dn'
                            ,ev.status AS 'status'
                            ,v.fecha_venta AS 'fecha_venta'
                            ,ev.fecha_activacion AS 'fecha_activacion'
                            ,ev.fecha_alta AS 'fecha_alta'
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
    }
    const results = await salesStates(user, password, from, to);

    res.json({ data: results });
});

export default handler;