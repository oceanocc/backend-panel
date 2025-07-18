import express from 'express';
import pool from '../config/database.js';
import { isAuthenticated } from '../middleware/authMiddleware.js';

const router = express.Router();

// /auth/verifyLogin
router.get('/api/verifyLogin', isAuthenticated, async (req, res) =>
{
    res.json({ message: 'Sesión iniciada', username: req.session.username, role: req.session.role, full_name: req.session.full_name });
});

// /auth/login
router.post('/api/login', async (req, res) =>
{
    const { username, password } = req.body;
    if (!username || !password)
        return res.status(401).json({ error: 'Usuario no encontrado.' });
    
    const [user] = await pool.query("SELECT * FROM usuarios WHERE usuario = ? AND estatus = 'activo' AND rol = 'admin'", [username]);

    if (user.length < 1)
        return res.status(401).json({ error: 'Usuario no encontrado o se encuentra inactivo.' });
    if (password != user[0].clave)
        return res.status(401).json({ error: 'Credenciales inválidas' });

    req.session.userId = user[0].id;
    req.session.username = user[0].usuario;
    req.session.full_name = user[0].nombres;
    req.session.role = user[0].rol;
    res.json({ message: 'Sesión iniciada' });
});

// /auth/logout
router.delete('/api/logout', (req, res) =>
{
    req.session.destroy();
    res.clearCookie('connect.sid');
    res.json({ message: 'Sesión cerrada' });
});

export default router;