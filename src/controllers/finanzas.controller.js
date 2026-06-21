const pool = require('../config/db');

// Resumen mensual
exports.getResumenMensual = async (req, res) => {
  const { mes, anio } = req.params;
  const [[row]] = await pool.query(
    'SELECT * FROM finanzas WHERE mes=? AND anio=?', [mes, anio]
  );
  res.json(row || null);
};

// Resumen anual
exports.getResumenAnual = async (req, res) => {
  const { anio } = req.params;
  const [[row]] = await pool.query(
    'SELECT * FROM finanzas WHERE mes IS NULL AND anio=?', [anio]
  );
  res.json(row || null);
};

// Todos los meses de un año
exports.getResumenPorAnio = async (req, res) => {
  const { anio } = req.params;
  const [rows] = await pool.query(
    'SELECT * FROM finanzas WHERE mes IS NOT NULL AND anio=? ORDER BY mes',
    [anio]
  );
  res.json(rows);
};

// Registrar costo de inversión manualmente (equipos, filamento, etc)
exports.registrarInversion = async (req, res) => {
  const { mes, anio, costo_inversion } = req.body;
  if (!mes || !anio || costo_inversion === undefined)
    return res.status(400).json({ error: 'Faltan campos requeridos' });

  await pool.query(
    `INSERT INTO finanzas (mes, anio, costo_inversion)
     VALUES (?,?,?)
     ON DUPLICATE KEY UPDATE
       costo_inversion = costo_inversion + ?`,
    [mes, anio, costo_inversion, costo_inversion]
  );
  res.json({ message: 'Inversión registrada' });
};

// Años disponibles
exports.getAnios = async (req, res) => {
  const [rows] = await pool.query(
    'SELECT DISTINCT anio FROM finanzas ORDER BY anio DESC'
  );
  res.json(rows.map(r => r.anio));
};