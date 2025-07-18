import express from 'express';
import pool from '../config/database.js';
import { isAuthenticated } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/api/reports/agentsIndicators', isAuthenticated, async (req, res) =>
{
    const { from, to } = req.body;

    try
    {
        const [rows] = await pool.query(
            'SELECT COUNT(1) FROM asterisk.vicidial_log',
            [req.session.space, id]
        );
        res.json({ data: rows });
    }
    catch (error)
    {
        console.error('Error al obtener la etiqueta:', error);
        res.status(500).json({ message: 'Error al obtener la etiqueta' });
    }
});

export default router;