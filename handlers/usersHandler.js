import express from 'express';
import pool from '../config/database.js';
import { isAuthenticated } from '../middleware/authMiddleware.js';

const handler = express.Router();

// GET /users
handler.get('/users', isAuthenticated, async (req, res) =>
{
    const getUsers = async () =>
    {
        const [rows] = await pool.query
        (
            `SELECT id, usuario, nombres, activo, rol FROM usuarios`
        );
        return rows;
    }
    const users = await getUsers();

    res.json({ data: users });
});

// GET /users/id
handler.get('/users/id/:id', isAuthenticated, async (req, res) =>
{
    const { id } = req.params;

    const get = async (id) =>
    {
        const [rows] = await pool.query
        (
            `SELECT id, usuario, nombres, activo, rol FROM usuarios WHERE id = ?`
            ,[id]
        );
        return rows;
    }
    const user = await get(id);

    res.json({ data: user });
});

// POST /users
handler.post('/users', isAuthenticated, async (req, res) =>
{
    let { usuario, nombres, clave, activo, rol } = req.body;

    try
    {
        const [result] = await pool.query(
            'INSERT INTO usuarios (usuario, nombres, clave, activo, rol) VALUES (?, ?, ?, ?, ?)',
            [usuario, nombres, clave, activo, rol]
        );

        // Envía una respuesta de éxito
        res.status(201).json({ message: 'Usuario guardado correctamente', id: result.insertId });
    }
    catch (error)
    {
        // Maneja los errores
        console.error('Error al guardar el usuario:', error);
        res.status(500).json({ message: 'Error al guardar el usuario' });
    }
});

// PUT /users
handler.put('/users', isAuthenticated, async (req, res) =>
{
    let { id, usuario, nombres, clave, activo, rol } = req.body;

    try
    {
        if(clave === '')
        {
            await pool.query(
                'UPDATE usuarios SET usuario = ?, nombres = ?, activo = ?, rol = ? WHERE id = ?',
                [usuario, nombres, activo, rol, id]
            );
        }
        else
        {
            await pool.query(
                'UPDATE usuarios SET usuario = ?, nombres = ?, clave = ?, activo = ?, rol = ? WHERE id = ?',
                [usuario, nombres, clave, activo, rol, id]
            );
        }

        // Envía una respuesta de éxito
        res.status(201).json({ message: 'Usuario correctamente'});
    }
    catch (error)
    {
        // Maneja los errores
        console.error('Error al guardar el usuario:', error);
        res.status(500).json({ message: 'Error al guardar el usuario' });
    }
});

// DELETE /users
handler.delete('/users', isAuthenticated, async (req, res) =>
{
    let { id } = req.query;
    
    try
    {
        await pool.query(
            'DELETE FROM usuarios WHERE id = ?',
            [id]
        );

        // Envía una respuesta de éxito
        res.status(201).json({ message: 'Usuario borrado correctamente'});
    }
    catch (error)
    {
        // Maneja los errores
        console.error('Error al borrar el usuario:', error);
        res.status(500).json({ message: 'Error al borrar el usuario' });
    }
});

export default handler;