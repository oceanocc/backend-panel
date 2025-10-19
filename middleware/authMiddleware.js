export const isAuthenticated = (req, res, next) => {
    if (!req.session.userId) return res.status(401).json({ error: 'No autenticado.' });
    next();
  };
export const validateApiKey = (req, res, next) => {
  try
  {
    const apiKey = req.headers['x-api-key']; // La clave se espera en el header 'x-api-key'
    const secretApiKey = process.env.API_KEY_SECRET; // Obtiene la clave secreta del .env

    // Comprueba si la API Key fue proporcionada y si coincide
    if (!apiKey || apiKey !== secretApiKey) {
        return res.status(401).json({ message: 'Acceso no autorizado: API Key inválida o faltante.' });
    }
    // Si la clave es válida, permite que la solicitud continúe
    next();
  }
  catch (error)
  {
    console.error('Error during API key validation:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};