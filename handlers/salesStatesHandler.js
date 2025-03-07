import express from 'express';
import pool from '../config/database.js';
import { isAuthenticated } from '../middleware/authMiddleware.js';

const handler = express.Router();

// /salesStates
handler.get('/salesStates', isAuthenticated, async (req, res) =>
{
    const { from, to } = req.query;

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
    const salesStates = await getSalesByDateRange(from, to);

    res.json({ data: salesStates });
});

// /salesStates/id
handler.get('/salesStates/id/:id', isAuthenticated, async (req, res) =>
{
    const { id } = req.params;

    const getSalesStates = async (id) =>
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
            WHERE id = ?`
            ,[id]
        );
        return rows;
    }
    const salesStates = await getSalesStates(id);

    res.json({ data: salesStates });
});

// /salesStates POST
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

// /salesStates PUT
handler.put('/salesStates/', isAuthenticated, async (req, res) =>
{
    let { id, usuario, dn, status, fecha_encuesta, fecha_activacion, fecha_alta } = req.body;
    if(fecha_activacion == '') fecha_activacion = null;
    if(fecha_alta == '') fecha_alta = null;

    try
    {
        const [result] = await pool.query(
            'UPDATE estado_de_ventas SET usuario = ?, dn = ?, status = ?, fecha_encuesta = ?, fecha_activacion = ?, fecha_alta = ? WHERE id = ?',
            [usuario, dn, status, fecha_encuesta, fecha_activacion, fecha_alta, id]
        );

        // Envía una respuesta de éxito
        res.status(201).json({ message: 'Estado de venta guardado correctamente'});
    }
    catch (error)
    {
        // Maneja los errores
        console.error('Error al guardar el estado de venta:', error);
        res.status(500).json({ message: 'Error al guardar el estado de venta' });
    }
});

// /salesStates DELETE
handler.delete('/salesStates/', isAuthenticated, async (req, res) =>
{
    let { id } = req.query;
    
    try
    {
        const [result] = await pool.query(
            'DELETE FROM estado_de_ventas WHERE id = ?',
            [id]
        );

        // Envía una respuesta de éxito
        res.status(201).json({ message: 'Estado de venta borrado correctamente'});
    }
    catch (error)
    {
        // Maneja los errores
        console.error('Error al borrar el estado de venta:', error);
        res.status(500).json({ message: 'Error al borrar el estado de venta' });
    }
});

// /salesStates/batch POST
handler.post('/salesStates/bulk', isAuthenticated, async (req, res) =>
{
    const values = req.body;
    try
    {
        await pool.query('TRUNCATE TABLE estado_de_ventas_pre');

        for(let value of values)
        {
            const { usuario, dn, status, fecha_encuesta, fecha_activacion, fecha_alta } = value;
            await pool.query(
                'INSERT INTO estado_de_ventas_pre (usuario, dn, status, fecha_encuesta, fecha_activacion, fecha_alta) VALUES (?, ?, ?, ?, ?, ?)',
                [usuario, dn, status, fecha_encuesta, fecha_activacion, fecha_alta]
            );
        }
        await pool.query(`
            INSERT INTO estado_de_ventas (usuario, dn, status, fecha_encuesta, fecha_activacion, fecha_alta)
            SELECT ev2.usuario, ev2.dn, ev2.status, ev2.fecha_encuesta, ev2.fecha_activacion, ev2.fecha_alta
            FROM estado_de_ventas_pre ev2
            LEFT JOIN estado_de_ventas ev ON ev.dn = ev2.dn
            WHERE
                ev.dn IS NULL
        `);

        await pool.query(`
            UPDATE estado_de_ventas ev 
            JOIN estado_de_ventas_pre ev2 ON ev2.dn = ev.dn
            SET
                ev.usuario = ev2.usuario
                ,ev.dn = ev2.dn
                ,ev.status = ev2.status
                ,ev.fecha_encuesta = ev2.fecha_encuesta
                ,ev.fecha_activacion = ev2.fecha_activacion
                ,ev.fecha_alta = ev2.fecha_alta
                ,ev.fecha_actualizacion = NOW()
        `);

        res.status(201).json({ message: 'Estados de ventas guardados correctamente'});
    }
    catch (error)
    {
        // Maneja los errores
        console.error('Error al guardar:', error);
        res.status(500).json({ message: 'Error al guardar' });
    }
});
    
export default handler;