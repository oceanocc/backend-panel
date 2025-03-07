import express from 'express';
import pool from '../config/database.js';
import { isAuthenticated } from '../middleware/authMiddleware.js';

const handler = express.Router();

// /auth/verifyLogin
handler.get('/auth/verifyLogin', isAuthenticated, async (req, res) =>
{
    res.json({ message: 'Sesión iniciada', usuario: req.session.usuario, rol: req.session.rol });
});

// /auth/login
handler.post('/auth/login', async (req, res) =>
{
    const { username, password } = req.body;
    const findByUsername = async (username) =>
    {
        const [rows] = await pool.query("SELECT * FROM usuarios WHERE usuario = ? AND activo = 'Activo'", [username]);
        return rows[0];
    };

    const user = await findByUsername(username);

    if (!user || password != user.clave)
    {
        return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    req.session.userId = user.id;
    req.session.usuario = user.usuario;
    req.session.rol = user.rol;
    res.json({ message: 'Sesión iniciada' });
});

// /auth/logout
handler.delete('/auth/logout', (req, res) =>
{
    req.session.destroy();
    res.clearCookie('connect.sid');
    res.json({ message: 'Sesión cerrada' });
});

export default handler;