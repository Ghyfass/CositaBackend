const pool = require('../config/db');

// Ver inventario completo (usa la vista v_productos que ya tiene el stock)
exports.getInventario = async (req, res) => {
  const [rows] = await pool.query(
    'SELECT * FROM v_productos ORDER BY nombre'
  );
  res.json(rows);
};

// Ajustar stock de un producto (sumar o restar)
exports.ajustarStock = async (req, res) => {
  const { cantidad } = req.body;
  const { id } = req.params;

  if (cantidad === undefined)
    return res.status(400).json({ error: 'cantidad es requerida' });

  // Verificar que no quede negativo
  const [[inv]] = await pool.query(
    'SELECT cantidad FROM inventario WHERE id_producto=?', [id]
  );
  if (!inv) return res.status(404).json({ error: 'Producto no encontrado en inventario' });

  const nueva = inv.cantidad + Number(cantidad);
  if (nueva < 0)
    return res.status(400).json({ error: 'El stock no puede quedar negativo' });

  await pool.query(
    'UPDATE inventario SET cantidad=? WHERE id_producto=?',
    [nueva, id]
  );
  res.json({ stock: nueva });
};

// Establecer stock directamente (para correcciones manuales)
exports.setStock = async (req, res) => {
  const { cantidad } = req.body;
  const { id } = req.params;

  if (cantidad === undefined || cantidad < 0)
    return res.status(400).json({ error: 'cantidad inválida' });

  await pool.query(
    'UPDATE inventario SET cantidad=? WHERE id_producto=?',
    [cantidad, id]
  );
  res.json({ stock: cantidad });
};