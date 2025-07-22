import express from 'express';
import pool from '../config/database.js';
import { isAuthenticated } from '../middleware/authMiddleware.js';

const router = express.Router();

// Report1: Agents time
router.get('/api/reports/1', isAuthenticated, async (req, res) =>
{
    const { from, to, supervisorGroups, campaign } = req.query;

    try
    {
        const [rows] = await pool.query(`
            SELECT
                s.user AS 'cedula'
                ,vu.full_name AS 'nombre_completo'
                ,IFNULL(ROUND(SUM(s.pause_sec + s.wait_sec + s.talk_sec + s.dispo_sec)/3600, 2),'0') AS 'horas'
                ,ROUND((SUM(s.talk_sec) - SUM(s.dead_sec))/3600, 2) AS 'acd'
                ,ROUND(SUM(s.wait_sec)/3600, 2) AS 'wait'
                ,ROUND(SUM(s.dispo_sec)/3600, 2) AS 'acw'
                ,ROUND(SUM(s.dead_sec)/3600, 2) AS 'dead'
                ,ROUND(SUM(s.pause_sec)/3600, 2) AS 'pauseAux'
                ,ROUND(SUM(IF(s.sub_status='BREAK',s.pause_sec,0))/3600, 2) AS 'break'
                ,ROUND(SUM(IF(s.sub_status='BANO',s.pause_sec,0))/3600, 2) AS 'bano'
                ,ROUND(SUM(IF(s.sub_status='FDBCK',s.pause_sec,0))/3600, 2) AS 'fdbk'
                ,ROUND(SUM(IF(s.sub_status='MANUAL',s.pause_sec,0))/3600, 2) AS 'manual'
                ,ROUND(SUM(IF(s.sub_status='LOGIN',s.pause_sec,0))/3600, 2) AS 'login'
            FROM asterisk.vicidial_agent_log s
            JOIN asterisk.vicidial_users vu ON vu.user = s.user
            WHERE 
                s.event_time BETWEEN ? AND ? + INTERVAL 1 DAY
                ${supervisorGroups == '' ? '' : `AND s.user_group IN (?)`}
                ${campaign == 'all' ? '' : `AND s.campaign_id = ?`}
            GROUP BY s.user
        `, [from, to, supervisorGroups, campaign]);
        res.json({ data: rows });
    }
    catch (error)
    {
        console.error('Error al obtener la etiqueta:', error);
        res.status(500).json({ message: 'Error al obtener la etiqueta' });
    }
});

export default router;