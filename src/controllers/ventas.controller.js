const pool = require('../config/db');

// Historial mensual general
exports.getVentas = async (req, res) => {
  const { anio } = req.query;
  let query = 'SELECT * FROM v_ventas_por_categoria';
  const params = [];
  if (anio) {
    query += ' WHERE anio = ?';
    params.push(anio);
  }
  const [rows] = await pool.query(query, params);
  res.json(rows);
};

// Ventas por mes específico
exports.getVentasMes = async (req, res) => {
  const { mes, anio } = req.params;
  const [rows] = await pool.query(
    'SELECT * FROM v_ventas_por_categoria WHERE mes=? AND anio=?',
    [mes, anio]
  );
  res.json(rows);
};

// Productos más vendidos
exports.getTopProductos = async (req, res) => {
  const { mes, anio } = req.query;
  let query = `
    SELECT pr.nombre, c.nombre AS categoria,
           SUM(p.cantidad_slot) AS total_vendido,
           SUM(p.total) AS ganancia_total
    FROM pedido p
    JOIN producto pr ON pr.id = p.id_producto
    JOIN categoria c ON c.id = pr.id_categoria
    WHERE p.estado = 'entregado'
  `;
  const params = [];
  if (mes && anio) {
    query += ' AND MONTH(p.fecha_pedido)=? AND YEAR(p.fecha_pedido)=?';
    params.push(mes, anio);
  }
  query += ' GROUP BY pr.id ORDER BY total_vendido DESC LIMIT 10';
  const [rows] = await pool.query(query, params);
  res.json(rows);
};

// Años disponibles en el historial
exports.getAnios = async (req, res) => {
  const [rows] = await pool.query(
    'SELECT DISTINCT anio FROM historial_ventas ORDER BY anio DESC'
  );
  res.json(rows.map(r => r.anio));
};